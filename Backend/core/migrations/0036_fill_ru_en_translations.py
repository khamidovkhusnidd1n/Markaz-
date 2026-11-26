from django.db import migrations

COURSES = {
    8: ("Мастер-художник художественной вышивки", "Master Artist of Artistic Embroidery"),
    9: ("Мастер-художник золотного шитья", "Master Artist of Gold Embroidery"),
    10: ("Художник станковой живописи", "Easel Painting Artist"),
    11: ("Дизайнер одежды", "Fashion Designer"),
    7: ("Живопись (по видам)", "Painting (by types)"),
    2: ("Изобразительное искусство (по видам)", "Fine Arts (by types)"),
    3: ("Прикладное искусство (по видам)", "Applied Arts (by types)"),
    4: ("Графика (по видам)", "Graphics (by types)"),
    5: ("Дизайн (по видам)", "Design (by types)"),
    6: ("Искусствоведение (по видам)", "Art Studies (by types)"),
    12: ("Скульптура (по видам)", "Sculpture (by types)"),
    13: ("Музееведение (по видам)", "Museology (by types)"),
}

COURSE_DESC = {
    "retraining": (
        "<p>Курс переподготовки направлен на формирование у слушателей профессиональных и практических навыков в избранном направлении художественного образования.</p>",
        "<p>This retraining course is aimed at developing professional and practical skills of learners in the chosen field of art education.</p>",
    ),
    "professional_development": (
        "<p>Курс повышения квалификации направлен на совершенствование теоретических знаний и практического мастерства педагогов, освоение современных методик и инновационных педагогических технологий.</p>",
        "<p>This professional development course aims to improve the theoretical knowledge and practical skills of educators and to introduce modern methods and innovative pedagogical technologies.</p>",
    ),
}

TEACHER_TITLES = {
    "Akademik, Professor": ("Академик, профессор", "Academician, Professor"),
    "O'zbekiston Xalq rassomi": ("Народный художник Узбекистана", "People's Artist of Uzbekistan"),
    "O'zbekiston Badiiy akademiyasi raisi": ("Председатель Академии художеств Узбекистана", "Chairman of the Academy of Arts of Uzbekistan"),
    "Tasviriy san'at galereyasi direktori": ("Директор галереи изобразительного искусства", "Director of the Fine Arts Gallery"),
    "San'atshunoslik fanlari doktori": ("Доктор искусствоведения", "Doctor of Art Studies"),
    "Kamoliddin Behzod nomidagi Milliy rassomlik va dizayn instituti professori": (
        "Профессор Национального института художеств и дизайна имени Камолиддина Бехзода",
        "Professor at the Kamoliddin Behzod National Institute of Painting and Design"),
    "Toshkent davlat Arxitektura va qurilish instituti professori": (
        "Профессор Ташкентского государственного архитектурно-строительного института",
        "Professor at the Tashkent State Institute of Architecture and Civil Engineering"),
    "Professor": ("Профессор", "Professor"),
    "-": ("-", "-"),
}

DEPT_TASKS = {
    20: ("Информационное освещение деятельности Центра", "Information Coverage of the Center's Activities",
         "<p>Подготовка и распространение информационных материалов об образовательных, научно-методических, организационных и культурно-просветительских мероприятиях Центра.</p>",
         "<p>Preparing and disseminating information materials about the educational, scientific-methodological, organizational and cultural events held at the Center.</p>"),
    21: ("Ведение официального сайта и социальных сетей", "Managing the Official Website and Social Media",
         "<p>Подготовка, размещение и регулярное обновление материалов на официальном сайте, в Telegram, Instagram и других информационных платформах Центра.</p>",
         "<p>Preparing, publishing and regularly updating content on the Center's official website, Telegram, Instagram and other information platforms.</p>"),
    22: ("Подготовка фото- и видеоматериалов", "Producing Photo and Video Materials",
         "<p>Фото- и видеосъёмка учебных занятий, мероприятий, встреч, семинаров, аттестации и других процессов.</p>",
         "<p>Photo and video coverage of training sessions, events, meetings, seminars, attestations and other activities.</p>"),
    23: ("Обеспечение информационных связей с общественностью", "Ensuring Public Information Relations",
         "<p>Оперативное и достоверное информирование общественности, партнёрских организаций, преподавателей и слушателей о деятельности Центра.</p>",
         "<p>Providing prompt and reliable information about the Center's activities to the public, partner organizations, faculty and learners.</p>"),
    24: ("Соблюдение информационной безопасности и информационной культуры", "Observing Information Security and Information Culture",
         "<p>Обеспечение соблюдения установленного порядка и требований безопасности при использовании информационных ресурсов Центра.</p>",
         "<p>Ensuring compliance with established procedures and security requirements when using the Center's information resources.</p>"),
    25: ("Внедрение современных информационных технологий", "Introducing Modern Information Technologies",
         "<p>Изучение и внедрение новых технологий для цифровизации информационной деятельности, совершенствования создания и распространения контента.</p>",
         "<p>Studying and implementing new technologies to digitalize information activities and improve content creation and distribution.</p>"),
}

AC_DOCS = {
    1: ("Основной закон, регулирующий отношения в сфере противодействия коррупции в Республике Узбекистан.",
        "The main law regulating relations in the field of combating corruption in the Republic of Uzbekistan."),
    2: ("О регулировании отношений, связанных с конфликтом интересов в государственных органах и учреждениях.",
        "On regulating relations related to conflicts of interest in state bodies and institutions."),
    3: ("О налаживании деятельности структур антикоррупционного внутреннего контроля (комплаенс-контроля) в государственных организациях.",
        "On establishing anti-corruption internal control (compliance) structures in state organizations."),
    4: ("Нормы этики в служебной деятельности педагогов и сотрудников, требования недопущения корыстных и коррупционных проявлений.",
        "Ethical standards in the work of educators and staff, and requirements to prevent self-interest and corruption."),
    5: ("Памятка для слушателей и граждан по обращению при столкновении с коррупционными ситуациями.",
        "A guide for learners and citizens on how to report corruption cases."),
}

AC_TITLES = {
    1: ("Закон Республики Узбекистан «О противодействии коррупции»", "Law of the Republic of Uzbekistan \"On Combating Corruption\""),
    2: ("Закон Республики Узбекистан «О конфликте интересов»", "Law of the Republic of Uzbekistan \"On Conflict of Interest\""),
    3: ("Постановление Президента Республики Узбекистан «О дополнительных мерах по эффективной организации антикоррупционной деятельности»",
        "Resolution of the President of the Republic of Uzbekistan \"On Additional Measures for the Effective Organization of Anti-Corruption Activities\""),
    4: ("Кодекс профессиональной этики сотрудников Центра и внутренняя антикоррупционная политика",
        "Code of Professional Ethics of the Center's Staff and Internal Anti-Corruption Policy"),
    5: ("Порядок сообщения о фактах коррупции и памятка о гарантиях защиты",
        "Procedure for Reporting Corruption and Protection Guarantees"),
}


def fill(apps, schema_editor):
    Course = apps.get_model('core', 'Course')
    Teacher = apps.get_model('core', 'Teacher')
    DepartmentTask = apps.get_model('core', 'DepartmentTask')
    Department = apps.get_model('core', 'Department')
    ACDoc = apps.get_model('core', 'AntiCorruptionDocument')

    for c in Course.objects.all():
        ru, en = COURSES.get(c.id, (None, None))
        if ru and not c.title_ru:
            c.title_ru, c.title_en = ru, en
        d = COURSE_DESC.get(c.course_type)
        if d and not c.description_ru:
            c.description_ru, c.description_en = d
        c.save()

    for t in Teacher.objects.all():
        for f in ('position', 'degree', 'title', 'awards'):
            base = getattr(t, f) or ''
            tr = TEACHER_TITLES.get(base.strip())
            if tr:
                if not getattr(t, f + '_ru'):
                    setattr(t, f + '_ru', tr[0])
                if not getattr(t, f + '_en'):
                    setattr(t, f + '_en', tr[1])
        t.save()

    for pk, (tru, ten, xru, xen) in DEPT_TASKS.items():
        DepartmentTask.objects.filter(pk=pk, title_ru='').update(
            title_ru=tru, title_en=ten, task_text_ru=xru, task_text_en=xen)

    Department.objects.filter(pk=1, description_ru='').update(
        description_ru="Главный специалист отдела прессы и информационных технологий обеспечивает освещение деятельности Центра в СМИ, на официальном сайте и в социальных сетях, подготовку информационных и медиаматериалов, фото- и видеоконтента, а также эффективное использование современных информационно-коммуникационных технологий.",
        description_en="The chief specialist of the Press and Information Technologies Department ensures coverage of the Center's activities in the media, on the official website and social networks, prepares information and media content, photo and video materials, and promotes effective use of modern ICT.",
    )

    for pk, (dru, den) in AC_DOCS.items():
        ACDoc.objects.filter(pk=pk, description_ru='').update(description_ru=dru, description_en=den)
    for pk, (tru, ten) in AC_TITLES.items():
        ACDoc.objects.filter(pk=pk, title_ru='').update(title_ru=tru, title_en=ten)


class Migration(migrations.Migration):
    dependencies = [
        ('core', '0035_remove_srisa_and_upsi'),
    ]
    operations = [
        migrations.RunPython(fill, migrations.RunPython.noop),
    ]
