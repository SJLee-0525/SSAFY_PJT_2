import asyncio
import re
import openai
from youtubesearchpython import CustomSearch
from app.core.config import settings
from googleapiclient.discovery import build
from typing import List, Dict, Any
from app.core.logging_config import logger

# OpenAI API 키 설정
openai.api_key = settings.OPENAI_API_KEY


async def validate_video_relevance(dish: str, video_title: str, video_description: str = "") -> bool:
    """
    입력:
        - dish: 요리 이름
        - video_title: 유튜브 동영상 제목
        - video_description: 유튜브 동영상 설명 (기본값: 빈 문자열)
    반환:
        - bool: 해당 동영상이 요리 레시피와 관련이 있는지 여부 (True/False)
    기능:
        - OpenAI API를 사용하여 동영상 제목과 설명이 요리 레시피와 관련이 있는지 판단
    """
    system_message = """당신은 요리 비디오 관련성 판단 AI입니다. 
요리 이름과 유튜브 동영상 제목 및 설명을 분석하여 해당 동영상이 그 요리의 레시피 또는 조리법을 다루고 있는지 판단해야 합니다.
응답은 True 또는 False로만 해주세요."""

    user_prompt = f"""요리 이름: {dish}
유튜브 동영상 제목: {video_title}
유튜브 동영상 설명: {video_description}

위 동영상이 "{dish}" 요리의 레시피나 조리법과 관련이 있다면 True, 없다면 False로만 응답하세요."""

    try:
        # 함수를 비동기로 실행하기 위해 run_in_executor 사용
        loop = asyncio.get_running_loop()
        response = await loop.run_in_executor(
            None,
            lambda: openai.chat.completions.create(
                model=settings.YOUTUBE_VALID_OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=10,
                temperature=0.1
            )
        )
        
        result = response.choices[0].message.content.strip().lower()
        # True 또는 False로 변환
        return "true" in result
    except Exception as e:
        logger.error(f"{settings.LOG_QUERY_MAKER_PREFIX}_동영상 관련성 검증 중 오류: {e}")
        # 오류 발생 시 기본값 True 반환 (필터링하지 않음)
        return True


async def filter_videos_by_relevance(dish: str, videos: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    입력:
        - dish: 요리 이름
        - videos: 검색된 동영상 목록
    반환:
        - list: 관련성이 있는 동영상만 필터링한 목록
    기능:
        - 각 동영상의 제목을 기반으로 요리와의 관련성을 검증하고 관련 있는 것만 반환
    """
    if not videos:
        return []
    
    relevant_videos = []
    validation_tasks = []
    
    # 각 비디오별로 검증 작업 생성
    for video in videos:
        task = validate_video_relevance(dish, video.get("title", ""), video.get("description", ""))
        validation_tasks.append((video, task))
    
    # 모든 검증 작업 병렬 실행
    for video, task in validation_tasks:
        try:
            is_relevant = await task
            if is_relevant:
                relevant_videos.append(video)
                logger.info(f"{settings.LOG_QUERY_MAKER_PREFIX}_{dish} 관련 동영상 확인: {video.get('title')}")
            else:
                logger.info(f"{settings.LOG_QUERY_MAKER_PREFIX}_{dish} 무관련 동영상 제외: {video.get('title')}")
        except Exception as e:
            logger.error(f"{settings.LOG_QUERY_MAKER_PREFIX}_동영상 검증 중 오류: {e}")
            # 오류 발생 시 해당 동영상은 포함
            relevant_videos.append(video)
    
    logger.info(f"{settings.LOG_QUERY_MAKER_PREFIX}_{dish} 검색결과: 총 {len(videos)}개 중 {len(relevant_videos)}개 관련 동영상 확인")
    return relevant_videos


async def search_youtube_recipe(dish: str, max_results=None) -> list:
    """
    입력: 요리 이름, 최대 결과 수(선택)
    반환: 유튜브 동영상 정보 목록
    기능: 유튜브 레시피를 비동기적으로 검색
    """
    if max_results is None:
        max_results = settings.YOUTUBE_MAX_RESULTS

    # youtubesearchpython은 비동기를 지원하지 않으므로 실행자에서 실행
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(None, lambda: _sync_search_youtube_recipe(dish, max_results))
    return result


def _sync_search_youtube_recipe(dish: str, max_results) -> list:
    """
    입력: 요리 이름, 최대 결과 수
    반환: 유튜브 동영상 정보 목록
    기능: youtubesearchpython을 사용한 동기식 YouTube 검색 수행
    """
    query = f"{dish} 레시피"

    # VideosSearch 객체 생성 및 검색 수행 (필터링 추가 : 4-20분 자막 포함)
    # videos_search = CustomSearch(query, 'EgYQARgDKAE', limit=max_results)
    videos_search = CustomSearch(query, '', limit=max_results) # 필터 제거
    search_response = videos_search.result()

    if not search_response or 'result' not in search_response:
        return []

    # 비디오 ID 추출
    video_ids = []
    video_info = {}

    for item in search_response['result']:
        # URL에서 비디오 ID 추출
        video_url = item["link"]
        video_id = video_url.split("v=")[-1].split("&")[0]
        video_ids.append(video_id)

        # 기본 정보 저장 - 검색에서 얻을 수 있는 정보만 저장
        video_info[video_id] = {
            "title": item["title"],
            "url": item["link"],
            "channel_title": item["channel"]["name"],
            "duration": item.get("duration", ""),
            "description": item.get("description", "")
        }

    ########################################################################
    # YouTube Data API를 사용하여 상세 통계 정보(조회수, 좋아요 수) 가져오기
    youtube = build("youtube", "v3", developerKey=settings.YOUTUBE_API_KEY)

    # 모든 비디오에 기본 통계값 설정
    for video_id in video_ids:
        if video_id in video_info:
            video_info[video_id]["view_count"] = 0  # 기본값
            video_info[video_id]["like_count"] = 0  # 기본값
            video_info[video_id]["has_caption"] = False  # 기본값

    # API를 통한 통계 정보 추가 시도
    try:
        if video_ids:
            videos_request = youtube.videos().list(
                part="snippet,statistics,contentDetails, status",
                id=",".join(video_ids)
            )
            videos_response = videos_request.execute()

            # 통계 정보 업데이트
            for item in videos_response.get("items", []):
                video_id = item["id"]
                if video_id in video_info:
                    snippet = item.get("snippet", {})
                    stats = item.get("statistics", {})
                    content_details = item.get("contentDetails", {})

                    status_info = item.get("status", {})
                    is_embeddable = status_info.get("embeddable", False)

                    if not is_embeddable:
                        del video_info[video_id]
                        continue

                    video_info[video_id]["title"] = snippet.get(
                        "title", video_info[video_id]["title"])  # API에서 갸져온거로 제목 덮어쓰기
                    video_info[video_id]["description"] = snippet.get(
                        "description", video_info[video_id]["description"])  # API에서 설명 가져오기
                    video_info[video_id]["view_count"] = int(
                        stats.get("viewCount", 0))
                    video_info[video_id]["like_count"] = int(
                        stats.get("likeCount", 0))
                    video_info[video_id]["has_caption"] = bool(
                        content_details.get("caption", "false").lower() == "true")
                    # video_info[video_id]["is_embeddable"] = is_embeddable
                    
    except Exception as e:
        print(f"⚠️ YouTube API 호출 중 오류 발생: {e}")

    # 최종 결과 구성
    results = [video_info[video_id]
               for video_id in video_ids if video_id in video_info]
    
    results.sort(key=lambda x: not x.get("has_caption", False)) # 자막이 있는 영상 우선 
    
    return results


async def get_youtube_videos(dish):
    """
    입력: 요리 이름
    반환: 유튜브 동영상 정보 목록
    기능: 요리 이름으로 유튜브 비디오를 검색하여 결과 반환
    """
    videos = await search_youtube_recipe(dish)
    
    # 검색 결과가 있을 경우, 관련성 검증 수행
    if videos and settings.FILTER_YOUTUBE_VIDEOS:
        logger.info(f"{settings.LOG_QUERY_MAKER_PREFIX}_{dish} 검색결과 관련성 검증 시작")
        videos = await filter_videos_by_relevance(dish, videos)
    
    # 최종 결과에서 description 필드 제거
    for video in videos:
        if "description" in video:
            del video["description"]
    
    return videos
