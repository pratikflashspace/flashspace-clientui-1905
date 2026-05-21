import { useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion, useInView, useMotionValue, useSpring, type Variants } from "framer-motion";
import {
  MapPin,
  Users,
  Clock,
  FileText,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Lightbulb,
  Heart,
  Phone,
  ArrowRight,
} from "lucide-react";

const Counter = ({
  value,
  suffix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2200 });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) ref.current.textContent = latest.toFixed(decimals) + suffix;
    });
  }, [springValue, suffix, decimals]);

  return <span ref={ref} />;
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function AboutUs() {
  useEffect(() => {
    document.title = "About — FlashSpace";
  }, []);

  const whyCards = [
    {
      title: "Virtual Office",
      desc: "Professional business address with mail handling and call forwarding services to establish your presence.",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
      icon: MapPin,
    },
    {
      title: "Coworking Space",
      desc: "Flexible workspaces with high-speed internet, meeting rooms, and a vibrant community of professionals.",
      img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800",
      icon: Users,
    },
    {
      title: "On Demand Services",
      desc: "Book meeting rooms, conference halls, and private cabins as per your business needs.",
      img: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800",
      icon: Clock,
    },
    {
      title: "Business Setup",
      desc: "Complete assistance with company registration, GST, and all legal documentation for your business.",
      img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
      icon: FileText,
    },
  ];

  const timeline = [
    {
      year: "2019",
      title: "The Beginning",
      details:
        "Opened the first FlashSpace center in a small garage, validating the hybrid-first model.",
      img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    },
    {
      year: "2021",
      title: "Regional Expansion",
      details:
        "Expanded to 5 major cities with improved operations and tech integrations.",
      img: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&q=80&w=800",
    },
    {
      year: "2023",
      title: "Enterprise Solutions",
      details:
        "Launched tailored enterprise suites and managed-office programs for large teams.",
      img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800",
    },
    {
      year: "2025",
      title: "Nationwide Network",
      details:
        "Scaled presence across 20+ states, becoming India's favorite workspace network.",
      img: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const inspirationImages = [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200",
  ];

  const values = [
    {
      title: "Simplicity",
      desc: "We believe in creating simple and seamless experiences.",
      icon: Sparkles,
    },
    { title: "Integrity", desc: "We are completely transparent and upfront.", icon: ShieldCheck },
    { title: "Progressive", desc: "We are smart and forward looking.", icon: TrendingUp },
    {
      title: "Innovative",
      desc: "We are always curious to explore uncharted territories.",
      icon: Lightbulb,
    },
    {
      title: "Collaborative",
      desc: "We believe in the power of a team over an individual.",
      icon: Users,
    },
    { title: "User Centric", desc: "We are always around to help.", icon: Heart },
  ];

  const team = [
    {
      name: "Pranav Bhatia",
      role: "CEO at FlashSpace",
      img: "https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/6644a86a1f2d7d473188297a_Untitled%20design%20(6).png",
    },
    {
      name: "Pratik Dey",
      role: "Business Head",
      img: "https://images.unsplash.com/photo-1545996124-45af2cf0b0b9?auto=format&fit=crop&q=80&w=400",
    },
    {
      name: "Aditya Rao",
      role: "Head of Product",
      img: "https://images.unsplash.com/photo-1544005315-7fdf6a9402c9?auto=format&fit=crop&q=80&w=400",
    },
  ];

  const stats = [
    { value: 250, suffix: "+", label: "Locations" },
    { value: 35, suffix: "k+", label: "Happy Members" },
    { value: 20, suffix: "+", label: "States & UTs" },
    { value: 99.9, suffix: "%", label: "Uptime SLA", decimals: 1 },
  ];

  const primaryButtonClass =
    "inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full px-5 sm:px-7 text-sm font-semibold";
  const outlineButtonClass =
    "inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full px-5 sm:px-7 text-sm font-semibold";

  return (
    <div className="min-h-screen bg-background text-foreground antialiased" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
      <Header loginBlack forceWhiteBackground />

      <main>
        <section className="relative overflow-hidden border-b border-border bg-background pt-24 md:pt-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-0 top-0 h-[28rem] w-[28rem] rounded-full bg-[#164e4e]/10 blur-[90px]" />
            <div className="absolute bottom-0 left-0 h-[20rem] w-[20rem] rounded-full bg-slate-400/10 blur-[70px]" />
          </div>

          <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 pb-20 md:px-10 lg:grid-cols-2 lg:items-center">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="space-y-7">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#164e4e] dark:text-[#FEF8C5]">
                <span className="h-2 w-2 rounded-full bg-current" />
                Welcome to FlashSpace
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-5xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100 md:text-6xl lg:text-7xl">
                Redefining <br />
                <span className="text-[#164e4e] dark:text-[#FEF8C5]">Workspace</span> Experiences
              </motion.h1>

              <motion.p variants={fadeUp} className="max-w-xl text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                We're not just renting desks; we're building ecosystems. FlashSpace empowers businesses to thrive with flexible, tech-enabled offices designed for the modern workforce.
              </motion.p>

              <motion.div variants={fadeUp} className="flex w-full flex-wrap gap-4 pt-2">
                <Button className={`${primaryButtonClass} w-full sm:w-auto bg-[#2D3F33] text-[#FEF8C5] hover:bg-[#344C3D]`}>
                  Start Your Journey
                </Button>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("location-section")?.scrollIntoView({ behavior: "smooth" })}
                  className={`${outlineButtonClass} w-full sm:w-auto border-[#2D3F33] text-[#2D3F33] hover:bg-[#2D3F33] hover:text-[#FEF8C5] dark:border-[#FEF8C5] dark:text-[#FEF8C5] dark:hover:bg-[#FEF8C5] dark:hover:text-[#1f2e26]`}
                >
                  Explore Locations
                </Button>
              </motion.div>

              <motion.div variants={fadeUp} className="grid grid-cols-2 gap-5 border-t border-border pt-8 sm:grid-cols-4">
                {stats.map((s, i) => (
                  <div key={i} className="group">
                    <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                      <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
                    </div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      {s.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="hidden lg:block"
            >
              <div className="grid grid-cols-1 gap-4">
                <motion.div whileHover={{ y: -3 }} className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                  <img src={whyCards[1].img} alt="Professional office setup" className="h-52 w-full object-cover" />
                  <div className="border-t border-border p-8">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Premium Workspace</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Designed for productivity</p>
                  </div>
                </motion.div>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">Enterprise Grade</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">Operational Excellence</p>
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">Member Experience</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">World Class Service</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-muted/30 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-16 text-center">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 md:text-5xl">
                Why Choose <span className="text-[#164e4e] dark:text-[#FEF8C5]">FlashSpace?</span>
              </h2>
              <div className="mx-auto mt-4 h-1.5 w-24 rounded-full bg-[#164e4e] dark:bg-[#FEF8C5]" />
              <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-700 dark:text-slate-300">
                We deliver more than just space. We provide the ecosystem for your success, designed for the future of work.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {whyCards.map((card, idx) => (
                <motion.article
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="group overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-lg"
                >
                  <div className="relative h-36 overflow-hidden border-b border-border">
                    <img src={card.img} alt={card.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/15" />
                  </div>
                  <div className="space-y-3 p-5">
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">0{idx + 1}</div>
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#164e4e]/10 text-[#164e4e] dark:bg-[#FEF8C5]/10 dark:text-[#FEF8C5]">
                      <card.icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{card.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{card.desc}</p>
                    <p className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#164e4e] dark:text-[#FEF8C5]">
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-16 text-center">
              <h2 className="mb-6 text-4xl font-bold text-slate-900 dark:text-slate-100 md:text-5xl">Our Journey</h2>
              <p className="mx-auto max-w-2xl text-xl text-slate-700 dark:text-slate-300">
                From a single desk to a nationwide revolution. Here is how we grew.
              </p>
            </motion.div>

            <div className="space-y-8">
              {timeline.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`grid items-center gap-8 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8 lg:grid-cols-[220px_1fr] ${
                    i % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
                  }`}
                >
                  <div className="overflow-hidden rounded-2xl border border-border">
                    <img src={t.img} alt={t.title} className="h-40 w-full object-cover" />
                  </div>
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#164e4e] dark:text-[#FEF8C5]">{t.year}</p>
                    <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-slate-100">{t.title}</h3>
                    <p className="text-slate-700 dark:text-slate-300">{t.details}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="max-w-xl">
                <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-slate-100">Designed for Inspiration</h2>
                <p className="text-lg text-slate-700 dark:text-slate-300">
                  Step into workspaces that blend aesthetics with functionality. Every corner at FlashSpace is crafted to boost your productivity.
                </p>
              </motion.div>
              <div>
                <Button
                  variant="outline"
                  className={`${outlineButtonClass} border-[#2D3F33] text-[#2D3F33] hover:bg-[#2D3F33] hover:text-[#FEF8C5] dark:border-[#FEF8C5] dark:text-[#FEF8C5] dark:hover:bg-[#FEF8C5] dark:hover:text-[#1f2e26]`}
                >
                  View All Spaces
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {inspirationImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -3 }}
                  className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                >
                  <img src={image} alt="Business workspace" className="h-48 w-full object-cover transition-transform duration-500 hover:scale-105" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-16 text-center">
              <h2 className="mb-6 text-4xl font-bold text-slate-900 dark:text-slate-100">
                Our Core <span className="text-[#164e4e] dark:text-[#FEF8C5]">Values</span>
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-slate-700 dark:text-slate-300">
                Principles that guide our decisions and shape our culture.
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {values.map((v, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="rounded-[1.5rem] border border-border bg-card p-8 shadow-sm"
                >
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#164e4e]/10 text-[#164e4e] dark:bg-[#FEF8C5]/10 dark:text-[#FEF8C5]">
                    <v.icon className="h-7 w-7" strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">{v.title}</h3>
                  <p className="leading-relaxed text-slate-700 dark:text-slate-300">{v.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="text-center text-3xl font-bold text-slate-900 dark:text-slate-100">
              Meet the team
            </motion.h2>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {team.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  whileHover={{ y: -3 }}
                  className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
                >
                  <img src={m.img} alt={m.name} className="mx-auto h-24 w-24 rounded-full border-4 border-slate-100 object-cover dark:border-slate-700" />
                  <div className="mt-4 font-semibold text-slate-900 dark:text-slate-100">{m.name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{m.role}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="location-section" className="bg-background py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-16">
              <h2 className="mb-6 text-4xl font-bold text-slate-900 dark:text-slate-100 md:text-5xl">
                Find <span className="text-[#164e4e] dark:text-[#FEF8C5]">Us</span>
              </h2>
              <p className="max-w-2xl text-xl text-slate-700 dark:text-slate-300">
                Located in the heart of the city, our flagship center is designed to be your perfect base of operations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-5 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="lg:col-span-2 rounded-[2rem] border border-border bg-card p-8 shadow-lg md:p-10"
              >
                <h3 className="mb-8 text-2xl font-bold text-slate-900 dark:text-slate-100">Contact Information</h3>

                <div className="space-y-8">
                  <div className="group flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#164e4e]/10 text-[#164e4e] transition-colors group-hover:bg-[#164e4e] group-hover:text-white dark:bg-[#FEF8C5]/10 dark:text-[#FEF8C5] dark:group-hover:bg-[#FEF8C5] dark:group-hover:text-[#1f2e26]">
                      <MapPin className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="mb-1 text-lg font-bold text-slate-900 dark:text-slate-100">Visit Us</p>
                      <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                        Kundan Mansion, 2-A/3, Asaf Ali Rd,
                        <br /> Turkman Gate, New Delhi
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 transition-colors group-hover:bg-blue-500 group-hover:text-white dark:text-blue-400">
                      <Clock className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="mb-1 text-lg font-bold text-slate-900 dark:text-slate-100">Working Hours</p>
                      <p className="text-slate-700 dark:text-slate-300">Mon - Sat: 9:00 AM - 8:00 PM</p>
                      <p className="text-slate-700 dark:text-slate-300">Sun: Closed</p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-600 transition-colors group-hover:bg-green-500 group-hover:text-white dark:text-green-400">
                      <Phone className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="mb-1 text-lg font-bold text-slate-900 dark:text-slate-100">Get in Touch</p>
                      <p className="text-slate-700 dark:text-slate-300">+91 98765 43210</p>
                      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">support@flashspace.com</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 border-t border-border pt-8">
                  <Button className={`${primaryButtonClass} w-full bg-[#2D3F33] text-[#FEF8C5] hover:bg-[#344C3D]`}>
                    Get Directions
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.06 }}
                className="relative h-full min-h-[500px] overflow-hidden rounded-[2rem] border border-border shadow-xl lg:col-span-3"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0!2d77.2315!3d28.6448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM4JzQxLjMiTiA3N8KwMTMnNTMuNCJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "grayscale(0%) contrast(1.05)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
                <div className="absolute right-4 top-4 rounded-full border border-border bg-white/95 px-4 py-2 text-xs font-bold text-slate-900 shadow-md backdrop-blur-md dark:bg-black/90 dark:text-slate-100">
                  📍 New Delhi HQ
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
