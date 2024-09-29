from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShopViewSet, ShopTypeViewSet, ShopConceptViewSet, ShopLayoutViewSet, ShopPhotoViewSet, ReviewViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

router = DefaultRouter()
router.register(r'shops', ShopViewSet, basename='shop')
router.register(r'types', ShopTypeViewSet)
router.register(r'concepts', ShopConceptViewSet)
router.register(r'layouts', ShopLayoutViewSet)
router.register(r'photos', ShopPhotoViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]