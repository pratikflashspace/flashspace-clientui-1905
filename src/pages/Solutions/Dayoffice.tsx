// DayOfficePage.tsx
import React, { useState, useRef, useEffect } from "react";
import { Plug, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import CurvedSelect from "@/components/ui/CurvedSelect";

import {
  CheckCircle,
  MapPin,
  Users,
  Calendar,
  X,
  Coffee,
  Wifi,
  Scan,
  ParkingCircle,
  DoorOpen,
  Printer,
  Clock4,
  Shield,
  Archive,
  Monitor,
  Key,
  Clock,
  ShieldCheck,
  BadgeCheck,
  Laptop,
  Headphones,
  Star,
  ChevronDown,
  Building2,
  DollarSign,
  Briefcase,
  Layers,
  Home
} from "lucide-react";

/**
 * DAY OFFICE PAGE CONSTANTS
 */

// Hero constants
const CITIES = [
  "New Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Noida",
  "Gurugram",
  "Ahmedabad",
  "Kolkata",
];
const SEAT_OPTIONS = ["1 (Solo)", "2-4", "4-8", "8-12", "12+"];

/* ⬇️ NEW — CITY → OFFICE mapping */
const CITY_OFFICES: Record<string, string[]> = {
  "New Delhi": ["Flashspace", "Stirring Mind", "Innov8", "Regus"],
  "Mumbai": ["WeWork", "Awfis", "Smartworks"],
  "Bengaluru": ["Cowrks", "WeWork", "91Springboard"],
  "Hyderabad": ["Awfis", "STC", "Work Studio"],
  "Pune": ["Smartworks", "Awfis", "Regus"],
  "Chennai": ["Awfis", "Work Studio"],
  "Noida": ["Stirring Mind", "Flashspace", "Innov8"],
  "Gurugram": ["STC", "Smartworks", "Cowrks"],
  "Ahmedabad": ["91Springboard", "Awfis"],
  "Kolkata": ["Regus", "Work Studio"],
};

// Office types
const OFFICE_CARDS = [
  {
    name: "Private Day Office",
    image:
      "https://i.pinimg.com/1200x/eb/77/a3/eb77a39b3bba847ba8e7df8190665bab.jpg",
    btn: "Book Private Office",
    points: ["Dedicated private space for focus", "Ergonomic chair & desk", "Ideal for 1–3 people"],
    price: "₹699 / day",
  },
  {
    name: "Manager Cabin",
    image:
      "https://i.pinimg.com/1200x/46/f4/1c/46f41c35f6a2f9c41da9fec0012b3d4b.jpg",
    btn: "Book Manager Cabin",
    points: ["Spacious cabin with window", "Meeting-ready setup", "Ideal for solo managers"],
    price: "₹999 / day",
  },
  {
    name: "Executive Suite",
    image:
      "https://i.pinimg.com/1200x/27/aa/e7/27aae7339628d011460ea1ca8a3c5ab9.jpg",
    btn: "Book Executive Suite",
    points: ["Premium desk & seating", "Enhanced privacy & ambience", "Ideal for client meetings"],
    price: "₹1,499 / day",
  },
  {
    name: "Team Day Cabin (2–6)",
    image:
      "https://i.pinimg.com/1200x/5f/4a/8b/5f4a8bfcc5cc4272a802b810c05910d0.jpg",
    btn: "Book Team Cabin",
    points: ["Collaboration friendly layout", "Screen & whiteboard available", "Ideal for small teams"],
    price: "₹1,999 / day",
  },
];

// Cities / Region data (re-using structure from MeetingRooms)
const CITY_DATA = [
  { city: "Delhi NCR", image: "https://i.pinimg.com/736x/29/1d/96/291d961e3b6d73eedb3d3f5d7e4ea383.jpg" },
  { city: "Mumbai", image: "https://i.pinimg.com/1200x/c0/cc/64/c0cc64f9978f64be1236bde48b58e0c0.jpg" },
  { city: "Bengaluru", image: "https://i.pinimg.com/736x/0f/08/3f/0f083fe4bc42628abf456cb4ad5d4020.jpg" },
  { city: "Hyderabad", image: "https://i.pinimg.com/736x/0c/0d/75/0c0d75936fd8860fcc8890697ec1e590.jpg" },
  { city: "Pune", image: "https://i.pinimg.com/1200x/ca/db/9f/cadb9f55840d7636a9051bdabd91bf76.jpg" },
  { city: "Chennai", image: "https://i.pinimg.com/1200x/8b/65/80/8b658075729790d4e3306529f773483d.jpg" },
  { city: "Ahmedabad", image: "https://i.pinimg.com/1200x/05/8f/52/058f5250842f18ca4fd64f795afd4a75.jpg" },
];

// Amenities (slightly focused to day-office needs)
const AMENITIES = [
  { icon: Monitor, title: "Ergonomic Workstations" },
  { icon: Wifi, title: "High-Speed Internet" },
  { icon: Printer, title: "Printing & Scanning" },
  { icon: Coffee, title: "Complimentary Coffee" },
  { icon: ParkingCircle, title: "Parking Facility" },
  { icon: Shield, title: "Secure Access" },
  { icon: Headphones, title: "Noise-Controlled Zones" },
  { icon: Clock4, title: "Flexible Timings" },
];

// Benefits tailored to Day Office customers
const BENEFITS = [
  { icon: Clock, title: "Instant Day Booking", desc: "Book a private office for a day with instant confirmation." },
  { icon: MapPin, title: "Prime Locations", desc: "Work from central business districts across major cities." },
  { icon: ShieldCheck, title: "Safe & Secure", desc: "Access-controlled entry and sanitized spaces." },
  { icon: Laptop, title: "Ready-to-Work", desc: "Powerful WiFi, desk power points and monitors available." },
  { icon: BadgeCheck, title: "Verified Spaces", desc: "All offices inspected and quality-verified by our team." },
  { icon: Headphones, title: "Quiet Focus Areas", desc: "Designed for concentration and client conversations." },
];

// Testimonials (reuse style)
const TESTIMONIALS = [
  { name: "Sonal Gupta", role: "Product Lead, NovaLabs", image: "https://randomuser.me/api/portraits/women/68.jpg", text: "Day office was spotless, quiet and perfect for deep work. The quick booking made my day stress-free.", rating: 5 },
  { name: "Karan Singh", role: "Founder, GreenByte", image: "https://randomuser.me/api/portraits/men/45.jpg", text: "Manager cabin had a great view and privacy. Perfect for client calls. Highly professional and well maintained.", rating: 5 },
  { name: "Maya Reddy", role: "Consultant", image: "https://randomuser.me/api/portraits/women/21.jpg", text: "Loved the ergonomic chair and the super-fast WiFi. 10/10. Will definitely book again soon.", rating: 5 },
];

// FAQ (mixed as requested)
const FAQ_DATA = [
  { q: "How long can I book a Day Office for?", a: "You can book for a half-day, full-day, or multiple days — hourly options are also available depending on the location." },
  { q: "What is included in the booking price?", a: "Bookings typically include the desk/cabin, high-speed WiFi, power, and access to complimentary coffee and printing (subject to location)." },
  { q: "Can I bring my own visitors or clients?", a: "Yes — visitors are allowed. For larger meetings you may need to reserve a meeting room or team cabin instead." },
  { q: "Do you offer refunds or rescheduling?", a: "Yes — our cancellation and rescheduling policy varies by plan and location. Contact support or check your booking confirmation for details." },
  { q: "Are there monthly or recurring plans?", a: "Yes — we offer flexible contracts and membership plans for teams and individuals. Reach out to sales for custom pricing." },
  { q: "Is there a discount for bulk or team bookings?", a: "Yes — we provide corporate discounts and bulk booking offers. Speak to our team for a tailored quote." },
];

const DayOfficePage: React.FC = () => {
  // Hero form state — keep identical structure/behavior, added office
  const [heroForm, setHeroForm] = useState({
    name: "",
    mobile: "",
    email: "",
    city: CITIES[0],
    office: CITY_OFFICES[CITIES[0]][0],
    seats: SEAT_OPTIONS[0],
    date: ""
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState<any | null>(null);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

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

  // onHeroChange supports both native events and CurvedSelect value calls
  function onHeroChange(e: any) {
    // if we get a direct value (CurvedSelect might pass a value), we normalize
    let name = e?.target?.name;
    let value = e?.target?.value;

    // If callback passed a plain object like { target: { name, value } } or passed (val)
    if (!name && typeof e === "object" && "name" in e && "value" in e) {
      name = e.name;
      value = e.value;
    }
    // If onChange was called as onHeroChange({ target: { name: 'city', value: val } })
    if (!name && e?.target && e.target.name) {
      name = e.target.name;
      value = e.target.value;
    }
    // If CurvedSelect passed the value directly (string), we won't have name — caller wraps it
    // So assume that callers always call as onHeroChange({ target: { name, value } }) as used below.

    // Handle city change separately to update office list
    if (name === "city") {
      const offices = CITY_OFFICES[value] || [];
      setHeroForm((s) => ({
        ...s,
        city: value,
        office: offices.length ? offices[0] : "",
      }));
      return;
    }

    // Normal update
    setHeroForm((s) => ({ ...s, [name]: value }));
  }

  function handleHeroSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Thanks — we received your request. Our team will call you shortly.");
  }
  const openModal = (office: any) => {
    setSelectedOffice(office);
    setShowModal(true);
  };
  const toggleFAQ = (index: number) => setFaqOpenIndex(faqOpenIndex === index ? null : index);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <Header />

      {/* ==================== HERO (same layout & form structure as Meeting Rooms) ==================== */}
      <section ref={containerRef} className="relative w-full h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            ref={bgRef}
            className="absolute inset-0 w-full h-full"
            style={{
              transition: 'transform 0.5s ease-out',
              transform: 'scale(1.03)'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Day Office"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col lg:flex-row gap-12 items-center justify-center lg:justify-between pt-20 lg:pt-0">

          {/* LEFT SIDE CONTENT */}
          <div className="w-full lg:w-2/3 text-white lg:-ml-16">
            <div className="max-w-2xl">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD43B] bg-white/10 backdrop-blur-md px-6 py-2 shadow-sm">
                <Sparkles className="w-4 h-4 text-[#FFD43B] fill-[#FFD43B]" />
                <span className="text-[#FFD43B] font-poppins font-bold text-sm tracking-wide">Instant Booking Available</span>
              </div>

              {/* Heading */}
              <h1 className="mt-3 text-4xl md:text-6xl font-bold leading-tight font-geist">
                Professional Day Offices <br />
                <span className="text-[#FFD43B]">On Your Schedule</span>
              </h1>

              <p className="mt-4 text-lg md:text-xl text-gray-100 font-poppins max-w-xl">
                Book premium private offices and cabins by the hour or day.
              </p>

              {/* Checklist */}
              <div className="mt-4 space-y-3 text-gray-100">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#FFD43B] flex-shrink-0" />
                  <span className="font-poppins">Quiet, dedicated workspace for deep focus</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#FFD43B] flex-shrink-0" />
                  <span className="font-poppins">Fast WiFi, power & printing included</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#FFD43B] flex-shrink-0" />
                  <span className="font-poppins">Book instantly — flexible timings</span>
                </div>
              </div>

              {/* --- NEW BUTTONS SECTION --- */}
              <div className="mt-4 flex flex-wrap gap-4">
                <button onClick={() => window.location.href = '/start-chatting'} className="bg-black text-white px-8 py-3.5 rounded-full font-bold font-poppins hover:bg-gray-900 transition-all shadow-lg active:scale-95">
                  Start Chat
                </button>
                <button className="bg-[#FFD43B] text-black px-8 py-3.5 rounded-full font-bold font-poppins hover:bg-[#eec635] transition-all shadow-lg active:scale-95">
                  Explore Spaces
                </button>
              </div>

              {/* Stats Section */}
              <div className="mt-5 w-full max-w-xl bg-black/30 backdrop-blur-sm rounded-lg p-4 flex justify-between text-center">
                <div>
                  <div className="text-2xl md:text-3xl font-bold font-geist text-white">25,000+</div>
                  <div className="text-xs md:text-sm text-gray-300 font-poppins">Day Bookings</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold font-geist text-white">2,000+</div>
                  <div className="text-xs md:text-sm text-gray-300 font-poppins">Verified Offices</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold font-geist text-white">150+</div>
                  <div className="text-xs md:text-sm text-gray-300 font-poppins">Cities & Hubs</div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE FORM (modified: office dropdown added above date) */}
          <div className="w-full lg:w-1/2 max-w-md">
            <div className="bg-white dark:bg-[#1f1f1f] rounded-xl shadow-2xl p-6 md:p-8">
              <h3 className="text-xl font-geist font-bold text-gray-900 dark:text-white"> Get a Call Back for <span className="text-[#FFD43B]">Day Offices</span> </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Available by the hour, day or as long as you need</p>
              <form className="mt-6 space-y-4" onSubmit={handleHeroSubmit}>
                <input name="name" value={heroForm.name} onChange={onHeroChange} required placeholder="Name*" className="w-full border border-gray-200 dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white rounded-md px-4 py-3 outline-none font-poppins text-sm focus:ring-1 focus:ring-[#FFD43B]" />
                <input name="mobile" value={heroForm.mobile} onChange={onHeroChange} required placeholder="Mobile number*" inputMode="tel" className="w-full border border-gray-200 dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white rounded-md px-4 py-3 outline-none font-poppins text-sm focus:ring-1 focus:ring-[#FFD43B]" />
                <input name="email" value={heroForm.email} onChange={onHeroChange} required placeholder="Email*" type="email" className="w-full border border-gray-200 dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white rounded-md px-4 py-3 outline-none font-poppins text-sm focus:ring-1 focus:ring-[#FFD43B]" />
                <div className="grid grid-cols-2 gap-3">
                  <CurvedSelect
                    value={heroForm.city}
                    onChange={(val) =>
                      onHeroChange({ target: { name: "city", value: val } })
                    }
                    options={CITIES}
                    noScroll={true}
                  />




                  <CurvedSelect
                    value={heroForm.seats}
                    onChange={(val) =>
                      onHeroChange({ target: { name: "seats", value: val } })
                    }
                    options={SEAT_OPTIONS.map((s) => `${s}`)}
                  />

                </div>

                {/* Office Name dropdown depends on selected city */}
                <CurvedSelect
                  value={heroForm.office}
                  onChange={(val) =>
                    onHeroChange({ target: { name: "office", value: val } })
                  }
                  options={CITY_OFFICES[heroForm.city] || []}
                />

                <input name="date" value={heroForm.date} onChange={onHeroChange} type="date" className="w-full border border-gray-200 rounded-md px-4 py-3 outline-none font-poppins text-sm text-gray-500 focus:ring-1 focus:ring-[#FFD43B]" />
                <Button type="submit" className="w-full bg-[#FFD43B] text-black text-base px-5 py-6 font-bold rounded-md hover:bg-[#eec635] active:scale-[0.98] transition-all">Request Call Back</Button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* ==================== SECTION : MARKETPLACE STATS ==================== */}
      <div className="w-full bg-[#F5F6FA] dark:bg-[#111] py-16 px-6 md:px-16 transition-colors duration-300">

        {/* Title */}
        <h2 className="text-center text-3xl md:text-4xl font-geist font-bold text-black dark:text-white mb-14">
          India’s Best Day Office Network
          <span className="text-[#FFD43B]"> for Focused Work</span>
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 text-center max-w-6xl mx-auto">

          {/* ITEM 1 */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[#E8EAFB] flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white">25,000+</h3>
            <p className="text-gray-700 dark:text-gray-300 font-poppins text-sm">Bookings</p>
          </div>

          {/* ITEM 2 */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[#E8EAFB] flex items-center justify-center mb-4">
              <Scan className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white">2,000+</h3>
            <p className="text-gray-700 dark:text-gray-300 font-poppins text-sm">Verified Offices</p>
          </div>

          {/* ITEM 3 */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[#E8EAFB] flex items-center justify-center mb-4">
              <Building2 className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white">150+</h3>
            <p className="text-gray-700 dark:text-gray-300 font-poppins text-sm">Cities & Hubs</p>
          </div>

          {/* ITEM 4 */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[#E8EAFB] flex items-center justify-center mb-4">
              <MapPin className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white">150+</h3>
            <p className="text-gray-700 dark:text-gray-300 font-poppins text-sm">Prime Locations</p>
          </div>

          {/* ITEM 5 */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[#E8EAFB] flex items-center justify-center mb-4">
              <DollarSign className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white">Affordable</h3>
            <p className="text-gray-700 dark:text-gray-300 font-poppins text-sm">Transparent pricing</p>
          </div>

        </div>
      </div>

      {/* ==================== OFFICE TYPES (conversion-focused cards) ==================== */}
      <div className="w-full bg-white dark:bg-[#0a0a0a] py-20 px-6 md:px-16 transition-colors duration-300">
        <div className="text-center max-w-4xl mx-auto mb-14">
          <h2 className="text-4xl font-geist font-bold text-black dark:text-white">
            Flexible <span className="text-[#FFD43B]">Day Offices</span> for Every Need
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg font-poppins">Choose a workspace that fits your day — private, premium or team-ready.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {OFFICE_CARDS.map((card) => (
            <div
              key={card.name}
              className="bg-white dark:bg-[#1f1f1f] shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 flex flex-col"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-geist font-bold text-black dark:text-white">{card.name}</h3>

                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-poppins">{card.price}</div>

                <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-300 font-poppins text-sm flex-1">
                  {card.points.map((p: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#FFD43B] mt-0.5 flex-shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex gap-3">
                  <Button
                    onClick={() => openModal(card)}
                    className="w-[70%] bg-[#FFD43B] border-2 border-[#FFD43B] text-black font-semibold py-2 rounded-lg hover:bg-[#e6c234] transition-colors"
                  >
                    {card.btn}
                  </Button>

                  <button
                    className="w-[30%] border border-gray-200 rounded-lg py-2 font-medium hover:shadow-sm"
                    onClick={() => alert("Added to itinerary")}
                  >
                    Save
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== BOOKING MODAL ==================== */}
      {showModal && selectedOffice && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

            {/* MODAL HEADER */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
              <h3 className="text-xl font-geist font-bold">Book {selectedOffice.name}</h3>
              <button
                className="text-gray-500 hover:text-black bg-gray-200 rounded-full p-1"
                onClick={() => setShowModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8">

              {/* LEFT SIDE */}
              <div className="border-r pr-6 hidden md:flex flex-col justify-between border-gray-100">

                {/* TOP: TITLE + LOGOS */}
                <div>
                  <h4 className="font-geist text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    Trusted by over 5,000+ Clients ✨
                  </h4>

                  <div className="grid grid-cols-3 gap-1 mb-8">
                    <img src="/Logo/trulymadly.png" className="h-14 w-24 object-contain border-2 border-gray-300 opacity-80 transition-transform duration-300 hover:scale-125 hover:shadow-lg rounded-md" alt="trulymadly" />
                    <img src="/Logo/StudyIQ.png" className="h-14 w-24 object-contain border-2 border-gray-300 opacity-80 transition-transform duration-300 hover:scale-125 hover:shadow-lg rounded-md" alt="StudyIQ" />
                    <img src="/Logo/Stage2.png" className="h-14 w-24 object-contain border-2 border-gray-300 opacity-80 transition-transform duration-300 hover:scale-125 hover:shadow-lg rounded-md" alt="Stage2" />
                    <img src="/Logo/luv.png" className="h-14 w-24 object-contain border-2 border-gray-300 opacity-80 transition-transform duration-300 hover:scale-125 hover:shadow-lg rounded-md" alt="luv" />
                    {/* <img src="/Logo/flipkart.png" className="h-14 w-24 object-contain border-2 border-gray-300 opacity-80 transition-transform duration-300 hover:scale-125 hover:shadow-lg rounded-md" alt="flipkart" /> */}
                    <img src="/Logo/Adda247.png" className="h-14 w-24 object-contain border-2 border-gray-300 opacity-80 transition-transform duration-300 hover:scale-125 hover:shadow-lg rounded-md" alt="Adda247" />
                  </div>

                  <ul className="space-y-4 font-poppins text-gray-700">
                    <li className="flex items-center gap-3">
                      <div className="bg-[#FFD43B]/20 p-2 rounded-full">
                        <CheckCircle className="w-5 h-5 text-[#FFD43B]" />
                      </div>
                      <span className="font-medium">Ready for use whenever required</span>
                    </li>

                    <li className="flex items-center gap-3">
                      <div className="bg-[#FFD43B]/20 p-2 rounded-full">
                        <CheckCircle className="w-5 h-5 text-[#FFD43B]" />
                      </div>
                      <span className="font-medium">Fully Equipped with all Amenities</span>
                    </li>

                    <li className="flex items-center gap-3">
                      <div className="bg-[#FFD43B]/20 p-2 rounded-full">
                        <CheckCircle className="w-5 h-5 text-[#FFD43B]" />
                      </div>
                      <span className="font-medium">Prime Locations, Pan India Access</span>
                    </li>

                  </ul>
                </div>

                {/* BOTTOM LEFT – FAVICON */}
                <div className="mt-10 flex justify-center">
                  <img
                    src="/Logo/FlashSpace Favicon.png"
                    className="h-14 w-14 rounded-full border-2 border-gray-300 opacity-80 transition-transform duration-300 hover:scale-125 hover:shadow-lg"
                    alt="FlashSpace Favicon"
                  />
                </div>

              </div>

              {/* RIGHT SIDE FORM */}
              <div>
                <form className="space-y-4 font-poppins" onSubmit={(e) => { e.preventDefault(); alert("Booking request submitted!"); setShowModal(false); }}>
                  <div>
                    <label className="text-xs font-semibold text-black-500 uppercase">Name</label>
                    <input type="text" placeholder="John Doe" className="w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-[#FFD43B] outline-none" required />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-black-500 uppercase">Mobile</label>
                    <input type="tel" placeholder="+91 98765 43210" className="w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-[#FFD43B] outline-none" required />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-black-500 uppercase">Work Email</label>
                    <input type="email" placeholder="john@company.com" className="w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-[#FFD43B] outline-none" required />
                  </div>

                  <div>
                    <label className="text-xs  font-semibold  text-black-500 uppercase">Date</label>
                    <input type="date" className="w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-[#FFD43B] outline-none text-gray-500" required />
                  </div>

                  <Button className="w-full bg-[#FFD43B] text-black font-bold py-6 rounded-lg hover:bg-[#eec635] mt-2">
                    Request Booking
                  </Button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==================== SECTION 3: TOP CITIES (FIXED LAYOUT) ==================== */}
      <div className="w-full bg-white dark:bg-[#0a0a0a] py-20 px-6 md:px-16 transition-colors duration-300">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-4xl font-geist font-bold text-black dark:text-white">Premium Day Offices in  <span className="text-[#FFD43B]">Prime Business Locations</span></h2>
          <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg font-poppins">Discover premium day office spaces across major business hubs.</p>
        </div>

        {/* Grid Container: Fixed height of 600px on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:h-[600px]">
          {(() => {
            const CityCard = ({ item, className }: { item: any, className?: string }) => (
              <div className={`relative w-full rounded-2xl overflow-hidden group cursor-pointer min-h-0 ${className}`}>
                <img
                  src={item.image}
                  alt={item.city}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 flex items-end justify-center pb-6 pointer-events-none">
                  <h3 className="text-xl md:text-2xl font-geist font-bold text-white tracking-wide z-10 relative">{item.city}</h3>
                </div>
              </div>
            );

            return (
              <>
                <div className="flex flex-col gap-4 h-full">
                  <CityCard item={CITY_DATA[0]} className="h-64 md:h-auto md:flex-1" />
                  <CityCard item={CITY_DATA[1]} className="h-64 md:h-auto md:flex-1" />
                </div>
                <div className="flex flex-col gap-4 h-full">
                  <CityCard item={CITY_DATA[2]} className="h-64 md:h-auto md:flex-1" />
                  <CityCard item={CITY_DATA[3]} className="h-64 md:h-auto md:flex-1" />
                  <CityCard item={CITY_DATA[4]} className="h-64 md:h-auto md:flex-1" />
                </div>
                <div className="flex flex-col gap-4 h-full">
                  <CityCard item={CITY_DATA[5]} className="h-64 md:h-auto md:flex-1" />
                  <CityCard item={CITY_DATA[6]} className="h-64 md:h-auto md:flex-1" />
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* ==================== SECTION 4: AMENITIES ==================== */}
      <div className="w-full bg-white dark:bg-[#0a0a0a] py-20 px-6 md:px-16 transition-colors duration-300">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-4xl font-geist font-bold text-black dark:text-white">Enjoy these amenities  <span className="text-[#FFD43B]"> with your booking.</span></h2>
          <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg font-poppins">Focus on what matters to you, and we’ll handle the rest to ensure a smooth and efficient working experience.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 text-center">
          {AMENITIES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center gap-4 group p-4 hover:bg-gray-50 dark:hover:bg-black/20 rounded-xl transition-all duration-300">
                <div className="w-20 h-20 bg-gray-100 dark:bg-[#1f1f1f] group-hover:bg-white dark:group-hover:bg-[#0a0a0a] group-hover:shadow-md border border-transparent group-hover:border-gray-200 dark:border-white/10 transition-all duration-300 rounded-full flex items-center justify-center">
                  <Icon className="w-10 h-10 text-gray-600 group-hover:text-[#FFD43B] transition-colors" />
                </div>
                <h3 className="text-md font-poppins text-gray-800 dark:text-gray-200 font-semibold group-hover:text-black dark:group-hover:text-white">{item.title}</h3>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================== SECTION Why book ==================== */}
      <div className="w-full bg-gray-50 dark:bg-[#111] py-20 px-6 md:px-16 transition-colors duration-300">
        <div className="text-center max-w-3xl mx-auto mb-14"><h2 className="text-4xl font-geist font-bold text-black dark:text-white">Why book Day Offices with <span className="text-[#FFD43B]">Flashspace</span></h2><p className="text-gray-600 dark:text-gray-300 mt-3 text-lg font-poppins">Smart, reliable and well-equipped spaces designed to support every type of workday.</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {BENEFITS.map((item, i) => { const Icon = item.icon; return (<div key={i} className="bg-white dark:bg-[#1f1f1f] p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"> <div className="w-14 h-14 flex items-center justify-center bg-[#FFD43B] rounded-xl mb-6"> <Icon className="w-7 h-7 text-black" /> </div> <h3 className="text-xl font-geist font-bold text-black dark:text-white mb-3"> {item.title} </h3> <p className="text-gray-600 dark:text-gray-300 font-poppins leading-relaxed text-sm"> {item.desc} </p> </div>); })}
        </div>
      </div>

      {/* ==================== SECTION 6  clients have to say ==================== */}
      <div className="w-full bg-white dark:bg-[#0a0a0a] py-20 px-6 md:px-16 transition-colors duration-300">

        {/* SECTION TITLE */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-4xl font-geist font-bold text-black dark:text-white">
            What our clients <span className="text-[#FFD43B]">have to say</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 font-poppins mt-3 text-lg">
            Real experiences from teams and professionals who trust Flashspace for their important workdays.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1f1f1f] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden"
            >

              {/* CARD TOP */}
              <div className="p-8">

                {/* YELLOW QUOTE ICON */}
                <div className="text-[#FFD43B] mb-4">
                  <svg width="32" height="32" fill="#FFD43B" viewBox="0 0 24 24">
                    <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17v6.33A.5.5 0 0 0 2.5 18H8a.5.5 0 0 0 .5-.5v-6.33A5.17 5.17 0 0 0 3.33 6zm10 0A5.17 5.17 0 0 0 12 11.17v6.33a.5.5 0 0 0 .5.5H18a.5.5 0 0 0 .5-.5v-6.33A5.17 5.17 0 0 0 17.17 6z" />
                  </svg>
                </div>

                {/* MAIN TEXT */}
                <p className="text-gray-800 dark:text-gray-200 font-poppins leading-relaxed italic font-semibold mb-4">
                  {item.text}
                </p>



              </div>

              {/* BOTTOM SECTION */}
              <div className="relative bg-[#FFF9DB] dark:bg-[#2a2510] border-t-4 border-[#FFD43B] p-6 pt-10">

                {/* IMAGE */}
                <img
                  src={item.image}
                  className="absolute -top-10 right-6 w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                />

                {/* NAME + ROLE + COMPANY (3 different lines) */}
                <h4 className="text-lg font-geist font-bold text-black dark:text-white mb-1">
                  {item.name}
                </h4>

                <p className="text-sm text-gray-700 dark:text-gray-300 font-poppins mb-1">
                  {item.role}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>

      {/* ==================== SECTION 7 F&Q ==================== */}
      <div className="w-full bg-white dark:bg-[#0a0a0a] py-20 px-6 md:px-16 transition-colors duration-300">
        <div className="text-center max-w-3xl mx-auto mb-14"><h2 className="text-4xl font-geist font-bold text-black dark:text-white">Frequently Asked <span className="text-[#FFD43B]">Questions</span></h2><p className="text-gray-600 dark:text-gray-300 mt-3 text-lg font-poppins">Find answers to the most common questions about our day office services.</p></div>
        <div className="max-w-3xl mx-auto space-y-4">
          {FAQ_DATA.map((item, i) => (<div key={i} className={`border rounded-xl transition-all duration-300 ${faqOpenIndex === i ? 'border-[#FFD43B] shadow-md bg-[#FFD43B]/5 dark:bg-[#FFD43B]/10' : 'border-gray-200 dark:border-white/10 hover:border-gray-300'}`}> <button onClick={() => toggleFAQ(i)} className="w-full flex justify-between items-center p-5 text-left"> <span className="text-lg font-geist font-semibold text-black dark:text-white"> {item.q} </span> <ChevronDown className={`w-5 h-5 text-black dark:text-white transition-transform duration-300 ${faqOpenIndex === i ? "rotate-180" : ""}`} /> </button> <div className={`overflow-hidden transition-all duration-300 ${faqOpenIndex === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}> <p className="text-gray-600 dark:text-gray-300 font-poppins leading-relaxed px-5 pb-5 text-sm"> {item.a} </p> </div> </div>))}
        </div>
      </div>

      {/* ==================== SECTION  8  footer ==================== */}
      <div className="w-full bg-white dark:bg-[#0a0a0a]"><Footer /></div>
    </div>
  );
};

export default DayOfficePage;
