from django.contrib import admin
from modeltranslation.admin import TranslationAdmin
from .models import Book
from django_ckeditor_5.widgets import CKEditor5Widget
from django.db import models

@admin.register(Book)
class BookAdmin(TranslationAdmin):
    list_display = ('title', 'author', 'category', 'resource_type', 'published_date')
    list_filter = ('category', 'resource_type', 'author', 'published_date')
    search_fields = ('title', 'author', 'description', 'subjects')
    
    group_fieldsets = True
    
    formfield_overrides = {
        models.TextField: {'widget': CKEditor5Widget(config_name='extends')},
    }

    class Media:
        js = (
            'https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js',
            'https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js',
            'modeltranslation/js/tabbed_translation_fields.js',
        )
        css = {
            'screen': ('modeltranslation/css/tabbed_translation_fields.css',),
        }
