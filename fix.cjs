const fs = require('fs');
let code = fs.readFileSync('src/components/sections/PlanComparison.tsx', 'utf8');

const lines = code.split('\n');

const correctPlansArray = `  const plans = [
    {
      name: "BASIC",
      subtitle: "Everything you need\\nto get started.",
      icon: <Leaf className="w-6 h-6" />,
      marketPrice: "₹50000",
      ourPrice: "₹8999",
      savings: "₹41000",
      savingsPct: "82%",
      highlight: false,
    },
    {
      name: "PRO",
      subtitle: "More power. More\\nfeatures. More growth.",
      icon: <Star className="w-6 h-6" />,
      marketPrice: "₹60000",
      ourPrice: "₹11999",
      savings: "₹48000",
      savingsPct: "80%",
      highlight: false,
    },
    {
      name: "PREMIUM",
      subtitle: "Advanced tools for\\nserious results.",
      icon: <Gem className="w-6 h-6" />,
      marketPrice: "₹80000",
      ourPrice: "₹14999",
      savings: "₹65000",
      savingsPct: "81%",
      highlight: true,
    },
    {
      name: "ELITE",
      subtitle: "Unmatched performance\\nfor top achievers.",
      icon: <Crown className="w-6 h-6" />,
      marketPrice: "₹99999",
      ourPrice: "₹24999",
      savings: "₹75000",
      savingsPct: "75%",
      highlight: false,
    },
  ];

  const activeCol = hoveredColumn !== null ? hoveredColumn : plans.findIndex(p => p.highlight);`;

// The broken code has:
// 6:   const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
// 7:       marketPrice: "₹99999",
// 8:       ourPrice: "₹24999",
// ...
// 12:     },
// 13:   ];

lines.splice(6, 8, correctPlansArray); // Replace from line index 6 (line 7) and remove 8 lines (7 to 14)

fs.writeFileSync('src/components/sections/PlanComparison.tsx', lines.join('\n'));
console.log('Fixed plans array');
