# app/api/f1/endpoints/nutrient.py
from fastapi import APIRouter, HTTPException
from app.models.nutrients import NutrientRequest, NutrientResponse
from app.services.nutrient_maker import NutrientMaker
import logging
import asyncio

logger = logging.getLogger(__name__)

router = APIRouter()
nutrient_maker = NutrientMaker()  # ✅ 한 번만 생성하여 사용

@router.post(
    "/",
    response_model=NutrientResponse,
    summary="영양성분 추출",
    description="재료 이름을 기반으로 100g 당 영양성분 정보를 반환합니다."
)
async def get_nutrient_info(request: NutrientRequest):
    ingredient = request.ingredient_name.lower()
    
    try:
        # ✅ API 타임아웃 설정 (최대 10초 대기)
        result = await asyncio.wait_for(nutrient_maker.run(ingredient), timeout=10.0)
    except asyncio.TimeoutError:
        logger.error(f"⚠️ 영양 정보 조회 타임아웃: {ingredient}")
        raise HTTPException(status_code=504, detail="요청 시간이 초과되었습니다. 나중에 다시 시도해주세요.")
    
    if result is None:
        logger.warning(f"⚠️ 영양 정보를 찾을 수 없음: {ingredient}")
        raise HTTPException(status_code=404, detail="해당 음식의 영양 정보를 찾을 수 없습니다.")

    return result
