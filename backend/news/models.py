from django.db import models
from django.utils import timezone
from django_ckeditor_5.fields import CKEditor5Field

class News(models.Model):
    CATEGORY_CHOICES = [
        ('Yangilik', 'Yangilik'),
        ("E'lon", "E'lon"),
        ('Tadbir', 'Tadbir'),
        ('Yangi', 'Yangi'),
        ('Texnik', 'Texnik'),
        ('Xizmat', 'Xizmat'),
    ]

    title = models.CharField("Sarlavha", max_length=255)
    description = CKEditor5Field('Maqola Matni', config_name='extends')
    image = models.ImageField("Rasm", upload_to='news/')
    date = models.DateField("Sana", default=timezone.now)
    category = models.CharField("Kategoriya", max_length=20, choices=CATEGORY_CHOICES, default='Yangilik')
    author = models.CharField("Muallif", max_length=50, default='Admin')

    class Meta:
        verbose_name = 'Yangilik'
        verbose_name_plural = 'Yangiliklar'
        ordering = ['-date']

    def __str__(self):
        return self.title
