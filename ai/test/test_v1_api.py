# test_f1_api.py
import pytest
from httpx import AsyncClient
from httpx._transports.asgi import ASGITransport
from fastapi import FastAPI
from app.api.f1.endpoints import router as f1_router
from app.models.ingredients import Ingredients
import openai

# 모의 객체를 사용하여 OpenAI 호출을 대체하는 Fake 클래스 (필요시)
class FakeResponse:
    def __init__(self, message: str):
        self.choices = [type("Choice", (), {"message": type("Message", (), {"content": message})()})()]

class FakeChatCompletions:
    async def create(self, **kwargs):
        return FakeResponse("테스트 요리")

class FakeChat:
    def __init__(self):
        self.completions = FakeChatCompletions()

class FakeAsyncOpenAI:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.chat = FakeChat()

# FastAPI 앱 생성 및 f1 라우터 포함
app_f1 = FastAPI()
app_f1.include_router(f1_router, prefix="/api/f1")

# f1 Query 엔드포인트 테스트 (POST /api/f1/query/)
@pytest.mark.asyncio
async def test_f1_query_endpoint(monkeypatch):
    # OpenAI API 호출을 FakeAsyncOpenAI로 대체합니다.
    monkeypatch.setattr(openai, "AsyncOpenAI", FakeAsyncOpenAI)

    payload = {
        "items": {"계란": 1, "파": 1},
        "user": "아버지"
    }
    
    # ASGITransport를 사용해 FastAPI 앱을 테스트 대상으로 지정합니다.
    transport = ASGITransport(app=app_f1)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/f1/query/", json=payload)
    
    assert response.status_code == 200
    videos = response.json()
    assert isinstance(videos, list)
    if videos:
        video = videos[0]
        assert "title" in video
        assert "url" in video

# f1 Recipe 엔드포인트 테스트 (GET /api/f1/recipe/)
@pytest.mark.asyncio
async def test_f1_recipe_endpoint():
    transport = ASGITransport(app=app_f1)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/f1/recipe/")
    
    assert response.status_code == 200
    json_data = response.json()
    # recipe.py의 엔드포인트는 "Recipe endpoint" 메시지를 반환합니다.
    assert json_data.get("message") == "Recipe endpoint"
