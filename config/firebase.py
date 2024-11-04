# config/firebase.py

import firebase_admin
from firebase_admin import credentials, db

# Firebase 서비스 계정 키 파일 경로
cred = credentials.Certificate(".json")  # 실제 서비스 계정 키 파일 경로로 변경하세요.
firebase_admin.initialize_app(
    cred,
    {"databaseURL": ""},  # 실제 Firebase Realtime Database URL로 변경하세요.
)
