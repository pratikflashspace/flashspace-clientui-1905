const fs = require('fs');
const path = require('path');

function walk(dir) {
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            walk(p);
        } else if (p.endsWith('.tsx')) {
            let content = fs.readFileSync(p, 'utf8');
            const newContent = content.replace(/<h1 className="text-3xl md:text-3xl font-extrabold text-\[#35503F\] tracking-tight">/g, '<h1 className="text-3xl md:text-3xl font-extrabold text-gray-900 tracking-tight">');
            if (content !== newContent) {
                fs.writeFileSync(p, newContent);
                console.log('Updated ' + p);
            }
        }
    });
}

walk('src/pages/affiliatePortal');
