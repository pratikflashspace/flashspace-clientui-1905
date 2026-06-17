const fs = require('fs');

let code = fs.readFileSync('src/components/sections/PlanComparison.tsx', 'utf8');

// Replace grid-cols-5 with a custom grid template where the first column is 1.4x the width of the others
code = code.replace(/grid-cols-5/g, 'grid-cols-[1.4fr_1fr_1fr_1fr_1fr]');

fs.writeFileSync('src/components/sections/PlanComparison.tsx', code);

console.log('Increased width of the first column');
