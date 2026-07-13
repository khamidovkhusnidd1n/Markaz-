const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/pages/Home.tsx');
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

function removeSection(startMarker, endMarker) {
  const startIndex = lines.findIndex(line => line.includes(startMarker));
  if (startIndex === -1) return;
  // find next endMarker after startIndex
  let endIndex = -1;
  for (let i = startIndex; i < lines.length; i++) {
    if (lines[i].includes(endMarker)) {
      endIndex = i;
      break;
    }
  }
  if (endIndex !== -1) {
    lines.splice(startIndex, endIndex - startIndex + 1);
  }
}

// Remove Teachers
removeSection('{/* Teachers Section - mehrgo.uz style */}', '</section>');
// Remove Courses
removeSection('{/* Courses Section */}', '</section>');
// Remove Gallery
removeSection('{/* Gallery Section */}', '</section>');
// Remove Art Gallery
removeSection('{/* Art Gallery Section */}', '</section>');
// Remove Adabiyotlar (Kutubxona)
removeSection('<span className="text-sm font-bold text-amber-600 uppercase tracking-wider">Kutubxona</span>', '</section>');
// Remove Gallery Modal
removeSection('{/* Gallery Modal */}', ')}');

// Also remove unused states
const removeLine = (marker) => {
  const idx = lines.findIndex(line => line.includes(marker));
  if (idx !== -1) lines.splice(idx, 1);
};
removeLine('const [teachersCarouselIndex');
removeLine('const teachersCarouselSize');
removeLine('const [galleryCarouselIndex');
removeLine('const galleryCarouselSize');
removeLine('const [artGalleryCarouselIndex');
removeLine('const artGalleryCarouselSize');
removeLine('const [selectedGallery');
removeLine('const [currentImageIndex');
removeLine('const [isAutoPlaying');

// Also remove unused effects (they span multiple lines, so just find them and remove next N lines until '}, [dependency]);')
function removeEffect(marker, dependency) {
  const startIndex = lines.findIndex(line => line.includes(marker));
  if (startIndex === -1) return;
  let endIndex = -1;
  for (let i = startIndex; i < lines.length; i++) {
    if (lines[i].includes(dependency)) {
      endIndex = i;
      break;
    }
  }
  if (endIndex !== -1) {
    lines.splice(startIndex, endIndex - startIndex + 1);
  }
}
removeEffect('// Teachers carousel effect', 'teachers.length');
removeEffect('// Gallery carousel effect', 'gallery.length');
removeEffect('// Art gallery carousel effect', 'artGalleryCarouselIndex');
removeEffect('// Auto-slide effect for gallery modal', 'isAutoPlaying');

// Also remove modal functions (openGalleryModal, closeGalleryModal, nextImage, prevImage, toggleAutoPlay)
// These span multiple lines. They end with `};`
function removeFunction(marker) {
  const startIndex = lines.findIndex(line => line.includes(marker));
  if (startIndex === -1) return;
  let endIndex = -1;
  // find the next closing bracket at exactly 2 spaces indentation (or just `  };`)
  for (let i = startIndex; i < lines.length; i++) {
    if (lines[i] === '  };' || lines[i] === '  }') {
      endIndex = i;
      break;
    }
  }
  if (endIndex !== -1) {
    lines.splice(startIndex, endIndex - startIndex + 1);
  }
}
removeFunction('const openGalleryModal = (');
removeFunction('const closeGalleryModal = ()');
removeFunction('const nextImage = ()');
removeFunction('const prevImage = ()');
removeFunction('const toggleAutoPlay = ()');

// Remove scroll reveals
removeLine('const teachersReveal = useScrollReveal();');
removeLine('const coursesReveal = useScrollReveal();');
removeLine('const galleryReveal = useScrollReveal();');
removeLine('const artGalleryReveal = useScrollReveal();');

// Also remove the `expandedCourse` state
removeLine('const [expandedCourse, setExpandedCourse] = useState<string | null>(null);');

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Successfully cleaned Home.tsx');
