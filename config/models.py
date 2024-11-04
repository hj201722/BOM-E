# config/models.py

from django.db import models


class Product(models.Model):
    title = models.CharField(max_length=255)  # 제품명
    description = models.TextField()  # 제품 설명
    image = models.ImageField(upload_to="products/")  # 제품 이미지
    price = models.DecimalField(max_digits=10, decimal_places=2)  # 가격
    large_category = models.CharField(max_length=255)  # 대분류 카테고리
    medium_category = models.CharField(
        max_length=255, blank=True, null=True
    )  # 중분류 카테고리
    small_category = models.CharField(
        max_length=255, blank=True, null=True
    )  # 소분류 카테고리
    rating = models.FloatField(default=0)  # 평점
    upvotes = models.PositiveIntegerField(default=0)  # 좋아요 수
    downvotes = models.PositiveIntegerField(default=0)  # 싫어요 수

    def __str__(self):
        return self.title
