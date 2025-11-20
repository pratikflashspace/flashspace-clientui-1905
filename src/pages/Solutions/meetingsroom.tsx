import React, { useState } from "react";
import { Plug, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import CurvedSelect from "@/components/ui/CurvedSelect";
// or the correct path depending on your folder structure

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
  Building2 
} from "lucide-react";

/**
 * DATA CONSTANTS
 */

// Section 1: Hero
const CITIES = [
  "New Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Pune", 
  "Chennai", "Noida", "Gurugram", "Ahmedabad", "Kolkata",
];
const SEAT_OPTIONS = ["2-5", "5-8", "8-12", "12-16", "16-20", "20+"];
 

// Section 2: Room Types
const ROOM_CARDS = [
  {
    name: "Meeting Room",
    image: "https://cdn.pixabay.com/photo/2023/08/07/09/30/business-8174708_1280.jpg",
    btn: "Book Meeting Room",
    points: ["Board presentations & brainstorming", "Video conferencing calls", "Ideal for 2 – 8 members"],
  },
  {
    name: "Board Room",
    image: "https://cdn.pixabay.com/photo/2021/09/26/11/44/conference-6657324_1280.jpg",
    btn: "Book Board Room",
    points: ["High-end formal meetings", "Premium AV equipment", "Ideal for 8 – 16 members, addons"],
  },
  {
    name: "Training Room",
    image: "https://cdn.pixabay.com/photo/2016/05/23/17/57/convention-1410870_1280.jpg",
    btn: "Book Training Room",
    points: ["Training sessions & workshops", "Projector & high-speed WiFi", "Ideal for up to 50 participants"],
  },
  {
    name: "Conference Room",
    image: "https://cdn.pixabay.com/photo/2017/03/31/21/37/room-2192484_1280.jpg",
    btn: "Book Conference Room",
    points: ["Seminars & group discussions", "Spacious, fully equipped", "Ideal for 20 – 50 participants"],
  },
];

// Section 3 Data
const CITY_DATA = [
  { city: "Haryana", image: "https://i.pinimg.com/1200x/eb/9f/f7/eb9ff75ae648d9b66ee1a2d2f07a6789.jpg" },
  { city: "Delhi", image: "https://cdn.pixabay.com/photo/2017/03/28/12/11/chairs-2181960_1280.jpg" },
  { city: "Telangana", image: "https://cdn.pixabay.com/photo/2018/05/09/07/11/architectural-3384683_1280.jpg" },
  { city: "Karnataka", image: "https://i.pinimg.com/1200x/70/8c/23/708c234446ddfdc5acf8bbf5be2d0838.jpg" },
  { city: "Kerala", image: "https://i.pinimg.com/1200x/40/70/92/407092d4383cd74ae0e022c1f65b79e7.jpg" },
  { city: "Maharashtra", image: "https://i.pinimg.com/1200x/98/76/79/987679cf4377673a156a4750b84914af.jpg" },
  { city: "Noida", image: "https://i.pinimg.com/1200x/23/fc/0e/23fc0e9eecce364ce18351c89ca0c96c.jpg" },
];

// Section 4: Amenities
const AMENITIES = [
  { icon: Monitor, title: "Ergonomic Workstations" }, { icon: Archive, title: "Event Spaces" },
  { icon: Shield, title: "Secure Access" }, { icon: Key, title: "Flexible Contracts" },
  { icon: Users, title: "Member Directory" }, { icon: Printer, title: "Printing & Scanning" },
  { icon: Wifi, title: "High-Speed Internet" }, { icon: ParkingCircle, title: "Parking Facilities" },
  { icon: Coffee, title: "Free Coffee" }, { icon: Clock4, title: "Snooze Room" },
  { icon: DoorOpen, title: "Chill Out Zone" }, { icon: Plug, title: "Power Backup" },
];

// Section 5: Benefits
const BENEFITS = [
  { icon: Clock, title: "Instant Booking", desc: "Reserve meeting rooms on-demand with immediate confirmation." },
  { icon: MapPin, title: "Prime Business Locations", desc: "Choose from premium spaces in top commercial hubs across India." },
  { icon: ShieldCheck, title: "Fully Equipped & Secure", desc: "Modern AV setup, fast WiFi, power backup and secured entry access." },
  { icon: Laptop, title: "Business-Ready Setup", desc: "Boardrooms, conference setups and training rooms ready for use." },
  { icon: BadgeCheck, title: "Reliable & Verified Spaces", desc: "Transparent pricing and rooms verified by our workspace experts." },
  { icon: Headphones, title: "Dedicated Support Team", desc: "24×7 assistance for bookings, modifications and requirements." },
];

// Section 6: Testimonials
const TESTIMONIALS = [
  { name: "Rahul Verma", role: "HR Manager, TechNova Pvt Ltd", image: "https://randomuser.me/api/portraits/men/32.jpg", text: "Flashspace made our client meetings incredibly smooth. The booking was instant, the room was perfectly equipped, and the staff support was excellent.", rating: 5 },
  { name: "Priya Sharma", role: "Operations Head, BrightWork Solutions", image: "https://randomuser.me/api/portraits/women/44.jpg", text: "The meeting rooms were modern, clean, and fully ready before our arrival. Loved the flexible options and premium locations, making our experience truly seamless..", rating: 5 },
  { name: "Arjun Mehta", role: "Founder, BluePeak Ventures", image: "https://randomuser.me/api/portraits/men/85.jpg", text: "Amazing service! Found a board room in minutes. The AV setup and WiFi were perfect for our investor presentation. Highly recommended!", rating: 5 },
];

// Section 7: FAQ
const FAQ_DATA = [
  { q: "Can I book a meeting room for just 1 hour?", a: "Yes, all our meeting rooms are available for hourly booking as well as full-day booking." },
  { q: "What amenities are included in the meeting rooms?", a: "Rooms include high-speed WiFi, AC, whiteboards, projectors (or LED screens), refreshments, power backup, and comfortable seating." },
  { q: "Is same-day booking available?", a: "Yes. Most locations support instant booking." },
  { q: "Can I modify or reschedule my booking?", a: "Absolutely. You can contact our support team anytime to modify your booking." },
  { q: "Do you provide support for video conferencing setup?", a: "Yes, all rooms are equipped with AV support." },
  { q: "Are corporate bulk bookings available?", a: "Yes, we support bulk and recurring bookings for companies." },
];

const MeetingRoomsPage: React.FC = () => {
  const [heroForm, setHeroForm] = useState({ name: "", mobile: "", email: "", city: CITIES[0], seats: SEAT_OPTIONS[0], date: "" });
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  function onHeroChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setHeroForm((s) => ({ ...s, [name]: value }));
  }
  function handleHeroSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Request received — we'll call you soon.");
  }
  const openModal = (roomName: string) => {
    setSelectedRoom(roomName);
    setShowModal(true);
  };
  const toggleFAQ = (index: number) => setFaqOpenIndex(faqOpenIndex === index ? null : index);

  return (
    <div className="w-full min-h-screen bg-white">
      <Header />

      {/* ==================== SECTION 1: HERO ==================== */}
      <section className="relative w-full h-screen overflow-hidden">
  {/* Background Image */}
  <div 
    className="absolute inset-0 bg-center bg-cover" 
    style={{ backgroundImage: "url(https://plus.unsplash.com/premium_photo-1681487144031-d502ea9abefc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)" }} 
    aria-hidden="true" 
  />
  <div className="absolute inset-0 bg-black/50" />

  <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col lg:flex-row gap-12 items-center justify-center lg:justify-between pt-20 lg:pt-0">
    
    {/* LEFT SIDE CONTENT */}
    {/* Added lg:-ml-16 to shift this entire block to the left */}
    <div className="w-full lg:w-2/3 text-white lg:-ml-16">
      <div className="max-w-2xl">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD43B] bg-white/10 backdrop-blur-md px-6 py-2 shadow-sm">
          <Sparkles className="w-4 h-4 text-[#FFD43B] fill-[#FFD43B]" />
          <span className="text-[#FFD43B] font-poppins font-bold text-sm tracking-wide">Instant Booking Available</span>
        </div>

        {/* Heading */}
        <h1 className="mt-3 text-4xl md:text-6xl font-bold leading-tight font-geist">
          Professional Meeting Rooms <br />
          <span className="text-[#FFD43B]">On Your Schedule</span>
        </h1>
        
        <p className="mt-4 text-lg md:text-xl text-gray-100 font-poppins max-w-xl">
          Book premium meeting rooms and conference spaces by the hour or day.
        </p>

        {/* Checklist */}
        <div className="mt-4 space-y-3 text-gray-100">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-[#FFD43B] flex-shrink-0" />
            <span className="font-poppins">Ready for use whenever required</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-[#FFD43B] flex-shrink-0" />
            <span className="font-poppins">Fully equipped with all Amenities</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-[#FFD43B] flex-shrink-0" />
            <span className="font-poppins">Prime locations — Pan-India access</span>
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
            <div className="text-2xl md:text-3xl font-bold font-geist text-white">10,000+</div>
            <div className="text-xs md:text-sm text-gray-300 font-poppins">Meetings booked</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold font-geist text-white">1,000+</div>
            <div className="text-xs md:text-sm text-gray-300 font-poppins">Corporates served</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold font-geist text-white">3,000+</div>
            <div className="text-xs md:text-sm text-gray-300 font-poppins">Options to choose</div>
          </div>
        </div>

      </div>
    </div>

    {/* RIGHT SIDE FORM (Unchanged) */}
    <div className="w-full lg:w-1/2 max-w-md">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8">
       <h3 className="text-xl font-geist font-bold text-gray-900"> Get a Call Back for <span className="text-[#FFD43B]">Meeting Rooms</span> </h3>
        <p className="text-sm text-gray-500 mt-1">Available by the hour, day or as long as you need</p>
        <form className="mt-6 space-y-4" onSubmit={handleHeroSubmit}>
          <input name="name" value={heroForm.name} onChange={onHeroChange} required placeholder="Name*" className="w-full border border-gray-200 rounded-md px-4 py-3 outline-none font-poppins text-sm focus:ring-1 focus:ring-[#FFD43B]" />
          <input name="mobile" value={heroForm.mobile} onChange={onHeroChange} required placeholder="Mobile number*" inputMode="tel" className="w-full border border-gray-200 rounded-md px-4 py-3 outline-none font-poppins text-sm focus:ring-1 focus:ring-[#FFD43B]" />
          <input name="email" value={heroForm.email} onChange={onHeroChange} required placeholder="Email*" type="email" className="w-full border border-gray-200 rounded-md px-4 py-3 outline-none font-poppins text-sm focus:ring-1 focus:ring-[#FFD43B]" />
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
    options={SEAT_OPTIONS.map((s) => `${s} seats`)}
  />

</div>

          <input name="date" value={heroForm.date} onChange={onHeroChange} type="date" className="w-full border border-gray-200 rounded-md px-4 py-3 outline-none font-poppins text-sm text-gray-500 focus:ring-1 focus:ring-[#FFD43B]" />
          <Button type="submit" className="w-full bg-[#FFD43B] text-black text-base px-5 py-6 font-bold rounded-md hover:bg-[#eec635] active:scale-[0.98] transition-all">Request Call Back</Button>
        </form>
      </div>
    </div>

  </div>
</section>

      {/* ==================== SECTION 2: REQUIREMENTS & MODAL ==================== */}
      {/* ==================== SECTION : MARKETPLACE STATS ==================== */}
<div className="w-full bg-[#F5F6FA] py-16 px-6 md:px-16">

  {/* Title */}
  <h2 className="text-center text-3xl md:text-4xl font-geist font-bold text-black mb-14">
    India’s Biggest Marketplace
    <span className="text-[#FFD43B]"> for Meeting Rooms</span> 
  </h2>

  {/* Stats Grid */}
  <div className="grid grid-cols-2 md:grid-cols-5 gap-10 text-center max-w-6xl mx-auto">

    {/* ITEM 1 */}
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 rounded-full bg-[#E8EAFB] flex items-center justify-center mb-4">
        <Users className="w-10 h-10 text-black" />
      </div>
      <h3 className="text-2xl font-bold text-black">10,000+</h3>
      <p className="text-gray-700 font-poppins text-sm">Meetings Booked</p>
    </div>

    {/* ITEM 2 */}
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 rounded-full bg-[#E8EAFB] flex items-center justify-center mb-4">
        <Scan className="w-10 h-10 text-black" />
      </div>
      <h3 className="text-2xl font-bold text-black">3,000+</h3>
      <p className="text-gray-700 font-poppins text-sm">Options to Choose from</p>
    </div>

    {/* ITEM 3 */}
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 rounded-full bg-[#E8EAFB] flex items-center justify-center mb-4">
        <Building2 className="w-10 h-10 text-black" />
      </div>
      <h3 className="text-2xl font-bold text-black">1,000+</h3>
      <p className="text-gray-700 font-poppins text-sm">Corporates Served</p>
    </div>

    {/* ITEM 4 */}
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 rounded-full bg-[#E8EAFB] flex items-center justify-center mb-4">
        <MapPin className="w-10 h-10 text-black" />
      </div>
      <h3 className="text-2xl font-bold text-black]">10+</h3>
      <p className="text-gray-700 font-poppins text-sm">Major Cities Covered</p>
    </div>

    {/* ITEM 5 */}
    <div className="flex flex-col items-center">
      <div className="w-24 h-24 rounded-full bg-[#E8EAFB] flex items-center justify-center mb-4">
        <Users className="w-10 h-10 text-black" />
      </div>
      <h3 className="text-2xl font-bold text-black ">4 - 100</h3>
      <p className="text-gray-700 font-poppins text-sm">Seat Capacity Range</p>
    </div>

  </div>
</div>

      {/* ==================== SECTION 2: REQUIREMENTS & MODAL ==================== */} 
<div className="w-full bg-white py-20 px-6 md:px-16">

  {/* TITLE */}
  <div className="text-center max-w-4xl mx-auto mb-14">
    <h2 className="text-4xl font-geist font-bold text-black">
      We meet all <span className="text-[#FFD43B]">Your requirements.</span>
    </h2>
    <p className="text-gray-600 mt-3 text-lg font-poppins">
      Our Meeting Room solutions are crafted to offer the flexibility necessary to meet your requirements effectively.
    </p>
  </div>

  {/* ROOM CARDS */}
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
    {ROOM_CARDS.map((card) => (
      <div 
        key={card.name} 
        className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 rounded-xl overflow-hidden border border-gray-100 flex flex-col"
      >
        <div className="h-48 overflow-hidden">
          <img 
            src={card.image} 
            alt={card.name} 
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
          />
        </div>

        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-geist font-bold text-black">{card.name}</h3>

          <ul className="mt-4 space-y-3 text-gray-600 font-poppins text-sm flex-1">
            {card.points.map((p, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#FFD43B] mt-0.5 flex-shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <Button 
            onClick={() => openModal(card.name)} 
           className="w-full mt-6 bg-[#FFD43B] border-2 border-[#FFD43B] text-black font-semibold py-2 rounded-lg hover:bg-[#e6c234] transition-colors"

          >
            {card.btn}
          </Button>
        </div>
      </div>
    ))}
  </div>

  {/* ============================ MODAL ============================ */}
  {showModal && (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* MODAL HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h3 className="text-xl font-geist font-bold">Book {selectedRoom}</h3>
          <button 
            className="text-gray-500 hover:text-black bg-gray-200 rounded-full p-1" 
            onClick={() => setShowModal(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8">

          {/* ================= LEFT SIDE (UPDATED) ================= */}
          <div className="border-r pr-6 hidden md:flex flex-col justify-between border-gray-100">

            {/* TOP: TITLE + LOGOS */}
            <div>
              <h4 className="font-geist text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                Trusted by over 5,000+ Clients ✨
              </h4>

              {/* LOGO GRID */}
                     <div className="grid grid-cols-3 gap-1 mb-8">
                       <img src="/Logo/trulymadly.png" className="h-14 w-24 object-contain border-2 border-gray-300 opacity-80 transition-transform duration-300 hover:scale-125 hover:shadow-lg rounded-md" alt="trulymadly" />
                       <img src="/Logo/StudyIQ.png" className="h-14 w-24 object-contain border-2 border-gray-300 opacity-80 transition-transform duration-300 hover:scale-125 hover:shadow-lg rounded-md" alt="StudyIQ" />
                       <img src="/Logo/Stage2.png" className="h-14 w-24 object-contain border-2 border-gray-300 opacity-80 transition-transform duration-300 hover:scale-125 hover:shadow-lg rounded-md" alt="Stage2" />
                       <img src="/Logo/luv.png" className="h-14 w-24 object-contain border-2 border-gray-300 opacity-80 transition-transform duration-300 hover:scale-125 hover:shadow-lg rounded-md" alt="luv" />
                       <img src="/Logo/flipkart.png" className="h-14 w-24 object-contain border-2 border-gray-300 opacity-80 transition-transform duration-300 hover:scale-125 hover:shadow-lg rounded-md" alt="flipkart" />
                       <img src="/Logo/Adda247.png" className="h-14 w-24 object-contain border-2 border-gray-300 opacity-80 transition-transform duration-300 hover:scale-125 hover:shadow-lg rounded-md" alt="Adda247" />
                      </div>


              {/* BULLETS */}
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

          {/* ================= RIGHT SIDE FORM (UNCHANGED) ================= */}
          <div>
            <form className="space-y-4 font-poppins">
              <div>
                <label className="text-xs font-semibold text-black-500 uppercase">Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-[#FFD43B] outline-none" 
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-black-500 uppercase">Mobile</label>
                <input 
                  type="tel" 
                  placeholder="+91 98765 43210" 
                  className="w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-[#FFD43B] outline-none" 
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-black-500 uppercase">Work Email</label>
                <input 
                  type="email" 
                  placeholder="john@company.com" 
                  className="w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-[#FFD43B] outline-none" 
                />
              </div>

              <div>
                <label className="text-xs  font-semibold  text-black-500 uppercase">Date</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-[#FFD43B] outline-none text-gray-500" 
                />
              </div>

              <Button className="w-full bg-[#FFD43B] text-black font-bold py-6 rounded-lg hover:bg-[#eec635] mt-2">
                Request Callback
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )}

</div>


      {/* ==================== SECTION 3: TOP CITIES (FIXED LAYOUT) ==================== */}
      {/* CRITICAL FIX: Using absolute positioning for images to prevent height overflow */}
      <div className="w-full bg-white py-20 px-6 md:px-16">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-4xl font-geist font-bold text-black">Our Meeting Rooms in <span className="text-[#FFD43B]">Top Locations</span></h2>
          <p className="text-gray-600 mt-3 text-lg font-poppins">Discover premium meeting spaces across major business hubs.</p>
        </div>

        {/* Grid Container: Fixed height of 600px on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:h-[600px]">
          {(() => {
            const CityCard = ({ item, className }: { item: any, className?: string }) => (
              // Card Container: relative (for absolute img), flex-1 (grow to fill space), min-h-0 (allow shrinking if needed)
              <div className={`relative w-full rounded-2xl overflow-hidden group cursor-pointer min-h-0 ${className}`}>
                {/* Image: Absolute inset-0. It takes size of parent, DOES NOT push parent size. */}
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
                {/* COLUMN 1 */}
                <div className="flex flex-col gap-4 h-full">
                  <CityCard item={CITY_DATA[0]} className="h-64 md:h-auto md:flex-1" />
                  <CityCard item={CITY_DATA[1]} className="h-64 md:h-auto md:flex-1" />
                </div>
                {/* COLUMN 2 (3 items) */}
                <div className="flex flex-col gap-4 h-full">
                  <CityCard item={CITY_DATA[2]} className="h-64 md:h-auto md:flex-1" />
                  <CityCard item={CITY_DATA[3]} className="h-64 md:h-auto md:flex-1" />
                  <CityCard item={CITY_DATA[4]} className="h-64 md:h-auto md:flex-1" />
                </div>
                {/* COLUMN 3 */}
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
      <div className="w-full bg-white py-20 px-6 md:px-16">
        <div className="text-center max-w-3xl mx-auto mb-14">
           <h2 className="text-4xl font-geist font-bold text-black">Enjoy these amenities  <span className="text-[#FFD43B]"> with your booking.</span></h2>
          <p className="text-gray-600 mt-3 text-lg font-poppins">Focus on what matters to you, and we’ll handle the rest to ensure a smooth and efficient working experience.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 text-center">
          {AMENITIES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center gap-4 group p-4 hover:bg-gray-50 rounded-xl transition-all duration-300">
                <div className="w-20 h-20 bg-gray-100 group-hover:bg-white group-hover:shadow-md border border-transparent group-hover:border-gray-200 transition-all duration-300 rounded-full flex items-center justify-center">
                  <Icon className="w-10 h-10 text-gray-600 group-hover:text-[#FFD43B] transition-colors" />
                </div>
                <h3 className="text-md font-poppins text-gray-800 font-semibold group-hover:text-black">{item.title}</h3>
              </div>
            );
          })}
        </div>
      </div>

      {/* ==================== SECTION Why book ==================== */}
      <div className="w-full bg-gray-50 py-20 px-6 md:px-16">
        <div className="text-center max-w-3xl mx-auto mb-14"><h2 className="text-4xl font-geist font-bold text-black">Why book Meeting Rooms with <span className="text-[#FFD43B]">Flashspace</span></h2><p className="text-gray-600 mt-3 text-lg font-poppins">Smart, reliable and well-equipped spaces designed to support every type of business meeting.</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {BENEFITS.map((item, i) => { const Icon = item.icon; return ( <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"> <div className="w-14 h-14 flex items-center justify-center bg-[#FFD43B] rounded-xl mb-6"> <Icon className="w-7 h-7 text-black" /> </div> <h3 className="text-xl font-geist font-bold text-black mb-3"> {item.title} </h3> <p className="text-gray-600 font-poppins leading-relaxed text-sm"> {item.desc} </p> </div> ); })}
        </div>
      </div>
     {/* ==================== SECTION 6  clients have to say ==================== */}
          <div className="w-full bg-white py-20 px-6 md:px-16">

  {/* SECTION TITLE */}
  <div className="text-center max-w-3xl mx-auto mb-14">
    <h2 className="text-4xl font-geist font-bold text-black">
      What our clients <span className="text-[#FFD43B]">have to say</span>
    </h2>
    <p className="text-gray-600 font-poppins mt-3 text-lg">
      Real experiences from teams and professionals who trust Flashspace for their important meetings.
    </p>
  </div>

  {/* GRID */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

    {TESTIMONIALS.map((item, idx) => (
      <div 
        key={idx} 
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        
        {/* CARD TOP */}
        <div className="p-8">

          {/* YELLOW QUOTE ICON */}
          <div className="text-[#FFD43B] mb-4">
            <svg width="32" height="32" fill="#FFD43B" viewBox="0 0 24 24">
              <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17v6.33A.5.5 0 0 0 2.5 18H8a.5.5 0 0 0 .5-.5v-6.33A5.17 5.17 0 0 0 3.33 6zm10 0A5.17 5.17 0 0 0 12 11.17v6.33a.5.5 0 0 0 .5.5H18a.5.5 0 0 0 .5-.5v-6.33A5.17 5.17 0 0 0 17.17 6z"/>
            </svg>
          </div>

          {/* MAIN TEXT */}
          <p className="text-gray-800 font-poppins leading-relaxed italic font-semibold mb-4">
            {item.text}
          </p>

          {/* EXTRA LINES (MORE CONTENT) */}
          <p className="text-gray-700 font-poppins leading-relaxed mb-3">
            {item.subtext}
          </p>

          <p className="text-gray-600 font-poppins leading-relaxed mb-3">
            {item.more}
          </p>

          <p className="text-gray-600 font-poppins leading-relaxed">
            {item.extra}
          </p>

        </div>

        {/* BOTTOM SECTION */}
        <div className="relative bg-[#FFF9DB] border-t-4 border-[#FFD43B] p-6 pt-10">
          
          {/* IMAGE */}
          <img 
            src={item.image} 
            className="absolute -top-10 right-6 w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
          />

          {/* NAME + ROLE + COMPANY (3 different lines) */}
          <h4 className="text-lg font-geist font-bold text-black mb-1">
            {item.name}
          </h4>

          <p className="text-sm text-gray-700 font-poppins mb-1">
            {item.role}
          </p>

          <p className="text-sm text-gray-500 font-poppins">
            {item.company}
          </p>

        </div>

      </div>
    ))}

  </div>

</div>

     {/* ==================== SECTION 7 F&Q ==================== */}
      <div className="w-full bg-white py-20 px-6 md:px-16">
        <div className="text-center max-w-3xl mx-auto mb-14"><h2 className="text-4xl font-geist font-bold text-black">Frequently Asked <span className="text-[#FFD43B]">Questions</span></h2><p className="text-gray-600 mt-3 text-lg font-poppins">Find answers to the most common questions about our meeting room services.</p></div>
        <div className="max-w-3xl mx-auto space-y-4">
          {FAQ_DATA.map((item, i) => ( <div key={i} className={`border rounded-xl transition-all duration-300 ${faqOpenIndex === i ? 'border-[#FFD43B] shadow-md bg-[#FFD43B]/5' : 'border-gray-200 hover:border-gray-300'}`}> <button onClick={() => toggleFAQ(i)} className="w-full flex justify-between items-center p-5 text-left"> <span className="text-lg font-geist font-semibold text-black"> {item.q} </span> <ChevronDown className={`w-5 h-5 text-black transition-transform duration-300 ${faqOpenIndex === i ? "rotate-180" : ""}`} /> </button> <div className={`overflow-hidden transition-all duration-300 ${faqOpenIndex === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}> <p className="text-gray-600 font-poppins leading-relaxed px-5 pb-5 text-sm"> {item.a} </p> </div> </div> ))}
        </div>
      </div>
     {/* ==================== SECTION  8  footer ==================== */}
      <div className="w-full bg-white"><Footer /></div>
    </div>
  );
};

export default MeetingRoomsPage;