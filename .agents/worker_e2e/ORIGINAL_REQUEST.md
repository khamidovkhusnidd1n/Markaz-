## 2026-07-13T11:34:02Z
Create a test suite that programmatically verifies R1 (content population) and R2 (document integration) for the SAYT project.

### Mandate:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

### Objective:
1. Create a Django test file under `Backend/core/` (e.g., `tests_e2e.py` or inside a `tests/` package) that:
   - Sets up or queries backend API endpoints `/api/courses/`, `/api/personnel/`, and `/api/content/`.
   - Asserts the presence of key phrases from the original Uzbek text source `C:\Users\Salohiddin Markaz\Desktop\eskisayttexts.txt` in the API response JSON.
   - Asserts that when hitting the document URLs (e.g., `/media/documents/...` or `/docs/...` or similar), HTTP GET returns a 200 OK response.
   - Asserts that no placeholder texts like "Tez kunda" or "Tez kunda ishga tushadi" exist in `frontend/pages/Students.tsx` and `frontend/pages/Portfolio.tsx`.
2. Write instructions on how to run this test suite.
3. Verify that the test cases fail initially (since the database is not yet populated and placeholders are not yet removed). Run the test command to verify the initial failures and document them in your handoff report.

### Scope Boundaries:
- Only create/modify test files. Do not modify the application logic or populate the database in this milestone.

### Deliverable:
Write a detailed report to `C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\.agents\worker_e2e\handoff.md` and send a message back to the orchestrator (conversation ID: d3028b41-4092-4122-a812-798194b7f4b2) claiming completion. Include the test run results (which should show failing/error status as implementation hasn't happened yet).
