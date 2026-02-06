from django.core.management.base import BaseCommand
from books.models import Book
from django.core.files.base import ContentFile
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Seeds the database with 10 multilingual test books'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding books...')
        
        # Data for 10 books
        books_data = [
            {
                "title": {"uz": "Otkan kunlar", "ru": "Минувшие дни", "en": "Bygone Days"},
                "author": {"uz": "Abdulla Qodiriy", "ru": "Абдулла Кадыри", "en": "Abdulla Qodiriy"},
                "description": {
                    "uz": "O'zbek adabiyotining birinchi romani. Otabek va Kumushning fojiali  sevgi qissasi.",
                    "ru": "Первый роман узбекской литературы. Трагическая история любви Отабека и Кумуш.",
                    "en": "The first novel of Uzbek literature. The tragic love story of Otabek and Kumush."
                },
                "category": {"uz": "Badiiy", "ru": "Художественная", "en": "Fiction"},
                "resource_type": {"uz": "Kitob", "ru": "Книга", "en": "Book"},
                "subjects": {"uz": "Tarix, Sevgi, Klassika", "ru": "История, Любовь, Классика", "en": "History, Love, Classic"},
                "page_count": 450
            },
            {
                "title": {"uz": "Sariq devni minib", "ru": "Верхом на желтом диве", "en": "Riding the Yellow Giant"},
                "author": {"uz": "Xudoyberdi To'xtaboyev", "ru": "Худойберди Тухтабоев", "en": "Xudoyberdi Tukhtaboyev"},
                "description": {
                    "uz": "Sarguzasht asar, bolalar uchun qiziqarli voqealar.",
                    "ru": "Приключенческое произведение, интересные истории для детей.",
                    "en": "An adventure story, interesting events for children."
                },
                "category": {"uz": "Bolalar", "ru": "Детская", "en": "Children"},
                "resource_type": {"uz": "Kitob", "ru": "Книга", "en": "Book"},
                "subjects": {"uz": "Sarguzasht, Bolalar, Sehr", "ru": "Приключения, Дети, Магия", "en": "Adventure, Children, Magic"},
                "page_count": 320
            },
            {
                "title": {"uz": "Python asoslari", "ru": "Основы Python", "en": "Python Fundamentals"},
                "author": {"uz": "Anvar Narzullayev", "ru": "Анвар Нарзуллаев", "en": "Anvar Narzullayev"},
                "description": {
                    "uz": "Dasturlashni o'rganish uchun ajoyib qo'llanma.",
                    "ru": "Отличное пособие для изучения программирования.",
                    "en": "A great guide/manual for learning programming."
                },
                "category": {"uz": "Texnologiya", "ru": "Технологии", "en": "Technology"},
                "resource_type": {"uz": "O'quv qo'llanma", "ru": "Учебное пособие", "en": "Textbook"},
                "subjects": {"uz": "Dasturlash, IT, Python", "ru": "Программирование, IT, Python", "en": "Programming, IT, Python"},
                "page_count": 280
            },
            {
                "title": {"uz": "Alkimyogar", "ru": "Алхимик", "en": "The Alchemist"},
                "author": {"uz": "Paulo Koelo", "ru": "Пауло Коэльо", "en": "Paulo Coelho"},
                "description": {
                    "uz": "O'z taqdirini qidirayotgan cho'pon yigit haqida falsafiy asar.",
                    "ru": "Философское произведение о пастухе, ищущем свою судьбу.",
                    "en": "A philosophical work about a shepherd boy searching for his destiny."
                },
                "category": {"uz": "Jahon", "ru": "Мировая", "en": "World"},
                "resource_type": {"uz": "Kitob", "ru": "Книга", "en": "Book"},
                "subjects": {"uz": "Falsafa, Sayohat, Orzu", "ru": "Философия, Путешествие, Мечта", "en": "Philosophy, Travel, Dream"},
                "page_count": 200
            },
            {
                "title": {"uz": "Ikki eshik orasi", "ru": "Между двух дверей", "en": "Between Two Doors"},
                "author": {"uz": "O'tkir Hoshimov", "ru": "Уткир Хашимов", "en": "Utkir Hoshimov"},
                "description": {
                    "uz": "Urush davri va undan keyingi insonlar taqdiri.",
                    "ru": "Судьбы людей во время и после войны.",
                    "en": "Destinies of people during and after the war."
                },
                "category": {"uz": "Badiiy", "ru": "Художественная", "en": "Fiction"},
                "resource_type": {"uz": "Kitob", "ru": "Книга", "en": "Book"},
                "subjects": {"uz": "Urush, Taqdir, Hayaot", "ru": "Война, Судьба, Жизнь", "en": "War, Destiny, Life"},
                "page_count": 510
            },
            {
                "title": {"uz": "Stiv Jobs", "ru": "Стив Джобс", "en": "Steve Jobs"},
                "author": {"uz": "Uolter Ayzekson", "ru": "Уолтер Айзексон", "en": "Walter Isaacson"},
                "description": {
                    "uz": "Apple asoschisi Stiv Jobsning rasmiy biografiyasi.",
                    "ru": "Официальная биография Стива Джобса, основателя Apple.",
                    "en": "The official biography of Steve Jobs, founder of Apple."
                },
                "category": {"uz": "Ilmiy", "ru": "Научная", "en": "Scientific"},
                "resource_type": {"uz": "Kitob", "ru": "Книга", "en": "Book"},
                "subjects": {"uz": "Biografiya, Biznes, Texnologiya", "ru": "Биография, Бизнес, Технологии", "en": "Biography, Business, Technology"},
                "page_count": 650
            },
            {
                "title": {"uz": "Yulduzli tunlar", "ru": "Звездные ночи", "en": "Starry Nights"},
                "author": {"uz": "Pirimqul Qodirov", "ru": "Пиримкул Кадыров", "en": "Pirimqul Qodirov"},
                "description": {
                    "uz": "Bobur Mirzo hayoti va faoliyati haqida tarixiy roman.",
                    "ru": "Исторический роман о жизни и деятельности Бабура Мирзо.",
                    "en": "Historical novel about the life and activities of Babur Mirzo."
                },
                "category": {"uz": "Tarixiy", "ru": "Историческая", "en": "Historical"},
                "resource_type": {"uz": "Kitob", "ru": "Книга", "en": "Book"},
                "subjects": {"uz": "Tarix, Boburiylar, Sarkarda", "ru": "История, Бабуриды, Полководец", "en": "History, Baburids, Commander"},
                "page_count": 580
            },
            {
                "title": {"uz": "Atom odatlar", "ru": "Атомные привычки", "en": "Atomic Habits"},
                "author": {"uz": "Jeyms Klir", "ru": "Джеймс Клир", "en": "James Clear"},
                "description": {
                    "uz": "Yaxshi odatlarni shakllantirish va yomonlaridan qutulish bo'yicha qo'llanma.",
                    "ru": "Руководство по формированию хороших привычек и избавлению от плохих.",
                    "en": "A guide to building good habits and breaking bad ones."
                },
                "category": {"uz": "Psixologiya", "ru": "Психология", "en": "Psychology"},
                "resource_type": {"uz": "Kitob", "ru": "Книга", "en": "Book"},
                "subjects": {"uz": "Odat, Rivojlanish, Psixologiya", "ru": "Привычка, Развитие, Психология", "en": "Habit, Development, Psychology"},
                "page_count": 300
            },
            {
                "title": {"uz": "Ufq romani", "ru": "Роман Горизонт", "en": "Horizon Novel"},
                "author": {"uz": "Said Ahmad", "ru": "Саид Ахмад", "en": "Said Ahmad"},
                "description": {
                    "uz": "O'zbek xalqining urush yillaridagi hayoti.",
                    "ru": "Жизнь узбекского народа в годы войны.",
                    "en": "Life of the Uzbek people during the war years."
                },
                "category": {"uz": "Badiiy", "ru": "Художественная", "en": "Fiction"},
                "resource_type": {"uz": "Kitob", "ru": "Книга", "en": "Book"},
                "subjects": {"uz": "Urush, Sadoqat, Oila", "ru": "Война, Верность, Семья", "en": "War, Loyalty, Family"},
                "page_count": 420
            },
            {
                "title": {"uz": "Boy ota, kambag'al ota", "ru": "Богатый папа, бедный папа", "en": "Rich Dad Poor Dad"},
                "author": {"uz": "Robert Kiyosaki", "ru": "Роберт Кийосаки", "en": "Robert Kiyosaki"},
                "description": {
                    "uz": "Moliyaviy savodxonlik bo'yicha dunyoga mashhur kitob.",
                    "ru": "Всемирно известная книга по финансовой грамотности.",
                    "en": "World famous book on financial literacy."
                },
                "category": {"uz": "Biznes", "ru": "Бизнес", "en": "Business"},
                "resource_type": {"uz": "Kitob", "ru": "Книга", "en": "Book"},
                "subjects": {"uz": "Pul, Moliya, Investitsiya", "ru": "Деньги, Финансы, Инвестиции", "en": "Money, Finance, Investment"},
                "page_count": 280
            }
        ]

        # Dummy Image (a 1x1 pixel)
        dummy_image_content = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'

        for data in books_data:
            book = Book()
            
            # Set translated fields
            for lang in ['uz', 'ru', 'en']:
                setattr(book, f'title_{lang}', data['title'][lang])
                setattr(book, f'author_{lang}', data['author'][lang])
                setattr(book, f'description_{lang}', data['description'][lang])
                setattr(book, f'category_{lang}', data['category'][lang])
                setattr(book, f'resource_type_{lang}', data['resource_type'][lang])
                setattr(book, f'subjects_{lang}', data['subjects'][lang])
            
            # Set common fields (using 'uz' as default for base fields if needed, but modeltranslation handles accessing .title by current language)
            # Typically you set the base field to one of them or leave it, but TranslationOptions saves to _uz, _ru columns.
            # To be safe for admin ensuring base field isn't empty if required (though modeltranslation usually makes base nullable/proxy):
            book.title = data['title']['uz']
            book.author = data['author']['uz']
            book.description = data['description']['uz']
            book.category = data['category']['uz']
            book.resource_type = data['resource_type']['uz']
            book.subjects = data['subjects']['uz']
            
            book.page_count = data['page_count']
            book.published_date = timezone.now().date()
            
            # Create a dummy image file
            file_name = f"cover_{random.randint(1000, 9999)}.png"
            book.cover_image.save(file_name, ContentFile(dummy_image_content), save=False)
            
            book.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully created book: {book.title}'))
