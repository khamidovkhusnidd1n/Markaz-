import re

file_path = r"C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\Backend\core\models.py"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add biography fields to Teacher
biography_fields = """    awards_ru = models.CharField(max_length=300, blank=True, default='', verbose_name="Davlat mukofotlari (RU)")
    awards_en = models.CharField(max_length=300, blank=True, default='', verbose_name="Davlat mukofotlari (EN)")
    biography = models.TextField(blank=True, verbose_name="Biografiyasi")
    biography_ru = models.TextField(blank=True, default='', verbose_name="Biografiyasi (RU)")
    biography_en = models.TextField(blank=True, default='', verbose_name="Biografiyasi (EN)")"""

content = re.sub(r'    awards_ru =.*?\n    awards_en =.*?\n', biography_fields + '\n', content, count=1)

# 2. Add biography to save() translation logic in Teacher
# Find Teacher class save method
teacher_save_pattern = r'def save\(self, \*args, \*\*kwargs\):\n\s*if not getattr\(self, \'position_ru\', \'\'\) or.*?:'
teacher_save_replacement = r"""def save(self, *args, **kwargs):
        if not getattr(self, 'position_ru', '') or not getattr(self, 'position_en', '') or \
           not getattr(self, 'degree_ru', '') or not getattr(self, 'degree_en', '') or \
           not getattr(self, 'title_ru', '') or not getattr(self, 'title_en', '') or \
           not getattr(self, 'awards_ru', '') or not getattr(self, 'awards_en', '') or \
           not getattr(self, 'biography_ru', '') or not getattr(self, 'biography_en', ''):"""

content = re.sub(teacher_save_pattern, teacher_save_replacement, content, count=1)

fields_pattern = r'fields = \[\'position\', \'degree\', \'title\', \'awards\'\]'
fields_replacement = r"fields = ['position', 'degree', 'title', 'awards', 'biography']"
content = re.sub(fields_pattern, fields_replacement, content, count=1)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("models.py patched.")
