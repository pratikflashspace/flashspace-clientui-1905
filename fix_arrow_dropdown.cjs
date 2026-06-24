const fs = require('fs');

// 1. Fix PremiumServices.tsx arrow visibility
let servicesCode = fs.readFileSync('src/components/sections/PremiumServices.tsx', 'utf8');

// The arrow div currently has opacity-0 group-hover:opacity-100
// <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-100 ${isDark ? 'bg-[#FEF8CF] text-[#36503F] opacity-0 group-hover:opacity-100' : 'bg-[#36503F] text-white opacity-0 group-hover:opacity-100'}`}>
servicesCode = servicesCode.replace(
  /opacity-0 group-hover:opacity-100/g,
  ''
);

// Actually, wait, let's just make sure it's completely visible and maybe add a small hover effect like translate-x-1 instead
servicesCode = servicesCode.replace(
  /className=\{`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-100 \$\{isDark \? 'bg-\[#FEF8CF\] text-\[#36503F\] ' : 'bg-\[#36503F\] text-white '\}`\}/g,
  'className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 ${isDark ? "bg-[#FEF8CF] text-[#36503F]" : "bg-[#36503F] text-white"}`}'
);
// In case the previous regex failed because of the exact string:
servicesCode = servicesCode.replace(
  /'bg-\[#FEF8CF\] text-\[#36503F\] opacity-0 group-hover:opacity-100'/g,
  '"bg-[#FEF8CF] text-[#36503F] group-hover:translate-x-1"'
);
servicesCode = servicesCode.replace(
  /'bg-\[#36503F\] text-white opacity-0 group-hover:opacity-100'/g,
  '"bg-[#36503F] text-white group-hover:translate-x-1"'
);

fs.writeFileSync('src/components/sections/PremiumServices.tsx', servicesCode);

// 2. Fix Header.tsx Dropdown alignment
let headerCode = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Mega Menu
headerCode = headerCode.replace(
  /className="absolute top-\[100%\] left-1\/2 -translate-x-1\/2 pt-0 mt-\[-2px\] w-\[90vw\] max-w-5xl/g,
  'className="absolute top-[100%] left-[-20px] pt-0 mt-[-2px] w-[850px] max-w-[90vw]'
);

// Standard Dropdown (Packages, More)
headerCode = headerCode.replace(
  /className="absolute top-\[100%\] left-1\/2 -translate-x-1\/2 pt-0 mt-\[-2px\] w-48/g,
  'className="absolute top-[100%] left-0 pt-0 mt-[-2px] w-48'
);

fs.writeFileSync('src/components/Header.tsx', headerCode);

console.log('Fixed arrow visibility and dropdown alignment');
