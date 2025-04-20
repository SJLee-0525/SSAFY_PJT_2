import asyncio
import re
from googleapiclient.discovery import build
from app.core.config import settings


async def search_youtube_recipe(dish: str, max_results=None) -> list:
    """
    입력: 요리 이름, 최대 결과 수(선택)
    반환: 유튜브 동영상 정보 목록
    기능: 유튜브 레시피를 비동기적으로 검색
"""
    if max_results is None:
        max_results = settings.YOUTUBE_MAX_RESULTS

    # YouTube API는 비동기를 지원하지 않으므로 실행자에서 실행
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(None, lambda: _sync_search_youtube_recipe(dish, max_results))
    return result


def _sync_search_youtube_recipe(dish: str, max_results) -> list:
    """
    입력: 요리 이름, 최대 결과 수
    반환: 유튜브 동영상 정보 목록
    기능: 동기식 YouTube API 호출 수행 (내부 함수)
"""
    youtube = build("youtube", "v3", developerKey=settings.YOUTUBE_API_KEY)
    query = f"{dish} 레시피"

    # 1단계: 검색 API를 사용하여 비디오 ID 가져오기
    search_request = youtube.search().list(
        part="snippet",
        q=query,
        maxResults=max_results,
        type="video",
        videoDuration="medium",        # 중간 길이의 영상만 검색
        videoCaption="closedCaption",  # 자막이 있는 영상만 검색
        fields="items(id/videoId)"     # 비디오 ID만 필요
    )
    search_response = search_request.execute()

    # 검색 결과에서 비디오 ID 추출
    video_ids = [item["id"]["videoId"]
                 for item in search_response.get("items", [])]

    if not video_ids:
        return []

    # 2단계: 비디오 세부 정보 가져오기
    videos_request = youtube.videos().list(
        part="snippet,contentDetails,statistics",
        id=",".join(video_ids)
    )
    videos_response = videos_request.execute()

    results = []
    for item in videos_response.get("items", []):
        video_id = item["id"]
        video_data = {
            "title": item["snippet"]["title"],
            "url": f"https://www.youtube.com/watch?v={video_id}",
            "channel_title": item["snippet"]["channelTitle"],
        }

        # 동영상 길이 처리 (ISO 8601 형식을 사람이 읽기 쉬운 형식으로 변환)
        duration_iso = item["contentDetails"]["duration"]
        # PT1H30M15S 형식을 파싱하여 시:분:초 형태로 변환
        duration = _parse_duration(duration_iso)
        video_data["duration"] = duration

        # 통계 정보 추가
        if "statistics" in item:
            stats = item["statistics"]
            video_data["view_count"] = int(
                stats.get("viewCount", 0)) if "viewCount" in stats else 0
            video_data["like_count"] = int(
                stats.get("likeCount", 0)) if "likeCount" in stats else 0

        results.append(video_data)

    return results


def _parse_duration(duration_iso):
    """
    입력: ISO 8601 형식의 지속 시간 문자열
    반환: 분:초 형식의 영상 길이 문자열
    기능: YouTube API의 ISO 8601 시간 형식을 사용자 친화적인 형식으로 변환
"""
    try:
        # 시간, 분, 초 추출을 위한 정규식 패턴
        hours_pattern = re.compile(r'(\d+)H')
        minutes_pattern = re.compile(r'(\d+)M')
        seconds_pattern = re.compile(r'(\d+)S')

        # 시간, 분, 초 추출
        hours_match = hours_pattern.search(duration_iso)
        minutes_match = minutes_pattern.search(duration_iso)
        seconds_match = seconds_pattern.search(duration_iso)

        hours = int(hours_match.group(1)) if hours_match else 0
        minutes = int(minutes_match.group(1)) if minutes_match else 0
        seconds = int(seconds_match.group(1)) if seconds_match else 0

        # 1시간 넘는 영상 예외처리
        if hours > 0:
            return "1시간 이상"

        # 분:초 형식으로 반환
        return f"{minutes}:{seconds:02d}"
    except:
        # 파싱에 실패한 경우 원래 값 반환
        return "알 수 없음"


async def get_youtube_videos(dish):
    """
    입력: 요리 이름
    반환: 유튜브 동영상 정보 목록
    기능: 요리 이름으로 유튜브 비디오를 검색하여 결과 반환
"""
    videos = await search_youtube_recipe(dish)
    return videos
