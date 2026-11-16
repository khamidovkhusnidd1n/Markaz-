import os
import shutil
from pathlib import Path
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = "Siqilgan 3.7MB PDF faylni media papkasidagi 94MB li fayl ustiga ko'chiradi"

    def handle(self, *args, **options):
        src = Path(settings.BASE_DIR) / 'core' / 'compressed_files' / '46cd56c5c9734540873589c771f4dd42.pdf'
        if not src.exists():
            self.stderr.write(self.style.ERROR(f"Manba fayl topilmadi: {src}"))
            return

        media_root = Path(settings.MEDIA_ROOT)
        dest_dir = media_root / 'uploads' / 'journalissue'
        dest_dir.mkdir(parents=True, exist_ok=True)
        dest = dest_dir / '46cd56c5c9734540873589c771f4dd42.pdf'

        orig_size = dest.stat().st_size / (1024 * 1024) if dest.exists() else 0
        shutil.copy2(src, dest)
        new_size = dest.stat().st_size / (1024 * 1024)

        self.stdout.write(
            self.style.SUCCESS(
                f"[OK] 46cd56c5c9734540873589c771f4dd42.pdf yangilandi!\n"
                f"Eski hajm: {orig_size:.2f} MB -> Yangi hajm: {new_size:.2f} MB\n"
                f"Joylashuvi: {dest}"
            )
        )
