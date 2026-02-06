from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, LibraryStatsView, PopularBooksView, AdminDashboardStatsView

router = DefaultRouter()
router.register(r'books', BookViewSet)

urlpatterns = [
    path('books/stats/', LibraryStatsView.as_view(), name='library-stats'),
    path('books/admin/stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    path('books/popular/', PopularBooksView.as_view(), name='popular-books'),
    path('', include(router.urls)),
]
