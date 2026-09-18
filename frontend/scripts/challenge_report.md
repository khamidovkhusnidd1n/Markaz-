# Challenge Report — Adversarial i18n & Date Formatting Review

## Challenge Summary

**Overall risk assessment**: MEDIUM

- While date formatting and key alignment are robustly configured and verified to pass, there is a **Medium Risk** of race conditions in language switching/data fetching due to asynchronous, non-cancellable state updates.

---

## Challenges

### [Medium] Challenge 1: Asynchronous Race Condition in Language Switcher

- **Assumption challenged**: Rapidly switching the application's active language will result in the state and visual components correctly displaying the last selected language's data.
- **Attack scenario**: A user switches languages quickly from Uzbek (`uz`) to Russian (`ru`) and then to English (`en`). This triggers three parallel network calls to the backend via `BackendAPI.getAllData()` (triggered by `useEffect` in `AppProvider` reacting to `i18n.language` changes). If the Russian request (`?lang=ru`) takes longer to resolve than the English request (`?lang=en`), it will resolve last. Since there is no `AbortController` or sequence verification, the older Russian response will overwrite the newer English state, causing a mismatch where the active UI locale is English, but all content shows in Russian.
- **Blast radius**: The application state will contain data for an incorrect language, leading to mismatched static text and dynamic text, confusing the user and breaking the user experience.
- **Mitigation**: Implement an `AbortController` in `BackendAPI.getAllData()` or track a request sequence identifier (or active flag) in `AppProvider` to ignore responses from outdated language selections.

### [Low] Challenge 2: Dead Date Formatting Code in Backend Service

- **Assumption challenged**: The codebase uses a unified date utility for formatting all dates.
- **Attack scenario**: `services/backend.ts` contains a local `toDate` function:
  ```typescript
  const toDate = (value?: string) => {
    if (!value) return '';
    const lang = (i18n.language || 'uz').substring(0, 2);
    const locale = lang === 'en' ? 'en-US' : lang === 'ru' ? 'ru-RU' : 'uz-UZ';
    return new Date(value).toLocaleDateString(locale);
  };
  ```
  However, this function is completely unused in the backend service file and across the application. Components actually use `formatDate` from `services/dateUtils.ts`. Dead code increases cognitive load and maintenance risk. Additionally, the pre-existing test `scripts/stress-test-i18n.js` was specifically testing this dead `toDate` function and failing because it mocked `i18n` as `{ t: (k) => k }` without exposing the `language` property.
- **Blast radius**: Increased maintenance overhead and failing test pipelines due to mocking issues in dead code.
- **Mitigation**: Clean up the dead `toDate` code in `services/backend.ts` and update the test harness to test the live `formatDate` from `services/dateUtils.ts` instead.

---

## Stress Test Results

- **Translation Key Alignment Check**:
  - *Scenario*: Compare flattened keys of `uz.json`, `ru.json`, and `en.json`.
  - *Expected*: All files have exactly the same keys.
  - *Actual*: All files contain exactly 340 aligned keys.
  - *Result*: **PASS**

- **Date Formatting Sub-locale Check**:
  - *Scenario*: Call date formatting with sub-locales like `en-GB`, `ru-UA`, `uz-Latn`.
  - *Expected*: Safely formats without throwing exceptions.
  - *Actual*:
    - `en-GB` formatted as `"7/17/2026"` (resolved to `en-US`).
    - `ru-UA` formatted as `"17.07.2026"` (resolved to `ru-RU`).
    - `uz-Latn` formatted as `"17/07/2026"` (resolved to `uz-UZ`).
  - *Result*: **PASS**

- **Date Formatting Fallback Check**:
  - *Scenario*: Call date formatting with invalid date strings, null, undefined, empty string, or missing language.
  - *Expected*: Returns empty string for empty inputs, as-is string for invalid dates, and defaults to `uz-UZ` for missing language.
  - *Actual*:
    - Null/undefined/empty string returns `""`.
    - `"invalid-date-string"` returns `"invalid-date-string"`.
    - Missing language formats as `"17/07/2026"`.
  - *Result*: **PASS**

---

## Unchallenged Areas

- **Backend localization support**: The server-side API's handling of language queries (`?lang=`) was not stress-tested because the backend code is outside the scope of the React frontend review.
