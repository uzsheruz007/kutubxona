from rest_framework import serializers
from .models import News

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'
        extra_kwargs = {
            'title': {'required': False},
            'description': {'required': False}
        }

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Force HTTPS for image if it exists and starts with http:
        if representation.get('image'):
            url = representation['image']
            if url.startswith('http:'):
                representation['image'] = url.replace('http:', 'https:', 1)
        return representation
