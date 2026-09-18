# Original User Request

## 2026-07-23T16:25:21Z

Audit and fix the Django Admin Panel functionality, image upload mechanisms, and perform security hardening ("Cyber Chief") on the backend configuration.

Working directory: c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT
Integrity mode: development

## Requirements

### R1. Admin Image Upload Fix and Verification
- Audit and fix the multiple image upload capability for `PedagogueProject` inside the Django Admin panel (ensure uploaded files using the `images_upload` field are correctly processed and saved as `PedagogueProjectImage` objects).
- Verify standard image upload works correctly for all other models: `Course` (covers), `News` (main image and inline images), `GalleryItem` (album covers), and `Teacher` (photos).

### R2. Django Admin Security Hardening (Cyber Chief)
- Run Django's deployment security check (`python manage.py check --deploy`) and fix any critical security issues.
- Audit admin credentials and ensure secure production configurations (e.g. CSRF trusted origins, secure cookie settings if applicable, password validation rules).

## Acceptance Criteria

### R1. Image Uploads
- [ ] Admin panel allows uploading multiple images at once for a PedagogueProject and links them correctly in the DB.
- [ ] Courses, news, and teachers can have their image files updated and saved successfully without DB/file errors.

### R2. Security
- [ ] Django deployment security check (`check --deploy`) passes without critical configuration failures.
- [ ] Admin credentials and settings conform to deployment guidelines.
