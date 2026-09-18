with open("Backend/core/models.py", "r", encoding="utf-8") as f:
    content = f.read()

# Fix DepartmentTask
content = content.replace('verbose_name = "Bo\'lim batafsil ma\'lumoti (Akkordeon)"', 'verbose_name = "Asosiy vazifa"')
content = content.replace('verbose_name_plural = "Bo\'lim batafsil ma\'lumotlari (Akkordeon)"', 'verbose_name_plural = "Asosiy vazifalar"')
content = content.replace('verbose_name="Sarlavha (Akkordeon nomi)"', 'verbose_name="Vazifa sarlavhasi (ixtiyoriy)"')
content = content.replace('verbose_name="Vazifa matni (Akkordeon ichi)"', 'verbose_name="Vazifa matni"')

# Fix DepartmentImage
content = content.replace('verbose_name = "Bo\'lim batafsil rasmi"', 'verbose_name = "Rasm"')
content = content.replace('verbose_name_plural = "Bo\'lim batafsil rasmlari"', 'verbose_name_plural = "Rasmlar"')

# Fix DepartmentVideo
content = content.replace('verbose_name = "Bo\'lim batafsil videosi"', 'verbose_name = "Video"')
content = content.replace('verbose_name_plural = "Bo\'lim batafsil videolari"', 'verbose_name_plural = "Videolar"')

with open("Backend/core/models.py", "w", encoding="utf-8") as f:
    f.write(content)
