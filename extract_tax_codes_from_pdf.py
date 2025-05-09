import pdfplumber
import json

PDF_PATH = "learning data/소득세법 시행규칙 별지 제 24호 서식.pdf"
OUTPUT_JSON = "learning data/소득세법_비과세_감면_코드_표.json"

# 5페이지(0-indexed: 4)에서 표 추출
with pdfplumber.open(PDF_PATH) as pdf:
    page = pdf.pages[4]
    tables = page.extract_tables()
    # 표가 여러 개일 수 있으니, 가장 큰 표를 사용
    table = max(tables, key=lambda t: len(t))

# 첫 행은 헤더, 이후 데이터
header = table[0]
rows = table[1:]

# 헤더 예시: ['코드', '항목명', '구분', '한도', '법령']
result = []
for row in rows:
    if not any(row):
        continue
    # 컬럼 개수 보정
    row = [c.strip() if c else '' for c in row]
    if len(row) < 5:
        row += [''] * (5 - len(row))
    if len(row) > 5:
        row = row[:5]
    code, name, type_, limit, law = row
    result.append({
        "code": code,
        "name": name,
        "type": type_,
        "limit": limit,
        "law": law
    })

with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"총 {len(result)}개 코드 추출 완료: {OUTPUT_JSON}") 