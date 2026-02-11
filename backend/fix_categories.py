
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from books.models import Book

print("Fixing categories...")
books = Book.objects.all()
count = 0
for book in books:
    # Get the value from wherever it might be
    cat = book.category_uz or book.category_ru or book.category_en or book.category
    
    if cat:
        # Set it to all fields
        book.category_uz = cat
        book.category_ru = cat
        book.category_en = cat
        book.save()
        count += 1

print(f"Updated {count} books.")
