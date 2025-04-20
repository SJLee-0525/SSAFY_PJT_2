# app/services/recipe_summary.py
import time
import asyncio
import copy
import re
import json

from typing import Optional
from youtubesearchpython import Transcript
from app.services.LLM.recipe_generator import RequestGPT
from fastapi import HTTPException
from app.utils.prompts.few_shot_low_size import SUMMARY_FEW_SHOT_DATA
# from app.utils.prompts.few_shot import SUMMARY_FEW_SHOT_DATA
from app.utils.prompts.recipe_summary_prompts import SUMMARY_SYSTEM_INPUT, SUMMARY_USER_INPUT, SUMMARY_DESCRIPTION_INPUT
from app.core.config import settings
from app.core.logging_config import logger
from googleapiclient.discovery import build
from app.utils.youtube_change_key import rotate_youtube_api_key


class RecipeSummary:
    def __init__(self):
        self.api_key: str = settings.OPENAI_API_KEY
        if not self.api_key:
            logger.error(
                f"{settings.LOG_SUMMARY_PREFIX}_OPENAI_API_KEY가 설정되지 않았습니다.")
            raise HTTPException(
                status_code=500, detail="OPENAI_API_KEY가 설정되지 않았습니다.")
        # OpenAI 클라이언트 (비동기) 생성 – YoutubeQuery와 유사하게 생성자에서 한 번만 초기화
        self.request_gpt = RequestGPT(self.api_key)

        # 자막 언어 우선순위
        self.priority_lang = ["Korean, English"]

        # 디버그 모드
        self.debug_mode = settings.DEBUG

    def extract_json(self, markdown_output: str) -> dict:
        """ Json Markdown 형태를 추출하여 Dictionary 형태로 변환합니다.

        Args:
            markdown_output(str): Markdown으로 묶여진 String 레시피 데이터

        Returns:
            dict: Markdown이 추출된 Dictionary 레시피 데이터
        """
        # 만약 문자열이 큰따옴표로 감싸져 있다면 unescape 처리합니다.
        if markdown_output.startswith('"') and markdown_output.endswith('"'):
            markdown_output = json.loads(markdown_output)

        # ```json 코드 블록 내부의 JSON 부분 추출
        match = re.search(
            r'```json\s*(\{.*\})\s*```', markdown_output, re.DOTALL)
        if match:
            json_str = match.group(1)
            json_data = json.loads(json_str)
            # 리턴 타입 검사
            assert isinstance(
                json_data, dict), f"Excepted return type of extract_json is dict, but got {type(json_data)}"
            return json_data
        else:
            # 리턴 타입 검사
            json_markdown_output = json.loads(markdown_output)
            assert isinstance(
                json_markdown_output, dict), f"Excepted return type of extract_json is dict, but got {type(json_markdown_output)}"
            return json_markdown_output

    def fetch_and_format_transcript(self, video_id: str, lang) -> Optional[str]:
        """ video id에 대한 영상에서 자막 언어 데이터를 받고 적절한 형태의 자막을 추출하거나 그럴 수 없다면 None을 리턴합니다.

        Args:
            video_id: 비디오 id
            lang: 비디오 자막 언어 데이터

        Returns:
            str: 영상 자막 데이터
        """
        # 인자 언어에 대한 자막 추출
        transcript = Transcript.get(video_id, lang['params'])

        # transcript 데이터를 하나의 문자열로 통합
        scripts = " ".join([f"[{(int(item['startMs']) // 1000)}]" + item["text"].replace(
            "\n", "").replace("\r", "") for item in transcript["segments"] if item["text"] and item["startMs"]])

        # 자막 데이터 유효성 검사: 특정 길이보다 길 때 유효하다고 판단
        if len(scripts) > settings.YOUTUBE_TRANSCRIPT_LEN_TH:
            logger.info(
                f"{settings.LOG_SUMMARY_PREFIX}_자막 언어 : {lang['title']}")
            return scripts
        return None

    def get_transcript(self, video_id: str) -> str:
        """ Transcript 응답을 기반으로 우선 순위가 높은 언어의 자막을 반환합니다.

        Args:
            video_id: 비디오 id

        Returns:
            str: 적절한 자막이 있다면 해당 자막 데이터, 그렇지 않다면 에러 문자열 데이터
        """
        # 영상 자막 데이터 가져오기
        res = Transcript.get(video_id)
        visit_params = set()

        # 우선 순위 1: 작성된 영어, 한국어의 자막 확인
        for lang in res["languages"]:
            if lang['title'] in self.priority_lang:
                visit_params.add(lang['params'])
                script = self.fetch_and_format_transcript(video_id, lang)
                if script:
                    return script
        logger.info(f"{settings.LOG_SUMMARY_PREFIX}_매뉴얼 한국어/영어 자막 없음")

        # 우선 순위 2: 자동 생성된 영어, 한국어의 자막 확인
        for lang in res["languages"]:
            if lang['params'] in visit_params:
                continue

            if 'English' in lang['title'] or 'Korean' in lang['title']:
                visit_params.add(lang['params'])
                script = self.fetch_and_format_transcript(video_id, lang)
                if script:
                    return script
        logger.info(f"{settings.LOG_SUMMARY_PREFIX}_자동 생성 한국어/영어 자막 없음")

        # 우선 순위 3: 아무 자막이나 가져오기
        for lang in res["languages"]:
            if lang['params'] in visit_params:
                continue
            script = self.fetch_and_format_transcript(video_id, lang)
            if script:
                return script
        logger.info(f"{settings.LOG_SUMMARY_PREFIX}_영상 자막 없음")

        return settings.YOUTUBE_TRANSCRIPT_NO_VALID_STR

    def extract_time_in_seconds(self, sequences: list):
        total_seconds = 0
        for seq in sequences:
            hours = minutes = seconds = 0

            # 분수 표현 제거
            seq = re.sub(r'\b\d+\s*분의\s*\d+\b', '', seq)

            # 시간, 분, 초 추출
            hour_match = re.search(r'(\d+)\s*시간', seq)

            # 물결 앞 뒤로 정수 추출
            minute_match = re.search(r'(\d+)(?:~(\d+))?\s*분', seq)
            second_match = re.search(r'(\d+)(?:~(\d+))?\s*초', seq)

            if hour_match:
                hours = int(hour_match.group(1))

            if minute_match:
                minutes = int(minute_match.group(1))
                # 만약 물결이 있다면, 물결 뒤 숫자 활용
                if minute_match.lastindex >= 2:
                    minutes = int(minute_match.group(2))

            if second_match:
                seconds = int(second_match.group(1))
                # 만약 물결이 있다면, 물결 뒤 숫자 활용
                if second_match.lastindex >= 2:
                    seconds = int(second_match.group(2))

            total_seconds += (hours * 3600 + minutes * 60 + seconds)

        return total_seconds

    def preprocess_data(self, data):
        """ GPT API를 통해 출력된 데이터를 Backend에서 활용 가능하도록 정제

        Args:
            data: 레시피 요약 데이터

        Returns:
            dict: 정제된 레시피 요약 데이터 
        """

        # ingredients 변환
        data['ingredients'] = [
            {'name': name, 'quantity': quantity}
            for item in data['ingredients']
            for name, quantity in item.items()
        ]

        # cooking_sequence 변환
        data['cooking_sequence'] = {
            chapter: {
                'sequence': cooking_data[0],
                'timestamp': cooking_data[1],
                'timer': self.extract_time_in_seconds(cooking_data[0])
            }
            for chapter, cooking_data in data['cooking_sequence'].items()
        }

        # 기존 cooking_sequence를 timestamp 기준으로 정렬
        sorted_sequence = dict(
            sorted(
                data['cooking_sequence'].items(),
                # item[1]은 sequence, timestamp data
                key=lambda item: item[1]['timestamp']
            )
        )

        # 정렬된 결과를 다시 할당
        data['cooking_sequence'] = sorted_sequence

        return data

    async def summarize_recipe(
        self,
        video_id: str,
        use_description: bool = True,
        use_few_shot: bool = True,
        use_system_input: bool = True,
    ) -> str:
        """ 주어진 영상 ID를 기반으로 자막을 가져와 OpenAI API로 요약된 레시피를 반환합니다.

        Args:
            video_id(str): 유튜브 비디오 ID

        Returns:
            str: 레시피 요약 데이터
        """
        start = time.time()

        # OpenAI 요청을 위한 기본 메시지 구성
        system_input = None
        if use_system_input:
            system_input = SUMMARY_SYSTEM_INPUT
        user_input = copy.deepcopy(SUMMARY_USER_INPUT)

        # 순서 1 : 유튜브 영상 설명이 있다면 User Input에 반영
        if use_description:
            try:
                description_start = time.time()

                # youtube api 키 라운드 로빈
                await rotate_youtube_api_key()

                # 유튜브 API 객체
                youtube = build("youtube", "v3",
                                developerKey=settings.YOUTUBE_API_KEY)

                # video_id에 해당하는 영상 가져오기
                response = youtube.videos().list(
                    part='snippet',
                    id=video_id
                ).execute()

                # 데이터에서 description만 추출
                video_description = response['items'][0]['snippet']['description']

                # 예외 처리
                # 영상 설명 데이터가 정해놓은 글자 수보다 적다면, 레시피 데이터가 아니라고 가정
                if len(video_description) >= settings.YOUTUBE_DESCRIPTION_LEN_TH:
                    # GPT API 입력 프롬프트에 추가
                    user_input += SUMMARY_DESCRIPTION_INPUT
                    user_input.append(
                        {"role": "user", "content": video_description})
                    logger.info(f"{settings.LOG_SUMMARY_PREFIX}_영상 설명 데이터 추가")
                description_end = time.time()
                logger.info(
                    f"{settings.LOG_SUMMARY_PREFIX}_설명 데이터 추가 소요 시간 : {description_end - description_start:.2f} 초 소요")

            except Exception as e:
                logger.error(
                    f"{settings.LOG_SUMMARY_PREFIX}_유튜브 영상 설명 추가 중 오류: {e}")

        # 순서 2 : Few shot 데이터 적용
        if use_few_shot:
            user_input += SUMMARY_FEW_SHOT_DATA

        # 순서 3 : 자막 스크립트 삽입
        try:
            scripts_start = time.time()
            scripts = self.get_transcript(video_id)
            # 적절하지 않은 자막 추출 시 에러 코드 반환
            if scripts == settings.YOUTUBE_TRANSCRIPT_NO_VALID_STR:
                return settings.SUMMARY_NOT_VALID_TRANSCRIPT_CODE

            user_input.append({"role": "user", "content": ""})
            user_input[-1]["content"] = scripts
            scripts_end = time.time()
            logger.info(
                f"{settings.LOG_SUMMARY_PREFIX}_자막 데이터 추가 소요 시간 : {scripts_end - scripts_start:.2f} 초 소요")
        except Exception as e:
            logger.error(f"{settings.LOG_SUMMARY_PREFIX}_유튜브 자막 추출 오류: {e}")

        # 순서 4 : GPT API를 통해 요약 데이터 추출
        try:
            api_start = time.time()
            # OpenAI API 호출 (RequestGPT.run이 비동기 함수라고 가정)
            summary = await self.request_gpt.run(system_input, user_input)

            api_end = time.time()
            logger.info(
                f"{settings.LOG_SUMMARY_PREFIX}_GPT API 소요 시간 : {api_end - api_start:.2f} 초 소요")

            # 레시피 요약이 아닐 경우를 return messgae 길이로 처리
            if len(summary) < 15:
                return settings.SUMMARY_NOT_COOKCING_VIDEO_CODE
            summary = self.extract_json(summary)
            if type(summary) is str:
                summary = json.loads(summary)

            # 리턴 타입 검사
            assert isinstance(
                summary, dict), f"Excepted return type of RequestGPT.run is dict, but got {type(summary)}"

            if self.debug_mode:
                time_dict = {"exec time cons": f"{end - start:.5f}"}
                summary = summary | time_dict

            summary = self.preprocess_data(summary)

            end = time.time()
            logger.info(
                f"{settings.LOG_SUMMARY_PREFIX}_전체 처리 완료 : {end - start:.2f} 초 소요")

            return summary
        except Exception as e:
            logger.error(f"{settings.LOG_SUMMARY_PREFIX}_요약 API 호출 오류: {e}")
            raise HTTPException(status_code=500, detail="요약 처리 중 오류가 발생했습니다.")


if __name__ == "__main__":
    async def main():
        try:
            recipe_summary = RecipeSummary()
            summary = await recipe_summary.summarize_recipe("gfkgEHsC3qk")
            print(summary)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"요약 처리 중 오류가 발생했습니다: {e}")
    asyncio.run(main())
