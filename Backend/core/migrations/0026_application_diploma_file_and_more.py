import core.models
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0025_trainingplanrecord'),
    ]

    operations = [
        migrations.AddField(
            model_name='application',
            name='application_number',
            field=models.CharField(blank=True, db_index=True, default='', max_length=30, verbose_name='Ariza raqami'),
        ),
        migrations.AddField(
            model_name='application',
            name='decision_type',
            field=models.CharField(choices=[('pending', "Ko'rib chiqilmoqda"), ('direct_match', "To'g'ridan-to'g'ri mos (Komissiyasiz qabul)"), ('compatible', 'Mos / Turdosh (80–100 ball) — Qabul qilindi'), ('conditional', 'Shartli mos / Qisman turdosh (60–79 ball) — Suhbat/ijodiy sinov sharti bilan'), ('incompatible', 'Mos emas (0–59 ball) — Rad etildi')], default='pending', max_length=30, verbose_name='Ekspert komissiyasi yakuniy xulosasi'),
        ),
        migrations.AddField(
            model_name='application',
            name='diploma_specialty',
            field=models.CharField(blank=True, default='', max_length=400, verbose_name="Diplom bo'yicha ma'lumoti va mutaxassisligi"),
        ),
        migrations.AddField(
            model_name='application',
            name='diploma_file',
            field=models.FileField(blank=True, null=True, upload_to=core.models.generate_unique_filename, verbose_name='Diplom nusxasi (PDF / Rasm)'),
        ),
        migrations.AddField(
            model_name='application',
            name='diploma_supplement_file',
            field=models.FileField(blank=True, null=True, upload_to=core.models.generate_unique_filename, verbose_name='Diplom ilovasi — fanlar va soatlar (PDF / Rasm)'),
        ),
        migrations.AddField(
            model_name='application',
            name='portfolio_file',
            field=models.FileField(blank=True, null=True, upload_to=core.models.generate_unique_filename, verbose_name='Ijodiy portfolio (5–10 ta ijodiy ish, PDF / ZIP / Rasm)'),
        ),
        migrations.AddField(
            model_name='application',
            name='score_competencies',
            field=models.PositiveIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(20)], verbose_name='2. Kasbiy kompetensiyalarning umumiyligi (maks. 20 ball)'),
        ),
        migrations.AddField(
            model_name='application',
            name='score_creative',
            field=models.PositiveIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(20)], verbose_name='3. Ijodiy kompetensiyalar va mahorat darajasi (maks. 20 ball)'),
        ),
        migrations.AddField(
            model_name='application',
            name='score_credits',
            field=models.PositiveIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(10)], verbose_name="5. O'zlashtirilgan kreditlar (o'quv soatlari) hajmi (maks. 10 ball)"),
        ),
        migrations.AddField(
            model_name='application',
            name='score_experience',
            field=models.PositiveIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(5)], verbose_name="6. Tegishli soha bo'yicha kasbiy ish staji (maks. 5 ball)"),
        ),
        migrations.AddField(
            model_name='application',
            name='score_portfolio',
            field=models.PositiveIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(5)], verbose_name='7. Ijodiy portfolio sifati (maks. 5 ball)'),
        ),
        migrations.AddField(
            model_name='application',
            name='score_qualification',
            field=models.PositiveIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(10)], verbose_name="4. Diplomda ko'rsatilgan kvalifikatsiya nomi (maks. 10 ball)"),
        ),
        migrations.AddField(
            model_name='application',
            name='score_subjects',
            field=models.PositiveIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(30)], verbose_name="1. O'quv rejasidagi fanlarning yaqinligi va mosligi (maks. 30 ball)"),
        ),
        migrations.AddField(
            model_name='application',
            name='total_score',
            field=models.PositiveIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)], verbose_name='Jami ball (100 ballik tizimda)'),
        ),
        migrations.AlterField(
            model_name='application',
            name='admin_note',
            field=models.TextField(blank=True, verbose_name="Komissiya xulosasi / Izoh (Foydalanuvchiga ko'rinadi)"),
        ),
        migrations.AlterField(
            model_name='application',
            name='status',
            field=models.CharField(choices=[('pending', '1-bosqich: Hujjatlar qabul qilindi (Kutilmoqda)'), ('in_progress', "2-bosqich: Dastlabki tekshiruv (Muvofiqlik jadvali bo'yicha)"), ('commission_review', '3-bosqich: Ekspert komissiyasi baholashida (100 ballik tizim)'), ('creative_exam', "3.1-bosqich: Qo'shimcha suhbat / Ijodiy sinov jarayonida"), ('resolved', '4-bosqich: Qabul qilindi (Mos / Turdosh)'), ('conditional_accepted', '4-bosqich: Shartli qabul qilindi (Qisman turdosh)'), ('rejected', '4-bosqich: Rad etildi (Mos emas)'), ('appeal', "Apellyatsiya ko'rib chiqilmoqda")], default='pending', max_length=30, verbose_name='Jarayon bosqichi (Holati)'),
        ),
    ]
