import re

file_path = r"C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\Backend\core\models.py"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add fields to JournalSettings
journal_fields = """    article_rules_text = models.TextField(blank=True, verbose_name="Maqola berish tartibi matni")
    article_rules_text_ru = models.TextField(blank=True, default='', verbose_name="Maqola berish tartibi matni (RU)")
    article_rules_text_en = models.TextField(blank=True, default='', verbose_name="Maqola berish tartibi matni (EN)")"""
content = re.sub(r'    article_rules_text = models\.TextField\(blank=True, verbose_name="Maqola berish tartibi matni"\)', journal_fields, content)

journal_about = """    about_journal = models.TextField(blank=True, verbose_name="Jurnal haqida")
    about_journal_ru = models.TextField(blank=True, default='', verbose_name="Jurnal haqida (RU)")
    about_journal_en = models.TextField(blank=True, default='', verbose_name="Jurnal haqida (EN)")"""
content = re.sub(r'    about_journal = models\.TextField\(blank=True, verbose_name="Jurnal haqida"\)', journal_about, content)

# 2. Add fields to InternationalSettings
int_hero = """    hero_title = models.CharField(max_length=300, blank=True, verbose_name="Hero sarlavha")
    hero_title_ru = models.CharField(max_length=300, blank=True, default='', verbose_name="Hero sarlavha (RU)")
    hero_title_en = models.CharField(max_length=300, blank=True, default='', verbose_name="Hero sarlavha (EN)")"""
content = re.sub(r'    hero_title = models\.CharField\(max_length=300, blank=True, verbose_name="Hero sarlavha"\)', int_hero, content)

int_desc = """    hero_description = models.TextField(blank=True, verbose_name="Hero tavsif")
    hero_description_ru = models.TextField(blank=True, default='', verbose_name="Hero tavsif (RU)")
    hero_description_en = models.TextField(blank=True, default='', verbose_name="Hero tavsif (EN)")"""
content = re.sub(r'    hero_description = models\.TextField\(blank=True, verbose_name="Hero tavsif"\)', int_desc, content)

int_about = """    about_text = models.TextField(blank=True, verbose_name="Bo'lim matni")
    about_text_ru = models.TextField(blank=True, default='', verbose_name="Bo'lim matni (RU)")
    about_text_en = models.TextField(blank=True, default='', verbose_name="Bo'lim matni (EN)")"""
content = re.sub(r'    about_text = models\.TextField\(blank=True, verbose_name="Bo\'lim matni"\)', int_about, content)

def inject_save(class_name, fields, content):
    indent = "    "
    save_method = f"{indent}def save(self, *args, **kwargs):\n"
    conds = []
    for f in fields:
        conds.append(f"not getattr(self, '{f}_ru', '') or not getattr(self, '{f}_en', '')")
    save_method += f"{indent}{indent}if {' or '.join(conds)}:\n"
    save_method += f"{indent}{indent}{indent}try:\n"
    save_method += f"{indent}{indent}{indent}{indent}from deep_translator import GoogleTranslator\n"
    save_method += f"{indent}{indent}{indent}{indent}tr_ru = GoogleTranslator(source='uz', target='ru')\n"
    save_method += f"{indent}{indent}{indent}{indent}tr_en = GoogleTranslator(source='uz', target='en')\n"
    
    for f in fields:
        save_method += f"{indent}{indent}{indent}{indent}if getattr(self, '{f}', '') and not getattr(self, '{f}_ru', ''):\n"
        save_method += f"{indent}{indent}{indent}{indent}{indent}setattr(self, '{f}_ru', tr_ru.translate(getattr(self, '{f}')) or '')\n"
        save_method += f"{indent}{indent}{indent}{indent}if getattr(self, '{f}', '') and not getattr(self, '{f}_en', ''):\n"
        save_method += f"{indent}{indent}{indent}{indent}{indent}setattr(self, '{f}_en', tr_en.translate(getattr(self, '{f}')) or '')\n"
        
    save_method += f"{indent}{indent}{indent}except Exception as e:\n"
    save_method += f"{indent}{indent}{indent}{indent}print(f\"{class_name} translation failed: {{e}}\")\n"
    save_method += f"{indent}{indent}super().save(*args, **kwargs)\n\n"
    
    pattern = r'(class ' + class_name + r'\b.*?)(\n    def __str__\b)'
    match = re.search(pattern, content, flags=re.DOTALL)
    if match and "def save(" not in match.group(1):
        replacement = r'\g<1>\n' + save_method + r'\g<2>'
        return re.sub(pattern, replacement, content, flags=re.DOTALL)
    return content

content = inject_save('JournalSettings', ['article_rules_text', 'about_journal'], content)
content = inject_save('InternationalSettings', ['hero_title', 'hero_description', 'about_text'], content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Applied missing fields and saves.")
