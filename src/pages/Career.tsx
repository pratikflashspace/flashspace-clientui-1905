import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// ===============================================
// Icon Components (from components/Icons.tsx)
// ===============================================

type IconProps = {
  className?: string;
  [key: string]: any; // Allow other props
};

const BSIcon: React.FC<{iconName: string} & IconProps> = ({ iconName, ...props }) => (
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
const FacebookIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-facebook" {...props} />;
const InstagramIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-instagram" {...props} />;
const LinkedInIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-linkedin" {...props} />;
const TwitterIcon: React.FC<IconProps> = (props) => <BSIcon iconName="bi-twitter-x" {...props} />;

// ===============================================
// Styles (component-level)
// ===============================================

/**
 * Inline CSS string for the small animations/keyframes used.
 * You can move this to your global CSS/Tailwind plugin if preferred.
 */
const styleBlock = `
/* Floating orbs */
@keyframes floatUp {
  0% { transform: translateY(0) translateX(0) scale(1); opacity: .9; }
  50% { transform: translateY(-18px) translateX(6px) scale(1.03); opacity: .7; }
  100% { transform: translateY(0) translateX(0) scale(1); opacity: .9; }
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
`;

// ===============================================
// Hero Component (from components/Hero.tsx)
// ===============================================
const Hero: React.FC = () => {
  // parallax refs
  const bgRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const bg = bgRef.current;
    if (!container || !bg) return;

    const handleMove = (e: MouseEvent | globalThis.MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 .. 0.5

      // background parallax
      const translateX = x * 14; // px
      const translateY = y * 10; // px
      bg.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(1.03)`;
    };

    const handleLeave = () => {
      if (bg) bg.style.transform = `translate3d(0, 0, 0) scale(1.03)`;
    };

    // listen on document so it still reacts when pointer moves quickly
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <section className="relative text-white overflow-hidden min-h-screen pt-20 md:pt-24 flex items-center justify-center">
      <style>{styleBlock}</style>

      {/* White padding background */}
      <div className="absolute top-0 left-0 w-full h-15 cvnmd:h-15 bg-white z-10" />

12345678      {/* Parallax Background */}
      <div className="absolute inset-0 -z-0">
        <div
          ref={bgRef}
          className="absolute inset-0 w-full h-full origin-center transition-transform duration-500 ease-out"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1332")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.9) saturate(0.95)',
            transform: 'scale(1.03)',
          }}
        />
        {/* rotating subtle overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ mixBlendMode: 'overlay', animation: 'slowRotate 120s linear infinite' }}>
          <div className="absolute -left-40 -top-36 w-[36rem] h-[36rem] bg-yellow-300/12 rounded-full blur-3xl filter" />
          <div className="absolute -right-40 -bottom-44 w-[28rem] h-[28rem] bg-pink-300/10 rounded-full blur-3xl filter" />
        </div>
      </div>

      {/* Floating orbs */}
      <div ref={containerRef} className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16 md:pt-32 md:pb-20">
        {/* Orbs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute w-44 h-44 rounded-full bg-yellow-400/12 blur-3xl"
            style={{ left: '6%', top: '10%', animation: 'floatUp 8s ease-in-out infinite' }}
          />
          <div
            className="absolute w-32 h-32 rounded-full bg-white/6 blur-2xl"
            style={{ right: '8%', top: '18%', animation: 'floatUp 7s ease-in-out .4s infinite' }}
          />
          <div
            className="absolute w-24 h-24 rounded-full bg-yellow-400/10 blur-2xl"
            style={{ left: '50%', top: '6%', transform: 'translateX(-50%)', animation: 'floatUp 10s ease-in-out .8s infinite' }}
          />
        </div>

        <a
          href="#"
          className="inline-flex items-center bg-black/20 text-yellow-300 rounded-full px-4 py-1.5 text-sm font-semibold border border-yellow-500/50 hover:bg-black/30 transition-colors mb-4"
        >
          <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
          Join Our Growing Network
        </a>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight hero-glow">
          Build the Future with <br />
          <span className="text-yellow-400">FlashSpace</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
          Join India's fastest-growing workspace network and unlock limitless revenue opportunities
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="#"
            className="bg-yellow-400 text-black font-semibold px-8 py-3 rounded-full text-lg 
                       hover:bg-yellow-500 hover:shadow-lg hover:scale-105 transition-all 
                       duration-300 ease-in-out w-full sm:w-auto btn-glow"
            role="button"
          >
            Become a Employee  &rarr;
          </a>

          <a
            href="#"
            className="bg-white/10 border border-white/20 text-white font-semibold px-8 py-3 rounded-full text-lg hover:bg-white/20 transition-colors w-full sm:w-auto"
          >
            Explore Benefits
          </a>
        </div>
      </div>
    </section>
  );
};

// ===============================================
// Stats Component (3D cards + glassmorphism)
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
    const boxShadow = `0 ${Math.max(14, Math.abs(depth))}px ${
      24 + Math.abs(rotateX + rotateY)
    }px rgba(0,0,0,${0.18 + shadowOpacity})`;

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
      className="relative rounded-2xl p-8 md:p-10 transition-transform duration-200 ease-out preserve-3d flex flex-col items-center justify-center text-center"
      style={{
        transform: style.transform,
        boxShadow: style.boxShadow,
        background:
          "linear-gradient(135deg, rgba(255, 250, 230, 0.65), rgba(255, 245, 230, 0.45))",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        height: "220px",
      }}
    >
      <div className="card-sheen absolute inset-0 rounded-2xl pointer-events-none" />
      <div className="flex flex-col items-center justify-center">
        <div className="text-5xl mb-3">{emoji}</div>
        <p className="text-4xl md:text-5xl font-bold text-slate-900">{value}</p>
        <p className="mt-2 text-slate-800 font-medium">{label}</p>
      </div>
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ boxShadow: "inset 0 1px 30px rgba(255, 214, 80, 0.04)" }}
      />
    </div>
  );
};

// =======================
// STATS SECTION
// =======================
const Stats: React.FC = () => {
  const stats = [
    { emoji: "👨‍💼", value: "45", label: "Employees" },
    { emoji: "🌆", value: "50+", label: "Cities Covered" },
    { emoji: "😊", value: "10,000+", label: "Happy Clients" },
    { emoji: "🏆", value: "98%", label: "Employee Satisfaction" },
  ];

  return (
    <section className="bg-flash-dark relative py-20">
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
// WhyPartner Component (unchanged but small polish)
// ===============================================
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="relative bg-slate-50/80 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 border border-slate-200/50 hover:border-flash-yellow hover:shadow-xl hover:shadow-yellow-500/20 hover:-translate-y-2">
    <div className="card-sheen" />
    <div className="bg-yellow-100 text-flash-yellow rounded-xl p-3 inline-block mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

const WhyPartner: React.FC = () => {
  const features = [
    {
      icon: <ArrowTrendingUpIcon className="w-7 h-7" />,
      title: 'Career Growth',
      description: 'We invest in your professional development with continuous learning opportunities and clear paths for advancement.',
    },
    {
      icon: <BanknotesIcon className="w-7 h-7" />,
      title: 'Competitive Compensation',
      description: 'We offer a competitive salary package, comprehensive benefits, and performance-based bonuses.',
    },
    {
      icon: <LifebuoyIcon className="w-7 h-7" />,
      title: 'Supportive Culture',
      description: 'Join a collaborative and inclusive team where your ideas are valued and your well-being is a priority.',
    },
    {
      icon: <ChartBarIcon className="w-7 h-7" />,
      title: 'Impactful Work',
      description: 'Contribute to innovative projects that are shaping the future of workspaces and see your impact in real-time.',
    },
    {
      icon: <UserGroupIcon className="w-7 h-7" />,
      title: 'Collaborative Team',
      description: 'Work alongside talented and passionate individuals in a dynamic, team-oriented environment.',
    },
    {
      icon: <BoltIcon className="w-7 h-7" />,
      title: 'Innovative Environment',
      description: 'Thrive in a fast-paced setting where you can challenge the status quo and drive meaningful change.',
    },
  ];

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-white">
      <div className="absolute -top-48 -right-48 w-[40rem] h-[40rem] bg-yellow-300/20 rounded-full blur-3xl filter" aria-hidden="true"></div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold">
            Why Careers with <span className="text-yellow-400">FlashSpace?</span>
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Join a team that's redefining the future of work. We're looking for passionate individuals to grow with us.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ===============================================
// HowItWorks Component (unchanged look but a little 3d touch on cards)
// ===============================================
const howItWorksSteps = [
  { emoji: "📝", title: "Submit Your Job Application", description: "Fill out our simple application form with your details and resume to get started.", step: "01" },
  { emoji: "🤝", title: "Get Verification & Interview", description: "Our HR team will review your application and schedule an interview if you're a good fit.", step: "02" },
  { emoji: "🎉", title: "Got Offer Letter", description: "If successful, you'll receive an offer letter detailing your role, compensation, and benefits.", step: "03" },
  { emoji: "💼", title: "Join FlashSpace", description: "Welcome aboard! Begin your journey with us and start making an impact from day one.", step: "04" },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-slate-100/70">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
            How to work in <span className="text-yellow-400">FlashSpace</span>
          </h2>

          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Joining FlashSpace is simple. Follow these four easy steps to start your career with us.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto relative">
          {howItWorksSteps.map((step, index) => (
            <div key={step.title} className="relative">
              {index < howItWorksSteps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-yellow-300/70 -z-0" style={{ transform: 'translateX(1.5rem)' }} />
              )}

              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-200 h-full relative z-10 preserve-3d">
                <div className="text-6xl font-bold text-flash-yellow/20 mb-4">{step.step}</div>

                <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-5">
                  <span className="text-4xl" role="img" aria-label={step.title}>{step.emoji}</span>
                </div>

                <h3 className="text-xl font-bold mb-3 text-slate-800">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ===============================================
// SuccessStories Component (unchanged)
// ===============================================
interface Testimonial {
  quote: string;
  name: string;
  role: string;
  location: string;
  revenue: string;
}

const QuoteIcon = () => (
  <svg width="60" height="46" viewBox="0 0 60 46" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-6 right-6 text-slate-200/80">
    <path d="M59.25 23.375C59.25 34.625 51.5 45.125 38 45.125C24.5 45.125 14.25 34.875 14.25 22.875C14.25 10.875 25.25 0.875 38.75 0.875C42.25 0.875 45.5 1.625 48.25 3.125L44.75 10.375C43 9.875 41 9.625 38.75 9.625C30.25 9.625 23.5 15.625 23.5 23.125C23.5 30.625 29.5 36.375 37.25 36.375C44.75 36.375 50.5 30.375 50.5 22.875L50.5 18.125H38.75V9.125H59.25V23.375ZM20.5 23.375C20.5 34.625 12.75 45.125 -0.75 45.125C-14.25 45.125 -24.5 34.875 -24.5 22.875C-24.5 10.875 -13.5 0.875 0 0.875C3.5 0.875 6.75 1.625 9.5 3.125L6 10.375C4.25 9.875 2.25 9.625 0 9.625C-8.5 9.625 -15.25 15.625 -15.25 23.125C-15.25 30.625 -9.25 36.375 -1.5 36.375C6 36.375 11.75 30.375 11.75 22.875L11.75 18.125H-0.75V9.125H20.5V23.375Z" fill="currentColor"/>
  </svg>
);

const TestimonialCard: React.FC<Testimonial> = ({ quote, name, role, location, revenue }) => (
  <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-8 pt-10 border border-slate-200/50 relative transition-all duration-300 hover:border-flash-yellow hover:shadow-xl hover:shadow-yellow-500/20 hover:-translate-y-2">
    <div className="absolute top-0 -mt-4 bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1.5 rounded-full">{revenue}</div>
    <QuoteIcon />
    <p className="relative z-10 text-slate-600 mb-6">"{quote}"</p>
    <div>
      <p className="font-semibold text-slate-900">{name}</p>
      <p className="text-sm text-slate-500">{role}, {location}</p>
    </div>
  </div>
);

const SuccessStories: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      quote: "Joining FlashSpace as a junior developer was a career-defining move. The mentorship is incredible, and I've grown so much in a short time. The projects are challenging and impactful.",
      name: "Rajesh Kumar",
      role: "Software Engineer",
      location: "Mumbai",
      revenue: "₹5L+/Year",
    },
    {
      quote: "The work culture at FlashSpace is truly supportive and collaborative. My ideas are always heard, and there's a great work-life balance. It's a fantastic place to build a long-term career.",
      name: "Priya Sharma",
      role: "Marketing Manager",
      location: "Bangalore",
      revenue: "₹8L+/Year",
    },
    {
      quote: "I've had the opportunity to lead projects that are genuinely shaping the future of work. The leadership team trusts us to innovate, and seeing our products help thousands is incredibly rewarding.",
      name: "Amit Patel",
      role: "Product Lead",
      location: "Delhi",
      revenue: "₹12L+/Year",
    },
  ];

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-white">
      <div className="absolute -bottom-48 -right-48 w-[40rem] h-[40rem] bg-yellow-300/20 rounded-full blur-3xl filter" aria-hidden="true"></div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold">
            Success <span className="text-yellow-400">Stories</span>
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Read stories from our team members about their growth, experiences, and journey at FlashSpace.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ===============================================
// OpenPositions Component (unchanged except small polish)
// ===============================================
interface Job {
  title: string;
  department: string;
  type: 'Internship' | 'Full-Time';
  location: 'Remote' | 'Patna';
  description: string;
  emoji: string;
}

const jobs: Job[] = [
  { title: "Frontend Developer", department: "Tech", type: "Internship", location: "Remote", description: "Craft beautiful and responsive user interfaces with modern web technologies.", emoji: "💻" },
  { title: "Backend Developer", department: "Tech", type: "Full-Time", location: "Patna", description: "Build scalable and robust server-side applications and APIs.", emoji: "⚙️" },
  { title: "UI/UX Designer", department: "Design", type: "Internship", location: "Remote", description: "Create intuitive, user-centered designs for our web and mobile platforms.", emoji: "🎨" },
  { title: "Marketing Executive", department: "Marketing", type: "Full-Time", location: "Patna", description: "Develop and execute marketing campaigns to drive growth and engagement.", emoji: "📈" },
  { title: "Business Development Associate", department: "Sales", type: "Internship", location: "Remote", description: "Identify and pursue new business opportunities and partnerships.", emoji: "🤝" },
  { title: "Data Analyst", department: "Analytics", type: "Full-Time", location: "Remote", description: "Turn complex datasets into actionable insights that drive business decisions.", emoji: "📊" },
  { title: "HR Executive", department: "HR", type: "Full-Time", location: "Patna", description: "Manage the recruitment process and help foster a positive company culture.", emoji: "🧑‍💼" },
  { title: "SEO Specialist", department: "Marketing", type: "Internship", location: "Remote", description: "Optimize our online presence to increase organic traffic and visibility.", emoji: "🔍" },
  { title: "DevOps Engineer", department: "Engineering", type: "Full-Time", location: "Remote", description: "Automate and streamline our operations and processes.", emoji: "🚀" },
  { title: "Content Writer", department: "Marketing", type: "Internship", location: "Remote", description: "Create compelling content for our blog, social media, and marketing materials.", emoji: "✍️" },
  { title: "Product Manager", department: "Product", type: "Full-Time", location: "Patna", description: "Define product vision, strategy, and roadmap for our innovative solutions.", emoji: "🧠" },
  { title: "Customer Success Executive", department: "Operations", type: "Full-Time", location: "Remote", description: "Ensure our customers are successful and satisfied with our products.", emoji: "😊" },
];

const JobCard: React.FC<{ job: Job; onApply: () => void }> = ({ job, onApply }) => {
  return (
    <div className="relative bg-slate-50/80 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 border border-black hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-400/30 hover:-translate-y-2 flex flex-col h-full">
      <div className="absolute top-4 right-5 text-2xl opacity-70" aria-hidden="true">
        {job.emoji}
      </div>

      <div className="flex-grow">
        <h3 className="text-xl font-semibold mb-2 pr-8">{job.title}</h3>

        <div className="flex items-center text-sm text-slate-500 space-x-4 mb-3">
          <span className="flex items-center">
            <BuildingOfficeIcon className="w-4 h-4 mr-1.5" /> {job.department}
          </span>
          <span className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-1.5" /> {job.type}
          </span>
          <span className="flex items-center">
            <MapPinIcon className="w-4 h-4 mr-1.5" /> {job.location}
          </span>
        </div>

        <p className="text-slate-600 text-sm">{job.description}</p>
      </div>

      <div className="mt-6">
        <button
          onClick={onApply}
          className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded-full 
                     hover:bg-yellow-500 hover:shadow-lg hover:scale-105 
                     transition-all duration-300 ease-in-out w-full sm:w-auto"
        >
          Apply Now &rarr;
        </button>
      </div>
    </div>
  );
};

const ApplyModal: React.FC<{ job: Job | null; onClose: () => void; }> = ({ job, onClose }) => {
  if (!job) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Application submitted for ${job.title}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{job.title}</h2>
            <p className="text-slate-500">{job.department} / {job.type} / {job.location}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 transition-colors">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField id="name" label="Full Name" type="text" placeholder="John Doe" icon={<UserIcon className="h-5 w-5 text-gray-400" />} required />
          <InputField id="email" label="Email Address" type="email" placeholder="john@example.com" icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />} required />
          <InputField id="linkedin" label="LinkedIn URL" type="url" placeholder="https://linkedin.com/in/johndoe" icon={<LinkedInIcon className="h-5 w-5 text-gray-400" />} />
          <div>
            <label htmlFor="resume" className="block text-sm font-medium text-slate-700 mb-1">Resume <span className="text-red-500">*</span></label>
            <input type="file" name="resume" id="resume" required className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-flash-yellow hover:file:bg-yellow-100"/>
          </div>
          <div>
            <label htmlFor="why-join" className="block text-sm font-medium text-slate-700 mb-1">Why do you want to join FlashSpace? <span className="text-red-500">*</span></label>
            <div className="relative">
              <ChatBubbleLeftEllipsisIcon className="pointer-events-none absolute top-3.5 left-3 h-5 w-5 text-gray-400" />
              <textarea id="why-join" name="why-join" rows={4} required className="block w-full rounded-lg border-slate-300 py-3 pl-10 pr-3 shadow-sm focus:border-flash-yellow focus:ring-flash-yellow sm:text-sm" placeholder="Tell us what excites you about this role..."></textarea>
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full inline-flex justify-center rounded-lg border border-transparent bg-flash-yellow px-8 py-3 text-base font-semibold text-flash-dark shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-flash-yellow focus:ring-offset-2">Submit Application</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField: React.FC<{id: string, label: string, type: string, placeholder: string, icon: React.ReactNode, required?: boolean}> = ({ id, label, type, placeholder, icon, required }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {icon}
      </div>
      <input type={type} name={id} id={id} className="block w-full rounded-lg border-slate-300 py-3 pl-10 pr-3 shadow-sm focus:border-flash-yellow focus:ring-flash-yellow sm:text-sm" placeholder={placeholder} required={required} />
    </div>
  </div>
);

const OpenPositions: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleApplyClick = (job: Job) => setSelectedJob(job);
  const handleCloseModal = () => setSelectedJob(null);

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-slate-100/70">
      <div className="absolute -top-48 -left-48 w-[40rem] h-[40rem] bg-yellow-300/20 rounded-full blur-3xl filter" aria-hidden="true"></div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold">
            Open <span className="text-yellow-400">Positions</span>
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Find your next opportunity. Join our team of innovators and builders who are shaping the future of work.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {jobs.map((job, index) => (
            <JobCard key={index} job={job} onApply={() => handleApplyClick(job)} />
          ))}
        </div>
      </div>
      {selectedJob && <ApplyModal job={selectedJob} onClose={handleCloseModal} />}
    </section>
  );
};

// ===============================================
// ContactForm Component (unchanged except tiny polish)
// ===============================================
const ContactForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Application submitted! We will be in touch shortly.");
  };

  return (
    <section className="bg-gradient-to-b from-white to-yellow-50 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 🔹 Use items-stretch to make both columns equal height */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-stretch">
          {/* LEFT: Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-3xl font-bold font-heading text-slate-800 mb-3">
                Apply <span className="text-yellow-400">Now</span>
              </h2>

              <p className="text-slate-600 mb-6 font-sans">
                Join our mission to redefine workspace innovation. Fill out the
                form below or send your resume directly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 font-sans">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flash-yellow focus:border-flash-yellow bg-white text-slate-900"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flash-yellow focus:border-flash-yellow bg-white text-slate-900"
                  required
                />
                <select className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flash-yellow focus:border-flash-yellow bg-white text-slate-900">
                  <option>Select Role / Department</option>
                  <option>Engineering</option>
                  <option>Marketing</option>
                  <option>Design</option>
                  <option>Sales</option>
                  <option>Product</option>
                  <option>HR</option>
                </select>

                <div>
                  <label className="text-sm text-slate-500 ml-1">
                    Upload Resume
                  </label>
                  <input
                    type="file"
                    className="w-full p-2 border border-slate-300 rounded-lg text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-flash-yellow hover:file:bg-yellow-100"
                    accept=".pdf,.doc,.docx"
                  />
                </div>

                <input
                  type="url"
                  placeholder="Portfolio / LinkedIn URL"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flash-yellow focus:border-flash-yellow bg-white text-slate-900"
                />

                <textarea
                  placeholder="Why do you want to join FlashSpace?"
                  rows={4}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-flash-yellow focus:border-flash-yellow bg-white text-slate-900"
                ></textarea>

                <button
                  type="submit"
                  className="w-full bg-flash-yellow hover:opacity-90 text-flash-dark font-semibold py-3 rounded-xl transition-opacity"
                >
                  Submit Application
                </button>
              </form>
            </div>

            <div className="mt-6 text-center text-sm text-slate-600 font-sans">
              Prefer email? Send your resume to{" "}
              <a
                href="mailto:careers@flashspace.com"
                className="text-flash-yellow font-medium hover:underline"
              >
                careers@flashspace.com
              </a>
              <br />
              or{" "}
              <a
                href="#"
                className="text-flash-yellow font-medium underline hover:text-yellow-600"
              >
                Apply via Google Form
              </a>
            </div>
          </div>

          {/* RIGHT: Image - same height as form */}
          <div className="hidden md:block h-full">
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1287&auto=format&fit=crop"
              alt="A team collaborating in a modern office"
              className="rounded-2xl shadow-xl w-full h-full object-cover"
            />
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
