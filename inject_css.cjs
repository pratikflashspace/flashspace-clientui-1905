const fs = require('fs');
let code = fs.readFileSync('src/components/sections/PlanComparison.tsx', 'utf8');

// Find the start of the section
const sectionStart = `<section className="py-24 bg-[#FAF9F6] text-[#36503F] font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>`;
const newSectionStart = `<section className="py-24 bg-[#FAF9F6] text-[#36503F] font-sans plan-comparison-section" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{__html: \`
        .plan-comparison-section, 
        .plan-comparison-section * {
          font-family: 'Inter', sans-serif !important;
        }
      \`}} />`;

code = code.replace(sectionStart, newSectionStart);

fs.writeFileSync('src/components/sections/PlanComparison.tsx', code);
console.log('Injected internal CSS for font-family');
