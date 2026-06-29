import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { GetInTouchModal } from "@/components/modals/GetInTouchModal";

export const BusinessSetupPlans = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const plans = [
    {
      title: "Basic Plan",
      badge: "Starter",
      description: "Perfect for establishing a professional business presence.",
      timeline: "24-48 Hours",
      features: [
        "Premium Mailing Address",
        "Website Address Usage",
        "Visiting Card Address",
        "Marketing & Communication Purpose"
      ],
      popular: false
    },
    {
      title: "Standard Plan",
      badge: "Most Chosen",
      description: "Ideal for businesses needing official registration and compliance.",
      timeline: "3-5 Days",
      features: [
        "Everything in Basic Plan",
        "GST Registration Documents",
        "Business Registration Support",
        "Dedicated Mail Handling"
      ],
      popular: true
    },
    {
      title: "Custom Plan",
      badge: "Enterprise",
      description: "Comprehensive end-to-end solution for scaling businesses.",
      timeline: "Custom",
      features: [
        "Everything in Standard Plan",
        "Custom Website Development",
        "Priority Support & Strategy",
        "Complete Digital Setup"
      ],
      popular: false
    }
  ];

  const handleGetInTouch = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <section className="py-24 bg-white relative border-b border-[#D4E0D0]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            Explore Our <span className="text-[#36503F]">Virtual Office</span> Plans
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Choose the perfect virtual office package tailored to your business needs, from professional mailing addresses to complete digital setups.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -4, transition: { delay: 0, duration: 0.2 } }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="bg-white hover:bg-[#FEF8C5]/40 border border-[#E5F0E8] hover:border-[#FEF8C5]/60 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative overflow-hidden"
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#36503F] text-[#FEF8C5] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-bl-xl">
                  Popular
                </div>
              )}
              
              <div className="flex-1">
                <div className="inline-flex items-center justify-center px-3 py-1 bg-[#E5F0E8] text-[#36503F] text-xs font-semibold rounded-full mb-4">
                  {plan.badge}
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-[#36503F] transition-colors">
                  {plan.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-6 min-h-[40px]">
                  {plan.description}
                </p>



                <div className="space-y-3 mb-8">
                  {plan.features.slice(0, 4).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#36503F] shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100">
                <button 
                  onClick={handleGetInTouch}
                  className="w-full py-3.5 px-6 bg-transparent text-[#36503F] font-bold text-sm rounded-xl border-2 border-[#36503F] group-hover:bg-[#36503F] group-hover:text-[#FEF8C5] transition-all flex items-center justify-center gap-2"
                >
                  Get in Touch <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <GetInTouchModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};
