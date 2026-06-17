const fs = require('fs');

let code = fs.readFileSync('src/components/sections/PremiumServices.tsx', 'utf8');

// The file currently has duplicated lines from 1 to 11.
// Let's just find the services array and replace everything before it.
const servicesIndex = code.indexOf('const services = [');

if (servicesIndex !== -1) {
  const cleanTopPart = `import { motion } from "framer-motion";
import {
  Building2,
  Building,
  Rocket,
  Calculator,
  HeartHandshake,
  Code,
  ArrowRight,
  Handshake,
  User,
  ShieldCheck,
  Headset
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

`;

  const afterServices = code.substring(servicesIndex);
  
  // Now let's fix the first two items in the services array
  let fixedCode = cleanTopPart + afterServices;
  
  // Replace the first two items which are corrupted
  const patternToReplace = /const services = \[\s*\{\s*id: "01",[\s\S]*?theme: "light"\s*\},/m;
  
  const correctFirstTwoItems = `const services = [
  {
    id: "01",
    title: "Virtual Offices",
    link: "/solutions/virtual-office",
    description: "Professional business addresses and mail handling services to establish your presence.",
    icon: <Building2 className="w-6 h-6" />,
    theme: "dark"
  },
  {
    id: "02",
    title: "Coworking Spaces",
    link: "/services/coworking-space",
    description: "Flexible, fully-equipped shared workspaces designed for collaboration and productivity.",
    icon: <Building className="w-6 h-6" />,
    theme: "light"
  },`;

  fixedCode = fixedCode.replace(patternToReplace, correctFirstTwoItems);

  fs.writeFileSync('src/components/sections/PremiumServices.tsx', fixedCode);
  console.log('Fixed imports and restored Coworking Spaces data');
} else {
  console.log('Could not find services array');
}
