import logging
import os
import re

import firebase_admin
import pandas as pd
from firebase_admin import credentials, db

# import uuid

# Firebase 서비스 계정 키 파일 경로
cred = credentials.Certificate(".json")  # 실제 서비스 계정 키 파일 경로로 변경하세요.
firebase_admin.initialize_app(
    cred,
    {"databaseURL": ""},  # 실제 Firebase Realtime Database URL로 변경하세요.
)

# CSV 파일이 저장된 폴더 경로
folder_path = "crawling/디지털"

# Firestore 참조
ref = db.reference("products_digital")


def sanitize_path(path):
    # 허용되지 않는 문자를 '_'로 대체
    return re.sub(r"[.#$/\[\]]", "_", path)


def extract_score(score_str):
    # '평점5' 같은 형식에서 숫자만 추출
    match = re.search(r"\d+", score_str)
    if match:
        return float(match.group(0))
    return 0.0


# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# # 모델과 토크나이저 로드
# model_id = "psyche/KoT5-summarization"
# model = AutoModelForSeq2SeqLM.from_pretrained(model_id)
# tokenizer = AutoTokenizer.from_pretrained(model_id)


# def summarize_reviews(reviews):
#     concatenated_reviews = " ".join(reviews)
#     inputs = tokenizer(
#         concatenated_reviews, return_tensors="pt", max_length=512, truncation=True
#     )
#     summary_ids = model.generate(
#         inputs["input_ids"],
#         max_length=150,
#         min_length=40,
#         length_penalty=2.0,
#         num_beams=4,
#         early_stopping=True,
#     )
#     summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
#     return summary


def extract_score(score_str):
    match = re.search(r"\d+", score_str)
    if match:
        return int(float(match.group(0)))  # 숫자만 추출하여 정수로 변환
    return 0


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 폴더 내 모든 CSV 파일 읽기 및 Firebase Realtime Database에 업로드
for root, dirs, files in os.walk(folder_path):
    for filename in files:
        if filename.endswith(".csv"):
            csv_file_path = os.path.join(root, filename)
            logger.info(f"Processing file: {csv_file_path}")

            file_title = re.sub(
                r"_\d+.*", "", filename
            )  # 파일 제목에서 _숫자 부분 제거
            product_name = file_title

            data = pd.read_csv(csv_file_path)
            # reviews = data["review"].tolist()
            scores = [extract_score(score) for score in data["score"]]
            # img_url = data["img_url"][0]  # 첫번째 이미지 URL 사용

            # # 리뷰 요약
            # if reviews:
            #     summary = summarize_reviews(reviews)
            #     average_score = sum(scores) // len(scores)  # 평균 점수 계산

            #     # Firebase에 데이터 저장
            #     product_ref = ref.child(product_name)
            #     product_ref.set(
            #         {
            #             "summary": summary,
            #             "average_score": average_score,
            #             # "img_url": img_url,
            #         }
            #     )
            #     logger.info(f"Data uploaded for product: {product_name}")

print("모든 CSV 데이터를 요약하여 Realtime Database에 저장 완료.")
