import re
file_path = r'C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\Backend\core\models.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacement = '''    title_ru = models.CharField(max_length=300, blank=True, default='', verbose_name="Loyiha nomi (RU)")
    title_en = models.CharField(max_length=300, blank=True, default='', verbose_name="Loyiha nomi (EN)")
    
    description = models.TextField(blank=True, default='', verbose_name="Loyiha tavsifi")
    description_ru = models.TextField(blank=True, default='', verbose_name="Loyiha tavsifi (RU)")
    description_en = models.TextField(blank=True, default='', verbose_name="Loyiha tavsifi (EN)")'''

content = content.replace(
    '    title_ru = models.CharField(max_length=300, blank=True, default=\'\', verbose_name="Loyiha nomi (RU)")\n    title_en = models.CharField(max_length=300, blank=True, default=\'\', verbose_name="Loyiha nomi (EN)")',
    replacement
)

save_replacement = '''    def save(self, *args, **kwargs):
        if not getattr(self, 'title_ru', '') or not getattr(self, 'title_en', ''):
            try:
                if self.title:
                    self.title_ru, self.title_en = translate_text(self.title)
            except Exception as e:
                pass
        
        if not getattr(self, 'description_ru', '') or not getattr(self, 'description_en', ''):
            try:
                if getattr(self, 'description', ''):
                    self.description_ru, self.description_en = translate_text(self.description)
            except Exception as e:
                pass

        super().save(*args, **kwargs)'''

old_save = '''    def save(self, *args, **kwargs):
        if not getattr(self, 'title_ru', '') or not getattr(self, 'title_en', ''):
            try:
                if self.title:
                    self.title_ru, self.title_en = translate_text(self.title)
            except Exception as e:
                pass
        super().save(*args, **kwargs)'''

content = content.replace(old_save, save_replacement)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('models.py updated')
