const fs = require('fs');

let headerCode = fs.readFileSync('src/components/Header.tsx', 'utf8');

headerCode = headerCode.replace(
  /className="absolute top-\[100%\] left-\[-20px\] pt-0 mt-\[-2px\]/g,
  'className="absolute top-[100%] left-[-20px] pt-4 mt-0'
);

headerCode = headerCode.replace(
  /className="absolute top-\[100%\] left-0 pt-0 mt-\[-2px\]/g,
  'className="absolute top-[100%] left-0 pt-4 mt-0'
);

fs.writeFileSync('src/components/Header.tsx', headerCode);

console.log('Added pt-4 gap to dropdowns');
