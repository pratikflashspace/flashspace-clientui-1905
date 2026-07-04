const fs = require('fs');
let c = fs.readFileSync('src/pages/services/GetCoworkingSpacesV2.tsx', 'utf-8');
c = c.replace(/import \{ (\w+)SeoContent \} from "@\/components\/sections\/(\w+)SeoContent";/g, 'import { $1CoworkingSeoContent } from "@/components/sections/$1CoworkingSeoContent";');
c = c.replace(/<(\w+)SeoContent \/>/g, '<$1CoworkingSeoContent />');
c = c.replace(/workspaceType === "virtual-office"/g, 'workspaceType === "coworking-space"');
fs.writeFileSync('src/pages/services/GetCoworkingSpacesV2.tsx', c);
