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
  return (
    <div className="min-h-screen bg-gray-50 font-[Poppins]">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-28 pb-24 lg:pt-40 lg:pb-32 min-h-[85vh] flex items-center">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1] text-gray-900">
                Shape Your Career at FlashSpace
              </h1>
              <p className="text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto mb-8">
                We're a small, ambitious team reimagining how India works. If
                you love solving hard problems and shipping fast, you'll fit
                right in.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-black text-white hover:bg-gray-800 font-medium px-8 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-base">
                  View Open Roles <ArrowRight className="w-4 h-4 ml-2" />
                </button>
                <button className="font-semibold px-8 h-12 rounded-xl border border-gray-200 text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-center text-base">
                  Our Culture
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Culture */}
        <section className="py-10 lg:py-14">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                Why work with us?
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl">
                We believe great work happens when people have autonomy,
                purpose, and the right tools.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {perks.map((perk, i) => {
                const Icon = perk.icon;
                return (
                  <motion.div
                    key={perk.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-yellow-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {perk.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {perk.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Open Roles */}
        <section className="py-10 lg:py-14 bg-gray-50/50">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                Open positions
              </h2>
              <p className="text-gray-500 text-lg">
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
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow group cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-yellow-500 transition-colors">
                      {role.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {role.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {role.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      {role.department}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all shrink-0" />
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
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                Don't see your role?
              </h2>
              <p className="text-gray-500 mb-6 max-w-lg mx-auto">
                We're always looking for talented people. Send us your resume
                and we'll keep you in mind.
              </p>
              <button className="bg-black text-white hover:bg-gray-800 h-12 px-8 rounded-xl font-medium inline-flex items-center justify-center transition-colors">
                Send Your Resume <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
