from django.db import migrations

def update_official_contacts(apps, schema_editor):
    AntiCorruptionContent = apps.get_model('core', 'AntiCorruptionContent')
    for item in AntiCorruptionContent.objects.all():
        item.hotline_phone = '+998 77 363 38 36'
        item.officer_phone = '+998 77 363 38 36'
        item.email = 'uzbahuzuridagimarkaz@gmail.com'
        item.telegram_bot = 'https://t.me/uzbamalakamakebot'
        item.save()

def reverse_update(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0029_anticorruptiondocument_content_and_more'),
    ]

    operations = [
        migrations.RunPython(update_official_contacts, reverse_update),
    ]
