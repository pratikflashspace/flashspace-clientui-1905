import React, { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Splash3dButton from "@/components/ui/3d-splash-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function AboutUs() {
  useEffect(() => {
    document.title = "About — FlashSpace";
  }, []);

  const ACCENT = "#FFD400";
  const ACCENT_DARK = "#FFB300";

  const pageVariants = {
    hidden: { opacity: 0, y: 24 },
    show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: d } }),
  };

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

  // Updated 'Why Choose Us' data with images (Card Photos)
  const whyCards = [
    { 
      title: "Virtual Office", 
      desc: "Professional business address with mail handling and call forwarding services to establish your presence.",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
    },
    { 
      title: "Coworking Space", 
      desc: "Flexible workspaces with high-speed internet, meeting rooms, and a vibrant community of professionals.",
      img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800"
    },
    { 
      title: "On Demand Services", 
      desc: "Book meeting rooms, conference halls, and private cabins as per your business needs.",
      img: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800"
    },
    { 
      title: "Business Setup", 
      desc: "Complete assistance with company registration, GST, and all legal documentation for your business.",
      img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800"
    },
  ];

  const timeline = [
    { year: "2019", title: "Founded", details: "Opened the first FlashSpace center and validated the hybrid-first model." },
    { year: "2021", title: "Regional Expansion", details: "Expanded to 5 cities with improved operations and tech integrations." },
    { year: "2023", title: "Enterprise Programs", details: "Launched tailored enterprise suites and managed-office programs." },
    { year: "2025", title: "National Network", details: "Scaled presence across multiple states with a standardised operating model." },
  ];

  const gallery = [
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&q=80&w=1600",
  ];

  const values = [
    { title: "Simplicity", desc: "We believe in creating simple and seamless experiences." },
    { title: "Integrity", desc: "We are completely transparent and upfront." },
    { title: "Progressive", desc: "We are smart and forward looking." },
    { title: "Innovative", desc: "We are always curious to explore uncharted territories." },
    { title: "Collaborative", desc: "We believe in the power of a team over an individual." },
    { title: "User Centric", desc: "We are always around to help." },
  ];

  const team = [
    { name: "Pranav Bhatia", role: "CEO at FlashSpace", img: "https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/6644a86a1f2d7d473188297a_Untitled%20design%20(6).png" },
    { name: "Pratik Dey", role: "Business Head", img: "https://images.unsplash.com/photo-1545996124-45af2cf0b0b9?auto=format&fit=crop&q=80&w=400" },
    { name: "Aditya Rao", role: "Head of Product", img: "https://images.unsplash.com/photo-1544005315-7fdf6a9402c9?auto=format&fit=crop&q=80&w=400" },
  ];

  const locations = [
    { city: "Mumbai", count: 45 },
    { city: "Bengaluru", count: 60 },
    { city: "Delhi NCR", count: 70 },
    { city: "Chennai", count: 25 },
  ];

  const testimonials = [
    { quote: "FlashSpace transformed our hybrid strategy with measurable results.", author: "Priya — Founder, RetailCo" },
    { quote: "Their team delivered a flawless rollout across 3 cities.", author: "Rahul — Head of Ops, TechScale" },
    { quote: "Employees report better focus and collaboration after moving in.", author: "Anita — HR Lead, FinServ" },
  ];

  const stats = [
    { value: "250+", label: "Locations" },
    { value: "35k+", label: "Happy Members" },
    { value: "20+", label: "States & UTs" },
    { value: "99.9%", label: "Uptime SLA" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <Header loginBlack />

      <main>
        {/* SECTION 1: ABOUT US - Clean White Background */}
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-100 rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-20" />
          
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={stagger} className="space-y-8">
              <motion.div variants={pageVariants.show}>
                <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4" style={{ backgroundColor: ACCENT, color: '#000' }}>
                  ✨ Welcome to FlashSpace
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-black">
                  About Us
                </h1>
              </motion.div>

              <motion.p variants={pageVariants.show} className="text-lg text-gray-700 leading-relaxed">
                At Flash Space, we help businesses of all sizes ditch the traditional office and embrace the flexibility of a virtual office. We believe great work can happen anywhere, and we're here to make it simple for you in India.
              </motion.p>

              <motion.div variants={pageVariants.show} className="flex flex-wrap gap-4 pt-2">
                <Splash3dButton className="px-8 py-4 font-semibold text-white" style={{ backgroundColor: '#000' }} aria-label="Request demo">Get Started</Splash3dButton>
                <Splash3dButton onClick={() => document.getElementById('location-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 font-semibold border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors">View Locations</Splash3dButton>
              </motion.div>

              <motion.div variants={pageVariants.show} className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((s, i) => (
                  <div key={i} className="text-center md:text-left">
                    <div className="text-4xl font-extrabold mb-1" style={{ color: ACCENT }}>{s.value}</div>
                    <div className="text-sm text-gray-600 font-medium">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1, transition: { duration: 0.8 } }} viewport={{ once: true }} className="w-full relative">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-200 to-yellow-100 rounded-3xl blur-2xl opacity-30" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white p-3">
                  <div className="grid grid-cols-2 gap-3">
                    <img src={gallery[0]} alt="Office 1" className="w-full h-72 object-cover rounded-2xl" />
                    <div className="grid gap-3">
                      <img src={gallery[1]} alt="Office 2" className="w-full h-36 object-cover rounded-2xl" />
                      <img src={gallery[2]} alt="Office 3" className="w-full h-36 object-cover rounded-2xl" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: WHY CHOOSE US - With Card Photos */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center max-w-3xl mx-auto mb-16">
              <motion.h2 variants={pageVariants.show} className="text-3xl font-bold mb-6">Why Choose Us?</motion.h2>
              <motion.p variants={pageVariants.show} className="text-lg text-gray-600 leading-relaxed">
                We offer more than just virtual spaces — we deliver a complete ecosystem designed to support modern businesses. From flexible plans and prime business addresses to seamless tech support and a strong community network, our solutions are built for growth.
              </motion.p>
            </motion.div>

            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyCards.map((w, i) => (
                <motion.div key={i} variants={pageVariants.show} className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-gradient-to-t hover:from-yellow-200 hover:to-yellow-50">
                  <div className="h-52 overflow-hidden relative">
                    <img src={w.img} alt={w.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-black transition-colors">{w.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{w.desc}</p>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: ACCENT }}>
                    <span className="text-lg">→</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* SECTION 3: GROWTH TIMELINE - Best Visuals */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={pageVariants.show} className="text-center mb-16">
                 <h2 className="text-3xl font-bold">Growth Timeline</h2>
                 <p className="text-gray-500 mt-2">Our journey from a single room to a nationwide network.</p>
            </motion.div>

            <div className="relative">
              {/* Vertical Line */}
              <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
              
              <div className="space-y-8">
                {timeline.map((t, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -30 }} 
                    whileInView={{ opacity: 1, x: 0, transition: { duration: 0.6, delay: i * 0.1 } }} 
                    viewport={{ once: true }} 
                    className="relative flex items-start gap-8"
                  >
                    {/* Year Badge */}
                    <div className="flex-shrink-0 relative z-10">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg" style={{ backgroundColor: ACCENT, color: '#000' }}>
                        {t.year}
                      </div>
                    </div>
                    
                    {/* Content Card */}
                    <div className="flex-1 bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group hover:border-gray-300 hover:bg-gradient-to-t hover:from-yellow-200 hover:to-yellow-50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ backgroundColor: ACCENT, color: '#000' }}>
                              {i + 1}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-black transition-colors">{t.title}</h3>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{t.details}</p>
                        </div>
                        <div className="hidden md:block w-1 h-full bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Existing Sections: Gallery, Team, Locations, Testimonials, CTA */}
        
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
             <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={pageVariants.show} className="text-3xl font-bold text-center mb-10">Our Spaces</motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {gallery.slice(0,3).map((g, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }} viewport={{ once: true }} className="rounded-xl overflow-hidden shadow-md">
                    <img src={g} alt={`space-${i}`} className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500" />
                </motion.div>
                ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={pageVariants.show} className="text-3xl font-bold text-center mb-12">Our Values</motion.h2>
            
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((v, i) => (
                <motion.div key={i} variants={pageVariants.show} className="p-6 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-lg transition-all duration-300 group hover:bg-gradient-to-t hover:from-yellow-200 hover:to-yellow-50">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-black transition-colors">{v.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={pageVariants.show} className="text-3xl font-bold text-center">Meet the team</motion.h2>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {team.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.06 } }} viewport={{ once: true }} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm text-center hover:shadow-lg hover:bg-gradient-to-t hover:from-yellow-200 hover:to-yellow-50 transition-all duration-300">
                  <img src={m.img} alt={m.name} className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gray-50" />
                  <div className="mt-4 font-semibold">{m.name}</div>
                  <div className="text-sm text-gray-600">{m.role}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="location-section" className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Our Location</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              {/* Left Content - 40% */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Visit Us</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Come experience our premium workspace solutions in the heart of New Delhi. We're located in a prime business district with excellent connectivity.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: ACCENT }}>
                      <span className="text-xs font-bold">📍</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Address</p>
                      <p className="text-gray-600">Kundan Mansion, 2-A/3, Asaf Ali Rd, Turkman Gate, New Delhi</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: ACCENT }}>
                      <span className="text-xs font-bold">🕒</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Working Hours</p>
                      <p className="text-gray-600">Mon - Sat: 9:00 AM - 7:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: ACCENT }}>
                      <span className="text-xs font-bold">📞</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Contact</p>
                      <p className="text-gray-600">Get in touch for a tour</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Map - 60% */}
              <div className="lg:col-span-3">
                <div className="rounded-2xl overflow-hidden shadow-xl h-[450px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0!2d77.2315!3d28.6448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM4JzQxLjMiTiA3N8KwMTMnNTMuNCJF!5e0!3m2!1sen!2sin!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}