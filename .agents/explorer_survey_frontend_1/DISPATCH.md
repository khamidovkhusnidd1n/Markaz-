## 2026-09-18T11:57:40Z

You are the Frontend Security Surveyor for the comprehensive security audit of the educational center website.
Working directory: c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\.agents\explorer_survey_frontend_1
Project root: C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT
Authoritative Request: c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\.agents\ORIGINAL_REQUEST.md

Your mission:
Survey the entire frontend codebase in `frontend/` (React, Vite, TypeScript) for client-side security mechanisms, API interactions, and vulnerability hotspots.

Investigation Scope:
1. Map all frontend files, components, pages, routes, state stores, and utility functions (especially `frontend/services/backend.ts`, `frontend/package.json`, Vite configuration, auth contexts).
2. Examine API interaction layer (`backend.ts` etc.): how are tokens handled, stored (e.g. `localStorage` vs `sessionStorage` vs HttpOnly cookies), refreshed, and attached to outgoing requests?
3. Examine Cross-Site Scripting (XSS) risks: check for `dangerouslySetInnerHTML`, raw HTML rendering, unescaped user inputs, dynamic script evaluation (`eval`, `new Function`), unvalidated `href` or `src` attributes (e.g. `javascript:` URIs).
4. Examine client-side routing, protected routes, and role-based access control: are client-side checks easily bypassed, are sensitive UI sections or admin controls exposed to regular users?
5. Examine sensitive data exposure in client bundles or logs: check for hardcoded API keys, secrets in `.env`, debug logging (`console.log(token, credentials)`).

Deliverables:
- Write your comprehensive findings report to `c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\.agents\explorer_survey_frontend_1\survey_frontend.md`.
- Include exact file paths, line numbers, code snippets, component lists, and potential vulnerability indicators.
- Write your structured `handoff.md` in your working directory.
- Send a completion message to the parent orchestrator with a high-level summary and link to your report.
