import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '..');

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

console.log('Scanning for references to formatDate or dateUtils...');

const results = [];
walkDir(frontendDir, (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('formatDate') || line.includes('dateUtils')) {
      results.push({
        file: path.relative(frontendDir, filePath),
        line: idx + 1,
        content: line.trim()
      });
    }
  });
});

console.log(`Found ${results.length} references:`);
results.forEach(r => {
  console.log(`- ${r.file}:${r.line} -> ${r.content}`);
});
