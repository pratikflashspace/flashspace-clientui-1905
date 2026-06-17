const fs = require('fs');
let code = fs.readFileSync('src/components/sections/PremiumServices.tsx', 'utf8');

const sectionStart = `<section className="py-20 bg-[#FAF9F6] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>`;
const newSectionStart = `<section className="py-20 bg-[#FAF9F6] overflow-hidden premium-services-section" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{__html: \`
        .premium-services-section, 
        .premium-services-section * {
          font-family: 'Inter', sans-serif !important;
        }
      \`}} />`;

code = code.replace(sectionStart, newSectionStart);

// Also let's double check if there are any font-serif or font-header or font-grotesk that need to be removed to be safe
code = code.replace(/font-serif/g, 'font-sans');
code = code.replace(/font-header/g, 'font-sans');
code = code.replace(/font-grotesk/g, 'font-sans');

fs.writeFileSync('src/components/sections/PremiumServices.tsx', code);
console.log('Injected internal CSS for font-family in PremiumServices');
