# app/main.py

# FastAPI 서버 기본 설정
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.f1 import endpoints
from app.utils.docs import RootDocs

app = None

if settings.ENV == "LOCAL":
    app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)
else:
    app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG,
                  docs_url=None, redoc_url=None, openapi_url=None)

docs = RootDocs()

# CORS 미들웨어 등록
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(endpoints.router, prefix="/api/f1")


@app.get(
    "/",
    summary="서버 연결 테스트",
    description="루트 디렉토리에 접근해 서버가 활성화되어 있는 지 확인합니다.",
    response_description="서버 상태 코드",
    responses=docs.base["res"],
)
async def read_root(request: Request):
    return JSONResponse(status_code=200, content={"message": "Hello, FastAPI!"},)
