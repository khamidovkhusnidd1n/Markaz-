import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localesDir = path.resolve(__dirname, '../i18n/locales');

function readJson(filename) {
  return JSON.parse(fs.readFileSync(path.join(localesDir, filename), 'utf8'));
}

function getDeepKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getDeepKeys(obj[key], prefix + key + '.'));
    } else {
      keys.push(prefix + key);
    }
  }
  return keys;
}

try {
  const en = readJson('en.json');
  const ru = readJson('ru.json');
  const uz = readJson('uz.json');

  const enKeys = getDeepKeys(en);
  const ruKeys = getDeepKeys(ru);
  const uzKeys = getDeepKeys(uz);

  console.log(`English keys count: ${enKeys.length}`);
  console.log(`Russian keys count: ${ruKeys.length}`);
  console.log(`Uzbek keys count: ${uzKeys.length}`);

  let mismatches = 0;

  // Compare EN and RU
  const missingInRu = enKeys.filter(k => !ruKeys.includes(k));
  const extraInRu = ruKeys.filter(k => !enKeys.includes(k));

  // Compare EN and UZ
  const missingInUz = enKeys.filter(k => !uzKeys.includes(k));
  const extraInUz = uzKeys.filter(k => !enKeys.includes(k));

  if (missingInRu.length > 0) {
    console.error('Missing in ru.json:', missingInRu);
    mismatches += missingInRu.length;
  }
  if (extraInRu.length > 0) {
    console.error('Extra keys in ru.json:', extraInRu);
    mismatches += extraInRu.length;
  }
  if (missingInUz.length > 0) {
    console.error('Missing in uz.json:', missingInUz);
    mismatches += missingInUz.length;
  }
  if (extraInUz.length > 0) {
    console.error('Extra keys in uz.json:', extraInUz);
    mismatches += extraInUz.length;
  }

  if (mismatches === 0) {
    console.log('SUCCESS: All localization files are perfectly aligned!');
    process.exit(0);
  } else {
    console.error(`FAILURE: Found ${mismatches} key mismatches!`);
    process.exit(1);
  }
} catch (e) {
  console.error('Error running key alignment script:', e);
  process.exit(1);
}
