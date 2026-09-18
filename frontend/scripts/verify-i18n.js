#!/usr/bin/env node

/**
 * Script: verify-i18n.js
 * Static analyzer to check for hardcoded user-visible strings in React components/pages.
 * Supports TypeScript AST parser (if typescript package is installed) with an automated
 * fallback to regular expression line-by-line scanning.
 * 
 * Usage: node scripts/verify-i18n.js [directory]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default directory to scan: frontend folder (parent of scripts)
const defaultScanDir = path.resolve(__dirname, '..');

// Parse CLI args
const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : defaultScanDir;

console.log(`Starting i18n verification in: ${targetDir}`);

let tsModule = null;
if (!process.env.FORCE_REGEXP) {
  try {
    // Try to load typescript dynamically
    const imported = await import('typescript');
    tsModule = imported.default && typeof imported.default.createSourceFile === 'function' ? imported.default : imported;
    console.log('TypeScript module loaded. Using AST-based analysis (High Precision).');
  } catch (e) {
    console.log('TypeScript module not found. Falling back to RegExp-based analysis (Heuristics).');
  }
} else {
  console.log('FORCE_REGEXP is set. Falling back to RegExp-based analysis (Heuristics).');
}



// Stats tracking
let totalFilesChecked = 0;
let totalViolations = 0;
const results = {};

// Helper to check if string contains translation candidate
function isTranslationCandidate(str) {
  const trimmed = str.trim();
  if (!trimmed) return false;

  // Exclude false-positive programmatic keys, hashes, and context developer errors
  const ignoredPatterns = [
    /must be used within/i,
    /Could not find root element/i,
    /^ariza$/i,
    /^murojaat$/i,
    /^shikoyat$/i,
    /^taklif$/i,
    /^professional_development$/i,
    /^retraining$/i
  ];
  if (ignoredPatterns.some(pat => pat.test(trimmed))) {
    return false;
  }

  // Skip CSS blocks: contains '{' and '}' and at least one CSS rule (e.g., property: value structure)
  if (trimmed.includes('{') && trimmed.includes('}') && /[\w-]+\s*:\s*[^;]+/.test(trimmed)) {
    return false;
  }

  // 1. Contains Cyrillic characters (100% translatable candidate)
  if (/[\u0400-\u04FF]/.test(trimmed)) return true;

  // 2. Contains Uzbek Latin-specific apostrophe words (e.g. o'rganing, yo'l, ko'rish, San'at)
  // Matching letters followed by an apostrophe/single quote and more letters
  if (/\b[a-zA-Z]+['’‘`ʻ][a-zA-Z]+\b/.test(trimmed)) return true;

  // 3. Contains spaces and letters (sentence-like) and is not a class/path/CSS
  const hasMultipleWords = /\b[a-zA-Z]{2,}\b[.,?!:;()[\]{}]*\s+[.,?!:;()[\]{}]*\b[a-zA-Z]{2,}\b/.test(trimmed);
  
  if (hasMultipleWords) {
    // Exclude common Tailwind / CSS patterns
    // A string is Tailwind/CSS if and only if EVERY whitespace-separated word in it is a valid CSS/Tailwind utility
    const isTailwindOrCss = trimmed.split(/\s+/).every(word => {
      // A Tailwind/CSS class cannot contain Uzbek/Cyrillic specific characters/apostrophes
      if (/[а-яА-ЯёЁ\u0400-\u04FF]/.test(word)) return false;
      if (/['’‘`ʻ]/.test(word)) return false;

      // If the word contains typical class characters:
      // E.g., text-red-500, hover:bg-white, w-1/2, max-h-screen, bg-[#000], p-4
      if (word.includes('-') || word.includes(':') || word.includes('/') || word.includes('[') || word.includes('#') || word.includes('.') || word.includes('!') || word.includes('@')) {
        // Make sure it doesn't look like a URL or a file path
        if (word.startsWith('/') || word.startsWith('http://') || word.startsWith('https://') || word.startsWith('www.')) {
          return false;
        }
        return true;
      }

      // Exact known Tailwind/CSS keywords (including common short ones and utility names)
      const exactKeywords = new Set([
        'flex', 'grid', 'block', 'hidden', 'inline', 'table', 'contents',
        'relative', 'absolute', 'fixed', 'sticky', 'static',
        'container', 'shadow', 'rounded', 'border', 'outline', 'ring',
        'italic', 'underline', 'overline', 'line-through',
        'transition', 'transform', 'cursor', 'resize', 'select',
        'shrink', 'grow', 'wrap', 'nowrap', 'visible', 'invisible',
        'collapse', 'aspect', 'auto', 'full', 'screen', 'min', 'max',
        'top', 'bottom', 'left', 'right', 'inset', 'gap', 'z',
        'px', 'py', 'mx', 'my', 'mt', 'mb', 'pt', 'pb', 'pl', 'pr',
        'w', 'h', 'p', 'm', 'col', 'row', 'duration', 'delay', 'ease',
        'origin', 'scale', 'rotate', 'translate', 'skew', 'opacity',
        'mix', 'blend', 'text', 'bg', 'fill', 'stroke',
        // Whitelisted Tailwind typography/helper classes
        'uppercase', 'lowercase', 'capitalize', 'normal-case', 'truncate',
        // Common custom/CSS class name parts
        'active', 'open', 'show', 'btn', 'card', 'header', 'footer', 'nav', 'menu', 'logo', 'sidebar', 'content',
        'item', 'list', 'link', 'button', 'input', 'label', 'icon', 'title', 'subtitle', 'desc', 'wrapper',
        'inner', 'outer', 'main', 'app', 'page', 'modal', 'popup', 'dialog', 'tooltip', 'badge', 'hero',
        'banner', 'section', 'box', 'panel', 'form', 'group', 'control', 'invalid', 'valid', 'focus', 'hover',
        'checked', 'selected', 'loading', 'success', 'warning', 'danger', 'info', 'primary', 'secondary',
        'dark', 'light', 'white', 'black', 'gray', 'red', 'blue', 'green', 'yellow', 'indigo', 'purple', 'pink'
      ]);

      return exactKeywords.has(word.toLowerCase());
    });
    
    const isPath = /^[\/\.\\]/.test(trimmed);
    const isUrl = /^(https?:\/\/|www\.)/.test(trimmed);

    if (!isTailwindOrCss && !isPath && !isUrl) return true;
  }

  // 4. Check for known Uzbek/Russian words of 3+ letters that don't match tailwind
  const uzbekWords = [
    'yopish', 'xatolik', 'nomalum', 'nomaʼlum', 'korish', 'tasdiqlash', 'bekor', 'haqida', 
    'tuzilmasi', 'ustozlar', 'aloqa', 'boglanish', 'ilmiy', 'pedagog', 'malaka', 'oshirish', 
    'pedagoglar', 'mutaxassis', 'toshkent', 'shahar', 'tuman', 'kocha', 'ariza', 'yuborish', 
    'reestr', 'sertifikat', 'diplom', 'kirish', 'chiqish', 'ortish', 'tepaga', 'pastga', 
    'yangiliklar', 'kutubxona', 'qabul', 'qabulxona', 'murojaat', 'shikoyat', 'taklif', 
    'ta\'lim', 'tashkil', 'matbuot', 'axborot', 'texnologiyalari', 'xalqaro', 'dasturlari', 
    'tinglovchilar', 'reestr', 'loyihalar', 'tashkiliy', 'tarixi', 'faoliyati',
    'markaz', 'rahbariyat', 'apparat', 'apparati', 'virtual', 'qayta', 'tayyorlash', 'va', 
    'monitoringi', 'oquv', 'jarayonini', 'jarayon', 'etish', 'aloqalarni', 'rivojlantirish', 
    'talim', 'meyoriy', 'hujjatlar', 'hujjat', 'jurnal', 'uchun', 'rejasi', 'reja', 'portfolio', 
    'tekshirish', 'masofaviy', 'ochiq', 'malumotlar', 'malumot', 'elonlar', 'elon', 'fotogalereya', 
    'galereya', 'salohiyat', 'qidirish', 'barcha', 'huquqlar', 'himoyalangan', 'tomonidan', 'ishlab', 
    'chiqilgan', 'biz', 'bilan', 'manzil', 'telefon', 'elektron', 'pochta', 'batafsil', 'oqish', 
    'songgi', 'raqamlarda', 'barchasini', 'ko\'rish', 'salom', 'parol', 'parolim', 'foydalanuvchi', 'ism', 
    'familiya', 'yordam', 'izlash', 'hudud', 'til', 'sozlama', 'profil', 'tadbir', 'maqola', 
    'arizalar', 'sana', 'ish', 'joyi', 'yonalish', 'yonalishi', 'muddati', 'topilmadi', 'urinish', 
    'eslatma', 'bosh', 'sahifa', 'soat', 'soatlari', 'jamoa', 'azolari', 'hamkorlar', 'hamkorlik', 
    'loyiha', 'davlat', 'talablari', 'talablar', 'admin', 'panel', 'tizim', 'saqlash', 'ochish', 
    'tahrirlash', 'ochirish', 'yangi', 'yonalishlar', 'sertifikatlar', 'diplomlar', 'reestri', 'eslatmalar'
  ];
  
  const lowercase = trimmed.toLowerCase()
    .replace(/['’‘`ʻ]/g, '')
    .replace(/[.,?!:;()[\]{}]/g, '');

  const matchedUzbek = uzbekWords.some(word => {
    if (lowercase.startsWith(word)) {
      const diff = lowercase.length - word.length;
      if (diff === 0) return true;
      if (word.length >= 3 && diff > 0 && diff <= 15) {
        return true;
      }
    }
    return false;
  });

  if (matchedUzbek) return true;

  return false;
}

// AST-based implementation
function analyzeWithAST(filePath, content) {
  const ts = tsModule;
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
  const findings = [];

  // Manually build parent pointers since ts.createSourceFile does not do it automatically
  function setParents(node, parent = null) {
    if (parent) {
      node.parent = parent;
    }
    ts.forEachChild(node, child => setParents(child, node));
  }
  setParents(sourceFile);

  function checkAndRecord(value, node, type, contextDesc) {
    if (isTranslationCandidate(value)) {
      const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
      findings.push({
        line: line + 1,
        column: character + 1,
        value: value.trim(),
        type,
        context: contextDesc
      });
    }
  }

  function visit(node) {
    // Check JsxText
    if (node.kind === ts.SyntaxKind.JsxText) {
      checkAndRecord(node.text, node, 'JSX Text', 'JSX element child');
    }

    // Check StringLiteral, NoSubstitutionTemplateLiteral & TemplateExpression
    if (
      node.kind === ts.SyntaxKind.StringLiteral ||
      node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral ||
      node.kind === ts.SyntaxKind.TemplateExpression
    ) {
      let curr = node;
      let parent = node.parent;
      let isExcluded = false;
      let contextDesc = 'JS/TS String literal';

      // Check JSX Attribute context recursively
      let jsxAttrParent = null;
      let p = node.parent;
      while (p) {
        if (p.kind === ts.SyntaxKind.JsxAttribute) {
          jsxAttrParent = p;
          break;
        }
        if (
          p.kind === ts.SyntaxKind.JsxElement ||
          p.kind === ts.SyntaxKind.JsxSelfClosingElement ||
          p.kind === ts.SyntaxKind.Block ||
          p.kind === ts.SyntaxKind.ArrowFunction ||
          p.kind === ts.SyntaxKind.FunctionExpression ||
          p.kind === ts.SyntaxKind.FunctionDeclaration
        ) {
          break;
        }
        p = p.parent;
      }

      if (jsxAttrParent) {
        const attrName = jsxAttrParent.name && typeof jsxAttrParent.name.text === 'string' ? jsxAttrParent.name.text : '';
        const userVisibleAttrs = ['placeholder', 'alt', 'title', 'label', 'aria-label', 'description'];
        if (!userVisibleAttrs.includes(attrName)) {
          isExcluded = true;
        } else {
          contextDesc = `JSX Attribute: ${attrName}`;
        }
      }

      if (!isExcluded) {
        let crossedFunctionBoundary = false;
        while (parent) {
          // Exclude imports/exports
          if (
            parent.kind === ts.SyntaxKind.ImportDeclaration ||
            parent.kind === ts.SyntaxKind.ExportDeclaration ||
            parent.kind === ts.SyntaxKind.ImportSpecifier ||
            parent.kind === ts.SyntaxKind.ExportSpecifier
          ) {
            isExcluded = true;
            break;
          }

          // Exclude TS Type constructs
          const kindName = ts.SyntaxKind[parent.kind] || '';
          if (
            kindName.startsWith('Type') ||
            kindName.endsWith('Type') ||
            kindName.endsWith('TypeNode') ||
            kindName === 'InterfaceDeclaration' ||
            kindName === 'TypeAliasDeclaration' ||
            kindName === 'TypeLiteral' ||
            kindName === 'TypeAssertionExpression' ||
            kindName === 'TypeAssertion' ||
            kindName === 'AsExpression' ||
            kindName === 'SatisfiesExpression'
          ) {
            const isAssertion = parent.kind === ts.SyntaxKind.AsExpression ||
                                parent.kind === ts.SyntaxKind.TypeAssertionExpression ||
                                (ts.SyntaxKind.SatisfiesExpression && parent.kind === ts.SyntaxKind.SatisfiesExpression);
            if (isAssertion && parent.expression === curr) {
              // Do not exclude the expression part of type assertion. Continue walking up.
            } else {
              isExcluded = true;
              break;
            }
          }

          // Exclude CSS style blocks
          if (parent.kind === ts.SyntaxKind.JsxElement) {
            const tagName = parent.openingElement && parent.openingElement.tagName && parent.openingElement.tagName.text;
            if (tagName === 'style') {
              isExcluded = true;
              break;
            }
          }
          if (parent.kind === ts.SyntaxKind.JsxSelfClosingElement) {
            const tagName = parent.tagName && parent.tagName.text;
            if (tagName === 'style') {
              isExcluded = true;
              break;
            }
          }

          // Stop hook exclusions at function boundaries
          if (
            parent.kind === ts.SyntaxKind.ArrowFunction ||
            parent.kind === ts.SyntaxKind.FunctionExpression ||
            parent.kind === ts.SyntaxKind.FunctionDeclaration ||
            parent.kind === ts.SyntaxKind.MethodDeclaration ||
            parent.kind === ts.SyntaxKind.Constructor ||
            parent.kind === ts.SyntaxKind.GetAccessor ||
            parent.kind === ts.SyntaxKind.SetAccessor
          ) {
            crossedFunctionBoundary = true;
          }

          // Exclude translation calls, logs, and common hooks
          if (parent.kind === ts.SyntaxKind.CallExpression) {
            if (!crossedFunctionBoundary) {
              const expr = parent.expression;
              let funcName = '';
              if (ts.isIdentifier(expr)) {
                funcName = expr.text;
              } else if (ts.isPropertyAccessExpression(expr)) {
                funcName = expr.name.text;
                if (ts.isIdentifier(expr.expression)) {
                  const objName = expr.expression.text;
                  if (objName === 'console') funcName = 'console.' + funcName;
                }
              }

              const excludedFuncs = [
                't', 'console.log', 'console.error', 'console.warn', 'console.info', 
                'useState', 'useRef', 'useEffect', 'useCallback', 'useMemo', 
                'changeLanguage', 'require', 'resolve', 'join', 'addEventListener', 
                'removeEventListener', 'querySelector', 'getElementById', 'split',
                'includes', 'endsWith', 'startsWith', 'slice', 'reduce', 'map',
                'filter', 'find', 'forEach', 'push', 'setInterval', 'clearInterval',
                'setTimeout', 'clearTimeout'
              ];

              if (excludedFuncs.includes(funcName)) {
                isExcluded = true;
                break;
              }
            }
          }

          // Exclude object keys/values that are configuration
          if (parent.kind === ts.SyntaxKind.PropertyAssignment) {
            let propName = '';
            if (parent.name && (ts.isIdentifier(parent.name) || ts.isStringLiteral(parent.name))) {
              propName = parent.name.text;
            }
            const excludedProps = [
              'className', 'path', 'url', 'icon', 'type', 'key', 'id', 'method', 
              'color', 'size', 'variant', 'align', 'font', 'bgColor', 
              'borderColor', 'spacing', 'width', 'height', 'padding', 'margin', 
              'fontWeight', 'fontSize', 'lineHeight', 'letterSpacing', 'display', 
              'position', 'top', 'bottom', 'left', 'right', 'zIndex', 'transition', 
              'animation', 'transform', 'cursor', 'opacity', 'overflow', 'visibility'
            ];

            const isInitializer = parent.initializer === curr;

            if (propName && excludedProps.includes(propName) && isInitializer) {
              isExcluded = true;
              break;
            } else if (propName) {
              contextDesc = `Object property: ${propName}`;
            }
          }

          curr = parent;
          parent = parent.parent;
        }
      }

      if (!isExcluded) {
        let typeLabel = 'String Literal';
        let value = '';
        if (node.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
          typeLabel = 'Template Literal (No Sub)';
          value = node.text;
        } else if (node.kind === ts.SyntaxKind.TemplateExpression) {
          typeLabel = 'Template Literal';
          value = node.head.text;
          for (const span of node.templateSpans) {
            value += '{}' + (span.literal.text || '');
          }
        } else {
          value = node.text;
        }
        checkAndRecord(value, node, typeLabel, contextDesc);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return findings;
}

// RegExp-based implementation (Fallback)
function analyzeWithRegExp(filePath, content) {
  const findings = [];

  // Helper to convert character index to line and column
  function getLineAndColumn(index) {
    let line = 1;
    let column = 1;
    for (let i = 0; i < index; i++) {
      if (content[i] === '\n') {
        line++;
        column = 1;
      } else {
        column++;
      }
    }
    return { line, column };
  }

  // Helper to check if a slash represents the start of a regex literal
  function isRegexLiteralStart(content, index) {
    if (content[index] !== '/') return false;
    const next = content[index + 1];
    if (next === '/' || next === '*' || next === '>') return false; // comments or self-closing tags

    // Ensure that </ is never matched as a regular expression literal start.
    if (index > 0 && content[index - 1] === '<') return false;

    // Find the first non-whitespace character before index
    let prevIndex = index - 1;
    while (prevIndex >= 0 && /\s/.test(content[prevIndex])) {
      prevIndex--;
    }
    if (prevIndex < 0) return true; // Start of file

    const prevChar = content[prevIndex];
    if (/[a-zA-Z0-9_$]/.test(prevChar)) {
      // Find the start of the word
      let wordStart = prevIndex;
      while (wordStart > 0 && /[a-zA-Z0-9_$]/.test(content[wordStart - 1])) {
        wordStart--;
      }
      const word = content.slice(wordStart, prevIndex + 1);
      const regexPrefixKeywords = ['return', 'typeof', 'yield', 'throw', 'delete', 'void', 'instanceof', 'in'];
      return regexPrefixKeywords.includes(word);
    }

    return ![')', ']', '}'].includes(prevChar);
  }

  // Helper to strip TS types and interfaces from preprocessed code by replacing them with spaces
  function stripTypesAndInterfaces(code) {
    let arr = code.split('');
    let i = 0;
    const len = arr.length;
    let inString = null;

    while (i < len) {
      const char = arr[i];

      if (inString) {
        if (char === '\\') {
          i += 2;
        } else if (char === inString) {
          inString = null;
          i++;
        } else {
          i++;
        }
      } else if (char === '"' || char === "'" || char === "`") {
        if (char === "'") {
          const prevChar = arr[i - 1] || '';
          const nextChar = arr[i + 1] || '';
          if (/[a-zA-Z]/.test(prevChar) && /[a-zA-Z]/.test(nextChar)) {
            i++;
            continue;
          }
        }
        inString = char;
        i++;
      } else {
        const isWordStart = (i === 0 || !/[a-zA-Z0-9_$]/.test(arr[i - 1]));
        if (isWordStart) {
          const codeSlice = arr.slice(i, i + 20).join('');
          if (codeSlice.startsWith('interface') && !/[a-zA-Z0-9_$]/.test(arr[i + 9] || '')) {
            let checkScan = i + 9;
            while (checkScan < len && /\s/.test(arr[checkScan])) {
              checkScan++;
            }
            if (checkScan < len && /[a-zA-Z_$]/.test(arr[checkScan])) {
              while (checkScan < len && /[a-zA-Z0-9_$]/.test(arr[checkScan])) {
                checkScan++;
              }
              while (checkScan < len && /\s/.test(arr[checkScan])) {
                checkScan++;
              }
              const potentialExtends = arr.slice(checkScan, checkScan + 7).join('');
              if (checkScan < len && (arr[checkScan] === '{' || potentialExtends.startsWith('extends'))) {
                let start = i;
                let scan = checkScan;
                while (scan < len && arr[scan] !== '{') {
                  scan++;
                }
                if (scan < len && arr[scan] === '{') {
                  let braceCount = 1;
                  scan++;
                  while (scan < len && braceCount > 0) {
                    if (arr[scan] === '{') braceCount++;
                    else if (arr[scan] === '}') braceCount--;
                    scan++;
                  }
                  for (let k = start; k < scan; k++) {
                    arr[k] = ' ';
                  }
                  i = scan;
                  continue;
                }
              }
            }
          } else if (codeSlice.startsWith('type') && !/[a-zA-Z0-9_$]/.test(arr[i + 4] || '')) {
            let checkScan = i + 4;
            while (checkScan < len && /\s/.test(arr[checkScan])) {
              checkScan++;
            }
            if (checkScan < len && /[a-zA-Z_$]/.test(arr[checkScan])) {
              while (checkScan < len && /[a-zA-Z0-9_$]/.test(arr[checkScan])) {
                checkScan++;
              }
              while (checkScan < len && /\s/.test(arr[checkScan])) {
                checkScan++;
              }
              if (checkScan < len && (arr[checkScan] === '=' || arr[checkScan] === '<')) {
                let start = i;
                let scan = checkScan;
                while (scan < len && arr[scan] !== ';' && arr[scan] !== '{') {
                  scan++;
                }
                if (scan < len && arr[scan] === '{') {
                  let braceCount = 1;
                  scan++;
                  while (scan < len && braceCount > 0) {
                    if (arr[scan] === '{') braceCount++;
                    else if (arr[scan] === '}') braceCount--;
                    scan++;
                  }
                  if (scan < len && arr[scan] === ';') {
                    scan++;
                  }
                  for (let k = start; k < scan; k++) {
                    arr[k] = ' ';
                  }
                  i = scan;
                  continue;
                } else if (scan < len && arr[scan] === ';') {
                  scan++;
                  for (let k = start; k < scan; k++) {
                    arr[k] = ' ';
                  }
                  i = scan;
                  continue;
                }
              }
            }
          }
        }
        i++;
      }
    }
    return arr.join('');
  }

  // Preprocess content: replace comments, regex literals, and <style>...</style> content with spaces of equal length to preserve indices
  let preprocessed = '';
  let i = 0;
  const len = content.length;
  let inString = null; // '"', "'", "`"

  while (i < len) {
    const char = content[i];
    const next = content[i + 1];

    if (inString) {
      if (char === '\\') {
        preprocessed += char;
        preprocessed += (content[i + 1] || '');
        i += 2;
      } else if (char === inString) {
        inString = null;
        preprocessed += char;
        i++;
      } else {
        preprocessed += char;
        i++;
      }
    } else if (char === '/' && next === '/') {
      // Line comment -> replace with spaces
      preprocessed += '  ';
      i += 2;
      while (i < len && content[i] !== '\n') {
        preprocessed += ' ';
        i++;
      }
    } else if (char === '/' && next === '*') {
      // Block comment -> replace with spaces/newlines
      preprocessed += '  ';
      i += 2;
      while (i < len) {
        if (content[i] === '*' && content[i + 1] === '/') {
          preprocessed += '  ';
          i += 2;
          break;
        }
        preprocessed += content[i] === '\n' ? '\n' : ' ';
        i++;
      }
    } else if (isRegexLiteralStart(content, i)) {
      preprocessed += '/';
      i++;
      let inCharClass = false;
      while (i < len) {
        const rChar = content[i];
        if (rChar === '\\') {
          preprocessed += '  '; // replace escape and next char with spaces
          i += 2;
        } else if (rChar === '[') {
          inCharClass = true;
          preprocessed += ' ';
          i++;
        } else if (rChar === ']' && inCharClass) {
          inCharClass = false;
          preprocessed += ' ';
          i++;
        } else if (rChar === '/' && !inCharClass) {
          preprocessed += '/';
          i++;
          // Consume flags: gimsuyd
          while (i < len && /[gimsuyd]/.test(content[i])) {
            preprocessed += ' ';
            i++;
          }
          break;
        } else {
          preprocessed += ' ';
          i++;
        }
      }
    } else if (char === '"' || char === "'" || char === "`") {
      // Check if this single quote is actually an apostrophe inside an Uzbek word
      if (char === "'") {
        const prevChar = content[i - 1] || '';
        const nextChar = content[i + 1] || '';
        if (/[a-zA-Z\u0400-\u04FF]/.test(prevChar) && /[a-zA-Z\u0400-\u04FF]/.test(nextChar)) {
          preprocessed += char;
          i++;
          continue;
        }
      }
      inString = char;
      preprocessed += char;
      i++;
    } else {
      preprocessed += char;
      i++;
    }
  }

  // Strip TS Types and Interfaces
  preprocessed = stripTypesAndInterfaces(preprocessed);

  // Mask out style blocks in the preprocessed code: replace <style>...</style> with spaces
  // Case-insensitive match for <style ...> ... </style>
  const styleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  preprocessed = preprocessed.replace(styleRegex, (match) => ' '.repeat(match.length));

  // Character scan to extract string literals
  const stringLiterals = [];
  i = 0;
  const prepLen = preprocessed.length;
  while (i < prepLen) {
    const char = preprocessed[i];
    if (char === '"' || char === "'" || char === "`") {
      // Check if this single quote is actually an apostrophe inside an Uzbek word
      if (char === "'") {
        const prevChar = preprocessed[i - 1] || '';
        const nextChar = preprocessed[i + 1] || '';
        if (/[a-zA-Z\u0400-\u04FF]/.test(prevChar) && /[a-zA-Z\u0400-\u04FF]/.test(nextChar)) {
          i++;
          continue;
        }
      }
      const start = i;
      const quote = char;
      let val = '';
      i++; // skip start quote
      while (i < prepLen) {
        if (preprocessed[i] === '\\') {
          val += preprocessed[i];
          val += (preprocessed[i + 1] || '');
          i += 2;
        } else if (preprocessed[i] === quote) {
          const end = i;
          i++; // skip end quote

          // Determine context and whether this string should be excluded
          let isExcluded = false;
          let contextDesc = 'JS/TS String literal';
          let isJsxAttributeValue = false;
          let attrName = null;

          // Look backward from 'start' to see if it's a JSX attribute
          let j = start - 1;
          while (j >= 0 && /\s/.test(preprocessed[j])) j--;
          
          if (j >= 0 && preprocessed[j] === '{') {
            j--;
            while (j >= 0 && /\s/.test(preprocessed[j])) j--;
          }

          if (j >= 0 && preprocessed[j] === '=') {
            isJsxAttributeValue = true;
            j--;
            while (j >= 0 && /\s/.test(preprocessed[j])) j--;
            let wordEnd = j;
            while (j >= 0 && /[a-zA-Z0-9_-]/.test(preprocessed[j])) j--;
            attrName = preprocessed.slice(j + 1, wordEnd + 1);

            // Verify JSX scope: must find '<' before statement/block boundary or keyword
            let isInsideJsxTag = false;
            let scan = j;
            while (scan >= 0) {
              const scanChar = preprocessed[scan];
              if (scanChar === '<') {
                isInsideJsxTag = true;
                break;
              }
              if (scanChar === ';' || scanChar === '{' || scanChar === '}') {
                break;
              }
              const wordMatch = preprocessed.slice(scan).match(/^(const|let|var|return|function|class)\b/);
              if (wordMatch) {
                break;
              }
              scan--;
            }
            if (!isInsideJsxTag) {
              isJsxAttributeValue = false;
              attrName = null;
            }
          }

          // Look backward to check if it's import/export/require or console logs or other calls
          let prevWord = '';
          let k = start - 1;
          while (k >= 0 && (/\s/.test(preprocessed[k]) || preprocessed[k] === '(')) k--;
          let tokenEnd = k;
          while (k >= 0 && /[a-zA-Z0-9_-]/.test(preprocessed[k])) k--;
          prevWord = preprocessed.slice(k + 1, tokenEnd + 1);

          if (prevWord === 'from' || prevWord === 'import' || prevWord === 'require') {
            isExcluded = true;
          }

          const excludedFuncs = [
            't', 'log', 'error', 'warn', 'info', 
            'useState', 'useRef', 'useEffect', 'useCallback', 'useMemo', 
            'changeLanguage', 'require', 'resolve', 'join', 'addEventListener', 
            'removeEventListener', 'querySelector', 'getElementById', 'split',
            'includes', 'endsWith', 'startsWith', 'slice', 'reduce', 'map',
            'filter', 'find', 'forEach', 'push', 'setInterval', 'clearInterval',
            'setTimeout', 'clearTimeout'
          ];
          if (excludedFuncs.includes(prevWord)) {
            isExcluded = true;
          }

          // Check for excluded object properties
          let isExcludedProperty = false;
          let pNode = start - 1;
          while (pNode >= 0 && /\s/.test(preprocessed[pNode])) pNode--;
          if (pNode >= 0 && preprocessed[pNode] === ':') {
            pNode--;
            while (pNode >= 0 && /\s/.test(preprocessed[pNode])) pNode--;
            let propEnd = pNode;
            while (pNode >= 0 && /[a-zA-Z0-9_-]/.test(preprocessed[pNode])) pNode--;
            const propName = preprocessed.slice(pNode + 1, propEnd + 1);
            // Removed 'name' from excludedProps
            const excludedProps = [
              'className', 'path', 'url', 'icon', 'type', 'key', 'id', 'method', 
              'color', 'size', 'variant', 'align', 'font', 'bgColor', 
              'borderColor', 'spacing', 'width', 'height', 'padding', 'margin', 
              'fontWeight', 'fontSize', 'lineHeight', 'letterSpacing', 'display', 
              'position', 'top', 'bottom', 'left', 'right', 'zIndex', 'transition', 
              'animation', 'transform', 'cursor', 'opacity', 'overflow', 'visibility'
            ];
            if (excludedProps.includes(propName)) {
              isExcludedProperty = true;
            }
          }

          if (isExcludedProperty) {
            isExcluded = true;
          }

          if (isJsxAttributeValue) {
            const userVisibleAttrs = ['placeholder', 'alt', 'title', 'label', 'aria-label', 'description'];
            if (!userVisibleAttrs.includes(attrName)) {
              isExcluded = true;
            } else {
              contextDesc = `JSX Attribute: ${attrName}`;
            }
          }

          stringLiterals.push({ start, end, value: val, isExcluded, contextDesc });
          break;
        } else {
          val += preprocessed[i];
          i++;
        }
      }
    } else {
      i++;
    }
  }

  // Record findings for valid string literals
  for (const str of stringLiterals) {
    if (!str.isExcluded) {
      // Unescape value: convert e.g., \' to '
      let unescapedVal = str.value.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\`/g, '`').replace(/\\\\/g, '\\');
      if (isTranslationCandidate(unescapedVal)) {
        const { line, column } = getLineAndColumn(str.start);
        findings.push({
          line,
          column,
          value: unescapedVal.trim(),
          type: 'String Literal (RegExp)',
          context: str.contextDesc
        });
      }
    }
  }

  // Create a masked copy where all string literals are replaced with spaces of the same length
  // so we don't scan their content as JSX Text
  let masked = preprocessed;
  for (const str of stringLiterals) {
    const len = str.end - str.start + 1;
    masked = masked.slice(0, str.start) + ' '.repeat(len) + masked.slice(str.end + 1);
  }

  // Helper to strip curly-braced expressions
  function stripCurlyBraces(str) {
    let result = '';
    let braceCount = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (char === '{') {
        braceCount++;
      } else if (char === '}') {
        if (braceCount > 0) {
          braceCount--;
        }
      } else {
        if (braceCount === 0) {
          result += char;
        }
      }
    }
    return result;
  }

  // Helper to extract JSX text using a robust tag-tracking parser
  function extractJsxText(code) {
    const localFindings = [];
    let i = 0;
    const len = code.length;
    let depth = 0;
    let lastTagEnd = 0;

    while (i < len) {
      if (code[i] === '<') {
        const start = i;
        const isClosing = (code[i + 1] === '/');
        const nextChar = isClosing ? code[i + 2] : code[i + 1];
        
        let isValidTag = (nextChar === '>' || /[a-zA-Z_$]/.test(nextChar));
        if (isValidTag && !isClosing) {
          const prevChar = start > 0 ? code[start - 1] : '';
          if (/[a-zA-Z0-9_$]/.test(prevChar)) {
            isValidTag = false;
          }
        }

        if (isValidTag) {
          let scan = start + 1;
          let braceCount = 0;
          let foundEnd = false;
          while (scan < len) {
            const char = code[scan];
            if (char === '{') {
              braceCount++;
            } else if (char === '}') {
              if (braceCount > 0) braceCount--;
            } else if (char === '>' && braceCount === 0) {
              foundEnd = true;
              break;
            }
            scan++;
          }

          if (foundEnd) {
            const tagEnd = scan; // index of ">"
            const tagContent = code.slice(start, tagEnd + 1);
            
            if (depth > 0) {
              const textBetween = code.slice(lastTagEnd, start);
              processJsxTextSegment(textBetween, lastTagEnd);
            }

            const isSelfClosing = tagContent.endsWith('/>');
            if (!isSelfClosing) {
              if (isClosing) {
                if (depth > 0) depth--;
              } else {
                depth++;
              }
            }

            lastTagEnd = tagEnd + 1;
            i = tagEnd + 1;
            continue;
          }
        }
      }
      i++;
    }

    function processJsxTextSegment(text, startIndex) {
      const stripped = stripCurlyBraces(text);
      if (text.includes('{')) {
        const words = stripped.split(/\s+/).map(w => w.trim()).filter(Boolean);
        for (const word of words) {
          if (word && isTranslationCandidate(word)) {
            const { line, column } = getLineAndColumn(startIndex);
            localFindings.push({
              line,
              column,
              value: word,
              type: 'JSX Text (RegExp)',
              context: 'JSX tag content'
            });
          }
        }
      } else {
        const val = text.trim();
        if (val && isTranslationCandidate(val)) {
          const { line, column } = getLineAndColumn(startIndex);
          localFindings.push({
            line,
            column,
            value: val,
            type: 'JSX Text (RegExp)',
            context: 'JSX tag content'
          });
        }
      }
    }

    return localFindings;
  }

  // Extract JSX text
  const jsxFindings = extractJsxText(masked);
  findings.push(...jsxFindings);

  return findings;
}

// Recursive directory scanning
function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', 'dist', '.git', 'scripts', '.vite', '.edge-cdp', 'i18n'].includes(entry.name)) {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      const excludedFiles = ['constants.tsx', 'index.tsx'];
      if (['.tsx', '.ts', '.jsx', '.js'].includes(ext) && !excludedFiles.includes(entry.name)) {
        totalFilesChecked++;
        const content = fs.readFileSync(fullPath, 'utf-8');
        
        let fileFindings = [];
        if (tsModule) {
          fileFindings = analyzeWithAST(fullPath, content);
        } else {
          fileFindings = analyzeWithRegExp(fullPath, content);
        }

        if (fileFindings.length > 0) {
          const relativePath = path.relative(path.resolve(__dirname, '..'), fullPath);
          results[relativePath] = fileFindings;
          totalViolations += fileFindings.length;
        }
      }
    }
  }
}

// Run scan
try {
  scanDirectory(targetDir);
} catch (err) {
  console.error(`Error scanning directory: ${err.message}`);
  process.exit(1);
}

// Print results
console.log('\n--- SCAN RESULTS ---');
console.log(`Files checked: ${totalFilesChecked}`);
console.log(`Violations found: ${totalViolations}\n`);

if (totalViolations > 0) {
  for (const [file, findings] of Object.entries(results)) {
    console.log(`\x1b[33m${file}\x1b[0m:`);
    for (const f of findings) {
      console.log(`  \x1b[36mLine ${f.line}:${f.column}\x1b[0m [${f.type}] (${f.context})`);
      console.log(`    Value: \x1b[31m"${f.value}"\x1b[0m`);
    }
    console.log('');
  }
  console.log('\x1b[31mVerification failed: Hardcoded strings detected.\x1b[0m');
  process.exit(1);
} else {
  console.log('\x1b[32mVerification passed: No hardcoded strings found!\x1b[0m');
  process.exit(0);
}
