# Milestone 2 Changes Summary

## 1. PedagogueProject Multi-Image Upload & Admin Fix
- **File modified**: `Backend/core/admin.py`
  - Created `MultipleFileField(forms.FileField)` subclass that handles lists of files in `clean()` by calling `super().clean()` per file item instead of calling `to_python()` on a list object.
  - Updated `PedagogueProjectForm.images_upload` to use `MultipleFileField(required=False)`.
  - Updated `PedagogueProjectAdmin.save_model` to iterate through `request.FILES.getlist('images_upload')` and create `PedagogueProjectImage` instances.
  - Removed stray `save_model` override from `AppContentAdmin` (lines 523–529).

## 2. Misplaced ViewSet Actions & Database Cleanup
- **File modified**: `Backend/core/views.py`
  - Moved `@action` methods `add_images`, `toggle_active`, and `toggle_important` from `NewsCategoryViewSet` into `NewsViewSet`.
- **New File**: `Backend/core/management/commands/clean_orphaned_images.py`
  - Implemented Django management command `clean_orphaned_images`.
  - Executed `python manage.py clean_orphaned_images`, purging 8 orphaned DB records for missing image files (`NewsImage`, `GalleryItem`, `GalleryImage`).

## 3. Django Security Hardening
- **File modified**: `Backend/markaz_backend/settings.py`
  - Updated `SECRET_KEY` fallback to a secure key exceeding 50 characters.
  - Set `DEBUG = env('DEBUG', False, cast=bool)`.
  - Configured security deployment flags:
    - `SESSION_COOKIE_SECURE = True`
    - `CSRF_COOKIE_SECURE = True`
    - `SECURE_SSL_REDIRECT = env('SECURE_SSL_REDIRECT', not DEBUG, cast=bool)`
    - `SECURE_HSTS_SECONDS = 31536000`
    - `SECURE_HSTS_INCLUDE_SUBDOMAINS = True`
    - `SECURE_HSTS_PRELOAD = True`
    - `SECURE_CONTENT_TYPE_NOSNIFF = True`
    - `SECURE_BROWSER_XSS_FILTER = True`
    - `X_FRAME_OPTIONS = 'DENY'`
- **File modified**: `Backend/.env`
  - Configured secure `DJANGO_SECRET_KEY` and set `DEBUG=False`.
- **File modified**: `Backend/core/authentication.py`
  - Hardened `StaticAdminAuthentication` to return `None` in production (`DEBUG=False` without explicit `ALLOW_STATIC_ADMIN_AUTH`) and reject default weak tokens (`static-admin-token`, `1212`, etc.).
- **File modified**: `Backend/core/views.py`
  - Updated `is_static_admin_request()` to enforce identical security checks.

## 4. Verification Suite
- **New File**: `Backend/core/tests_milestone2.py`
  - Created unit tests covering form multi-file validation, admin image creation, viewset action placement, and static admin auth rejection.
- Verified `python manage.py check --deploy` passes with `System check identified no issues (0 silenced).`
