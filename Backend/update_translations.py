import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE','markaz_backend.settings')
django.setup()
from core.models import Personnel

updates = [
  {
    'name': 'Ismatov',
    'pos_en': 'Chief Accountant',
    'pos_ru': 'Главный бухгалтер',
    'duties_en': '<ul><li>Organizing and maintaining the accounting of the Center.</li><li>Monitoring financial resources, expenses, and settlements.</li><li>Timely preparation of salaries, payments, and financial reports.</li><li>Ensuring the correct execution of accounting documents and compliance with financial discipline.</li></ul>',
    'duties_ru': '<ul><li>Организация и ведение бухгалтерского учета Центра.</li><li>Контроль за финансовыми ресурсами, расходами и расчетами.</li><li>Своевременная подготовка заработной платы, выплат и финансовых отчетов.</li><li>Обеспечение правильного оформления бухгалтерских документов и соблюдения финансовой дисциплины.</li></ul>'
  },
  {
    'name': 'Xamidov',
    'pos_en': 'Chief Specialist of the Press and Information Technologies Department',
    'pos_ru': 'Главный специалист отдела прессы и информационных технологий',
    'duties_en': '<ul><li>Covering the Center\'s activities in mass media and on the Internet.</li><li>Preparing and publishing information on the official website and social networks.</li><li>Effective use of information technologies and development of digital information resources.</li><li>Preparing information materials about the Center\'s events, educational processes, and news.</li></ul>',
    'duties_ru': '<ul><li>Освещение деятельности Центра в средствах массовой информации и в сети Интернет.</li><li>Подготовка и размещение информации на официальном сайте и в социальных сетях.</li><li>Эффективное использование информационных технологий и развитие цифровых информационных ресурсов.</li><li>Подготовка информационных материалов о мероприятиях, учебных процессах и новостях Центра.</li></ul>'
  },
  {
    'name': 'Xasanova',
    'pos_en': 'Inspector',
    'pos_ru': 'Инспектор',
    'duties_en': '',
    'duties_ru': ''
  },
  {
    'name': 'Shuhratov',
    'pos_en': 'Head of the Economic Affairs Department',
    'pos_ru': 'Начальник хозяйственного отдела',
    'duties_en': '<ul><li>Managing the Center\'s economic and material-technical supply activities.</li><li>Ensuring the preservation and proper use of buildings, rooms, equipment, and inventory.</li><li>Organizing the provision of necessary resources for economic needs.</li><li>Monitoring compliance with labor protection, fire safety, and sanitary requirements.</li></ul>',
    'duties_ru': '<ul><li>Руководство хозяйственной и материально-технической деятельностью Центра.</li><li>Обеспечение сохранности и надлежащего использования зданий, помещений, оборудования и инвентаря.</li><li>Организация обеспечения необходимыми средствами для хозяйственных нужд.</li><li>Контроль за соблюдением требований охраны труда, пожарной безопасности и санитарии.</li></ul>'
  },
  {
    'name': 'Xushboqova',
    'pos_en': 'Chief Specialist of the International Relations Development Department',
    'pos_ru': 'Главный специалист отдела развития международных связей',
    'duties_en': '<ul><li>Developing and coordinating the Center\'s international cooperative relations.</li><li>Organizing cooperative projects with foreign educational institutions and organizations.</li><li>Participating in international experience exchange, meetings, and the implementation of educational projects.</li><li>Preparing documents, proposals, and information materials related to international cooperation.</li></ul>',
    'duties_ru': '<ul><li>Развитие и координация международных связей Центра.</li><li>Организация совместных проектов с зарубежными образовательными учреждениями и организациями.</li><li>Участие в международном обмене опытом, встречах и реализации образовательных проектов.</li><li>Подготовка документов, предложений и информационных материалов, связанных с международным сотрудничеством.</li></ul>'
  },
  {
    'name': 'To',
    'pos_en': 'Legal Counsel',
    'pos_ru': 'Юрисконсульт',
    'duties_en': '<ul><li>Providing legal advice on issues related to the Center\'s activities.</li><li>Reviewing contracts, orders, and other documents for compliance with legislation.</li><li>Legally protecting the Center\'s interests and participating in the preparation of legal documents.</li><li>Studying changes in current legislation and explaining them to employees.</li></ul>',
    'duties_ru': '<ul><li>Предоставление юридических консультаций по вопросам, связанным с деятельностью Центра.</li><li>Проверка договоров, приказов и других документов на соответствие законодательству.</li><li>Юридическая защита интересов Центра и участие в подготовке юридических документов.</li><li>Изучение изменений в действующем законодательстве и их разъяснение сотрудникам.</li></ul>'
  },
  {
    'name': 'Husanboyev',
    'pos_en': 'Chief Specialist of the General Department',
    'pos_ru': 'Главный специалист общего отдела',
    'duties_en': '<ul><li>Coordinating the general organizational and clerical activities of the Center.</li><li>Receiving, registering, and ensuring the delivery of documents to the relevant departments.</li><li>Monitoring the execution of management instructions and preparing reports.</li><li>Participating in organizational meetings, official correspondence, and other clerical processes.</li></ul>',
    'duties_ru': '<ul><li>Координация общей организационной и делопроизводственной деятельности Центра.</li><li>Прием, регистрация и обеспечение доставки документов в соответствующие отделы.</li><li>Контроль за выполнением поручений руководства и подготовка отчетов.</li><li>Участие в организационных собраниях, официальной переписке и других делопроизводственных процессах.</li></ul>'
  },
  {
    'name': 'Jonimboyeva',
    'pos_en': 'Secretary-Clerk',
    'pos_ru': 'Секретарь-делопроизводитель',
    'duties_en': '<ul><li>Receiving, registering, and processing incoming and outgoing documents.</li><li>Managing management instructions and official correspondence.</li><li>Delivering documents to relevant employees and monitoring their execution.</li><li>Organizing, storing, and transferring clerical documents to the archive.</li></ul>',
    'duties_ru': '<ul><li>Прием, регистрация и оформление входящих и исходящих документов.</li><li>Ведение поручений руководства и официальной переписки.</li><li>Доставка документов соответствующим сотрудникам и контроль их исполнения.</li><li>Упорядочение, хранение и сдача делопроизводственных документов в архив.</li></ul>'
  },
  {
    'name': 'Mamarasulova',
    'pos_en': 'Methodologist of the Educational Process Organization Department',
    'pos_ru': 'Методист отдела организации учебного процесса',
    'duties_en': '<ul><li>Participating in the organization of retraining and professional development educational processes.</li><li>Preparing the schedule of training sessions, educational documents, and methodological materials.</li><li>Coordinating organizational work related to trainees and professors.</li><li>Participating in ensuring that the educational process is conducted based on established requirements.</li></ul>',
    'duties_ru': '<ul><li>Участие в организации учебных процессов переподготовки и повышения квалификации.</li><li>Подготовка расписания учебных занятий, учебной документации и методических материалов.</li><li>Координация организационной работы, связанной со слушателями и преподавателями.</li><li>Участие в обеспечении проведения учебного процесса на основе установленных требований.</li></ul>'
  },
  {
    'name': 'Sattorov',
    'pos_en': 'Methodologist of the Retraining and Professional Development Process Monitoring and Quality Assessment Department',
    'pos_ru': 'Методист отдела мониторинга и оценки качества процесса переподготовки и повышения квалификации',
    'duties_en': '<ul><li>Participating in monitoring retraining and professional development processes.</li><li>Studying the quality of training sessions, the organization of classes, and the fulfillment of teaching loads.</li><li>Analyzing the processes of assessing the knowledge, skills, and competencies of trainees.</li><li>Preparing data, analytical materials, and proposals based on monitoring results.</li></ul>',
    'duties_ru': '<ul><li>Участие в мониторинге процессов переподготовки и повышения квалификации.</li><li>Изучение качества учебных занятий, организации уроков и выполнения учебной нагрузки.</li><li>Анализ процессов оценки знаний, навыков и компетенций слушателей.</li><li>Подготовка данных, аналитических материалов и предложений по результатам мониторинга.</li></ul>'
  },
  {
    'name': 'Sulaymonov',
    'pos_en': 'Methodologist of the Educational Process Organization Department',
    'pos_ru': 'Методист отдела организации учебного процесса',
    'duties_en': '<ul><li>Organizing and coordinating retraining and professional development educational processes.</li><li>Preparing the schedule of training sessions, educational-methodological documents, and reports.</li><li>Providing organizational support for trainee attendance, training sessions, and final attestation processes.</li><li>Carrying out methodological work aimed at improving the educational process.</li></ul>',
    'duties_ru': '<ul><li>Организация и координация учебных процессов переподготовки и повышения квалификации.</li><li>Подготовка расписания учебных занятий, учебно-методической документации и отчетов.</li><li>Организационная поддержка посещаемости слушателей, учебных занятий и процессов итоговой аттестации.</li><li>Проведение методической работы, направленной на совершенствование учебного процесса.</li></ul>'
  },
  {
    'name': 'Nurmaxammatov',
    'pos_en': 'Accountant',
    'pos_ru': 'Бухгалтер',
    'duties_en': '<ul><li>Maintaining accounting records and processing financial documents.</li><li>Accounting for income-expense documents, settlements, and payments.</li><li>Preparing accounting data and submitting it to the chief accountant.</li><li>Ensuring the correct and timely maintenance of financial documents.</li></ul>',
    'duties_ru': '<ul><li>Ведение бухгалтерского учета и оформление финансовых документов.</li><li>Учет приходно-расходных документов, расчетов и платежей.</li><li>Подготовка бухгалтерских данных и предоставление их главному бухгалтеру.</li><li>Обеспечение правильного и своевременного ведения финансовых документов.</li></ul>'
  }
]

for item in updates:
    # Match by partial name to avoid encoding issues with apostrophes
    p = Personnel.objects.filter(full_name__icontains=item['name']).first()
    if p:
        p.position_en = item['pos_en']
        p.position_ru = item['pos_ru']
        if item['duties_en']:
            p.duties_en = item['duties_en']
            p.duties_ru = item['duties_ru']
        p.save()
        print('Updated:', p.full_name)
    else:
        print('Not found:', item['name'])
