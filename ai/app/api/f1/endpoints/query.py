# app/api/f1/endpoints/query.py

from typing import List, Optional
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from app.services.query_maker import QueryMaker
from app.models.ingredients import Ingredients
from app.utils.docs import QueryDocs
from app.core.config import settings

router = APIRouter()
docs = QueryDocs()


@router.post(
    "/",
    summary="레시피 생성 및 검색",
    description="재료 목록을 기반으로 음식 이름을 생성하고 YouTube 레시피 동영상을 검색합니다.",
    response_description="생성된 음식 목록, 동영상 정보 및 실행 시간",
    responses=docs.base["res"],
)
async def query_maker_endpoint(request: Request, data: Ingredients = docs.base["data"]):
    try:
        if settings.ENV != "LOCAL":
            security_key = request.headers.get("x-api-key")
            if security_key != settings.FASTAPI_SECURITY_KEY:
                raise HTTPException(
                    status_code=401, detail="Invalid FASTAPI SECURITY KEY")

        query_maker = QueryMaker(data.ingredients, data.main_ingredients,
                                 data.preferred_ingredients, data.disliked_ingredients,
                                 data.categories, data.dietaries, data.allergies)
        # 비동기로 전체 프로세스 실행
        result = await query_maker.run()
        return JSONResponse(status_code=200, content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail="레시피 생성 중 오류가 발생했습니다.")
