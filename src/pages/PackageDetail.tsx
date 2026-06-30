import { useEffect, useState } from "react";
import { useParams, Navigate, Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PricingSection } from "@/components/sections/PricingSection";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { PackageLeadModal } from "@/components/packages/PackageLeadModal";
import { PackageWorkspaces } from "@/components/packages/PackageWorkspaces";
import { WorkspacesFAQ } from "@/pages/services/GetWorkspaces";

const allFeatures = [
  { name: "Virtual office", plans: ["basic", "pro", "premium", "elite"], description: "Establish a professional business address without the need for physical space. Ideal for remote teams and startups." },
  { name: "One CRM", plans: ["basic", "pro", "premium", "elite"], description: "Streamline your customer relationship management with our unified CRM platform, designed to boost your sales and support efficiency." },
  { name: "GST", plans: ["pro", "premium", "elite"], description: "Complete Goods and Services Tax registration and compliance support to keep your business legally sound." },
  { name: "MSME/ Trade License", plans: ["pro", "premium", "elite"], description: "Obtain essential trade licenses and MSME registration to unlock government benefits and operate legally." },
  { name: "ESIC/PF", plans: ["pro", "premium", "elite"], description: "Hassle-free registration for Employee State Insurance and Provident Fund to ensure employee welfare and compliance." },
  { name: "Website Development (AI chatbot + Domain + Hosting)", plans: ["premium", "elite"], description: "Get a professional online presence with a custom website, including an AI chatbot, domain name, and reliable hosting." },
  { name: "Pvt Ltd/LLP/OPC Registration", plans: ["elite"], description: "End-to-end support for incorporating your business as a Private Limited Company, Limited Liability Partnership, or One Person Company." },
];

export default function PackageDetail() {
  const { planId } = useParams<{ planId: string }>();
  const location = useLocation();
  const plan = planId?.toLowerCase() || "";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>("");

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]);

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

            <div className="relative bg-gradient-to-b from-[#F9FAF8] to-[#F0F4EE] rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E8EEDF] overflow-hidden">
              {/* Decorative background blurs */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-[#36503F] opacity-[0.03] blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-[#36503F] opacity-[0.03] blur-3xl pointer-events-none"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative z-10">
                {planFeatures.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    className="group flex items-start gap-5 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-[#36503F]/20 transition-all duration-300"
                  >
                    <div className="mt-0.5 flex-shrink-0 bg-[#F0F4EE] group-hover:bg-[#36503F] transition-colors duration-300 rounded-full p-1">
                      <CheckCircle2 className="w-5 h-5 text-[#36503F] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1F2E26] text-lg mb-1.5 group-hover:text-[#36503F] transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {feature.name}
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* New City & Space Selection Section */}
        <PackageWorkspaces 
          planName={plan.toUpperCase()} 
          onSelectSpace={(spaceId) => {
            setSelectedSpaceId(spaceId);
            setIsModalOpen(true);
          }} 
        />

        {/* FAQs */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <h2 className="text-3xl font-bold text-center text-[#36503F] mb-12" style={{ fontFamily: "'Inter', sans-serif" }}>
              Frequently Asked Questions
            </h2>
            <WorkspacesFAQ city="your selected city" type="virtual-office" />
          </div>
        </section>
      </main>

      <PackageLeadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planName={plan.toUpperCase()}
        planKey={plan}
        spaceId={selectedSpaceId}
      />

      <Footer />
    </div>
  );
}
