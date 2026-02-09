from django.db import models
from django_ckeditor_5.fields import CKEditor5Field

class Book(models.Model):
    # Core Info
    title = models.CharField("Kitob Nomi", max_length=255)
    author = models.CharField("Muallif(lar)", max_length=255)
    description = CKEditor5Field("Annotatsiya", config_name='extends')
    
    # Categorization
    CATEGORY_CHOICES = [
        ('Adabiyotlar', 'Adabiyotlar'),
        ('Darslik', 'Darslik'),
        ('Ilmiy', 'Ilmiy Adabiyot'),
        ('Oquv', 'O\'quv adabiyotlar'),
        ('Barchasi', 'Barchasi'),
    ]
    category = models.CharField("Kategoriya", max_length=50, choices=CATEGORY_CHOICES, default='Adabiyotlar')
    
    # Metadata
    page_count = models.IntegerField("Betlar Soni", default=0)
    published_date = models.DateField("Chop Etilgan Sana", null=True, blank=True)
    subjects = models.TextField("Mavzular (Teglar)", help_text="Vergul bilan ajratib yozing: Tarix, Roman, Klassika")
    
    # Media
    cover_image = models.ImageField("Muqova Rasmi", upload_to='books/covers/')
    qr_code = models.ImageField("QR Kod (Rasm)", upload_to='books/qrcodes/', null=True, blank=True)
    file = models.FileField("Kitob Fayli (PDF/EPUB)", upload_to='books/files/', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Kitob"
        verbose_name_plural = "Kitoblar"
        ordering = ['-created_at']

    def __str__(self):
        return self.title
