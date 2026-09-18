import os
from django.core.management.base import BaseCommand
from django.apps import apps
from django.db import models
from core.models import NewsImage, GalleryItem, GalleryImage, PedagogueProjectImage


class Command(BaseCommand):
    help = 'Clean up orphaned image DB records where image files do not exist on disk.'

    def handle(self, *args, **options):
        self.stdout.write("Starting cleanup of orphaned DB image records...")
        deleted_count = 0

        # Purge missing NewsImages
        for item in NewsImage.objects.all():
            if not item.image or not os.path.exists(item.image.path):
                self.stdout.write(f"Deleting orphaned NewsImage ID {item.id}")
                item.delete()
                deleted_count += 1

        # Purge missing GalleryImages
        for item in GalleryImage.objects.all():
            if not item.image or not os.path.exists(item.image.path):
                self.stdout.write(f"Deleting orphaned GalleryImage ID {item.id}")
                item.delete()
                deleted_count += 1

        # Purge missing PedagogueProjectImages
        for item in PedagogueProjectImage.objects.all():
            if not item.image or not os.path.exists(item.image.path):
                self.stdout.write(f"Deleting orphaned PedagogueProjectImage ID {item.id}")
                item.delete()
                deleted_count += 1

        # Purge missing GalleryItems
        for item in GalleryItem.objects.all():
            has_valid_cover = item.cover_image and os.path.exists(item.cover_image.path)
            has_valid_images = item.images.exists()
            if not has_valid_cover and not has_valid_images:
                self.stdout.write(f"Deleting orphaned GalleryItem ID {item.id}")
                item.delete()
                deleted_count += 1
            elif not has_valid_cover:
                # If cover_image is missing, set first valid image as cover or clear cover_image
                first_img = item.images.first()
                if first_img and first_img.image and os.path.exists(first_img.image.path):
                    item.cover_image = first_img.image
                    item.save(update_fields=['cover_image'])
                    self.stdout.write(f"Updated GalleryItem ID {item.id} cover_image from inline image")
                else:
                    self.stdout.write(f"Deleting orphaned GalleryItem ID {item.id} (no valid images)")
                    item.delete()
                    deleted_count += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully cleaned up {deleted_count} orphaned records."))
