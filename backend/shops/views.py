from django.db.models import Q
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Shop, ShopType, ShopConcept, ShopLayout, ShopPhoto, Review
from .serializers import ShopSerializer, ShopTypeSerializer, ShopConceptSerializer, ShopLayoutSerializer, \
    ShopPhotoSerializer, ReviewSerializer
import logging

logger = logging.getLogger(__name__)

class ShopViewSet(viewsets.ModelViewSet):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]# AllowAny から変更

    def retrieve(self, request, *args, **kwargs):
        logger.info(f"Retrieving shop with pk: {kwargs.get('pk')}")
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            logger.info(f"Shop data: {serializer.data}")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error retrieving shop: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

    def get_queryset(self):
        queryset = Shop.objects.all()
        keyword = self.request.query_params.get('keyword', None)
        types = self.request.query_params.get('types', None)
        concepts = self.request.query_params.get('concepts', None)
        layouts = self.request.query_params.get('layouts', None)
        region = self.request.query_params.get('region', None)
        prefecture = self.request.query_params.get('prefecture', None)
        city = self.request.query_params.get('city', None)
        lat = self.request.query_params.get('lat', None)
        lon = self.request.query_params.get('lon', None)

        logger.info(
            f"Search params: keyword={keyword}, types={types}, concepts={concepts}, layouts={layouts}, region={region}, prefecture={prefecture}, city={city}, lat={lat}, lon={lon}")

        if keyword:
            queryset = queryset.filter(
                Q(name__icontains=keyword) |
                Q(address__prefecture__icontains=keyword) |
                Q(address__city__icontains=keyword) |
                Q(address__town__icontains=keyword)
            )

        if types:
            type_list = types.split(',')
            queryset = queryset.filter(types__id__in=type_list)

        if concepts:
            concept_list = concepts.split(',')
            queryset = queryset.filter(concepts__id__in=concept_list)

        if layouts:
            layout_list = layouts.split(',')
            queryset = queryset.filter(layouts__id__in=layout_list)

        if city:
            queryset = queryset.filter(address__city=city)
        elif prefecture:
            queryset = queryset.filter(address__prefecture=prefecture)
        elif region:
            queryset = queryset.filter(address__prefecture__icontains=region)

        # NOTE: lat と lon を使用した距離に基づくフィルタリングはここに実装できます
        # 例: PostgreSQLを使用している場合、PostGISを利用して距離計算ができます

        return queryset.distinct()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        logger.info(f"Returning {len(serializer.data)} shops")
        logger.info(f"Sample shop data: {serializer.data[0] if serializer.data else 'No shops'}")  # サンプルデータをログ出力
        return Response(serializer.data)

    def perform_create(self, serializer):
        shop = serializer.save()
        shop.geocode_address()
        shop.save()

    def create(self, request, *args, **kwargs):
        logger.info(f"Received data: {request.data}")
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)



class ShopTypeViewSet(viewsets.ModelViewSet):
    queryset = ShopType.objects.all()
    serializer_class = ShopTypeSerializer
    permission_classes = [AllowAny]

class ShopConceptViewSet(viewsets.ModelViewSet):
    queryset = ShopConcept.objects.all()
    serializer_class = ShopConceptSerializer
    permission_classes = [AllowAny]

class ShopLayoutViewSet(viewsets.ModelViewSet):
    queryset = ShopLayout.objects.all()
    serializer_class = ShopLayoutSerializer
    permission_classes = [AllowAny]

class ShopPhotoViewSet(viewsets.ModelViewSet):
    queryset = ShopPhoto.objects.all()
    serializer_class = ShopPhotoSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Review.objects.all()
        shop_id = self.request.query_params.get('shop_id', None)
        if shop_id is not None:
            queryset = queryset.filter(shop_id=shop_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)