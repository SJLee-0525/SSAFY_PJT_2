## FastAPI

### 🛠️ 프로젝트 세팅 방법

1. .env 파일을 작성합니다.

    ``` plaintext
    ALLOWED_ORIGINS=["http://localhost:8080"]
    YOUTUBE_API_KEY=<YOUR_API_KEY>
    OPENAI_API_KEY=<YOUR_API_KEY>
    ```
    YOUTUBE_API_KEY : 구글 클라우드 콘솔에서 Youtube v3 API를 등록한 후 입력합니다.
    OPENAI_API_KEY : openAI 콘솔에서 발급받아 입력합니다.


2. venv를 생성한 후 requirements를 설치합니다.

    ``` sh
    python -m venv venv
    source venv/Scripts/activate
    pip install -r requirements.txt
    ```

3. /ai 디렉토리에서 uvicorn 서버를 실행합니다.

    ``` sh
    uvicorn app.main:app --reload
    ```

### 📦 프로젝트 디렉토리 구조
```plaintext
.
┣━ 📂 app                                   # FastAPI application
┃   ┣━ 📂 api.f1.endpoints                  # Controller 모음
┃   ┃   ┣━ 📜 __init__.py                   # Endpoints 라우팅 설정                 (/api/f1)
┃   ┃   ┣━ 📜 query.py                      # Youtube 레시피 검색 기능 controller     (/query)
┃   ┃   ┗━ 📜 recipe.py                     # 레시피 추출 기능 controller           (/recipe)
┃   ┣━ 📂 core
┃   ┃   ┣━ 📜 __init__.py             
┃   ┃   ┗━ 📜 config.py                     # config 파일 (환경변수, 기타 등등 서버 초기 세팅)
┃   ┣━ 📂 models                            # DTO, req, res 구조 정의
┃   ┃   ┣━ 📜 __init__.py 
┃   ┃   ┗━ 📜 ingredients.py                # 재료 관련 모델 정의
┃   ┣━ 📂 services                          # service 모음
┃   ┃   ┣━ 📂 LLM
┃   ┃   ┃   ┗━ 📜 openai_api.py             # openAI API 설정 
┃   ┃   ┣━ 📜 __init__.py
┃   ┃   ┗━ 📜 recipe_summary.py             # recipe 요약 관련 서비스 모음
┃   ┃   ┗━ 📜 youtube_query.py              # Youtube 검색 관련 서비스 모음
┃   ┣━ 📂 utils                             # utils 모음
┃   ┃   ┣━ 📂 prompts                       # prompt 모음
┃   ┃   ┃   ┣━ 📜 few_shot.py               # 레시피 요약에 사용할 퓨샷 프롬프트
┃   ┃   ┃   ┗━ 📜 user_input_caution.py     # 레시피 요약에 사용할 주의사항 프롬프트
┃   ┃   ┣━ 📜 __init__.py
┃   ┃   ┗━ 📜 docs.py                       # docs 설정 모음
┃   ┗━ 📜 main.py                           # FastAPI 메인 애플리케이션
┃
┣━ 📂 test                                  # 기능 테스트 용 디렉토리
┃   ┗━ 📜 test_v1_api.py                    # test 실행용 python 코드
┣━ 📂 venv                                  # 가상환경 디렉토리
┣━ ⚙️ .env                                  # 환경 변수 설정
┣━ ⚙️ .gitignore                            # gitignore 설정 파일
┣━ ⚙️ pytest.ini                            # python 테스트 용 설정
┣━ 📜 readme.md                             # readme 파일
┗━ 📜 requirements.txt                      # 필요한 패키지 모음
```

### 🔧 Test 방법
/ai 디렉토리에서 터미널에 pytest 입력해 실행


### 📝 Docs 및 기능 테스트
- [FastAPI docs](http://localhost:8000/docs) : swagger 처럼 각 API에 대한 설명을 확인하고 테스트 할 수 있습니다.
- [FastAPI redoc](http://localhost:8000/redoc) : postman 스타일의 대체 API doc을 확인할 수 있습니다.