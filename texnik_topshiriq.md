# 📋 TEXNIK TOPSHIRIQ
## O'zbekiston Badiiy Akademiyasi — Malaka Oshirish Markazi Sayti

> **Loyiha nomi:** `uzbamalaka.uz` — Badiiy ta'lim yo'nalishlarida pedagog va mutaxassislar uchun
> **Tur:** Full-Stack Web Ilovasi (SPA + REST API)
> **Holat:** Ishlab chiqilgan, ishlamoqda
> **Sana:** 2026-yil, iyul

---

## 1. LOYIHA HAQIDA UMUMIY MA'LUMOT

**Maqsad:** O'zbekiston Badiiy akademiyasi huzuridagi pedagog va mutaxassis kadrlarni qayta tayyorlash hamda malakasini oshirish markazining rasmiy websayti. Sayt orqali foydalanuvchilar markaz haqida ma'lumot olishlari, kursga ariza topshirishlari, yangiliklar o'qishlari, sertifikat tekshirishlari va murojaat qilishlari mumkin.

**Ishlab chiquvchilar uchun manzillar (local):**

| Xizmat | URL |
|--------|-----|
| Frontend | http://127.0.0.1:3000 |
| Backend API | http://127.0.0.1:8000/api/ |
| Django Admin | http://127.0.0.1:8000/admin/ |

**Production manzil:** https://uzbamalaka.uz

---

## 2. TEXNIK STEK

### 2.1 Backend

| Komponent | Texnologiya | Versiya |
|-----------|-------------|---------|
| Framework | Django | 5.2.2 |
| API | Django REST Framework | 3.16.1 |
| Auth | JWT (SimpleJWT) | 5.5.1 |
| CORS | django-cors-headers | 4.9.0 |
| Admin UI | django-jazzmin | 3.0.1 |
| Ma'lumotlar bazasi | PostgreSQL | psycopg2-binary 2.9.11 |
| Fayl xizmati | WhiteNoise | 6.11.0 |
| Media qayta ishlash | Pillow | 12.1.0 |
| Excel import/export | openpyxl + pandas | 3.1.5 / 3.0.0 |
| Web server (prod) | Gunicorn | 25.0.3 |
| Proksi (prod) | Nginx | — |

### 2.2 Frontend

| Komponent | Texnologiya | Versiya |
|-----------|-------------|---------|
| Framework | React | 19.2.3 |
| Bundler | Vite | 6.2.0 |
| Til | TypeScript | 5.8.2 |
| Router | React Router DOM | 7.13.0 |
| Ikonkalar | Lucide React | 0.563.0 |
| Grafiklar | Recharts | 3.7.0 |
| Excel | XLSX | 0.18.5 |
| Ko'p tillilik | i18next + react-i18next | 23.7.6 |

---

## 3. LOYIHA FAYL STRUKTURASI

```
SAYT/
├── Backend/                         # Django backend
│   ├── core/                        # Asosiy ilova
│   │   ├── models.py                # Barcha ma'lumot modellari (655 qator)
│   │   ├── views.py                 # API ko'rinishlari (887 qator)
│   │   ├── serializers.py           # DRF serializatorlar (19KB)
│   │   ├── urls.py                  # API URL yo'nalishlari
│   │   ├── admin.py                 # Admin panel konfiguratsiyasi
│   │   ├── authentication.py        # Maxsus autentifikatsiya
│   │   ├── signals.py               # Django signallari
│   │   ├── site_urls.py/site_views.py
│   │   └── management/              # Management buyruqlari
│   ├── markaz_backend/              # Django loyiha konfiguratsiyasi
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py / asgi.py
│   ├── media/                       # Yuklangan fayllar
│   ├── templates/                   # HTML shablonlar
│   ├── manage.py
│   ├── requirements.txt
│   └── .env                         # Muhit o'zgaruvchilari
│
├── frontend/                        # React + Vite frontend
│   ├── pages/                       # Sahifalar (11 ta)
│   │   ├── Home.tsx                 # Bosh sahifa (58 KB)
│   │   ├── About.tsx                # Markaz haqida
│   │   ├── Courses.tsx              # Kurslar ro'yxati
│   │   ├── CourseDetail.tsx         # Kurs tafsiloti
│   │   ├── Journal.tsx              # Ilmiy jurnal
│   │   ├── International.tsx        # Xalqaro aloqalar
│   │   ├── Students.tsx             # Tinglovchilar
│   │   ├── OpenData.tsx             # Ochiq ma'lumotlar
│   │   ├── NewsList.tsx             # Yangiliklar ro'yxati
│   │   ├── NewsDetail.tsx           # Yangilik tafsiloti
│   │   └── AdminPanel.tsx           # Admin paneli (78 KB)
│   ├── components/
│   │   ├── Layout.tsx               # Header + Footer
│   │   ├── ArtGallerySection.tsx    # San'at galereyasi
│   │   ├── LanguageSwitcher.tsx     # Til almashtirish
│   │   └── ErrorBoundary.tsx        # Xatolik chegaralash
│   ├── context/
│   │   └── AppContext.tsx           # Global holat
│   ├── services/
│   │   └── backend.ts               # API xizmat qatlami (28 KB)
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── translationService.ts
│   │   └── locales/
│   │       ├── uz.json
│   │       ├── ru.json
│   │       └── en.json
│   ├── App.tsx                      # Marshrutlash
│   ├── index.tsx
│   ├── types.ts                     # TypeScript turlari
│   ├── constants.tsx                # Menyu va konstantalar
│   ├── vite.config.ts
│   ├── .env.local
│   └── package.json
│
├── deploy/
│   └── nginx-uzbamalaka.conf        # Nginx konfiguratsiyasi
├── run-backend-dev.ps1
├── run-frontend-dev.ps1
├── start-dev.ps1
└── start-dev.cmd
```

---

## 4. MA'LUMOTLAR BAZASI MODELLARI (24 ta)

| Model | Maqsad | Asosiy maydonlar |
|-------|--------|-----------------|
| `News` | Yangiliklar | title, content, category (FK), is_important, is_active |
| `NewsImage` | Yangilik rasmlari | news (FK), image, order |
| `NewsCategory` | Yangilik kategoriyalari | name, slug, order, is_active |
| `GalleryItem` | Galereya albomi | title, cover_image, order |
| `GalleryImage` | Albom rasmlari | gallery (FK), image, order |
| `ArtGalleryItem` | San'at asarlari | title, author, image, description |
| `Appeal` | Virtual qabulxona | full_name, appeal_type (murojaat/shikoyat/taklif), phone |
| `Application` | Kursga arizalar | full_name, application_type, workplace, direction |
| `Listener` | Tinglovchi/Sertifikat | full_name, record_type (MO/QT), series, number |
| `Teacher` | O'qituvchilar | full_name, position, degree, title, photo |
| `Personnel` | Xodimlar/Rahbariyat | full_name, position, category (leadership/staff) |
| `Course` | Kurslar | title, course_type, duration, description |
| `JournalIssue` | Jurnal sonlari | year, issue_number, pdf_file, thumbnail |
| `Document` | Hujjatlar | title, category (regulatory/plan/open_data/library), file |
| `Statistics` | Markaz statistikasi (singleton) | total_pedagogs, professors, dotsents, academics, potential |
| `YearlyStatistics` | Yillik statistika | year, professional_development_count, retraining_count |
| `AppContent` | Markaz haqida (singleton) | history, structure, address, contact_info, logos |
| `AppHeroImage` | Hero banner rasmlari | content (FK), image, order |
| `JournalSettings` | Jurnal sozlamalari (singleton) | about_journal, phone, email, social_links |
| `InternationalSettings` | Xalqaro sahifa sozlamalari | hero_title, hero_description, about_text |
| `InternationalPartner` | Xalqaro hamkorlar | name, country, description, photo |
| `InternationalProject` | Xalqaro loyihalar | title, status (planned/ongoing/completed), dates |
| `InternationalProjectImage` | Loyiha rasmlari | project (FK), image, order |
| `InternationalMedia` | Xalqaro media | title, media_type (photo/video), image, youtube_url |

**Muhim xususiyatlar:**
- `BaseModel` — barcha modellarga `created_at`, `updated_at` qo'shadi
- `generate_unique_filename` — UUID asosida noyob fayl nomlari
- `Listener.series` — `record_type` (MO/QT) dan avtomatik to'ldiriladi
- Singleton modellar `get_or_create(pk=1)` orqali

---

## 5. API ENDPOINTLAR

### Asosiy URL: `/api/`

| Endpoint | Metod | Maqsad |
|----------|-------|--------|
| `all-data/` | GET | Barcha ma'lumotlarni bitta so'rovda yuklash |
| `login/` | POST | Maxsus admin login |
| `token/` | POST | JWT token olish |
| `token/refresh/` | POST | JWT tokenni yangilash |

### Router (CRUD) endpointlar

| Resurs | Endpoint | Qo'shimcha |
|--------|----------|-----------|
| Yangiliklar | `/api/news/` | — |
| Yangilik kategoriyalari | `/api/news-categories/` | — |
| Galereya | `/api/gallery/` | — |
| Art galereya | `/api/art-gallery/` | — |
| Murojaatlar | `/api/appeals/` | — |
| Arizalar | `/api/applications/` | — |
| Tinglovchilar | `/api/listeners/` | `search/`, `bulk-import/` |
| O'qituvchilar | `/api/teachers/` | — |
| Xodimlar | `/api/personnel/` | — |
| Kurslar | `/api/courses/` | — |
| Jurnal | `/api/journal/` | — |
| Hujjatlar | `/api/documents/` | — |
| Statistika | `/api/statistics/` | — |
| Yillik statistika | `/api/yearly-statistics/` | — |
| Kontent | `/api/content/` | — |
| Jurnal sozlamalari | `/api/journal-settings/` | — |
| Xalqaro sozlamalar | `/api/international-settings/` | — |
| Xalqaro hamkorlar | `/api/international-partners/` | — |
| Xalqaro loyihalar | `/api/international-projects/` | — |
| Xalqaro media | `/api/international-media/` | — |
| Tinglovchilar (alias) | `/api/pdplans/` | `search/`, `bulk-import/` |

### Ruxsatlar
- **GET:** Hamma uchun ochiq
- **POST/PUT/DELETE:** Faqat adminlar (`IsAdminOrReadOnly`)
- **Admin auth:** JWT token YOKI `Authorization: Bearer static-admin-token`

---

## 6. FRONTEND SAHIFALAR VA MARSHRUTLASH

**Routing:** `HashRouter` (`#/`) — server sozlamasiga bog'liq emas

| Marshrut | Sahifa | Kontent |
|----------|--------|---------|
| `#/` | Home.tsx | Hero slider, statistika, yangiliklar, kurslar, galereya, murojaat |
| `#/about` | About.tsx | Markaz tarixi, tuzilma, xodimlar, o'qituvchilar |
| `#/courses` | Courses.tsx | Kurslar (MO, QT, qisqa MO, kasb o'rganish) |
| `#/courses/:id` | CourseDetail.tsx | Kurs tafsiloti, ariza berish formasi |
| `#/journal` | Journal.tsx | Jurnal sonlari, PDF yuklab olish |
| `#/international` | International.tsx | Hamkorlar, loyihalar, media |
| `#/students` | Students.tsx | Tinglovchilar, sertifikat tekshirish |
| `#/open-data` | OpenData.tsx | Ochiq ma'lumotlar, hujjatlar |
| `#/news` | NewsList.tsx | Yangiliklar ro'yxati va filtrlash |
| `#/news/:id` | NewsDetail.tsx | Yangilik matni, rasmlar galereyasi |
| `#/admin` | AdminPanel.tsx | To'liq CRUD boshqaruv paneli |
| `*` | — | 404 sahifasi |

---

## 7. KO'P TILLILIK (i18n)

**Kutubxona:** `i18next` + `react-i18next` + `i18next-browser-languagedetector`

| Til | Fayl | Holat |
|-----|------|-------|
| O'zbekcha | `uz.json` | Asosiy til |
| Ruscha | `ru.json` | Qo'llab-quvvatlanadi |
| Inglizcha | `en.json` | Qo'llab-quvvatlanadi |

---

## 8. AUTENTIFIKATSIYA TIZIMI

```
1. JWT Token (djangorestframework-simplejwt)
   - Access token: 1 soat
   - Refresh token: 7 kun (rotatsiya bilan)

2. Static Admin Token (maxsus)
   - Token: "static-admin-token"
   - Header: Authorization: Bearer static-admin-token
   - Login: admin / 1212
```

---

## 9. GLOBAL HOLAT (AppContext)

`AppContext.tsx` — barcha sahifalarga umumiy:
- `aboutContent` — logo, manzil, aloqa ma'lumotlari
- `courses` — kurslar ro'yxati
- `statistics` — raqamli statistika

Sahifa yuklanishida `/api/all-data/` chaqiriladi.

---

## 10. DEPLOYMENT

### Local (rivojlantirish)

```powershell
# Birgalikda ishga tushirish:
.\start-dev.ps1

# Yoki alohida:
# Frontend (port 3000):
cd frontend && npm run dev -- --host 127.0.0.1 --port 3000

# Backend (port 8000):
cd Backend && python manage.py runserver 127.0.0.1:8000 --noreload
```

### Production (server)

```
Nginx (443/SSL) → /api/, /media/, /static/ → Gunicorn (Django) :8000
Nginx           → /                         → /var/www/uzbamalaka/frontend/dist/
SSL: Let's Encrypt (uzbamalaka.uz)
```

### Backend .env sozlamalari

```env
DEBUG=True
DJANGO_SECRET_KEY=...
DB_ENGINE=django.db.backends.postgresql
DB_NAME=sayt_db
DB_USER=postgres
DB_PASSWORD=<sizning_parolingiz>
DB_HOST=localhost
DB_PORT=5432
STATIC_ADMIN_USERNAME=admin
STATIC_ADMIN_PASSWORD=<admin_paroli>
STATIC_ADMIN_TOKEN=static-admin-token
```

---

## 11. XAVFSIZLIK ⚠️

> **Ishlab chiqarishda ALBATTA hal qilish kerak:**

1. `SECRET_KEY` — hozir `insecure` prefixli → yangi generatsiya qilish shart
2. `STATIC_ADMIN_TOKEN` — `static-admin-token` → kuchli tokenga almashtirish
3. `DEBUG=False` — produksiyada o'chirish kerak
4. DB paroli `.env` da ochiq → Secrets Manager ishlatish
5. `DEBUG=True` holatida `CORS_ALLOW_ALL_ORIGINS = True` — xavfli

---

## 12. MA'LUMOTLAR OQIMI

```
Brauzer
  │
  ▼
React SPA (HashRouter)
  │
  ├── AppContext ──► /api/all-data/ (sahifa ochilishida)
  │
  ├── services/backend.ts ──► Django REST API
  │                                 │
  │                           PostgreSQL + media/
  │
  └── AdminPanel ──► JWT / Static Token ──► CRUD operatsiyalari
```

---

## 13. ASOSIY FUNKSIONALLIK

### Jamoatchilik uchun:
- ✅ Yangiliklar (ko'p rasmli, kategoriyali)
- ✅ Kurslar katalogi (MO, QT, qisqa MO, kasb)
- ✅ Sertifikat tekshirish (seriya + raqam)
- ✅ Kursga onlayn ariza topshirish
- ✅ Virtual qabulxona (murojaat, shikoyat, taklif)
- ✅ Galereya (foto albomlar + san'at asarlari)
- ✅ Ilmiy jurnal (PDF yuklab olish)
- ✅ Xalqaro aloqalar (hamkorlar va loyihalar)
- ✅ Ochiq ma'lumotlar va hujjatlar
- ✅ Ko'p tillilik (UZ / RU / EN)

### Adminlar uchun:
- ✅ Frontend admin paneli (`#/admin`) — to'liq CRUD
- ✅ Django admin paneli (`/admin/`)
- ✅ Excel orqali ommaviy tinglovchi import
- ✅ Rasm, fayl, PDF yuklash

---

## 14. MUAMMOLAR VA TAVSIYALAR

| # | Muammo | Tavsiya |
|---|--------|---------|
| 1 | `.env.local` da port 8002 edi (tuzatildi → 8000) | Port konfiguratsiyasini sinxron saqlang |
| 2 | `Home.tsx` (58 KB) va `AdminPanel.tsx` (78 KB) | Kichik komponentlarga ajratish kerak |
| 3 | `*_backup.py` fayllar repoda | Git historiyaga o'tkazib o'chirish kerak |
| 4 | SQLite ham mavjud (db.sqlite3) | Faqat PostgreSQL ishlatilsin |
| 5 | `STATIC_ADMIN_TOKEN` = "static-admin-token" | Kuchliroq token yoki faqat JWT ishlatish |
| 6 | TypeScript strict emas | `"strict": true` yoqish tavsiya etiladi |

---

*Hujjat yaratilgan: 2026-07-08 | Tayyorlagan: Antigravity AI tahlil tizimi*
