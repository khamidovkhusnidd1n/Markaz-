import os

with open("Backend/core/admin.py", "r", encoding="utf-8") as f:
    content = f.read()

new_admin = """
@admin.register(DepartmentPost)
class DepartmentPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'department', 'date', 'is_active')
    list_filter = ('department', 'date', 'is_active')
    search_fields = ('title', 'content', 'title_ru', 'title_en')
    date_hierarchy = 'date'
    formfield_overrides = {
        models.TextField: {'widget': RichTextWidget},
    }
    fieldsets = (
        ('Asosiy ma\\'lumotlar', {
            'fields': ('department', 'title', 'title_ru', 'title_en', 'image', 'date', 'is_active')
        }),
        ('Matn (Matnga ixtiyoriy rasmlarni qo\\'shish mumkin)', {
            'fields': ('content', 'content_ru', 'content_en')
        }),
    )
"""

if "class DepartmentPostAdmin" not in content:
    # First, import DepartmentPost
    if "DepartmentPost," not in content:
        content = content.replace("DepartmentTask,", "DepartmentTask, DepartmentPost,")
    content += "\n" + new_admin
    with open("Backend/core/admin.py", "w", encoding="utf-8") as f:
        f.write(content)
    print("Added DepartmentPostAdmin")
else:
    print("Already exists")
