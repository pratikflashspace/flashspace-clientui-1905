import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calculator, Percent, Landmark, Wallet, Briefcase, TrendingUp, PiggyBank, Home, Building2, Receipt, Building, FileText } from "lucide-react";
import { motion } from "framer-motion";

export const calculatorsList = [
  { id: "income-tax", title: "Income Tax Calculator", icon: Landmark, desc: "Calculate your annual income tax liability." },
  // { id: "hra", title: "HRA Calculator", icon: Home, desc: "Calculate House Rent Allowance exemption." },
  { id: "gst", title: "GST Calculator", icon: Receipt, desc: "Calculate GST inclusive and exclusive prices." },
  /*
  { id: "emi", title: "EMI Calculator", icon: Calculator, desc: "Calculate your monthly loan installments." },
  { id: "home-loan", title: "Home Loan EMI", icon: Home, desc: "Plan your home loan repayment." },
  { id: "salary", title: "Salary Calculator", icon: Wallet, desc: "Calculate take-home salary after deductions." },
  { id: "mutual-fund", title: "Mutual Fund Returns", icon: TrendingUp, desc: "Estimate mutual fund investment returns." },
  { id: "retirement", title: "Retirement Planning", icon: PiggyBank, desc: "Plan for a secure financial future." },
  { id: "epf", title: "EPF Calculator", icon: Briefcase, desc: "Calculate Employee Provident Fund returns." },
  { id: "ppf", title: "PPF Calculator", icon: PiggyBank, desc: "Calculate Public Provident Fund maturity." },
  { id: "nps", title: "NPS Calculator", icon: Landmark, desc: "Calculate National Pension System returns." },
  { id: "gratuity", title: "Gratuity Calculator", icon: Wallet, desc: "Calculate your employee gratuity amount." },
  { id: "compound-interest", title: "Compound Interest", icon: Percent, desc: "Calculate simple and compound interest." },
  { id: "fd", title: "FD Calculator", icon: Building2, desc: "Calculate Fixed Deposit maturity amount." },
  { id: "lumpsum", title: "Lumpsum Calculator", icon: TrendingUp, desc: "Estimate returns on lumpsum investments." },
  { id: "tds", title: "TDS Calculator", icon: FileText, desc: "Calculate Tax Deducted at Source." },
  { id: "rd", title: "RD Calculator", icon: Building2, desc: "Calculate Recurring Deposit returns." },
  { id: "sip", title: "SIP Calculator", icon: TrendingUp, desc: "Calculate Systematic Investment Plan returns." },
  { id: "business-setup", title: "Business Setup", icon: Building, desc: "Estimate costs to start a new business." },
  */
];

export default function CalculatorsHub() {
  useEffect(() => {
    document.title = "Calculators Hub — FlashSpace";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen text-[#36503F]" style={{ backgroundColor: "#FAFAF7", fontFamily: "'Inter', sans-serif" }}>
      <Header loginBlack forceWhiteBackground />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h3 className="text-[#36503F] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Financial & Business Tools
            </h3>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#36503F]">
              All Calculators
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Plan your finances, taxes, and business expenses with our comprehensive suite of free calculators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {calculatorsList.map((calc, idx) => {
              const Icon = calc.icon;
              return (
                <motion.div
                  key={calc.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                >
                  <Link 
                    to={`/calculators/${calc.id}`}
                    className="block h-full bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[#36503F]"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#F0F4EE] flex items-center justify-center mb-4 text-[#36503F]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{calc.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {calc.desc}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
