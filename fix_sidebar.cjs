const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/ClientDashboard/index.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const asideStart = content.indexOf('<aside');
const asideEnd = content.indexOf('</aside>') + '</aside>'.length;

if (asideStart === -1 || asideEnd === -1) {
  console.error("Could not find <aside> block");
  process.exit(1);
}

const newAside = `        <aside
          className={cn(
            "fixed top-0 left-0 z-50 h-screen bg-[#f8f8f8] shadow-xl border-r border-[#edede6] flex flex-col transition-all duration-300 ease-in-out",
            "w-72",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
            "xl:relative xl:translate-x-0 xl:shadow-none xl:h-full overflow-hidden",
            isSidebarCollapsed ? "xl:w-20" : "xl:w-72"
          )}
          data-lenis-prevent
        >
          {/* Header branding */}
          <div className={\`flex flex-col shrink-0 transition-all duration-300 \${isSidebarCollapsed ? "p-4 items-center" : "w-[287px] h-[137px] p-[24px]"}\`}>
              <div className={\`flex items-center w-full \${isSidebarCollapsed ? "justify-center" : "justify-between"}\`}>
                  <img
                      src="https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/665dd8e0007de68a44f3750b_Black%20and%20White%20Bold%20Typography%20Clothing%20Brand%20Logo%20(940%20x%20400%20px)%20(940%20x%20200%20px)%20(940%20x%20150%20px).png"
                      alt="FlashSpace Logo"
                      onClick={() => navigate("/")}
                      className={\`w-auto object-contain transition-all duration-300 ml-[-12px] cursor-pointer \${isSidebarCollapsed ? "h-7" : "h-9"}\`}
                  />
                  <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="xl:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                      <X size={24} />
                  </button>
              </div>

              <div className={\`mt-[17px] overflow-hidden transition-all duration-300 flex flex-col gap-1 \${isSidebarCollapsed ? "h-0 opacity-0" : "h-auto opacity-100"}\`}>
                  <h2 className="w-[239px] h-[20px] text-[14px] font-bold text-[#1a2d1d] whitespace-nowrap leading-none flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Customer Portal
                  </h2>
                  <p className="w-[239px] h-[16px] text-[12px] text-[#64748b] whitespace-nowrap font-medium leading-none flex items-center">
                      Manage your workspace subscriptions
                  </p>
              </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 space-y-2 pb-4" data-lenis-prevent>
              {mainMenuItems.map((item, idx) => {
                  const isActive = activeIndex === idx;
                  const showKycDot = item.name === "Profile & KYC" && kycStatus !== "approved";
                  const showNotificationBadge = item.name === "Notifications" && unreadCount > 0;

                  return (
                      <button
                          key={item.name}
                          onClick={() => handleNavigation(idx)}
                          title={isSidebarCollapsed ? item.name : ""}
                          className={\`
            flex items-center transition-all duration-300 rounded-lg group relative
            \${isSidebarCollapsed ? "justify-center w-12 h-12 mx-auto" : "justify-start w-[263px] h-[40px] px-[12px] gap-4 mx-auto"}
            \${isActive
                                  ? "bg-[#334d3d] text-[#FEF8C3] shadow-sm"
                                  : "text-[#677e73] hover:bg-gray-50 hover:text-[#1a2d1d]"
                              }
          \`}
                      >
                          <item.icon
                              size={isSidebarCollapsed ? 24 : 22}
                              strokeWidth={isActive ? 2.5 : 2}
                              className="shrink-0"
                          />
                          <span
                              className={\`text-[14px] font-semibold whitespace-nowrap transition-all duration-200 \${isSidebarCollapsed ? "w-0 opacity-0 overflow-hidden absolute" : "w-auto opacity-100 static"}\`}
                          >
                              {item.name}
                          </span>
                          {showKycDot && (
                              <span
                                  className={\`ml-auto flex items-center gap-1 text-xs font-bold text-red-500 transition-all duration-200 \${isSidebarCollapsed ? "absolute right-2 shadow-md bg-white p-0.5 rounded-full" : ""}\`}
                                  title="KYC Required"
                              >
                                  <AlertCircle size={14} strokeWidth={2.5} />
                                  {!isSidebarCollapsed && "KYC"}
                              </span>
                          )}
                          {isSidebarCollapsed && showNotificationBadge && (
                            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
                          )}
                      </button>
                  );
              })}
          </div>

          {/* Footer and Bottom Actions */}
          <div className="p-6 border-t border-gray-100 space-y-4 bg-[#f8f9fa]/30 shrink-0">
              <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className={\`
        hidden xl:flex items-center transition-colors text-[#677e73] hover:text-[#1a2d1d] py-2 mx-auto
        \${isSidebarCollapsed ? "justify-center w-full" : "justify-start gap-4 w-[263px] h-[40px] px-[12px]"}
      \`}
              >
                  {isSidebarCollapsed ? (
                      <ChevronRight size={22} />
                  ) : (
                      <>
                          <ChevronLeft size={20} />
                          <span className="text-[15px] font-bold">Collapse</span>
                      </>
                  )}
              </button>

        {user?.role && ['super_admin', 'admin', 'sales', 'support', 'affiliate_manager', 'space_partner_manager'].includes(user.role) && (
          <button
            onClick={() => navigate('/admin')}
            className={\`
              flex items-center rounded-lg shadow-sm font-bold transition-all border border-gray-200 text-purple-700 bg-white hover:bg-gray-50 hover:shadow-md mx-auto
              \${isSidebarCollapsed ? "justify-center w-full h-14" : "justify-start gap-4 w-[263px] h-[40px] px-[12px] text-[14px]"}
            \`}
            title={isSidebarCollapsed ? "Admin Portal" : ""}
          >
            <ShieldCheck size={20} className="shrink-0" />
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Admin Portal</span>}
          </button>
        )}

        {user?.role === 'partner' && (
          <button
            onClick={() => navigate('/spaceportal')}
            className={\`
              flex items-center rounded-lg shadow-sm font-bold transition-all border border-gray-200 text-orange-700 bg-white hover:bg-gray-50 hover:shadow-md mx-auto
              \${isSidebarCollapsed ? "justify-center w-full h-14" : "justify-start gap-4 w-[263px] h-[40px] px-[12px] text-[14px]"}
            \`}
            title={isSidebarCollapsed ? "Partner Portal" : ""}
          >
            <Building2 size={20} className="shrink-0" />
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Partner Portal</span>}
          </button>
        )}

        {user?.role === 'affiliate' && (
          <button
            onClick={() => navigate('/affiliate-portal')}
            className={\`
              flex items-center rounded-lg shadow-sm font-bold transition-all border border-gray-200 text-cyan-700 bg-white hover:bg-gray-50 hover:shadow-md mx-auto
              \${isSidebarCollapsed ? "justify-center w-full h-14" : "justify-start gap-4 w-[263px] h-[40px] px-[12px] text-[14px]"}
            \`}
            title={isSidebarCollapsed ? "Affiliate Portal" : ""}
          >
            <Users size={20} className="shrink-0" />
            {!isSidebarCollapsed && <span className="whitespace-nowrap">Affiliate Portal</span>}
          </button>
        )}

              <button
                  onClick={() => navigate("/")}
                  className={\`
        flex items-center rounded-lg shadow-sm font-bold transition-all border border-gray-200 text-[#677e73] bg-white hover:bg-gray-50 hover:shadow-md mx-auto
        \${isSidebarCollapsed ? "justify-center w-full h-14" : "justify-start gap-4 w-[263px] h-[40px] px-[12px] text-[14px]"}
      \`}
              >
                  <Home size={20} className="shrink-0" />
                  {!isSidebarCollapsed && (
                      <span className="whitespace-nowrap">Back to Home</span>
                  )}
              </button>
          </div>
        </aside>`;

content = content.substring(0, asideStart) + newAside + content.substring(asideEnd);

// Also need to make sure the main content is using xl instead of lg
content = content.replace('className={cn(\n            "relative flex-1 min-w-0 h-full overflow-x-hidden overflow-y-auto touch-pan-y scroll-smooth flex flex-col transition-all duration-300",\n            isSidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-72"\n          )}', 
'className={cn(\n            "relative flex-1 min-w-0 h-full overflow-x-hidden overflow-y-auto touch-pan-y scroll-smooth flex flex-col transition-all duration-300",\n            isSidebarCollapsed ? "xl:ml-0" : "xl:ml-0"\n          )}');

content = content.replace('className="lg:hidden h-16 bg-white/80', 'className="xl:hidden h-16 bg-white/80');

// Make sure `AlertCircle`, `AlertTriangle`, `ChevronLeft`, `ChevronRight` are imported
const importsMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/);
if (importsMatch) {
  let imports = importsMatch[1];
  ['ChevronRight', 'ChevronLeft'].forEach(i => {
    if (!imports.includes(i)) imports += `, ${i}`;
  });
  content = content.replace(importsMatch[0], `import {${imports}} from "lucide-react"`);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed Customer Sidebar');
