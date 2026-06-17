const fs = require('fs');
let code = fs.readFileSync('src/components/sections/PlanComparison.tsx', 'utf8');

// Use regex to remove 'transition-transform duration-300 hover:scale-110 hover:z-50 hover:shadow-md'
// and 'hover:shadow-xl', 'hover:shadow-sm'
code = code.replace(/transition-transform duration-300 hover:scale-110 hover:z-50 hover:shadow-(md|sm|xl)/g, '');
// Also remove just 'hover:scale-110 hover:z-50 hover:shadow-md' if they exist without transition
code = code.replace(/hover:scale-110 hover:z-50 hover:shadow-(md|sm|xl)/g, '');

// Wait, the first column needs `transition-colors duration-300` and the color change logic, but earlier it failed.
// Let's just fix the scaling for now.
code = code.replace(/\bhover:scale-110\b/g, '');

fs.writeFileSync('src/components/sections/PlanComparison.tsx', code);
console.log('Removed all hover:scale-110 classes');
