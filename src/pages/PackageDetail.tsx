import { useEffect, useState, useMemo } from "react";
import { useParams, Navigate, Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PricingSection } from "@/components/sections/PricingSection";
import { CheckCircle2, ArrowLeft, ChevronDown, MapPin, Building2, Server, FileText, Briefcase, Bot, Star, ArrowRight, Search, Zap, Shield, HelpCircle, ArrowRightCircle, ArrowRightLeft, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { PackageLeadModal } from "@/components/packages/PackageLeadModal";
import { PackageTestimonial } from "@/components/sections/PackageTestimonial";

const INITIAL_MOCK_SPACES: Record<string, { id: string, name: string, location: string, coordinates: [number, number], image: string }[]> = {
  Delhi: [
    { id: "FSDL01", name: "Stirring Minds", location: "Asaf Ali Road", coordinates: [77.2343, 28.6415], image: "/stirring-minds.png" },
    { id: "FSDL02", name: "Premium Desk", location: "Connaught Place", coordinates: [77.2167, 28.6315], image: "/virtual-office.png" }
  ],
  Noida: [
    { id: "FSNOD01", name: "Tech Hub", location: "Sector 62", coordinates: [77.3601, 28.6139], image: "/virtual-office.png" }
  ],
  Gurgaon: [
    { id: "FSGUR01", name: "Cyber City Space", location: "Cyber City", coordinates: [77.0860, 28.4900], image: "/virtual-office.png" }
  ],
  Bangalore: [
    { id: "FSBLR01", name: "Startup Valley", location: "Koramangala", coordinates: [77.6200, 12.9352], image: "/newLogo/banglore.jpg" }
  ]
};

const allFeatures = [
  { name: "Virtual office", plans: ["basic", "pro", "premium", "elite"], description: "Establish a professional business address without the need for physical space. Ideal for remote teams and startups." },
  { name: "One CRM", plans: ["basic", "pro", "premium", "elite"], description: "Streamline your customer relationship management with our unified CRM platform, designed to boost your sales and support efficiency." },
  { name: "GST", plans: ["pro", "premium", "elite"], description: "Complete Goods and Services Tax registration and compliance support to keep your business legally sound." },
  { name: "MSME/ Trade License", plans: ["pro", "premium", "elite"], description: "Obtain essential trade licenses and MSME registration to unlock government benefits and operate legally." },
  { name: "ESIC/PF", plans: ["pro", "premium", "elite"], description: "Hassle-free registration for Employee State Insurance and Provident Fund to ensure employee welfare and compliance." },
  { name: "Website Development (AI chatbot + Domain + Hosting)", plans: ["premium", "elite"], description: "Get a professional online presence with a custom website, including an AI chatbot, domain name, and reliable hosting." },
  { name: "Pvt Ltd/LLP/OPC Registration", plans: ["elite"], description: "End-to-end support for incorporating your business as a Private Limited Company, Limited Liability Partnership, or One Person Company." },
];

export default function PackageDetail() {
  const { planId } = useParams<{ planId: string }>();
  const location = useLocation();
  const plan = planId?.toLowerCase() || "";
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [spacesData, setSpacesData] = useState(INITIAL_MOCK_SPACES);
  const [selectedPlanForLead, setSelectedPlanForLead] = useState<{name: string, key: string} | null>(null);
  const [reviewIndex, setReviewIndex] = useState(0);

  const REVIEWS_DATA = [
    { text: "Nice space and well mannered staff, really happy 😊", author: "Vijay", avatar: "V", color: "bg-orange-600" },
    { text: "Co-operative guys...go for them if u need a virtual office.", author: "asadullah jahangir", avatar: "A", color: "bg-blue-500" },
    { text: "I strongly recommend Virtual Office in delhi for your workspace requirements.", author: "Manoj Gusain", avatar: "M", color: "bg-purple-600" },
    { text: "It felt smooth and professional from start to finish.", author: "Ashutosh Mishra", avatar: "A", color: "bg-blue-600" }
  ];

  useEffect(() => {
    const fetchRealImages = async () => {
      try {
        const response = await getAllVirtualOffices(100);
        if (response && response.data) {
          const apiSpaces = response.data;
          
          setSpacesData(prev => {
            const newData = { ...prev };
            Object.keys(newData).forEach(city => {
              newData[city] = newData[city].map(mockSpace => {
                const apiSpace = apiSpaces.find(s => s.propertyId === mockSpace.id);
                if (apiSpace && apiSpace.images && apiSpace.images.length > 0) {
                  return { ...mockSpace, image: apiSpace.images[0] };
                }
                return mockSpace;
              });
            });
            return newData;
          });
        }
      } catch (err) {
        console.error("Failed to load space images dynamically", err);
      }
    };
    fetchRealImages();
  }, []);

  const mapCenter = useMemo(() => {
    return spacesData[selectedCity]?.[0]?.coordinates || [77.2343, 28.6415];
  }, [selectedCity, spacesData]);

  const mapMarkers = useMemo(() => {
    return (spacesData[selectedCity] || []).map((ws) => ({
      id: ws.id,
      coordinates: ws.coordinates,
      title: ws.name,
      price: ""
    }));
  }, [selectedCity, spacesData]);

  const planFeatures = allFeatures.filter((f) => f.plans.includes(plan));

  const packageFaqs = [
    {
      question: `What all will I get in the ${plan.toUpperCase()} package?`,
      answer: (
        <div className="space-y-2">
          <p>This package is curated to give you maximum value at a heavily discounted price. You will get the following essential services:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            {planFeatures.map((feature, idx) => (
              <li key={idx}><strong>{feature.name}</strong> - {feature.description}</li>
            ))}
          </ul>
        </div>
      )
    },
    {
      question: "What is virtual office?",
      answer: <p>A virtual office provides your business with a premium physical address and communication services without the overhead of a dedicated physical space. It's perfect for remote teams, freelancers, and startups needing a professional image.</p>
    },
    {
      question: "Is it legal or not?",
      answer: <p>Yes, virtual offices are 100% legal in India. They are widely accepted and used for GST registration, Private Limited or LLP company incorporation, and obtaining business licenses like MSME or Trade Licenses, fully complying with government regulations.</p>
    },
    {
      question: "What is CRM?",
      answer: <p>CRM (Customer Relationship Management) is a system that helps businesses manage interactions with current and potential customers, streamline processes, and improve profitability by organizing leads, sales, support, and marketing in one place.</p>
    },
    {
      question: "What is OneCRM that you are giving?",
      answer: <p>OneCRM is our powerful, proprietary all-in-one CRM platform that we provide absolutely FREE with this package. It is designed to be used across your entire organization to unify your sales, support, and marketing teams. OneCRM completely replaces the need to buy multiple expensive software subscriptions like standalone lead trackers, support ticket systems, or separate sales pipelines.</p>
    },
    {
      question: "What features will I get in OneCRM?",
      answer: (
        <div className="space-y-2">
          <p>OneCRM gives you complete control over your customer journey. Key features include:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Lead Management:</strong> Capture, track, and nurture leads from a single, intuitive dashboard.</li>
            <li><strong>Sales Pipeline:</strong> Visualize your sales stages and close deals faster with automated follow-ups.</li>
            <li><strong>Deep Analytics:</strong> Gain actionable insights into your business performance and customer behavior.</li>
            <li><strong>Workflow Automation:</strong> Automate repetitive tasks to save time and let your team focus on selling.</li>
          </ul>
        </div>
      )
    }
  ];

  if (['premium', 'elite'].includes(plan)) {
    packageFaqs.push(
      {
        question: "Will you provide a fully functional website?",
        answer: <p>Yes, we will design and develop a professional, responsive, and fully functional 5-page business website. It will be optimized for performance and tailored to your specific requirements to help you establish a strong online presence.</p>
      },
      {
        question: "Do I have to pay extra for website hosting or domain?",
        answer: <p>We cover the complete design and development of the website as part of this package. Domain registration and hosting costs are typically separate and borne by the client, but our team will guide you on the best and most affordable options available to get you live.</p>
      }
    );
  }

  useEffect(() => {
    if (location.state && (location.state as any).scrollToIncluded) {
      setTimeout(() => {
        const element = document.getElementById('whats-included');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.state]);

  useEffect(() => {
    document.title = `${plan.toUpperCase()} Package — FlashSpace`;
  }, [plan]);

  if (!["basic", "pro", "premium", "elite"].includes(plan)) {
    return <Navigate to="/solutions/virtual-office" replace />;
  }

  return (
    <div
      className="min-h-screen text-foreground antialiased"
      style={{ backgroundColor: "#FAFAF7", fontFamily: "'Inter', sans-serif" }}
    >
      <Header loginBlack forceWhiteBackground />

      <main className="pt-20">
        {/* Dynamic Pricing Section where current plan is highlighted */}
        <PricingSection highlightPlan={plan} compact={true} />
        {/* Features Details Section (Segmented) */}
        <section id="whats-included" className="bg-white py-20 border-t border-b border-[#E8E2D9]">
          <div className="container mx-auto px-4 lg:px-8 max-w-6xl space-y-24">
            
            <div className="text-center max-w-2xl mx-auto -mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2E26] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                What's included in the {plan.toUpperCase()} plan
              </h2>
              <p className="text-gray-500 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                Everything you need to establish and grow your business presence professionally.
              </p>
            </div>
            
            {/* 1. Virtual Office Section (Always visible) */}
            <div className="scroll-mt-24">
              <div className="grid lg:grid-cols-[3fr_2fr] gap-8 xl:gap-12 items-start">
                <div className="space-y-6">
                  <div className="mb-2">
                    <h2 className="text-3xl font-bold text-[#36503F] mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Virtual Office</h2>
                    <p className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>Establish a premium physical business address and communication services without the overhead of a dedicated space. Perfect for remote teams and startups.</p>
                  </div>

                  {/* City Cards Grid (Replacing Spaces) */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    {[
                      { city: "Delhi", price: "1025", image: "/to_cloudinary/delhi_city_1782458486025.png" },
                      { city: "Gurgaon", price: "1158", image: "/newLogo/gurgaon.jpg" },
                      { city: "Noida", price: "1000", image: "/newLogo/noida.jpg" },
                      { city: "Bangalore", price: "1117", image: "/to_cloudinary/bangalore_city_1782458444683.png" }
                    ].map((item) => (
                      <div 
                        key={item.city} 
                        className="rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-all group"
                        onClick={() => setSelectedPlanForLead({ name: plan.toUpperCase(), key: plan })}
                      >
                        {/* Top Image Section */}
                        <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                          <img src={item.image} alt={item.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>

                        {/* Content Section */}
                        <div className="p-5 flex flex-col flex-1">
                           <h4 className="font-bold text-[#1F2E26] text-xl mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                             {item.city}
                           </h4>
                           <div className="text-gray-500 text-sm mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                             Starting at <span className="font-bold text-[#1F2E26]">₹{item.price}</span> /month
                           </div>
                           
                           <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                             <span className="text-[#36503F] font-semibold text-sm group-hover:text-black transition-colors">
                               Explore locations in {item.city}
                             </span>
                             <ArrowRight className="w-4 h-4 text-[#36503F] group-hover:text-black transition-colors" />
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sticky top-24 space-y-6">
                  {/* Shubham Consultant Card */}
                  <div className="bg-[#FAFAF7] rounded-2xl p-5 border border-[#E8E2D9] shadow-sm">
                    <h4 className="font-bold text-[#1F2E26] text-base mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Get your Virtual Office in Delhi with Shubham
                    </h4>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <img src="/to_cloudinary/shubham.png" alt="Shubham" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <h5 className="font-bold text-[#1F2E26] text-base" style={{ fontFamily: "'Inter', sans-serif" }}>Shubham</h5>
                        <p className="text-gray-500 font-medium text-xs">+91 98886 87898</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#EDF3ED] text-[#36503F] text-[10px] font-semibold border border-[#D5E3D5] mt-1">
                          <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                          FlashSpace Consultant
                        </span>
                      </div>
                    </div>

                    <a 
                      href="tel:+919888687898"
                      className="w-full py-2.5 rounded-xl bg-[#36503F] hover:bg-[#36503F]/90 text-[#FEF8CF] text-sm font-semibold transition-colors mb-5 block text-center"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Contact Shubham
                    </a>
                    
                    <div>
                      <h5 className="font-bold text-[#1F2E26] text-xs mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>Shubham will help you with:</h5>
                      <div className="grid grid-cols-2 gap-y-2.5 gap-x-2">
                        <div className="flex items-center text-xs text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#36503F] mr-1.5 flex-shrink-0" />
                          Compare Workspaces
                        </div>
                        <div className="flex items-center text-xs text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#36503F] mr-1.5 flex-shrink-0" />
                          Price Negotiation
                        </div>
                        <div className="flex items-center text-xs text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#36503F] mr-1.5 flex-shrink-0" />
                          Seamless GST Setup
                        </div>
                        <div className="flex items-center text-xs text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#36503F] mr-1.5 flex-shrink-0" />
                          Documentation
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review Card Carousel */}
                  <div className="bg-[#F5F5F0] rounded-2xl p-5 border border-[#E8E2D9] shadow-sm">
                    <div className="flex gap-1 mb-3">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-full ${REVIEWS_DATA[reviewIndex].color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>{REVIEWS_DATA[reviewIndex].avatar}</div>
                      <div>
                        <p className="text-[#1F2E26] text-sm font-medium leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                          "{REVIEWS_DATA[reviewIndex].text}"
                        </p>
                        <p className="text-gray-400 text-xs mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                          -{REVIEWS_DATA[reviewIndex].author}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <div className="flex gap-1">
                        {REVIEWS_DATA.map((_, i) => (
                          <span key={i} className={`w-2 h-2 rounded-full transition-colors ${i === reviewIndex ? 'bg-gray-600' : 'bg-gray-300'}`}></span>
                        ))}
                      </div>
                      <button 
                        onClick={() => setReviewIndex((reviewIndex + 1) % REVIEWS_DATA.length)}
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trusted By Section */}
              <div className="mt-10 lg:mt-12">
                <div className="text-center mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1F2E26]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    5,000+ clients served
                  </h3>
                </div>
                <div className="py-2 px-2 overflow-hidden">
                  <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
                    <img src="/newLogo/agrizy.png" alt="Agrizy" className="h-20 object-contain hover:scale-105 transition-all" />
                    <img src="https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528434/plum_logo_lstdop.png" alt="Plum" className="h-14 object-contain hover:scale-105 transition-all" />
                    <img src="/newLogo/flipkart-logo-png_seeklogo-284422.png" alt="Flipkart" className="h-20 object-contain hover:scale-105 transition-all" />
                    <img src="https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528435/truly_madly_b78smk.png" alt="Truly Madly" className="h-16 object-contain hover:scale-105 transition-all" />
                    <img src="https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528435/study_iq_xdxdkd.png" alt="Study IQ" className="h-16 object-contain hover:scale-105 transition-all" />
                    <img src="https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528434/Adda247_bbmaft.png" alt="Adda247" className="h-12 object-contain hover:scale-105 transition-all" />
                    <img src="https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528435/growthschool_-_Copy_iip2zr.png" alt="Growth School" className="h-10 object-contain hover:scale-105 transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. OneCRM Section (Always visible) */}
            <div className="bg-[#36503F] text-[#FEF8CF] rounded-3xl p-10 py-16 lg:py-20 lg:pl-20 lg:pr-10 relative overflow-hidden -mx-2 lg:-mx-4">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-[0.05] blur-3xl pointer-events-none"></div>
              <div className="relative z-10 grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-center">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>OneCRM <span className="text-white/50">(FREE)</span></h2>
                  <p className="text-[#FEF8CF]/80 text-lg leading-relaxed mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Say goodbye to paying for multiple expensive subscriptions. Our proprietary OneCRM is included absolutely free with your package.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="bg-[#FEF8CF]/20 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-5 h-5 text-[#FEF8CF]" />
                      </div>
                      <span className="text-[#FEF8CF]/90"><strong>Replaces Lead Trackers:</strong> Capture, track, and nurture leads from a single dashboard.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-[#FEF8CF]/20 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-5 h-5 text-[#FEF8CF]" />
                      </div>
                      <span className="text-[#FEF8CF]/90"><strong>Replaces Support Ticket Systems:</strong> Manage all your customer queries efficiently.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-[#FEF8CF]/20 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-5 h-5 text-[#FEF8CF]" />
                      </div>
                      <span className="text-[#FEF8CF]/90"><strong>Replaces Sales Pipelines:</strong> Visualize your sales stages and automate follow-ups.</span>
                    </li>
                  </ul>
                </div>
                <div className="relative hidden lg:flex items-center justify-end">
                  <img src="/onecrm2.png" alt="OneCRM Dashboard" className="w-[110%] max-w-none h-auto object-cover rounded-xl shadow-2xl border border-white/10" />
                </div>
              </div>
            </div>

            {/* 3. Compliances Section (Pro, Premium, Elite) */}
            {["pro", "premium", "elite"].includes(plan) && (
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#FDFCF9] p-6 rounded-xl border border-gray-200 shadow-sm">
                    <FileText className="w-8 h-8 text-[#36503F] mb-4" />
                    <h4 className="font-bold text-[#1F2E26] mb-2">GST Registration</h4>
                    <p className="text-sm text-gray-600">Complete tax registration and compliance support.</p>
                  </div>
                  <div className="bg-[#FDFCF9] p-6 rounded-xl border border-gray-200 shadow-sm">
                    <Briefcase className="w-8 h-8 text-[#36503F] mb-4" />
                    <h4 className="font-bold text-[#1F2E26] mb-2">MSME / Trade License</h4>
                    <p className="text-sm text-gray-600">Unlock government benefits and operate legally.</p>
                  </div>
                  <div className="bg-[#FDFCF9] p-6 rounded-xl border border-gray-200 shadow-sm sm:col-span-2">
                    <Building2 className="w-8 h-8 text-[#36503F] mb-4" />
                    <h4 className="font-bold text-[#1F2E26] mb-2">ESIC / PF Registration</h4>
                    <p className="text-sm text-gray-600">Hassle-free registration for employee state insurance and provident fund.</p>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <h2 className="text-3xl font-bold text-[#36503F] mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>Complete Business Compliances</h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Stay 100% legally compliant without the headache. Our expert team handles all your essential business registrations including GST, MSME, Trade Licenses, and employee welfare registrations like ESIC & PF. We ensure your business is legally sound so you can focus on growth.
                  </p>
                </div>
              </div>
            )}

            {/* 4. Website Development (Premium, Elite) */}
            {["premium", "elite"].includes(plan) && (
              <div className="bg-[#F0F4EE] rounded-3xl p-10 lg:p-16 border border-[#36503F]/10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-[#36503F] mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>Professional Website Development</h2>
                    <p className="text-gray-700 text-lg leading-relaxed mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Get a stunning, high-performance website tailored for your business. We don't just design it; we provide a comprehensive digital presence package.
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3">
                        <Server className="w-6 h-6 text-[#36503F]" />
                        <span className="text-gray-800 font-medium">Free Domain & Reliable Hosting included</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Bot className="w-6 h-6 text-[#36503F]" />
                        <span className="text-gray-800 font-medium">Smart AI Chatbot Integration for 24/7 support</span>
                      </li>
                    </ul>
                  </div>
                  <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
                     <img src="/homewebsite.png" alt="Website Development" className="w-full h-auto object-cover" />
                  </div>
                </div>
              </div>
            )}

            {/* 5. Company Incorporation (Elite Only) */}
            {plan === "elite" && (
              <div className="text-left md:text-center max-w-3xl mx-auto border-t-2 border-dashed border-[#36503F]/20 pt-12 md:pt-16 px-2 md:px-0">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-[#36503F] text-[#FEF8CF] rounded-full flex items-center justify-center md:mx-auto mb-5 md:mb-6 shadow-md">
                  <Building2 className="w-7 h-7 md:w-8 md:h-8" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#36503F] mb-4 md:mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>Company Incorporation</h2>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed text-justify md:text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Launch your dream company with our end-to-end incorporation support. Whether you want to register a <strong>Private Limited Company (Pvt Ltd)</strong>, a <strong>Limited Liability Partnership (LLP)</strong>, or a <strong>One Person Company (OPC)</strong>, our legal experts will handle the entire MCA process, name approval, and documentation for you.
                </p>
              </div>
            )}

          </div>
        </section>

        {/* Testimonials */}
        <PackageTestimonial />

        {/* FAQs */}
        <section className="bg-[#F4F7F5] py-16 border-t border-[#E8E2D9]">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#1a2b21] mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              FAQ's related to {plan.toUpperCase()} Package
            </h2>
            <div className="space-y-4">
              {packageFaqs.map((faq, index) => (
                <div key={index} className="border border-border/60 rounded-xl overflow-hidden bg-white shadow-sm transition-all">
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none hover:bg-muted/30 transition-colors"
                  >
                    <span className="font-semibold text-[#1a2b21] text-[15px]">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? "max-h-[500px] pb-4 opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <PackageLeadModal 
        isOpen={selectedPlanForLead !== null}
        onClose={() => setSelectedPlanForLead(null)}
        planName={selectedPlanForLead?.name || ''}
        planKey={selectedPlanForLead?.key || ''}
      />
    </div>
  );
}
