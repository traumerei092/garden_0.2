from django.db import models
from django.conf import settings
from django.db.models.signals import pre_save
from django.dispatch import receiver
import requests

class ShopType(models.Model):
    name = models.CharField(max_length=50, unique=True)

class ShopConcept(models.Model):
    name = models.CharField(max_length=50, unique=True)

class ShopLayout(models.Model):
    name = models.CharField(max_length=50, unique=True)

class Address(models.Model):
    postal_code = models.CharField(max_length=10)
    prefecture = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    district = models.CharField(max_length=50, blank=True)
    town = models.CharField(max_length=50)
    street_address = models.CharField(max_length=100)
    building = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.prefecture}{self.city}{self.district}{self.town}{self.street_address}{self.building}"

class Shop(models.Model):
    name = models.CharField(max_length=100)
    address = models.OneToOneField(Address, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    seat_count = models.IntegerField(null=True, blank=True, default=0)
    capacity = models.IntegerField(null=True, blank=True, default=0)  # 収容人数
    opening_hours = models.JSONField(null=True, blank=True, default=dict)  # 営業時間をJSON形式で保存
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    types = models.ManyToManyField(ShopType, blank=True)
    concepts = models.ManyToManyField(ShopConcept, blank=True)
    layouts = models.ManyToManyField(ShopLayout, blank=True)
    icon_image = models.ImageField(upload_to='shop_icons/', null=True, blank=True)

    def geocode_address(self):
        api_key = "YOUR_GOOGLE_MAPS_API_KEY"
        base_url = "https://maps.googleapis.com/maps/api/geocode/json"
        address = str(self.address)
        params = {
            "address": address,
            "key": api_key
        }
        response = requests.get(base_url, params=params)
        data = response.json()

        if data["status"] == "OK":
            location = data["results"][0]["geometry"]["location"]
            self.latitude = location["lat"]
            self.longitude = location["lng"]
        else:
            print(f"Geocoding failed for address: {address}")

@receiver(pre_save, sender=Shop)
def geocode_shop_address(sender, instance, **kwargs):
    if not instance.latitude or not instance.longitude:
        instance.geocode_address()

class ShopPhoto(models.Model):
    shop = models.ForeignKey(Shop, related_name='photos', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='shop_photos/')
    caption = models.CharField(max_length=255, blank=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        uploaded_by = self.uploaded_by.username if self.uploaded_by else "Unknown user"
        return f"Photo for {self.shop.name} by {uploaded_by}"


class Review(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    likes = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Review by {self.user.username} for {self.shop.name}"

class ReviewPhoto(models.Model):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(upload_to='review_photos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo for review {self.review.id}"