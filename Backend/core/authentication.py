from types import SimpleNamespace

from django.conf import settings
from rest_framework import authentication, exceptions


class StaticAdminAuthentication(authentication.BaseAuthentication):
    """Allow a fixed admin token for lightweight site admin access."""

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header:
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
