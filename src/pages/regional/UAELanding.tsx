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
  const [openFaq,      setOpenFaq]      = useState<number | null>(null);
  const [activePlan,   setActivePlan]   = useState(1);
  const [hoveredService, setHoveredService] = useState<number | null>(null);

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

  /* ─────────────── RENDER ─────────────── */
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ fontFamily: BODY, background: C.white, color: C.darkText }}
    >
      <MouseGlow color={C.gold} opacity={0.08} size={500} />

      {/* ══════════ NAVIGATION ══════════ */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-0 left-0 w-full z-[60] transition-all duration-500 ${
          navScrolled 
            ? 'h-[74px] bg-[#111e17]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl' 
            : 'h-[100px] bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto h-full px-6 lg:px-10 flex items-center justify-between">
          {/* Logo at Left */}
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/ae')}>
            <div className="flex items-center gap-0.5" style={{ fontFamily: HEADING }}>
              <span className="text-white font-black text-[24px] tracking-[-0.04em]">FLASH</span>
              <Zap className="w-[18px] h-[18px] text-[#FFC700] fill-[#FFC700] -rotate-12 mb-1" />
              <span className="text-[#FFC700] italic font-bold text-[24px] tracking-[-0.02em]">Space</span>
            </div>
            <span className="hidden sm:inline-flex text-[10px] items-center font-black tracking-[0.2em] px-2.5 py-1 rounded-full bg-[#FFC700]/10 border border-[#FFC700]/20 text-[#FFC700]">
              UAE
            </span>
          </div>

          <div className="flex items-center gap-12">
            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-10">
              {['Solutions', 'Workspaces', 'Pricing', 'Contact'].map(l => (
                <button
                  key={l}
                  onClick={() => l === 'Pricing' && document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="relative text-[13px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-[#FFC700] transition-all duration-300 group"
                  style={{ fontFamily: BODY }}
                >
                  {l}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#FFC700] transition-all duration-500 group-hover:w-full" />
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-6">
            <div className="hidden md:block transition-all hover:scale-105"><RegionSwitcher forcedDark={true} /></div>
              <Magnetic strength={15}>
                <button 
                  onClick={() => navigate('/login')} 
                  className="h-[46px] px-8 rounded-full bg-[#FFC700] text-[#111e17] font-black text-[12px] uppercase tracking-[0.15em] hover:bg-white transition-all duration-300"
                  style={{ fontFamily: BODY }}
                >
                  Get Started
                </button>
              </Magnetic>
              <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
                <Menu className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex flex-col"
            style={{ background: C.brandDeep }}
          >
            <div className="flex items-center justify-between px-6 h-[70px]">
              <div className="flex items-center gap-0.5" style={{ fontFamily: HEADING }}>
                <span className="text-white font-black text-[20px] tracking-[-0.04em]">FLASH</span>
                <Zap className="w-[15px] h-[15px] text-[#FFC700] fill-[#FFC700] -rotate-12 mb-0.5" />
                <span className="text-[#FFC700] italic font-bold text-[20px] tracking-[-0.02em]">Space</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-white/50 p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 gap-7">
              {['Solutions', 'Workspaces', 'Pricing', 'Contact'].map((l, i) => (
                <motion.button
                  key={l}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => { setMobileOpen(false); if (l === 'Pricing') document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="font-black uppercase text-[28px]"
                  style={{ fontFamily: HEADING, letterSpacing: '0.05em', color: C.white }}
                >{l}</motion.button>
              ))}
              <GoldBtn onClick={() => { setMobileOpen(false); navigate('/login'); }} className="mt-6">
                Get Started <ArrowRight className="w-4 h-4" />
              </GoldBtn>
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
          className="relative z-10 w-full lg:max-w-none pl-6 pr-6 lg:pl-10 lg:pl-[max(2.5rem,calc((100vw-1200px)/2-40px))] py-16"
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
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
                    delay: 0.4 + (i * 0.15), 
                    duration: 1, 
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
            transition={{ delay: 0.65, duration: 0.6 }}
            className="max-w-[480px] text-[16px] leading-[1.65] mb-10"
            style={{ color: C.textDim, fontFamily: BODY }}
          >
            Premium workspace solutions and seamless company formation.
            From Free Zone setups to luxury managed offices —
            launch your business in Dubai today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
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
            transition={{ delay: 1.05 }}
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
          <FadeLeft className="mb-20 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <Label>Why FlashSpace UAE</Label>
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
                EVERYTHING YOU NEED<br />TO SCALE <span className="text-[#111e17]/30 italic">GLOBALLY</span>
              </h2>
            </div>
            <p className="max-w-[340px] text-[15px] leading-[1.65] mb-2" style={{ color: C.grayText }}>
              Gain a competitive edge with our premium suite of corporate services, crafted exclusively for the modern enterprise.
            </p>
          </FadeLeft>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { Icon: Building2,  t: 'Free Zone Formation', d: '100% foreign ownership. Strategic locations — DIFC, DMCC, DAFZA, and more. Ready in 24 hours.' },
              { Icon: ShieldCheck, t: 'Mainland License',    d: 'Direct access to the UAE market with full regulatory compliance and dedicated PRO support.' },
              { Icon: Gem,        t: 'Golden Visa',         d: 'Exclusive concierge services for 10-year residency and investor visa applications.' },
              { Icon: Globe2,     t: 'Virtual Office',      d: 'Premium addresses in prime Dubai locations with mail handling, phone answering, and reception.' },
              { Icon: Users,      t: 'Coworking Spaces',    d: 'Fully equipped desks and offices with high-speed internet and 24/7 access.' },
              { Icon: Zap,        t: '24-Hour Setup',       d: 'Trade license in as fast as 24 hours. DED, immigration, and bank account — we handle it all.' },
            ].map(({ Icon, t, d }, i) => {
              const isActive = hoveredService === i;
              const isOtherHovered = hoveredService !== null && hoveredService !== i;
              
              return (
              <FadeUp key={i} delay={i * 0.08} className="h-full">
                <motion.div
                  onMouseEnter={() => setHoveredService(i)}
                  onMouseLeave={() => setHoveredService(null)}
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative overflow-hidden p-10 bg-white cursor-pointer h-full border border-black/5 rounded-md shadow-sm"
                  style={{ minHeight: 320 }}
                >
                  {/* Dynamic Background Image that appears when ANOTHER card is hovered */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-all duration-[700ms] ease-[0.16,1,0.3,1] z-0" 
                    style={{ 
                      backgroundImage: `url(${validDubaiUrls[i % validDubaiUrls.length]})`,
                      opacity: isOtherHovered ? 1 : 0,
                      transform: isOtherHovered ? 'scale(1)' : 'scale(1.1)',
                      filter: isOtherHovered ? 'grayscale(40%) blur(0px)' : 'grayscale(100%) blur(4px)'
                    }} 
                  />
                  {/* Heavy dark overlay over the image to keep text readable */}
                  <div 
                     className="absolute inset-0 bg-[#0a110d]/80 transition-opacity duration-[700ms] ease-[0.16,1,0.3,1]" 
                     style={{ opacity: isOtherHovered ? 1 : 0 }} 
                  />

                  {/* Deep Hover Gradient (REMOVED: User requested active card stays white) */}
                  <div 
                    className="absolute inset-0 bg-[#111e17] transition-opacity duration-500 ease-in-out pointer-events-none"
                    style={{ opacity: 0 }}
                  />
                  
                  {/* Oversized Watermark Icon */}
                  <Icon className={`absolute -right-8 -bottom-8 w-64 h-64 pointer-events-none stroke-1 transition-all duration-[800ms] ease-out ${isActive ? 'opacity-[0.04] -rotate-12 text-[#111e17]' : 'opacity-[0.02] text-[#111e17]'}`} />

                  <div className="relative z-10 flex flex-col h-full pointer-events-none">
                    {/* Icon Circle */}
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-10 transition-all duration-500 ease-out ${isActive ? 'bg-[#FFC700]' : (isOtherHovered ? 'bg-[#FFC700]/10 backdrop-blur-md' : 'bg-[#111e17]/5')}`}>
                       <Icon className={`w-6 h-6 transition-transform duration-500 ${isActive ? 'text-[#111e17] scale-110' : (isOtherHovered ? 'text-[#FFC700]' : 'text-[#111e17]')}`} />
                    </div>
                    
                    <h3
                      className={`mb-4 transition-colors duration-500 ease-out ${isOtherHovered ? 'text-white' : 'text-[#111e17]'}`}
                      style={{ fontFamily: HEADING, fontWeight: 900, fontSize: '26px', lineHeight: 1.05, letterSpacing: '0.02em', textTransform: 'uppercase' }}
                    >{t}</h3>
                    
                    <p className={`text-[14px] leading-[1.7] transition-colors duration-500 ease-out ${isOtherHovered ? 'text-white/60' : 'text-[#111e17]/60'}`}>{d}</p>
                    
                    {/* Interactive 'Learn More' Button */}
                    <div className={`mt-auto pt-10 flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.2em] transform transition-all duration-500 ease-out ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{ color: C.brand }}>
                      Explore <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              </FadeUp>
            )})}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          DUBAI SKYLINE PARALLAX SECTION
      ══════════════════════════════════════ */}
      <SkylineSection navigate={navigate} />


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
              <div className="flex items-center gap-0.5 mb-5" style={{ fontFamily: HEADING }}>
                <span className="text-white font-black text-[18px] tracking-[-0.04em]">FLASH</span>
                <Zap className="w-[14px] h-[14px] text-[#FFC700] fill-[#FFC700] -rotate-12 mb-0.5" />
                <span className="text-[#FFC700] italic font-bold text-[18px] tracking-[-0.02em]">Space</span>
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
    </div>
  );
};


/* ═══════════════════════════════════════════
   SKYLINE PARALLAX SECTION  (split-screen)
═══════════════════════════════════════════ */
const SkylineSection: React.FC<{ navigate: ReturnType<typeof useNavigate> }> = ({ navigate }) => {
  const ref  = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY    = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);
  const textX   = useTransform(scrollYProgress, [0, 1], ['10%', '-30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.4, 1, 1, 0.4]);

  const contentRef = useRef(null);
  const isInView = useInView(contentRef, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative h-[85vh] min-h-[600px] overflow-hidden flex items-center bg-[#0a110d]">
      
      {/* 1. Large Background Scrolling Text (Awwwards Style) */}
      <motion.div 
        style={{ x: textX }} 
        className="absolute top-1/2 -translate-y-1/2 left-0 whitespace-nowrap pointer-events-none z-0 select-none"
      >
        <span 
          className="text-[25vw] font-black leading-none opacity-[0.03] text-white"
          style={{ fontFamily: HEADING, letterSpacing: '-0.05em' }}
        >
          DUBAI EXCELLENCE DXB
        </span>
      </motion.div>

      {/* 2. Parallax Image Background */}
      <motion.div className="absolute inset-0 z-[1] w-full h-[130%]" style={{ y: imgY, opacity }}>
        <div
          className="w-full h-full bg-cover bg-center grayscale-[30%] brightness-[0.6]"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?q=80&w=2070&auto=format)' }}
        />
        {/* Dynamic Shadow Mask */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a110d] via-[#0a110d]/40 to-transparent" />
      </motion.div>

      {/* 3. Main Content Container */}
      <div className="relative z-10 max-w-[1240px] mx-auto px-6 lg:px-10 w-full" ref={contentRef}>
        <div className="max-w-[700px]">
          {/* Label with Line */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-12 h-[1px] bg-[#FFC700]" />
            <span className="text-[12px] font-black uppercase tracking-[0.3em] text-[#FFC700]">★ Prime Corporate Locations</span>
          </motion.div>

          {/* Heading with Mask Reveal */}
          <div className="overflow-hidden mb-8">
            <motion.h2
              initial={{ y: "100%" }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{
                fontFamily: HEADING,
                fontWeight: 900,
                fontSize: 'clamp(48px, 8vw, 110px)',
                lineHeight: 0.88,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                color: C.white,
              }}
            >
              YOUR OFFICE IN <br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>THE HEART</span> OF <span className="text-[#FFC700]">DUBAI</span>
            </motion.h2>
          </div>

          {/* Description and Locations Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-[16px] md:text-[18px] leading-relaxed mb-12 max-w-[500px]" style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
              DIFC · Business Bay · Dubai Marina · Downtown · JLT · DMCC · Abu Dhabi
            </p>

            {/* Interactive Button */}
            <GoldBtn large onClick={() => navigate('/services/virtual-office')} className="group">
              Explore Available Spaces 
              <motion.div 
                className="inline-block ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              >
                <ArrowUpRight className="w-5 h-5" />
              </motion.div>
            </GoldBtn>
          </motion.div>
        </div>
      </div>

      {/* Bottom Border Accent */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5" />
    </section>
  );
};
