const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'sections');
const files = fs.readdirSync(dir).filter(f => f.includes('CoworkingSeoContent') && f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Get the component name from the file name (without extension)
  const componentName = file.replace('.tsx', '');
  
  // Replace "export default X" with "export { X }; export default X;"
  // But first check if named export already exists
  if (!content.includes(`export { ${componentName} }`)) {
    content = content.replace(
      `export default ${componentName};`,
      `export { ${componentName} };\nexport default ${componentName};`
    );
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${file}`);
  } else {
    console.log(`Already OK: ${file}`);
  }
});

console.log('Done! Fixed', files.length, 'files.');
