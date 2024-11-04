import logging
import os
import re

import firebase_admin
import pandas as pd
from firebase_admin import credentials, db

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


def extract_score(score_str):
    match = re.search(r"\d+", score_str)
    if match:
        return float(match.group(0))  # 숫자만 추출하여 실수로 변환
    return 0.0


# 폴더 내 모든 CSV 파일 읽기 및 Firebase Realtime Database에 업로드
for root, dirs, files in os.walk(folder_path):
    for filename in files:
        if filename.endswith(".csv"):
            csv_file_path = os.path.join(root, filename)
            logger.info(f"Processing file: {csv_file_path}")

            file_title = re.sub(
                r"_\d+.*", "", filename
            )  # 파일 제목에서 _숫자 부분 제거
            product_name = sanitize_path(file_title)  # 파일 제목 정리

            data = pd.read_csv(csv_file_path)
            scores = [extract_score(score) for score in data["score"]]

            # 평균 점수 계산
            if scores:
                average_score = round(
                    sum(scores) / len(scores), 1
                )  # 평균 점수를 소수점 첫째 자리까지 반올림

                # 기존 데이터 가져오기
                product_ref = ref.child(product_name)
                existing_data = product_ref.get()

                if existing_data is None:
                    existing_data = {}

                # 기존 데이터에 새로운 평균 점수 추가
                existing_data["average_score"] = average_score

                # Firebase에 데이터 저장
                product_ref.set(existing_data)
                logger.info(f"Data uploaded for product: {product_name}")

print("모든 CSV 데이터를 요약하여 Realtime Database에 저장 완료.")
