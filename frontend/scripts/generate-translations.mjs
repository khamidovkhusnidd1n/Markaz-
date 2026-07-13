/**
 * Script: generate-translations.mjs
 * Generates en.json and ru.json from uz.json using MyMemory API
 * Run: node scripts/generate-translations.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'i18n', 'locales');

async function translateText(text, langPair) {
  if (!text || !text.trim()) return text;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(10000) });
    const data = await resp.json();
    if (data?.responseStatus === 200) {
      const t = data.responseData?.translatedText || text;
      if (t === t.toUpperCase() && t.length > 10) return text;
      return t;
    }
  } catch (e) {
    console.warn(`Failed: ${text.substring(0, 30)}... — ${e.message}`);
  }
  return text;
}

async function translateObj(obj, langPair) {
  if (typeof obj === 'string') {
    await new Promise(r => setTimeout(r, 400)); // Rate limit
    return translateText(obj, langPair);
  }
  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const [key, val] of Object.entries(obj)) {
      result[key] = await translateObj(val, langPair);
    }
    return result;
  }
  return obj;
}

async function main() {
  const uzData = JSON.parse(fs.readFileSync(path.join(localesDir, 'uz.json'), 'utf-8'));

  for (const [targetLang, langPair] of [['ru', 'uz|ru'], ['en', 'uz|en']]) {
    console.log(`\nTranslating to ${targetLang.toUpperCase()}...`);
    const translated = await translateObj(uzData, langPair);
    const outPath = path.join(localesDir, `${targetLang}.json`);
    fs.writeFileSync(outPath, JSON.stringify(translated, null, 2), 'utf-8');
    console.log(`Saved: ${outPath}`);
  }
  console.log('\nDone!');
}

main().catch(console.error);
