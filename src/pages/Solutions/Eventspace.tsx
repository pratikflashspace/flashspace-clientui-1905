// EventSpace.tsx
import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import CurvedSelect from "@/components/ui/CurvedSelect";

import {
  CheckCircle,
  MapPin,
  Users,
  Scan,
  Building2,
  DollarSign,
  Monitor,
  Wifi,
  Printer,
  Coffee,
  ParkingCircle,
  Shield,
  Headphones,
  Clock4,
  Laptop,
  BadgeCheck,
  ChevronDown,
  X,
  Briefcase,
} from "lucide-react";

/**
 * EVENT SPACE PAGE
 * - Structure and styling intentionally follows your Meeting Rooms / Day Office pages
 * - Hero: Corporate & Clean (Q1 A)
 * - Event types: 8 most popular (Q2)
 * - City dropdown only in the hero form (Q3 B)
 */

// Hero / form constants
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
const SEAT_OPTIONS = ["10-50", "50-100", "100-250", "250+"];

// Event type cards (8 most popular)
const EVENT_CARDS = [
  {
    name: "Conference Hall",
    image: "https://i.pinimg.com/1200x/a4/67/c1/a467c17fd4aeab319e27bd9360cdb19e.jpg",
    btn: "Book Conference Hall",
    points: ["Large seating capacity", "Stage & podium", "Ideal for large corporate events"],
    price: "From ₹5,999",
  },
  {
    name: "Seminar Room",
    image: "https://i.pinimg.com/1200x/ac/be/60/acbe6053a33e53961d6434ba1ad04bb6.jpg",
    btn: "Book Seminar Room",
    points: ["Classroom seating", "Projection & sound", "Great for educational events"],
    price: "From ₹2,999",
  },
  {
    name: "Training Room",
    image: "https://i.pinimg.com/1200x/af/2e/09/af2e0906dd64dbdd2b94684f6d83f023.jpg",
    btn: "Book Training Room",
    points: ["Hands-on layout", "Whiteboards & projectors", "Perfect for workshops"],
    price: "From ₹3,499",
  },
  {
    name: "Workshop Venue",
    image: "https://i.pinimg.com/1200x/8e/56/10/8e5610197ce6ce5caa21916a4cec2691.jpg",
    btn: "Book Workshop Venue",
    points: ["Flexible seating", "Breakout area", "Creative workshop setups"],
    price: "From ₹3,999",
  },
  {
    name: "Product Launch Space",
    image: "https://i.pinimg.com/1200x/9f/7d/c0/9f7dc0d68673433bca362265131881dd.jpg",
    btn: "Book Launch Space",
    points: ["Stage & lighting", "AV support & live streaming", "Brand presentation-ready"],
    price: "From ₹9,999",
  },
  {
    name: "Corporate Event Hall",
    image: "https://i.pinimg.com/736x/14/86/57/148657c33768af40134456833fad0afa.jpg",
    btn: "Book Corporate Hall",
    points: ["Catering-friendly", "Large capacity", "Ideal for company events"],
    price: "From ₹7,499",
  },
  {
    name: "Networking Event Space",
    image: "https://i.pinimg.com/736x/10/04/7c/10047c6ec350896b78308fb814a7e042.jpg",
    btn: "Book Networking Space",
    points: ["Open layout", "Casual lounge zones", "Great for meetups & mixers"],
    price: "From ₹4,499",
  },
  {
    name: "Board Room (Event-Ready)",
    image: "https://i.pinimg.com/736x/49/8f/67/498f677019b4b1588bf2dd92f75d19d2.jpg",
    btn: "Book Board Room",
    points: ["Executive setup", "AV & teleconferencing", "Perfect for investor events"],
    price: "From ₹3,999",
  },
];

// City showcase data
const CITY_DATA = [
  { city: "Delhi NCR", image: "https://i.pinimg.com/1200x/57/eb/c6/57ebc6202b5285a16b70409bcd8cbb75.jpg" },
  { city: "Mumbai", image: "https://i.pinimg.com/1200x/43/92/b1/4392b1a5e8147fadf88f24b4234e494a.jpg" },
  { city: "Bengaluru", image: "https://i.pinimg.com/1200x/c8/32/0e/c8320e39b40f46ab92ab126f506e9efb.jpg" },
  { city: "Hyderabad", image: "https://i.pinimg.com/736x/99/22/2c/99222ca1ba5b0576d603e1c125222939.jpg" },
  { city: "Pune", image: "https://i.pinimg.com/1200x/0f/72/56/0f7256680adbf0d90acae0a948aaa298.jpg" },
  { city: "Chennai", image: "https://i.pinimg.com/736x/64/aa/1f/64aa1fc35c38de237aef7fc3a0eaff89.jpg" },
  { city: "Ahmedabad", image: "https://i.pinimg.com/1200x/7c/04/24/7c0424d62908bed32f3dd21fd92d39d8.jpg" },
];

// Amenities
const AMENITIES = [
  { icon: Monitor, title: "Advanced AV Systems" },
  { icon: Wifi, title: "High-Speed Internet" },
  { icon: Printer, title: "Printing & Badge Printing" },
  { icon: Coffee, title: "On-Demand Catering & Coffee" },
  { icon: ParkingCircle, title: "Vehicle Parking" },
  { icon: Shield, title: "Secure Access" },
  { icon: Headphones, title: "Soundproofing Options" },
  { icon: Clock4, title: "Flexible Timings" },
];

// Why event space needed
const WHY_EVENT = [
  { icon: Monitor, title: "Professional Environment", desc: "A dedicated venue projects credibility and delivers a focused experience for attendees." },
  { icon: Users, title: "Large Capacity & Logistics", desc: "Seating, parking and logistics are handled — so you can focus on the event." },
  { icon: BadgeCheck, title: "Advanced AV & Support", desc: "Microphones, projectors, streaming and technical support ensure smooth delivery." },
  { icon: Laptop, title: "Higher Engagement", desc: "Purpose-built venues with breakout and networking zones increase attendee engagement." },
  { icon: Briefcase, title: "Brand Presentation", desc: "Control branding, stage design and ambience to make an impact." },
  { icon: Shield, title: "Operational Ease", desc: "Catering, seating and on-site staff simplify event operations." },
];

// Benefits, testimonials and FAQ (concise)
const BENEFITS = [
  { icon: Clock4, title: "Instant Bookings", desc: "Reserve event venues with quick confirmation and simple pricing." },
  { icon: MapPin, title: "Central Locations", desc: "Venues located in prime business districts for attendee convenience." },
  { icon: Shield, title: "Trusted Venues", desc: "All locations vetted and quality-checked by our team." },
];

const TESTIMONIALS = [
  { name: "Amit Shah", role: "Head Events, TechSummit", image: "https://randomuser.me/api/portraits/men/12.jpg", text: "Excellent AV, smooth execution and great location — highly recommended." },
  { name: "Rhea Kapoor", role: "HR Lead, FinEdge", image: "https://randomuser.me/api/portraits/women/44.jpg", text: "Catering and logistics were seamless. The venue made our training successful." },
  { name: "Nikhil Rao", role: "Founder, StartBox", image: "https://randomuser.me/api/portraits/men/32.jpg", text: "Perfect space for our product launch — great acoustics and support." },
];

const FAQ_DATA = [
  { q: "Can I book an event space for half a day?", a: "Yes. Many venues support half-day, full-day and multi-day bookings depending on availability." },
  { q: "Do you provide AV and technical support?", a: "Yes — most venues include AV setup and on-site technical assistance at additional cost." },
  { q: "Can I arrange catering?", a: "Yes — we partner with local caterers and can arrange food & beverage as per your needs." },
  { q: "What is the typical capacity?", a: "Capacities vary by venue; we offer options from intimate board rooms to large conference halls." },
];

const EventSpacePage: React.FC = () => {
  const [heroForm, setHeroForm] = useState({ name: "", mobile: "", email: "", city: CITIES[0], seats: SEAT_OPTIONS[0], date: "" });
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  function onHeroChange(e: any) {
    const { name, value } = e.target ?? e;
    setHeroForm((s) => ({ ...s, [name]: value }));
  }
  function handleHeroSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Request received — our events team will reach out shortly.");
  }
  const openModal = (card: any) => {
    setSelectedEvent(card);
    setShowModal(true);
  };
  const toggleFAQ = (index: number) => setFaqOpenIndex(faqOpenIndex === index ? null : index);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <Header />

      {/* HERO */}
      <section className="relative w-full h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1074&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col lg:flex-row gap-12 items-center justify-center lg:justify-between pt-20 lg:pt-0">

          {/* LEFT */}
          <div className="w-full lg:w-2/3 text-white lg:-ml-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD43B] bg-white/10 backdrop-blur-md px-6 py-2 shadow-sm">
                <Sparkles className="w-4 h-4 text-[#FFD43B] fill-[#FFD43B]" />
                <span className="text-[#FFD43B] font-poppins font-bold text-sm tracking-wide">Professional Event Venues</span>
              </div>

              <h1 className="mt-3 text-4xl md:text-6xl font-bold leading-tight font-geist">
                Premium Event Spaces <br />
                <span className="text-[#FFD43B]">for Every Occasion</span>
              </h1>

              <p className="mt-4 text-lg md:text-xl text-gray-100 font-poppins max-w-xl">
                Book conference halls, seminar rooms and launch venues with professional AV and logistics support.
              </p>

              <div className="mt-4 space-y-3 text-gray-100">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#FFD43B] flex-shrink-0" />
                  <span className="font-poppins">Fully equipped venues with technical support</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#FFD43B] flex-shrink-0" />
                  <span className="font-poppins">Catering, seating and logistics handled</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#FFD43B] flex-shrink-0" />
                  <span className="font-poppins">Prime locations and easy access</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4">
                <button onClick={() => window.location.href = '/start-chatting'} className="bg-black text-white px-8 py-3.5 rounded-full font-bold font-poppins hover:bg-gray-900 transition-all shadow-lg active:scale-95">Start Chat</button>
                <button className="bg-[#FFD43B] text-black px-8 py-3.5 rounded-full font-bold font-poppins hover:bg-[#eec635] transition-all shadow-lg active:scale-95">Explore Venues</button>
              </div>

              {/* Stats Section */}
              <div className="mt-5 w-full max-w-xl bg-black/30 backdrop-blur-sm rounded-lg p-4 flex justify-between text-center">
                <div>
                  <div className="text-2xl md:text-3xl font-bold font-geist text-white">10,000+</div>
                  <div className="text-xs md:text-sm text-gray-300 font-poppins">Events Hosted</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold font-geist text-white">2500+</div>
                  <div className="text-xs md:text-sm text-gray-300 font-poppins">Verified Venues</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold font-geist text-white">200+</div>
                  <div className="text-xs md:text-sm text-gray-300 font-poppins">Cities & Hubs</div>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="w-full lg:w-1/2 max-w-md">
            <div className="bg-white dark:bg-[#1f1f1f] rounded-xl shadow-2xl p-6 md:p-8">
              <h3 className="text-xl font-geist font-bold text-gray-900 dark:text-white"> Get a Call Back for <span className="text-[#FFD43B]">Event Spaces</span> </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Conference halls, seminar rooms and launch venues across premium locations</p>

              <form className="mt-6 space-y-4" onSubmit={handleHeroSubmit}>
                <input name="name" value={heroForm.name} onChange={onHeroChange} required placeholder="Name*" className="w-full border border-gray-200 dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white rounded-md px-4 py-3 outline-none font-poppins text-sm focus:ring-1 focus:ring-[#FFD43B]" />
                <input name="mobile" value={heroForm.mobile} onChange={onHeroChange} required placeholder="Mobile number*" inputMode="tel" className="w-full border border-gray-200 dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white rounded-md px-4 py-3 outline-none font-poppins text-sm focus:ring-1 focus:ring-[#FFD43B]" />
                <input name="email" value={heroForm.email} onChange={onHeroChange} required placeholder="Email*" type="email" className="w-full border border-gray-200 dark:border-white/10 dark:bg-[#0a0a0a] dark:text-white rounded-md px-4 py-3 outline-none font-poppins text-sm focus:ring-1 focus:ring-[#FFD43B]" />

                <div className="grid grid-cols-2 gap-3">
                  <CurvedSelect value={heroForm.city} onChange={(val: string) => onHeroChange({ target: { name: "city", value: val } })} options={CITIES} noScroll />
                  <CurvedSelect value={heroForm.seats} onChange={(val: string) => onHeroChange({ target: { name: "seats", value: val } })} options={SEAT_OPTIONS} />
                </div>

                <input name="date" value={heroForm.date} onChange={onHeroChange} type="date" className="w-full border border-gray-200 rounded-md px-4 py-3 outline-none font-poppins text-sm text-gray-500 focus:ring-1 focus:ring-[#FFD43B]" />

                <Button type="submit" className="w-full bg-[#FFD43B] text-black text-base px-5 py-6 font-bold rounded-md hover:bg-[#eec635] active:scale-[0.98] transition-all">Request Call Back</Button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* STATS */}
      <div className="w-full bg-[#F5F6FA] dark:bg-[#111] py-16 px-6 md:px-16 transition-colors duration-300">
        <h2 className="text-center text-3xl md:text-4xl font-geist font-bold text-black dark:text-white mb-14">India’s Leading Event Venues <span className="text-[#FFD43B]">for Professional Events</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 text-center max-w-6xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[#E8EAFB] flex items-center justify-center mb-4"><Users className="w-10 h-10 text-black" /></div>
            <h3 className="text-2xl font-bold text-black dark:text-white">10,000+</h3>
            <p className="text-gray-700 dark:text-gray-300 font-poppins text-sm">Events Hosted</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[#E8EAFB] flex items-center justify-center mb-4"><Scan className="w-10 h-10 text-black" /></div>
            <h3 className="text-2xl font-bold text-black dark:text-white">2,500+</h3>
            <p className="text-gray-700 dark:text-gray-300 font-poppins text-sm">Verified Venues</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[#E8EAFB] flex items-center justify-center mb-4"><Building2 className="w-10 h-10 text-black" /></div>
            <h3 className="text-2xl font-bold text-black dark:text-white">200+</h3>
            <p className="text-gray-700 dark:text-gray-300 font-poppins text-sm">Cities & Hubs</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[#E8EAFB] flex items-center justify-center mb-4"><MapPin className="w-10 h-10 text-black" /></div>
            <h3 className="text-2xl font-bold text-black dark:text-white">150+</h3>
            <p className="text-gray-700 dark:text-gray-300 font-poppins text-sm">Prime Locations</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[#E8EAFB] flex items-center justify-center mb-4"><DollarSign className="w-10 h-10 text-black" /></div>
            <h3 className="text-2xl font-bold text-black dark:text-white">Transparent</h3>
            <p className="text-gray-700 dark:text-gray-300 font-poppins text-sm">Pricing & Quotes</p>
          </div>
        </div>
      </div>

      {/* EVENT TYPES */}
      <div className="w-full bg-white dark:bg-[#0a0a0a] py-20 px-6 md:px-16 transition-colors duration-300">
        <div className="text-center max-w-4xl mx-auto mb-14">
          <h2 className="text-4xl font-geist font-bold text-black dark:text-white">Popular <span className="text-[#FFD43B]">Event Spaces</span></h2>
          <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg font-poppins">Spaces built for conferences, launches, workshops and corporate gatherings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {EVENT_CARDS.map((card) => (
            <div key={card.name} className="bg-white dark:bg-[#1f1f1f] shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 flex flex-col">
              <div className="h-48 overflow-hidden"><img src={card.image} alt={card.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" /></div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-geist font-bold text-black dark:text-white">{card.name}</h3>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-poppins">{card.price}</div>
                <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-300 font-poppins text-sm flex-1">{card.points.map((p: string, idx: number) => (<li key={idx} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#FFD43B] mt-0.5 flex-shrink-0" /><span>{p}</span></li>))}</ul>

                <div className="mt-6 flex gap-3">
                  <Button onClick={() => openModal(card)} className="w-[70%] bg-[#FFD43B] border-2 border-[#FFD43B] text-black font-semibold py-2 rounded-lg hover:bg-[#e6c234] transition-colors">{card.btn}</Button>
                  <button className="w-[30%] border border-gray-200 rounded-lg py-2 font-medium hover:shadow-sm" onClick={() => alert("Added to itinerary")}>Save</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOOKING MODAL */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
              <h3 className="text-xl font-geist font-bold">Book {selectedEvent.name}</h3>
              <button className="text-gray-500 hover:text-black bg-gray-200 rounded-full p-1" onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8">
              <div className="border-r pr-6 hidden md:flex flex-col justify-between border-gray-100">
                <div>
                  <h4 className="font-geist text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">Trusted by thousands of professionals</h4>
                  <div className="grid grid-cols-3 gap-1 mb-8">

                    <img src="/Logo/trulymadly.png" className="h-14 w-24 object-contain border-2 border-gray-300 opacity-80 transition-transform duration-300 hover:scale-125 hover:shadow-lg rounded-md" alt="trulymadly" />
                    <img src="/Logo/StudyIQ.png" className="h-14 w-24 object-contain border-2 border-gray-300 opacity-80 transition-transform duration-300 hover:scale-125 hover:shadow-lg rounded-md" alt="StudyIQ" />
                    <img src="/Logo/Stage2.png" className="h-14 w-24 object-contain border-2 border-gray-300 opacity-80 transition-transform duration-300 hover:scale-125 hover:shadow-lg rounded-md" alt="Stage2" />
                    <img src="/Logo/luv.png" className="h-14 w-24 object-contain border-2 border-gray-300 opacity-80 transition-transform duration-300 hover:scale-125 hover:shadow-lg rounded-md" alt="luv" />
                    <img src="/Logo/flipkart.png" className="h-14 w-24 object-contain border-2 border-gray-300 opacity-80 transition-transform duration-300 hover:scale-125 hover:shadow-lg rounded-md" alt="flipkart" />
                    <img src="/Logo/Adda247.png" className="h-14 w-24 object-contain border-2 border-gray-300 opacity-80 transition-transform duration-300 hover:scale-125 hover:shadow-lg rounded-md" alt="Adda247" />
                  </div>
                  <ul className="space-y-4 font-poppins text-gray-700">
                    <li className="flex items-center gap-3"><div className="bg-[#FFD43B]/20 p-2 rounded-full"><CheckCircle className="w-5 h-5 text-[#FFD43B]" /></div><span className="font-medium">Event-ready staff & support</span></li>
                    <li className="flex items-center gap-3"><div className="bg-[#FFD43B]/20 p-2 rounded-full"><CheckCircle className="w-5 h-5 text-[#FFD43B]" /></div><span className="font-medium">Catering & logistics support</span></li>
                    <li className="flex items-center gap-3"><div className="bg-[#FFD43B]/20 p-2 rounded-full"><CheckCircle className="w-5 h-5 text-[#FFD43B]" /></div><span className="font-medium">Flexible seating & layout</span></li>
                  </ul>
                </div>
                <div className="mt-10 flex justify-center">
                  <img
                    src="/Logo/FlashSpace Favicon.png"
                    className="h-14 w-14 rounded-full border-2 border-gray-300 opacity-80 transition-transform duration-300 hover:scale-125 hover:shadow-lg"
                    alt="FlashSpace Favicon"
                  />
                </div>
              </div>

              <div>
                <form className="space-y-4 font-poppins" onSubmit={(e) => { e.preventDefault(); alert("Booking request submitted!"); setShowModal(false); }}>
                  <div><label className="text-xs font-semibold text-black-500 uppercase">Name</label><input type="text" placeholder="John Doe" className="w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-[#FFD43B] outline-none" required /></div>
                  <div><label className="text-xs font-semibold text-black-500 uppercase">Mobile</label><input type="tel" placeholder="+91 98765 43210" className="w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-[#FFD43B] outline-none" required /></div>
                  <div><label className="text-xs font-semibold text-black-500 uppercase">Email</label><input type="email" placeholder="john@company.com" className="w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-[#FFD43B] outline-none" required /></div>
                  <div><label className="text-xs  font-semibold  text-black-500 uppercase">Date</label><input type="date" className="w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-[#FFD43B] outline-none text-gray-500" required /></div>
                  <div className="grid grid-cols-2 gap-3"><Button type="submit" className="w-full bg-[#FFD43B] text-black font-bold py-3 rounded-lg hover:bg-[#eec635]">Request Booking</Button><Button type="button" onClick={() => { navigator.clipboard?.writeText(selectedEvent.name || ""); alert("Event copied to clipboard"); }} className="w-full bg-white border border-gray-200 text-black py-3 rounded-lg">Share</Button></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOP CITIES */}
      <div className="w-full bg-white dark:bg-[#0a0a0a] py-20 px-6 md:px-16 transition-colors duration-300">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-4xl font-geist font-bold text-black dark:text-white">Event Venues in <span className="text-[#FFD43B]">Top Locations</span></h2>
          <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg font-poppins">Premium event spaces available across prime business hubs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:h-[600px]">
          {(() => {
            const CityCard = ({ item, className }: { item: any; className?: string }) => (
              <div className={`relative w-full rounded-2xl overflow-hidden group cursor-pointer min-h-0 ${className}`}>
                <img src={item.image} alt={item.city} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 flex items-end justify-center pb-6 pointer-events-none"><h3 className="text-xl md:text-2xl font-geist font-bold text-white tracking-wide z-10 relative">{item.city}</h3></div>
              </div>
            );

            return (<>
              <div className="flex flex-col gap-4 h-full"><CityCard item={CITY_DATA[0]} className="h-64 md:h-auto md:flex-1" /><CityCard item={CITY_DATA[1]} className="h-64 md:h-auto md:flex-1" /></div>
              <div className="flex flex-col gap-4 h-full"><CityCard item={CITY_DATA[2]} className="h-64 md:h-auto md:flex-1" /><CityCard item={CITY_DATA[3]} className="h-64 md:h-auto md:flex-1" /><CityCard item={CITY_DATA[4]} className="h-64 md:h-auto md:flex-1" /></div>
              <div className="flex flex-col gap-4 h-full"><CityCard item={CITY_DATA[5]} className="h-64 md:h-auto md:flex-1" /><CityCard item={CITY_DATA[6]} className="h-64 md:h-auto md:flex-1" /></div>
            </>);
          })()}
        </div>
      </div>

      {/* AMENITIES */}
      <div className="w-full bg-white dark:bg-[#0a0a0a] py-20 px-6 md:px-16 transition-colors duration-300">
        <div className="text-center max-w-3xl mx-auto mb-14"><h2 className="text-4xl font-geist font-bold text-black dark:text-white">Amenities for <span className="text-[#FFD43B]">Event Hosts</span></h2><p className="text-gray-600 dark:text-gray-300 mt-3 text-lg font-poppins">Everything you need to run a successful event.</p></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 text-center">{AMENITIES.map((item, idx) => { const Icon = item.icon; return (<div key={idx} className="flex flex-col items-center gap-4 group p-4 hover:bg-gray-50 dark:hover:bg-black/20 rounded-xl transition-all duration-300"><div className="w-20 h-20 bg-gray-100 dark:bg-[#1f1f1f] group-hover:bg-white dark:group-hover:bg-[#0a0a0a] group-hover:shadow-md border border-transparent group-hover:border-gray-200 dark:group-hover:border-white/10 transition-all duration-300 rounded-full flex items-center justify-center"><Icon className="w-10 h-10 text-gray-600 group-hover:text-[#FFD43B] transition-colors" /></div><h3 className="text-md font-poppins text-gray-800 dark:text-gray-200 font-semibold group-hover:text-black dark:group-hover:text-white">{item.title}</h3></div>); })}</div>
      </div>

      {/* WHY EVENT SPACE NEEDED */}
      <div className="w-full bg-gray-50 dark:bg-[#111] py-20 px-6 md:px-16 transition-colors duration-300">
        <div className="text-center max-w-3xl mx-auto mb-14"><h2 className="text-4xl font-geist font-bold text-black dark:text-white">Why an <span className="text-[#FFD43B]">Event Space</span> is Needed</h2><p className="text-gray-600 dark:text-gray-300 mt-3 text-lg font-poppins">Choose a purpose-built venue to ensure your event succeeds — here’s why it matters.</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">{WHY_EVENT.map((item, i) => { const Icon = item.icon; return (<div key={i} className="bg-white dark:bg-[#1f1f1f] p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"><div className="w-14 h-14 flex items-center justify-center bg-[#FFD43B] rounded-xl mb-6"><Icon className="w-7 h-7 text-black" /></div><h3 className="text-xl font-geist font-bold text-black dark:text-white mb-3">{item.title}</h3><p className="text-gray-600 dark:text-gray-300 font-poppins leading-relaxed text-sm">{item.desc}</p></div>); })}</div>
      </div>

      {/* BENEFITS */}
      <div className="w-full bg-white dark:bg-[#0a0a0a] py-20 px-6 md:px-16 transition-colors duration-300">
        <div className="text-center max-w-3xl mx-auto mb-14"><h2 className="text-4xl font-geist font-bold text-black dark:text-white">Benefits of Using Our <span className="text-[#FFD43B]">Event Spaces</span></h2><p className="text-gray-600 dark:text-gray-300 mt-3 text-lg font-poppins">Practical advantages designed for event organisers.</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">{BENEFITS.map((item, i) => { const Icon = item.icon; return (<div key={i} className="bg-white dark:bg-[#1f1f1f] p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"><div className="w-14 h-14 flex items-center justify-center bg-[#FFD43B] rounded-xl mb-6"><Icon className="w-7 h-7 text-black" /></div><h3 className="text-xl font-geist font-bold text-black dark:text-white mb-3">{item.title}</h3><p className="text-gray-600 dark:text-gray-300 font-poppins leading-relaxed text-sm">{item.desc}</p></div>); })}</div>
      </div>

      {/* TESTIMONIALS */}
      <div className="w-full bg-white dark:bg-[#0a0a0a] py-20 px-6 md:px-16 transition-colors duration-300">
        <div className="text-center max-w-3xl mx-auto mb-14"><h2 className="text-4xl font-geist font-bold text-black dark:text-white">What Our Clients <span className="text-[#FFD43B]">Say</span></h2><p className="text-gray-600 dark:text-gray-300 mt-3 text-lg font-poppins">Real feedback from event hosts and organisers.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">{TESTIMONIALS.map((item, idx) => (<div key={idx} className="bg-white dark:bg-[#1f1f1f] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden"><div className="p-8"><div className="text-[#FFD43B] mb-4"><svg width="32" height="32" fill="#FFD43B" viewBox="0 0 24 24"><path d="M7.17 6A5.17 5.17 0 0 0 2 11.17v6.33A.5.5 0 0 0 2.5 18H8a.5.5 0 0 0 .5-.5v-6.33A5.17 5.17 0 0 0 3.33 6zm10 0A5.17 5.17 0 0 0 12 11.17v6.33a.5.5 0 0 0 .5.5H18a.5.5 0 0 0 .5-.5v-6.33A5.17 5.17 0 0 0 17.17 6z" /></svg></div><p className="text-gray-800 dark:text-gray-200 font-poppins leading-relaxed italic font-semibold mb-4">{item.text}</p></div><div className="relative bg-[#FFF9DB] dark:bg-[#2a2510] border-t-4 border-[#FFD43B] p-6 pt-10"><img src={item.image} className="absolute -top-10 right-6 w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" /><h4 className="text-lg font-geist font-bold text-black dark:text-white mb-1">{item.name}</h4><p className="text-sm text-gray-700 dark:text-gray-300 font-poppins mb-1">{item.role}</p></div></div>))}</div>
      </div>

      {/* FAQ */}
      <div className="w-full bg-white dark:bg-[#0a0a0a] py-20 px-6 md:px-16 transition-colors duration-300"><div className="text-center max-w-3xl mx-auto mb-14"><h2 className="text-4xl font-geist font-bold text-black dark:text-white">Frequently Asked <span className="text-[#FFD43B]">Questions</span></h2><p className="text-gray-600 dark:text-gray-300 mt-3 text-lg font-poppins">Answers to common questions about our event venues.</p></div><div className="max-w-3xl mx-auto space-y-4">{FAQ_DATA.map((item, i) => (<div key={i} className={`border rounded-xl transition-all duration-300 ${faqOpenIndex === i ? 'border-[#FFD43B] shadow-md bg-[#FFD43B]/5 dark:bg-[#FFD43B]/10' : 'border-gray-200 dark:border-white/10 hover:border-gray-300'}`}><button onClick={() => toggleFAQ(i)} className="w-full flex justify-between items-center p-5 text-left"><span className="text-lg font-geist font-semibold text-black dark:text-white">{item.q}</span><ChevronDown className={`w-5 h-5 text-black dark:text-white transition-transform duration-300 ${faqOpenIndex === i ? "rotate-180" : ""}`} /></button><div className={`overflow-hidden transition-all duration-300 ${faqOpenIndex === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}><p className="text-gray-600 dark:text-gray-300 font-poppins leading-relaxed px-5 pb-5 text-sm">{item.a}</p></div></div>))}</div></div>

      {/* FOOTER */}
      <div className="w-full bg-white dark:bg-[#0a0a0a]"><Footer /></div>
    </div>
  );
};

export default EventSpacePage;
