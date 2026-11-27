from django.db import migrations


INITIAL_QUESTIONS = [
    {
        "order": 1,
        "question_type": "single",
        "is_required": True,
        "question_text": "Sizning fikringizcha, ushbu qisqa kurslar qancha muddatda qayta tashkil etilishi maqsadga muvofiq deb hisoblaysiz?",
        "question_text_ru": "Как Вы считаете, с какой периодичностью целесообразно проводить данные курсы повышения квалификации?",
        "question_text_en": "In your opinion, how often should these professional development courses be organized?",
        "options_json": [
            "Har yili bir marta",
            "Har ikki yilda bir marta",
            "Har uch yilda bir marta",
            "Malaka oshirish shart emas"
        ],
        "options_ru_json": [
            "Один раз в год",
            "Один раз в два года",
            "Один раз в три года",
            "Повышение квалификации не требуется"
        ],
        "options_en_json": [
            "Once a year",
            "Once every two years",
            "Once every three years",
            "Professional development is not required"
        ],
        "has_detail_input": False,
        "detail_trigger": "",
        "detail_label": "",
        "detail_label_ru": "",
        "detail_label_en": "",
    },
    {
        "order": 2,
        "question_type": "single",
        "is_required": True,
        "question_text": "Ayting-chi, ta’lim dasturi mutaxassisligingizga mos tuzilganmi?",
        "question_text_ru": "Соответствует ли учебная программа Вашей специальности?",
        "question_text_en": "Is the educational curriculum aligned with your specialty?",
        "options_json": [
            "Ha",
            "Yo‘q",
            "Ha, lekin takomillashtirish kerak"
        ],
        "options_ru_json": [
            "Да",
            "Нет",
            "Да, но требует совершенствования"
        ],
        "options_en_json": [
            "Yes",
            "No",
            "Yes, but needs improvement"
        ],
        "has_detail_input": False,
        "detail_trigger": "",
        "detail_label": "",
        "detail_label_ru": "",
        "detail_label_en": "",
    },
    {
        "order": 3,
        "question_type": "single",
        "is_required": True,
        "question_text": "Professor-o‘qituvchilarning dars mashg‘ulotlaridan qoniqdingizmi?",
        "question_text_ru": "Удовлетворены ли Вы учебными занятиями профессорско-преподавательского состава?",
        "question_text_en": "Are you satisfied with the classes taught by the faculty members?",
        "options_json": [
            "Ha, qoniqdim",
            "Yo‘q, pedagogik mahorat yetishmaydi",
            "Ayrim o‘qituvchilarning darsidan qoniqmadim"
        ],
        "options_ru_json": [
            "Да, полностью удовлетворён(а)",
            "Нет, не хватает педагогического мастерства",
            "Не удовлетворён(а) занятиями отдельных преподавателей"
        ],
        "options_en_json": [
            "Yes, satisfied",
            "No, pedagogical skills are lacking",
            "Not satisfied with some instructors' classes"
        ],
        "has_detail_input": False,
        "detail_trigger": "",
        "detail_label": "",
        "detail_label_ru": "",
        "detail_label_en": "",
    },
    {
        "order": 4,
        "question_type": "text",
        "is_required": False,
        "question_text": "Qaysi professor-o‘qituvchi(lar) o‘quv dars mashg‘ulotlarini juda qiziqarli o‘tkazishdi?",
        "question_text_ru": "Кто из профессорско-преподавательского состава провёл учебные занятия наиболее интересно?",
        "question_text_en": "Which professor(s) or instructor(s) conducted the most engaging classes?",
        "options_json": [],
        "options_ru_json": [],
        "options_en_json": [],
        "has_detail_input": False,
        "detail_trigger": "",
        "detail_label": "O‘qituvchi(lar)ning ismini yozing",
        "detail_label_ru": "Укажите Ф.И.О. преподавателя(ей)",
        "detail_label_en": "Enter the name(s) of the instructor(s)",
    },
    {
        "order": 5,
        "question_type": "text",
        "is_required": False,
        "question_text": "Qaysi professor-o‘qituvchi(lar)ni dars mashg‘ulotiga jalb etmaganimiz ma’qul?",
        "question_text_ru": "Кого из преподавателей, по Вашему мнению, нежелательно привлекать к учебным занятиям?",
        "question_text_en": "Which instructor(s) would you recommend not involving in future training sessions?",
        "options_json": [],
        "options_ru_json": [],
        "options_en_json": [],
        "has_detail_input": False,
        "detail_trigger": "",
        "detail_label": "O‘qituvchi(lar)ning ismini yozing",
        "detail_label_ru": "Укажите Ф.И.О. преподавателя(ей)",
        "detail_label_en": "Enter the name(s) of the instructor(s)",
    },
    {
        "order": 6,
        "question_type": "single",
        "is_required": True,
        "question_text": "Markaz faoliyatida korrupsiya holatlari yoki takliflari kuzatildimi?",
        "question_text_ru": "Наблюдались ли в деятельности Центра проявления или предложения коррупционного характера?",
        "question_text_en": "Were any corruption cases or solicitations observed during the Center's activities?",
        "options_json": [
            "Ha",
            "Yo‘q",
            "Ba’zilar tomonidan taklif bo‘ldi"
        ],
        "options_ru_json": [
            "Да",
            "Нет",
            "Были предложения со стороны отдельных лиц"
        ],
        "options_en_json": [
            "Yes",
            "No",
            "There were solicitations by some individuals"
        ],
        "has_detail_input": True,
        "detail_trigger": "Ba’zilar tomonidan taklif bo‘ldi",
        "detail_label": "Qisqacha tushuntiring (shaxsingiz anonim qoladi):",
        "detail_label_ru": "Кратко поясните ситуацию (анонимность гарантируется):",
        "detail_label_en": "Briefly explain (your identity remains anonymous):",
    },
    {
        "order": 7,
        "question_type": "single",
        "is_required": True,
        "question_text": "Markaz xodimlarining (xususan, guruh rahbarining) Sizga nisbatan munosabati qanday bo‘ldi?",
        "question_text_ru": "Каким было отношение сотрудников Центра (в частности, куратора группы) к Вам?",
        "question_text_en": "How was the attitude of the Center's staff (especially the group coordinator) towards you?",
        "options_json": [
            "Samimiy, do‘stona",
            "Hurmatsiz va qo‘pol",
            "Boshqa"
        ],
        "options_ru_json": [
            "Искреннее, доброжелательное",
            "Неуважительное и грубое",
            "Другое"
        ],
        "options_en_json": [
            "Sincere and friendly",
            "Disrespectful and rude",
            "Other"
        ],
        "has_detail_input": True,
        "detail_trigger": "Boshqa",
        "detail_label": "Izohingizni yozing:",
        "detail_label_ru": "Напишите Ваш комментарий:",
        "detail_label_en": "Enter your comment:",
    },
    {
        "order": 8,
        "question_type": "text",
        "is_required": False,
        "question_text": "Ta’lim dasturlarini takomillashtirish uchun takliflaringiz bormi?",
        "question_text_ru": "Есть ли у Вас предложения по совершенствованию учебных программ?",
        "question_text_en": "Do you have any suggestions for improving the educational programs?",
        "options_json": [],
        "options_ru_json": [],
        "options_en_json": [],
        "has_detail_input": False,
        "detail_trigger": "",
        "detail_label": "Taklif va fikringizni qisqacha bayon eting",
        "detail_label_ru": "Кратко изложите Ваши предложения и мнения",
        "detail_label_en": "Briefly state your suggestions and feedback",
    },
    {
        "order": 9,
        "question_type": "text",
        "is_required": False,
        "question_text": "Markaz malaka oshirish kursini tashkil etishda yana qanday tashkiliy masalalarni hal etishi kerak deb hisoblaysiz?",
        "question_text_ru": "Какие ещё организационные вопросы, по Вашему мнению, Центру следует решить при проведении курсов?",
        "question_text_en": "What other organizational issues do you think the Center should address when organizing courses?",
        "options_json": [],
        "options_ru_json": [],
        "options_en_json": [],
        "has_detail_input": False,
        "detail_trigger": "",
        "detail_label": "Taklif va fikringizni qisqacha bayon eting",
        "detail_label_ru": "Кратко изложите Ваши предложения и мнения",
        "detail_label_en": "Briefly state your suggestions and feedback",
    },
]


def seed_initial_survey(apps, schema_editor):
    Survey = apps.get_model('core', 'Survey')
    SurveyQuestion = apps.get_model('core', 'SurveyQuestion')

    if Survey.objects.exists():
        return

    survey = Survey.objects.create(
        title="Tinglovchilar uchun anonim so‘rovnoma",
        title_ru="Анонимный опрос для слушателей",
        title_en="Anonymous Survey for Listeners",
        description=(
            "Hurmatli tinglovchi!\n\n"
            "O‘zbekiston Badiiy akademiyasi huzuridagi Badiiy ta’lim yo‘nalishlarida pedagog va mutaxassis "
            "kadrlarni qayta tayyorlash hamda ularning malakasini oshirish markazida ta’lim jarayonini "
            "takomillashtirish, har tomonlama qulay shart-sharoitlar yaratish uchun Sizning fikringiz juda "
            "ham muhimdir. Shu bois so‘rovnoma anketasi savollariga javob berishingizni so‘raymiz!"
        ),
        description_ru=(
            "Уважаемый слушатель!\n\n"
            "Ваше мнение очень важно для совершенствования образовательного процесса и создания всесторонне "
            "комфортных условий в Центре переподготовки и повышения квалификации педагогических и специальных "
            "кадров по направлениям художественного образования при Академии художеств Узбекистана. Просим Вас "
            "ответить на вопросы анкеты!"
        ),
        description_en=(
            "Dear Listener!\n\n"
            "Your feedback is vital for improving the educational process and creating comfortable learning "
            "conditions at the Center for Retraining and Advanced Training of Pedagogical and Specialist "
            "Personnel in Art Education under the Academy of Arts of Uzbekistan. We kindly ask you to answer "
            "the questions in this anonymous questionnaire!"
        ),
        thanks_message=(
            "Fikr va mulohazalaringiz uchun tashakkur!\n"
            "Sizning takliflaringiz soha rivojiga hissa qo‘shishiga ishonamiz!"
        ),
        thanks_message_ru=(
            "Благодарим Вас за мнения и предложения!\n"
            "Уверены, что Ваши рекомендации внесут вклад в развитие сферы художественного образования!"
        ),
        thanks_message_en=(
            "Thank you for your valuable feedback and suggestions!\n"
            "We believe your recommendations will contribute to advancing art education!"
        ),
        is_anonymous=True,
        allow_multiple=False,
        status='active',
        is_active=True,
        order=1,
    )

    for q_data in INITIAL_QUESTIONS:
        SurveyQuestion.objects.create(survey=survey, **q_data)


class Migration(migrations.Migration):
    dependencies = [
        ('core', '0037_survey_surveyquestion_surveyresponse_surveyanswer_and_more'),
    ]

    operations = [
        migrations.RunPython(seed_initial_survey, migrations.RunPython.noop),
    ]
