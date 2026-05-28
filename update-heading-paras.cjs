const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Aayush/OneDrive/Desktop/flashnew/FlashSpace-web-client/src/pages/affiliatePortal';

fs.readdirSync(dir).forEach(file => {
  if (!file.endsWith('.tsx')) return;
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // We are looking for something like:
  // <h1 ...> ... </h1>
  // <p className="text-sm md:text-base text-gray-500 ...">
  // We'll replace the p class.

  // A regex to find <h1 or <h2, followed by anything up to </h1 or </h2, followed by some whitespace, then <p className="..."
  const regex = /(<h[12][^>]*>[\s\S]*?<\/h[12]>[\s\S]*?<p\s+className=")([^"]+)(")/g;
  
  content = content.replace(regex, (match, p1, p2, p3) => {
    // Only replace if it's the heading paragraph (usually containing text-sm or text-gray-500 or text-[#6B8F78])
    // We'll just replace the entire class with what the user requested, preserving layout classes if possible, but the user requested: font size 16px, color #6B7280.
    // Let's ensure we keep 'mt-...' or similar. Or simply: "text-[16px] text-[#6B7280] font-medium"
    
    // Instead of completely wiping, we can replace text colors and sizes:
    let newClass = p2;
    newClass = newClass.replace(/text-sm/g, 'text-[16px]')
                       .replace(/md:text-base/g, '')
                       .replace(/text-gray-500/g, 'text-[#6B7280]')
                       .replace(/text-\[\#6B8F78\]/g, 'text-[#6B7280]')
                       .replace(/text-gray-600/g, 'text-[#6B7280]')
                       .replace(/text-base/g, 'text-[16px]')
                       .replace(/text-lg/g, 'text-[16px]');
    
    // If it doesn't have 16px or 6B7280, add it
    if (!newClass.includes('text-[16px]')) {
        newClass += ' text-[16px]';
    }
    if (!newClass.includes('text-[#6B7280]')) {
        newClass += ' text-[#6B7280]';
    }

    // Clean up extra spaces
    newClass = newClass.replace(/\s+/g, ' ').trim();
    
    return p1 + newClass + p3;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
