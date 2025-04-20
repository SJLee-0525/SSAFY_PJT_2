import asyncio
from itertools import cycle
from app.core.config import settings

# 비동기 환경용 락 생성
rotate_lock = asyncio.Lock()
# 애플리케이션 시작 시, 전체 API 키 목록을 순환할 수 있는 cycle iterator 생성
youtube_api_key_cycle = cycle(settings.YOUTUBE_API_KEYS)

async def rotate_youtube_api_key() -> str:
    """
    비동기 환경에서 스레드-세이프하게 API 키를 전환합니다.
    """
    async with rotate_lock:
        next_key = next(youtube_api_key_cycle)
        settings.YOUTUBE_API_KEY = next_key
        return next_key
