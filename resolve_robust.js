const fs = require('fs');

const files = [
    'src/pages/BookingPage.tsx',
    'src/pages/Blog.tsx',
    'src/pages/admin/KYCRequests.tsx',
    'src/index.css',
    'src/components/Spaces/CoworkingSpaceComponent.tsx',
    'src/components/Spaces/SpaceComponent.tsx',
    'src/components/Header.tsx',
    'src/components/Footer.tsx',
    'src/components/ClientDashboard/KYCVerification.tsx',
    'src/pages/services/VirtualOffice.tsx'
];

files.forEach(file => {
    try {
        if (!fs.existsSync(file)) return;
        let content = fs.readFileSync(file, 'utf8');
        
        // Simple strategy: Keep Incoming changes (the side with the commit hash)
        // This is usually what's needed when merging a newer feature branch into main.
        // We'll use regex to match the whole conflict block.
        const regex = /<<<<<<< HEAD[\s\S]*?=======([\s\S]*?)>>>>>>> [a-f0-9]{40}/g;
        
        const newContent = content.replace(regex, (match, incoming) => {
            console.log(`Resolved conflict in ${file}`);
            return incoming;
        });

        // Also handle markers without hashes if any (just in case)
        const regexSimple = /<<<<<<< HEAD[\s\S]*?=======([\s\S]*?)>>>>>>> [^\r\n]+/g;
        const finalContent = newContent.replace(regexSimple, (match, incoming) => {
             console.log(`Resolved simple conflict in ${file}`);
             return incoming;
        });

        fs.writeFileSync(file, finalContent);
    } catch (e) {
        console.error(`Error processing ${file}: ${e.message}`);
    }
});
