# app/services/LLM/recipe_generator.py
import json
import asyncio
import openai
from app.core.config import settings
from app.models.prompt_input import UserInput, SystemInput


class RequestGPT:
    def __init__(self, api_key: str):
        self.client = openai.AsyncOpenAI(api_key=api_key)

    def add_system_prompt(self, system_input: SystemInput, prompt: list):
        for input in system_input:
            prompt.append(input)

        return prompt

    async def run(
        self,
        system_input: SystemInput | None,
        user_input: UserInput,
    ) -> dict:
        """ 시스템 입력과 사용자 입력을 받아 OpenAI API를 호출합니다.
        stream이 True이면 스트리밍으로 결과를 출력하고, 그렇지 않으면 전체 응답을 반환합니다.

        Args:
            system_input(SystemInput): 프롬프트의 시스템 입력
            user_input(UserInput): 프롬프트의 유저 입력
        Retruns:
            dict: 레시피 요약 Dictionary 데이터
        """
        # user input은 default로 추가
        prompt = []
        for input in user_input:
            prompt.append(input)

        # system input이 있는 경우에 append
        if system_input:
            self.add_system_prompt(system_input, prompt)

        completion = await self.client.chat.completions.create(
            model=settings.SUMMARY_OPENAI_MODEL,
            messages=prompt,
            max_tokens=settings.SUMMARY_OPENAI_MAX_TOKENS,
            temperature=settings.SUMMARY_OPENAI_TEMPERATURE,
        )

        ret_message = completion.choices[0].message.content
        return ret_message


if __name__ == "__main__":
    async def main():
        api_key = settings.OPENAI_API_KEY
        if not api_key:
            raise Exception("OPENAI_API_KEY가 설정되지 않았습니다.")
        request_gpt = RequestGPT(api_key)

        system_input = [
            {
                "role": "system",
                "content": "너는 식재료만 주어지면 맛있는 음식을 추천해줄 수 있는 백과사전이야."
            }
        ]
        user_input = [
            {
                "role": "system",
                "content": "내가 식재료를 주면 너는 그것을 활용해 만들 수 있는 음식만 텍스트로 전달해주면 돼."
            },
            {
                "role": "system",
                "content": "최대 5개 제공해주고, 글머리 글번호 등 결과값 앞에 아무것도 없도록 전달해줘"
            },
            {
                "role": "user",
                "content": "답변 예시를 하나 줄게 \n 당근 케이크\n 당근 수프\n 당근 라페\n 당근 주스\n 당근 볶음밥\n"
            },
            {
                "role": "user",
                "content": "치즈를 활용한 레시피 추천해줘"
            }
        ]

        result = await request_gpt.run(system_input, user_input)
        print("\n\n요약 결과:")
        print(result)

    asyncio.run(main())
