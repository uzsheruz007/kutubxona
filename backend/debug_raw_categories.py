import os
import django
import sys

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from books.models import Book

print("--- Checking Book Raw Categories ---")
books = Book.objects.all()[:20]
for book in books:
    print(f"ID: {book.id} | Title: {book.title}")
    # Inspect internal dictionary to bypass descriptor
    print(f"  Raw Dict Category: {book.__dict__.get('category', 'N/A')}")
    print(f"  Raw Dict Category_uz: {book.__dict__.get('category_uz', 'N/A')}")
    print(f"  Raw Dict Category_ru: {book.__dict__.get('category_ru', 'N/A')}")
    print(f"  Model Access Category: {book.category}")
    print("-" * 30)
