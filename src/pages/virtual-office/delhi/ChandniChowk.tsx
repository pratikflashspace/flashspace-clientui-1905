import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Send, Loader2, FileCheck2, Clock, Users, Building2, Store, ShoppingCart, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ListingCardModern from '@/components/services/ListingCardModern';
import { WeGotFeatured } from '@/components/sections/WeGotFeatured';
import { FounderTestimonial } from '@/components/sections/FounderTestimonial';
import { FAQSection } from '@/components/sections/FAQSection';
import { getVirtualOfficesByCity } from '@/services/virtualOffice.service';
import { API_BASE_URL } from '@/config/api.config';

const ChandniChowk = () => {
  const price = 1025;
  const navigate = useNavigate();

  // Carousel Ref & Scroll Handler
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Delhi Virtual Offices List
  const [delhiOffices, setDelhiOffices] = useState<any[]>([]);

  // Lead Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsSubmitting(true);
    try {
      await fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email ? formData.email.trim() : undefined,
          city: 'Delhi',
          businessType: 'Virtual Office - Chandni Chowk',
          message: formData.company ? `Company: ${formData.company} | Space: Chandni Chowk - FSDL01` : 'Space: Chandni Chowk - FSDL01',
          source: 'Chandni Chowk SEO Page',
          page: window.location.href
        })
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error("Lead submission error:", err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToDocs = () => {
    const docs = document.getElementById('docs');
    if (docs) {
      docs.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToForm = () => {
    const nameInput = document.getElementById('lead-name-input');
    if (nameInput) {
      nameInput.focus();
      nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToFinalCta = () => {
    const finalCta = document.getElementById('final-cta-section');
    if (finalCta) {
      finalCta.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clientLogos = [
    { name: "Flipkart", src: "/newLogo/flipkart-logo-png_seeklogo-284422.png", scaleClass: "max-h-12 sm:max-h-16" },
    { name: "Adda247", src: "https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528434/Adda247_bbmaft.png", scaleClass: "max-h-12 sm:max-h-16" },
    { name: "Growth School", src: "https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528435/growthschool_-_Copy_iip2zr.png", scaleClass: "max-h-7 sm:max-h-8" },
    { name: "Plum", src: "https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528434/plum_logo_lstdop.png", scaleClass: "max-h-10 sm:max-h-12" },
    { name: "Study IQ", src: "https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528435/study_iq_xdxdkd.png", scaleClass: "max-h-12 sm:max-h-16" },
    { name: "Agrizy", src: "https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528434/agrizy_vpn5mj.png", scaleClass: "max-h-12 sm:max-h-16" },
    { name: "Truly Madly", src: "https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528435/truly_madly_b78smk.png", scaleClass: "max-h-12 sm:max-h-16" },
  ];

  const initialFsdl01 = {
    _id: "FSDL01",
    spaceId: "FSDL01",
    name: "Stirring Minds - FSDL01",
    address: "Kundan Mansion, 2-A/3, Asaf Ali Rd, Turkman Gate, Chandni Chowk Area, New Delhi 110002",
    area: "Asaf Ali Road, Delhi",
    price: "₹1,025/mo",
    priceYearly: "₹12,300/yr",
    gstPlanPricePerYear: 12300,
    rating: 4.8,
    reviews: 124,
    image: "",
    images: [],
    features: ["GST Registration", "Company Registration", "Mailing Address", "Officer Visit Support"],
    popular: true,
    availability: "Available"
  };

  const [fsdl01Item, setFsdl01Item] = useState<any>(initialFsdl01);

  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        const res = await getVirtualOfficesByCity("delhi", 1, 50);
        if (res && res.offices) {
          setDelhiOffices(res.offices);
          const found = res.offices.find(
            (o: any) =>
              o.spaceId === "FSDL01" ||
              o._id === "FSDL01" ||
              (o.name && o.name.toLowerCase().includes("stirring minds"))
          );
          if (found) {
            let rawImages = (found.images && found.images.length > 0) ? found.images : (found.image ? [found.image] : []);
            let cleanImages = Array.from(new Set(rawImages));
            if (cleanImages.length > 1 && cleanImages[cleanImages.length - 1] === cleanImages[0]) {
              cleanImages = cleanImages.slice(0, cleanImages.length - 1);
            }

            setFsdl01Item({
              ...found,
              price: "₹1,025/mo",
              priceYearly: "₹12,300/yr",
              gstPlanPricePerYear: 12300,
              image: cleanImages[0] || "",
              images: cleanImages
            });
          }
        }
      } catch (err) {
        console.log("Error fetching FSDL01 data:", err);
      }
    };
    fetchSpaceData();
  }, []);

  const schemaJSON = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "name": "FlashSpace - Virtual Office Chandni Chowk",
        "image": "https://flashspace.in/logo.png",
        "url": "https://flashspace.in/virtual-office/delhi/chandni-chowk",
        "telephone": "+919876543210",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "1845, 1st Floor, Chandni Chowk, Near Sis Ganj Gurudwara",
          "addressLocality": "Chandni Chowk",
          "addressRegion": "Delhi",
          "postalCode": "110006",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 28.6562,
          "longitude": 77.2315
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "10:00",
          "closes": "18:00"
        }
      },
      {
        "@type": "Product",
        "name": "Virtual Office in Chandni Chowk for GST Registration",
        "offers": {
          "@type": "Offer",
          "price": price.toString(),
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock"
        }
      }
    ]
  };

  useEffect(() => {
    document.title = "Virtual Office in Chandni Chowk for GST and Company Registration | Starting at just 999/month";
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Virtual office address in Chandni Chowk, Delhi 110006 for GST and company registration. Notarised rent agreement, NOC and utility bill in 24 hours. Rs 1025/month.');

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaJSON);
    document.head.appendChild(script);

    return () => {
      if (script && document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const documentItems = [
    {
      num: "01",
      title: "Rent agreement, notarised",
      tag: "Mandatory",
      desc: "Eleven-month lease drawn exactly in your registered entity name, printed on valid stamp paper, and officially notarised."
    },
    {
      num: "02",
      title: "NOC from property owner",
      tag: "Mandatory",
      desc: "Owner's letterhead, physically signed, explicitly permitting the use of the premises as your principal place of business."
    },
    {
      num: "03",
      title: "Latest electricity bill",
      tag: "Mandatory",
      desc: "Current BSES Yamuna Power bill, dated comfortably inside the 60-day window that officers accept for registration."
    },
    {
      num: "04",
      title: "Company signage board",
      tag: "Included",
      desc: "Your firm's name mounted at the reception, plus a geotagged photograph ready for the verification file."
    },
    {
      num: "05",
      title: "Utility and tax receipt",
      tag: "Included",
      desc: "MCD property tax receipt confirming the commercial nature of the building, often requested during queries."
    },
    {
      num: "06",
      title: "Officer visit support",
      tag: "Included",
      desc: "Our Chandni Chowk staff receives the visiting officer and produces the originals on demand."
    }
  ];

  const processSteps = [
    {
      day: "Day 0 • 10 minutes",
      title: "Document Submission",
      desc: "Send the PAN and Aadhaar of the authorised signatory, along with your incorporation certificate or partnership deed."
    },
    {
      day: "Day 1",
      title: "Verification & Courier",
      desc: "Notarised agreement, NOC, and utility bill couriered to you as physical originals, and emailed as scans the same day."
    },
    {
      day: "Day 2",
      title: "Form REG-01 Filing",
      desc: "Form REG-01 filed with the exact jurisdiction fields pre-filled for Chandni Chowk, ensuring it lands on the right desk."
    },
    {
      day: "Day 3 to 7",
      title: "Officer Review & Approval",
      desc: "Officer review phase. Any REG-03 query is answered within 24 hours, and any physical visit is handled smoothly at our reception."
    }
  ];

  const whoItems = [
    {
      icon: Store,
      title: "Wholesalers & Traders",
      desc: "Out-of-state merchants who need a legitimate Delhi GSTIN to participate in the capital's wholesale distribution networks, specifically within Chandni Chowk's trading ecosystem."
    },
    {
      icon: ShoppingCart,
      title: "E-commerce Sellers",
      desc: "Marketplace sellers adding an Additional Place of Business (APOB) to access Delhi fulfillment centers, requiring a solid commercial address to pass strict Amazon/Flipkart verification."
    },
    {
      icon: Briefcase,
      title: "SME Consultants",
      desc: "Independent professionals who need a highly credible, historic invoice address in Old Delhi rather than billing clients from a residential apartment."
    },
    {
      icon: Building2,
      title: "New Private Limiteds",
      desc: "Founders completing MCA incorporation and GST registration off a single, airtight document set without signing an expensive commercial lease."
    }
  ];

  return (
    <div 
      className="chandni-chowk-page bg-[#FAF9F6] text-[#1A1A1A] min-h-screen selection:bg-[#36503F] selection:text-white pt-20"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Strict CSS Rule: Force Inter font across every single element on the page */}
      <style>{`
        .chandni-chowk-page,
        .chandni-chowk-page *,
        .chandni-chowk-page h1,
        .chandni-chowk-page h2,
        .chandni-chowk-page h3,
        .chandni-chowk-page h4,
        .chandni-chowk-page h5,
        .chandni-chowk-page h6,
        .chandni-chowk-page p,
        .chandni-chowk-page span,
        .chandni-chowk-page a,
        .chandni-chowk-page button,
        .chandni-chowk-page input,
        .chandni-chowk-page label,
        .chandni-chowk-page li,
        .chandni-chowk-page div {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
      `}</style>

      <Header />

      {/* SECTION 1: HERO (OFF-WHITE BG) */}
      <section className="bg-[#FAF9F6] border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-12 grid md:grid-cols-[1fr_420px] gap-10 items-stretch">
          <div className="flex flex-col justify-between h-full py-1 gap-4">
            <div className="w-fit">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                <span className="block">Virtual Office in Chandni Chowk</span>
                <span className="flex justify-end mt-1.5">
                  <span className="text-[#36503F] bg-[#FEF8CF] text-xl md:text-2xl px-2.5 py-1 rounded-lg font-bold">
                    - for GST and Company Registration
                  </span>
                </span>
              </h1>
            </div>

            {/* HERO CHECKLIST POINTS */}
            <div className="flex flex-col gap-2.5 my-0">
              {[
                "Starting at ₹999/month",
                "Premium business address in Chandni Chowk",
                "Mandatory document kit in 24 hours (NOC, Agreement, Electricity Bill)",
                "100% compliant for GST REG-01 & MCA company registration filings",
                "Complete physical verification & officer visit support included"
              ].map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 text-base text-gray-800 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#36503F] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-1">
              <button 
                onClick={scrollToFinalCta}
                className="bg-[#36503F] text-white px-8 py-4 rounded-xl text-sm font-bold tracking-wide hover:bg-[#2c4133] transition-colors shadow-md"
              >
                Get the Chandni Chowk address
              </button>
              <button 
                onClick={scrollToDocs}
                className="bg-white border border-gray-300 text-gray-900 px-8 py-4 rounded-xl text-sm font-bold tracking-wide hover:border-gray-900 transition-colors flex items-center justify-center shadow-sm"
              >
                See the document kit
              </button>
            </div>
          </div>

          {/* LEAD GENERATION FORM IN HERO */}
          <div id="hero-lead-form" className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Get Expert Advice</h3>
            <p className="text-sm text-gray-600 mb-6 text-center">Fill in your details to get instant documentation & pricing details for Chandni Chowk.</p>

            {isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-8 text-center my-auto flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 text-[#36503F] mx-auto mb-3" />
                <h4 className="font-bold text-lg mb-1">Callback Requested!</h4>
                <p className="text-sm text-emerald-700 mb-6">Thank you. Our virtual office expert will contact you shortly.</p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', phone: '', email: '', company: '' });
                  }}
                  className="bg-[#36503F] text-[#FEF8C5] px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1F2E26] transition-colors shadow-sm"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="flex flex-col gap-3">
                <input 
                  id="lead-name-input"
                  type="text" 
                  required
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#36503F] text-sm bg-[#FAF9F6]"
                />

                <input 
                  type="tel" 
                  required
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#36503F] text-sm bg-[#FAF9F6]"
                />

                <input 
                  type="email" 
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#36503F] text-sm bg-[#FAF9F6]"
                />

                <input 
                  type="text" 
                  placeholder="Company / Entity Name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#36503F] text-sm bg-[#FAF9F6]"
                />

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#36503F] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#2c4133] transition-colors shadow-md flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Get Free Consultation
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: STABLE TRUSTED CLIENTS LOGOS (WHITE BG) */}
      <section className="bg-white border-b border-gray-200/80 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
            Trusted by 5,000+ Fast-Growing Businesses across India
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-8 sm:gap-10 items-center justify-items-center">
            {clientLogos.map((logo) => (
              <div key={logo.name} className="flex items-center justify-center h-16 sm:h-20 w-full hover:scale-105 transition-transform duration-200">
                <img 
                  src={logo.src} 
                  alt={logo.name} 
                  className={`${logo.scaleClass || 'max-h-12 sm:max-h-16'} w-auto max-w-[140px] object-contain filter-none opacity-100`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: FIVE DOCUMENTS (OFF-WHITE BG WITH WHITE CARDS) */}
      <section id="docs" className="bg-[#FAF9F6] border-b border-gray-200/60 py-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Five documents, signed and stamped, in 24 hours</h2>
          <p className="text-lg text-gray-700 max-w-3xl mb-12 leading-relaxed">
            This is the exact set you will upload under "Proof of Principal Place of Business" in Form GST REG-01. No running around for signatures.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentItems.map((doc, idx) => (
              <motion.div
                key={doc.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-[#36503F] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* ELEGANT GRADIENT ACCENT FOR ALL CARDS (FADES ON HOVER) */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-emerald-50/20 to-transparent group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-300 group-hover:text-[#36503F] transition-colors">{doc.num}</span>
                    <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold ${
                      doc.tag === "Mandatory" 
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}>
                      {doc.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{doc.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{doc.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: OTHER DELHI LOCATIONS CAROUSEL (WHITE BG) */}
      <section className="bg-white py-20 border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Need virtual office at other locations in Delhi?
            </h2>
            <p className="text-gray-600 text-lg">
              Explore our compliance-verified addresses across Delhi's top business hubs.
            </p>
          </div>

          {/* X-AXIS SCROLLABLE CARDS WITH FLOATING CHEVRON BUTTONS ON LEFT & RIGHT */}
          <div className="relative group">
            {/* LEFT CHEVRON BUTTON */}
            <button 
              onClick={() => scrollCarousel('left')}
              className="absolute -left-5 md:-left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-gray-200 bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-[#36503F] hover:text-white hover:border-[#36503F] flex items-center justify-center transition-all shadow-xl hover:scale-110"
              aria-label="Slide Left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* RIGHT CHEVRON BUTTON */}
            <button 
              onClick={() => scrollCarousel('right')}
              className="absolute -right-5 md:-right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-gray-200 bg-white/95 backdrop-blur-sm text-gray-900 hover:bg-[#36503F] hover:text-white hover:border-[#36503F] flex items-center justify-center transition-all shadow-xl hover:scale-110"
              aria-label="Slide Right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div 
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto pb-6 px-2 no-scrollbar scroll-smooth snap-x"
            >
              {delhiOffices.map((office) => (
                <div key={office._id || office.id || Math.random()} className="min-w-[300px] sm:min-w-[340px] max-w-[340px] snap-start shrink-0">
                  <ListingCardModern 
                    item={office} 
                    onGetBestPrice={(id) => navigate(`/space/${id || office._id || office.id}`)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: ANIMATED FILING PROCESS (OFF-WHITE BG) */}
      <section id="process" className="bg-[#FAF9F6] py-20 border-b border-gray-200/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">From payment to GSTIN in about seven working days</h2>
          
          {/* DESKTOP LAYOUT (HORIZONTAL X-AXIS) */}
          <div className="hidden md:grid md:grid-cols-4 gap-8 relative">
            {processSteps.map((step, idx) => (
              <motion.div 
                key={step.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: idx * 0.15 }}
                className="flex flex-col gap-4 relative z-10"
              >
                <div className="text-xs uppercase tracking-widest text-[#36503F] font-bold">{step.day}</div>
                <div className="h-0.5 bg-[#36503F] w-full mb-2 relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#36503F] border-2 border-white rounded-full shadow-sm"></div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* MOBILE LAYOUT (VERTICAL Y-AXIS TIMELINE) */}
          <div className="md:hidden flex flex-col gap-8 relative pl-6 border-l-2 border-[#36503F] ml-3">
            {processSteps.map((step, idx) => (
              <motion.div 
                key={step.day}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative flex flex-col gap-2"
              >
                {/* BULLET DOT ON VERTICAL Y-AXIS LINE */}
                <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 bg-[#36503F] border-2 border-white rounded-full shadow-sm" />
                <div className="text-xs uppercase tracking-widest text-[#36503F] font-bold">{step.day}</div>
                <p className="text-sm text-gray-700 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: WE GOT FEATURED */}
      <WeGotFeatured />

      {/* SECTION 7: WHO REGISTERS (OFF-WHITE BG WITH WHITE CARDS) */}
      <section id="who" className="bg-[#FAF9F6] py-20 border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Who registers at Chandni Chowk</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {whoItems.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#36503F] mb-4">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-xl mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <FounderTestimonial />

      {/* SECTION 8: FINAL CTA BAND WITH PREMJEET SALES CARD (WHITE BG) */}
      <section id="final-cta-section" className="bg-white text-gray-900 py-20 border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-[1fr_420px] gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Ready to register in Chandni Chowk?
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-xl font-normal leading-relaxed">
              Rs {price}/month. 24-hour turnaround on notarised documents. Complete verification support across all Delhi jurisdictions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="tel:+919888687898"
                className="bg-[#36503F] text-white px-8 py-4 rounded-xl text-sm font-bold tracking-wide hover:bg-[#2c4133] transition-colors shadow-lg flex items-center justify-center"
              >
                Get started
              </a>
              <a 
                href="tel:+919888687898" 
                className="bg-[#FAF9F6] border-2 border-gray-300 text-gray-900 px-8 py-4 rounded-xl text-sm font-bold tracking-wide hover:border-gray-900 transition-colors flex items-center justify-center shadow-sm"
              >
                Talk to a GST advisor
              </a>
            </div>
          </div>

          {/* PREMJEET SALES CONSULTANT CARD (OFF-WHITE BG) */}
          <div className="bg-[#FAF9F6] text-gray-900 rounded-2xl p-6 shadow-xl border border-gray-200 text-left">
            <h3 className="text-[16px] font-bold text-gray-900 mb-4 leading-tight">
              Get your Virtual Office in Delhi with Premjeet
            </h3>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                <img src="/to_cloudinary/premjeet.png" alt="Premjeet" className="w-full h-full object-cover object-top" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 text-[16px] leading-tight mb-1">Premjeet</h4>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-gray-500 text-[13px] font-bold">+91 98886 87898</p>
                  <a href="tel:+919888687898" className="inline-flex items-center justify-center bg-[#36503F] text-white px-3 py-1.5 rounded-lg text-[12px] font-bold hover:bg-[#2c4133] transition-colors shadow-sm">
                    Contact Premjeet
                  </a>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#36503F]" /> FlashSpace Consultant
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-gray-900 text-[13px] mb-3">Premjeet will help you with:</h5>
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-2">
                {["Compare Workspaces", "Expert Price Negotiation", "Seamless GST Setup", "Tailored Documentation"].map((item) => (
                  <div key={item} className="flex items-start gap-1.5 text-[12px] text-gray-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#36503F] shrink-0 mt-0.5" />
                    <span className="leading-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: FAQ SECTION FROM WEBSITE THEME (OFF-WHITE BG) */}
      <section id="faq" className="bg-[#FAF9F6] border-b border-gray-200/60">
        <FAQSection />
      </section>

      <Footer />
    </div>
  );
};

export default ChandniChowk;
