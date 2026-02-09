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

    def save(self, *args, **kwargs):
        # 1. Save first to ensure we have an ID
        is_new = self._state.adding
        super().save(*args, **kwargs)

        # 2. Generate QR Code if it's new or doesn't exist (or always if you want to ensure it matches)
        if is_new or not self.qr_code:
            import qrcode
            from io import BytesIO
            from django.core.files import File

            # Public URL for the book
            # Ensure this matches your frontend route
            url = f"https://e-library.samduuf.uz/books/{self.id}"
            
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(url)
            qr.make(fit=True)

            img = qr.make_image(fill_color="black", back_color="white")
            
            # Save to buffer
            buffer = BytesIO()
            img.save(buffer, format="PNG")
            
            # Save to model field
            filename = f"qr_book_{self.id}.png"
            self.qr_code.save(filename, File(buffer), save=False)
            
            # Save again to persist the image field change
            super().save(update_fields=['qr_code'])
