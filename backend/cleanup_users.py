
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User

def clean_database():
    users = User.objects.all()
    print(f"Total users: {users.count()}")
    
    for user in users:
        print(f"ID: {user.id}, Username: {user.username}, Name: {user.first_name} {user.last_name}")
        if "Setora" in user.first_name or "Setora" in user.last_name or "NABIYEVA" in user.last_name.upper():
            print(f"Deleting user: {user.username} ({user.first_name} {user.last_name})")
            user.delete()
            print("Deleted.")

if __name__ == '__main__':
    clean_database()
