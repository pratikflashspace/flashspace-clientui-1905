const fs = require('fs');
let code = fs.readFileSync('src/components/sections/PlanComparison.tsx', 'utf8');

// 1. Add useState for hoveredColumn if not exists
if (!code.includes('const [hoveredColumn, setHoveredColumn]')) {
  code = code.replace(
    'export const PlanComparison = () => {',
    'import { useState } from "react";\nexport const PlanComparison = () => {\n  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);'
  );
  // Remove the duplicate import of useState if it was already imported at top
  // Actually, wait, React is imported?
}

// Ensure useState is imported
if (!code.includes('import { useState }')) {
  code = `import { useState } from "react";\n` + code;
}

// 2. Remove hover:scale and add onMouseEnter/Leave
// Helper to replace plan columns
const hoverEvents = 'onMouseEnter={() => setHoveredColumn(i)} onMouseLeave={() => setHoveredColumn(null)}';
const firstColHoverEvents = 'onMouseEnter={() => setHoveredColumn(-1)} onMouseLeave={() => setHoveredColumn(null)}';

// Header row:
code = code.replace(
  /className=\{`p-5 lg:p-6 flex flex-col items-center justify-center text-center relative transition-all duration-300 cursor-default rounded-t-xl \$\{plans\[i\]\.highlight \? 'bg-gray-100' : 'bg-white'\} hover:scale-110 hover:z-50 hover:shadow-xl z-20`\}/g,
  'className={`p-5 lg:p-6 flex flex-col items-center justify-center text-center relative transition-colors duration-300 cursor-default rounded-t-xl ${plans[i].highlight ? (hoveredColumn === i ? "bg-gray-200" : "bg-gray-100") : (hoveredColumn === i ? "bg-gray-50" : "bg-white")} z-20`} ' + hoverEvents
);

// Market Price Row
code = code.replace(
  /className=\{`p-6 flex items-center justify-center border-r border-gray-100 last:border-r-0 \$\{plans\[i\]\.highlight \? 'bg-gray-100' : 'bg-\\[#F9F8F4\\]'\}`\}/g,
  'className={`p-6 flex items-center justify-center border-r border-gray-100 last:border-r-0 transition-colors duration-300 ${plans[i].highlight ? (hoveredColumn === i ? "bg-gray-200" : "bg-gray-100") : (hoveredColumn === i ? "bg-[#F0EFEA]" : "bg-[#F9F8F4]")}`} ' + hoverEvents
);

// Our Price Row
code = code.replace(
  /className=\{`p-6 flex items-center justify-center border-r border-\\[#FEF8CF\\] last:border-r-0 \$\{plans\[i\]\.highlight \? 'bg-gray-100' : ''\}`\}/g,
  'className={`p-6 flex items-center justify-center border-r border-[#FEF8CF] last:border-r-0 transition-colors duration-300 ${plans[i].highlight ? (hoveredColumn === i ? "bg-gray-200" : "bg-gray-100") : (hoveredColumn === i ? "bg-[#FEF8CF]/40" : "")}`} ' + hoverEvents
);

// You Save Row
code = code.replace(
  /className=\{`p-6 flex items-center justify-center border-r border-gray-100 last:border-r-0 \$\{plans\[i\]\.highlight \? 'bg-gray-100' : ''\} transition-transform duration-300 hover:scale-110 hover:z-50 hover:shadow-md`\}/g,
  'className={`p-6 flex items-center justify-center border-r border-gray-100 last:border-r-0 transition-colors duration-300 ${plans[i].highlight ? (hoveredColumn === i ? "bg-gray-200" : "bg-gray-100") : (hoveredColumn === i ? "bg-gray-50" : "")}`} ' + hoverEvents
);

// Feature Rows
code = code.replace(
  /className=\{`p-5 flex items-center justify-center border-r border-gray-100 last:border-r-0 \$\{plans\[i\]\.highlight \? 'bg-gray-100' : ''\} transition-transform duration-300 hover:scale-110 hover:z-50 hover:shadow-sm`\}/g,
  'className={`p-5 flex items-center justify-center border-r border-gray-100 last:border-r-0 transition-colors duration-300 ${plans[i].highlight ? (hoveredColumn === i ? "bg-gray-200" : "bg-gray-100") : (hoveredColumn === i ? "bg-gray-50" : "")}`} ' + hoverEvents
);

// Action Row
code = code.replace(
  /className=\{`p-6 flex items-center justify-center border-r border-gray-100 last:border-r-0 \$\{plans\[i\]\.highlight \? 'bg-gray-100' : ''\} transition-transform duration-300 hover:scale-110 hover:z-50 hover:shadow-md`\}/g,
  'className={`p-6 flex items-center justify-center border-r border-gray-100 last:border-r-0 transition-colors duration-300 ${plans[i].highlight ? (hoveredColumn === i ? "bg-gray-200" : "bg-gray-100") : (hoveredColumn === i ? "bg-gray-50" : "")}`} ' + hoverEvents
);

// 3. First Column classes (remove scale and add color change)
code = code.replace(
  /className="bg-\\[#36503F\\] text-white p-5 lg:p-6 flex flex-col justify-center rounded-tl-xl relative z-20 transition-transform duration-300 hover:scale-110 hover:z-50 hover:shadow-md"/g,
  'className={`bg-[#36503F] text-white p-5 lg:p-6 flex flex-col justify-center rounded-tl-xl relative z-20 transition-colors duration-300 ${hoveredColumn === -1 ? "bg-[#2c4133]" : ""}`} ' + firstColHoverEvents
);

code = code.replace(
  /className="p-6 flex items-center justify-between border-r border-gray-100 bg-\\[#36503F\\] transition-transform duration-300 hover:scale-110 hover:z-50 hover:shadow-md"/g,
  'className={`p-6 flex items-center justify-between border-r border-gray-100 transition-colors duration-300 ${hoveredColumn === -1 ? "bg-[#2c4133]" : "bg-[#36503F]"}`} ' + firstColHoverEvents
);

code = code.replace(
  /className="p-6 flex items-center gap-3 border-r border-\\[#FEF8CF\\] transition-transform duration-300 hover:scale-110 hover:z-50 hover:shadow-md bg-\\[#FEF8CF\\]"/g,
  'className={`p-6 flex items-center gap-3 border-r border-[#FEF8CF] transition-colors duration-300 ${hoveredColumn === -1 ? "bg-[#f2ecb8]" : "bg-[#FEF8CF]"}`} ' + firstColHoverEvents
);

code = code.replace(
  /className="p-6 flex items-center gap-3 border-r border-gray-100 transition-transform duration-300 hover:scale-110 hover:z-50 hover:shadow-md bg-white"/g,
  'className={`p-6 flex items-center gap-3 border-r border-gray-100 transition-colors duration-300 ${hoveredColumn === -1 ? "bg-gray-50" : "bg-white"}`} ' + firstColHoverEvents
);

code = code.replace(
  /className="p-5 flex items-center gap-3 border-r border-gray-100 transition-transform duration-300 hover:scale-110 hover:z-50 hover:shadow-md bg-inherit"/g,
  'className={`p-5 flex items-center gap-3 border-r border-gray-100 transition-colors duration-300 ${hoveredColumn === -1 ? "bg-gray-50" : ""}`} ' + firstColHoverEvents
);

code = code.replace(
  /className="p-6 border-r border-gray-100 transition-transform duration-300 hover:scale-110 hover:z-50 hover:shadow-md bg-white"/g,
  'className={`p-6 border-r border-gray-100 transition-colors duration-300 ${hoveredColumn === -1 ? "bg-gray-50" : "bg-white"}`} ' + firstColHoverEvents
);

fs.writeFileSync('src/components/sections/PlanComparison.tsx', code);
console.log('Successfully switched from scaling to column highlighting');
