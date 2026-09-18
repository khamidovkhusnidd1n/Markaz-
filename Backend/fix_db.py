import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "markaz_backend.settings")
django.setup()

from core.models import Teacher, Department, News, GalleryItem, Course, Pedagogue

# 1. Teachers
t = Teacher.objects.filter(id=3).first()
if t:
    t.title_ru = "Академик"
    t.save()

for t_id in [4, 5, 6]:
    t = Teacher.objects.filter(id=t_id).first()
    if t:
        if t.position == "O'zbekiston Xalq rassomi":
            t.position_ru = "Народный артист Узбекистана"
            t.position_en = "People's Artist of Uzbekistan"
        elif t.position == "Akademik":
            t.position_ru = "Академик"
            t.position_en = "Academic"
        
        if t.degree == "Professor":
            t.degree_ru = "Профессор"
            t.degree_en = "Professor"
        t.save()

# 2. Departments
departments_data = {
    2: {
        'description': "Qayta tayyorlash va malaka oshirish monitoringi bo'limi",
        'description_ru': 'Отдел мониторинга переподготовки и повышения квалификации',
        'description_en': 'Monitoring department of retraining and advanced training',
        'tasks': "Malaka oshirish kurslarini tashkil etish va monitoring olib borish.",
        'tasks_ru': 'Организация и мониторинг курсов повышения квалификации.',
        'tasks_en': 'Organization and monitoring of advanced training courses.'
    },
    3: {
        'description': "O'quv jarayonlarini tashkil etish bo'limi",
        'description_ru': 'Отдел организации учебных процессов',
        'description_en': 'Department for the organization of educational processes',
        'tasks': "O'quv jarayonini boshqarish va muvofiqlashtirish.",
        'tasks_ru': 'Управление и координация учебного процесса.',
        'tasks_en': 'Management and coordination of the educational process.'
    },
    1: {
        'description': "Matbuot va Axborot Texnologiyalari bo'limi",
        'description_ru': 'Отдел информационных технологий и печати',
        'description_en': 'Press and Information Technologies department',
        'tasks': "Axborot texnologiyalarini joriy etish va matbuot xizmatini boshqarish.",
        'tasks_ru': 'Внедрение информационных технологий и управление прессой.',
        'tasks_en': 'Implementation of information technologies and press management.'
    },
    4: {
        'description': "Xalqaro aloqalarni rivojlantirish bo'limi",
        'description_ru': 'Отдел развития международных связей',
        'description_en': 'Department of international relations development',
        'tasks': "Xorijiy hamkorlar bilan aloqalarni o'rnatish va rivojlantirish.",
        'tasks_ru': 'Установление и развитие сотрудничества с зарубежными партнерами.',
        'tasks_en': 'Establishment and development of cooperation with foreign partners.'
    }
}
for d_id, data in departments_data.items():
    d = Department.objects.filter(id=d_id).first()
    if d:
        for k, v in data.items():
            if not getattr(d, k, None): # Only set if empty
                setattr(d, k, v)
        d.save()

# 3. News
for nid in [8, 9, 12]:
    n = News.objects.filter(id=nid).first()
    if n:
        n.is_active = False
        n.save()

n10 = News.objects.filter(id=10).first()
if n10 and getattr(n10, 'title_ru', ''):
    # just a basic cleaning if needed, or if the translation is wrong
    if '(RU)' in n10.title_ru:
        n10.title_ru = n10.title_ru.replace('(RU)', '').strip()
    if '(EN)' in n10.title_en:
        n10.title_en = n10.title_en.replace('(EN)', '').strip()
    n10.save()

# 4. GalleryItem
g = GalleryItem.objects.filter(id=5).first()
if g:
    g.title = "Markaz faoliyatidan lavhalar"
    g.title_ru = "Эпизоды из деятельности центра"
    g.title_en = "Episodes from the center's activities"
    g.save()

# 5. Courses
courses = Course.objects.all()
for c in courses:
    # If the RU description equals the UZ one
    if c.description_ru == c.description:
        # Generate some translation based on text
        desc_lower = c.description.lower()
        if 'kashtachilik' in desc_lower:
            c.description_ru = "Курс подготовки мастера-художника по художественной вышивке."
            c.description_en = "Master artist training course in artistic embroidery."
        elif 'miniatyura' in desc_lower:
            c.description_ru = "Курс подготовки мастера-художника по миниатюре."
            c.description_en = "Master artist training course in miniature."
        elif 'kulolchilik' in desc_lower:
            c.description_ru = "Курс подготовки мастера-художника по керамике."
            c.description_en = "Master artist training course in ceramics."
        elif "yog'och" in desc_lower:
            c.description_ru = "Курс подготовки мастера-художника по резьбе по дереву."
            c.description_en = "Master artist training course in wood carving."
        elif "zargarlik" in desc_lower:
            c.description_ru = "Курс подготовки мастера-художника по ювелирному делу."
            c.description_en = "Master artist training course in jewelry."
        elif "naqqosh" in desc_lower:
            c.description_ru = "Курс подготовки мастера-художника по росписи."
            c.description_en = "Master artist training course in painting."
        c.save()

# 6. Pedagogues
p = Pedagogue.objects.filter(id=1).first()
if p:
    if not p.bio_ru or p.bio_ru == p.bio or "(RU)" in p.bio_ru:
        p.bio_ru = "Меня так зовут"
    if not p.bio_en or p.bio_en == p.bio or "(EN)" in p.bio_en:
        p.bio_en = "My name is like this"
    
    if not p.full_name_ru or p.full_name_ru == p.full_name or "(RU)" in p.full_name_ru:
        p.full_name_ru = p.full_name.replace("(RU)", "").strip()
    if not p.full_name_en or p.full_name_en == p.full_name or "(EN)" in p.full_name_en:
        p.full_name_en = p.full_name.replace("(EN)", "").strip()
        
    p.save()

print("DB translation fix completed.")
