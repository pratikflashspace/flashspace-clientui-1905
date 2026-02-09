import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import userDashboardService, { CreditsResponse } from "@/services/userDashboard.service";
import { createPaymentOrder, openRazorpayCheckout, verifyPayment } from "@/services/payment.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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
  Building2,
  Gift,
  History,
  Coins
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
    price: 1200, // Per hour
  },
  {
    name: "Board Room",
    image: "https://cdn.pixabay.com/photo/2021/09/26/11/44/conference-6657324_1280.jpg",
    btn: "Book Board Room",
    points: ["High-end formal meetings", "Premium AV equipment", "Ideal for 8 – 16 members, addons"],
    price: 2500,
  },
  {
    name: "Training Room",
    image: "https://cdn.pixabay.com/photo/2016/05/23/17/57/convention-1410870_1280.jpg",
    btn: "Book Training Room",
    points: ["Training sessions & workshops", "Projector & high-speed WiFi", "Ideal for up to 50 participants"],
    price: 3500,
  },
  {
    name: "Conference Room",
    image: "https://cdn.pixabay.com/photo/2017/03/31/21/37/room-2192484_1280.jpg",
    btn: "Book Conference Room",
    points: ["Seminars & group discussions", "Spacious, fully equipped", "Ideal for 20 – 50 participants"],
    price: 5000,
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

const RewardsSection = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<CreditsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCredits();
    }
  }, [user]);

  const fetchCredits = async () => {
    const response = await userDashboardService.getCredits();
    if (response.success && response.data) {
      setCredits(response.data);
    }
  };

  const handleRedeem = async () => {
    if (!credits?.canRedeem) return;

    setLoading(true);
    const response = await userDashboardService.redeemReward({
      spaceName: "Reward Meeting Room",
      date: new Date().toISOString()
    });

    if (response.success) {
      toast.success("Reward Redeemed! Free Meeting Room Booked.");
      fetchCredits(); // Refresh
    } else {
      toast.error(response.message || "Redemption Failed");
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="relative w-full py-16 px-6 md:px-16 overflow-hidden">
      {/* Background Gradient & Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black z-0" />
      <div
        className="absolute inset-0 opacity-10 z-0"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 212, 59, 0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />

      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFD43B] rounded-full blur-[128px] opacity-5 translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl">

          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#FFD43B]/20 p-3 rounded-2xl">
                <Coins className="w-8 h-8 text-[#FFD43B]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white font-geist">
                Flash <span className="text-[#FFD43B]">Rewards</span>
              </h2>
            </div>

            <p className="text-gray-300 font-poppins text-lg leading-relaxed max-w-lg">
              Unlock exclusive benefits. Earn <span className="text-white font-semibold">50% credits</span> on every booking and redeem them for free meeting rooms!
            </p>

            <div className="flex flex-wrap gap-8 pt-2">
              <div className="bg-black/30 px-6 py-4 rounded-xl border border-white/5 min-w-[160px]">
                <p className="text-xs text-[#FFD43B] uppercase font-bold tracking-wider mb-1">Your Wallet</p>
                <p className="text-4xl font-bold text-white font-geist tabular-nums">{credits?.balance || 0}</p>
              </div>
              <div className="bg-black/30 px-6 py-4 rounded-xl border border-white/5 min-w-[160px]">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Total Earned</p>
                <p className="text-4xl font-bold text-gray-300 font-geist tabular-nums">{credits?.totalEarned || 0}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md">
            <div className="bg-gradient-to-b from-[#1a1a1a] to-black p-8 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden group">
              {/* Card Glow */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD43B] to-transparent opacity-50" />

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold text-xl flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[#FFD43B]" /> Monthly Goal
                </h3>
                <span className="text-sm font-medium text-[#FFD43B] bg-[#FFD43B]/10 px-3 py-1 rounded-full">
                  {credits?.balance || 0} / 5000 Credits
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="relative w-full h-4 bg-gray-800 rounded-full mb-8 overflow-hidden border border-white/5">
                {/* Animated Background Stripe */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:20px_20px] animate-[pulse_2s_ease-in-out_infinite]" />

                {/* Progress Fill */}
                <div
                  className="h-full bg-gradient-to-r from-[#FFD43B] to-[#ffb700] shadow-[0_0_20px_rgba(255,212,59,0.3)] transition-all duration-1000 ease-out relative"
                  style={{ width: `${Math.min(((credits?.balance || 0) / 5000) * 100, 100)}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-px bg-white/50 shadow-[0_0_10px_white]" />
                </div>
              </div>

              <Button
                onClick={handleRedeem}
                disabled={!(credits?.canRedeem) || loading}
                className={`w-full py-7 font-bold text-lg tracking-wide rounded-xl transition-all duration-300 shadow-lg
                  ${credits?.canRedeem
                    ? 'bg-[#FFD43B] text-black hover:bg-[#ffc800] hover:scale-[1.02] hover:shadow-[#FFD43B]/20'
                    : 'bg-gray-800/50 text-gray-500 cursor-not-allowed border border-white/5'}`}
              >
                {loading
                  ? <span className="flex items-center gap-2"><span className="animate-spin text-xl">◌</span> Redeeming...</span>
                  : credits?.canRedeem
                    ? <span className="flex items-center gap-2"><Sparkles className="w-5 h-5 fill-black" /> Redeem Free Room</span>
                    : "Reach 5000 to Unlock Reward"}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};


const MeetingRoomsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [heroForm, setHeroForm] = useState({ name: "", mobile: "", email: "", city: CITIES[0], seats: SEAT_OPTIONS[0], date: "" });
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    date: "",
    duration: 2, // hours
    mobile: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

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

  function onHeroChange(e: any) {
    const { name, value } = e.target;
    setHeroForm((s) => ({ ...s, [name]: value }));
  }
  function handleHeroSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Request received — we'll call you soon.");
  }
  const openModal = (roomName: string) => {
    const room = ROOM_CARDS.find(r => r.name === roomName);
    setSelectedRoom(room);
    setShowModal(true);
  };
  const toggleFAQ = (index: number) => setFaqOpenIndex(faqOpenIndex === index ? null : index);

  // === PAYMENT HANDLER ===
  const handleBookingPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to book a meeting room");
      navigate("/login");
      return;
    }
    if (!selectedRoom) return;

    setIsProcessing(true);
    try {
      const pricePerHour = selectedRoom.price || 1200;
      const totalAmount = pricePerHour * bookingForm.duration;

      // 1. Create Order
      const order = await createPaymentOrder({
        userId: user.id || (user as any)._id,
        userEmail: user.email,
        userName: user.fullName || "User",
        userPhone: bookingForm.mobile || user.phoneNumber,
        spaceId: "fixed-meeting-room-id", // In real app, this would be dynamic ID
        spaceName: selectedRoom.name,
        planName: "Hourly Booking",
        planKey: "meeting_hourly",
        tenure: 1, // 1 year filler, redundant here but required by interface type
        yearlyPrice: totalAmount, // filler
        totalAmount: totalAmount,
        discountPercent: 0,
        discountAmount: 0,
        paymentType: "meeting_room" as any // "meeting_room" was added to types in previous steps but interface might need update
      });

      // 2. Open Razorpay OR Simulate
      // AUTO-SIMULATION FOR TESTING:
      // Since user requested automatic payment stimulation, we bypass Razorpay popup
      const SIMULATE_SUCCESS = true;

      if (SIMULATE_SUCCESS) {
        console.log("Simulating Payment Success...");

        // Simulate slight delay for realism
        await new Promise(r => setTimeout(r, 1500));

        // Call Verify directly with devMode
        await verifyPayment({
          razorpay_order_id: order.orderId,
          razorpay_payment_id: `pay_test_${Date.now()}`,
          razorpay_signature: "test_signature_dev",
          devMode: true
        });

        toast.success("Payment Simulated Successfully! Credits Earned!");
        setShowModal(false);
        window.location.reload();
        return;
      }

      /* 
      // Original Flow (Disabled for Simulation)
      await openRazorpayCheckout({
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        keyId: order.keyId,
        userEmail: user.email,
        userName: user.fullName || "User",
        userPhone: bookingForm.mobile,
        spaceName: selectedRoom.name,
        planName: `${bookingForm.duration} Hours Booking`,
        onSuccess: async (response) => {
             try {
               await verifyPayment({
                 razorpay_order_id: response.razorpay_order_id,
                 razorpay_payment_id: response.razorpay_payment_id,
                 razorpay_signature: response.razorpay_signature
               });
               toast.success("Booking Successful! Credits Earned!");
               setShowModal(false);
               window.location.reload(); 
             } catch (verr) {
               toast.error("Payment Verification Failed");
             }
        },
        onFailure: (err) => {
          toast.error("Payment Failed: " + err.description);
        },
        onDismiss: () => {
          setIsProcessing(false);
          toast("Payment Cancelled");
        }
      });
      */

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <div className="w-full min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300 font-poppins">
      <div className="relative z-50">
        <Header />
      </div>

      {/* ==================== SECTION 1: HERO ==================== */}
      <section ref={containerRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 opacity-60">
          <div
            ref={bgRef}
            className="absolute inset-0 w-full h-full"
            style={{
              transition: 'transform 0.5s ease-out',
              transform: 'scale(1.03)'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop"
              alt="Meeting Room"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        {/* Simple gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col lg:flex-row gap-16 items-center justify-between pt-24 lg:pt-0">

          {/* LEFT SIDE CONTENT */}
          <div className="w-full lg:w-3/5 text-white space-y-8">

            {/* Back Button (Mobile/Desktop) */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition mb-4"
            >
              <ChevronDown className="w-4 h-4 rotate-90" /> {/* Reusing ChevronDown rotated as ChevronLeft if ChevronLeft not imported, but let's check imports first. */}
              <span>Back</span>
            </button>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD43B]/30 bg-[#FFD43B]/10 px-6 py-2">
              <Sparkles className="w-4 h-4 text-[#FFD43B] fill-[#FFD43B]" />
              <span className="text-[#FFD43B] font-poppins font-bold text-xs tracking-widest uppercase">Instant Booking Available</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] font-geist tracking-tight">
              Professional <br />
              <span className="text-white">Meeting Rooms</span> <br />
              <span className="text-[#FFD43B]">On Your Schedule</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 font-poppins max-w-xl leading-relaxed">
              Book premium meeting rooms and conference spaces by the hour or day. Experience seamless productivity in fully equipped spaces.
            </p>

            {/* Checklist */}
            <div className="flex flex-col gap-4 text-gray-200">
              {[
                "Ready for use whenever required",
                "Fully equipped with Premium Amenities",
                "Prime locations — Pan-India access"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="p-1.5 rounded-full">
                    <CheckCircle className="w-5 h-5 text-[#FFD43B]" />
                  </div>
                  <span className="font-poppins text-base">{item}</span>
                </div>
              ))}
            </div>

            {/* Stats Bar */}
            <div className="pt-6">
              <div className="w-full max-w-xl bg-white/5 border border-white/10 rounded-2xl p-6 flex justify-between items-center text-center">
                <div>
                  <div className="text-3xl md:text-4xl font-bold font-geist text-white">10k+</div>
                  <div className="text-xs text-gray-400 font-poppins uppercase tracking-wider mt-1">Bookings</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <div className="text-3xl md:text-4xl font-bold font-geist text-white">1k+</div>
                  <div className="text-xs text-gray-400 font-poppins uppercase tracking-wider mt-1">Clients</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <div className="text-3xl md:text-4xl font-bold font-geist text-white">3k+</div>
                  <div className="text-xs text-gray-400 font-poppins uppercase tracking-wider mt-1">Spaces</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pb-4">
              <button onClick={() => window.location.href = '#room-types'} className="bg-[#FFD43B] text-black px-8 py-4 rounded-full font-bold font-poppins hover:bg-white hover:scale-105 transition-all flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Book Now
              </button>
              <button onClick={() => window.location.href = '/start-chatting'} className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-full font-bold font-poppins hover:bg-white hover:text-black hover:scale-105 transition-all flex items-center gap-2">
                Explore Spaces
              </button>
            </div>

          </div>

          {/* RIGHT SIDE FORM */}
          <div className="w-full lg:w-2/5 max-w-md relative">
            <div className="relative bg-[#111] border border-white/10 rounded-2xl shadow-xl p-8">

              <h3 className="text-2xl font-geist font-bold text-white mb-2">
                Get a Call Back for <br /> <span className="text-[#FFD43B]">Meeting Rooms</span>
              </h3>
              <p className="text-sm text-gray-400 mb-8 font-poppins">
                Available by the hour, day or as long as you need. Instant response guaranteed.
              </p>

              <form className="space-y-5" onSubmit={handleHeroSubmit}>
                <div className="relative">
                  <input
                    name="name"
                    value={heroForm.name}
                    onChange={onHeroChange}
                    required
                    placeholder="Your Name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none text-white placeholder:text-gray-500 focus:border-[#FFD43B] transition-all font-poppins text-sm"
                  />
                </div>

                <div className="relative">
                  <input
                    name="mobile"
                    value={heroForm.mobile}
                    onChange={onHeroChange}
                    required
                    placeholder="Mobile Number"
                    inputMode="tel"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none text-white placeholder:text-gray-500 focus:border-[#FFD43B] transition-all font-poppins text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <CurvedSelect
                    value={heroForm.city}
                    onChange={(val) => onHeroChange({ target: { name: "city", value: val } })}
                    options={CITIES}
                    noScroll={true}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <CurvedSelect
                    value={heroForm.seats}
                    onChange={(val) => onHeroChange({ target: { name: "seats", value: val } })}
                    options={SEAT_OPTIONS.map((s) => `${s} seats`)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="relative">
                  <input
                    name="date"
                    value={heroForm.date}
                    onChange={onHeroChange}
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none text-white placeholder:text-gray-500 focus:border-[#FFD43B] transition-all font-poppins text-sm [color-scheme:dark]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#FFD43B] text-black text-lg py-6 font-bold rounded-xl hover:bg-[#eec635] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Request Call Back
                </Button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* Rewards Section */}
      <RewardsSection />

      {/* ==================== SECTION 2: REQUIREMENTS & MODAL ==================== */}
      {/* ==================== SECTION : MARKETPLACE STATS ==================== */}
      <div className="w-full bg-[#F5F6FA] dark:bg-[#111] py-16 px-6 md:px-16 transition-colors duration-300">

        {/* Title */}
        <h2 className="text-center text-3xl md:text-4xl font-geist font-bold text-black dark:text-white mb-14">
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
            <h3 className="text-2xl font-bold text-black dark:text-white">10,000+</h3>
            <p className="text-gray-700 dark:text-gray-300 font-poppins text-sm">Meetings Booked</p>
          </div>

          {/* ITEM 2 */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[#E8EAFB] flex items-center justify-center mb-4">
              <Scan className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white">3,000+</h3>
            <p className="text-gray-700 dark:text-gray-300 font-poppins text-sm">Options to Choose from</p>
          </div>

          {/* ITEM 3 */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[#E8EAFB] flex items-center justify-center mb-4">
              <Building2 className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white">1,000+</h3>
            <p className="text-gray-700 dark:text-gray-300 font-poppins text-sm">Corporates Served</p>
          </div>

          {/* ITEM 4 */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[#E8EAFB] flex items-center justify-center mb-4">
              <MapPin className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white">10+</h3>
            <p className="text-gray-700 dark:text-gray-300 font-poppins text-sm">Major Cities Covered</p>
          </div>

          {/* ITEM 5 */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[#E8EAFB] flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-black dark:text-white">4 - 100</h3>
            <p className="text-gray-700 dark:text-gray-300 font-poppins text-sm">Seat Capacity Range</p>
          </div>

        </div>
      </div>

      {/* ==================== SECTION 2: REQUIREMENTS & MODAL ==================== */}
      <div className="w-full bg-white dark:bg-[#0a0a0a] py-20 px-6 md:px-16 transition-colors duration-300">

        {/* TITLE */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <h2 className="text-4xl font-geist font-bold text-black dark:text-white">
            We meet all <span className="text-[#FFD43B]">Your requirements.</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg font-poppins">
            Our Meeting Room solutions are crafted to offer the flexibility necessary to meet your requirements effectively.
          </p>
        </div>

        {/* ROOM CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {ROOM_CARDS.map((card) => (
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

                <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-300 font-poppins text-sm flex-1">
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
                <h3 className="text-xl font-geist font-bold">Book {selectedRoom?.name}</h3>
                <button
                  className="text-gray-500 hover:text-black bg-gray-200 rounded-full p-1"
                  onClick={() => setShowModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* MODAL BODY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8">

                {/* ================= LEFT SIDE ================= */}
                <div className="border-r pr-6 hidden md:flex flex-col justify-between border-gray-100">
                  {/* Summary */}
                  <div>
                    <div className="h-40 w-full rounded-lg overflow-hidden mb-4">
                      <img src={selectedRoom?.image} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="text-2xl font-bold font-geist mb-2">{selectedRoom?.name}</h4>
                    <p className="text-gray-500 text-sm mb-4">{selectedRoom?.points[0]}</p>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between mb-2 text-sm text-gray-600">
                        <span>Rate per hour</span>
                        <span>₹{selectedRoom?.price}</span>
                      </div>
                      <div className="flex justify-between mb-2 text-sm text-gray-600">
                        <span>Duration</span>
                        <span>{bookingForm.duration} Hrs</span>
                      </div>
                      <div className="h-px bg-gray-300 my-2"></div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{selectedRoom?.price * bookingForm.duration}</span>
                      </div>
                      <div className="mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded inline-block">
                        You will earn {Math.floor(selectedRoom?.price * bookingForm.duration * 0.5)} Credits!
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-green-500" /> Secure Payment via Razorpay
                  </div>
                </div>

                {/* ================= RIGHT SIDE FORM (PAYMENT) ================= */}
                <div>
                  <form className="space-y-4 font-poppins" onSubmit={handleBookingPayment}>
                    <div>
                      <label className="text-xs font-semibold text-black-500 uppercase">Select Date</label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={bookingForm.date}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-[#FFD43B] outline-none text-gray-700"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-black-500 uppercase">Duration (Hours)</label>
                      <CurvedSelect
                        options={["1 Hour", "2 Hours", "3 Hours", "4 Hours", "Full Day (8 Hrs)"]}
                        value={`${bookingForm.duration} ${bookingForm.duration === 8 ? "Hrs (Full Day)" : bookingForm.duration === 1 ? "Hour" : "Hours"}`}
                        onChange={(val) => {
                          const hours = val.includes("Full Day") ? 8 : parseInt(val);
                          setBookingForm(prev => ({ ...prev, duration: hours }));
                        }}
                        noScroll={true}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-black-500 uppercase">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={bookingForm.mobile}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, mobile: e.target.value }))}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-1 focus:ring-[#FFD43B] outline-none"
                      />
                    </div>

                    {user ? (
                      <Button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-[#FFD43B] text-black font-bold py-6 rounded-lg hover:bg-[#eec635] mt-4"
                      >
                        {isProcessing ? "Processing..." : `Pay ₹${selectedRoom?.price * bookingForm.duration}`}
                      </Button>
                    ) : (
                      <div className="text-center">
                        <Button
                          type="button"
                          onClick={() => navigate('/login')}
                          className="w-full bg-black text-white font-bold py-6 rounded-lg hover:bg-gray-800 mt-4"
                        >
                          Login to Book
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">You need to be logged in to earn credits.</p>
                      </div>
                    )}
                  </form>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>


      {/* ==================== SECTION 3: TOP CITIES (FIXED LAYOUT) ==================== */}
      {/* CRITICAL FIX: Using absolute positioning for images to prevent height overflow */}
      <div className="w-full bg-white dark:bg-[#0a0a0a] py-20 px-6 md:px-16 transition-colors duration-300">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-4xl font-geist font-bold text-black dark:text-white">Our Meeting Rooms in <span className="text-[#FFD43B]">Top Locations</span></h2>
          <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg font-poppins">Discover premium meeting spaces across major business hubs.</p>
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
                <div className="w-20 h-20 bg-gray-100 dark:bg-[#1f1f1f] group-hover:bg-white dark:group-hover:bg-[#0a0a0a] group-hover:shadow-md border border-transparent group-hover:border-gray-200 dark:group-hover:border-white/10 transition-all duration-300 rounded-full flex items-center justify-center">
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
        <div className="text-center max-w-3xl mx-auto mb-14"><h2 className="text-4xl font-geist font-bold text-black dark:text-white">Why book Meeting Rooms with <span className="text-[#FFD43B]">Flashspace</span></h2><p className="text-gray-600 dark:text-gray-300 mt-3 text-lg font-poppins">Smart, reliable and well-equipped spaces designed to support every type of business meeting.</p></div>
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
            Real experiences from teams and professionals who trust Flashspace for their important meetings.
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

                <p className="text-sm text-gray-700 dark:text-gray-200 font-poppins mb-1">
                  {item.role}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>

      {/* ==================== SECTION 7 F&Q ==================== */}
      <div className="w-full bg-white dark:bg-[#0a0a0a] py-20 px-6 md:px-16 transition-colors duration-300">
        <div className="text-center max-w-3xl mx-auto mb-14"><h2 className="text-4xl font-geist font-bold text-black dark:text-white">Frequently Asked <span className="text-[#FFD43B]">Questions</span></h2><p className="text-gray-600 dark:text-gray-300 mt-3 text-lg font-poppins">Find answers to the most common questions about our meeting room services.</p></div>
        <div className="max-w-3xl mx-auto space-y-4">
          {FAQ_DATA.map((item, i) => (<div key={i} className={`border rounded-xl transition-all duration-300 ${faqOpenIndex === i ? 'border-[#FFD43B] shadow-md bg-[#FFD43B]/5 dark:bg-[#FFD43B]/10' : 'border-gray-200 dark:border-white/10 hover:border-gray-300'}`}> <button onClick={() => toggleFAQ(i)} className="w-full flex justify-between items-center p-5 text-left"> <span className="text-lg font-geist font-semibold text-black dark:text-white"> {item.q} </span> <ChevronDown className={`w-5 h-5 text-black dark:text-white transition-transform duration-300 ${faqOpenIndex === i ? "rotate-180" : ""}`} /> </button> <div className={`overflow-hidden transition-all duration-300 ${faqOpenIndex === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}> <p className="text-gray-600 dark:text-gray-300 font-poppins leading-relaxed px-5 pb-5 text-sm"> {item.a} </p> </div> </div>))}
        </div>
      </div>
      {/* ==================== SECTION  8  footer ==================== */}
      <div className="w-full bg-white dark:bg-[#0a0a0a]"><Footer /></div>
    </div>
  );
};

export default MeetingRoomsPage;