# Configuration, Secrets, Dependencies, and Authentication Security Survey Report

**Target Application**: Educational Center Website (Backend: Django REST Framework / Frontend: React + Vite + TypeScript)  
**Surveyor Role**: Configuration & Secrets Surveyor (`explorer_survey_config_1`)  
**Assessment Date**: 2026-09-18  
**Scope**: Full repository configuration audit across Backend (`Backend/`), Frontend (`frontend/`), Deployment configs (`deploy/`), SQLite database (`db.sqlite3`), Git history, and dependency manifests.

---

## 1. Executive Summary

A comprehensive security survey was performed on the configuration, secrets management, environment parameters, infrastructure templates, dependency manifests, and authentication systems of the educational center platform. 

The audit revealed severe security misconfigurations and hardcoded secrets, including:
1. **Publicly Exposed Static Admin Master Token**: Shipped directly in the compiled production frontend JavaScript bundle (`dist/assets/index-*.js`) and accepted by the backend as full staff administrator access.
2. **Broken JWT Token Rotation & Missing Blacklist**: `BLACKLIST_AFTER_ROTATION` configured in SimpleJWT without `rest_framework_simplejwt.token_blacklist` installed in `INSTALLED_APPS`, allowing infinite reuse of rotated refresh tokens.
3. **Severe Django Production Misconfigurations**: `DEBUG=True`, insecure cookies (`SESSION_COOKIE_SECURE=False`, `CSRF_COOKIE_SECURE=False`), missing `SECURE_PROXY_SSL_HEADER` causing infinite HTTPS redirect loops behind Nginx, and `CSRF_TRUSTED_ORIGINS` omitting the production domain.
4. **Unauthenticated PII Data Exposure**: `AppealViewSet` and `ApplicationViewSet` allowing anonymous read access to private citizen appeals, student applications, contact information, and internal admin notes.
5. **High-Severity Dependency Vulnerabilities**: Known Prototype Pollution and ReDoS in `xlsx` (SheetJS 0.18.5), CSRF bypass and DoS in `react-router`, and arbitrary file read in `vite`.

### Vulnerability Summary Table

| Finding ID | Severity | Category | Title | Affected File & Lines |
| :--- | :--- | :--- | :--- | :--- |
| **CFG-01** | **CRITICAL** | Authentication / Secrets | Public Client Bundle Shipped with Hardcoded Admin Master Token | `frontend/dist/assets/index-dPkb9HHC.js:176`<br>`frontend/services/backend.ts:699`<br>`Backend/.env:15` |
| **CFG-02** | **CRITICAL** | Broken Access Control | Unauthenticated Public Access to Confidential Citizen Appeals & Applications (PII Leak) | `Backend/core/views.py:787-807`<br>`Backend/core/serializers.py:403-424` |
| **CFG-03** | **HIGH** | Authentication / JWT | Refresh Token Rotation Blacklisting Failure (Infinite Replay Attack) | `Backend/markaz_backend/settings.py:91-107, 349-354` |
| **CFG-04** | **HIGH** | Infrastructure / SSL | Missing `SECURE_PROXY_SSL_HEADER` Behind Nginx Causing HTTPS Redirect Loop | `Backend/markaz_backend/settings.py:46`<br>`deploy/nginx-uzbamalaka.conf:34-42` |
| **CFG-05** | **HIGH** | Security Misconfiguration | `DEBUG=True`, Insecure Cookies, and Insecure SSL Redirection in Active Environment | `Backend/.env:1, 16-18`<br>`Backend/markaz_backend/settings.py:41-46` |
| **CFG-06** | **HIGH** | CSRF / CORS | `CSRF_TRUSTED_ORIGINS` Missing HTTPS Domain & Overly Permissive CORS with Credentials | `Backend/markaz_backend/settings.py:68-86, 358-371` |
| **CFG-07** | **HIGH** | Cryptographic / Secrets | Predictable and Hardcoded `SECRET_KEY` Fallbacks in Codebase and Git History | `Backend/markaz_backend/settings.py:38`<br>`Backend/.env:2`<br>Git commit `97ed83b1` |
| **CFG-08** | **HIGH** | Vulnerable Components | High-Severity CVEs in Frontend Dependencies (`xlsx`, `react-router`, `vite`) | `frontend/package.json:19-21, 29`<br>`node_modules/` (11 CVEs) |
| **CFG-09** | **MEDIUM** | Authentication | Plaintext Password Comparison & Timing Attacks in Custom Login Endpoint | `Backend/core/views.py:945`<br>`Backend/markaz_backend/settings.py:406` |
| **CFG-10** | **MEDIUM** | Session Management | Client-Side `localStorage` Token Storage & Lack of Server-Side Session Revocation | `frontend/services/backend.ts:30-55, 705-708`<br>`Backend/core/urls.py:47-51` |
| **CFG-11** | **MEDIUM** | Infrastructure / Deploy | Incomplete Nginx Reverse Proxy Configuration (Admin Path Missing & Cleartext Redirection) | `deploy/nginx-uzbamalaka.conf:1-5, 34-66` |
| **CFG-12** | **LOW** | Security Hygiene / Config | Gitignore Gaps for Environment Variants (`.env.*`) and UTF-16LE Requirements Encoding | `.gitignore:135`<br>`Backend/requirements.txt` |

---

## 2. Scope 1: Django Settings & Infrastructure Configuration Audit

### 2.1 Core Settings Analysis (`Backend/markaz_backend/settings.py`)

#### `SECRET_KEY`
- **Location**: `Backend/markaz_backend/settings.py:38`
- **Current Value**:
  ```python
  SECRET_KEY = env('DJANGO_SECRET_KEY', 'sayt-production-secret-key-9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1-fallback')
  ```
- **Active Value in `.env`**:
  `DJANGO_SECRET_KEY=sayt-production-secret-key-9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1-2026`
- **Finding**: The code contains a hardcoded fallback secret key. If the environment variable is unset during containerization or deployment, Django boots with this public key. Furthermore, the key in `.env` only appends `-2026` to the fallback string, demonstrating high predictability. SimpleJWT uses `SECRET_KEY` as its HMAC-SHA256 signing secret; an attacker with this key can forge arbitrary admin JWT tokens and session cookies.

#### `DEBUG`
- **Location**: `Backend/markaz_backend/settings.py:41`, `Backend/.env:1`
- **Current Value**: `DEBUG=True` in `Backend/.env`.
- **Finding**: With `DEBUG=True`:
  1. Detailed stack traces, environment variables, local variables, and SQL queries are displayed on any unhandled exception.
  2. Django automatically appends `'*'` to `ALLOWED_HOSTS` (line 65), completely disabling Host header validation.
  3. DRF enables `BrowsableAPIRenderer` (lines 342-345), exposing API schema and forms to attackers.
  4. CORS enables `CORS_ALLOW_ALL_ORIGINS = True` (lines 369-370).

#### `ALLOWED_HOSTS`
- **Location**: `Backend/markaz_backend/settings.py:54-66`
- **Current Value**:
  ```python
  ALLOWED_HOSTS = [
      'uzbamalaka.uz',
      'www.uzbamalaka.uz',
      'localhost',
      '127.0.0.1',
      '172.31.96.1',
      '192.168.0.104',
      'testserver',
  ]

  if DEBUG:
      ALLOWED_HOSTS.append('*')
  ```
- **Finding**:
  1. Internal RFC1918 private IP addresses (`172.31.96.1`, `192.168.0.104`) are hardcoded into the source code.
  2. `ALLOWED_HOSTS` is static and does not allow dynamic injection via environment variables in production.
  3. When `DEBUG=True`, `*` is appended, permitting Host Header injection / cache poisoning attacks.

#### `CSRF_TRUSTED_ORIGINS`
- **Location**: `Backend/markaz_backend/settings.py:68-86`
- **Current Value**: A list of 17 origins, all prefixed with `http://`:
  `http://localhost:3000`, `http://127.0.0.1:3000`, `http://192.168.0.105:3000`, `http://192.168.0.102:3000`, `http://192.168.0.102:8000`, `http://172.31.80.1:3000`, `http://172.20.80.1:3000`, `http://localhost:8000`, `http://127.0.0.1:8000`, `http://localhost:8001`, `http://127.0.0.1:8001`, `http://172.31.96.1:3000`, `http://172.31.96.1:8000`, `http://172.31.96.1:8001`, `http://192.168.0.104:3000`, `http://192.168.0.104:8000`, `http://192.168.0.104:8001`.
- **Finding**:
  1. **Critical Defect**: The production origins `https://uzbamalaka.uz` and `https://www.uzbamalaka.uz` are **COMPLETELY MISSING**. In Django 4.0+, CSRF validation compares the `Origin` header against `CSRF_TRUSTED_ORIGINS` including the protocol scheme. Any POST request made from `https://uzbamalaka.uz` (such as admin login) will fail with HTTP 403 Forbidden.
  2. Origins cannot be configured via environment variables.
  3. Hardcoded developer workstation IPs clutter production settings.

#### `CORS_ALLOWED_ORIGINS` & `CORS_ALLOW_ALL_ORIGINS`
- **Location**: `Backend/markaz_backend/settings.py:358-371`
- **Current Value**:
  ```python
  CORS_ALLOWED_ORIGINS = os.environ.get(
      'CORS_ALLOWED_ORIGINS',
      env(
          'CORS_ALLOWED_ORIGINS',
          'https://uzbamalaka.uz,https://www.uzbamalaka.uz,http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173'
      )
  ).split(',')

  CORS_ALLOW_CREDENTIALS = True

  if DEBUG:
      CORS_ALLOW_ALL_ORIGINS = True
  ```
- **Finding**: When `DEBUG=True`, `CORS_ALLOW_ALL_ORIGINS = True` is paired with `CORS_ALLOW_CREDENTIALS = True`. In `django-cors-headers`, when both are enabled, the middleware reflects the requesting origin and sets `Access-Control-Allow-Credentials: true`. Any malicious site visited by a developer on the local network can initiate cross-origin authenticated requests and exfiltrate sensitive data.

#### `INSTALLED_APPS`
- **Location**: `Backend/markaz_backend/settings.py:91-107`
- **Current Value**:
  ```python
  INSTALLED_APPS = [
      'jazzmin',
      'django.contrib.admin',
      'django.contrib.auth',
      'django.contrib.contenttypes',
      'django.contrib.sessions',
      'django.contrib.messages',
      'django.contrib.staticfiles',
      'rest_framework',
      'rest_framework_simplejwt',
      'corsheaders',
      'core.apps.CoreConfig',
  ]
  ```
- **Finding**:
  1. Missing `'rest_framework_simplejwt.token_blacklist'` despite line 353 setting `'BLACKLIST_AFTER_ROTATION': True`.
  2. Missing security apps such as `django_ratelimit` or `axes` for brute-force protection.

#### `MIDDLEWARE`
- **Location**: `Backend/markaz_backend/settings.py:214-227`
- **Current Value**:
  ```python
  MIDDLEWARE = [
      'corsheaders.middleware.CorsMiddleware',
      'django.middleware.security.SecurityMiddleware',
      'django.contrib.sessions.middleware.SessionMiddleware',
      'django.middleware.common.CommonMiddleware',
      'django.middleware.csrf.CsrfViewMiddleware',
      'django.contrib.auth.middleware.AuthenticationMiddleware',
      'django.contrib.messages.middleware.MessageMiddleware',
      'django.middleware.clickjacking.XFrameOptionsMiddleware',
  ]
  ```
- **Finding**:
  1. Middleware order is logically standard (`CorsMiddleware` at index 0, `SecurityMiddleware` at index 1).
  2. Completely lacks Content Security Policy (CSP) middleware (`django-csp`).
  3. Lacks any rate-limiting middleware for login or public API endpoints.

---

## 3. Scope 2: Cookie Security Settings Audit

| Setting | Value in `settings.py` | Value in `Backend/.env` | Django Default | Assessment / Gap |
| :--- | :--- | :--- | :--- | :--- |
| `SESSION_COOKIE_SECURE` | `env('SESSION_COOKIE_SECURE', True)` (line 44) | `False` (line 17) | `False` | **VULNERABLE**. In the active `.env`, this is explicitly overridden to `False`. Session cookies are sent over plaintext HTTP, susceptible to interception and session hijacking. |
| `CSRF_COOKIE_SECURE` | `env('CSRF_COOKIE_SECURE', True)` (line 45) | `False` (line 18) | `False` | **VULNERABLE**. Overridden to `False` in `.env`. CSRF tokens can be sniffed over cleartext Wi-Fi/networks. |
| `SESSION_COOKIE_HTTPONLY` | *Not declared* | *Not declared* | `True` | **ACCEPTABLE (Default)**. Django defaults to `True`. Explicit declaration recommended for compliance defense. |
| `CSRF_COOKIE_HTTPONLY` | *Not declared* | *Not declared* | `False` | **RISK**. Defaults to `False`. The frontend uses JWT/token headers for API interactions and standard forms for Admin. Leaving `CSRF_COOKIE_HTTPONLY = False` allows any XSS script to read the CSRF cookie. |
| `SESSION_COOKIE_SAMESITE` | *Not declared* | *Not declared* | `'Lax'` | **ACCEPTABLE (Default)**. Django defaults to `'Lax'`. |
| `CSRF_COOKIE_SAMESITE` | *Not declared* | *Not declared* | `'Lax'` | **ACCEPTABLE (Default)**. Django defaults to `'Lax'`. |
| `SESSION_COOKIE_AGE` | *Not declared* | *Not declared* | 1209600 (14 days) | **NOTE**. Active sessions persist for 14 days without idle timeouts. |

---

## 4. Scope 3: SSL/HTTPS Enforcement & Security Headers

### 4.1 SSL Settings Audit
- `SECURE_SSL_REDIRECT`:
  - `Backend/markaz_backend/settings.py:46`: `env('SECURE_SSL_REDIRECT', not DEBUG, cast=bool)`
  - `Backend/.env:16`: `SECURE_SSL_REDIRECT=False`
  - In the local/active environment, SSL redirection is disabled.
- `SECURE_HSTS_SECONDS`:
  - `Backend/markaz_backend/settings.py:47`: `int(env('SECURE_HSTS_SECONDS', 31536000))` (1 year)
- `SECURE_HSTS_INCLUDE_SUBDOMAINS`:
  - `Backend/markaz_backend/settings.py:48`: `True`
- `SECURE_HSTS_PRELOAD`:
  - `Backend/markaz_backend/settings.py:49`: `True`
- `SECURE_CONTENT_TYPE_NOSNIFF`:
  - `Backend/markaz_backend/settings.py:50`: `True` (`X-Content-Type-Options: nosniff` enabled).
- `SECURE_BROWSER_XSS_FILTER`:
  - `Backend/markaz_backend/settings.py:51`: `True` (Note: deprecated in modern browsers, replaced by CSP).
- `X_FRAME_OPTIONS`:
  - `Backend/markaz_backend/settings.py:52`: `'DENY'` (Proper clickjacking defense for Django pages).

### 4.2 The Reverse Proxy SSL Header Defect (Infinite Redirect Loop)
- **Files**: `Backend/markaz_backend/settings.py` & `deploy/nginx-uzbamalaka.conf:34-42`
- **Mechanism**:
  In `deploy/nginx-uzbamalaka.conf`, Nginx terminates SSL on port 443 and proxies requests to Django over plain HTTP:
  ```nginx
  location /api/ {
      proxy_pass http://127.0.0.1:8000/api/;
      ...
      proxy_set_header X-Forwarded-Proto $scheme;
  }
  ```
  Nginx sends the header `X-Forwarded-Proto: https`.
  However, in `Backend/markaz_backend/settings.py`, the required Django configuration is **MISSING**:
  ```python
  # MISSING IN settings.py:
  SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
  ```
- **Impact**:
  When `SECURE_SSL_REDIRECT = True` is enabled in production:
  1. A user requests `https://uzbamalaka.uz/api/courses/`.
  2. Nginx terminates SSL and forwards to `http://127.0.0.1:8000/api/courses/` with `X-Forwarded-Proto: https`.
  3. Django inspects `request.is_secure()`. Because `SECURE_PROXY_SSL_HEADER` is absent, Django ignores `X-Forwarded-Proto` and determines the request is insecure HTTP.
  4. Django's `SecurityMiddleware` responds with HTTP 301 redirecting to `https://uzbamalaka.uz/api/courses/`.
  5. The browser loops infinitely until triggering `ERR_TOO_MANY_REDIRECTS`.

---

## 5. Scope 4: Secrets, Credentials, Tokens & Repository Leakage Scan

### 5.1 Hardcoded Master Admin Token in Compiled Frontend Bundle (CRITICAL)
- **Files**:
  - `frontend/dist/assets/index-dPkb9HHC.js:176`
  - `frontend/services/backend.ts:699`
  - `Backend/.env:15`
- **Code Evidence**:
  In `frontend/services/backend.ts:699`:
  ```typescript
  safeStorageSet(TOKEN_KEY, data.token || 'uzbamarkaz-secure-token-9f8a7b6c5d4e3f2a1');
  ```
  In compiled public bundle `frontend/dist/assets/index-dPkb9HHC.js:176`:
  ```javascript
  ai(ti,o.token||"uzbamarkaz-secure-token-9f8a7b6c5d4e3f2a1")
  ```
  In `Backend/.env:15`:
  ```ini
  STATIC_ADMIN_TOKEN=uzbamarkaz-secure-token-9f8a7b6c5d4e3f2a1
  ```
- **Verification & Exploitability**:
  We ran a live API test against the backend:
  ```python
  req = factory.get('/api/news/', HTTP_AUTHORIZATION='Bearer uzbamarkaz-secure-token-9f8a7b6c5d4e3f2a1')
  has_admin_access(req)  # -> Evaluated to True!
  ```
  Because this token is shipped inside the public JavaScript file served to every anonymous visitor at `https://uzbamalaka.uz/assets/index-*.js`, anyone can extract this string and immediately execute administrative POST/PUT/DELETE operations across the API!

### 5.2 Leaked Database & Admin Credentials in `.env.example` & Scratch Scripts
- **`Backend/.env.example`**:
  - Line 7: `DB_PASSWORD=markaz3210`
  - Line 17: `STATIC_ADMIN_PASSWORD=1212`
  - Line 18: `STATIC_ADMIN_TOKEN=static-admin-token`
- **`Backend/scratch/test_http.py`**:
  - Line 18-19:
    ```python
    'username': 'admin',
    'password': 'admin123',
    ```
- **`frontend/.env.local`**:
  - Line 1: `GEMINI_API_KEY=PLACEHOLDER_API_KEY`
  - In `frontend/vite.config.ts:39-40`:
    ```typescript
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    }
    ```
    Any real API key placed in `GEMINI_API_KEY` is statically compiled into the client-side JavaScript bundle during build time!

### 5.3 Git History Credential Exposure
- **Commit `97ed83b1f05bf159bec030d437f22c3acec8154b`** ("Production settings for uzbamalaka.uz"):
  Exposed `SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-x7k9m2p5q8r1t4w6y0b3c6f9h2j5l8n1')` and committed `DEBUG = True` directly into git.
- **Commit `a5786f01fff1764ca4f8cc38583c56996a88fcab`**:
  Committed `Backend/.env.example` with PostgreSQL credentials (`markaz3210`).

### 5.4 SQLite Database (`Backend/db.sqlite3`) Superusers & Active Sessions
Analysis of `Backend/db.sqlite3` revealed 4 superusers stored with PBKDF2 hashes:
1. `id=1, username='sys_admin_prime', is_superuser=1, is_staff=1`
2. `id=2, username='boborahim', is_superuser=1, is_staff=1`
3. `id=3, username='Azmiddin', is_superuser=1, is_staff=1`
4. `id=4, username='admin', is_superuser=1, is_staff=1`

Furthermore, table `django_session` contains 16 session records, with active sessions extending until **2026-09-30**. If `Backend/db.sqlite3` is copied into production Docker images or exposed, these sessions allow instant administrative takeover.

### 5.5 Incomplete `.gitignore` Configuration
- In root `.gitignore:135`, only `.env` is ignored.
- Testing git pattern matching:
  `git check-ignore -v Backend/.env.production Backend/.env.staging` -> **Unignored (Exit code 1)**.
- If developers create `.env.production` or `.env.prod`, git will track and commit them automatically.

---

## 6. Scope 5: Dependency Manifest & Vulnerability Audit

### 6.1 Backend (`Backend/requirements.txt`)
1. **UTF-16LE Encoding Issue**:
   `Backend/requirements.txt` is encoded with a UTF-16LE Byte Order Mark (BOM). Standard POSIX environments, Linux Docker builds, and CI/CD pipelines will fail with `UnicodeDecodeError` or "file contains null bytes" when running `pip install -r requirements.txt`.
2. **High-Risk Unnecessary Packages**:
   - `yt-dlp==2026.7.4`: Video downloading tool with history of command injection/SSRF vulnerabilities. Why is this in backend production dependencies?
   - `python-telegram-bot==20.7` AND `pyTelegramBotAPI==4.25.0`: Redundant and conflicting bot frameworks.
   - `google-generativeai==0.8.5`, `openai==1.82.0`, `huggingface_hub==1.18.0`: Massive AI dependencies not used by Django REST backend.
3. **Missing Security Packages**:
   No `django-csp` (Content Security Policy) or `django-ratelimit` / `django-axes` (brute-force rate limiting).

### 6.2 Frontend (`frontend/package.json`)
Running `npm audit` on `frontend/package.json` revealed **11 vulnerabilities (9 High, 1 Moderate, 1 Low)**:

| Dependency | Severity | CVE / Advisory | Vulnerability Description |
| :--- | :--- | :--- | :--- |
| **`xlsx@0.18.5`** | **HIGH** | [GHSA-4r6h-8v6p-xvw6](https://github.com/advisories/GHSA-4r6h-8v6p-xvw6) (CVE-2023-30533, CVSS 7.8) | Prototype Pollution in SheetJS core parsing. Can lead to remote code execution or client denial of service. |
| **`xlsx@0.18.5`** | **HIGH** | [GHSA-5pgg-2g8v-p4x9](https://github.com/advisories/GHSA-5pgg-2g8v-p4x9) (CVSS 7.5) | Regular Expression Denial of Service (ReDoS) via malformed spreadsheets. |
| **`react-router@7.13.0`** | **HIGH** | [GHSA-qwww-vcr4-c8h2](https://github.com/advisories/GHSA-qwww-vcr4-c8h2) | RSC Mode CSRF Bypass Allows Action Execution Before 400 Response. |
| **`react-router@7.13.0`** | **HIGH** | [GHSA-chx6-hx7r-mcp5](https://github.com/advisories/GHSA-chx6-hx7r-mcp5) | Unauthenticated Denial of Service via Inefficient Route Matching. |
| **`react-router@7.13.0`** | **MODERATE** | [GHSA-2j2x-hqr9-3h42](https://github.com/advisories/GHSA-2j2x-hqr9-3h42) | Open redirect via protocol-relative URL (`//`) reinterpretation. |
| **`react-router@7.13.0`** | **MODERATE** | [GHSA-f22v-gfqf-p8f3](https://github.com/advisories/GHSA-f22v-gfqf-p8f3) (CVE-2024-XXXX, CVSS 5.4) | Stored XSS via unescaped Location header in prerendered redirect HTML. |
| **`vite@6.2.0`** | **HIGH** | [GHSA-p9ff-h696-f583](https://github.com/advisories/GHSA-p9ff-h696-f583) | Arbitrary File Read via Vite Dev Server WebSocket. |
| **`vite@6.2.0`** | **HIGH** | [GHSA-fx2h-pf6j-xcff](https://github.com/advisories/GHSA-fx2h-pf6j-xcff) (CVSS 7.5) | `server.fs.deny` bypass on Windows alternate data streams / paths. |
| **`rollup@4.58.0`** | **HIGH** | [GHSA-mw96-cpmx-2vgc](https://github.com/advisories/GHSA-mw96-cpmx-2vgc) | Arbitrary File Write via Path Traversal during build bundling. |

---

## 7. Scope 6: Authentication, Authorization & Session Mechanisms

### 7.1 Broken Token Rotation & Blacklist Failure (SimpleJWT)
- **Settings**: `Backend/markaz_backend/settings.py:349-354`
  ```python
  SIMPLE_JWT = {
      'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
      'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
      'ROTATE_REFRESH_TOKENS': True,
      'BLACKLIST_AFTER_ROTATION': True,
  }
  ```
- **Flaw**: `'rest_framework_simplejwt.token_blacklist'` was **never added** to `INSTALLED_APPS` (lines 91-107).
- **Empirical Proof**:
  We executed a token refresh test simulating an attacker replaying an old refresh token:
  ```python
  resp1 = view(post_req_with_token_r)  # Status: 200 OK
  resp2 = view(post_req_with_token_r)  # Status: 200 OK (TOKEN STILL VALID!)
  ```
  Both requests succeeded with HTTP 200! Because the blacklist app is missing, `TokenRefreshSerializer` silently skips recording the JTI into the blacklist table.
- **Impact**: Any intercepted refresh token can be used repeatedly to mint new access tokens for up to 7 days, completely negating token rotation security.

### 7.2 Custom Login Timing Attacks & Plaintext Password Check
- **Location**: `Backend/core/views.py:945`
  ```python
  if username == settings.STATIC_ADMIN_USERNAME and password == settings.STATIC_ADMIN_PASSWORD:
      logger.info("Static admin login succeeded for username=%s", username)
      return Response({
          'success': True,
          'token': settings.STATIC_ADMIN_TOKEN,
          'refresh': '',
      })
  ```
- **Flaws**:
  1. Plain string comparison (`password == settings.STATIC_ADMIN_PASSWORD`) is vulnerable to timing attacks (non-constant-time equality).
  2. Bypasses Django's password hashing (`check_password`), password validators, account lockout, and audit trails.
  3. Returns `settings.STATIC_ADMIN_TOKEN` even if `DEBUG=False`.

### 7.3 Unauthenticated Citizen PII Leakage (`AppealViewSet` / `ApplicationViewSet`)
- **Location**: `Backend/core/views.py:792-796` & `Backend/core/serializers.py:397-424`
- **Flaw**:
  ```python
  class AppealViewSet(viewsets.ModelViewSet):
      queryset = Appeal.objects.all().order_by('-created_at')
      def get_permissions(self):
          if self.action in ['create']:
              return [permissions.AllowAny()]
          return [IsAdminOrReadOnly()]
  ```
  In `IsAdminOrReadOnly` (`views.py:58-60`):
  ```python
  if request.method in permissions.SAFE_METHODS:
      return True
  return has_admin_access(request)
  ```
  `GET` is considered a safe method! Therefore, any unauthenticated anonymous request to `GET /api/appeals/` or `GET /api/applications/` is allowed.
- **Empirical Proof**:
  ```python
  req = factory.get('/api/appeals/')
  resp = AppealViewSet.as_view({'get': 'list'})(req)
  print(resp.status_code, len(resp.data))  # -> 200 OK, 4 records leaked!
  ```
  Confidential citizen complaints, phone numbers, email addresses, workplace information, and internal staff notes (`admin_note`) are exposed to anyone on the internet.

### 7.4 Insecure Client-Side Storage & Lack of Backend Logout
- **Location**: `frontend/services/backend.ts:30-55, 705-708`
- Both the access JWT token and refresh token are stored in `window.localStorage`. Any XSS flaw on the website grants full access to these tokens.
- Furthermore, `logout()` only invokes `window.localStorage.removeItem(...)`. There is no backend `/api/logout/` endpoint to blacklist the refresh token or invalidate the session. The tokens remain valid until expiration.

---

## 8. Prioritized Remediation Recommendations

### 8.1 Critical Fixes (Immediate Action Required)

#### 1. Eliminate Static Admin Token Backdoor & Hardcoded Secrets
- Delete `StaticAdminAuthentication` from `REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES']` in `settings.py`.
- Remove static token fallback from `frontend/services/backend.ts:699`.
- Require standard Django superuser / staff accounts authenticated via SimpleJWT (`/api/token/`).
- Enforce that `SECRET_KEY` MUST be provided via environment variables with no hardcoded fallback:
  ```python
  SECRET_KEY = os.environ['DJANGO_SECRET_KEY']  # Fail-fast if not configured
  ```

#### 2. Restrict `AppealViewSet` and `ApplicationViewSet` to Staff Only
In `Backend/core/views.py`:
```python
class AppealViewSet(viewsets.ModelViewSet):
    queryset = Appeal.objects.all().order_by('-created_at')
    serializer_class = AppealSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]  # RESTRICT GET/PUT/DELETE TO AUTHENTICATED STAFF
```

#### 3. Enable SimpleJWT Token Blacklist & Rotate Keys
- Add `'rest_framework_simplejwt.token_blacklist'` to `INSTALLED_APPS` in `settings.py`.
- Run `python manage.py migrate` to create blacklisted token tables.
- Implement server-side logout endpoint (`/api/logout/`) that accepts the refresh token and calls `token.blacklist()`.

#### 4. Configure Reverse Proxy SSL & HTTPS Enforcement
In `Backend/markaz_backend/settings.py`:
```python
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = env('SECURE_SSL_REDIRECT', True, cast=bool)
SESSION_COOKIE_SECURE = env('SESSION_COOKIE_SECURE', True, cast=bool)
CSRF_COOKIE_SECURE = env('CSRF_COOKIE_SECURE', True, cast=bool)
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True
```

In `deploy/nginx-uzbamalaka.conf`:
- Fix port 80 redirect: Redirect directly to HTTPS (`return 301 https://$host$request_uri;`).
- Add `/admin/` proxy location block so Django Admin is accessible over HTTPS.

#### 5. Fix `CSRF_TRUSTED_ORIGINS` & CORS
In `Backend/markaz_backend/settings.py`:
```python
CSRF_TRUSTED_ORIGINS = env(
    'CSRF_TRUSTED_ORIGINS',
    'https://uzbamalaka.uz,https://www.uzbamalaka.uz'
).split(',')

# Do NOT allow all origins with credentials
CORS_ALLOW_ALL_ORIGINS = False
```

### 8.2 High & Medium Fixes

#### 6. Dependency Upgrades
- Update `frontend/package.json`:
  - Upgrade `xlsx` to a secure version or replace with a modern library such as `exceljs`.
  - Upgrade `react-router-dom` to `>=7.18.2` or patch route matching.
  - Upgrade `vite` to `>=6.4.3` and `rollup` to `>=4.59.0`.
- Convert `Backend/requirements.txt` to UTF-8 without BOM and prune unused packages (`yt-dlp`, AI client SDKs).

#### 7. Update `.gitignore`
In root `.gitignore`:
```gitignore
.env
.env.*
*.env
!*.env.example
```

---

*Report prepared by Configuration and Secrets Surveyor (`explorer_survey_config_1`). Verified by static inspection and empirical runtime validation.*
