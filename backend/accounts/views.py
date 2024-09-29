import logging
from django.contrib.auth import get_user_model
from rest_framework.generics import RetrieveAPIView, CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .serializers import UserSerializer

logger = logging.getLogger(__name__)

User = get_user_model()


# ユーザー詳細
class UserDetailView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)
    lookup_field = "uid"

    def get(self, request, *args, **kwargs):
        logger.debug(f"Received GET request with data: {request.query_params}")
        response = super().get(request, *args, **kwargs)
        logger.debug(f"Response data: {response.data}")
        return response


# ユーザー作成
class UserCreateView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        logger.debug(f"Received data for user creation: {request.data}")
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = serializer.save()
            logger.info(f"User created successfully: {user}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception(f"Error during user creation: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class JWTCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        logger.debug(f"JWT Create Request Data: {request.data}")
        # 既存の処理に続けて追加...
        return Response({"message": "JWT created successfully"}, status=status.HTTP_200_OK)
