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
    address = AddressSerializer()
    types = serializers.PrimaryKeyRelatedField(many=True, queryset=ShopType.objects.all(), required=False)
    concepts = serializers.PrimaryKeyRelatedField(many=True, queryset=ShopConcept.objects.all(), required=False)
    layouts = serializers.PrimaryKeyRelatedField(many=True, queryset=ShopLayout.objects.all(), required=False)
    icon_image = serializers.ImageField(required=False)
    seat_count = serializers.IntegerField(min_value=0)
    capacity = serializers.IntegerField(min_value=0)

    class Meta:
        model = Shop
        fields = [
            'id', 'name', 'address', 'phone_number', 'latitude', 'longitude', 'seat_count',
            'capacity', 'opening_hours', 'types', 'concepts', 'layouts', 'icon_image'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        print("Validated data in create method:", validated_data)
        address_data = validated_data.pop('address')
        types_data = validated_data.pop('types', [])
        concepts_data = validated_data.pop('concepts', [])
        layouts_data = validated_data.pop('layouts', [])

        print("Types data:", types_data)
        print("Concepts data:", concepts_data)
        print("Layouts data:", layouts_data)

        address = Address.objects.create(**address_data)
        shop = Shop.objects.create(address=address, created_by=self.context['request'].user, **validated_data)

        shop.types.set(types_data)
        shop.concepts.set(concepts_data)
        shop.layouts.set(layouts_data)
        return shop

    def update(self, instance, validated_data):
        address_data = validated_data.pop('address', None)
        types_data = validated_data.pop('types', None)
        concepts_data = validated_data.pop('concepts', None)
        layouts_data = validated_data.pop('layouts', None)

        if address_data:
            address_serializer = self.fields['address']
            address_instance = instance.address
            address_serializer.update(address_instance, address_data)

        if types_data is not None:
            instance.types.set(types_data)
        if concepts_data is not None:
            instance.concepts.set(concepts_data)
        if layouts_data is not None:
            instance.layouts.set(layouts_data)

        return super().update(instance, validated_data)


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