# BRIEFING — 2026-09-18T12:05:00Z

## Mission
Survey the entire backend codebase in `Backend/` (Django REST Framework) for security features, endpoints, data models, and vulnerability hotspots.

## 🔒 My Identity
- Archetype: explorer
- Roles: Backend Security Surveyor
- Working directory: C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\.agents\explorer_survey_backend_1
- Original parent: 2f890ee0-3477-48b9-80d6-3ae6acf05182
- Milestone: Backend Security Survey

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Produce structured reports in working directory (.agents/explorer_survey_backend_1/)
- No exploit generation or attack code execution; defensive security audit focus

## Current Parent
- Conversation ID: 2f890ee0-3477-48b9-80d6-3ae6acf05182
- Updated: 2026-09-18T12:04:51Z

## Investigation State
- **Explored paths**: `Backend/markaz_backend/settings.py`, `urls.py`, `Backend/core/models.py`, `views.py`, `serializers.py`, `urls.py`, `site_views.py`, `authentication.py`, `admin.py`, `signals.py`, `clean_orphaned_images.py`, `create_admin_role.py`, `.env`, `.env.example`, `requirements.txt`
- **Key findings**:
  1. Critical unauthenticated PII leakage on `/api/appeals/`, `/api/applications/`, and `/api/listeners/` due to `IsAdminOrReadOnly` returning True for SAFE_METHODS without queryset filtering.
  2. `/api/all-data/` unauthenticated dump of entire `Listener` table (1,618 records).
  3. Mass assignment / over-posting of `status` and `admin_note` on `POST /api/appeals/` and `POST /api/applications/`.
  4. Hardcoded static admin credentials and token in `core/authentication.py`, `settings.py`, and `custom_login`.
  5. Missing import causing `NameError` crash (500) on `/api/department-posts/<pk>/view/`.
  6. Unrestricted vote manipulation and non-atomic increments on `/api/projects/<pk>/vote/`.
  7. Missing file extension whitelist / MIME-type validation on file uploads; stored XSS risk.
  8. Synchronous external HTTP requests to Google Translate inside `model.save()`.
  9. Zero rate limiting / throttling configured across DRF.
  10. Deployment security warnings: `DEBUG=True`, `ALLOWED_HOSTS=['*']`, insecure cookies, hardcoded secret keys.
- **Unexplored areas**: None. Backend survey complete.

## Key Decisions Made
- Executed empirical verification of access control on `AppealViewSet`, `ApplicationViewSet`, `ListenerViewSet`, `get_all_data`, and `increment_department_post_view`.
- Delivered comprehensive report `survey_backend.md`.

## Artifact Index
- DISPATCH.md — Task dispatch logs
- survey_backend.md — Comprehensive backend security findings report
- handoff.md — Structured handoff report
