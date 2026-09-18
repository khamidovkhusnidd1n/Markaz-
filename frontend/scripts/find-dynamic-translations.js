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

try {
  const dynamicRegex = /\bt\(\s*(`[^`]*`|[^)]+)\)/g;
  let matchesCount = 0;

  walkDir(frontendDir, (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    let match;
    dynamicRegex.lastIndex = 0;
    while ((match = dynamicRegex.exec(content)) !== null) {
      const matchExpr = match[1].trim();
      // If it doesn't start with quote, or contains template expression, it's dynamic
      const isSimpleString = /^(["'])(?:(?!\1).)*\1$/.test(matchExpr);
      if (!isSimpleString) {
        console.log(`Found dynamic translation call in ${path.relative(frontendDir, filePath)}:`);
        console.log(`  Code: t(${matchExpr})`);
        matchesCount++;
      }
    }
  });

  console.log(`\nTotal dynamic translation calls found: ${matchesCount}`);
} catch (e) {
  console.error('Error walking directory:', e);
  process.exit(1);
}
