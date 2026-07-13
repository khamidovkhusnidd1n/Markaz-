## 2026-07-13T11:36:40Z
You are a worker agent. Your working directory is C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\.agents\implementation_track\. Your mission is to implement R1 (content population) and R2 (document integration) for the SAYT project, and remove all placeholders from the React frontend pages.

### Mandate:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

### Objectives:
1. **R1 Backend Seeding**:
   - Write a database seeder script or Django management command that reads `C:\Users\Salohiddin Markaz\Desktop\eskisayttexts.txt` and programmatically populates the Django models: `Course`, `Personnel`, `AppContent`, `JournalSettings`, `InternationalSettings`, `InternationalProject`, etc.
   - Resolve the translation module import bug in `translate_all.py` (e.g. create the missing `core/translation.py` file or adjust imports) so that database seeding/translation commands function correctly.
2. **R2 Document Integration**:
   - Programmatically copy the 4 document files from `C:\Users\Salohiddin Markaz\Desktop\SAYT\docs` into the Django backend's media path (ensure directories are created).
   - Create 4 corresponding `Document` records in the database with correct file paths, titles, and categories (e.g., regulatory documents, open data) matching the info in `eskisayttexts.txt`.
3. **Frontend Placeholders Refactoring**:
   - In `frontend/pages/Students.tsx`, refactor the hardcoded, disabled "Sertifikat tekshirish (Tez kunda)" verification form. Connect it to the actual certificate/reestr search logic (using the same search engine/context state as the home page search).
   - In `frontend/pages/Portfolio.tsx`, replace the "Tez kunda ishga tushadi" placeholder with a dynamic, functional page. For example, fetch personnel and international projects dynamically and display a clean gallery/list of team portfolios or project portfolios.
4. **Verification**:
   - Run the Django E2E tests: `python manage.py test core.tests_e2e`. Make sure all 5 tests pass successfully.
   - Run frontend build/compilation check to ensure no TypeScript or packaging errors are introduced.

### Scope Boundaries:
- Do not hardcode API responses to make tests pass. The database MUST contain the populated records and the APIs must serve them dynamically.

### Deliverable:
Write a detailed handoff report to `C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\.agents\implementation_track\handoff.md` containing files modified, seeding scripts used, and verified build/test outputs. Send a message back to the orchestrator (conversation ID: d3028b41-4092-4122-a812-798194b7f4b2) once done.
