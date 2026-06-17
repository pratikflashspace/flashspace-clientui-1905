const fs = require('fs');
let code = fs.readFileSync('src/components/sections/PlanComparison.tsx', 'utf8');

code = code.replace(/ onMouseEnter=\{\(\) => setHoveredColumn\(i\)\} onMouseLeave=\{\(\) => setHoveredColumn\(null\)\}/g, '');

fs.writeFileSync('src/components/sections/PlanComparison.tsx', code);
console.log('Stripped remaining react state events');
