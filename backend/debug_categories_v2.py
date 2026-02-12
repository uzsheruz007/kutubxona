import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from books.models import Book

print("--- Checking Book Categories ---")
books = Book.objects.all()[:10]
for book in books:
    print(f"ID: {book.id} | Title: {book.title}")
    print(f"  Category (Base): {book.category}")
    print(f"  Category (UZ): {getattr(book, 'category_uz', 'N/A')}")
    print(f"  Category (RU): {getattr(book, 'category_ru', 'N/A')}")
    print(f"  Category (EN): {getattr(book, 'category_en', 'N/A')}")
    print("-" * 30)
