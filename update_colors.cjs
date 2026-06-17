const fs = require('fs');
let code = fs.readFileSync('src/components/sections/PlanComparison.tsx', 'utf8');

// 1. Change badge text color to yellow
code = code.replace(/className="absolute top-0 bg-\\[#36503F\\] text-white text-\\[10px\\] font-bold px-4 py-1.5 rounded-full tracking-wider uppercase shadow-md whitespace-nowrap z-40 border border-\\[#36503F\\]"/g, 'className="absolute top-0 bg-[#36503F] text-[#FEF8CF] text-[10px] font-bold px-4 py-1.5 rounded-full tracking-wider uppercase shadow-md whitespace-nowrap z-40 border border-[#36503F]"');

// 2. Change bg-gray-50 to bg-gray-100 for the highlighted column
code = code.replace(/plans\[i\]\.highlight \? 'bg-gray-50'/g, "plans[i].highlight ? 'bg-gray-100'");

fs.writeFileSync('src/components/sections/PlanComparison.tsx', code);
console.log('Updated column background and badge text color');
