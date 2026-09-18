# Original User Request

## 2026-07-23T11:24:49Z

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

## 2026-09-18T11:55:56Z

Perform a comprehensive security audit of an educational center website built with Django REST Framework (backend) and React/Vite (frontend). The goal is to identify all security vulnerabilities, misconfigurations, and weaknesses before deploying to production. Produce a detailed security report with findings ranked by severity and actionable remediation steps.

Working directory: C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT
Integrity mode: development

Key paths:
- Backend: `Backend/` (Django REST Framework, SQLite DB)
- Frontend: `frontend/` (React + Vite + TypeScript)
- Django settings: `Backend/markaz_backend/settings.py`
- Django URLs: `Backend/core/urls.py`
- Frontend API service: `frontend/services/backend.ts`

## Requirements

### R1. Static Code Security Analysis
Analyze the full source code of both backend (Python/Django) and frontend (TypeScript/React) for security vulnerabilities including but not limited to: SQL injection, XSS (cross-site scripting), CSRF bypasses, insecure deserialization, command injection, path traversal, and insecure direct object references (IDOR).

### R2. Configuration & Secrets Audit
Review Django settings, environment configuration, CORS/CSRF settings, authentication mechanisms (JWT), and all project files for hardcoded secrets (SECRET_KEY, API keys, database credentials, admin passwords). Check for DEBUG mode, ALLOWED_HOSTS, secure cookie settings, and HTTPS enforcement readiness.

### R3. OWASP Top 10 Assessment
Systematically evaluate the application against the OWASP Top 10 (2021) categories: Broken Access Control, Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration, Vulnerable Components, Authentication Failures, Data Integrity Failures, Logging Failures, and SSRF.

### R4. Security Report with Remediation
Produce a structured markdown security report that lists every finding with: severity level (Critical/High/Medium/Low/Informational), affected file(s) and line numbers, description of the vulnerability, proof/evidence, and a concrete remediation recommendation with code examples where applicable.

## Acceptance Criteria

### Completeness
- [ ] All Python files in `Backend/` are analyzed for injection and access control flaws
- [ ] All TypeScript/TSX files in `frontend/` are analyzed for XSS and insecure data handling
- [ ] `Backend/markaz_backend/settings.py` is reviewed for every Django security setting
- [ ] All API endpoints in `Backend/core/urls.py` and `Backend/core/views.py` are checked for authentication and authorization

### Secrets Detection
- [ ] Report identifies any hardcoded passwords, SECRET_KEY values, or API keys in the codebase
- [ ] Report flags any credentials committed to version control

### OWASP Coverage
- [ ] Each of the 10 OWASP Top 10 (2021) categories is explicitly addressed in the report with a finding or a "not applicable/pass" status

### Report Quality
- [ ] Final report is saved as a markdown file in the working directory
- [ ] Every finding includes: severity, file path, line number(s), description, and remediation
- [ ] Findings are sorted by severity (Critical first)
- [ ] Report includes an executive summary with total counts per severity level
