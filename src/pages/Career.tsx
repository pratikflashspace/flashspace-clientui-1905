import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, UserCheck, Award, Briefcase, Quote, Search, MapPin, Clock, Building2, X, ChevronRight, Check, GraduationCap, User } from "lucide-react";

// ===============================================
// Icon Components
// ===============================================

type IconProps = {
  className?: string;
  [key: string]: any;
};

const BSIcon: React.FC<{ iconName: string } & IconProps> = ({ iconName, ...props }) => (
  <i className={`bi ${iconName} ${props.className || ''}`} {...props} />
);

const BriefcaseIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-briefcase-fill" {...props} />;
const GlobeAltIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-globe-americas" {...props} />;
const UsersIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-people-fill" {...props} />;
const CheckBadgeIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-patch-check-fill" {...props} />;
const ArrowTrendingUpIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-arrow-up-right-circle-fill" {...props} />;
const BanknotesIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-cash-stack" {...props} />;
const LifebuoyIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-life-preserver" {...props} />;
const ChartBarIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-bar-chart-line-fill" {...props} />;
const UserGroupIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-collection-fill" {...props} />;
const BoltIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-lightning-charge-fill" {...props} />;
const DocumentTextIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-file-earmark-text-fill" {...props} />;
const CheckCircleIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-check-circle-fill" {...props} />;
const RocketLaunchIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-rocket-takeoff-fill" {...props} />;
const BuildingOfficeIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-building" {...props} />;
const MapPinIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-geo-alt-fill" {...props} />;
const ClockIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-clock-fill" {...props} />;
const UserIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-person-fill" {...props} />;
const EnvelopeIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-envelope-fill" {...props} />;
const PhoneIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-telephone-fill" {...props} />;
const ChatBubbleLeftEllipsisIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-chat-left-dots-fill" {...props} />;
const SearchIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-search" {...props} />;

// ===============================================
// Styles (component-level)
// ===============================================

const styleBlock = `
/* Floating orbs */
@keyframes floatUp {
  0% { transform: translateY(0) translateX(0) scale(1); opacity: .9; }
  50% { transform: translateY(-18px) translateX(6px) scale(1.03); opacity: .7; }
  100% { transform: translateY(0) translateX(0) scale(1); opacity: .9; }
}

.animate-floatUp {
  animation: floatUp 6s ease-in-out infinite;
}

/* subtle slow rotation for background overlay */
@keyframes slowRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* quick fade in used for modals or entrance */
@keyframes fade-in-fast {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* tiny glass sheen on cards */
.card-sheen {
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  mix-blend-mode: overlay;
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
}

/* Hero text glow spread */
.hero-glow {
  text-shadow: 0 6px 30px rgba(255, 197, 80, 0.12), 0 2px 6px rgba(0,0,0,0.35);
}

/* button glow on hover via utility class fallback */
.btn-glow:hover {
  box-shadow: 0 8px 40px rgba(250, 204, 21, 0.22), 0 2px 6px rgba(0,0,0,0.2);
  transform: translateY(-3px) scale(1.01);
}

/* small helper to better preserve 3d for children */
.preserve-3d {
  transform-style: preserve-3d;
}

/* --- CUSTOM SCROLLBAR FOR MODALS --- */
.custom-scrollbar::-webkit-scrollbar {
  width: 10px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 6px;
  border: 2px solid #f1f5f9;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
`;

// ===============================================
// Hero Component
// ===============================================
// ===============================================
// Hero Component
// ===============================================
const Hero: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen pt-20 flex items-center bg-gradient-to-br from-[#FFFBEB] via-white to-[#F0F9FF] dark:from-[#0a0a0a] dark:via-[#111] dark:to-[#1a1a1a] overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-yellow-300/10 rounded-full blur-3xl filter -translate-y-1/2 translate-x-1/2 opacity-70 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-3xl filter translate-y-1/2 -translate-x-1/2 opacity-70 pointer-events-none" />

      {/* Grid Pattern Overlay (Optional for tech feel) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      {/* Inject Styles */}
      <style>{styleBlock}</style>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left pt-10 lg:pt-0">
            <div className="inline-flex items-center bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 rounded-full px-4 py-1.5 text-sm font-semibold border border-yellow-400/20 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
              Join Our Growing Network
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-slate-900 dark:text-white mb-6">
              Build the Future with <br />
              <span className="text-yellow-400 relative inline-block">
                FlashSpace
                {/* Underline svg */}
                <svg className="absolute w-full h-3 -bottom-2 left-0 text-yellow-300 opacity-60" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C25.7501 2.49994 132.5 -3.50004 198 4.99997" stroke="currentColor" strokeWidth="3" /></svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Join India's fastest-growing workspace network and unlock limitless revenue opportunities. Work where innovation meets community.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4">
              <a href="#" className="bg-yellow-400 text-black font-bold px-8 py-3.5 rounded-full text-lg hover:bg-yellow-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2">
                View Openings <ArrowTrendingUpIcon className="w-5 h-5" />
              </a>
              <a href="#" className="px-8 py-3.5 rounded-full text-lg font-semibold text-slate-700 dark:text-white border border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/10 transition-all w-full sm:w-auto">
                Life at FlashSpace
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50 dark:border-white/10 rotate-1 hover:rotate-0 transition-all duration-500">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                alt="FlashSpace Team"
                className="w-full h-auto object-cover transform scale-105 hover:scale-110 transition-transform duration-700 block"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            </div>

            {/* Floating Stats Card - Bottom Left */}
            <div className="absolute -bottom-8 -left-8 md:-left-12 bg-white dark:bg-[#1a1a1a] p-4 pr-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-white/5 flex items-center gap-4 animate-floatUp hidden md:flex">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full text-yellow-600 dark:text-yellow-400">
                <UsersIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Family</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">500+ <span className="text-sm font-normal text-slate-500">Members</span></p>
              </div>
            </div>

            {/* Floating Badge - Top Right */}
            <div className="absolute -top-6 -right-6 bg-white dark:bg-[#1a1a1a] p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-white/5 hidden md:block animate-floatUp" style={{ animationDelay: '1s' }}>
              <span className="text-4xl">🚀</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

// ===============================================
// Stats Component
// ===============================================
interface StatCardProps {
  emoji: string;
  value: string;
  label: string;
}

const StatCard3D: React.FC<StatCardProps> = ({ emoji, value, label }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<{ transform?: string; boxShadow?: string }>({});

  useEffect(() => {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.06)",
    });
  }, []);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 14;
    const rotateX = (0.5 - y) * 10;
    const depth = 12;
    const transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${depth}px)`;
    const shadowOpacity = 0.08 + Math.abs((rotateX + rotateY) / 40);
    const boxShadow = `0 ${Math.max(14, Math.abs(depth))}px ${24 + Math.abs(rotateX + rotateY)}px rgba(0,0,0,${0.18 + shadowOpacity})`;

    setStyle({ transform, boxShadow });
  };

  const handleLeave = () => {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.04)",
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative rounded-2xl p-8 md:p-10 transition-transform duration-200 ease-out preserve-3d flex flex-col items-center justify-center text-center bg-gradient-to-br from-[#FFFBE6]/65 to-[#FFF5E6]/45 dark:from-[#1a1a1a]/80 dark:to-[#0a0a0a]/80"
      style={{
        transform: style.transform,
        boxShadow: style.boxShadow,
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        height: "220px",
      }}
    >
      <div className="card-sheen absolute inset-0 rounded-2xl pointer-events-none" />
      <div className="flex flex-col items-center justify-center">
        <div className="text-5xl mb-3">{emoji}</div>
        <p className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="mt-2 text-slate-800 dark:text-slate-300 font-medium">{label}</p>
      </div>
      <div aria-hidden className="absolute inset-0 rounded-2xl pointer-events-none" style={{ boxShadow: "inset 0 1px 30px rgba(255, 214, 80, 0.04)" }} />
    </div>
  );
};

const Stats: React.FC = () => {
  const stats = [
    { emoji: "👨‍💼", value: "45", label: "Employees" },
    { emoji: "🌆", value: "50+", label: "Cities Covered" },
    { emoji: "😊", value: "10,000+", label: "Happy Clients" },
    { emoji: "🏆", value: "98%", label: "Employee Satisfaction" },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-slate-50 dark:from-[#0a0a0a] dark:to-[#111] transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <StatCard3D key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ===============================================
// WhyPartner Component
// ===============================================
const WhyPartner: React.FC = () => {
  const features = [
    { icon: ArrowTrendingUpIcon, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", title: 'Career Growth', description: 'We invest in your professional development with continuous learning opportunities and clear paths for advancement.' },
    { icon: BanknotesIcon, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-500/10", title: 'Competitive Compensation', description: 'We offer a competitive salary package, comprehensive benefits, and performance-based bonuses.' },
    { icon: LifebuoyIcon, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10", title: 'Supportive Culture', description: 'Join a collaborative and inclusive team where your ideas are valued and your well-being is a priority.' },
    { icon: ChartBarIcon, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10", title: 'Impactful Work', description: 'Contribute to innovative projects that are shaping the future of workspaces and see your impact in real-time.' },
    { icon: UserGroupIcon, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-500/10", title: 'Collaborative Team', description: 'Work alongside talented and passionate individuals in a dynamic, team-oriented environment.' },
    { icon: BoltIcon, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-500/10", title: 'Innovative Environment', description: 'Thrive in a fast-paced setting where you can challenge the status quo and drive meaningful change.' },
  ];

  return (
    <section className="relative overflow-hidden py-24 bg-slate-50 dark:bg-[#050505] transition-colors duration-300">
      {/* Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-yellow-400/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white"
          >
            Why Careers with <span className="text-yellow-400">FlashSpace?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-xl text-slate-600 dark:text-slate-400"
          >
            Join a team that's redefining the future of work. We're looking for passionate individuals to grow with us.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white dark:bg-[#111] rounded-[2rem] p-8 shadow-lg hover:shadow-2xl hover:shadow-yellow-400/10 transition-all duration-300 hover:-translate-y-2 border border-slate-100 dark:border-white/5 overflow-hidden"
            >
              {/* Top Border Gradient */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className={`mb-6 ${feature.color} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                <feature.icon className="w-12 h-12 drop-shadow-md" />
              </div>

              <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-yellow-500 transition-colors">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ===============================================
// HowItWorks Component
// ===============================================
const howItWorksSteps = [
  { icon: FileText, title: "Submit Application", description: "Fill out our simple application form with your details and resume.", step: "01" },
  { icon: UserCheck, title: "Verification & Interview", description: "Our HR team reviews your profile and schedules a discussion.", step: "02" },
  { icon: Award, title: "Receive Offer", description: "Get a competitive offer letter detailing your role and benefits.", step: "03" },
  { icon: Briefcase, title: "Join FlashSpace", description: "Welcome to the team! Start your journey and make an impact.", step: "04" },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-[#080808] relative overflow-hidden">
      {/* Background Line */}
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent hidden lg:block" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white"
          >
            How to work in <span className="text-yellow-400">FlashSpace</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Joining FlashSpace is simple. Follow these four easy steps to start your career with us.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {howItWorksSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative group"
            >
              <div className="bg-white dark:bg-[#151515] p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 hover:border-yellow-400 transition-all duration-300 h-full flex flex-col items-center text-center relative overflow-hidden group-hover:-translate-y-2">

                {/* Large Watermark Number */}
                <span className="absolute -right-4 -top-6 text-[8rem] font-bold text-slate-100 dark:text-white/10 pointer-events-none transition-colors group-hover:text-yellow-400/10">
                  {step.step}
                </span>

                {/* Icon Container */}
                <div className="w-20 h-20 rounded-2xl bg-yellow-400/10 text-yellow-500 mb-6 flex items-center justify-center group-hover:scale-110 group-hover:bg-yellow-400 group-hover:text-black transition-all duration-300 shadow-sm relative z-10">
                  <step.icon className="w-10 h-10" strokeWidth={1.5} />
                </div>

                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white relative z-10">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm relative z-10 font-medium">
                  {step.description}
                </p>

                {/* Process Indicator (Mobile only) */}
                <div className="lg:hidden absolute bottom-4 w-12 h-1 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-yellow-400 w-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ===============================================
// SuccessStories Component
// ===============================================
// ===============================================
// SuccessStories Component
// ===============================================
interface Testimonial {
  quote: string;
  name: string;
  role: string;
  location: string;
  initials: string;
}

const SuccessStories: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      quote: "Joining FlashSpace as a junior developer was a career-defining move. The mentorship is incredible and the growth opportunities are limitless.",
      name: "Rajesh Kumar",
      role: "Senior Software Engineer",
      location: "Mumbai HQ",
      initials: "RK"
    },
    {
      quote: "The work culture at FlashSpace is truly supportive. My ideas are always heard, and I've been given the freedom to lead impactful projects.",
      name: "Priya Sharma",
      role: "Head of Marketing",
      location: "Bangalore Hub",
      initials: "PS"
    },
    {
      quote: "I've witnessed the company grow from a startup to a nationwide network. Being part of this journey has been the most rewarding experience of my life.",
      name: "Amit Patel",
      role: "VP of Operations",
      location: "Delhi NCR",
      initials: "AP"
    },
  ];

  return (
    <section className="relative overflow-hidden py-24 bg-white dark:bg-[#0a0a0a]">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-400/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white"
          >
            Success <span className="text-yellow-400">Stories</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-xl text-slate-600 dark:text-slate-400"
          >
            Hear from our team members about their growth, experiences, and journey at FlashSpace.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group relative bg-slate-50 dark:bg-[#111] rounded-[2rem] p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-400/10 border border-slate-100 dark:border-white/5"
            >
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 text-yellow-400/20 group-hover:text-yellow-400/40 transition-colors">
                <Quote size={48} strokeWidth={1} fill="currentColor" />
              </div>

              {/* Initials Avatar */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">{testimonial.initials}</span>
                </div>
              </div>

              {/* Content */}
              <p className="relative z-10 text-slate-600 dark:text-slate-300 mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>

              <div>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-yellow-500 transition-colors">
                  {testimonial.name}
                </h4>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-500">
                  {testimonial.role}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
                  📍 {testimonial.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// =========================
// JOB INTERFACE & LIST
// =========================
interface Job {
  id: number;
  title: string;
  department: string;
  type: 'Internship' | 'Full-Time';
  location: 'Remote' | 'Patna';
  description: string;
  emoji: string;
}

const jobs: Job[] = [
  { id: 284628, title: "Frontend Developer", department: "Tech", type: "Internship", location: "Remote", description: "Craft beautiful and responsive user interfaces with modern web technologies.", emoji: "💻" },
  { id: 382917, title: "Backend Developer", department: "Tech", type: "Full-Time", location: "Patna", description: "Build scalable and robust server-side applications and APIs.", emoji: "⚙️" },
  { id: 992734, title: "UI/UX Designer", department: "Design", type: "Internship", location: "Remote", description: "Create intuitive, user-centered designs for our web and mobile platforms.", emoji: "🎨" },
  { id: 772819, title: "Marketing Executive", department: "Marketing", type: "Full-Time", location: "Patna", description: "Develop and execute marketing campaigns to drive growth and engagement.", emoji: "📈" },
  { id: 663728, title: "Business Development Associate", department: "Sales", type: "Internship", location: "Remote", description: "Identify and pursue new business opportunities and partnerships.", emoji: "🤝" },
  { id: 117238, title: "Data Analyst", department: "Analytics", type: "Full-Time", location: "Remote", description: "Turn complex datasets into actionable insights that drive business decisions.", emoji: "📊" },
  { id: 553621, title: "HR Executive", department: "HR", type: "Full-Time", location: "Patna", description: "Manage the recruitment process and help foster a positive company culture.", emoji: "🧑‍💼" },
  { id: 927163, title: "SEO Specialist", department: "Marketing", type: "Internship", location: "Remote", description: "Optimize our online presence to increase organic traffic and visibility.", emoji: "🔍" },
  { id: 883219, title: "DevOps Engineer", department: "Engineering", type: "Full-Time", location: "Remote", description: "Automate and streamline our operations and processes.", emoji: "🚀" },
  { id: 551278, title: "Content Writer", department: "Marketing", type: "Internship", location: "Remote", description: "Create compelling content for blog, social media, and campaigns.", emoji: "✍️" },
  { id: 334528, title: "Product Manager", department: "Product", type: "Full-Time", location: "Patna", description: "Define product vision and roadmap for our innovative solutions.", emoji: "🧠" },
  { id: 642199, title: "Customer Success Executive", department: "Operations", type: "Full-Time", location: "Remote", description: "Ensure customers are successful and satisfied with our products.", emoji: "😊" },
];

// =========================
// OPEN POSITIONS COMPONENT
// =========================
// =========================
// OPEN POSITIONS COMPONENT
// =========================
const OpenPositions: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApply, setShowApply] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', portfolio: '', linkedin: '',
    currentRole: '', currentCompany: '', experienceYears: '', noticePeriod: '',
    primarySkills: '', secondarySkills: '', coverLetter: '', resume: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const closeAll = () => {
    setSelectedJob(null);
    setShowApply(false);
    setStep(1);
    setFormData({
      fullName: '', email: '', phone: '', portfolio: '', linkedin: '',
      currentRole: '', currentCompany: '', experienceYears: '', noticePeriod: '',
      primarySkills: '', secondarySkills: '', coverLetter: '', resume: null
    });
  };

  const handleNextStep = () => setStep(prev => prev + 1);
  const handlePrevStep = () => setStep(prev => prev - 1);

  const handleSubmitApp = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Application Submitted Successfully! Good luck.");
      closeAll();
    }, 2000);
  };

  useEffect(() => {
    if (selectedJob || showApply) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedJob, showApply]);

  const filteredJobs = jobs.filter((job) =>
    `${job.title} ${job.department} ${job.location}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="relative overflow-hidden py-20 bg-slate-50 dark:bg-[#050505]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">Open <span className="text-yellow-400">Positions</span></h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-gray-300">Find your dream role and help us build the future of workspaces.</p>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-4xl mx-auto mb-16 relative">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="text-slate-400 w-6 h-6" />
          </div>
          <input
            type="text"
            placeholder="Search by role, department, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-6 py-5 rounded-full border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#111] focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 shadow-xl text-slate-700 dark:text-white text-lg transition-all"
          />
        </div>

        {/* JOBS GRID */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {filteredJobs.map((job) => (
            <motion.div
              layout
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className="group relative bg-white dark:bg-[#111] rounded-[2rem] p-8 border border-slate-100 dark:border-white/5 hover:border-yellow-400 dark:hover:border-yellow-400 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      {job.department}
                    </span>
                    {job.type === 'Internship' && (
                      <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-300">Internship</span>
                    )}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-yellow-500 transition-colors mb-2">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
                    <span className="flex items-center gap-1.5"><Clock size={16} /> {job.type}</span>
                    <span className="flex items-center gap-1.5"><Building2 size={16} /> On-site</span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center group-hover:bg-yellow-400 group-hover:text-black transition-colors flex-shrink-0">
                  <ChevronRight size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredJobs.length === 0 && <p className="text-center text-slate-500 text-xl py-20">No matching jobs found.</p>}
      </div>

      {/* JOB DETAILS MODAL */}
      <AnimatePresence>
        {selectedJob && !showApply && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex justify-center items-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-[#111] w-full max-w-3xl rounded-[2.5rem] p-8 md:p-12 relative shadow-2xl overflow-hidden"
            >
              <button onClick={closeAll} className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-red-500 hover:text-white transition-colors">
                <X size={24} />
              </button>

              <div className="mb-8">
                <span className="text-yellow-500 font-bold tracking-widest text-sm uppercase mb-2 block">Job ID: {selectedJob.id}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{selectedJob.title}</h2>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-1.5 rounded-full border border-slate-200 dark:border-white/20 text-slate-600 dark:text-slate-300 text-sm font-medium">{selectedJob.department}</span>
                  <span className="px-4 py-1.5 rounded-full border border-slate-200 dark:border-white/20 text-slate-600 dark:text-slate-300 text-sm font-medium">{selectedJob.location}</span>
                  <span className="px-4 py-1.5 rounded-full border border-slate-200 dark:border-white/20 text-slate-600 dark:text-slate-300 text-sm font-medium">{selectedJob.type}</span>
                </div>
              </div>

              <div className="space-y-8 mb-10 text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">About the Role</h4>
                  <p>{selectedJob.description}</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Key Responsibilities</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Design and implement scalable solutions.</li>
                    <li>Collaborate with cross-functional teams to define and design new features.</li>
                    <li>Continuously discover, evaluate, and implement new technologies.</li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-white/10 flex justify-end">
                <button onClick={() => setShowApply(true)} className="bg-yellow-400 text-black font-bold px-10 py-4 rounded-full text-lg hover:bg-yellow-500 shadow-lg hover:shadow-yellow-400/30 hover:-translate-y-1 transition-all w-full md:w-auto">
                  Apply for this Role
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* APPLICATION FORM MODAL */}
      <AnimatePresence>
        {showApply && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[101] flex justify-center items-center p-0 md:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              className="bg-white dark:bg-[#0a0a0a] w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-[95vh] md:h-auto max-h-[90vh]"
            >
              {/* Header */}
              <div className="bg-slate-50 dark:bg-[#111] p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Apply for {selectedJob?.title}</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Step {step} of 3</p>
                </div>
                <button onClick={closeAll} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-white transition-colors"><X /></button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-white/5 h-1.5">
                <div className="h-full bg-yellow-400 transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }} />
              </div>

              {/* Form Content */}
              <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar flex-1">
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in-fast">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white"><User className="text-yellow-400" /> Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                        <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#151515] dark:text-white focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                        <input name="email" value={formData.email} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#151515] dark:text-white focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="john@example.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                        <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#151515] dark:text-white focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="+91 98765 43210" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Portfolio URL (Optional)</label>
                        <input name="portfolio" value={formData.portfolio} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#151515] dark:text-white focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="https://portfolio.com" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-fade-in-fast">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white"><Briefcase className="text-yellow-400" /> Experience Details</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Job Title</label>
                        <input name="currentRole" value={formData.currentRole} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#151515] dark:text-white focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="Ex: Senior Developer" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Current Company</label>
                        <input name="currentCompany" value={formData.currentCompany} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#151515] dark:text-white focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="Ex: Acme Corp" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Years of Experience</label>
                        <input name="experienceYears" value={formData.experienceYears} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#151515] dark:text-white focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="Ex: 4 Years" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Notice Period</label>
                        <select name="noticePeriod" value={formData.noticePeriod} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#151515] dark:text-white focus:ring-2 focus:ring-yellow-400 outline-none">
                          <option value="">Select Notice Period</option>
                          <option>Immediate Joiner</option>
                          <option>15 Days</option>
                          <option>30 Days</option>
                          <option>60 Days</option>
                          <option>90 Days</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6 animate-fade-in-fast">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white"><GraduationCap className="text-yellow-400" /> Skills & Finalize</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Primary Skills (Comma separated)</label>
                        <input name="primarySkills" value={formData.primarySkills} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#151515] dark:text-white focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="Ex: React, Node.js, AWS" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Why are you a good fit?</label>
                        <textarea name="coverLetter" value={formData.coverLetter} onChange={handleInputChange} className="w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#151515] dark:text-white focus:ring-2 focus:ring-yellow-400 outline-none h-32" placeholder="Tell us briefly why you want to join FlashSpace..."></textarea>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300">
                        ℹ️ Note: By submitting this application, you agree to our privacy policy and terms of service.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="p-8 border-t border-slate-100 dark:border-white/5 flex justify-between bg-slate-50 dark:bg-[#111]">
                {step > 1 ? (
                  <button onClick={handlePrevStep} className="px-8 py-3 rounded-xl font-semibold bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 text-slate-700 dark:text-white border border-slate-200 dark:border-transparent transition-all">Back</button>
                ) : <div />}

                {step < 3 ? (
                  <button onClick={handleNextStep} className="px-8 py-3 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90 transition-all flex items-center gap-2">Next <ChevronRight size={18} /></button>
                ) : (
                  <button onClick={handleSubmitApp} disabled={isSubmitting} className="px-10 py-3 rounded-xl font-bold bg-yellow-400 text-black hover:bg-yellow-500 shadow-lg hover:shadow-yellow-400/30 transition-all flex items-center gap-2">
                    {isSubmitting ? 'Submitting...' : 'Submit School Application'} <Check size={18} />
                  </button>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// ===============================================
// ContactForm Component
// ===============================================
const ContactForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Application submitted! We will be in touch shortly.");
  };

  return (
    <section className="bg-gradient-to-b from-white to-yellow-50 dark:from-[#0a0a0a] dark:to-[#111] py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-stretch">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-3xl font-bold font-heading text-slate-800 mb-3">Apply <span className="text-yellow-400">Now</span></h2>
              <p className="text-slate-600 mb-6 font-sans">Join our mission to redefine workspace innovation. Fill out the form below or send your resume directly.</p>
              <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                <input type="text" placeholder="Full Name" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white text-slate-900" required />
                <input type="email" placeholder="Email Address" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white text-slate-900" required />
                <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white text-slate-900">
                  <option>Select Role / Department</option><option>Engineering</option><option>Marketing</option><option>Design</option><option>Sales</option><option>Product</option><option>HR</option>
                </select>
                <div>
                  <label className="text-sm text-slate-500 ml-1">Upload Resume</label>
                  <input type="file" className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-600 hover:file:bg-yellow-100" accept=".pdf,.doc,.docx" />
                </div>
                <input type="url" placeholder="Portfolio / LinkedIn URL" className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white text-slate-900" />
                <textarea placeholder="Why do you want to join FlashSpace?" rows={4} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white text-slate-900"></textarea>

                {/* UPDATED BUTTON */}
                <button
                  type="submit"
                  className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-500 hover:shadow-lg transition-all duration-300"
                >
                  Submit Application
                </button>

              </form>
            </div>
            <div className="mt-6 text-center text-sm text-slate-600 font-sans">
              Prefer email? Send your resume to <a href="mailto:careers@flashspace.com" className="text-yellow-500 font-medium hover:underline">careers@flashspace.com</a><br /> or <a href="#" className="text-yellow-500 font-medium underline hover:text-yellow-600">Apply via Google Form</a>
            </div>
          </div>
          <div className="hidden md:block h-full">
            <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1287&auto=format&fit=crop" alt="A team collaborating in a modern office" className="rounded-2xl shadow-xl w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

// ===============================================
// Main Career Page Component
// ===============================================
const CareerPage: React.FC = () => {
  return (
    <div className="bg-white text-slate-800">
      <Header />
      <main>
        <Hero />
        <Stats />
        <WhyPartner />
        <HowItWorks />
        <SuccessStories />
        <OpenPositions />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default CareerPage;