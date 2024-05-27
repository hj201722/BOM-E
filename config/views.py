# views.py

from django.shortcuts import render


def index(request):
    return render(request, "index.html")


def sign_up(request):
    return render(request, "account/sign_up.html")


def login(request):
    return render(request, "account/login.html")


def reset_password(request):
    return render(request, "account/reset_password.html")


def product_details(request):
    return render(request, "product_details/product_details.html")


def shop(request):
    return render(request, "shop/shop.html")


def shop_list(request):
    return render(request, "shop/shop_list.html")


from django.shortcuts import render

from .firebase import db  # Firebase 초기화 코드에서 가져옴


def index(request):
    # Firebase에서 데이터 가져오기
    products_ref = db.reference("products")
    products_data = products_ref.get()

    # Firebase 데이터를 리스트로 변환
    products = []
    for key, value in products_data.items():
        product = {
            "id": key,
            "title": value.get("title", "No Title"),
            "description": value.get("description", ""),
            "image_url": value.get("image_url", ""),
            "price": value.get("price", 0),
            "large_category": value.get("large_category", ""),
            "small_category": value.get("small_category", ""),
            "rating": round(
                value.get("average_score", 0), 1
            ),  # 소수점 한 자릿수로 반올림
            "upvotes": value.get("upvotes", 0),
            "downvotes": value.get("downvotes", 0),
        }
        products.append(product)

    return render(request, "index.html", {"products": products})
