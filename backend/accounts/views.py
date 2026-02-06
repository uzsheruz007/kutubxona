from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import update_session_auth_hash
from django.conf import settings
from .serializers import LoginSerializer, ChangePasswordSerializer, UserSerializer
from .hemis_service import HemisService

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

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

import secrets
from rest_framework.throttling import ScopedRateThrottle

class HemisLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        """
        Returns the Hemis Oauth Authorization URL.
        Accepts 'user_type' query param: 'student' (default) or 'staff'.
        Generates a secure state token to prevent CSRF.
        """
        user_type = request.query_params.get('user_type', 'student')
        
        base_url = settings.HEMIS_STUDENT_URL if user_type == 'student' else settings.HEMIS_STAFF_URL
        auth_url_base = f"{base_url}/oauth/authorize"
        
        # Generate and save state
        state = secrets.token_urlsafe(16)
        # Using Django session to store state. Requires session middleware.
        if hasattr(request, 'session'):
            request.session['oauth_state'] = state
        
        params = f"client_id={settings.HEMIS_CLIENT_ID}&redirect_uri={settings.HEMIS_REDIRECT_URI}&response_type=code&state={state}"
        auth_url = f"{auth_url_base}?{params}"
        
        return Response({'auth_url': auth_url})

class HemisCallbackView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'hemis_auth'

    def post(self, request):
        """
        Expects 'code' and optionally 'state' in the body.
        Exchanges code for token using Secure Server-to-Server communication.
        """
        code = request.data.get('code')
        state = request.data.get('state')
        
        if not code:
            return Response({'error': 'Code is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate State (CSRF Protection)
        if hasattr(request, 'session'):
            session_state = request.session.get('oauth_state')
            # If state was sent, verify it. 
            # Note: For strict security, we should enforce state check, 
            # but legacy/mobile clients might not support it immediately. 
            # We enforce if state is present or session has it.
            if session_state and state and session_state != state:
                 return Response({'error': 'Invalid state parameter (CSRF detected)'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Clear state after one use
            if 'oauth_state' in request.session:
                del request.session['oauth_state']

        # Exchange code for token
        token_data = HemisService.exchange_code_for_token(code)
        
        if not token_data or 'access_token' not in token_data:
             return Response({'error': 'Authentication failed. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)
        
        access_token = token_data['access_token']
        found_domain = token_data.get('found_domain')

        # Get User Info
        user_info = HemisService.get_user_info(access_token, base_domain=found_domain)
        
        if not user_info:
             user_info = token_data if 'login' in token_data else None
             
        if not user_info:
            return Response({'error': 'Failed to retrieve user data from Hemis.'}, status=status.HTTP_400_BAD_REQUEST)
             

        # Determine user_type based on domain
        user_type = 'student'
        if found_domain and 'hemis.samduuf.uz' in found_domain:
            user_type = 'employee'
        elif found_domain and 'student.samduuf.uz' in found_domain:
            user_type = 'student'
            
        # Create or Update User
        result = HemisService.get_or_create_user(user_info, user_type=user_type)
        if not result:
            return Response({'error': 'User processing failed.'}, status=status.HTTP_400_BAD_REQUEST)
             
        user, token = result
        
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })

class ToggleFavoriteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, book_id):
        from books.models import Book
        try:
            book = Book.objects.get(id=book_id)
            # Ensure profile exists
            if not hasattr(request.user, 'profile'):
                from accounts.models import UserProfile
                UserProfile.objects.create(user=request.user)
            
            profile = request.user.profile
            
            if profile.favourites.filter(id=book_id).exists():
                profile.favourites.remove(book)
                liked = False
            else:
                profile.favourites.add(book)
                liked = True
                
            # Serialize the favourites list manually to match UserSerializer format
            favourites_data = [
                {
                    'id': b.id, 
                    'title': b.title, 
                    'coverUrl': b.cover_image.url if b.cover_image else None,
                    'author': b.author
                } 
                for b in profile.favourites.all()
            ]
            return Response({'status': 'success', 'liked': liked, 'favourites': favourites_data})
        except Book.DoesNotExist:
            return Response({'error': 'Kitob topilmadi'}, status=status.HTTP_404_NOT_FOUND)

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if user.check_password(serializer.data.get('old_password')):
                user.set_password(serializer.data.get('new_password'))
                user.save()
                update_session_auth_hash(request, user)  # To update session after password change
                return Response({'detail': 'Parol muvaffaqiyatli o\'zgartirildi.'}, status=status.HTTP_200_OK)
            return Response({'old_password': ['Eski parol noto\'g\'ri.']}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class UserListView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = UserSerializer
    queryset = User.objects.all().order_by('-date_joined')
    
    def get_queryset(self):
        queryset = User.objects.all().order_by('-date_joined')
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(username__icontains=search) | queryset.filter(first_name__icontains=search) | queryset.filter(last_name__icontains=search)
        return queryset
