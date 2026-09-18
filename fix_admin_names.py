with open("Backend/core/admin.py", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Remove verbose_names from DepartmentTaskInline since they are now correctly in models.py
content = re.sub(r'    verbose_name = "Asosiy Vazifa \(kartochka\)"\n', '', content)
content = re.sub(r'    verbose_name_plural = "Asosiy Vazifalar \(kartochkalar\)"\n', '', content)

# Remove Eski Vazifalar fieldset
old_fieldsets = """        ('Asosiy ma\\'lumotlar', {
            'fields': (
                'name', 'name_ru', 'name_en',
                'description', 'description_ru', 'description_en',
                'icon_name', 'color_classes', 'order'
            )
        }),
        ('Eski Vazifalar va Media (Zaxira uchun)', {
            'classes': ('collapse',),
            'fields': ('tasks', 'tasks_ru', 'tasks_en', 'detail_image', 'detail_video_url'),
            'description': 'Eski matnli vazifalar va yagona rasm/video formati. Yangi bir nechta rasm va videolarni pastdagi dynamic bo\\'limlardan qo\\'shing.'
        }),
        ('Batafsil ma\\'lumot (Qilingan ishlar)', {"""

new_fieldsets = """        ('Asosiy ma\\'lumotlar', {
            'fields': (
                'name', 'name_ru', 'name_en',
                'description', 'description_ru', 'description_en',
                'icon_name', 'color_classes', 'order'
            )
        }),
        ('Batafsil ma\\'lumot (Qilingan ishlar)', {"""

content = content.replace(old_fieldsets, new_fieldsets)

with open("Backend/core/admin.py", "w", encoding="utf-8") as f:
    f.write(content)
