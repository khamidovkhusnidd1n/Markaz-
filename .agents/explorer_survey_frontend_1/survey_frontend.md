# Frontend Security Survey Report

**Project**: Educational Center Website (`frontend/`)  
**Stack**: React 19, TypeScript 5.8, Vite 6.2, React Router 7.13, Tailwind CSS  
**Survey Date**: 2026-09-18  
**Auditor**: Frontend Security Surveyor (`explorer_survey_frontend_1`)  
**Scope**: Complete static security assessment of `frontend/` codebase  

---

## Executive Summary

A comprehensive client-side security assessment of the React/Vite frontend codebase was conducted. The assessment identified **12 distinct security findings** ranging from **Critical** to **Low** severity across five key dimensions: Token Handling & API Security, Cross-Site Scripting (XSS), Sensitive Data Exposure & PII, Client-Side Routing & Access Control, and Dependency / Configuration Security.

### Severity Distribution

| Severity | Count | Primary Impact |
|:---|:---:|:---|
| **CRITICAL** | 2 | Mass PII leak (citizen complaints, applications) & hardcoded fallback authentication token |
| **HIGH** | 4 | Stored XSS via 18 unsanitized `dangerouslySetInnerHTML` sinks, iframe URL bypass & clickjacking, token storage in `localStorage` + plaintext HTTP fallback, unpatched vulnerable packages (`xlsx` prototype pollution) |
| **MEDIUM** | 4 | Client-side certificate verification bypass, unvalidated `javascript:` dynamic links, build-time Gemini API key injection in `vite.config.ts`, network-exposed dev server (`0.0.0.0`) |
| **LOW / INFO** | 2 | Verbose error stack trace leak in `ErrorBoundary`, unpinned external CDN script without Subresource Integrity (SRI) |
| **Total** | **12** | |

---

## 1. Architectural & Component Map

### 1.1 Core Architecture
- **Framework & Runtime**: React 19.2.3 with Vite 6.2.0 build toolchain and TypeScript 5.8.2.
- **Routing**: `react-router-dom` (v7.13.0) using `HashRouter` (hash-based `#/...` navigation).
- **State Management**: Centralized React Context via `AppContext.tsx` (`AppProvider` / `useApp`). On initial mount and on language change, `AppContext` issues a bulk data fetch to `/all-data/`.
- **API Service Layer**: Centralized in `frontend/services/backend.ts` (`BackendAPI` singleton) using native `fetch` with candidate URL discovery, automatic Bearer token insertion, and 401 refresh interception.
- **Styling**: Tailwind CSS loaded via external CDN script tag in `index.html`.

### 1.2 Component & Route Inventory

| Path / Component | Route | Auth Guard | Key Security Observations |
|:---|:---|:---:|:---|
| `App.tsx` | Root router | None | Mounts all 20 routes without any route-level protection. |
| `components/Layout.tsx` | Global Wrapper | None | Hardcoded link to `/admin/`; unvalidated external links. |
| `components/ErrorBoundary.tsx` | Error Catch | None | Renders unredacted `this.state.stack` to end users. |
| `components/NewsModal.tsx` | Modal | None | `dangerouslySetInnerHTML` XSS; regex-less YouTube iframe check (`.includes('youtube.com')`) without sandbox. |
| `components/ImageModal.tsx` | Modal | None | Unsanitized YouTube iframe embed without sandbox. |
| `components/ArtGallerySection.tsx` | Component | None | Renders art cards and modals. Text escaped by JSX. |
| `context/AppContext.tsx` | Global Store | None | Stores private appeals & student applications in public client state; console logging. |
| `services/backend.ts` | API Client | None | Tokens in `localStorage`; plaintext HTTP fallback; hardcoded fallback token. |
| `pages/Home.tsx` | `/` | Public | Client-side certificate search leaks registry data; Google Maps iframe. |
| `pages/About.tsx` | `/about` | Public | `dangerouslySetInnerHTML` on `aboutContent.history`. |
| `pages/AboutPage.tsx` | `/about/:section` | Public | `dangerouslySetInnerHTML` on `history`, `duties`, and modal duties. |
| `pages/Courses.tsx` | `/courses` | Public | Public course catalog. |
| `pages/CourseDetail.tsx` | `/courses/:id` | Public | Unvalidated social links. |
| `pages/Journal.tsx` | `/journal` | Public | `dangerouslySetInnerHTML` on `aboutJournal` & `articleRulesText`; unvalidated `href`. |
| `pages/Students.tsx` | `/students` | Public | Client-side certificate verification; extracts from in-memory `pdPlans`. |
| `pages/OpenData.tsx` | `/opendata`, `/open-data` | Public | Unvalidated document download `href={doc.fileUrl}`. |
| `pages/NewsList.tsx` | `/news` | Public | News feed; unauthenticated view count increment. |
| `pages/NewsDetail.tsx` | `/news/:id` | Public | `dangerouslySetInnerHTML` on `newsItem.content`. |
| `pages/VirtualQabulxona.tsx` | `/virtual-qabulxona` | Public | Citizen appeal & application submission forms; triggers `refreshData()` loading all database appeals into browser memory. |
| `pages/Departments.tsx` | `/departments` | Public | `dangerouslySetInnerHTML` on tasks and details; unvalidated `videoUrl`. |
| `pages/DepartmentPage.tsx` | `/departments/:slug` | Public | `dangerouslySetInnerHTML` on tasks, details, post contents; unvalidated `videoUrl`. |
| `pages/Library.tsx` | `/library` | Public | Download links `href={item.fileUrl}`. |
| `pages/TrainingPlan.tsx` | `/training-plan` | Public | Client-side PD plans search against in-memory `pdPlans`. |
| `pages/Portfolio.tsx` | `/portfolio` | Public | Voting/view counts manipulated via client `localStorage`. |
| `pages/Teachers.tsx` | `/teachers` | Public | `dangerouslySetInnerHTML` on teacher biography. |
| `pages/PhotoGallery.tsx` | `/photo-gallery` | Public | Gallery albums. |
| `pages/ArtGallery.tsx` | `/art-gallery` | Public | Art gallery page. |
| `pages/ScientificPotential.tsx` | `/scientific-potential` | Public | `dangerouslySetInnerHTML` on teacher biography. |

---

## 2. Detailed Security Findings

### Finding 1: Massive PII & Citizen Confidential Data Leak via Global `/all-data/` Client State
- **Severity**: **CRITICAL**
- **OWASP Category**: A01:2021 – Broken Access Control / A04:2021 – Insecure Design
- **CWE**: CWE-359 (Exposure of Private Personal Information to an Unauthorized Actor), CWE-200 (Exposure of Sensitive Information)
- **Affected Files**:
  - `frontend/context/AppContext.tsx` (lines 33-34, 93-94, 121-122, 175-176)
  - `frontend/services/backend.ts` (lines 314-340, 583-584)
  - `frontend/pages/VirtualQabulxona.tsx` (lines 78, 111)

#### Technical Analysis
In `frontend/services/backend.ts`, `BackendAPI.getAllData()` requests `/all-data/` upon application initialization. The backend returns all citizen appeals (`data.appeals`) and student registration applications (`data.applications`). `backend.ts` transforms these into client-accessible objects:

```typescript
// frontend/services/backend.ts:314-340
function transformAppeal(item: any): Appeal {
  return {
    id: item.id,
    fullName: item.full_name || '',
    appealType: item.appeal_type,
    appealTypeDisplay: item.appeal_type_display || '',
    description: item.description || '', // Citizen's private grievance/complaint text!
    phone: item.phone || '',             // Citizen's personal phone number!
    email: item.email || '',             // Citizen's email address!
    telegramLink: item.telegram_link || '',
    createdAt: item.created_at || '',
  };
}

function transformApplication(item: any): Application {
  return {
    id: item.id,
    fullName: item.full_name || '',
    applicationType: item.application_type,
    applicationTypeDisplay: item.application_type_display || '',
    workplace: item.workplace || '',
    direction: item.direction || '',
    phone: item.phone || '',             // Applicant's phone number!
    telegramLink: item.telegram_link || '',
    createdAt: item.created_at || '',
  };
}
```

In `frontend/context/AppContext.tsx`, these records are stored in global React state:
```typescript
// frontend/context/AppContext.tsx:121-122
setAppeals(data.appeals || []);
setApplications(data.applications || []);
```

Furthermore, in `frontend/pages/VirtualQabulxona.tsx`:
```typescript
// frontend/pages/VirtualQabulxona.tsx:77-78
await BackendAPI.createAppeal(appealForm);
await refreshData(); // Automatically pulls the updated database of ALL appeals into browser memory!
```

#### Exploit Scenario
Neither `appeals` nor `applications` are ever displayed in the public UI. However, any anonymous visitor to the public website:
1. Opens Developer Tools -> Console or Network tab.
2. Inspects the `/api/all-data/` response or reads `window` / React fiber state.
3. Obtains every confidential complaint submitted by citizens (including whistleblowing, private complaints against staff, personal contact numbers, and emails) and all student applicant details.

#### Remediation
1. Remove `appeals` and `applications` from `getAllData()` in `frontend/services/backend.ts` and `frontend/context/AppContext.tsx`.
2. Ensure the backend endpoint `/all-data/` does not serialize or return `Appeal` or `Application` models to unauthenticated users.
3. Dedicated admin endpoints (`/api/appeals/`, `/api/applications/`) must require `IsAdminUser` authentication.

---

### Finding 2: Hardcoded Fallback Authentication Token in Client Code & Compiled Bundle
- **Severity**: **CRITICAL**
- **OWASP Category**: A07:2021 – Identification and Authentication Failures
- **CWE**: CWE-798 (Use of Hard-coded Credentials), CWE-259 (Use of Hard-coded Password)
- **Affected Files**:
  - `frontend/services/backend.ts` (line 701)
  - `frontend/dist/assets/index-dPkb9HHC.js` (line 176)

#### Technical Analysis
In `frontend/services/backend.ts`:
```typescript
// frontend/services/backend.ts:698-702
const data = await response.json().catch(() => ({}));
if (!response.ok || !data.success) {
  throw new Error(data.message || i18n.t('auth.login_failed'));
}

safeStorageSet(TOKEN_KEY, data.token || 'uzbamarkaz-secure-token-9f8a7b6c5d4e3f2a1');
```

Inspection of the production build output in `frontend/dist/assets/index-dPkb9HHC.js:176` proves this static token was compiled verbatim into the client distribution bundle:
```javascript
ai(ti,o.token||"uzbamarkaz-secure-token-9f8a7b6c5d4e3f2a1")
```

#### Exploit Scenario
1. If the backend login response returns `{ "success": true }` without a valid `token` field (or if mock/test responses occur), the client falls back to `'uzbamarkaz-secure-token-9f8a7b6c5d4e3f2a1'`.
2. If the backend accepts this static token as a backdoor or development bypass, any attacker who extracts it from the client JavaScript bundle can authenticate as an administrator.
3. Even if the backend rejects the token, hardcoding predictable pseudotokens in client bundles violates core credential handling principles.

#### Remediation
Remove all fallback strings. If `data.token` is absent, reject authentication immediately:
```typescript
if (!data.token) {
  throw new Error('Authentication failed: No token received');
}
safeStorageSet(TOKEN_KEY, data.token);
```

---

### Finding 3: Widespread Stored Cross-Site Scripting (XSS) via 18 Unsanitized `dangerouslySetInnerHTML` Sinks
- **Severity**: **HIGH**
- **OWASP Category**: A03:2021 – Injection
- **CWE**: CWE-79 (Improper Neutralization of Input During Web Page Generation - XSS)
- **Affected Files & Lines**:
  1. `frontend/pages/About.tsx:58`: `<div dangerouslySetInnerHTML={{ __html: aboutContent.history }} />`
  2. `frontend/pages/AboutPage.tsx:71`: `<div dangerouslySetInnerHTML={{ __html: aboutContent.history }} />`
  3. `frontend/pages/AboutPage.tsx:139`: `<div ... dangerouslySetInnerHTML={{ __html: person.duties }} />`
  4. `frontend/pages/AboutPage.tsx:211`: `<div ... dangerouslySetInnerHTML={{ __html: selectedPerson.duties }} />`
  5. `frontend/components/NewsModal.tsx:168`: `<div dangerouslySetInnerHTML={{ __html: newsItem.content.replace(/\n/g, '<br/>') }} />`
  6. `frontend/pages/NewsDetail.tsx:115`: `<div dangerouslySetInnerHTML={{ __html: newsItem.content.replace(/\n/g, '<br/>') }} />`
  7. `frontend/pages/DepartmentPage.tsx:144`: `<div ... dangerouslySetInnerHTML={{ __html: taskText }} />`
  8. `frontend/pages/DepartmentPage.tsx:159`: `<div ... dangerouslySetInnerHTML={{ __html: task }} />`
  9. `frontend/pages/DepartmentPage.tsx:200`: `<div ... dangerouslySetInnerHTML={{ __html: detailText }} />`
  10. `frontend/pages/DepartmentPage.tsx:224`: `<div dangerouslySetInnerHTML={{ __html: getLocalizedField(task, 'task_text') }} />`
  11. `frontend/pages/DepartmentPage.tsx:342`: `dangerouslySetInnerHTML={{ __html: getLocalizedField(post, 'content') }}`
  12. `frontend/pages/Departments.tsx:129`: `<div ... dangerouslySetInnerHTML={{ __html: taskText }} />`
  13. `frontend/pages/Departments.tsx:170`: `<div ... dangerouslySetInnerHTML={{ __html: detailText }} />`
  14. `frontend/pages/Departments.tsx:194`: `<div dangerouslySetInnerHTML={{ __html: getLocalizedField(task, 'task_text') }} />`
  15. `frontend/pages/Journal.tsx:18`: `dangerouslySetInnerHTML={{ __html: journalSettings.aboutJournal || t('journal.about_fallback') }}`
  16. `frontend/pages/Journal.tsx:69`: `dangerouslySetInnerHTML={{ __html: journalSettings.articleRulesText || t('journal.for_authors_fallback') }}`
  17. `frontend/pages/ScientificPotential.tsx:216`: `<div dangerouslySetInnerHTML={{ __html: (selectedTeacher.biography_translated || selectedTeacher.biography).replace(/\n/g, '<br/>') }} />`
  18. `frontend/pages/Teachers.tsx:151`: `<div dangerouslySetInnerHTML={{ __html: (selectedTeacher.biography_translated || selectedTeacher.biography).replace(/\n/g, '<br/>') }} />`

#### Technical Analysis
The application renders HTML content originating from backend database models (`history`, `duties`, `content`, `detail_text`, `task_text`, `biography`, `aboutJournal`, `articleRulesText`) directly into the DOM using React's `dangerouslySetInnerHTML`.
- **No Sanitizer**: `DOMPurify` (or any equivalent HTML sanitizer) is **not installed** in `package.json` and is never invoked.
- Simply replacing `\n` with `<br/>` (e.g. in `NewsModal.tsx:168` and `NewsDetail.tsx:115`) does not sanitize malicious tags such as `<img src=x onerror=...>`, `<svg onload=...>`, `<iframe src="javascript:...">`, or `<script>`.
- In conjunction with Finding 4 (tokens stored in `localStorage`), any script executed via these sinks can steal `auth_token` and `refresh_token` and exfiltrate them.

#### Remediation
1. Install `dompurify` and `@types/dompurify`:
   ```bash
   npm install dompurify
   npm install -D @types/dompurify
   ```
2. Create a sanitized rendering helper (`frontend/utils/sanitize.ts`):
   ```typescript
   import DOMPurify from 'dompurify';

   export const sanitizeHtml = (dirty: string): string => {
     return DOMPurify.sanitize(dirty, {
       ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4'],
       ALLOWED_ATTR: ['href', 'target', 'rel'],
     });
   };
   ```
3. Wrap all `dangerouslySetInnerHTML` assignments with `sanitizeHtml(...)`.

---

### Finding 4: Insecure Token Storage in `localStorage` Combined with Cleartext HTTP Candidate Fallback
- **Severity**: **HIGH**
- **OWASP Category**: A02:2021 – Cryptographic Failures / A07:2021 – Identification and Authentication Failures
- **CWE**: CWE-922 (Insecure Storage of Sensitive Information), CWE-319 (Cleartext Transmission of Sensitive Information)
- **Affected Files**:
  - `frontend/services/backend.ts` (lines 30-54, 81-103, 122-132)

#### Technical Analysis
1. **Local Storage**: Both `TOKEN_KEY` (`auth_token`) and `REFRESH_KEY` (`refresh_token`) are stored using `window.localStorage`. `localStorage` is accessible by any script running within the origin, rendering tokens vulnerable to extraction via any XSS flaw (such as Finding 3).
2. **Cleartext HTTP Fallback**: In `resolveApiBaseUrls`:
   ```typescript
   // frontend/services/backend.ts:95-98
   for (const host of altHostnames) {
     candidates.add(`https://${host}/api`);
     candidates.add(`http://${host}/api`); // Cleartext HTTP fallback!
   }
   ```
   If an active network adversary intercepts or disrupts HTTPS traffic, `apiRequest` loops through candidates and dispatches the request to `http://${host}/api`, attaching:
   ```typescript
   headers.Authorization = `Bearer ${token}`;
   ```
   This leaks the user's authentication token over unencrypted HTTP.
3. **Unchecked Base URL Cache**: `safeStorageSet(API_URL_CACHE_KEY, successfulBaseUrl)` caches the successful baseUrl in `localStorage`. If poisoned or locked onto `http://`, all subsequent requests transmit Bearer credentials in cleartext.

#### Remediation
1. Transition authentication tokens from client-side `localStorage` to **HttpOnly, Secure, SameSite cookies** managed by the Django backend.
2. Remove all `http://` candidate URLs in production environments:
   ```typescript
   if (window.location.protocol === 'https:') {
     candidates.add(`https://${host}/api`);
     // Do NOT add http://
   }
   ```

---

### Finding 5: Flawed YouTube Iframe Validation Allowing Arbitrary URL Embedding
- **Severity**: **HIGH**
- **OWASP Category**: A03:2021 – Injection / A05:2021 – Security Misconfiguration
- **CWE**: CWE-1021 (Improper Restriction of Rendered UI Layers or Frames), CWE-20 (Improper Input Validation)
- **Affected Files**:
  - `frontend/components/NewsModal.tsx` (lines 104-110, 189-194)
  - `frontend/components/ImageModal.tsx` (lines 56-59, 100-106)

#### Technical Analysis
In `ImageModal.tsx`:
```typescript
// frontend/components/ImageModal.tsx:56-59
const isYouTube = type === 'video' && (url.includes('youtube.com') || url.includes('youtu.be'));
const embedUrl = isYouTube 
  ? url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
  : url;
```
And in `NewsModal.tsx`:
```typescript
// frontend/components/NewsModal.tsx:104-106
{allImages[0].url.includes('youtube.com') || allImages[0].url.includes('youtu.be') ? (
  <iframe 
    src={allImages[0].url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
```

Notice:
1. `url.includes('youtube.com')` is a loose substring check. An attacker-supplied URL such as:
   `https://attacker.com/phish.html?fake=youtube.com`
   passes `.includes('youtube.com')`. The string replacement does nothing, and the malicious URL is passed directly into `<iframe src={embedUrl} />`.
2. Neither iframe includes a `sandbox` attribute. The embedded frame can execute scripts, attempt clickjacking, or prompt users for credentials within the trusted application frame.

#### Remediation
1. Use strict URL parsing and extract only valid YouTube video IDs (alphanumeric, 11 characters):
   ```typescript
   function getYouTubeEmbedUrl(rawUrl: string): string | null {
     try {
       const parsed = new URL(rawUrl);
       let videoId: string | null = null;
       if (parsed.hostname === 'www.youtube.com' || parsed.hostname === 'youtube.com') {
         videoId = parsed.searchParams.get('v');
       } else if (parsed.hostname === 'youtu.be') {
         videoId = parsed.pathname.slice(1);
       }
       if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
         return `https://www.youtube-nocookie.com/embed/${videoId}`;
       }
     } catch {}
     return null;
   }
   ```
2. Add security attributes to the iframe:
   ```html
   <iframe
     src={embedUrl}
     sandbox="allow-scripts allow-same-origin allow-presentation"
     loading="lazy"
   />
   ```

---

### Finding 6: Unused Vulnerable Dependency `xlsx@0.18.5` with Known Prototype Pollution & ReDoS
- **Severity**: **HIGH**
- **OWASP Category**: A06:2021 – Vulnerable and Outdated Components
- **CWE**: CWE-1321 (Improperly Controlled Modification of Object Prototype Attributes - Prototype Pollution), CWE-1333 (Inefficient Regular Expression Complexity)
- **Affected Files**:
  - `frontend/package.json` (line 21)
  - `frontend/package-lock.json`

#### Technical Analysis
`npm audit` reports two HIGH vulnerabilities in `xlsx@0.18.5`:
1. **GHSA-4r6h-8v6p-xvw6** (CVE-2023-30533, CVSS 7.8): Prototype Pollution in SheetJS.
2. **GHSA-5pgg-2g8v-p4x9** (CVSS 7.5): Regular Expression Denial of Service (ReDoS) in SheetJS.

A repository-wide search confirms `xlsx` is **never imported or utilized** anywhere in the frontend codebase. It was added to `package.json` as dead weight.

#### Remediation
Remove `xlsx` from `frontend/package.json`:
```bash
npm uninstall xlsx
```

---

### Finding 7: Client-Side Diploma & Certificate Verification Bypass via In-Memory Scrapeable Registry
- **Severity**: **MEDIUM**
- **OWASP Category**: A04:2021 – Insecure Design / A01:2021 – Broken Access Control
- **CWE**: CWE-602 (Client-Side Enforcement of Server-Side Security)
- **Affected Files**:
  - `frontend/pages/Students.tsx` (lines 38-48)
  - `frontend/pages/Home.tsx` (lines 341-415)
  - `frontend/pages/TrainingPlan.tsx` (lines 20-35)
  - `frontend/context/AppContext.tsx` (lines 40, 100, 128)

#### Technical Analysis
Rather than querying a dedicated backend verification endpoint (e.g. `GET /api/certificates/verify/?number=...`), the entire listener/certificate dataset (`pdPlans`) is downloaded en masse via `/all-data/` to every user's browser. Verification is then performed entirely client-side:
```typescript
// frontend/pages/Students.tsx:38-42
const found = pdPlans.find((item) => {
  if (item.recordType !== searchPrefix) return false;
  const itemNumStr = item.number ? item.number.replace(/^0+/, '') : '';
  return itemNumStr === searchNumStr || item.number === searchVal;
});
```

#### Exploit Scenario
1. Any external actor can extract all valid student names, workplace details, course types, document series, and diploma numbers by inspecting `pdPlans` in React state or network payload.
2. No rate limiting or CAPTCHA exists on certificate lookups because queries never touch the server at search time.
3. Facilitates credential harvesting and targeted forgery of credentials using authentic issued numbers.

#### Remediation
1. Remove `pdPlans` from the bulk `/all-data/` payload.
2. Implement an authenticated or rate-limited server-side verification endpoint:
   `GET /api/certificates/verify/?type=MO&number=000831`
   that returns only the matching record without exposing the rest of the database.

---

### Finding 8: Unvalidated `href` Attributes with `javascript:` URI Risks
- **Severity**: **MEDIUM**
- **OWASP Category**: A03:2021 – Injection
- **CWE**: CWE-79 (Cross-Site Scripting via `javascript:` URI)
- **Affected Files**:
  - `frontend/pages/DepartmentPage.tsx` (line 277: `href={videoUrl}`)
  - `frontend/pages/Departments.tsx` (line 247: `href={videoUrl}`)
  - `frontend/pages/Journal.tsx` (lines 58-61, 73: `href={journalSettings.telegramPrimary}`, etc.)
  - `frontend/pages/OpenData.tsx` (line 105: `href={doc.fileUrl}`)
  - `frontend/pages/TrainingPlan.tsx` (line 138: `href={doc.fileUrl}`)
  - `frontend/pages/Library.tsx` (line 32: `href={item.fileUrl}`)
  - `frontend/pages/Home.tsx` (line 199: `href={aboutContent?.heroVideoUrl}`)

#### Technical Analysis
Links populated from backend models (`videoUrl`, `fileUrl`, `heroVideoUrl`, social links) are assigned directly to `<a href={...}>` without verifying that the URL protocol is `http:` or `https:`. If an administrative user or compromised database record stores a URL beginning with `javascript:alert(document.cookie)` or `javascript:...`, clicking the link executes JavaScript in the user's browser context.

#### Remediation
Create and use a URL validator:
```typescript
export const sanitizeUrl = (url: string | null | undefined): string => {
  if (!url) return '#';
  const trimmed = url.trim();
  if (/^(https?:\/\/|mailto:|tel:|\/)/i.test(trimmed)) {
    return trimmed;
  }
  return '#';
};
```

---

### Finding 9: Build-Time Inlining of Gemini API Key in `vite.config.ts`
- **Severity**: **MEDIUM**
- **OWASP Category**: A05:2021 – Security Misconfiguration
- **CWE**: CWE-200 (Exposure of Sensitive Information)
- **Affected Files**:
  - `frontend/vite.config.ts` (lines 38-41)
  - `frontend/.env.local` (line 1: `GEMINI_API_KEY=PLACEHOLDER_API_KEY`)

#### Technical Analysis
In `frontend/vite.config.ts`:
```typescript
// frontend/vite.config.ts:38-41
define: {
  'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
},
```
Vite's `define` config replaces occurrences of `process.env.GEMINI_API_KEY` and `process.env.API_KEY` at compile-time with the string value of the environment variable. If an engineer configures a real Google Gemini API key in their environment or in `.env.local` when building for production, the key will be permanently embedded into the public JavaScript bundle, exposing it to any user inspecting the site.

#### Remediation
Remove the `define` injection from `vite.config.ts`. AI API keys must never reside in client-side applications; AI interactions must be proxied through the Django backend with proper server-side authentication and rate limiting.

---

### Finding 10: Vite Dev Server Bound to All Network Interfaces (`0.0.0.0`)
- **Severity**: **MEDIUM**
- **OWASP Category**: A05:2021 – Security Misconfiguration
- **CWE**: CWE-1327 (Binding to an Unrestricted IP Address)
- **Affected Files**:
  - `frontend/package.json` (line 7: `"dev": "vite --host"`)
  - `frontend/vite.config.ts` (line 17: `host: '0.0.0.0'`)

#### Technical Analysis
The development script `"dev": "vite --host"` and `vite.config.ts` configuration bind the Vite development server to `0.0.0.0` on port 3000. Additionally, `vite.config.ts` proxies `/admin` directly to Django.
When developers run `npm run dev` on shared local networks (e.g. coffee shops, offices, university Wi-Fi):
1. The development server is accessible to any device on the same local subnet.
2. Given that Vite versions <=6.4.2 suffer from Windows path traversal (GHSA-fx2h-pf6j-xcff) and WebSocket file read flaws (GHSA-p9ff-h696-f583), adjacent network attackers can read files from the developer's computer.

#### Remediation
Default the host to `localhost` / `127.0.0.1`. Only bind to `0.0.0.0` when explicitly required in containerized setups:
```typescript
// vite.config.ts
server: {
  port: 3000,
  host: '127.0.0.1',
}
```

---

### Finding 11: Production Information Disclosure via `ErrorBoundary` Component Stack Dumps
- **Severity**: **LOW**
- **OWASP Category**: A09:2021 – Security Logging and Monitoring Failures
- **CWE**: CWE-209 (Generation of Error Message Containing Sensitive Information)
- **Affected Files**:
  - `frontend/components/ErrorBoundary.tsx` (lines 25, 48-52)

#### Technical Analysis
When a React component throws a rendering error, `ErrorBoundary` renders the unredacted component stack trace and error message directly into the UI:
```typescript
// frontend/components/ErrorBoundary.tsx:48-52
{this.state.stack && (
  <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-white p-3 text-xs text-slate-700">
    {this.state.stack}
  </pre>
)}
```
This reveals local file paths, component names, internal variable states, and architecture details to non-technical users or attackers.

#### Remediation
Condition stack trace rendering on development mode:
```typescript
{import.meta.env.DEV && this.state.stack && (
  <pre className="...">
    {this.state.stack}
  </pre>
)}
```

---

### Finding 12: External CDN Script Inclusion without Subresource Integrity (SRI) or CSP
- **Severity**: **LOW**
- **OWASP Category**: A05:2021 – Security Misconfiguration
- **CWE**: CWE-353 (Missing Support for Integrity Check)
- **Affected Files**:
  - `frontend/index.html` (line 35)

#### Technical Analysis
`index.html` includes Tailwind CSS via an unpinned external script:
```html
<!-- frontend/index.html:35 -->
<script src="https://cdn.tailwindcss.com"></script>
```
1. **Missing SRI**: No `integrity="sha384-..."` or `crossorigin="anonymous"` attribute is specified. If the CDN domain or upstream DNS is compromised, arbitrary JavaScript can be injected into all visitor sessions.
2. **Missing CSP**: `index.html` lacks a `<meta http-equiv="Content-Security-Policy" ...>` tag.

#### Remediation
1. Migrate from the Tailwind CDN runtime script to build-time Tailwind processing using PostCSS / Vite.
2. Add a Content Security Policy header or meta tag restricting script execution.

---

## 3. Client-Side Routing & RBAC Assessment

### 3.1 Route Guards & Protection
- **Finding**: **0 protected routes**. All 20 application routes defined in `App.tsx` render publicly without evaluating authentication or permission state.
- **Admin Isolation**: The frontend does not implement an internal admin dashboard; instead, administrative links (e.g. `Layout.tsx:274`) redirect to `/admin/` (the Django admin panel), which is handled by backend session authentication.
- **Dead Admin Methods**: Although no admin pages exist in `App.tsx`, `frontend/services/backend.ts` exports 25+ administrative CRUD methods (`createNews`, `deleteNews`, `createTeacher`, `saveContent`, `saveStats`, etc.). These increase the bundle size and expose API schemas to client inspection.

### 3.2 Client-Side Logic Integrity
- **Voting Fraud (`Portfolio.tsx:104-120`)**: Project vote and view increment logic relies entirely on `localStorage.setItem('votedProjects', ...)`. Any user can vote thousands of times by executing `localStorage.clear()` in the browser console or issuing automated POST requests directly to `/api/projects/{id}/vote/`.
- **View Fraud (`backend.ts:605-649`)**: View counter increments (`incrementNewsView`, `incrementDepartmentPostView`, `incrementProjectView`) are unauthenticated, unthrottled POST requests without CSRF protection or server-side IP rate limiting.

---

## 4. Prioritized Actionable Remediation Roadmap

| Priority | Action Item | Target Files | Difficulty |
|:---:|:---|:---|:---:|
| **P0** | **Stop Leaking Citizen PII**: Remove `appeals` and `applications` from `/all-data/` and `AppContext.tsx`. | `context/AppContext.tsx`, `services/backend.ts` | Easy |
| **P0** | **Purge Hardcoded Fallback Token**: Remove `'uzbamarkaz-secure-token-9f8a7b6c5d4e3f2a1'`. | `services/backend.ts` | Trivial |
| **P1** | **Sanitize All HTML Sinks**: Install `dompurify` and sanitize all 18 `dangerouslySetInnerHTML` occurrences. | `AboutPage.tsx`, `DepartmentPage.tsx`, `NewsModal.tsx`, `NewsDetail.tsx`, etc. | Moderate |
| **P1** | **Fix Insecure Iframe Embedding**: Implement strict YouTube ID extraction regex and add `sandbox` attributes. | `components/ImageModal.tsx`, `components/NewsModal.tsx` | Easy |
| **P1** | **Uninstall Unused Vulnerable Dependencies**: Remove `xlsx` package. | `package.json`, `package-lock.json` | Trivial |
| **P2** | **Server-Side Certificate Verification**: Migrate certificate verification from client `pdPlans` filter to dedicated backend endpoint. | `pages/Students.tsx`, `pages/Home.tsx` | Moderate |
| **P2** | **Sanitize Dynamic URLs**: Whitelist `http:`, `https:`, `mailto:`, `tel:` schemes on all dynamic `href` links. | `Journal.tsx`, `DepartmentPage.tsx`, `OpenData.tsx` | Easy |
| **P2** | **Remove Build-Time API Key Injection**: Delete `define` from `vite.config.ts`. | `vite.config.ts` | Trivial |
| **P3** | **Dev Server Hardening**: Bind Vite to `127.0.0.1` instead of `0.0.0.0`. | `vite.config.ts`, `package.json` | Trivial |
| **P3** | **Redact Production Error Stacks**: Wrap `this.state.stack` in `import.meta.env.DEV`. | `components/ErrorBoundary.tsx` | Trivial |
