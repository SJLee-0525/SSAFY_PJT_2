/**
 * 📦 Jenkins Pipeline Shared Script
 * ----------------------------------
 * 🔧 파일명: notify.groovy
 * ✅ 목적:
 *     - 빌드 상태(SUCCESS, FAILURE 등)에 따라 Mattermost 채널에 메시지 전송
 *     - 릴리즈 노트, 커밋 정보, 빌드 시간 등을 포함한 통합 알림 제공
 *
 * ✅ 제공 메소드:
 *     - sendMattermostNotification(String status, String releaseNotes, String commit, String duration)
 *         ⤷ status: 빌드 상태 (예: SUCCESS, FAILURE, STARTED)
 *         ⤷ releaseNotes: git 로그 메시지 (줄바꿈 포함 가능)
 *         ⤷ commit: 트리거된 커밋 메시지
 *         ⤷ duration: 빌드 시간 (초 단위)
 *
 * ✅ 사용 예시 (Jenkinsfile):
 *     def notify = load 'jenkins/scripts/notify.groovy'
 *     notify.sendMattermostNotification('SUCCESS', releaseNotes, latestCommit, "23초")
 *
 * ✅ 반환값:
 *     - 없음
 *
 * 🛠️ 내부 처리:
 *     - 메시지 포맷 구성 및 Markdown 형식 알림
 *     - 줄바꿈/인용문을 포함한 릴리즈 노트를 escape 처리 후 전송
 *     - `env.MATTERMOST_WEBHOOK_URL`로 POST 요청
 *
 * 📅 작성자: 효재
 */


def sendMattermostNotification(String status, String releaseNotes = "- No release notes.", String commit = "Unknown", String duration = "측정 불가") {
    def emoji
    def color
    switch (status) {
        case 'STARTED':
            emoji = "🚀"
            break
        case 'SUCCESS':
            emoji = "✅"
            break
        case 'FAILURE':
            emoji = "❌"
            break
        default:
            emoji = "ℹ️"
    }

    def buildUrl = "${env.BUILD_URL}console"
    def timestamp = new Date().format("yyyy-MM-dd HH:mm", TimeZone.getTimeZone('Asia/Seoul'))

    def message = """
## **[${env.BRANCH_NAME}]** 브랜치 - **${env.JOB_NAME}** 빌드 **${status}** ${emoji} (*#${env.BUILD_NUMBER}*)
🔀 트리거 커밋 : **${commit}**
🕒 현재 시각 : **${timestamp}**
⏱️ 빌드 시간 : **${duration}**
🔗 [콘솔 보기](${buildUrl})  
    """.stripIndent().trim()

    def escapedReleaseNotes = escapeJson(releaseNotes)
    def gitGraph = "```\\n${escapedReleaseNotes}\\n```"

    sh """
    curl -X POST -H 'Content-Type: application/json' \\
    -d '{
        "text": "${message}",
        "attachments": [
            {
                "pretext": "### Release Notes📋",
                "text" : "${gitGraph}"
            }
            ]
    }' ${env.MATTERMOST_WEBHOOK_URL}
    """
}

def escapeJson(String s) {
    return s
        .replace("\\", "\\\\")   // 백슬래시 먼저!
        .replace("\"", "\\\"")   // 큰따옴표 이스케이프
        .replace("\r", "")       // 캐리지 리턴 제거
        .replace("\n", "\\n")    // 줄바꿈 이스케이프
}

return this