import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added for navigation
import { MapPin, Star, Wifi, Coffee, Printer, Monitor, Shield, Calendar, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
// Import your Header and Footer components
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// --- 1. DATA DEFINITION (Extracted from your screenshots) ---
const SPACES_DATA = [
  {
    id: "stirring-minds",
    name: "Stirring Minds",
    address: "Kundan Mansion, 2-A/3, Asaf Ali Rd, Turkman Gate, New Delhi",
    rating: 4.8,
    reviews: 245,
    description: "Stirring Minds is a premier coworking space located in the heart of New Delhi. Perfect for startups, freelancers, and enterprises looking for a vibrant community.",
    photos: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80",
    ],
    amenities: ["High-Speed WiFi", "Meeting Rooms", "High-Speed Wifi"],
    pricing: {
      gst: { name: "GST Plan", monthly: 800, yearly: 8500, features: ["Virtual Address", "Mail Handling"] },
      mailing: { name: "Mailing Plan", monthly: 640, yearly: 7000, features: ["Mail Handling Only"] },
      br: { name: "BR Plan", monthly: 942, yearly: 10000, features: ["Business Registration", "Lounge Access"] },
    }
  },
  {
    id: "virtualexcel",
    name: "Virtualexcel",
    address: "Lower Ground Floor, Saket Salcon, Rasvilas, Saket",
    rating: 4.6,
    reviews: 156,
    description: "Located in the premium Saket Salcon area, Virtualexcel offers top-tier virtual office solutions with access to shopping malls and premium locations.",
    photos: [
      "https://images.unsplash.com/photo-1504384308090-c54be3852f33?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80",
    ],
    amenities: ["Shopping Mall Access", "Premium Location", "High-Speed Wifi"],
    pricing: {
      gst: { name: "GST Plan", monthly: 1000, yearly: 11000, features: ["Virtual Address", "GST Registration"] },
      mailing: { name: "Mailing Plan", monthly: 833, yearly: 9100, features: ["Mail Handling", "Courier Receipt"] },
      br: { name: "BR Plan", monthly: 1175, yearly: 12900, features: ["Business Registration", "Lounge Access"] },
    }
  },
  {
    id: "work-and-beyond",
    name: "Work & Beyond",
    address: "E-518 first floor Kocchar plaza near Ramphal...",
    rating: 4.5,
    reviews: 145,
    description: "A modern workspace offering airport proximity and modern amenities. Ideal for frequent travelers and international businesses.",
    photos: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80",
    ],
    amenities: ["Airport Proximity", "Modern Amenities", "Conference Rooms"],
    pricing: {
      gst: { name: "GST Plan", monthly: 1000, yearly: 11000, features: ["Virtual Address", "GST Support"] },
      mailing: { name: "Mailing Plan", monthly: 800, yearly: 8800, features: ["Mail Handling"] },
      br: { name: "BR Plan", monthly: 1175, yearly: 12900, features: ["Business Registration"] },
    }
  },
  {
    id: "okhla-alt-f",
    name: "Okhla Alt F",
    address: "101, NH-19, CRRI, Ishwar Nagar, Okhla, New Delhi",
    rating: 4.5,
    reviews: 134,
    description: "Situated in the industrial hub of Okhla, this space offers flexible hours and robust infrastructure for growing teams.",
    photos: [
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80",
    ],
    amenities: ["Industrial Area", "Flexible Hours", "Parking"],
    pricing: {
      gst: { name: "GST Plan", monthly: 2500, yearly: 27500, features: ["Premium Address", "GST Support"] },
      mailing: { name: "Mailing Plan", monthly: 1250, yearly: 13750, features: ["Mail Handling", "Reception"] },
      br: { name: "BR Plan", monthly: 2942, yearly: 32000, features: ["Business Registration", "Meeting Rooms"] },
    }
  },
  {
    id: "budha-coworking",
    name: "Budha Coworking Spaces",
    address: "3rd floor, H.no 33, Pocket 5, Sector-24, Rohini",
    rating: 4.4,
    reviews: 112,
    description: "A quiet, suburban location in Rohini offering budget-friendly workspaces with ample parking and a peaceful environment.",
    photos: [
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80",
    ],
    amenities: ["Suburban Location", "Parking Available", "Quiet Zone"],
    pricing: {
      gst: { name: "GST Plan", monthly: 917, yearly: 10000, features: ["Virtual Address"] },
      mailing: { name: "Mailing Plan", monthly: 733, yearly: 8000, features: ["Mail Handling"] },
      br: { name: "BR Plan", monthly: 1083, yearly: 11900, features: ["Business Registration"] },
    }
  },
  {
    id: "mytime-cowork",
    name: "Mytime Cowork",
    address: "55 Lane-2, Westend Marg, Saiyad Ul Ajaib",
    rating: 4.9,
    reviews: 198,
    description: "One of the highest-rated spaces featuring an executive lounge and a premium location near Westend Marg.",
    photos: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80",
    ],
    amenities: ["Premium Location", "Executive Lounge", "High-Speed Wifi"],
    pricing: {
      gst: { name: "GST Plan", monthly: 1000, yearly: 11000, features: ["Virtual Address", "Lounge Access"] },
      mailing: { name: "Mailing Plan", monthly: 833, yearly: 9100, features: ["Mail Handling"] },
      br: { name: "BR Plan", monthly: 1175, yearly: 12900, features: ["Business Registration"] },
    }
  },
  {
    id: "getset-spaces",
    name: "Getset Spaces",
    address: "3rd Floor, LMR House, S-16, Block C, Green Park",
    rating: 4.6,
    reviews: 167,
    description: "Located in the posh Green Park area, Getset Spaces offers premium facilities with excellent connectivity to South Delhi.",
    photos: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80",
    ],
    amenities: ["South Delhi", "Premium Facilities", "Metro Connectivity"],
    pricing: {
      gst: { name: "GST Plan", monthly: 1083, yearly: 11900, features: ["Virtual Address"] },
      mailing: { name: "Mailing Plan", monthly: 867, yearly: 9500, features: ["Mail Handling"] },
      br: { name: "BR Plan", monthly: 1275, yearly: 14000, features: ["Business Registration"] },
    }
  },
  {
    id: "cp-alt-f",
    name: "CP Alt F",
    address: "J6JF+53C, Connaught Lane, Barakhamba",
    rating: 4.7,
    reviews: 189,
    description: "A flagship location in Connaught Place offering private cabins and parking in the heart of Delhi's business district.",
    photos: [
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80",
    ],
    amenities: ["Private Cabin Option", "Parking", "Central Location"],
    pricing: {
      gst: { name: "GST Plan", monthly: 2667, yearly: 29000, features: ["Prime Address", "GST Support"] },
      mailing: { name: "Mailing Plan", monthly: 1500, yearly: 16500, features: ["Mail Handling"] },
      br: { name: "BR Plan", monthly: 3133, yearly: 34000, features: ["Business Registration", "Meeting Rooms"] },
    }
  },
  {
    id: "wbb-office",
    name: "WBB Office",
    address: "Office no. 102, 52A first floor, Vijay Block",
    rating: 4.3,
    reviews: 89,
    description: "Budget-friendly workspace with basic amenities, perfect for freelancers and early-stage startups starting their journey.",
    photos: [
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80",
    ],
    amenities: ["Budget Friendly", "Basic Amenities", "Wifi"],
    pricing: {
      gst: { name: "GST Plan", monthly: 1167, yearly: 12800, features: ["Virtual Address"] },
      mailing: { name: "Mailing Plan", monthly: 750, yearly: 8200, features: ["Mail Handling"] },
      br: { name: "BR Plan", monthly: 1375, yearly: 15000, features: ["Business Registration"] },
    }
  }
];

const SpaceComponent = () => {
  // --- STATE MANAGEMENT ---
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();
  
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState('gst');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Find the specific space data based on URL ID
  const spaceDetails = SPACES_DATA.find(s => s.id === id) || SPACES_DATA[0];

  // Helper to map text amenities to Icons
  const getAmenityIcon = (name: string) => {
    if (name.includes("Wifi")) return <Wifi className="w-5 h-5" />;
    if (name.includes("Coffee") || name.includes("Lounge")) return <Coffee className="w-5 h-5" />;
    if (name.includes("Print")) return <Printer className="w-5 h-5" />;
    if (name.includes("Security") || name.includes("Guard")) return <Shield className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />; // Default
  };

  // --- HELPER FUNCTIONS ---
  const getPrice = (planKey: string) => {
    // @ts-ignore
    const plan = spaceDetails.pricing[planKey];
    return billingCycle === 'monthly' ? plan.monthly : plan.yearly;
  };

  const handleBookNow = () => {
    alert(`Booking Confirmed!\nSpace: ${spaceDetails.name}\nPlan: ${selectedPlan.toUpperCase()}\nCycle: ${billingCycle}\nTotal: ₹${getPrice(selectedPlan)}`);
  };

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Header at the top */}
      <Header />

      {/* 2. Main Content Area */}
      <main className="flex-grow bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 py-10 font-poppins text-gray-800">
          
          {/* --- HEADER SECTION --- */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 font-geist">{spaceDetails.name}</h1>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-black">{spaceDetails.rating}</span>
                  <span className="underline">({spaceDetails.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{spaceDetails.address}</span>
                </div>
              </div>
              {/* Back Button */}
              <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition">
                <ArrowLeft className="w-4 h-4" />
                Back to Spaces
              </button>
            </div>
          </div>

          {/* --- PHOTO GRID --- */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] mb-8 rounded-2xl overflow-hidden">
            <div className="md:col-span-2 h-full">
              <img src={spaceDetails.photos[0]} alt="Main Space" className="w-full h-full object-cover hover:opacity-95 transition cursor-pointer" />
            </div>
            <div className="md:col-span-1 grid grid-rows-2 gap-2 h-full">
              <img src={spaceDetails.photos[1]} alt="Detail 1" className="w-full h-full object-cover hover:opacity-95 transition cursor-pointer" />
              <img src={spaceDetails.photos[2]} alt="Detail 2" className="w-full h-full object-cover hover:opacity-95 transition cursor-pointer" />
            </div>
            <div className="md:col-span-1 h-full relative">
              <img src={spaceDetails.photos[3]} alt="Detail 3" className="w-full h-full object-cover hover:opacity-95 transition cursor-pointer" />
              <button className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md text-sm font-semibold">Show all photos</button>
            </div>
          </div>

          {/* --- MAIN CONTENT LAYOUT --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* LEFT COLUMN: Info */}
            <div className="lg:col-span-2">
              <div className="border-b pb-8 mb-8">
                <h2 className="text-xl font-semibold mb-4 font-geist">About this space</h2>
                <p className="text-gray-600 leading-relaxed">{spaceDetails.description}</p>
              </div>

              <div className="border-b pb-8 mb-8">
                <h2 className="text-xl font-semibold mb-4 font-geist">What this place offers</h2>
                <div className="grid grid-cols-2 gap-4">
                  {spaceDetails.amenities.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-700">
                      {getAmenityIcon(item)}
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 font-geist">Where you'll be</h2>
                <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden relative">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    style={{border:0}}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(spaceDetails.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    allowFullScreen
                    title="Space Location"
                  ></iframe>
                </div>
                <p className="mt-2 text-sm text-gray-500">{spaceDetails.address}</p>
              </div>
            </div>

            {/* RIGHT COLUMN: Sticky Booking Card */}
            <div className="relative">
              <div className="sticky top-24 border rounded-xl shadow-xl p-6 bg-white z-10">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="text-2xl font-bold">₹{getPrice(selectedPlan)}</span>
                    <span className="text-gray-500"> / {billingCycle}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span>⭐</span>
                    <span className="font-semibold">{spaceDetails.rating}</span>
                  </div>
                </div>

                <div className="relative inline-flex items-center bg-gray-100 rounded-full p-1 mb-6 w-full">
                  <button 
                    onClick={() => setBillingCycle('monthly')}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 relative z-10 ${
                      billingCycle === 'monthly' 
                        ? 'text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => setBillingCycle('yearly')}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 relative z-10 flex items-center justify-center gap-1.5 ${
                      billingCycle === 'yearly' 
                        ? 'text-black' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Yearly
                    <span className="text-[9px] font-extrabold bg-red-500 text-white px-1.5 py-0.5 rounded-md shadow-sm">10% OFF</span>
                  </button>
                  <div 
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-300 ease-out shadow-lg ${
                      billingCycle === 'yearly' ? 'translate-x-[calc(100%+8px)]' : 'translate-x-0'
                    }`}
                  />
                </div>

                <div className="space-y-3 mb-6">
                  <label className="block text-xs font-semibold text-gray-500 uppercase">Select Plan</label>
                  {Object.entries(spaceDetails.pricing).map(([key, plan]) => (
                    <div 
                      key={key}
                      onClick={() => setSelectedPlan(key)}
                      className={`border rounded-lg p-3 cursor-pointer transition ${selectedPlan === key ? 'border-black ring-1 ring-black bg-gray-50' : 'hover:border-gray-400'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{plan.name}</span>
                        <span className="font-bold">₹{billingCycle === 'monthly' ? plan.monthly : plan.yearly}</span>
                      </div>
                      <ul className="mt-2 text-xs text-gray-500 list-disc pl-4">
                        {plan.features.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="relative mb-6">
                  <div 
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="border rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
                  >
                    <div className="text-left">
                      <p className="text-xs font-bold uppercase text-gray-500">Start Date</p>
                      <p className="text-sm font-semibold">{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <Calendar className="w-5 h-5 text-gray-500" />
                  </div>

                  {/* Calendar Logic */}
                  {showCalendar && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-56 bg-white border rounded-lg shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <button 
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                          className="p-0.5 hover:bg-gray-100 rounded-full transition"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <h3 className="font-bold text-xs">
                          {currentMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </h3>
                        <button 
                          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                          className="p-0.5 hover:bg-gray-100 rounded-full transition"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-0.5 mb-1">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <div key={day} className="text-center text-[10px] font-semibold text-gray-500 py-0.5">{day}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-0.5">
                        {(() => {
                          const year = currentMonth.getFullYear();
                          const month = currentMonth.getMonth();
                          const firstDay = new Date(year, month, 1).getDay();
                          const daysInMonth = new Date(year, month + 1, 0).getDate();
                          const today = new Date();
                          const days = [];

                          for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="aspect-square" />);
                          for (let day = 1; day <= daysInMonth; day++) {
                            const date = new Date(year, month, day);
                            const isSelected = selectedDate.toDateString() === date.toDateString();
                            const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                            days.push(
                              <button
                                key={day}
                                onClick={() => { if (!isPast) { setSelectedDate(date); setShowCalendar(false); }}}
                                disabled={isPast}
                                className={`aspect-square flex items-center justify-center text-[11px] rounded transition ${
                                  isSelected ? 'bg-[#FFD43B] text-black font-bold shadow-sm' : 
                                  isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 font-medium'
                                }`}
                              >
                                {day}
                              </button>
                            );
                          }
                          return days;
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleBookNow}
                  className="w-full bg-[#FFD43B] hover:bg-[#eec635] text-black py-3 rounded-lg font-bold text-lg transition"
                >
                  Reserve
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">You won't be charged yet</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* 3. Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default SpaceComponent;