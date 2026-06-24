const fs = require('fs');

const dataReplacement = `
const navData = [
  {
    label: "Solutions",
    isMegaMenu: true,
    sections: [
      {
        title: "Workspaces",
        items: [
          { label: "Virtual Office", href: "/services/virtual-office" },
          { label: "Coworking Spaces", href: "/services/coworking-space" }
        ]
      },
      {
        title: "Business Setup",
        items: [
          { label: "GST Registration", href: "#" },
          { label: "Company Registration", href: "#" },
          { label: "MSME Registration", href: "#" },
          { label: "Startup India Registration", href: "#" },
          { label: "FSSAI Registration", href: "#" },
          { label: "Section 8 Registration", href: "#" }
        ]
      },
      {
        title: "Filing & Taxation",
        items: [
          { label: "GST Filing", href: "#" },
          { label: "MCA Annual Compliance", href: "#" },
          { label: "LLP Annual Compliance", href: "#" },
          { label: "Accounting Services", href: "#" }
        ]
      },
      {
        title: "Business Tools",
        items: [
          { label: "One CRM", href: "#" }
        ]
      },
      {
        title: "Services",
        items: [
          { label: "Web Development", href: "#" }
        ]
      }
    ]
  },
  {
    label: "Packages",
    isDropdown: true,
    items: [
      { label: "Basic", href: "#" },
      { label: "Pro", href: "#" },
      { label: "Premium", href: "#" },
      { label: "Elite", href: "#" }
    ]
  },
  { label: "Partner with us", href: "/partner" },
  {
    label: "More",
    isDropdown: true,
    items: [
      { label: "About", href: "/about" },
      { label: "Calculator", href: "#" },
      { label: "Careers", href: "#" }
    ]
  }
];
`;

const desktopNavReplacement = `
          <nav className="hidden items-center gap-8 lg:flex">
            {navData.map((item, idx) => (
              <div key={idx} className="relative group py-6">
                {item.isMegaMenu || item.isDropdown ? (
                  <button className="flex items-center gap-1 text-sm font-medium text-[#36503F] transition-colors hover:text-[#1F2E26]">
                    {item.label}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </button>
                ) : (
                  <Link to={item.href || "#"} className="flex items-center text-sm font-medium text-[#36503F] transition-colors hover:text-[#1F2E26]">
                    {item.label}
                  </Link>
                )}

                {item.isMegaMenu && (
                  <div className="absolute top-[100%] left-1/2 -translate-x-1/2 pt-2 w-[90vw] max-w-5xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 grid grid-cols-5 gap-6 text-left">
                      {item.sections?.map((section, sIdx) => (
                        <div key={sIdx}>
                          <h3 className="text-[#36503F] font-bold text-xs uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">{section.title}</h3>
                          <ul className="space-y-3">
                            {section.items.map((sub, subIdx) => (
                              <li key={subIdx}>
                                <Link to={sub.href} className="text-sm text-gray-500 hover:text-[#36503F] hover:font-bold transition-colors block">
                                  {sub.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {item.isDropdown && (
                  <div className="absolute top-[100%] left-1/2 -translate-x-1/2 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 text-left">
                      {item.items?.map((sub, subIdx) => (
                        <Link key={subIdx} to={sub.href} className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#36503F] transition-colors">
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
`;

const mobileNavReplacement = `
          <nav className="flex flex-col gap-1 flex-1 overflow-y-auto pr-2 pb-4">
            {navData.map((item, idx) => (
              item.isMegaMenu ? (
                <details key={idx} className="group">
                  <summary className="flex items-center justify-between rounded-lg px-2 py-3 text-base font-medium text-white transition-colors hover:bg-white/5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    {item.label}
                    <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pl-4 pb-2 space-y-4">
                    {item.sections?.map((section, sIdx) => (
                      <div key={sIdx}>
                        <h4 className="text-[#FEF8C5] text-xs font-bold uppercase tracking-wider mb-2">{section.title}</h4>
                        <div className="space-y-2 pl-2 border-l border-white/10">
                          {section.items.map((sub, subIdx) => (
                            <Link key={subIdx} to={sub.href} onClick={closeDrawer} className="block text-sm text-white/70 hover:text-white py-1">
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              ) : item.isDropdown ? (
                <details key={idx} className="group">
                  <summary className="flex items-center justify-between rounded-lg px-2 py-3 text-base font-medium text-white transition-colors hover:bg-white/5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    {item.label}
                    <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pl-4 pb-2 space-y-2 border-l border-white/10 ml-2">
                    {item.items?.map((sub, subIdx) => (
                      <Link key={subIdx} to={sub.href} onClick={closeDrawer} className="block text-sm text-white/70 hover:text-white py-1.5 pl-2">
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link key={idx} to={item.href || "#"} onClick={closeDrawer} className="block rounded-lg px-2 py-3 text-base font-medium text-white transition-colors hover:bg-white/5">
                  {item.label}
                </Link>
              )
            ))}
          </nav>
`;

let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

// 1. Replace navItems array
const oldNavItemsMatch = code.match(/const navItems = \[\s*\{ label: "Virtual Office".*?\];/s);
if (oldNavItemsMatch) {
  code = code.replace(oldNavItemsMatch[0], dataReplacement);
}

// 2. Replace desktop nav
const oldDesktopNavMatch = code.match(/<nav className="hidden items-center gap-8 lg:flex">.*?<\/nav>/s);
if (oldDesktopNavMatch) {
  code = code.replace(oldDesktopNavMatch[0], desktopNavReplacement.trim());
}

// 3. Replace mobile nav
const oldMobileNavMatch = code.match(/<nav className="flex flex-col gap-1 flex-1 overflow-y-auto">.*?<\/nav>/s);
if (oldMobileNavMatch) {
  code = code.replace(oldMobileNavMatch[0], mobileNavReplacement.trim());
}

fs.writeFileSync('src/components/Header.tsx', code);
console.log('Successfully upgraded Header navigation');
