import os
import re

with open("Backend/core/models.py", "r", encoding="utf-8") as f:
    content = f.read()

new_model = """
class DepartmentPost(BaseModel):
    \"\"\"Bo'limga tegishli qilingan ishlar / postlar\"\"\"
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='posts', verbose_name="Bo'lim")
    title = models.CharField(max_length=500, verbose_name="Sarlavha")
    title_ru = models.CharField(max_length=500, blank=True, default='', verbose_name="Sarlavha (RU)")
    title_en = models.CharField(max_length=500, blank=True, default='', verbose_name="Sarlavha (EN)")
    content = models.TextField(verbose_name="Matn")
    content_ru = models.TextField(blank=True, default='', verbose_name="Matn (RU)")
    content_en = models.TextField(blank=True, default='', verbose_name="Matn (EN)")
    image = models.ImageField(upload_to=generate_unique_filename, blank=True, null=True, verbose_name="Rasm")
    date = models.DateField(default=timezone.now, verbose_name="Sana")
    is_active = models.BooleanField(default=True, verbose_name="Faol")

    class Meta:
        verbose_name = "Bo'lim posti (Qilingan ish)"
        verbose_name_plural = "Bo'lim postlari"
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.department.name} - {self.title}"

    def save(self, *args, **kwargs):
        needs_translation = (
            (self.content and (not self.content_ru or not self.content_en)) or
            (self.title and (not self.title_ru or not self.title_en))
        )
        if needs_translation:
            try:
                import urllib.request
                import urllib.parse
                import json
                import re

                def strip_html(text):
                    if not text: return ""
                    return re.sub(r'<[^>]+>', ' ', text).strip()

                def translate_text(text, target):
                    plain = strip_html(text)
                    if not plain:
                        return ''
                    try:
                        url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=uz&tl={target}&dt=t&q=" + urllib.parse.quote(plain)
                        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                        res = urllib.request.urlopen(req, timeout=5)
                        data = json.loads(res.read())
                        return "".join([d[0] for d in data[0] if d[0]])
                    except Exception as e:
                        print("Direct translation error:", e)
                        return ''

                fields = ['title', 'content']
                for f in fields:
                    val = getattr(self, f, '')
                    if val:
                        if not getattr(self, f'{f}_ru', ''):
                            setattr(self, f'{f}_ru', translate_text(val, 'ru') or '')
                        if not getattr(self, f'{f}_en', ''):
                            setattr(self, f'{f}_en', translate_text(val, 'en') or '')
            except Exception as e:
                print(f"DepartmentPost translation failed: {e}")
        super().save(*args, **kwargs)
"""

if "class DepartmentPost" not in content:
    content = content.replace("class DepartmentImage(BaseModel):", new_model + "\nclass DepartmentImage(BaseModel):")
    with open("Backend/core/models.py", "w", encoding="utf-8") as f:
        f.write(content)
    print("Added DepartmentPost")
else:
    print("Already exists")
