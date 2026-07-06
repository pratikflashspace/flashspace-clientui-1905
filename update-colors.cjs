const fs = require('fs');

const files = [
  'src/pages/services/GetWorkspaces.tsx',
  'src/pages/services/GetWorkspacesV2.tsx',
  'src/pages/services/GetCoworkingSpacesV2.tsx',
  'src/pages/PackageDetailWorkspaces.tsx',
  'src/pages/PackageDetail.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/color:\s*"bg-[a-z]+-\d+"/g, 'color: "bg-[#36503F]"');
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  } else {
    console.log('File not found: ' + file);
  }
});
