import json
import re
from collections import defaultdict
import openai
import asyncio
from typing import List, Dict
from test.utils.regularizer_prompts import get_ingredient_prompt, get_batch_ingredient_prompt
from app.core.config import settings

# OpenAI API 키 설정
openai.api_key = settings.OPENAI_API_KEY


class IngredientsRegularizer:
    """
    만개의레시피에서 추출한 재료명을 정규화하는 클래스.
    동일한 재료를 나타내는 다양한 표현을 하나의 표준 형태로 통합합니다.
    """

    def __init__(
        self,
        model: str = "gpt-4o",
        mode: str = "normal"
    ):
        """
        IngredientsRegularizer 클래스 초기화

        Args:
            model (str): 사용할 OpenAI 모델
            mode (str): 정규화 모드 ('normal', 'conservative', 'aggressive')
        """
        self.model = model
        self.mode = mode

        # 캐싱을 위한 딕셔너리
        self.normalized_cache = {}

        # 수동 규칙 정의 (재료명에서 제거할 패턴)
        self.patterns_to_remove = [
            r'\d+\s*ml', r'\d+\s*[lL]', r'\d+\s*g', r'\d+\s*kg', r'\d+\s*개',
            r'\d+\s*큰술', r'\d+\s*작은술', r'\d+\s*컵', r'\d+\s*인분', r'\d+\s*묶음',
            r'\d+\s*알', r'\d+\s*줄기', r'\d+\s*뿌리', r'\d+\s*근',
            r'약간', r'적당량', r'취향껏', r'기호에 따라', r'조금', r'소량',
            r'\([^)]*\)'  # 괄호 안 내용 제거 (예: "소금(천일염)")
        ]

        # 알려진 재료 매핑 (기본값)
        self.common_mappings = {
            '배추김치': '김치',
            '묵은지': '김치',
            '익은 김치': '김치',
            '생수': '물',
            '식용유': '식용유',
            '포도씨유': '식용유',
            '대파': '파',
            '쪽파': '파',
            '국간장': '간장',
            '진간장': '간장',
            '맛소금': '소금',
            '천일염': '소금',
            '설탕': '설탕',
            '흑설탕': '설탕',
            '황설탕': '설탕',
            '후추': '후추',
            '통후추': '후추',
            '검은깨': '깨',
            '흰깨': '깨',
            '떡국떡': '떡',
            '떡볶이떡': '떡',
            # 더 많은 매핑 추가 가능
        }

    def _apply_manual_rules(self, ingredient: str) -> str:
        """
        수동 규칙을 적용하여 기본적인 정규화 수행

        Args:
            ingredient (str): 원본 재료명

        Returns:
            str: 수동 규칙 적용 후 정규화된 재료명
        """
        # 입력값 정리
        normalized = ingredient.strip()

        # 수동 매핑 확인
        if normalized in self.common_mappings:
            return self.common_mappings[normalized]

        # 패턴 제거
        for pattern in self.patterns_to_remove:
            normalized = re.sub(pattern, '', normalized)

        # 여러 공백 제거 및 정리
        normalized = re.sub(r'\s+', ' ', normalized).strip()

        return normalized if normalized else ingredient  # 빈 문자열 방지

    # normalize_with_openai 메서드 수정
    async def normalize_with_openai(self, ingredient: str) -> str:
        """
        OpenAI API를 사용하여 재료명 정규화

        Args:
            ingredient (str): 원본 재료명

        Returns:
            str: 정규화된 재료명
        """
        # 캐시 확인
        if ingredient in self.normalized_cache:
            return self.normalized_cache[ingredient]

        # 먼저 수동 규칙 적용
        pre_normalized = self._apply_manual_rules(ingredient)
        if (pre_normalized != ingredient):
            self.normalized_cache[ingredient] = pre_normalized
            return pre_normalized

        try:
            # 비동기 호출을 위한 클라이언트 생성
            client = openai.AsyncOpenAI(api_key=openai.api_key)

            messages = get_ingredient_prompt(ingredient, self.mode)

            # 비동기 API 호출
            response = await client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.1,  # 일관성을 위해 낮은 온도 설정
                max_tokens=100      # 짧은 응답만 필요
            )

            normalized = response.choices[0].message.content.strip()

            # 불필요한 따옴표나 설명 제거
            normalized = re.sub(r'^["\'"]|["\'"]$', '', normalized)
            normalized = normalized.split('\n')[0].strip()

            # 캐시 저장
            self.normalized_cache[ingredient] = normalized
            return normalized

        except Exception as e:
            print(f"API 호출 오류 ({ingredient}): {str(e)}")
            # 오류 발생 시 원본 반환
            return ingredient

    # batch_normalize_with_openai 메서드도 수정
    async def batch_normalize_with_openai(self, ingredients: List[str], batch_size: int = 20) -> Dict[str, str]:
        """
        여러 재료를 한 번의 API 호출로 일괄 처리

        Args:
            ingredients (list): 정규화할 재료명 목록
            batch_size (int): 배치 크기

        Returns:
            dict: {원본 재료명: 정규화된 재료명} 형태의 매핑
        """
        if not ingredients:
            return {}

        # 배치로 나누기
        batches = [ingredients[i:i+batch_size]
                   for i in range(0, len(ingredients), batch_size)]
        results = {}

        # 비동기 클라이언트 생성
        client = openai.AsyncOpenAI(api_key=openai.api_key)

        for batch in batches:
            # 이미 캐시된 항목 필터링
            uncached = [i for i in batch if i not in self.normalized_cache]

            # 모든 항목이 캐시에 있으면 스킵
            if not uncached:
                results.update({i: self.normalized_cache[i] for i in batch})
                continue

            # 수동 규칙 먼저 적용
            for ingredient in uncached[:]:
                normalized = self._apply_manual_rules(ingredient)
                if normalized != ingredient:
                    self.normalized_cache[ingredient] = normalized
                    uncached.remove(ingredient)

            # 남은 항목이 없으면 다음 배치로
            if not uncached:
                results.update(
                    {i: self.normalized_cache[i] for i in batch if i in self.normalized_cache})
                continue

            # API 호출이 필요한 항목 처리
            ingredients_str = "\n".join([f"- {ingr}" for ingr in uncached])
            try:

                messages = get_batch_ingredient_prompt(uncached, self.mode)

                response = await client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=0.1,
                    max_tokens=1000
                )

                response_text = response.choices[0].message.content.strip()

                try:
                    # JSON 형식 추출 - 코드블록 처리
                    json_pattern = r'```(?:json)?\s*([\s\S]*?)\s*```'
                    match = re.search(json_pattern, response_text)

                    if match:
                        # 코드블록 내부 내용 추출
                        json_content = match.group(1).strip()
                        normalized_map = json.loads(json_content)
                    else:
                        # 코드블록이 없는 경우 그대로 시도
                        normalized_map = json.loads(response_text)

                    # 캐시 업데이트
                    for original, normalized in normalized_map.items():
                        self.normalized_cache[original] = normalized

                except json.JSONDecodeError as json_err:
                    print(f"JSON 파싱 오류: {response_text}")
                    print(f"오류 상세: {str(json_err)}")
                    # 파싱 실패 시 원본 값 사용
                    for ingredient in uncached:
                        self.normalized_cache[ingredient] = ingredient

            except Exception as e:
                print(f"API 호출 오류 (배치): {str(e)}")
                # 오류 시 원본 값 사용
                for ingredient in uncached:
                    self.normalized_cache[ingredient] = ingredient

            # 전체 배치에 대한 결과 수집
            results.update({i: self.normalized_cache.get(i, i) for i in batch})

        return results

    def get_mapping_table(self) -> Dict[str, str]:
        """현재 캐시된 매핑 테이블 반환"""
        return self.normalized_cache

    def update_common_mappings(self, new_mappings: Dict[str, str]) -> None:
        """
        기본 매핑 테이블 업데이트

        Args:
            new_mappings (dict): 추가할 {원본: 정규화} 매핑
        """
        self.common_mappings.update(new_mappings)
        # 캐시도 함께 업데이트
        self.normalized_cache.update(new_mappings)

    async def normalize_data(self, recipe_data: Dict) -> Dict:
        """
        직접 레시피 데이터를 받아 정규화 처리
        
        Args:
            recipe_data: 크롤링된 레시피 데이터
            
        Returns:
            정규화된 결과
        """
        # 전체 재료 빈도 추출 - defaultdict 사용
        aggregated_stats = defaultdict(int)
        for recipe_name, recipe_info in recipe_data.get('recipe_stats', {}).items():
            for ingre, count in recipe_info.get('ingredients', {}).items():
                aggregated_stats[ingre] += count  # KeyError 발생 방지를 위함함
        
        # 재료 목록 추출 및 정규화
        all_ingredients = list(aggregated_stats.keys())
        normalized_map = await self.batch_normalize_with_openai(all_ingredients)
        
        # 정규화된 결과로 통계 집계
        normalized_stats = defaultdict(int)
        for original, count in aggregated_stats.items():
            normalized = normalized_map.get(original, original)
            normalized_stats[normalized] += count
        
        # 결과 반환
        return {
            'summary': {
                'original_ingredients': len(aggregated_stats),
                'normalized_ingredients': len(normalized_stats),
                'reduction_rate': f"{(1 - len(normalized_stats)/len(aggregated_stats))*100:.1f}%"
            },
            'normalized_stats': dict(sorted(normalized_stats.items(), key=lambda x: x[1], reverse=True)),
            'mapping': normalized_map
        }


# 사용 예시
if __name__ == "__main__":
    async def main():
        example_data = {
            'recipe_stats': {
                '김치찌개': {
                    'ingredients': {
                        '김치 1/2포기': 10,
                        '두부 1모': 8,
                        '대파 1뿌리': 7,
                        '고춧가루 1큰술': 5
                    }
                }
            }
        }
        
        regularizer = IngredientsRegularizer(mode="aggressive")
        result = await regularizer.normalize_data(example_data)
        
        print("\n=== 정규화 요약 ===")
        for key, value in result['summary'].items():
            print(f"{key}: {value}")
            
        print("\n=== 정규화된 재료 ===")
        for ing, count in list(result['normalized_stats'].items())[:10]:  # 상위 10개만
            print(f"{ing}: {count}")

    asyncio.run(main())
