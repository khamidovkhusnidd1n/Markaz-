const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/pages/Home.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const removeBetween = (startStr, endStr) => {
  const startIndex = content.indexOf(startStr);
  if (startIndex === -1) return;
  const endIndex = content.indexOf(endStr, startIndex);
  if (endIndex === -1) return;
  content = content.slice(0, startIndex) + content.slice(endIndex + endStr.length);
};

// Remove UI Sections
removeBetween('{/* Teachers Section - mehrgo.uz style */}', '</section>\n');
removeBetween('{/* Courses Section */}', '</section>\n');
removeBetween('{/* Gallery Section */}', '</section>\n');
removeBetween('{/* Art Gallery Section */}', '</section>\n');

// Kutubxona starts with `<section className="container mx-auto px-6 py-16">\n        <div className="mb-12 text-center">\n          <span className="text-sm font-bold text-amber-600 uppercase tracking-wider">Kutubxona</span>`
const kutubxonaStart = '<section className="container mx-auto px-6 py-16">\n        <div className="mb-12 text-center">\n          <span className="text-sm font-bold text-amber-600 uppercase tracking-wider">Kutubxona</span>';
removeBetween(kutubxonaStart, '</section>\n');

// Gallery modal starts with `{/* Gallery Modal */}` and ends with `  )}` before `<Footer />` or `</div>`
const modalRegex = /\{\/\* Gallery Modal \*\/\}.*?\}\)}/s;
content = content.replace(modalRegex, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully removed UI sections!');
