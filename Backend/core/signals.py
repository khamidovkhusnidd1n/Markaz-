from django.apps import apps
from django.contrib.auth.models import Group, Permission
from django.db.models.signals import post_migrate
from django.dispatch import receiver


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
