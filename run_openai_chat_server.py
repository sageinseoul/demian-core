import logging
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import uvicorn
import openai
import json
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stdout
)
logger = logging.getLogger(__name__)

MEMORY_FILE = "memory.json"
SUMMARY_FILE = "memory_summary.txt"
RECENT_COUNT = 100

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    choices: List[Dict[str, Any]]

def load_memory():
    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def save_memory(memory):
    with open(MEMORY_FILE, "w", encoding="utf-8") as f:
        json.dump(memory, f, ensure_ascii=False, indent=2)

def load_summary():
    if os.path.exists(SUMMARY_FILE):
        with open(SUMMARY_FILE, "r", encoding="utf-8") as f:
            return f.read()
    return ""

def save_summary(summary):
    with open(SUMMARY_FILE, "w", encoding="utf-8") as f:
        f.write(summary)

def summarize_old_messages(old_messages):
    # old_messages: List[dict]
    prompt = "다음은 사용자의 과거 대화입니다. 핵심 정보만 요약해서 기억해줘.\n" + "\n".join([
        f"{m['role']}: {m['content']}" for m in old_messages
    ])
    try:
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "system", "content": "너는 데미안이라는 이름의 세무 AI야. 아래 대화를 핵심 정보만 요약해서 기억해."},
                      {"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.2
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"요약 실패: {str(e)}")
        return "(요약 실패)"

# PDF에서 추출한 최신 비과세/감면 코드 데이터 로드
TAX_CODES = {
    "비과세": [
        {"code": "P01", "description": "복리후생적 성질의 급여"},
        {"code": "P02", "description": "실비변상적 성질의 급여"}
    ]
}  # 기본 데이터로 시작

try:
    with open("learning data/소득세법_비과세_감면_코드_표.json", "r", encoding="utf-8") as f:
        TAX_CODES = json.load(f)
except FileNotFoundError:
    logger.warning("비과세/감면 코드 파일을 찾을 수 없습니다. 기본 데이터를 사용합니다.")
except json.JSONDecodeError:
    logger.warning("비과세/감면 코드 파일 형식이 잘못되었습니다. 기본 데이터를 사용합니다.")

# 우선순위 지침 프롬프트
TAX_PRIORITY_GUIDE = '''
아래 비과세/감면 소득코드 정보는 2025년 3월 개정 국세청 공식 서식(PDF)에서 추출한 최신 기준입니다.
과거에 사용한 JSON, 요약, 예시 등 기존 데이터는 신뢰하지 말고 반드시 이 표의 내용을 우선 적용하세요.
동일 코드가 과거 자료와 다르게 보이면 반드시 이 PDF 기준을 따르세요.
'''

# 시스템 프롬프트 정의
SYSTEM_PROMPT = """너는 데미안이라는 이름의 세무 AI입니다. 
이전 대화 내용을 기억하고 있습니다. 
사용자가 이전 대화를 언급하면, 해당 내용을 기억하고 있다는 것을 인정하고 관련 내용을 참고하여 답변해주세요.
세무 관련 질문에 대해 전문적이고 정확한 답변을 제공하는 것이 주된 임무입니다.
"""

@app.post("/v1/chat/completions")
async def chat_completion(request: ChatRequest):
    try:
        # 대화 기록 처리 방식 변경
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT}
        ]
        
        # 이전 대화 기록을 컨텍스트로 추가
        for msg in request.messages:
            role = msg.role.lower()
            if role == "ai":
                role = "assistant"
            elif role not in ["system", "assistant", "user", "function", "tool", "developer"]:
                role = "user"
            messages.append({"role": role, "content": msg.content})
        
        # 현재 메시지 추가
        messages.append({"role": "user", "content": request.messages[-1].content})

        # 1. 기존 메모리 불러오기 및 저장
        memory = load_memory()
        # 모든 메시지의 role이 'ai'면 'assistant'로 변환
        def fix_role(role):
            if role == 'ai':
                return 'assistant'
            if role not in ['system', 'assistant', 'user', 'function', 'tool', 'developer']:
                return 'user'
            return role
        memory.extend([
            {"role": fix_role(m.role), "content": m.content}
            for m in request.messages if m.content.strip()
        ])
        save_memory(memory)

        # 2. 최근 100개 메시지와 그 이전 메시지 분리
        if len(memory) > RECENT_COUNT:
            old_messages = memory[:-RECENT_COUNT]
            recent_messages = memory[-RECENT_COUNT:]
            # 3. 이전 메시지 요약
            summary = load_summary()
            if not summary or len(old_messages) > len(summary):
                summary = summarize_old_messages(old_messages)
                save_summary(summary)
        else:
            recent_messages = memory
            summary = load_summary()

        # 4. system prompt에 요약 및 최신 소득코드+지침 삽입
        user_query = request.messages[-1].content if request.messages else ""
        trigger = ("소득세" in user_query) and ("비과세" in user_query)
        if trigger:
            tax_code_guide = "\n아래는 2025년 3월 기준 비과세/감면 소득코드 표입니다. 반드시 참고하세요.\n" + json.dumps(TAX_CODES, ensure_ascii=False)
        else:
            tax_code_guide = ""
        
        system_content = (
            "너는 데미안이라는 이름의 세무 AI야. 아래는 사용자의 과거 대화 요약과 2025년 최신 비과세/감면 소득코드 표야. 반드시 참고해서 답변해.\n"
            + TAX_PRIORITY_GUIDE + "\n"
            + (summary if summary else "") + tax_code_guide
        )
        messages[0]["content"] = system_content
        messages_for_api = [{"role": "system", "content": system_content}] + [
            {"role": fix_role(m["role"]), "content": m["content"]} for m in recent_messages
        ]

        logger.info(f"OpenAI ChatGPT-4 API 호출: {request.messages[-1].content}")
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=messages_for_api,
            max_tokens=1000,
            temperature=0.7
        )
        ai_message = response.choices[0].message.content
        # 5. AI 답변도 메모리에 저장
        memory.append({"role": "assistant", "content": ai_message})
        save_memory(memory)
        return ChatResponse(choices=[{
            "message": {
                "role": "assistant",
                "content": ai_message
            }
        }])
    except Exception as e:
        logger.error(f"OpenAI API 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/v1/chat/memory")
async def get_memory():
    memory = load_memory()
    return {"messages": memory[-100:]}

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=4891) 