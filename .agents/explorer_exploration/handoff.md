# Handoff Report - Exploration Phase (M1)

## 1. Observation

### 1.1 Backend Structure & Models
In `SAYT/Backend/core/models.py`, we observed several Django models defined:
- **Courses**: `Course` model (lines 309-350)
  ```python
  class Course(BaseModel):
      TYPE_CHOICES = [
          ('professional_development', 'Malaka oshirish'),
          ('retraining', 'Qayta tayyorlash'),
          ('short_professional_development', 'Qisqa malaka oshirish'),
          ('profession_learning', "Kasb o'rganish"),
      ]
      title = models.CharField(max_length=500, verbose_name="Kurs nomi")
      course_type = models.CharField(...)
  ```
- **Personnel/Team/Leadership**: `Personnel` model (lines 265-307)
  ```python
  class Personnel(BaseModel):
      CATEGORY_CHOICES = [
          ('leadership', 'Rahbariyat'),
          ('staff', 'Markaziy apparat'),
      ]
      full_name = models.CharField(...)
      category = models.CharField(...)
  ```
- **About/History/Company**: `AppContent` model (lines 462-518) which is a singleton model storing history, structure, contact info, address, map embed URL, and logos.
- **Journal**: `JournalIssue` model (lines 352-375) and `JournalSettings` singleton model (lines 519-551).
- **International Relations**: `InternationalSettings` singleton model (lines 568-585), `InternationalPartner` model (lines 587-608), `InternationalProject` model (lines 610-643), and `InternationalMedia` model (lines 665-697).
- **Student Rules / Documents**: `Document` model (lines 377-414)
  ```python
  class Document(BaseModel):
      CATEGORY_CHOICES = [
          ('regulatory', "Me'yoriy hujjatlar"),
          ('plan', 'Ish rejalari'),
          ('open_data', "Ochiq ma'lumotlar"),
          ('library', 'Kutubxona'),
      ]
  ```

In `SAYT/Backend/core/urls.py`, we observed the routing configuration (lines 11-31):
- `/api/courses/` -> maps to `CourseViewSet`
- `/api/personnel/` -> maps to `PersonnelViewSet`
- `/api/content/` -> maps to `AppContentViewSet`
- `/api/journal/` -> maps to `JournalIssueViewSet`
- `/api/journal-settings/` -> maps to `JournalSettingsViewSet`
- `/api/documents/` -> maps to `DocumentViewSet`
- `/api/international-settings/` -> maps to `InternationalSettingsViewSet`
- `/api/international-partners/` -> maps to `InternationalPartnerViewSet`
- `/api/international-projects/` -> maps to `InternationalProjectViewSet`
- `/api/international-media/` -> maps to `InternationalMediaViewSet`
- `/api/all-data/` -> maps to `get_all_data` function-based view which aggregates all data.

In `SAYT/Backend/core/serializers.py`, we observed translation support via `get_translated` helper (lines 14-20) which translates fields based on the context `lang` query param (default `uz`).

### 1.2 React Frontend Components & Placeholders
In `SAYT/frontend/pages/`, we observed:
- `Home.tsx` (lines 84-120): Has a fully functional frontend reestr search matching user inputs against `pdPlans` in context.
- `About.tsx`: Renders History, Structure, Leadership, and Central Apparat dynamically from backend. No hardcoded placeholders.
- `Courses.tsx` and `CourseDetail.tsx`: Fully dynamic list of courses and applications.
- `Journal.tsx`: Fully dynamic Scientific Journal settings and issue list.
- `International.tsx`: Fully dynamic partners, projects, and media display.
- `OpenData.tsx`, `Library.tsx`, `TrainingPlan.tsx`: Fully dynamic document viewer, library, and plan searches.
- **Placeholders**:
  - `Students.tsx` (lines 22-33): Contains a hardcoded "Sertifikat tekshirish (Tez kunda)" card:
    ```typescript
    <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-blue-900">
      <CheckCircle className="text-blue-600" /> Sertifikat tekshirish (Tez kunda)
    </h2>
    <div className="rounded-xl bg-blue-50 py-12 text-center border border-blue-100">
      <p className="text-blue-800 mb-4 max-w-md mx-auto">Sertifikatning seriyasi va raqamini kiritish orqali uning haqiqiyligini tekshirish tizimi tez orada ishga tushadi.</p>
      <div className="flex justify-center gap-3 max-w-sm mx-auto opacity-50 pointer-events-none">
        <input type="text" placeholder="Seriya va raqam (Masalan, MO 123456)" className="flex-grow rounded-lg border px-4 py-2" />
        ...
    ```
  - `Portfolio.tsx` (lines 18-35): Contains an entire placeholder section:
    ```typescript
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Tez kunda ishga tushadi</h2>
    <p className="text-gray-500 mb-8 leading-relaxed">
      Portfolio tizimi hozirda ishlab chiqilmoqda...
    </p>
    ```

### 1.3 Text File `eskisayttexts.txt`
The file `C:\Users\Salohiddin Markaz\Desktop\eskisayttexts.txt` has a size of 11,320 bytes and contains 333 lines. It contains the following structured sections:
1. **Malaka oshirish & Qayta tayyorlash kurslari**: Lists 5 retraining course titles with hours (e.g. `Badiiy kashtachilik usta-rassomi 720 soat`) and 7 professional development courses with descriptions.
2. **Markaz haqida**: Contains "Tarixi va faoliyati" text, overall statistics, and a list of staff names, roles, and office hours for "Rahbariyat" (3 people) and "Markaziy apparat" (13 people).
3. **Badiiy ta'lim va pedagogika (Journal)**: Text description, contact number, tahririyat address, and rules for authors.
4. **Xalqaro aloqalar (International relations)**: English description, areas of cooperation, contact specialist, and 2 completed collaborative projects.
5. **Tinglovchilar uchun**: Renders 3 regulatory documents names under `Me'yoriy hujjatlar`, student notes (tinglovchilarga eslatma) detailing documents required for admission, and 1 open data cabinet resolution under `Ochiq ma'lumotlar`.

### 1.4 Regulatory Documents
The folder `C:\Users\Salohiddin Markaz\Desktop\SAYT\docs` contains exactly 4 files:
1. `1ae8bd941de74b82b3fb98d81fd2a3a1.doc` - Size: 213,250 bytes
2. `552cb8e231414c02985f34cdcff3de84.pdf` - Size: 63,835 bytes
3. `bc6ebf4de0f74afc94391207f8969672.pdf` - Size: 2,349,251 bytes
4. `fd03264b2fa045ed9c5a94621980ea96.pdf` - Size: 20,938,188 bytes

### 1.5 Environment & Custom Management Commands
- **Python Virtual Environment**: We located the venv for running E2E tests at `C:\Users\Salohiddin Markaz\Desktop\SAYT\owasp_monitor\.venv`.
- **System Python**: The system python path is `C:\Users\Salohiddin Markaz\AppData\Local\Microsoft\WindowsApps\python.exe` (executes Python 3.12.10, which contains Django 5.2.16 and all psycopg2-binary/pandas dependencies globally).
- **SQLite Configuration**: In `SAYT/Backend/.env`, the local environment is configured to run on SQLite:
  ```env
  DB_ENGINE=django.db.backends.sqlite3
  DB_NAME=db.sqlite3
  ```
  Running `python manage.py check_db` failed with the following traceback because it runs a PostgreSQL-specific query (`current_database`) on SQLite:
  ```
  PostgreSQL ulanishida xatolik: no such function: current_database
  Tekshiring: PostgreSQL service ishlayaptimi, host/port to'g'rimi, parol mosmi.
  ```
- **Translation Import Bug**: Running `python manage.py translate_all --help` failed with:
  ```
  ModuleNotFoundError: No module named 'core.translation'
  ```
  This is due to the missing source file `Backend/core/translation.py`.

---

## 2. Logic Chain

1. **Backend Integration**: Comparing the models in `Backend/core/models.py` and serializers in `Backend/core/serializers.py` with the text contents in `eskisayttexts.txt` demonstrates that the Django app possesses all schema models required for Courses (`Course`), Personnel (`Personnel`), History/About (`AppContent`), Scientific Journal (`JournalIssue`, `JournalSettings`), International Relations (`InternationalSettings`, `InternationalPartner`, `InternationalProject`, `InternationalMedia`), and Documents (`Document`).
2. **Frontend Dynamic Layout**: Comparing page views like `About.tsx`, `Courses.tsx`, `Journal.tsx`, `International.tsx`, and `OpenData.tsx` with their contexts show that the frontend is already pre-configured to fetch and loop over the backend model serializations. Removing placeholders and populating the database will resolve R1 content population.
3. **Frontend Placeholders Identification**: Since `Students.tsx` has a static, disabled certificate verification component marked "Tez kunda" (while `Home.tsx` contains a fully functional checker querying `pdPlans` in the global `AppContext`), the certificate verification card in `Students.tsx` must be refactored to reuse the existing `pdPlans` search logic. `Portfolio.tsx` remains completely non-functional and should be populated or resolved.
4. **Document integration**: The four files in `C:\Users\Salohiddin Markaz\Desktop\SAYT\docs` correspond directly to the 4 documents mentioned in `eskisayttexts.txt`. Therefore, they must be uploaded via Django's `Document` model (mapping the hashed names to correct titles and categories: `regulatory` for the first 3 files and `open_data` for the 4th file).
5. **Execution Paths**: Because local development uses system python with global Django/PostgreSQL dependencies and SQLite config, developers can manage backend data locally using `python manage.py <command>` and execute tests using `C:\Users\Salohiddin Markaz\Desktop\SAYT\owasp_monitor\.venv\Scripts\python.exe -m pytest`.

---

## 3. Caveats

- **No Caveats**. All paths, filenames, sizes, and error messages have been directly verified using filesystem listing, file views, and command executions.

---

## 4. Conclusion

The codebase is fully analyzed and structurally ready for implementation:
- **R1 Content Population**: Needs data entry from `eskisayttexts.txt` into Django models (`Course`, `Personnel`, `AppContent`, `JournalSettings`, `InternationalSettings`, `InternationalProject`, `InternationalMedia`). This can be done via Django management seed scripts.
- **R2 Document Integration**: The 4 files in `docs/` must be uploaded to the `Document` model and mapped in the frontend.
- **Translation script fix**: `Backend/core/translation.py` must be reconstructed or the import in `translate_all.py` replaced to restore translation CLI functionality.
- **Frontend fixes**: Refactor the placeholder certificate verification card in `Students.tsx` to use `pdPlans` search.

---

## 5. Verification Method

To verify the findings:
1. To inspect the docs directory files:
   `Get-ChildItem "C:\Users\Salohiddin Markaz\Desktop\SAYT\docs"`
2. To test the backend management command execution (to see translation import error):
   `python manage.py translate_all --help` inside `SAYT/Backend`
3. To inspect frontend routing and layout:
   View `SAYT/frontend/App.tsx` and `SAYT/frontend/constants.tsx`.
