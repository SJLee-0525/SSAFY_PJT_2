# app/core/config.py
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import validator


class Settings(BaseSettings):
    APP_NAME: str = "FastAPI Server"
    DEBUG: bool = False
    ALLOWED_ORIGINS: List[str]
    YOUTUBE_API_KEY: str = ""
    OPENAI_API_KEY: str
    USDA_API_KEY: str
    ENV: str

    FASTAPI_SECURITY_KEY: str

    YOUTUBE_API_KEYS: List[str]

    @validator("YOUTUBE_API_KEY", pre=True, always=True)
    def set_default_youtube_api_key(cls, v, values):
        if v == "" and "YOUTUBE_API_KEYS" in values and values["YOUTUBE_API_KEYS"]:
            return values["YOUTUBE_API_KEYS"][0]
        return v

    # 할루시네이션 줄이기 위한 파라미터 최적화
    # Query OpenAI 설정
    QUERY_OPENAI_MODEL: str = "gpt-4o"
    QUERY_OPENAI_MAX_TOKENS: int = 200  # 간결한 응답을 위한 적절한 값
    QUERY_OPENAI_TEMPERATURE: float = 0.2  # 재료 목록에 더 충실하도록 낮은 값 설정
    QUERY_OPENAI_TOP_P: float = 0.85      # 상위 확률 토큰 제한
    QUERY_OPENAI_FREQUENCY_PENALTY: float = 0.0  # 중복 방지

    # Summary OpenAI 설정
    SUMMARY_OPENAI_MODEL: str = "gpt-4o"
    SUMMARY_OPENAI_MAX_TOKENS: int = 5000  # 간결한 응답을 위한 적절한 값
    SUMMARY_OPENAI_TEMPERATURE: float = 0.1  # 레시피 요약에 대해서 일관적인 답을 받도록 낮은 값 설정정
    SUMMARY_OPENAI_TOP_P: float = 0.80      # 상위 확률 토큰 제한
    SUMMARY_OPENAI_FREQUENCY_PENALTY: float = 0.1  # 중복 방지

    # Summary Exception Code
    SUMMARY_NOT_VALID_TRANSCRIPT_CODE: int = 430
    SUMMARY_NOT_COOKCING_VIDEO_CODE: int = 432

    # YouTube 설정
    YOUTUBE_MAX_RESULTS: int = 5
    YOUTUBE_DESCRIPTION_LEN_TH: int = 200
    YOUTUBE_TRANSCRIPT_LEN_TH: int = 200
    YOUTUBE_TRANSCRIPT_NO_VALID_STR: str = "NO VALID TRANSCRIPT"

    # YouTube 비디오 필터링 설정 (관련성 검증)
    YOUTUBE_VALID_OPENAI_MODEL: str = "gpt-4o-mini"
    FILTER_YOUTUBE_VIDEOS: bool = True

    # 생성할 음식 이름 개수
    NUM_DISHES_TO_GENERATE: int = 5

    # 로그 파일 관련 설정
    LOG_INTERVAL_UNIT: str = "midnight"
    LOG_INTERVAL: int = 1
    LOG_FILE_BACKUP_COUNT: int = 7
    LOG_ENCODING_METHOD: str = "utf-8"

    # 로그 메시지 관련 설정
    LOG_SUMMARY_PREFIX: str = "SUMMARY"
    LOG_QUERY_MAKER_PREFIX: str = "QUERY_MAKER"

    class Config:
        env_file = ".env"


settings = Settings()
