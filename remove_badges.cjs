const fs = require('fs');

// 1. Update Header.tsx
let headerCode = fs.readFileSync('src/components/Header.tsx', 'utf8');
headerCode = headerCode.replace(
  '{ label: "Company Registration", href: "#" },',
  '{ label: "LLP Registration", href: "#" },\n          { label: "OPC Registration", href: "#" },'
);
fs.writeFileSync('src/components/Header.tsx', headerCode);

// 2. Update PremiumServices.tsx
let servicesCode = fs.readFileSync('src/components/sections/PremiumServices.tsx', 'utf8');

// The block to remove starts around line 105: {/* Badges */} and ends around 140
const badgesBlockRegex = /\{\/\* Badges \*\/\}.*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/s;
// Let's be more precise
// The badges block starts with `{/* Badges */}` and ends with the closing `</div>` of the flex container holding them.
// Let's just remove everything from `{/* Badges */}` to `Support That Cares.*?</p>\s*</div>\s*</div>\s*</div>`

servicesCode = servicesCode.replace(
  /\{\/\* Badges \*\/\}[\s\S]*?Support That Cares[\s\S]*?<\/p>\s*<\/div>\s*<\/div>\s*<\/div>/,
  ''
);

// We also need to remove the underline before the badges, which user mentioned previously "iske uper jo underline hai vo bhi hata do"
// That's lines 98 to 103:
// <div className="flex items-center justify-center gap-2 mt-4">
//   <div className="h-[1px] w-8 bg-[#36503F]"></div>
//   <div className="w-1.5 h-1.5 border border-[#36503F] rotate-45"></div>
//   <div className="h-[1px] w-8 bg-[#36503F]"></div>
// </div>

servicesCode = servicesCode.replace(
  /<div className="flex items-center justify-center gap-2 mt-4">[\s\S]*?<div className="h-\[1px\] w-8 bg-\[#36503F\]"><\/div>\s*<\/div>/,
  ''
);

fs.writeFileSync('src/components/sections/PremiumServices.tsx', servicesCode);

console.log('Done replacing header text and removing badges in services');
