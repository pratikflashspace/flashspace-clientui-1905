const fs = require('fs');
const path = require('path');

const filesToResolve = [
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

function resolveConflict(filePath) {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }

    const content = fs.readFileSync(absolutePath, 'utf8');
    const lines = content.split(/\r?\n/);
    const result = [];
    let state = 'NORMAL'; // NORMAL, HEAD, INCOMING

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('<<<<<<< HEAD')) {
            state = 'HEAD';
            continue;
        } else if (line.startsWith('=======')) {
            state = 'INCOMING';
            continue;
        } else if (line.startsWith('>>>>>>>')) {
            state = 'NORMAL';
            continue;
        }

        if (state === 'NORMAL') {
            result.push(line);
        } else if (state === 'HEAD') {
            // By default, for complex cases, let's keep BOTH or pick one.
            // For now, let's pick HEAD for logic and INCOMING for new UI features if we can distinguish.
            // But a simple "keep incoming" is often what's needed for new features.
            // ACTUALLY, let's KEEP BOTH for now and manually clean up if needed,
            // OR take one side. Let's take INCOMING (the side with the commit hash).
        } else if (state === 'INCOMING') {
             result.push(line);
        }
    }

    fs.writeFileSync(absolutePath, result.join('\n'));
    console.log(`Resolved: ${filePath}`);
}

filesToResolve.forEach(resolveConflict);
