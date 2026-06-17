const fs = require('fs');
let code = fs.readFileSync('src/components/sections/PlanComparison.tsx', 'utf8');

// 1. Add useState
code = code.replace('import React from "react";', 'import React, { useState } from "react";');

// 2. Add state
code = code.replace('export const PlanComparison = () => {', 'export const PlanComparison = () => {\n  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);\n  const activeCol = hoveredColumn !== null ? hoveredColumn : plans.findIndex(p => p.highlight);');

// 3. Move badge and overlay
code = code.replace(/style=\{\{ left: `70%`, transform: 'translate\(-50%, -50%\)' \}\}/g, "style={{ left: `${30 + activeCol * 20}%`, transform: 'translate(-50%, -50%)', transition: 'left 0.3s ease' }}");
code = code.replace(/className=".*?absolute top-\[-2px\] bottom-\[-2px\] left-\[60%\] w-\[20%\].*?"\>\<\/div\>/g, '<div className="absolute top-[-2px] bottom-[-2px] w-[20%] border-[2px] border-[#FEF8CF] rounded-xl shadow-[0_0_20px_rgba(254,248,207,0.35)] pointer-events-none z-30 transition-all duration-300" style={{ left: `${20 + activeCol * 20}%` }}></div>');

// 4. Replace plan.highlight with activeCol === i
code = code.replace(/plan\.highlight/g, '(activeCol === i)');
code = code.replace(/plans\[i\]\.highlight/g, '(activeCol === i)');

// 5. Add mouse events
const events = ' onMouseEnter={() => setHoveredColumn(i)} onMouseLeave={() => setHoveredColumn(null)}';

// Action/Save/Price/MarketPrice cells:
// match `<div key={i} className=\`p-6 flex ... \``
code = code.replace(/(<div key=\{i\} className={`p-6 flex items-center justify-center border-r [^`]+`})/g, '$1' + events);

// Feature inner cells
// match `<div key={i} className=\`p-5 flex items-center justify-center border-r border-gray-100 last:border-r-0 \${(activeCol === i) ? 'bg-gray-50' : ''}\``
code = code.replace(/(<div key=\{i\} className={`p-5 flex items-center justify-center border-r border-gray-100 last:border-r-0 [^`]+`})/g, '$1' + events);

// Header cells
// `className={`p-5 lg:p-6 flex flex-col items-center justify-center text-center relative transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-default z-20 rounded-t-xl ${(activeCol === i)`
code = code.replace(/(<div\s+key=\{i\}\s+className={`p-5 lg:p-6 flex flex-col items-center justify-center text-center relative transition-all duration-300 hover:scale-110 hover:shadow-xl cursor-default z-20 rounded-t-xl [^`]+`})/g, '$1' + events);


fs.writeFileSync('src/components/sections/PlanComparison.tsx', code);
console.log('Update complete');
