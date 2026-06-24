const fs = require('fs');

let code = fs.readFileSync('src/components/sections/PlanComparison.tsx', 'utf8');

// 1. Update font size for Website Development feature
code = code.replace(
  /<span className="text-sm text-gray-700">\{feature\.name\}<\/span>/,
  '<span className={`text-gray-700 ${feature.name.includes("Website Development") ? "text-[11px] xl:text-[12px] leading-tight" : "text-sm"}`}>{feature.name}</span>'
);

// 2. Add animation to Market Price Row
// Find Market Price Row
code = code.replace(
  /\{(\/\* Market Price Row \*\/)\}\s*<div className="grid grid-cols-5 border-b border-gray-200">/,
  `{$1}\n          <div className={\`grid grid-cols-5 border-b border-gray-200 transition-all duration-300 \${hoveredRow === "market_price" ? "scale-[1.02] z-50 shadow-md relative bg-white rounded-lg" : ""}\`}>`
);
// Add onMouseEnter to Market Price left col
code = code.replace(
  /<div className="p-6 flex items-center justify-between border-r border-gray-100 bg-\[#36503F\] ">/,
  '<div className="p-6 flex items-center justify-between border-r border-gray-100 bg-[#36503F]" onMouseEnter={() => setHoveredRow("market_price")} onMouseLeave={() => setHoveredRow(null)}>'
);

// 3. Fix Our Price Row onMouseEnter
// Ensure it has onMouseEnter
code = code.replace(
  /<div className="p-6 flex items-center gap-3 border-r border-\[#FEF8CF\]  bg-\[#FEF8CF\]">/,
  '<div className="p-6 flex items-center gap-3 border-r border-[#FEF8CF] bg-[#FEF8CF]" onMouseEnter={() => setHoveredRow("our_price")} onMouseLeave={() => setHoveredRow(null)}>'
);

// 4. Add animation to You Save Row
code = code.replace(
  /\{(\/\* You Save Row \*\/)\}\s*<div className="grid grid-cols-5 border-b border-gray-200">/,
  `{$1}\n          <div className={\`grid grid-cols-5 border-b border-gray-200 transition-all duration-300 \${hoveredRow === "save" ? "scale-[1.02] z-50 shadow-md relative bg-white rounded-lg" : ""}\`}>`
);

fs.writeFileSync('src/components/sections/PlanComparison.tsx', code);
console.log('Added hover animations and reduced font size');
