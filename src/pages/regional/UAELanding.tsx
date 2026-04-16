import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import {
  ArrowRight,
  Building2,
  ShieldCheck,
  Globe2,
  Users,
  Gem,
  CheckCircle2,
  ChevronDown,
  Zap,
  Phone,
  Star,
  ArrowUpRight,
  Menu,
  X,
  Search,
  Instagram,
  Linkedin
} from 'lucide-react';
import { RegionSwitcher } from '@/components/RegionSwitcher';
import UAEParticles from '@/components/UAEParticles';
import { Magnetic, TiltCard, MouseGlow } from '@/components/InteractivePremium';

/* ─────────────────────────────────────────
   DESIGN TOKENS — duqe.ae inspired
───────────────────────────────────────── */
const C = {
  brand:      '#35503f',
  brandDark:  '#1e3028',
  brandDeep:  '#111e17',
  gold:       '#FFC700',
  goldDim:    '#cc9f00',
  white:      '#FFFFFF',
  offwhite:   '#F4F7F5',
  textDim:    'rgba(255,255,255,0.55)',
  textMuted:  'rgba(255,255,255,0.30)',
  grayText:   '#5e7568',
  darkText:   '#1a2e1f',
  border:     '#d4e0d9',
};

const FONT_STACK = '"HelveticaNowDisplay-Bd", Helvetica, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
const HEADING = FONT_STACK;
const BODY    = FONT_STACK;

const useFont = () => {
  // HelveticaNowDisplay-Bd is assumed to be locally hosted or system available.
};

/* ─────────────────────────────────────────
   REUSABLE PRIMITIVES
───────────────────────────────────────── */

/** Scroll-triggered fade-up */
const FadeUp: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = '',
}) => {
  const ref = useRef(null);
  const inV = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 60 }}
      animate={inV ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >{children}</motion.div>
  );
};

/** Scroll-triggered slide-from-left */
const FadeLeft: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = '',
}) => {
  const ref = useRef(null);
  const inV = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, x: -60 }}
      animate={inV ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >{children}</motion.div>
  );
};

/** Scroll-triggered slide-from-right */
const FadeRight: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = '',
}) => {
  const ref = useRef(null);
  const inV = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, x: 60 }}
      animate={inV ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >{children}</motion.div>
  );
};

/** Gold CTA button */
const GoldBtn: React.FC<{ children: React.ReactNode; onClick?: () => void; large?: boolean; className?: string }> = ({
  children, onClick, large, className = '',
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 0.97 }}
    whileTap={{ scale: 0.93 }}
    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    className={`relative overflow-hidden inline-flex items-center gap-3 font-black uppercase rounded-sm group ${large ? 'px-10 py-5 text-[15px]' : 'px-8 py-4 text-[13px]'} ${className}`}
    style={{ background: C.gold, color: C.brandDeep, fontFamily: BODY, letterSpacing: '0.07em' }}
  >
    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
    <span className="relative z-10 flex items-center gap-3">{children}</span>
  </motion.button>
);

/** Outline button */
const OutlineBtn: React.FC<{ children: React.ReactNode; onClick?: () => void; dark?: boolean; className?: string }> = ({
  children, onClick, dark = false, className = '',
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 0.97 }}
    whileTap={{ scale: 0.93 }}
    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    className={`inline-flex items-center gap-3 font-black uppercase rounded-sm px-8 py-4 text-[13px] border-2 transition-colors duration-200 ${className}`}
    style={{
      fontFamily: BODY,
      letterSpacing: '0.07em',
      color: dark ? C.white : C.brand,
      borderColor: dark ? 'rgba(255,255,255,0.25)' : C.brand,
    }}
  >
    {children}
  </motion.button>
);

/** Small uppercase section label */
const Label: React.FC<{ children: React.ReactNode; light?: boolean }> = ({ children, light }) => (
  <span
    className="inline-block font-bold uppercase tracking-[0.2em] text-[11px] mb-4"
    style={{ color: light ? C.textMuted : C.goldDim }}
  >
    — {children}
  </span>
);

const validDubaiUrls = [
  'https://images.pexels.com/photos/33669696/pexels-photo-33669696.jpeg?auto=compress&w=1200', // Full ownership
  'https://images.pexels.com/photos/33669490/pexels-photo-33669490.jpeg?auto=compress&w=1200', // Zero income tax
  'https://images.pexels.com/photos/10759794/pexels-photo-10759794.jpeg?auto=compress&w=1200', // Capital Freedom
  'https://images.pexels.com/photos/34233392/pexels-photo-34233392.jpeg?auto=compress&w=1200', // Golden Visa
  'https://images.pexels.com/photos/29815566/pexels-photo-29815566.jpeg?auto=compress&w=1200'  // Global Gateway
];

const imgPool = validDubaiUrls.map(url => url.replace('w=1200', 'w=400'));

const uaeBenefits = [
  { num: '01', title: 'Full Ownership', desc: 'Retain 100% control of your enterprise without needing a local sponsor.', img: validDubaiUrls[0] },
  { num: '02', title: 'Zero Income Tax', desc: 'Enjoy completely tax-free personal income and favorable corporate frameworks.', img: validDubaiUrls[1] },
  { num: '03', title: 'Capital Freedom', desc: 'Unrestricted repatriation of profits and capital without any currency peg risks.', img: validDubaiUrls[2] },
  { num: '04', title: 'Golden Visa', desc: 'Secure 10-year residency for yourself, family, and key executive team members.', img: validDubaiUrls[3] },
  { num: '05', title: 'Global Gateway', desc: 'Direct connectivity to two-thirds of the world’s population within an 8-hour flight.', img: validDubaiUrls[4] }
];

const JURISDICTION_LIST = [
  "UAE Free Zones",
  "Offshore",
  "Dubai Mainland",
  "Abu Dhabi Mainland",
  "International"
];

const FREE_ZONES = [
  "Masdar City",
  "DIFC (Finance)",
  "DMCC (Commodities)",
  "DWTC (Trade)",
  "D3 (Design)",
  "Dubai South",
  "Meydan Free Zone",
  "Shams (Sharjah Media)",
  "SPCFZ (Publishing)",
  "KIZAD (Logistics)",
  "FCC (Fujairah)",
  "AFZ (Ajman)",
  "UAQFTZ (Trade)",
  "RAK DAO",
  "Rakez"
];

const OFFSHORE_LIST = [
  "British Virgin Islands (BVI)",
  "Ajman Free Zone (AFZ)",
  "Jebel Ali Free Zone (JAFZA)",
  "Ras Al-Khaimah (RAK ICC)",
  "Mauritius"
];

const SERVICES_CATEGORIZED = [
  {
    category: "Business Setup",
    items: ["Company Formation", "Offshore Setup", "SPVs & Holdings", "Foundations & Trusts"]
  },
  {
    category: "Operations & Finance",
    items: ["Tax & Accounting", "Banking Assistance", "ISO Certification", "Intellectual Property"]
  },
  {
    category: "Resource & Growth",
    items: ["Human Resources", "Recruitment", "Media & Marketing", "Education & Training"]
  },
  {
    category: "Concierge & Hub",
    items: ["Concierge Services", "Communication Hub", "Business Hub", "Fit out & Renovations"]
  }
];

const UAEAdvantageAccordion = () => {
  const [activeRow, setActiveRow] = useState<number | null>(0);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  
  // Tracking mouse for floating image
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imgIndex, setImgIndex] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (hoveredRow === null) return;
    const interval = setInterval(() => {
      setImgIndex(prev => (prev + 1) % imgPool.length);
    }, 250); // fast cycle
    return () => clearInterval(interval);
  }, [hoveredRow]);

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative w-full py-24 md:py-36 bg-[#111e17] overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Hidden Preloader to guarantee 0 delay on images */}
      <div className="hidden" aria-hidden="true">
        {imgPool.map(src => <img key={src} src={src} alt="preload" />)}
        {uaeBenefits.map(b => <img key={b.img} src={b.img} alt="preload" />)}
      </div>

      {/* Background Images Crossfade */}
      <AnimatePresence mode="wait">
        {activeRow !== null && (
          <motion.img
            key={activeRow}
            src={uaeBenefits[activeRow].img}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.45, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-[#111e17] via-[#111e17]/60 to-[#111e17]/10 pointer-events-none" />

      {/* Floating Mouse Follower */}
      <AnimatePresence>
        {hoveredRow !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, x: mousePos.x + 20, y: mousePos.y - 100 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              opacity: { duration: 0.05 },
              scale: { duration: 0.05 },
              x: { type: "tween", duration: 0.1, ease: 'linear' },
              y: { type: "tween", duration: 0.1, ease: 'linear' }
            }}
            className="hidden md:block fixed top-0 left-0 pointer-events-none z-[100] w-[240px] h-[160px] rounded-lg overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/20 bg-[#111e17]"
          >
            <img 
              key={imgIndex}
              src={imgPool[imgIndex]} 
              className="w-full h-full object-cover"
              alt="Floating Preview"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-10 w-full mb-16 pointer-events-none">
        <Label light>The Ecosystem</Label>
        <h2 className="text-white uppercase font-black text-4xl md:text-5xl lg:text-7xl tracking-tighter mt-2" style={{ fontFamily: HEADING }}>
          THE DUBAI <span className="text-[#FFC700]">ADVANTAGE</span>
        </h2>
      </div>

      <div 
        className="relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-10 flex-1 flex flex-col justify-center"
        onMouseLeave={() => setHoveredRow(null)}
      >
        {uaeBenefits.map((b, i) => {
          const isActive = activeRow === i;
          return (
            <div
              key={b.num}
              onMouseEnter={() => {
                setActiveRow(i);
                setHoveredRow(i);
              }}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={() => setActiveRow(isActive ? null : i)}
              className="group border-t border-white/10 last:border-b py-6 md:py-8 cursor-pointer relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 h-full w-[4px] bg-[#FFC700] transition-transform duration-500 origin-top ${isActive ? 'scale-y-100' : 'scale-y-0'}`} />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-4 md:pl-8 pointer-events-none md:pointer-events-auto">
                <div className="flex items-center gap-6 md:gap-12 w-full md:w-1/2 pointer-events-none">
                  <span className={`font-bold text-xl md:text-3xl transition-colors duration-300 ${isActive ? 'text-[#FFC700]' : 'text-white/30'}`} style={{ fontFamily: BODY }}>{b.num}</span>
                  <h3 className={`text-white text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight transform transition-transform duration-500 ${isActive ? 'translate-x-3' : ''}`} style={{ fontFamily: HEADING }}>
                    {b.title}
                  </h3>
                </div>
                <div className="w-full md:w-1/2 md:pl-10 pointer-events-none">
                  <motion.div
                    initial={false}
                    animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="py-2 flex flex-col xl:flex-row gap-6 items-start xl:items-center">
                      <p className="text-white/70 text-sm md:text-base leading-relaxed flex-1" style={{ fontFamily: BODY }}>
                        {b.desc}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export const UAELanding: React.FC = () => {
  useFont();
  const navigate = useNavigate();
  const [navScrolled,  setNavScrolled]  = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [openFaq,      setOpenFaq]      = useState<number | null>(null);
  const [activePlan,   setActivePlan]   = useState(1);
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [hoveredJuris, setHoveredJuris] = useState<string | null>("UAE Free Zones");
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [serviceCat, setServiceCat] = useState('setup');
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  /* nav scroll detection */
  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* hero parallax */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const videoY   = useTransform(heroP, [0, 1], ['0%', '28%']);
  const contentY = useTransform(heroP, [0, 1], ['0%', '12%']);
  const overlayO = useTransform(heroP, [0, 1], [0.76, 0.9]);

  /* lock body scroll when menu is open */
  useEffect(() => {
    if (sideMenuOpen || mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sideMenuOpen, mobileOpen]);

  /* ─────────────── RENDER ─────────────── */
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ fontFamily: BODY, background: C.white, color: C.darkText }}
    >
      <MouseGlow color={C.gold} opacity={0.08} size={500} />

      {/* 
          CINEMATIC ENTRANCE REVEAL
          The page starts with a deep, dark brand-colored overlay that fades out,
          providing a high-end, cinematic "lighting up" effect on load.
      */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[10000] bg-[#040806] pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10"
      >

      {/* ══════════ UNIFIED NAVBAR ══════════ */}
      <motion.header 
        className={`fixed top-0 left-0 w-full h-[100px] z-[300] hidden lg:flex items-center justify-between px-10 transition-all duration-500 ${navScrolled ? 'bg-black/10 backdrop-blur-md border-b border-white/5 h-[84px]' : 'bg-transparent'}`}
      >
          <div className="flex items-center gap-6">
            <Magnetic strength={20}>
              <button 
                onClick={() => setSideMenuOpen(!sideMenuOpen)}
                className={`w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group transition-all duration-500 ${sideMenuOpen ? 'bg-white shadow-xl rotate-90' : 'bg-white/10 hover:bg-[#FFC700] hover:border-transparent'}`}
              >
                {sideMenuOpen ? <X className="w-6 h-6 text-[#1a2e1f]" /> : <Menu className="w-6 h-6 text-white" />}
              </button>
            </Magnetic>
            <div className="h-9 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
              <img src="/Logo/Flashspace Logo.png" alt="FlashSpace Logo" className="h-full object-contain" />
            </div>
          </div>

         {/* RIGHT: Links & CTA */}
         <div className="flex items-center gap-8">
            <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="text-[12px] font-black uppercase tracking-widest text-white hover:text-[#FFC700] transition-colors font-body">Pricing</button>
            <button className="text-[12px] font-black uppercase tracking-widest text-white hover:text-[#FFC700] transition-colors font-body">Contact Us</button>
            <div className="flex transition-all hover:scale-105">
               <RegionSwitcher forcedDark={false} />
            </div>
            <Magnetic strength={15}>
               <button className="h-11 px-6 bg-[#FFC700] text-[#111e17] font-black text-[11px] uppercase tracking-widest hover:bg-white hover:shadow-xl transition-all shadow-lg rounded-sm">
                  Cost Calculator
               </button>
            </Magnetic>
         </div>
      </motion.header>

      {/* ══════════ SIDE DRAWER MENU ══════════ */}
      <AnimatePresence>
        {sideMenuOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSideMenuOpen(false)}
               className="fixed inset-0 bg-black/30 z-[180]"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 h-[100dvh] w-full sm:w-[500px] bg-[#f1ede1] z-[190] border-r border-black/5 shadow-[30px_0_60px_rgba(0,0,0,0.1)] flex flex-col pointer-events-auto"
            >
               <div className="flex-1 overflow-y-auto overscroll-contain flex flex-col p-16 sm:p-20" data-lenis-prevent="true">
                  <div className="mb-14">
                     <span className="text-[10px] font-black text-[#1a2e1f]/40 tracking-[.5em] uppercase">Success Starts Here</span>
                  </div>

               <nav className="flex flex-col gap-10">
                  {['Jurisdictions', 'Services', 'Resources', 'About Us'].map((l, i) => {
                    const isMenu = l === 'Jurisdictions' || l === 'Services';
                    return (
                      <div key={l} className="group flex flex-col">
                        <motion.button
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.05 }}
                          onClick={() => {
                             if (isMenu) {
                               setActiveMenu(activeMenu === l ? null : l);
                             } else {
                               if (l === 'Pricing') document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                               setSideMenuOpen(false);
                             }
                          }}
                          className={`text-left text-2xl sm:text-3xl font-black uppercase tracking-tighter flex items-center justify-between transition-colors ${activeMenu === l ? 'text-[#35503f]' : 'text-[#1a2e1f]/40 hover:text-[#1a2e1f]'}`}
                        >
                          {l}
                          {isMenu && (
                            <div className={`w-8 h-8 rounded-full border border-black/10 flex items-center justify-center transition-all ${activeMenu === l ? 'rotate-180 bg-[#35503f] border-[#35503f]' : 'group-hover:border-black/30'}`}>
                               <ChevronDown className={`w-3.5 h-3.5 ${activeMenu === l ? 'text-white' : 'text-[#1a2e1f]/40'}`} />
                            </div>
                          )}
                        </motion.button>

                        <AnimatePresence>
                          {activeMenu === l && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                                <div className="py-6 grid grid-cols-1 gap-4">
                                   {l === 'Jurisdictions' ? (
                                      <div className="grid grid-cols-1 gap-1">
                                         {JURISDICTION_LIST.map((sub, si) => (
                                           <motion.div 
                                             key={sub}
                                             initial={{ opacity: 0, scale: 0.98 }}
                                             animate={{ opacity: 1, scale: 1 }}
                                             transition={{ delay: si * 0.02 }}
                                             className="group/sub flex items-center justify-between py-3 border-b border-black/[0.05] cursor-pointer"
                                           >
                                             <span className="text-[#1a2e1f]/40 text-[14px] font-black uppercase tracking-widest group-hover/sub:text-[#35503f] transition-colors">{sub}</span>
                                             <ArrowRight className="w-4 h-4 text-[#35503f] opacity-0 group-hover/sub:opacity-100 transition-all -translate-x-3 group-hover/sub:translate-x-0" />
                                           </motion.div>
                                         ))}
                                      </div>
                                   ) : (
                                      <div className="space-y-4">
                                         {SERVICES_CATEGORIZED.map((cat, ci) => {
                                           const isCatOpen = activeSubMenu === cat.category;
                                           return (
                                             <div key={cat.category} className="border-b border-black/[0.03] last:border-0 pb-2">
                                                <button 
                                                  onClick={() => setActiveSubMenu(isCatOpen ? null : cat.category)}
                                                  className="w-full flex items-center justify-between py-3 group/catTrigger"
                                                >
                                                   <span className={`text-[13px] font-black uppercase tracking-[.25em] transition-all duration-300 ${isCatOpen ? 'text-[#35503f]' : 'text-[#1a2e1f]/30 group-hover/catTrigger:text-[#1a2e1f]'}`}>
                                                      {cat.category}
                                                   </span>
                                                   <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-500 ${isCatOpen ? 'rotate-180 bg-[#35503f]/10' : 'group-hover/catTrigger:bg-black/5'}`}>
                                                      <ChevronDown className={`w-3 h-3 ${isCatOpen ? 'text-[#35503f]' : 'text-[#1a2e1f]/20'}`} />
                                                   </div>
                                                </button>
                                                <AnimatePresence>
                                                   {isCatOpen && (
                                                      <motion.div
                                                         initial={{ height: 0, opacity: 0 }}
                                                         animate={{ height: 'auto', opacity: 1 }}
                                                         exit={{ height: 0, opacity: 0 }}
                                                         transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                                         className="overflow-hidden"
                                                      >
                                                         <div className="flex flex-col gap-1 pb-4 pl-4 border-l-2 border-[#35503f]/10 my-2">
                                                            {cat.items.map((sub, si) => (
                                                              <motion.div 
                                                                key={sub}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: si * 0.05 }}
                                                                className="group/sub cursor-pointer py-2 flex items-center gap-3"
                                                              >
                                                                 <div className="w-1 h-1 rounded-full bg-[#35503f] opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                                                                 <span className="text-[#1a2e1f]/40 text-[14px] font-bold uppercase tracking-widest group-hover/sub:text-[#1a2e1f] transition-all duration-300">
                                                                    {sub}
                                                                 </span>
                                                              </motion.div>
                                                            ))}
                                                         </div>
                                                      </motion.div>
                                                   )}
                                                </AnimatePresence>
                                             </div>
                                           );
                                         })}
                                      </div>
                                   )}
                                </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
               </nav>

               <div className="mt-16 space-y-10 pt-12 border-t border-black/5">
                  <div className="flex flex-col gap-3">
                     <span className="text-[#1a2e1f]/20 text-[10px] font-black uppercase tracking-[0.4em]">Digital First</span>
                     <span className="text-[#1a2e1f] font-black text-lg leading-tight tracking-tight">
                        Reach out to our specialists at <br/>
                        <span className="text-[#35503f] opacity-60">support@flashspace.ae</span>
                     </span>
                  </div>
                  <Magnetic strength={10}>
                    <button 
                      onClick={() => { setSideMenuOpen(false); navigate('/login'); }}
                      className="w-full h-16 rounded-full bg-[#1a2e1f] text-white font-black text-[13px] uppercase tracking-[0.25em] hover:bg-[#35503f] transition-all shadow-xl"
                    >
                      Initialize Setup
                    </button>
                  </Magnetic>
               </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>

       {/* ══════════ MOBILE HEADER ══════════ */}
       <header className="fixed top-0 left-0 w-full h-[80px] z-[150] lg:hidden flex items-center justify-between px-6 bg-[#0a140f] border-b border-white/5">
           <div className="h-8 cursor-pointer" onClick={() => navigate('/')}>
              <img src="/Logo/Flashspace Logo.png" alt="FlashSpace Logo" className="h-full object-contain invert brightness-200" />
           </div>
           <button onClick={() => setMobileOpen(true)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <Menu className="w-6 h-6 text-white" />
           </button>
       </header>

       {/* Existing mobile menu overlay logic */}
       <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[2000] flex flex-col bg-[#0a140f] overflow-y-auto overscroll-contain pointer-events-auto"
            data-lenis-prevent="true"
          >
            <div className="flex items-center justify-between px-6 h-[80px] border-b border-white/5 shrink-0">
              <div className="h-8 cursor-pointer" onClick={() => navigate('/')}>
                <img src="/Logo/Flashspace Logo.png" alt="FlashSpace Logo" className="h-full object-contain invert brightness-200" />
              </div>
              <button onClick={() => setMobileOpen(false)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center"><X className="w-6 h-6 text-white" /></button>
            </div>
            <div className="flex flex-col p-10 gap-8 min-h-max">
              {['Jurisdictions', 'Services', 'Pricing', 'Contact Us'].map((l, i) => (
                <motion.button
                  key={l}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => { setMobileOpen(false); if (l === 'Pricing') document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="text-left font-black uppercase text-3xl tracking-tighter text-white/50 hover:text-white"
                >{l}</motion.button>
              ))}
              <div className="mt-10">
                 <GoldBtn onClick={() => { setMobileOpen(false); navigate('/login'); }} className="w-full h-16">
                   Get Started <ArrowRight className="ml-2 w-5 h-5" />
                 </GoldBtn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ══════════════════════════════════════
          HERO — video background + parallax
      ══════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] flex items-center overflow-hidden" style={{ paddingTop: '70px' }}>

        {/* Three.js particle sphere — right side of hero */}
        <div className="absolute right-0 top-0 w-full lg:w-1/2 h-full z-[2] opacity-60">
          <UAEParticles />
        </div>

        {/* Background video with parallax */}
        <motion.div className="absolute inset-0" style={{ y: videoY }}>
          <video
            autoPlay muted loop playsInline
            className="absolute w-full h-[115%] object-cover -top-[7%]"
            poster="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070"
          >
            <source src="https://videos.pexels.com/video-files/3015476/3015476-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          </video>
          {/* Image fallback */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070)' }}
          />
        </motion.div>

        {/* Multi-layer dark overlay for perfect text readability */}
        <motion.div className="absolute inset-0" style={{ opacity: overlayO }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${C.brandDeep} 0%, rgba(14,32,22,0.9) 45%, rgba(20,38,28,0.7) 100%)` }} />
        </motion.div>
        {/* Bottom gradient for content area */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,22,15,0.98) 0%, rgba(10,22,15,0.2) 50%, transparent 100%)' }} />

        {/* Cinematic Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-10 z-10 flex flex-col items-center gap-3"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 [writing-mode:vertical-lr]">Scroll</span>
          <div className="w-[1px] h-12 bg-white/10 relative overflow-hidden">
            <motion.div 
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-[#FFC700]"
            />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          style={{ y: contentY }}
          className="relative z-10 w-full lg:max-w-none pl-6 pr-6 lg:pl-10 lg:pl-[max(2.5rem,calc((100vw-1200px)/2-40px))] py-16 mt-24 lg:mt-12"
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}>
            <Label light>FlashSpace UAE — Business Made Simple</Label>
          </motion.div>

          <h1
            className="mt-3 mb-7"
            style={{
              fontFamily: HEADING,
              fontWeight: 900,
              fontSize: 'clamp(44px, 8vw, 120px)',
              lineHeight: 0.85,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: C.white,
            }}
          >
            {["BUILD YOUR", "FUTURE IN", "THE UAE."].map((line, i) => (
              <div key={i} className="overflow-hidden">
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ 
                    delay: 0.9 + (i * 0.15), 
                    duration: 1.2, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  style={{ color: line.includes('UAE') ? C.gold : C.white }}
                >
                  {line}
                </motion.div>
              </div>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="max-w-[480px] text-[16px] leading-[1.65] mb-10"
            style={{ color: C.textDim, fontFamily: BODY }}
          >
            Set up your UAE company from anywhere in the world.
We handle everything — so you can focus on growth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <Magnetic strength={25}>
              <GoldBtn large onClick={() => navigate('/services/virtual-office')}>
                Start Your Business <ArrowRight className="w-5 h-5" />
              </GoldBtn>
            </Magnetic>
            <Magnetic strength={25}>
              <OutlineBtn dark onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
                View Pricing
              </OutlineBtn>
            </Magnetic>
          </motion.div>

          {/* trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
            className="flex flex-wrap gap-7"
          >
            {['100% Ownership', '24-Hour Setup', 'Golden Visa', '500+ Businesses'].map(t => (
              <span key={t} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: C.textMuted, fontFamily: BODY }}>
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.gold }} />
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          className="absolute right-10 bottom-10 flex flex-col items-center gap-2 z-10 rotate-[90deg] origin-center"
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: C.textMuted }}>Scroll</span>
          <ArrowRight className="w-4 h-4" style={{ color: C.textMuted }} />
        </motion.div>
      </section>


      {/* ══════════════════════════════════════
          STATS BAND — deep dark
      ══════════════════════════════════════ */}
      {/* ══════════════════════════════════════
          STATS BAND — Dynamic Ticker Style
      ══════════════════════════════════════ */}
      <section style={{ background: C.brandDeep }} className="border-y border-white/[0.05]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/[0.05]">
            {[
              { n: '500+', l: 'Businesses Launched', sub: 'UAE-Wide Network' },
              { n: '24 hrs', l: 'Fastest Setup', sub: 'License Processing' },
              { n: '100%', l: 'Foreign Ownership', sub: 'Full Capital Repatriation' },
              { n: '50+', l: 'Free Zone Partners', sub: 'Global Connectivity' },
            ].map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="px-8 py-14 flex flex-col group cursor-default"
              >
                <div 
                  className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-[#FFC700] transition-transform duration-500 group-hover:translate-x-2"
                  style={{ fontFamily: BODY }}
                >
                  {s.sub}
                </div>
                <div
                  className="font-black leading-none mb-3 transition-colors duration-500 group-hover:text-[#FFC700]"
                  style={{ fontFamily: HEADING, fontSize: 'clamp(44px, 6vw, 70px)', color: C.white, letterSpacing: '-0.04em' }}
                >
                  {s.n}
                </div>
                <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-white/40" style={{ fontFamily: BODY }}>
                  {s.l}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          UAE ADVANTAGE (Awwwards-style Hover Accordion)
      ══════════════════════════════════════ */}
      <UAEAdvantageAccordion />


      {/* ══════════════════════════════════════
          SERVICES
      ══════════════════════════════════════ */}
      <section className="py-28 lg:py-36 bg-[#f8f9fa]">
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10">
          <FadeLeft className="mb-16 flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="max-w-[600px]">
              <Label>Our Expertise</Label>
              <h2
                className="mt-2"
                style={{
                  fontFamily: HEADING,
                  fontWeight: 900,
                  fontSize: 'clamp(40px, 5vw, 70px)',
                  lineHeight: 0.9,
                  letterSpacing: '-0.04em',
                  textTransform: 'uppercase',
                  color: C.brand,
                }}
              >
                ONE PLATFORM.<br />EVERY <span className="text-[#111e17]/20 italic">SOLUTION.</span>
              </h2>
            </div>
            
            {/* Premium Category Switcher */}
            <div className="relative p-1.5 bg-black/5 rounded-2xl backdrop-blur-md flex gap-1 border border-black/5">
              {['setup', 'residency', 'workspace'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setServiceCat(cat)}
                  className={`relative z-10 px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${serviceCat === cat ? 'text-white' : 'text-[#35503f]/50 hover:text-[#35503f]'}`}
                >
                  {serviceCat === cat && (
                    <motion.div 
                      layoutId="catBg"
                      className="absolute inset-0 bg-[#35503f] rounded-xl z-[-1]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {cat}
                </button>
              ))}
            </div>
          </FadeLeft>

          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={serviceCat}
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {(serviceCat === 'setup' ? [
                  { Icon: Building2,  t: 'Free Zone',   d: '100% foreign ownership. Strategic locations — DIFC, DMCC, DAFZA. Ready in 24h.', img: validDubaiUrls[0] },
                  { Icon: ShieldCheck, t: 'Mainland',    d: 'Direct access to UAE market with full regulatory compliance and PRO support.', img: validDubaiUrls[1] },
                  { Icon: Zap,        t: '24h Setup',   d: 'Optimized internal workflows for lightning-fast business registration and licensing.', img: validDubaiUrls[2] },
                ] : serviceCat === 'residency' ? [
                  { Icon: Gem,        t: 'Golden Visa', d: 'Secure 10-year residency for yourself, family, and team members. Fully managed.', img: validDubaiUrls[3] },
                  { Icon: Users,      t: 'Family Visas', d: 'Seamless sponsorship for dependents including medical, biometrics and ID processing.', img: validDubaiUrls[4] },
                  { Icon: ShieldCheck, t: 'PRO Support',  d: 'Dedicated government relations and legal compliance to keep your firm protected.', img: validDubaiUrls[0] },
                ] : [
                  { Icon: Globe2,     t: 'Virtual Hub',  d: 'Prestigious Dubai business addresses with digital mail and reception services.', img: validDubaiUrls[1] },
                  { Icon: Users,      t: 'Workspace',    d: 'Premium flexible desks and private offices in heart of the business district.', img: validDubaiUrls[2] },
                  { Icon: Building2,  t: 'Banking',      d: 'Priority corporate account opening with top UAE banks via direct channels.', img: validDubaiUrls[0] },
                ]).map(({ Icon, t, d, img }, i) => (
                  <motion.div
                    key={t}
                    whileHover={{ y: -10 }}
                    className="group relative overflow-hidden p-10 bg-white rounded-2xl cursor-pointer h-full border border-black/5 shadow-sm hover:shadow-2xl transition-all duration-500"
                    style={{ minHeight: 400 }}
                  >
                    {/* Visual Image Background (Enhanced) */}
                    <div 
                       className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-all duration-700 bg-cover bg-center scale-110 group-hover:scale-100" 
                       style={{ backgroundImage: `url(${img})` }} 
                    />
                    
                    {/* Dark Overlay for contrast when image is visible */}
                    <div className="absolute inset-0 bg-[#111e17]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1]" />
                    
                    <div className="relative z-10 flex flex-col h-full pointer-events-none">
                      <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center mb-10 group-hover:bg-[#FFC700] transition-all duration-500">
                         <Icon className="w-7 h-7 text-[#111e17] transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      
                      <h3
                        className="mb-4 text-[#111e17] uppercase font-black group-hover:text-white transition-colors duration-500"
                        style={{ fontFamily: HEADING, fontSize: '26px', lineHeight: 1.1, letterSpacing: '0.02em' }}
                      >{t}</h3>
                      
                      <p className="text-[14px] leading-[1.8] text-[#111e17]/60 group-hover:text-white/80 transition-colors duration-500">{d}</p>
                      
                      <div className="mt-auto pt-10 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-[#35503f] group-hover:text-[#FFC700] transition-colors duration-500">
                        <span className="group-hover:translate-x-1 transition-transform">Explore Full Service</span> <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>


        </div>
      </section>


      {/* ══════════════════════════════════════
          STEPS TO START YOUR BUSINESS — Awwwards Interactive Accordion
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: C.brandDeep }}>
        {/* Massive watermark */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none select-none opacity-[0.015] whitespace-nowrap">
          <span className="text-[28vw] font-black text-white" style={{ fontFamily: HEADING, letterSpacing: '-0.06em' }}>
            PROCESS
          </span>
        </div>

        {/* Section Header */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-28 lg:pt-40 pb-16 relative z-10">
          <FadeUp>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div>
                <Label light>The Journey</Label>
                <h2
                  className="mt-1"
                  style={{
                    fontFamily: HEADING,
                    fontWeight: 900,
                    fontSize: 'clamp(40px, 6vw, 80px)',
                    lineHeight: 0.88,
                    letterSpacing: '-0.04em',
                    textTransform: 'uppercase',
                    color: C.white,
                  }}
                >
                  YOUR PATH TO<br />
                  <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)' }}>BUSINESS</span>{' '}
                  <span className="text-[#FFC700]">SUCCESS</span>
                </h2>
              </div>
              <p className="max-w-[380px] text-[14px] leading-[1.7] mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                From first consultation to fully operational — we handle the complexity so you can focus on what matters.
              </p>
            </div>
          </FadeUp>
        </div>

        {/* Steps Accordion */}
        <div className="relative z-10 border-t border-white/[0.04]">
          {[
            { step: '01', title: 'Choose Your Jurisdiction', desc: 'Free Zone, Mainland, or Offshore — we help you pick the best structure based on your activity, budget, and visa needs.', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format' },
            { step: '02', title: 'Select Your License', desc: 'Commercial, Professional, Industrial, or E-commerce. We guide you through the right license type for your business model.', img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format' },
            { step: '03', title: 'Register Your Company', desc: 'We handle all paperwork — trade name reservation, MOA drafting, and legal documentation submitted on your behalf.', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format' },
            { step: '04', title: 'Get Your Visa & Emirates ID', desc: 'Investor, partner, or employee visas processed end-to-end. Medical, biometrics, and Emirates ID — all coordinated.', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format' },
            { step: '05', title: 'Open a Bank Account', desc: 'We connect you with top UAE banks and prepare your application for the fastest possible approval.', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format' },
            { step: '06', title: 'Start Operating', desc: "Your license is active, your visa is stamped, and your bank account is open. You're officially in business.", img: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?q=80&w=2070&auto=format' },
          ].map(({ step, title, desc, img }, i) => (
            <FadeUp key={step} delay={i * 0.05}>
              <motion.div 
                layout
                className="group relative border-b border-white/[0.04] cursor-pointer overflow-hidden"
                onClick={() => setActiveStep(activeStep === i ? null : i)}
              >
                {/* Background image on hover (Hardware Accelerated) */}
                <motion.div 
                  initial={false}
                  animate={{ 
                    opacity: activeStep === i ? 0.5 : 0,
                    scale: activeStep === i ? 1.05 : 1.15 
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 bg-cover bg-center z-0 pointer-events-none"
                  style={{ backgroundImage: `url(${img})` }}
                />
                <motion.div 
                   initial={false}
                   animate={{ opacity: activeStep === i ? 1 : 0 }}
                   transition={{ duration: 0.6 }}
                   className="absolute inset-0 bg-gradient-to-r from-[#111e17] via-[#111e17]/80 to-transparent z-[1] pointer-events-none" 
                />

                {/* Row content */}
                <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
                   <div className="flex items-center gap-6 lg:gap-12 py-8 lg:py-12">
                    {/* Step Number (Simplified for better performance) */}
                    <motion.span 
                      animate={{ 
                        color: activeStep === i ? '#FFC700' : 'rgba(255,255,255,0.1)',
                        x: activeStep === i ? 5 : 0
                      }}
                      className="text-[60px] lg:text-[100px] xl:text-[140px] font-black leading-none shrink-0 w-[80px] lg:w-[180px]"
                      style={{ 
                        fontFamily: HEADING,
                        letterSpacing: '-0.04em',
                      }}
                    >
                      {step}
                    </motion.span>

                    {/* Title */}
                    <motion.h3 
                      animate={{ 
                        color: activeStep === i ? '#ffffff' : 'rgba(255,255,255,0.25)',
                        x: activeStep === i ? 10 : 0
                      }}
                      className="flex-1 font-black text-[22px] lg:text-[36px] xl:text-[44px] uppercase tracking-tight"
                      style={{ fontFamily: HEADING, letterSpacing: '-0.02em' }}
                    >
                      {title}
                    </motion.h3>

                    {/* Expand indicator */}
                    <div className={`w-12 h-12 lg:w-20 lg:h-20 rounded-full border flex items-center justify-center shrink-0 transition-all duration-500 ${activeStep === i ? 'border-[#FFC700] bg-[#FFC700] scale-110' : 'border-white/10 group-hover:border-white/30'}`}>
                      <span className={`text-[24px] lg:text-[32px] font-light transition-colors duration-500 ${activeStep === i ? 'text-[#111e17]' : 'text-white/20'}`}>
                        {activeStep === i ? '−' : '+'}
                      </span>
                    </div>
                  </div>

                  {/* Expandable content */}
                  <AnimatePresence initial={false}>
                    {activeStep === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-12 lg:pb-20 pl-[86px] lg:pl-[192px] max-w-[800px]">
                          <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-[16px] lg:text-[19px] leading-[1.8] mb-10 text-white/50"
                          >
                            {desc}
                          </motion.p>
                          <div className="flex items-center gap-4 text-[13px] font-black uppercase tracking-[0.3em] text-[#FFC700] group/link cursor-pointer">
                            <span className="group-hover/link:mr-2 transition-all">Start Registration</span>
                            <ArrowRight className="w-5 h-5 group-hover/link:translate-x-3 transition-transform" />
                          </div>
                        </div>

                        {/* Animated gold progress line */}
                        <motion.div 
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 1, ease: "circOut" }}
                          className="h-[3px] bg-[#FFC700] origin-left"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 lg:py-28 relative z-10">
          <FadeUp className="flex flex-col sm:flex-row items-center gap-8">
            <Magnetic strength={20}>
              <GoldBtn large onClick={() => navigate('/services/virtual-office')}>
                Get Started Today <ArrowRight className="w-5 h-5" />
              </GoldBtn>
            </Magnetic>
            <div className="flex items-center gap-4">
              <div className="w-10 h-[1px] bg-white/10" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: C.textMuted }}>
                Average setup: 24–72 hours
              </span>
            </div>
          </FadeUp>
        </div>
      </section>


      {/* ══════════════════════════════════════
          CHOOSE YOUR JURISDICTION
      ══════════════════════════════════════ */}
      <section className="relative py-28 lg:py-40 overflow-hidden bg-[#f8f9fa]">
        {/* Section Header */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-16 lg:mb-20">
          <FadeUp>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div>
                <Label>Jurisdictions</Label>
                <h2
                  className="mt-1"
                  style={{
                    fontFamily: HEADING,
                    fontWeight: 900,
                    fontSize: 'clamp(40px, 6vw, 76px)',
                    lineHeight: 0.92,
                    letterSpacing: '-0.03em',
                    textTransform: 'uppercase',
                    color: C.brand,
                  }}
                >
                  CHOOSE YOUR<br />
                  <span className="text-[#111e17]/25 italic">JURISDICTION</span>
                </h2>
              </div>
              <p className="max-w-[380px] text-[15px] leading-[1.65] mb-2" style={{ color: C.grayText }}>
                Each jurisdiction offers unique advantages. We help you select the ideal setup based on your business activity, ownership needs, and growth plans.
              </p>
            </div>
          </FadeUp>
        </div>

        {/* Jurisdiction Cards */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
            {[
              {
                title: 'Free Zone',
                subtitle: '100% Foreign Ownership',
                desc: 'Tax-free business setup with full repatriation of profits. Ideal for international trade, tech, consulting, and e-commerce ventures.',
                features: ['0% Corporate Tax', '100% Ownership', 'No Currency Restrictions', 'Fast Processing'],
                img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format',
                color: '#FFC700',
              },
              {
                title: 'Mainland',
                subtitle: 'Direct UAE Market Access',
                desc: 'Trade directly with UAE consumers and government entities. Full flexibility to operate anywhere in the Emirates without restrictions.',
                features: ['Unlimited Visas', 'Government Contracts', 'No Trade Barriers', 'Any Location'],
                img: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?q=80&w=2070&auto=format',
                color: '#ffffff',
              },
              {
                title: 'Offshore',
                subtitle: 'International Asset Protection',
                desc: 'Perfect for holding companies, international asset management, and intellectual property protection with maximum privacy.',
                features: ['Full Privacy', 'Asset Protection', 'No Physical Office', 'Multi-Currency'],
                img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format',
                color: '#FFC700',
              },
            ].map(({ title, subtitle, desc, features, img, color }, i) => (
              <FadeUp key={title} delay={i * 0.12} className="h-full">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative overflow-hidden rounded-lg cursor-pointer h-full"
                  style={{ minHeight: 560 }}
                >
                  {/* Background Image with Parallax */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-[0.16,1,0.3,1] group-hover:scale-110"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                  
                  {/* Multi-layer overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a110d] via-[#0a110d]/60 to-transparent" />
                  <div className="absolute inset-0 bg-[#0a110d]/20 group-hover:bg-[#0a110d]/40 transition-colors duration-700" />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-10" style={{ minHeight: 560 }}>
                    {/* Gold accent line */}
                    <div className="w-10 h-[2px] mb-6 transition-all duration-500 group-hover:w-16" style={{ background: color }} />
                    
                    {/* Subtitle */}
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-3 transition-colors duration-500" style={{ color }}>
                      {subtitle}
                    </span>

                    {/* Title */}
                    <h3
                      className="text-white font-black text-[36px] lg:text-[44px] uppercase leading-none tracking-tight mb-4"
                      style={{ fontFamily: HEADING }}
                    >
                      {title}
                    </h3>

                    {/* Description - slides up on hover */}
                    <div className="overflow-hidden">
                      <div className="transform lg:translate-y-4 lg:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[0.16,1,0.3,1]">
                        <p className="text-[14px] leading-[1.7] text-white/50 mb-6 max-w-[320px]">
                          {desc}
                        </p>

                        {/* Feature tags */}
                        <div className="flex flex-wrap gap-2 mb-8">
                          {features.map(f => (
                            <span key={f} className="text-[10px] font-black uppercase tracking-widest text-white/70 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white/60 group-hover:text-[#FFC700] transition-colors duration-500">
                        Explore Options
                      </span>
                      <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#FFC700] group-hover:translate-x-2 transition-all duration-500" />
                    </div>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          MID CTA
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden py-32 lg:py-48" style={{ background: C.brandDeep }}>
        {/* Massive Background Text Backdrop (Awwwards Technique) */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none opacity-[0.02] select-none">
          <span className="text-[35vw] font-black leading-none text-white whitespace-nowrap" style={{ fontFamily: HEADING }}>
            READY TO LAUNCH
          </span>
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-10 flex flex-col items-center text-center">
          <FadeUp>
            <div className="flex justify-center mb-10"><Label light>Immediate Deployment</Label></div>
            <h2
              className="mb-12"
              style={{
                fontFamily: HEADING,
                fontWeight: 900,
                fontSize: 'clamp(48px, 9vw, 100px)',
                lineHeight: 0.88,
                letterSpacing: '-0.05em',
                textTransform: 'uppercase',
                color: C.white,
              }}
            >
              START YOUR JOURNEY<br />
              <span className="text-[#FFC700]">IN 24 HOURS</span>
            </h2>
            <p className="mt-5 text-[18px] leading-[1.6] max-w-[600px] mx-auto mb-16" style={{ color: 'rgba(255,255,255,0.5)' }}>
              From digital company registration to luxury managed offices — experience the fastest turnaround in the UAE market.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <Magnetic strength={20}>
                <GoldBtn large onClick={() => navigate('/login')} className="h-[70px] px-12 text-[15px]">
                  Book Free Consultation <ArrowRight className="w-5 h-5 ml-2" />
                </GoldBtn>
              </Magnetic>
              <OutlineBtn dark onClick={() => navigate('/contact')} className="h-[70px] px-12 border-white/10 hover:bg-white/5 transition-all">
                Learn More
              </OutlineBtn>
            </div>
          </FadeUp>
        </div>
      </section>


      {/* ══════════════════════════════════════
          PRICING
      ══════════════════════════════════════ */}
  <section id="pricing" className="py-28 lg:py-40 bg-white relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#111e17]/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
            <FadeLeft>
              <Label>Transparent Pricing</Label>
              <h2
                className="mt-1"
                style={{
                  fontFamily: HEADING,
                  fontWeight: 900,
                  fontSize: 'clamp(44px, 6vw, 76px)',
                  lineHeight: 0.92,
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase',
                  color: C.brand,
                }}
              >
                CHOOSE YOUR PLAN
              </h2>
            </FadeLeft>
            <FadeRight delay={0.1}>
              <p className="max-w-[320px] text-[15px] leading-[1.65]" style={{ color: C.grayText }}>
                Straightforward, honest pricing to scale your operations rapidly in Dubai without any hidden costs.
              </p>
            </FadeRight>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-14 max-w-[1100px] mx-auto">
            {[
              { name: 'Starter',    price: '5,750', suffix: 'AED/yr', desc: 'For freelancers and solo entrepreneurs.', features: ['1 Visa', 'Virtual Office', 'Trade License', 'PRO Services', 'Mail Handling'] },
              { name: 'Growth',     price: '12,500', suffix: 'AED/yr', desc: 'For growing teams and funded startups.',   features: ['3 Visas', 'Flexi Desk Access', 'Trade License', 'Full PRO', 'Banking Support', 'Meeting Credits'], popular: true },
              { name: 'Enterprise', price: 'Custom', suffix: '',      desc: 'For large businesses and enterprise.',     features: ['Unlimited Visas', 'Private Office', 'Premium License', 'Dedicated PRO', 'Golden Visa', 'Priority Line'] },
            ].map((p, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <motion.div
                  onClick={() => setActivePlan(i)}
                  whileHover={{ y: -12, scale: 1.02 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative p-10 cursor-pointer h-full flex flex-col rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-black/[0.03]"
                  style={{
                    background: p.popular ? C.brand : '#fafafa',
                  }}
                >
                  {/* Neon Glow logic if popular */}
                  {p.popular && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1b3124] to-[#111e17] pointer-events-none" />
                  )}
                  {p.popular && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFC700]/10 blur-2xl pointer-events-none" />
                  )}

                  {p.popular && (
                     <span
                       className="absolute top-6 right-6 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full z-10 shadow-lg shadow-[#FFC700]/20"
                       style={{ background: C.gold, color: C.brandDeep, fontFamily: BODY }}
                     >Most Popular</span>
                  )}

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="text-[12px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: p.popular ? 'rgba(255,255,255,0.4)' : C.brand, fontFamily: BODY }}>
                      {p.name}
                    </div>
                    
                    <div className="flex flex-wrap items-baseline gap-2 mb-2">
                      <span style={{ fontFamily: HEADING, fontWeight: 900, fontSize: 'clamp(44px, 5vw, 64px)', lineHeight: 0.95, letterSpacing: '-0.03em', color: p.popular ? C.white : C.brand }}>
                        {p.price}
                      </span>
                      {p.suffix && <span className="pb-1 text-[13px] font-black uppercase tracking-widest" style={{ color: p.popular ? C.gold : C.grayText }}>{p.suffix}</span>}
                    </div>
                    
                    <p className="text-[14px] leading-relaxed mb-8 mt-2" style={{ color: p.popular ? 'rgba(255,255,255,0.6)' : C.grayText }}>{p.desc}</p>
                    
                    <div className="w-full h-px mb-8" style={{ background: p.popular ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }} />

                    <ul className="space-y-4 mb-12 flex-1">
                      {p.features.map((f, fi) => (
                        <li key={fi} className="flex items-center gap-3 text-[14px] font-medium tracking-wide"
                          style={{ color: p.popular ? 'rgba(255,255,255,0.9)' : C.brandDeep }}>
                          <CheckCircle2 className="w-[18px] h-[18px] flex-shrink-0" style={{ color: p.popular ? C.gold : C.brand }} />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {p.popular
                      ? <GoldBtn onClick={() => navigate('/login')} className="w-full justify-center py-4 text-[13px]">Get Started <ArrowRight className="w-4 h-4 ml-2" /></GoldBtn>
                      : <OutlineBtn dark={false} onClick={() => navigate('/login')} className="w-full justify-center py-4 text-[13px] border-black/10 hover:border-black/30 hover:bg-black/5 text-[#111e17]">Get Started <ArrowRight className="w-4 h-4 ml-2" /></OutlineBtn>
                    }
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          PROCESS SECTION (Editorial)
      ══════════════════════════════════════ */}
      <section className="py-32 lg:py-48 bg-[#fdfdfd] relative z-0">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-start mb-24">
            <div className="w-full lg:w-1/2">
              <Label>A Proven Methodology</Label>
              <h2
                className="mt-4"
                style={{
                  fontFamily: HEADING,
                  fontWeight: 900,
                  fontSize: 'clamp(48px, 8vw, 100px)',
                  lineHeight: 0.82,
                  letterSpacing: '-0.05em',
                  textTransform: 'uppercase',
                  color: C.brandDeep,
                }}
              >
                YOUR PATH TO <span className="text-[#FFC700]">DUBAI</span> EXCELLENCE
              </h2>
            </div>
            <div className="w-full lg:w-1/2 pt-6">
              <p className="text-[18px] leading-relaxed max-w-[480px] text-black/40" style={{ fontWeight: 500 }}>
                Our streamlined ecosystem is designed to minimize friction and maximize momentum. From zero to operational in record time.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-y border-black/[0.05]">
            {[
              { n: '01', t: 'STRATEGY',    d: 'Tailored consultation to match your enterprise vision.' },
              { n: '02', t: 'EXECUTION',    d: 'Secure digital submission via our premium ecosystem.' },
              { n: '03', t: 'APPROVAL',   d: 'Real-time monitoring of your trade license processing.' },
              { n: '04', t: 'ACTIVATION',d: 'Instant access to your workspace and golden visa support.' },
            ].map((s, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="relative group p-10 lg:p-14 border-r border-black/[0.05] last:border-r-0 hover:bg-[#111e17] transition-all duration-700 h-full">
                  <span className="text-[12px] font-black tracking-[0.3em] text-[#FFC700] mb-20 block">{s.n}</span>
                  <div className="relative z-10 transition-transform duration-500 group-hover:translate-x-3">
                    <h3 
                      className="mb-4 text-[#111e17] group-hover:text-white transition-colors duration-500" 
                      style={{ fontFamily: HEADING, fontWeight: 900, fontSize: '28px', letterSpacing: '0.01em', textTransform: 'uppercase' }}
                    >{s.t}</h3>
                    <p className="text-[15px] leading-relaxed text-[#111e17]/50 group-hover:text-white/50 transition-colors duration-500">{s.d}</p>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-black/[0.02] text-[180px] font-black select-none group-hover:opacity-0 transition-opacity duration-500" style={{ fontFamily: HEADING }}>
                    {s.n}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS (Luxury Contrast)
      ══════════════════════════════════════ */}
      <section className="py-32 lg:py-52 bg-[#111e17] relative overflow-hidden">
        {/* Abstract Light Background */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[#35503f]/20 blur-[160px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="flex flex-col items-center text-center mb-28">
            <Label light>Social Proof</Label>
            <h2
              className="mt-4"
              style={{
                fontFamily: HEADING,
                fontWeight: 900,
                fontSize: 'clamp(48px, 7vw, 90px)',
                lineHeight: 0.85,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                color: C.white,
              }}
            >
              VOICES OF <span className="text-[#35503f] italic">LEGACY</span>
            </h2>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { q: '"Setting up our DMCC headquarters was seamless. FlashSpace handled the complexity with absolute precision."', n: 'SARAH JOHNSON', r: 'CEO, TECHVAULT' },
              { q: '"The level of service and workspace aesthetics is unparalleled in the region. A total game changer."', n: 'AHMED AL-RASHID', r: 'FOUNDER, NOOR VENTURES' },
              { q: '"From Golden Visa support to corporate banking, their PRO team is truly world-class. Efficient and reliable."', n: 'MICHAEL CHEN', r: 'COO, SCALEASIA' },
            ].map((t, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="group relative p-12 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl flex flex-col h-full hover:border-[#FFC700]/30 transition-all duration-700">
                  <div className="flex gap-1 mb-10">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-current text-[#FFC700] opacity-30 group-hover:opacity-100 transition-opacity duration-500" style={{ transitionDelay: `${s*50}ms` }} />)}
                  </div>
                  <p className="text-[19px] leading-[1.7] flex-1 mb-12 font-medium text-white/80" style={{ letterSpacing: '0.01em' }}>{t.q}</p>
                  <div className="pt-8 border-t border-white/10 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFC700] to-[#eeac00] flex items-center justify-center font-black text-black text-[14px]">
                      {t.n.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-black text-[#FFC700] tracking-wider uppercase">{t.n}</h4>
                      <p className="text-[11px] text-white/40 font-black uppercase tracking-widest mt-1">{t.r}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>




      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section className="py-28 lg:py-44 bg-[#f8f9fa]">
        <div className="max-w-[840px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-20">
            <FadeUp>
              <Label>Frequently Asked Questions</Label>
              <h2
                className="mt-4"
                style={{
                  fontFamily: HEADING,
                  fontWeight: 900,
                  fontSize: 'clamp(44px, 6vw, 76px)',
                  lineHeight: 0.92,
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase',
                  color: C.brand,
                }}
              >
                HAVE QUESTIONS? <br /><span className="text-[#FFC700]">FIND ANSWERS.</span>
              </h2>
            </FadeUp>
          </div>

          <div className="space-y-4">
            {[
              { q: 'How fast can I set up a company in UAE?',     a: 'With FlashSpace you get your trade license in as little as 24 hours. Full process including visa and banking typically 5–7 business days.' },
              { q: 'Do I need to be physically present?',          a: 'No. We offer fully remote company formation. Complete everything from anywhere via our digital platform.' },
              { q: '100% ownership as a foreign national?',        a: 'Yes. Our Free Zone partnerships give you 100% ownership without a local sponsor.' },
              { q: 'What visa types do you support?',              a: 'Employment, Investor, Partner Visas, and the 10-year Golden Visa for qualifying entrepreneurs.' },
              { q: 'Minimum workspace commitment?',                a: 'Virtual offices start at 1 year. Coworking and private offices offer flexible monthly terms.' },
            ].map((faq, i) => (
              <FadeUp key={i} delay={i * 0.04}>
                <motion.div
                  className="bg-white rounded-2xl overflow-hidden border border-black/[0.03] shadow-sm hover:shadow-md transition-shadow duration-500"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left p-8 flex items-center justify-between gap-6"
                  >
                    <span style={{ fontFamily: HEADING, fontWeight: 800, fontSize: '18px', color: C.brand, letterSpacing: '0.01em' }}>{faq.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      className="w-8 h-8 rounded-full bg-[#111e17]/5 flex items-center justify-center transition-colors duration-300"
                      style={{ background: openFaq === i ? C.gold : '' }}
                    >
                      <ChevronDown className={`w-4 h-4 ${openFaq === i ? 'text-[#111e17]' : 'text-[#111e17]/40'}`} />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-8 pb-8">
                           <div className="w-full h-px bg-black/[0.04] mb-6" />
                           <p className="text-[15px] leading-[1.8] max-w-[640px]" style={{ color: C.grayText }}>{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section className="relative overflow-hidden py-40" style={{ background: C.brandDeep }}>
        {/* Animated ambient light */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-64 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${C.gold}, transparent 70%)` }} 
        />
        
        <div className="relative z-10 max-w-[1000px] mx-auto px-6 lg:px-10 text-center">
          <FadeUp>
            <Label light>Your Transformation Starts Here</Label>
            <h2
              className="mt-6 mb-10"
              style={{
                fontFamily: HEADING,
                fontWeight: 900,
                fontSize: 'clamp(56px, 10vw, 130px)',
                lineHeight: 0.85,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                color: C.white,
              }}
            >
              BUILD THE <br />
              <span className="text-[#FFC700] italic">FUTURE</span> <span className="text-white/20">NOW.</span>
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-16">
              <GoldBtn large onClick={() => navigate('/login')} className="px-12 py-6 text-[15px]">
                Start Your Business <ArrowRight className="w-5 h-5 ml-2" />
              </GoldBtn>
              <OutlineBtn dark onClick={() => navigate('/login')} className="px-10 py-6 text-[15px] border-white/10 text-white hover:bg-white/5">
                <Phone className="w-4 h-4 mr-2" /> Book a Strategy Call
              </OutlineBtn>
            </div>
          </FadeUp>
        </div>
      </section>


      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer style={{ background: C.brandDeep, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
            <div>
              <div className="h-8 mb-6 cursor-pointer" onClick={() => navigate('/')}>
                 <img src="/Logo/Flashspace Logo.png" alt="FlashSpace Logo" className="h-full object-contain invert brightness-200" />
              </div>
              <p className="text-[12px] leading-[1.8]" style={{ color: C.textMuted }}>Premium workspace and business setup in the UAE.</p>
            </div>
            {[
              { title: 'Services', links: ['Virtual Office', 'Coworking', 'Business Setup', 'Golden Visa'] },
              { title: 'Company',  links: ['About', 'Careers', 'Blog', 'Contact'] },
              { title: 'Legal',    links: ['Privacy', 'Terms', 'Cookies'] },
            ].map((col, ci) => (
              <div key={ci}>
                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] mb-5" style={{ color: C.textMuted, fontFamily: BODY }}>{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map(l => (
                    <li key={l}>
                      <button className="text-[12px] transition-colors duration-200 hover:text-yellow-300"
                        style={{ color: 'rgba(255,255,255,0.38)', fontFamily: BODY }}>{l}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.18)', fontFamily: BODY }}>
              © {new Date().getFullYear()} FlashSpace UAE. All rights reserved.
            </p>
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.18)', fontFamily: BODY }}>
              Dubai, United Arab Emirates 🇦🇪
            </span>
          </div>
        </div>
      </footer>
    </motion.div>
    </div>
  );
};

