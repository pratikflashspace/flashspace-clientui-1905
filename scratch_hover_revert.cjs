const fs = require('fs');
let code = fs.readFileSync('src/components/sections/PlanComparison.tsx', 'utf8');

// 1. Revert Badge and Overlay positions to fixed values for PREMIUM
code = code.replace(/style=\{\{ left: `\$\{30 \+ activeCol \* 20\}%`, transform: 'translate\(-50%, -50%\)', transition: 'left 0\.3s ease' \}\}/g, "style={{ left: '70%', transform: 'translate(-50%, -50%)' }}");
code = code.replace(/style=\{\{ left: `\$\{20 \+ activeCol \* 20\}%` \}\}/g, "style={{ left: '60%' }}");

// 2. Revert activeCol background logic to just use plan.highlight for backgrounds
// Header plan background:
code = code.replace(/key=\{i\}\n\s+className=\{`p-5 lg:p-6 flex flex-col items-center justify-center text-center relative transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-default z-20 rounded-t-xl \$\{\(activeCol === i\)\s*\?\s*'bg-gray-50'\s*:\s*'bg-white'\s*\}`\}\s*onMouseEnter=\{.*?\}\s*onMouseLeave=\{.*?\}/g, 
  `key={i}\n                  className={\`p-5 lg:p-6 flex flex-col items-center justify-center text-center relative transition-all duration-300 cursor-default rounded-t-xl \${plans[i].highlight ? 'bg-gray-50' : 'bg-white'} \${hoveredColumn === i ? 'scale-105 z-50 shadow-xl' : 'z-20'}\`} onMouseEnter={() => setHoveredColumn(i)} onMouseLeave={() => setHoveredColumn(null)}`);

// For the icon highlight (keep plan.highlight)
code = code.replace(/\$\{\(activeCol === i\) \? 'bg-\\[#36503F\\] text-\\[#FEF8CF\\] border-none shadow-md' : 'text-\\[#36503F\\]'\}/g, "${plans[i].highlight ? 'bg-[#36503F] text-[#FEF8CF] border-none shadow-md' : 'text-[#36503F]'}");

// For the h4 highlight
code = code.replace(/\$\{\(activeCol === i\) \? 'text-\\[#36503F\\]' : ''\}/g, "${plans[i].highlight ? 'text-[#36503F]' : ''}");

// Market Price Row
code = code.replace(/className=\{`p-6 flex items-center justify-center border-r border-gray-100 last:border-r-0 \$\{\(activeCol === i\) \? 'bg-gray-50' : 'bg-\\[#F9F8F4\\]'\}`\} onMouseEnter=\{.*?\} onMouseLeave=\{.*?\}/g, 
  `className={\`p-6 flex items-center justify-center border-r border-gray-100 last:border-r-0 \${plans[i].highlight ? 'bg-gray-50' : 'bg-[#F9F8F4]'} transition-transform duration-300 \${hoveredColumn === i ? 'scale-110 z-50 shadow-md' : ''}\`} onMouseEnter={() => setHoveredColumn(i)} onMouseLeave={() => setHoveredColumn(null)}`);

// Our Price Row
code = code.replace(/className=\{`p-6 flex items-center justify-center border-r border-\\[#FEF8CF\\] last:border-r-0 \$\{\(activeCol === i\) \? 'bg-gray-50' : ''\}`\} onMouseEnter=\{.*?\} onMouseLeave=\{.*?\}/g, 
  `className={\`p-6 flex items-center justify-center border-r border-[#FEF8CF] last:border-r-0 \${plans[i].highlight ? 'bg-gray-50' : ''} transition-transform duration-300 \${hoveredColumn === i ? 'scale-110 z-50 shadow-md' : ''}\`} onMouseEnter={() => setHoveredColumn(i)} onMouseLeave={() => setHoveredColumn(null)}`);

// You Save Row
code = code.replace(/className=\{`p-6 flex items-center justify-center border-r border-gray-100 last:border-r-0 \$\{\(activeCol === i\) \? 'bg-gray-50' : ''\}`\} onMouseEnter=\{.*?\} onMouseLeave=\{.*?\}/g, 
  `className={\`p-6 flex items-center justify-center border-r border-gray-100 last:border-r-0 \${plans[i].highlight ? 'bg-gray-50' : ''} transition-transform duration-300 \${hoveredColumn === i ? 'scale-110 z-50 shadow-md' : ''}\`} onMouseEnter={() => setHoveredColumn(i)} onMouseLeave={() => setHoveredColumn(null)}`);

// Feature Rows
code = code.replace(/className=\{`p-5 flex items-center justify-center border-r border-gray-100 last:border-r-0 \$\{\(activeCol === i\) \? 'bg-gray-50' : ''\}`\} onMouseEnter=\{.*?\} onMouseLeave=\{.*?\}/g, 
  `className={\`p-5 flex items-center justify-center border-r border-gray-100 last:border-r-0 \${plans[i].highlight ? 'bg-gray-50' : ''} transition-transform duration-300 \${hoveredColumn === i ? 'scale-110 z-50 shadow-sm' : ''}\`} onMouseEnter={() => setHoveredColumn(i)} onMouseLeave={() => setHoveredColumn(null)}`);

// Action Row
// Replace `plan.highlight` -> `plans[i].highlight` inside Action Row button because the button logic was modified to use activeCol before wait, in the button I used plan.highlight but wait, `plans[i].highlight` is better.
code = code.replace(/plan\.highlight\s*\?\s*"bg-\\[#36503F\\] text-\\[#FEF8CF\\] hover:opacity-90 shadow-md"\s*:\s*"bg-white text-\\[#36503F\\] border border-\\[#36503F\\] hover:bg-\\[#36503F\\] hover:text-\\[#FEF8CF\\]"/g, 
  `plans[i].highlight ? "bg-[#36503F] text-[#FEF8CF] hover:opacity-90 shadow-md" : "bg-white text-[#36503F] border border-[#36503F] hover:bg-[#36503F] hover:text-[#FEF8CF]"`);


fs.writeFileSync('src/components/sections/PlanComparison.tsx', code);
console.log('Update complete');
