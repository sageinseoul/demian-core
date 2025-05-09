from flask import Flask, render_template
from flask_socketio import SocketIO
import os
import requests
from flask import request, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
socketio = SocketIO(app)

# CLOVA OCR API 설정
CLOVA_OCR_APIURL = "https://kr.object.ncloudstorage.com/clova-ocr/prod/general"
CLOVA_OCR_SECRET = os.getenv('CLOVA_OCR_SECRET')
CLOVA_API_KEY = os.getenv('CLOVA_API_KEY')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/ocr/withholding-tax', methods=['POST'])
def process_withholding_tax():
    if 'file' not in request.files:
        return jsonify({'error': '파일이 없습니다'}), 400
    
    file = request.files['file']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': '올바른 파일이 아닙니다'}), 400

    try:
        # CLOVA OCR API 호출
        headers = {
            'X-OCR-SECRET': CLOVA_OCR_SECRET,
            'Content-Type': 'application/json'
        }
        
        payload = {
            'version': 'V2',
            'requestId': 'withholding-tax-request',
            'timestamp': 0,
            'images': [
                {
                    'format': file.filename.split('.')[-1],
                    'data': file.read().decode('base64'),
                    'name': 'withholding-tax'
                }
            ]
        }

        response = requests.post(CLOVA_OCR_APIURL, json=payload, headers=headers)
        ocr_result = response.json()

        # OCR 결과를 원천징수영수증 필드에 매핑
        mapped_data = map_ocr_to_fields(ocr_result)
        
        return jsonify(mapped_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def map_ocr_to_fields(ocr_result):
    """OCR 결과를 원천징수영수증 필드에 매핑하는 함수"""
    mapped_data = {
        'A01': '',  # 신고구분
        'A02': '',  # 귀속연월
        'A03': '',  # 법인명
        'A04': '',  # 사업자등록번호
        'B01': '',  # 근로소득 코드
        'B02': '',  # 근로소득 인원
        'B03': '',  # 근로소득 총지급액
        'B04': '',  # 근로소득 소득세
        'B05': '',  # 근로소득 농어촌특별세
        'B06': '',  # 근로소득 가산세
    }

    # OCR 결과를 분석하여 필드에 매핑
    for image in ocr_result.get('images', []):
        for field in image.get('fields', []):
            name = field.get('name', '')
            text = field.get('inferText', '')
            
            # 필드 이름에 따라 매핑
            if name in mapped_data:
                mapped_data[name] = text

    return mapped_data

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000) 