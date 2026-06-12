from django.core.management.base import BaseCommand

from core.models import AppContent, Course, News, NewsCategory, Statistics


class Command(BaseCommand):
    help = "Frontend va admin tekshiruvi uchun namunaviy ma'lumotlar yaratadi."

    def handle(self, *args, **options):
        category, _ = NewsCategory.objects.get_or_create(
            slug='elonlar',
            defaults={'name': 'E`lonlar', 'order': 1},
        )
        News.objects.get_or_create(
            title='PostgreSQL bilan integratsiya yakunlandi',
            defaults={
                'category': category,
                'content': 'Admin panelga kiritilgan ma`lumotlar endi PostgreSQL orqali saqlanadi.',
                'is_important': True,
                'is_active': True,
            },
        )
        Course.objects.get_or_create(
            title='Malaka oshirish dasturi',
            defaults={
                'course_type': 'professional_development',
                'duration': '3 oy',
                'description': 'Django va PostgreSQL asosida tuzilgan namunaviy kurs.',
                'phone_numbers': '+998 90 000 00 00',
                'email': 'admin@example.com',
                'is_active': True,
            },
        )

        stats = Statistics.get_instance()
        stats.total_pedagogs = 120
        stats.professors = 12
        stats.dotsents = 24
        stats.academics = 4
        stats.potential = 78
        stats.save()

        content = AppContent.get_instance()
        content.site_name = "Sayt boshqaruv paneli"
        content.history = "Bu matn admin panel orqali boshqariladi va DTL sahifalarda ko'rsatiladi."
        content.contact_info = "Telefon: +998 71 000 00 00"
        content.address = "Toshkent shahri"
        content.save()

        self.stdout.write(self.style.SUCCESS("Namunaviy ma'lumotlar yaratildi."))
