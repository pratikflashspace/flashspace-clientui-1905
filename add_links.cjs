const fs = require('fs');

let code = fs.readFileSync('src/components/sections/PremiumServices.tsx', 'utf8');

// 1. Ensure useNavigate is imported
if (!code.includes('useNavigate')) {
  code = code.replace(
    /import \{ Link \} from "react-router-dom";/,
    'import { Link, useNavigate } from "react-router-dom";'
  );
}

// 2. Add links to the services array
code = code.replace(
  /title: "Virtual Offices",/g,
  'title: "Virtual Offices",\n    link: "/solutions/virtual-office",'
);

code = code.replace(
  /title: "Coworking Spaces",/g,
  'title: "Coworking Spaces",\n    link: "/services/coworking-space",'
);

// Fallback links for others
code = code.replace(
  /title: "Business Setup",/g,
  'title: "Business Setup",\n    link: "/services/business-setup",'
);
code = code.replace(
  /title: "Taxation and Filing",/g,
  'title: "Taxation and Filing",\n    link: "#",'
);
code = code.replace(
  /title: "One CRM",/g,
  'title: "One CRM",\n    link: "#",'
);
code = code.replace(
  /title: "Website Development",/g,
  'title: "Website Development",\n    link: "#",'
);

// 3. Add useNavigate hook to PremiumServices component
if (!code.includes('const navigate = useNavigate();')) {
  code = code.replace(
    /export const PremiumServices = \(\) => \{/,
    'export const PremiumServices = () => {\n  const navigate = useNavigate();'
  );
}

// 4. Update the card to be clickable and add the arrow
// Find the motion.div
code = code.replace(
  /<motion\.div\s+key=\{service\.id\}/,
  '<motion.div\n                onClick={() => service.link && service.link !== "#" && navigate(service.link)}\n                key={service.id}'
);

// Add cursor-pointer class and a group class for hover effects
code = code.replace(
  /className=\{`relative rounded-sm overflow-hidden p-8 flex flex-col transition-all duration-300 hover:scale-105 \$\{isDark/g,
  'className={`group cursor-pointer relative rounded-sm overflow-hidden p-8 flex flex-col transition-all duration-300 hover:scale-105 ${isDark'
);

// 5. Add arrow icon at the bottom of the card
// Find the closing of the Content div
const arrowCode = `
                  <div className="flex justify-end mt-4">
                    <div className={\`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-100 \${isDark ? 'bg-[#FEF8CF] text-[#36503F] opacity-0 group-hover:opacity-100' : 'bg-[#36503F] text-white opacity-0 group-hover:opacity-100'}\`}>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
`;

code = code.replace(
  /<\/p>\s*<\/div>\s*<\/motion\.div>/g,
  `</p>\n                </div>\n${arrowCode}\n              </motion.div>`
);

fs.writeFileSync('src/components/sections/PremiumServices.tsx', code);
console.log('Added links and arrows to cards');
