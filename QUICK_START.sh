#!/usr/bin/env bash
# Quick Start Guide - API Services

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           🚀 API SERVICES - QUICK START GUIDE                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "📂 NEW FILES STRUCTURE:"
echo "   Frontend/src/services/"
echo "   ├── 📄 api.service.ts              (Core configuration)"
echo "   ├── 📄 virtualOffice.service.ts    (Virtual Office API)"
echo "   ├── 📄 coworkingSpace.service.ts   (Coworking Space API)"
echo "   ├── 📄 index.ts                    (Central exports)"
echo "   └── 📄 README.md                   (Full documentation)"
echo ""

echo "═══════════════════════════════════════════════════════════════════"
echo "💻 BASIC USAGE"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

echo "1️⃣  Import a service:"
echo "   import { getVirtualOfficesByCity } from '@/services/virtualOffice.service';"
echo ""

echo "2️⃣  Use in component:"
echo "   const data = await getVirtualOfficesByCity('Delhi');"
echo ""

echo "3️⃣  Handle errors:"
echo "   try {
      const data = await getVirtualOfficesByCity('Delhi');
      setOffices(data);
    } catch (error: any) {
      setError(error.message);
    }"
echo ""

echo "═══════════════════════════════════════════════════════════════════"
echo "📚 AVAILABLE SERVICES"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

echo "🏢 Virtual Office Service:"
echo "   ✅ getVirtualOfficesByCity(city)"
echo "   ✅ getAllVirtualOffices()"
echo "   ✅ getVirtualOfficeById(id)"
echo "   ✅ createVirtualOffice(data)"
echo "   ✅ updateVirtualOffice(id, data)"
echo "   ✅ deleteVirtualOffice(id)"
echo ""

echo "🛋️  Coworking Space Service:"
echo "   ✅ getCoworkingSpacesByCity(city)"
echo "   ✅ getAllCoworkingSpaces()"
echo "   ✅ getCoworkingSpaceById(id)"
echo "   ✅ createCoworkingSpace(data)"
echo "   ✅ updateCoworkingSpace(id, data)"
echo "   ✅ deleteCoworkingSpace(id)"
echo ""

echo "═══════════════════════════════════════════════════════════════════"
echo "📋 COMPLETE EXAMPLE"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

echo "import { getVirtualOfficesByCity } from '@/services/virtualOffice.service';
import { useState, useEffect } from 'react';

function MyComponent({ city }: { city: string }) {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffices = async () => {
      setLoading(true);
      try {
        const data = await getVirtualOfficesByCity(city);
        setOffices(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffices();
  }, [city]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {offices.map(office => (
        <div key={office._id}>{office.name}</div>
      ))}
    </div>
  );
}"
echo ""

echo "═══════════════════════════════════════════════════════════════════"
echo "📖 DOCUMENTATION FILES"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

echo "📌 Primary Documentation:"
echo "   • Frontend/src/services/README.md"
echo "     └─ Complete API documentation with all examples"
echo ""

echo "📌 Getting Started:"
echo "   • Frontend/SERVICES_MIGRATION.md"
echo "     └─ Overview of changes and architecture"
echo ""

echo "📌 Migration Guide:"
echo "   • Frontend/SERVICES_MIGRATION_GUIDE.md"
echo "     └─ Step-by-step guide for migrating other pages"
echo ""

echo "📌 Architecture:"
echo "   • Frontend/SERVICES_ARCHITECTURE.md"
echo "     └─ Visual diagrams and data flow explanations"
echo ""

echo "═══════════════════════════════════════════════════════════════════"
echo "🎯 BENEFITS"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

echo "✅ Better Code Organization"
echo "✅ Improved Readability"
echo "✅ Centralized Error Handling"
echo "✅ Type Safe (Full TypeScript)"
echo "✅ Easy to Test & Mock"
echo "✅ Single Source of Truth"
echo "✅ Professional Architecture"
echo "✅ Scalable Design"
echo ""

echo "═══════════════════════════════════════════════════════════════════"
echo "🔍 INSPECT UPDATED COMPONENTS"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

echo "See how services are used in real components:"
echo "   • Frontend/src/pages/services/VirtualOffice.tsx"
echo "   • Frontend/src/pages/services/CoworkingSpace.tsx"
echo ""

echo "═══════════════════════════════════════════════════════════════════"
echo "🚀 NEXT STEPS"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

echo "1. Review Frontend/src/services/README.md"
echo "2. Check VirtualOffice.tsx and CoworkingSpace.tsx for examples"
echo "3. Migrate other pages using SERVICES_MIGRATION_GUIDE.md"
echo "4. Test all components work correctly"
echo "5. Remove old API patterns from codebase"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              ✨ You're all set! Happy coding! 🎉              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
