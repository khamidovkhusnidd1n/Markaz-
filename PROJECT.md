# Project: SAYT Content Population and Document Integration

## Architecture
- React frontend under `frontend/`
- Django backend under `Backend/`
- Text data source: `C:\Users\Salohiddin Markaz\Desktop\eskisayttexts.txt`
- Regulatory documents: `C:\Users\Salohiddin Markaz\Desktop\SAYT\docs/`

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Exploration | Inspect the React frontend and Django backend structure, models, API endpoints, and existing placeholders. Read eskisayttexts.txt and check the document files. | None | DONE |
| 2 | Test Suite & E2E | Design a test suite (using pytest or customized verification scripts) to verify backend API contents and document HTTP GET 200 status. | M1 | DONE |
| 3 | Implementation | Populate backend database with text details from eskisayttexts.txt. Upload the four document files and integrate links to them in frontend. Remove all placeholder texts. | M2 | DONE |
| 4 | Verification & Audit | Verify the entire solution against acceptance criteria and perform a Forensic Audit to ensure no placeholders remain and all links function properly. | M3 | DONE |

## Interface Contracts
### Backend APIs
- `/api/courses/` -> Returns course details from the database.
- `/api/personnel/` -> Returns team/leadership/personnel info from the database.
- `/api/about/` -> Returns center history/about details.
- `/api/rules/` or other endpoints -> Returns student rules, journal, international relations (to be verified during Exploration).

### Document Links
- Documents from `docs/` integrated and exposed via React frontend, returning HTTP 200 OK on access.
