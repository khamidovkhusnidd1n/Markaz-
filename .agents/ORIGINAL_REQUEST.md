# Original User Request

## Initial Request — 2026-07-13T11:29:36Z

Update the existing React frontend and Django backend of the SAYT project by populating it with new content. The content includes a text file (`eskisayttexts.txt` - you'll need to read this from `C:\Users\Salohiddin Markaz\Desktop\eskisayttexts.txt`) containing course details, center history, leadership info, and student rules, as well as a `docs` folder (`C:\Users\Salohiddin Markaz\Desktop\SAYT\docs`) containing related PDF and DOC files to be linked/uploaded as regulatory documents.

Working directory: C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT
Integrity mode: demo

## Requirements

### R1. Populate backend database
Extract text from `C:\Users\Salohiddin Markaz\Desktop\eskisayttexts.txt` and populate the backend database. This should cover all mentioned areas (courses, history, team, journal, international relations, student rules). Do this programmatically (e.g., via a Django management command) or directly if preferred.

### R2. Integrate documents
Incorporate the four files from `C:\Users\Salohiddin Markaz\Desktop\SAYT\docs` into the system. You may choose to upload them via the backend's media system or place them in the frontend's static/public directory. Links to these documents must be added to the relevant frontend sections.

## Acceptance Criteria

### Content Population
- [ ] A script or test hits the backend API endpoints (e.g., `/api/courses/`, `/api/personnel/`, `/api/about/`) and successfully verifies the presence of specific key phrases from `eskisayttexts.txt`.
- [ ] No placeholder text remains in the updated sections.

### Document Integration
- [ ] The four documents from the `docs/` folder are accessible via the frontend UI.
- [ ] Programmatic test: HTTP GET requests to the document URLs return a 200 OK status (no 404s).
