const fs = require('fs');
let code = fs.readFileSync('src/components/sections/PlanComparison.tsx', 'utf8');

// 1. Top Left Header
code = code.replace(
  'className="bg-[#36503F] text-white p-5 lg:p-6 flex flex-col justify-center rounded-tl-xl relative z-20"',
  'className="bg-[#36503F] text-white p-5 lg:p-6 flex flex-col justify-center rounded-tl-xl relative z-20 transition-transform duration-300 hover:scale-110 hover:z-50 hover:shadow-md"'
);

// 2. Market Price Row
code = code.replace(
  'className="p-6 flex items-center justify-between border-r border-gray-100 bg-[#36503F]"',
  'className="p-6 flex items-center justify-between border-r border-gray-100 bg-[#36503F] transition-transform duration-300 hover:scale-110 hover:z-50 hover:shadow-md"'
);

// 3. Our Price Row
code = code.replace(
  'className="p-6 flex items-center gap-3 border-r border-[#FEF8CF]"',
  'className="p-6 flex items-center gap-3 border-r border-[#FEF8CF] transition-transform duration-300 hover:scale-110 hover:z-50 hover:shadow-md bg-[#FEF8CF]"'
);

// 4. You Save Row
code = code.replace(
  'className="p-6 flex items-center gap-3 border-r border-gray-100"',
  'className="p-6 flex items-center gap-3 border-r border-gray-100 transition-transform duration-300 hover:scale-110 hover:z-50 hover:shadow-md bg-white"'
);

// 5. Feature Rows
code = code.replace(
  'className="p-5 flex items-center gap-3 border-r border-gray-100"',
  'className="p-5 flex items-center gap-3 border-r border-gray-100 transition-transform duration-300 hover:scale-110 hover:z-50 hover:shadow-md"'
);
// Wait, feature rows are inside a map, so it will only replace the first one if we don't use a regex or global flag.
// Let's use string replace which only replaces the first occurrence, but wait! The feature row class is inside the `features.map`. Since it's identical text, if I replace it without global flag, it's just the text in the code! Yes, the code only has it written once inside the map callback. So string replace is perfect.
// Let's add bg-white to it so it doesn't look transparent when popping out.
code = code.replace(
  'className="p-5 flex items-center gap-3 border-r border-gray-100 transition-transform duration-300 hover:scale-110 hover:z-50 hover:shadow-md"',
  'className="p-5 flex items-center gap-3 border-r border-gray-100 transition-transform duration-300 hover:scale-110 hover:z-50 hover:shadow-md bg-inherit"'
);

// 6. Action Row
code = code.replace(
  'className="p-6 border-r border-gray-100"',
  'className="p-6 border-r border-gray-100 transition-transform duration-300 hover:scale-110 hover:z-50 hover:shadow-md bg-white"'
);

fs.writeFileSync('src/components/sections/PlanComparison.tsx', code);
console.log('Added hover classes to first column');
