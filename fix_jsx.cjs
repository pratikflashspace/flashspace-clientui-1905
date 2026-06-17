const fs = require('fs');
let code = fs.readFileSync('src/components/sections/PlanComparison.tsx', 'utf8');

const regex = /<div className="bg-\[#36503F\] text-white text-xs font-bold tracking-widest px-8 py-3 uppercase">\s*Features Comparison\s*<\/div>\s*<\/div>\s*\) : \(\s*<Minus className="w-4 h-4 text-gray-300" \/>\s*\)\}\s*<\/div>\s*\)\)\}\s*<\/div>\s*\)\)\}/m;

const replacement = `<div className="bg-[#36503F] text-white text-xs font-bold tracking-widest px-8 py-3 uppercase">
            Features Comparison
          </div>

          {/* Feature Rows */}
          {features.map((feature, idx) => (
            <div key={idx} className={\`grid grid-cols-5 border-b border-gray-200 last:border-b-0 \${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"} transition-all duration-300 \${hoveredRow === \\\`feature-\${idx}\\\` ? "scale-[1.02] z-50 shadow-md relative bg-white rounded-lg" : ""}\`}>
              <div className={\`p-5 flex items-center gap-3 border-r border-gray-100 transition-colors duration-300 \${hoveredColumn === -1 ? "bg-gray-100" : ""}\`} onMouseEnter={() => { setHoveredColumn(-1); setHoveredRow(\\\`feature-\${idx}\\\`); }} onMouseLeave={() => { setHoveredColumn(null); setHoveredRow(null); }}>
                <div className="w-5 h-5 flex items-center justify-center text-gray-400">
                  <Zap className="w-4 h-4" />
                </div>
                {feature.name.includes("Website Development") ? (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-700 font-medium">Website Development</span>
                    <span className="text-[11px] text-gray-500 mt-0.5 leading-tight">(AI chatbot + Domain + Hosting)</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-700">{feature.name}</span>
                )}
              </div>
              {feature.availability.map((isAvailable, i) => (
                <div key={i} className={\`p-5 flex items-center justify-center border-r border-gray-100 last:border-r-0 transition-colors duration-300 \${plans[i].highlight ? (hoveredColumn === i ? "bg-gray-300" : "bg-gray-100") : (hoveredColumn === i ? "bg-gray-100" : "")}\`} onMouseEnter={() => setHoveredColumn(i)} onMouseLeave={() => setHoveredColumn(null)}>
                  {isAvailable ? (
                    <div className="w-5 h-5 rounded-full bg-[#36503F] flex items-center justify-center text-white">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                  ) : (
                    <Minus className="w-4 h-4 text-gray-300" />
                  )}
                </div>
              ))}
            </div>
          ))}`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/components/sections/PlanComparison.tsx', code);
console.log('Fixed broken JSX and applied two-line text for Website Development');
