# E2E Test Infra: SAYT Content Population and Document Integration

## Test Philosophy
- Requirement-driven, verifying both backend data population and frontend document access.
- Non-disruptive, works with Django's native test framework and/or a custom verification script.

## Feature Inventory
| # | Feature | Source | Tier 1 (Coverage) | Tier 2 (Boundary) |
|---|---------|--------|------------------|------------------|
| 1 | Course API Endpoint | R1 (Content) | `/api/courses/` returns course list from eskisayttexts.txt | Empty database handles gracefully |
| 2 | Personnel API Endpoint | R1 (Content) | `/api/personnel/` returns personnel list with correct names | Categories ('leadership', 'staff') correctly assigned |
| 3 | About API Endpoint | R1 (Content) | `/api/content/` returns center history and stats | Singleton model initialized if empty |
| 4 | Document Access URLs | R2 (Docs) | Document links return 200 OK | Handles doc names and file types |
| 5 | Placeholder Verification | R1, R2 | Check frontend files to ensure no "Tez kunda" placeholders remain in updated sections | Check React routing / rendering |

## Test Architecture
- **Verification Runner**: Python-based test script (or Django test suite) running in `SAYT/Backend`.
- **Command**: `python manage.py test` or a custom test runner script.
- **Verification Target**:
  - Backend API client endpoints.
  - Presence of files in static/media directory.
  - Absence of placeholder strings in `frontend/pages/Students.tsx` and `frontend/pages/Portfolio.tsx`.

## Real-World Application Scenarios (Tier 4)
- **Scenario 1**: Populate database and query all APIs, asserting exact Uzbek content details.
- **Scenario 2**: Check document URLs on the web application or filesystem path mapping.
