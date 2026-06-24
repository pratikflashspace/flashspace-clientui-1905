import { useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  ArrowRight,
  Zap,
  Heart,
  GraduationCap,
  Globe,
  Coffee,
  Laptop,
} from "lucide-react";

const perks = [
  {
    icon: Zap,
    title: "Fast-Paced Growth",
    desc: "Ship features that impact thousands of workspaces daily.",
  },
  {
    icon: Heart,
    title: "Health & Wellness",
    desc: "Comprehensive health insurance and wellness allowance.",
  },
  {
    icon: GraduationCap,
    title: "Learning Budget",
    desc: "Annual learning budget for courses, books, and conferences.",
  },
  {
    icon: Globe,
    title: "Remote-Friendly",
    desc: "Work from any FlashSpace location across India.",
  },
  {
    icon: Coffee,
    title: "Free Workspace Access",
    desc: "Unlimited access to any FlashSpace partner workspace.",
  },
  {
    icon: Laptop,
    title: "Top-Tier Equipment",
    desc: "MacBook, monitor, and accessories — whatever you need.",
  },
];

const openRoles = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Delhi / Remote",
    type: "Full-time",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Delhi / Remote",
    type: "Full-time",
  },
  {
    title: "Business Development Manager",
    department: "Sales",
    location: "Mumbai",
    type: "Full-time",
  },
  {
    title: "Partnership Lead — South India",
    department: "Partnerships",
    location: "Bangalore / Hyderabad",
    type: "Full-time",
  },
  {
    title: "Customer Success Associate",
    department: "Operations",
    location: "Delhi",
    type: "Full-time",
  },
  {
    title: "Marketing Intern",
    department: "Marketing",
    location: "Remote",
    type: "Internship",
  },
];

const Careers = () => {
  useEffect(() => {
    document.title = "Careers - FlashSpace";
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-['Inter_Tight',system-ui,sans-serif]">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-28 pb-16 lg:pt-40 lg:pb-32 min-h-[50vh] lg:min-h-[85vh] flex items-center">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1] text-[#1F2E26]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Shape Your Career at FlashSpace
              </h1>
              <p className="text-lg lg:text-xl text-[#6B8F78] max-w-2xl mx-auto mb-8">
                We're a small, ambitious team reimagining how India works. If
                you love solving hard problems and shipping fast, you'll fit
                right in.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => document.getElementById('open-roles')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-[#36503F] text-[#FEF8C5] hover:bg-[#1F2E26] font-medium px-8 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-base"
                >
                  View Open Roles <ArrowRight className="w-4 h-4 ml-2" />
                </button>
                <button 
                  onClick={() => document.getElementById('culture')?.scrollIntoView({ behavior: 'smooth' })}
                  className="font-semibold px-8 h-12 rounded-xl border border-[#36503F] text-[#36503F] hover:bg-[#36503F]/5 transition-colors flex items-center justify-center text-base"
                >
                  Our Culture
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Culture */}
        <section id="culture" className="py-10 lg:py-14">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2E26] tracking-tight mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                Why work with us?
              </h2>
              <p className="text-[#6B8F78] text-lg max-w-2xl">
                We believe great work happens when people have autonomy,
                purpose, and the right tools.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {perks.map((perk, i) => {
                const Icon = perk.icon;
                const isDark = i % 2 === 0;
                const id = `0${i + 1}`;
                return (
                  <motion.div
                    key={perk.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={`group cursor-pointer relative rounded-sm overflow-hidden p-8 flex flex-col transition-all duration-300 hover:scale-105 ${isDark
                      ? "bg-[#36503F] hover:bg-[#FDFCF9] text-white hover:text-[#36503F] border border-transparent hover:border-gray-100 shadow-sm"
                      : "bg-[#FDFCF9] hover:bg-[#36503F] text-[#36503F] hover:text-white border border-gray-100 hover:border-transparent shadow-sm"
                      }`}
                  >
                    {/* Top Row: Number & Icon */}
                    <div className="flex justify-between items-start mb-6">
                      <span className={`text-2xl font-bold transition-colors duration-300 ${isDark ? 'text-[#FEF8C5] group-hover:text-[#36503F]' : 'text-[#36503F] group-hover:text-[#FEF8C5]'}`}>
                        {id}
                      </span>

                      {/* Icon centered conceptually, but positioned relative to the card */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-8">
                        <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors duration-300 ${isDark
                          ? 'border-[#FEF8C5] text-[#FEF8C5] group-hover:border-[#36503F] group-hover:text-[#36503F]'
                          : 'border-[#36503F] text-[#36503F] group-hover:border-[#FEF8C5] group-hover:text-[#FEF8C5]'
                          }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mt-8 flex flex-col flex-1">
                      <h3 className={`text-center font-bold text-[1.1rem] mb-4 transition-colors duration-300 ${isDark ? 'text-white group-hover:text-[#36503F]' : 'text-[#36503F] group-hover:text-white'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                        {perk.title}
                      </h3>

                      <div className={`w-full h-[1px] mb-5 transition-colors duration-300 ${isDark ? 'bg-[#FEF8C5]/30 group-hover:bg-[#36503F]/30' : 'bg-[#36503F]/30 group-hover:bg-[#FEF8C5]/30'}`}></div>

                      <p className={`text-[0.8rem] leading-relaxed text-center flex-1 transition-colors duration-300 ${isDark ? 'text-gray-300 group-hover:text-gray-600' : 'text-gray-600 group-hover:text-gray-300'}`}>
                        {perk.desc}
                      </p>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Open Roles */}
        <section id="open-roles" className="py-10 lg:py-14 bg-[#FAFAF7]">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1F2E26] tracking-tight mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                Open positions
              </h2>
              <p className="text-[#6B8F78] text-lg">
                {openRoles.length} roles across{" "}
                {new Set(openRoles.map((r) => r.department)).size} teams
              </p>
            </motion.div>

            <div className="space-y-3">
              {openRoles.map((role, i) => (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-[#FEF8C5]/50 rounded-xl hover:shadow-[0_4px_20px_rgba(54,80,63,0.06)] hover:border-[#36503F]/20 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-[#1F2E26] mb-1 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {role.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-[#6B8F78]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {role.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {role.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-md bg-[#FEF8C5] px-2 py-1 text-xs font-medium text-[#36503F] ring-1 ring-inset ring-[#36503F]/10">
                      {role.department}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#6B8F78] group-hover:translate-x-1 group-hover:text-[#36503F] transition-all shrink-0" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 lg:py-14">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1F2E26] mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                Don't see your role?
              </h2>
              <p className="text-[#6B8F78] mb-6 max-w-lg mx-auto">
                We're always looking for talented people. Send us your resume
                and we'll keep you in mind.
              </p>
              <a href="mailto:team@flashspace.ai" className="bg-[#36503F] text-[#FEF8C5] hover:bg-[#1F2E26] h-12 px-8 rounded-xl font-medium inline-flex items-center justify-center transition-colors">
                Send Your Resume <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
