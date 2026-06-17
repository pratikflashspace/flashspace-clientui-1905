const fs = require('fs');
let code = fs.readFileSync('src/components/sections/PlanComparison.tsx', 'utf8');

// 1. Remove useState import and hoveredColumn state
code = code.replace('import React, { useState } from "react";', 'import React from "react";');
code = code.replace(/  const \[hoveredColumn, setHoveredColumn\] = useState<number \| null>\(null\);\n/g, '');

// 2. Replace the dynamic hover scale with simple hover:scale-110
// Example: \$\{hoveredColumn === i \? 'scale-110 z-50 shadow-xl' : 'z-20'\}\`} onMouseEnter=\{.*?\} onMouseLeave=\{.*?\}
// Header
code = code.replace(/\$\{hoveredColumn === i \? 'scale-110 z-50 shadow-xl' : 'z-20'\}`\} onMouseEnter=\{.*?\} onMouseLeave=\{.*?\}/g, "hover:scale-110 hover:z-50 hover:shadow-xl z-20`}");

// Market Price, Our Price, You Save, Feature Rows inner loop
code = code.replace(/\$\{hoveredColumn === i \? 'scale-110 z-50 shadow-md' : ''\}`\} onMouseEnter=\{.*?\} onMouseLeave=\{.*?\}/g, "hover:scale-110 hover:z-50 hover:shadow-md`}");
code = code.replace(/\$\{hoveredColumn === i \? 'scale-110 z-50 shadow-sm' : ''\}`\} onMouseEnter=\{.*?\} onMouseLeave=\{.*?\}/g, "hover:scale-110 hover:z-50 hover:shadow-sm`}");

fs.writeFileSync('src/components/sections/PlanComparison.tsx', code);
console.log('Update complete');
