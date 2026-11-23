# Remove Santa Reparata (SRISA) and Pendidikan Sultan Idris Universiti (UPSI) posts from DepartmentPost

from django.db import migrations


def remove_srisa_and_upsi(apps, schema_editor):
    DepartmentPost = apps.get_model('core', 'DepartmentPost')
    DepartmentPost.objects.filter(id__in=[19, 20]).delete()


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0034_separate_partner_and_project_posts'),
    ]

    operations = [
        migrations.RunPython(remove_srisa_and_upsi, noop_reverse),
    ]
