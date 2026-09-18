import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendTsPath = path.resolve(__dirname, '../services/backend.ts');

// Read the actual services/backend.ts code
let backendContent = fs.readFileSync(backendTsPath, 'utf8');

// Strip out import/export keywords and mock import.meta.env
let cleanedContent = backendContent
  .replace(/import\s+[\s\S]*?;/g, '')
  .replace(/export\s+const\s+BackendAPI/g, 'const BackendAPI')
  .replace(/import\.meta\.env\b/g, '{}'); // Mock import.meta.env

// Use typescript module to transpile TS -> JS
const transpileResult = ts.transpileModule(cleanedContent, {
  compilerOptions: { 
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    removeComments: true
  }
});

const transpiledJs = transpileResult.outputText;

// Setup localStorage Mock
let localStorageStore = {};
const windowMock = {
  localStorage: {
    getItem: (key) => localStorageStore[key] || null,
    setItem: (key, val) => { localStorageStore[key] = String(val); },
    removeItem: (key) => { delete localStorageStore[key]; }
  }
};

// Create a sandbox execution function
function runInSandbox(code, context) {
  const keys = Object.keys(context);
  const values = Object.values(context);
  // Compile the transpiled JS inside a Function
  const fn = new Function(...keys, `${code}; return { toDate, transformTeacher, transformNewsItem, transformPersonnel };`);
  return fn(...values);
}

try {
  const sandboxContext = {
    window: windowMock,
    console: console,
    // safeStorageGet/Set/Remove implementation
    safeStorageGet: (key) => {
      try {
        return windowMock.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    safeStorageSet: (key, val) => {
      try {
        windowMock.localStorage.setItem(key, val);
      } catch {}
    },
    safeStorageRemove: (key) => {
      try {
        windowMock.localStorage.removeItem(key);
      } catch {}
    },
    INITIAL_STATS: {},
    i18n: {
      t: (k) => k,
      get language() {
        return windowMock.localStorage.getItem('i18nextLng') || 'uz';
      }
    }
  };

  // Compile the sandboxed functions
  const { toDate, transformTeacher, transformNewsItem, transformPersonnel } = runInSandbox(transpiledJs, sandboxContext);

  console.log('--- STARTING ADVERSARIAL STRESS-TESTS ---');

  let failedTests = 0;

  function assertEqual(actual, expected, message) {
    if (actual === expected) {
      console.log(`[PASS] ${message}`);
    } else {
      console.error(`[FAIL] ${message}`);
      console.error(`  Expected: ${JSON.stringify(expected)}`);
      console.error(`  Actual:   ${JSON.stringify(actual)}`);
      failedTests++;
    }
  }

  // --- Test Case 1: Date formatting on language switch ---
  console.log('\nRunning Date Formatting Tests...');
  const testDate = '2026-07-17T12:00:00Z';

  // Test Uzbek date formatting
  localStorageStore['i18nextLng'] = 'uz';
  const formattedUz = toDate(testDate);
  console.log(`Uzbek date output: "${formattedUz}"`);
  assertEqual(formattedUz.includes('2026'), true, 'Uzbek date contains year 2026');

  // Test Russian date formatting
  localStorageStore['i18nextLng'] = 'ru';
  const formattedRu = toDate(testDate);
  console.log(`Russian date output: "${formattedRu}"`);
  assertEqual(formattedRu.includes('2026'), true, 'Russian date contains year 2026');

  // Test English date formatting
  localStorageStore['i18nextLng'] = 'en';
  const formattedEn = toDate(testDate);
  console.log(`English date output: "${formattedEn}"`);
  assertEqual(formattedEn.includes('2026'), true, 'English date contains year 2026');

  // Assert they format differently based on locale
  assertEqual(formattedEn !== formattedUz, true, 'English date formatting differs from Uzbek');

  // --- Test Case 2: Null/Empty Date ---
  console.log('\nRunning Empty Date Handling Tests...');
  assertEqual(toDate(undefined), '', 'Should return empty string for undefined date');
  assertEqual(toDate(''), '', 'Should return empty string for empty string date');

  // --- Test Case 3: Missing/Disabled LocalStorage Fallback ---
  console.log('\nRunning LocalStorage Fallback Tests...');
  delete localStorageStore['i18nextLng']; // simulate missing key
  const fallbackDate = toDate(testDate);
  console.log(`Fallback (no localstorage key) date output: "${fallbackDate}"`);
  // Should default to 'uz' (uz-UZ)
  localStorageStore['i18nextLng'] = 'uz';
  const uzExpected = toDate(testDate);
  assertEqual(fallbackDate, uzExpected, 'Should fallback to Uzbek when i18nextLng is missing');

  // --- Test Case 4: Teacher Mapping Dynamic Translation Mappings ---
  console.log('\nRunning Teacher Mapping Tests...');
  const backendTeacher = {
    id: 42,
    full_name: 'Sobir Aliyev',
    position: 'Katta o‘qituvchi',
    position_translated: 'Senior Teacher',
    degree: 'PhD',
    degree_translated: 'Doctor of Philosophy',
    title: 'Dotsent',
    title_translated: 'Associate Professor',
    awards: 'Shuhrat medali',
    photo_url: '/media/teachers/sobir.jpg'
  };

  const transformedTeacher = transformTeacher(backendTeacher);
  assertEqual(transformedTeacher.id, '42', 'Teacher ID is converted to string');
  assertEqual(transformedTeacher.fullName, 'Sobir Aliyev', 'Teacher full name is mapped');
  assertEqual(transformedTeacher.position, 'Katta o‘qituvchi', 'Teacher original position mapped');
  assertEqual(transformedTeacher.position_translated, 'Senior Teacher', 'Teacher translated position mapped');
  assertEqual(transformedTeacher.degree_translated, 'Doctor of Philosophy', 'Teacher translated degree mapped');
  assertEqual(transformedTeacher.title_translated, 'Associate Professor', 'Teacher translated title mapped');

  // --- Test Case 5: Personnel Mapping Inconsistency Check ---
  console.log('\nRunning Personnel Mapping Consistency Tests...');
  const backendPersonnel = {
    id: 10,
    full_name: 'Anvar Karimov',
    position: 'Bosh hisobchi',
    position_translated: 'Chief Accountant',
    phone: '+998901234567',
    email: 'anvar@example.com',
    reception_hours: '9:00 - 12:00',
    photo_url: '/media/personnel/anvar.jpg',
    category: 'staff',
    duties: 'Moliyaviy hisobotlar',
    duties_translated: 'Financial reporting',
    biography: 'Oliy ma’lumotli',
    biography_translated: 'Higher education'
  };

  const transformedPersonnel = transformPersonnel(backendPersonnel);
  assertEqual(transformedPersonnel.position, 'Chief Accountant', 'Personnel position is overwritten with position_translated');

  // --- Summary ---
  console.log('\n--- VERIFICATION SUMMARY ---');
  if (failedTests === 0) {
    console.log('[SUCCESS] All dynamic mapping and locale assertions passed!');
    process.exit(0);
  } else {
    console.error(`[FAILURE] ${failedTests} assertions failed!`);
    process.exit(1);
  }
} catch (e) {
  console.error('Error running sandbox tests:', e);
  process.exit(1);
}
