# -- New Models Appended --

class Department(BaseModel):
    """Bo'limlar"""
    name = models.CharField(max_length=200, verbose_name="Bo'lim nomi")
    name_ru = models.CharField(max_length=200, blank=True, default='', verbose_name="Bo'lim nomi (RU)")
    name_en = models.CharField(max_length=200, blank=True, default='', verbose_name="Bo'lim nomi (EN)")
    
    icon_name = models.CharField(max_length=50, blank=True, verbose_name="Ikonka nomi (Frontend uchun)")
    color_classes = models.CharField(max_length=100, blank=True, verbose_name="Rang sinflari (Frontend uchun)")
    
    description = models.TextField(blank=True, verbose_name="Qisqacha ta'rif")
    description_ru = models.TextField(blank=True, default='', verbose_name="Qisqacha ta'rif (RU)")
    description_en = models.TextField(blank=True, default='', verbose_name="Qisqacha ta'rif (EN)")
    
    tasks = models.TextField(blank=True, verbose_name="Asosiy vazifalar (har bir qatorda bittadan)")
    tasks_ru = models.TextField(blank=True, default='', verbose_name="Asosiy vazifalar (RU)")
    tasks_en = models.TextField(blank=True, default='', verbose_name="Asosiy vazifalar (EN)")
    
    detail_text = models.TextField(blank=True, verbose_name="Batafsil ma'lumot (Qilingan ishlar)")
    detail_text_ru = models.TextField(blank=True, default='', verbose_name="Batafsil ma'lumot (RU)")
    detail_text_en = models.TextField(blank=True, default='', verbose_name="Batafsil ma'lumot (EN)")
    
    detail_image = models.ImageField(upload_to=generate_unique_filename, blank=True, null=True, verbose_name="Batafsil rasm")
    detail_video_url = models.URLField(blank=True, verbose_name="Video havolasi")
    order = models.IntegerField(default=0, verbose_name="Tartib raqami")

    class Meta:
        verbose_name = "Bo'lim"
        verbose_name_plural = "Bo'limlar"
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not getattr(self, 'name_ru', '') or not getattr(self, 'name_en', '') or \
           not getattr(self, 'description_ru', '') or not getattr(self, 'description_en', '') or \
           not getattr(self, 'tasks_ru', '') or not getattr(self, 'tasks_en', '') or \
           not getattr(self, 'detail_text_ru', '') or not getattr(self, 'detail_text_en', ''):
            try:
                from deep_translator import GoogleTranslator
                tr_ru = GoogleTranslator(source='uz', target='ru')
                tr_en = GoogleTranslator(source='uz', target='en')
                
                fields = ['name', 'description', 'tasks', 'detail_text']
                for f in fields:
                    if getattr(self, f, '') and not getattr(self, f'{f}_ru', ''):
                        setattr(self, f'{f}_ru', tr_ru.translate(getattr(self, f)) or '')
                    if getattr(self, f, '') and not getattr(self, f'{f}_en', ''):
                        setattr(self, f'{f}_en', tr_en.translate(getattr(self, f)) or '')
            except Exception as e:
                print(f"Department translation failed: {e}")
        super().save(*args, **kwargs)


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
                from deep_translator import GoogleTranslator
                tr_ru = GoogleTranslator(source='uz', target='ru')
                tr_en = GoogleTranslator(source='uz', target='en')
                
                fields = ['full_name', 'bio']
                for f in fields:
                    if getattr(self, f, '') and not getattr(self, f'{f}_ru', ''):
                        setattr(self, f'{f}_ru', tr_ru.translate(getattr(self, f)) or '')
                    if getattr(self, f, '') and not getattr(self, f'{f}_en', ''):
                        setattr(self, f'{f}_en', tr_en.translate(getattr(self, f)) or '')
            except Exception as e:
                print(f"Pedagogue translation failed: {e}")
        super().save(*args, **kwargs)


class PedagogueProject(BaseModel):
    """Pedagog loyihalari / Ijodiy ishlar"""
    pedagogue = models.ForeignKey(Pedagogue, on_delete=models.CASCADE, related_name='projects', verbose_name="Pedagog")
    title = models.CharField(max_length=300, verbose_name="Loyiha nomi")
    title_ru = models.CharField(max_length=300, blank=True, default='', verbose_name="Loyiha nomi (RU)")
    title_en = models.CharField(max_length=300, blank=True, default='', verbose_name="Loyiha nomi (EN)")
    
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
                from deep_translator import GoogleTranslator
                tr_ru = GoogleTranslator(source='uz', target='ru')
                tr_en = GoogleTranslator(source='uz', target='en')
                
                if self.title and not self.title_ru:
                    self.title_ru = tr_ru.translate(self.title) or ''
                if self.title and not self.title_en:
                    self.title_en = tr_en.translate(self.title) or ''
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
