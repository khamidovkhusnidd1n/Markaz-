# Backend Security Survey Report
**Project**: Educational Center Management System (Markaz Backend)  
**Backend Framework**: Django 5.2.16, Django REST Framework 3.16.1, SimpleJWT 5.5.1  
**Database**: SQLite (`db.sqlite3`) / PostgreSQL-ready  
**Date**: September 18, 2026  
**Auditor**: Backend Security Surveyor  
**Target Directory**: `Backend/`  

---

## 1. Executive Summary

A comprehensive, static and empirical security survey of the entire backend codebase in `Backend/` was conducted. The backend powers an educational center website and public portal with both server-rendered templates and a RESTful API consumed by a React/Vite frontend.

### Severity Breakdown
| Severity | Count | Summary of Key Issues |
|:---|:---:|:---|
| **CRITICAL** | **3** | Unauthenticated exposure of citizen appeals & grievances; unauthenticated exposure of course/job applications; complete dump of 1,618 student/listener records (`/api/all-data/` & `/api/listeners/`). |
| **HIGH** | **3** | Mass assignment / over-posting of `status` and `admin_note` on public submissions; hardcoded static admin token/credentials authentication backdoor; lack of rate limiting on authentication and submission endpoints. |
| **MEDIUM** | **4** | Unrestricted vote manipulation & race condition on projects; unhandled `NameError` crash (500) on `/api/department-posts/<pk>/view/`; missing file extension & MIME-type validation on file uploads; synchronous outbound Google Translate requests during `model.save()`. |
| **LOW** | **3** | Database connection exception string leakage via `DatabaseStatusMixin`; timing attacks on static admin comparison; unvalidated Excel bulk import structure in `ListenerViewSet`. |
| **INFORMATIONAL** | **2** | Leftover backup/scratch files (`patch_*.py`, `models_backup.py`, etc.); SQLite concurrency constraints for production. |

---

## 2. Codebase & Architecture Mapping

### 2.1 File & Directory Inventory
The backend codebase is structured under `Backend/` with two primary packages: `markaz_backend` (project configuration) and `core` (application logic).

```
Backend/
├── .env                                 # Environment file (DEBUG=True, hardcoded secrets)
├── .env.example                         # Environment template with default credentials
├── db.sqlite3                           # Local database (contains 4 superusers, 1,618 listeners)
├── manage.py                            # Django management script
├── requirements.txt                     # Pinned dependencies
├── markaz_backend/                      # Project configuration package
│   ├── __init__.py
│   ├── asgi.py                          # ASGI application definition
│   ├── wsgi.py                          # WSGI application definition
│   ├── settings.py                      # Django & DRF configuration (408 lines)
│   └── urls.py                          # Root URL configuration (19 lines)
├── core/                                # Core application package
│   ├── __init__.py
│   ├── apps.py                          # CoreConfig definition
│   ├── admin.py                         # ModelAdmin configurations & Jazzmin integration (1052 lines)
│   ├── authentication.py                # Custom StaticAdminAuthentication (34 lines)
│   ├── models.py                        # Concrete database models (1549 lines)
│   ├── serializers.py                   # DRF ModelSerializers (760 lines)
│   ├── views.py                         # ViewSets and API functions (1017 lines)
│   ├── urls.py                          # REST API routing (58 lines)
│   ├── site_views.py                    # DTL Template views (69 lines)
│   ├── site_urls.py                     # DTL Template URLs (21 lines)
│   ├── signals.py                       # Post-migrate admin permission signals (24 lines)
│   ├── translation.py                   # Offline translation dictionaries & utilities (202 lines)
│   ├── management/commands/             # Management commands
│   │   ├── activate_existing_content.py
│   │   ├── check_db.py
│   │   ├── clean_orphaned_images.py
│   │   ├── create_admin_role.py
│   │   ├── seed_db.py
│   │   ├── seed_sample_data.py
│   │   └── translate_all.py
│   ├── migrations/                      # 24 schema migrations (0001_initial to 0024)
│   └── templates/                       # DTL templates (admin & site)
└── [scripts]                            # 25+ root utility and patch scripts (e.g. fix_db.py, patch_*.py)
```

### 2.2 Data Models Inventory (`core/models.py`)
`core/models.py` defines 26 concrete database models inheriting from `BaseModel` (`created_at`, `updated_at`):

1. **Content & News**: `News`, `NewsImage`, `NewsCategory`.
2. **Media & Gallery**: `GalleryItem`, `GalleryImage`, `ArtGalleryItem`.
3. **Public Submissions & Records**:
   - `Appeal`: Citizen requests, complaints, suggestions. Contains `full_name`, `phone`, `email`, `telegram_link`, `description`, `status`, `admin_note`.
   - `Application`: Course/training applications. Contains `full_name`, `application_type`, `workplace`, `direction`, `phone`, `telegram_link`, `status`, `admin_note`.
   - `Listener`: Training/qualification records (1,618 rows). Contains `full_name`, `record_type`, `series`, `number`, `workplace`, `course_type`, `duration`.
4. **Faculty & Staff**: `Teacher`, `Personnel`.
5. **Academics & Journal**: `Course`, `JournalIssue`, `JournalSettings`, `Document`.
6. **Analytics & Site Settings**: `Statistics`, `YearlyStatistics`, `AppContent`, `AppHeroImage`.
7. **International Relations**: `InternationalSettings`, `InternationalPartner`, `InternationalProject`, `InternationalProjectImage`, `InternationalMedia`.
8. **Departments & Pedagogues**: `Department`, `DepartmentTask`, `DepartmentPost`, `DepartmentPostImage`, `DepartmentImage`, `DepartmentVideo`, `Pedagogue`, `PedagogueProject`, `PedagogueProjectImage`.

---

## 3. Comprehensive API Endpoint & Access Control Audit

### 3.1 Endpoint Routing Table & Access Control Matrix

| Endpoint | Method(s) | Handler | Authentication | Permission Class | Effective Access / Security Finding |
|:---|:---:|:---|:---:|:---:|:---|
| `/api/all-data/` | GET | `views.get_all_data` | Default | `AllowAny` | **CRITICAL**: Dumps all 1,618 student records + all site tables unauthenticated. |
| `/api/appeals/` | GET | `AppealViewSet.list` | Default | `IsAdminOrReadOnly` | **CRITICAL**: Open to unauthenticated users; leaks all citizen appeals & PII. |
| `/api/appeals/<pk>/` | GET | `AppealViewSet.retrieve` | Default | `IsAdminOrReadOnly` | **CRITICAL**: Open to unauthenticated users; leaks specific citizen appeal & PII. |
| `/api/appeals/` | POST | `AppealViewSet.create` | Default | `AllowAny` | **HIGH**: Mass assignment; anyone can set `status='resolved'` & `admin_note`. No captcha/rate limit. |
| `/api/appeals/<pk>/` | PUT/PATCH/DEL | `AppealViewSet.update/destroy` | Default | `IsAdminOrReadOnly` | Admin only (allows static admin bypass). |
| `/api/applications/` | GET | `ApplicationViewSet.list` | Default | `IsAdminOrReadOnly` | **CRITICAL**: Open to unauthenticated users; leaks all job/course applications & PII. |
| `/api/applications/<pk>/` | GET | `ApplicationViewSet.retrieve` | Default | `IsAdminOrReadOnly` | **CRITICAL**: Open to unauthenticated users; leaks specific application & PII. |
| `/api/applications/` | POST | `ApplicationViewSet.create` | Default | `AllowAny` | **HIGH**: Mass assignment; allows setting `status` & `admin_note`. No rate limit. |
| `/api/applications/<pk>/` | PUT/PATCH/DEL | `ApplicationViewSet.update/destroy` | Default | `IsAdminOrReadOnly` | Admin only (allows static admin bypass). |
| `/api/listeners/` | GET | `ListenerViewSet.list` | Default | `IsAdminOrReadOnly` | **CRITICAL**: Enumerates all 1,618 student records with PII unauthenticated. |
| `/api/listeners/<pk>/` | GET | `ListenerViewSet.retrieve` | Default | `IsAdminOrReadOnly` | **CRITICAL**: Public retrieval of listener records by ID. |
| `/api/listeners/search/` | GET | `ListenerViewSet.search` | Default | `IsAdminOrReadOnly` | Public search by certificate/diploma number and series. |
| `/api/listeners/bulk-import/` | POST | `ListenerViewSet.bulk_import` | Default | `IsAdminOrReadOnly` | Admin only. Unvalidated file extension/type processed via pandas. |
| `/api/pdplans/*` | ANY | `ListenerViewSet` | Default | `IsAdminOrReadOnly` | Legacy alias routes for `/api/listeners/` (same vulnerabilities). |
| `/api/login/` | POST | `views.custom_login` | Default | `AllowAny` | **HIGH**: Backdoor bypass with static credentials (`STATIC_ADMIN_PASSWORD`). No rate limit. |
| `/api/token/` | POST | `TokenObtainPairView` | None | `AllowAny` | SimpleJWT login. **HIGH**: No rate limiting/throttling. |
| `/api/token/refresh/` | POST | `TokenRefreshView` | None | `AllowAny` | SimpleJWT token refresh. |
| `/api/projects/<pk>/vote/` | POST | `increment_project_vote` | Default | `AllowAny` | **MEDIUM**: Vote manipulation. No authentication, IP check, or atomic DB increment. |
| `/api/pedagogue-projects/<pk>/vote/` | POST | `PedagogueProjectViewSet.vote` | Default | `AllowAny` | Duplicate unthrottled vote manipulation endpoint. |
| `/api/projects/<pk>/view/` | POST | `increment_project_view` | Default | `AllowAny` | Unthrottled view counter inflation. |
| `/api/news/<pk>/view/` | POST | `increment_news_view` | Default | `AllowAny` | Unthrottled view counter inflation. |
| `/api/department-posts/<pk>/view/` | POST | `increment_department_post_view`| Default | `AllowAny` | **MEDIUM**: Crashes with `NameError: 'DepartmentPost' is not defined` (500 error). |
| `/api/news/` | GET | `NewsViewSet.list` | Default | `IsAdminOrReadOnly` | Public read. Only active news shown to non-admins. |
| `/api/news/` | POST | `NewsViewSet.create` | Default | `IsAdminOrReadOnly` | Admin only. Handles inline image uploads. |
| `/api/news/<pk>/add_images/` | POST | `NewsViewSet.add_images` | Default | `IsAdminOrReadOnly` | Admin only. Handles additional image uploads. |
| `/api/gallery/bulk_upload/` | POST | `GalleryItemViewSet.bulk_upload`| Default | `IsAdminOrReadOnly`| Admin only. Multiple image upload. |
| `/api/documents/` | GET / POST | `DocumentViewSet` | Default | `IsAdminOrReadOnly` | Public read. Admin upload of arbitrary document files. |
| `/api/journal/` | GET / POST | `JournalIssueViewSet` | Default | `IsAdminOrReadOnly` | Public read. Admin upload of journal PDFs. |
| `/api/courses/` | GET / POST | `CourseViewSet` | Default | `IsAdminOrReadOnly` | Public read. Admin CRUD. |
| `/api/teachers/` | GET / POST | `TeacherViewSet` | Default | `IsAdminOrReadOnly` | Public read. Admin CRUD. |
| `/api/personnel/` | GET / POST | `PersonnelViewSet` | Default | `IsAdminOrReadOnly` | Public read. Admin CRUD. |
| `/api/departments/` | GET | `DepartmentViewSet` | Default | `AllowAny` | Public read-only. |
| `/api/pedagogues/` | GET | `PedagogueViewSet` | Default | `AllowAny` | Public read-only. |
| `/api/pedagogue-projects/`| GET | `PedagogueProjectViewSet` | Default | `AllowAny` | Public read-only. |
| `/api/content/` | GET / POST | `AppContentViewSet` | Default | `IsAdminOrReadOnly` | Public read. Admin singleton update. |
| `/api/journal-settings/`| GET / POST | `JournalSettingsViewSet` | Default | `IsAdminOrReadOnly` | Public read. Admin singleton update. |
| `/api/international-settings/`| GET / POST | `InternationalSettingsViewSet`| Default | `IsAdminOrReadOnly` | Public read. Admin singleton update. |
| `/api/international-partners/`| GET / POST | `InternationalPartnerViewSet` | Default | `IsAdminOrReadOnly` | Public read. Admin CRUD. |
| `/api/international-projects/`| GET / POST | `InternationalProjectViewSet` | Default | `IsAdminOrReadOnly` | Public read. Admin CRUD. |
| `/api/international-media/` | GET / POST | `InternationalMediaViewSet` | Default | `IsAdminOrReadOnly` | Public read. Admin CRUD. |
| `/api/statistics/` | GET / POST | `StatisticsViewSet` | Default | `IsAdminOrReadOnly` | Public read. Admin singleton update. |
| `/api/yearly-statistics/` | GET / POST | `YearlyStatisticsViewSet` | Default | `IsAdminOrReadOnly` | Public read. Admin CRUD. |
| `/admin/*` | ANY | Django Admin (`admin.site.urls`)| Session | `is_staff` | Protected by Django Admin session authentication. |

---

## 4. In-Depth Vulnerability Hotspots Analysis

### 4.1 Broken Access Control & PII Leaks (OWASP A01:2021)

#### Hotspot 1: Unauthenticated Leak of Citizen Appeals & Grievances
- **Affected File**: `Backend/core/views.py`, Lines 787–796
- **Code Snippet**:
  ```python
  class AppealViewSet(viewsets.ModelViewSet):
      queryset = Appeal.objects.all().order_by('-created_at')
      serializer_class = AppealSerializer
      parser_classes = [MultiPartParser, FormParser, JSONParser]

      def get_permissions(self):
          if self.action in ['create']:
              return [permissions.AllowAny()]
          return [IsAdminOrReadOnly()]
  ```
- **Analysis**:
  `IsAdminOrReadOnly` evaluates `request.method in permissions.SAFE_METHODS` (`GET`, `HEAD`, `OPTIONS`) as `True` for anyone:
  ```python
  class IsAdminOrReadOnly(permissions.BasePermission):
      def has_permission(self, request, view):
          if request.method in permissions.SAFE_METHODS:
              return True
          return has_admin_access(request)
  ```
  Because `AppealViewSet` does **not** override `get_queryset()` to filter out records for non-admins, an unauthenticated GET request to `/api/appeals/` returns the complete list of all citizen appeals.
- **Empirical Proof**:
  Executing `GET /api/appeals/` without headers returned `HTTP 200 OK` and serialized all appeal records with fields:
  `['id', 'full_name', 'appeal_type', 'appeal_type_display', 'description', 'phone', 'email', 'telegram_link', 'status', 'status_display', 'admin_note', 'created_at', 'updated_at']`.
- **Impact**: Critical breach of citizen privacy, exposing sensitive complaints, citizen phone numbers, emails, and internal resolution notes.

#### Hotspot 2: Unauthenticated Leak of Course & Job Applications
- **Affected File**: `Backend/core/views.py`, Lines 798–807
- **Code Snippet**:
  ```python
  class ApplicationViewSet(viewsets.ModelViewSet):
      queryset = Application.objects.all().order_by('-created_at')
      serializer_class = ApplicationSerializer
      parser_classes = [MultiPartParser, FormParser, JSONParser]

      def get_permissions(self):
          if self.action in ['create']:
              return [permissions.AllowAny()]
          return [IsAdminOrReadOnly()]
  ```
- **Analysis & Proof**:
  Identical permission flaw as `AppealViewSet`. An unauthenticated GET request to `/api/applications/` returned `HTTP 200 OK` exposing all applicant records with workplaces, direction applied, personal phone numbers, and admin review notes.

#### Hotspot 3: Mass PII Dump in `/api/all-data/` & `/api/listeners/`
- **Affected File**: `Backend/core/views.py`, Lines 870–874 & 268–294
- **Code Snippet**:
  ```python
  @api_view(['GET'])
  @permission_classes([permissions.AllowAny])
  def get_all_data(request):
      ...
      data = {
          ...
          'listeners': ListenerSerializer(
              Listener.objects.all().order_by('-created_at'),
              many=True,
              context=ctx
          ).data,
  ```
- **Analysis & Proof**:
  While `get_all_data` conditionally hides appeals and applications if `not has_admin_access(request)`, it has **no condition** on `listeners`. Every frontend visitor loading the home page causes the backend to serialize all 1,618 listener records (student names, certificate/diploma numbers, workplaces, courses). Furthermore, `ListenerViewSet` uses `IsAdminOrReadOnly`, permitting full unauthenticated listing via `/api/listeners/`.

---

### 4.2 Mass Assignment / Parameter Tampering (OWASP A01 / A04:2021)

#### Hotspot 4: Over-Posting on Citizen Appeals & Applications
- **Affected File**: `Backend/core/serializers.py`, Lines 397–425
- **Code Snippet**:
  ```python
  class AppealSerializer(serializers.ModelSerializer):
      class Meta:
          model = Appeal
          fields = [
              'id', 'full_name', 'appeal_type', 'appeal_type_display',
              'description', 'phone', 'email', 'telegram_link',
              'status', 'status_display', 'admin_note',
              'created_at', 'updated_at'
          ]
          read_only_fields = ['id', 'created_at', 'updated_at']

  class ApplicationSerializer(serializers.ModelSerializer):
      class Meta:
          model = Application
          fields = [
              'id', 'full_name', 'application_type', 'application_type_display',
              'workplace', 'direction', 'phone', 'telegram_link',
              'status', 'status_display', 'admin_note',
              'created_at', 'updated_at'
          ]
          read_only_fields = ['id', 'created_at', 'updated_at']
  ```
- **Analysis**:
  Notice that `status` and `admin_note` are defined in `fields` but are **omitted** from `read_only_fields`. When an unauthenticated user submits an appeal or application via `POST /api/appeals/`, the user can supply:
  ```json
  {
    "full_name": "Attacker",
    "appeal_type": "murojaat",
    "description": "Tampered",
    "phone": "+998901234567",
    "status": "resolved",
    "admin_note": "Application approved by management."
  }
  ```
  The DRF serializer deserializes and saves these privileged fields directly to the database without administrative intervention.

---

### 4.3 Authentication Failures & Backdoors (OWASP A07:2021)

#### Hotspot 5: Static Admin Authentication Token Backdoor
- **Affected Files**:
  - `Backend/core/authentication.py`, Lines 7–33
  - `Backend/core/views.py`, Lines 38–52 & 934–971
  - `Backend/markaz_backend/settings.py`, Lines 330–334 & 405–408
- **Code Snippet**:
  ```python
  # core/authentication.py
  class StaticAdminAuthentication(authentication.BaseAuthentication):
      def authenticate(self, request):
          ...
          expected = f"Bearer {settings.STATIC_ADMIN_TOKEN}"
          if auth_header != expected:
              return None

          user = SimpleNamespace(
              is_authenticated=True,
              is_staff=True,
              is_active=True,
              username=settings.STATIC_ADMIN_USERNAME,
          )
          return (user, settings.STATIC_ADMIN_TOKEN)
  ```
  ```python
  # core/views.py: custom_login
  if username == settings.STATIC_ADMIN_USERNAME and password == settings.STATIC_ADMIN_PASSWORD:
      logger.info("Static admin login succeeded for username=%s", username)
      return Response({
          'success': True,
          'token': settings.STATIC_ADMIN_TOKEN,
          'refresh': '',
      })
  ```
- **Analysis**:
  1. `StaticAdminAuthentication` is configured as the **first** authentication class in `DEFAULT_AUTHENTICATION_CLASSES`.
  2. In `custom_login`, if `username == settings.STATIC_ADMIN_USERNAME` and `password == settings.STATIC_ADMIN_PASSWORD`, the server issues `STATIC_ADMIN_TOKEN` (`uzbamarkaz-secure-token-9f8a7b6c5d4e3f2a1`).
  3. `custom_login` does **not** check `DEBUG` or `ALLOW_STATIC_ADMIN_AUTH`.
  4. The returned mock user is a `SimpleNamespace` rather than a Django `User` model, which lacks ORM attributes, group lookups, and DB relations, causing potential runtime crashes or permissions bypasses.
  5. The credentials `STATIC_ADMIN_USERNAME`, `STATIC_ADMIN_PASSWORD`, and `STATIC_ADMIN_TOKEN` are present in `.env` and `.env.example`.

#### Hotspot 6: Total Absence of Rate Limiting & Throttling
- **Affected File**: `Backend/markaz_backend/settings.py`, Lines 329–346
- **Analysis**:
  `REST_FRAMEWORK` has no `DEFAULT_THROTTLE_CLASSES` or `DEFAULT_THROTTLE_RATES`.
  - `/api/login/` and `/api/token/` have no rate limiting, leaving them susceptible to brute-force credential attacks.
  - `/api/appeals/` and `/api/applications/` have no submission throttling, making the database vulnerable to spam and storage exhaustion.
  - `/api/all-data/` can be polled indefinitely, consuming CPU during bulk serialization.

---

### 4.4 Business Logic Flaws & Broken Code (OWASP A04:2021)

#### Hotspot 7: Unrestricted Vote & View Manipulation (Anti-Automation Failure)
- **Affected File**: `Backend/core/views.py`, Lines 83–95 & 974–1016
- **Code Snippet**:
  ```python
  @api_view(['POST'])
  @permission_classes([permissions.AllowAny])
  def increment_project_vote(request, pk):
      try:
          project = PedagogueProject.objects.get(pk=pk)
          project.votes_count += 1
          project.save(update_fields=['votes_count'])
          return Response({'votes_count': project.votes_count})
      except PedagogueProject.DoesNotExist:
          return Response(status=status.HTTP_404_NOT_FOUND)
  ```
- **Analysis**:
  1. Any client can issue thousands of POST requests per minute to `/api/projects/<pk>/vote/` or `/api/pedagogue-projects/<pk>/vote/` to manipulate project rankings.
  2. Non-atomic increment (`project.votes_count += 1` followed by `save()`) introduces a race condition under concurrent requests, resulting in lost updates. Django's `F('votes_count') + 1` is not used.
  3. Identical issues exist for view count increment endpoints (`increment_project_view`, `increment_news_view`).

#### Hotspot 8: Unhandled NameError Crash on `/api/department-posts/<pk>/view/`
- **Affected File**: `Backend/core/views.py`, Lines 998–1005
- **Code Snippet**:
  ```python
  @api_view(['POST'])
  @permission_classes([permissions.AllowAny])
  def increment_department_post_view(request, pk):
      try:
          post = DepartmentPost.objects.get(pk=pk)
          post.views_count += 1
          post.save(update_fields=['views_count'])
          return Response({'views_count': post.views_count})
      except DepartmentPost.DoesNotExist:
          return Response(status=status.HTTP_404_NOT_FOUND)
  ```
- **Analysis & Proof**:
  `DepartmentPost` is **not imported** in `views.py`. Calling `POST /api/department-posts/<pk>/view/` immediately triggers `NameError: name 'DepartmentPost' is not defined`, crashing with `HTTP 500 Internal Server Error`.

---

### 4.5 File Upload & Media Security (OWASP A03 / A04:2021)

#### Hotspot 9: Insecure Filename Generation & Unvalidated File Uploads
- **Affected File**: `Backend/core/models.py`, Lines 12–17
- **Code Snippet**:
  ```python
  def generate_unique_filename(instance, filename):
      """Generate unique filename for uploaded files."""
      ext = filename.split('.')[-1]
      unique_name = f"{uuid.uuid4().hex}.{ext}"
      model_name = instance.__class__.__name__.lower()
      return os.path.join(f'uploads/{model_name}/', unique_name)
  ```
- **Analysis**:
  1. `ext = filename.split('.')[-1]` blindly preserves whatever extension the client provided without checking against an extension whitelist.
  2. For `Document.file` (`FileField`), a user or administrator can upload files with `.html`, `.htm`, `.svg`, or `.xml` extensions.
  3. When served directly from `MEDIA_URL` (`/media/uploads/document/<uuid>.html`), the browser executes any embedded JavaScript in the website's origin, enabling **Stored Cross-Site Scripting (XSS)**.
  4. In `markaz_backend/settings.py`:
     ```python
     MEDIA_URL = '/media/'
     MEDIA_ROOT = BASE_DIR / 'media'
     FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10 MB
     DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10 MB
     ```
     There is no maximum disk file size validation, permitting storage exhaustion.
  5. In `ListenerViewSet.bulk_import`:
     ```python
     df = pd.read_excel(BytesIO(file.read()), dtype=str)
     ```
     `file` is accepted without extension or MIME-type validation. Passing an invalid file or a heavily nested/compressed spreadsheet can exhaust memory or crash the worker process.

---

### 4.6 Synchronous Outbound Network Calls & Latency / SSRF (OWASP A10:2021)

#### Hotspot 10: Synchronous External HTTP Requests in `model.save()`
- **Affected File**: `Backend/core/models.py`, Lines 54–62, 1205–1215, 1265–1277, 1340–1352, 1450–1460, 1510–1520
- **Code Snippet**:
  ```python
  url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=uz&tl={target}&dt=t&q=" + urllib.parse.quote(plain)
  req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
  res = urllib.request.urlopen(req, timeout=5)
  data = json.loads(res.read())
  ```
- **Analysis**:
  - Found in `News.save()`, `Department.save()`, `DepartmentTask.save()`, `DepartmentPost.save()`, `Pedagogue.save()`, `PedagogueProject.save()`, and `ArtGalleryItem.save()`.
  - Every time an instance is created or updated, synchronous outbound HTTP calls to Google Translate are made from inside the request-response cycle.
  - **Latency/DoS**: If 3 translatable fields are missing translations, up to 6 outbound requests are made. With a 5-second timeout, saving an object can block the Gunicorn worker thread for up to 30 seconds.
  - **Data Leakage**: Text entered by administrators (or users in user-facing content) is transmitted in cleartext URL query parameters to an external third-party API without encryption or consent.
  - **SSRF Risk**: Outbound requests are initiated automatically upon model save.

---

### 4.7 Database Information Disclosure (OWASP A05:2021)

#### Hotspot 11: Database Connection Error Leakage in `site_views.py`
- **Affected File**: `Backend/core/site_views.py`, Lines 8–23
- **Code Snippet**:
  ```python
  class DatabaseStatusMixin:
      def get_database_status(self):
          try:
              connection.ensure_connection()
              return {'is_connected': True, 'message': 'PostgreSQL ulanishi faol.'}
          except OperationalError as exc:
              return {'is_connected': False, 'message': f'PostgreSQL ulanish xatosi: {exc}'}
  ```
- **Analysis**:
  When a database connection error occurs, the verbatim exception `exc` is passed to template contexts rendered across `HomePageView`, `NewsListPageView`, `NewsDetailPageView`, `CourseListPageView`, and `CourseDetailPageView`. This string can leak internal database IP addresses, ports, usernames, and database connection paths to public website visitors.

---

### 4.8 Configuration & Deployment Security Audit

#### Hotspot 12: Deployment Security Checks & Environment Misconfigurations
- **Affected Files**: `Backend/markaz_backend/settings.py`, `Backend/.env`
- **Django `check --deploy` Output**:
  ```
  WARNINGS:
  ?: (security.W008) Your SECURE_SSL_REDIRECT setting is not set to True.
  ?: (security.W012) SESSION_COOKIE_SECURE is not set to True.
  ?: (security.W016) CSRF_COOKIE_SECURE is not set to True.
  ?: (security.W018) You should not have DEBUG set to True in deployment.
  ```
- **Analysis**:
  1. `DEBUG=True` in `.env`: Enables full traceback exposure and Django's Browsable API.
  2. `ALLOWED_HOSTS`:
     ```python
     if DEBUG:
         ALLOWED_HOSTS.append('*')
     ```
     Wildcard Host header matching bypasses host header validation.
  3. `SECRET_KEY`:
     ```python
     SECRET_KEY = env('DJANGO_SECRET_KEY', 'sayt-production-secret-key-9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1-fallback')
     ```
     Contains a hardcoded fallback string committed to source control.
  4. `CORS Settings`:
     ```python
     CORS_ALLOW_CREDENTIALS = True
     if DEBUG:
         CORS_ALLOW_ALL_ORIGINS = True
     ```
     Reflecting or wildcard origins combined with credentials violates CORS security invariants.

---

## 5. Summary Table of Vulnerability Hotspots & Recommended Remediations

| ID | Title | Severity | Affected File & Line(s) | Remediation Summary |
|:---|:---|:---:|:---|:---|
| **VULN-01** | Unauthenticated Access to Citizen Appeals | **CRITICAL** | `core/views.py:787-796` | Set `permission_classes = [permissions.IsAdminUser]` on `AppealViewSet` except for `create` action; override `get_queryset()` to return `Appeal.objects.none()` for non-staff. |
| **VULN-02** | Unauthenticated Access to Applications | **CRITICAL** | `core/views.py:798-807` | Restrict `ApplicationViewSet` read actions to staff; filter `get_queryset()`. |
| **VULN-03** | Mass PII Dump of Student Records | **CRITICAL** | `core/views.py:870-874`, `core/views.py:270-294` | Remove `listeners` from `get_all_data` unless user is staff; require `IsAdminUser` for `ListenerViewSet.list` and `retrieve`. |
| **VULN-04** | Mass Assignment of Status & Admin Note | **HIGH** | `core/serializers.py:397-425` | Add `'status'` and `'admin_note'` to `read_only_fields` in `AppealSerializer` and `ApplicationSerializer`. |
| **VULN-05** | Static Admin Authentication Backdoor | **HIGH** | `core/authentication.py:7-33`, `markaz_backend/settings.py:331` | Remove `StaticAdminAuthentication` from production settings; remove static admin branch in `custom_login`. Rely exclusively on standard Django JWT/session auth. |
| **VULN-06** | Missing DRF Throttling / Rate Limiting | **HIGH** | `markaz_backend/settings.py:329-346` | Configure `DEFAULT_THROTTLE_CLASSES` with `AnonRateThrottle` and `UserRateThrottle` (`100/day` for anon submissions, `5/min` for login). |
| **VULN-07** | Vote Manipulation & Race Conditions | **MEDIUM** | `core/views.py:83-95, 1009-1016` | Implement IP/session tracking or CAPTCHA; use atomic update `F('votes_count') + 1`. |
| **VULN-08** | NameError Crash on Department Post View | **MEDIUM** | `core/views.py:998-1005` | Import `DepartmentPost` into `core/views.py`. |
| **VULN-09** | Unvalidated File Uploads & Stored XSS | **MEDIUM** | `core/models.py:12-17`, `core/serializers.py:159` | Validate file extensions against strict whitelist (`.pdf`, `.jpg`, `.png`, `.webp`); validate magic bytes; reject `.html`, `.svg`, `.exe`. |
| **VULN-10** | Synchronous External HTTP in `model.save`| **MEDIUM** | `core/models.py:54, 1211, 1273, 1345, etc.` | Move automatic translation to an asynchronous background task (e.g., Celery) or a manual admin action. |
| **VULN-11** | DB Error Leak in `DatabaseStatusMixin` | **LOW** | `core/site_views.py:8-23` | Mask internal database error details; return generic error message without str(exc). |
| **VULN-12** | Insecure Deployment & Cookie Settings | **LOW** | `markaz_backend/settings.py:44-53`, `.env` | Set `DEBUG=False`, `SECURE_SSL_REDIRECT=True`, `SESSION_COOKIE_SECURE=True`, `CSRF_COOKIE_SECURE=True`. |

---
*Report compiled and verified by Backend Security Surveyor.*
