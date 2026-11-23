# Generated data migration for updating International Relations posts and gallery images from XORIJIY HAMKORLIK UCHUN.docx

from django.db import migrations


def update_international_posts(apps, schema_editor):
    Department = apps.get_model('core', 'Department')
    DepartmentPost = apps.get_model('core', 'DepartmentPost')
    DepartmentPostImage = apps.get_model('core', 'DepartmentPostImage')

    dept = Department.objects.filter(id=4).first()
    if not dept:
        dept = Department.objects.filter(name__icontains='Xalqaro').first()
    if not dept:
        return

    posts_data = [
        {
            'id': 4,
            'title': 'San’at va restavratsiya instituti – Palazzo Spinelli (Italiya)',
            'title_ru': 'Институт искусства и реставрации – Palazzo Spinelli (Италия)',
            'title_en': 'Institute for Art and Restoration – Palazzo Spinelli (Italy)',
            'date': '2023-10-25',
            'main_image': 'uploads/departmentpost/xh_image35.png',
            'gallery': [
                'uploads/departmentpost/xh_image37.png',
                'uploads/departmentpost/xh_image36.png',
                'uploads/departmentpost/xh_image30.png',
            ],
            'content': (
                "Oʼzbekiston Badiiy akademiyasi huzuridagi Badiiy ta’lim yo‘nalishlarida pedagog va mutaxassis kadrlarni qayta tayyorlash hamda ularning malakasini oshirish markazi direktori Davronbek Shukurov Italiyaning San’at va restavratsiya instituti – Palazzo Spinelli (Institute for Art and Restoration – Palazzo Spinelli)ga xalqaro aloqalarni rivojlantirish maqsadida tashrif buyurdi va Xalqaro loyihalar va hamkorlik bo‘limi boshlig‘i Ketrin Burnett bilan uchrashdi.\n\n"
                "Memorandum Markaz direktori Davronbek Shukurov va Italiyaning San’at va restavratsiya instituti – Palazzo Spinelli direktori Emanuele Amodei tomonidan imzolandi. Memorandumdan ko‘zlangan maqsad madaniyat va san’at ta’limi sohalarini rivojlantirish, xususan:\n"
                "– tomonlarning pedagog va xodimlarining xalqaro akademik almashinuvini tashkil etish;\n"
                "– qo‘shma ta’lim dasturlarini ishlab chiqish va amalga oshirish;\n"
                "– xalqaro konferensiyalar, seminarlar, ko‘rgazmalar va loyihalarni amalga oshirishdir."
            ),
            'content_ru': (
                "Директор Центра переподготовки и повышения квалификации педагогических и специализированных кадров в области художественного образования при Академии художеств Узбекистана Давронбек Шукуров посетил Институт искусства и реставрации – Palazzo Spinelli (Флоренция, Италия) и провёл встречу с руководителем отдела международных проектов и сотрудничества Кэтрин Бёрнетт.\n\n"
                "Меморандум о сотрудничестве был подписан директором Центра Давронбеком Шукуровым и директором Palazzo Spinelli Эмануэле Амодеи. Основные направления сотрудничества:\n"
                "– организация международного академического обмена преподавателями и специалистами;\n"
                "– разработка и реализация совместных образовательных программ;\n"
                "– проведение международных конференций, семинаров, выставок и проектов в сфере реставрации и искусства."
            ),
            'content_en': (
                "Director of the Center for Retraining and Professional Development of Pedagogical and Specialist Personnel in Art Education under the Academy of Arts of Uzbekistan, Davronbek Shukurov, visited the Institute for Art and Restoration – Palazzo Spinelli (Florence, Italy) and met with Head of International Projects and Cooperation Catherine Burnett.\n\n"
                "The Memorandum of Cooperation was signed by Center Director Davronbek Shukurov and Palazzo Spinelli Director Emanuele Amodei, focusing on:\n"
                "– organizing international academic exchange for faculty and staff;\n"
                "– developing and implementing joint educational programs;\n"
                "– holding international conferences, seminars, exhibitions, and restoration projects."
            ),
        },
        {
            'id': 19,
            'title': 'Santa Reparata xalqaro san’at maktabi – SRISA (Italiya)',
            'title_ru': 'Международная школа искусств Санта-Репарата – SRISA (Италия)',
            'title_en': 'Santa Reparata International School of Art – SRISA (Italy)',
            'date': '2023-10-27',
            'main_image': 'uploads/departmentpost/xh_image31.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image32.jpeg',
                'uploads/departmentpost/xh_image33.jpeg',
                'uploads/departmentpost/xh_image34.jpeg',
            ],
            'content': (
                "Oʼzbekiston Badiiy akademiyasi huzuridagi Badiiy ta’lim yo‘nalishlarida pedagog va mutaxassis kadrlarni qayta tayyorlash hamda ularning malakasini oshirish markazi direktori Davronbek Shukurov Italiyaning Florensiya shahrida joylashgan Santa Reparata xalqaro san’at maktabiga (Santa Reparata International School of Art – SRISA) xalqaro aloqalarni rivojlantirish maqsadida tashrif buyurdi va maktab direktori Aleksandra Roxas Fuentes bilan uchrashdi.\n\n"
                "Tashrif davomida zamonaviy tasviriy san’at, dizayn va bosma grafika ustaxonalari faoliyati bilan yaqindan tanishildi hamda pedagog kadrlar malakasini oshirish va tajriba almashish masalalari muhokama qilindi."
            ),
            'content_ru': (
                "Директор Центра при Академии художеств Узбекистана Давронбек Шукуров с целью развития международных связей посетил Международную школу искусств Санта-Репарата (Santa Reparata International School of Art – SRISA, Флоренция, Италия) и провёл встречу с директором школы Александрой Рохас Фуэнтес.\n\n"
                "В ходе визита состоялось ознакомление с творческими мастерскими современного искусства, дизайна и печатной графики, а также обсуждены перспективы обмена опытом и повышения квалификации педагогов."
            ),
            'content_en': (
                "Director of the Center under the Academy of Arts of Uzbekistan, Davronbek Shukurov, visited the Santa Reparata International School of Art (SRISA) in Florence, Italy, and met with School Director Alexandra Rojas Fuentes to expand international academic cooperation.\n\n"
                "During the visit, the delegation explored contemporary art, design, and printmaking studios and discussed joint initiatives for educator training and academic exchange."
            ),
        },
        {
            'id': 5,
            'title': 'Javoharlal Neru arxitektura va tasviriy san’at universiteti – JNAFAU (Hindiston)',
            'title_ru': 'Университет архитектуры и изящных искусств имени Джавахарлала Неру – JNAFAU (Индия)',
            'title_en': 'Jawaharlal Nehru Architecture and Fine Arts University – JNAFAU (India)',
            'date': '2024-02-25',
            'main_image': 'uploads/departmentpost/xh_image7.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image8.jpeg',
                'uploads/departmentpost/xh_image9.jpeg',
                'uploads/departmentpost/xh_image10.jpeg',
                'uploads/departmentpost/xh_image18.jpeg',
                'uploads/departmentpost/xh_image19.jpeg',
                'uploads/departmentpost/xh_image20.jpeg',
                'uploads/departmentpost/xh_image21.jpeg',
                'uploads/departmentpost/xh_image22.jpeg',
            ],
            'content': (
                "O‘zbekiston Badiiy akademiyasi huzuridagi Badiiy ta’lim yo‘nalishlarida pedagog va mutaxassis kadrlarni qayta tayyorlash hamda ularning malakasini oshirish markazi va Hindistonning Javoharlal Neru nomidagi Arxitektura va tasviriy san’at universiteti (JNAFAU) o‘rtasida madaniyat va san’at ta’limi sohalarini rivojlantirish, xalqaro konferensiyalar, seminarlar, ko‘rgazmalar va loyihalarni amalga oshirish, pedagog va xodimlarning xalqaro akademik almashinuvini tashkil etish hamda qo‘shma ta’lim dasturlarini ishlab chiqish maqsadida ikki tomonlama Memorandum imzolandi.\n\n"
                "Shuningdek, mazkur Memorandum doirasida Javoharlal Neru nomidagi Arxitektura va tasviriy sanʼat universiteti huzuridagi Tasviriy sanʼat kolleji dotsenti Anand Rao va doktor Priti Samukta Markazga tashrif buyurdi. Tashrif davomida o‘zaro aloqalarni yanada rivojlantirish, ko‘rgazmalar va loyihalarni amalga oshirish hamda tajriba almashish to‘g‘risida Markaz xodimlari bilan uchrashuv bo‘lib o‘tdi, esdalik sovg‘alari topshirildi va doktor Priti Samukta tomonidan “Hindiston sanʼati tarixi” mavzusida ilmiy seminar o‘tkazildi."
            ),
            'content_ru': (
                "Между Центром при Академии художеств Узбекистана и Университетом архитектуры и изящных искусств имени Джавахарлала Неру (JNAFAU, Индия) подписан двусторонний Меморандум о развитии художественного образования, проведении международных конференций, семинаров, выставок, организации академического обмена и совместных образовательных программ.\n\n"
                "В рамках подписанного Меморандума Центр посетили доцент Колледжа изящных искусств JNAFAU Ананд Рао и доктор Прити Самукта. В ходе визита состоялась встреча с коллективом Центра по вопросам дальнейшего развития совместных выставок и научных проектов, обмен памятными подарками, а также научный семинар доктора Прити Самукты на тему «История искусства Индии»."
            ),
            'content_en': (
                "A bilateral Memorandum of Understanding was signed between the Center under the Academy of Arts of Uzbekistan and Jawaharlal Nehru Architecture and Fine Arts University (JNAFAU, India) to advance art and cultural education, conduct international conferences, seminars, and exhibitions, organize faculty exchange, and develop joint educational programs.\n\n"
                "Within the framework of this Memorandum, Associate Professor Anand Rao and Dr. Priti Samyukta from JNAFAU's College of Fine Arts visited Uzbekistan. They held productive discussions with Center staff on joint exhibitions and projects, exchanged commemorative gifts, and conducted an academic seminar titled 'History of Indian Art'."
            ),
        },
        {
            'id': 6,
            'title': 'Keimyung universiteti Tasviriy san’at kolleji (Janubiy Koreya)',
            'title_ru': 'Колледж изящных искусств Университета Кемён (Южная Корея)',
            'title_en': 'College of Fine Arts, Keimyung University (South Korea)',
            'date': '2025-04-22',
            'main_image': 'uploads/departmentpost/xh_image12.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image13.jpeg',
                'uploads/departmentpost/xh_image14.jpeg',
                'uploads/departmentpost/xh_image15.jpeg',
                'uploads/departmentpost/xh_image16.jpeg',
                'uploads/departmentpost/xh_image17.jpeg',
                'uploads/departmentpost/xh_image62.jpeg',
                'uploads/departmentpost/xh_image63.jpeg',
                'uploads/departmentpost/xh_image64.jpeg',
                'uploads/departmentpost/xh_image65.jpeg',
                'uploads/departmentpost/xh_image66.jpeg',
                'uploads/departmentpost/xh_image67.jpeg',
                'uploads/departmentpost/xh_image68.jpeg',
                'uploads/departmentpost/xh_image69.jpeg',
                'uploads/departmentpost/xh_image70.jpeg',
                'uploads/departmentpost/xh_image71.jpeg',
                'uploads/departmentpost/xh_image72.jpeg',
                'uploads/departmentpost/xh_image73.jpeg',
                'uploads/departmentpost/xh_image74.jpeg',
            ],
            'content': (
                "O‘zbekiston Badiiy akademiyasi huzuridagi Badiiy ta’lim yo‘nalishlarida pedagog va mutaxassis kadrlarni qayta tayyorlash hamda ularning malakasini oshirish markazi va Koreya Respublikasining Keimyung universiteti huzuridagi Tasviriy san’at kolleji o‘rtasida badiiy ta’limni xalqaro miqyosda kengaytirish hamda akademik harakatchanlikni rivojlantirish maqsadida Memorandum imzolandi.\n\n"
                "Ushbu memorandumda tomonlar madaniyat va san’at ta’limi sohalarini rivojlantirish, xususan:\n"
                "– tomonlarning pedagog va xodimlarining xalqaro akademik almashinuvini tashkil etish;\n"
                "– qo‘shma ta’lim dasturlarini ishlab chiqish va amalga oshirish;\n"
                "– xalqaro konferensiyalar, seminarlar, ko‘rgazmalar va loyihalarni amalga oshirish ko‘zda tutilgan.\n\n"
                "2025-yil 22-aprel kuni Markazda Keimyung universitetining Tasviriy san’at kolleji dekani Kim Yun Hee hamda Tasviriy san’at kafedrasi mudiri, professor Jang Tae Mook tomonidan qayta tayyorlash va malaka oshirish kurslari tinglovchilari uchun maxsus seminar va mahorat darsi o‘tkazildi. Shuningdek, Markaz Ilmiy-metodik kengashining qarori bilan O‘zbekiston va Janubiy Koreya o‘rtasida madaniyat-san’at va ta’lim sohasida xalqaro hamkorlikni rivojlantirishga qo‘shgan hissasi uchun Kim Yun Hee hamda professor Jang Tae Mookga Markazning “Faxriy professori” unvoni topshirildi."
            ),
            'content_ru': (
                "Между Центром при Академии художеств Узбекистана и Колледжем изящных искусств Университета Кемён (Республика Корея) подписан Меморандум о расширении международного сотрудничества в области художественного образования и развитии академической мобильности.\n\n"
                "22 апреля 2025 года декан Колледжа изящных искусств Университета Кемён Ким Юн Хи и заведующий кафедрой изобразительного искусства профессор Чан Тхэ Мук провели семинар и мастер-класс для слушателей курсов переподготовки и повышения квалификации Центра. Решением Научно-методического совета Центра за вклад в укрепление узбекско-корейского сотрудничества в сфере искусства и образования Ким Юн Хи и профессору Чан Тхэ Муку было присвоено звание «Почётный профессор» Центра."
            ),
            'content_en': (
                "A Memorandum of Understanding was signed between the Center under the Academy of Arts of Uzbekistan and the College of Fine Arts of Keimyung University (Republic of Korea) to expand fine arts education internationally and foster academic mobility.\n\n"
                "On April 22, 2025, Dean of the College of Fine Arts of Keimyung University Kim Yun Hee and Head of the Fine Arts Department Prof. Jang Tae Mook conducted a seminar and masterclass for the Center's trainees. By decision of the Scientific and Methodological Council of the Center, Dean Kim Yun Hee and Prof. Jang Tae Mook were awarded the title of 'Honorary Professor' of the Center for their contribution to strengthening cultural and educational ties between Uzbekistan and South Korea."
            ),
        },
        {
            'id': 7,
            'title': 'Ozarbayjon davlat tasviriy san’at akademiyasi (Ozarbayjon)',
            'title_ru': 'Азербайджанская государственная академия художеств (Азербайджан)',
            'title_en': 'Azerbaijan State Academy of Fine Arts (Azerbaijan)',
            'date': '2023-10-15',
            'main_image': 'uploads/departmentpost/xh_image23.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image24.jpeg',
                'uploads/departmentpost/xh_image25.jpeg',
                'uploads/departmentpost/xh_image26.jpeg',
                'uploads/departmentpost/xh_image27.jpeg',
                'uploads/departmentpost/xh_image28.jpeg',
                'uploads/departmentpost/xh_image29.jpeg',
            ],
            'content': (
                "O‘zbekiston Badiiy akademiyasi huzuridagi Badiiy ta’lim yo‘nalishlarida pedagog va mutaxassis kadrlarni qayta tayyorlash hamda ularning malakasini oshirish markazi va Ozarbayjon Davlat rassomlik akademiyasi o‘rtasida badiiy ta’limni xalqaro miqyosda kengaytirish hamda akademik harakatchanlikni rivojlantirish maqsadida Memorandum imzolandi.\n\n"
                "Ushbu memorandumda tomonlar madaniyat va san’at ta’limi sohalarini rivojlantirish, xususan:\n"
                "– tomonlarning pedagog va xodimlarining xalqaro akademik almashinuvini tashkil etish;\n"
                "– qo‘shma ta’lim dasturlarini ishlab chiqish va amalga oshirish;\n"
                "– xalqaro konferensiyalar, seminarlar, ko‘rgazmalar va loyihalarni amalga oshirish ko‘zda tutilgan.\n\n"
                "Uchrashuv yakunida Markaz direktori D.Shukurov va Ozarbayjon Davlat rassomlik akademiyasi rektori, akademik Natiq Aliyev (Natiq Kamal oğlu Əliyev) o‘zaro hurmat va hamkorlik ramzi sifatida esdalik sovg‘alarini topshirdilar."
            ),
            'content_ru': (
                "Между Центром при Академии художеств Узбекистана и Азербайджанской государственной академией художеств подписан Меморандум о расширении международного сотрудничества в сфере художественного образования и развитии академической мобильности.\n\n"
                "Меморандум предусматривает организацию международного академического обмена преподавателями и специалистами, разработку совместных образовательных программ, а также проведение международных конференций, семинаров и художественных выставок. В завершение встречи директор Центра Д. Шукуров и ректор Азербайджанской государственной академии художеств Натик Алиев обменялись памятными подарками."
            ),
            'content_en': (
                "A Memorandum of Understanding was signed between the Center under the Academy of Arts of Uzbekistan and the Azerbaijan State Academy of Fine Arts to expand fine arts education internationally and foster academic mobility.\n\n"
                "The Memorandum covers international faculty and staff exchange, joint educational programs, and international conferences, seminars, and exhibitions. During the ceremony, Center Director D. Shukurov and Rector of the Azerbaijan State Academy of Fine Arts Natiq Aliyev exchanged commemorative gifts."
            ),
        },
        {
            'id': 8,
            'title': 'Temirbek Jurgenov nomidagi Qozog‘iston Milliy san’at akademiyasi',
            'title_ru': 'Казахская национальная академия искусств имени Темирбека Жургенова',
            'title_en': 'Kazakh National Academy of Arts named after T. Zhurgenov',
            'date': '2023-12-02',
            'main_image': 'uploads/departmentpost/xh_image39.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image40.jpeg',
                'uploads/departmentpost/xh_image41.jpeg',
                'uploads/departmentpost/xh_image42.jpeg',
                'uploads/departmentpost/xh_image43.jpeg',
                'uploads/departmentpost/xh_image44.jpeg',
                'uploads/departmentpost/xh_image45.jpeg',
                'uploads/departmentpost/xh_image46.jpeg',
                'uploads/departmentpost/xh_image47.jpeg',
                'uploads/departmentpost/xh_image48.jpeg',
                'uploads/departmentpost/xh_image49.jpeg',
                'uploads/departmentpost/xh_image38.png',
            ],
            'content': (
                "Jahondagi yetakchi badiiy ta’lim yo‘nalishidagi ta’lim muassasalari bilan ilg‘or tajribalar almashish maqsadida Temirbek Jurgenov nomidagi Qozoq Milliy Badiiy akademiyasi bilan hamkorlik Memorandumi imzolandi. 29-noyabrdan 2-dekabrgacha Qozog‘iston Respublikasiga Markaz direktori D.Shukurov hamda Markaz xodimi M.Sadikova tashrif buyurib, Akademiyaning 35 yilligi munosabati bilan tashkil etilgan ko‘rgazma va tadbirlarda ishtirok etishdi.\n\n"
                "Shuningdek, imzolangan hamkorlik Memorandumi asosida Markazda “Rangtasvir” yo‘nalishi bo‘yicha xalqaro malaka oshirish kursi tashkil etilib, kursni muvaffaqiyatli tamomlagan tinglovchilarga xalqaro sertifikatlar topshirildi."
            ),
            'content_ru': (
                "В целях обмена передовым опытом с ведущими художественными вузами подписан Меморандум о сотрудничестве с Казахской национальной академией искусств имени Темирбека Жургенова. Делегация Центра во главе с директором Д. Шукуровым посетила Республику Казахстан и приняла участие в юбилейных мероприятиях, посвящённых 35-летию Академии.\n\n"
                "На основе подписанного Меморандума в Центре был организован международный курс повышения квалификации по направлению «Живопись», выпускникам которого были торжественно вручены сертификаты."
            ),
            'content_en': (
                "A Memorandum of Cooperation was signed with the Kazakh National Academy of Arts named after Temirbek Zhurgenov. Center Director D. Shukurov and specialist M. Sadikova visited Kazakhstan from November 29 to December 2 and attended the exhibition marking the 35th anniversary of the Academy.\n\n"
                "Based on this Memorandum, an international professional development course in 'Painting' was organized at the Center, and certificates were awarded to the graduating trainees."
            ),
        },
        {
            'id': 11,
            'title': 'A.L.Shtiglits nomidagi Sankt-Peterburg davlat san’at va sanoat akademiyasi (Rossiya)',
            'title_ru': 'Санкт-Петербургская государственная художественно-промышленная академия им. А.Л. Штиглица (Россия)',
            'title_en': 'Saint Petersburg Stieglitz State Academy of Art and Design (Russia)',
            'date': '2024-07-18',
            'main_image': 'uploads/departmentpost/xh_image50.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image51.jpeg',
                'uploads/departmentpost/xh_image52.jpeg',
                'uploads/departmentpost/xh_image53.jpeg',
            ],
            'content': (
                "Oʼzbekiston Badiiy akademiyasi huzuridagi Badiiy ta’lim yo‘nalishlarida pedagog va mutaxassis kadrlarni qayta tayyorlash hamda ularning malakasini oshirish markazi hamda Rossiyaning A.L. Shtiglits nomidagi Sankt-Peterburg davlat san’at va sanoat akademiyasi o‘rtasida 2024-yil 18-iyul kuni o‘zaro hamkorlik memorandumi imzolandi.\n\n"
                "Memorandum doirasida qo‘shma ta’lim dasturlari ishlab chiqish, ko‘rgazmalar tashkil etish hamda professor-o‘qituvchilar uchun stajirovka va malaka oshirish kurslarini yo‘lga qo‘yish kabi istiqbolli rejalar belgilab olindi."
            ),
            'content_ru': (
                "18 июля 2024 года между Центром при Академии художеств Узбекистана и Санкт-Петербургской государственной художественно-промышленной академией имени А.Л. Штиглица был подписан Меморандум о взаимном сотрудничестве.\n\n"
                "В рамках соглашения намечены перспективные планы по разработке совместных образовательных программ, организации художественных выставок, а также стажировок и курсов повышения квалификации."
            ),
            'content_en': (
                "On July 18, 2024, a Memorandum of Cooperation was signed between the Center under the Academy of Arts of Uzbekistan and the Saint Petersburg Stieglitz State Academy of Art and Design (Russia).\n\n"
                "Within the framework of the Memorandum, both parties agreed on developing joint educational programs, organizing exhibitions, and conducting faculty internships and professional development courses."
            ),
        },
        {
            'id': 13,
            'title': 'Erzinjan Binali Yildirim universiteti va Turkiyaga xizmat safari',
            'title_ru': 'Университет Эрзинджан Бинали Йылдырым и рабочий визит в Турцию',
            'title_en': 'Erzincan Binali Yıldırım University and Official Visit to Turkey',
            'date': '2024-07-25',
            'main_image': 'uploads/departmentpost/xh_image54.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image55.jpeg',
                'uploads/departmentpost/xh_image56.jpeg',
                'uploads/departmentpost/xh_image57.jpeg',
                'uploads/departmentpost/xh_image107.jpeg',
                'uploads/departmentpost/xh_image108.jpeg',
                'uploads/departmentpost/xh_image109.jpeg',
                'uploads/departmentpost/xh_image110.jpeg',
                'uploads/departmentpost/xh_image111.jpeg',
                'uploads/departmentpost/xh_image112.jpeg',
                'uploads/departmentpost/xh_image113.jpeg',
            ],
            'content': (
                "Oʼzbekiston Badiiy akademiyasi huzuridagi Badiiy ta’lim yo‘nalishlarida pedagog va mutaxassis kadrlarni qayta tayyorlash hamda ularning malakasini oshirish markazi hamda Turkiyaning Erzincan Binali Yıldırım universiteti o‘rtasida 2024-yil 25-iyul sanasida o‘zaro hamkorlik memorandumi imzolandi. Memorandum doirasida ikki tomonlama ilmiy-ijodiy loyihalar va akademik almashinuv rejalari tuzildi.\n\n"
                "Shuningdek, Markaz rahbari, xodimlari hamda bir guruh rassomlarning Turkiyaga tashrifi doirasida Zamonaviy san’at muzeyiga tashrif amalga oshirildi. Tashrif davomida ishtirokchilar zamonaviy rassomlar ijodi, san’atdagi yangi yo‘nalishlar va badiiy yechimlar bilan yaqindan tanishdilar."
            ),
            'content_ru': (
                "25 июля 2024 года между Центром при Академии художеств Узбекистана и Университетом Эрзинджан Бинали Йылдырым (Турция) был подписан Меморандум о взаимном сотрудничестве, в рамках которого согласованы совместные научно-творческие проекты и программы обмена.\n\n"
                "Кроме того, в рамках визита руководства, сотрудников Центра и группы художников в Турцию состоялось посещение Музея современного искусства, где участники ознакомились с новыми направлениями и художественными решениями современной живописи и дизайна."
            ),
            'content_en': (
                "On July 25, 2024, a Memorandum of Cooperation was signed between the Center under the Academy of Arts of Uzbekistan and Erzincan Binali Yıldırım University (Turkey), outlining joint academic and creative projects.\n\n"
                "Additionally, during the delegation's visit to Turkey, Center leadership, staff, and artists visited the Museum of Modern Art to explore contemporary artistic trends, innovative techniques, and international exhibition practices."
            ),
        },
        {
            'id': 10,
            'title': 'Batumi san’at ta’limi universiteti (Gruziya)',
            'title_ru': 'Батумский государственный университет искусств (Грузия)',
            'title_en': 'Batumi Art Teaching University (Georgia)',
            'date': '2024-09-18',
            'main_image': 'uploads/departmentpost/xh_image58.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image59.jpeg',
                'uploads/departmentpost/xh_image60.jpeg',
                'uploads/departmentpost/xh_image61.jpeg',
            ],
            'content': (
                "Xalqaro aloqalarni mustahkamlash hamda oʻzaro tajriba almashish maqsadida Markaz xodimlari, P.Benkov nomidagi Respublika ixtisoslashtirilgan rassomlik maktabi hamda Respublika ixtisoslashtirilgan dizayn maktabining bir guruh xodimlari Gruziyaning Batumi shahrida joylashgan “Batumi Art Teaching University” oliygohida xizmat safarida boʻlishdi.\n\n"
                "Tashrif davomida hamkorlik Memorandumi imzolandi hamda O‘zBA huzuridagi Markaz direktori D.Shukurov universitet professor-oʻqituvchilari va talabalari uchun “Zamonaviy Oʻzbekiston tasviriy san’ati” nomli ilmiy seminar oʻtkazdi."
            ),
            'content_ru': (
                "В целях укрепления международных связей и обмена опытом сотрудники Центра, Республиканской специализированной художественной школы им. П. Бенькова и Республиканской специализированной школы дизайна посетили Батумский государственный университет искусств (Batumi Art Teaching University, Грузия).\n\n"
                "В ходе визита был подписан Меморандум о сотрудничестве, а директор Центра Д. Шукуров провёл для преподавателей и студентов университета семинар на тему «Современное изобразительное искусство Узбекистана»."
            ),
            'content_en': (
                "To strengthen international ties and exchange experience, staff from the Center, the P. Benkov Republican Specialized Art School, and the Republican Specialized Design School visited Batumi Art Teaching University in Batumi, Georgia.\n\n"
                "During the visit, a Memorandum of Cooperation was signed and Center Director D. Shukurov delivered a seminar titled 'Contemporary Fine Arts of Uzbekistan' for the university's faculty and students."
            ),
        },
        {
            'id': 3,
            'title': 'Hebei tasviriy san’at akademiyasi (Xitoy)',
            'title_ru': 'Хэбэйская академия изящных искусств (Китай)',
            'title_en': 'Hebei Academy of Fine Arts (China)',
            'date': '2025-11-05',
            'main_image': 'uploads/departmentpost/xh_image75.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image76.jpeg',
                'uploads/departmentpost/xh_image77.jpeg',
                'uploads/departmentpost/xh_image78.jpeg',
            ],
            'content': (
                "Xitoyning nufuzli Hebei tasviriy san’at akademiyasi (Hebei Academy of Fine Arts) bilan samarali uchrashuv va muzokaralar bo‘lib o‘tdi.\n\n"
                "Uchrashuv davomida ikki tomonlama ijodiy va ilmiy hamkorlikni mustahkamlash, kelgusida amalga oshirilishi rejalashtirilgan istiqbolli loyihalar, qo‘shma dasturlar va akademik almashinuv yo‘nalishlari yuzasidan kelishuvga erishildi. Tomonlar san’at va ta’lim sohalarida tajriba almashinuvi, yangi pedagogik yondashuvlar, ijodiy ustaxonalar hamda qo‘shma ko‘rgazmalarni tashkil etish bo‘yicha Memorandum imzoladilar."
            ),
            'content_ru': (
                "Состоялась плодотворная встреча и подписание Меморандума о сотрудничестве с Хэбэйской академией изящных искусств (Hebei Academy of Fine Arts, Китай).\n\n"
                "В ходе переговоров стороны обсудили укрепление двустороннего творческого и научного сотрудничества, реализацию совместных образовательных программ, академический обмен, организацию творческих мастерских и совместных выставок."
            ),
            'content_en': (
                "A productive meeting and Memorandum signing took place with the prestigious Hebei Academy of Fine Arts (China).\n\n"
                "During the talks, both sides discussed strengthening bilateral creative and academic cooperation, launching joint educational programs, faculty and student exchange, creative workshops, and joint art exhibitions."
            ),
        },
        {
            'id': 1,
            'title': 'Xubey tasviriy san’at instituti – HIFA (Xitoy)',
            'title_ru': 'Хубэйский институт изящных искусств – HIFA (Китай)',
            'title_en': 'Hubei Institute of Fine Arts – HIFA (China)',
            'date': '2025-11-08',
            'main_image': 'uploads/departmentpost/xh_image79.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image80.jpeg',
                'uploads/departmentpost/xh_image81.jpeg',
                'uploads/departmentpost/xh_image82.jpeg',
                'uploads/departmentpost/xh_image83.jpeg',
                'uploads/departmentpost/xh_image84.jpeg',
                'uploads/departmentpost/xh_image85.jpeg',
                'uploads/departmentpost/xh_image86.jpeg',
                'uploads/departmentpost/xh_image87.jpeg',
                'uploads/departmentpost/xh_image88.jpeg',
                'uploads/departmentpost/xh_image89.jpeg',
                'uploads/departmentpost/xh_image90.jpeg',
                'uploads/departmentpost/xh_image91.jpeg',
                'uploads/departmentpost/xh_image92.jpeg',
                'uploads/departmentpost/xh_image93.jpeg',
                'uploads/departmentpost/xh_image94.jpeg',
                'uploads/departmentpost/xh_image95.jpeg',
                'uploads/departmentpost/xh_image114.jpeg',
                'uploads/departmentpost/xh_image115.jpeg',
                'uploads/departmentpost/xh_image116.jpeg',
                'uploads/departmentpost/xh_image117.jpeg',
            ],
            'content': (
                "Oʻzbekiston Badiiy akademiyasi huzuridagi Markaz va Xitoy Xalq Respublikasining Xubey tasviriy san’at instituti (Hubei Institute of Fine Arts – HIFA) o‘rtasida tuzilgan o‘zaro hamkorlik Memorandumi doirasida Markaz xodimlari hamda Respublika ixtisoslashtirilgan dizayn maktabi mutaxassislari Uxan shahrida ilmiy-ijodiy stajirovka o‘tadilar.\n\n"
                "Stajirovka davomida delegatsiya a’zolari Moda san’ati va Tasviriy san’at fakultetlari faoliyati bilan tanishdilar, “8+N” xalqaro oliy san’at maktablari asosiy ta’lim forumi, “2025 xalqaro talabalarning rasm ishlari ko‘rgazmasi” hamda “NEW SILK ROAD ART JOURNEY: International Conference on Integration and Innovation in Art Education and Cultural Tourism” nomli nufuzli xalqaro konferensiyada ma’ruzalar bilan faol ishtirok etdilar.\n\n"
                "Shuningdek, Toshkentda “Badiiy ta’limning zamonaviy tendensiyalari: O‘zbekiston va Xitoy tajribasi” mavzusidagi xalqaro ilmiy-amaliy seminar doirasida “Bir makon, bir yo‘l: Buyuk Ipak yo‘li chorrahasida kesishgan san’at” nomli qo‘shma ko‘rgazma dasturi o‘tkazildi."
            ),
            'content_ru': (
                "В рамках Меморандума о сотрудничестве между Центром при Академии художеств Узбекистана и Хубэйским институтом изящных искусств (Hubei Institute of Fine Arts – HIFA, г. Ухань, Китай) делегация сотрудников Центра и Республиканской специализированной школы дизайна прошла научно-творческую стажировку в Китае.\n\n"
                "Участники делегации ознакомились с работой факультетов моды и изобразительного искусства, выступили на международном образовательном форуме художественных вузов «8+N», посетили выставку работ иностранных студентов 2025 года и приняли активное участие в международной конференции «NEW SILK ROAD ART JOURNEY: International Conference on Integration and Innovation in Art Education and Cultural Tourism».\n\n"
                "Кроме того, в Ташкенте в рамках международного научно-практического семинара «Современные тенденции художественного образования: опыт Узбекистана и Китая» была организована совместная выставочная программа «Один пояс, один путь: искусство на перекрёстке Великого Шёлкового пути»."
            ),
            'content_en': (
                "Under the Memorandum of Cooperation between the Center under the Academy of Arts of Uzbekistan and Hubei Institute of Fine Arts (HIFA, Wuhan, China), a delegation of Center staff and specialists from the Republican Specialized Design School completed an academic and creative internship at HIFA.\n\n"
                "During the visit, the delegation explored the Fashion Art and Fine Arts faculties, participated in the '8+N' International Higher Art Education Forum and the '2025 International Student Art Exhibition', and delivered presentations at the 'NEW SILK ROAD ART JOURNEY: International Conference on Integration and Innovation in Art Education and Cultural Tourism'.\n\n"
                "In addition, the joint exhibition and international seminar 'One Belt, One Road: Art Intersecting at the Crossroads of the Great Silk Road' was held in Tashkent to showcase Chinese and Uzbek fine arts."
            ),
        },
        {
            'id': 17,
            'title': 'Lanzhou universiteti San’at maktabi (Xitoy)',
            'title_ru': 'Школа искусств Университета Ланьчжоу (Китай)',
            'title_en': 'Lanzhou University School of Art (China)',
            'date': '2025-11-15',
            'main_image': 'uploads/departmentpost/xh_image101.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image102.jpeg',
                'uploads/departmentpost/xh_image103.jpeg',
                'uploads/departmentpost/xh_image104.jpeg',
                'uploads/departmentpost/xh_image105.jpeg',
                'uploads/departmentpost/xh_image106.jpeg',
            ],
            'content': (
                "O‘zbekiston Badiiy akademiyasi huzuridagi Badiiy ta’lim yoʻnalishlarida pedagog va mutaxassis kadrlarni qayta tayyorlash hamda ularning malakasini oshirish markazi hamda Xitoyning Lanzhou universiteti San’at maktabi o‘rtasida xalqaro hamkorlik memorandumi imzolandi. Hujjatni Markaz direktori D.Shukurov va San’at maktabi vakili Li Xualong imzoladi.\n\n"
                "Hamkorlikning asosiy yo‘nalishlari:\n"
                "– O‘qituvchilar uchun qisqa muddatli amaliyotlar va qo‘shma malaka oshirish kurslarini tashkil etish;\n"
                "– Hamkorlikdagi ilmiy tadqiqotlar va xalqaro konferensiyalar o‘tkazish;\n"
                "– Qo‘shma ko‘rgazmalar va ochiq havoda ijod sessiyalari (plenerlar) tashkil etish."
            ),
            'content_ru': (
                "Между Центром при Академии художеств Узбекистана и Школой искусств Университета Ланьчжоу (Китай) подписан Меморандум о международном сотрудничестве. Документ подписали директор Центра Д. Шукуров и представитель Школы искусств Ли Хуалун.\n\n"
                "Основные направления сотрудничества:\n"
                "– организация краткосрочных стажировок и совместных курсов повышения квалификации для преподавателей;\n"
                "– проведение совместных научных исследований и международных конференций;\n"
                "– проведение совместных выставок и пленэров."
            ),
            'content_en': (
                "An international cooperation Memorandum was signed between the Center under the Academy of Arts of Uzbekistan and the School of Art of Lanzhou University (China). The document was signed by Center Director D. Shukurov and School of Art representative Li Hualong.\n\n"
                "Key areas of cooperation include:\n"
                "– organizing short-term internships and joint professional development courses for teachers;\n"
                "– conducting joint academic research and international conferences;\n"
                "– holding joint art exhibitions and open-air painting sessions (plein-airs)."
            ),
        },
        {
            'id': 20,
            'title': 'Pendidikan Sultan Idris Universiti – UPSI (Malayziya)',
            'title_ru': 'Педагогический университет Султана Идриса – UPSI (Малайзия)',
            'title_en': 'Sultan Idris Education University – UPSI (Malaysia)',
            'date': '2025-11-12',
            'main_image': 'uploads/departmentpost/xh_image96.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image97.jpeg',
                'uploads/departmentpost/xh_image98.jpeg',
                'uploads/departmentpost/xh_image99.jpeg',
                'uploads/departmentpost/xh_image100.jpeg',
            ],
            'content': (
                "Markazga Malayziyaning Pendidikan Sultan Idris Universiti (UPSI) San’at, barqarorlik va ijodiy industriya fakulteti (FSKIK) akademik va xalqaro ishlar bo‘yicha dekan o‘rinbosari Dr. Nursafinas Albakry hamda Multimedia ijodiy yo‘nalishi bo‘limi mudiri Mohd Ekram Alhafis bin Hashim tashrif buyurdi.\n\n"
                "Tashrif davomida tomonlar badiiy ta’lim sohasida ilmiy-ijodiy aloqalarni yo‘lga qo‘yish, professor-o‘qituvchilar malakasini oshirish va stajirovkalarini tashkil etish hamda kelgusida qo‘shma malaka oshirish kurslarini yo‘lga qo‘yish bo‘yicha o‘zaro kelishuvga erishdilar."
            ),
            'content_ru': (
                "Центр посетили заместитель декана по академическим и международным вопросам факультета искусств, устойчивого развития и креативных индустрий (FSKIK) Педагогического университета Султана Идриса (Pendidikan Sultan Idris Universiti – UPSI, Малайзия) д-р Нурсафинас Албакри и руководитель направления мультимедиа Мохд Экрам Алхафис бин Хашим.\n\n"
                "В ходе визита стороны обсудили установление научно-творческих связей в сфере художественного образования, организацию стажировок и совместных курсов повышения квалификации профессорско-преподавательского состава."
            ),
            'content_en': (
                "Dr. Nursafinas Albakry, Deputy Dean for Academic and International Affairs of the Faculty of Art, Sustainability and Creative Industry (FSKIK) at Sultan Idris Education University (Pendidikan Sultan Idris Universiti – UPSI, Malaysia), and Mohd Ekram Alhafis bin Hashim, Head of Creative Multimedia, visited the Center.\n\n"
                "During the visit, both parties discussed establishing academic and creative cooperation in art education, organizing faculty internships, and launching joint professional development courses."
            ),
        },
    ]

    for item in posts_data:
        post = DepartmentPost.objects.filter(id=item['id']).first()
        if post:
            post.department = dept
            post.title = item['title']
            post.title_ru = item['title_ru']
            post.title_en = item['title_en']
            post.content = item['content']
            post.content_ru = item['content_ru']
            post.content_en = item['content_en']
            post.image = item['main_image']
            post.date = item['date']
            post.is_active = True
            post.save()
        else:
            post = DepartmentPost.objects.create(
                id=item['id'],
                department=dept,
                title=item['title'],
                title_ru=item['title_ru'],
                title_en=item['title_en'],
                content=item['content'],
                content_ru=item['content_ru'],
                content_en=item['content_en'],
                image=item['main_image'],
                date=item['date'],
                is_active=True,
                views_count=25,
            )

        DepartmentPostImage.objects.filter(post=post).delete()
        for idx, img_path in enumerate(item['gallery'], start=1):
            DepartmentPostImage.objects.create(
                post=post,
                image=img_path,
                order=idx,
            )


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0031_anticorruptionpost_anticorruptionpostimage'),
    ]

    operations = [
        migrations.RunPython(update_international_posts, noop_reverse),
    ]
