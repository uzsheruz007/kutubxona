from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar_url = models.URLField(max_length=500, blank=True, null=True)
    hemis_id = models.CharField(max_length=100, blank=True, null=True)
    favourites = models.ManyToManyField('books.Book', related_name='favorited_by', blank=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
