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
    InternationalProjectImage, InternationalMedia,
    AntiCorruptionContent, AntiCorruptionDocument, AntiCorruptionPost, AntiCorruptionPostImage
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
                record_type_raw = request.POST.get('record_type', 'certificate')
                record_type = 'QT' if record_type_raw == 'diploma' else 'MO'

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
                            
                            try:
                                with transaction.atomic():
                                    # Explicitly check for existing record
                                    existing = Listener.objects.filter(series=record_type, number=n).first()
                                    if existing:
                                        for key, value in listener_data.items():
                                            if key not in ('series', 'number'):
                                                setattr(existing, key, value)
                                        existing.save()
                                        updated_count += 1
                                    else:
                                        # Create new
                                        Listener.objects.create(series=record_type, number=n, **{k: v for k, v in listener_data.items() if k not in ('series', 'number')})
                                        created_count += 1
                            except Exception as e:
                                # Find what's actually in DB for this number
                                db_vals = list(Listener.objects.filter(number=n).values_list('series', 'record_type'))
                                if first_row_debug and 'error' not in first_row_debug:
                                    first_row_debug['error'] = f"Row error: {e}. In DB for {n}: {db_vals}"
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


from .models import TrainingPlanRecord

@admin.register(TrainingPlanRecord)
class TrainingPlanRecordAdmin(admin.ModelAdmin):
    """Admin configuration for TrainingPlanRecord with bulk import."""
    list_display = ['full_name', 'region', 'workplace', 'course_name', 'last_training_date', 'status']
    search_fields = ['full_name', 'region', 'workplace', 'course_name']
    ordering = ['-created_at']

    # We reuse the listener_change_list template for import/export buttons
    # You might want to create a specific template if labels differ, but it uses the same excel import logic.
    change_list_template = "admin/trainingplan_change_list.html"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('import-excel/', self.admin_site.admin_view(self.import_excel), name='trainingplan_import_excel'),
            path('export-excel/', self.admin_site.admin_view(self.export_excel), name='trainingplan_export_excel'),
            path('download-template/', self.admin_site.admin_view(self.download_template), name='trainingplan_download_template'),
        ]
        return custom_urls + urls

    def import_excel(self, request):
        if request.method == 'POST':
            form = ExcelImportForm(request.POST, request.FILES)
            if form.is_valid():
                excel_file = request.FILES['excel_file']
                try:
                    df = pd.read_excel(BytesIO(excel_file.read()), dtype=str)
                    
                    # Columns to look for
                    mapping = {
                        'f.i.sh': 'full_name',
                        'fish': 'full_name',
                        'f.i.sh.': 'full_name',
                        'ism familiya': 'full_name',
                        'viloyat': 'region',
                        'hudud': 'region',
                        'ish joyi': 'workplace',
                        'yo\'nalish': 'course_name',
                        'kurs': 'course_name',
                        'muddat': 'last_training_date',
                        'o\'qish muddati': 'last_training_date',
                        'holati': 'status'
                    }
                    
                    actual_mapping = {}
                    unmapped = []
                    for col in df.columns:
                        normalized_col = str(col).lower().strip()
                        matched = False
                        for key, field in mapping.items():
                            if key in normalized_col:
                                actual_mapping[col] = field
                                matched = True
                                break
                        if not matched:
                            unmapped.append(col)
                    
                    if not actual_mapping or 'full_name' not in actual_mapping.values():
                        messages.error(request, f"Xato: Ustunlar topilmadi. 'F.I.SH' ustuni bo'lishi shart. Topilgan ustunlar: {list(df.columns)}")
                        return redirect('..')
                        
                    created_count = 0
                    skipped_count = 0
                    
                    for idx, row in df.iterrows():
                        record_data = {}
                        for excel_col, model_field in actual_mapping.items():
                            value = row[excel_col]
                            if pd.notna(value) and str(value).strip().lower() != 'nan':
                                record_data[model_field] = str(value).strip()
                        
                        if not record_data.get('full_name'):
                            skipped_count += 1
                            continue
                            
                        TrainingPlanRecord.objects.create(**record_data)
                        created_count += 1
                        
                    msg = f"Muvaffaqiyat! {created_count} ta reja kiritildi."
                    if skipped_count > 0:
                        msg += f" {skipped_count} ta qator o'tkazib yuborildi."
                    messages.success(request, msg)
                    
                except Exception as e:
                    messages.error(request, f"Xatolik yuz berdi: {str(e)}")
                    
            return redirect('..')
            
        return render(request, "admin/excel_import.html", {
            "form": ExcelImportForm(),
            "opts": self.model._meta,
            "title": "Excel fayl orqali malaka oshirish rejasini yuklash"
        })

    def export_excel(self, request):
        queryset = TrainingPlanRecord.objects.all()
        data = []
        for record in queryset:
            data.append({
                'F.I.SH': record.full_name,
                'Viloyat': record.region,
                'Ish joyi': record.workplace,
                'Kurs nomi': record.course_name,
                'Muddat': record.last_training_date,
                'Holati': record.status,
            })
        df = pd.DataFrame(data)
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename="malaka_oshirish_rejasi.xlsx"'
        df.to_excel(response, index=False, engine='openpyxl')
        return response

    def download_template(self, request):
        df = pd.DataFrame({
            'F.I.SH': ['Eshmatov Toshmat'],
            'Viloyat': ['Toshkent shahri'],
            'Ish joyi': ['Toshkent shahar 1-maktab'],
            'Kurs nomi (Yo\'nalish)': ['Amaliy san\'at'],
            'Muddat': ['2026-03-31'],
            'Holati': ['Rejalashtirilgan']
        })
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename="malaka_oshirish_rejasi_shablon.xlsx"'
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


class StatisticsAdminForm(forms.ModelForm):
    section_badge = forms.CharField(
        required=False,
        label="Bo'lim kichik sarlavhasi (Badge)",
        widget=forms.TextInput(attrs={'style': 'width:100%; max-width:650px; font-weight:600;'})
    )
    section_title = forms.CharField(
        required=False,
        label="Bo'lim asosiy sarlavhasi",
        widget=forms.TextInput(attrs={'style': 'width:100%; max-width:650px; font-weight:700; font-size:1.05rem;'})
    )

    card1_badge = forms.CharField(
        required=False,
        label="1-karta kichik sarlavhasi (Badge)",
        widget=forms.TextInput(attrs={'style': 'width:100%; max-width:650px; font-weight:600;'})
    )
    card1_title = forms.CharField(
        required=False,
        label="1-karta asosiy sarlavhasi",
        widget=forms.TextInput(attrs={'style': 'width:100%; max-width:650px; font-weight:700; font-size:1.05rem;'})
    )
    card1_summary = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'rows': 5,
            'style': 'width:100%; max-width:850px; line-height:1.6; font-size:0.95rem; padding:12px; border-radius:10px;'
        }),
        label="O'quv faoliyati umumiy matni (Izoh)"
    )

    mo_total_label = forms.CharField(
        required=False,
        label="Jami malaka oshirganlar yozuvi",
        widget=forms.TextInput(attrs={'style': 'width:100%; max-width:650px; font-weight:700; color:#047857;'})
    )
    mo_total = forms.IntegerField(
        required=False, initial=1743,
        label="Jami malaka oshirganlar soni (nafar)",
        widget=forms.NumberInput(attrs={'style': 'max-width:220px; font-weight:800; font-size:1.1rem; color:#047857;'})
    )

    mo_higher_edu_label = forms.CharField(
        required=False,
        label="1-qator nomi (Oliy ta'lim...)",
        widget=forms.TextInput(attrs={'style': 'width:100%; max-width:650px;'})
    )
    mo_higher_edu = forms.IntegerField(
        required=False, initial=284,
        label="1-qator soni (nafar)",
        widget=forms.NumberInput(attrs={'style': 'max-width:220px; font-weight:700;'})
    )

    mo_culture_ministry_label = forms.CharField(
        required=False,
        label="2-qator nomi (Madaniyat vazirligi...)",
        widget=forms.TextInput(attrs={'style': 'width:100%; max-width:650px;'})
    )
    mo_culture_ministry = forms.IntegerField(
        required=False, initial=740,
        label="2-qator soni (nafar)",
        widget=forms.NumberInput(attrs={'style': 'max-width:220px; font-weight:700;'})
    )

    mo_art_academy_label = forms.CharField(
        required=False,
        label="3-qator nomi (Badiiy akademiya...)",
        widget=forms.TextInput(attrs={'style': 'width:100%; max-width:650px;'})
    )
    mo_art_academy = forms.IntegerField(
        required=False, initial=578,
        label="3-qator soni (nafar)",
        widget=forms.NumberInput(attrs={'style': 'max-width:220px; font-weight:700;'})
    )

    mo_short_courses_label = forms.CharField(
        required=False,
        label="4-qator nomi (Qisqa kurslar...)",
        widget=forms.TextInput(attrs={'style': 'width:100%; max-width:650px;'})
    )
    mo_short_courses = forms.IntegerField(
        required=False, initial=141,
        label="4-qator soni (nafar)",
        widget=forms.NumberInput(attrs={'style': 'max-width:220px; font-weight:700;'})
    )

    qt_total_label = forms.CharField(
        required=False,
        label="Jami qayta tayyorlash yozuvi",
        widget=forms.TextInput(attrs={'style': 'width:100%; max-width:650px; font-weight:700; color:#1d4ed8;'})
    )
    qt_total = forms.IntegerField(
        required=False, initial=389,
        label="Jami qayta tayyorlash soni (nafar)",
        widget=forms.NumberInput(attrs={'style': 'max-width:220px; font-weight:800; font-size:1.1rem; color:#1d4ed8;'})
    )

    qt_painting_label = forms.CharField(
        required=False,
        label="1-yo'nalish nomi (Rangtasvir...)",
        widget=forms.TextInput(attrs={'style': 'width:100%; max-width:650px;'})
    )
    qt_painting = forms.IntegerField(
        required=False, initial=0,
        label="1-yo'nalish soni (nafar)",
        widget=forms.NumberInput(attrs={'style': 'max-width:220px; font-weight:700;'})
    )

    qt_embroidery_label = forms.CharField(
        required=False,
        label="2-yo'nalish nomi (Kashtachilik...)",
        widget=forms.TextInput(attrs={'style': 'width:100%; max-width:650px;'})
    )
    qt_embroidery = forms.IntegerField(
        required=False, initial=0,
        label="2-yo'nalish soni (nafar)",
        widget=forms.NumberInput(attrs={'style': 'max-width:220px; font-weight:700;'})
    )

    qt_gold_embroidery_label = forms.CharField(
        required=False,
        label="3-yo'nalish nomi (Zardo'zlik...)",
        widget=forms.TextInput(attrs={'style': 'width:100%; max-width:650px;'})
    )
    qt_gold_embroidery = forms.IntegerField(
        required=False, initial=0,
        label="3-yo'nalish soni (nafar)",
        widget=forms.NumberInput(attrs={'style': 'max-width:220px; font-weight:700;'})
    )

    card2_badge = forms.CharField(
        required=False,
        label="2-karta kichik sarlavhasi (Badge)",
        widget=forms.TextInput(attrs={'style': 'width:100%; max-width:650px; font-weight:600;'})
    )
    card2_title = forms.CharField(
        required=False,
        label="2-karta asosiy sarlavhasi",
        widget=forms.TextInput(attrs={'style': 'width:100%; max-width:650px; font-weight:700; font-size:1.05rem;'})
    )
    card2_summary = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'rows': 5,
            'style': 'width:100%; max-width:850px; line-height:1.6; font-size:0.95rem; padding:12px; border-radius:10px;'
        }),
        label="Xalqaro bo'lim umumiy matni (Izoh)"
    )

    intl_countries_label = forms.CharField(
        required=False,
        label="Xorijiy mamlakatlar sarlavhasi",
        widget=forms.TextInput(attrs={'style': 'width:100%; max-width:650px; font-weight:700;'})
    )
    intl_countries_count = forms.IntegerField(
        required=False, initial=10,
        label="Xorijiy mamlakatlar soni (ta)",
        widget=forms.NumberInput(attrs={'style': 'max-width:220px; font-weight:800; font-size:1.1rem;'})
    )
    intl_countries_list = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'rows': 6,
            'style': 'width:100%; max-width:850px; line-height:1.6; padding:12px; border-radius:10px;'
        }),
        label="Hamkor davlatlar ro'yxati (har bir qatorda bittadan davlat nomi yozilsin)"
    )

    intl_organizations_label = forms.CharField(
        required=False,
        label="Hamkor tashkilotlar sarlavhasi",
        widget=forms.TextInput(attrs={'style': 'width:100%; max-width:650px; font-weight:700;'})
    )
    intl_organizations_count = forms.IntegerField(
        required=False, initial=0,
        label="Hamkor xorijiy tashkilotlar soni (ta)",
        widget=forms.NumberInput(attrs={'style': 'max-width:220px; font-weight:800; font-size:1.1rem;'})
    )
    intl_organizations_summary = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'rows': 3,
            'style': 'width:100%; max-width:850px; line-height:1.6; padding:12px; border-radius:10px;'
        }),
        label="Hamkor tashkilotlar ichki izoh matni (ixtiyoriy)"
    )
    intl_organizations_list = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'rows': 7,
            'style': 'width:100%; max-width:850px; line-height:1.6; padding:12px; border-radius:10px;'
        }),
        label="Hamkor xorijiy tashkilotlar ro'yxati (har bir qatorda bittadan tashkilot nomi)"
    )

    intl_projects_label = forms.CharField(
        required=False,
        label="Xalqaro loyihalar sarlavhasi",
        widget=forms.TextInput(attrs={'style': 'width:100%; max-width:650px; font-weight:700;'})
    )
    intl_projects_count = forms.IntegerField(
        required=False, initial=0,
        label="Xalqaro ilmiy-ijodiy loyihalar soni (ta)",
        widget=forms.NumberInput(attrs={'style': 'max-width:220px; font-weight:800; font-size:1.1rem;'})
    )
    intl_projects_list = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'rows': 6,
            'style': 'width:100%; max-width:850px; line-height:1.6; padding:12px; border-radius:10px;'
        }),
        label="Xalqaro ilmiy-ijodiy loyihalar ro'yxati (har bir qatorda bittadan loyiha nomi)"
    )

    class Meta:
        model = Statistics
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        from .stats_report import get_stats_report
        report = get_stats_report()
        for key, val in report.items():
            if key in self.fields:
                self.fields[key].initial = val

    def save(self, commit=True):
        instance = super().save(commit=commit)
        from .stats_report import save_stats_report, DEFAULT_STATS_REPORT
        report_data = {}
        for key in DEFAULT_STATS_REPORT.keys():
            if key in self.cleaned_data and self.cleaned_data[key] is not None:
                report_data[key] = self.cleaned_data[key]
        save_stats_report(report_data)
        return instance


@admin.register(Statistics)
class StatisticsAdmin(admin.ModelAdmin):
    """Admin configuration for Statistics singleton model."""
    form = StatisticsAdminForm
    list_display = ['__str__', 'total_pedagogs', 'professors', 'dotsents', 'academics', 'potential']
    fieldsets = (
        ("📊 Ilmiy salohiyat", {
            'description': "Markazning asosiy ilmiy salohiyat ko'rsatkichlari",
            'fields': ('total_pedagogs', 'professors', 'dotsents', 'academics', 'potential')
        }),
        ("📝 Umumiy sarlavhalar va matnlar", {
            'description': "Bosh sahifadagi Statistika bo'limining sarlavhalari hamda kirish matnlari",
            'fields': (
                'section_badge',
                'section_title',
                'card1_badge',
                'card1_title',
                'card1_summary',
                'card2_badge',
                'card2_title',
                'card2_summary',
            )
        }),
        ("🎓 Malaka oshirish (1743 nafar)", {
            'description': "Malaka oshirish kurslari bo'yicha jami va vazirliklar kesimidagi ko'rsatkichlar",
            'fields': (
                'mo_total_label', 'mo_total',
                'mo_higher_edu_label', 'mo_higher_edu',
                'mo_culture_ministry_label', 'mo_culture_ministry',
                'mo_art_academy_label', 'mo_art_academy',
                'mo_short_courses_label', 'mo_short_courses',
            )
        }),
        ("🔄 Qayta tayyorlash (389 nafar)", {
            'description': "Qayta tayyorlash kurslari va yo'nalishlari bo'yicha ko'rsatkichlar",
            'fields': (
                'qt_total_label', 'qt_total',
                'qt_painting_label', 'qt_painting',
                'qt_embroidery_label', 'qt_embroidery',
                'qt_gold_embroidery_label', 'qt_gold_embroidery',
            )
        }),
        ("🌍 Xalqaro hamkorlik va Loyihalar", {
            'description': "Xorijiy davlatlar (bayroqlari bilan), hamkor tashkilotlar va xalqaro loyihalar ro'yxati",
            'fields': (
                'intl_countries_label',
                'intl_countries_count',
                'intl_countries_list',
                'intl_organizations_label',
                'intl_organizations_count',
                'intl_organizations_summary',
                'intl_organizations_list',
                'intl_projects_label',
                'intl_projects_count',
                'intl_projects_list',
            )
        }),
    )

    def render_change_form(self, request, context, *args, **kwargs):
        from django.utils.safestring import mark_safe
        response = super().render_change_form(request, context, *args, **kwargs)
        script = """
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            function parseIntVal(id) {
                var el = document.getElementById(id);
                if (!el) return 0;
                var v = parseInt(el.value, 10);
                return isNaN(v) ? 0 : v;
            }
            function countLines(id, splitPattern) {
                var el = document.getElementById(id);
                if (!el || !el.value) return 0;
                return el.value.split(splitPattern).map(function(s) { return s.trim(); }).filter(Boolean).length;
            }
            function recalcStats() {
                var moSum = parseIntVal('id_mo_higher_edu') +
                            parseIntVal('id_mo_culture_ministry') +
                            parseIntVal('id_mo_art_academy') +
                            parseIntVal('id_mo_short_courses');
                var moTotalEl = document.getElementById('id_mo_total');
                if (moTotalEl && moSum > 0) {
                    moTotalEl.value = moSum;
                }

                var qtSum = parseIntVal('id_qt_painting') +
                            parseIntVal('id_qt_embroidery') +
                            parseIntVal('id_qt_gold_embroidery');
                var qtTotalEl = document.getElementById('id_qt_total');
                if (qtTotalEl && qtSum > 0) {
                    qtTotalEl.value = qtSum;
                }

                var cCountEl = document.getElementById('id_intl_countries_count');
                if (cCountEl && document.getElementById('id_intl_countries_list')) {
                    cCountEl.value = countLines('id_intl_countries_list', /[\n,;]+/);
                }

                var oCountEl = document.getElementById('id_intl_organizations_count');
                if (oCountEl && document.getElementById('id_intl_organizations_list')) {
                    oCountEl.value = countLines('id_intl_organizations_list', /\n+/);
                }

                var pCountEl = document.getElementById('id_intl_projects_count');
                if (pCountEl && document.getElementById('id_intl_projects_list')) {
                    pCountEl.value = countLines('id_intl_projects_list', /\n+/);
                }
            }

            var watchedIds = [
                'id_mo_higher_edu', 'id_mo_culture_ministry', 'id_mo_art_academy', 'id_mo_short_courses',
                'id_qt_painting', 'id_qt_embroidery', 'id_qt_gold_embroidery',
                'id_intl_countries_list', 'id_intl_organizations_list', 'id_intl_projects_list'
            ];
            watchedIds.forEach(function(id) {
                var el = document.getElementById(id);
                if (el) {
                    el.addEventListener('input', recalcStats);
                    el.addEventListener('change', recalcStats);
                }
            });
            recalcStats();
        });
        </script>
        """
        if hasattr(response, 'render'):
            response.add_post_render_callback(lambda r: setattr(r, 'content', r.content.replace(b'</body>', script.encode('utf-8') + b'</body>')))
        return response

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
    """Admin configuration for Application model - I-116 buyruq asosida baholash va progress."""
    list_display = [
        'application_number_badge', 'full_name', 'application_type_display',
        'direction', 'files_badge', 'status_badge', 'total_score_badge', 'decision_badge', 'phone_link', 'created_at'
    ]
    list_display_links = ['application_number_badge', 'full_name']
    list_filter = ['application_type', 'status', 'decision_type', 'created_at']
    search_fields = ['application_number', 'full_name', 'workplace', 'direction', 'diploma_specialty', 'phone']
    ordering = ['-created_at']

    fieldsets = (
        ('📱 Ariza beruvchi ma\'lumotlari', {
            'fields': ('application_number', 'full_name', 'workplace', 'phone', 'telegram_link')
        }),
        ('🎓 Ta\'lim, Yo\'nalish va Yuklangan Hujjatlar (Diplom / Ilova / Portfolio)', {
            'fields': (
                'application_type', 'direction', 'diploma_specialty',
                'diploma_preview',
                'diploma_supplement_preview',
                'portfolio_preview',
                'status', 'admin_note',
            )
        }),
        ('📊 Ekspert komissiyasi baholash varaqasi (I-116 buyruq, 4-ilova — 100 ballik tizim)', {
            'description': (
                "Komissiya a'zolari tomonidan 7 ta mezon bo'yicha berilgan ballarni kiriting. "
                "Jami ball avtomatik hisoblanadi: "
                "80–100 ball — Mos/Turdosh (to'g'ridan-to'g'ri qabul); "
                "60–79 ball — Shartli mos (suhbat yoki ijodiy sinov sharti bilan); "
                "0–59 ball — Mos emas (rad etiladi)."
            ),
            'fields': (
                'score_subjects',
                'score_competencies',
                'score_creative',
                'score_qualification',
                'score_credits',
                'score_experience',
                'score_portfolio',
                'total_score',
                'decision_type',
            )
        }),
        ('🕐 Yuborilgan vaqt', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        editable = {
            'status',
            'decision_type',
            'score_subjects',
            'score_competencies',
            'score_creative',
            'score_qualification',
            'score_credits',
            'score_experience',
            'score_portfolio',
            'admin_note',
        }
        base_readonly = [f.name for f in self.model._meta.fields if f.name not in editable]
        return base_readonly + ['diploma_preview', 'diploma_supplement_preview', 'portfolio_preview']

    def _render_file_preview(self, file_field, title):
        from django.utils.html import format_html
        from django.utils.safestring import mark_safe
        if not file_field:
            return mark_safe('<span style="color:#94a3b8;font-style:italic;">Yuklanmagan</span>')
        url = file_field.url
        lower = url.lower()
        open_btn = (
            f'<div style="margin-bottom:8px;display:flex;gap:8px;align-items:center;">'
            f'<a href="{url}" target="_blank" style="display:inline-flex;align-items:center;gap:6px;background:#1e40af;color:#fff;padding:6px 14px;border-radius:6px;font-weight:600;font-size:12px;text-decoration:none;">🔎 Yangi oynada to\'liq ochish ({title})</a>'
            f'<a href="{url}" download style="display:inline-flex;align-items:center;gap:6px;background:#f1f5f9;color:#334155;border:1px solid #cbd5e1;padding:6px 12px;border-radius:6px;font-weight:600;font-size:12px;text-decoration:none;">⬇️ Yuklab olish</a>'
            f'</div>'
        )
        if lower.endswith('.pdf'):
            preview = f'<iframe src="{url}" style="width:100%;max-width:780px;height:420px;border:1px solid #cbd5e1;border-radius:8px;background:#f8fafc;"></iframe>'
        elif lower.endswith(('.jpg', '.jpeg', '.png', '.webp', '.gif')):
            preview = f'<a href="{url}" target="_blank"><img src="{url}" style="max-width:520px;max-height:380px;border:1px solid #cbd5e1;border-radius:8px;object-fit:contain;background:#fff;padding:4px;" /></a>'
        else:
            preview = '<div style="padding:10px 14px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;color:#92400e;font-size:12px;max-width:520px;">📦 Arxiv fayl (ZIP/RAR) — ko\'rish uchun yuqoridagi <b>Yuklab olish</b> tugmasini bosing.</div>'
        return format_html('{}{}', mark_safe(open_btn), mark_safe(preview))

    def diploma_preview(self, obj):
        return self._render_file_preview(obj.diploma_file, "Diplom nusxasi")
    diploma_preview.short_description = "📄 Diplom nusxasini ko'rish"

    def diploma_supplement_preview(self, obj):
        return self._render_file_preview(obj.diploma_supplement_file, "Diplom ilovasi")
    diploma_supplement_preview.short_description = "📑 Diplom ilovasini ko'rish"

    def portfolio_preview(self, obj):
        return self._render_file_preview(obj.portfolio_file, "Ijodiy portfolio")
    portfolio_preview.short_description = "🎨 Ijodiy portfolioni ko'rish"

    def files_badge(self, obj):
        from django.utils.html import format_html
        links = []
        if obj.diploma_file:
            links.append(f'<a href="{obj.diploma_file.url}" target="_blank" style="display:inline-flex;align-items:center;gap:4px;white-space:nowrap;background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;padding:2px 8px;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none;">📄 Diplom</a>')
        if obj.diploma_supplement_file:
            links.append(f'<a href="{obj.diploma_supplement_file.url}" target="_blank" style="display:inline-flex;align-items:center;gap:4px;white-space:nowrap;background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0;padding:2px 8px;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none;">📑 Ilova</a>')
        if obj.portfolio_file:
            links.append(f'<a href="{obj.portfolio_file.url}" target="_blank" style="display:inline-flex;align-items:center;gap:4px;white-space:nowrap;background:#fffbeb;color:#b45309;border:1px solid #fde68a;padding:2px 8px;border-radius:6px;font-size:12px;font-weight:600;text-decoration:none;">🎨 Portfolio</a>')
        if not links:
            return '-'
        return format_html('<div style="display:flex;flex-wrap:wrap;gap:4px;min-width:160px;">{}</div>', format_html(''.join(links)))
    files_badge.short_description = 'Hujjatlar'

    def has_add_permission(self, request):
        return True

    def has_change_permission(self, request, obj=None):
        return True

    def application_number_badge(self, obj):
        from django.utils.html import format_html
        num = obj.application_number or f"{'QT' if obj.application_type == 'retraining' else 'MO'}-{obj.created_at.year if obj.created_at else 2026}-{obj.pk:04d}"
        return format_html(
            '<span style="display:inline-block;white-space:nowrap;font-family:monospace;font-weight:700;background:#eff6ff;color:#1e40af;padding:4px 10px;border-radius:6px;border:1px solid #bfdbfe;">{}</span>',
            num
        )
    application_number_badge.short_description = 'Ariza raqami'

    def status_badge(self, obj):
        from django.utils.html import format_html
        short_labels = {
            'pending': ('1-bosqich: Qabul qilindi', '#f1f5f9', '#334155'),
            'in_progress': ('2-bosqich: Dastlabki tekshiruv', '#eff6ff', '#1e40af'),
            'commission_review': ('3-bosqich: Komissiya baholashi', '#eef2ff', '#3730a3'),
            'creative_exam': ('3.1-bosqich: Suhbat / Ijodiy sinov', '#fffbeb', '#92400e'),
            'resolved': ('4-bosqich: Qabul qilindi', '#ecfdf5', '#065f46'),
            'conditional_accepted': ('4-bosqich: Shartli qabul', '#fef3c7', '#92400e'),
            'rejected': ('4-bosqich: Rad etildi', '#fef2f2', '#991b1b'),
            'appeal': ('Apellyatsiyada', '#faf5ff', '#6b21a8'),
        }
        label, bg, fg = short_labels.get(obj.status, (obj.get_status_display(), '#f8fafc', '#475569'))
        return format_html(
            '<span style="display:inline-block;white-space:nowrap;font-size:12px;font-weight:600;background:{};color:{};padding:4px 10px;border-radius:6px;">{}</span>',
            bg, fg, label
        )
    status_badge.short_description = 'Jarayon bosqichi'

    def decision_badge(self, obj):
        from django.utils.html import format_html
        short_decisions = {
            'pending': ("Ko'rib chiqilmoqda", '#f8fafc', '#64748b'),
            'direct_match': ("To'g'ridan-to'g'ri mos", '#ecfdf5', '#065f46'),
            'compatible': ('Mos / Turdosh (80–100)', '#ecfdf5', '#065f46'),
            'conditional': ('Shartli mos (60–79)', '#fffbeb', '#92400e'),
            'incompatible': ('Mos emas (0–59)', '#fef2f2', '#991b1b'),
        }
        label, bg, fg = short_decisions.get(obj.decision_type, (obj.get_decision_type_display(), '#f8fafc', '#64748b'))
        return format_html(
            '<span style="display:inline-block;white-space:nowrap;font-size:12px;font-weight:600;background:{};color:{};padding:4px 10px;border-radius:6px;">{}</span>',
            bg, fg, label
        )
    decision_badge.short_description = 'Komissiya xulosasi'

    def total_score_badge(self, obj):
        from django.utils.html import format_html
        score = obj.total_score or 0
        if score >= 80:
            bg, fg = '#ecfdf5', '#065f46'
        elif score >= 60:
            bg, fg = '#fffbeb', '#92400e'
        elif score > 0:
            bg, fg = '#fef2f2', '#991b1b'
        else:
            bg, fg = '#f8fafc', '#64748b'
        return format_html(
            '<span style="display:inline-block;white-space:nowrap;font-weight:700;background:{};color:{};padding:4px 10px;border-radius:6px;">{} / 100</span>',
            bg, fg, score
        )
    total_score_badge.short_description = 'Jami ball'

    def phone_link(self, obj):
        from django.utils.html import format_html
        if obj.phone:
            return format_html('<a href="tel:{}" style="display:inline-block;white-space:nowrap;font-weight:bold;color:#1a73e8;">📞 {}</a>', obj.phone, obj.phone)
        return '-'
    phone_link.short_description = 'Telefon'
    phone_link.allow_tags = True

    def application_type_display(self, obj):
        from django.utils.html import format_html
        icons = {'professional_development': '🎓', 'retraining': '🔄'}
        icon = icons.get(obj.application_type, '📋')
        return format_html('<span style="white-space:nowrap;">{} {}</span>', icon, obj.get_application_type_display())
    application_type_display.short_description = 'Ariza turi'

    def render_change_form(self, request, context, *args, **kwargs):
        from django.utils.safestring import mark_safe
        response = super().render_change_form(request, context, *args, **kwargs)
        auto_sum_js = mark_safe("""
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            var scoreFields = [
                'id_score_subjects',
                'id_score_competencies',
                'id_score_creative',
                'id_score_qualification',
                'id_score_credits',
                'id_score_experience',
                'id_score_portfolio'
            ];
            function updateTotal() {
                var sum = 0;
                scoreFields.forEach(function(id) {
                    var el = document.getElementById(id);
                    if (el) {
                        var v = parseInt(el.value || '0', 10);
                        if (!isNaN(v)) sum += v;
                    }
                });
                if (sum > 100) sum = 100;
                var totalRow = document.querySelector('.field-total_score .readonly');
                if (totalRow) {
                    var label = sum >= 80 ? ' (Mos / Turdosh — 80–100 ball)' :
                                sum >= 60 ? ' (Shartli mos / Qisman turdosh — 60–79 ball)' :
                                sum > 0 ? ' (Mos emas — 0–59 ball)' : '';
                    totalRow.innerHTML = '<strong style="font-size:1.15em;color:#1e3a8a;">' + sum + ' / 100 ball</strong>' + label;
                }
            }
            scoreFields.forEach(function(id) {
                var el = document.getElementById(id);
                if (el) {
                    el.addEventListener('input', updateTotal);
                    el.addEventListener('change', updateTotal);
                }
            });
            updateTotal();
        });
        </script>
        """)
        if hasattr(response, 'render') and callable(response.render):
            response.add_post_render_callback(
                lambda r: setattr(r, 'content', r.content.replace(b'</body>', auto_sum_js.encode('utf-8') + b'</body>'))
            )
        return response


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


@admin.register(AntiCorruptionContent)
class AntiCorruptionContentAdmin(admin.ModelAdmin):
    list_display = ['title', 'hotline_phone', 'agency_hotline', 'officer_name', 'updated_at']

    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('title', 'title_ru', 'title_en', 'intro_text', 'intro_text_ru', 'intro_text_en', 'policy_goals', 'policy_goals_ru', 'policy_goals_en')
        }),
        ('Aloqa va ishonch kanallari (Hotline)', {
            'fields': ('hotline_phone', 'agency_hotline', 'telegram_bot', 'email')
        }),
        ('Komplayens-nazorat mas\'ul shaxsi', {
            'fields': ('officer_name', 'officer_name_ru', 'officer_name_en', 'officer_position', 'officer_position_ru', 'officer_position_en', 'officer_phone', 'officer_photo', 'reception_hours')
        }),
    )

    def has_add_permission(self, request):
        return not AntiCorruptionContent.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(AntiCorruptionDocument)
class AntiCorruptionDocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'document_number', 'date', 'order', 'is_active']
    list_filter = ['category', 'is_active', 'date']
    search_fields = ['title', 'title_ru', 'title_en', 'document_number', 'description']
    list_editable = ['order', 'is_active']
    ordering = ['order', '-date']

    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('title', 'title_ru', 'title_en', 'category', 'document_number', 'date', 'order', 'is_active')
        }),
        ('Fayl yoki havola', {
            'fields': ('file', 'external_url'),
            'description': 'PDF fayl yuklang yoki tashqi qonunchilik havolasini (masalan lex.uz) kiriting.'
        }),
        ('Tavsif va Matn', {
            'fields': ('description', 'description_ru', 'description_en', 'content', 'content_ru', 'content_en'),
            'description': 'Qisqacha tavsif va ichki nizomlar uchun to‘liq matn.'
        }),
    )


class AntiCorruptionPostImageInline(admin.TabularInline):
    model = AntiCorruptionPostImage
    extra = 1
    fields = ('image', 'order')


@admin.register(AntiCorruptionPost)
class AntiCorruptionPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'date', 'views_count', 'order', 'is_active']
    list_filter = ['is_active', 'date']
    search_fields = ['title', 'title_ru', 'title_en', 'content']
    list_editable = ['order', 'is_active']
    ordering = ['order', '-date', '-created_at']
    inlines = [AntiCorruptionPostImageInline]

    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('title', 'title_ru', 'title_en', 'date', 'image', 'order', 'is_active')
        }),
        ('Post matni / Hisobot', {
            'fields': ('content', 'content_ru', 'content_en'),
            'description': 'Tadbir, seminar yoki amaliy ish bo‘yicha to‘liq hisobot va ma\'lumot.'
        }),
        ('Statistika', {
            'fields': ('views_count',),
            'classes': ('collapse',)
        })
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
    fields = ('image_preview', 'image', 'image_url', 'order')
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        url = ''
        if obj and obj.image:
            try:
                url = obj.image.url
            except Exception:
                url = ''
        elif obj and obj.image_url:
            url = obj.image_url
        if url:
            return format_html('<img src="{}" style="width: 90px; height: 64px; object-fit: cover; border-radius: 6px; border: 1px solid #cbd5e1;" />', url)
        return "—"
    image_preview.short_description = "Ko'rinishi"

class DepartmentPostInline(admin.TabularInline):
    model = DepartmentPost
    extra = 0
    fields = ['title', 'date', 'is_active']
    show_change_link = True
    verbose_name = "Amalga oshirilgan ish / loyiha"
    verbose_name_plural = "Bo'lim tomonidan amalga oshirilgan ishlar"

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'order', 'created_at']
    search_fields = ['name', 'name_ru', 'name_en']
    list_editable = ['order']
    inlines = [DepartmentTaskInline, DepartmentPostInline, DepartmentImageInline, DepartmentVideoInline]
    
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



class DepartmentPostForm(forms.ModelForm):
    images_upload = MultipleFileField(
        required=False,
        label="Ko'plab rasmlarni bir vaqtda yuklash (Fotogalereya uchun bir nechta rasm tanlashingiz mumkin)"
    )

    class Meta:
        model = DepartmentPost
        fields = '__all__'


@admin.register(DepartmentPost)
class DepartmentPostAdmin(admin.ModelAdmin):
    form = DepartmentPostForm
    list_display = ('image_preview', 'title', 'department', 'gallery_count', 'views_count', 'date', 'is_active')
    list_display_links = ('image_preview', 'title')
    list_filter = ('department', 'date', 'is_active')
    search_fields = ('title', 'content', 'title_ru', 'title_en')
    readonly_fields = ('image_preview',)

    formfield_overrides = {
        models.TextField: {'widget': RichTextWidget},
    }
    fieldsets = (
        ('Asosiy ma\'lumotlar', {
            'fields': ('department', 'title', 'title_ru', 'title_en', 'image_preview', 'image', 'images_upload', 'image_url', 'video', 'video_url', 'date', 'views_count', 'is_active')
        }),
        ('Matn (Matnga ixtiyoriy rasmlarni qo\'shish mumkin)', {
            'fields': ('content', 'content_ru', 'content_en')
        }),
    )
    inlines = [DepartmentPostImageInline]

    def image_preview(self, obj):
        url = ''
        if obj and obj.image:
            try:
                url = obj.image.url
            except Exception:
                url = ''
        elif obj and obj.image_url:
            url = obj.image_url
        if url:
            return format_html('<img src="{}" style="width: 72px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid #cbd5e1;" />', url)
        return "—"
    image_preview.short_description = "Asosiy rasm"

    def gallery_count(self, obj):
        cnt = obj.images.count() + (1 if (obj.image or obj.image_url) else 0)
        return f"{cnt} ta rasm"
    gallery_count.short_description = "Fotogalereya"

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        files = request.FILES.getlist('images_upload')
        next_order = obj.images.count() + 1
        for f in files:
            if isinstance(f, list):
                for sub_f in f:
                    if sub_f:
                        DepartmentPostImage.objects.create(post=obj, image=sub_f, order=next_order)
                        next_order += 1
            elif f:
                DepartmentPostImage.objects.create(post=obj, image=f, order=next_order)
                next_order += 1


from django.contrib import messages
from django.urls import path as admin_path, reverse
from django.shortcuts import get_object_or_404
from django.utils.html import escape
from .models import Survey, SurveyQuestion, SurveyResponse, SurveyAnswer, SurveyParticipation
from .survey_parser import parse_survey_from_word


class SurveyQuestionInlineForm(forms.ModelForm):
    options_text = forms.CharField(
        required=False,
        label="Javob variantlari (har qatorda bittadan yozing)",
        widget=forms.Textarea(attrs={
            'rows': 3,
            'style': 'width:100%; min-width:240px; font-size:12.5px; line-height:1.4; padding:6px;',
            'placeholder': "Masalan:\nHa\nYo'q\nHa, lekin takomillashtirish kerak"
        }),
        help_text="Ochiq matnli savollar uchun bo'sh qoldiring."
    )

    class Meta:
        model = SurveyQuestion
        fields = [
            'order', 'question_text', 'question_type', 'is_required',
            'options_text', 'has_detail_input', 'detail_trigger', 'detail_label',
            'question_text_ru', 'question_text_en'
        ]
        widgets = {
            'question_text': forms.Textarea(attrs={'rows': 2, 'style': 'width:100%; min-width:260px; font-weight:600;'}),
            'question_text_ru': forms.Textarea(attrs={'rows': 2, 'style': 'width:100%; min-width:200px;'}),
            'question_text_en': forms.Textarea(attrs={'rows': 2, 'style': 'width:100%; min-width:200px;'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk and isinstance(self.instance.options_json, list):
            self.fields['options_text'].initial = '\n'.join(str(x) for x in self.instance.options_json)

    def save(self, commit=True):
        instance = super().save(commit=False)
        raw_opts = self.cleaned_data.get('options_text', '') or ''
        opts = [line.strip() for line in re.split(r'[\r\n|]+', raw_opts) if line.strip()]
        instance.options_json = opts
        if commit:
            instance.save()
        return instance


class SurveyQuestionInline(admin.TabularInline):
    model = SurveyQuestion
    form = SurveyQuestionInlineForm
    extra = 0
    ordering = ['order', 'id']
    fields = (
        'order', 'question_text', 'question_type', 'is_required',
        'options_text', 'has_detail_input', 'detail_trigger', 'detail_label',
    )


@admin.register(Survey)
class SurveyAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'mode_badge', 'status_badge', 'questions_count_col',
        'responses_count_col', 'word_file_col', 'analytics_actions', 'is_active'
    )
    list_filter = ('status', 'is_anonymous', 'is_active')
    search_fields = ('title', 'description')
    list_editable = ('is_active',)
    inlines = [SurveyQuestionInline]
    actions = ['duplicate_survey_as_draft']

    fieldsets = (
        ("1. Word fayldan savollarni avtomatik yuklash (.docx / .doc)", {
            'description': (
                "<div style='background:#eff6ff;border:1px solid #bfdbfe;color:#1e3a8a;padding:12px 16px;"
                "border-radius:10px;margin-bottom:10px;font-size:13px;line-height:1.5;'>"
                "<strong>💡 Word fayl orqali savollarni yuklash:</strong> Tayyor so‘rovnoma Word faylini "
                "(<code>.docx</code> yoki <code>.doc</code>) quyidagi maydonga yuklab <b>Saqlash (Save)</b> "
                "tugmasini bossangiz, tizim fayl ichidagi barcha savollar va javob variantlarini avtomatik "
                "ajratib oladi. Shuningdek, savollarni pastdagi jadval orqali qo‘lda tahrirlashingiz ham mumkin."
                "</div>"
            ),
            'fields': ('word_file', 'replace_questions_on_upload'),
        }),
        ("2. So‘rovnoma asosiy sozlamalari", {
            'fields': (
                'title', 'title_ru', 'title_en',
                'is_anonymous', 'status', 'allow_multiple',
                'start_date', 'end_date', 'order', 'is_active'
            ),
        }),
        ("3. Kirish va minnatdorchilik matnlari", {
            'fields': (
                'description', 'description_ru', 'description_en',
                'thanks_message', 'thanks_message_ru', 'thanks_message_en'
            ),
        }),
    )

    def mode_badge(self, obj):
        if obj.is_anonymous:
            return format_html(
                '<span style="background:#dcfce7;color:#166534;padding:3px 9px;border-radius:999px;font-weight:700;font-size:11px;">🔒 Anonim</span>'
            )
        return format_html(
            '<span style="background:#fef3c7;color:#92400e;padding:3px 9px;border-radius:999px;font-weight:700;font-size:11px;">👤 Ochiq</span>'
        )
    mode_badge.short_description = "Shakl"

    def status_badge(self, obj):
        colors = {
            'draft': ('#f1f5f9', '#475569', 'Qoralama'),
            'active': ('#dbeafe', '#1d4ed8', 'Faol'),
            'closed': ('#fee2e2', '#b91c1c', 'Yopilgan'),
            'archived': ('#f3e8ff', '#6b21a8', 'Arxiv'),
        }
        bg, fg, label = colors.get(obj.status, ('#f1f5f9', '#475569', obj.status))
        return format_html(
            '<span style="background:{};color:{};padding:3px 9px;border-radius:999px;font-weight:700;font-size:11px;">{}</span>',
            bg, fg, label
        )
    status_badge.short_description = "Holati"

    def questions_count_col(self, obj):
        return f"{obj.questions.count()} ta savol"
    questions_count_col.short_description = "Savollar"

    def responses_count_col(self, obj):
        cnt = obj.responses.count()
        return format_html('<strong style="color:#0f172a;">{} ta</strong> javob', cnt)
    responses_count_col.short_description = "Javoblar"

    def word_file_col(self, obj):
        if obj.word_file:
            return format_html(
                '<a href="{}" target="_blank" style="color:#2563eb;font-weight:600;">📄 Word fayl</a>',
                obj.word_file.url
            )
        return "—"
    word_file_col.short_description = "Yuklangan Word"

    def analytics_actions(self, obj):
        res_url = reverse('admin:survey-results', args=[obj.pk])
        xlsx_url = reverse('admin:survey-export-xlsx', args=[obj.pk])
        csv_url = reverse('admin:survey-export-csv', args=[obj.pk])
        return format_html(
            '<div style="display:flex;gap:6px;flex-wrap:wrap;">'
            '<a href="{}" style="background:#1e3a8a;color:#fff;padding:4px 9px;border-radius:6px;font-size:11px;font-weight:700;text-decoration:none;">📊 Statistika</a>'
            '<a href="{}" style="background:#059669;color:#fff;padding:4px 9px;border-radius:6px;font-size:11px;font-weight:700;text-decoration:none;">📥 Excel</a>'
            '<a href="{}" style="background:#475569;color:#fff;padding:4px 9px;border-radius:6px;font-size:11px;font-weight:700;text-decoration:none;">📄 CSV</a>'
            '</div>',
            res_url, xlsx_url, csv_url
        )
    analytics_actions.short_description = "Tahlil va Eksport"

    @admin.action(description="Tanlangan so‘rovnomadan yangi qoralama nusxa olish")
    def duplicate_survey_as_draft(self, request, queryset):
        for s in queryset:
            old_questions = list(s.questions.all())
            s.pk = None
            s.title = f"{s.title} (Nusxa)"
            s.status = 'draft'
            s.save()
            for q in old_questions:
                q.pk = None
                q.survey = s
                q.save()
        self.message_user(request, "So‘rovnoma nusxasi qoralama sifatida yaratildi.", messages.SUCCESS)

    def save_model(self, request, obj, form, change):
        word_uploaded = 'word_file' in form.changed_data and bool(obj.word_file)
        super().save_model(request, obj, form, change)
        if word_uploaded:
            self._import_questions_from_word(request, obj)

    def save_related(self, request, form, formsets, change):
        word_uploaded = 'word_file' in form.changed_data and bool(form.instance.word_file)
        if word_uploaded and form.instance.replace_questions_on_upload:
            # Skip saving stale inline formset so it doesn't overwrite freshly parsed Word questions
            return
        super().save_related(request, form, formsets, change)

    def _import_questions_from_word(self, request, obj):
        try:
            file_path = obj.word_file.path
            parsed = parse_survey_from_word(file_path)
            questions = parsed.get('questions') or []
            if not questions:
                self.message_user(
                    request,
                    "Word fayl ichidan raqamlangan savollar (1., 2., ...) topilmadi. Fayl formatini tekshiring.",
                    messages.WARNING
                )
                return

            if obj.replace_questions_on_upload:
                obj.questions.all().delete()

            if parsed.get('description') and (not obj.description or obj.replace_questions_on_upload):
                obj.description = parsed['description']
            if parsed.get('thanks_message') and (not obj.thanks_message or obj.replace_questions_on_upload):
                obj.thanks_message = parsed['thanks_message']
            obj.save(update_fields=['description', 'thanks_message'])

            start_order = obj.questions.count()
            for idx, q in enumerate(questions, 1):
                SurveyQuestion.objects.create(
                    survey=obj,
                    order=start_order + idx,
                    question_text=q['question_text'],
                    question_type=q['question_type'],
                    is_required=q['is_required'],
                    options_json=q['options'],
                    has_detail_input=q.get('has_detail_input', False),
                    detail_trigger=q.get('detail_trigger', ''),
                    detail_label=q.get('detail_label', ''),
                )
            self.message_user(
                request,
                f"Word fayldan {len(questions)} ta savol va javob variantlari muvaffaqiyatli yuklandi!",
                messages.SUCCESS
            )
        except Exception as e:
            self.message_user(
                request,
                f"Word faylni o‘qishda xatolik yuz berdi: {e}",
                messages.ERROR
            )

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            admin_path(
                '<int:survey_id>/results/',
                self.admin_site.admin_view(self.survey_results_view),
                name='survey-results',
            ),
            admin_path(
                '<int:survey_id>/export-xlsx/',
                self.admin_site.admin_view(self.export_survey_xlsx_view),
                name='survey-export-xlsx',
            ),
            admin_path(
                '<int:survey_id>/export-csv/',
                self.admin_site.admin_view(self.export_survey_csv_view),
                name='survey-export-csv',
            ),
        ]
        return custom_urls + urls

    def _compute_survey_stats(self, survey):
        questions = list(survey.questions.all().order_by('order', 'id'))
        total_responses = survey.responses.count()
        answers = SurveyAnswer.objects.filter(response__survey=survey).select_related('question', 'response')

        by_q = {q.id: [] for q in questions}
        for a in answers:
            if a.question_id in by_q:
                by_q[a.question_id].append(a)

        stats_list = []
        for q in questions:
            q_answers = by_q.get(q.id, [])
            q_stat = {
                'question': q,
                'total_answered': len(q_answers),
                'options_breakdown': [],
                'text_answers': [],
                'avg_rating': None,
            }
            if q.question_type in ('single', 'multiple', 'yes_no'):
                opts = list(q.options_json or [])
                if q.question_type == 'yes_no' and not opts:
                    opts = ['Ha', 'Yo‘q']
                counts = {opt: 0 for opt in opts}
                for a in q_answers:
                    for sel in (a.selected_options or []):
                        counts[sel] = counts.get(sel, 0) + 1
                    if a.text_answer and a.text_answer.strip():
                        q_stat['text_answers'].append(a.text_answer.strip())
                denom = total_responses if total_responses > 0 else 1
                for opt, cnt in counts.items():
                    pct = round((cnt * 100.0) / denom, 1) if total_responses > 0 else 0.0
                    q_stat['options_breakdown'].append({'option': opt, 'count': cnt, 'percent': pct})
            elif q.question_type in ('rating', 'likert'):
                vals = [a.rating_value for a in q_answers if a.rating_value is not None]
                if vals:
                    q_stat['avg_rating'] = round(sum(vals) / len(vals), 2)
                for score in range(1, 6):
                    cnt = sum(1 for v in vals if v == score)
                    pct = round((cnt * 100.0) / (len(vals) or 1), 1) if vals else 0.0
                    q_stat['options_breakdown'].append({'option': f"{score} ball", 'count': cnt, 'percent': pct})
            else:
                for a in q_answers:
                    if a.text_answer and a.text_answer.strip():
                        q_stat['text_answers'].append(a.text_answer.strip())
            stats_list.append(q_stat)

        return total_responses, stats_list

    def survey_results_view(self, request, survey_id):
        survey = get_object_or_404(Survey, pk=survey_id)
        total_responses, stats_list = self._compute_survey_stats(survey)
        xlsx_url = reverse('admin:survey-export-xlsx', args=[survey.pk])
        csv_url = reverse('admin:survey-export-csv', args=[survey.pk])
        back_url = reverse('admin:core_survey_changelist')

        cards_html = []
        for item in stats_list:
            q = item['question']
            rows_html = []
            for ob in item['options_breakdown']:
                rows_html.append(
                    f"<div style='margin-bottom:10px;'>"
                    f"<div style='display:flex;justify-content:space-between;font-size:13px;font-weight:600;color:#1e293b;margin-bottom:4px;'>"
                    f"<span>{escape(str(ob['option']))}</span>"
                    f"<span>{ob['count']} ta ({ob['percent']}%)</span>"
                    f"</div>"
                    f"<div style='height:10px;background:#e2e8f0;border-radius:999px;overflow:hidden;'>"
                    f"<div style='height:100%;width:{min(100, ob['percent'])}%;background:#2563eb;border-radius:999px;'></div>"
                    f"</div></div>"
                )
            if item['avg_rating'] is not None:
                rows_html.insert(
                    0,
                    f"<p style='font-size:14px;font-weight:700;color:#059669;'>O‘rtacha baho: {item['avg_rating']} / 5</p>"
                )
            if item['text_answers']:
                li_items = ''.join(
                    f"<li style='padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#334155;'>{escape(t)}</li>"
                    for t in item['text_answers']
                )
                rows_html.append(
                    f"<div style='margin-top:10px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 14px;max-height:220px;overflow-y:auto;'>"
                    f"<div style='font-size:12px;font-weight:700;color:#475569;margin-bottom:6px;'>Yozma javoblar / Izohlar ({len(item['text_answers'])} ta):</div>"
                    f"<ul style='margin:0;padding-left:18px;'>{li_items}</ul></div>"
                )
            if not rows_html:
                rows_html.append("<p style='color:#94a3b8;font-size:13px;margin:0;'>Hozircha javoblar yo‘q.</p>")

            cards_html.append(
                f"<div style='background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:18px 20px;margin-bottom:16px;box-shadow:0 1px 2px rgba(0,0,0,0.03);'>"
                f"<div style='font-size:15px;font-weight:700;color:#0f172a;margin-bottom:12px;'>"
                f"{q.order}. {escape(q.question_text)}"
                f"</div>"
                f"{''.join(rows_html)}"
                f"</div>"
            )

        mode_str = "Anonim so‘rovnoma (F.I.Sh. saqlanmaydi)" if survey.is_anonymous else "Ochiq so‘rovnoma"
        html = f"""
        <!DOCTYPE html>
        <html lang="uz">
        <head>
            <meta charset="utf-8">
            <title>Statistika — {escape(survey.title)}</title>
            <style>
                body {{ font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; margin: 0; padding: 28px 16px; color: #0f172a; }}
                .container {{ max-width: 900px; margin: 0 auto; }}
                .btn {{ display: inline-block; padding: 9px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
                    <div>
                        <a href="{back_url}" style="color:#2563eb;text-decoration:none;font-size:13px;font-weight:600;">← So‘rovnomalar ro‘yxatiga qaytish</a>
                        <h1 style="margin:6px 0 4px;font-size:24px;">{escape(survey.title)}</h1>
                        <p style="margin:0;color:#64748b;font-size:13px;">{mode_str} • Jami javoblar: <strong>{total_responses} ta</strong></p>
                    </div>
                    <div style="display:flex;gap:8px;">
                        <a href="{xlsx_url}" class="btn" style="background:#059669;color:#fff;">📥 Excel (.xlsx) yuklab olish</a>
                        <a href="{csv_url}" class="btn" style="background:#334155;color:#fff;">📄 CSV yuklab olish</a>
                    </div>
                </div>
                {''.join(cards_html)}
            </div>
        </body>
        </html>
        """
        from django.http import HttpResponse
        return HttpResponse(html)

    def export_survey_xlsx_view(self, request, survey_id):
        import openpyxl
        from openpyxl.styles import Font, PatternFill, Alignment
        from django.http import HttpResponse
        from django.utils import timezone

        survey = get_object_or_404(Survey, pk=survey_id)
        total_responses, stats_list = self._compute_survey_stats(survey)
        questions = [s['question'] for s in stats_list]
        responses = list(survey.responses.prefetch_related('answers').order_by('created_at'))

        wb = openpyxl.Workbook()
        # Sheet 1: Umumiy statistika
        ws1 = wb.active
        ws1.title = "Umumiy statistika"
        header_fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid")
        header_font = Font(bold=True, color="FFFFFF")

        ws1.append(["So‘rovnoma nomi:", survey.title])
        ws1.append(["So‘rovnoma shakli:", "Anonim" if survey.is_anonymous else "Ochiq"])
        ws1.append(["Jami javoblar soni:", total_responses])
        ws1.append(["Eksport qilingan vaqt:", timezone.localtime().strftime("%Y-%m-%d %H:%M")])
        ws1.append([])

        ws1.append(["Savol №", "Savol matni", "Javob varianti / Yozma javob", "Javoblar soni", "Ulushi (%)"])
        for cell in ws1[ws1.max_row]:
            cell.fill = header_fill
            cell.font = header_font

        for item in stats_list:
            q = item['question']
            if item['options_breakdown']:
                for ob in item['options_breakdown']:
                    ws1.append([q.order, q.question_text, ob['option'], ob['count'], f"{ob['percent']}%"])
            for txt in item['text_answers']:
                ws1.append([q.order, q.question_text, f"[Izoh]: {txt}", 1, "—"])

        ws1.column_dimensions['A'].width = 10
        ws1.column_dimensions['B'].width = 55
        ws1.column_dimensions['C'].width = 45
        ws1.column_dimensions['D'].width = 15
        ws1.column_dimensions['E'].width = 14

        # Sheet 2: Batafsil javoblar (TZ 9-band: anonim rejimda F.I.Sh. ustuni chiqmaydi)
        ws2 = wb.create_sheet(title="Batafsil javoblar")
        headers = ["№", "Yuborilgan vaqt", "Kurs / Yo‘nalish"]
        if not survey.is_anonymous:
            headers.append("Tinglovchi F.I.Sh.")
        for q in questions:
            headers.append(f"{q.order}. {q.question_text}")
        ws2.append(headers)
        for cell in ws2[1]:
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = Alignment(wrap_text=True)

        for idx, resp in enumerate(responses, 1):
            ans_map = {a.question_id: a for a in resp.answers.all()}
            row = [
                idx,
                timezone.localtime(resp.created_at).strftime("%Y-%m-%d %H:%M"),
                resp.course_name or "—",
            ]
            if not survey.is_anonymous:
                row.append(resp.respondent_name or "—")
            for q in questions:
                a = ans_map.get(q.id)
                if not a:
                    row.append("")
                else:
                    parts = []
                    if a.selected_options:
                        parts.append(", ".join(str(x) for x in a.selected_options))
                    if a.rating_value is not None:
                        parts.append(str(a.rating_value))
                    if a.text_answer:
                        parts.append(a.text_answer)
                    row.append(" | ".join(parts))
            ws2.append(row)

        buf = io.BytesIO()
        wb.save(buf)
        buf.seek(0)
        response = HttpResponse(
            buf.getvalue(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = f'attachment; filename="sorovnoma_{survey.id}_hisobot.xlsx"'
        return response

    def export_survey_csv_view(self, request, survey_id):
        import csv
        from django.http import HttpResponse
        from django.utils import timezone

        survey = get_object_or_404(Survey, pk=survey_id)
        questions = list(survey.questions.all().order_by('order', 'id'))
        responses = list(survey.responses.prefetch_related('answers').order_by('created_at'))

        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="sorovnoma_{survey.id}_javoblar.csv"'
        response.write('\ufeff')  # UTF-8 BOM for Excel

        writer = csv.writer(response)
        headers = ["№", "Yuborilgan vaqt", "Kurs / Yo‘nalish"]
        if not survey.is_anonymous:
            headers.append("Tinglovchi F.I.Sh.")
        for q in questions:
            headers.append(f"{q.order}. {q.question_text}")
        writer.writerow(headers)

        for idx, resp in enumerate(responses, 1):
            ans_map = {a.question_id: a for a in resp.answers.all()}
            row = [
                idx,
                timezone.localtime(resp.created_at).strftime("%Y-%m-%d %H:%M"),
                resp.course_name or "",
            ]
            if not survey.is_anonymous:
                row.append(resp.respondent_name or "")
            for q in questions:
                a = ans_map.get(q.id)
                if not a:
                    row.append("")
                else:
                    parts = []
                    if a.selected_options:
                        parts.append(", ".join(str(x) for x in a.selected_options))
                    if a.rating_value is not None:
                        parts.append(str(a.rating_value))
                    if a.text_answer:
                        parts.append(a.text_answer)
                    row.append(" | ".join(parts))
            writer.writerow(row)

        return response


class SurveyAnswerInline(admin.TabularInline):
    model = SurveyAnswer
    extra = 0
    readonly_fields = ('question', 'selected_options', 'text_answer', 'rating_value')
    can_delete = False


@admin.register(SurveyResponse)
class SurveyResponseAdmin(admin.ModelAdmin):
    list_display = ('id', 'survey', 'who_col', 'course_name', 'created_at')
    list_filter = ('survey', 'created_at')
    readonly_fields = ('survey', 'respondent_name', 'course_name', 'created_at')
    inlines = [SurveyAnswerInline]

    def who_col(self, obj):
        if obj.survey.is_anonymous:
            return "🔒 Anonim tinglovchi"
        return obj.respondent_name or "—"
    who_col.short_description = "Respondent"

