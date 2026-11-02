import os
import logging
from io import BytesIO
from PIL import Image, ImageOps
from django.core.files.base import ContentFile

logger = logging.getLogger('core.images')


def compress_image(image_field_file, max_size=(1600, 1600), quality=82):
    """
    Compress and resize an image file for optimal web performance.
    Reduces 5-10MB smartphone/camera photos to ~150-250KB with no visible quality loss.
    Handles EXIF orientation and formats cleanly.
    """
    if not image_field_file:
        return image_field_file

    try:
        if hasattr(image_field_file, 'seek'):
            image_field_file.seek(0)

        img = Image.open(image_field_file)

        # Skip animations or special formats
        fmt = getattr(img, 'format', '') or ''
        if fmt.upper() in ('GIF', 'ICO'):
            if hasattr(image_field_file, 'seek'):
                image_field_file.seek(0)
            return image_field_file

        # Auto-rotate smartphone photos using EXIF orientation
        try:
            img = ImageOps.exif_transpose(img)
        except Exception:
            pass

        # Resize if larger than max_size
        if img.width > max_size[0] or img.height > max_size[1]:
            img.thumbnail(max_size, Image.Resampling.LANCZOS)

        # Handle alpha channel & convert to RGB for JPEG compression
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

        buffer = BytesIO()
        img.save(buffer, format='JPEG', quality=quality, optimize=True)
        buffer.seek(0)

        original_name = getattr(image_field_file, 'name', 'image.jpg') or 'image.jpg'
        base_name, _ = os.path.splitext(os.path.basename(original_name))
        new_name = f"{base_name}.jpg"

        return ContentFile(buffer.read(), name=new_name)
    except Exception as e:
        logger.warning("Image compression failed for %s: %s", getattr(image_field_file, 'name', 'file'), e)
        if hasattr(image_field_file, 'seek'):
            image_field_file.seek(0)
        return image_field_file
