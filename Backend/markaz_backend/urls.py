"""
URL configuration for markaz_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

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

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
