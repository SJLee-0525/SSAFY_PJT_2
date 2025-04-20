import matplotlib

matplotlib.rcParams['font.family'] = 'Malgun Gothic'  # 또는 다른 한글 폰트
matplotlib.rcParams['axes.unicode_minus'] = False

MENU_NAME = "알리오 올리오"


def parse_video_id(data: str) -> str:
    return data.split("v=")[1].split("&")[0]


def json_to_text(json_data: dict) -> str:
    text = json_data['title'] + " "
    text += " ".join([ing['name'] + " " + ing['quantity']
                     for ing in json_data['ingredients']]) + " "
    text += " ".join(json_data['cooking_tips']) + " "
    for step in json_data['cooking_sequence'].values():
        text += " ".join(step['sequence']) + " "
    return text.strip()
