import re

file_path = r"C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\Backend\core\admin.py"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix TeacherAdmin fieldsets
teacher_admin_pattern = r"                'awards', 'awards_ru', 'awards_en'\n            \)\n        \}\),"
teacher_admin_replacement = r"""                'awards', 'awards_ru', 'awards_en',
                'biography', 'biography_ru', 'biography_en'
            )
        }),"""

content = re.sub(teacher_admin_pattern, teacher_admin_replacement, content, count=1)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("admin.py fixed.")
