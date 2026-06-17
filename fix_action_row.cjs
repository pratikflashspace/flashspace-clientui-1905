const fs = require('fs');
let code = fs.readFileSync('src/components/sections/PlanComparison.tsx', 'utf8');

const actionRow = `          {/* Action Row */}
          <div className="grid grid-cols-5 bg-white border-t border-gray-200">
            <div className="p-6 border-r border-gray-100"></div>
            {plans.map((plan, i) => (
              <div key={i} className={\`p-6 flex items-center justify-center border-r border-gray-100 last:border-r-0 \${plans[i].highlight ? 'bg-gray-50' : ''} transition-transform duration-300 hover:scale-110 hover:z-50 hover:shadow-md\`}>
                <button 
                  className={\`w-full py-3 px-4 rounded-sm text-xs font-bold tracking-wider transition-all duration-300 hover:-translate-y-1 hover:shadow-lg \${
                  plans[i].highlight
                    ? "bg-[#36503F] text-[#FEF8CF] hover:opacity-90 shadow-md"
                    : "bg-white text-[#36503F] border border-[#36503F] hover:bg-[#36503F] hover:text-[#FEF8CF]"
                }\`}>
                  GET STARTED
                </button>
              </div>
            ))}
          </div>`;

code = code.replace(/\{\/\* Action Row \*\/\}/, actionRow);

fs.writeFileSync('src/components/sections/PlanComparison.tsx', code);
console.log('Action row fixed');
