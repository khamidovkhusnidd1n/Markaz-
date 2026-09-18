# Plan: Django Admin Image Upload Fix and Security Hardening

## Overview
This project aims to:
1. Fix the multiple image upload capability for `PedagogueProject` in Django Admin (ensuring uploaded files via `images_upload` are processed and saved as `PedagogueProjectImage` objects).
2. Verify standard image upload for `Course` (covers), `News` (main & inline images), `GalleryItem` (album covers), and `Teacher` (photos).
3. Perform Django Admin security hardening ("Cyber Chief"), running `python manage.py check --deploy`, fixing critical security issues, auditing admin credentials, and securing production configurations.

## Architecture & Scope
- **Backend Directory**: `c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\Backend`
- **Models Affected**: `PedagogueProject`, `PedagogueProjectImage`, `Course`, `News`, `GalleryItem`, `Teacher`
- **Admin Configuration**: Django Admin forms, inline admin classes, model save overrides, signal handlers, media upload handlers.
- **Security Check**: `python manage.py check --deploy`, settings audit (`settings.py`), CSRF trusted origins, session/cookie flags, password validation, secret key/debug mode checks.

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Exploration & Diagnostics | Inspect Django admin code (`admin.py`, models, forms) for image upload processing for `PedagogueProject` and standard image models. Run `python manage.py check --deploy` and check admin credentials/settings. | None | DONE |
| 2 | Implementation (Upload Fix & Security Hardening) | Implement fixes for `PedagogueProject` multi-image upload handling and any standard image upload issues. Resolve all critical security issues from `check --deploy`, secure admin settings and credentials. | M1 | DONE |
| 3 | Verification & Forensic Audit | Run unit/integration tests and automated/empirical checks for image upload and security settings. Run Forensic Integrity Auditor (`teamwork_preview_auditor`). | M2 | DONE |
| 4 | Final Handoff | Report findings and completion to Sentinel. | M3 | DONE |




## Detailed Tasks
- **M1 Exploration**:
  - Spawn 3 Explorers (`teamwork_preview_explorer`):
    - Explorer 1: Inspect `PedagogueProject`, `PedagogueProjectImage`, and related admin forms/models/views in `Backend/`.
    - Explorer 2: Inspect `Course`, `News`, `GalleryItem`, `Teacher` models & admin configurations for standard image handling.
    - Explorer 3: Run `python manage.py check --deploy` via worker/explorer script or check settings/credentials to identify security gaps.
- **M2 Implementation**:
  - Spawn Worker (`teamwork_preview_worker`):
    - Implement `PedagogueProject` multi-image upload handling in Django Admin (processing files from `images_upload` into `PedagogueProjectImage`).
    - Verify and fix any issues with image uploading for `Course`, `News`, `GalleryItem`, `Teacher`.
    - Address security recommendations from `check --deploy`, update settings (`CSRF_TRUSTED_ORIGINS`, `SECURE_` settings, password validators, secret key handling).
- **M3 Verification & Audit**:
  - Spawn Reviewer (`teamwork_preview_reviewer`) & Challenger (`teamwork_preview_challenger`): Code review, build/test execution, empirical validation of image creation and security check passing.
  - Spawn Forensic Auditor (`teamwork_preview_auditor`): Integrity verification.
- **M4 Handoff**:
  - Send completion report to Sentinel.
