# Django + PostgreSQL Sayt Loyihasi

Ushbu repo ichida `Backend/` papkada ishlab turadigan Django backend mavjud. U PostgreSQL bilan bog'langan, Django Admin orqali ma'lumot boshqaradi, DRF API beradi va DTL (`templates/site/`) orqali server-render qilingan sahifalarni ko'rsatadi.

## Django versiyasi

Loyiha `Django==5.2.2` ga moslandi. Bu Django 5.2 seriyasining rasmiy stable relizlaridan biri. Manba: https://docs.djangoproject.com/en/5.2/releases/5.2.2/

## Loyiha tuzilmasi

```text
SAYT/
|-- Backend/
|   |-- manage.py
|   |-- requirements.txt
|   |-- .env.example
|   |-- markaz_backend/
|   |   |-- settings.py
|   |   |-- urls.py
|   |-- core/
|   |   |-- admin.py
|   |   |-- apps.py
|   |   |-- models.py
|   |   |-- urls.py
|   |   |-- site_urls.py
|   |   |-- views.py
|   |   |-- site_views.py
|   |   |-- signals.py
|   |   |-- management/
|   |   |   |-- commands/
|   |   |   |   |-- check_db.py
|   |   |   |   |-- create_admin_role.py
|   |   |   |   |-- seed_sample_data.py
|   |   |-- migrations/
|   |-- templates/
|   |   |-- admin/
|   |   |-- site/
|   |       |-- base.html
|   |       |-- home.html
|   |       |-- news_list.html
|   |       |-- news_detail.html
|   |       |-- course_list.html
|   |       |-- course_detail.html
|-- frontend/
|-- deploy/
```

## PostgreSQL sozlamasi

`Backend/markaz_backend/settings.py` ichida PostgreSQL default bazaga aylantirildi:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'sayt_db',
        'USER': 'postgres',
        'PASSWORD': '<sizning_parolingiz>',
        'HOST': 'localhost',
        'PORT': '5432',
        'CONN_MAX_AGE': 60,
        'CONN_HEALTH_CHECKS': True,
        'ATOMIC_REQUESTS': True,
        'OPTIONS': {
            'connect_timeout': 5,
            'application_name': 'markaz_backend',
        },
    }
}
```

## Asosiy modellar

`core/models.py` ichida quyidagi asosiy modellar ishlatiladi:

- `News` -> `NewsCategory` bilan `ForeignKey`
- `NewsImage` -> `News` bilan `ForeignKey`
- `GalleryItem` -> `GalleryImage` bilan `ForeignKey`
- `Course`
- `Teacher`
- `Personnel`
- `Document`
- `Listener`
- `Statistics`
- `AppContent`

Bu struktura admin panelda kiritilgan ma'lumotni PostgreSQL ga saqlash, API orqali olish va DTL sahifalarda ko'rsatish uchun yetarli darajada kengaytiriladigan qilib tuzilgan.

## Admin panel va role

- Django admin yoqilgan: `/admin/`
- `post_migrate` signal orqali `Content Administrator` guruhi avtomatik yaratiladi
- `create_admin_role` komandasi staff foydalanuvchini shu guruhga qo'shadi
- Admin foydalanuvchi qo'shish, tahrirlash va o'chirish huquqlariga ega bo'ladi

## DTL sahifalar

Quyidagi server-render qilingan sahifalar mavjud:

- `/` -> bosh sahifa
- `/news/` -> yangiliklar ro'yxati
- `/news/<id>/` -> yangilik detali
- `/courses/` -> kurslar ro'yxati
- `/courses/<id>/` -> kurs detali

Bu sahifalar `core/site_views.py` dagi class-based views orqali `DTL` bilan render qilinadi.

## API

DRF endpointlar `Backend/core/urls.py` ichida:

- `/api/news/`
- `/api/news-categories/`
- `/api/gallery/`
- `/api/listeners/`
- `/api/teachers/`
- `/api/personnel/`
- `/api/courses/`
- `/api/documents/`
- `/api/statistics/`
- `/api/content/`
- `/api/all-data/`

## O'rnatish qadamlari

1. Backend papkaga kiring:

```powershell
cd Backend
```

2. Virtual environment yarating:

```powershell
python -m venv .venv
```

3. Virtual environment ni yoqing:

```powershell
.\.venv\Scripts\Activate.ps1
```

4. Kutubxonalarni o'rnating:

```powershell
python -m pip install -r requirements.txt
```

5. `.env` fayl tayyorlang:

```powershell
Copy-Item .env.example .env
```

6. PostgreSQL bazasi mavjud bo'lsa migratsiyani bajaring:

```powershell
python manage.py migrate
```

7. Superuser yarating:

```powershell
python manage.py createsuperuser
```

8. Full-permission admin role ga biriktiring:

```powershell
python manage.py create_admin_role <username>
```

9. Namunaviy ma'lumot yarating:

```powershell
python manage.py seed_sample_data
```

10. Development serverni ishga tushiring:

```powershell
python manage.py runserver
```

Frontend bo'lsa alohida:

```powershell
cd ..\frontend
npm install
npm run dev
```

## Diagnostika buyruqlari

Kutubxonalarni o'rnatish:

```powershell
python -m pip install -r requirements.txt
```

Migratsiya yaratish:

```powershell
python manage.py makemigrations
```

Migratsiya qo'llash:

```powershell
python manage.py migrate
```

Superuser yaratish:

```powershell
python manage.py createsuperuser
```

DB ulanish tekshiruvi:

```powershell
python manage.py check_db
```

Serverni ishga tushirish:

```powershell
python manage.py runserver
```

## PostgreSQL xatolarini ushlash

Loyihada ulanish barqarorligi uchun:

- `CONN_MAX_AGE=60`
- `CONN_HEALTH_CHECKS=True`
- `connect_timeout=5`
- `ATOMIC_REQUESTS=True`
- `check_db` management command
- DTL sahifalarda `db_status` ko'rsatiladi

## Agar DB ulanmasa debug tavsiyalar

1. PostgreSQL servisi ishga tushganini tekshiring.
2. `sayt_db` bazasi yaratilganini tekshiring.
3. `postgres` foydalanuvchi paroli `markaz3210` ekanini tekshiring.
4. `localhost:5432` port band emasligini tekshiring.
5. `psycopg2-binary` o'rnatilganini tekshiring.
6. `python manage.py check_db` ishlatib aniq xabarni ko'ring.
7. `python manage.py migrate --verbosity 2` bilan batafsil migratsiya logini ko'ring.

## Sample data

`python manage.py seed_sample_data` quyidagilarni yaratadi:

- `NewsCategory`
- 1 ta `News`
- 1 ta `Course`
- `Statistics` singleton
- `AppContent` singleton

## Ishga tushirish formatlari

Backend mavjud bo'lsa:

```powershell
python manage.py runserver
```

Frontend mavjud bo'lsa:

```powershell
npm run dev
```

## Eslatma

Repo ichida avvaldan foydalanuvchi tomonidan qilingan boshqa o'zgarishlar ham bor. Ushbu update asosan Django backendni PostgreSQL va DTL talablariga moslab mustahkamladi.
# Markaz-
