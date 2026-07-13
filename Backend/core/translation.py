# Offline translation module for SAYT Django backend
# Resolves the import bug in translate_all.py and handles offline translation

TRANSLATABLE_MODELS = {
    'News': ['title', 'content'],
    'NewsCategory': ['name'],
    'ArtGalleryItem': ['title', 'description'],
    'Teacher': ['position', 'degree', 'title', 'awards'],
    'Personnel': ['position', 'duties', 'biography'],
    'Course': ['title', 'description'],
    'Document': ['title'],
    'AppContent': ['history', 'structure', 'student_notes', 'site_name'],
    'InternationalProject': ['title', 'description'],
}

TRANSLATION_DICT = {
    # Courses
    'Badiiy kashtachilik usta-rassomi': {
        'ru': 'Мастер-художник по художественной вышивке',
        'en': 'Master artist of artistic embroidery'
    },
    'Badiiy zardoʻzlik usta-rassomi': {
        'ru': 'Мастер-художник по художественной золотой вышивке',
        'en': 'Master artist of artistic gold embroidery'
    },
    'Dastgohli rangtasvir rassomi': {
        'ru': 'Художник станковой живописи',
        'en': 'Easel painting artist'
    },
    'Liboslar dizayneri': {
        'ru': 'Дизайнер одежды',
        'en': 'Fashion designer'
    },
    'Rangtasvir (turlari boʻyicha)': {
        'ru': 'Живопись (по видам)',
        'en': 'Painting (by types)'
    },
    'Tasviriy sanʼat (turlari boʻyicha)': {
        'ru': 'Изобразительное искусство (по видам)',
        'en': 'Fine arts (by types)'
    },
    'Amaliy sanʼat (turlari boʻyicha)': {
        'ru': 'Прикладное искусство (по видам)',
        'en': 'Applied arts (by types)'
    },
    'Grafika (turlari boʻyicha)': {
        'ru': 'Графика (по видам)',
        'en': 'Graphics (by types)'
    },
    'Dizayn (turlari boʻyicha)': {
        'ru': 'Дизайн (по видам)',
        'en': 'Design (by types)'
    },
    'Sanʼatshunoslik (turlari boʻyicha)': {
        'ru': 'Искусствоведение (по видам)',
        'en': 'Art history (by types)'
    },
    'Haykaltaroshlik (turlari bo‘yicha)': {
        'ru': 'Скульптура (по видам)',
        'en': 'Sculpture (by types)'
    },
    'Muzeyshunoslik (turlari bo‘yicha)': {
        'ru': 'Музееведение (по видам)',
        'en': 'Museology (by types)'
    },
    # Descriptions
    'Ushbu kurs tasviriy san’atning asosiy turlari bo‘yicha zamonaviy o‘qitish metodikalarini o‘zlashtirish, ijodiy yondashuvni rivojlantirish va o‘quv jarayoniga innovatsion pedagogik texnologiyalarni joriy etishni nazarda tutadi.': {
        'ru': 'Этот курс предполагает освоение современных методик преподавания по основным видам изобразительного искусства, развитие творческого подхода и внедрение инновационных педагогических технологий в учебный процесс.',
        'en': 'This course involves the mastery of modern teaching methodologies in the main types of fine arts, the development of a creative approach and the introduction of innovative pedagogical technologies into the educational process.'
    },
    'Ushbu kurs amaliy san’atning asosiy turlari bo‘yicha zamonaviy pedagogik yondashuvlarni o‘rganish, milliy an’analarni ta’lim jarayoniga integratsiya qilish va o‘quv mashg‘ulotlarini samarali tashkil etish ko‘nikmalarini rivojlantirishni nazarda tutadi.': {
        'ru': 'Данный курс предусматривает изучение современных педагогических подходов по основным видам прикладного искусства, интеграцию национальных традиций в образовательный процесс и развитие навыков эффективной организации учебных занятий.',
        'en': 'This course involves the study of modern pedagogical approaches in the main types of applied arts, the integration of national traditions into the educational process, and the development of skills for the effective organization of training sessions.'
    },
    'malaka oshirish kursi pedagoglarning dastgoh grafikasi, kitob grafikasi, plakat, illyustratsiya va zamonaviy raqamli grafika yo‘nalishlari bo‘yicha nazariy bilimlari hamda amaliy mahoratini takomillashtirishga qaratilgan.': {
        'ru': 'курсы повышения квалификации направлены на совершенствование теоретических знаний и практического мастерства педагогов в области станковой графики, книжной графики, плаката, иллюстрации и современной цифровой графики.',
        'en': 'the professional development course is aimed at improving the theoretical knowledge and practical skills of teachers in easel graphics, book graphics, poster, illustration, and modern digital graphics.'
    },
    'malaka oshirish kursi grafik dizayn, interyer dizayni, sanoat dizayni va vizual kommunikatsiya yo‘nalishlari bo‘yicha pedagoglarning nazariy bilimlari hamda amaliy ko‘nikmalarini takomillashtirishga qaratilgan.': {
        'ru': 'курсы повышения квалификации направлены на совершенствование теоретических знаний и практических навыков педагогов по направлениям графического дизайна, дизайна интерьера, промышленного дизайна и визуальных коммуникаций.',
        'en': 'the professional development course is aimed at improving the theoretical knowledge and practical skills of teachers in graphic design, interior design, industrial design, and visual communication.'
    },
    'malaka oshirish kursi tasviriy va amaliy san’at, dizayn hamda grafika yo‘nalishlarining nazariy asoslari, tarixiy rivojlanishi va tahlil metodlarini chuqurlashtirishga qaratilgan.': {
        'ru': 'курсы повышения квалификации направлены на углубление теоретических основ, исторического развития и методов анализа изобразительного и прикладного искусства, дизайна и графики.',
        'en': 'the professional development course is aimed at deepening the theoretical foundations, historical development, and methods of analysis of fine and applied arts, design, and graphics.'
    },
    'malaka oshirish kursi dastgoh va monumental haykaltaroshlik shuningdek, dekorativ plastika yo‘nalishlari bo‘yicha pedagoglarning nazariy bilimlari hamda amaliy mahoratini takomillashtirishga qaratilgan.': {
        'ru': 'курсы повышения квалификации направлены на совершенствование теоретических знаний и практического мастерства педагогов по направлениям станковой и монументальной скульптуры, а также декоративной пластики.',
        'en': 'the professional development course is aimed at improving the theoretical knowledge and practical skills of teachers in easel and monumental sculpture, as well as decorative plastics.'
    },
    'malaka oshirish kursi muzey faoliyatining nazariy asoslari, ekspozitsiya va fond ishini tashkil etish, muzey pedagogikasi hamda madaniy merosni saqlash yo‘nalishlari bo‘yicha kasbiy bilim va ko‘nikmalarni takomillashtirishga qaratilgan.': {
        'ru': 'курсы повышения квалификации направлены на совершенствование профессиональных знаний и навыков по теоретическим основам музейной деятельности, организации экспозиционной и фондовой работы, музейной педагогике и сохранению культурного наследия.',
        'en': 'the professional development course is aimed at improving professional knowledge and skills in the theoretical foundations of museum activity, organization of exposition and fund work, museum pedagogy, and preservation of cultural heritage.'
    },
    # Personnel positions
    "O'zBA huzuridagi Markaz direktori": {
        'ru': 'Директор Центра при Художественной академии Узбекистана',
        'en': 'Director of the Center under the Academy of Arts of Uzbekistan'
    },
    'Qayta tayyorlash va malaka oshirish jarayoni monitoringini olib borish va sifatni baholash bo‘limi boshlig‘i': {
        'ru': 'Начальник отдела мониторинга процесса переподготовки и повышения квалификации и оценки качества',
        'en': 'Head of Department for Monitoring Retraining and Professional Development Process and Quality Assessment'
    },
    'O‘quv jarayonini tashkil etish bo‘limi boshlig‘i': {
        'ru': 'Начальник отдела организации учебного процесса',
        'en': 'Head of Department for Organizing the Educational Process'
    },
    'Bosh hisobchi': {
        'ru': 'Главный бухгалтер',
        'en': 'Chief Accountant'
    },
    "Matbuot va axborot texnologiyalari bo'limi bosh mutaxassi": {
        'ru': 'Главный специалист отдела прессы и информационных технологий',
        'en': 'Chief Specialist of Press and Information Technology Department'
    },
    'Inspektor': {
        'ru': 'Инспектор',
        'en': 'Inspector'
    },
    'Xo‘jalik ishlari bo‘limi boshlig‘i': {
        'ru': 'Начальник хозяйственного отдела',
        'en': 'Head of Household Department'
    },
    "Xalqaro aloqalarni rivojlantirish bo'limi bosh mutaxassisi": {
        'ru': 'Главный специалист отдела развития международных связей',
        'en': 'Chief Specialist of International Relations Development Department'
    },
    'Yuristkonsult': {
        'ru': 'Юрисконсульт',
        'en': 'Legal Counsel'
    },
    'Umumiy boʻlim bosh mutaxassisi': {
        'ru': 'Главный специалист общего отдела',
        'en': 'Chief Specialist of General Department'
    },
    'Kotib-ish yurituvchi': {
        'ru': 'Секретарь-делопроизводитель',
        'en': 'Secretary-clerk'
    },
    'O‘quv jarayonini tashkil etish bo‘limi uslubchisi': {
        'ru': 'Методист отдела организации учебного процесса',
        'en': 'Methodologist of Department for Organizing the Educational Process'
    },
    'Qayta tayyorlash va malaka oshirish jarayoni monitoringini olib borish va sifatini baholash bo‘limi uslubchisi': {
        'ru': 'Методист отдела мониторинга процесса переподготовки и повышения квалификации и оценки его качества',
        'en': 'Methodologist of Department for Monitoring Retraining and Professional Development Process and Assessing Its Quality'
    },
    'Buxgalter': {
        'ru': 'Бухгалтер',
        'en': 'Accountant'
    },
}

def translate_text(text, target_lang='ru'):
    """Translate text using static dictionary or a simple offline fallback."""
    if not text:
        return ''
    
    cleaned_text = text.strip()
    if cleaned_text in TRANSLATION_DICT:
        return TRANSLATION_DICT[cleaned_text].get(target_lang, cleaned_text)
    
    # Check lowercase
    if cleaned_text.lower() in {k.lower(): v for k, v in TRANSLATION_DICT.items()}:
        for k, v in TRANSLATION_DICT.items():
            if k.lower() == cleaned_text.lower():
                res = v.get(target_lang, cleaned_text)
                if cleaned_text[0].isupper() and res:
                    return res[0].upper() + res[1:]
                return res

    # Simple suffix offline translator
    suffix = f" ({target_lang.upper()})"
    return f"{cleaned_text}{suffix}"

def auto_translate_instance(obj, fields):
    """Automatically translate specific fields of an instance to RU and EN."""
    changed = False
    for field in fields:
        val = getattr(obj, field, '')
        if not val:
            continue
        
        # Translate to RU
        tf_ru = f'{field}_ru'
        if hasattr(obj, tf_ru):
            current_val = getattr(obj, tf_ru, '')
            if not current_val or current_val.endswith('(RU)'):
                translated = translate_text(val, 'ru')
                setattr(obj, tf_ru, translated)
                changed = True
                
        # Translate to EN
        tf_en = f'{field}_en'
        if hasattr(obj, tf_en):
            current_val = getattr(obj, tf_en, '')
            if not current_val or current_val.endswith('(EN)'):
                translated = translate_text(val, 'en')
                setattr(obj, tf_en, translated)
                changed = True
                
    return changed
