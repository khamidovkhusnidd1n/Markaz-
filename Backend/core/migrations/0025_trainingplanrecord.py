from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0024_departmentpost_video_departmentpost_video_url_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='TrainingPlanRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Yaratilgan vaqt')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name="O'zgartirilgan vaqt")),
                ('full_name', models.CharField(max_length=300, verbose_name='F.I.SH')),
                ('region', models.CharField(blank=True, default='', max_length=200, verbose_name='Viloyat')),
                ('workplace', models.CharField(blank=True, default='', max_length=500, verbose_name='Ish joyi')),
                ('course_name', models.CharField(blank=True, default='', max_length=500, verbose_name="Kurs nomi (Yo'nalish)")),
                ('last_training_date', models.CharField(blank=True, default='', max_length=200, verbose_name='Oxirgi malaka oshirgan vaqti (Muddat)')),
                ('status', models.CharField(blank=True, default='', max_length=100, verbose_name='Holati (Masalan: Rejalashtirilgan)')),
            ],
            options={
                'verbose_name': 'Malaka oshirish rejasi (Tinglovchi)',
                'verbose_name_plural': 'Malaka oshirish rejasi',
                'ordering': ['-created_at'],
            },
        ),
    ]
