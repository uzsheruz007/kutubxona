from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'
        extra_kwargs = {
            'title': {'required': False},
            'author': {'required': False},
            'description': {'required': False},
            'subjects': {'required': False}
        }

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Force HTTPS for cover_image if it exists and starts with http:
        if representation.get('cover_image'):
            url = representation['cover_image']
            if url.startswith('http:'):
                representation['cover_image'] = url.replace('http:', 'https:', 1)
        
        # Force HTTPS for file_url if it exists
        if representation.get('file'):
            url = representation['file']
            if url.startswith('http:'):
                representation['file'] = url.replace('http:', 'https:', 1)

        # Force HTTPS for qr_code if it exists
        if representation.get('qr_code'):
            url = representation['qr_code']
            if url.startswith('http:'):
                representation['qr_code'] = url.replace('http:', 'https:', 1)

        return representation
