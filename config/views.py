import firebase_admin
from django.shortcuts import render
from firebase_admin import credentials, db, initialize_app

# Firebase 서비스 계정 키 파일 경로
cred = credentials.Certificate(".json")

# Firebase 초기화
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred, {"databaseURL": ""})


def index(request):
    search_query = request.GET.get("search", "")

    # Firebase에서 데이터 가져오기
    products_ref = db.reference("products_digital")
    products_data = products_ref.get()

    # Firebase 데이터를 리스트로 변환
    products = []
    for key, value in products_data.items():
        product = {
            "id": key,
            "title": value.get("title", "No Title"),
            "image_url": value.get("img_url", ""),
            "large_category": value.get("large_category", ""),
            "rating": round(
                value.get("average_score", 0), 1
            ),  # 소수점 한 자릿수로 반올림
        }

        if search_query.lower() in product["title"].lower():
            products.append(product)

    return render(
        request,
        "index.html",
        {"products": products, "search_query": search_query},
    )


def shop(request):
    search_query = request.GET.get("search", "")

    # Firebase에서 데이터 가져오기
    products_ref = db.reference("products_digital")
    products_data = products_ref.get()

    # Firebase 데이터를 리스트로 변환
    products = []
    for key, value in products_data.items():
        product = {
            "id": key,
            "title": value.get("title", "No Title"),
            "image_url": value.get("img_url", ""),
            "large_category": value.get("large_category", ""),
            "rating": round(
                value.get("average_score", 0), 1
            ),  # 소수점 한 자릿수로 반올림
        }

        if search_query.lower() in product["title"].lower():
            products.append(product)

    return render(
        request,
        "shop/shop.html",
        {"products": products, "search_query": search_query},
    )


def sign_up(request):
    return render(request, "account/sign_up.html")


def login(request):
    return render(request, "account/login.html")


def reset_password(request):
    return render(request, "account/reset_password.html")


def product_details(request):
    return render(request, "product_details/product_details.html")


def shop_list(request):
    return render(request, "shop/shop_list.html")
