# Detailed Image Upload Investigation Report

**Project Root**: `c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT`  
**Target Models**: Course, News & NewsImage, GalleryItem & GalleryImage, Teacher (plus ArtGalleryItem)  
**Date**: 2026-07-23  

---

## 1. Overview & Architecture Summary

The backend uses standard Django `ImageField` models with a centralized upload path generator (`generate_unique_filename`) for storing image assets under `Backend/media/uploads/<model_name>/`.

### Key Configurations
- **MEDIA_URL**: `/media/`
- **MEDIA_ROOT**: `c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\Backend\media`
- **Development Media Serving**: `markaz_backend/urls.py` appends `static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)` when `settings.DEBUG == True`.
- **Upload Filename Generator**: Defined in `core/models.py`:
  ```python
  def generate_unique_filename(instance, filename):
      ext = filename.split('.')[-1]
      unique_name = f"{uuid.uuid4().hex}.{ext}"
      model_name = instance.__class__.__name__.lower()
      return os.path.join(f'uploads/{model_name}/', unique_name)
  ```

---

## 2. Detailed Model-by-Model Breakdown

### 2.1 Course (Covers)
- **Model Definition**: `core/models.py` (lines 420–480)
  - Field: `photo = models.ImageField(upload_to=generate_unique_filename, blank=True, null=True, verbose_name="Kurs rasmi")`
- **Subdirectory**: `media/uploads/course/`
- **Admin Configuration**: `core/admin.py` (lines 419–426) — `CourseAdmin`
- **Serializer**: `core/serializers.py` (lines 257–294) — `CourseSerializer`
  - Includes `photo` and `photo_url` (computed via `request.build_absolute_uri(obj.photo.url)`).
- **ViewSet**: `core/views.py` (lines 513–541) — `CourseViewSet` (`MultiPartParser`, `FormParser`, `JSONParser`).
- **Disk vs DB Check**: 12 `Course` records in DB; 12/12 physical photos exist on disk.

### 2.2 News & NewsImage (Main & Inline Images)
- **Model Definition**: `core/models.py` (lines 28–90)
  - `News` has no direct cover field; image attachments are stored via related model `NewsImage`.
  - Field: `NewsImage.image = models.ImageField(upload_to=generate_unique_filename, verbose_name="Rasm")`
  - Relationship: `news = ForeignKey(News, on_delete=models.CASCADE, related_name='images')`
- **Subdirectory**: `media/uploads/newsimage/`
- **Admin Configuration**: `core/admin.py` (lines 66–97) — `NewsAdmin` with `NewsImageInline` (`extra=3`, fields `['image', 'order']`).
- **Serializer**: `core/serializers.py` (lines 53–88) — `NewsSerializer` embeds `images` array (`NewsImageSerializer`) and fallback `image_url` pointing to the first image.
- **ViewSet**: `core/views.py` (lines 93–151) — `NewsViewSet` overrides `create()` to parse `request.FILES.getlist('images')` and `image_orders`.
- **Disk vs DB Check**: 6 `News` items, 11 `NewsImage` items.
  - ⚠️ **3 missing files on disk**: PKs 11, 12, 13 (`uploads/newsimage/044311b71f784e4c8fe8b28c90efa522.jpg`, `d02c99747e12410b8c9b3f05cf10571a.jpg`, `19e9828017cd4df5ab2da736f0975107.jpg`).

### 2.3 GalleryItem & GalleryImage (Album Covers & Gallery Photos)
- **Model Definition**: `core/models.py` (lines 124–154)
  - `GalleryItem.cover_image = models.ImageField(upload_to=generate_unique_filename, verbose_name="Muqova rasmi")`
  - `GalleryImage.image = models.ImageField(upload_to=generate_unique_filename, verbose_name="Rasm")` with `gallery = ForeignKey(GalleryItem, related_name='images')`
- **Subdirectory**: `media/uploads/galleryitem/` and `media/uploads/galleryimage/`
- **Admin Configuration**: `core/admin.py` (lines 99–128) — `GalleryItemAdmin` with `GalleryImageInline`.
- **Serializer**: `core/serializers.py` (lines 117–137) — `GalleryItemSerializer` includes `cover_image_url` and embedded `images`.
- **ViewSet**: `core/views.py` (lines 194–261) — `GalleryItemViewSet` handles multipart creation with `cover_image` and `images`.
- **Disk vs DB Check**:
  - `GalleryItem`: 2 records; ⚠️ **1 missing cover file on disk** (PK 3: `uploads/galleryitem/fa4d1c1fbe324a8490535cca5606068a.png`).
  - `GalleryImage`: 5 records; ⚠️ **4 missing image files on disk** (PKs 1, 2, 3, 4).

### 2.4 Teacher (Photos)
- **Model Definition**: `core/models.py` (lines 286–351)
  - Field: `photo = models.ImageField(upload_to=generate_unique_filename, blank=True, null=True, verbose_name="Rasm")`
- **Subdirectory**: `media/uploads/teacher/`
- **Admin Configuration**: `core/admin.py` (lines 358–385) — `TeacherAdmin`
- **Serializer**: `core/serializers.py` (lines 168–213) — `TeacherSerializer` includes `photo` and `photo_url`.
- **ViewSet**: `core/views.py` (lines 466–486) — `TeacherViewSet`
- **Disk vs DB Check**: 4 `Teacher` records in DB; 4/4 physical photos exist on disk.

---

## 3. Key Issues & Failure Modes Identified

| # | Severity | Category | Description |
|---|---|---|---|
| 1 | **CRITICAL** | Code Bug | **ViewSet Action Misplacement**: In `core/views.py` (lines 162–192), custom actions `add_images`, `toggle_active`, and `toggle_important` were placed on `NewsCategoryViewSet` instead of `NewsViewSet`. Calling `POST /api/news-categories/{id}/add_images/` crashes because `NewsCategory` lacks `images` relation or `is_important` field. |
| 2 | **HIGH** | Data Integrity | **Missing Files on Disk (Orphaned DB Records)**: 8 database records reference non-existent media files (3 `NewsImage`, 1 `GalleryItem`, 4 `GalleryImage`). Serializers generate URLs to these missing files, resulting in HTTP 404 errors on frontend image load. |
| 3 | **MEDIUM** | Storage / Leak | **No File Cleanup on Delete/Update**: Django default behavior does not remove file assets from disk when model instances are deleted or updated with new files, leading to media storage leaks. |
| 4 | **MEDIUM** | Performance / Security | **Missing Validation & Optimization**: No file size caps, extension/mime-type whitelists, or image resizing/compression (WebP conversion). Raw 10MB+ uploads are stored and served as-is. |
| 5 | **MEDIUM** | Environment | **Production Media Serving**: `markaz_backend/urls.py` only serves `/media/` under `DEBUG = True`. If production web server (Nginx/Apache) is not configured to alias `/media/`, all media requests fail with 404. |
| 6 | **LOW** | Edge Case | **Extension Splitting in `generate_unique_filename`**: `filename.split('.')[-1]` fails to handle dotless filenames properly and preserves original extension casing (e.g. `.JPG`). |

---

## 4. Verification & Findings Matrix

| Model | DB Records | Photo/Image Field | Upload Subdir | Files Present on Disk | Discrepancies |
|---|---|---|---|---|---|
| `Course` | 12 | `photo` | `uploads/course/` | 12 / 12 | None |
| `NewsImage` | 11 | `image` | `uploads/newsimage/` | 8 / 11 | 3 missing files on disk |
| `GalleryItem` | 2 | `cover_image` | `uploads/galleryitem/` | 1 / 2 | 1 missing cover file on disk |
| `GalleryImage` | 5 | `image` | `uploads/galleryimage/` | 1 / 5 | 4 missing image files on disk |
| `Teacher` | 4 | `photo` | `uploads/teacher/` | 4 / 4 | None |
| `ArtGalleryItem` | 1 | `image` | `uploads/artgalleryitem/` | 1 / 1 | None |

---

## 5. Recommended Remediation Plan

1. **Fix `views.py` ViewSet Decorators**:
   Move `add_images`, `toggle_active`, and `toggle_important` from `NewsCategoryViewSet` to `NewsViewSet`.
2. **Clean up Orphaned DB Records**:
   Run a management command or migration script to clear or fix broken media references where `os.path.exists(file.path)` is `False`.
3. **Implement File Deletion Signals or `django-cleanup`**:
   Add `post_delete` and `pre_save` signals (or integrate `django-cleanup`) to remove superseded/deleted files from disk.
4. **Add Image Validation and Compression**:
   Add serializer validators for file extension and max file size (e.g. 5MB), and optional Pillow thumbnailing/WebP optimization.
