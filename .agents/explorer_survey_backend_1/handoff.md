# Handoff Report: Backend Security Survey

**Auditor**: Backend Security Surveyor (`explorer_survey_backend_1`)  
**Target**: `Backend/` (Django REST Framework)  
**Date**: 2026-09-18T12:05:00Z  
**Primary Deliverable**: `C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\.agents\explorer_survey_backend_1\survey_backend.md`

---

## 1. Observation

Direct observations from codebase inspection, empirical verification, and tool execution:

1. **Unauthenticated Access to Citizen Appeals & Applications**:
   - In `Backend/core/views.py:787-807`:
     - `AppealViewSet` and `ApplicationViewSet` specify `get_permissions()` returning `AllowAny()` for `create` and `[IsAdminOrReadOnly()]` for all other actions.
     - `IsAdminOrReadOnly` in `core/views.py:54-60` grants access if `request.method in permissions.SAFE_METHODS` (`GET`, `HEAD`, `OPTIONS`).
     - Neither `AppealViewSet` nor `ApplicationViewSet` implements `get_queryset()`.
     - Direct empirical test: Executing `GET /api/appeals/` unauthenticated returned `HTTP 200 OK` with 4 citizen appeals including `full_name`, `phone`, `email`, `telegram_link`, `description`, `status`, and `admin_note`.
     - Direct empirical test: Executing `GET /api/applications/` unauthenticated returned `HTTP 200 OK` with 3 application records including personal phone numbers, workplaces, and internal notes.

2. **Mass PII Dump in `/api/all-data/` & `/api/listeners/`**:
   - In `Backend/core/views.py:870-874`:
     - `get_all_data` queries `Listener.objects.all().order_by('-created_at')` and serializes every record without any admin or authentication check.
     - Direct empirical test: `GET /api/all-data/` unauthenticated returned `HTTP 200 OK` containing an array of all 1,618 student records with full names, certificate/diploma numbers, workplaces, and course types.
     - In `Backend/core/views.py:268-294`: `ListenerViewSet` uses `IsAdminOrReadOnly`, permitting full unauthenticated listing via `GET /api/listeners/` (1,618 records).

3. **Mass Assignment / Over-Posting**:
   - In `Backend/core/serializers.py:401-425`:
     - `AppealSerializer` defines `fields = ['id', 'full_name', 'appeal_type', 'appeal_type_display', 'description', 'phone', 'email', 'telegram_link', 'status', 'status_display', 'admin_note', 'created_at', 'updated_at']` and `read_only_fields = ['id', 'created_at', 'updated_at']`.
     - `status` and `admin_note` are not read-only.
     - `ApplicationSerializer` identically omits `status` and `admin_note` from `read_only_fields`.

4. **Static Admin Authentication Backdoor**:
   - In `Backend/core/authentication.py:7-33` and `Backend/core/views.py:934-971`:
     - `StaticAdminAuthentication` accepts `Authorization: Bearer <STATIC_ADMIN_TOKEN>` and fabricates a `SimpleNamespace` user with `is_staff=True`.
     - `custom_login` checks `username == settings.STATIC_ADMIN_USERNAME and password == settings.STATIC_ADMIN_PASSWORD` without verifying `DEBUG` or `ALLOW_STATIC_ADMIN_AUTH`, returning the static token.
     - `.env` contains: `STATIC_ADMIN_USERNAME=admin`, `STATIC_ADMIN_PASSWORD=UzbaMarkaz_2026_Secure!`, `STATIC_ADMIN_TOKEN=uzbamarkaz-secure-token-9f8a7b6c5d4e3f2a1`.
     - `.env.example` contains: `STATIC_ADMIN_USERNAME=admin`, `STATIC_ADMIN_PASSWORD=1212`, `STATIC_ADMIN_TOKEN=static-admin-token`.

5. **Runtime Server Crash (500) on Post View Counter**:
   - In `Backend/core/views.py:998-1005`:
     - `increment_department_post_view` references `DepartmentPost.objects.get(pk=pk)`.
     - `DepartmentPost` is never imported in `core/views.py`.
     - Direct empirical test: Executing `POST /api/department-posts/1/view/` resulted in an unhandled `NameError: name 'DepartmentPost' is not defined`, yielding `HTTP 500`.

6. **Vote Manipulation & Anti-Automation Absence**:
   - In `Backend/core/views.py:83-95` & `1009-1016`:
     - Both `PedagogueProjectViewSet.vote` and `increment_project_vote` allow unauthenticated, unthrottled POST requests.
     - Counter update is non-atomic (`project.votes_count += 1; project.save()`), causing lost updates under concurrent voting.

7. **Insecure File Upload Handling**:
   - In `Backend/core/models.py:12-17`:
     - `generate_unique_filename` extracts extension using `filename.split('.')[-1]` without whitelist validation.
     - `Document.file` allows arbitrary file extensions (`.html`, `.svg`). Direct browser rendering from `/media/` leads to Stored XSS.
     - `ListenerViewSet.bulk_import` accepts arbitrary files and processes them via `pd.read_excel` without MIME/extension checks.

8. **Synchronous External HTTP Requests in `model.save()`**:
   - In `Backend/core/models.py:54, 1205, 1265, 1340, 1450, 1510`:
     - Models make synchronous `urllib.request.urlopen` calls to `https://translate.googleapis.com` with a 5-second timeout inside `save()`.

9. **Deployment & Settings Vulnerabilities**:
   - `python manage.py check --deploy` flagged 4 warnings:
     - `security.W008`: `SECURE_SSL_REDIRECT` is not True.
     - `security.W012`: `SESSION_COOKIE_SECURE` is not True.
     - `security.W016`: `CSRF_COOKIE_SECURE` is not True.
     - `security.W018`: `DEBUG` is True in deployment.
   - `SECRET_KEY` fallback in `settings.py:38` is hardcoded.
   - When `DEBUG=True`, `ALLOWED_HOSTS.append('*')` and `CORS_ALLOW_ALL_ORIGINS = True` with `CORS_ALLOW_CREDENTIALS = True`.
   - No rate limiting / throttling configured in `REST_FRAMEWORK`.

---

## 2. Logic Chain

1. **From View Definition to Information Disclosure**:
   `AppealViewSet` sets permissions to `IsAdminOrReadOnly` for read actions. DRF defines `GET` as a safe method. `IsAdminOrReadOnly.has_permission()` explicitly returns `True` for safe methods. Because no `get_queryset()` override exists to filter records by `request.user.is_staff`, DRF evaluates the base queryset `Appeal.objects.all()`. Consequently, any unauthenticated client can retrieve all private citizen appeals and applications.

2. **From Serializer Definition to Privilege Escalation / Mass Assignment**:
   `AppealSerializer` and `ApplicationSerializer` expose `status` and `admin_note` in `fields` but fail to register them in `read_only_fields`. When an anonymous client POSTs JSON with `"status": "resolved"`, DRF's validation treats it as valid writable input and commits it to the database, allowing attackers to mark appeals resolved and forge administrative resolutions.

3. **From Static Admin Configuration to Account Takeover**:
   `StaticAdminAuthentication` intercepts requests and grants staff rights if the header matches `Bearer <STATIC_ADMIN_TOKEN>`. Because `custom_login` grants this token upon receiving credentials matching `.env` without verifying `DEBUG` mode, hardcoded or default credentials (`admin:1212` or `admin:UzbaMarkaz_2026_Secure!`) yield full administrative access.

4. **From Missing Import to Denial of Service**:
   `increment_department_post_view` was authored using `DepartmentPost` without importing the model from `.models`. In Python, referencing an unbound identifier raises a `NameError`. In DRF, uncaught exceptions bubble up to `HTTP 500 Internal Server Error`.

---

## 3. Caveats

1. **No Out-of-Band Network Access for Live SSRF Verification**: Verification of outbound Google Translate calls was performed via code inspection and timeout analysis; active outbound calls to external Google servers were not tested during runtime to avoid external network dependencies.
2. **Read-Only Investigation**: No source code was modified during this survey. Proposed remediations are documented in `survey_backend.md`.
3. **Database State**: The existing SQLite database (`db.sqlite3`) contains real or sample listener data (1,618 records) and 4 superuser accounts (`sys_admin_prime`, `boborahim`, `Azmiddin`, `admin`). Password hashes for these users exist in the database and must be rotated prior to production deployment.

---

## 4. Conclusion

The backend has substantial functionality and clean DRF viewset structure, but exhibits severe authorization bypasses and PII exposures:
- **Immediate Critical Risks**: Unauthenticated endpoints leaking citizen appeals, course applications, and complete listener/student records.
- **Immediate High Risks**: Mass assignment on public forms allowing unauthenticated resolution status tampering, static admin authentication bypass, and total lack of rate limiting.
- **Deployment & Stability Risks**: Missing imports causing 500 errors, non-atomic vote counting race conditions, stored XSS via unrestricted file uploads, and synchronous external HTTP calls during model saves.

Detailed findings with code snippets and specific line-by-line remediation guides have been compiled into `survey_backend.md`.

---

## 5. Verification Method

To independently verify these findings, execute the following commands in `Backend/`:

1. **Verify Unauthenticated Appeals Leak**:
   ```powershell
   python -c "import django, os; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'markaz_backend.settings'); django.setup(); from rest_framework.test import APIRequestFactory; from core.views import AppealViewSet; rf = APIRequestFactory(); resp = AppealViewSet.as_view({'get': 'list'})(rf.get('/api/appeals/')); print('Status:', resp.status_code, 'Count:', resp.data.get('count'))"
   ```
   *Expected output: Status 200, Count > 0.*

2. **Verify All-Data Listener Dump**:
   ```powershell
   python -c "import django, os; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'markaz_backend.settings'); django.setup(); from rest_framework.test import APIRequestFactory; from core.views import get_all_data; rf = APIRequestFactory(); resp = get_all_data(rf.get('/api/all-data/')); print('Status:', resp.status_code, 'Listeners:', len(resp.data.get('listeners', [])))"
   ```
   *Expected output: Status 200, Listeners: 1618.*

3. **Verify DepartmentPost NameError Crash**:
   ```powershell
   python -c "import django, os; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'markaz_backend.settings'); django.setup(); from rest_framework.test import APIRequestFactory; from core.views import increment_department_post_view; rf = APIRequestFactory(); resp = increment_department_post_view(rf.post('/api/department-posts/1/view/'), pk=1); print('Status:', resp.status_code)"
   ```
   *Expected output: NameError: name 'DepartmentPost' is not defined.*

4. **Verify Deployment Checks**:
   ```powershell
   python manage.py check --deploy
   ```
   *Expected output: 4 security warnings (W008, W012, W016, W018).*

5. **Verify Existing Tests**:
   ```powershell
   python manage.py test core.tests_milestone2 core.tests_empirical_m3
   ```
   *Expected output: Ran 14 tests ... OK.*
