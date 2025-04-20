# 기존 jenkins/jenkins:lts 이미지를 기반으로 함
FROM jenkins/jenkins:lts

# root 사용자로 변경 (Docker 및 Docker Compose 설치 필요)
USER root

# Docker 설치
RUN apt-get update && \
    apt-get install -y docker.io

# Docker Compose 설치
RUN curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-Linux-x86_64" -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

# Node.js, Yarn 설치
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && corepack enable \
    && corepack prepare yarn@4.6.0 --activate

# jenkins 사용자로 다시 변경
USER jenkins
