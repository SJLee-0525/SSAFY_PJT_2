import time
import asyncio
from typing import List, Dict, Optional, Any, Union
from app.services.LLM.food_generator import generate_dish_names
from app.services.external_api.youtube_lib import get_youtube_videos
from app.core.config import settings
from app.utils.youtube_change_key import rotate_youtube_api_key
from app.core.logging_config import logger


class QueryMaker:
    def __init__(self, ingredients: List[str] = None, main_ingredients: List[str] = None,
                 preferred_ingredients: List[str] = None, disliked_ingredients: List[str] = None,
                 categories: List[str] = None, dietaries: List[str] = None, allergies: List[str] = None) -> None:
        """
        QueryMaker 클래스 초기화

        Args:
            ingredients: 사용할 재료 목록
            main_ingredients: 주재료 목록
            preferred_ingredients: 선호하는 재료 목록
            disliked_ingredients: 비선호하는 재료 목록
            categories: 요리 카테고리 목록 (예: 한식, 양식, 일식 등)
            dietaries: 선호 식단 목록 (예: 저염식, 저칼로리, 고단백 등)
            allergies: 알러지 목록 (예: 갑각류 등)
        """
        self.ingredients: List[str] = ingredients or []
        self.main_ingredients: List[str] = main_ingredients or []
        self.preferred_ingredients: List[str] = preferred_ingredients or []
        self.disliked_ingredients: List[str] = disliked_ingredients or []
        self.categories: List[str] = categories or []
        self.dietaries: List[str] = dietaries or []
        self.allergies: List[str] = allergies or []

        self.dishes: List[str] = []
        self.all_videos: Dict[str, List[Dict[str, Any]]] = {}
        self.openai_time: float = 0  # OpenAI API 호출 시간
        self.youtube_time: float = 0  # YouTube API 호출 시간
        self.execution_time: float = 0  # 전체 실행 시간

    async def generate_dishes(self) -> List[str]:
        """
        입력: 없음
        반환: 생성된 음식 이름 목록
        기능: OpenAI API를 사용해 재료에 맞는 요리 이름 생성
        """
        # generate_dish_names가 동기 함수이면 비동기로 변환 필요
        loop = asyncio.get_running_loop()
        logger.info(f"{settings.LOG_QUERY_MAKER_PREFIX}_요리 이름 생성 시작")
        self.dishes = await loop.run_in_executor(None,
                                                 lambda: generate_dish_names(
                                                     self.ingredients,
                                                     self.main_ingredients,
                                                     self.preferred_ingredients,
                                                     self.disliked_ingredients,
                                                     self.categories,
                                                     self.dietaries,
                                                     self.allergies
                                                 ))
        logger.info(
            f"{settings.LOG_QUERY_MAKER_PREFIX}_요리 이름 생성 완료: {len(self.dishes)}개 생성됨")
        return self.dishes

    async def search_recipes(self) -> Dict[str, List[Dict[str, Any]]]:
        """
        입력: 없음
        반환: {요리이름 : 동영상 목록} 형태의 딕셔너리
        기능: YouTube API를 사용해 요리 이름에 맞는 레시피 동영상 검색
        """
        self.all_videos = {}
        dishes_with_videos = []

        # 각 요리별로 비동기 작업 생성
        tasks = []
        for dish in self.dishes:
            task = self.search_recipe_with_timeout(dish)
            tasks.append(task)

        # 모든 작업을 동시에 실행
        try:
            results = await asyncio.gather(*tasks, return_exceptions=True)

            # 결과를 딕셔너리에 저장
            for dish, result in zip(self.dishes, results):
                if isinstance(result, Exception):
                    logger.warning(
                        f"{settings.LOG_QUERY_MAKER_PREFIX}_⚠️ {dish} 검색 중 오류: {result}")
                elif result:
                    # 검색된 동영상이 있는 경우
                    self.all_videos[dish] = result
                    dishes_with_videos.append(dish)
                    logger.info(
                        f"{settings.LOG_QUERY_MAKER_PREFIX}_{dish}: {len(result)}개의 동영상 찾음")
                else:
                    # 검색된 동영상이 없는 경우
                    logger.info(
                        f"{settings.LOG_QUERY_MAKER_PREFIX}_{dish}: 검색 결과 없음")
            # dishes 목록 업데이트. 비디오가 있는 요리만 남김
            self.dishes = dishes_with_videos
        except Exception as e:
            logger.error(
                f"{settings.LOG_QUERY_MAKER_PREFIX}_⚠️ 레시피 검색 중 오류 발생: {e}")
        return self.all_videos

    async def search_recipe_with_timeout(self, dish: str) -> List[Dict[str, Any]]:
        """
        입력: 요리 이름
        반환: 검색된 동영상 목록
        기능: 각 요청에 타임아웃 설정
        """
        try:
            result = await asyncio.wait_for(get_youtube_videos(dish), timeout=10.0)
            logger.debug(f"{settings.LOG_QUERY_MAKER_PREFIX}_{dish} 레시피 검색 완료")
            return result
        except asyncio.TimeoutError:
            logger.warning(
                f"{settings.LOG_QUERY_MAKER_PREFIX}_⚠️ {dish} 검색 타임아웃")
            return []
        except Exception as e:
            logger.error(
                f"{settings.LOG_QUERY_MAKER_PREFIX}_⚠️ {dish} 검색 중 예외 발생: {e}")
            return []

    async def run(self) -> Dict[str, Any]:
        """
        입력: 없음
        반환: 딕셔너리 (요리이름, 동영상, 실행시간 정보)
        기능: 전체 과정 실행(요리 이름 생성, 유튜브 레시피 검색)
        """
        start_time = time.time()
        logger.info(f"{settings.LOG_QUERY_MAKER_PREFIX}_QueryMaker 실행 시작")

        # youtube api 키 라운드 로빈
        await rotate_youtube_api_key()

        # 1단계: 음식 이름 생성
        openai_start = time.time()
        await self.generate_dishes()
        openai_end = time.time()
        self.openai_time = openai_end - openai_start
        logger.info(
            f"{settings.LOG_QUERY_MAKER_PREFIX}_OepnAI 레시피 생성 완료: {self.openai_time:.2f}초 소요")

        # 2단계: YouTube 레시피 검색
        youtube_start = time.time()
        await self.search_recipes()
        youtube_end = time.time()
        self.youtube_time = youtube_end - youtube_start
        logger.info(
            f"{settings.LOG_QUERY_MAKER_PREFIX}_Youtube 레시피 검색 완료: {self.youtube_time:.2f}초 소요")

        end_time = time.time()
        self.execution_time = end_time - start_time
        logger.info(
            f"{settings.LOG_QUERY_MAKER_PREFIX}_전체 처리 완료: {self.execution_time:.2f}초 소요")

        # 통합된 출력 함수 호출
        self.print_results()

        return {
            'dishes': self.dishes,
            'videos': self.all_videos,
        }

    def print_results(self, include_ingredients=False, include_dishes=True,
                      include_recipes=False, include_time=False, include_api_times=False) -> None:
        """
        결과를 통합적으로 출력하는 함수

        Args:
            include_ingredients (bool): 재료 정보 출력 여부
            include_dishes (bool): 생성된 요리 이름 출력 여부
            include_recipes (bool): 검색된 레시피 출력 여부
            include_time (bool): 실행 시간 출력 여부
            include_api_times (bool): API 호출 시간 비교 출력 여부
        """
        # 1. 재료 정보 출력
        if include_ingredients:
            print(f"\n냉장고 재료: {', '.join(self.ingredients)}")

            if self.main_ingredients:
                print(f"주재료: {', '.join(self.main_ingredients)}")
            else:
                print("주재료: 지정되지 않음")

            if self.preferred_ingredients:
                print(f"선호재료: {', '.join(self.preferred_ingredients)}")

            if self.disliked_ingredients:
                print(f"비선호재료: {', '.join(self.disliked_ingredients)}")

        # 2. 생성된 음식 목록 출력
        if include_dishes:
            print("\n생성된 음식 이름 목록:")
            for i, dish in enumerate(self.dishes, 1):
                print(f"{i}. {dish}")

        # 3. 검색된 레시피 정보 출력
        if include_recipes and hasattr(self, 'all_videos'):
            print("\n각 요리별 추천 레시피 동영상:")

            for i, dish in enumerate(self.dishes, 1):
                if dish in self.all_videos and self.all_videos[dish]:
                    first_video = self.all_videos[dish][0]
                    print(f"{i}. {dish}: {first_video['title']}")
                    print(f"   URL: {first_video['url']}")

                    # 추가 정보 표시
                    if 'description' in first_video:
                        desc = first_video['description'][:100] + "..." if len(
                            first_video['description']) > 100 else first_video['description']
                        print(f"   설명: {desc}")

                    if 'channel_title' in first_video:
                        print(f"   채널: {first_video['channel_title']}")

                    if 'duration' in first_video:
                        print(f"   길이: {first_video['duration']}")

                    if 'view_count' in first_video:
                        print(f"   조회수: {first_video['view_count']}")
                else:
                    print(f"{i}. {dish}: 검색 결과 없음")

            # 추가 정보
            total_videos = sum(len(videos)
                               for videos in self.all_videos.values())
            print(
                f"\n총 {len(self.dishes)}개 요리에 대해 {total_videos}개의 레시피 동영상을 찾았습니다.")
            print("각 요리별로 첫 번째 동영상만 표시되었습니다.")

        # 4. API 시간 비교 출력
        if include_api_times and hasattr(self, 'execution_time'):
            print("\n===== API 호출 시간 비교 =====")
            print(
                f"OpenAI API 호출: {self.openai_time:.2f}초 ({self.openai_time/self.execution_time*100:.1f}%)")
            if hasattr(self, 'youtube_time'):
                print(
                    f"YouTube API 호출: {self.youtube_time:.2f}초 ({self.youtube_time/self.execution_time*100:.1f}%)")
                print(f"기타 처리 시간: {(self.execution_time - self.openai_time - self.youtube_time):.2f}초 ({(self.execution_time - self.openai_time - self.youtube_time)/self.execution_time*100:.1f}%)")
            else:
                print(
                    f"기타 처리 시간: {(self.execution_time - self.openai_time):.2f}초 ({(self.execution_time - self.openai_time)/self.execution_time*100:.1f}%)")


##########################################################
# 로컬 테스트 실행 용
if __name__ == "__main__":
    # 테스트 모드 설정: False - 음식 이름 생성만, True - 전체 과정(이름 생성 + 유튜브 검색)
    FULL_TEST_MODE = False  # 테스트 모드 변경을 위한 플래그

    async def test_dish_generation(ingredients: List[str], main_ingredients: Optional[List[str]] = None,
                                   preferred_ingredients: Optional[List[str]] = None,
                                   disliked_ingredients: Optional[List[str]] = None,
                                   categories: Optional[List[str]] = None,
                                   dietaries: Optional[List[str]] = None,
                                   title: str = "") -> List[str]:
        """음식 이름 생성만 테스트하는 간소화된 함수"""
        print(f"\n===== {title} =====")
        print(f"냉장고 재료: {', '.join(ingredients)}")
        print(f"주재료: {', '.join(main_ingredients) if main_ingredients else '지정되지 않음'}")

        if preferred_ingredients:
            print(f"선호재료: {', '.join(preferred_ingredients)}")

        if disliked_ingredients:
            print(f"비선호재료: {', '.join(disliked_ingredients)}")
            
        if categories:
            print(f"요리 카테고리: {', '.join(categories)}")
            
        if dietaries:
            print(f"선호 식단: {', '.join(dietaries)}")

        # QueryMaker 생성
        qm = QueryMaker(ingredients, main_ingredients,
                        preferred_ingredients, disliked_ingredients,
                        categories, dietaries)

        # 음식 이름 생성 시간 측정
        start_time = time.time()
        await qm.generate_dishes()
        end_time = time.time()
        generation_time = end_time - start_time

        # 결과 출력
        print("\n생성된 음식 이름:")
        for i, dish in enumerate(qm.dishes, 1):
            print(f"{i}. {dish}")
        print(f"\n🕒 음식 이름 생성 시간: {generation_time:.2f}초")
        print("-" * 50)

        return qm.dishes

    async def test_full_process(ingredients: List[str], main_ingredients: Optional[List[str]] = None,
                                preferred_ingredients: Optional[List[str]] = None,
                                disliked_ingredients: Optional[List[str]] = None,
                                categories: Optional[List[str]] = None,
                                dietaries: Optional[List[str]] = None,
                                title: str = "") -> None:
        """전체 과정(음식 이름 생성 + 유튜브 검색)을 테스트하는 함수"""
        print(f"\n===== {title} (전체 과정) =====")
        print(f"냉장고 재료: {', '.join(ingredients)}")
        print(f"주재료: {', '.join(main_ingredients) if main_ingredients else '지정되지 않음'}")

        if preferred_ingredients:
            print(f"선호재료: {', '.join(preferred_ingredients)}")

        if disliked_ingredients:
            print(f"비선호재료: {', '.join(disliked_ingredients)}")
            
        if categories:
            print(f"요리 카테고리: {', '.join(categories)}")
            
        if dietaries:
            print(f"선호 식단: {', '.join(dietaries)}")

        # QueryMaker 생성
        qm = QueryMaker(ingredients, main_ingredients,
                        preferred_ingredients, disliked_ingredients,
                        categories, dietaries)

        # 전체 과정 실행
        await qm.run()
        print("-" * 50)

    async def main():
        # 기본 냉장고 재료 (다양한 요리에 활용 가능한 재료들)
        basic_ingredients = ["소고기", "돼지고기", "닭고기", "양파", "당근", "감자", "마늘", "대파", 
                           "양배추", "버섯", "고추", "계란", "우유", "치즈", "쌀", "면", "밀가루", 
                           "소금", "설탕", "간장", "식용유", "버터", "토마토", "오이", "파프리카"]
        
        test_cases = [
            # [재료 리스트, 주재료, 선호재료, 비선호재료, 카테고리, 선호식단, 제목]
            [basic_ingredients, 
             ["소고기", "버섯"], 
             ["양파", "버터"], 
             ["고추"], 
             ["양식"], 
             ["저염식"], 
             "테스트 케이스 1: 소고기 양식 저염식 요리"],

            [basic_ingredients, 
             ["닭고기", "감자"], 
             ["마늘", "양파"], 
             ["고추"], 
             ["한식"], 
             ["고단백"], 
             "테스트 케이스 2: 닭고기 한식 고단백 요리"],

            [basic_ingredients, 
             ["돼지고기", "양배추"], 
             ["대파"], 
             ["당근"], 
             ["중식"], 
             ["저칼로리"], 
             "테스트 케이스 3: 돼지고기 중식 저칼로리 요리"],

            [basic_ingredients, 
             ["소고기", "치즈", "토마토"], 
             ["버터"], 
             ["고추"], 
             ["이탈리아요리"], 
             [], 
             "테스트 케이스 4: 소고기 이탈리아 요리"],

            [basic_ingredients, 
             ["닭고기"], 
             ["계란", "쌀"], 
             ["고추"], 
             ["일식"], 
             ["저탄수화물"], 
             "테스트 케이스 5: 닭고기 일식 저탄수화물 요리"],
             
            [basic_ingredients, 
             ["당근", "양배추", "버섯", "토마토"], 
             ["파프리카"], 
             [], 
             [], 
             ["비건"], 
             "테스트 케이스 6: 채소 위주 비건 요리"],
             
            [basic_ingredients, 
             ["소고기"], 
             ["버섯", "당근"], 
             [], 
             ["프랑스요리"], 
             ["저지방"], 
             "테스트 케이스 7: 소고기 프랑스 저지방 요리"],
             
            [basic_ingredients, 
             ["돼지고기", "계란"], 
             ["대파"], 
             ["유제품"], 
             ["멕시코요리"], 
             [], 
             "테스트 케이스 8: 돼지고기 멕시코 요리 (유제품 제외)"]
        ]

        if FULL_TEST_MODE:
            # 전체 과정 테스트 (이름 생성 + 유튜브 검색)
            for test_case in test_cases:
                if len(test_case) == 7:  # 카테고리/식단까지 포함된 케이스
                    ingredients, main_ingredients, preferred_ingredients, disliked_ingredients, categories, dietaries, title = test_case
                    await test_full_process(ingredients, main_ingredients, preferred_ingredients, disliked_ingredients, categories, dietaries, title)
                elif len(test_case) == 5:  # 선호/비선호 재료만 포함된 케이스
                    ingredients, main_ingredients, preferred_ingredients, disliked_ingredients, title = test_case
                    await test_full_process(ingredients, main_ingredients, preferred_ingredients, disliked_ingredients, None, None, title)
                else:  # 이전 형식의 케이스 (하위 호환성 유지)
                    ingredients, main_ingredients, title = test_case
                    await test_full_process(ingredients, main_ingredients, None, None, None, None, title)
        else:
            # 음식 이름 생성만 테스트
            for test_case in test_cases:
                if len(test_case) == 7:  # 카테고리/식단까지 포함된 케이스
                    ingredients, main_ingredients, preferred_ingredients, disliked_ingredients, categories, dietaries, title = test_case
                    await test_dish_generation(ingredients, main_ingredients, preferred_ingredients, disliked_ingredients, categories, dietaries, title)
                elif len(test_case) == 5:  # 선호/비선호 재료만 포함된 케이스
                    ingredients, main_ingredients, preferred_ingredients, disliked_ingredients, title = test_case
                    await test_dish_generation(ingredients, main_ingredients, preferred_ingredients, disliked_ingredients, None, None, title)
                else:  # 이전 형식의 케이스 (하위 호환성 유지)
                    ingredients, main_ingredients, title = test_case
                    await test_dish_generation(ingredients, main_ingredients, None, None, None, None, title)

    asyncio.run(main())
