# app/utils/docs.py
from app.models.ingredients import Ingredients
from app.models.youtube_url import YoutubeURL


class QueryDocs:
    base = {
        "res": {
            200: {
                "description": "레시피 영상 URL 획득 성공",
                "content": {
                    "application/json": {
                        "example": {
                            "dishes": [
                                "불고기",
                                "소고기 볶음밥",
                                "페퍼 스테이크"
                            ],
                            "videos": {
                                "불고기": [
                                    {
                                        "title": "양념 4개면 '소불고기' 끝!",
                                        "url": "https://www.youtube.com/watch?v=nVzwOOJLt24",
                                        "channel_title": "백종원 PAIK JONG WON",
                                        "duration": "11:39",
                                        "view_count": 4643756,
                                        "like_count": 47861
                                    },
                                    {
                                        "title": "글로벌 한식! '소불고기'. 한국의 불고기가 이렇게 맛있습니다. ㅣ 백종원의 백종원 레시피",
                                        "url": "https://www.youtube.com/watch?v=p3IQTouKyH0",
                                        "channel_title": "백종원 PAIK JONG WON",
                                        "duration": "6:31",
                                        "view_count": 1951126,
                                        "like_count": 22504
                                    },
                                    {
                                        "title": "대박집 소불고기 양념 비법 : 4분 투자하고 평생 써먹는 소불고기 황금레시피 Bulgogi",
                                        "url": "https://www.youtube.com/watch?v=gKSbeQXlgsM",
                                        "channel_title": "쿠키키친CookyKitchen",
                                        "duration": "4:23",
                                        "view_count": 308235,
                                        "like_count": 3201
                                    },
                                    {
                                        "title": "명절에 칭찬받는 불고기 맛있게 만드는법✔️ 이 방법은 평생 잊을수없는 양념비율입니다",
                                        "url": "https://www.youtube.com/watch?v=gfr7MZYPieg",
                                        "channel_title": "엄마의손맛",
                                        "duration": "6:24",
                                        "view_count": 198775,
                                        "like_count": 2594
                                    },
                                    {
                                        "title": "Amiyo's Bulgogi [Eng CC]",
                                        "url": "https://www.youtube.com/watch?v=MJAA1CfWbWM",
                                        "channel_title": "육식맨 YOOXICMAN",
                                        "duration": "11:02",
                                        "view_count": 1082702,
                                        "like_count": 14257
                                    }
                                ],
                                "소고기 볶음밥": [
                                    {
                                        "title": "[Lee Yeon Bok official] Pork Fried Rice.",
                                        "url": "https://www.youtube.com/watch?v=Gp3AqI76Fyk",
                                        "channel_title": "이연복의 복주머니",
                                        "duration": "8:27",
                                        "view_count": 1212932,
                                        "like_count": 20968
                                    },
                                    {
                                        "title": "요긴하게 써먹는 볶음밥 비법 4가지 / 이렇게 볶으면 인생 볶음밥 됩니다. fried rice",
                                        "url": "https://www.youtube.com/watch?v=YFL5_RuSpgU",
                                        "channel_title": "이 남자의 cook",
                                        "duration": "4:59",
                                        "view_count": 1913048,
                                        "like_count": 28168
                                    },
                                    {
                                        "title": "불맛 가득 볶음밥을 더 맛있게! 우리집이 볶음밥 맛집! ㅣ업그레이드 볶음밥 ㅣ 백종원의 쿠킹로그",
                                        "url": "https://www.youtube.com/watch?v=NGjk_1KQGmI",
                                        "channel_title": "백종원 PAIK JONG WON",
                                        "duration": "12:05",
                                        "view_count": 2411030,
                                        "like_count": 22985
                                    },
                                    {
                                        "title": "#32 소고기볶음밥 샤이니밀 ASMR /영양 가득한 하루한끼 /내 몸 튼튼 요리/소고기는 늘 옳아!",
                                        "url": "https://www.youtube.com/watch?v=DJTM_SQZunc",
                                        "channel_title": "샤이니밀 ASMR Shinymeal",
                                        "duration": "7:55",
                                        "view_count": 397,
                                        "like_count": 5
                                    },
                                    {
                                        "title": "소고기 볶음밥 이렇게 먹으면 맛있어요. 지치는 날 힘이되는 레시피 💪🏻 | 비프페퍼라이스.",
                                        "url": "https://www.youtube.com/watch?v=JmDCxiQbb8Q",
                                        "channel_title": "요리하루YoriHaru",
                                        "duration": "5:21",
                                        "view_count": 1000,
                                        "like_count": 20
                                    }
                                ],
                                "페퍼 스테이크": [
                                    {
                                        "title": "(ENG SUB) Baking Soda Tenderized Black Pepper Beef - Inexpensive Cut Became So Tender",
                                        "url": "https://www.youtube.com/watch?v=CWXPUpr_iHw",
                                        "channel_title": "더 프로키친 [The Prokitchen]",
                                        "duration": "11:47",
                                        "view_count": 46059,
                                        "like_count": 989
                                    },
                                    {
                                        "title": "16,000원 저렴한 안심으로 완벽한 스테이크요리법 ! 요리를 못해도! 스테이크굽는법 알려드립니다.",
                                        "url": "https://www.youtube.com/watch?v=YgZ3KknE_0A",
                                        "channel_title": "쉽쿡",
                                        "duration": "4:58",
                                        "view_count": 455,
                                        "like_count": 14
                                    },
                                    {
                                        "title": "Mongolian Beef : PF Chang's Style 🇨🇳🇲🇳🇺🇸 [Eng CC]",
                                        "url": "https://www.youtube.com/watch?v=c5it8ttzJuY",
                                        "channel_title": "육식맨 YOOXICMAN",
                                        "duration": "8:07",
                                        "view_count": 1060774,
                                        "like_count": 15606
                                    },
                                    {
                                        "title": "[Lee Yeon Bok official] Mongolian Beef",
                                        "url": "https://www.youtube.com/watch?v=IvKib6LZ7XM",
                                        "channel_title": "이연복의 복주머니",
                                        "duration": "10:08",
                                        "view_count": 994635,
                                        "like_count": 20854
                                    },
                                    {
                                        "title": "[ENG]2 Kind of steak sauce can make 10 mins & 3 kind of duck breast steak!",
                                        "url": "https://www.youtube.com/watch?v=avu1q_UEkkc",
                                        "channel_title": "Cooka 쿠카",
                                        "duration": "12:41",
                                        "view_count": 6394,
                                        "like_count": 99
                                    }
                                ]
                            }
                        }
                    }
                },
            },
            400: {"description": "잘못된 요청"}
        },
        "data": Ingredients(ingredients=["소고기", "계란", "파", "마늘", "양파"], main_ingredients=["소고기", "파"], preferred_ingredients=["소고기"], disliked_ingredients=["계란"]),

    }


class RecipeDocs:
    base = {
        "res": {
            200: {
                "description": "텍스트 레시피 추출 성공",
                "content": {
                    "application/json": {
                        "example": {
                            "title": "소시지 김치볶음밥",
                            "cooking_info": {
                                "cooking_time": "15",
                                "kcal": 500
                            },
                            "ingredients": [
                                "소시지 2개(65g)",
                                "김치 1컵(160g)",
                                "즉석밥 1개",
                                "파 1/2컵(40g)",
                                "식용유 3큰술(20g)",
                                "설탕 1/3큰술(3g)",
                                "간장 1/2큰술(5g)",
                                "고운 고춧가루 1/3큰술(3g)",
                                "가루 참깨 약간",
                                "계란 1개",
                                "김가루 약간"
                            ],
                            "cooking_tools": [
                                "후라이팬",
                                "도마",
                                "칼",
                                "가위",
                                "숟가락",
                                "절구"
                            ],
                            "cooking_tips": [
                                "김치는 신맛이 나는 것을 사용하세요.",
                                "김치의 물기를 잘 짜내고 사용하세요.",
                                "즉석밥은 봉지에서 바로 사용하세요.",
                                "파를 기름에 우려내어 향을 더하세요.",
                                "김치가 물기가 많으면 물을 추가하지 않아도 됩니다."
                            ],
                            "cooking_sequence": {
                                "재료 손질": [
                                    "소시지를 얇게 썰고, 파를 반으로 썰어 다집니다.",
                                    "김치는 가위로 잘라 준비합니다."
                                ],
                                "팬 예열": [
                                    "팬에 식용유(3큰술)를 두르고 중불에서 예열합니다."
                                ],
                                "파와 소시지 볶기": [
                                    "파를 넣고 기름에 우려낸 후 소시지를 넣고 노릇노릇해질 때까지 볶습니다."
                                ],
                                "양념 추가": [
                                    "설탕(1/3큰술)과 간장(1/2큰술)을 넣고 볶습니다."
                                ],
                                "김치 넣기": [
                                    "김치를 넣고 잘 섞어줍니다."
                                ],
                                "밥 넣기": [
                                    "즉석밥을 넣고 잘 부수어가며 재료와 섞습니다."
                                ],
                                "마무리": [
                                    "불을 끄고 참깨와 김가루를 뿌립니다.",
                                    "계란후라이를 만들어 김치볶음밥 위에 올립니다."
                                ],
                                "완성 및 서빙": [
                                    "김치볶음밥을 그릇에 담고 계란후라이와 함께 서빙합니다."
                                ]
                            }
                        }
                    }
                },
            },
            400: {"description": "잘못된 요청"}
        },
        "data": YoutubeURL(youtube_url="https://www.youtube.com/watch?v=eIo2BaE6LxI")
    }


class RootDocs:
    base = {
        "res": {
            200: {
                "description": "서버 활성화",
                "content": {
                    "application/json": {
                        "example": {
                            "message": "Hello, FastAPI!"
                        }
                    }
                },
            },
            400: {"description": "잘못된 요청"}
        }
    }
