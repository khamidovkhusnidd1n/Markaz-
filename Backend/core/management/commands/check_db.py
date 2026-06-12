from django.core.management.base import BaseCommand
from django.db import connection
from django.db.utils import OperationalError


class Command(BaseCommand):
    help = "PostgreSQL ulanishini tekshiradi va diagnostika beradi."

    def handle(self, *args, **options):
        try:
            connection.ensure_connection()
            with connection.cursor() as cursor:
                cursor.execute("SELECT current_database(), current_user, version()")
                database_name, current_user, version = cursor.fetchone()

            self.stdout.write(self.style.SUCCESS("PostgreSQL ulanishi muvaffaqiyatli."))
            self.stdout.write(f"Database: {database_name}")
            self.stdout.write(f"User: {current_user}")
            self.stdout.write(f"Version: {version}")
        except OperationalError as exc:
            self.stderr.write(self.style.ERROR(f"PostgreSQL ulanishida xatolik: {exc}"))
            self.stderr.write("Tekshiring: PostgreSQL service ishlayaptimi, host/port to'g'rimi, parol mosmi.")
            raise SystemExit(1)
