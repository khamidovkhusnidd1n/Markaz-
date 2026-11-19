from django.db import migrations, models

def seed_akt_posts(apps, schema_editor):
    Department = apps.get_model('core', 'Department')
    DepartmentPost = apps.get_model('core', 'DepartmentPost')

    # Find Matbuot va Axborot Texnologiyalari (Department ID 1 or by name)
    dept = Department.objects.filter(id=1).first()
    if not dept:
        dept = Department.objects.filter(name__icontains='axborot').first()
    if not dept:
        dept = Department.objects.first()
    if not dept:
        return

    posts_data = [
        {
            'id': 101,
            'title': "Markaz rasmiy veb-portali (uzbamalaka.uz) va raqamli ekotizimini ishlab chiqish hamda modernizatsiyalash",
            'title_ru': "Разработка и модернизация официального веб-портала (uzbamalaka.uz) и цифровой экосистемы Центра",
            'title_en': "Development and modernization of the Center official web portal (uzbamalaka.uz) and digital ecosystem",
            'content': "<p>Markaz faoliyatini to'liq raqamlashtirish maqsadida zamonaviy veb-portal ishlab chiqildi. Portal orqali tinglovchilar uchun onlayn ro'yxatdan o'tish, shaxsiy kabinet, berilgan sertifikatlar haqiqiyligini tekshirish (reyestr), xalqaro hamkorliklar va virtual qabulxona kabi interaktiv xizmatlar yo'lga qo'yildi.</p><p>Veb-portal zamonaviy xavfsizlik standartlari, qidiruv tizimlari (SEO) va mobil moslashuvchanlik talablariga to'liq javob beradi.</p>",
            'content_ru': "<p>В целях полной цифровизации деятельности Центра разработан современный веб-портал. Через портал внедрены такие интерактивные сервисы, как онлайн-регистрация слушателей, личный кабинет, проверка подлинности выданных сертификатов (реестр), международное сотрудничество и виртуальная приемная.</p>",
            'content_en': "<p>In order to fully digitalize the Center's activities, a modern web portal was developed. Through the portal, interactive services such as online listener registration, personal account, certificate authenticity verification (registry), international cooperation and virtual reception were launched.</p>",
            'image': "uploads/departmentpost/3a0b18689e02494998a7d4ff08d3c0d0.png",
            'date': "2026-09-10",
            'is_active': True,
            'views_count': 142
        },
        {
            'id': 102,
            'title': "O‘zBA Test platformasi va tinglovchilar bilimini avtomatlashtirilgan baholash tizimi",
            'title_ru': "Тестовая платформа O'zBA и автоматизированная система оценки знаний слушателей",
            'title_en': "O'zBA Testing platform and automated knowledge evaluation system",
            'content': "<p>Pedagog va mutaxassis kadrlarning malaka oshirish kurslari yakunida ularning bilim va ko'nikmalarini xolis hamda shaffof baholash uchun maxsus avtomatlashtirilgan onlayn test sinovlari tizimi joriy etildi.</p><p>Tizim test savollari bankini boshqarish, vaqt nazorati, natijalarni avtomatik hisoblash va rasmiy hisobotlarni shakllantirish imkonini beradi.</p>",
            'content_ru': "<p>Для объективной и прозрачной оценки знаний и навыков педагогических кадров по итогам курсов повышения квалификации внедрена специальная автоматизированная система онлайн-тестирования.</p>",
            'content_en': "<p>For an objective and transparent assessment of knowledge and skills of pedagogical personnel, a specialized automated online testing platform was established.</p>",
            'image': "uploads/departmentpost/c0a7f2285bcd4f6a8d486842f0f63caa.png",
            'date': "2026-09-08",
            'is_active': True,
            'views_count': 98
        },
        {
            'id': 103,
            'title': "Axborot xavfsizligi, kiberxavfsizlik ekspertizasi va UZCERT talablariga muvofiqlashtirish",
            'title_ru': "Информационная безопасность, экспертиза кибербезопасности и соответствие требованиям UZCERT",
            'title_en': "Information security, cybersecurity audit and compliance with UZCERT standards",
            'content': "<p>Markaz axborot tizimlari va ma'lumotlar bazalarini kiberxavflardan himoya qilish, SSL/TLS xavfsizlik shifrlashini o'rnatish, OWASP Top-10 standartlari hamda Kiberxavfsizlik markazi DUK (UZCERT) ekspertizasi talablariga to'liq moslashtirish ishlari amalga oshirildi.</p><p>Tizimda SQL injection, XSS, CSRF xavflariga qarshi kompleks himoya choralari joriy qilingan.</p>",
            'content_ru': "<p>Проведены работы по защите информационных систем и баз данных Центра от киберугроз, установке сертификатов SSL/TLS, обеспечению стандартов OWASP Top-10 и полному соответствию требованиям ГУП Центр кибербезопасности (UZCERT).</p>",
            'content_en': "<p>Comprehensive security works were carried out to protect information systems and databases, configure SSL/TLS encryption, and adhere to OWASP Top-10 and UZCERT cybersecurity standards.</p>",
            'image': "uploads/departmentpost/73b234bf5adc4f6fb193a39fc16eacd8.jpg",
            'date': "2026-09-05",
            'is_active': True,
            'views_count': 115
        },
        {
            'id': 104,
            'title': "Multimedia kontentlari, rasmiy veb-sayt va ijtimoiy tarmoqlardagi sahifalarni professional yuritish",
            'title_ru': "Мультимедийный контент, профессиональное ведение официального сайта и страниц в соцсетях",
            'title_en': "Multimedia content production, professional management of official website and social media",
            'content': "<p>Markazda o'tkazilayotgan barcha ta'lim dasturlari, ilmiy-amaliy anjumanlar, ijodiy ko'rgazmalar va xalqaro uchrashuvlar bo'yicha yuqori sifatli foto-video reportajlar tayyorlanib, rasmiy veb-sayt hamda Telegram, YouTube, Facebook va Instagram tarmoqlarida uzluksiz yoritib borilmoqda.</p>",
            'content_ru': "<p>Осуществляется профессиональная фото- и видеосъемка всех учебных программ, научно-практических конференций, выставок и международных встреч с оперативной публикацией на сайте и в социальных сетях.</p>",
            'content_en': "<p>High-quality photo and video materials are produced and published for all educational programs, scientific conferences, exhibitions and international events across the official site and social media channels.</p>",
            'image': "uploads/departmentpost/3b2a4a66159443d191f4ec22e3c2f07d.jpg",
            'date': "2026-09-02",
            'is_active': True,
            'views_count': 164
        }
    ]

    for p in posts_data:
        p_id = p.pop('id')
        DepartmentPost.objects.update_or_create(
            id=p_id,
            defaults={
                'department': dept,
                **p
            }
        )

def unseed_akt_posts(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0026_application_diploma_file_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='departmentpost',
            options={'ordering': ['-date', '-created_at'], 'verbose_name': "Bo'lim amaliy ishi (loyihasi)", 'verbose_name_plural': "Bo'limlar: Amalga oshirilgan ishlar va loyihalar"},
        ),
        migrations.RunPython(seed_akt_posts, unseed_akt_posts),
    ]
