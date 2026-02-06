from django.contrib import admin
from modeltranslation.admin import TranslationAdmin
from .models import News
from django_ckeditor_5.widgets import CKEditor5Widget
from django.db import models

@admin.register(News)
class NewsAdmin(TranslationAdmin):
    list_display = ('title', 'date', 'category', 'author')
    list_filter = ('category', 'date', 'author')
    search_fields = ('title', 'description')
    date_hierarchy = 'date'
    
    # Enable ModelTranslation tabs
    group_fieldsets = True 
    
    # Ensure CKEditor works with translated fields
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
