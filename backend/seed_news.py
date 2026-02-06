import os
import django
from django.core.files.base import ContentFile
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from news.models import News

def create_dummy_news():
    if News.objects.count() > 0:
        print("News data already exists.")
        return

    data = [
        {
            "title": "Elektron kutubxonamiz ishga tushirildi",
            "description": "Endi barcha talabalar va o'qituvchilar online tarzda kitoblar o'qishi mumkin.",
            "category": "Yangilik",
            "image_url": "https://via.placeholder.com/800x600.png?text=Library+Launch"
        },
        {
            "title": "Yangi kitoblar to'plami qo'shildi",
            "description": "Falsafa va texnologiya sohalaridagi 200 dan ortiq yangi kitoblar mavjud.",
            "category": "Yangi",
            "image_url": "https://via.placeholder.com/800x600.png?text=New+Books"
        },
        {
            "title": "Kutubxonamizda o‘quvchilar uchun seminar",
            "description": "Ertaga soat 15:00 da kutubxonada yangi o‘quvchilarga seminar bo‘lib o‘tadi.",
            "category": "Tadbir",
            "image_url": "https://via.placeholder.com/800x600.png?text=Seminar"
        }
    ]

    for item in data:
        news = News(
            title=item['title'],
            description=item['description'],
            category=item['category']
        )
        # Download image
        try:
            response = requests.get(item['image_url'])
            if response.status_code == 200:
                news.image.save(f"news_{item['category']}.png", ContentFile(response.content), save=False)
        except Exception as e:
            print(f"Error downloading image: {e}")
        
        news.save()
        print(f"Created news: {news.title}")

if __name__ == "__main__":
    create_dummy_news()
