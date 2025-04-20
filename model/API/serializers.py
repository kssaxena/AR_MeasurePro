from rest_framework import serializers
from .models import ImageSegmentation, Image, Measurement

class OutputImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageSegmentation
        fields = ('uuid', 'name', 'input_image', 'verified', 'created_at', 'updated_at')

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ('property_id', 'image')

class MeasurementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Measurement
        fields = ('uuid', 'neck', 'chest', 'waist', 'hip', 'height', 'arm', 'leg')