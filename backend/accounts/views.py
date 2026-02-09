from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status, generics
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .serializers import LoginSerializer, UserSerializer, ChangePasswordSerializer
from .hemis_service import HemisService
from django.conf import settings
from .models import UserProfile
from books.models import Book
from django.shortcuts import get_object_or_404

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Noto'g'ri parol."]}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.data.get("new_password"))
            user.save()
            return Response({"message": "Parol muvaffaqiyatli o'zgartirildi."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HemisLoginView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user_type = request.query_params.get('user_type', 'student')
        
        if user_type == 'staff' or user_type == 'employee':
            base_url = settings.HEMIS_STAFF_URL
        else:
            base_url = settings.HEMIS_STUDENT_URL

        # Generate Hemis Authorize URL
        # URL should be https://student.samduuf.uz/oauth/authorize
        auth_url = f"{base_url}/oauth/authorize?client_id={settings.HEMIS_CLIENT_ID}&response_type=code&redirect_uri={settings.HEMIS_REDIRECT_URI}"
        
        return Response({
            "auth_url": auth_url
        })

import logging
logger = logging.getLogger(__name__)

class HemisCallbackView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get('code')
        if not code:
            logger.error("HemisCallbackView: Code is missing")
            return Response({'error': 'Code is required'}, status=status.HTTP_400_BAD_REQUEST)

        logger.info(f"HemisCallbackView: Received code {code[:5]}...")

        # 1. Exchange code for access token
        try:
            token_data = HemisService.exchange_code_for_token(code)
        except Exception as e:
            logger.error(f"HemisCallbackView: exchange_code_for_token failed: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not token_data or 'access_token' not in token_data:
            logger.error(f"HemisCallbackView: Failed to get token. Data: {token_data}")
            return Response({'error': 'Failed to get access token from Hemis'}, status=status.HTTP_400_BAD_REQUEST)

        access_token = token_data['access_token']
        found_domain = token_data.get('found_domain')
        logger.info(f"HemisCallbackView: Token obtained. Domain: {found_domain}")

        # 2. Get User Info
        try:
            user_info = HemisService.get_user_info(access_token, base_domain=found_domain)
        except Exception as e:
             logger.error(f"HemisCallbackView: get_user_info failed: {e}")
             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not user_info:
            logger.error("HemisCallbackView: User info is empty")
            return Response({'error': 'Failed to get user info from Hemis'}, status=status.HTTP_400_BAD_REQUEST)
            
        logger.info(f"HemisCallbackView: User info received: {user_info.get('id', 'Unknown')}")

        user_type = user_info.get('type', 'student') 
        # Note: Hemis API might return 'type' or we infer it. 
        # Usually user_info has structure. Let's assume standard Hemis response.
        if 'employee_id_number' in user_info:
            user_type = 'employee'
        elif 'student_id_number' in user_info:
            user_type = 'student'
        
        logger.info(f"HemisCallbackView: Determined user_type: {user_type}")

        # 3. Create or Update User
        try:
            result = HemisService.get_or_create_user(user_info, user_type=user_type, found_domain=found_domain)
        except Exception as e:
            logger.error(f"HemisCallbackView: get_or_create_user failed: {e}")
            return Response({'error': f"Create user failed: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not result:
             logger.error("HemisCallbackView: result from get_or_create_user is None")
             return Response({'error': 'Failed to create user'}, status=status.HTTP_400_BAD_REQUEST)
             
        user, token = result
        
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })

class ToggleFavoriteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, book_id):
        book = get_object_or_404(Book, id=book_id)
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        
        if profile.favourites.filter(id=book_id).exists():
            profile.favourites.remove(book)
            return Response({'status': 'removed', 'message': 'Sevimlilardan olib tashlandi'})
        else:
            profile.favourites.add(book)
            return Response({'status': 'added', 'message': 'Sevimlilarga qo\'shildi'})

class UserListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated] # Or IsAdminUser
    queryset = User.objects.all()
    serializer_class = UserSerializer

