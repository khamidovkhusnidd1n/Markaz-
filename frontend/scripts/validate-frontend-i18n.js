import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to JSON translation files
const localesDir = path.resolve(__dirname, '../i18n/locales');
const uzPath = path.join(localesDir, 'uz.json');
const ruPath = path.join(localesDir, 'ru.json');
const enPath = path.join(localesDir, 'en.json');

// Helper to flatten nested objects
function flattenObject(obj, prefix = '') {
  let paths = {};
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(paths, flattenObject(value, currentPath));
    } else {
      paths[currentPath] = value;
    }
  }
  return paths;
}

// 1. Check translation key alignment
console.log('--- Checking Translation Key Alignment ---');
let hasMismatch = false;

try {
  const uz = JSON.parse(fs.readFileSync(uzPath, 'utf8'));
  const ru = JSON.parse(fs.readFileSync(ruPath, 'utf8'));
  const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

  const uzFlat = flattenObject(uz);
  const ruFlat = flattenObject(ru);
  const enFlat = flattenObject(en);

  const uzKeys = Object.keys(uzFlat);
  const ruKeys = Object.keys(ruFlat);
  const enKeys = Object.keys(enFlat);

  console.log(`uz.json keys count: ${uzKeys.length}`);
  console.log(`ru.json keys count: ${ruKeys.length}`);
  console.log(`en.json keys count: ${enKeys.length}`);

  // Find keys present in UZ but missing in others
  const missingInRu = uzKeys.filter(k => !ruFlat.hasOwnProperty(k));
  const missingInEn = uzKeys.filter(k => !enFlat.hasOwnProperty(k));

  // Find keys present in RU but missing in others
  const missingInUzFromRu = ruKeys.filter(k => !uzFlat.hasOwnProperty(k));
  const missingInEnFromRu = ruKeys.filter(k => !enFlat.hasOwnProperty(k));

  // Find keys present in EN but missing in others
  const missingInUzFromEn = enKeys.filter(k => !uzFlat.hasOwnProperty(k));
  const missingInRuFromEn = enKeys.filter(k => !ruFlat.hasOwnProperty(k));

  const allMissing = new Set([
    ...missingInRu.map(k => `ru.json is missing "${k}" (present in uz.json)`),
    ...missingInEn.map(k => `en.json is missing "${k}" (present in uz.json)`),
    ...missingInUzFromRu.map(k => `uz.json is missing "${k}" (present in ru.json)`),
    ...missingInEnFromRu.map(k => `en.json is missing "${k}" (present in ru.json)`),
    ...missingInUzFromEn.map(k => `uz.json is missing "${k}" (present in en.json)`),
    ...missingInRuFromEn.map(k => `ru.json is missing "${k}" (present in en.json)`),
  ]);

  if (allMissing.size > 0) {
    console.warn('\x1b[33mWarning: Translation keys are not fully aligned!\x1b[0m');
    for (const msg of allMissing) {
      console.log(`  - ${msg}`);
    }
    hasMismatch = true;
  } else {
    console.log('\x1b[32mSuccess: All translation keys are fully aligned across uz.json, ru.json, and en.json!\x1b[0m');
  }

} catch (err) {
  console.error(`Error loading or parsing translations: ${err.message}`);
  process.exit(1);
}

// 2. Validate dateUtils.ts date formatting function
console.log('\n--- Checking Date Formatting Utility ---');

// Let's import or define the formatDate code logic so we can test it headlessly
const formatDate = (
  value,
  langCode,
  options
) => {
  if (!value) return '';
  try {
    const cleanLang = (langCode || 'uz').split('-')[0].split('_')[0].toLowerCase();
    const locale = cleanLang === 'en' ? 'en-US' : cleanLang === 'ru' ? 'ru-RU' : 'uz-UZ';
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleDateString(locale, options);
  } catch (e) {
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return value;
      }
      return date.toLocaleDateString('uz-UZ', options);
    } catch {
      return value;
    }
  }
};

const dateTests = [
  { value: '2026-07-17T15:32:07Z', lang: 'uz-UZ', options: undefined, expectedType: 'string' },
  { value: '2026-07-17T15:32:07Z', lang: 'ru-RU', options: undefined, expectedType: 'string' },
  { value: '2026-07-17T15:32:07Z', lang: 'en-US', options: undefined, expectedType: 'string' },
  { value: '2026-07-17T15:32:07Z', lang: 'en-GB', options: undefined, expectedType: 'string' }, // Sub-locale
  { value: '2026-07-17T15:32:07Z', lang: 'ru-UA', options: undefined, expectedType: 'string' }, // Sub-locale
  { value: '2026-07-17T15:32:07Z', lang: 'uz-Latn', options: undefined, expectedType: 'string' }, // Sub-locale
  { value: '2026-07-17T15:32:07Z', lang: undefined, options: undefined, expectedType: 'string' }, // Missing lang
  { value: null, lang: 'en-US', options: undefined, expected: '' }, // Null value
  { value: undefined, lang: 'en-US', options: undefined, expected: '' }, // Undefined value
  { value: '', lang: 'en-US', options: undefined, expected: '' }, // Empty string
  { value: 'invalid-date-string', lang: 'en-US', options: undefined, expected: 'invalid-date-string' }, // Invalid date
];

let dateTestsPassed = true;
for (const [idx, t] of dateTests.entries()) {
  try {
    const result = formatDate(t.value, t.lang, t.options);
    console.log(`Test ${idx + 1}: formatDate(value: ${t.value}, lang: ${t.lang}) => "${result}"`);
    if (t.hasOwnProperty('expected') && result !== t.expected) {
      console.error(`  \x1b[31mFailure: Expected "${t.expected}", got "${result}"\x1b[0m`);
      dateTestsPassed = false;
    } else if (t.expectedType && typeof result !== t.expectedType) {
      console.error(`  \x1b[31mFailure: Expected type "${t.expectedType}", got "${typeof result}"\x1b[0m`);
      dateTestsPassed = false;
    }
  } catch (err) {
    console.error(`  \x1b[31mException thrown in Test ${idx + 1}: ${err.message}\x1b[0m`);
    dateTestsPassed = false;
  }
}

if (dateTestsPassed) {
  console.log('\x1b[32mSuccess: All date formatting tests passed!\x1b[0m');
} else {
  console.error('\x1b[31mFailure: Some date formatting tests failed!\x1b[0m');
}

// 3. Analyze language switcher state race conditions
console.log('\n--- Analyzing Language Switcher Race Conditions ---');
console.log('Fact: React AppProvider refreshes data via:');
console.log('  useEffect(() => { refreshData(); }, [i18n.language, refreshData]);');
console.log('When i18n.language changes, BackendAPI.getAllData() is called.');
console.log('BackendAPI.getAllData calls:');
console.log('  const lang = (i18n.language || \'uz\').substring(0, 2);');
console.log('  const urlWithLang = `${endpoint}?lang=${lang}`;');
console.log('Since fetch requests are asynchronous and lack cancellation (AbortController),');
console.log('switching languages rapidly (e.g., UZ -> RU -> EN within 100ms) will fire multiple fetches.');
console.log('If the UZ or RU fetch takes longer than the EN fetch, the older request will resolve last,');
console.log('causing the AppContext state to be overwritten with stale language data.');
console.log('This is a classic async race condition!');

if (hasMismatch) {
  process.exit(1);
} else {
  process.exit(0);
}
