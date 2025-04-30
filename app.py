from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from datetime import datetime
from config import config
import os

app = Flask(__name__)
app.config.from_object(config[os.getenv('FLASK_ENV', 'default')])

# JWT 초기화
jwt = JWTManager(app)

# CORS 설정
CORS(app, resources={r"/*": {"origins": app.config['CORS_ORIGINS']}})

socketio = SocketIO(app, cors_allowed_origins=app.config['CORS_ORIGINS'])

# 간단한 메시지 저장소
messages = []

@app.route('/')
def index():
    return render_template('index.html', messages=messages)

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    
    # 실제로는 데이터베이스에서 사용자 인증을 수행해야 합니다
    if username == 'admin' and password == 'password':
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Bad username or password"}), 401

@socketio.on('connect')
@jwt_required()
def handle_connect():
    current_user = get_jwt_identity()
    print(f'Client {current_user} connected')
    emit('message_history', messages)

@socketio.on('disconnect')
@jwt_required()
def handle_disconnect():
    current_user = get_jwt_identity()
    print(f'Client {current_user} disconnected')

@socketio.on('send_message')
@jwt_required()
def handle_message(data):
    current_user = get_jwt_identity()
    message = {
        'username': current_user,
        'text': data['text'],
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    messages.append(message)
    emit('new_message', message, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=app.config['DEBUG']) 