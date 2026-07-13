"""Management command to bulk translate all existing DB content."""
from django.core.management.base import BaseCommand
from core.translation import auto_translate_instance, TRANSLATABLE_MODELS
from django.apps import apps
import time


class Command(BaseCommand):
    help = 'Translate all existing content in DB to RU and EN using MyMemory API'

    def handle(self, *args, **options):
        for model_name, fields in TRANSLATABLE_MODELS.items():
            try:
                model = apps.get_model('core', model_name)
                objects = model.objects.all()
                count = objects.count()
                self.stdout.write(f'Translating {model_name} ({count} records)...')

                for i, obj in enumerate(objects):
                    changed = auto_translate_instance(obj, fields)
                    if changed:
                        update_fields = {}
                        for field in fields:
                            for lang in ['ru', 'en']:
                                tf = f'{field}_{lang}'
                                if hasattr(obj, tf):
                                    update_fields[tf] = getattr(obj, tf)
                        if update_fields:
                            model.objects.filter(pk=obj.pk).update(**update_fields)

                    if (i + 1) % 5 == 0:
                        self.stdout.write(f'  {i+1}/{count} done')
                    time.sleep(0.5)  # Rate limit: MyMemory allows ~100 req/day free

                self.stdout.write(self.style.SUCCESS(f'{model_name}: done'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'{model_name} error: {e}'))
