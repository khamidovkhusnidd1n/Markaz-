## 2026-09-18T11:57:38Z

You are the Configuration and Secrets Surveyor for the comprehensive security audit of the educational center website.
Working directory: c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\.agents\explorer_survey_config_1
Project root: C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT
Authoritative Request: c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\.agents\ORIGINAL_REQUEST.md

Your mission:
Survey all configurations, environment settings, secrets, dependencies, and infrastructure settings across both Backend and Frontend.

Investigation Scope:
1. Audit `Backend/markaz_backend/settings.py` and any other config files: `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `CSRF_TRUSTED_ORIGINS`, `CORS_ALLOWED_ORIGINS`, `CORS_ALLOW_ALL_ORIGINS`, `INSTALLED_APPS`, `MIDDLEWARE`.
2. Audit cookie security settings: `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, `SESSION_COOKIE_HTTPONLY`, `CSRF_COOKIE_HTTPONLY`, `SESSION_COOKIE_SAMESITE`, `CSRF_COOKIE_SAMESITE`.
3. Audit SSL/HTTPS enforcement settings: `SECURE_SSL_REDIRECT`, `SECURE_HSTS_SECONDS`, `SECURE_HSTS_INCLUDE_SUBDOMAINS`, `SECURE_HSTS_PRELOAD`, `SECURE_BROWSER_XSS_FILTER`, `SECURE_CONTENT_TYPE_NOSNIFF`, `X_FRAME_OPTIONS`.
4. Scan for hardcoded secrets, passwords, credentials, tokens, or private keys across the entire repository (including commit history or local `.env*` files, SQLite databases, backup files, migrations).
5. Audit dependency manifests: `Backend/requirements.txt`, `frontend/package.json`, checking for known vulnerable packages, outdated dependencies, or missing security libraries.
6. Evaluate authentication & session mechanisms (JWT settings, token expiration, signing algorithms).

Deliverables:
- Write your comprehensive findings report to `c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\.agents\explorer_survey_config_1\survey_config.md`.
- Include exact file paths, line numbers, configuration values, and identified security gaps.
- Write your structured `handoff.md` in your working directory.
- Send a completion message to the parent orchestrator with a high-level summary and link to your report.
