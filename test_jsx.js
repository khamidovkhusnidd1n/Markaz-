const fs = require('fs');
const content = fs.readFileSync('frontend/pages/DepartmentPage.tsx', 'utf8');

let opens = 0;
let closes = 0;
for(let i=0; i<content.length; i++){
    if(content[i] === '{') opens++;
    if(content[i] === '}') closes++;
}
console.log('Braces: ', opens, closes);

let divOpens = (content.match(/<div/g) || []).length;
let divCloses = (content.match(/<\/div>/g) || []).length;
console.log('Divs: ', divOpens, divCloses);
