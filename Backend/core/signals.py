import threading
import logging
from django.apps import apps
from django.contrib.auth.models import Group, Permission
from django.db.models.signals import post_migrate, post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache

logger = logging.getLogger(__name__)

@receiver(post_migrate)
def ensure_content_administrator_group(sender, **kwargs):
    """Create a reusable admin role with full permissions after migrations."""
    if sender.name != 'core':
        return
    group, _ = Group.objects.get_or_create(name='Content Administrator')
    core_models = apps.get_app_config('core').get_models()
    permissions = Permission.objects.filter(content_type__app_label='core')
    permissions = permissions | Permission.objects.filter(codename__in=['view_logentry'])
    for model in core_models:
        permissions = permissions | Permission.objects.filter(
            content_type__app_label=model._meta.app_label,
            content_type__model=model._meta.model_name,
        )
    group.permissions.set(permissions.distinct())


@receiver([post_save, post_delete])
def clear_cache_on_content_update(sender, **kwargs):
    """
    Clear all API caches (including get_all_data) whenever any content is added/edited in Admin.
    Ensures that uploaded news, images, courses, etc. appear instantly on the main website.
    """
    # Only listen to models in core app
    app_label = getattr(sender._meta, 'app_label', '')
    if app_label != 'core':
        return

    # Avoid clearing on non-content logging models if any
    model_name = getattr(sender._meta, 'model_name', '').lower()
    if model_name in ('appeal', 'application'):
        return

    try:
        cache.clear()
        logger.info("Cleared cache due to change in %s", sender.__name__)
    except Exception as e:
        logger.warning("Failed to clear cache on %s change: %s", sender.__name__, e)


