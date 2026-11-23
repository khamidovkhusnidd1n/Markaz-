# Separate partner memorandum photos from international project photos in DepartmentPost

from django.db import migrations


def separate_partners_and_projects(apps, schema_editor):
    Department = apps.get_model('core', 'Department')
    DepartmentPost = apps.get_model('core', 'DepartmentPost')
    DepartmentPostImage = apps.get_model('core', 'DepartmentPostImage')

    dept = Department.objects.filter(id=4).first() or Department.objects.filter(name__icontains='Xalqaro').first()
    if not dept:
        return

    # 1. Clean up partner posts so they only contain their own partner/memorandum photos
    partner_updates = [
        {
            'id': 16,
            'main_image': 'uploads/departmentpost/China_CAETC_page1.jpg',
            'gallery': [],
        },
        {
            'id': 1,
            'main_image': 'uploads/departmentpost/xh_image79.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image80.jpeg',
                'uploads/departmentpost/xh_image81.jpeg',
                'uploads/departmentpost/xh_image82.jpeg',
                'uploads/departmentpost/xh_image83.jpeg',
            ],
        },
        {
            'id': 5,
            'main_image': 'uploads/departmentpost/xh_image7.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image8.jpeg',
                'uploads/departmentpost/xh_image9.jpeg',
                'uploads/departmentpost/xh_image10.jpeg',
            ],
        },
        {
            'id': 6,
            'main_image': 'uploads/departmentpost/xh_image12.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image13.jpeg',
                'uploads/departmentpost/xh_image14.jpeg',
                'uploads/departmentpost/xh_image15.jpeg',
                'uploads/departmentpost/xh_image16.jpeg',
                'uploads/departmentpost/xh_image17.jpeg',
            ],
        },
        {
            'id': 8,
            'main_image': 'uploads/departmentpost/xh_image39.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image40.jpeg',
                'uploads/departmentpost/xh_image41.jpeg',
                'uploads/departmentpost/xh_image42.jpeg',
                'uploads/departmentpost/xh_image43.jpeg',
                'uploads/departmentpost/xh_image38.png',
            ],
        },
        {
            'id': 13,
            'main_image': 'uploads/departmentpost/xh_image54.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image55.jpeg',
                'uploads/departmentpost/xh_image56.jpeg',
                'uploads/departmentpost/xh_image57.jpeg',
            ],
        },
    ]

    for item in partner_updates:
        post = DepartmentPost.objects.filter(id=item['id']).first()
        if post:
            post.image = item['main_image']
            post.save()
            DepartmentPostImage.objects.filter(post=post).delete()
            for idx, img_path in enumerate(item['gallery'], start=1):
                DepartmentPostImage.objects.create(post=post, image=img_path, order=idx)

    # 2. Create dedicated DepartmentPost rows for the International Projects (Xalqaro loyihalar)
    project_posts = [
        {
            'id': 21,
            'title': 'Xalqaro loyiha: “Bir makon, bir yo‘l: Buyuk Ipak yo‘li chorrahasida kesishgan san’at” ko‘rgazma va seminari',
            'title_ru': 'Международный проект: Выставка и семинар «Один пояс, один путь: искусство на перекрёстке Великого Шёлкового пути»',
            'title_en': 'International Project: Exhibition and Seminar "One Belt, One Road: Art Intersecting at the Crossroads of the Great Silk Road"',
            'date': '2025-10-12',
            'main_image': 'uploads/departmentpost/xh_image114.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image115.jpeg',
                'uploads/departmentpost/xh_image116.jpeg',
                'uploads/departmentpost/xh_image117.jpeg',
            ],
            'content': (
                "12-oktabr kuni Respublika ixtisoslashtirilgan dizayn maktabida “Badiiy ta’limning zamonaviy tendensiyalari: O‘zbekiston va Xitoy tajribasi” mavzusidagi xalqaro ilmiy-amaliy seminar doirasida “Bir makon, bir yo‘l: Buyuk Ipak yo‘li chorrahasida kesishgan san’at” nomli ko‘rgazma dasturi o‘z ishini boshladi.\n\n"
                "Ko‘rgazmada Xitoy ijodkorlarining badiiy asarlari namoyish etilib, tashrif buyuruvchilarga Xitoy tasviriy san’atining o‘ziga xos xususiyatlari, milliy badiiy an’analari va zamonaviy ijodiy yondashuvlari bilan yaqindan tanishish imkoniyati yaratildi."
            ),
            'content_ru': (
                "12 октября в Республиканской специализированной школе дизайна в рамках международного научно-практического семинара «Современные тенденции художественного образования: опыт Узбекистана и Китая» начала работу выставочная программа «Один пояс, один путь: искусство на перекрёстке Великого Шёлкового пути»."
            ),
            'content_en': (
                "On October 12, the exhibition program 'One Belt, One Road: Art Intersecting at the Crossroads of the Great Silk Road' opened at the Republican Specialized Design School within the framework of the international seminar 'Contemporary Trends in Art Education: Experience of Uzbekistan and China'."
            ),
        },
        {
            'id': 22,
            'title': 'Xalqaro loyiha: “NEW SILK ROAD ART JOURNEY” xalqaro konferensiyasi va “8+N” ta’lim forumi (Xitoy)',
            'title_ru': 'Международный проект: Конференция «NEW SILK ROAD ART JOURNEY» и образовательный форум «8+N» (Китай)',
            'title_en': 'International Project: "NEW SILK ROAD ART JOURNEY" Conference and "8+N" Education Forum (China)',
            'date': '2025-11-07',
            'main_image': 'uploads/departmentpost/xh_image90.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image91.jpeg',
                'uploads/departmentpost/xh_image92.jpeg',
                'uploads/departmentpost/xh_image93.jpeg',
                'uploads/departmentpost/xh_image94.jpeg',
                'uploads/departmentpost/xh_image95.jpeg',
                'uploads/departmentpost/xh_image84.jpeg',
                'uploads/departmentpost/xh_image85.jpeg',
                'uploads/departmentpost/xh_image86.jpeg',
                'uploads/departmentpost/xh_image87.jpeg',
                'uploads/departmentpost/xh_image88.jpeg',
                'uploads/departmentpost/xh_image89.jpeg',
            ],
            'content': (
                "Xubey tasviriy san’at institutida (HIFA) “NEW SILK ROAD ART JOURNEY: International Conference on Integration and Innovation in Art Education and Cultural Tourism” nomli xalqaro konferensiya hamda “8+N” xalqaro oliy san’at maktablari asosiy ta’lim forumi bo‘lib o‘tdi.\n\n"
                "O‘zbekiston delegatsiyasi vakillari ushbu nufuzli anjumanda ma’ruzalar bilan faol ishtirok etib, “2025 xalqaro talabalarning rasm ishlari ko‘rgazmasi” va institut muzeyi faoliyati bilan tanishdilar."
            ),
            'content_ru': (
                "В Хубэйском институте изящных искусств (HIFA) состоялись международная конференция «NEW SILK ROAD ART JOURNEY» и международный образовательный форум художественных вузов «8+N», в которых активно выступила делегация Узбекистана."
            ),
            'content_en': (
                "The 'NEW SILK ROAD ART JOURNEY' International Conference and '8+N' International Higher Art Education Forum were held at Hubei Institute of Fine Arts (HIFA) with active participation from the Uzbekistan delegation."
            ),
        },
        {
            'id': 23,
            'title': 'Xalqaro loyiha: Keimyung universiteti professorlari mahorat darsi va “Faxriy professor” unvoni topshirilishi',
            'title_ru': 'Международный проект: Мастер-класс профессоров Университета Кемён и вручение звания «Почётный профессор»',
            'title_en': 'International Project: Masterclass by Keimyung University Professors & Conferral of "Honorary Professor" Title',
            'date': '2025-04-22',
            'main_image': 'uploads/departmentpost/xh_image62.jpeg',
            'gallery': [
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
                "2025-yil 22-aprel kuni Markazda Koreya Respublikasi Keimyung universitetining Tasviriy san’at kolleji dekani Kim Yun Hee hamda Tasviriy san’at kafedrasi mudiri Jang Tae Mook tomonidan tinglovchilar uchun seminar va mahorat darsi o‘tkazildi.\n\n"
                "Shuningdek, Markaz Ilmiy-metodik kengashining tegishli qarori bilan Kim Yun Hee hamda professor Jang Tae Mookga Markazning “Faxriy professori” unvoni topshirildi."
            ),
            'content_ru': (
                "22 апреля 2025 года в Центре декан Колледжа изящных искусств Университета Кемён Ким Юн Хи и профессор Чан Тхэ Мук провели семинар и мастер-класс, а также были удостоены звания «Почётный профессор» Центра."
            ),
            'content_en': (
                "On April 22, 2025, Dean Kim Yun Hee and Prof. Jang Tae Mook of Keimyung University conducted a seminar and masterclass at the Center and were awarded the title of 'Honorary Professor' of the Center."
            ),
        },
        {
            'id': 24,
            'title': 'Xalqaro loyiha: Qozog‘iston bilan Memorandum asosida “Rangtasvir” xalqaro malaka oshirish kursi',
            'title_ru': 'Международный проект: Курс повышения квалификации «Живопись» на основе Меморандума с Казахстаном',
            'title_en': 'International Project: Professional Development Course in Painting under the Memorandum with Kazakhstan',
            'date': '2024-02-10',
            'main_image': 'uploads/departmentpost/xh_image44.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image45.jpeg',
                'uploads/departmentpost/xh_image46.jpeg',
                'uploads/departmentpost/xh_image47.jpeg',
                'uploads/departmentpost/xh_image48.jpeg',
                'uploads/departmentpost/xh_image49.jpeg',
            ],
            'content': (
                "Markaz delegatsiyasining Qozog‘iston Respublikasi Temirbek Jurgenov nomidagi Qozoq Milliy Badiiy akademiyasiga tashrifi davomida imzolangan hamkorlik Memorandumi asosida Markazda “Rangtasvir” yo‘nalishi bo‘yicha xalqaro malaka oshirish kursi tashkil etildi va bitiruvchilarga sertifikatlar topshirildi."
            ),
            'content_ru': (
                "На основе Меморандума о сотрудничестве с Казахской национальной академией искусств им. Т. Жургенова в Центре проведён международный курс повышения квалификации по направлению «Живопись»."
            ),
            'content_en': (
                "Based on the Memorandum of Cooperation with the Kazakh National Academy of Arts named after T. Zhurgenov, an international professional development course in Painting was conducted at the Center."
            ),
        },
        {
            'id': 25,
            'title': 'Xalqaro loyiha: JNAFAU dotsenti Anand Rao va doktor Priti Samuktaning tashrifi hamda “Hindiston san’ati tarixi” seminari',
            'title_ru': 'Международный проект: Визит учёных JNAFAU и семинар «История искусства Индии»',
            'title_en': 'International Project: Visit of JNAFAU Scholars and Seminar "History of Indian Art"',
            'date': '2024-03-15',
            'main_image': 'uploads/departmentpost/xh_image18.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image19.jpeg',
                'uploads/departmentpost/xh_image20.jpeg',
                'uploads/departmentpost/xh_image21.jpeg',
                'uploads/departmentpost/xh_image22.jpeg',
            ],
            'content': (
                "Hindistonning Javoharlal Neru nomidagi Arxitektura va tasviriy san’at universiteti (JNAFAU) bilan imzolangan Memorandum doirasida Tasviriy sanʼat kolleji dotsenti Anand Rao va doktor Priti Samukta yurtimizga tashrif buyurdi. Markaz xodimlari bilan uchrashuv o‘tkazilib, doktor Priti Samukta tomonidan “Hindiston sanʼati tarixi” mavzusida seminar o‘tildi."
            ),
            'content_ru': (
                "В рамках Меморандума с Университетом JNAFAU (Индия) Центр посетили доцент Ананд Рао и доктор Прити Самукта, проведя встречу и научный семинар «История искусства Индии»."
            ),
            'content_en': (
                "Under the Memorandum with JNAFAU (India), Associate Professor Anand Rao and Dr. Priti Samyukta visited the Center and conducted a seminar on 'History of Indian Art'."
            ),
        },
        {
            'id': 26,
            'title': 'Xalqaro loyiha: Markaz delegatsiyasi va rassomlarning Turkiyadagi Zamonaviy san’at muzeyiga tashrifi',
            'title_ru': 'Международный проект: Визит делегации Центра и художников в Музей современного искусства Турции',
            'title_en': 'International Project: Visit of the Center Delegation and Artists to the Museum of Modern Art in Turkey',
            'date': '2024-08-05',
            'main_image': 'uploads/departmentpost/xh_image107.jpeg',
            'gallery': [
                'uploads/departmentpost/xh_image108.jpeg',
                'uploads/departmentpost/xh_image109.jpeg',
                'uploads/departmentpost/xh_image110.jpeg',
                'uploads/departmentpost/xh_image111.jpeg',
                'uploads/departmentpost/xh_image112.jpeg',
                'uploads/departmentpost/xh_image113.jpeg',
            ],
            'content': (
                "O‘zbekiston Badiiy akademiyasi huzuridagi Markaz rahbari, xodimlari hamda bir guruh rassomlarning Turkiyaga tashrifi doirasida Zamonaviy san’at muzeyiga tashrif amalga oshirildi. Ishtirokchilar zamonaviy rassomlar ijodi, san’atdagi yangi yo‘nalishlar va uslublar bilan yaqindan tanishdilar."
            ),
            'content_ru': (
                "В рамках визита руководства, сотрудников Центра и группы художников в Турцию состоялось посещение Музея современного искусства."
            ),
            'content_en': (
                "During the visit of Center leadership, staff, and artists to Turkey, the delegation visited the Museum of Modern Art to explore contemporary art trends."
            ),
        },
    ]

    for item in project_posts:
        post, _ = DepartmentPost.objects.update_or_create(
            id=item['id'],
            defaults={
                'department': dept,
                'title': item['title'],
                'title_ru': item['title_ru'],
                'title_en': item['title_en'],
                'content': item['content'],
                'content_ru': item['content_ru'],
                'content_en': item['content_en'],
                'image': item['main_image'],
                'date': item['date'],
                'is_active': True,
                'views_count': 0,
            },
        )
        DepartmentPostImage.objects.filter(post=post).delete()
        for idx, img_path in enumerate(item['gallery'], start=1):
            DepartmentPostImage.objects.create(post=post, image=img_path, order=idx)


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0033_reset_demo_view_counts'),
    ]

    operations = [
        migrations.RunPython(separate_partners_and_projects, noop_reverse),
    ]
