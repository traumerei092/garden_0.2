from rest_framework import serializers
from .models import Shop, ShopType, ShopConcept, ShopLayout, ShopPhoto, Address, Review, ReviewPhoto


class ShopTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopType
        fields = ['id', 'name']

class ShopConceptSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopConcept
        fields = ['id', 'name']

class ShopLayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopLayout
        fields = ['id', 'name']

class ShopPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopPhoto
        fields = ['id', 'image', 'caption', 'uploaded_by', 'uploaded_at']

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['postal_code', 'prefecture', 'city', 'district', 'town', 'street_address', 'building']

class ShopSerializer(serializers.ModelSerializer):
    types = serializers.PrimaryKeyRelatedField(many=True, queryset=ShopType.objects.all(), required=False)
    concepts = serializers.PrimaryKeyRelatedField(many=True, queryset=ShopConcept.objects.all(), required=False)
    layouts = serializers.PrimaryKeyRelatedField(many=True, queryset=ShopLayout.objects.all(), required=False)
    icon_image = serializers.ImageField(required=False)
    address = AddressSerializer()

    address = AddressSerializer()
    types = serializers.PrimaryKeyRelatedField(many=True, queryset=ShopType.objects.all(), required=False)
    concepts = serializers.PrimaryKeyRelatedField(many=True, queryset=ShopConcept.objects.all(), required=False)
    layouts = serializers.PrimaryKeyRelatedField(many=True, queryset=ShopLayout.objects.all(), required=False)
    icon_image = serializers.ImageField(required=False)

    class Meta:
        model = Shop
        fields = [
            'id', 'name', 'address', 'phone_number', 'latitude', 'longitude', 'seat_count',
            'capacity', 'opening_hours', 'types', 'concepts', 'layouts', 'icon_image'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        address_data = validated_data.pop('address')
        types = validated_data.pop('types', [])
        concepts = validated_data.pop('concepts', [])
        layouts = validated_data.pop('layouts', [])

        address = Address.objects.create(**address_data)
        shop = Shop.objects.create(address=address, created_by=self.context['request'].user, **validated_data)

        shop.types.set(types)
        shop.concepts.set(concepts)
        shop.layouts.set(layouts)
        return shop

    def to_internal_value(self, data):
        seat_count = data.get('seat_count')
        capacity = data.get('capacity')

        if seat_count is not None:
            data['seat_count'] = int(seat_count)
        if capacity is not None:
            data['capacity'] = int(capacity)

        return super().to_internal_value(data)


class ReviewPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewPhoto
        fields = ['id', 'image', 'uploaded_at']

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    photos = ReviewPhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'shop', 'user', 'title', 'content', 'likes', 'created_at', 'updated_at', 'photos']
        read_only_fields = ['user', 'likes', 'created_at', 'updated_at']

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data.pop('user', None)
        review = Review.objects.create(user=user, **validated_data)
        return review