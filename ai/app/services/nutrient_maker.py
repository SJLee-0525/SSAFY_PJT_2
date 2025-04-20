# app/services/nutrient_maker.py
import openai
import logging
from app.core.config import settings
from app.models.nutrients import NutrientResponse
import httpx  # USDA API 요청을 위한 비동기 HTTP 클라이언트

logger = logging.getLogger(__name__)

class NutrientMaker:
    def __init__(self):
        """ OpenAI API와 USDA API 설정 """
        self.openai_api_key = settings.OPENAI_API_KEY
        self.usda_api_key = settings.USDA_API_KEY
        self.base_url = "https://api.nal.usda.gov/fdc/v1"

        if not self.openai_api_key:
            logger.error("OPENAI_API_KEY가 설정되지 않았습니다.")
            raise ValueError("OPENAI_API_KEY가 필요합니다.")

        # OpenAI API 클라이언트 설정
        self.client = openai.AsyncOpenAI(api_key=self.openai_api_key)

    async def translate_food_name(self, food_name: str) -> tuple:
        """
        한국어 음식명을 영어로 변환하고, 알레르기 정보도 함께 제공 (OpenAI API 호출)
        """
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a food name translator and allergen information provider. Only translate Korean food names into English and also provide allergen information in the format: 'Food Name (Allergen: Info)'. If the input is not a food name, respond with 'INVALID'."},
                    {"role": "user", "content": "Translate the food name '사과' into English and provide allergen information."},
                    {"role": "assistant", "content": "Apple (Allergen: 없음)"},
                    {"role": "user", "content": "Translate the food name '우유' into English and provide allergen information."},
                    {"role": "assistant", "content": "Milk (Allergen: 유제품)"},
                    {"role": "user", "content": f"Translate the food name '{food_name}' into English and provide allergen information."}
                ],
                max_tokens=20,
                temperature=0.2
            )

            translation = response.choices[0].message.content.strip()

            # ✅ 음식이 아닌 경우 예외 처리
            if translation.lower() == "invalid":
                logger.error(f"'{food_name}' is not a valid food name.")
                return None, None  # `INVALID`면 `None` 반환

            # ✅ 음식명과 알레르기 정보 분리
            if "(" in translation and "Allergen:" in translation:
                food_name_en = translation.split(" (Allergen: ")[0].strip()
                allergen_info = translation.split(" (Allergen: ")[1].strip(")")
            else:
                food_name_en = translation
                allergen_info = "Unknown"  # 알레르기 정보가 없으면 기본값 설정

            return food_name_en, allergen_info

        except Exception as e:
            logger.error(f"OpenAI API 요청 실패: {e}")
            return None, None

    async def fetch_fdc_id(self, food_name: str) -> int:
        """
        영어 음식명으로 USDA API에서 fdcId 조회
        """
        search_url = f"{self.base_url}/foods/search?query={food_name}&api_key={self.usda_api_key}&pageSize=1"

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(search_url, timeout=5.0)  # ✅ 5초 타임아웃 추가

                if response.status_code != 200:
                    logger.error(f"USDA API 요청 실패: {response.status_code}")
                    return None

                data = response.json()
                if "foods" in data and len(data["foods"]) > 0:
                    return data["foods"][0]["fdcId"]

            except httpx.ReadTimeout:
                logger.error(f"USDA API 요청 타임아웃: {food_name}")
                return None  # USDA API 응답이 늦으면 None 반환

        return None

    async def fetch_nutrient_info(self, fdc_id: int, allergen_info: str) -> NutrientResponse:
        """
        fdcId를 기반으로 음식의 영양 정보를 조회 (labelNutrients 우선 사용)
        """
        nutrient_url = f"{self.base_url}/food/{fdc_id}?api_key={self.usda_api_key}"

        async with httpx.AsyncClient() as client:
            response = await client.get(nutrient_url, timeout=5.0)

            if response.status_code != 200:
                logger.error(f"USDA API 요청 실패: {response.status_code}")
                return None

            data = response.json()

            # ✅ `labelNutrients`가 있으면 이를 우선 사용
            if data.get("labelNutrients"):
                nutrients = data["labelNutrients"]

                total_fat = nutrients.get("fat", {}).get("value", 0.0)
                saturated_fat = nutrients.get("saturatedFat", {}).get("value", 0.0)
                trans_fat = nutrients.get("transFat", {}).get("value", 0.0)

                return NutrientResponse(
                    calories=nutrients.get("calories", {}).get("value", 0.0),
                    carbohydrate=nutrients.get("carbohydrates", {}).get("value", 0.0),
                    protein=nutrients.get("protein", {}).get("value", 0.0),
                    fat=total_fat,
                    sodium=nutrients.get("sodium", {}).get("value", 0.0),
                    sugars=nutrients.get("sugars", {}).get("value", 0.0),
                    cholesterol=nutrients.get("cholesterol", {}).get("value", 0.0),
                    saturatedFat=saturated_fat,
                    unsaturatedFat=max(total_fat - saturated_fat - trans_fat, 0.0),
                    transFat=trans_fat,
                    allergenInfo=allergen_info  # ✅ LLM이 제공한 알레르기 정보 사용
                )

            nutrients = {item["nutrient"]["name"]: item["amount"] for item in data.get("foodNutrients", [])}

            return NutrientResponse(
                calories=nutrients.get("Energy", 0.0),
                carbohydrate=nutrients.get("Carbohydrate, by difference", 0.0),
                protein=nutrients.get("Protein", 0.0),
                fat=nutrients.get("Total lipid (fat)", 0.0),
                sodium=nutrients.get("Sodium, Na", 0.0),
                sugars=nutrients.get("Total Sugars", 0.0),
                cholesterol=nutrients.get("Cholesterol", 0.0),
                saturatedFat=nutrients.get("Fatty acids, total saturated", 0.0),
                transFat=nutrients.get("Fatty acids, total trans", 0.0),
                unsaturatedFat=max(nutrients.get("Total lipid (fat)", 0.0) - nutrients.get("Fatty acids, total saturated", 0.0) - nutrients.get("Fatty acids, total trans", 0.0), 0.0),
                allergenInfo=allergen_info
            )

    async def run(self, food_name: str) -> NutrientResponse:
        """
        사용자가 입력한 한국어 음식명을 영어로 변환한 후 USDA API에서 영양 정보를 가져오기
        """
        translated_name, allergen_info = await self.translate_food_name(food_name)

        if not translated_name:
            logger.error(f"'{food_name}' is not a valid food name.")
            return NutrientResponse(
                calories=0.0,
                carbohydrate=0.0,
                protein=0.0,
                fat=0.0,
                sodium=0.0,
                sugars=0.0,
                cholesterol=0.0,
                saturatedFat=0.0,
                unsaturatedFat=0.0,
                transFat=0.0,
                allergenInfo="not food"  # ✅ 올바른 음식이 아님을 표시
            )

        fdc_id = await self.fetch_fdc_id(translated_name)

        if not fdc_id:
            logger.error(f"USDA에서 데이터를 찾을 수 없음: {translated_name}")
            return None # 서버 문제로 조회 불가능 한 경우 나중에 재 시도 하도록함

        return await self.fetch_nutrient_info(fdc_id, allergen_info)
