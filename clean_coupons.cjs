const fs = require('fs');

const file = 'c:/Users/Aayush/OneDrive/Desktop/flashnew/FlashSpace-web-client/src/pages/affiliatePortal/CouponsAndVouchers.tsx';

let content = fs.readFileSync(file, 'utf8');

// Replace component name
content = content.replace(/const MarketingTools = \(\) => {/g, 'const CouponsAndVouchers = () => {');
content = content.replace(/export default MarketingTools;/g, 'export default CouponsAndVouchers;');

// Remove ASSETS_DATA
content = content.replace(/const ASSETS_DATA = \[[\s\S]*?\];/g, '');
content = content.replace(/FileText,\s*Download,\s*/g, '');

// Remove Marketing Tools title and description
content = content.replace(/Marketing <span className="text-\[#35503F\] italic">Tools<\/span>/g, 'Coupons \\& <span className="text-[#35503F] italic">Vouchers</span>');
content = content.replace(/Manage your coupons and promotional assets/g, 'Generate and manage your affiliate coupons');

// Remove Tabs structure, keep only the content
content = content.replace(/<Tabs defaultValue="coupons" className="w-full">[\s\S]*?<TabsList[\s\S]*?<\/TabsList>/g, '');

// Remove TabsContent wrapper but keep children
content = content.replace(/<TabsContent value="coupons" className="space-y-10 outline-none animate-slide-up">/g, '<div className="space-y-10 animate-slide-up">');

// Remove Marketing Assets Tab entirely
content = content.replace(/<\/TabsContent>\s*{\/\* --- MARKETING ASSETS TAB --- \*\/}[\s\S]*?<\/TabsContent>\s*<\/Tabs>/g, '</div>');

// Write back
fs.writeFileSync(file, content);
console.log('Done cleaning CouponsAndVouchers.tsx');
