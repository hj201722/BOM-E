# import urllib.parse

# import firebase_admin
# from firebase_admin import credentials, db

# # Firebase 서비스 계정 키 파일 경로
# cred = credentials.Certificate(
#     "bome-digital-firebase-adminsdk-eb9z8-3997c6ef92.json"
# )  # 실제 서비스 계정 키 파일 경로로 변경하세요.
# firebase_admin.initialize_app(
#     cred,
#     {
#         "databaseURL": "https://bome-digital-default-rtdb.firebaseio.com/"  # 실제 Firebase Realtime Database URL로 변경하세요.
#     },
# )

# # 데이터베이스 참조
# ref = db.reference("products_digital")

# # 모든 상품 가져오기
# all_products = ref.get()

# if all_products is None:
#     print("No products found in the database.")
# else:
#     for product_name, product_data in all_products.items():
#         if "_" not in product_name:  # 기본 상품 정보만 처리
#             # 상세 정보가 있는 상품 처리
#             encoded_product_name = urllib.parse.quote(product_name, safe="")
#             snapshot = (
#                 ref.order_by_key()
#                 .start_at(encoded_product_name + "_")
#                 .end_at(encoded_product_name + "_\uf8ff")
#                 .get()
#             )

#             # 상세 정보를 기본 상품 정보에 합치기
#             if product_data is None:
#                 product_data = {}

#             # 상세 정보를 합치기
#             for key, value in snapshot.items():
#                 if "negative_sentence" in value:
#                     product_data["negative_sentence"] = value["negative_sentence"]
#                 if "negative_url" in value:
#                     product_data["negative_url"] = value["negative_url"]
#                 if "neutral_sentence" in value:
#                     product_data["neutral_sentence"] = value["neutral_sentence"]
#                 if "neutral_url" in value:
#                     product_data["neutral_url"] = value["neutral_url"]
#                 if "positive_sentence" in value:
#                     product_data["positive_sentence"] = value["positive_sentence"]
#                 if "positive_url" in value:
#                     product_data["positive_url"] = value["positive_url"]

#             # 합쳐진 데이터를 데이터베이스에 다시 저장
#             ref.child(product_name).set(product_data)
#             print(f"{product_name} 데이터가 업데이트되었습니다.")
import firebase_admin
from firebase_admin import credentials, db

# Firebase 서비스 계정 키 파일 경로
cred = credentials.Certificate(".json")  # 실제 서비스 계정 키 파일 경로로 변경하세요.
firebase_admin.initialize_app(
    cred,
    {"databaseURL": ""},  # 실제 Firebase Realtime Database URL로 변경하세요.
)

# 데이터베이스 참조
ref = db.reference("products_digital")

# 모든 상품 가져오기
all_products = ref.get()

if all_products is None:
    print("No products found in the database.")
else:
    for product_name in list(all_products.keys()):
        # productName_숫자 형식의 키만 삭제
        if "_" in product_name:
            ref.child(product_name).delete()
            print(f"{product_name} 삭제됨")

print("모든 관련 데이터를 삭제했습니다.")
