# AI 세무 비서 서비스

## 설치 방법

1. 가상환경 생성 및 활성화
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 또는
.\venv\Scripts\activate  # Windows
```

2. 의존성 설치
```bash
pip install -r requirements.txt
```

3. 서버 실행
```bash
python app.py
```

## AWS 배포 방법

1. EC2 인스턴스 생성
   - Ubuntu 20.04 LTS 사용 권장
   - t2.micro (프리 티어) 또는 필요에 따라 더 큰 인스턴스 선택

2. 필요한 패키지 설치
```bash
sudo apt update
sudo apt install python3-pip python3-venv nginx
```

3. 프로젝트 클론
```bash
git clone https://github.com/your-username/demian-core.git
cd demian-core
```

4. 가상환경 설정 및 의존성 설치
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

5. Nginx 설정
```bash
sudo nano /etc/nginx/sites-available/demian
```

다음 내용 추가:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

6. Nginx 활성화
```bash
sudo ln -s /etc/nginx/sites-available/demian /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

7. Gunicorn으로 서비스 실행
```bash
gunicorn -w 4 -b 127.0.0.1:5000 app:app
```

8. 서비스 자동 시작 설정
```bash
sudo nano /etc/systemd/system/demian.service
```

다음 내용 추가:
```ini
[Unit]
Description=Gunicorn instance to serve demian
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/demian-core
Environment="PATH=/home/ubuntu/demian-core/venv/bin"
ExecStart=/home/ubuntu/demian-core/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 app:app

[Install]
WantedBy=multi-user.target
```

9. 서비스 활성화 및 시작
```bash
sudo systemctl start demian
sudo systemctl enable demian
``` 