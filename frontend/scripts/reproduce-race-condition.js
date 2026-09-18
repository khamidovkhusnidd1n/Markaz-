import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contextPath = path.resolve(__dirname, '../context/AppContext.tsx');

let content = fs.readFileSync(contextPath, 'utf8');

// Strip out all imports
let cleaned = content
  .replace(/import\s+[\s\S]*?;/g, '')
  .replace(/export\s+const\s+AppProvider[\s\S]*$/, ''); // We only need refreshData logic

// Let's extract the body of refreshData or simulate it directly based on AppContext.tsx:
//
// const refreshData = useCallback(async () => {
//   setLoading(true);
//   setBackendError(null);
//   try {
//     const data = await BackendAPI.getAllData();
//     setNews(data.news);
//     ...
//

// Let's build a clean simulation of the refreshData and i18n hook reactiveness in AppContext.tsx:
console.log('--- Simulating Language Switcher Race Condition ---');

// We simulate React state
let state = {
  news: [],
  loading: false,
  backendError: null
};

const setters = {
  setNews: (val) => {
    state.news = val;
    console.log(`[State Update] news set to:`, val);
  },
  setLoading: (val) => {
    state.loading = val;
  },
  setBackendError: (val) => {
    state.backendError = val;
  }
};

// Simulated i18n
let currentLanguage = 'uz';

// Mock BackendAPI
const backendDelays = {
  ru: 300, // Russian is slow
  en: 50   // English is fast
};

const BackendAPI = {
  async getAllData() {
    const lang = currentLanguage;
    const delay = backendDelays[lang] || 100;
    console.log(`[API Request] Started fetch for lang: ${lang} (delay: ${delay}ms)`);
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`[API Response] Resolved fetch for lang: ${lang}`);
        resolve({
          news: [{ title: `News in ${lang.toUpperCase()}` }],
          gallery: [],
          teachers: [],
          courses: [],
          personnel: [],
          journalIssues: [],
          documents: [],
          pdPlans: [],
          stats: null,
          about: null,
          journalSettings: null,
          internationalSettings: null,
          internationalPartners: [],
          internationalProjects: [],
          internationalMedia: []
        });
      }, delay);
    });
  }
};

// Simulate refreshData from AppContext.tsx:
async function refreshData() {
  setters.setLoading(true);
  setters.setBackendError(null);
  try {
    const data = await BackendAPI.getAllData();
    setters.setNews(data.news);
  } catch (error) {
    setters.setBackendError(error.message);
  } finally {
    setters.setLoading(false);
  }
}

// Attack Scenario:
// 1. User changes language to 'ru' (starts slower fetch)
// 2. User quickly changes language to 'en' (starts faster fetch)
// 3. 'en' finishes first.
// 4. 'ru' finishes second, overwriting the 'en' state.

async function runRaceTest() {
  console.log('\n--- Starting Race Condition Test ---');
  
  // Step 1: Switch to Russian
  currentLanguage = 'ru';
  const p1 = refreshData();
  
  // Step 2: Switch to English 20ms later
  await new Promise(r => setTimeout(r, 20));
  currentLanguage = 'en';
  const p2 = refreshData();
  
  // Wait for both to finish
  await Promise.all([p1, p2]);
  
  console.log('\n--- Final State check ---');
  console.log(`Active Language: ${currentLanguage}`);
  console.log(`State news content:`, state.news);
  
  if (state.news[0] && state.news[0].title.includes('RU')) {
    console.error('\x1b[31m[FAIL] Race Condition Verified! Stale Russian data overwrote newer English data.\x1b[0m');
    process.exit(1);
  } else {
    console.log('\x1b[32m[PASS] No race condition (or test failed to reproduce).\x1b[0m');
    process.exit(0);
  }
}

runRaceTest();
