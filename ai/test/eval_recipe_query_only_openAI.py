"""
오로지 OpenAI API를 활용해 벤치마크 수행하는 스크립트트
"""
import time
import asyncio
import json
import statistics
from typing import List, Dict, Any, Optional, Tuple
import logging
import openai
import re
from app.services.query_maker import QueryMaker
from app.core.config import settings

# 로깅 설정
logger = logging.getLogger(__name__)


class QueryBenchmark:
    def __init__(self):
        """쿼리 벤치마크 클래스 초기화"""
        self.openai_client = openai.AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY)
        self.test_cases = [
            # [재료 리스트, 주재료 리스트, 케이스 제목]
            [["김치", "두부", "대파", "쌀", "고추장", "된장", "간장", "마늘", "양파", "참기름"],
             [], "테스트 케이스 1: 한식 재료 (주재료 없음)"],

            [["소고기", "감자", "양파", "당근", "토마토", "버터", "올리브오일", "로즈마리", "버섯", "화이트와인"],
             ["소고기"], "테스트 케이스 2: 양식 재료 (주재료: 소고기)"],

            [["새우", "오징어", "양파", "마늘", "고추", "파", "식용유", "밀가루", "달걀", "소금"],
             ["새우", "오징어"], "테스트 케이스 3: 해산물 요리 (주재료: 새우, 오징어)"],

            [["닭고기", "코코넛밀크", "레몬그라스", "생강", "칠리", "바질", "카피르라임잎", "피시소스", "쌀", "콩나물"],
             ["닭고기"], "테스트 케이스 4: 아시안 요리 (주재료: 닭고기)"],

            [["닭고기", "감자", "당근", "양파", "간장"],
             ["닭고기", "감자"], "테스트 케이스 5: 기본 테스트 케이스"],

            [["돼지고기", "양배추", "표고버섯", "청경채", "전분", "오이스터소스", "생강", "마늘", "식용유", "굴소스"],
             ["돼지고기"], "테스트 케이스 6: 중식 재료 (주재료: 돼지고기)"],

            [["파스타면", "토마토", "바질", "마늘", "올리브오일", "파마산치즈", "양파", "페퍼론치노", "소금", "후추"],
             ["파스타면", "토마토"], "테스트 케이스 7: 이탈리안 요리 (주재료: 파스타면, 토마토)"],

            [["두부", "브로콜리", "아보카도", "퀴노아", "렌틸콩", "올리브오일", "시금치", "양파", "당근", "견과류"],
             ["두부", "퀴노아"], "테스트 케이스 8: 채식 요리 (주재료: 두부, 퀴노아)"],

            [["밀가루", "설탕", "버터", "달걀", "우유", "베이킹파우더", "바닐라익스트랙", "초콜릿칩", "딸기", "레몬즙"],
             ["밀가루", "달걀"], "테스트 케이스 9: 베이킹 재료 (주재료: 밀가루, 달걀)"],

            [["토르티야", "아보카도", "할라피뇨", "라임", "토마토", "양파", "고수", "치킨", "검은콩", "옥수수"],
             ["아보카도", "토르티야"], "테스트 케이스 10: 멕시칸 요리 (주재료: 아보카도, 토르티야)"]
        ]
        self.results = {
            "총괄_요약": {},
            "테스트_케이스별_결과": {}
        }

    async def evaluate_dish_accuracy(self, ingredients: List[str], main_ingredients: List[str],
                                     dish_name: str) -> Tuple[float, str]:
        """
        생성된 요리 이름과 입력 재료의 관련성을 평가

        Args:
            ingredients: 전체 재료 목록
            main_ingredients: 주재료 목록
            dish_name: 생성된 요리 이름

        Returns:
            Tuple[float, str]: (정확성 점수 (0-10), 평가 설명)
        """
        prompt = [
            {"role": "system", "content":
                "당신은 요리 전문가로서 주어진 재료와 요리 이름 간의 관련성을 객관적으로 평가합니다. "
                "전통 요리법, 필수 재료, 대체 가능 재료에 대한 전문 지식을 바탕으로 판단하세요."},
            {"role": "user", "content":
                f"다음 재료와 주재료로 '{dish_name}' 요리를 만들 수 있는지 평가해주세요.\n\n"
                f"전체 재료: {', '.join(ingredients)}\n"
                f"주재료: {', '.join(main_ingredients) if main_ingredients else '없음'}\n\n"
                f"요리 이름: {dish_name}\n\n"
                "평가 시 다음 사항을 고려해주세요:\n"
                "1. 주재료는 해당 요리에 반드시 필요한 핵심 재료인지 평가 (가장 중요)\n"
                "2. 소금, 설탕, 간장 등의 기본 양념류는 없어도 감점 요소가 아님\n"
                "3. 해당 요리의 전통적/일반적인 조리법에 필수적인 특수 재료가 있는지 확인\n"
                "4. 전체 재료만으로 요리를 완성하기에 충분한지 평가\n\n"
                "응답 형식은 다음과 같이 제공해주세요:\n"
                "점수: [0-10 사이 숫자]\n"
                "평가: [요리와 재료의 적합성에 대한 간결한 전문가적 평가, 2-3문장]"}
        ]

        try:
            response = await self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=prompt,
                temperature=0.3,
                max_tokens=150
            )
            content = response.choices[0].message.content.strip()

            # 점수와 평가 추출
            score_line = [line for line in content.split(
                '\n') if line.strip().startswith("점수:")][0]
            score = float(re.search(r'점수:\s*(\d+\.?\d*)', score_line).group(1))

            # 평가 부분 추출
            evaluation = ""
            eval_lines = [line for line in content.split(
                '\n') if line.strip().startswith("평가:")]
            if eval_lines:
                evaluation = eval_lines[0].replace("평가:", "").strip()

            return min(max(score, 0), 10), evaluation
        except Exception as e:
            logger.error(f"요리 정확성 평가 중 오류: {e}")
            return 0, f"평가 오류: {str(e)}"

    async def evaluate_video_relevance(self, dish_name: str, video_info: Dict[str, Any]) -> Tuple[float, str]:
        """
        YouTube 동영상과 요리 이름의 관련성을 평가

        Args:
            dish_name: 요리 이름
            video_info: YouTube 동영상 정보

        Returns:
            Tuple[float, str]: (관련성 점수 (0-10), 평가 설명)
        """
        if not video_info:
            return 0, "동영상 정보 없음"

        # 동영상 제목과 설명 추출
        title = video_info.get('title', '')
        description = video_info.get('description', '')[:500]  # 설명은 앞부분만 사용

        prompt = [
            {"role": "system", "content":
                "당신은 요리 영상 컨텐츠 전문가입니다. 요리 레시피 영상이 특정 요리에 관한 것인지 객관적으로 평가합니다."},
            {"role": "user", "content":
                f"다음 요리 이름과 YouTube 동영상의 관련성을 평가해주세요.\n\n"
                f"요리 이름: {dish_name}\n\n"
                f"동영상 제목: {title}\n"
                f"동영상 설명 일부: {description}\n\n"
                "평가 시 다음 사항을 고려해주세요:\n"
                "1. 동영상 제목이 요리 이름을 정확히 언급하는지 (가장 중요)\n"
                "2. 동영상 설명에서 해당 요리 제작 방법을 구체적으로 다루는지\n"
                "3. 동영상이 변형/응용 레시피가 아닌 전통적인 조리법을 보여주는지\n"
                "4. 설명에 사용된 재료와 요리 과정이 명확한지\n\n"
                "응답 형식은 다음과 같이 제공해주세요:\n"
                "점수: [0-10 사이 숫자]\n"
                "평가: [동영상과 요리 관련성에 대한 간결한 전문가적 평가, 2-3문장]"}
        ]

        try:
            response = await self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=prompt,
                temperature=0.3,
                max_tokens=150
            )
            content = response.choices[0].message.content.strip()

            # 점수와 평가 추출
            score_line = [line for line in content.split(
                '\n') if line.strip().startswith("점수:")][0]
            score = float(re.search(r'점수:\s*(\d+\.?\d*)', score_line).group(1))

            # 평가 부분 추출
            evaluation = ""
            eval_lines = [line for line in content.split(
                '\n') if line.strip().startswith("평가:")]
            if eval_lines:
                evaluation = eval_lines[0].replace("평가:", "").strip()

            return min(max(score, 0), 10), evaluation
        except Exception as e:
            logger.error(f"동영상 관련성 평가 중 오류: {e}")
            return 0, f"평가 오류: {str(e)}"

    async def benchmark_test_case(self, ingredients: List[str],
                                  main_ingredients: List[str],
                                  title: str) -> Dict[str, Any]:
        """
        단일 테스트 케이스에 대한 벤치마크 수행

        Args:
            ingredients: 재료 목록
            main_ingredients: 주재료 목록
            title: 테스트 케이스 제목

        Returns:
            Dict: 벤치마크 결과
        """

        # QueryMaker 실행
        qm = QueryMaker(ingredients, main_ingredients)
        start_time = time.time()
        result = await qm.run()
        end_time = time.time()

        # 성능 메트릭
        dishes = result['dishes']
        videos = result['videos']
        execution_time = end_time - start_time

        # 평가 결과 처리
        dish_accuracy_scores = []
        dish_evaluations = []
        video_relevance_scores = []
        video_evaluations = []

        for i, dish in enumerate(dishes):
            # 요리 이름 정확성 평가
            score, evaluation = await self.evaluate_dish_accuracy(ingredients, main_ingredients, dish)
            dish_accuracy_scores.append(score)
            dish_evaluations.append(evaluation)

            # 동영상 관련성 평가
            if dish in videos and videos[dish]:
                score, evaluation = await self.evaluate_video_relevance(dish, videos[dish][0])
                video_relevance_scores.append(score)
                video_evaluations.append(evaluation)
            else:
                video_relevance_scores.append(0)
                video_evaluations.append("동영상 없음")

        # dish_details 구성
        dish_details = []
        for i, dish in enumerate(dishes):
            dish_detail = {
                "요리_이름": dish,
                "재료_관련성_점수": dish_accuracy_scores[i],
                "재료_평가": dish_evaluations[i],
                "동영상_유무": dish in videos and bool(videos[dish]),
                "동영상_관련성_점수": video_relevance_scores[i] if i < len(video_relevance_scores) else 0,
                "동영상_평가": video_evaluations[i] if i < len(video_evaluations) else "평가 없음"
            }
            dish_details.append(dish_detail)

        return {
            "테스트_케이스": title,
            "재료": ingredients,
            "주재료": main_ingredients,
            "생성된_요리_수": len(dishes),
            "동영상_검색된_요리_수": sum(1 for d in dishes if d in videos and videos[d]),
            "실행_시간": {
                "총_실행_시간": execution_time,
                "요리_이름_생성_시간": qm.openai_time,
                "동영상_검색_시간": qm.youtube_time
            },
            "정확성_점수": {
                "평균_재료_관련성": statistics.mean([score for score in dish_accuracy_scores]) if dish_accuracy_scores else 0,
                "평균_동영상_관련성": statistics.mean([score for score in video_relevance_scores if score > 0]) if any(score > 0 for score in video_relevance_scores) else 0
            },
            "요리_세부_평가": dish_details
        }

    # 마크다운 보고서 생성 메소드 추가
    def save_markdown_report(self, save_path: str) -> None:
        """벤치마크 결과를 간결한 마크다운 형식으로 저장"""
        md = []
        summary = self.results["총괄_요약"]

        # 간소화된 헤더
        md.append(f"# 요리 생성 벤치마크 결과")
        md.append(f"실행 일시: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        md.append("")

        # 핵심 성능 지표만 표시 - 간결한 표 형식
        md.append("## 핵심 성능 지표")
        md.append("| 지표 | 값 |")
        md.append("|:-----|----:|")
        md.append(f"| 재료 관련성 점수 | **{summary['평균_재료_관련성_점수']:.2f}/10** |")
        md.append(f"| 동영상 관련성 점수 | **{summary['평균_동영상_관련성_점수']:.2f}/10** |")
        md.append(f"| 평균 실행 시간 | {summary['총_실행_시간']/summary['테스트_케이스_수']:.2f}초 |")
        md.append(f"| 검색 성공률 | {summary['검색된_총_동영상_수']/summary['생성된_총_요리_수']*100:.1f}% |")
        md.append("")

        # 테스트 케이스 요약 - 간소화된 테이블
        md.append("## 테스트 케이스별 결과")
        md.append("| 테스트 케이스 | 재료 관련성 | 동영상 관련성 | 실행 시간(초) |")
        md.append("|:------------|:-----------:|:------------:|:----------:|")

        for title, result in self.results["테스트_케이스별_결과"].items():
            # 테스트 케이스명에서 번호만 추출
            case_name = re.sub(r'테스트 케이스 \d+: ', '', title)
            md.append(
                f"| {case_name} | **{result['정확성_점수']['평균_재료_관련성']:.2f}** | "
                f"**{result['정확성_점수']['평균_동영상_관련성']:.2f}** | "
                f"{result['실행_시간']['총_실행_시간']:.2f} |"
            )
        md.append("")

        # 요리별 세부 결과 - 축약 버전
        md.append("## 생성된 요리 목록")
        md.append("| 테스트 케이스 | 요리 이름 | 재료 관련성 | 동영상 유무 |")
        md.append("|:------------|:---------|:-----------:|:---------:|")

        for title, result in self.results["테스트_케이스별_결과"].items():
            case_name = re.sub(r'테스트 케이스 \d+: ', '', title)
            
            for dish in result["요리_세부_평가"]:
                video_exists = "✓" if dish["동영상_유무"] else "✗"
                md.append(
                    f"| {case_name} | {dish['요리_이름']} | "
                    f"**{dish['재료_관련성_점수']:.1f}** | {video_exists} |"
                )
        md.append("")

        # 파일로 저장
        with open(save_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(md))

    # run_benchmark 함수에 마크다운 옵션 추가
    async def run_benchmark(self, save_json: str = None, save_markdown: str = None) -> Dict[str, Any]:
        """
        전체 벤치마크 실행 및 결과 저장

        Args:
            save_json: JSON 결과 저장 경로 (기본값: None)
            save_markdown: 마크다운 결과 저장 경로 (기본값: None)

        Returns:
            Dict: 벤치마크 결과
        """
        start_time = time.time()

        # 각 테스트 케이스 실행
        case_results = []
        for ingredients, main_ingredients, title in self.test_cases:
            result = await self.benchmark_test_case(ingredients, main_ingredients, title)
            case_results.append(result)
            self.results["테스트_케이스별_결과"][title] = result

        # 총괄 요약 계산
        total_execution_time = time.time() - start_time
        all_dish_accuracy = []
        all_video_relevance = []

        for result in case_results:
            all_dish_accuracy.extend([dish["재료_관련성_점수"]
                                     for dish in result["요리_세부_평가"]])
            all_video_relevance.extend([dish["동영상_관련성_점수"] for dish in result["요리_세부_평가"]
                                        if dish["동영상_관련성_점수"] > 0])

        self.results["총괄_요약"] = {
            "테스트_케이스_수": len(self.test_cases),
            "총_실행_시간": total_execution_time,
            "평균_재료_관련성_점수": statistics.mean(all_dish_accuracy) if all_dish_accuracy else 0,
            "평균_동영상_관련성_점수": statistics.mean(all_video_relevance) if all_video_relevance else 0,
            "생성된_총_요리_수": sum(result["생성된_요리_수"] for result in case_results),
            "검색된_총_동영상_수": sum(result["동영상_검색된_요리_수"] for result in case_results),
        }

        # 결과 출력
        self.print_benchmark_summary()

        # JSON 결과 저장
        if save_json:
            with open(save_json, 'w', encoding='utf-8') as f:
                json.dump(self.results, f, ensure_ascii=False, indent=2)
                print(f"\n벤치마크 결과가 {save_json}에 JSON 형식으로 저장되었습니다.")

        # 마크다운 결과 저장
        if save_markdown:
            self.save_markdown_report(save_markdown)

        return self.results

# 사용 예시
if __name__ == "__main__":
    async def main():
        benchmark = QueryBenchmark()
        # results = await benchmark.run_benchmark(save_json="benchmark_results.json", save_markdown="benchmark_results.md")
        results = await benchmark.run_benchmark(save_markdown="benchmark_results.md")

    asyncio.run(main())
