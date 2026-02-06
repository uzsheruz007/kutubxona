
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from django.contrib.auth.models import User
if not User.objects.filter(username='testuser').exists():
    User.objects.create_user('testuser', 'test@example.com', 'oldpassword123')
    print("User 'testuser' created.")
else:
    u = User.objects.get(username='testuser')
    u.set_password('oldpassword123')
    u.save()
    print("User 'testuser' reset.")
