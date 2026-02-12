from django.urls import path

from .views import LoginView, ChangePasswordView, UserProfileView, HemisLoginView, HemisCallbackView, ToggleFavoriteView, UserListView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('hemis/login/', HemisLoginView.as_view(), name='hemis-url'),
    path('hemis/callback/', HemisCallbackView.as_view(), name='hemis-callback'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('favorites/<int:book_id>/', ToggleFavoriteView.as_view(), name='toggle-favorite'),
]
