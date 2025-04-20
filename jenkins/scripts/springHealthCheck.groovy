/**
 * 📦 Jenkins Pipeline Shared Script
 * ----------------------------------
 * 🔧 파일명: springHealthCheck.groovy
 * ✅ 목적:
 *     - Spring Boot 애플리케이션이 정상적으로 기동되었는지 확인
 *     - actuator의 /health endpoint를 반복적으로 조회하여 상태 확인
 *
 * ✅ 제공 메소드:
 *     - check(String apiUrl)
 *         ⤷ apiUrl 예시: https://j12s003.p.ssafy.io/master/api
 *
 * ✅ 사용 예시 (Jenkinsfile):
 *     def checker = load 'jenkins/scripts/springHealthCheck.groovy'
 *     checker.check(env.API_URL)
 *
 * ✅ 동작 방식:
 *     - 최대 5회까지 2초 간격으로 /actuator/health 호출
 *     - 최종 실패 시 error()로 파이프라인 중단
 *
 * ✅ 반환값:
 *     - 없음 (성공 시 통과, 실패 시 중단)
 *
 * 🛠️ 내부 처리:
 *     - curl 요청 시 실패를 허용하기 위해 `|| true` 사용
 *     - JsonSlurper로 응답 파싱하여 `status` 필드 확인
 *
 * 📅 작성자: 효재
 */

def check(apiUrl) {
  def maxRetries = 3
  def delaySeconds = 10

  for (int i = 0; i < maxRetries; i++) {
    def statusCode = sh(
        script: "curl -s -o /dev/null -w '%{http_code}' --connect-timeout 2 ${apiUrl}/actuator/health || true",
        returnStdout: true
    ).trim()

    if (statusCode == '200') {
        echo "✅ Spring Boot is UP!"
        break
    } else {
        echo "⏳ Status: ${statusCode} (attempt ${i + 1}/${maxRetries})"
    }

    sleep delaySeconds

    if (i == maxRetries - 1) {
        error "❌ Spring Boot didn't start in time (${maxRetries * delaySeconds} sec)"
    }
  }
}

return this