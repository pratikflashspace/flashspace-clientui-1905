const fs = require('fs');

let headerCode = fs.readFileSync('src/components/Header.tsx', 'utf8');

headerCode = headerCode.replace(
  '<nav className="hidden items-center gap-8 lg:flex">',
  '<nav className="hidden items-center gap-8 lg:flex h-full">'
);

headerCode = headerCode.replace(
  /className="relative group py-6"/g,
  'className="relative group h-full flex items-center"'
);

// Optional: maybe remove the `pt-2` from the dropdown wrappers if it creates a gap that makes hover state fail or look too low.
headerCode = headerCode.replace(
  /className="absolute top-\[100%\] left-1\/2 -translate-x-1\/2 pt-2 w-\[90vw\]/g,
  'className="absolute top-[100%] left-1/2 -translate-x-1/2 pt-0 mt-[-2px] w-[90vw]'
);

headerCode = headerCode.replace(
  /className="absolute top-\[100%\] left-1\/2 -translate-x-1\/2 pt-2 w-48/g,
  'className="absolute top-[100%] left-1/2 -translate-x-1/2 pt-0 mt-[-2px] w-48'
);

fs.writeFileSync('src/components/Header.tsx', headerCode);
console.log('Dropdown positioning adjusted');
