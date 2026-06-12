from django.db import migrations, models
import core.models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_alter_document_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='email',
            field=models.EmailField(blank=True, max_length=254, verbose_name='Elektron pochta'),
        ),
        migrations.AddField(
            model_name='course',
            name='phone_numbers',
            field=models.CharField(blank=True, max_length=500, verbose_name='Telefon raqamlari'),
        ),
        migrations.AddField(
            model_name='course',
            name='photo',
            field=models.ImageField(blank=True, null=True, upload_to=core.models.generate_unique_filename, verbose_name='Kurs rasmi'),
        ),
        migrations.AddField(
            model_name='course',
            name='telegram_link',
            field=models.URLField(blank=True, verbose_name='Telegram havola'),
        ),
        migrations.AlterField(
            model_name='course',
            name='course_type',
            field=models.CharField(choices=[('professional_development', 'Malaka oshirish'), ('retraining', 'Qayta tayyorlash'), ('short_professional_development', 'Qisqa malaka oshirish'), ('profession_learning', "Kasb o'rganish")], default='professional_development', max_length=30, verbose_name='Kurs turi'),
        ),
    ]
