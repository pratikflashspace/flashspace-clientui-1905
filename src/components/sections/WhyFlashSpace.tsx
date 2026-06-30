import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, ArrowRight, Users, Bot, BadgeCheck } from 'lucide-react';

export const WhyFlashSpace = () => {

  return (
    <section className="py-24 bg-[#FAFAF7] relative overflow-hidden border-b border-[#D4E0D0]">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#36503F] rounded-full blur-[120px] opacity-[0.03] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#36503F] rounded-full blur-[100px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            Why  <span className="text-[#36503F]">FlashSpace?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Experience the most seamless, compliant, and cost-effective way to establish your business presence anywhere in India.
          </motion.p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Main Large Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 bg-white p-8 sm:p-10 rounded-3xl border border-[#E5F0E8] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-[#36503F]/30 hover:shadow-md transition-all"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity group-hover:scale-110 duration-500 transform origin-top-right">
              <ShieldCheck size={120} className="text-[#36503F]" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-[#E5F0E8] rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7 text-[#36503F]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  Zero Rejection Approach <br />& Money-Back Promise
                </h3>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-md">
                  We ensure strict document verification. If your GST registration is rejected due to our documentation error, you get a full refund within 30 days.
                </p>
              </div>
              <div className="mt-8">
                <span className="inline-flex items-center text-[#36503F] text-sm font-bold hover:gap-2 transition-all cursor-pointer">
                  Learn about our guarantee <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </div>
            </div>
          </motion.div>

          {/* Top Right Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-3xl border border-[#E5F0E8] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-[#36503F]/30 hover:shadow-md transition-all"
          >
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity group-hover:rotate-12 duration-500">
              <Zap size={100} className="text-[#36503F]" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-[#FFF4D4] rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-[#EDB003]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast Setup</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Skip the weeks of waiting. Get your premium business address and documentation ready within 24 to 48 hours.
              </p>
            </div>
          </motion.div>

          {/* Bottom Left Card (Small) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-[#36503F] p-8 rounded-3xl border border-[#36503F] shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden group hover:shadow-lg transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-[#FEF8C5]" />
              </div>
              <h3 className="text-xl font-bold text-[#FEF8C5] mb-3">Flash Community Access</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Network with top-tier startup founders, exchange breakthrough ideas, and unlock exclusive growth opportunities in India's fastest-growing entrepreneurial ecosystem.
              </p>
            </div>
          </motion.div>

          {/* Flash AI & MCP Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="bg-white p-8 rounded-3xl border border-[#E5F0E8] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-[#36503F]/30 hover:shadow-md transition-all"
          >
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity group-hover:scale-110 duration-500">
              <Bot size={100} className="text-[#36503F]" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-[#E5F0E8] rounded-xl flex items-center justify-center mb-6">
                <Bot className="w-6 h-6 text-[#36503F]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Flash AI & MCP</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Meet Flash AI, our proprietary assistant that instantly resolves all your business queries. Coupled with MCP, you can seamlessly command any major AI platform to handle bookings and workspace management effortlessly.
              </p>
            </div>
          </motion.div>

          {/* Verified by Flipkart Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="bg-white p-8 rounded-3xl border border-[#E5F0E8] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-[#36503F]/30 hover:shadow-md transition-all"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity group-hover:rotate-12 duration-500">
              <BadgeCheck size={120} className="text-[#EDB003]" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#FFF4D4] rounded-xl flex items-center justify-center mb-6">
                  <BadgeCheck className="w-6 h-6 text-[#EDB003]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Verified by Flipkart</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We are proud to be officially verified and trusted by Flipkart. This milestone reflects our unwavering commitment to providing top-tier, trustworthy, and enterprise-grade workspace solutions.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
