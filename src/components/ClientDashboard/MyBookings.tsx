

import React, { useState } from "react";
import {
  Briefcase,
  Building2,
  Rocket,
  Wrench,
  MapPin,
  Clock,
  CheckCircle2,
  CreditCard,
  Truck,
  Loader2,
  Info,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ for routing

const MyBookings: React.FC = () => {
   const navigate = useNavigate(); // ✅ initialize navigation
  const services = [
    { id: "onDemand", title: "On-Demand Services", desc: "Instant workspace solutions and hourly meeting rooms.", icon: Wrench },
    { id: "virtualOffice", title: "Virtual Office", desc: "Premium business address and mail handling.", icon: Building2 },
    { id: "coworking", title: "Coworking Spaces", desc: "Collaborative spaces to work, connect, and grow.", icon: Briefcase },
    { id: "businessSetup", title: "Business Setup", desc: "Start your venture with legal, GST & registration support.", icon: Rocket },
  ];

  // bookings (dates stored in ISO-like YYYY-MM-DD for exact date filtering)
  const allBookings = [
    {
      id: "BKD-1001",
      service: "onDemand",
      workspace: "Meeting Room - Delhi",
      date: "2025-11-10",
      time: "10:00 AM - 1:00 PM",
      city: "Delhi",
      company: "Talenode Analytics Pvt Ltd",
      location: "Delhi NCR Workspace Hub",
      status: "Completed",
      payment: "Paid",
      delivery: "Delivered",
      nextStep: "Closed",
      kyc: "Verified",
    },
    {
      id: "BKD-1002",
      service: "virtualOffice",
      workspace: "Virtual Office - Mumbai",
      date: "2025-11-09",
      time: "Full-time access",
      city: "Mumbai",
      company: "Volmio Systems LLP",
      location: "Mumbai Business Park",
      status: "In Progress",
      payment: "Paid",
      delivery: "Documents Pending",
      nextStep: "Verification Underway",
      kyc: "Verified",
    },
    {
      id: "BKD-1003",
      service: "coworking",
      workspace: "Coworking Space - Bangalore",
      date: "2025-11-12",
      time: "09:00 AM - 06:00 PM",
      city: "Bangalore",
      company: "NextSpace Solutions",
      location: "Bangalore Tech Hub",
      status: "Payment Pending",
      payment: "Pending",
      delivery: "Not Started",
      nextStep: "Awaiting Payment Confirmation",
      kyc: "Not Verified",
    },
    {
      id: "BKD-1004",
      service: "businessSetup",
      workspace: "Company Registration - Patna",
      date: "2025-11-05",
      time: "N/A",
      city: "Patna",
      company: "StartupHub Pvt Ltd",
      location: "Remote (Patna HQ)",
      status: "Delivery in Progress",
      payment: "Paid",
      delivery: "Ongoing",
      nextStep: "Final Document Dispatch",
      kyc: "Verified",
    },
    {
      id: "BKD-1005",
      service: "coworking",
      workspace: "Team Cabin - Pune",
      date: "2025-11-15",
      time: "08:00 AM - 08:00 PM",
      city: "Pune",
      company: "Techify Hub",
      location: "Pune Business Bay",
      status: "Completed",
      payment: "Paid",
      delivery: "Completed",
      nextStep: "Closed",
      kyc: "Verified",
    },
    {
      id: "BKD-1006",
      service: "virtualOffice",
      workspace: "Virtual Office - Chennai",
      date: "2025-11-20",
      time: "Full-time access",
      city: "Chennai",
      company: "SmartDesk Co.",
      location: "Chennai Corporate Plaza",
      status: "In Progress",
      payment: "Pending",
      delivery: "Documents Processing",
      nextStep: "KYC Verification",
      kyc: "Not Verified",
    },
  ];

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // all filter fields kept
  const [filters, setFilters] = useState({
    userId: "",
    bookingId: "",
    email: "",
    phone: "",
    company: "",
    status: "",
    subStatus: "",
    kyc: "",
    city: "",
    workspace: "",
    date: "",
  });

  const topCities = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"];
  const workspaces = ["Stirring Minds - Delhi", "Virtual Office - Mumbai", "Coworking Space - Bangalore", "Company Registration - Patna", "Team Cabin - Pune"];

  const subStatusOptions: Record<string, string[]> = {
    Active: ["Payment Verified", "Auto-Renew On", "KYC Verified"],
    "Pending Activation": ["Awaiting Payment", "Awaiting KYC", "Admin Approval Pending"],
    Suspended: ["Payment Failed", "Verification Failed", "Account Under Review"],
    Cancelled: ["User Cancelled", "Admin Cancelled", "Non-Renewal"],
    Expired: ["Not Renewed", "Plan Expired", "Renewal Grace Period Over"],
    Trial: ["Trial Ongoing", "Trial Expiring Soon"],
    "Renewal Due": ["Payment Pending", "Renewal Reminder Sent"],
  };

  const handleChange = (key: string, value: string) => setFilters({ ...filters, [key]: value });

  const resetFilters = () =>
    setFilters({
      userId: "",
      bookingId: "",
      email: "",
      phone: "",
      company: "",
      status: "",
      subStatus: "",
      kyc: "",
      city: "",
      workspace: "",
      date: "",
    });

  // filter logic (keeps all filter fields)
  const filteredBookings = allBookings.filter((b) => {
    const matchService = selectedService ? b.service === selectedService : true;
    const matchStatus = filters.status ? b.status === filters.status : true;
    const matchSubStatus = filters.subStatus ? (subStatusOptions[filters.status] || []).includes(filters.subStatus) : true;
    const matchCity = filters.city ? b.city === filters.city : true;
    const matchKyc = filters.kyc ? b.kyc === filters.kyc : true;
    const matchCompany = filters.company ? b.company.toLowerCase().includes(filters.company.toLowerCase()) : true;
    const matchWorkspace = filters.workspace ? b.workspace.includes(filters.workspace) : true;
    const matchBookingId = filters.bookingId ? b.id.includes(filters.bookingId) : true;
    const matchDate = filters.date ? b.date === filters.date : true;
    // userId, email, phone are kept for UI but not matched (placeholder) — you can map them to booking fields if available
    return matchService && matchStatus && matchSubStatus && matchCity && matchKyc && matchCompany && matchWorkspace && matchBookingId && matchDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50 py-10 px-6 font-[Geist]">
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-[Poppins] font-bold text-slate-900">
          My <span className="text-yellow-400">Bookings</span>
        </h1>
        <p className="text-slate-600 mt-3 max-w-2xl mx-auto text-base">
          Select a service below to view, filter, and manage your workspace bookings.
        </p>
      </div>

      {/* SERVICE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
        {services.map((service) => {
          const Icon = service.icon;
          const isSelected = selectedService === service.id;
          return (
            <div
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`cursor-pointer p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                isSelected
                  ? "bg-yellow-400 text-black border-yellow-500 shadow-lg"
                  : "bg-white border-slate-200 shadow-md hover:shadow-lg"
              }`}
            >
              <div>
                <Icon className={`w-8 h-8 mb-4 ${isSelected ? "text-black" : "text-yellow-400"}`} />
                <h3 className="text-xl font-semibold font-[Poppins] mb-2">{service.title}</h3>
                <p className={`text-sm ${isSelected ? "text-slate-800" : "text-slate-600"}`}>{service.desc}</p>
              </div>
              <div className="mt-5 text-right text-sm font-medium">{isSelected ? "Selected ✓" : "View →"}</div>
            </div>
          );
        })}
      </div>

      {/* BOOKINGS SECTION */}
      {selectedService && (
        <div className="max-w-7xl mx-auto transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-[Poppins] font-bold text-slate-900 flex items-center gap-2">
              {services.find((s) => s.id === selectedService)?.title} <span className="text-yellow-400">Bookings</span>
            </h2>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
            >
              <Filter className="w-5 h-5" /> Filters
            </button>
          </div>

          {/* FILTER PANEL */}
          {showFilters && (
            <div className="bg-white shadow-md rounded-2xl p-6 mb-8 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-[Poppins]">
              <input type="text" placeholder="User ID" value={filters.userId} onChange={(e) => handleChange("userId", e.target.value)} className="border border-slate-300 rounded-lg p-2" />
              <input type="text" placeholder="Booking ID" value={filters.bookingId} onChange={(e) => handleChange("bookingId", e.target.value)} className="border border-slate-300 rounded-lg p-2" />
              <input type="email" placeholder="Email" value={filters.email} onChange={(e) => handleChange("email", e.target.value)} className="border border-slate-300 rounded-lg p-2" />
              <input type="text" placeholder="Phone No." value={filters.phone} onChange={(e) => handleChange("phone", e.target.value)} className="border border-slate-300 rounded-lg p-2" />
              <input type="text" placeholder="Company" value={filters.company} onChange={(e) => handleChange("company", e.target.value)} className="border border-slate-300 rounded-lg p-2" />

              <select value={filters.status} onChange={(e) => { handleChange("status", e.target.value); handleChange("subStatus", ""); }} className="border border-slate-300 rounded-lg p-2 font-[Poppins]">
                <option value="">Subscription Status</option>
                <option>Active</option>
                <option>Expired</option>
                <option>Pending Activation</option>
                <option>Suspended</option>
                <option>Cancelled</option>
                <option>Trial</option>
                <option>Renewal Due</option>
                <option>Completed</option>
              </select>

              <select value={filters.subStatus} onChange={(e) => handleChange("subStatus", e.target.value)} className="border border-slate-300 rounded-lg p-2 font-[Poppins]">
                <option value="">Subscription Sub Status</option>
                {filters.status &&
                  subStatusOptions[filters.status]?.map((sub) => (
                    <option key={sub}>{sub}</option>
                  ))}
              </select>

              <select value={filters.kyc} onChange={(e) => handleChange("kyc", e.target.value)} className="border border-slate-300 rounded-lg p-2 font-[Poppins]">
                <option value="">KYC Type</option>
                <option>Verified</option>
                <option>Not Verified</option>
              </select>

              <input type="date" value={filters.date} onChange={(e) => handleChange("date", e.target.value)} className="border border-slate-300 rounded-lg p-2" />

              <select value={filters.city} onChange={(e) => handleChange("city", e.target.value)} className="border border-slate-300 rounded-lg p-2 font-[Poppins]">
                <option value="">Cities</option>
                {topCities.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>

              <select value={filters.workspace} onChange={(e) => handleChange("workspace", e.target.value)} className="border border-slate-300 rounded-lg p-2 font-[Poppins]">
                <option value="">Workspaces</option>
                {workspaces.map((space) => (
                  <option key={space}>{space}</option>
                ))}
              </select>

              <div className="flex gap-2 col-span-full mt-2">
                <button onClick={() => setFilters({ ...filters })} className="bg-yellow-400 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500">Apply Filters</button>
                <button onClick={resetFilters} className="border border-slate-300 px-4 py-2 rounded-lg font-semibold hover:bg-slate-100">Reset</button>
              </div>
            </div>
          )}

          {/* BOOKINGS CARD LIST */}
          

{filteredBookings.length > 0 ? (
  <div className="space-y-5">
    {filteredBookings.map((b) => {
      let borderColor = "border-slate-300";
      if (b.status === "Completed") borderColor = "border-green-500";
      else if (b.status === "In Progress") borderColor = "border-yellow-500";
      else if (b.status === "Payment Pending") borderColor = "border-orange-500";
      else if (b.status === "Delivery in Progress") borderColor = "border-blue-500";

      return (
        <div
          key={b.id}
          className={`bg-white p-6 rounded-2xl shadow-md border-l-4 ${borderColor} w-full hover:shadow-lg transition-all duration-300`}
        >
          {/* GRID: Left top, middle center, right top-aligned */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start relative">
            
            {/* LEFT SIDE - Top aligned */}
            <div className="flex flex-col justify-start">
              <h3 className="text-lg font-[Poppins] font-semibold">{b.workspace}</h3>
              <p className="text-sm text-slate-600 font-[Geist] flex items-center mt-1">
                <Clock className="w-4 h-4 mr-1 text-yellow-400" /> {b.date} • {b.time}
              </p>
              <p className="text-sm text-slate-600 font-[Geist] flex items-center mt-1">
                <MapPin className="w-4 h-4 mr-1 text-yellow-400" /> {b.location}
              </p>
            </div>

            {/* MIDDLE - aligned center */}
            <div className="flex flex-col justify-center">
              <p className="text-sm text-slate-700">
                <span className="font-[Poppins] font-semibold">Company:</span> {b.company}
              </p>
              <p className="text-sm text-slate-700 mt-1">
                <span className="font-[Poppins] font-semibold">City:</span> {b.city}
              </p>
              <p className="text-sm text-slate-700 mt-1">
                <span className="font-[Poppins] font-semibold">KYC:</span> {b.kyc}
              </p>
              <p className="text-sm text-slate-700 mt-1">
                <span className="font-[Poppins] font-semibold">Booking ID:</span> {b.id}
              </p>
            </div>

            {/* RIGHT SIDE - top aligned with left, with View Details on top-right */}
            <div className="flex flex-col justify-start items-end text-right relative">
              {/* View Details */}
              <button
                onClick={() => navigate(`/client/viewdetails/${b.id}`)} // ✅ navigation added
                className="absolute -top-4 right-0 text-sm font-[Poppins] font-semibold text-blue-600 hover:underline"
              >
                View Details
              </button>

              {/* Right section data - top aligned same as left */}
              <div className="mt-0">
                <p className="text-sm text-slate-700">
                  <span className="font-[Poppins] font-semibold">Payment:</span> {b.payment}
                </p>
                <p className="text-sm text-slate-700 mt-1">
                  <span className="font-[Poppins] font-semibold">Delivery:</span> {b.delivery}
                </p>
                <p className="text-sm text-slate-700 mt-1">
                  <span className="font-[Poppins] font-semibold">Next Step:</span> {b.nextStep}
                </p>
                <p className="text-sm mt-2">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background:
                        b.status === "Completed"
                          ? "#ecfdf5"
                          : b.status === "In Progress"
                          ? "#fffbeb"
                          : b.status === "Payment Pending"
                          ? "#fff7ed"
                          : "#eff6ff",
                      color:
                        b.status === "Completed"
                          ? "#065f46"
                          : b.status === "In Progress"
                          ? "#92400e"
                          : b.status === "Payment Pending"
                          ? "#9a3412"
                          : "#1e40af",
                    }}
                  >
                    {b.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>
) : (
  <p className="text-center text-slate-600 font-[Geist] py-8">
    No bookings found matching filters.
  </p>
)}


        </div>
      )}

      {/* FONT IMPORTS */}
      <style jsx global>{`
        @font-face {
          font-family: "Poppins";
          src: url("/fonts/Poppins-Regular.ttf") format("truetype");
        }
        @font-face {
          font-family: "Geist";
          src: url("/fonts/Geist-Regular.ttf") format("truetype");
        }
      `}</style>
    </div>
  );
};

export default MyBookings;
