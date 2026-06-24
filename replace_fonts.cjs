const fs = require('fs');
let code = fs.readFileSync('src/components/sections/PlanComparison.tsx', 'utf8');

code = code.replace(/font-serif/g, 'font-sans');
code = code.replace(/font-header/g, 'font-sans');
code = code.replace(/font-grotesk/g, 'font-sans');

fs.writeFileSync('src/components/sections/PlanComparison.tsx', code);
console.log('Replaced custom fonts with font-sans (Inter)');
