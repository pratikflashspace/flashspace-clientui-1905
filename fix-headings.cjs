const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/pages/affiliatePortal');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Fix H1 class
    content = content.replace(
        /<h1[^>]*className="[^"]*text-3xl[^"]*font-extrabold[^"]*"[^>]*>/g,
        '<h1 className="text-3xl font-extrabold tracking-tight text-[#1A1A1A]">'
    );
    
    // Fix sub-title paragraph under H1 (often text-lg)
    content = content.replace(
        /<p className="[^"]*text-lg[^"]*text-\[#64748b\][^"]*font-medium[^"]*">/g,
        '<p className="mt-2 text-lg font-medium text-[#6B8F78] tracking-tight">'
    );
    
    // In some cases, the H1 has child spans like `<span className="text-[#35503F] ...">`
    // We should ensure they use the correct secondary color `#36503F italic`
    content = content.replace(
        /<span className="text-\[#(?:35503F|334D3D)\][^"]*">([^<]+)<\/span>/g,
        (match, text) => `<span className="text-[#36503F] italic">${text}</span>`
    );
    
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log('Updated ' + file);
    }
}
