const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Aayush/OneDrive/Desktop/flashnew/FlashSpace-web-client/src/pages/spacePortal';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
    let filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const regex = /<h1([^>]*?)text-\[#35503F\]([^>]*?)>([\s\S]*?)<\/h1>/g;
    let changed = false;
    
    content = content.replace(regex, (match, beforeClass, afterClass, inner) => {
        changed = true;
        let newH1Attrs = `<h1${beforeClass}${afterClass}>`.replace(/  +/g, ' ').replace(' className=" "', ' className=""');
        
        let newInner = inner;
        if (inner.includes('<span')) {
            newInner = inner.replace(/([\w\s&;]+)(<span[^>]*>.*?<\/span>)/i, (m, textBefore, span) => {
                let trimmed = textBefore.trim();
                let newTextBefore = trimmed ? `<span className="text-black dark:text-white">${trimmed}</span> ` : '';
                
                let newSpan = span.replace(/text-\[#[0-9a-fA-F]+\]/, 'text-[#36503F]');
                return `\n          ${newTextBefore}${newSpan}\n        `;
            });
        } else {
            let trimmed = inner.replace(/<[^>]+>/g, '').trim();
            let parts = trimmed.split(' ');
            if (parts.length > 1) {
                let first = parts[0];
                let rest = parts.slice(1).join(' ');
                newInner = `\n          <span className="text-black dark:text-white">${first}</span> <span className="text-[#36503F] italic">${rest}</span>\n        `;
            } else {
                newInner = `\n          <span className="text-black dark:text-white">${trimmed}</span>\n        `;
            }
        }
        
        return `${newH1Attrs}${newInner}</h1>`;
    });
    
    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});

// Now update SpacePortalLayout.tsx
const layoutPath = 'c:/Users/Aayush/OneDrive/Desktop/flashnew/FlashSpace-web-client/src/layouts/SpacePortalLayout.tsx';
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
if (layoutContent.includes('const makeTitle = (lead: string, highlight?: string) =>')) {
    layoutContent = layoutContent.replace(
        /const makeTitle = \(lead: string, highlight\?: string\) =>[\s\S]*?\):\s*\(\s*lead\s*\);/m,
        `const makeTitle = (lead: string, highlight?: string) =>
    highlight ? (
      <>
        <span className="text-black dark:text-white">{lead}</span>{" "}
        <span className="text-[#36503F] italic">{highlight}</span>
      </>
    ) : (
      <span className="text-black dark:text-white">{lead}</span>
    );`
    );
    fs.writeFileSync(layoutPath, layoutContent, 'utf8');
    console.log("Updated SpacePortalLayout.tsx");
}

// Update Topbar.tsx
const topbarPath = 'c:/Users/Aayush/OneDrive/Desktop/flashnew/FlashSpace-web-client/src/components/SpacePartner/topbar/Topbar.tsx';
let topbarContent = fs.readFileSync(topbarPath, 'utf8');
if (topbarContent.includes('text-[#35503F]')) {
    topbarContent = topbarContent.replace('text-[#35503F]', 'text-black');
    fs.writeFileSync(topbarPath, topbarContent, 'utf8');
    console.log("Updated Topbar.tsx");
}
