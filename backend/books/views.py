from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.utils import timezone
from .models import Book
from .serializers import BookSerializer
import datetime
from django.db.models import Count

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def get_queryset(self):
        queryset = Book.objects.all()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__iexact=category)
        return queryset

class LibraryStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        total_books = Book.objects.count()
        # Count distinct categories actually in use
        categories = Book.objects.values('category').distinct().count()
        # Ensure at least non-zero if we have books but no categories set (default is 'Badiiy')
        if total_books > 0 and categories == 0:
            categories = 1
            
        users = User.objects.count()
        
        # New books in last 30 days
        month_ago = timezone.now() - datetime.timedelta(days=30)
        new_books = Book.objects.filter(created_at__gte=month_ago).count()
        new_books = Book.objects.filter(created_at__gte=month_ago).count()
        
        return Response({
            "totalBooks": total_books,
            "categories": categories,
            "users": users,
            "newBooks": new_books
        })

from rest_framework.permissions import IsAdminUser
class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_books = Book.objects.count()
        total_users = User.objects.count()
        new_users_today = User.objects.filter(date_joined__date=timezone.now().date()).count()
        
        # Books by category distribution
        category_stats = Book.objects.values('category').annotate(count=Count('id')).order_by('-count')
        
        return Response({
            "totalBooks": total_books,
            "totalUsers": total_users,
            "newUsersToday": new_users_today,
            "categoryStats": category_stats
        })


class PopularBooksView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Top 6 books by favorite count
        books = Book.objects.annotate(like_count=Count('favorited_by')).order_by('-like_count')[:6]
        serializer = BookSerializer(books, many=True, context={'request': request})
        return Response(serializer.data)
