import React from "react";
import { motion } from "framer-motion";
import { Star, Leaf, Gem, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PackageLeadModal } from "../packages/PackageLeadModal";
import { useState } from "react";

export const PricingSection = ({ highlightPlan, compact }: { highlightPlan?: string, compact?: boolean }) => {
  const navigate = useNavigate();
  const [selectedPlanForLead, setSelectedPlanForLead] = useState<{name: string, key: string} | null>(null);
  const plans = [
    {
      name: "BASIC",
      description: "Everything you need\nto get started.",
      price: "₹8999",
      buttonText: "CHOOSE PLAN",
      highlight: highlightPlan ? highlightPlan.toLowerCase() === "basic" : false,
      icon: <Leaf className="w-6 h-6" />
    },
    {
      name: "PRO",
      description: "More power. More\nfeatures. More growth.",
      price: "₹11999",
      buttonText: "CHOOSE PLAN",
      highlight: highlightPlan ? highlightPlan.toLowerCase() === "pro" : false,
      icon: <Star className="w-6 h-6" />
    },
    {
      name: "PREMIUM",
      description: "Advanced tools for\nserious results.",
      price: "₹14999",
      buttonText: "CHOOSE PLAN",
      highlight: highlightPlan ? highlightPlan.toLowerCase() === "premium" : !highlightPlan,
      icon: <Gem className="w-8 h-8" />
    },
    {
      name: "ELITE",
      description: "Unmatched performance\nfor top achievers.",
      price: "₹24999",
      buttonText: "CHOOSE PLAN",
      highlight: highlightPlan ? highlightPlan.toLowerCase() === "elite" : false,
      icon: <Crown className="w-6 h-6" />
    },
  ];

  return (
    <section className={`bg-[#FAF9F6] ${compact ? 'pt-4 pb-8' : 'py-32'} text-[#25362B] relative overflow-hidden font-sans`} style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="container mx-auto px-4 lg:px-8">

        {/* Header content */}
        <div className={`text-center ${compact ? 'mb-2' : 'mb-20'}`}>
          <h3 className="text-[#36503F] text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            CHOOSE YOUR PLAN
          </h3>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
            Four Plans <span className="text-[#36503F] block mt-1">Unlimited Potential</span>
          </h2>
          <p className="text-gray-600 text-sm max-w-lg mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Pick the perfect plan and let's build<br />something extraordinary together.
          </p>
        </div>

        {/* Pricing Block */}
        <div className={`max-w-6xl mx-auto relative ${compact ? 'mt-4 pt-2' : 'mt-16 pt-8'} pb-12`}>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-4 relative z-10 px-2 lg:px-0">
            {plans.map((plan, index) => {

              if (plan.highlight) {
                return (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative z-20 w-full lg:w-[28%] min-w-[280px]"
                  >
                    {/* Dark Green Crest */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-12 bg-[#36503F] clip-path-badge flex items-center justify-center pt-1 z-30 shadow-xl border-t-2 border-[#FEF8C5]">
                      <Star className="w-5 h-5 text-[#FEF8C5] -mt-2" fill="none" strokeWidth={1.5} />
                    </div>

                    <div
                      onClick={(e) => {
                        // Prevent navigation if the click originated from the button
                        if ((e.target as HTMLElement).tagName.toLowerCase() === 'button') return;
                        navigate(`/packages/${plan.name.toLowerCase()}#select-city-spaces`);
                      }}
                      className="bg-[#FCFBF8] border-2 border-[#36503F] ring-1 ring-[#36503F]/50 rounded-xl pt-16 pb-16 px-6 lg:px-8 text-center shadow-[0_0_25px_rgba(54,80,63,0.35)] flex flex-col h-full relative overflow-hidden scale-100 lg:scale-[1.03] z-20 cursor-pointer"
                    >

                      {/* MOST POPULAR Pill */}
                      {plan.name === "PREMIUM" && (
                        <div className="mb-6 mx-auto">
                          <span className="bg-[#FEF8C5] text-[#36503F] text-[10px] font-bold px-4 py-1.5 rounded-full tracking-wider uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Most Popular
                          </span>
                        </div>
                      )}

                      {/* Icon inside circle */}
                      <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center mx-auto mb-6 text-[#36503F]">
                        {plan.icon}
                      </div>

                      <h3 className="text-base tracking-widest font-bold text-[#36503F] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>{plan.name}</h3>
                      <div className="w-8 h-[2px] bg-[#36503F] mx-auto mb-6"></div>

                      <p className="text-gray-600 text-xs leading-relaxed mb-8 whitespace-pre-line flex-grow" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {plan.description}
                      </p>

                      <div className="mb-8">
                        <span className="text-5xl font-serif text-[#36503F]" style={{ fontFamily: "'Inter', sans-serif" }}>{plan.price}</span>
                        <span className="text-gray-500 text-xs ml-1"></span>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/packages/${plan.name.toLowerCase()}#select-city-spaces`);
                          setTimeout(() => {
                            const element = document.getElementById('select-city-spaces');
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                            }
                          }, 100);
                        }}
                        className="w-full py-3.5 px-6 rounded-md text-xs font-bold tracking-wider transition-all duration-300 bg-[#36503F] text-[#FEF8C5] hover:bg-[#25362B] shadow-md"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {plan.buttonText}
                      </button>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).tagName.toLowerCase() === 'button') return;
                    navigate(`/packages/${plan.name.toLowerCase()}#select-city-spaces`);
                  }}
                  className="relative z-10 w-full lg:w-[24%] bg-[#FCFBF8] py-12 px-6 text-center border border-[#E8E2D9] rounded-xl shadow-sm cursor-pointer hover:border-[#36503F]/50 transition-colors"
                >
                  {/* MOST POPULAR Pill */}
                  {plan.name === "PREMIUM" && (
                    <div className="mb-6 mx-auto">
                      <span className="bg-[#FEF8C5] text-[#36503F] text-[10px] font-bold px-4 py-1.5 rounded-full tracking-wider uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Icon inside circle */}
                  <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center mx-auto mb-6 text-[#36503F]">
                    {plan.icon}
                  </div>

                  <h3 className="text-base tracking-widest font-bold text-[#36503F] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>{plan.name}</h3>
                  <div className="w-6 h-[2px] bg-[#36503F]/50 mx-auto mb-6"></div>

                  <p className="text-gray-500 text-xs leading-relaxed mb-8 whitespace-pre-line h-10 flex-grow" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {plan.description}
                  </p>

                  <div className="mb-8">
                    <span className="text-4xl font-serif text-[#36503F]" style={{ fontFamily: "'Inter', sans-serif" }}>{plan.price}</span>
                    <span className="text-gray-500 text-xs ml-1"></span>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/packages/${plan.name.toLowerCase()}#select-city-spaces`);
                      setTimeout(() => {
                        const element = document.getElementById('select-city-spaces');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 100);
                    }}
                    className="w-full py-3.5 px-6 rounded-md text-xs font-semibold tracking-wider transition-all duration-300 bg-transparent text-[#36503F] border border-gray-300 hover:border-[#36503F] hover:bg-gray-50"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {plan.buttonText}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Golden Line */}
          <div className="hidden lg:block absolute bottom-0 left-[2%] right-[2%] h-[1px] bg-gradient-to-r from-transparent via-[#36503F]/50 to-transparent">
            {/* Dots */}
            <div className="absolute top-1/2 -translate-y-1/2 left-[10%] w-1 h-1 rounded-full bg-[#36503F]"></div>
            <div className="absolute top-1/2 -translate-y-1/2 right-[10%] w-1 h-1 rounded-full bg-[#36503F]"></div>

            {/* Center glow and text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/4 h-[1px] bg-[#36503F] shadow-[0_0_10px_#36503F]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#36503F] shadow-[0_0_10px_#36503F]"></div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-[0.2em] text-[#36503F] uppercase bg-[#FAF9F6] px-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              Best Value
            </div>
          </div>

        </div>
      </div>

      <PackageLeadModal 
        isOpen={selectedPlanForLead !== null}
        onClose={() => setSelectedPlanForLead(null)}
        planName={selectedPlanForLead?.name || ''}
        planKey={selectedPlanForLead?.key || ''}
      />

      {/* Custom CSS for the badge shape */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .clip-path-badge {
          clip-path: polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%);
        }
      `}} />
    </section>
  );
};
