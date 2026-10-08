from django.core.management.base import BaseCommand
from core.models import Listener, TrainingPlanRecord

class Command(BaseCommand):
    help = "Eski Tinglovchilar bazasini yangi Malaka oshirish rejasiga ko'chiradi"

    def handle(self, *args, **kwargs):
        listeners = Listener.objects.all()
        count = 0
        for l in listeners:
            clean_duration = l.duration.replace(" 00:00:00", "").strip() if l.duration else ""
            status_text = "Malaka oshirish" if l.record_type == 'MO' else "Qayta tayyorlash"
            
            TrainingPlanRecord.objects.get_or_create(
                full_name=l.full_name,
                workplace=l.workplace or "",
                course_name=l.course_type or "",
                last_training_date=clean_duration,
                status=status_text
            )
            count += 1
        self.stdout.write(self.style.SUCCESS(f"{count} ta tinglovchi muvaffaqiyatli nusxalandi!"))
