from types import SimpleNamespace

from django.conf import settings
from rest_framework import authentication, exceptions


class StaticAdminAuthentication(authentication.BaseAuthentication):
    """Allow a fixed admin token for lightweight site admin access in development mode."""

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header:
            return None

        # Prevent static admin token bypass in production
        if not settings.DEBUG and not getattr(settings, 'ALLOW_STATIC_ADMIN_AUTH', False):
            return None

        # Reject empty or default weak tokens
        if not settings.STATIC_ADMIN_TOKEN or settings.STATIC_ADMIN_TOKEN in ('static-admin-token', '1212', ''):
            return None

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
