const fs = require('fs');

let code = fs.readFileSync('src/components/sections/PlanComparison.tsx', 'utf8');

// Fix Badge left position
code = code.replace(
  /style=\{\{\s*left:\s*'70%',\s*transform:\s*'translate\(-50%, -50%\)'\s*\}\}/,
  "style={{ left: '72.22%', transform: 'translate(-50%, -50%)' }}"
);

// Fix Border overlay left and width
code = code.replace(
  /w-\[20%\]\s*border-\[2px\]\s*border-\[#FDE047\][\s\S]*?style=\{\{\s*left:\s*'60%'\s*\}\}/,
  "w-[18.52%] border-[2px] border-[#FDE047] rounded-xl shadow-[0_0_20px_rgba(253,224,71,0.4)] pointer-events-none z-30 transition-all duration-300\" style={{ left: '62.96%' }}"
);

fs.writeFileSync('src/components/sections/PlanComparison.tsx', code);
console.log('Fixed highlight positioning');
