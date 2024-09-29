from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("api/auth/", include("djoser.urls")),
    path("api/auth/", include("djoser.urls.jwt")),
    # アカウント
    path("api/accounts/", include("accounts.urls")),
    # ショップ
    path("api/shops/", include("shops.urls")),
    # 管理画面
    path("admin/", admin.site.urls),
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)