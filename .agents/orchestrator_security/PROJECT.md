# Project: Comprehensive Security Audit of Educational Center Website

## Architecture & Attack Surface
- **Backend**: Django 5.1.5 + Django REST Framework 3.15.2, SQLite database (`db.sqlite3`), SimpleJWT 5.4.0.
  - Entry points: `Backend/markaz_backend/urls.py`, `Backend/core/urls.py`, `Backend/core/views.py` (28 ViewSets / API endpoints).
  - Data models: 26 models in `Backend/core/models.py`.
- **Frontend**: React 19.2.3, Vite 6.2.0, TypeScript 5.8.2, React Router 7.13.0, Tailwind CSS CDN.
  - Client state: Centralized `AppContext.tsx` with bulk hydration via `/api/all-data/`.
  - API Service: `frontend/services/backend.ts` with base URL discovery and token storage in `localStorage`.
- **Infrastructure & Deployment**: Nginx reverse proxy configuration (`deploy/nginx-uzbamalaka.conf`), systemd service configs, environment files (`Backend/.env`, `Backend/.env.example`, `frontend/.env.local`).

## Feature & Target Inventory
| # | Target Area | Description | Milestone | Source |
|---|-------------|-------------|-----------|--------|
| 1 | Backend ViewSets & Permissions | Authorization checks, object ownership, public PII endpoints (`/api/appeals/`, `/api/applications/`, `/api/listeners/`, `/api/all-data/`) | M1 | survey_backend |
| 2 | Backend Serializers & Data Binding | Mass assignment, over-posting, read-only field enforcement on sensitive attributes | M1 | survey_backend |
| 3 | Backend Authentication & Admin | `StaticAdminAuthentication` backdoor, `custom_login` bypass, JWT token rotation & missing blacklist | M1 | survey_backend, survey_config |
| 4 | Backend ORM & Injection | Parameterized queries, raw SQL, command execution, path traversal in file uploads | M1 | survey_backend |
| 5 | Frontend Token & Credential Storage | `localStorage` vs HttpOnly cookies, cleartext HTTP candidate fallback in `backend.ts`, hardcoded fallback token | M2 | survey_frontend |
| 6 | Frontend DOM Sinks & XSS | 18 unsanitized `dangerouslySetInnerHTML` sinks, lack of DOMPurify, unsafe YouTube iframe regex | M2 | survey_frontend |
| 7 | Frontend Client-Side Verification | In-memory certificate verification (`pdPlans.find()`), scrapeable registry, client-side voting fraud | M2 | survey_frontend |
| 8 | Configuration & Deployment | `settings.py` security flags, `DEBUG=True`, `ALLOWED_HOSTS`, `CORS_ALLOW_ALL_ORIGINS`, missing `SECURE_PROXY_SSL_HEADER`, incomplete `CSRF_TRUSTED_ORIGINS` | M3 | survey_config |
| 9 | Secrets & Credentials Exposure | Hardcoded `SECRET_KEY`, static tokens in production JS bundle, default admin credentials in `.env.example` | M3 | survey_config |
| 10 | Dependency Vulnerabilities | 11 npm audit CVEs (`xlsx`, `react-router`, `vite`, `rollup`), outdated packages, UTF-16LE requirements encoding | M3 | survey_config |
| 11 | OWASP Top 10 (2021) Matrix | Complete evaluation of A01 through A10 with findings or explicit pass/N/A status | M4 | synthesis |
| 12 | Security Audit Report Generation | Production of prioritized Markdown report in project root (`SECURITY_AUDIT_REPORT.md` / `SECURITY_REPORT.md`) | M5 | report |
| 13 | Multi-Agent Review & Forensic Audit | Technical review, adversarial challenge, and forensic integrity audit | M6 | verification |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M0 | Survey & Inventory | Full codebase exploration across backend, frontend, config | None | DONE |
| M1 | Deep Vulnerability Analysis & OWASP Mapping | Synthesize findings into structured vulnerability catalog and OWASP Top 10 matrix | M0 | IN_PROGRESS |
| M2 | Master Security Report Compilation | Generate comprehensive `SECURITY_AUDIT_REPORT.md` and `SECURITY_REPORT.md` at project root | M1 | PLANNED |
| M3 | Multi-Perspective Verification & Challenge | 2 Reviewers + 2 Challengers verify accuracy, file lines, PoCs, and remediations | M2 | PLANNED |
| M4 | Forensic Integrity Audit & Gate Clearance | `teamwork_preview_auditor` validates authentic, non-fabricated, high-fidelity security analysis | M3 | PLANNED |

## Interface Contracts & File Ownership
- Master Security Report: `SECURITY_AUDIT_REPORT.md` and `SECURITY_REPORT.md` (Project root workspace `C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT`).
- Report Sections:
  1. Executive Summary (Total counts per severity: Critical, High, Medium, Low, Informational)
  2. Scope & Target Inventory
  3. Detailed Findings Ranked by Severity (Critical first):
     - Finding ID, Title, Severity, OWASP Category, CWE
     - Affected Files & Exact Line Numbers
     - Vulnerability Mechanism & Technical Analysis
     - Empirical Proof / Exploit Scenario / Code Evidence
     - Actionable Remediation Code & Configuration Examples
  4. Complete OWASP Top 10 (2021) Evaluation Matrix (A01 to A10)
  5. Configuration & Secrets Assessment Checklist
  6. Strategic Remediation Roadmap (P0 to P3)
