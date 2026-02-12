import os
import django
from django.core.management.base import BaseCommand
from django.conf import settings
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, filters
from django.db.models import Q
from books.models import Book
import logging

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

class Command(BaseCommand):
    help = 'Runs the Telegram bot'

    def handle(self, *args, **options):
        # 1. Get Token from Environment or Settings
        TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")

        if not TOKEN:
            self.stdout.write(self.style.ERROR("Error: TELEGRAM_BOT_TOKEN is not set in environment!"))
            return

        self.stdout.write(self.style.SUCCESS("Starting Telegram Bot..."))

        # 2. Build Application
        application = ApplicationBuilder().token(TOKEN).build()

        # 3. Add Handlers
        start_handler = CommandHandler('start', self.start)
        search_handler = MessageHandler(filters.TEXT & (~filters.COMMAND), self.handle_message)

        application.add_handler(start_handler)
        application.add_handler(search_handler)

        # 4. Run Polling
        application.run_polling()

    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        user = update.effective_user
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text=f"Assalomu alaykum, {user.first_name}! 📚\n\n"
                 f"Men SamDUUF Elektron Kutubxonasi botiman.\n"
                 f"Menga kitob nomini, muallifini yoki mavzusini yozing, men sizga topib beraman.\n\n"
                 f"Masalan: *Python*, *Navoiy*, *Tarix*"
                 , parse_mode='Markdown'
        )

    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        query = update.message.text
        if len(query) < 3:
            await update.message.reply_text("Iltimos, qidirish uchun kamida 3 ta harf kiriting.")
            return

        await context.bot.send_chat_action(chat_id=update.effective_chat.id, action='typing')

        try:
            books = await search_books(query)

            if not books:
                await update.message.reply_text("Afsuski, hech qanday kitob topilmadi. 😔\nBoshqa so'z bilan urinib ko'ring.")
                return

            for book in books:
                # Construct Caption
                caption = f"📖 *{book.title}*\n" \
                          f"👤 *Muallif:* {book.author}\n" \
                          f"📂 *Kategoriya:* {book.category}\n" 
                
                # Add link if file exists or just to site
                link = f"https://e-library.samduuf.uz/book/{book.id}"
                
                keyboard = [[InlineKeyboardButton("📖 O'qish (Saytda)", url=link)]]
                reply_markup = InlineKeyboardMarkup(keyboard)

                # Send Cover Image if exists
                if book.cover_image:
                    try:
                        # We need absolute path or URL. For local dev, file path works if bot is local.
                        # Ideally use full URL.
                        image_path = book.cover_image.path 
                        if os.path.exists(image_path):
                            with open(image_path, 'rb') as photo:
                                await update.message.reply_photo(
                                    photo=photo,
                                    caption=caption,
                                    parse_mode='Markdown',
                                    reply_markup=reply_markup
                                )
                        else:
                            await update.message.reply_text(f"{caption}\n[Rasm topilmadi]", parse_mode='Markdown', reply_markup=reply_markup)
                    except Exception as e:
                        logging.error(f"Error sending photo: {e}")
                        await update.message.reply_text(caption, parse_mode='Markdown', reply_markup=reply_markup)
                else:
                    await update.message.reply_text(caption, parse_mode='Markdown', reply_markup=reply_markup)
        except Exception as e:
            logging.error(f"Search error: {e}")
            await update.message.reply_text("Qidirishda xatolik yuz berdi. Iltimos keyinroq urinib ko'ring.")

from asgiref.sync import sync_to_async

@sync_to_async
def search_books(q):
    # Using Q objects to search multiple fields and languages
    results = Book.objects.filter(
        Q(title__icontains=q) |
        Q(author__icontains=q) |
        Q(description__icontains=q) |
        # Translated fields (if modeltranslation is active, these fields exist)
        Q(title_uz__icontains=q) |
        Q(title_ru__icontains=q) |
        Q(title_en__icontains=q) |
        Q(description_uz__icontains=q) |
        Q(description_ru__icontains=q) |
        Q(description_en__icontains=q)
    ).distinct()[:5] # Limit to 5 results
    return list(results)
