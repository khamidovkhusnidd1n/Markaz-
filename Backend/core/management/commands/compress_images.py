import os
from django.core.management.base import BaseCommand
from django.conf import settings
from PIL import Image, ImageOps


class Command(BaseCommand):
    help = "Compress and resize all oversized uploaded images in MEDIA_ROOT to optimize web performance"

    def handle(self, *args, **options):
        media_root = str(settings.MEDIA_ROOT)
        if not os.path.exists(media_root):
            self.stdout.write(self.style.WARNING(f"MEDIA_ROOT not found: {media_root}"))
            return

        self.stdout.write(self.style.NOTICE(f"Scanning images in: {media_root} ..."))
        total_saved_bytes = 0
        processed_count = 0
        error_count = 0

        valid_exts = ('.jpg', '.jpeg', '.png', '.webp')

        for root, dirs, files in os.walk(media_root):
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext not in valid_exts:
                    continue

                filepath = os.path.join(root, file)
                try:
                    orig_size = os.path.getsize(filepath)
                    # Only optimize if file is larger than 300KB
                    if orig_size < 300 * 1024:
                        continue

                    with Image.open(filepath) as img:
                        fmt = (getattr(img, 'format', '') or '').upper()
                        if fmt == 'GIF':
                            continue

                        # Auto-rotate smartphone photos
                        try:
                            img = ImageOps.exif_transpose(img)
                        except Exception:
                            pass

                        needs_resize = img.width > 1600 or img.height > 1600
                        if needs_resize:
                            img.thumbnail((1600, 1600), Image.Resampling.LANCZOS)

                        # Handle transparency
                        if img.mode in ('RGBA', 'LA'):
                            background = Image.new('RGB', img.size, (255, 255, 255))
                            background.paste(img, mask=img.split()[-1])
                            img = background
                        elif img.mode == 'P':
                            img = img.convert('RGBA')
                            background = Image.new('RGB', img.size, (255, 255, 255))
                            background.paste(img, mask=img.split()[-1])
                            img = background
                        elif img.mode != 'RGB':
                            img = img.convert('RGB')

                        # Save temporarily to compare size
                        temp_path = filepath + ".tmp_opt.jpg"
                        img.save(temp_path, format='JPEG', quality=82, optimize=True)

                    new_size = os.path.getsize(temp_path)
                    if new_size < orig_size:
                        # Replace original file with compressed version
                        os.replace(temp_path, filepath)
                        saved = orig_size - new_size
                        total_saved_bytes += saved
                        processed_count += 1
                        self.stdout.write(
                            self.style.SUCCESS(
                                f"  [Optimized] {file}: {orig_size // 1024} KB -> {new_size // 1024} KB (Saved {saved // 1024} KB)"
                            )
                        )
                    else:
                        if os.path.exists(temp_path):
                            os.remove(temp_path)
                except Exception as e:
                    error_count += 1
                    self.stdout.write(self.style.WARNING(f"  [Error] {file}: {e}"))

        saved_mb = total_saved_bytes / (1024 * 1024)
        self.stdout.write(
            self.style.SUCCESS(
                f"\nDone! Optimized {processed_count} images. Total bandwidth/storage saved: {saved_mb:.2f} MB. (Errors: {error_count})"
            )
        )
