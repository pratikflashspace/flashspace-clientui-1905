import React from "react";
import { motion } from "framer-motion";
import { Star, Leaf, Gem, Crown } from "lucide-react";

export const PricingSection = () => {
  const plans = [
    {
      name: "BASIC",
      description: "Everything you need\nto get started.",
      price: "₹8999",
      buttonText: "GET STARTED",
      highlight: false,
      icon: <Leaf className="w-6 h-6" />
    },
    {
      name: "PRO",
      description: "More power. More\nfeatures. More growth.",
      price: "₹11999",
      buttonText: "CHOOSE PLAN",
      highlight: false,
      icon: <Star className="w-6 h-6" />
    },
    {
      name: "PREMIUM",
      description: "Advanced tools for\nserious results.",
      price: "₹14999",
      buttonText: "CHOOSE PLAN",
      highlight: true,
      icon: <Gem className="w-8 h-8" />
    },
    {
      name: "ELITE",
      description: "Unmatched performance\nfor top achievers.",
      price: "₹24999",
      buttonText: "GET STARTED",
      highlight: false,
      icon: <Crown className="w-6 h-6" />
    },
  ];

  return (
    <section className="bg-[#FAF9F6] py-32 text-[#25362B] relative overflow-hidden font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="container mx-auto px-4 lg:px-8">

        {/* Header content */}
        <div className="text-center mb-20">
          <h3 className="text-[#C6A87C] text-xs font-bold tracking-[0.2em] uppercase mb-4">
            CHOOSE YOUR PLAN
          </h3>
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Four Plans. <span className="text-[#C6A87C]">Unlimited Potential.</span>
          </h2>
          <p className="text-gray-600 text-sm max-w-lg mx-auto">
            Pick the perfect plan and let's build<br />something extraordinary together.
          </p>
        </div>

        {/* Pricing Block */}
        <div className="max-w-6xl mx-auto relative mt-16 pt-8 pb-12">

          <div className="flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-4 relative z-10">
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
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-12 bg-[#1F2E26] clip-path-badge flex items-center justify-center pt-1 z-30 shadow-xl border-t-2 border-[#C6A87C]">
                      <Star className="w-5 h-5 text-[#C6A87C] -mt-2" fill="none" strokeWidth={1.5} />
                    </div>

                    <div className="bg-[#FCFBF8] border border-[#C6A87C] ring-1 ring-[#C6A87C]/50 rounded-xl pt-16 pb-16 px-8 text-center shadow-[0_0_25px_rgba(198,168,124,0.35)] flex flex-col h-full relative overflow-hidden scale-[1.03] z-20">

                      {/* MOST POPULAR Pill */}
                      <div className="mb-6 mx-auto">
                        <span className="bg-[#FDEBB5] text-[#1F2E26] text-[10px] font-bold px-4 py-1.5 rounded-full tracking-wider uppercase">
                          Most Popular
                        </span>
                      </div>

                      {/* Icon inside circle */}
                      <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center mx-auto mb-6 text-[#1F2E26]">
                        {plan.icon}
                      </div>

                      <h3 className="text-base tracking-widest font-bold text-[#1F2E26] mb-4">{plan.name}</h3>
                      <div className="w-8 h-[2px] bg-[#C6A87C] mx-auto mb-6"></div>

                      <p className="text-gray-600 text-xs leading-relaxed mb-8 whitespace-pre-line flex-grow">
                        {plan.description}
                      </p>

                      <div className="mb-8">
                        <span className="text-5xl font-serif text-[#1F2E26]">{plan.price}</span>
                        <span className="text-gray-500 text-xs ml-1"></span>
                      </div>

                      <button className="w-full py-3.5 px-6 rounded-md text-xs font-bold tracking-wider transition-all duration-300 bg-[#1F2E26] text-white hover:bg-[#15201A] shadow-md">
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
                  className="relative z-10 w-full lg:w-[24%] bg-[#FCFBF8] py-12 px-6 text-center border border-[#E8E2D9] rounded-xl shadow-sm"
                >
                  {/* Icon inside circle */}
                  <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center mx-auto mb-6 text-[#1F2E26]">
                    {plan.icon}
                  </div>

                  <h3 className="text-base tracking-widest font-bold text-[#1F2E26] mb-4">{plan.name}</h3>
                  <div className="w-6 h-[2px] bg-[#C6A87C]/50 mx-auto mb-6"></div>

                  <p className="text-gray-500 text-xs leading-relaxed mb-8 whitespace-pre-line h-10 flex-grow">
                    {plan.description}
                  </p>

                  <div className="mb-8">
                    <span className="text-4xl font-serif text-[#1F2E26]">{plan.price}</span>
                    <span className="text-gray-500 text-xs ml-1"></span>
                  </div>

                  <button className="w-full py-3.5 px-6 rounded-md text-xs font-semibold tracking-wider transition-all duration-300 bg-transparent text-[#1F2E26] border border-gray-300 hover:border-[#1F2E26] hover:bg-gray-50">
                    {plan.buttonText}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Golden Line */}
          <div className="hidden lg:block absolute bottom-0 left-[2%] right-[2%] h-[1px] bg-gradient-to-r from-transparent via-[#C6A87C]/50 to-transparent">
            {/* Dots */}
            <div className="absolute top-1/2 -translate-y-1/2 left-[10%] w-1 h-1 rounded-full bg-[#C6A87C]"></div>
            <div className="absolute top-1/2 -translate-y-1/2 right-[10%] w-1 h-1 rounded-full bg-[#C6A87C]"></div>

            {/* Center glow and text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/4 h-[1px] bg-[#C6A87C] shadow-[0_0_10px_#C6A87C]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#C6A87C] shadow-[0_0_10px_#C6A87C]"></div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-[0.2em] text-[#C6A87C] uppercase bg-[#FAF9F6] px-2">
              Best Value
            </div>
          </div>

        </div>
      </div>

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
