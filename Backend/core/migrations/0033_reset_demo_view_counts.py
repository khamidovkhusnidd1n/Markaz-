# Reset seeded demo view counts (124, 98, 25) to 0 so only real user views are counted

from django.db import migrations


def reset_demo_views(apps, schema_editor):
    AntiCorruptionPost = apps.get_model('core', 'AntiCorruptionPost')
    DepartmentPost = apps.get_model('core', 'DepartmentPost')

    AntiCorruptionPost.objects.filter(views_count__in=[124, 98, 125, 99]).update(views_count=0)
    DepartmentPost.objects.filter(views_count=25).update(views_count=0)


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0032_update_international_posts_and_images'),
    ]

    operations = [
        migrations.RunPython(reset_demo_views, noop_reverse),
    ]
