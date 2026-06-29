import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Building, Calculator, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GetInTouchModal } from "@/components/modals/GetInTouchModal";

export const AddOnsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addons = [
    {
      title: "GST Application",
      price: "₹2,999",
      icon: <FileText className="w-8 h-8 text-[#36503F]" />,
      description: "Hassle-free GST registration for your business with end-to-end support.",
      link: "/services/business-setup#gst-registration"
    },
    {
      title: "Pvt Ltd / LLP Registration",
      price: "₹11,999",
      icon: <Building className="w-8 h-8 text-[#36503F]" />,
      description: "Complete company incorporation services including DIN, DSC, and MOA/AOA.",
      link: "/services/business-setup#company-registration-llp-opc-pvt-ltd"
    },
    {
      title: "Annual Filings",
      price: "Custom Price",
      icon: <Calculator className="w-8 h-8 text-[#36503F]" />,
      description: "Dedicated assistance for your annual ROC compliances and tax filings.",
      isCustom: true
    }
  ];

  return (
    <section className="py-24 bg-[#FAFAF7] border-b border-[#D4E0D0]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            Essential <span className="text-[#36503F]">Business Services</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Enhance your virtual office with our specialized compliance and registration services.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {addons.map((addon, index) => {
            const CardWrapper = addon.link ? Link : 'div';
            return (
              <CardWrapper
              to={addon.link || "#"}
              onClick={addon.isCustom ? () => setIsModalOpen(true) : undefined}
              key={index}
              className={`bg-white hover:bg-[#FEF8C5]/40 border border-[#E5F0E8] hover:border-[#FEF8C5]/60 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative overflow-hidden ${addon.isCustom ? 'cursor-pointer' : ''}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.2 } }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="flex flex-col h-full w-full"
              >
                <div className="w-16 h-16 bg-[#E5F0E8] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {addon.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#36503F] transition-colors">
                  {addon.title}
                </h3>
                
                <p className="text-gray-600 mb-8 flex-1">
                  {addon.description}
                </p>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pricing</p>
                    <p className="text-2xl font-extrabold text-[#36503F]">{addon.price}</p>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-[#FAFAF7] border border-gray-200 flex items-center justify-center group-hover:bg-[#36503F] group-hover:border-[#36503F] transition-colors pointer-events-none">
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#FEF8C5]" />
                  </button>
                </div>
              </motion.div>
            </CardWrapper>
          )})}
        </div>
      </div>
      <GetInTouchModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};
