const fs = require('fs');
let code = fs.readFileSync('src/components/sections/PlanComparison.tsx', 'utf8');

// Replace hoveredColumn conditions to make them more grayish
// "bg-gray-50" -> "bg-gray-100"
code = code.replace(/"bg-gray-50"/g, '"bg-gray-100"');
// "bg-gray-200" -> "bg-gray-300" (but wait, there might be other bg-gray-200? Let's be specific)
code = code.replace(/hoveredColumn === i \? "bg-gray-200"/g, 'hoveredColumn === i ? "bg-gray-300"');

// There is one exception where I used 'bg-gray-50' manually in the past: 
// The Feature Rows alternating bg uses 'bg-gray-50/50'. Let's check if it got replaced to 'bg-gray-100/50'. 
// It's probably fine or I can revert it if needed.
code = code.replace(/'bg-gray-100\/50'/g, "'bg-gray-50/50'");

fs.writeFileSync('src/components/sections/PlanComparison.tsx', code);
console.log('Made hover backgrounds more grayish');
