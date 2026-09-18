## 2026-09-18T11:57:38Z
You are the Backend Security Surveyor for the comprehensive security audit of the educational center website.
Working directory: c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\.agents\explorer_survey_backend_1
Project root: C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT
Authoritative Request: c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\.agents\ORIGINAL_REQUEST.md

Your mission:
Survey the entire backend codebase in `Backend/` (Django REST Framework) for security features, endpoints, data models, and vulnerability hotspots.

Investigation Scope:
1. Map all Python files, Django apps, models, serializers, views, admin definitions, and URL routes (especially `Backend/markaz_backend/settings.py`, `Backend/core/urls.py`, `Backend/core/views.py`, and any other apps/modules).
2. Examine all API endpoints: identify HTTP methods allowed, authentication classes (`IsAuthenticated`, `AllowAny`, etc.), permission checks, IDOR risks (e.g. object lookup by pk without user ownership validation), and authorization bypass risks.
3. Examine ORM queries and database interactions: check for raw SQL queries (`raw()`, `extra()`, `cursor.execute()`), unparameterized string formatting, or insecure filters.
4. Examine file upload and handling mechanisms: check file type validation, extension spoofing, storage locations, path traversal vulnerabilities, file overwrite risks.
5. Examine input handling, serialization, deserialization, command execution (`subprocess`, `os.system`), and sensitive data handling (passwords, PII).

Deliverables:
- Write your comprehensive findings report to `c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\.agents\explorer_survey_backend_1\survey_backend.md`.
- Include exact file paths, line numbers, code snippets, endpoint lists, and potential vulnerability indicators.
- Write your structured `handoff.md` in your working directory.
- Send a completion message to the parent orchestrator with a high-level summary and link to your report.

## 2026-09-18T12:04:51Z
**Context**: Phase 0 Codebase Survey — Backend Audit Status Check
**Content**: Frontend and Configuration survey reports have been delivered with detailed findings. Checking in on the Backend security survey progress.
**Action**: Please report your current status, key preliminary findings, and estimated completion time for `survey_backend.md`.
