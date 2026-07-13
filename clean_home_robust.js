const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/pages/Home.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const removeBetween = (startStr, endRegex) => {
  const startIndex = content.indexOf(startStr);
  if (startIndex === -1) {
    console.log(`Could not find start string: ${startStr.slice(0, 30)}...`);
    return;
  }
  const match = content.slice(startIndex).match(endRegex);
  if (!match) {
    console.log(`Could not find end regex after start string`);
    return;
  }
  const endIndex = startIndex + match.index + match[0].length;
  content = content.slice(0, startIndex) + content.slice(endIndex);
};

// 1. Courses Section
removeBetween('{/* Courses Section */}', /<\/section>\s*/);

// 2. Photo Gallery
removeBetween('{/* Gallery Section */}', /<\/section>\s*/);

// 3. Art Gallery
removeBetween('{/* Art Gallery Section */}', /<\/section>\s*/);

// 4. Murojaatlar va arizalar
const qabulStart = '<span className="text-sm font-bold text-rose-600 uppercase tracking-wider">Qabul</span>';
removeBetween('{/* Virtual Qabulxona Preview */}', /<\/section>\s*/);
// Wait, Virtual Qabulxona might not have `{/* Virtual Qabulxona Preview */}` comment. Let's use `qabulStart` but the section starts before it.
// Let's just find `<section className="container mx-auto px-6 py-16">` that contains `Qabul`
const sections = content.split('<section className="container mx-auto px-6 py-16">');
content = sections[0] + sections.slice(1).map(s => {
  if (s.includes('tracking-wider">Qabul</span>')) return ''; // drop it
  if (s.includes('tracking-wider">Kutubxona</span>')) return ''; // drop it
  return '<section className="container mx-auto px-6 py-16">' + s;
}).join('');

// Gallery Modal
const modalRegex = /\{\/\* Gallery Modal \*\/\}.*?\}\)\}/s;
content = content.replace(modalRegex, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully cleaned Home.tsx');
