"""
Models for the Educational Center Management System.
Simplified and cleaned up version.
"""
import os
import uuid
from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator


def generate_unique_filename(instance, filename):
    """Generate unique filename for uploaded files."""
    ext = filename.split('.')[-1]
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    model_name = instance.__class__.__name__.lower()
    return os.path.join(f'uploads/{model_name}/', unique_name)


class BaseModel(models.Model):
    """Abstract base model with common fields."""
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Yaratilgan vaqt")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="O'zgartirilgan vaqt")

    class Meta:
        abstract = True


class News(BaseModel):
    """Yangiliklar modeli"""
    title = models.CharField(max_length=500, verbose_name="Sarlavha")
    title_ru = models.CharField(max_length=500, blank=True, default='', verbose_name="Sarlavha (RU)")
    title_en = models.CharField(max_length=500, blank=True, default='', verbose_name="Sarlavha (EN)")
    category = models.ForeignKey(
        'NewsCategory',
        on_delete=models.SET_NULL,
        related_name='news_items',
        blank=True,
        null=True,
        verbose_name="Kategoriya"
    )
    content = models.TextField(verbose_name="Matn")
    content_ru = models.TextField(blank=True, default='', verbose_name="Matn (RU)")
    content_en = models.TextField(blank=True, default='', verbose_name="Matn (EN)")
    is_important = models.BooleanField(default=False, verbose_name="Muhim")
    is_active = models.BooleanField(default=True, verbose_name="Faol")
    views_count = models.PositiveIntegerField(default=0, verbose_name="Ko'rishlar soni")

    class Meta:
        verbose_name = "Yangilik"
        verbose_name_plural = "Yangiliklar"
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.title_ru or not self.title_en or not self.content_ru or not self.content_en:
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

                fields = []
                for f in fields:
                    val = getattr(self, f, '')
                    if val:
                        if not getattr(self, f'{f}_ru', ''):
                            setattr(self, f'{f}_ru', translate_text(val, 'ru') or '')
                        if not getattr(self, f'{f}_en', ''):
                            setattr(self, f'{f}_en', translate_text(val, 'en') or '')
            except Exception as e:
                print(f"News translation failed: {e}")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class NewsImage(BaseModel):
    """Yangilik rasmlari (inline)"""
    news = models.ForeignKey(News, on_delete=models.CASCADE, related_name='images', verbose_name="Yangilik")
    image = models.ImageField(upload_to=generate_unique_filename, verbose_name="Rasm")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")

    class Meta:
        verbose_name = "Rasm"
        verbose_name_plural = "Rasmlar"
        ordering = ['order']

    def __str__(self):
        return f"Rasm #{self.order} - {self.news.title[:30]}"


class NewsCategory(BaseModel):
    """Yangilik kategoriyalari."""
    name = models.CharField(max_length=150, unique=True, verbose_name="Kategoriya nomi")
    name_ru = models.CharField(max_length=150, blank=True, default='', verbose_name="Kategoriya nomi (RU)")
    name_en = models.CharField(max_length=150, blank=True, default='', verbose_name="Kategoriya nomi (EN)")
    slug = models.SlugField(max_length=180, unique=True, verbose_name="Slug")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")
    is_active = models.BooleanField(default=True, verbose_name="Faol")

    class Meta:
        verbose_name = "Yangilik kategoriyasi"
        verbose_name_plural = "Yangilik kategoriyalari"
        ordering = ['order', 'name']

    def save(self, *args, **kwargs):
        if not self.name_ru or not self.name_en:
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

                fields = []
                for f in fields:
                    val = getattr(self, f, '')
                    if val:
                        if not getattr(self, f'{f}_ru', ''):
                            setattr(self, f'{f}_ru', translate_text(val, 'ru') or '')
                        if not getattr(self, f'{f}_en', ''):
                            setattr(self, f'{f}_en', translate_text(val, 'en') or '')
            except Exception as e:
                print(f"NewsCategory translation failed: {e}")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class GalleryItem(BaseModel):
    """Galereya modeli (albom - bir nechta rasm bilan)"""
    title = models.CharField(max_length=200, verbose_name="Sarlavha", blank=True, default="")
    cover_image = models.ImageField(upload_to=generate_unique_filename, verbose_name="Muqova rasmi")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")
    is_active = models.BooleanField(default=True, verbose_name="Faol")

    class Meta:
        verbose_name = "Galereya albomi"
        verbose_name_plural = "Galereya"
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title or f"Albom #{self.pk}"


class GalleryImage(BaseModel):
    """Galereya ichidagi rasmlar"""
    gallery = models.ForeignKey(GalleryItem, on_delete=models.CASCADE, related_name='images', verbose_name="Galereya")
    image = models.ImageField(upload_to=generate_unique_filename, verbose_name="Rasm")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")

    class Meta:
        verbose_name = "Galereya rasmi"
        verbose_name_plural = "Galereya rasmlari"
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"Rasm #{self.order} - {self.gallery}"


class ArtGalleryItem(BaseModel):
    """Art galereya asarlari."""
    title = models.CharField(max_length=250, verbose_name="Asar nomi")
    title_ru = models.CharField(max_length=250, blank=True, default='', verbose_name="Asar nomi (RU)")
    title_en = models.CharField(max_length=250, blank=True, default='', verbose_name="Asar nomi (EN)")
    author = models.CharField(max_length=250, verbose_name="Muallif")
    image = models.ImageField(upload_to=generate_unique_filename, verbose_name="Foto")
    description = models.TextField(blank=True, verbose_name="Tavsif")
    description_ru = models.TextField(blank=True, default='', verbose_name="Tavsif (RU)")
    description_en = models.TextField(blank=True, default='', verbose_name="Tavsif (EN)")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")
    is_active = models.BooleanField(default=True, verbose_name="Faol")

    class Meta:
        verbose_name = "Art galereya asari"
        verbose_name_plural = "Art galereya"
        ordering = ['order', '-created_at']

    def save(self, *args, **kwargs):
        if not getattr(self, 'title_ru', '') or not getattr(self, 'title_en', '') or not getattr(self, 'description_ru', '') or not getattr(self, 'description_en', ''):
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

                fields = []
                for f in fields:
                    val = getattr(self, f, '')
                    if val:
                        if not getattr(self, f'{f}_ru', ''):
                            setattr(self, f'{f}_ru', translate_text(val, 'ru') or '')
                        if not getattr(self, f'{f}_en', ''):
                            setattr(self, f'{f}_en', translate_text(val, 'en') or '')
            except Exception as e:
                print(f"ArtGalleryItem translation failed: {e}")
        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.title} - {self.author}"


class Appeal(BaseModel):
    """Virtual qabulxona murojaatlari."""
    TYPE_CHOICES = [
        ('murojaat', 'Murojaat'),
        ('shikoyat', 'Shikoyat'),
        ('taklif', 'Taklif'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Kutilmoqda'),
        ('in_progress', 'Jarayonda'),
        ('resolved', 'Ko\'rib chiqildi'),
        ('rejected', 'Rad etildi'),
    ]

    full_name = models.CharField(max_length=300, verbose_name="Murojaatchi F.I.SH")
    appeal_type = models.CharField(max_length=20, choices=TYPE_CHOICES, verbose_name="Murojaat turi")
    description = models.TextField(verbose_name="Tavsif")
    phone = models.CharField(max_length=50, verbose_name="Telefon raqami")
    email = models.EmailField(blank=True, verbose_name="Elektron pochta")
    telegram_link = models.URLField(blank=True, verbose_name="Telegram link")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Holati")
    admin_note = models.TextField(blank=True, verbose_name="Admin izohi / Rezolyutsiya")

    class Meta:
        verbose_name = "Murojaat"
        verbose_name_plural = "Murojaatlar"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} - {self.appeal_type}"


class Application(BaseModel):
    """Ariza yuborish yozuvlari."""
    TYPE_CHOICES = [
        ('professional_development', 'Malaka oshirish'),
        ('retraining', 'Qayta tayyorlash'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Kutilmoqda'),
        ('in_progress', 'Jarayonda'),
        ('resolved', 'Ko\'rib chiqildi'),
        ('rejected', 'Rad etildi'),
    ]

    full_name = models.CharField(max_length=300, verbose_name="F.I.SH")
    application_type = models.CharField(max_length=40, choices=TYPE_CHOICES, verbose_name="Ariza turi")
    workplace = models.CharField(max_length=500, verbose_name="Asosiy ish joyi")
    direction = models.CharField(max_length=300, verbose_name="Yo'nalish")
    phone = models.CharField(max_length=50, verbose_name="Telefon raqami")
    telegram_link = models.URLField(blank=True, verbose_name="Telegram link")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Holati")
    admin_note = models.TextField(blank=True, verbose_name="Admin izohi / Rezolyutsiya")

    class Meta:
        verbose_name = "Ariza"
        verbose_name_plural = "Arizalar"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} - {self.application_type}"


class Listener(BaseModel):
    """Tinglovchilar (Sertifikat egasi) modeli - MO va QT"""
    RECORD_TYPE_CHOICES = [
        ('MO', 'Malaka oshirish (MO)'),
        ('QT', 'Qayta tayyorlash (QT)'),
    ]

    record_type = models.CharField(
        max_length=5,
        choices=RECORD_TYPE_CHOICES,
        default='MO',
        verbose_name="Sertifikat turi"
    )
    full_name = models.CharField(max_length=300, verbose_name="F.I.SH")
    workplace = models.CharField(max_length=500, blank=True, verbose_name="Ish joyi")
    course_type = models.CharField(max_length=300, blank=True, verbose_name="Yo'nalish")
    series = models.CharField(max_length=20, verbose_name="Seriya")
    number = models.CharField(max_length=50, verbose_name="Raqam")
    duration = models.CharField(max_length=200, blank=True, verbose_name="O'qish muddati (davri)")
    is_verified = models.BooleanField(default=True, verbose_name="Tasdiqlangan")

    class Meta:
        verbose_name = "Tinglovchi"
        verbose_name_plural = "Tinglovchilar (Sertifikatlar)"
        ordering = ['-created_at']
        unique_together = ['series', 'number']

    def __str__(self):
        return f"{self.full_name} - {self.series} {self.number}"

    def save(self, *args, **kwargs):
        # Ensure record_type is uppercase and valid
        if self.record_type:
            self.record_type = self.record_type.upper()
        if self.record_type not in ['MO', 'QT']:
            self.record_type = 'MO'

        # ALWAYS set series from record_type for consistent search
        self.series = self.record_type

        super().save(*args, **kwargs)


class Teacher(BaseModel):
    """O'qituvchilar modeli"""
    full_name = models.CharField(max_length=300, verbose_name="F.I.SH")
    position = models.CharField(max_length=200, verbose_name="Lavozimi")
    position_ru = models.CharField(max_length=200, blank=True, default='', verbose_name="Lavozimi (RU)")
    position_en = models.CharField(max_length=200, blank=True, default='', verbose_name="Lavozimi (EN)")
    degree = models.CharField(max_length=200, blank=True, verbose_name="Ilmiy darajasi")
    degree_ru = models.CharField(max_length=200, blank=True, default='', verbose_name="Ilmiy darajasi (RU)")
    degree_en = models.CharField(max_length=200, blank=True, default='', verbose_name="Ilmiy darajasi (EN)")
    title = models.CharField(max_length=200, blank=True, verbose_name="Unvoni")
    title_ru = models.CharField(max_length=200, blank=True, default='', verbose_name="Unvoni (RU)")
    title_en = models.CharField(max_length=200, blank=True, default='', verbose_name="Unvoni (EN)")
    awards = models.CharField(max_length=300, blank=True, verbose_name="Davlat mukofotlari")
    awards_ru = models.CharField(max_length=300, blank=True, default='', verbose_name="Davlat mukofotlari (RU)")
    awards_en = models.CharField(max_length=300, blank=True, default='', verbose_name="Davlat mukofotlari (EN)")
    biography = models.TextField(blank=True, verbose_name="Biografiyasi")
    biography_ru = models.TextField(blank=True, default='', verbose_name="Biografiyasi (RU)")
    biography_en = models.TextField(blank=True, default='', verbose_name="Biografiyasi (EN)")
    photo = models.ImageField(
        upload_to=generate_unique_filename,
        blank=True,
        null=True,
        verbose_name="Rasm"
    )
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")
    is_active = models.BooleanField(default=True, verbose_name="Faol")

    class Meta:
        verbose_name = "O'qituvchi"
        verbose_name_plural = "O'qituvchilar"
        ordering = ['order', 'full_name']

    def save(self, *args, **kwargs):
        if not getattr(self, 'position_ru', '') or not getattr(self, 'position_en', '') or \
           not getattr(self, 'degree_ru', '') or not getattr(self, 'degree_en', '') or \
           not getattr(self, 'title_ru', '') or not getattr(self, 'title_en', '') or \
           not getattr(self, 'awards_ru', '') or not getattr(self, 'awards_en', '') or \
           not getattr(self, 'biography_ru', '') or not getattr(self, 'biography_en', ''):
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

                fields = []
                for f in fields:
                    val = getattr(self, f, '')
                    if val:
                        if not getattr(self, f'{f}_ru', ''):
                            setattr(self, f'{f}_ru', translate_text(val, 'ru') or '')
                        if not getattr(self, f'{f}_en', ''):
                            setattr(self, f'{f}_en', translate_text(val, 'en') or '')
            except Exception as e:
                print(f"Teacher translation failed: {e}")
        super().save(*args, **kwargs)


    def __str__(self):
        return self.full_name


class Personnel(BaseModel):
    """Xodimlar modeli"""
    CATEGORY_CHOICES = [
        ('leadership', 'Rahbariyat'),
        ('staff', 'Markaziy apparat'),
    ]

    full_name = models.CharField(max_length=300, verbose_name="F.I.SH")
    position = models.CharField(max_length=200, verbose_name="Lavozimi")
    position_ru = models.CharField(max_length=200, blank=True, default='', verbose_name="Lavozimi (RU)")
    position_en = models.CharField(max_length=200, blank=True, default='', verbose_name="Lavozimi (EN)")
    phone = models.CharField(max_length=50, blank=True, verbose_name="Telefon")
    email = models.EmailField(blank=True, verbose_name="Elektron pochta")
    reception_hours = models.CharField(max_length=200, blank=True, verbose_name="Qabul soatlari")
    photo = models.ImageField(
        upload_to=generate_unique_filename,
        blank=True,
        null=True,
        verbose_name="Rasm"
    )
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='staff',
        verbose_name="Kategoriya"
    )
    duties = models.TextField(blank=True, verbose_name="Lavozim vazifasi")
    duties_ru = models.TextField(blank=True, default='', verbose_name="Lavozim vazifasi (RU)")
    duties_en = models.TextField(blank=True, default='', verbose_name="Lavozim vazifasi (EN)")
    biography = models.TextField(blank=True, verbose_name="Biografiyasi")
    biography_ru = models.TextField(blank=True, default='', verbose_name="Biografiyasi (RU)")
    biography_en = models.TextField(blank=True, default='', verbose_name="Biografiyasi (EN)")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")
    is_active = models.BooleanField(default=True, verbose_name="Faol")

    class Meta:
        verbose_name = "Xodim"
        verbose_name_plural = "Xodimlar"
        ordering = ['order', 'full_name']

    def save(self, *args, **kwargs):
        if not getattr(self, 'position_ru', '') or not getattr(self, 'position_en', '') or not getattr(self, 'duties_ru', '') or not getattr(self, 'duties_en', '') or not getattr(self, 'biography_ru', '') or not getattr(self, 'biography_en', ''):
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

                fields = []
                for f in fields:
                    val = getattr(self, f, '')
                    if val:
                        if not getattr(self, f'{f}_ru', ''):
                            setattr(self, f'{f}_ru', translate_text(val, 'ru') or '')
                        if not getattr(self, f'{f}_en', ''):
                            setattr(self, f'{f}_en', translate_text(val, 'en') or '')
            except Exception as e:
                print(f"Personnel translation failed: {e}")
        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.full_name} - {self.position}"


class Course(BaseModel):
    """Kurslar modeli"""
    TYPE_CHOICES = [
        ('professional_development', 'Malaka oshirish'),
        ('retraining', 'Qayta tayyorlash'),
        ('short_professional_development', 'Qisqa malaka oshirish'),
        ('profession_learning', "Kasb o'rganish"),
    ]

    title = models.CharField(max_length=500, verbose_name="Kurs nomi")
    title_ru = models.CharField(max_length=500, blank=True, default='', verbose_name="Kurs nomi (RU)")
    title_en = models.CharField(max_length=500, blank=True, default='', verbose_name="Kurs nomi (EN)")
    course_type = models.CharField(
        max_length=30,
        choices=TYPE_CHOICES,
        default='professional_development',
        verbose_name="Kurs turi"
    )
    duration = models.CharField(max_length=100, blank=True, verbose_name="Davomiyligi")
    description = models.TextField(blank=True, verbose_name="Tavsif")
    description_ru = models.TextField(blank=True, default='', verbose_name="Tavsif (RU)")
    description_en = models.TextField(blank=True, default='', verbose_name="Tavsif (EN)")
    phone_numbers = models.CharField(max_length=500, blank=True, verbose_name="Telefon raqamlari")
    email = models.EmailField(blank=True, verbose_name="Elektron pochta")
    telegram_link = models.URLField(blank=True, verbose_name="Telegram havola")
    photo = models.ImageField(
        upload_to=generate_unique_filename,
        blank=True,
        null=True,
        verbose_name="Kurs rasmi"
    )
    is_active = models.BooleanField(default=True, verbose_name="Faol")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")

    class Meta:
        verbose_name = "Kurs"
        verbose_name_plural = "Kurslar"
        ordering = ['order', 'title']

    def save(self, *args, **kwargs):
        if not getattr(self, 'title_ru', '') or not getattr(self, 'title_en', '') or not getattr(self, 'description_ru', '') or not getattr(self, 'description_en', ''):
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

                fields = []
                for f in fields:
                    val = getattr(self, f, '')
                    if val:
                        if not getattr(self, f'{f}_ru', ''):
                            setattr(self, f'{f}_ru', translate_text(val, 'ru') or '')
                        if not getattr(self, f'{f}_en', ''):
                            setattr(self, f'{f}_en', translate_text(val, 'en') or '')
            except Exception as e:
                print(f"Course translation failed: {e}")
        super().save(*args, **kwargs)


    def __str__(self):
        return self.title


class JournalIssue(BaseModel):
    """Ilmiy jurnal sonlari modeli"""
    year = models.CharField(max_length=10, verbose_name="Yil")
    issue_number = models.CharField(max_length=20, blank=True, verbose_name="Son raqami")
    pdf_file = models.FileField(
        upload_to=generate_unique_filename,
        verbose_name="PDF fayl"
    )
    thumbnail = models.ImageField(
        upload_to=generate_unique_filename,
        blank=True,
        null=True,
        verbose_name="Muqova rasmi"
    )
    is_active = models.BooleanField(default=True, verbose_name="Faol")

    class Meta:
        verbose_name = "Jurnal soni"
        verbose_name_plural = "Jurnal sonlari"
        ordering = ['-year', '-created_at']

    def __str__(self):
        return f"Jurnal {self.year} #{self.issue_number}"


class Document(BaseModel):
    """Hujjatlar modeli"""
    CATEGORY_CHOICES = [
        ('regulatory', "Me'yoriy hujjatlar"),
        ('plan', 'Ish rejalari'),
        ('open_data', "Ochiq ma'lumotlar"),
        ('library', 'Kutubxona'),
    ]

    title = models.CharField(max_length=500, verbose_name="Hujjat nomi")
    title_ru = models.CharField(max_length=500, blank=True, default='', verbose_name="Hujjat nomi (RU)")
    title_en = models.CharField(max_length=500, blank=True, default='', verbose_name="Hujjat nomi (EN)")
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='open_data',
        verbose_name="Kategoriya"
    )
    file = models.FileField(
        upload_to=generate_unique_filename,
        verbose_name="Fayl"
    )
    cover_image = models.ImageField(
        upload_to=generate_unique_filename,
        blank=True,
        null=True,
        verbose_name="Hujjat muqova rasmi"
    )
    is_active = models.BooleanField(default=True, verbose_name="Faol")

    class Meta:
        verbose_name = "Hujjat"
        verbose_name_plural = "Hujjatlar"
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not getattr(self, 'title_ru', '') or not getattr(self, 'title_en', ''):
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

                fields = []
                for f in fields:
                    val = getattr(self, f, '')
                    if val:
                        if not getattr(self, f'{f}_ru', ''):
                            setattr(self, f'{f}_ru', translate_text(val, 'ru') or '')
                        if not getattr(self, f'{f}_en', ''):
                            setattr(self, f'{f}_en', translate_text(val, 'en') or '')
            except Exception as e:
                print(f"Document translation failed: {e}")
        super().save(*args, **kwargs)


    def __str__(self):
        return self.title


class Statistics(BaseModel):
    """Statistika modeli (faqat bitta yozuv bo'ladi)"""
    total_pedagogs = models.PositiveIntegerField(default=0, verbose_name="Umumiy pedagoglar soni")
    professors = models.PositiveIntegerField(default=0, verbose_name="Professorlar soni")
    dotsents = models.PositiveIntegerField(default=0, verbose_name="Dotsentlar soni")
    academics = models.PositiveIntegerField(default=0, verbose_name="Akademiklar soni")
    potential = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name="Ilmiy salohiyat (%)"
    )

    class Meta:
        verbose_name = "Statistika"
        verbose_name_plural = "Statistika"

    def __str__(self):
        return "Markaz Statistikasi"

    @classmethod
    def get_instance(cls):
        instance, created = cls.objects.get_or_create(pk=1)
        return instance


class YearlyStatistics(BaseModel):
    """Yillik statistika modeli"""
    year = models.CharField(max_length=10, unique=True, verbose_name="Yil")
    professional_development_count = models.PositiveIntegerField(
        default=0,
        verbose_name="Malaka oshirish soni"
    )
    retraining_count = models.PositiveIntegerField(
        default=0,
        verbose_name="Qayta tayyorlash soni"
    )

    class Meta:
        verbose_name = "Yillik statistika"
        verbose_name_plural = "Yillik statistikalar"
        ordering = ['-year']

    def __str__(self):
        return f"Statistika {self.year}"


class AppContent(BaseModel):
    """Markaz haqida ma'lumotlar (singleton model)"""
    # Umumiy ma'lumot
    history = models.TextField(blank=True, verbose_name="Umumiy ma'lumot")
    history_ru = models.TextField(blank=True, default='', verbose_name="Umumiy ma'lumot (RU)")
    history_en = models.TextField(blank=True, default='', verbose_name="Umumiy ma'lumot (EN)")

    # Markaz tuzilmasi
    structure = models.TextField(blank=True, verbose_name="Tuzilma haqida matn")
    structure_ru = models.TextField(blank=True, default='', verbose_name="Tuzilma haqida matn (RU)")
    structure_en = models.TextField(blank=True, default='', verbose_name="Tuzilma haqida matn (EN)")
    structure_image = models.ImageField(
        upload_to=generate_unique_filename,
        blank=True,
        null=True,
        verbose_name="Tuzilma rasmi"
    )

    # Tinglovchilar uchun eslatmalar
    student_notes = models.TextField(blank=True, verbose_name="Tinglovchilar uchun eslatma")
    student_notes_ru = models.TextField(blank=True, default='', verbose_name="Tinglovchilar uchun eslatma (RU)")
    student_notes_en = models.TextField(blank=True, default='', verbose_name="Tinglovchilar uchun eslatma (EN)")

    # Aloqa ma'lumotlari
    contact_info = models.TextField(blank=True, verbose_name="Aloqa ma'lumotlari")
    address = models.TextField(blank=True, verbose_name="Manzil")
    map_embed_url = models.URLField(blank=True, verbose_name="Google xarita havolasi")
    site_name = models.CharField(max_length=300, blank=True, verbose_name="Sayt nomi")
    site_name_ru = models.CharField(max_length=300, blank=True, default='', verbose_name="Sayt nomi (RU)")
    site_name_en = models.CharField(max_length=300, blank=True, default='', verbose_name="Sayt nomi (EN)")
    header_logo = models.ImageField(
        upload_to=generate_unique_filename,
        blank=True,
        null=True,
        verbose_name="Yuqori navbar logotipi"
    )
    footer_logo = models.ImageField(
        upload_to=generate_unique_filename,
        blank=True,
        null=True,
        verbose_name="Pastki navbar logotipi"
    )
    hero_video_url = models.URLField(blank=True, verbose_name="Hero banner video havolasi")

    class Meta:
        verbose_name = "Markaz haqida"
        verbose_name_plural = "Markaz haqida"

    def save(self, *args, **kwargs):
        if not self.history_ru or not self.history_en or not self.structure_ru or not self.structure_en or not self.student_notes_ru or not self.student_notes_en or not self.site_name_ru or not self.site_name_en:
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

                fields = []
                for f in fields:
                    val = getattr(self, f, '')
                    if val:
                        if not getattr(self, f'{f}_ru', ''):
                            setattr(self, f'{f}_ru', translate_text(val, 'ru') or '')
                        if not getattr(self, f'{f}_en', ''):
                            setattr(self, f'{f}_en', translate_text(val, 'en') or '')
            except Exception as e:
                print(f"AppContent translation failed: {e}")
        super().save(*args, **kwargs)

    def __str__(self):
        return "Markaz haqida ma'lumotlar"

    @classmethod
    def get_instance(cls):
        instance, created = cls.objects.get_or_create(pk=1)
        return instance


class JournalSettings(BaseModel):
    """Ilmiy jurnal sozlamalari (singleton model)"""
    # Maqola berish tartibi
    article_rules_text = models.TextField(blank=True, verbose_name="Maqola berish tartibi matni")
    article_rules_text_ru = models.TextField(blank=True, default='', verbose_name="Maqola berish tartibi matni (RU)")
    article_rules_text_en = models.TextField(blank=True, default='', verbose_name="Maqola berish tartibi matni (EN)")
    article_rules_pdf = models.FileField(
        upload_to=generate_unique_filename,
        blank=True,
        null=True,
        verbose_name="Maqola berish tartibi (PDF)"
    )

    # Jurnal haqida
    about_journal = models.TextField(blank=True, verbose_name="Jurnal haqida")
    about_journal_ru = models.TextField(blank=True, default='', verbose_name="Jurnal haqida (RU)")
    about_journal_en = models.TextField(blank=True, default='', verbose_name="Jurnal haqida (EN)")
    phone = models.CharField(max_length=100, blank=True, verbose_name="Telefon")
    editorial_address = models.TextField(blank=True, verbose_name="Tahririyat manzili")
    email = models.EmailField(blank=True, verbose_name="Email")
    telegram_primary = models.URLField(blank=True, verbose_name="Telegram havola 1")
    telegram_secondary = models.URLField(blank=True, verbose_name="Telegram havola 2")
    instagram = models.URLField(blank=True, verbose_name="Instagram havola")
    facebook = models.URLField(blank=True, verbose_name="Facebook havola")

    class Meta:
        verbose_name = "Jurnal sozlamalari"
        verbose_name_plural = "Jurnal sozlamalari"

    def save(self, *args, **kwargs):
        if not getattr(self, 'article_rules_text_ru', '') or not getattr(self, 'article_rules_text_en', '') or not getattr(self, 'about_journal_ru', '') or not getattr(self, 'about_journal_en', ''):
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

                fields = []
                for f in fields:
                    val = getattr(self, f, '')
                    if val:
                        if not getattr(self, f'{f}_ru', ''):
                            setattr(self, f'{f}_ru', translate_text(val, 'ru') or '')
                        if not getattr(self, f'{f}_en', ''):
                            setattr(self, f'{f}_en', translate_text(val, 'en') or '')
            except Exception as e:
                print(f"JournalSettings translation failed: {e}")
        super().save(*args, **kwargs)


    def __str__(self):
        return "Ilmiy jurnal sozlamalari"

    @classmethod
    def get_instance(cls):
        instance, created = cls.objects.get_or_create(pk=1)
        return instance


class AppHeroImage(BaseModel):
    """Bosh sahifa hero slider rasmlari."""
    content = models.ForeignKey(AppContent, on_delete=models.CASCADE, related_name='hero_images', verbose_name="Kontent")
    image = models.ImageField(upload_to=generate_unique_filename, verbose_name="Hero banner rasmi")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")

    class Meta:
        verbose_name = "Hero banner rasmi"
        verbose_name_plural = "Hero banner rasmlari"
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"Hero rasm #{self.order}"


class InternationalSettings(BaseModel):
    """Xalqaro aloqalar sahifasi uchun umumiy sozlamalar."""
    hero_title = models.CharField(max_length=300, blank=True, verbose_name="Hero sarlavha")
    hero_title_ru = models.CharField(max_length=300, blank=True, default='', verbose_name="Hero sarlavha (RU)")
    hero_title_en = models.CharField(max_length=300, blank=True, default='', verbose_name="Hero sarlavha (EN)")
    hero_description = models.TextField(blank=True, verbose_name="Hero tavsif")
    hero_description_ru = models.TextField(blank=True, default='', verbose_name="Hero tavsif (RU)")
    hero_description_en = models.TextField(blank=True, default='', verbose_name="Hero tavsif (EN)")
    about_text = models.TextField(blank=True, verbose_name="Bo'lim matni")
    about_text_ru = models.TextField(blank=True, default='', verbose_name="Bo'lim matni (RU)")
    about_text_en = models.TextField(blank=True, default='', verbose_name="Bo'lim matni (EN)")

    class Meta:
        verbose_name = "Xalqaro aloqalar sozlamasi"
        verbose_name_plural = "Xalqaro aloqalar sozlamalari"

    def save(self, *args, **kwargs):
        if not getattr(self, 'hero_title_ru', '') or not getattr(self, 'hero_title_en', '') or not getattr(self, 'hero_description_ru', '') or not getattr(self, 'hero_description_en', '') or not getattr(self, 'about_text_ru', '') or not getattr(self, 'about_text_en', ''):
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

                fields = []
                for f in fields:
                    val = getattr(self, f, '')
                    if val:
                        if not getattr(self, f'{f}_ru', ''):
                            setattr(self, f'{f}_ru', translate_text(val, 'ru') or '')
                        if not getattr(self, f'{f}_en', ''):
                            setattr(self, f'{f}_en', translate_text(val, 'en') or '')
            except Exception as e:
                print(f"InternationalSettings translation failed: {e}")
        super().save(*args, **kwargs)


    def __str__(self):
        return "Xalqaro aloqalar sozlamalari"

    @classmethod
    def get_instance(cls):
        instance, created = cls.objects.get_or_create(pk=1)
        return instance


class InternationalPartner(BaseModel):
    """Xalqaro hamkor tashkilotlar."""
    name = models.CharField(max_length=250, verbose_name="Hamkor nomi")
    country = models.CharField(max_length=120, blank=True, verbose_name="Davlat")
    description = models.TextField(blank=True, verbose_name="Tavsif")
    photo = models.ImageField(
        upload_to=generate_unique_filename,
        blank=True,
        null=True,
        verbose_name="Hamkor fotosi"
    )
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")
    is_active = models.BooleanField(default=True, verbose_name="Faol")

    class Meta:
        verbose_name = "Xalqaro hamkor"
        verbose_name_plural = "Xalqaro hamkorlar"
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class InternationalProject(BaseModel):
    """Xalqaro loyihalar."""
    STATUS_CHOICES = [
        ('planned', 'Rejalashtirilgan'),
        ('ongoing', 'Davom etmoqda'),
        ('completed', 'Yakunlangan'),
    ]

    title = models.CharField(max_length=300, verbose_name="Loyiha nomi")
    title_ru = models.CharField(max_length=300, blank=True, default='', verbose_name="Loyiha nomi (RU)")
    title_en = models.CharField(max_length=300, blank=True, default='', verbose_name="Loyiha nomi (EN)")
    
    description = models.TextField(blank=True, default='', verbose_name="Loyiha tavsifi")
    description_ru = models.TextField(blank=True, default='', verbose_name="Loyiha tavsifi (RU)")
    description_en = models.TextField(blank=True, default='', verbose_name="Loyiha tavsifi (EN)")
    description = models.TextField(blank=True, verbose_name="Tavsif")
    description_ru = models.TextField(blank=True, default='', verbose_name="Tavsif (RU)")
    description_en = models.TextField(blank=True, default='', verbose_name="Tavsif (EN)")
    partners_text = models.CharField(max_length=500, blank=True, verbose_name="Hamkorlar")
    start_date = models.DateField(verbose_name="Boshlanish sanasi")
    end_date = models.DateField(blank=True, null=True, verbose_name="Tugash sanasi")
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='ongoing',
        verbose_name="Holati"
    )
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")
    is_active = models.BooleanField(default=True, verbose_name="Faol")

    class Meta:
        verbose_name = "Xalqaro loyiha"
        verbose_name_plural = "Xalqaro loyihalar"
        ordering = ['order', '-start_date']

    def save(self, *args, **kwargs):
        if not getattr(self, 'title_ru', '') or not getattr(self, 'title_en', '') or not getattr(self, 'description_ru', '') or not getattr(self, 'description_en', ''):
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

                fields = []
                for f in fields:
                    val = getattr(self, f, '')
                    if val:
                        if not getattr(self, f'{f}_ru', ''):
                            setattr(self, f'{f}_ru', translate_text(val, 'ru') or '')
                        if not getattr(self, f'{f}_en', ''):
                            setattr(self, f'{f}_en', translate_text(val, 'en') or '')
            except Exception as e:
                print(f"InternationalProject translation failed: {e}")
        super().save(*args, **kwargs)


    def __str__(self):
        return self.title


class InternationalProjectImage(BaseModel):
    """Xalqaro loyiha rasmlari."""
    project = models.ForeignKey(
        InternationalProject,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name="Loyiha"
    )
    image = models.ImageField(upload_to=generate_unique_filename, verbose_name="Rasm")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")

    class Meta:
        verbose_name = "Loyiha rasmi"
        verbose_name_plural = "Loyiha rasmlari"
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.project.title} - {self.order}"


class InternationalMedia(BaseModel):
    """Xalqaro sahifa media modullari."""
    MEDIA_TYPE_CHOICES = [
        ('photo', 'Foto'),
        ('video', 'Video'),
    ]

    title = models.CharField(max_length=300, verbose_name="Sarlavha")
    description = models.TextField(blank=True, verbose_name="Tavsif")
    media_type = models.CharField(
        max_length=20,
        choices=MEDIA_TYPE_CHOICES,
        default='photo',
        verbose_name="Media turi"
    )
    image = models.ImageField(
        upload_to=generate_unique_filename,
        blank=True,
        null=True,
        verbose_name="Rasm"
    )
    youtube_url = models.URLField(blank=True, verbose_name="YouTube havola")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")
    is_active = models.BooleanField(default=True, verbose_name="Faol")

    class Meta:
        verbose_name = "Xalqaro media"
        verbose_name_plural = "Xalqaro media"
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.get_media_type_display()}: {self.title}"
# -- New Models Appended --

class Department(BaseModel):
    """Bo'limlar"""
    name = models.CharField(max_length=200, verbose_name="Bo'lim nomi")
    name_ru = models.CharField(max_length=200, blank=True, default='', verbose_name="Bo'lim nomi (RU)")
    name_en = models.CharField(max_length=200, blank=True, default='', verbose_name="Bo'lim nomi (EN)")
    
    icon_name = models.CharField(max_length=50, blank=True, verbose_name="Ikonka nomi (Frontend uchun)")
    color_classes = models.CharField(max_length=100, blank=True, verbose_name="Rang sinflari (Frontend uchun)")
    
    description = models.TextField(blank=True, verbose_name="Qisqacha ta'rif", help_text="Bo'lim haqida banner ostida chiqadigan qisqacha ma'lumot.")
    description_ru = models.TextField(blank=True, default='', verbose_name="Qisqacha ta'rif (RU)", help_text="Ruscha qisqacha ta'rif.")
    description_en = models.TextField(blank=True, default='', verbose_name="Qisqacha ta'rif (EN)", help_text="Inglizcha qisqacha ta'rif.")
    
    
    detail_text = models.TextField(blank=True, verbose_name="Batafsil ma'lumot (Qilingan ishlar)", help_text="DIQQAT: Matndagi sarlavhalarni H3 (Heading 3) yoki Qalin (Bold) formatda yozsangiz, saytda ular chiroyli ochilib-yopiladigan akordeon kartalarga aylanadi.")
    detail_text_ru = models.TextField(blank=True, default='', verbose_name="Batafsil ma'lumot (RU)", help_text="Ruscha batafsil ma'lumot. H3 yoki Bold sarlavhalar ishlating.")
    detail_text_en = models.TextField(blank=True, default='', verbose_name="Batafsil ma'lumot (EN)", help_text="Inglizcha batafsil ma'lumot. H3 yoki Bold sarlavhalar ishlating.")
    
    order = models.IntegerField(default=0, verbose_name="Tartib raqami", help_text="Bo'limlar ro'yxatidagi tartibi.")

    class Meta:
        verbose_name = "Bo'lim"
        verbose_name_plural = "Bo'limlar"
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not getattr(self, 'name_ru', '') or not getattr(self, 'name_en', '') or \
           not getattr(self, 'description_ru', '') or not getattr(self, 'description_en', '') or \
           not getattr(self, 'detail_text_ru', '') or not getattr(self, 'detail_text_en', ''):
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

                fields = ['name', 'description', 'detail_text']
                for f in fields:
                    val = getattr(self, f, '')
                    if val:
                        if not getattr(self, f'{f}_ru', ''):
                            setattr(self, f'{f}_ru', translate_text(val, 'ru') or '')
                        if not getattr(self, f'{f}_en', ''):
                            setattr(self, f'{f}_en', translate_text(val, 'en') or '')

            except Exception as e:
                print(f"Department translation failed: {e}")
        super().save(*args, **kwargs)


class DepartmentTask(BaseModel):
    """Bo'limning asosiy vazifalari"""
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='department_tasks', verbose_name="Bo'lim")
    title = models.CharField(max_length=255, default="", verbose_name="Vazifa sarlavhasi (ixtiyoriy)")
    title_ru = models.CharField(max_length=255, blank=True, default='', verbose_name="Sarlavha (RU)")
    title_en = models.CharField(max_length=255, blank=True, default='', verbose_name="Sarlavha (EN)")
    task_text = models.TextField(verbose_name="Vazifa matni")
    task_text_ru = models.TextField(blank=True, default='', verbose_name="Vazifa matni (RU)")
    task_text_en = models.TextField(blank=True, default='', verbose_name="Vazifa matni (EN)")
    order = models.IntegerField(default=0, verbose_name="Tartib raqami")

    class Meta:
        verbose_name = "Asosiy vazifa"
        verbose_name_plural = "Asosiy vazifalar"
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.department.name} - {self.title or self.task_text[:50]}"

    def save(self, *args, **kwargs):
        needs_translation = (
            (self.task_text and (not self.task_text_ru or not self.task_text_en)) or
            (self.title and (not self.title_ru or not self.title_en))
        )
        if needs_translation:
            try:
                import urllib.request
                import urllib.parse
                import json
                import re

                def strip_html(text):
                    return re.sub(r'<[^>]+>', ' ', text).strip()

                def translate(text, target):
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

                if self.title:
                    if not self.title_ru:
                        self.title_ru = translate(self.title, 'ru')
                    if not self.title_en:
                        self.title_en = translate(self.title, 'en')
                if self.task_text:
                    if not self.task_text_ru:
                        self.task_text_ru = translate(self.task_text, 'ru')
                    if not self.task_text_en:
                        self.task_text_en = translate(self.task_text, 'en')
            except Exception as e:
                print(f"DepartmentTask translation failed: {e}")

        super().save(*args, **kwargs)



class DepartmentPost(BaseModel):
    """Bo'limga tegishli qilingan ishlar / postlar"""
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='posts', verbose_name="Bo'lim")
    title = models.CharField(max_length=500, verbose_name="Sarlavha")
    title_ru = models.CharField(max_length=500, blank=True, default='', verbose_name="Sarlavha (RU)")
    title_en = models.CharField(max_length=500, blank=True, default='', verbose_name="Sarlavha (EN)")
    content = models.TextField(verbose_name="Matn")
    content_ru = models.TextField(blank=True, default='', verbose_name="Matn (RU)")
    content_en = models.TextField(blank=True, default='', verbose_name="Matn (EN)")
    image = models.ImageField(upload_to=generate_unique_filename, blank=True, null=True, verbose_name="Rasm (Asosiy)")
    image_url = models.URLField(blank=True, verbose_name="Rasm havolasi (Asosiy)")
    video = models.FileField(upload_to=generate_unique_filename, blank=True, null=True, verbose_name="Video (Asosiy)")
    video_url = models.URLField(blank=True, verbose_name="Video havolasi (Asosiy)")
    date = models.DateField(default=timezone.now, verbose_name="Sana")
    is_active = models.BooleanField(default=True, verbose_name="Faol")
    views_count = models.PositiveIntegerField(default=0, verbose_name="Ko'rishlar soni")

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

class DepartmentPostImage(BaseModel):
    """Bo'lim postlariga tegishli qo'shimcha rasmlar"""
    post = models.ForeignKey(DepartmentPost, on_delete=models.CASCADE, related_name='images', verbose_name="Post")
    image = models.ImageField(upload_to=generate_unique_filename, blank=True, null=True, verbose_name="Rasm (Qo'shimcha)")
    image_url = models.URLField(blank=True, verbose_name="Rasm havolasi (Qo'shimcha)")
    video = models.FileField(upload_to=generate_unique_filename, blank=True, null=True, verbose_name="Video (Qo'shimcha)")
    video_url = models.URLField(blank=True, verbose_name="Video havolasi (Qo'shimcha)")
    order = models.IntegerField(default=0, verbose_name="Tartib raqami")

    class Meta:
        verbose_name = "Post rasmi"
        verbose_name_plural = "Post rasmlari"
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.post.title} - Rasm {self.id}"

class DepartmentImage(BaseModel):
    """Bo'limga tegishli batafsil rasmlar"""
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='images', verbose_name="Bo'lim")
    image = models.ImageField(upload_to=generate_unique_filename, verbose_name="Rasm")
    order = models.IntegerField(default=0, verbose_name="Tartib raqami")

    class Meta:
        verbose_name = "Rasm"
        verbose_name_plural = "Rasmlar"
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.department.name} - Rasm {self.id}"


class DepartmentVideo(BaseModel):
    """Bo'limga tegishli batafsil videolar"""
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='videos', verbose_name="Bo'lim")
    video_url = models.URLField(verbose_name="Video havolasi")
    order = models.IntegerField(default=0, verbose_name="Tartib raqami")

    class Meta:
        verbose_name = "Video"
        verbose_name_plural = "Videolar"
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.department.name} - Video {self.id}"


class Pedagogue(BaseModel):
    """Malaka oshirgan pedagoglar"""
    full_name = models.CharField(max_length=200, verbose_name="F.I.Sh")
    full_name_ru = models.CharField(max_length=200, blank=True, default='', verbose_name="F.I.Sh (RU)")
    full_name_en = models.CharField(max_length=200, blank=True, default='', verbose_name="F.I.Sh (EN)")
    
    bio = models.TextField(blank=True, verbose_name="Biografiya / Qisqacha ma'lumot")
    bio_ru = models.TextField(blank=True, default='', verbose_name="Biografiya (RU)")
    bio_en = models.TextField(blank=True, default='', verbose_name="Biografiya (EN)")
    
    image = models.ImageField(upload_to=generate_unique_filename, blank=True, null=True, verbose_name="Rasm")
    order = models.IntegerField(default=0, verbose_name="Tartib raqami")

    class Meta:
        verbose_name = "Pedagog"
        verbose_name_plural = "Pedagoglar"
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.full_name

    def save(self, *args, **kwargs):
        if not getattr(self, 'full_name_ru', '') or not getattr(self, 'full_name_en', '') or \
           not getattr(self, 'bio_ru', '') or not getattr(self, 'bio_en', ''):
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

                fields = ['full_name', 'bio']
                for f in fields:
                    val = getattr(self, f, '')
                    if val:
                        if not getattr(self, f'{f}_ru', ''):
                            setattr(self, f'{f}_ru', translate_text(val, 'ru') or '')
                        if not getattr(self, f'{f}_en', ''):
                            setattr(self, f'{f}_en', translate_text(val, 'en') or '')

            except Exception as e:
                print(f"Pedagogue translation failed: {e}")
        super().save(*args, **kwargs)


class PedagogueProject(BaseModel):
    """Pedagog loyihalari / Ijodiy ishlar"""
    pedagogue = models.ForeignKey(Pedagogue, on_delete=models.CASCADE, related_name='projects', verbose_name="Pedagog")
    title = models.CharField(max_length=300, verbose_name="Loyiha nomi")
    title_ru = models.CharField(max_length=300, blank=True, default='', verbose_name="Loyiha nomi (RU)")
    title_en = models.CharField(max_length=300, blank=True, default='', verbose_name="Loyiha nomi (EN)")
    
    description = models.TextField(blank=True, default='', verbose_name="Loyiha tavsifi")
    description_ru = models.TextField(blank=True, default='', verbose_name="Loyiha tavsifi (RU)")
    description_en = models.TextField(blank=True, default='', verbose_name="Loyiha tavsifi (EN)")
    
    views_count = models.PositiveIntegerField(default=0, verbose_name="Ko'rishlar soni")
    votes_count = models.PositiveIntegerField(default=0, verbose_name="Ovozlar soni (Like)")

    class Meta:
        verbose_name = "Pedagog loyihasi"
        verbose_name_plural = "Pedagog loyihalari"
        ordering = ['-votes_count', '-created_at']

    def __str__(self):
        return f"{self.title} - {self.pedagogue.full_name}"

    def save(self, *args, **kwargs):
        if not getattr(self, 'title_ru', '') or not getattr(self, 'title_en', ''):
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

                fields = []
                for f in fields:
                    val = getattr(self, f, '')
                    if val:
                        if not getattr(self, f'{f}_ru', ''):
                            setattr(self, f'{f}_ru', translate_text(val, 'ru') or '')
                        if not getattr(self, f'{f}_en', ''):
                            setattr(self, f'{f}_en', translate_text(val, 'en') or '')
            except Exception as e:
                print(f"PedagogueProject translation failed: {e}")
        super().save(*args, **kwargs)


class PedagogueProjectImage(BaseModel):
    """Pedagog loyihasi rasmlari"""
    project = models.ForeignKey(PedagogueProject, on_delete=models.CASCADE, related_name='images', verbose_name="Loyiha")
    image = models.ImageField(upload_to=generate_unique_filename, verbose_name="Rasm")
    
    class Meta:
        verbose_name = "Loyiha rasmi"
        verbose_name_plural = "Loyiha rasmlari"
        ordering = ['created_at']

    def __str__(self):
        return f"Rasm: {self.project.title}"

