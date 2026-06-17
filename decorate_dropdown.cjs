const fs = require('fs');

let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

const regex = /const MegaMenuDropdown = \(\{ sections, closeMenu \}: \{ sections: any\[\], closeMenu\?: \(\) => void \}\) => \{[\s\S]*?^\};\s*$/m;

const newComponent = `const MegaMenuDropdown = ({ sections, closeMenu }: { sections: any[], closeMenu?: () => void }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const getIcon = (title: string, isActive: boolean) => {
    const color = isActive ? "text-[#36503F]" : "text-gray-400";
    switch (title) {
      case "Workspaces": return <Building2 className={\`w-5 h-5 \${color}\`} />;
      case "Business Setup": return <Briefcase className={\`w-5 h-5 \${color}\`} />;
      case "Filing & Taxation": return <FileText className={\`w-5 h-5 \${color}\`} />;
      case "Business Tools": return <Wrench className={\`w-5 h-5 \${color}\`} />;
      case "Services": return <Code className={\`w-5 h-5 \${color}\`} />;
      default: return <ChevronRight className={\`w-5 h-5 \${color}\`} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-[#FEF8CF] flex overflow-hidden min-h-[400px]">
      {/* Left Sidebar Pane */}
      <div className="w-[35%] bg-[#FAF9F6] flex flex-col py-4 border-r border-[#FEF8CF]/50">
        {sections.map((section, idx) => {
          const isActive = activeIndex === idx;
          return (
            <div
              key={idx}
              onMouseEnter={() => setActiveIndex(idx)}
              className={\`flex items-center justify-between px-6 py-4 cursor-pointer transition-all duration-300 \${isActive ? 'bg-[#FEF8CF] shadow-[0_4px_12px_rgba(54,80,63,0.05)] border-l-4 border-[#36503F]' : 'hover:bg-[#FEF8CF]/40 border-l-4 border-transparent'}\`}
            >
              <div className="flex items-center gap-3">
                {getIcon(section.title, isActive)}
                <span className={\`text-[15px] \${isActive ? 'text-[#36503F] font-bold' : 'text-gray-600 font-medium'}\`}>
                  {section.title}
                </span>
              </div>
              <ChevronRight className={\`w-4 h-4 transition-transform duration-300 \${isActive ? 'text-[#36503F] translate-x-1' : 'text-gray-300'}\`} />
            </div>
          );
        })}
      </div>

      {/* Right Content Pane */}
      <div className="w-[65%] bg-white p-8">
        <h3 className="text-lg font-bold text-[#36503F] mb-6 pb-4 border-b border-[#FEF8CF] inline-block min-w-[200px]">
          {sections[activeIndex]?.title}
        </h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          {sections[activeIndex]?.items.map((sub: any, subIdx: number) => (
            <Link 
              key={subIdx} 
              to={sub.href} 
              onClick={closeMenu}
              className="text-[15px] text-gray-600 hover:text-[#36503F] hover:bg-[#FEF8CF]/30 hover:font-medium transition-all duration-200 flex items-center gap-2 px-3 py-2.5 rounded-lg border border-transparent hover:border-[#FEF8CF]"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#36503F] opacity-0 transition-opacity duration-200 group-hover:opacity-100"></div>
              {sub.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};`;

code = code.replace(regex, newComponent);

fs.writeFileSync('src/components/Header.tsx', code);
console.log('Decorated solutions dropdown with theme colors');
