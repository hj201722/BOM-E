# config/firebase.py

import firebase_admin
from firebase_admin import credentials, db

# Firebase 서비스 계정 키 파일 경로
cred = credentials.Certificate(
    "bome-digital-firebase-adminsdk-eb9z8-3997c6ef92.json"
)  # 실제 서비스 계정 키 파일 경로로 변경하세요.
firebase_admin.initialize_app(
    cred,
    {
        "databaseURL": "https://bome-digital-default-rtdb.firebaseio.com//"  # 실제 Firebase Realtime Database URL로 변경하세요.
    },
)
