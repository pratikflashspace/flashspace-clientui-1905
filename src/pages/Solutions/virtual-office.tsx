import { Building, MapPin, Mail, Phone, FileText, CheckCircle, Star, Users, Award, ChevronDown, Search, ArrowRight, Sparkles, Monitor, Settings, Download, Package, Target, Briefcase, Zap, Globe2, PhoneCall, Shield, Check, X, Headphones, Clock, Wallet, Trophy, Rocket, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DraggableCardContainer, DraggableCardBody } from "@/components/ui/draggable-card";

const VirtualOffice = () => {
    const navigate = useNavigate();
    const [selectedCity, setSelectedCity] = useState("Delhi");
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    // Refs for interactive background
    const bgRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const bg = bgRef.current;
        if (!container || !bg) return;

        const handleMove = (e: MouseEvent | globalThis.MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            const translateX = x * 14;
            const translateY = y * 10;
            bg.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(1.03)`;
        };

        const handleLeave = () => {
            if (bg) bg.style.transform = `translate3d(0, 0, 0) scale(1.03)`;
        };

        container.addEventListener('mousemove', handleMove);
        container.addEventListener('mouseleave', handleLeave);

        return () => {
            container.removeEventListener('mousemove', handleMove);
            container.removeEventListener('mouseleave', handleLeave);
        };
    }, []);

    // City data with famous landmark images
    const cityData = [
        { name: "Ahmedabad", image: "https://images.unsplash.com/photo-1569596082827-c5c81c9e3898?w=400&q=80", landmark: "Sabarmati Ashram" },
        { name: "Bangalore", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&q=80", landmark: "Tech Hub" },
        { name: "Chennai", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&q=80", landmark: "Marina Beach" },
        { name: "Delhi", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80", landmark: "India Gate" },
        { name: "Dharamshala", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80", landmark: "Himalayas" },
        { name: "Gurgaon", image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&q=80", landmark: "Cyber City" },
        { name: "Hyderabad", image: "https://images.unsplash.com/photo-1572638001012-c342e59c4d56?w=400&q=80", landmark: "Charminar" },
        { name: "Jaipur", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=80", landmark: "Hawa Mahal" },
        { name: "Jammu", image: "https://images.unsplash.com/photo-1623070573483-65a6c3e79c98?w=400&q=80", landmark: "Vaishno Devi" },
    ];

    // Handle search navigation
    const handleSearch = () => {
        navigate(`/services/virtual-office?city=${encodeURIComponent(selectedCity)}&service=virtual-office`);
    };

    const features = [
        {
            icon: Building,
            title: "Prime Business Address",
            description: "Get a prestigious business address in prime locations across major cities in India",
            gradient: "from-[#EDB003] to-[#f5c242]"
        },
        {
            icon: Star,
            title: "Flexible Terms",
            description: "No long-term commitments. Choose plans that fit your business needs with month-to-month flexibility",
            gradient: "from-[#172A3A] to-[#2a4a5a]"
        },
        {
            icon: Users,
            title: "Scalable Solutions",
            description: "Perfect for solopreneurs to enterprises. Scale up or down as your business grows",
            gradient: "from-[#EDB003] to-[#f5c242]"
        },
        {
            icon: Mail,
            title: "Mail & Call Handling",
            description: "Professional mail forwarding and dedicated call management services included",
            gradient: "from-[#172A3A] to-[#2a4a5a]"
        },
        {
            icon: FileText,
            title: "GST Registration",
            description: "Complete support for GST registration and business compliance requirements",
            gradient: "from-[#EDB003] to-[#f5c242]"
        },
        {
            icon: Award,
            title: "Premium Amenities",
            description: "Access to meeting rooms and business facilities whenever you need them",
            gradient: "from-[#172A3A] to-[#2a4a5a]"
        }
    ];

    const whatIsVirtualOffice = [
        {
            icon: Building,
            title: "Professional Address",
            description: "Get a prestigious business address in prime commercial locations without renting physical space"
        },
        {
            icon: Mail,
            title: "Mail Handling",
            description: "Professional mail receiving, scanning, and forwarding services at your convenience"
        },
        {
            icon: FileText,
            title: "Registration Support",
            description: "Complete assistance  GST, MCA and more Registrations "
        },
        {
            icon: Briefcase,
            title: "Meeting Room Access",
            description: "Book meeting rooms and conference facilities whenever you need professional space"
        }
    ];

    const howItWorksSteps = [
        {
            number: "1",
            title: "Select Location",
            description: "Choose your preferred business address from our prime locations across major cities in India.",
            icon: MapPin
        },
        {
            number: "2",
            title: "Choose Plan",
            description: "Select a virtual office plan that matches your business needs and budget. From basic address services to premium packages.",
            icon: Package
        },
        {
            number: "3",
            title: "Make Payment",
            description: "Complete secure online payment with transparent pricing and no hidden charges.",
            icon: Target
        },
        {
            number: "4",
            title: "Submit Documents",
            description: "Upload required documents online. Our team will verify and process your application within 24 hours.",
            icon: FileText
        },
        {
            number: "5",
            title: "Get Started",
            description: "Receive your business address, start using mail services, and access meeting rooms instantly.",
            icon: Zap
        }
    ];

    const whyChooseFlashSpace = [
        {
            icon: Wallet,
            title: "Save Up to 90%",
            description: "Eliminate expensive office rent, utilities, and maintenance costs while maintaining professional presence"
        },
        {
            icon: Scale,
            title: "Instant Flexibility",
            description: "Scale up or down instantly. Work from anywhere while your business address stays permanent"
        },
        {
            icon: Trophy,
            title: "Professional Credibility",
            description: "Impress clients with premium business addresses in prime locations across India"
        },
        {
            icon: Clock,
            title: "Setup in 24 Hours",
            description: "Get your virtual office ready within 24 hours. No lengthy paperwork or waiting periods"
        },
        {
            icon: FileText,
            title: "GST Registration",
            description: "Complete support for GST registration and business compliance with expert guidance"
        },
        {
            icon: Headphones,
            title: "Expert Support",
            description: "Dedicated account manager and 24/7 customer support for all your business needs"
        }
    ];

    const pricingPlans = [
        {
            name: "Basic",
            price: "2,999",
            period: "month",
            description: "Perfect for startups and freelancers",
            features: [
                "Premium Business Address",
                "Mail Receiving & Notification",
                "GST Registration Support",
                "Business Phone Number",
                "2 Hours Meeting Room/month"
            ],
            notIncluded: [
                "Call Handling Service",
                "Dedicated Phone Support"
            ],
            highlighted: false,
            gradient: "from-gray-50 to-gray-100"
        },
        {
            name: "Professional",
            price: "5,999",
            period: "month",
            description: "Most popular for growing businesses",
            features: [
                "Everything in Basic",
                "Mail Forwarding Service",
                "Professional Call Handling",
                "Dedicated Phone Support",
                "5 Hours Meeting Room/month",
                "Business Registration Support"
            ],
            notIncluded: [],
            highlighted: true,
            gradient: "from-[#EDB003] to-[#f5c242]"
        },
        {
            name: "Enterprise",
            price: "9,999",
            period: "month",
            description: "For established businesses",
            features: [
                "Everything in Professional",
                "Priority Mail & Call Service",
                "10 Hours Meeting Room/month",
                "Dedicated Account Manager",
                "Legal Documentation Support",
                "Custom Business Address"
            ],
            notIncluded: [],
            highlighted: false,
            gradient: "from-[#172A3A] to-[#2a4a5a]"
        }
    ];

    const testimonials = [
        {
            name: "Priya Sharma",
            company: "Digital Marketing Agency",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
            rating: 5,
            text: "FlashSpace virtual office helped me establish my business presence in Mumbai without the massive overhead costs. The GST registration support was seamless!"
        },
        {
            name: "Rahul Verma",
            company: "Tech Startup Founder",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
            rating: 5,
            text: "Best decision for our startup! We got a prestigious Bangalore address, professional mail handling, and meeting rooms when needed. Saved us lakhs in office rent."
        },
        {
            name: "Anjali Patel",
            company: "E-commerce Business",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
            rating: 5,
            text: "The 24-hour setup was incredible! I had my virtual office address ready the next day and completed my GST registration within a week. Highly recommend!"
        }
    ];

    const faqs = [
        {
            question: "What is a Virtual Office?",
            answer: "A virtual office provides you with a professional business address, mail handling services, and access to meeting rooms without the need for physical office space. It's perfect for remote businesses, startups, and entrepreneurs who want a professional presence without high overhead costs."
        },
        {
            question: "Can I use the virtual office address for GST registration?",
            answer: "Yes! All our virtual office addresses are verified and can be used for GST registration, business registration, and other legal compliances. We provide complete documentation support for GST registration."
        },
        {
            question: "How quickly can I get started?",
            answer: "You can get your virtual office set up within 24 hours! Once you choose your plan and submit the required documents, we'll process your application and activate your services immediately."
        },
        {
            question: "What documents do I need?",
            answer: "You'll need basic identity proof (Aadhaar/PAN), business proof (if applicable), and a passport-size photograph. Our team will guide you through the complete documentation process."
        },
        {
            question: "Do I get access to physical meeting rooms?",
            answer: "Yes! All plans include complimentary meeting room hours per month. You can book professional meeting spaces whenever you need to meet clients or conduct business meetings."
        },
        {
            question: "How does mail handling work?",
            answer: "We receive all your business mail at your virtual office address. You'll get instant notifications, and we can scan, forward, or store your mail based on your preference. Mail forwarding is available in Professional and Enterprise plans."
        },
        {
            question: "Can I upgrade or downgrade my plan?",
            answer: "Absolutely! We offer flexible plans with no long-term lock-in. You can upgrade or downgrade your plan anytime based on your business needs."
        },
        {
            question: "Is there a setup fee?",
            answer: "No hidden charges! The price you see is what you pay. We believe in transparent pricing with no surprise fees or setup charges."
        }
    ];

    const cityLocations = [
        {
            city: "Bangalore",
            centers: 5,
            image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
            description: "Tech hub with premium business addresses"
        },
        {
            city: "Delhi NCR",
            centers: 15,
            image: "https://images.unsplash.com/photo-1570939274717-7eda259b50ed?w=800&q=80",
            description: "Capital region with prestigious locations"
        },
        {
            city: "Mumbai",
            centers: 4,
            image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
            description: "Financial capital business addresses"
        },
        {
            city: "Kolkata",
            centers: 8,
            image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80",
            description: "IT corridor and startup ecosystem"
        },
        {
            city: "Hyderabad",
            centers: 4,
            image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80",
            description: "Emerging tech city premium spaces"
        },
        {
            city: "Chennai",
            centers: 2,
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
            description: "Southern business hub locations"
        }
    ];

    const stats = [
        { number: "5000+", label: "Clients", icon: Users },
        { number: "68+", label: "Centers ", icon: Building },
        { number: "50", label: "Major Cities", icon: MapPin },
        { number: "20", label: "States", icon: Globe2 }
    ];

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    const draggableImages = [
        {
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80",
            className: "absolute top-[0%] left-[5%] z-20 w-44 h-64 rounded-[2rem]",
            alt: "Corporate"
        },
        {
            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80",
            className: "absolute top-[5%] right-[5%] z-10 w-56 h-56 rounded-[2.5rem]",
            alt: "Office Discussion"
        },
        {
            image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=500&q=80",
            className: "absolute top-[28%] left-[32%] z-30 w-48 h-48 rounded-[2rem]",
            alt: "Remote City"
        },
        {
            image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=80",
            className: "absolute top-[45%] right-[2%] z-20 w-32 h-32 rounded-[1.5rem]",
            alt: "Modern Interior"
        },
        {
            image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80",
            className: "absolute bottom-[20%] left-[-5%] z-20 w-64 h-36 rounded-[2rem]",
            alt: "City"
        },
        {
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80",
            className: "absolute bottom-[28%] left-[25%] z-10 w-40 h-40 rounded-[2rem]",
            alt: "Team"
        },
        {
            image: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=600&q=80",
            className: "absolute -bottom-[5%] right-[8%] z-40 w-60 h-80 rounded-[3rem]",
            alt: "Abstract Office"
        }
    ];


    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
            {/* Header Component */}
            <Header />

            {/* Hero Section (MindTrip Style - Floating Cluster) */}
            <section ref={containerRef} className="relative min-h-[90vh] flex items-center bg-slate-50 dark:bg-[#0B1120] transition-colors duration-300 z-30">

                {/* Clean Background with subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-amber-50 dark:from-[#0B1120] dark:via-[#111] dark:to-[#1a1a1a]" />

                <div className="container mx-auto px-4 relative z-10 w-full h-full pt-20 pb-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* LEFT COLUMN: Content */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.8 }}
                            className="text-center lg:text-left relative z-20 mx-auto max-w-3xl lg:max-w-none"
                        >
                            <motion.div
                                className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-amber-200 dark:border-white/10 px-4 py-2 rounded-full mb-8 shadow-sm"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Sparkles className="w-4 h-4 text-[#EDB003]" />
                                <span className="text-sm font-bold tracking-wide text-slate-800 dark:text-white">Premium Virtual Offices</span>
                            </motion.div>

                            <h1 className="font-grotesk text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] text-slate-900 dark:text-white tracking-tight">
                                Start your <br />
                                business <span className="text-[#EDB003]">instantly.</span>
                            </h1>

                            <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-lg leading-relaxed">
                                Get a prestigious address, GST registration, and mail handling solutions without the overhead of a physical office.
                            </p>

                            {/* Search Container (Relative Parent) */}
                            <div className="relative max-w-md w-full mx-auto lg:mx-0">

                                {/* Compact Search Bar */}
                                <div className="bg-white dark:bg-white/5 p-2 rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 w-full relative z-20">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            onClick={() => setIsLocationOpen(!isLocationOpen)}
                                            className="flex-1 justify-between h-12 px-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl text-slate-700 dark:text-white"
                                        >
                                            <span className="truncate mr-2">{selectedCity || "Select City"}</span>
                                            <ChevronDown className="w-4 h-4 opacity-50" />
                                        </Button>
                                        <Button onClick={handleSearch} className="bg-[#EDB003] hover:bg-[#d69f03] text-black font-bold h-12 px-6 rounded-xl">
                                            Search
                                        </Button>
                                    </div>
                                </div>

                                {/* Horizontal City Selector Overlay (Anchored to Parent) */}
                                <AnimatePresence>
                                    {isLocationOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(10px)" }}
                                            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(10px)" }}
                                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                            className="absolute bottom-full left-0 mb-3 z-30 w-full bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-2xl rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-white/20 ring-1 ring-black/5 overflow-hidden"
                                        >
                                            {/* Decorative Top Gradient Line */}
                                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#EDB003] to-transparent opacity-50" />
                                            <div className="p-5">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="font-grotesk font-bold text-lg dark:text-white flex items-center gap-2">
                                                        <MapPin className="w-5 h-5 text-[#EDB003]" /> Select Location
                                                    </h3>
                                                    <button onClick={() => setIsLocationOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                                                        <X className="w-5 h-5 text-slate-400" />
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap gap-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                                                    {cityData.map(c => (
                                                        <button
                                                            key={c.name}
                                                            onClick={() => { setSelectedCity(c.name); setIsLocationOpen(false); }}
                                                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${selectedCity === c.name
                                                                ? 'bg-[#EDB003] text-black border-[#EDB003] shadow-md shadow-[#EDB003]/20'
                                                                : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-100 dark:hover:bg-white/10 hover:scale-[1.02]'
                                                                }`}
                                                        >
                                                            {c.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex items-center justify-center lg:justify-start gap-6 mt-10 text-sm font-medium text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#EDB003]" /> <span>GST Compliant</span></div>
                                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#EDB003]" /> <span>Cancel Anytime</span></div>
                            </div>
                        </motion.div>

                        {/* RIGHT COLUMN: Draggable Cards Cluster */}
                        <div className="hidden lg:block h-[650px] w-full">
                            <DraggableCardContainer className="perspective-1000">
                                {draggableImages.map((item, index) => (
                                    <DraggableCardBody key={index} className={item.className}>
                                        <div className="w-full h-full overflow-hidden shadow-2xl border-[6px] border-white dark:border-[#222] rounded-[inherit] hover:shadow-xl transition-shadow duration-300">
                                            <img
                                                src={item.image}
                                                alt={item.alt}
                                                className="w-full h-full object-cover pointer-events-none"
                                            />
                                        </div>
                                    </DraggableCardBody>
                                ))}
                            </DraggableCardContainer>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section (Redesigned - Clean & Premium) */}
            <section className="py-10 border-y border-slate-100 dark:border-white/10 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-md relative z-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100 dark:divide-white/5">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-center px-4 group cursor-default"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="mb-3 inline-flex p-3 rounded-2xl bg-[#EDB003]/10 text-[#EDB003] group-hover:scale-110 transition-transform duration-300">
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                                    {stat.number}
                                </div>
                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What is Virtual Office Section - Premium Redesign */}
            <section className="py-24 relative overflow-hidden bg-slate-50 dark:bg-[#0f172a]">
                {/* Background Decoration */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <span className="inline-block px-5 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-bold mb-6 tracking-wide border border-[#EDB003]/20">
                            MODERN BUSINESS SOLUTION
                        </span>
                        <h2 className="font-grotesk text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-slate-900 dark:text-white tracking-tight">
                            What is a <span className="relative inline-block text-[#EDB003]">
                                Virtual Office?
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#EDB003] opacity-40" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C25.8077 4.00844 57.0722 2.05308 97.4608 2.00085C138.694 1.94753 171.758 4.79326 198.001 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                            </span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
                            Run your business from anywhere while maintaining a <span className="font-semibold text-slate-900 dark:text-white">prestigious corporate presence</span>. No physical office required.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto pt-10">
                        {whatIsVirtualOffice.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                                viewport={{ once: true }}
                                className="group flex flex-col items-center text-center relative"
                            >
                                {/* Main Icon Bubble */}
                                <div className="relative mb-8">
                                    {/* Glow Background */}
                                    <div className="absolute inset-0 bg-[#EDB003] rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 scale-150"></div>

                                    {/* Icon Container */}
                                    <div className="w-24 h-24 bg-white dark:bg-[#1E293B] rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex items-center justify-center transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 border border-slate-100 dark:border-white/10 relative z-10">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${index === 0 ? 'from-[#EDB003] to-[#f5c242]' :
                                            index === 1 ? 'from-[#EDB003] to-[#f5c242]' :
                                                index === 2 ? 'from-[#EDB003] to-[#f5c242]' :
                                                    'from-[#EDB003] to-[#f5c242]'
                                            } shadow-lg`}>
                                            <item.icon className="w-6 h-6 text-black" />
                                        </div>
                                    </div>

                                    {/* Floating Badge (Optional decorative element) */}
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-[#0f172a] rounded-full flex items-center justify-center border border-slate-100 dark:border-white/10 shadow-sm z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                                        <div className="w-2 h-2 rounded-full bg-[#EDB003]"></div>
                                    </div>
                                </div>

                                {/* Text Content - Floating with no card background */}
                                <div className="relative z-10 px-2">
                                    <h3 className="font-grotesk text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-[#EDB003] transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            {/* How It Works Section - Premium Process Timeline */}
            <section className="py-24 bg-white dark:bg-[#0a0a0a] transition-colors duration-300 relative overflow-hidden">
                {/* Decorative background blobs */}
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#EDB003]/5 rounded-full blur-3xl -translate-y-1/2 -z-10 pointer-events-none" />

                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-5 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-bold mb-6 border border-[#EDB003]/20 tracking-wider">
                            SIMPLE 5-STEP PROCESS
                        </span>
                        <h2 className="font-grotesk text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight" >
                            How It <span className="text-[#EDB003] relative">
                                Works
                                <svg className="absolute w-full h-3 -bottom-2 left-0 text-[#EDB003] opacity-40" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C25.8077 4.00844 57.0722 2.05308 97.4608 2.00085C138.694 1.94753 171.758 4.79326 198.001 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                            </span>
                        </h2>
                        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                            Launch your business presence in minutes with our streamlined fully digital process.
                        </p>
                    </motion.div>

                    <div className="max-w-[90rem] mx-auto relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-[3.5rem] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent z-0"></div>
                        {/* Dashed Progress Line (Decoration) */}
                        <div className="hidden lg:block absolute top-[3.5rem] left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-[#EDB003]/30 z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 relative z-10">
                            {howItWorksSteps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    className="relative group flex flex-col items-center text-center"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.15, duration: 0.5 }}
                                    viewport={{ once: true }}
                                >
                                    {/* Step Number Node */}
                                    <div className="w-28 h-28 mb-8 relative flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-2">
                                        {/* Glow */}
                                        <div className="absolute inset-0 bg-[#EDB003] rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                                        {/* Outer Ring */}
                                        <div className="absolute inset-0 bg-white dark:bg-[#0a0a0a] rounded-full border-4 border-slate-50 dark:border-[#1f1f1f] shadow-xl group-hover:border-[#EDB003]/30 transition-colors duration-300"></div>

                                        {/* Inner Circle with Number */}
                                        <div className="absolute inset-2 bg-slate-50 dark:bg-[#111] rounded-full flex items-center justify-center border border-slate-100 dark:border-white/5">
                                            <span className="text-4xl font-black text-slate-200 dark:text-white/10 group-hover:text-[#EDB003] transition-colors duration-300 absolute transform -translate-y-1">0{step.number}</span>
                                            <step.icon className="w-8 h-8 text-slate-800 dark:text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                                        </div>

                                        {/* Connection Dot (Small) */}
                                        <div className="absolute -bottom-2 w-4 h-4 rounded-full bg-[#EDB003] border-4 border-white dark:border-[#0a0a0a] shadow-sm z-20"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="px-2">
                                        <h3 className="font-grotesk text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-[#EDB003] transition-colors">
                                            {step.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Mobile Connector (Vertical) */}
                                    {index !== howItWorksSteps.length - 1 && (
                                        <div className="lg:hidden absolute bottom-[-3rem] left-1/2 w-0.5 h-12 bg-gradient-to-b from-slate-200 dark:from-white/10 to-transparent transform -translate-x-1/2"></div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose FlashSpace Section */}
            {/* Why Choose FlashSpace Section - Premium Dark Crystal Design */}
            <section className="py-24 bg-slate-50 dark:bg-[#0f172a] relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block px-5 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-bold mb-6 border border-[#EDB003]/20 tracking-wider shadow-[0_0_15px_-5px_rgba(237,176,3,0.3)]">
                            WHY CHOOSE US
                        </span>
                        <h2 className="font-grotesk text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-slate-900 dark:text-white tracking-tight" >
                            Why Choose <span className="text-[#EDB003] relative inline-block">FlashSpace?
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#EDB003] opacity-40" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C25.8077 4.00844 57.0722 2.05308 97.4608 2.00085C138.694 1.94753 171.758 4.79326 198.001 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                            </span>
                        </h2>
                        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
                            Join thousands of successful businesses who trust FlashSpace for their virtual office needs.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 max-w-7xl mx-auto">
                        {whyChooseFlashSpace.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="group flex flex-col items-center text-center relative"
                            >
                                {/* Floating Icon Bubble */}
                                <div className="relative mb-6">
                                    {/* Glow */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 scale-125"></div>

                                    {/* Main Container */}
                                    <div className="w-24 h-24 bg-white dark:bg-[#1E293B] rounded-[2rem] shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)] flex items-center justify-center transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 border-2 border-slate-50 dark:border-white/5 relative z-10">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md bg-gradient-to-br ${index === 0 ? "from-[#EDB003] to-[#FFD700]" : // Wallet (Gold)
                                            index === 1 ? "from-blue-500 to-cyan-400" :   // Scale (Blue)
                                                index === 2 ? "from-emerald-500 to-teal-400" : // Trophy (Green)
                                                    index === 3 ? "from-purple-500 to-indigo-400" : // Clock (Purple)
                                                        index === 4 ? "from-rose-500 to-orange-400" :   // File (Rose)
                                                            "from-slate-700 to-slate-500" // Headphones (Dark)
                                            }`}>
                                            <benefit.icon className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="relative z-10 px-4">
                                    <h3 className="font-grotesk text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-[#EDB003] transition-colors">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                        {benefit.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block px-4 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-semibold mb-4">
                            Customer Stories
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A] dark:text-white" >
                            What Our <span className="text-[#EDB003]">Clients Say</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Real experiences from businesses who chose FlashSpace
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="border-2 border-gray-100 dark:border-white/10 hover:border-[#EDB003]/30 transition-all duration-300 h-full shadow-lg hover:shadow-xl bg-white dark:bg-[#1f1f1f]">
                                    <CardContent className="p-8">
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-[#EDB003] text-[#EDB003]" />
                                            ))}
                                        </div>

                                        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                                            "{testimonial.text}"
                                        </p>

                                        <div className="flex items-center gap-4">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="w-14 h-14 rounded-full object-cover border-2 border-[#EDB003]"
                                            />
                                            <div>
                                                <h4 className="font-bold text-[#172A3A] dark:text-white">{testimonial.name}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.company}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Logo Slider Section */}
                    <motion.div
                        className="mt-20"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-center mb-12">
                            <h3 className="font-grotesk text-2xl md:text-3xl font-bold text-[#172A3A] dark:text-white mb-3">
                                Trusted by Leading <span className="text-[#EDB003]">Brands</span>
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">Join thousands of companies who trust FlashSpace</p>
                        </div>

                        {/* Logo Slider Container */}
                        <div className="relative overflow-hidden bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-[#0a0a0a] dark:via-[#111] dark:to-[#0a0a0a] py-12 transition-colors duration-300">
                            <div className="infinite-scroll">
                                {/* First set of logos */}
                                <div className="flex items-center justify-around min-w-full gap-16 px-8">
                                    <div className="flex items-center justify-center w-[420px] h-28 bg-white dark:bg-white/90 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl p-2">
                                        {/* <img src="/Logo/flipkart.png" alt="Flipkart" className="w-full h-full object-contain" /> */}
                                    </div>
                                    <div className="flex items-center justify-center w-[420px] h-28 bg-white dark:bg-black/50 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl p-2">
                                        <img src="/Logo/trulymadly.png" alt="TrulyMadly" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex items-center justify-center w-[420px] h-28 bg-white dark:bg-black/50 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl p-3">
                                        <img src="/Logo/Stage2.png" alt="Stage OTT" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex items-center justify-center w-[420px] h-28 bg-white dark:bg-black/50 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl p-3">
                                        <img src="/Logo/StudyIQ.png" alt="Study IQ" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex items-center justify-center w-[420px] h-28 bg-white dark:bg-black/50 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl p-3">
                                        <img src="/Logo/Adda247.png" alt="Adda 24/7" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex items-center justify-center w-[420px] h-28 bg-white dark:bg-black/50 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl p-3">
                                        <img src="/Logo/luv.png" alt="LUV Films" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                                {/* Duplicate set for seamless loop */}
                                <div className="flex items-center justify-around min-w-full gap-16 px-8">
                                    <div className="flex items-center justify-center w-[420px] h-28 bg-white dark:bg-black/50 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl p-2">
                                        {/* <img src="/Logo/flipkart.png" alt="Flipkart" className="w-full h-full object-contain" /> */}
                                    </div>
                                    <div className="flex items-center justify-center w-[420px] h-28 bg-white dark:bg-black/50 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl p-2">
                                        <img src="/Logo/trulymadly.png" alt="TrulyMadly" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex items-center justify-center w-[420px] h-28 bg-white dark:bg-black/50 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl p-3">
                                        <img src="/Logo/Stage2.png" alt="Stage OTT" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex items-center justify-center w-[420px] h-28 bg-white dark:bg-black/50 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl p-3">
                                        <img src="/Logo/StudyIQ.png" alt="Study IQ" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex items-center justify-center w-[420px] h-28 bg-white dark:bg-black/50 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl p-3">
                                        <img src="/Logo/Adda247.png" alt="Adda 24/7" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex items-center justify-center w-[420px] h-28 bg-white dark:bg-black/50 rounded-2xl shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl p-3">
                                        <img src="/Logo/luv.png" alt="LUV Films" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FAQs Section */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-[#111] dark:to-[#0a0a0a] transition-colors duration-300">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block px-4 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-semibold mb-4">
                            Got Questions?
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A]" >
                            Frequently Asked <span className="text-[#EDB003]">Questions</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything you need to know about our virtual office services
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                viewport={{ once: true }}
                            >
                                <Card
                                    className={`border-2 transition-all duration-300 cursor-pointer bg-white dark:bg-[#1f1f1f] ${openFaqIndex === index
                                        ? 'border-[#EDB003] shadow-lg'
                                        : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                                        }`}
                                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between gap-4">
                                            <h3 className="font-grotesk text-lg font-bold text-[#172A3A] dark:text-gray-100">
                                                {faq.question}
                                            </h3>
                                            <ChevronDown
                                                className={`w-5 h-5 text-[#EDB003] flex-shrink-0 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </div>

                                        {openFaqIndex === index && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="mt-4 pt-4 border-t border-gray-200"
                                            >
                                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </motion.div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="text-center mt-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-gray-600 mb-4">Still have questions?</p>
                        <Button className="bg-[#EDB003] hover:bg-[#d69f03] text-white px-8 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                            <Headphones className="w-5 h-5 mr-2" />
                            Talk to Our Team
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Location Grid Section */}
            <section className="py-20 bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block px-4 py-2 bg-[#EDB003]/10 text-[#EDB003] rounded-full text-sm font-semibold mb-4">
                            Our Locations
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#172A3A] dark:text-white">
                            Across <span className="text-[#EDB003]">28+</span> States
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">Find your perfect virtual office location</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {cityLocations.map((location, index) => (
                            <motion.div
                                key={index}
                                className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                            >
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img
                                        src={location.image}
                                        alt={location.city}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-[#172A3A]/95 via-[#172A3A]/60 to-transparent"></div>

                                <div className="absolute inset-0 bg-gradient-to-t from-[#EDB003]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform transition-transform duration-500 group-hover:translate-y-0">
                                    <h3 className="font-grotesk text-3xl font-bold mb-2" >{location.city}</h3>
                                    <p className="text-white/90 mb-4 text-lg">{location.description}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                            <Building className="w-5 h-5" />
                                            <span className="font-semibold text-lg">{location.centers} Centers</span>
                                        </div>

                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                            <ArrowRight className="w-6 h-6 text-[#EDB003]" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-[#172A3A] via-[#172A3A] to-[#2a4a5a] relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-[#EDB003] rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#EDB003] rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" >
                            Ready to Establish Your
                            <br />
                            <span className="text-[#EDB003]">Business Presence?</span>
                        </h2>

                        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                            Join 5000+ businesses who trust FlashSpace for their virtual office needs.
                            Get started in less than 24 hours!
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button className="bg-[#EDB003] hover:bg-[#f5c242] text-[#172A3A] text-lg px-10 py-7 rounded-full font-bold shadow-2xl hover:shadow-[#EDB003]/50 transition-all duration-300 transform hover:scale-105">
                                <Sparkles className="w-5 h-5 mr-2" />
                                Get Started Today
                            </Button>

                            <Button variant="outline" className="border-2 border-white bg-white text-[#172A3A] hover:bg-[#EDB003] hover:text-white hover:border-[#EDB003] text-lg px-10 py-7 rounded-full font-bold transition-all duration-300">
                                <Phone className="w-5 h-5 mr-2" />
                                Talk to Expert
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer Component */}
            <Footer />
        </div>
    );
};

export default VirtualOffice;

