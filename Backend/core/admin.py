"""
Django Admin Configuration for the Educational Center Management System.
Cleaned up version with improved Excel import.
"""
try:
    import pandas as pd
except ImportError:  # pragma: no cover - optional in lightweight setups
    pd = None
from io import BytesIO

from django import forms
from django.contrib import admin
from django.contrib.admin import SimpleListFilter
from io import BytesIO

from django import forms
from django.contrib import admin
from django.contrib.admin import SimpleListFilter
from django.shortcuts import render, redirect
from django.urls import path
from django.contrib import messages
from django.db import models, transaction
from django.http import HttpResponse

from .models import (
    News, NewsImage, GalleryItem, GalleryImage, Listener, Teacher, Personnel,
    Course, JournalIssue, Document, Statistics, YearlyStatistics,
    AppContent, JournalSettings,
    NewsCategory, ArtGalleryItem, Appeal, Application, AppHeroImage,
    InternationalSettings, InternationalPartner, InternationalProject,
    InternationalProjectImage, InternationalMedia
)


# Custom Admin Site Configuration
admin.site.site_header = "Markaz Boshqaruv Paneli"
admin.site.site_title = "Markaz Admin"
admin.site.index_title = "Boshqaruv Paneli"


class RichTextWidget(forms.Textarea):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if 'class' in self.attrs:
            self.attrs['class'] += ' rich-text-editor'
        else:
            self.attrs['class'] = 'rich-text-editor'

    def render(self, name, value, attrs=None, renderer=None):
        html = super().render(name, value, attrs, renderer)
        html += """
        <style>
            .cke_notification_warning {
                display: none !important;
            }
        </style>
        <script>
            (function() {
                function initCK(element) {
                    if (typeof CKEDITOR !== 'undefined') {
                        var id = element.id;
                        if (id && !CKEDITOR.instances[id] && !id.includes('__prefix__')) {
                            CKEDITOR.replace(id, { versionCheck: false });
                        }
                    } else {
                        setTimeout(function() { initCK(element); }, 100);
                    }
                }
                
                // Init existing on load
                var textareas = document.querySelectorAll('textarea.rich-text-editor');
                textareas.forEach(function(ta) { initCK(ta); });
                
                // Handle dynamically added inlines in Django Admin
                if (typeof window.ckeditor_inline_listener_added === 'undefined') {
                    window.ckeditor_inline_listener_added = true;
                    document.addEventListener('DOMContentLoaded', function() {
                        if (typeof django !== 'undefined' && django.jQuery) {
                            django.jQuery(document).on('formset:added', function(event, $row, formsetName) {
                                $row.find('textarea.rich-text-editor').each(function() {
                                    var id = this.id;
                                    if (id && typeof CKEDITOR !== 'undefined' && !CKEDITOR.instances[id]) {
                                        CKEDITOR.replace(id, { versionCheck: false });
                                    }
                                });
                            });
                        }
                    });
                }
            })();
        </script>
        """
        from django.utils.safestring import mark_safe
        return mark_safe(html)

from django.contrib.admin.widgets import AdminFileWidget

class CustomAdminFileWidget(AdminFileWidget):
    clear_checkbox_label = "O'chirish (Clear)"

class RichTextFieldsMixin:
    rich_fields = [
        'description', 'description_ru', 'description_en',
        'bio', 'bio_ru', 'bio_en',
        'biography', 'biography_ru', 'biography_en',
        'duties', 'duties_ru', 'duties_en',
        'history', 'history_ru', 'history_en',
        'structure', 'structure_ru', 'structure_en',
        'about_journal', 'about_journal_ru', 'about_journal_en',
        'article_rules_text', 'article_rules_text_ru', 'article_rules_text_en',
        'about_text', 'about_text_ru', 'about_text_en',
        'hero_description', 'hero_description_ru', 'hero_description_en',
        'content', 'content_ru', 'content_en'
    ]

    class Media:
        js = (
            'https://cdn.ckeditor.com/4.22.1/standard/ckeditor.js',
        )

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        if db_field.name in self.rich_fields:
            kwargs['widget'] = RichTextWidget()
        return super().formfield_for_dbfield(db_field, request, **kwargs)

class ExcelImportForm(forms.Form):
    """Form for Excel file import."""
    excel_file = forms.FileField(
        label="Excel fayl (.xlsx yoki .csv)",
        help_text="Yuklanadigan Excel faylni tanlang"
    )


class ListenerRecordTypeFilter(SimpleListFilter):
    """Filter listeners by record type (MO/QT)."""
    title = 'Sertifikat turi'
    parameter_name = 'record_type'

    def lookups(self, request, model_admin):
        return [
            ('MO', 'Malaka oshirish (MO)'),
            ('QT', 'Qayta tayyorlash (QT)'),
        ]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(record_type=self.value())
        return queryset


class NewsImageInline(admin.TabularInline):
    """Inline admin for News images."""
    model = NewsImage
    extra = 3
    fields = ['image', 'order']
    ordering = ['order']


@admin.register(News)
class NewsAdmin(RichTextFieldsMixin, admin.ModelAdmin):
    """Admin configuration for News model with inline images."""
    list_display = ['title', 'created_at', 'is_important', 'is_active', 'image_count']
    list_filter = ['category', 'is_important', 'is_active', 'created_at']
    search_fields = ['title', 'content']
    list_editable = ['is_important', 'is_active']
    ordering = ['-created_at']

    inlines = [NewsImageInline]

    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('title', 'title_ru', 'title_en', 'category', 'content', 'content_ru', 'content_en')
        }),
        ('Sozlamalar', {
            'fields': ('is_important', 'is_active')
        }),
    )

    def image_count(self, obj):
        return obj.images.count()
    image_count.short_description = 'Rasmlar soni'


class GalleryImageInline(admin.TabularInline):
    """Inline for gallery images."""
    model = GalleryImage
    extra = 3
    fields = ['image', 'order']
    ordering = ['order']


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    """Admin configuration for GalleryItem model - album with multiple images."""
    list_display = ['__str__', 'title', 'order', 'is_active', 'image_count', 'created_at']
    list_filter = ['is_active'] 
    list_editable = ['order', 'is_active']
    ordering = ['order', '-created_at']
    inlines = [GalleryImageInline]

    fieldsets = (
        ('Albom ma\'lumotlari', {
            'fields': ('title', 'cover_image')
        }),
        ('Sozlamalar', {
            'fields': ('order', 'is_active')
        }),
    )

    def image_count(self, obj):
        return obj.images.count()
    image_count.short_description = 'Rasmlar soni'


@admin.register(Listener)
class ListenerAdmin(admin.ModelAdmin):
    """
    Admin configuration for Listener model with bulk import.
    Supports both MO (Malaka oshirish) and QT (Qayta tayyorlash) types.
    """
    list_display = ['full_name', 'get_series_display', 'number', 'get_record_type_display', 'workplace', 'is_verified']
    list_filter = [ListenerRecordTypeFilter, 'is_verified', 'created_at']
    search_fields = ['full_name', 'number', 'workplace', 'series', 'course_type', 'record_type']
    list_editable = ['is_verified']
    ordering = ['-created_at']


    fieldsets = (
        ('Sertifikat turi', {
            'fields': ('record_type',),
            'description': 'MO = Malaka oshirish, QT = Qayta tayyorlash'
        }),
        ('Sertifikat ma\'lumotlari', {
            'fields': ('number',)
        }),
        ('Tinglovchi ma\'lumotlari', {
            'fields': ('full_name', 'workplace', 'course_type')
        }),
        ('Qo\'shimcha', {
            'fields': ('duration', 'is_verified')
        }),
    )

    change_list_template = "admin/listener_change_list.html"

    def get_series_display(self, obj):
        return obj.series or obj.record_type or 'MO'
    get_series_display.short_description = 'Seriya'
    get_series_display.admin_order_field = 'series'

    def get_record_type_display(self, obj):
        if obj.record_type == 'QT':
            return 'Qayta tayyorlash (QT)'
        return 'Malaka oshirish (MO)'
    get_record_type_display.short_description = 'Sertifikat turi'
    get_record_type_display.admin_order_field = 'record_type'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('import-excel/', self.admin_site.admin_view(self.import_excel), name='listener_import_excel'),
            path('export-excel/', self.admin_site.admin_view(self.export_excel), name='listener_export_excel'),
            path('download-template/', self.admin_site.admin_view(self.download_template), name='listener_download_template'),
        ]
        return custom_urls + urls

    def import_excel(self, request):
        """Handle Excel file import for listeners with MO/QT types."""
        if request.method == 'POST':
            form = ExcelImportForm(request.POST, request.FILES)
            if form.is_valid():
                excel_file = request.FILES['excel_file']
                record_type = request.POST.get('record_type', 'MO')

                try:
                    # Read all columns as strings to preserve leading zeros
                    df = pd.read_excel(BytesIO(excel_file.read()), dtype=str)
                    
                    found_columns = list(df.columns)
                    print(f"Excel ustunlari: {found_columns}")

                    # Flexible column mapping - supports both MO and QT formats
                    column_mapping = {
                        'full_name': ['Tinglovchi', 'F.I.SH', 'FIO', 'Ism', 'Ismi', 'F.I.O', 'Familiya'],
                        'workplace': ['Asosiy ish joyi', 'Ish joyi', 'Lavozimi', 'Tashkilot', 'Muassasa', 
                                      'Ta\'lim muassasasi', 'Qayta tayyorlagan muassasa'],
                        'course_type': ['Kursi', 'Kurs', 'Yo\'nalishi', 'Yo\'nalish', 
                                       'Qayta tayyorlash kursi', 'Kurs nomi'],
                        'series': ['Seriyasi', 'Seriya', 'Sertifikat seriyasi', 'Diplom seriyasi'],
                        'number': ['Raqami', 'Raqam', '№', 'Sertifikat raqami', 'Diplom raqami'],
                        'duration': ["O'qish muddati (davri)", "O'qish muddati", 'Muddat', 'Davri', 
                                    'Kurs davri', 'Boshlanish - tugash'],
                    }

                    # Find matching columns (case-insensitive with partial match)
                    def find_column(possible_names, df_columns):
                        df_columns_lower = {col.lower().strip(): col for col in df_columns}
                        for name in possible_names:
                            name_lower = name.lower().strip()
                            if name_lower in df_columns_lower:
                                return df_columns_lower[name_lower]
                            # Partial match
                            for col_lower, col_orig in df_columns_lower.items():
                                if name_lower in col_lower or col_lower in name_lower:
                                    return col_orig
                        return None

                    # Build actual column mapping
                    actual_mapping = {}
                    for model_field, possible_names in column_mapping.items():
                        found_col = find_column(possible_names, df.columns)
                        if found_col:
                            actual_mapping[found_col] = model_field
                            print(f"Topildi: '{found_col}' -> {model_field}")
                    
                    print(f"Topilgan ustunlar: {actual_mapping}")

                    # If full_name column not found, try first column as fallback
                    mapped_fields = set(actual_mapping.values())
                    if 'full_name' not in mapped_fields and len(df.columns) > 0:
                        # Use the very first column as full_name
                        first_col = df.columns[0]
                        actual_mapping[first_col] = 'full_name'
                        print(f"Fallback: '{first_col}' -> full_name")

                    # Show mapping info to user
                    mapping_info = ', '.join([f"'{k}'→{v}" for k, v in actual_mapping.items()])
                    unmapped = [c for c in df.columns if c not in actual_mapping]

                    created_count = 0
                    updated_count = 0
                    skipped_count = 0

                    with transaction.atomic():
                        first_row_debug = None
                        for idx, row in df.iterrows():
                            listener_data = {'record_type': record_type}

                            for excel_col, model_field in actual_mapping.items():
                                value = row[excel_col]
                                # Handle both real NaN and string 'nan'
                                if pd.notna(value) and str(value).strip().lower() != 'nan':
                                    listener_data[model_field] = str(value).strip()

                            # Debug: capture first row data
                            if first_row_debug is None:
                                first_row_debug = {col: str(row[col])[:30] for col in df.columns[:4]}

                            # Skip if no name found
                            if not listener_data.get('full_name'):
                                skipped_count += 1
                                continue

                            # Auto-generate number if missing
                            if not listener_data.get('number'):
                                listener_data['number'] = str(idx + 1).zfill(6)

                            # Auto-set series if missing
                            if not listener_data.get('series'):
                                listener_data['series'] = record_type

                            # Raqamni tekshirib to'g'rilash (masalan, "358" ni "000358" ga aylantirish)
                            if listener_data.get('number') and str(listener_data['number']).isdigit():
                                listener_data['number'] = str(listener_data['number']).zfill(6)

                            n = listener_data['number']
                            # save() always sets series=record_type, so search by that
                            lookup = {'series': record_type, 'number': n}

                            # Remove lookup fields from defaults to avoid conflicts
                            defaults = {k: v for k, v in listener_data.items()
                                        if k not in ('series', 'number')}

                            try:
                                obj, created = Listener.objects.update_or_create(
                                    defaults=defaults, **lookup
                                )
                                if created:
                                    created_count += 1
                                else:
                                    updated_count += 1
                            except Exception as e:
                                # Fallback: try to find and update existing record
                                existing = Listener.objects.filter(
                                    record_type=record_type, number=n
                                ).first()
                                if existing:
                                    for key, value in listener_data.items():
                                        setattr(existing, key, value)
                                    try:
                                        existing.save()
                                        updated_count += 1
                                    except Exception as e_save:
                                        if first_row_debug:
                                            first_row_debug['error'] = str(e_save)
                                        skipped_count += 1
                                else:
                                    if first_row_debug:
                                        first_row_debug['error'] = str(e)
                                    skipped_count += 1

                    msg = f"Muvaffaqiyat! {created_count} ta yangi qo'shildi, {updated_count} ta yangilandi."
                    if skipped_count > 0:
                        msg += f" {skipped_count} ta qator o'tkazib yuborildi (ism topilmadi)."
                    msg += f" | Ustunlar: {mapping_info}"
                    if unmapped:
                        msg += f" | Ishlatilmagan: {unmapped}"
                    if first_row_debug:
                        msg += f" | 1-qator: {first_row_debug}"
                    
                    messages.success(request, msg)
                    return redirect('..')

                except Exception as e:
                    messages.error(request, f"Xatolik: {str(e)}")

        form = ExcelImportForm()
        context = {
            'form': form,
            'title': 'Tinglovchilarni Excel fayldan import qilish',
            'opts': self.model._meta,
        }
        return render(request, 'admin/excel_import.html', context)

    def export_excel(self, request):
        """Export listeners to Excel file."""
        record_type = request.GET.get('record_type', None)
        queryset = Listener.objects.all()
        if record_type:
            queryset = queryset.filter(record_type=record_type)

        data = []
        for listener in queryset:
            data.append({
                'F.I.SH': listener.full_name,
                'Ish joyi': listener.workplace,
                'Yo\'nalish': listener.course_type,
                'Seriya': listener.series,
                'Raqam': listener.number,
                "O'qish muddati (davri)": listener.duration,
                'Turi': listener.get_record_type_display(),
            })

        df = pd.DataFrame(data)

        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        filename = f"tinglovchilar_{record_type or 'all'}.xlsx"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        df.to_excel(response, index=False, engine='openpyxl')
        return response

    def download_template(self, request):
        """Download Excel template for import."""
        record_type = request.GET.get('record_type', 'MO')

        if record_type == 'QT':
            columns = [
                'Tinglovchi', 'Asosiy ish joyi', 'Qayta tayyorlash kursi',
                'Seriyasi', 'Raqami', "O'qish muddati (davri)"
            ]
            filename = 'qayta_tayyorlash_template.xlsx'
        else:
            columns = [
                'Tinglovchi', 'Asosiy ish joyi', 'Kursi',
                'Seriyasi', 'Raqami', "O'qish muddati (davri)"
            ]
            filename = 'malaka_oshirish_template.xlsx'

        df = pd.DataFrame(columns=columns)
        # Add sample row
        sample = {
            columns[0]: 'Ism Familiya',
            columns[1]: 'Maktab nomi',
            columns[2]: 'Kurs nomi',
            columns[3]: record_type,
            columns[4]: '000001',
            columns[5]: '01.01.2024 - 01.03.2024',
        }
        df = pd.concat([df, pd.DataFrame([sample])], ignore_index=True)

        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        df.to_excel(response, index=False, engine='openpyxl')
        return response


@admin.register(Teacher)
class TeacherAdmin(RichTextFieldsMixin, admin.ModelAdmin):
    """Admin configuration for Teacher model - simplified."""
    list_display = ['full_name', 'position', 'degree', 'title', 'order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['full_name', 'position', 'degree']
    list_editable = ['order', 'is_active']
    ordering = ['order', 'full_name']

    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': (
                'full_name',
                'position', 'position_ru', 'position_en',
                'degree', 'degree_ru', 'degree_en',
                'title', 'title_ru', 'title_en',
                'awards', 'awards_ru', 'awards_en',
                'biography', 'biography_ru', 'biography_en'
            )
        }),
        ('Rasm', {
            'fields': ('photo',)
        }),
        ('Sozlamalar', {
            'fields': ('order', 'is_active')
        }),
    )


@admin.register(Personnel)
class PersonnelAdmin(RichTextFieldsMixin, admin.ModelAdmin):
    """Admin configuration for Personnel model."""
    list_display = ['full_name', 'position', 'category', 'phone', 'order', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['full_name', 'position']
    list_editable = ['order', 'is_active']
    ordering = ['order', 'full_name']

    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': (
                'full_name',
                'position', 'position_ru', 'position_en',
                'category'
            )
        }),
        ('Aloqa', {
            'fields': ('phone', 'reception_hours')
        }),
        ('Batafsil ma\'lumotlar', {
            'fields': (
                'duties', 'duties_ru', 'duties_en'
            )
        }),
        ('Rasm va sozlamalar', {
            'fields': ('photo', 'order', 'is_active')
        }),
    )


@admin.register(Course)
class CourseAdmin(RichTextFieldsMixin, admin.ModelAdmin):
    """Admin configuration for Course model."""
    list_display = ['title', 'course_type', 'duration', 'order', 'is_active']
    list_filter = ['course_type', 'is_active']
    search_fields = ['title', 'description']
    list_editable = ['order', 'is_active']
    ordering = ['order', 'title']


@admin.register(JournalIssue)
class JournalIssueAdmin(admin.ModelAdmin):
    """Admin configuration for JournalIssue model - simplified."""
    list_display = ['__str__', 'year', 'issue_number', 'is_active']
    list_filter = ['year', 'is_active']
    search_fields = ['year', 'issue_number']
    ordering = ['-year', '-created_at']

    fieldsets = (
        ('Jurnal ma\'lumotlari', {
            'fields': ('year', 'issue_number')
        }),
        ('Fayllar', {
            'fields': ('pdf_file', 'thumbnail')
        }),
        ('Sozlamalar', {
            'fields': ('is_active',)
        }),
    )


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    """Admin configuration for Document model - simplified."""
    list_display = ['title', 'category', 'is_active', 'created_at']
    list_filter = ['category', 'is_active']
    search_fields = ['title']
    ordering = ['-created_at']

    fieldsets = (
        ('Hujjat', {
            'fields': ('title', 'title_ru', 'title_en', 'category', 'file', 'cover_image')
        }),
        ('Sozlamalar', {
            'fields': ('is_active',)
        }),
    )


@admin.register(Statistics)
class StatisticsAdmin(admin.ModelAdmin):
    """Admin configuration for Statistics singleton model."""
    list_display = ['__str__', 'professors', 'dotsents', 'academics', 'potential']

    def has_add_permission(self, request):
        # Only allow one instance
        return not Statistics.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(YearlyStatistics)
class YearlyStatisticsAdmin(admin.ModelAdmin):
    """Admin configuration for YearlyStatistics model."""
    list_display = ['year', 'professional_development_count', 'retraining_count']
    ordering = ['-year']


class AppHeroImageInline(admin.TabularInline):
    """Inline admin for Homepage Hero Slider Images."""
    model = AppHeroImage
    extra = 3
    fields = ['image', 'order']
    ordering = ['order']


@admin.register(AppContent)
class AppContentAdmin(RichTextFieldsMixin, admin.ModelAdmin):
    """Admin configuration for AppContent (Markaz haqida) singleton model."""
    list_display = ['__str__', 'updated_at']
    inlines = [AppHeroImageInline]

    fieldsets = (
        ('Umumiy ma\'lumot', {
            'fields': ('history', 'history_ru', 'history_en')
        }),
        ('Markaz tuzilmasi', {
            'fields': ('structure', 'structure_ru', 'structure_en', 'structure_image'),
            'description': 'Tuzilma rasmi (download qilish uchun)'
        }),
        ('Tinglovchilar uchun', {
            'fields': ('student_notes', 'student_notes_ru', 'student_notes_en')
        }),
        ('Aloqa va Sozlamalar', {
            'fields': (
                'site_name', 'site_name_ru', 'site_name_en',
                'header_logo', 'footer_logo',
                'contact_info', 'address', 'map_embed_url',
                'hero_video_url'
            )
        }),
    )

    def has_add_permission(self, request):
        return not AppContent.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(JournalSettings)
class JournalSettingsAdmin(RichTextFieldsMixin, admin.ModelAdmin):
    """Admin configuration for JournalSettings (Jurnal sozlamalari) singleton model."""
    list_display = ['__str__', 'updated_at']

    fieldsets = (
        ('Maqola berish tartibi', {
            'fields': ('article_rules_text', 'article_rules_text_ru', 'article_rules_text_en', 'article_rules_pdf'),
            'description': 'PDF faylni yuklash mumkin (download qilish uchun)'
        }),
        ('Jurnal haqida', {
            'fields': ('about_journal', 'about_journal_ru', 'about_journal_en')
        }),
    )

    def has_add_permission(self, request):
        return not JournalSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(NewsCategory)
class NewsCategoryAdmin(admin.ModelAdmin):
    """Admin configuration for NewsCategory model."""
    list_display = ['name', 'slug', 'order', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'name_ru', 'name_en', 'slug']
    list_editable = ['order', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']

    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('name', 'name_ru', 'name_en', 'slug')
        }),
        ('Sozlamalar', {
            'fields': ('order', 'is_active')
        }),
    )


@admin.register(ArtGalleryItem)
class ArtGalleryItemAdmin(admin.ModelAdmin):
    """Admin configuration for ArtGalleryItem model."""
    list_display = ['title', 'author', 'order', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'title_ru', 'title_en', 'author', 'description']
    list_editable = ['order', 'is_active']
    ordering = ['order', '-created_at']

    fieldsets = (
        ('Asar ma\'lumotlari', {
            'fields': (
                'title', 'title_ru', 'title_en',
                'author', 'image',
                'description', 'description_ru', 'description_en'
            )
        }),
        ('Sozlamalar', {
            'fields': ('order', 'is_active')
        }),
    )


@admin.register(Appeal)
class AppealAdmin(admin.ModelAdmin):
    """Admin configuration for Appeal model - read only inbox."""
    list_display = ['full_name', 'appeal_type_display', 'status', 'phone_link', 'email', 'created_at']
    list_filter = ['appeal_type', 'created_at']
    search_fields = ['full_name', 'phone', 'email', 'description']
    ordering = ['-created_at']


    fieldsets = (
        ('📱 Murojaatchi', {
            'fields': ('full_name', 'phone', 'email', 'telegram_link')
        }),
        ('Murojaat matni', {
            'fields': ('appeal_type', 'description')
        }),
        ('Holat va Natija', {
            'fields': ('status', 'admin_note')
        }),
        ('🕐 Yuborilgan vaqt', {
            'fields': ('created_at',),
            'classes': ('collapse',),
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        return [f.name for f in self.model._meta.fields if f.name not in ['status', 'admin_note']]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return True

    def phone_link(self, obj):
        from django.utils.html import format_html
        if obj.phone:
            return format_html('<a href="tel:{}" style="font-weight:bold;color:#1a73e8;font-size:1.05em;">📞 {}</a>', obj.phone, obj.phone)
        return '-'
    phone_link.short_description = 'Telefon'
    phone_link.allow_tags = True

    def appeal_type_display(self, obj):
        icons = {'murojaat': '📩', 'shikoyat': '⚠️', 'taklif': '💡'}
        icon = icons.get(obj.appeal_type, '📩')
        return f"{icon} {obj.get_appeal_type_display()}"
    appeal_type_display.short_description = 'Murojaat turi'


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    """Admin configuration for Application model - read only inbox."""
    list_display = ['full_name', 'application_type_display', 'direction', 'status', 'phone_link', 'created_at']
    list_filter = ['application_type', 'created_at']
    search_fields = ['full_name', 'workplace', 'direction', 'phone']
    ordering = ['-created_at']


    fieldsets = (
        ('📱 Ariza beruvchi', {
            'fields': ('full_name', 'workplace', 'phone', 'telegram_link')
        }),
        ('Ariza tafsilotlari', {
            'fields': ('application_type', 'direction')
        }),
        ('Holat va Natija', {
            'fields': ('status', 'admin_note')
        }),
        ('🕐 Yuborilgan vaqt', {
            'fields': ('created_at',),
            'classes': ('collapse',),
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        return [f.name for f in self.model._meta.fields if f.name not in ['status', 'admin_note']]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return True

    def phone_link(self, obj):
        from django.utils.html import format_html
        if obj.phone:
            return format_html('<a href="tel:{}" style="font-weight:bold;color:#1a73e8;font-size:1.05em;">📞 {}</a>', obj.phone, obj.phone)
        return '-'
    phone_link.short_description = 'Telefon'
    phone_link.allow_tags = True

    def application_type_display(self, obj):
        icons = {'professional_development': '🎓', 'retraining': '🔄'}
        icon = icons.get(obj.application_type, '📋')
        return f"{icon} {obj.get_application_type_display()}"
    application_type_display.short_description = 'Ariza turi'


@admin.register(InternationalSettings)
class InternationalSettingsAdmin(admin.ModelAdmin):
    """Admin configuration for InternationalSettings singleton model."""
    list_display = ['__str__', 'updated_at']

    fieldsets = (
        ('Bosh banner (Hero)', {
            'fields': ('hero_title', 'hero_title_ru', 'hero_title_en', 'hero_description', 'hero_description_ru', 'hero_description_en')
        }),
        ('Bo\'lim haqida matn', {
            'fields': ('about_text', 'about_text_ru', 'about_text_en')
        }),
    )

    def has_add_permission(self, request):
        return not InternationalSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(InternationalPartner)
class InternationalPartnerAdmin(admin.ModelAdmin):
    """Admin configuration for InternationalPartner model."""
    list_display = ['name', 'country', 'order', 'is_active']
    list_filter = ['country', 'is_active']
    search_fields = ['name', 'country', 'description']
    list_editable = ['order', 'is_active']
    ordering = ['order', 'name']

    fieldsets = (
        ('Hamkor ma\'lumotlari', {
            'fields': ('name', 'country', 'description', 'photo')
        }),
        ('Sozlamalar', {
            'fields': ('order', 'is_active')
        }),
    )


class InternationalProjectImageInline(admin.TabularInline):
    """Inline admin for International Project Images."""
    model = InternationalProjectImage
    extra = 3
    fields = ['image', 'order']
    ordering = ['order']


@admin.register(InternationalProject)
class InternationalProjectAdmin(admin.ModelAdmin):
    """Admin configuration for InternationalProject model."""
    list_display = ['title', 'status', 'start_date', 'end_date', 'order', 'is_active', 'image_count']
    list_filter = ['status', 'is_active', 'start_date']
    search_fields = [
        'title', 'title_ru', 'title_en',
        'description', 'description_ru', 'description_en',
        'partners_text'
    ]
    list_editable = ['status', 'order', 'is_active']
    ordering = ['order', '-start_date']
    inlines = [InternationalProjectImageInline]

    fieldsets = (
        ('Loyiha ma\'lumotlari', {
            'fields': (
                'title', 'title_ru', 'title_en',
                'description', 'description_ru', 'description_en',
                'partners_text'
            )
        }),
        ('Muddati va holati', {
            'fields': ('start_date', 'end_date', 'status')
        }),
        ('Sozlamalar', {
            'fields': ('order', 'is_active')
        }),
    )

    def image_count(self, obj):
        return obj.images.count()
    image_count.short_description = 'Rasmlar soni'


@admin.register(InternationalMedia)
class InternationalMediaAdmin(admin.ModelAdmin):
    """Admin configuration for InternationalMedia model."""
    list_display = ['title', 'media_type', 'order', 'is_active', 'created_at']
    list_filter = ['media_type', 'is_active']
    search_fields = ['title', 'description']
    list_editable = ['order', 'is_active']
    ordering = ['order', '-created_at']

    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('title', 'description', 'media_type')
        }),
        ('Media fayllari', {
            'fields': ('image', 'youtube_url'),
            'description': 'Media turiga qarab rasm yuklang yoki YouTube havolasini kiriting.'
        }),
        ('Sozlamalar', {
            'fields': ('order', 'is_active')
        }),
    )

from django import forms
from django.utils.safestring import mark_safe
from .models import Department, DepartmentTask, DepartmentPost, DepartmentPostImage, DepartmentImage, DepartmentVideo, Pedagogue, PedagogueProject, PedagogueProjectImage

class DepartmentTaskInline(admin.StackedInline):
    model = DepartmentTask
    extra = 1
    fields = ['title', 'title_ru', 'title_en', 'task_text', 'task_text_ru', 'task_text_en', 'order']
    
    def formfield_for_dbfield(self, db_field, request, **kwargs):
        if isinstance(db_field, models.TextField):
            kwargs['widget'] = RichTextWidget()
        return super().formfield_for_dbfield(db_field, request, **kwargs)



class DepartmentImageInline(admin.TabularInline):
    model = DepartmentImage
    extra = 1

class DepartmentVideoInline(admin.TabularInline):
    model = DepartmentVideo
    extra = 1

class DepartmentPostImageInline(admin.TabularInline):
    model = DepartmentPostImage
    extra = 1

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'order', 'created_at']
    search_fields = ['name', 'name_ru', 'name_en']
    list_editable = ['order']
    inlines = [DepartmentTaskInline, DepartmentImageInline, DepartmentVideoInline]
    
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': (
                'name', 'name_ru', 'name_en',
                'description', 'description_ru', 'description_en',
                'icon_name', 'color_classes', 'order'
            )
        }),
        ('Batafsil ma\'lumot (Qilingan ishlar)', {
            'fields': (
                'detail_text', 'detail_text_ru', 'detail_text_en',
            )
        }),
    )

    class Media:
        js = (
            'https://cdn.ckeditor.com/4.22.1/standard/ckeditor.js',
        )

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        if db_field.name in ['detail_text', 'detail_text_ru', 'detail_text_en']:
            kwargs['widget'] = RichTextWidget()
        elif db_field.name == 'detail_image':
            kwargs['widget'] = CustomAdminFileWidget()
        return super().formfield_for_dbfield(db_field, request, **kwargs)

@admin.register(Pedagogue)
class PedagogueAdmin(RichTextFieldsMixin, admin.ModelAdmin):
    list_display = ['full_name', 'order', 'created_at']
    search_fields = ['full_name', 'full_name_ru', 'full_name_en']
    list_editable = ['order']
    fieldsets = (
        ('Shaxsiy ma\'lumotlar', {
            'fields': (
                'full_name', 'full_name_ru', 'full_name_en',
                'bio', 'bio_ru', 'bio_en',
                'image', 'order'
            )
        }),
    )



class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True


class MultipleFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("widget", MultipleFileInput(attrs={'multiple': True}))
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        single_file_clean = super().clean
        if isinstance(data, (list, tuple)):
            result = [single_file_clean(d, initial) for d in data]
        else:
            result = single_file_clean(data, initial)
        return result


class PedagogueProjectForm(forms.ModelForm):
    images_upload = MultipleFileField(
        required=False,
        label="Ko'plab rasmlarni bir vaqtda yuklash (Shu yerdan bir nechta rasmni tanlashingiz mumkin)"
    )

    class Meta:
        model = PedagogueProject
        fields = '__all__'

class PedagogueProjectImageInline(admin.TabularInline):
    model = PedagogueProjectImage
    extra = 1

from django.urls import reverse
from django.utils.html import format_html

@admin.register(PedagogueProject)
class PedagogueProjectAdmin(RichTextFieldsMixin, admin.ModelAdmin):
    form = PedagogueProjectForm
    list_display = ['title', 'pedagogue', 'views_count', 'votes_count', 'delete_action']
    search_fields = ['title', 'title_ru', 'title_en']
    list_filter = ['pedagogue']
    inlines = [PedagogueProjectImageInline]
    fieldsets = (
        ('Loyiha ma\'lumotlari', {
            'fields': (
                'pedagogue', 'title', 'title_ru', 'title_en', 'description', 'description_ru', 'description_en',
                'views_count', 'votes_count',
                'images_upload'
            )
        }),
    )

    def delete_action(self, obj):
        url = reverse('admin:core_pedagogueproject_delete', args=[obj.id])
        return format_html('<a class="btn btn-danger btn-sm" style="padding: 2px 8px; font-size: 12px; border-radius: 4px;" href="{}">O\'chirish</a>', url)
    delete_action.short_description = "Amal"
    delete_action.allow_tags = True

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        
        # Handle multiple images upload
        files = request.FILES.getlist('images_upload')
        for f in files:
            if isinstance(f, list):
                for sub_f in f:
                    if sub_f:
                        PedagogueProjectImage.objects.create(project=obj, image=sub_f)
            elif f:
                PedagogueProjectImage.objects.create(project=obj, image=f)



@admin.register(DepartmentPost)
class DepartmentPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'department', 'date', 'is_active')
    list_filter = ('department', 'date', 'is_active')
    search_fields = ('title', 'content', 'title_ru', 'title_en')

    formfield_overrides = {
        models.TextField: {'widget': RichTextWidget},
    }
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('department', 'title', 'title_ru', 'title_en', 'image', 'image_url', 'video', 'video_url', 'date', 'is_active')
        }),
        ('Matn (Matnga ixtiyoriy rasmlarni qo\'shish mumkin)', {
            'fields': ('content', 'content_ru', 'content_en')
        }),
    )
    inlines = [DepartmentPostImageInline]
