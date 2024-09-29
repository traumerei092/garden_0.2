from rest_framework import serializers
from django.contrib.auth import get_user_model
from garden.utils import Base64ImageField

User = get_user_model()


# ユーザー情報のシリアライザ
class UserSerializer(serializers.ModelSerializer):
    # uidフィールドは読み取り専用
    uid = serializers.CharField(read_only=True)
    # Base64エンコードされた画像を受け入れるカスタムフィールド
    avatar = Base64ImageField(
        max_length=None, use_url=True, required=False, allow_null=True
    )
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['uid', 'email', 'password', 'avatar', 'introduction', 'is_active']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user