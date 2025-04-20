# app/services/LLM/food_generator.py
import re
import openai
from typing import List, Optional, Union
from app.utils.prompts.recipe_query_prompts import get_chef_prompt, CHEF_SYSTEM_MESSAGE
from app.core.config import settings

# OpenAI API 키 설정
openai.api_key = settings.OPENAI_API_KEY


def _generate_from_prompt(system_message: str, user_prompt: str) -> str:
    """
    입력:
        - system_message: OpenAI에 전달할 시스템 메시지
        - user_prompt: OpenAI에 전달할 사용자 프롬프트
    반환:
        - str: OpenAI로부터 반환된 텍스트 응답
    기능:
        - system_message, user_prompt를 사용해 OpenAI API(chat.completions)를 호출하고,
          생성된 메시지의 content를 문자열로 반환한다.
    """
    response = openai.chat.completions.create(
        model=settings.QUERY_OPENAI_MODEL,
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_prompt}
        ],
        max_tokens=settings.QUERY_OPENAI_MAX_TOKENS,
        temperature=settings.QUERY_OPENAI_TEMPERATURE,
        top_p=settings.QUERY_OPENAI_TOP_P,
        frequency_penalty=settings.QUERY_OPENAI_FREQUENCY_PENALTY
    )
    return response.choices[0].message.content.strip()


def _parse_dish_names(content: str) -> List[str]:
    """
    입력:
        - content: OpenAI로부터 반환된 문자열
    반환:
        - list: 추출된 음식 이름 리스트
    기능:
        - 불릿 포인트('- ') 및 괄호 내 문자 등을 제거한 뒤 줄 단위로 음식 이름을 수집한다.
    """

    # 예외 처리 추가가
    if "NO_VALID_DISHES" in content:
        return []

    non_valid_patterns = [
        "죄송합니다", "죄송하지만", "존재하지 않습니다", "추천할 수 없습니다",
        "추천할 수 있는 요리가 없습니다", "실존하는 요리는 존재하지 않습니다"
    ]

    for pattern in non_valid_patterns:
        if pattern in content:
            return []

    items: List[str] = []
    ignore_prefixes = ["냉장고 재료:", "주재료:", "출력:"]

    for line in content.split('\n'):
        line = line.strip()

        # 무시할 문구 제거
        if any(line.startswith(prefix) for prefix in ignore_prefixes):
            continue
        
        # 불릿('- ') 제거
        if line.startswith('- '):
            line = line[2:]
        # 괄호 내용 제거 및 주석 제거 (예: "- 당근 제외 가능" 제거)
        line = re.sub(r'\s*\(.*?\)', '', line).strip()
        line = re.sub(r'\s*-.*$', '', line).strip()  # 하이픈 이후 주석 제거
        if line:
            items.append(line)
    return items


def generate_dish_names(
    ingredients: List[str] = None,
    main_ingredients: List[str] = None,
    preferred_ingredients: List[str] = None,
    disliked_ingredients: List[str] = None,
    categories: List[str] = None,
    dietaries: List[str] = None,
    allergies: List[str] = None,
    num_dishes: Optional[int] = None
) -> List[str]:
    """
    입력:
        - ingredients: 재료 목록 (기본값 None)
        - main_ingredients: 주재료 (기본값 None)
        - preferred_ingredients: 선호하는 재료 목록 (기본값 None)
        - disliked_ingredients: 비선호하는 재료 목록 (기본값 None)
        - categories: 요리 카테고리 목록 (예: 한식, 양식, 일식 등) (기본값 None)
        - dietaries: 선호 식단 목록 (예: 저염식, 저칼로리, 고단백 등) (기본값 None)
        - allergies: 알러지 목록 (기본값 None)
        - num_dishes: 생성할 요리 이름 개수 (기본값 None)
    반환:
        - list: 생성된 요리 이름 문자열의 리스트
    기능:
        - 재료, 주재료, 선호/비선호 재료, 카테고리, 선호 식단 정보를 바탕으로 프롬프트를 생성하고,
          OpenAI API에 전송해 받은 결과를 파싱해 음식 이름을 추출한다.
    """
    # 타입 변환 및 기본값 설정
    ingredients: List[str] = ingredients or []
    main_ingredients: List[str] = main_ingredients or []
    preferred_ingredients: List[str] = preferred_ingredients or []
    disliked_ingredients: List[str] = disliked_ingredients or []
    categories: List[str] = categories or []
    dietaries: List[str] = dietaries or []
    allergies: List[str] = allergies or []
    num_dishes: Optional[int] = num_dishes or settings.NUM_DISHES_TO_GENERATE

    # 프롬프트 생성
    user_prompt = get_chef_prompt(
        ingredients_list=ingredients,
        main_ingredients=main_ingredients,
        preferred_ingredients=preferred_ingredients,
        disliked_ingredients=disliked_ingredients,
        categories=categories,
        dietaries=dietaries,
        allergies=allergies,
        num_dishes=num_dishes
    )

    # 생성 API 호출
    content = _generate_from_prompt(CHEF_SYSTEM_MESSAGE, user_prompt)

    # 파서를 사용하여 음식 이름 추출
    dish_names = _parse_dish_names(content)

    return dish_names


if __name__ == "__main__":
    # 테스트 코드
    test_dishes = generate_dish_names(
        ingredients=["새우", "오징어", "양파", "마늘", "고추", "파", "식용유"],
        main_ingredients=["새우", "오징어"],
        preferred_ingredients=["마늘"],
        disliked_ingredients=["고추"]
    )
    print("생성된 음식 이름 목록:")
    for i, dish in enumerate(test_dishes, 1):
        print(f"{i}. {dish}")
