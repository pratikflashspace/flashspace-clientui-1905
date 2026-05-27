const fs = require('fs');
const path = require('path');

const dirs = [
    path.join(__dirname, 'src/pages/affiliatePortal'),
    path.join(__dirname, 'src/components/affiliatePortal')
];

function processFile(filePath) {
    if (!filePath.endsWith('.tsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Add font-sans to existing className
    content = content.replace(/(<h[1-4]\b[^>]*className=["'])([^"']*?)(["'])/g, (match, prefix, classes, suffix) => {
        if (!classes.split(' ').includes("font-sans")) {
            return prefix + "font-sans " + classes + suffix;
        }
        return match;
    });

    // 2. Add className="font-sans" to h1-h4 that don't have className
    content = content.replace(/(<h[1-4]\b)(?![^>]*className=)([^>]*>)/g, '$1 className="font-sans"$2');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else {
            processFile(fullPath);
        }
    }
}

dirs.forEach(processDirectory);
console.log("Done.");
