const fs = require('fs');
let code = fs.readFileSync('src/components/sections/PremiumServices.tsx', 'utf8');

const lines = code.split('\n');

// The lines 72 to 82 right now:
// 72:         {/* Header Section */}
// 73:         <div className="text-center mb-24">
// ...
// 82: 
// 83:           {/* Bottom decorative diamond line */}

const replacementChunk = `        {/* Header Section */}
        <div className="text-center mb-24">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-[#36503F] text-xs font-bold tracking-[0.2em] uppercase">
              What We Do Best
            </span>
          </div>

          {/* Main Title with decorative diamond line */}
          <div className="relative mb-6">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2">
              <div className="h-[1px] w-8 bg-[#36503F]"></div>
              <div className="w-1.5 h-1.5 border border-[#36503F] rotate-45"></div>
              <div className="h-[1px] w-8 bg-[#36503F]"></div>
            </div>

            <h2 className="text-[56px] leading-[1.1] font-bold mt-10 mb-6 tracking-tight">
              <span className="text-black">Premium Services. </span>
              <span className="text-[#36503F]">Real Impact.</span>
            </h2>
          </div>

          <p className="text-gray-600 max-w-2xl mx-auto text-[1rem] leading-relaxed mb-12">
            End-to-end solutions designed to elevate your brand, streamline operations, <br className="hidden md:block" /> and accelerate growth.
          </p>

          {/* Bottom decorative diamond line */}`;

// Let's find the exact indices
let startIdx = lines.findIndex(l => l.includes('{/* Header Section */}'));
let endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('{/* Bottom decorative diamond line */}'));

lines.splice(startIdx, endIdx - startIdx + 1, replacementChunk);

// Wait, I also need to make sure the closing </div> for <div className="text-center mb-24"> is there.
// Actually, earlier the code was:
//           <p className="text-gray-600 max-w-2xl mx-auto text-[1rem] leading-relaxed mb-12">...
//           </p>
//
//           {/* Bottom decorative diamond line */}
//           <div className="flex items-center justify-center gap-2 mb-12">...
//           </div>
//
//           {/* Badges */}
//           <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 mt-8">...
//           </div>
//         </div> // <-- This closes `<div className="text-center mb-24">`

// Let's check where the closing div is.
// Right now, if the closing div was deleted, I need to add it back.
// Let's check lines 110-120 to see where the text-center div closes.
// Wait, I will just write the file and let's check it.

fs.writeFileSync('src/components/sections/PremiumServices.tsx', lines.join('\n'));
console.log('Fixed syntax error');
