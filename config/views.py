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
