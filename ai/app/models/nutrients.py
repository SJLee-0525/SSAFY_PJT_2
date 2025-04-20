# app/models/nutrients.py
from pydantic import BaseModel

# 요청 모델: 클라이언트가 재료 이름을 전송합니다.
class NutrientRequest(BaseModel):
    ingredient_name: str

# 응답 모델: 각 영양소 항목을 포함한 100g 당 영양정보를 반환합니다.
class NutrientResponse(BaseModel):
    calories: float
    carbohydrate: float
    protein: float
    fat: float
    sodium: float
    sugars: float
    cholesterol: float
    saturatedFat: float
    unsaturatedFat: float
    transFat: float
    allergenInfo: str