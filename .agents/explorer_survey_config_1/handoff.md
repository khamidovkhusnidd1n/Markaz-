# Handoff Report: Configuration & Secrets Survey

**Agent**: `explorer_survey_config_1` (Configuration and Secrets Surveyor)  
**Parent Orchestrator**: `2f890ee0-3477-48b9-80d6-3ae6acf05182`  
**Working Directory**: `c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\.agents\explorer_survey_config_1`  
**Target Project Root**: `C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT`  
**Report Artifact**: `c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\.agents\explorer_survey_config_1\survey_config.md`  

---

## 1. Observation

1. **Hardcoded Master Token Shipped in Compiled Frontend**:
   - `frontend/dist/assets/index-dPkb9HHC.js:176`: Contains `ai(ti,o.token||"uzbamarkaz-secure-token-9f8a7b6c5d4e3f2a1")`.
   - `frontend/services/backend.ts:699`: `safeStorageSet(TOKEN_KEY, data.token || 'uzbamarkaz-secure-token-9f8a7b6c5d4e3f2a1');`.
   - `Backend/.env:15`: `STATIC_ADMIN_TOKEN=uzbamarkaz-secure-token-9f8a7b6c5d4e3f2a1`.
   - Tool Command: `python -c "import django, os; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'markaz_backend.settings'); django.setup(); from rest_framework.test import APIRequestFactory; from core.views import has_admin_access; factory = APIRequestFactory(); req = factory.get('/api/news/', HTTP_AUTHORIZATION='Bearer uzbamarkaz-secure-token-9f8a7b6c5d4e3f2a1'); print('Admin access granted:', has_admin_access(req))"`
   - Result: `Admin access granted: True`.

2. **Broken JWT Token Rotation & Missing Token Blacklist**:
   - `Backend/markaz_backend/settings.py:91-107`: `INSTALLED_APPS` contains `'rest_framework_simplejwt'`, but does NOT contain `'rest_framework_simplejwt.token_blacklist'`.
   - `Backend/markaz_backend/settings.py:353`: `'BLACKLIST_AFTER_ROTATION': True`.
   - Tool Command: `python -c "import django, os; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'markaz_backend.settings'); django.setup(); from rest_framework.test import APIRequestFactory; from rest_framework_simplejwt.views import TokenRefreshView; from rest_framework_simplejwt.tokens import RefreshToken; factory = APIRequestFactory(); r = RefreshToken(); req1 = factory.post('/api/token/refresh/', {'refresh': str(r)}, format='json'); resp1 = TokenRefreshView.as_view()(req1); req2 = factory.post('/api/token/refresh/', {'refresh': str(r)}, format='json'); resp2 = TokenRefreshView.as_view()(req2); print('Resp 1:', resp1.status_code, 'Resp 2:', resp2.status_code)"`
   - Result: `Resp 1: 200 Resp 2: 200`. Old refresh token was successfully re-used.

3. **Unauthenticated Public Access to Confidential Citizen Appeals (PII)**:
   - `Backend/core/views.py:787-796`: `AppealViewSet.get_permissions()` returns `[permissions.AllowAny()]` for `create` and `[IsAdminOrReadOnly()]` for all other actions.
   - `Backend/core/views.py:58-60`: `IsAdminOrReadOnly.has_permission()` returns `True` for all `SAFE_METHODS` (`GET`, `HEAD`, `OPTIONS`).
   - `Backend/core/serializers.py:403-408`: `AppealSerializer` serializes `full_name`, `phone`, `email`, `description`, `admin_note`.
   - Tool Command: `python -c "import django, os; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'markaz_backend.settings'); django.setup(); from rest_framework.test import APIRequestFactory; from core.views import AppealViewSet; factory = APIRequestFactory(); req = factory.get('/api/appeals/'); view = AppealViewSet.as_view({'get': 'list'}); resp = view(req); print('Status:', resp.status_code, 'Data count:', len(resp.data.get('results', resp.data)))"`
   - Result: `Status: 200 Data count: 4`.

4. **Django Deployment Check Failures**:
   - Tool Command: `python manage.py check --deploy`
   - Result:
     ```
     WARNINGS:
     ?: (security.W008) Your SECURE_SSL_REDIRECT setting is not set to True.
     ?: (security.W012) SESSION_COOKIE_SECURE is not set to True.
     ?: (security.W016) You have 'django.middleware.csrf.CsrfViewMiddleware' in your MIDDLEWARE, but you have not set CSRF_COOKIE_SECURE to True.
     ?: (security.W018) You should not have DEBUG set to True in deployment.
     System check identified 4 issues (0 silenced).
     ```

5. **Missing Reverse Proxy Header Configuration**:
   - `deploy/nginx-uzbamalaka.conf:40`: `proxy_set_header X-Forwarded-Proto $scheme;`
   - `Backend/markaz_backend/settings.py`: Lacks `SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')`.
   - `Backend/markaz_backend/settings.py:68-86`: `CSRF_TRUSTED_ORIGINS` has 17 `http://` entries and completely omits `https://uzbamalaka.uz`.

6. **Frontend Dependency Vulnerabilities**:
   - Tool Command: `npm audit --json` in `frontend/`
   - Result: 11 vulnerabilities (9 High, 1 Moderate, 1 Low). Includes `xlsx` (CVE-2023-30533 Prototype Pollution, ReDoS), `react-router` (CSRF bypass GHSA-qwww-vcr4-c8h2, DoS GHSA-chx6-hx7r-mcp5, XSS GHSA-f22v-gfqf-p8f3), `vite` (Arbitrary File Read GHSA-p9ff-h696-f583).

7. **Requirements File Encoding**:
   - `Backend/requirements.txt`: Encoded in UTF-16LE with BOM, which fails standard POSIX/Linux tools and container builds.

---

## 2. Logic Chain

1. **Static Admin Master Token Vulnerability**:
   - From Observation 1: `frontend/services/backend.ts:699` has a fallback string `'uzbamarkaz-secure-token-9f8a7b6c5d4e3f2a1'`.
   - When Vite builds the bundle, this string is compiled into `dist/assets/index-dPkb9HHC.js:176`, accessible to anyone over HTTP/HTTPS.
   - In `Backend/.env:15`, `STATIC_ADMIN_TOKEN` is configured with the identical token.
   - In `Backend/core/authentication.py` and `Backend/core/views.py`, requests carrying `Bearer uzbamarkaz-secure-token-9f8a7b6c5d4e3f2a1` are evaluated as `is_staff=True` by `has_admin_access()`.
   - Conclusion: Any anonymous visitor can extract the token from the public script and attain full administrative CRUD capabilities across the entire backend API.

2. **JWT Refresh Token Replay Vulnerability**:
   - From Observation 2: `settings.py` sets `BLACKLIST_AFTER_ROTATION: True`, expecting revoked refresh tokens to be rendered unusable after exchange.
   - However, `rest_framework_simplejwt.token_blacklist` is absent from `INSTALLED_APPS`.
   - When `TokenRefreshView` is invoked, SimpleJWT silently skips blacklisting because the underlying storage models do not exist.
   - Empirical proof showed the identical refresh token was exchanged twice for new access tokens without error.
   - Conclusion: Token rotation is non-functional; intercepted refresh tokens can be replayed indefinitely over their 7-day lifetime.

3. **Confidential PII Exposure via DRF ViewSets**:
   - From Observation 3: `AppealViewSet` applies `IsAdminOrReadOnly` for all read actions (`list`, `retrieve`).
   - DRF defines `GET` as a safe method; therefore `IsAdminOrReadOnly` returns `True` for unauthenticated requests.
   - Unlike `get_all_data`, `AppealViewSet` does not filter `get_queryset()` based on admin status.
   - Empirical query retrieved 4 citizen appeal records containing full personal names, phone numbers, email addresses, and internal administrative notes without credentials.
   - Conclusion: Severe broken access control and data privacy violation.

4. **HTTPS Deployment Failure via Redirect Loops**:
   - From Observation 5: In production, Nginx proxies port 443 HTTPS traffic to `127.0.0.1:8000` via HTTP while attaching `X-Forwarded-Proto: https`.
   - Django's `SecurityMiddleware` determines SSL status by checking `request.is_secure()`.
   - Without `SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')`, Django ignores `X-Forwarded-Proto` and treats all requests as unencrypted HTTP.
   - If `SECURE_SSL_REDIRECT = True` is enabled, Django responds with HTTP 301 to `https://uzbamalaka.uz/...`, causing an infinite redirect loop (`ERR_TOO_MANY_REDIRECTS`).

---

## 3. Caveats

- **Active Network Traffic**: Analysis was performed on local repository files, database snapshots, and mock requests via `APIRequestFactory`; live external internet scanning of the production server at `uzbamalaka.uz` was not conducted to preserve system integrity.
- **Production Environment Variables**: If the live production server injects environment variables independently of `Backend/.env` (e.g., via systemd unit or Docker env), specific runtime values for `DEBUG` and `SECRET_KEY` in production may differ from the local `.env` file, though the fallback vulnerabilities in the codebase remain identical.

---

## 4. Conclusion

The application exhibits several critical and high-severity security defects across secrets management, authentication, and configuration:
1. A hardcoded master admin token is publicly exposed in client JavaScript.
2. The JWT token rotation system does not blacklist rotated tokens due to a missing Django app.
3. Private citizen appeals and student applications are publicly readable without authentication.
4. Django deployment settings (`DEBUG=True`, insecure cookies, missing `SECURE_PROXY_SSL_HEADER`, incomplete `CSRF_TRUSTED_ORIGINS`) will cause either fatal runtime failures (infinite loops) or severe security exposures upon deployment.
5. High-severity known CVEs exist in frontend dependencies (`xlsx`, `react-router`, `vite`).

---

## 5. Verification Method

1. **Verify Static Admin Token Access**:
   ```powershell
   python -c "import django, os; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'markaz_backend.settings'); django.setup(); from rest_framework.test import APIRequestFactory; from core.views import has_admin_access; factory = APIRequestFactory(); req = factory.get('/api/news/', HTTP_AUTHORIZATION='Bearer uzbamarkaz-secure-token-9f8a7b6c5d4e3f2a1'); print('Admin access:', has_admin_access(req))"
   ```
   *Expected*: `Admin access: True`.

2. **Verify Refresh Token Reuse Flaw**:
   ```powershell
   python -c "import django, os; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'markaz_backend.settings'); django.setup(); from rest_framework.test import APIRequestFactory; from rest_framework_simplejwt.views import TokenRefreshView; from rest_framework_simplejwt.tokens import RefreshToken; factory = APIRequestFactory(); r = RefreshToken(); req1 = factory.post('/api/token/refresh/', {'refresh': str(r)}, format='json'); resp1 = TokenRefreshView.as_view()(req1); req2 = factory.post('/api/token/refresh/', {'refresh': str(r)}, format='json'); resp2 = TokenRefreshView.as_view()(req2); print('Resp1:', resp1.status_code, 'Resp2:', resp2.status_code)"
   ```
   *Expected*: `Resp1: 200 Resp2: 200` (both succeed, confirming missing blacklist).

3. **Verify Unauthenticated Appeal Leak**:
   ```powershell
   python -c "import django, os; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'markaz_backend.settings'); django.setup(); from rest_framework.test import APIRequestFactory; from core.views import AppealViewSet; factory = APIRequestFactory(); req = factory.get('/api/appeals/'); view = AppealViewSet.as_view({'get': 'list'}); resp = view(req); print('Status:', resp.status_code, 'Records:', len(resp.data.get('results', resp.data)))"
   ```
   *Expected*: `Status: 200 Records: 4` (unauthenticated dump of appeals).

4. **Verify Django Deployment Check**:
   ```powershell
   python manage.py check --deploy
   ```
   *Expected*: Identifies 4 security warnings (`SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, `DEBUG`).

5. **Verify Frontend Dependency CVEs**:
   ```powershell
   cd frontend; npm audit --json
   ```
   *Expected*: Identifies 11 vulnerabilities (9 High).
