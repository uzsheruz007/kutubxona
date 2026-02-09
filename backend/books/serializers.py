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
