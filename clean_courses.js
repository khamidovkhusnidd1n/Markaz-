const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/pages/Home.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Remove Courses Section
// Since it doesn't have the comment we expected, let's match from <section ref={coursesReveal.ref} to its closing tag.
const coursesRegex = /<section\s*ref=\{coursesReveal\.ref\}[^>]*>.*?<\/section>/s;
content = content.replace(coursesRegex, '');

// Remove related state
content = content.replace(/const \[expandedCourse, setExpandedCourse\] = useState<string \| null>\(null\);\n/s, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully cleaned Courses from Home.tsx');
