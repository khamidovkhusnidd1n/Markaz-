import os
import shutil
from pathlib import Path
from datetime import datetime
from django.core.management.base import BaseCommand
from django.conf import settings
from django.db import transaction
from core.models import (
    Course, Personnel, AppContent, JournalSettings,
    InternationalSettings, InternationalProject, Document
)
from core.translation import auto_translate_instance

class Command(BaseCommand):
    help = "Seeds database with real content from eskisayttexts.txt and integrates documents"

    def handle(self, *args, **options):
        self.stdout.write("Starting database seeding...")

        fallback_source_path = r"C:\Users\Salohiddin Markaz\Desktop\eskisayttexts.txt"
        dynamic_source_path = Path(settings.BASE_DIR).parent.parent.parent / "eskisayttexts.txt"
        if dynamic_source_path.exists():
            source_text_path = str(dynamic_source_path)
        else:
            source_text_path = fallback_source_path

        if not os.path.exists(source_text_path):
            self.stdout.write(self.style.ERROR(f"Source text file not found at {source_text_path}"))
            return

        with open(source_text_path, 'r', encoding='utf-8') as f:
            source_text = f.read()

        with transaction.atomic():
            # 1. Seed Courses
            self.stdout.write("Seeding courses...")
            # Clear existing courses to prevent duplicates
            Course.objects.all().delete()

            # We define courses and their descriptions explicitly based on eskisayttexts.txt
            courses_data = [
                # Retraining courses
                {
                    'title': 'Badiiy kashtachilik usta-rassomi',
                    'course_type': 'retraining',
                    'duration': '720 soat',
                    'description': 'Badiiy kashtachilik usta-rassomi tayyorlash kursi.',
                    'order': 1,
                },
                {
                    'title': 'Badiiy zardoʻzlik usta-rassomi',
                    'course_type': 'retraining',
                    'duration': '720 soat',
                    'description': 'Badiiy zardoʻzlik usta-rassomi tayyorlash kursi.',
                    'order': 2,
                },
                {
                    'title': 'Dastgohli rangtasvir rassomi',
                    'course_type': 'retraining',
                    'duration': '720 soat',
                    'description': 'Dastgohli rangtasvir rassomi tayyorlash kursi.',
                    'order': 3,
                },
                {
                    'title': 'Liboslar dizayneri',
                    'course_type': 'retraining',
                    'duration': '720 soat',
                    'description': 'Liboslar dizayneri tayyorlash kursi.',
                    'order': 4,
                },
                {
                    'title': 'Rangtasvir (turlari boʻyicha)',
                    'course_type': 'retraining',
                    'duration': '864 soat',
                    'description': 'Rangtasvir (turlari boʻyicha) mutaxassislarini tayyorlash kursi.',
                    'order': 5,
                },
                # Professional development courses
                {
                    'title': 'Tasviriy sanʼat (turlari boʻyicha)',
                    'course_type': 'professional_development',
                    'duration': '144 soat',
                    'description': 'Ushbu kurs tasviriy san’atning asosiy turlari bo‘yicha zamonaviy o‘qitish metodikalarini o‘zlashtirish, ijodiy yondashuvni rivojlantirish va o‘quv jarayoniga innovatsion pedagogik texnologiyalarni joriy etishni nazarda tutadi.',
                    'order': 6,
                },
                {
                    'title': 'Amaliy sanʼat (turlari boʻyicha)',
                    'course_type': 'professional_development',
                    'duration': '144 soat',
                    'description': 'Ushbu kurs amaliy san’atning asosiy turlari bo‘yicha zamonaviy pedagogik yondashuvlarni o‘rganish, milliy an’analarni ta’lim jarayoniga integratsiya qilish va o‘quv mashg‘ulotlarini samarali tashkil etish ko‘nikmalarini rivojlantirishni nazarda tutadi.',
                    'order': 7,
                },
                {
                    'title': 'Grafika (turlari boʻyicha)',
                    'course_type': 'professional_development',
                    'duration': '144 soat',
                    'description': 'malaka oshirish kursi pedagoglarning dastgoh grafikasi, kitob grafikasi, plakat, illyustratsiya va zamonaviy raqamli grafika yo‘nalishlari bo‘yicha nazariy bilimlari hamda amaliy mahoratini takomillashtirishga qaratilgan.',
                    'order': 8,
                },
                {
                    'title': 'Dizayn (turlari boʻyicha)',
                    'course_type': 'professional_development',
                    'duration': '144 soat',
                    'description': 'malaka oshirish kursi grafik dizayn, interyer dizayni, sanoat dizayni va vizual kommunikatsiya yo‘nalishlari bo‘yicha pedagoglarning nazariy bilimlari hamda amaliy ko‘nikmalarini takomillashtirishga qaratilgan.',
                    'order': 9,
                },
                {
                    'title': 'Sanʼatshunoslik (turlari boʻyicha)',
                    'course_type': 'professional_development',
                    'duration': '144 soat',
                    'description': 'malaka oshirish kursi tasviriy va amaliy san’at, dizayn hamda grafika yo‘nalishlarining nazariy asoslari, tarixiy rivojlanishi va tahlil metodlarini chuqurlashtirishga qaratilgan.',
                    'order': 10,
                },
                {
                    'title': 'Haykaltaroshlik (turlari bo‘yicha)',
                    'course_type': 'professional_development',
                    'duration': '144 soat',
                    'description': 'malaka oshirish kursi dastgoh va monumental haykaltaroshlik shuningdek, dekorativ plastika yo‘nalishlari bo‘yicha pedagoglarning nazariy bilimlari hamda amaliy mahoratini takomillashtirishga qaratilgan.',
                    'order': 11,
                },
                {
                    'title': 'Muzeyshunoslik (turlari bo‘yicha)',
                    'course_type': 'professional_development',
                    'duration': '144 soat',
                    'description': 'malaka oshirish kursi muzey faoliyatining nazariy asoslari, ekspozitsiya va fond ishini tashkil etish, muzey pedagogikasi hamda madaniy merosni saqlash yo‘nalishlari bo‘yicha kasbiy bilim va ko‘nikmalarni takomillashtirishga qaratilgan.',
                    'order': 12,
                }
            ]

            for data in courses_data:
                course = Course.objects.create(
                    title=data['title'],
                    course_type=data['course_type'],
                    duration=data['duration'],
                    description=data['description'],
                    order=data['order'],
                    is_active=True
                )
                auto_translate_instance(course, ['title', 'description'])
                course.save()

            # 2. Seed Personnel
            self.stdout.write("Seeding personnel...")
            Personnel.objects.all().delete()

            personnel_data = [
                # Leadership (Rahbariyat)
                {
                    'full_name': 'Shukurov Davronbek Shukurovich',
                    'position': "O'zBA huzuridagi Markaz direktori",
                    'category': 'leadership',
                    'order': 1
                },
                {
                    'full_name': 'Sharipov Azmiddin Najmiddin oʻgʻli',
                    'position': 'Qayta tayyorlash va malaka oshirish jarayoni monitoringini olib borish va sifatni baholash bo‘limi boshlig‘i',
                    'category': 'leadership',
                    'order': 2
                },
                {
                    'full_name': 'Akramova Lobar Rixsitullayevna',
                    'position': 'O‘quv jarayonini tashkil etish bo‘limi boshlig‘i',
                    'category': 'leadership',
                    'order': 3
                },
                # Central Apparat (Markaziy apparat)
                {
                    'full_name': 'Yeshchanov Oybek Shukurlayevich',
                    'position': 'Bosh hisobchi',
                    'category': 'staff',
                    'order': 4
                },
                {
                    'full_name': "Xamidov Xusniddin Tolibjon o'g'li",
                    'position': "Matbuot va axborot texnologiyalari bo'limi bosh mutaxassi",
                    'category': 'staff',
                    'order': 5
                },
                {
                    'full_name': "Xasanova Nodira A'zam qizi",
                    'position': 'Inspektor',
                    'category': 'staff',
                    'order': 6
                },
                {
                    'full_name': 'Shuhratov Shohruh Shuhrat o‘g\'li',
                    'position': 'Xo‘jalik ishlari bo‘limi boshlig‘i',
                    'category': 'staff',
                    'order': 7
                },
                {
                    'full_name': 'Xushboqova Madina',
                    'position': "Xalqaro aloqalarni rivojlantirish bo'limi bosh mutaxassisi",
                    'category': 'staff',
                    'order': 8
                },
                {
                    'full_name': 'To‘rayeva Dilnoza Ismatulla qizi',
                    'position': 'Yuristkonsult',
                    'category': 'staff',
                    'order': 9
                },
                {
                    'full_name': "Husanboyev Shohjaxon Sherzod o'g'li",
                    'position': 'Umumiy boʻlim bosh mutaxassisi',
                    'category': 'staff',
                    'order': 10
                },
                {
                    'full_name': "Jonimboyeva Guldona O'ktamjon qizi",
                    'position': 'Kotib-ish yurituvchi',
                    'category': 'staff',
                    'order': 11
                },
                {
                    'full_name': 'Mamarasulova Dilnavoz Baxtiyor qizi',
                    'position': 'O‘quv jarayonini tashkil etish bo‘limi uslubchisi',
                    'category': 'staff',
                    'order': 12
                },
                {
                    'full_name': 'Sattorov Abdumalik Abdug’affor o’g’li',
                    'position': 'Qayta tayyorlash va malaka oshirish jarayoni monitoringini olib borish va sifatini baholash bo‘limi uslubchisi',
                    'category': 'staff',
                    'order': 13
                },
                {
                    'full_name': 'Sulaymonov Otabek Oybek o‘g‘li',
                    'position': 'O‘quv jarayonini tashkil etish bo‘limi uslubchisi',
                    'category': 'staff',
                    'order': 14
                },
                {
                    'full_name': 'Nurmaxammatov Ibroxim Bahrom o‘g‘li',
                    'position': 'Buxgalter',
                    'category': 'staff',
                    'order': 15
                },
                {
                    'full_name': "Hayitov Sahobiddin Omon o'g'li",
                    'position': 'Buxgalter',
                    'category': 'staff',
                    'order': 16
                }
            ]

            for data in personnel_data:
                person = Personnel.objects.create(
                    full_name=data['full_name'],
                    position=data['position'],
                    category=data['category'],
                    reception_hours='9:00 - 18:00, Dushanbadan-Jumagacha',
                    order=data['order'],
                    is_active=True
                )
                auto_translate_instance(person, ['position', 'duties', 'biography'])
                person.save()

            # 3. Seed AppContent
            self.stdout.write("Seeding AppContent...")
            history_text = (
                "O‘zbekiston Badiiy akademiyasi huzuridagi Badiiy ta’lim yo‘nalishlarida pedagog va mutaxassis kadrlarni "
                "qayta tayyorlash hamda ularning malakasini oshirish markazi O‘zbekiston Respublikasi Prezidentining "
                "“Tasviriy va amaliy san’at sohasi samaradorlini anada oshirishga doir chora-tadbirlar to‘g‘risida” "
                "2020-yil 21-apreldagi PQ-4688-son qarori hamda O‘zbekiston Respublikasi Vazirlar Mahkamasining "
                "“O‘zbekiston Badiiy akademiyasi huzuridagi Badiiy ta’lim yo‘nalishlarida pedagog va mutaxassis kadrlarni "
                "qayta tayyorlash hamda ularning malakasini oshirish markazi faoliyatini tashkil etish chora-tadbirlari to‘g‘risida” "
                "2021-yil 21-iyundagi 385-son qarori asosida tashkil etilgan.\n\n"
                "Markaz davlat oliy va professional ta’lim muassasalari, ixtisoslashtirilgan san’at va madaniyat maktablari "
                "hamda maktab-internatlar, bolalar musiqa va san’at maktablarining badiiy ta’lim yо‘nalishlarida pedagog va "
                "mutaxassis kadrlarini qayta tayyorlash hamda ularning malakasini oshirishga ixtisoslashtirilgan ilmiy-metodik "
                "va davlat ta’lim muassasasi hisoblanadi.\n\n"
                "Markazda 7 ta badiiy ta’lim yo‘nalishlarida malaka oshirish hamda 6 ta qayta tayyorlash yo‘nalishlari mavjud bo‘lib, "
                "bugungi kunga qadar 1.500 ga yaqin professor-o‘qituvchilar zamonaviy ta’lim dasturlari, ilmiy-ijodiy hamda "
                "pedagogik texnalogiyalar asosida malaka oshirgan bo‘lsa, 300 ga yaqin professor-o‘qituvchilar kasbiy qayta "
                "tayyorlash kurslarida tahsil olib ixtisoslashgan san’at maktab-internatlarida va bolalar musiqa va san’at "
                "maktablarida o‘z faoliyatini muvoffaqiyatli olib bormoqdalar."
            )

            student_notes_text = (
                "Tinglovchilarning hujjatlari mashg‘ulotlar boshlanishining 1-kunida qabul qilinadi.\n\n"
                "Malaka oshirish tinglovchisi sifatida talabgorlar Markazga quyidagi hujjatlarni taqdim etadi:\n"
                "- malaka oshirish kursiga yuborilganligi tо‘g‘risidagi ta’lim muassasasining bо‘yrug‘idan kо‘chirma;\n"
                "- obyektivka;\n"
                "- pasport nusxasi.\n"
                "- avval malaka oshirgan bo‘lsa malaka sertefikati.\n\n"
                "Malaka oshirish kurslariga tinglovchilarni qabul qilish tо‘g‘risidagi buyruq kurslar boshlanishi sanasidan 3 kun mobaynida rasmiylashtiriladi.\n\n"
                "Malaka oshirish kurslari boshlanganidan keyin uch kun mobaynida kelmagan tinglovchilar, kelmaslikning sabablaridan qatiy nazar, kurslarga qо‘yilmaydi.\n\n"
                "Tinglovchining qayta tayyorlash va malaka oshirish kurslariga о‘z vaqtida kelmaganlikning hujjat bilan tasdiqlangan uzrli sababalari bо‘lganda ularga о‘qishning tegishli yо‘nalishi (mutaxassisligi) bо‘yicha keyingi kurslarda qayta tayyorlash va malakasini oshirishdan о‘tish huquqi beriladi."
            )

            content = AppContent.get_instance()
            content.history = history_text
            content.student_notes = student_notes_text
            content.contact_info = "📞 (+99877) 363-38-36\nTelegram: @Uzbamarkaz_jurnali, @badiiytalimvapedagogika"
            content.address = "Toshkent shahri, Uchtepa tumani, Chilonzor 26-daha, Shirin ko'cha, 1A"
            content.site_name = "O‘zbekiston Badiiy akademiyasi huzuridagi Badiiy ta’lim yo‘nalishlarida pedagog va mutaxassis kadrlarni qayta tayyorlash va malaka oshirish markazi"
            auto_translate_instance(content, ['history', 'structure', 'student_notes', 'site_name'])
            content.save()

            # 4. Seed JournalSettings
            self.stdout.write("Seeding JournalSettings...")
            js = JournalSettings.get_instance()
            js.about_journal = "Ushbu ilmiy jurnal badiiy ta'lim sohasidagi tadqiqotlar va metodikalarni yoritib boradi."
            js.phone = "(+99877) 363-38-36"
            js.editorial_address = "Toshkent shahri, Uchtepa tumani, Chilonzor 26-daha, Shirin ko'cha, 1A"
            js.email = "thecentreaauzglobal@gmail.com"
            js.telegram_primary = "https://t.me/Uzbamarkaz_jurnali"
            js.telegram_secondary = "https://t.me/badiiytalimvapedagogika"
            js.article_rules_text = (
                "- Maqolalar o'zbek, rus, qoraqalpoq yoki ingliz tillarida qabul qilinadi.\n"
                "- Maqola hajmi 5-8 bet bo'lishi lozim.\n"
                "- Annotatsiya va kalit so'zlar 3 tilda beriladi."
            )
            js.save()

            # 5. Seed InternationalSettings
            self.stdout.write("Seeding InternationalSettings...")
            is_settings = InternationalSettings.get_instance()
            is_settings.hero_title = "Xalqaro aloqalar | International relations"
            is_settings.hero_description = "Markazning xalqaro aloqalar, hamkorlar va hamkorlikdagi loyihalar / The Center’s international relations, partners, and collaborative projects"
            is_settings.about_text = (
                "The International Relations Department of the Centre of Retraining and Professional Development of Teachers and Specialists in the areas of Art Education at the Academy of Arts of Uzbekistan collaborates with universities, research centers, and cultural organizations worldwide.\n\n"
                "Areas of Cooperation:\n"
                "- Visual Arts (all types)\n"
                "- Applied Arts (all types)\n"
                "- Design (all types)\n"
                "- Sculpture\n"
                "- Art History\n"
                "- Museology\n\n"
                "Contact:\n"
                "Head Specialist of the International Relations Department – Khushbokova Madina\n"
                "Phone: +998 931073719 (WhatsApp, WeChat, Telegram)\n"
                "Email: thecentreaauzglobal@gmail.com"
            )
            is_settings.save()

            # 6. Seed InternationalProjects
            self.stdout.write("Seeding InternationalProjects...")
            InternationalProject.objects.all().delete()

            proj1 = InternationalProject.objects.create(
                title="“Rangtasvir” yo‘nalishi bo‘yicha malaka oshirish kurslari",
                description="Aprel oyida T.Jurgenov nomidagi Qozog‘iston Milliy san’at akademiyasining 8 nafar o‘qituvchilari uchun “Rangtasvir” yo‘nalishi bo‘yicha malaka oshirish kurslari (onlayn va oflayn) o‘tkazildi. Darslar yurtimizning e’tiborli go‘shalarida, professor rassomlar tashkil etildi.",
                partners_text="T.Jurgenov nomidagi Qozog‘iston Milliy san’at akademiyasi",
                start_date=datetime.strptime("11.04.2024", "%d.%m.%Y").date(),
                status="completed",
                order=1,
                is_active=True
            )
            auto_translate_instance(proj1, ['title', 'description'])
            proj1.save()

            proj2 = InternationalProject.objects.create(
                title="“An’anaviy va zamonaviy kashtachilik san’at” nomli xalqaro ilmiy-amaliy seminar",
                description="2023-yilning oktabr oyida T.Jurgenov nomidagi Qozog‘iston Milliy san’at akademiyasi bilan Memorandum imzolangan memorandum doirasida “An’anaviy va zamonaviy kashtachilik san’at” nomli xalqaro ilmiy-amaliy seminar o‘tkazildi. Seminar ikki davlat milliy san’at uslublarini o‘rganish hamda amaliy san’atning badiiy kashtachilik va gobelen turlarini tadqiq etishga qaratildi.",
                partners_text="T.Jurgenov nomidagi Qozog‘iston Milliy san’at akademiyasi",
                start_date=datetime.strptime("03.11.2023", "%d.%m.%Y").date(),
                status="completed",
                order=2,
                is_active=True
            )
            auto_translate_instance(proj2, ['title', 'description'])
            proj2.save()

            # 7. Seed Documents and Copy Files
            self.stdout.write("Seeding Documents and Copying Files...")
            Document.objects.all().delete()

            fallback_docs_dir = r"C:\Users\Salohiddin Markaz\Desktop\SAYT\docs"
            dynamic_docs_dir = Path(settings.BASE_DIR).parent.parent / "docs"
            if dynamic_docs_dir.exists():
                docs_src_dir = str(dynamic_docs_dir)
            else:
                docs_src_dir = fallback_docs_dir

            media_docs_dir = Path(settings.MEDIA_ROOT) / "uploads" / "document"
            os.makedirs(media_docs_dir, exist_ok=True)

            docs_info = [
                {
                    'filename': '552cb8e231414c02985f34cdcff3de84.pdf',
                    'title': 'O‘ZBEKISTON BADIIY AKADEMIYASI HUZURIDAGI BADIIY TAʼLIM YOʻNALISHLARIDA PEDAGOG VA MUTAXASSIS KADRLARNI QAYTA TAYYORLASH HAMDA ULARNING MALAKASINI OSHIRISHGA QOʻYILADIGAN DAVLAT TAʼLIM TALABLARI',
                    'category': 'regulatory'
                },
                {
                    'filename': 'bc6ebf4de0f74afc94391207f8969672.pdf',
                    'title': 'O‘zbekiston Badiiy akademiyasi raisining buyrug‘i. "Ixtisoslashtirilgan san’at va madaniyat maktablari hamda maktab- internatlari, bolalar musiqa va san’at maktablarining badiiy ta’lim yo‘nalishlaridagi pedagog va mutaxassis kadrlar malakasini oshirish bo‘yicha o‘quv reja va o‘quv dasturlarini tasdiqlash to‘g‘risida"',
                    'category': 'regulatory'
                },
                {
                    'filename': 'fd03264b2fa045ed9c5a94621980ea96.pdf',
                    'title': 'O‘zbekiston Badiiy akademiyasi raisining buyrug\'i "О‘zbekiston Badiiy akademiyasi huzuridagi Badiiy ta’lim yо‘nalishlarida pedagog va mutaxassis kadrlarni qayta tayyorlash hamda ularning malakasini oshirish markazining 2026-yil malaka oshirish rejasini tasdiqlash tо‘g‘risida"',
                    'category': 'regulatory'
                },
                {
                    'filename': '1ae8bd941de74b82b3fb98d81fd2a3a1.doc',
                    'title': 'OʻZBEKISTON RESPUBLIKASI VAZIRLAR MAHKAMASINING QARORI. OʻZBEKISTON BADIIY AKADEMIYASI HUZURIDAGI BADIIY TAʼLIM YOʻNALISHLARIDA PEDAGOG VA MUTAXASSIS KADRLARNI QAYTA TAYYORLASH HAMDA ULARNING MALAKASINI OSHIRISH MARKAZI FAOLIYATINI TASHKIL ETISH CHORA-TADBIRLARI TOʻGʻRISIDA',
                    'category': 'open_data'
                }
            ]

            for doc_item in docs_info:
                src_file_path = os.path.join(docs_src_dir, doc_item['filename'])
                dest_file_path = media_docs_dir / doc_item['filename']

                if os.path.exists(src_file_path):
                    try:
                        if dest_file_path.exists() and dest_file_path.stat().st_size == os.path.getsize(src_file_path):
                            self.stdout.write(f"Skipped copying {doc_item['filename']} (already exists and identical in size).")
                        else:
                            shutil.copy2(src_file_path, dest_file_path)
                            self.stdout.write(f"Copied {doc_item['filename']} to media path.")
                    except PermissionError as e:
                        self.stdout.write(self.style.WARNING(f"PermissionError copying {doc_item['filename']}: {e}"))
                else:
                    self.stdout.write(self.style.WARNING(f"Source document {src_file_path} not found!"))

                doc_record = Document.objects.create(
                    title=doc_item['title'],
                    category=doc_item['category'],
                    file=f"uploads/document/{doc_item['filename']}",
                    is_active=True
                )
                auto_translate_instance(doc_record, ['title'])
                doc_record.save()

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
