"""
Django settings for markaz_backend project.
Production-ready configuration following Django best practices.
"""

import importlib.util
import os
from pathlib import Path
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


def load_env_file(env_path):
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding='utf-8').splitlines():
        line = raw_line.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue

        key, value = line.split('=', 1)
        os.environ.setdefault(key.strip(), value.strip())


def env(key, default=None, cast=None):
    value = os.environ.get(key, default)
    if cast is bool:
        return str(value).lower() in {'1', 'true', 'yes', 'on'}
    return value


load_env_file(BASE_DIR / '.env')

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('DJANGO_SECRET_KEY', 'sayt-production-secret-key-9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1-fallback')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG', False, cast=bool)

# Secure deployment settings
SESSION_COOKIE_SECURE = env('SESSION_COOKIE_SECURE', True, cast=bool)
CSRF_COOKIE_SECURE = env('CSRF_COOKIE_SECURE', True, cast=bool)
SECURE_SSL_REDIRECT = env('SECURE_SSL_REDIRECT', not DEBUG, cast=bool)
SECURE_HSTS_SECONDS = int(env('SECURE_HSTS_SECONDS', 31536000))
SECURE_HSTS_INCLUDE_SUBDOMAINS = env('SECURE_HSTS_INCLUDE_SUBDOMAINS', True, cast=bool)
SECURE_HSTS_PRELOAD = env('SECURE_HSTS_PRELOAD', True, cast=bool)
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

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


CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.0.105:3000',
    'http://192.168.0.102:3000',
    'http://192.168.0.102:8000',
    'http://172.31.80.1:3000',
    'http://172.20.80.1:3000',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://localhost:8001',
    'http://127.0.0.1:8001',
    'http://172.31.96.1:3000',
    'http://172.31.96.1:8000',
    'http://172.31.96.1:8001',
    'http://192.168.0.104:3000',
    'http://192.168.0.104:8000',
    'http://192.168.0.104:8001',
]


# Application definition

INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    
    # Local apps
    'core.apps.CoreConfig',
]

JAZZMIN_SETTINGS = {
    "site_title": "Markaz Executive Admin",
    "site_header": "Markaz Boshqaruvi",
    "site_brand": "MARKAZ ADMIN",
    "site_logo_classes": "img-circle",
    "welcome_sign": "Badiiy Ta'lim Markazi — Boshqaruv Tizimiga Xush Kelibsiz",
    "copyright": "O'zbekiston Badiiy Akademiyasi Huzuridagi Markaz",
    "search_model": ["core.Personnel", "core.Teacher", "core.Course", "core.News"],
    "show_sidebar": True,
    "navigation_expanded": True,
    "custom_css": "css/custom_jazzmin.css",
    "topmenu_links": [
        {"name": "Bosh sahifa", "url": "admin:index", "permissions": ["auth.view_user"]},
        {"model": "core.AppContent"},
        {"model": "core.News"},
        {"model": "core.Course"},
    ],
    "order_with_respect_to": [
        "core.AppContent",
        "core.Department",
        "core.Personnel",
        "core.Teacher",
        "core.Pedagogue",
        "core.Course",
        "core.Listener",
        "core.YearlyStatistics",
        "core.Statistics",
        "core.News",
        "core.NewsCategory",
        "core.GalleryItem",
        "core.ArtGalleryItem",
        "core.JournalIssue",
        "core.JournalSettings",
        "core.Document",
        "core.Appeal",
        "core.Application",
        "core.InternationalSettings",
        "core.InternationalPartner",
        "core.InternationalProject",
    ],
    "icons": {
        "auth": "fas fa-shield-alt",
        "auth.user": "fas fa-user-shield",
        "auth.Group": "fas fa-users-cog",
        "core.AppContent": "fas fa-university",
        "core.Department": "fas fa-sitemap",
        "core.DepartmentTask": "fas fa-tasks",
        "core.Personnel": "fas fa-user-tie",
        "core.Teacher": "fas fa-chalkboard-teacher",
        "core.Pedagogue": "fas fa-user-graduate",
        "core.PedagogueProject": "fas fa-award",
        "core.Course": "fas fa-graduation-cap",
        "core.Listener": "fas fa-id-card",
        "core.YearlyStatistics": "fas fa-chart-line",
        "core.Statistics": "fas fa-chart-bar",
        "core.News": "fas fa-newspaper",
        "core.NewsCategory": "fas fa-tags",
        "core.GalleryItem": "fas fa-images",
        "core.ArtGalleryItem": "fas fa-paint-brush",
        "core.JournalIssue": "fas fa-book-open",
        "core.JournalSettings": "fas fa-sliders-h",
        "core.Document": "fas fa-file-pdf",
        "core.Appeal": "fas fa-comment-dots",
        "core.Application": "fas fa-paper-plane",
        "core.InternationalSettings": "fas fa-globe-americas",
        "core.InternationalPartner": "fas fa-handshake",
        "core.InternationalProject": "fas fa-project-diagram",
        "core.InternationalMedia": "fas fa-photo-video",
    },
    "default_icon_parents": "fas fa-folder",
    "default_icon_children": "fas fa-circle",
    "related_modal_active": True,
    "show_ui_builder": False,
    "changeform_format": "horizontal_tabs",
}

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": "navbar-dark",
    "accent": "accent-primary",
    "navbar": "navbar-dark navbar-navy",
    "no_navbar_border": True,
    "navbar_double_row": False,
    "sidebar": "sidebar-dark-indigo",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": True,
    "sidebar_nav_compact_style": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": True,
    "theme": "pulse",
    "dark_mode_theme": None,
    "button_classes": {
        "primary": "btn-primary",
        "secondary": "btn-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success"
    }
}

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

if importlib.util.find_spec("whitenoise"):
    MIDDLEWARE.insert(2, 'whitenoise.middleware.WhiteNoiseMiddleware')

ROOT_URLCONF = 'markaz_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'markaz_backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

_db_engine = env('DB_ENGINE', 'django.db.backends.postgresql')
_db_options = {}
if 'postgresql' in _db_engine:
    _db_options = {
        'connect_timeout': int(env('DB_CONNECT_TIMEOUT', 5)),
        'application_name': env('DB_APPLICATION_NAME', 'markaz_backend'),
    }

DATABASES = {
    'default': {
        'ENGINE': _db_engine,
        'NAME': env('DB_NAME', 'sayt_db') if 'postgresql' in _db_engine else BASE_DIR / env('DB_NAME', 'db.sqlite3'),
        'USER': env('DB_USER', '') if 'postgresql' in _db_engine else '',
        'PASSWORD': env('DB_PASSWORD', '') if 'postgresql' in _db_engine else '',
        'HOST': env('DB_HOST', 'localhost') if 'postgresql' in _db_engine else '',
        'PORT': env('DB_PORT', '5432') if 'postgresql' in _db_engine else '',
        'CONN_MAX_AGE': int(env('DB_CONN_MAX_AGE', 60)),
        'CONN_HEALTH_CHECKS': 'postgresql' in _db_engine,
        'ATOMIC_REQUESTS': True,
        'OPTIONS': _db_options,
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'uz'

TIME_ZONE = 'Asia/Tashkent'

USE_I18N = True

USE_TZ = True


STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [
    BASE_DIR / 'core' / 'static',
]
if importlib.util.find_spec("whitenoise"):
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files (User uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'


# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

SITE_NAME = env('SITE_NAME', "Sayt boshqaruv paneli")


# Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'core.authentication.StaticAdminAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ] if not DEBUG else [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
}

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}


# CORS Settings
CORS_ALLOWED_ORIGINS = os.environ.get(
    'CORS_ALLOWED_ORIGINS',
    env(
        'CORS_ALLOWED_ORIGINS',
        'https://uzbamalaka.uz,https://www.uzbamalaka.uz,http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173'
    )
).split(',')

CORS_ALLOW_CREDENTIALS = True

# Allow all origins in development
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True


# File Upload Settings
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10 MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10 MB

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': '%(asctime)s [%(levelname)s] %(name)s: %(message)s',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'standard',
        },
    },
    'loggers': {
        'core': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
    },
}

STATIC_ADMIN_USERNAME = env('STATIC_ADMIN_USERNAME', 'admin')
STATIC_ADMIN_PASSWORD = env('STATIC_ADMIN_PASSWORD', '1212')
STATIC_ADMIN_TOKEN = env('STATIC_ADMIN_TOKEN', 'static-admin-token')
