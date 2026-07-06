const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const publicDir = path.join(__dirname, 'public');

const getFiles = (dir) => {
  const files = fs.readdirSync(dir);
  let fileList = [];
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fileList = fileList.concat(getFiles(filePath));
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
};

// Get all webp files in public directory
const allPublicFiles = getFiles(publicDir);
const webpFiles = allPublicFiles.filter(file => file.endsWith('.webp')).map(file => path.basename(file, '.webp'));

// Find all tsx/ts files in src
const allSrcFiles = getFiles(srcDir);
const codeFiles = allSrcFiles.filter(file => file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css'));

let replacedCount = 0;

for (const file of codeFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  for (const name of webpFiles) {
    const regexPng = new RegExp(`(?<![a-zA-Z0-9_-])${name}\\.png`, 'g');
    const regexJpg = new RegExp(`(?<![a-zA-Z0-9_-])${name}\\.jpe?g`, 'g');
    
    content = content.replace(regexPng, `${name}.webp`);
    content = content.replace(regexJpg, `${name}.webp`);
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated references in ${path.relative(__dirname, file)}`);
    replacedCount++;
  }
}

console.log(`Updated ${replacedCount} files.`);
