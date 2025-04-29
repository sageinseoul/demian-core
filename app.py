from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

# 간단한 메시지 저장소
messages = []

@app.route('/')
def index():
    return render_template('index.html', messages=messages)

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('message_history', messages)

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('send_message')
def handle_message(data):
    message = {
        'username': data['username'],
        'text': data['text'],
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    messages.append(message)
    emit('new_message', message, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True) 