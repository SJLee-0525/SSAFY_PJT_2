from typing import List, Dict

# 시스템 프롬프트
INGREDIENT_SYSTEM_PROMPT = """당신은 요리 재료를 정규화하는 전문가입니다. 
다양한 형태로 표현된 재료명을 가장 기본적인 형태로 변환해주세요.
양 표현, 상태 표현, 크기 표현 등을 제거하고 핵심 재료만 남겨주세요.
예시:
- '감자 2개' → '감자'
- '다진 마늘' → '마늘'
- '소고기(양지)' → '소고기'
- '참기름 약간' → '참기름'
- '대파 2뿌리' → '파'
- '쪽파' → '파'
- '국간장 1큰술' → '간장'
명확한 동의어 관계는 동일 재료로 간주하세요 (예: 대파/쪽파 → 파).
그러나 고추와 청양고추처럼 종류가 다른 재료는 구분해주세요."""

# 단일 재료 정규화 프롬프트
INGREDIENT_USER_PROMPT = """다음 재료명을 기본형으로 정규화해주세요:
'{ingredient}'

정규화된 재료명만 응답하세요. 설명 없이 오직 정규화된 재료명만 제공해주세요."""

# 배치 처리 프롬프트
BATCH_INGREDIENT_USER_PROMPT = """다음 재료명 목록을 각각 기본형으로 정규화해주세요:
{ingredients}

응답은 반드시 순수 JSON 형식으로만 제공해주세요. 마크다운 코드 블록(```)이나 설명 없이 순수 JSON만 응답해야 합니다.
키는 원래 재료명이고 값은 정규화된 재료명입니다.

예시 응답 형식:
{{
  "감자 2개": "감자",
  "다진 마늘": "마늘"
}}"""

# 공격적 정규화 (더 많은 통합)
AGGRESSIVE_SYSTEM_PROMPT = """당신은 요리 재료를 최대한 단순화하여 정규화하는 전문가입니다.
다양한 형태로 표현된 재료명을 가장 기본적이고 포괄적인 카테고리로 통합해주세요.
유사한 종류의 재료는 모두 하나의 대표 재료명으로 적극적으로 통합하세요.

다음 원칙을 반드시 따르세요:
1. 띄어쓰기나 문법적 차이는 완전히 무시하고 같은 재료로 간주하세요 (예: "카레 가루" = "카레가루" = "카레")
2. "가루", "잎", "물" 등의 접미사가 있는 재료는 가능한 기본형으로 통합하세요
3. 유사한 맛과 용도를 가진 재료는 하나로 통합하세요
4. 형태나 상태가 다르더라도 같은 재료면 통합하세요

예시:
- '감자 2개', '감자(큰것)', '감자(중간크기)' → '감자'
- '다진 마늘', '마늘 슬라이스', '통마늘', '깐마늘' → '마늘'
- '소고기(양지)', '소고기(등심)', '한우 앞다리살', '소고기 다짐육' → '소고기'
- '간장', '진간장', '국간장', '양조간장', '맛간장' → '간장'
- '대파', '쪽파', '실파', '파(소)', '산파', '일반파' → '파'
- '청양고추', '홍고추', '풋고추', '꽈리고추', '고추', '태국고추' → '고추'
- '식용유', '포도씨유', '카놀라유', '올리브오일', '해바라기유' → '식용유'
- '된장', '청국장', '쌈장' → '된장'
- '고춧가루', '굵은 고춧가루', '매운 고춧가루' → '고추'
- '쌀', '찹쌀', '멥쌀' → '쌀'
- '밀가루', '박력분', '강력분' → '밀가루'
- '카레 가루', '카레가루', '카레 파우더', '카레' → '카레'
- '토마토 소스', '토마토소스', '토마토페이스트' → '토마토'
- '치킨스톡', '닭육수', '닭 육수' → '닭육수'

재료의 종류가 다소 차이가 있더라도 같은 계열이면 가장 포괄적인 상위 카테고리로 통합하세요.
조리법이나 요리에서 약간의 차이를 만들 수 있는 재료라도 기본적으로 유사한 목적을 가진 재료는 과감하게 통합하세요.
완전히 다른 종류의 기본 재료(예: 닭고기와 소고기)만 구분하고, 그 외에는 최대한 통합하세요."""


def get_ingredient_prompt(ingredient: str, mode: str = "aggressive") -> Dict[str, str]:
    """
    단일 재료에 대한 프롬프트 메시지 생성

    Args:
        ingredient (str): 정규화할 재료명
        mode (str): 정규화 모드 ('normal', 'aggressive')

    Returns:
        List[Dict[str, str]]: 프롬프트 메시지 목록
    """
    system_prompt = INGREDIENT_SYSTEM_PROMPT

    if mode == "aggressive":
        system_prompt = AGGRESSIVE_SYSTEM_PROMPT

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": INGREDIENT_USER_PROMPT.format(
            ingredient=ingredient)}
    ]


def get_batch_ingredient_prompt(
    ingredients: List[str],
    mode: str = "aggressive"
) -> List[Dict[str, str]]:
    """
    여러 재료에 대한 배치 처리 프롬프트 메시지 생성

    Args:
        ingredients (List[str]): 정규화할 재료명 목록
        mode (str): 정규화 모드 ('normal', 'aggressive')

    Returns:
        List[Dict[str, str]]: 프롬프트 메시지 목록
    """
    system_prompt = INGREDIENT_SYSTEM_PROMPT

    if mode == "aggressive":
        system_prompt = AGGRESSIVE_SYSTEM_PROMPT

    ingredients_str = "\n".join([f"- {ingr}" for ingr in ingredients])

    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": BATCH_INGREDIENT_USER_PROMPT.format(
            ingredients=ingredients_str)}
    ]
