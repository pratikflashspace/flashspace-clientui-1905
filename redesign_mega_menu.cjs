const fs = require('fs');

let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

// 1. Add new icons to imports
// Find the lucide-react import
const lucideImportRegex = /import\s+\{([^}]+)\}\s+from\s+"lucide-react";/;
const match = code.match(lucideImportRegex);
if (match) {
  let imports = match[1].split(',').map(s => s.trim());
  const newIcons = ['Briefcase', 'FileText', 'Wrench', 'Code', 'ChevronRight', 'PieChart', 'Calculator'];
  newIcons.forEach(icon => {
    if (!imports.includes(icon)) imports.push(icon);
  });
  code = code.replace(lucideImportRegex, `import { ${imports.join(', ')} } from "lucide-react";`);
}

// 2. Define the new component before Header
const megaMenuComponent = `
const MegaMenuDropdown = ({ sections, closeMenu }: { sections: any[], closeMenu?: () => void }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const getIcon = (title: string) => {
    switch (title) {
      case "Workspaces": return <Building2 className="w-5 h-5 text-gray-500" />;
      case "Business Setup": return <Briefcase className="w-5 h-5 text-gray-500" />;
      case "Filing & Taxation": return <FileText className="w-5 h-5 text-gray-500" />;
      case "Business Tools": return <Wrench className="w-5 h-5 text-gray-500" />;
      case "Services": return <Code className="w-5 h-5 text-gray-500" />;
      default: return <ChevronRight className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 flex overflow-hidden min-h-[400px]">
      {/* Left Sidebar Pane */}
      <div className="w-[35%] bg-[#F8F9FA] flex flex-col py-4 border-r border-gray-100">
        {sections.map((section, idx) => {
          const isActive = activeIndex === idx;
          return (
            <div
              key={idx}
              onMouseEnter={() => setActiveIndex(idx)}
              className={\`flex items-center justify-between px-6 py-4 cursor-pointer transition-colors \${isActive ? 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)] border-l-4 border-[#36503F]' : 'hover:bg-gray-100 border-l-4 border-transparent'}\`}
            >
              <div className="flex items-center gap-3">
                {getIcon(section.title)}
                <span className={\`text-[15px] font-medium \${isActive ? 'text-[#36503F]' : 'text-gray-700'}\`}>
                  {section.title}
                </span>
              </div>
              <ChevronRight className={\`w-4 h-4 \${isActive ? 'text-[#36503F]' : 'text-gray-400'}\`} />
            </div>
          );
        })}
      </div>

      {/* Right Content Pane */}
      <div className="w-[65%] bg-white p-8">
        <h3 className="text-lg font-bold text-[#36503F] mb-6 pb-4 border-b border-gray-100 inline-block min-w-[200px]">
          {sections[activeIndex]?.title}
        </h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {sections[activeIndex]?.items.map((sub: any, subIdx: number) => (
            <Link 
              key={subIdx} 
              to={sub.href} 
              onClick={closeMenu}
              className="text-[15px] text-gray-600 hover:text-[#36503F] hover:font-medium transition-colors flex items-center gap-2 py-1"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
`;

if (!code.includes('const MegaMenuDropdown')) {
  code = code.replace(
    /const Header = \(\{/,
    `${megaMenuComponent}\n\nconst Header = ({`
  );
}

// 3. Replace the inline Mega Menu JSX
// Need to find the exact block for `{item.isMegaMenu && (` down to `)}` inside desktop nav.
const megaMenuBlockRegex = /\{item\.isMegaMenu && \([\s\S]*?<div className="absolute top-\[100%\] left-\[-20px\] pt-2 mt-0 w-\[850px\] max-w-\[90vw\] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">[\s\S]*?<\/div>\s*<\/div>\s*\)\}/;

const newMegaMenuJSX = `{item.isMegaMenu && (
                  <div className="absolute top-[100%] left-[-20px] pt-2 mt-0 w-[850px] max-w-[90vw] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <MegaMenuDropdown sections={item.sections} />
                  </div>
                )}`;

if (megaMenuBlockRegex.test(code)) {
  code = code.replace(megaMenuBlockRegex, newMegaMenuJSX);
} else {
  // If exact regex fails, try a slightly looser one based on the first part
  const fallbackRegex = /\{item\.isMegaMenu && \(\s*<div className="absolute top-\[100%\] left-\[-20px\][\s\S]*?<\/div>\s*<\/div>\s*\)\}/;
  if (fallbackRegex.test(code)) {
    code = code.replace(fallbackRegex, newMegaMenuJSX);
  }
}

fs.writeFileSync('src/components/Header.tsx', code);
console.log('Successfully updated Mega Menu to side-tab layout');
