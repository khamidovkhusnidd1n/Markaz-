import re

file_path = r"C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\Backend\core\admin.py"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Find TeacherAdmin fieldsets
teacher_admin_pattern = r"        \('Mukofotlar', \{\n            'fields': \('awards', 'awards_ru', 'awards_en'\)\n        \}\),"
teacher_admin_replacement = r"""        ('Mukofotlar', {
            'fields': ('awards', 'awards_ru', 'awards_en')
        }),
        ('Biografiyasi', {
            'fields': ('biography', 'biography_ru', 'biography_en')
        }),"""

content = re.sub(teacher_admin_pattern, teacher_admin_replacement, content, count=1)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("admin.py patched.")
