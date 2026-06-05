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

        if (content.includes('style={{ fontFamily: " style={{ fontFamily: "\'Inter\', sans-serif" }}\'Inter\', sans-serif" }}')) {
            content = content.replace(/style=\{\{ fontFamily: " style=\{\{ fontFamily: "'Inter', sans-serif" \}\}'Inter', sans-serif" \}\}/g, 'style={{ fontFamily: "\'Inter\', sans-serif" }}');
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed formatting in ${file}`);
        }
    });
});
