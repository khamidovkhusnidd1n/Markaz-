import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..');
const localesDir = path.resolve(frontendDir, 'i18n/locales');

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

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== 'dist' && f !== '.git') {
        walkDir(dirPath, callback);
      }
    } else {
      if (f.endsWith('.ts') || f.endsWith('.tsx')) {
        callback(dirPath);
      }
    }
  });
}

try {
  const en = readJson('en.json');
  const enKeys = new Set(getDeepKeys(en));

  // Word boundary for t(...) matching
  const dynamicRegex = /\bt\(\s*['"`]([^'"`]+)['"`]/g;
  let missingCount = 0;
  const analyzedFiles = [];

  walkDir(frontendDir, (filePath) => {
    analyzedFiles.push(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    let match;
    dynamicRegex.lastIndex = 0;
    while ((match = dynamicRegex.exec(content)) !== null) {
      const key = match[1];
      // Skip template interpolations or variables passed to t()
      if (key.includes('${') || key.startsWith('`') || key.endsWith('`')) {
        continue;
      }
      if (!enKeys.has(key)) {
        console.warn(`WARNING: Key "${key}" in file ${path.relative(frontendDir, filePath)} is not found in translation files.`);
        missingCount++;
      }
    }
  });

  console.log(`Analyzed ${analyzedFiles.length} ts/tsx files.`);
  console.log(`Total missing translation keys: ${missingCount}`);
  if (missingCount === 0) {
    console.log('SUCCESS: All static translation calls are fully aligned with locale files!');
  }
} catch (e) {
  console.error('Error walking directory:', e);
  process.exit(1);
}
