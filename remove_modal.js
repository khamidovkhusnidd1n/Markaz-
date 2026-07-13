const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/pages/Home.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Remove the Gallery Modal
const modalRegex = /\{\/\* Gallery Modal \*\/\}.*?(?=\s*<\/div>\s*<Footer \/>|<\/div>\s*\);\s*\};)/s;
content = content.replace(modalRegex, '');

// Clean up unused variables safely
content = content.replace(/const galleryCarouselSize = 4;/g, '');
content = content.replace(/const \[artGalleryCarouselIndex, setArtGalleryCarouselIndex\] = useState\(0\);/g, '');
content = content.replace(/const artGalleryCarouselSize = 4;/g, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully removed Gallery Modal safely');
