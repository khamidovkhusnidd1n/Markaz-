const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/pages/Home.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const removeBetween = (startStr, endStr) => {
  const startIndex = content.indexOf(startStr);
  if (startIndex === -1) {
    console.log(`Could not find start string: ${startStr}`);
    return;
  }
  const endIndex = content.indexOf(endStr, startIndex);
  if (endIndex === -1) {
    console.log(`Could not find end string: ${endStr} after ${startStr}`);
    return;
  }
  content = content.slice(0, startIndex) + content.slice(endIndex + endStr.length);
};

// 1. Courses Section ("Bizning dasturlar")
removeBetween('{/* Courses Section */}', '</section>\n');

// 2. Photo Gallery ("Fotogalereya")
removeBetween('{/* Gallery Section */}', '</section>\n');

// 3. Art Gallery ("Art Galereya")
removeBetween('{/* Art Gallery Section */}', '</section>\n');

// 4. Murojaatlar va arizalar (Virtual Qabulxona Preview)
const qabulStart = '<section className="container mx-auto px-6 py-16">\n        <div className="mb-12 text-center">\n          <span className="text-sm font-bold text-rose-600 uppercase tracking-wider">Qabul</span>';
removeBetween(qabulStart, '</section>\n');

// 5. Adabiyotlar (Kutubxona)
const kutubxonaStart = '<section className="container mx-auto px-6 py-16">\n        <div className="mb-12 text-center">\n          <span className="text-sm font-bold text-amber-600 uppercase tracking-wider">Kutubxona</span>';
removeBetween(kutubxonaStart, '</section>\n');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully removed all specified sections from Home.tsx!');
