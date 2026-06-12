from django.core.management.base import BaseCommand

from core.models import (
    ArtGalleryItem,
    Course,
    Document,
    GalleryItem,
    InternationalMedia,
    InternationalPartner,
    InternationalProject,
    JournalIssue,
    News,
    NewsCategory,
    Personnel,
    Teacher,
)


class Command(BaseCommand):
    help = "Eski is_active=False bo'lib qolgan kontentlarni bir martada faollashtiradi."

    def handle(self, *args, **options):
        models_to_activate = [
            News,
            NewsCategory,
            GalleryItem,
            ArtGalleryItem,
            Teacher,
            Personnel,
            Course,
            JournalIssue,
            Document,
            InternationalPartner,
            InternationalProject,
            InternationalMedia,
        ]

        total_updated = 0
        for model in models_to_activate:
            updated = model.objects.filter(is_active=False).update(is_active=True)
            total_updated += updated
            self.stdout.write(f"{model.__name__}: {updated} ta yozuv faollashtirildi")

        self.stdout.write(self.style.SUCCESS(f"Jami {total_updated} ta yozuv faollashtirildi."))
