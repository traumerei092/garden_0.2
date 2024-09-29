from django.urls import path
from .views import UserDetailView, UserCreateView

urlpatterns = [
    # ユーザー詳細
    path("users/<uid>/", UserDetailView.as_view(), name="user-detail"),
    path("users/", UserCreateView.as_view(), name="user-create"),
]