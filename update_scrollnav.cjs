const fs = require('fs');
let code = fs.readFileSync('src/components/sections/ScrollNavLayout.tsx', 'utf8');

// 1. Update imports
code = code.replace(
  'import { CoworkingSection } from "@/components/sections/scroll-sections/CoworkingSection";\nimport { BusinessSetupSection } from "@/components/sections/scroll-sections/BusinessSetupSection";\nimport { GlobalAccessSection } from "@/components/sections/scroll-sections/GlobalAccessSection";',
  'import { BusinessSetupSection } from "@/components/sections/scroll-sections/BusinessSetupSection";\nimport { TaxationFilingSection } from "@/components/sections/scroll-sections/TaxationFilingSection";'
);

// 2. Update components block
const oldComponents = `                    <div>
                        <VirtualOfficeSection />
                        <CoworkingSection />
                        <BusinessSetupSection />
                        <GlobalAccessSection />
                        <AISection />
                    </div>`;

const newComponents = `                    <div>
                        <VirtualOfficeSection />
                        <BusinessSetupSection />
                        <TaxationFilingSection />
                        <AISection />
                    </div>`;

code = code.replace(oldComponents, newComponents);

fs.writeFileSync('src/components/sections/ScrollNavLayout.tsx', code);
console.log('Updated ScrollNavLayout components and imports');
