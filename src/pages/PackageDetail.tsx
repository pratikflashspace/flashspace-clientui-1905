import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PricingSection } from "@/components/sections/PricingSection";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { PackageLeadModal } from "@/components/packages/PackageLeadModal";

const allFeatures = [
  { name: "Virtual office", plans: ["basic", "pro", "premium", "elite"] },
  { name: "One CRM", plans: ["basic", "pro", "premium", "elite"] },
  { name: "GST", plans: ["pro", "premium", "elite"] },
  { name: "MSME/ Trade License", plans: ["pro", "premium", "elite"] },
  { name: "ESIC/PF", plans: ["pro", "premium", "elite"] },
  { name: "Website Development (AI chatbot + Domain + Hosting)", plans: ["premium", "elite"] },
  { name: "Pvt Ltd/LLP/OPC Registration", plans: ["elite"] },
];

export default function PackageDetail() {
  const { planId } = useParams<{ planId: string }>();
  const plan = planId?.toLowerCase() || "";
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    document.title = `${plan.toUpperCase()} Package — FlashSpace`;
  }, [plan]);

  if (!["basic", "pro", "premium", "elite"].includes(plan)) {
    return <Navigate to="/solutions/virtual-office" replace />;
  }

  const planFeatures = allFeatures.filter((f) => f.plans.includes(plan));

  return (
    <div
      className="min-h-screen text-foreground antialiased"
      style={{ backgroundColor: "#FAFAF7", fontFamily: "'Inter', sans-serif" }}
    >
      <Header loginBlack forceWhiteBackground />

      <main className="pt-20 pb-16">
        {/* Dynamic Pricing Section where current plan is highlighted */}
        <PricingSection highlightPlan={plan} compact={true} />

        {/* Features Details Section */}
        <section id="whats-included" className="bg-white py-20 border-t border-b border-[#E8E2D9]">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#36503F] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                What's included in the <span className="text-[#36503F]">{plan.toUpperCase()}</span> Plan?
              </h2>
              <p className="text-gray-600 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                Here's a detailed breakdown of everything you get.
              </p>
            </div>

            <div className="bg-[#F0F4EE] rounded-2xl p-8 md:p-12 shadow-sm border border-[#D4E0D0]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {planFeatures.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                  >
                    <div className="mt-1 flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-[#36503F]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1F2E26] text-sm md:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {feature.name}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#36503F] hover:bg-[#1F2E26] text-[#FEF8C5] px-8 py-4 rounded-full font-bold tracking-wider transition-all shadow-md hover:shadow-lg"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PackageLeadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planName={plan.toUpperCase()}
        planKey={plan}
      />

      <Footer />
    </div>
  );
}
