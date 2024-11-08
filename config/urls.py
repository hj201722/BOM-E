"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path

from . import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.index, name="index"),
    path("sign_up/", views.sign_up, name="sign_up"),
    path("login/", views.login, name="login"),
    path("reset_password/", views.reset_password, name="reset_password"),
    path("product_details/", views.product_details, name="product_details"),
    path("shop/", views.shop, name="shop"),
    path("shop_list/", views.shop_list, name="shop_list"),
    path("product/<str:productName>/", views.product_details, name="product_details"),
    path("shop/product_details/", views.product_details, name="product_details"),
]
