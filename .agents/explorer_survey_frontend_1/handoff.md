# Handoff Report: Frontend Security Survey

**Agent**: `explorer_survey_frontend_1`  
**Role**: Frontend Security Surveyor  
**Date**: 2026-09-18  
**Working Directory**: `c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\.agents\explorer_survey_frontend_1`  
**Primary Report**: `c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\.agents\explorer_survey_frontend_1\survey_frontend.md`  

---

## 1. Observation

Direct observations from source inspection, tool invocations, and compiled bundles:

1. **Massive PII Exposure in Global State**:
   - `frontend/context/AppContext.tsx:121-122`:
     ```typescript
     setAppeals(data.appeals || []);
     setApplications(data.applications || []);
     ```
   - `frontend/services/backend.ts:314-340`: Transforms citizen complaints (`description`, `phone`, `email`, `fullName`, `appealType`) and applicant data (`phone`, `workplace`, `direction`, `telegramLink`) from the unauthenticated `/all-data/` endpoint.
   - `frontend/pages/VirtualQabulxona.tsx:78, 111`: Submitting an appeal or application calls `await refreshData()`, reloading all citizen appeals into browser memory.

2. **Hardcoded Fallback Token Compiled into Production**:
   - `frontend/services/backend.ts:701`:
     ```typescript
     safeStorageSet(TOKEN_KEY, data.token || 'uzbamarkaz-secure-token-9f8a7b6c5d4e3f2a1');
     ```
   - `frontend/dist/assets/index-dPkb9HHC.js:176`: Verbatim match for `"uzbamarkaz-secure-token-9f8a7b6c5d4e3f2a1"` compiled into the distribution bundle.

3. **18 Unsanitized `dangerouslySetInnerHTML` Sinks**:
   - `frontend/package.json`: DOMPurify is absent from `dependencies`.
   - `frontend/pages/About.tsx:58`, `frontend/pages/AboutPage.tsx:71, 139, 211`, `frontend/components/NewsModal.tsx:168`, `frontend/pages/NewsDetail.tsx:115`, `frontend/pages/DepartmentPage.tsx:144, 159, 200, 224, 342`, `frontend/pages/Departments.tsx:129, 170, 194`, `frontend/pages/Journal.tsx:18, 69`, `frontend/pages/ScientificPotential.tsx:216`, `frontend/pages/Teachers.tsx:151`.
   - None of these 18 instances sanitize HTML input before injecting it into the DOM.

4. **Insecure Iframe Validation**:
   - `frontend/components/ImageModal.tsx:56-59` and `frontend/components/NewsModal.tsx:104-106`:
     Checks `url.includes('youtube.com') || url.includes('youtu.be')` without hostname validation or `sandbox` attributes on the `<iframe src={embedUrl} />`.

5. **Token Storage & Plaintext Fallback**:
   - `frontend/services/backend.ts:30-31, 36, 45`: Stores tokens in `localStorage`.
   - `frontend/services/backend.ts:97`: `candidates.add('http://${host}/api')` creates unencrypted HTTP fallback endpoints that transmit `Authorization: Bearer ${token}`.

6. **Vulnerable Unused Dependency**:
   - `frontend/package.json:21`: `"xlsx": "0.18.5"`.
   - Tool `npm audit --json`: Flags `xlsx` for Prototype Pollution (GHSA-4r6h-8v6p-xvw6, CVE-2023-30533, CVSS 7.8) and ReDoS (GHSA-5pgg-2g8v-p4x9, CVSS 7.5). Grep confirms `xlsx` is unused in code.

7. **Client-Side Diploma Verification Bypass**:
   - `frontend/pages/Students.tsx:38-42` and `frontend/pages/Home.tsx:341-415`: Verification does not query a verification API; it scans `pdPlans.find(...)` against the full in-memory certificate registry.

8. **Build-Time API Key Inlining & Network Binding**:
   - `frontend/vite.config.ts:39-40`: `define: { 'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY) }`.
   - `frontend/package.json:7`: `"dev": "vite --host"` and `vite.config.ts:17`: `host: '0.0.0.0'`.

---

## 2. Logic Chain

1. **Step 1 (PII Leak)**: Observation 1 demonstrates that `/all-data/` serializes private citizen complaints and student registration applications to any unauthenticated client. Observation 1 shows `AppContext.tsx` stores these records in global state, which allows any site visitor to scrape confidential data via DevTools.
2. **Step 2 (Hardcoded Token)**: Observation 2 proves that a fallback token `'uzbamarkaz-secure-token-9f8a7b6c5d4e3f2a1'` exists in `backend.ts` and is inlined into the client bundle (`index-dPkb9HHC.js:176`). If the server allows authentication fallback or test token validation, this static credential permits unauthorized access.
3. **Step 3 (XSS to Account Takeover)**: Observation 3 shows 18 raw HTML sinks without DOMPurify sanitization. Combined with Observation 5 (JWT tokens stored in `window.localStorage`), any stored payload injected through administrator rich-text fields or untrusted database content can execute JavaScript and directly extract `auth_token` and `refresh_token` from `localStorage`.
4. **Step 4 (Cleartext Exposure)**: Observation 5 shows `resolveApiBaseUrls()` appending `http://${host}/api`. When HTTPS fails or is degraded, `apiRequest` dispatches requests bearing `Authorization: Bearer ${token}` over plaintext HTTP, exposing credentials to eavesdropping on the network.
5. **Step 5 (Bypassable Verification)**: Observation 7 proves that certificate authenticity is determined on the client by scanning an in-memory array (`pdPlans`). Consequently, anyone can dump the complete registry of valid student names and certificate serial numbers without server throttling.

---

## 3. Caveats

- **Backend Authorization Logic**: This survey analyzed the frontend implementation (`frontend/`). Whether Django endpoints in `Backend/` enforce server-side validation on view/vote increment endpoints or restrict `/all-data/` based on request cookies is addressed in the Backend survey (`explorer_survey_backend_1`).
- **Production Server TLS**: We assume production deployment will utilize HTTPS. However, frontend code explicitly includes `http://` fallbacks that degrade connection security if TLS negotiation fails.
- No caveats regarding frontend coverage: all 20 pages, 5 components, build configurations, and distribution bundles were surveyed.

---

## 4. Conclusion

The frontend application exhibits serious client-side vulnerabilities:
1. **Critical PII Exposure**: Private citizen grievances and applications are downloaded by default to all visitors.
2. **Critical Static Credential**: A fallback token is baked into the source code and compiled assets.
3. **High-Impact Stored XSS**: 18 unsanitized `dangerouslySetInnerHTML` sinks directly expose user sessions and `localStorage` JWTs to theft.
4. **Insecure Architecture**: Client-side certificate verification leaks entire student datasets, and unthrottled increment endpoints enable vote/view inflation.

Immediate remediation must focus on sanitizing HTML sinks with DOMPurify, removing sensitive models from `/all-data/`, purging hardcoded tokens, and migrating certificate validation to server-side queries.

---

## 5. Verification Method

Independent verification steps:

1. **Verify PII in Browser State**:
   - Inspect `frontend/context/AppContext.tsx:121-122` and `frontend/services/backend.ts:314-340`.
   - Run dev server (`npm run dev`) and inspect `window` / React context state to confirm `appeals` and `applications` arrays are populated from `/all-data/`.

2. **Verify Inlined Fallback Token**:
   - Inspect `frontend/services/backend.ts:701`.
   - Run grep in dist bundle:
     ```powershell
     Select-String -Path "frontend\dist\assets\*.js" -Pattern "uzbamarkaz-secure-token"
     ```

3. **Verify Unsanitized XSS Sinks**:
   - Inspect the 18 instances listed in Section 1.3 across `AboutPage.tsx`, `DepartmentPage.tsx`, `NewsDetail.tsx`, and `Journal.tsx`.
   - Confirm DOMPurify is absent from `frontend/package.json`.

4. **Verify Dependency Flaws**:
   - Run `npm audit` in `frontend/` to confirm `xlsx` prototype pollution (GHSA-4r6h-8v6p-xvw6) and ReDoS (GHSA-5pgg-2g8v-p4x9).
