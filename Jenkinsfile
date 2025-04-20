def releaseNotes = ""
def latestCommit = ""
def notify
def envVars = [
  "HOST_URL", "MYSQL_ROOT_PASSWORD", "YOUTUBE_API_KEYS", "OPENAI_API_KEY",
  "USDA_API_KEY", "ELASTIC_PASSWORD", "ALLOWED_ORIGINS", "BRANCH_NAME",
  "X_API", "FASTAPI_SECURITY_KEY", "FASTAPI_PROFILE", "ADMIN_PW", "MATTERMOST_WEBHOOK_URL"
]

pipeline {
    agent any  // 어떤 Jenkins 에이전트에서도 실행 가능

    environment {
        HOST_URL = credentials('HOST_URL')
        MYSQL_ROOT_PASSWORD = credentials('MYSQL_ROOT_PASSWORD')
        ELASTIC_PASSWORD = credentials('ELASTIC_PASSWORD')
        VITE_API_URL = credentials('VITE_API_URL')
        YOUTUBE_API_KEYS = credentials('YOUTUBE_API_KEYS')
        OPENAI_API_KEY = credentials('OPENAI_API_KEY')
        USDA_API_KEY = credentials('USDA_API_KEY')
        ALLOWED_ORIGINS = credentials('ALLOWED_ORIGINS')
        X_API = credentials('X_API')
        FASTAPI_SECURITY_KEY = credentials('FASTAPI_SECURITY_KEY')
        FASTAPI_PROFILE = credentials('FASTAPI_PROFILE')
        ADMIN_PW = credentials('ADMIN_PW')
        MATTERMOST_WEBHOOK_URL = credentials('MATTERMOST_WEBHOOK_URL')
    }

    stages {
        stage('Checkout Code') {
            steps {
                cleanWs()  // Jenkins 작업 공간을 완전히 초기화
                script {
                    // 1. Git checkout
                    git branch: env.BRANCH_NAME, credentialsId: 'my-gitlab-token',
                        url: 'https://lab.ssafy.com/s12-s-project/S12P21S003.git'

                    // 2. Release notes
                    releaseNotes = sh(
                        script: "git log -n 5 --pretty=format:'%h - %s (by %an, %ad)' --date=format:'%Y-%m-%d %H:%M:%S'",
                        returnStdout: true
                    ).trim()

                    // 3. Latest commit
                    latestCommit = sh(
                        script: "git log -1 --pretty=format:'%h - %s (by %an, %ad)' --date=format:'%Y-%m-%d %H:%M:%S'",
                        returnStdout: true
                    ).trim()
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    def viteReleaseApiUrl = "https://j12s003.p.ssafy.io/api"
                    def viteMasterApiUrl = "https://j12s003.p.ssafy.io/master/api"
                    // def baseUrl = env.BRANCH_NAME == "master" ? "/master" : "/"
                    def baseUrl = "/"
                    // env.API_URL = env.BRANCH_NAME == "master" ? viteMasterApiUrl : viteReleaseApiUrl
                    env.API_URL = viteReleaseApiUrl

                    sh """
                    cd ${env.WORKSPACE}/frontend
                    echo "VITE_BASE_URL=${baseUrl}" > .env
                    echo "VITE_API_URL=${env.API_URL}" >> .env
                    echo "VITE_RELEASE_API_URL=${viteReleaseApiUrl}" >> .env
                    echo "VITE_MASTER_API_URL=${viteMasterApiUrl}" >> .env

                    yarn install
                    yarn build

                    rm -rf /front_build/${env.BRANCH_NAME}/html
                    mkdir -p /front_build/${env.BRANCH_NAME}/html
                    cp -r dist/* /front_build/${env.BRANCH_NAME}/html/
                    """
                }
            }
        }

        stage('Build & Start New App Containers') {
            steps {
                script {
                    def exportString = envVars.collect { "${it}='${env[it]}'" }.join(" \\\n")
                    sh """
                    cd ${env.WORKSPACE}
                    ${exportString}
                    cp .env.${env.BRANCH_NAME} .env
                    docker-compose -f docker-compose-app.yml up -d --build
                    """
                }
            }
        }

        stage("nginx restart") {
            steps {
                script {
                    sh """
                    docker exec my-nginx nginx -s reload
                    """
                }
            }
        }

        stage('Wait for Spring Boot to be Ready') {
            steps {
                script {
                    echo "⏳ Spring Boot가 준비될 때까지 대기 중..."
                    def springCheck = load 'jenkins/scripts/springHealthCheck.groovy'
                    springCheck.check(env.API_URL)
                }
            }
        }

        stage("API Health Check via Login") {
            steps {
                script {
                    echo "🔐 withCredentials로 로그인 후 인증 API 확인"
                    def healthCheck = load 'jenkins/scripts/healthCheck.groovy'

                    withCredentials([usernamePassword(
                        credentialsId: 'login-creds',
                        usernameVariable: 'USERNAME',
                        passwordVariable: 'PASSWORD'
                    )]) {
                        healthCheck.check(env.API_URL, USERNAME, PASSWORD)
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                notify = load 'jenkins/scripts/notify.groovy'
            }
            cleanWs()
        }

        success {
            script {
                def durationSec = (currentBuild.duration / 1000).toInteger()
                notify.sendMattermostNotification('SUCCESS', releaseNotes, latestCommit, "${durationSec}초")
            }
        }

        failure {
            script {
                notify.sendMattermostNotification('FAILURE', releaseNotes, latestCommit)
            }
        }
    }
}