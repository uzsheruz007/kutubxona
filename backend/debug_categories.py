
import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from books.models import Book

print("-" * 30)
print("DEBUGGING CATEGORIES")
print("-" * 30)

all_books = Book.objects.all()
print(f"Total books: {all_books.count()}")

categories = Book.objects.values_list('category', flat=True).distinct()
print("\nUnique categories found in DB:")
for cat in categories:
    count = Book.objects.filter(category=cat).count()
    print(f"  - '{cat}' (Length: {len(cat)}): {count} books")

print("\nChecking specifically for 'Darslik':")
darslik_books = Book.objects.filter(category__iexact='Darslik')
print(f"  - IEact match count: {darslik_books.count()}")

darslik_books_exact = Book.objects.filter(category='Darslik')
print(f"  - Exact match count: {darslik_books_exact.count()}")

contains_darslik = Book.objects.filter(category__icontains='Darslik')
print(f"  - IContains match count: {contains_darslik.count()}")

print("-" * 30)
