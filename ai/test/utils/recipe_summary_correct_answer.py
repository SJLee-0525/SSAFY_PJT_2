correct_answer = {}
data_url = {}

# High Quality : Manually Script + Video Description

data_url["김치볶음밥"] = "https://www.youtube.com/watch?v=eIo2BaE6LxI"
correct_answer["김치볶음밥"] = """
{
    "title" : "김치 볶음밥",
    "cooking_info" : {
        "cooking_time" : "15분",
        "kcal" : 620
    },
    "ingredients" : [
        {
            "name" : "김치",
            "quantity": "1컵(160g)"
        },
        {
            "name" : "소시지",
            "quantity": "2개(65g)"
        },
        {
            "name" : "대파",
            "quantity": "1/2컵(40g)"
        },
        {
            "name" : "식용유",
            "quantity": "3큰술(20g)"
        },
        {
            "name" : "진간장",
            "quantity": "1/2큰술(5g)"
        },
        {
            "name" : "고춧가루",
            "quantity": "1/3큰술(3g)"
        },
        {
            "name" : "설탕",
            "quantity": "1/3큰술(3g)"
        },
        {
            "name" : "즉석밥",
            "quantity": "1개"
        },
        {
            "name" : "달걀",
            "quantity": "1개"
        },
        {
            "name" : "김가루",
            "quantity": "약간"
        },
        {
            "name" : "깨소금",
            "quantity": "약간"
        }
    ],
    "cooking_tips" : [
        "덜 익은 김치와 설탕을 함께 사용하면 단 맛이 많이 나기 때문에 신김치를 사용합니다.",
        "김치의 간이 약하다면 간장의 양을 늘립니다.",
        "수분이 부족하면 중간에 물을 함께 첨가하여 볶아줍니다."
    ],
    "cooking_sequence" : {
        "재료 손질" : {
            "sequence": [
                "소시지는 얇게 썰고, 대파는 반으로 갈라 송송 썰어 준비합니다.",
                "김치는 가위로 잘게 잘라주세요."
            ],
            "timestamp": 200
        },
        "팬 예열" : {
            "sequence": [
                "불을 켜서 팬을 달군 뒤, 식용유 3컵을 두릅니다.",
                "대파, 소시지를 넣고 노릇노릇 해질때까지 볶습니다."
            ],
            "timestamp": 296
        },
        "재료 볶기" : {
            "sequence": [
                "설탕과 간장을 넣고 수분이 증발하면 김치를 같이 넣고 볶습니다.",
                "고추가루를 넣어주고, 수분이 없다면 물을 조금 넣어 재료가 뭉치지 않게 섞어줍니다."
            ],
            "timestamp": 368
        },
        "즉석밥 넣고 볶기" : {
            "sequence": [
                "불을 잠시 꺼줍니다.",
                "즉석밥 1개를 넣어주고 주걱으로 적당히 부신 뒤, 재료들과 섞어줍니다.",
                "불을 다시 켜고 밥을 볶아줍니다."
            ],
            "timestamp": 480
        },
        "마무리" : {
            "sequence": [
                "깨소금을 넣어줍니다.",
                "계란후라이를 만들어 만들어 둔 김치볶음밥 위에 올리고 김가루를 뿌려 마무리합니다.",
                "절구가 있다면, 깨를 갈아 넣어줍니다."
            ],
            "timestamp": 553
        }
    }
}
"""

data_url["된장찌개"] = "https://www.youtube.com/watch?v=ffuakdFmuh4"
correct_answer["된장찌개"] = """
{
    "title" : "된장찌개",
    "cooking_info" : {
        "cooking_time" : "20분",
        "kcal" : 330
    },
    "ingredients" : [
        {
            "name" : "된장",
            "quantity": "1/3컵(60g)"
        },
        {
            "name" : "물",
            "quantity": "약 4컵(750ml)"
        },
        {
            "name" : "간마늘",
            "quantity": "1/2큰술(8g)"
        },
        {
            "name" : "멸치",
            "quantity": "육수용 10마리(20g)"
        },
        {
            "name" : "애호박",
            "quantity": "1/2개(130g)"
        },
        {
            "name" : "양파",
            "quantity": "1/2개"
        },
        {
            "name" : "느타리버섯",
            "quantity": "1컵(80g)"
        },
        {
            "name" : "대파",
            "quantity": "2/3컵(60g)"
        },
        {
            "name" : "청양고추",
            "quantity": "2개(14g)"
        },
        {
            "name" : "홍고추",
            "quantity": "1/2개(7g)"
        },
        {
            "name" : "두무",
            "quantity": "1/2모(180g)"
        }
    ],
    "cooking_tips" : [
        "쌀뜨물을 활용하면 맛이 더 좋습니다.",
        "멸치 대신 소고기나 돼지고기를 활용하여 육수를 우려도 됩니다."
    ],
    "cooking_sequence" : {
        "육수 만들기" : {
            "sequence": [
                "멸치의 머리, 내장, 가시를 제거한 뒤 3등분하여 냄비에 넣습니다.",
                "물 4컵을 넣고 끓여줍니다."
            ],
            "timestamp": 103
        },
        "재료 손질" : {
            "sequence": [
                "느타리 버섯을 일정한 두께로 찢어서 준비하고, 양파와 호박을 깍둑 썰어줍니다.",
                "고추, 파, 두부도 적당한 크기로 썰어줍니다."
            ],
            "timestamp": 254
        },
        "재료 넣기" : {
            "sequence": [
                "양파를 먼저 넣고, 버섯, 호박 순서로 넣어줍니다.",
                "간마늘을 넣어주고 된장도 넣어서 풀어줍니다.",
                "고추, 파를 넣어준 뒤, 두부도 마저 넣어 마무리합니다."
            ],
            "timestamp": 364
        }
    }
}
"""

data_url["알리오 올리오"] = "https://www.youtube.com/watch?v=ohihzV6Z85k"
correct_answer["알리오 올리오"] = """
{
    "title" : "알리오 올리오",
    "cooking_info" : {
        "cooking_time" : "25분",
        "kcal" : 630
    },
    "ingredients" : [
        {
            "name" : "물",
            "quantity": "6컵(1L)"
        },
        {
            "name" : "파스타면",
            "quantity": "100g"
        },
        {
            "name" : "소금",
            "quantity": "1/3큰술(4g)"
        },
        {
            "name" : "올리브유",
            "quantity": "1/3컵(55g)"
        },
        {
            "name" : "간마늘",
            "quantity": "2큰술(40g)"
        },
        {
            "name" : "통마늘",
            "quantity": "4개(21g)"
        },
        {
            "name" : "쪽파",
            "quantity": "4g"
        },
        {
            "name" : "페퍼론치노",
            "quantity": "5개(2g)"
        },
        {
            "name" : "파마산치즈가루",
            "quantity": "약간"
        }
    ],
    "cooking_tips" : [
        "파스타 끓일 물은 라면 1인분의 2배로 잡아주면 편합니다.",
        "기름에 마늘 향이 베일 수 있도록 약한 불에 최대한 볶아줍니다."
    ],
    "cooking_sequence" : {
        "파스타 면 삶기" : {
            "sequence": [
                "물 1L를 넣고 소금을 넣어줍니다.",
                "물이 끓어오르면 파스타 면을 8분간 삶아줍니다.",
                "파스타 면이 타지 않도록 냄비 안쪽으로 넣어줍니다."
            ],
            "timestamp": 240
        },
        "재료 손질 및 볶기" : {
            "sequence": [
                "마늘을 편으로 썰어줍니다.",
                "불을 약하게 켜고 팬에 올리브유를 둘러준 뒤, 편마늘을 볶아줍니다.",
                "마늘이 어느정도 익었다면, 페퍼론치노를 빻아서 넣어줍니다.",
                "편마늘이 어느정도 노릇해졌으면, 간마늘을 넣고 노릇해질때까지 볶아줍니다."
            ],
            "timestamp": 359
        },
        "파스타 면 볶기" : {
            "sequence": [
                "파스타 면이 모두 삶아졌다면, 팬으로 옮겨 재료들과 함께 섞어줍니다.",
                "팬에 물기가 별로 없다면 면수를 추가해줍니다."
            ],
            "timestamp": 488
        },
        "마무리 및 플레이팅": {
            "sequence": [
                "젓가락이나 집게를 활용해서 접시에 잘 옮겨줍니다.",
                "파마산 치즈가루를 뿌려 마무리합니다."
            ],
            "timestamp": 580
        }
    }
}
"""

#  Mid Quality : Manually Script + No Video Description

data_url["소고기 볶음"] = "https://www.youtube.com/watch?v=2ulwxhGy6Rk"
correct_answer["소고기 볶음"] = """
{
    "title" : "소고기 볶음",
    "cooking_info" : {
        "cooking_time" : "30분",
        "kcal" : 1400
    },
    "ingredients" : [
        {
            "name" : "소고기",
            "quantity": "500g"
        },
        {
            "name" : "브로콜리",
            "quantity": "100g"
        },
        {
            "name" : "베이킹 소다",
            "quantity": "0.5큰술"
        },
        {
            "name" : "생강",
            "quantity": "약간"
        },
        {
            "name" : "마늘",
            "quantity": "4쪽"
        },
        {
            "name" : "대파",
            "quantity": "0.5대"
        },
        {
            "name" : "당근",
            "quantity": "1/3개"
        },
        {
            "name" : "굴 소스",
            "quantity": "2큰술"
        },
        {
            "name" : "간장",
            "quantity": "2큰술"
        },
        {
            "name" : "청주",
            "quantity": "1큰술"
        },
        {
            "name" : "감자 전분",
            "quantity": "약간"
        },
        {
            "name" : "중국 간장",
            "quantity": "1큰술"
        },
        {
            "name" : "소홍주",
            "quantity": "1큰술"
        },
        {
            "name" : "설탕",
            "quantity": "1큰술"
        },
        {
            "name" : "백후추",
            "quantity": "약간"
        },
        {
            "name" : "물",
            "quantity": "약간"
        }
    ],
    "cooking_tips" : [
        "아롱사태와 같은 소고기를 사용해도 좋습니다.",
        "브로콜리의 식감을 위해 약간만 데쳐줍니다.",
        "마리네이드 시 베이킹 소다를 사용하고 물을 넣어주면 고기가 연해집니다."
    ],
    "cooking_sequence" : {
        "재료 준비" : {
            "sequence": [
                "소고기를 물에 담가 핏물을 제거해줍니다.",
                "마늘을 다지고, 대파, 당근을 썰어줍니다.",
                "브로콜리를 썰어 끓는 물에 소금을 넣고 데쳐줍니다."
            ],
            "timestamp": 35
        },
        "소고기 마리네이드" : {
            "sequence": [
                "소고기 핏물을 버리고 베이킹 소다 0.5큰술, 굴 소스 1큰술, 간장 1큰술, 청주 1큰술, 감자 전분 1큰술, 후추 조금을 넣고 버무려줍니다.",
                "물을 조금 넣어 소고기를 연하게 만들고 촉촉하게 만듭니다."
            ],
            "timestamp": 215
        },
        "양념 만들기": {
            "sequence": [
                "진간장 1큰술, 굴소스 1큰술, 중국 간장 1큰술, 소홍주 1큰술, 설탕 1큰술, 후추 조금, 전분 가루 적당량, 물을 조금 넣고 섞어줍니다."
            ],
            "timestamp": 300
        },
        "재료 볶기": {
            "sequence": [
                "예열된 팬에 소고기를 70%정도 익히고 접시에 덜어줍니다",
                "기름을 두르고 파를 먼저 넣은 뒤, 파기름이 나면 당근을 넣어줍니다.",
                "이후 생강, 간마늘을 넣고 30초 정도 볶은 뒤, 브로콜리도 넣어줍니다.",
                "어느정도 익었다면 소고기, 양념도 함께 넣어서 볶아줍니다.",
                "참기름을 둘러 마무리해줍니다.",
                "필요 시 고추기름을 끼얹어 줍니다."
            ],
            "timestamp": 387
        }
    }
}
"""

data_url["쇼가야키 덮밥"] = "https://www.youtube.com/watch?v=XPcsJSLuB8I"
correct_answer["쇼가야키 덮밥"] = """
{
    "title" : "쇼가야키 덮밥 1인분",
    "cooking_info" : {
        "cooking_time" : "15분",
        "kcal" : 1000
    },
    "ingredients" : [
        {
            "name" : "대패 삼겹살",
            "quantity": "200g"
        },
        {
            "name" : "맛술",
            "quantity": "1큰술"
        },
        {
            "name" : "알룰로스(물엿)",
            "quantity": "1큰술"
        },
        {
            "name" : "굴소스",
            "quantity": "1큰술"
        },
        {
            "name" : "간장",
            "quantity": "1큰술"
        },
        {
            "name" : "설탕",
            "quantity": "0.5큰술"
        },
        {
            "name" : "생강",
            "quantity": "1/2개"
        },
        {
            "name" : "양배추",
            "quantity": "100g"
        },
        {
            "name" : "팽이버섯",
            "quantity": "50g"
        },
        {
            "name" : "대파",
            "quantity": "약간"
        },
        {
            "name" : "계란",
            "quantity": "1개"
        },
        {
            "name" : "밥",
            "quantity": "1인분"
        }
    ],
    "cooking_tips" : [
        "생강을 활용하면 고기의 잡내를 없앨 수 있습니다.",
        "대패삼겹살이 말려있다면 펴주어, 고르게 익도록 해줍니다.",
        "대패 삼겹이 아닌 다른 부위를 활용해도 무관합니다."
    ],
    "cooking_sequence" : {
        "고기 볶기" : {
            "sequence": [
                "냉동된 고기를 해동하고, 잘 분리해줍니다.",
                "팬을 예열한 뒤, 고기와 함께 생강을 익혀줍니다."
            ],
            "timestamp": 140
        },
        "소스 넣기": {
            "sequence": [
                "설탕(제로 알룰로스) 0.5 큰술을 넣어주고, 맛술 1큰술, 굴소스 1큰술, 알룰로스(물엿) 1큰술, 간장 1큰술을 넣어줍니다.",
                "고기가 익을때까지 볶습니다."
            ],
            "timestamp": 267
        },
        "야채 볶기 및 마무리": {
            "sequence": [
                "익은 고기를 접시에 옮겨둡니다.",
                "고기 기름에 양배추, 팽이 버섯을 넣고 익혀줍니다.",
                "밥 위에 볶은 야채를 올려주고, 고기를 덮어줍니다.",
                "대파를 뿌리고, 계란에서 노른자만 분리해서 넣어줍니다."
            ],
            "timestamp": 325
        }
    }
}
"""

data_url["도미 오차즈케"] = "https://www.youtube.com/watch?v=fNJp7gQSwPg"
correct_answer["도미 오차즈케"] = """
{
    "title" : "도미 오차즈케",
    "cooking_info" : {
        "cooking_time" : "30분",
        "kcal" : 500
    },
    "ingredients" : [
        {
            "name" : "청주",
            "quantity": "200g"
        },
        {
            "name" : "미림",
            "quantity": "200g"
        },
        {
            "name" : "참깨",
            "quantity": "400g"
        },
        {
            "name" : "아타리고마 소스",
            "quantity": "300g"
        },
        {
            "name" : "간장",
            "quantity": "200g"
        },
        {
            "name" : "설탕",
            "quantity": "50g"
        },
        {
            "name" : "생강",
            "quantity": "35g"
        },
        {
            "name" : "다시마",
            "quantity": "25g"
        },
        {
            "name" : "가쓰오부시",
            "quantity": "50g"
        },
        {
            "name" : "소금",
            "quantity": "약간"
        },
        {
            "name" : "김",
            "quantity": "1장"
        },
        {
            "name" : "시소",
            "quantity": "적당량"
        },
        {
            "name" : "파",
            "quantity": "적당량"
        },
        {
            "name" : "도미",
            "quantity": "100g"
        },
        {
            "name" : "참깨",
            "quantity": "400g"
        },
        {
            "name" : "물",
            "quantity": "3.5L"
        },
        {
            "name" : "밥",
            "quantity": "1인분"
        }
    ],
    "cooking_tips" : [
        "청주, 미림 대신 설탕을 사용해도 됩니다."
    ],
    "cooking_sequence" : {
        "깨 소스 만들기" : {
            "sequence": [
                "냄비에 청주와 미림을 넣고 끓여줍니다.",
                "깨를 넣고 갈아줍니다.",
                "깨 위에 아타리고마 소스와 간장을 넣고 섞어줍니다.",
                "알코올을 날린 청주와 미림을 넣어준 뒤, 생강을 갈아 넣어주고, 설탕을 넣어줍니다."
            ],
            "timestamp": 37
        },
        "육수 만들기" : {
            "sequence": [
                "깨끗한 행주로 다시마를 닦아주고, 냄비에 넣을 수 있을 정도로 잘라준 뒤 우려줍니다.",
                "90도 이상의 끓은 상태에서 가쓰오부시를 넣어주고 불을 끈 뒤, 5분간 식혀줍니다.",
                "얇은 면포, 키친 타월을 활용해서 가쓰오부시 가루를 걸러줍니다.",
                "간이 부족하다면 소금을 추가해줍니다."
            ],
            "timestamp": 146
        },
        "고명 준비": {
            "sequence": [
                "김을 살짝 구운 뒤 잘게 잘라줍니다.",
                "얇게 자른 시소와 파를 준비합니다."
            ],
            "timestamp": 275
        },
        "도미 썰기": {
            "sequence": [
                "숙성된 도미를 얇게 회 떠줍니다."
            ],
            "timestamp": 316
        },
        "플레이팅": {
            "sequence": [
                "도미 위에 참깨 소스를 올려주고 파, 시소, 갈은 깨를 올려줍니다.",
                "다른 접시에는 참깨 소스를 먼저 올려준 뒤, 도미, 고명 들을 올려줍니다.",
                "밥에 깨를 뿌려서 준비합니다."
            ],
            "timestamp": 330
        },
        "시식": {
            "sequence": [
                "접시에 놓인 재료들을 섞고, 기호에 따라서 와사비를 첨가해줍니다.",
                "밥 위에 소스와 섞인 도미를 버무려서 먹습니다.",
                "밥 위에 도미를 올린 뒤, 육수를 부어준 뒤 먹습니다."
            ],
            "timestamp": 384
        }
    }
}
"""

# Low Quality : Auto Generated Script + No Video Description

data_url["파에야"] = "https://www.youtube.com/watch?v=iO_FN9vva-U"
correct_answer["파에야"] = """
{
    "title" : "한국식 파에야 4인분",
    "cooking_info" : {
        "cooking_time" : "30분",
        "kcal" : 1000
    },
    "ingredients" : [
        {
            "name" : "토마토",
            "quantity": "2개"
        },
        {
            "name" : "양송이 버섯",
            "quantity": "4개"
        },
        {
            "name" : "양파",
            "quantity": "2컵"
        },
        {
            "name" : "쌀",
            "quantity": "2컵"
        },
        {
            "name" : "오징어",
            "quantity": "1개"
        },
        {
            "name" : "칵테일 새우",
            "quantity": "10개"
        },
        {
            "name" : "올리브유",
            "quantity": "반 컵"
        },
        {
            "name" : "간마늘",
            "quantity": "1큰술"
        },
        {
            "name" : "토마토 케첩",
            "quantity": "1/3 큰술"
        },
        {
            "name" : "진간장",
            "quantity": "3큰술"
        },
        {
            "name" : "식초",
            "quantity": "1큰술"
        },
        {
            "name" : "설탕",
            "quantity": "1/2큰술"
        },
        {
            "name" : "소금",
            "quantity": "1/2큰술"
        },
        {
            "name" : "피망",
            "quantity": "적당량"
        },
        {
            "name" : "물",
            "quantity": "2컵"
        }
    ],
    "cooking_tips" : [
        "쌀은 미리 1시간정도 불려 조리 시간을 절약합니다.",
        "후라이팬은 넓은 팬을 활용하시는게 좋습니다.",
        "새우의 진한 맛을 원한다면, 칵테일 새우 대신 생새우를 활용합니다."
    ],
    "cooking_sequence" : {
        "재료 준비" : {
            "sequence": [
                "토마토에 칼집을 낸 뒤, 끓는 물에 데쳐 껍질을 벗겨내고 썰어서 준비합니다.",
                "양송이 버섯 4개를 얇게 썰고 양파는 잘게 다져 2컵 준비합니다.",
                "쌀을 두 컵정도 불려서 준비합니다.",
                "오징어 몸통 중앙에 있는 몸통을 제거하고 링 모양으로 썰어줍니다.",
                "(선택 사항) 냉동된 칵테일 새우를 물에 헹궈줍니다."
            ],
            "timestamp": 37
        },
        "재료 볶기" : {
            "sequence": [
                "예열된 팬에 올리브유를 반 컵 둘러주고 간 마늘 1큰술을 넣고 볶아줍니다.",
                "마늘이 노릇해지면 양파 두 컵, 오징어를 넣고 함께 볶아줍니다.",
                "썰어둔 토마토를 넣어준 뒤, 토마토 케첩 1/3 큰술을 첨가합니다.",
                "진간장 3큰술, 식초 1큰술, 설탕 1/2 큰술, 소금 1/2큰술을 첨가해줍니다."
            ],
            "timestamp": 160
        },
        "쌀 익히기": {
            "sequence": [
                "팬에 불린 쌀, 양송이 버섯을 넣고 물을 2컵 넣고 익혀줍니다.",
                "불이 끓어오르면 뚜껑을 덮어주고 약불로 12분간 익혀줍니다.",
                "6분 정도 지났을 때 밥을 뒤집어 밥이 타지 않도록 해줍니다."
            ],
            "timestamp": 346
        },
        "마무리": {
            "sequence": [
                "칵테일 새우의 절반을 넣습니다.",
                "어느정도 익혀준 뒤 남은 칵테일 새우와 피망을 올려 플레이팅 해줍니다.",
                "불을 끄고 뚜껑을 덮은 뒤 5분간 뜸을 들여줍니다."
            ],
            "timestamp": 480
        }
    }
}
"""

data_url["버터치킨커리"] = "https://www.youtube.com/watch?v=JVokLnlMHm4"
correct_answer["버터치킨커리"] = """
{
    "title" : "버터치킨커리 4인분",
    "cooking_info" : {
        "cooking_time" : "40분",
        "kcal" : 3000
    },
    "ingredients" : [
        {
            "name" : "다진 마늘",
            "quantity": "4 테이블 스푼"
        },
        {
            "name" : "다진 생강",
            "quantity": "2 테이블 스푼"
        },
        {
            "name" : "닭고기",
            "quantity": "800g"
        },
        {
            "name" : "소금",
            "quantity": "적당량"
        },
        {
            "name" : "칠리 파우더",
            "quantity": "6 테이블 스푼"
        },
        {
            "name" : "인도 쌀",
            "quantity": "1~2인분"
        },
        {
            "name" : "강황 가루",
            "quantity": "1 테이블 스푼"
        },
        {
            "name" : "올리브 오일",
            "quantity": "적당량"
        },
        {
            "name" : "물",
            "quantity": "1컵"
        },
        {
            "name" : "난",
            "quantity": "적당량"
        },
        {
            "name" : "양파",
            "quantity": "큰 거 1개"
        },
        {
            "name" : "버터",
            "quantity": "2 테이블 스푼"
        },
        {
            "name" : "토마토",
            "quantity": "1kg"
        },
        {
            "name" : "캐슈넛",
            "quantity": "100g"
        },
        {
            "name" : "식초",
            "quantity": "3 테이블 스푼"
        },
        {
            "name" : "가람 마살라",
            "quantity": "1티스푼"
        },
        {
            "name" : "설탕",
            "quantity": "6 테이블 스푼"
        },
        {
            "name" : "생크림",
            "quantity": "4 테이블 스푼"
        },
        {
            "name" : "카수리 메티",
            "quantity": "2 티스푼"
        }
    ],
    "cooking_tips" : [
        "취향에 따라 고수를 곁들여 먹습니다."
    ],
    "cooking_sequence" : {
        "재료 준비" : {
            "sequence": [
                "마늘, 생강을 다져줍니다.",
                "잘라둔 닭고기 위에 마늘, 생강을 넣고, 소금 적당량을 첨가합니다.",
                "인도 칠리파우더를 넣고 잘 섞어주고 최소 15분정도 냉장고에 재워둡니다."
            ],
            "timestamp": 86
        },
        "밥과 난 준비" : {
            "sequence": [
                "인도 쌀을 한 컵 덜어 씻어주고, 물 한컵, 강황 가루, 올리브 오일을 넣고 끓여줍니다.",
                "물이 끓어오르면 불을 줄이고 약불로 줄인 뒤 수분이 다 날아갈 때 까지 끓여줍니다.",
                "수분이 다 날아가면 불을 끄고 5분정도 뜸을 들여줍니다.",
                "난을 전자렌지에 데워 준비합니다."
            ],
            "timestamp": 130
        },
        "닭고기 볶기": {
            "sequence": [
                "팬을 예열한 뒤 기름을 두르고 재워놨던 고기를 익혀줍니다.",
                "70%정도 익힌 뒤에 볼에 옮겨둡니다."
            ],
            "timestamp": 196
        },
        "야채 및 향신료 넣기": {
            "sequence": [
                "고기를 익힌 팬에 양파, 버터, 토마토, 캐슈넛을 넣고 익혀줍니다.",
                "토마토에서 껍질이 벗겨질때쯤 물을 넣어줍니다.",
                "다진마늘, 소금, 식초를 넣어주고, 설탕을 넣어줍니다.",
                "가람 마살라를 1티스푼 넣어주고, 칠리 파우더를 4 테이블 스푼 넣어줍니다."
            ],
            "timestamp": 216
        },
        "블렌딩 및 마무리": {
            "sequence": [
                "조리된 요리를 볼아 담아주고 핸드 블렌더를 활용하여 갈아줍니다.",
                "체에 한번 걸러 부드럽게 만들어줍니다.",
                "버터와 생크림 그리고 볶아준 닭고기를 넣고 마저 익혀줍니다.",
                "카수리 메티 2티스푼을 넣어 인도 느낌을 내어 마무리합니다."
            ],
            "timestamp": 290
        }
    }
}
"""

data_url["떡만둣국"] = "https://www.youtube.com/watch?v=UIbWCD9F7IU"
correct_answer["떡만둣국"] = """
{
    "title" : "떡만둣국 4인분",
    "cooking_info" : {
        "cooking_time" : "40분",
        "kcal" : 2500
    },
    "ingredients" : [
        {
            "name" : "다시마",
            "quantity": "큰 거 1장"
        },
        {
            "name" : "디포리",
            "quantity": "16마리"
        },
        {
            "name" : "다진 삼겹살",
            "quantity": "100g"
        },
        {
            "name" : "당면",
            "quantity": "한 줌"
        },
        {
            "name" : "대파",
            "quantity": "2대"
        },
        {
            "name" : "두부",
            "quantity": "1/2모"
        },
        {
            "name" : "숙주",
            "quantity": "100g"
        },
        {
            "name" : "양파",
            "quantity": "1개"
        },
        {
            "name" : "부추",
            "quantity": "100g"
        },
        {
            "name" : "다진 마늘",
            "quantity": "1/2 큰술"
        },
        {
            "name" : "달걀",
            "quantity": "3개"
        },
        {
            "name" : "참치액",
            "quantity": "3큰술"
        },
        {
            "name" : "국간장",
            "quantity": "1큰술"
        },
        {
            "name" : "진간장",
            "quantity": "1.5큰술"
        },
        {
            "name" : "맛술",
            "quantity": "3.5큰술"
        },
        {
            "name" : "설탕",
            "quantity": "1.5큰술"
        },
        {
            "name" : "만두피",
            "quantity": "적당량"
        },
        {
            "name" : "소고기",
            "quantity" : "200g"
        },
        {
            "name" : "떡",
            "quantity" : "200g"
        },
        {
            "name" : "소금",
            "quantity" : "1/3큰술"
        },
        {
            "name" : "후추",
            "quantity" : "약간"
        }
    ],
    "cooking_tips" : [
        "만두에 삼겹살을 활용하여 부드럽게 만듭니다.",
        "만두피 테두리에만 물을 묻혀서 떨어지지 않게 만들어줍니다."
    ],
    "cooking_sequence" : {
        "육수 및 만두소 재료 준비" : {
            "sequence": [
                "다시마 디포리를 물에 넣고 천천히 끓여줍니다.",
                "다른 냄비에서는 당면을 불려줍니다.",
                "두부 1/2모를 으깨고 대파 2뿌리를 다져서 다진 삼겹살과 섞어줍니다.",
                "양파 1개, 불린 당면을 잘게 다져주고 부추, 데친 숙주도 다져 모두 함께 섞어줍니다.",
                "계란 1개, 간마늘 1/2 스푼, 참치액 1스푼, 진간장 1.5스푼, 맛술 1.5스푼, 설탕 1.5스푼을 넣고 잘 섞어줍니다."
            ],
            "timestamp": 56
        },
        "만두 빚기" : {
            "sequence": [
                "각자 방법대로 만두를 빚습니다."
            ],
            "timestamp": 276
        },
        "떡만둣국 끓이기": {
            "sequence": [
                "예열된 팬에 기름을 두르고 준비한 고기를 볶아줍니다.",
                "어느정도 익었다면 준비해둔 멸치 육수 1L를 넣고 끓여줍니다.",
                "육수가 끓으면 떡 200g을 넣고 불려줍니다.",
                "참치액 2스푼, 국간장 1스푼, 맛술 2스푼, 소금 1/3스푼, 후추 적당량을 넣어줍니다.",
                "떡이 어느정도 익으면 불을 줄이고 만두를 넣어 함께 익혀줍니다.",
                "만두가 익으면 계란을 풀어 넣어줍니다."
            ],
            "timestamp": 300
        },
        "마무리": {
            "sequence": [
                "불을 끄고 그릇에 담아줍니다.",
                "파, 김가루 등을 추가하여 맛을 더합니다."
            ],
            "timestamp": 440
        }
    }
}
"""
