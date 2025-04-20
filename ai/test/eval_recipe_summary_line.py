import os
import asyncio
import json
import pandas as pd
import matplotlib.pyplot as plt

from rouge_score import rouge_scorer
from test.utils.recipe_summary_correct_answer import correct_answer, data_url
from test.utils.eval_recipe_summary_common import json_to_text, parse_video_id, MENU_NAME
from app.services.recipe_summary import RecipeSummary
from datetime import datetime
from app.core.config import settings


EVAL_DIR = "logs/recipe_summary_eval_results/line/"
CSV_DIR = EVAL_DIR + "csv/"
PLOT_DIR = EVAL_DIR + "plot/"


def visualize_rouge_scores_csv():
    csv_path = os.path.join(
        CSV_DIR, f"{MENU_NAME}_{settings.SUMMARY_OPENAI_MODEL}.csv")

    if not os.path.exists(csv_path):
        print(f"CSV 파일이 없습니다: {csv_path}")
        return

    df = pd.read_csv(csv_path)
    # 평가 횟수 기준
    x = range(len(df))

    plt.figure(figsize=(10, 6))

    rouge_types = ["rouge1", "rouge2", "rougeL"]
    for rouge in rouge_types:
        plt.plot(x, df[f"{rouge}_F1"], label=rouge.upper(), marker="o")

    plt.title(
        f"ROUGE F1 Score - {settings.SUMMARY_OPENAI_MODEL} - {MENU_NAME}")
    plt.xlabel("Evaluation Count")
    plt.ylabel("F1 Score")
    plt.ylim(0, 1)
    plt.legend()
    plt.grid(True)
    plt.tight_layout()

    os.makedirs(PLOT_DIR, exist_ok=True)
    save_path = os.path.join(
        PLOT_DIR, f"{MENU_NAME}_{settings.SUMMARY_OPENAI_MODEL}.png")
    plt.savefig(save_path)
    plt.show()
    print(f"Line plot saved to {save_path}")


def save_scores_to_csv(score_dict: dict):
    os.makedirs(CSV_DIR, exist_ok=True)
    date_str = datetime.now()

    row = {
        "Date": date_str,
        "Menu": MENU_NAME,
        "Model": settings.SUMMARY_OPENAI_MODEL,
    }

    for k, v in score_dict.items():
        row[f"{k}_P"] = round(v.precision, 4)
        row[f"{k}_R"] = round(v.recall, 4)
        row[f"{k}_F1"] = round(v.fmeasure, 4)

    csv_path = os.path.join(
        CSV_DIR, f"{MENU_NAME}_{settings.SUMMARY_OPENAI_MODEL}.csv")

    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
    else:
        df = pd.DataFrame([row])

    df.to_csv(csv_path, index=False, encoding='utf-8-sig')
    print(f"📄 Saved ROUGE scores to {csv_path}")


if __name__ == "__main__":
    async def main():
        recipe_summary = RecipeSummary()
        api_answer = await recipe_summary.summarize_recipe(parse_video_id(data_url[MENU_NAME]))

        answer_text = json_to_text(json.loads(correct_answer[MENU_NAME]))
        generated_text = json_to_text(api_answer)

        scorer = rouge_scorer.RougeScorer(
            ['rouge1', 'rouge2', 'rougeL'], use_stemmer=False)
        scores = scorer.score(answer_text, generated_text)

        # 출력
        for key in scores:
            print(f"{key}: {scores[key].fmeasure:.4f}")

        # 시각화 및 저장
        save_scores_to_csv(scores)
        visualize_rouge_scores_csv()

    asyncio.run(main())
