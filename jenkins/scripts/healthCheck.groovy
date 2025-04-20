/**
 * 📦 Jenkins Pipeline Shared Script
 * ----------------------------------
 * 🔧 파일명: healthCheck.groovy
 * ✅ 목적:
 *     - 로그인 API를 호출하여 인증 시스템이 정상 동작하는지 확인
 *     - JWT 토큰을 발급받아 인증이 필요한 실제 API 호출까지 성공 여부 검증
 *
 * ✅ 제공 메소드:
 *     - check(String apiUrl, String username, String password)
 *         ⤷ apiUrl 예시: https://j12s003.p.ssafy.io/master/api
 *
 * ✅ 사용 예시 (Jenkinsfile):
 *     def checker = load 'jenkins/scripts/healthCheck.groovy'
 *     checker.check(env.API_URL, USERNAME, PASSWORD)
 *
 * ✅ 동작 방식:
 *     1. 로그인 API 호출로 토큰 발급
 *     2. 발급받은 토큰으로 인증이 필요한 API 호출 (`/v1/ingredient`)
 *     3. 응답 코드 200 여부 판단
 *
 * ✅ 반환값:
 *     - 없음 (실패 시 error()로 파이프라인 중단)
 *
 * 🛠️ 내부 처리:
 *     - 모든 호출은 my-nginx 컨테이너 내부에서 실행됨 (docker exec)
 *     - curl 응답을 줄 단위로 분리하여 JWT 및 상태코드 추출
 *
 * 📅 작성자: 효재
 */

def check(apiUrl, username, password) {
  // 1. 로그인 요청 → 토큰 추출
  def response = sh(
      script: """
          docker exec my-nginx sh -c '
            curl -s -w "\\n%{http_code}" \\
            -X POST ${apiUrl}/v1/auth/login \\
            -H "Content-Type: application/json" \\
            -d "{\\"username\\": \\"${USERNAME}\\", \\"password\\": \\"${PASSWORD}\\"}"
          '
      """,
      returnStdout: true
  ).trim()

  def lines = response.readLines()
  if (lines.size() < 2) {
    def statusOnly = lines.size() == 1 ? lines[0] : 'unknown'
    error("❌ 로그인 실패 또는 응답 이상 (status=${statusOnly})")
  }

  def jwt = lines[0]
  def status = lines[1]

  if (status != '200') {
    error("❌ 로그인 실패 또는 토큰 이상 (status=${status})")
  }

  // 2. 인증이 필요한 API 호출
  def resCode = sh(
      script: """
          docker exec my-nginx curl -s -o /dev/null -w '%{http_code}' \\
          -H "Authorization: Bearer ${jwt}" \\
          ${apiUrl}/v1/ingredient
      """,
      returnStdout: true
  ).trim()

  if (resCode == '200') {
    echo '✅ 인증된 API 호출 성공!'
  } else {
    error("❌ 인증 API 호출 실패 (응답코드: ${resCode})")
  }
}

return this
