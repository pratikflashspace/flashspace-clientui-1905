const fs = require('fs');
let code = fs.readFileSync('src/components/sections/PlanComparison.tsx', 'utf8');

const lines = code.split('\n');

const missingHeaderChunk = `                <div className="w-12 h-12 border border-[#FEF8CF] rounded-full flex items-center justify-center mb-4 text-[#FEF8CF] shrink-0">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3v18M5 10l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 14h14" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg lg:text-xl font-medium mb-2 whitespace-nowrap">Plan Comparison</h3>
                <p className="text-xs lg:text-sm text-gray-400">See how our plans compare<br />with market pricing.</p>
              </div>
              
              {/* Plan Headers */}
              {plans.map((plan, i) => (
                <div
                  key={i}
                  className={\`p-5 lg:p-6 flex flex-col items-center justify-center text-center relative transition-all duration-300 cursor-default rounded-t-xl \${plans[i].highlight ? 'bg-gray-50' : 'bg-white'} \${hoveredColumn === i ? 'scale-110 z-50 shadow-xl' : 'z-20'}\`} onMouseEnter={() => setHoveredColumn(i)} onMouseLeave={() => setHoveredColumn(null)}
                >
                  <div className={\`w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center mb-4 shrink-0 transition-transform duration-300 hover:rotate-12 \${plans[i].highlight ? 'bg-[#36503F] text-[#FEF8CF] border-none shadow-md' : 'text-[#36503F]'}\`}>
                    {plan.icon}
                  </div>
                  <h4 className={\`font-bold tracking-widest text-sm mb-2 \${plans[i].highlight ? 'text-[#36503F]' : ''}\`}>{plan.name}</h4>
                  <p className="text-xs text-gray-500 whitespace-pre-line">{plan.subtitle}</p>
                </div>
              ))}
            </div>

          {/* Pricing Rows */}
          
          {/* Market Price Row */}`;

// Insert the missing chunk right after line 120
lines.splice(120, 0, missingHeaderChunk);

// Now fix the activeCol logic globally to revert backgrounds back to plans[i].highlight
code = lines.join('\n');
code = code.replace(/\(activeCol === i\)\s*\?\s*'bg-gray-50'/g, "plans[i].highlight ? 'bg-gray-50'");
code = code.replace(/\(activeCol === i\)\s*\?\s*'text-\\[#36503F\\]'/g, "plans[i].highlight ? 'text-[#36503F]'");
code = code.replace(/\(activeCol === i\)\s*\?\s*'bg-\\[#36503F\\] text-\\[#FEF8CF\\] border-none shadow-md'/g, "plans[i].highlight ? 'bg-[#36503F] text-[#FEF8CF] border-none shadow-md'");

// Fix hovering scales on the other rows.
// Market Price Row
code = code.replace(/className=\{`p-6 flex items-center justify-center border-r border-gray-100 last:border-r-0 \$\{plans\[i\]\.highlight \? 'bg-gray-50' : 'bg-\\[#F9F8F4\\]'\}`\}\s*onMouseEnter=\{.*?\}\s*onMouseLeave=\{.*?\}/g, 
  `className={\`p-6 flex items-center justify-center border-r border-gray-100 last:border-r-0 \${plans[i].highlight ? 'bg-gray-50' : 'bg-[#F9F8F4]'} transition-transform duration-300 \${hoveredColumn === i ? 'scale-110 z-50 shadow-md' : ''}\`} onMouseEnter={() => setHoveredColumn(i)} onMouseLeave={() => setHoveredColumn(null)}`);

// Our Price Row
code = code.replace(/className=\{`p-6 flex items-center justify-center border-r border-\\[#FEF8CF\\] last:border-r-0 \$\{plans\[i\]\.highlight \? 'bg-gray-50' : ''\}`\}\s*onMouseEnter=\{.*?\}\s*onMouseLeave=\{.*?\}/g, 
  `className={\`p-6 flex items-center justify-center border-r border-[#FEF8CF] last:border-r-0 \${plans[i].highlight ? 'bg-gray-50' : ''} transition-transform duration-300 \${hoveredColumn === i ? 'scale-110 z-50 shadow-md' : ''}\`} onMouseEnter={() => setHoveredColumn(i)} onMouseLeave={() => setHoveredColumn(null)}`);

// You Save Row
code = code.replace(/className=\{`p-6 flex items-center justify-center border-r border-gray-100 last:border-r-0 \$\{plans\[i\]\.highlight \? 'bg-gray-50' : ''\}`\}\s*onMouseEnter=\{.*?\}\s*onMouseLeave=\{.*?\}/g, 
  `className={\`p-6 flex items-center justify-center border-r border-gray-100 last:border-r-0 \${plans[i].highlight ? 'bg-gray-50' : ''} transition-transform duration-300 \${hoveredColumn === i ? 'scale-110 z-50 shadow-md' : ''}\`} onMouseEnter={() => setHoveredColumn(i)} onMouseLeave={() => setHoveredColumn(null)}`);

// Feature Rows inner loop
code = code.replace(/className=\{`p-5 flex items-center justify-center border-r border-gray-100 last:border-r-0 \$\{plans\[i\]\.highlight \? 'bg-gray-50' : ''\}`\}\s*onMouseEnter=\{.*?\}\s*onMouseLeave=\{.*?\}/g, 
  `className={\`p-5 flex items-center justify-center border-r border-gray-100 last:border-r-0 \${plans[i].highlight ? 'bg-gray-50' : ''} transition-transform duration-300 \${hoveredColumn === i ? 'scale-110 z-50 shadow-sm' : ''}\`} onMouseEnter={() => setHoveredColumn(i)} onMouseLeave={() => setHoveredColumn(null)}`);

fs.writeFileSync('src/components/sections/PlanComparison.tsx', code);
console.log('Update complete');
