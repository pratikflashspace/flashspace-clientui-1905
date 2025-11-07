import React, { useState } from "react";
import {
  Briefcase,
  Building2,
  Rocket,
  Wrench,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Truck,
  Loader2,
  Info,
} from "lucide-react";

const MyBookings: React.FC = () => {
  const services = [
    { id: "onDemand", title: "On-Demand Services", desc: "Instant workspace solutions and hourly meeting rooms.", icon: Wrench },
    { id: "virtualOffice", title: "Virtual Office", desc: "Premium business address and mail handling.", icon: Building2 },
    { id: "coworking", title: "Coworking Spaces", desc: "Collaborative spaces to work, connect, and grow.", icon: Briefcase },
    { id: "businessSetup", title: "Business Setup", desc: "Start your venture with legal, GST & registration support.", icon: Rocket },
  ];

  const allBookings = [
    {
      id: "BKD-1001",
      service: "onDemand",
      workspace: "Meeting Room - Delhi",
      date: "10 Nov 2025",
      time: "10:00 AM - 1:00 PM",
      location: "Delhi NCR Workspace Hub",
      status: "Completed",
      payment: "Paid",
      delivery: "Delivered",
      nextStep: "Closed",
    },
    {
      id: "BKD-1002",
      service: "virtualOffice",
      workspace: "Virtual Office - Mumbai",
      date: "Ongoing",
      time: "Full-time access",
      location: "Mumbai Business Park",
      status: "In Progress",
      payment: "Paid",
      delivery: "Documents Pending",
      nextStep: "Verification Underway",
    },
    {
      id: "BKD-1003",
      service: "coworking",
      workspace: "Coworking Space - Bangalore",
      date: "12 Nov 2025",
      time: "09:00 AM - 06:00 PM",
      location: "Bangalore Tech Hub",
      status: "Payment Pending",
      payment: "Pending",
      delivery: "Not Started",
      nextStep: "Awaiting Payment Confirmation",
    },
    {
      id: "BKD-1004",
      service: "businessSetup",
      workspace: "Company Registration - Patna",
      date: "Initiated on 05 Nov 2025",
      time: "N/A",
      location: "Remote (Patna HQ)",
      status: "Delivery in Progress",
      payment: "Paid",
      delivery: "Ongoing",
      nextStep: "Final Document Dispatch",
    },
  ];

  const [selectedService, setSelectedService] = useState<string | null>(null);

  const filteredBookings = selectedService
    ? allBookings.filter((b) => b.service === selectedService)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50 py-10 px-6 font-[Geist] transition-all duration-300">
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-[Poppins] font-bold text-slate-900">
          My <span className="text-yellow-400">Bookings</span>
        </h1>
        <p className="text-slate-600 mt-3 max-w-2xl mx-auto text-base">
          Select a service below to view your current and past workspace bookings.
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
              className={`cursor-pointer p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between border hover:-translate-y-2 ${
                isSelected
                  ? "bg-yellow-400 text-black border-yellow-500 shadow-lg"
                  : "bg-white border-slate-200 shadow-md hover:shadow-lg"
              }`}
            >
              <div>
                <Icon
                  className={`w-8 h-8 mb-4 transition-all duration-300 ${
                    isSelected ? "text-black" : "text-yellow-400"
                  }`}
                />
                <h3 className="text-xl font-semibold font-[Poppins] mb-2">
                  {service.title}
                </h3>
                <p className={`text-sm ${isSelected ? "text-slate-800" : "text-slate-600"}`}>
                  {service.desc}
                </p>
              </div>
              <div className="mt-5 text-right text-sm font-medium">
                {isSelected ? "Selected ✓" : "View →"}
              </div>
            </div>
          );
        })}
      </div>

      {/* BOOKINGS SECTION */}
      {selectedService && (
        <div className="max-w-6xl mx-auto transform transition-all duration-500 opacity-100 translate-y-0">
          <h2 className="text-2xl font-[Poppins] font-bold text-slate-900 mb-6 flex items-center gap-2">
            {services.find((s) => s.id === selectedService)?.title}
            <span className="text-yellow-400">Bookings</span>
          </h2>

          {filteredBookings.length > 0 ? (
            <div className="space-y-5">
              {filteredBookings.map((booking) => {
                let borderColor = "border-slate-300";
                let StatusIcon = Info;
                if (booking.status === "Completed") {
                  borderColor = "border-green-500";
                  StatusIcon = CheckCircle2;
                } else if (booking.status === "In Progress") {
                  borderColor = "border-yellow-500";
                  StatusIcon = Loader2;
                } else if (booking.status === "Payment Pending") {
                  borderColor = "border-orange-500";
                  StatusIcon = CreditCard;
                } else if (booking.status === "Delivery in Progress") {
                  borderColor = "border-blue-500";
                  StatusIcon = Truck;
                }

                return (
                  <div
                    key={booking.id}
                    className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${borderColor} hover:shadow-md transition-all duration-300`}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <StatusIcon
                            className={`w-5 h-5 ${
                              booking.status === "Completed"
                                ? "text-green-600"
                                : booking.status === "In Progress"
                                ? "text-yellow-500"
                                : booking.status === "Payment Pending"
                                ? "text-orange-500"
                                : booking.status === "Delivery in Progress"
                                ? "text-blue-500"
                                : "text-slate-500"
                            }`}
                          />
                          <h3 className="text-lg font-semibold text-slate-900 font-[Poppins]">
                            {booking.workspace}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-600 font-[Geist] flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-yellow-400" /> {booking.date} • {booking.time}
                        </p>
                        <p className="text-sm text-slate-600 font-[Geist] mt-1 flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-yellow-400" /> {booking.location}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 font-[Geist]">Booking ID: {booking.id}</p>
                      </div>

                      <div className="flex flex-col items-end sm:items-start sm:text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                            booking.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-700"
                              : booking.status === "Payment Pending"
                              ? "bg-orange-100 text-orange-700"
                              : booking.status === "Delivery in Progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {booking.status}
                        </span>

                        <div className="text-xs text-slate-600 font-[Geist]">
                          <p>💳 Payment: <span className="font-semibold">{booking.payment}</span></p>
                          <p>🌟 Delivery: <span className="font-semibold">{booking.delivery}</span></p>
                          <p>📋 Next Step: <span className="font-semibold">{booking.nextStep}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-600 text-center py-12 font-[Geist]">
              No bookings found for this service.
            </p>
          )}
        </div>
      )}

      {/* ✅ FONT IMPORTS */}
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
