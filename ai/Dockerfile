# 1️⃣ 공식 FastAPI 기반 Python 이미지 사용
FROM python:3.11-slim

# 2️⃣ 필수 유틸리티 + 빌드 도구 + wheel 관련 툴 설치
RUN apt-get update && apt-get install -y \
    vim \
    curl \
    wget \
    net-tools \
    git \
    build-essential \
    gcc \
    g++ \
    python3-dev \
    python3-wheel \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 3️⃣ pip, setuptools, wheel 최신화
RUN pip install --upgrade pip setuptools wheel

# 4️⃣ requirements.txt 복사 및 설치
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 5️⃣ git 패키지 설치
RUN pip install git+https://github.com/seof622/youtube-search-python

# 6️⃣ 앱 코드 복사 및 타임존 설정
COPY . .
ENV TZ=Asia/Seoul
RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

# 7️⃣ FastAPI 실행
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
