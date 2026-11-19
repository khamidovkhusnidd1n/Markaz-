"""
URL configuration for markaz_backend project.
"""
import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = [
    # DTL (server-side rendering) frontend is disabled.
    # The DRF API handles all root requests.
    path('api/', include('core.urls')),
    path('', include('core.urls')),
    path('admin/', admin.site.urls),
]

# UZCERT xavfsiz xato sahifalari (Information Disclosure himoyasi)
handler404 = 'core.handlers.custom_page_not_found_view'
handler500 = 'core.handlers.custom_server_error_view'
handler403 = 'core.handlers.custom_permission_denied_view'
handler400 = 'core.handlers.custom_bad_request_view'

def media_serve_fallback(request, path):
    search_dirs = [
        getattr(settings, 'MEDIA_ROOT', None),
        settings.BASE_DIR / 'media',
        '/home/uzbamala/public_html/media',
        '/home/uzbamala/uzbamalaka_backend/media',
    ]
    for d in search_dirs:
        if d:
            full_path = os.path.join(str(d), path)
            if os.path.exists(full_path) and os.path.isfile(full_path):
                return serve(request, path, document_root=str(d))
    from django.http import Http404
    raise Http404("Media file not found")

# Serve media files (both dev and fallback in production)
urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', media_serve_fallback),
]

def static_serve_fallback(request, path):
    search_dirs = [
        getattr(settings, 'STATIC_ROOT', None),
        settings.BASE_DIR / 'staticfiles',
        settings.BASE_DIR / 'core' / 'static',
        '/home/uzbamala/public_html/static',
        '/home/uzbamala/uzbamalaka_backend/staticfiles',
    ]
    for d in search_dirs:
        if d:
            full_path = os.path.join(str(d), path)
            if os.path.exists(full_path) and os.path.isfile(full_path):
                return serve(request, path, document_root=str(d))
    from django.http import Http404
    raise Http404("Static file not found")

# Serve static files in production fallback
urlpatterns += [
    re_path(r'^static/(?P<path>.*)$', static_serve_fallback),
]

# Serve static files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
