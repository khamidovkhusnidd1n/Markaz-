import re
from django.core.management.base import BaseCommand
from core.models import JournalIssue

class Command(BaseCommand):
    help = "Normalize JournalIssue year and issue_number fields and sort them cleanly"

    def handle(self, *args, **options):
        count = 0
        for j in JournalIssue.objects.all():
            changed = False
            if j.year:
                m = re.search(r'\d{4}', str(j.year))
                clean_y = m.group(0) if m else str(j.year).strip()
                if j.year != clean_y:
                    j.year = clean_y
                    changed = True

            if j.issue_number:
                m = re.search(r'\d+', str(j.issue_number))
                if m:
                    clean_num = f"{m.group(0)}-son"
                else:
                    clean_num = str(j.issue_number).strip()
                if j.issue_number != clean_num:
                    j.issue_number = clean_num
                    changed = True

            if changed:
                j.save()
                count += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully normalized {count} journal issue records."))
