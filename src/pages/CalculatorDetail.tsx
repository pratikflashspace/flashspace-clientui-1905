import { useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { calculatorsList } from "./CalculatorsHub";

// Import calculators
import GenericCalculator from "@/components/calculators/GenericCalculator";
import GSTCalculator from "@/components/calculators/GSTCalculator";
import EPFCalculator from "@/components/calculators/EPFCalculator";
import SalaryCalculator from "@/components/calculators/SalaryCalculator";
import IncomeTaxCalculator from "@/components/calculators/IncomeTaxCalculator";
import EMICalculator from "@/components/calculators/EMICalculator";
import SIPCalculator from "@/components/calculators/SIPCalculator";

// Map IDs to components
const componentMap: Record<string, React.ReactNode> = {
  "gst": <GSTCalculator />,
  "epf": <EPFCalculator />,
  "salary": <SalaryCalculator />,
  "income-tax": <IncomeTaxCalculator />,
  "emi": <EMICalculator />,
  "sip": <SIPCalculator />,
};

export default function CalculatorDetail() {
  const { calculatorId } = useParams<{ calculatorId: string }>();
  const id = calculatorId?.toLowerCase() || "";

  const calculatorInfo = calculatorsList.find(c => c.id === id);

  useEffect(() => {
    if (calculatorInfo) {
      document.title = `${calculatorInfo.title} — FlashSpace`;
      window.scrollTo(0, 0);
    }
  }, [calculatorInfo]);

  if (!calculatorInfo) {
    return <Navigate to="/calculators" replace />;
  }

  // Fallback to Generic Calculator if not implemented yet
  const CalculatorComponent = componentMap[id] || <GenericCalculator title={calculatorInfo.title} />;

  return (
    <div className="min-h-screen text-[#36503F]" style={{ backgroundColor: "#FAFAF7", fontFamily: "'Inter', sans-serif" }}>
      <Header loginBlack forceWhiteBackground />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          {/* Back Link */}
          <div className="mb-8">
            <Link to="/calculators" className="inline-flex items-center text-sm font-medium text-[#6B8F78] hover:text-[#36503F] transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Calculators
            </Link>
          </div>

          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#36503F] mb-4">
              {calculatorInfo.title}
            </h1>
            <p className="text-gray-600 text-lg">
              {calculatorInfo.desc}
            </p>
          </div>

          {/* Render the Calculator Component */}
          <div className="mb-16">
            {CalculatorComponent}
          </div>

          {/* Informational SEO Content Below Calculator */}
          <section className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-[#E8E2D9]">
            <h2 className="text-2xl font-bold text-[#36503F] mb-6">About the {calculatorInfo.title}</h2>
            <div className="prose prose-green max-w-none text-gray-600">
              <p className="mb-4">
                Our {calculatorInfo.title} is designed to help you quickly and accurately calculate your financial and business numbers. FlashSpace provides tools that empower businesses to maintain compliance, forecast expenses, and manage taxation efficiently.
              </p>
              <h3 className="text-lg font-semibold text-[#1F2E26] mt-6 mb-3">Why use this calculator?</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>100% free and accurate calculations updated to the latest standards.</li>
                <li>Easy to use interface tailored for Indian businesses and individuals.</li>
                <li>Helps you make informed financial decisions without needing an accountant for basic estimates.</li>
              </ul>
              <div className="bg-[#F0F4EE] rounded-xl p-6 mt-8 border border-[#D4E0D0]">
                <h4 className="font-bold text-[#36503F] mb-2">Need Professional Help?</h4>
                <p className="text-sm">
                  Calculators provide estimates, but every business is unique. At FlashSpace, our experts can handle your complete compliance, taxation, and registration needs. Explore our packages or talk to our experts today.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
