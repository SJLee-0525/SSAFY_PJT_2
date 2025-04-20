import aiohttp
import asyncio
from bs4 import BeautifulSoup
import random
from collections import Counter
from typing import List

class RecipeCrawler:
    """
    만개의레시피 사이트에서 특정 요리 이름에 대한 레시피를 검색하고,
    레시피 상세 페이지에서 재료를 추출해 통계 정보를 만드는 클래스.
    """
    def __init__(self, max_recipes_per_search=40):
        """
        RecipeCrawler 클래스 초기화.

        Args:
            max_recipes_per_search (int): 검색당 최대 레시피 개수.
        """
        self.max_recipes_per_search = max_recipes_per_search

        # 크롤링/통계 결과를 저장할 변수들
        self.aggregated_stats = Counter()
        self.recipe_stats = {}
        self.total_recipe_count = 0
        self.total_requests = 0

    async def get_recipe_links_async(self, session, search_keyword, max_recipes=3):
        """
        만개의레시피에서 검색어에 해당하는 레시피 링크를 비동기로 가져옵니다.

        Args:
            session (aiohttp.ClientSession): 비동기 HTTP 세션 객체
            search_keyword (str): 검색할 요리 이름
            max_recipes (int): 최대 가져올 레시피 개수 (기본값: 3)

        Returns:
            list: 레시피 상세 페이지 URL 목록
        """
        base_url = "https://www.10000recipe.com/recipe/list.html"
        params = {"q": search_keyword}

        try:
            async with session.get(base_url, params=params) as response:
                if response.status != 200:
                    print(f"[ERROR] 검색 페이지 접근 실패: {response.status}")
                    return []

                html = await response.text()
                soup = BeautifulSoup(html, "html.parser")

                recipe_links = []
                recipe_elements = soup.select("ul.common_sp_list_ul li.common_sp_list_li a.common_sp_link")

                if not recipe_elements:
                    print(f"[ERROR] '{search_keyword}' 검색 결과가 없습니다.")
                    return []

                for idx, recipe in enumerate(recipe_elements):
                    if idx >= max_recipes:
                        break
                    recipe_href = recipe.get("href")
                    detail_url = "https://www.10000recipe.com" + recipe_href
                    recipe_links.append(detail_url)

                return recipe_links
        except Exception as e:
            print(f"[ERROR] 레시피 링크 가져오기 실패: {str(e)}")
            return []

    async def get_ingredients_async(self, session, detail_url):
        """
        레시피 상세 페이지에서 재료 목록을 비동기로 추출합니다.
        여러 HTML 패턴을 확인하여 다양한 페이지 구조에 대응합니다.

        Args:
            session (aiohttp.ClientSession): 비동기 HTTP 세션 객체
            detail_url (str): 레시피 상세 페이지 URL

        Returns:
            list: 추출된 재료명 목록
        """
        max_retries = 3
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

        for retry in range(max_retries):
            try:
                await asyncio.sleep(random.uniform(0.2, 0.8))
                async with session.get(detail_url, headers=headers, timeout=10) as response:
                    if response.status != 200:
                        print(f"[ERROR] 레시피 상세 페이지 접근 실패: {response.status}")
                        return []

                    html = await response.text()
                    soup = BeautifulSoup(html, "html.parser")

                    ingredients = []

                    # 방법 1: cont_ingre2
                    ingre_section = soup.select_one("div.cont_ingre2")
                    if ingre_section:
                        ingredient_tags = ingre_section.select("div.ingre_list_name > a")
                        for tag in ingredient_tags:
                            ingre_text = tag.get_text(strip=True).split('\n')[0].strip()
                            if ingre_text and ingre_text not in ingredients:
                                ingredients.append(ingre_text)

                    # 방법 2: view_ingre
                    if not ingredients:
                        ingre_section = soup.select_one("dl.view_ingre, dl.view3_ingre")
                        if ingre_section:
                            ingredient_tags = ingre_section.select("div.ingre_list_name a, span.name, li")
                            for tag in ingredient_tags:
                                ingre_name = tag.get_text(strip=True)
                                if ingre_name and ingre_name not in ingredients:
                                    ingredients.append(ingre_name)

                    # 방법 3: ready_ingre3
                    if not ingredients:
                        recipe_ingredient = soup.select(".ready_ingre3 ul li")
                        for tag in recipe_ingredient:
                            ingre_name_tag = tag.select_one("span.ingre_name")
                            if ingre_name_tag:
                                ingre_name = ingre_name_tag.get_text(strip=True)
                            else:
                                ingre_name = tag.get_text(strip=True)

                            if ingre_name and ingre_name not in ingredients:
                                ingredients.append(ingre_name)

                    # 방법 4: 폴백
                    if not ingredients:
                        all_ingre_candidates = soup.select("[class*=ingre]")
                        for candidate in all_ingre_candidates:
                            texts = candidate.stripped_strings
                            for text in texts:
                                if len(text) < 15 and text not in ingredients:
                                    ingredients.append(text)

                    return ingredients

            except Exception as e:
                print(f"[ERROR] 재시도 {retry+1}/{max_retries}: {str(e)}")
                await asyncio.sleep(1 * (retry + 1))

        print(f"[ERROR] 최대 재시도 횟수({max_retries}회) 초과")
        return []

    async def process_recipe(self, session, recipe_name):
        """
        하나의 요리 이름에 대한 전체 처리 과정을 비동기로 수행합니다.

        Args:
            session (aiohttp.ClientSession): 비동기 HTTP 세션 객체
            recipe_name (str): 요리 이름

        Returns:
            tuple: (재료 목록, 성공한 레시피 수, 재료별 카운터)
        """
        detail_links = await self.get_recipe_links_async(session, recipe_name, max_recipes=self.max_recipes_per_search)
        if not detail_links:
            return [], 0, Counter()

        semaphore = asyncio.Semaphore(40)

        async def get_with_semaphore(link):
            async with semaphore:
                return await self.get_ingredients_async(session, link)

        tasks = [get_with_semaphore(link) for link in detail_links]
        ingredients_list = await asyncio.gather(*tasks)

        recipe_count = 0
        all_ingredients = []
        recipe_ingredient_counter = Counter()

        for ingredients in ingredients_list:
            if ingredients:
                all_ingredients.extend(ingredients)
                recipe_count += 1
                for ingre in set(ingredients):
                    recipe_ingredient_counter[ingre] += 1

        return all_ingredients, recipe_count, recipe_ingredient_counter

    async def process_recipes(self, recipe_names: List[str]):
        """요리 이름 목록을 직접 받아 처리"""
        async with aiohttp.ClientSession() as session:
            for recipe_name in recipe_names:
                ingredients, recipe_count, recipe_counter = await self.process_recipe(session, recipe_name)
                self.total_requests += self.max_recipes_per_search

                for ingre in recipe_counter:
                    self.aggregated_stats[ingre] += recipe_counter[ingre]

                self.total_recipe_count += recipe_count

                # 레시피별 결과 저장
                self.recipe_stats[recipe_name] = {
                    'requested': self.max_recipes_per_search,
                    'received': recipe_count,
                    'success_rate': f"{(recipe_count/self.max_recipes_per_search)*100:.1f}%",
                    'ingredients': dict(recipe_counter)
                }

        # 결과 직접 반환
        return {
            'summary': {
                'total_requests': self.total_requests,
                'total_success': self.total_recipe_count,
                'success_rate': f"{(self.total_recipe_count/self.total_requests)*100:.1f}%",
                'unique_ingredients': len(self.aggregated_stats)
            },
            'recipe_stats': self.recipe_stats
        }

# 아래는 직접 실행 시 사용 예시 (다른 모듈에서 import해서 사용할 수 있음)
if __name__ == "__main__":
    scraper = RecipeCrawler(max_recipes_per_search=40)
    asyncio.run(scraper.process_recipes(["김치찌개", "된장찌개", "비빔밥"]))
