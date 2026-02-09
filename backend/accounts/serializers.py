from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(request=self.context.get('request'), username=username, password=password)
            if not user:
                raise serializers.ValidationError("Login yoki parol noto'g'ri.", code='authorization')
        else:
            raise serializers.ValidationError("Login va parol kiritilishi shart.", code='authorization')
        
        data['user'] = user
        return data

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        # We can add password validators here if needed
        return value

class UserSerializer(serializers.ModelSerializer):
    user_type = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    favourites = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'user_type', 'avatar', 'favourites', 'date_joined', 'is_staff', 'is_superuser']
        
    def get_user_type(self, obj):
        try:
            return obj.profile.user_type
        except:
            return 'student' # Default to student if profile missing

    def get_avatar(self, obj):
        try:
            return obj.profile.avatar_url
        except:
            return None

    def get_favourites(self, obj):
        try:
            if not hasattr(obj, 'profile'):
                return []
            # Return simple list of IDs or basic info
            return [
                {
                    'id': book.id, 
                    'title': book.title, 
                    'coverUrl': book.cover_image.url if book.cover_image else None,
                    'author': book.author
                } 
                for book in obj.profile.favourites.all()
            ]
        except:
            return []
