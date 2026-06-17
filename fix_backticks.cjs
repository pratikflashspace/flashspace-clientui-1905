const fs = require('fs');

let code = fs.readFileSync('src/components/sections/PlanComparison.tsx', 'utf8');

// Replace literal backslashes before backticks
code = code.replace(/\\\`/g, '`');

fs.writeFileSync('src/components/sections/PlanComparison.tsx', code);

console.log('Fixed syntax error with backticks');
