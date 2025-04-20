# app/api/v1/endpoints/__init__.py

from fastapi import APIRouter
from app.api.f1.endpoints import query, recipe, nutrient

router = APIRouter()

# 검색 관련 엔드포인트를 "/query" 경로로 포함
router.include_router(query.router, prefix="/query", tags=["query"])

# 사용자 관련 엔드포인트를 "/recipe" 경로로 포함
router.include_router(recipe.router, prefix="/recipe", tags=["recipe"])

# 검색 관련 엔드포인트를 "/nutrient" 경로로 포함
router.include_router(nutrient.router, prefix="/nutrient", tags=["nutrient"])