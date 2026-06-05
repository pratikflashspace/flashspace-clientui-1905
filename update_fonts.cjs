const fs = require('fs');
const path = require('path');

const dirs = [
    'c:/Users/Aayush/OneDrive/Desktop/flashnew/FlashSpace-web-client/src/pages/spacePortal',
    'c:/Users/Aayush/OneDrive/Desktop/flashnew/FlashSpace-web-client/src/components/Spaces'
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
    files.forEach(file => {
        let filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;

        // Change text-black to text-gray-900 in the span inside h1
        if (content.includes('<span className="text-black')) {
            content = content.replace(/<span className="text-black dark:text-white">/g, '<span className="text-gray-900 dark:text-white">');
            changed = true;
        }

        // Add font family to h1 if not present
        if (content.includes('<h1 className="text-3xl font-extrabold')) {
            content = content.replace(/<h1 className="text-3xl font-extrabold([^>]*?)"(?! style={{)/g, '<h1 className="text-3xl md:text-3xl font-extrabold$1" style={{ fontFamily: "\'Inter\', sans-serif" }}');
            // some might already have style, we should replace text-3xl with text-3xl md:text-3xl if needed, but let's just do it simple:
            content = content.replace(/<h1 className="text-3xl font-extrabold([^>]*?)" style={{ fontFamily: "'Inter', sans-serif" }}/g, '<h1 className="text-3xl md:text-3xl font-extrabold$1" style={{ fontFamily: "\'Inter\', sans-serif" }}');
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${file}`);
        }
    });
});

// Update SpacePortalLayout.tsx
const layoutPath = 'c:/Users/Aayush/OneDrive/Desktop/flashnew/FlashSpace-web-client/src/layouts/SpacePortalLayout.tsx';
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
if (layoutContent.includes('text-black')) {
    layoutContent = layoutContent.replace(/text-black/g, 'text-gray-900');
    fs.writeFileSync(layoutPath, layoutContent, 'utf8');
    console.log("Updated SpacePortalLayout.tsx");
}

// Update Topbar.tsx
const topbarPath = 'c:/Users/Aayush/OneDrive/Desktop/flashnew/FlashSpace-web-client/src/components/SpacePartner/topbar/Topbar.tsx';
let topbarContent = fs.readFileSync(topbarPath, 'utf8');
let topbarChanged = false;
if (topbarContent.includes('text-black')) {
    topbarContent = topbarContent.replace(/text-black/g, 'text-gray-900');
    topbarChanged = true;
}
if (topbarContent.includes('font-bold text-gray-900')) {
    topbarContent = topbarContent.replace('font-bold text-gray-900', 'font-extrabold text-gray-900');
    topbarChanged = true;
}
if (topbarContent.includes('<h2 className="truncate text-xl') && !topbarContent.includes('fontFamily: "\'Inter\', sans-serif"')) {
    topbarContent = topbarContent.replace(/<h2 className="([^"]+)"(>)/, '<h2 className="$1" style={{ fontFamily: "\'Inter\', sans-serif" }}$2');
    topbarChanged = true;
}
if (topbarChanged) {
    fs.writeFileSync(topbarPath, topbarContent, 'utf8');
    console.log("Updated Topbar.tsx");
}
