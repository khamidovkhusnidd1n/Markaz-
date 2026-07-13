const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/pages/Home.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Define regex patterns to match the sections (using lazy matching .*?)
const patterns = [
  // Teachers Section
  /\{\/\* Teachers Section - mehrgo\.uz style \*\/\}.*?<\/section>/s,
  // Courses Section
  /\{\/\* Courses Section - Cards Style \*\/\}.*?<\/section>/s,
  // Gallery Section
  /\{\/\* Gallery Section \*\/\}.*?<\/section>/s,
  // Art Gallery Section
  /\{\/\* Art Gallery Section \*\/\}.*?<\/section>/s,
  // Library Section
  /<section className="container mx-auto px-6 py-16">\s*<div className="mb-12 text-center">\s*<span className="text-sm font-bold text-amber-600 uppercase tracking-wider">Kutubxona<\/span>.*?<\/section>/s,
  // Gallery Modal
  /\{\/\* Gallery Modal \*\/\}.*?\}\)}/s,
];

patterns.forEach(pattern => {
  content = content.replace(pattern, '');
});

// Remove unused state and variables from Home.tsx
content = content.replace(/const \[teachersCarouselIndex[^;]+;/s, '');
content = content.replace(/const \[galleryCarouselIndex[^;]+;/s, '');
content = content.replace(/const \[selectedGallery[^;]+;/s, '');
content = content.replace(/const \[currentImageIndex[^;]+;/s, '');
content = content.replace(/const \[isAutoPlaying[^;]+;/s, '');
content = content.replace(/const teachersCarouselSize = 4;/g, '');
content = content.replace(/const galleryCarouselSize = 8;/g, '');
content = content.replace(/const teachersReveal = useScrollReveal\(\);/g, '');
content = content.replace(/const coursesReveal = useScrollReveal\(\);/g, '');
content = content.replace(/const galleryReveal = useScrollReveal\(\);/g, '');
content = content.replace(/const artGalleryReveal = useScrollReveal\(\);/g, '');

// Remove useEffects for teachers and gallery
content = content.replace(/\/\/ Teachers carousel effect.*?\}, \[teachers\.length\]\);/s, '');
content = content.replace(/\/\/ Gallery carousel effect.*?\}, \[gallery\.length\]\);/s, '');
content = content.replace(/\/\/ Auto-slide effect for gallery modal.*?\}, \[selectedGallery, isAutoPlaying\]\);/s, '');
content = content.replace(/\/\/ Art gallery carousel effect[^\n]*\n/s, '');

// Remove modal functions
content = content.replace(/const openGalleryModal =.*?\n  \};/s, '');
content = content.replace(/const closeGalleryModal =.*?\n  \};/s, '');
content = content.replace(/const nextImage =.*?\n  \};/s, '');
content = content.replace(/const prevImage =.*?\n  \};/s, '');
content = content.replace(/const toggleAutoPlay =.*?\n  \};/s, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully cleaned Home.tsx');
