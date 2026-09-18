import re

file_path = r"C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\Backend\core\admin.py"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

new_admin_code = """
from .models import Department, Pedagogue, PedagogueProject, PedagogueProjectImage

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'order', 'created_at']
    search_fields = ['name', 'name_ru', 'name_en']
    list_editable = ['order']
    fieldsets = (
        ('Asosiy ma\\'lumotlar', {
            'fields': (
                'name', 'name_ru', 'name_en',
                'description', 'description_ru', 'description_en',
                'icon_name', 'color_classes', 'order'
            )
        }),
        ('Vazifalar (har bir qatorda bittadan)', {
            'fields': ('tasks', 'tasks_ru', 'tasks_en')
        }),
        ('Batafsil ma\\'lumot (Qilingan ishlar)', {
            'fields': (
                'detail_text', 'detail_text_ru', 'detail_text_en',
                'detail_image', 'detail_video_url'
            )
        }),
    )

@admin.register(Pedagogue)
class PedagogueAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'order', 'created_at']
    search_fields = ['full_name', 'full_name_ru', 'full_name_en']
    list_editable = ['order']
    fieldsets = (
        ('Shaxsiy ma\\'lumotlar', {
            'fields': (
                'full_name', 'full_name_ru', 'full_name_en',
                'bio', 'bio_ru', 'bio_en',
                'image', 'order'
            )
        }),
    )

class PedagogueProjectImageInline(admin.TabularInline):
    model = PedagogueProjectImage
    extra = 1

@admin.register(PedagogueProject)
class PedagogueProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'pedagogue', 'views_count', 'votes_count']
    search_fields = ['title', 'title_ru', 'title_en']
    list_filter = ['pedagogue']
    inlines = [PedagogueProjectImageInline]
    fieldsets = (
        ('Loyiha ma\\'lumotlari', {
            'fields': (
                'pedagogue', 'title', 'title_ru', 'title_en',
                'views_count', 'votes_count'
            )
        }),
    )
"""

content += new_admin_code

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Admin updated with new models.")
