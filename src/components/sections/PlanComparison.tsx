import React from "react";
import { motion } from "framer-motion";
import { Leaf, Star, Gem, Crown, Check, Minus, Tag, Zap, IndianRupee } from "lucide-react";

export const PlanComparison = () => {
  const plans = [
    {
      name: "BASIC",
      subtitle: "Everything you need\nto get started.",
      icon: <Leaf className="w-6 h-6" />,
      marketPrice: "₹50000",
      ourPrice: "₹8999",
      savings: "₹41000",
      savingsPct: "82%",
      highlight: false,
    },
    {
      name: "PRO",
      subtitle: "More power. More\nfeatures. More growth.",
      icon: <Star className="w-6 h-6" />,
      marketPrice: "₹60000",
      ourPrice: "₹11999",
      savings: "₹48000",
      savingsPct: "80%",
      highlight: false,
    },
    {
      name: "PREMIUM",
      subtitle: "Advanced tools for\nserious results.",
      icon: <Gem className="w-6 h-6" />,
      marketPrice: "₹80000",
      ourPrice: "₹14999",
      savings: "₹65000",
      savingsPct: "81%",
      highlight: true,
    },
    {
      name: "ELITE",
      subtitle: "Unmatched performance\nfor top achievers.",
      icon: <Crown className="w-6 h-6" />,
      marketPrice: "₹99999",
      ourPrice: "₹24999",
      savings: "₹75000",
      savingsPct: "75%",
      highlight: false,
    },
  ];


  const features = [
    {
      name: "Virtual office",
      availability: [true, true, true, true]
    },
    {
      name: "One CRM",
      availability: [true, true, true, true]
    },
    {
      name: "GST",
      availability: [false, true, true, true]
    },
    {
      name: "MSME/ Trade License",
      availability: [false, true, true, true]
    },
    {
      name: "ESIC/PF",
      availability: [false, true, true, true]
    },
    {
      name: "Website Development (AI chatbot + Domain + Hosting)",
      availability: [false, false, true, true]
    },
    {
      name: "Pvt Ltd/LLP/OPC Registeration",
      availability: [false, false, false, true]
    },
  ];

  return (
    <section className="py-24 bg-[#FAF9F6] text-[#36503F] font-sans plan-comparison-section" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{__html: `
        .plan-comparison-section, 
        .plan-comparison-section * {
          font-family: 'Inter', sans-serif !important;
        }
      `}} />
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="text-[#36503F] text-xs font-bold tracking-[0.2em] uppercase mb-4">
            Compare and Choose Smarter
          </h3>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-black">Premium Benefits. </span>
            <span className="text-[#36503F]">Better Price.</span>
          </h2>
          <p className="text-gray-600">
            Get the best tools, features and support at a price that makes sense.
          </p>
          <div className="w-12 h-[2px] bg-[#FEF8CF] mx-auto mt-6"></div>
        </div>

        {/* Desktop Comparison Table (Hidden on Mobile) */}
        <div className="hidden lg:block relative mt-8 w-full overflow-visible pb-6 pt-5">
          <div className="min-w-[900px] relative">
            {/* Badge outside to prevent overflow hidden clipping */}
            <div 
              className="absolute top-0 bg-[#36503F] text-[#FEF8CF] text-[10px] font-bold px-4 py-1.5 rounded-full tracking-wider uppercase shadow-md whitespace-nowrap z-[60] border border-[#36503F]"
              style={{ left: '72.22%', transform: 'translate(-50%, -50%)' }}
            >
              Most Popular
            </div>

            {/* Comparison Table Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 relative">
            
            {/* Full-Height Column Border overlay for PRO */}
            <div className="absolute top-[-2px] bottom-[-2px] w-[18.52%] border-[2px] border-[#FDE047] rounded-xl shadow-[0_0_20px_rgba(253,224,71,0.4)] pointer-events-none z-30 transition-all duration-300" style={{ left: '62.96%' }}></div>
            
            {/* Header Row */}
            <div className={`grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] border-b border-gray-200 transition-all duration-300 hover:scale-[1.02] hover:z-50 hover:shadow-md hover:relative hover:bg-white hover:rounded-lg`}>
              {/* Top Left Header */}
              <div className="bg-[#36503F] text-white p-5 lg:p-6 flex flex-col justify-center rounded-tl-xl relative z-20 ">
                <div className="w-12 h-12 border border-[#FEF8CF] rounded-full flex items-center justify-center mb-4 text-[#FEF8CF] shrink-0">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3v18M5 10l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 14h14" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg lg:text-xl font-medium mb-2 whitespace-nowrap">Plan Comparison</h3>
                <p className="text-xs lg:text-sm text-gray-400">See how our plans compare<br />with market pricing.</p>
              </div>
              
              {/* Plan Headers */}
              {plans.map((plan, i) => (
                <div
                  key={i}
                  className={`p-5 lg:p-6 flex flex-col items-center justify-center text-center relative cursor-default rounded-t-xl ${plans[i].highlight ? "bg-gray-100" : "bg-white"} z-20`}
                >
                  <div className={`w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center mb-4 shrink-0 transition-transform duration-300 hover:rotate-12 ${plans[i].highlight ? 'bg-[#36503F] text-[#FEF8CF] border-none shadow-md' : 'text-[#36503F]'}`}>
                    {plan.icon}
                  </div>
                  <h4 className={`font-bold tracking-widest text-sm mb-2 ${plans[i].highlight ? 'text-[#36503F]' : ''}`}>{plan.name}</h4>
                  <p className="text-xs text-gray-500 whitespace-pre-line">{plan.subtitle}</p>
                </div>
              ))}
            </div>

          {/* Pricing Rows */}
          
          {/* Market Price Row */}
          <div className={`grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] border-b border-gray-200 transition-all duration-300 hover:scale-[1.02] hover:z-50 hover:shadow-md hover:relative hover:bg-white hover:rounded-lg`}>
            <div className="p-6 flex items-center justify-between border-r border-gray-100 bg-[#36503F]">
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-xs font-bold tracking-wider text-white">MARKET PRICE</div>
                  <div className="text-[10px] text-gray-400">What you'd pay elsewhere</div>
                </div>
              </div>
            </div>
            {plans.map((plan, i) => (
              <div key={i} className={`p-6 flex items-center justify-center border-r border-gray-100 last:border-r-0 ${plans[i].highlight ? 'bg-gray-100' : 'bg-[#F9F8F4]'}`}>
                <span className="text-gray-500 line-through text-xl font-sans">{plan.marketPrice}</span>
                {/* <span className="text-xs text-gray-500 ml-1">/month</span> */}
              </div>
            ))}
          </div>

          {/* Our Price Row */}
          <div className={`grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] border-b border-[#FEF8CF] bg-[#FEF8CF] transition-all duration-300 hover:scale-[1.02] hover:z-50 hover:shadow-md hover:relative hover:rounded-lg`}>
            <div className="p-6 flex items-center gap-3 border-r border-[#FEF8CF] bg-[#FEF8CF]">
              <Tag className="w-4 h-4 text-[#36503F]" />
              <div>
                <div className="text-xs font-bold tracking-wider text-[#36503F]">OUR PRICE</div>
                <div className="text-[10px] text-[#36503F]/70">What you pay with us</div>
              </div>
            </div>
            {plans.map((plan, i) => (
              <div key={i} className={`p-6 flex items-center justify-center border-r border-[#FEF8CF] last:border-r-0 ${plans[i].highlight ? 'bg-gray-100' : ''}`}>
                <span className="text-3xl font-sans text-[#36503F]">{plan.ourPrice}</span>
                {/* <span className="text-xs text-[#36503F]/80 ml-1">/month</span> */}
              </div>
            ))}
          </div>

          {/* You Save Row */}
          <div className={`grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] border-b border-gray-200 transition-all duration-300 hover:scale-[1.02] hover:z-50 hover:shadow-md hover:relative hover:bg-white hover:rounded-lg`}>
            <div className="p-6 flex items-center gap-3 border-r border-gray-100 bg-white">
              <Tag className="w-4 h-4 text-[#36503F]" />
              <div>
                <div className="text-xs font-bold tracking-wider text-[#36503F]">YOU SAVE</div>
                <div className="text-[10px] text-gray-500">Every month</div>
              </div>
            </div>
            {plans.map((plan, i) => (
              <div key={i} className={`p-6 flex items-center justify-center border-r border-gray-100 last:border-r-0 ${plans[i].highlight ? "bg-gray-100" : ""}`}>
                <span className={`font-sans text-lg text-[#36503F]`}>{plan.savings}</span>
                {/* <span className={`text-xs ml-1 ${(activeCol === i) ? 'text-[#FEF8CF]/70' : 'text-gray-500'}`}>/month ({plan.savingsPct})</span> */}
              </div>
            ))}
          </div>

          {/* Features Header */}
          <div className="bg-[#36503F] text-white text-xs font-bold tracking-widest px-8 py-3 uppercase">
            Features Comparison
          </div>

          {/* Feature Rows */}
          {features.map((feature, idx) => (
            <div key={idx} className={`grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] border-b border-gray-200 last:border-b-0 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"} transition-all duration-300 hover:scale-[1.02] hover:z-50 hover:shadow-md hover:relative hover:bg-white hover:rounded-lg`}>
              <div className="p-5 flex items-center gap-3 border-r border-gray-100">
                <div className="w-5 h-5 flex items-center justify-center text-gray-400">
                  <Zap className="w-4 h-4" />
                </div>
                {feature.name.includes("Website Development") ? (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-700 font-medium">Website Development</span>
                    <span className="text-[10px] text-gray-500 mt-0.5 leading-tight whitespace-nowrap lg:text-[11px]">(AI chatbot + Domain + Hosting)</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-700">{feature.name}</span>
                )}
              </div>
              {feature.availability.map((isAvailable, i) => (
                <div key={i} className={`p-5 flex items-center justify-center border-r border-gray-100 last:border-r-0 ${plans[i].highlight ? "bg-gray-100" : ""}`}>
                  {isAvailable ? (
                    <div className="w-5 h-5 rounded-full bg-[#36503F] flex items-center justify-center text-white">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                  ) : (
                    <Minus className="w-4 h-4 text-gray-300" />
                  )}
                </div>
              ))}
            </div>
          ))}

                    {/* Action Row */}
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] bg-white border-t border-gray-200">
            <div className="p-6 border-r border-gray-100 bg-white"></div>
            {plans.map((plan, i) => (
              <div key={i} className={`p-6 flex items-center justify-center border-r border-gray-100 last:border-r-0 ${plans[i].highlight ? "bg-gray-100" : ""}`}>
                <button 
                  onClick={() => window.location.href = `/packages/${plan.name.toLowerCase()}`}
                  className={`w-full py-3 px-4 rounded-sm text-xs font-bold tracking-wider transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  plans[i].highlight
                    ? "bg-[#36503F] text-[#FEF8CF] hover:opacity-90 shadow-md"
                    : "bg-white text-[#36503F] border border-[#36503F] hover:bg-[#36503F] hover:text-[#FEF8CF]"
                }`}>
                  GET STARTED
                </button>
              </div>
            ))}
          </div>
          </div>
            {/* End Comparison Table Container */}
          </div>
          {/* End Min-Width Wrapper */}
        </div>
        {/* End Comparison Table Wrapper */}
        {/* Footer Banner */}
        <div className="mt-6 bg-[#36503F] rounded-xl text-white p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between shadow-xl">
          <div className="flex items-center gap-6 mb-6 md:mb-0">
            <div className="w-14 h-14 rounded-full bg-[#FDFBF7] flex items-center justify-center shrink-0">
              <IndianRupee className="w-6 h-6 text-[#36503F]" />
            </div>
            <div>
              <h3 className="text-[#FEF8CF] font-sans text-xl mb-1">Big results. Bigger savings.</h3>
              <p className="text-gray-300 text-sm">Get premium tools and world-class support<br />at unbeatable prices.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm">Save up to</span>
            <div className="text-4xl font-sans text-[#FEF8CF]">
              ₹75,000+
            </div>
          </div>
        </div>

        {/* Mobile Plan Cards (Hidden on Desktop) */}
        <div className="lg:hidden mt-8 flex flex-col gap-6 pb-8">
          {plans.map((plan, planIdx) => (
            <div key={plan.name} className={`bg-white rounded-2xl p-6 border ${plan.highlight ? 'border-[#FDE047] shadow-[0_0_20px_rgba(253,224,71,0.25)] relative' : 'border-gray-200'}`}>
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#36503F] text-[#FEF8CF] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-sm">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-[#36503F] text-[#FEF8CF] flex items-center justify-center shrink-0">
                  {plan.icon}
                </div>
                <div>
                  <h4 className="font-bold text-xl text-[#36503F] tracking-tight">{plan.name}</h4>
                  <p className="text-xs text-gray-500 whitespace-pre-line leading-relaxed mt-0.5">{plan.subtitle}</p>
                </div>
              </div>

              <div className="mb-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-end gap-2 mb-1.5">
                  <span className="text-3xl font-black text-[#1A1A1A]">{plan.ourPrice}</span>
                  <span className="text-sm text-gray-400 line-through mb-1.5">{plan.marketPrice}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-green-700 bg-green-100/80 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                  <Tag className="w-3.5 h-3.5" />
                  Save {plan.savings} ({plan.savingsPct})
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">What's included</div>
                {features.map((feature, featIdx) => (
                  <div key={feature.name} className={`flex items-start gap-3 ${!feature.availability[planIdx] ? 'opacity-50' : ''}`}>
                    {feature.availability[planIdx] ? (
                      <div className="w-5 h-5 rounded-full bg-[#36503F] text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Minus className="w-3 h-3" strokeWidth={3} />
                      </div>
                    )}
                    <span className={`text-sm leading-tight pt-0.5 ${feature.availability[planIdx] ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-3.5 rounded-xl font-bold transition-all active:scale-[0.98] ${plan.highlight ? 'bg-[#FDE047] text-[#36503F] hover:bg-[#fceb86]' : 'bg-[#36503F] text-[#FEF8CF] hover:bg-[#1F2E26]'}`}>
                Get {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
