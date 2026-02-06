from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from books.models import Book
from news.models import News

User = get_user_model()
username = 'SamDUUF_kutubxona'
password = 'Samduuf@2026#kutubxona'

# Get or Create User
try:
    user = User.objects.get(username=username)
    print(f"User {username} already exists. Updating details...")
except User.DoesNotExist:
    user = User.objects.create_user(username=username)
    print(f"User {username} created.")

user.set_password(password)
user.is_staff = True
user.is_superuser = False  # Explicitly standard admin, not superuser
user.save()

# Assign Permissions (Books and News)
content_type_book = ContentType.objects.get_for_model(Book)
content_type_news = ContentType.objects.get_for_model(News)

permissions = Permission.objects.filter(content_type__in=[content_type_book, content_type_news])

user.user_permissions.set(permissions)
user.save()

print(f"User {username} configured with staff permissions for Books and News.")
