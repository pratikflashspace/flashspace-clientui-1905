const fs = require('fs');
let code = fs.readFileSync('src/components/sections/PremiumServices.tsx', 'utf8');

const target = `          {/* Main Title with decorative diamond line */}
          <div className="relative mb-6">

          {/* Bottom decorative diamond line */}`;

const replacement = `          {/* Main Title with decorative diamond line */}
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

code = code.replace(target, replacement);

fs.writeFileSync('src/components/sections/PremiumServices.tsx', code);
console.log('Restored heading with 56px size');
