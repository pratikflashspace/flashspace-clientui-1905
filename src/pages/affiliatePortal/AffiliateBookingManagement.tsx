import React, { useState } from "react";
import {
    Eye,
    Share2,
    Search,
    Filter,
    Download,
    Calendar,
    MapPin,
    X,
    Building2,
    Mail,
    Phone,
    MessageSquare,
    FileText,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isToday, isThisWeek, isThisMonth, parse } from "date-fns";

// --- Types & Interfaces ---
interface Booking {
    id: string;
    company: string;
    contactPerson: string; // Added for modal
    email: string; // Added for modal
    phone: string; // Added for modal
    plan: string;
    location: string;
    duration: string;
    amount: string; // Added for modal
    commission: string;
    status: "Active" | "Pending" | "Renewal Due";
}

// --- Mock Data (Extended with details for the popup) ---
const activeBookings: Booking[] = [
    {
        id: "BO-2024-001",
        company: "Tech Innovations Pvt Ltd",
        contactPerson: "Rahul Sharma",
        email: "rahul@techinnovations.com",
        phone: "+91 98765 43210",
        plan: "Virtual Office Premium",
        location: "Mumbai - BKC",
        duration: "Jan 15, 2024 - Jan 15, 2025",
        amount: "₹45,000",
        commission: "₹4,500",
        status: "Active",
    },
    {
        id: "BO-2024-002",
        company: "StartupXYZ Solutions",
        contactPerson: "Aditi Verma",
        email: "aditi@startupxyz.com",
        phone: "+91 98123 45678",
        plan: "Team Space",
        location: "Delhi - CP",
        duration: "Dec 1, 2023 - Nov 30, 2024",
        amount: "₹1,20,000",
        commission: "₹12,000",
        status: "Active",
    },
    {
        id: "BO-2024-003",
        company: "Global Consulting",
        contactPerson: "Vikram Singh",
        email: "vikram@globalcons.com",
        phone: "+91 99887 76655",
        plan: "Virtual Office Standard",
        location: "Bangalore - HSR",
        duration: "Feb 1, 2024 - Jan 31, 2025",
        amount: "₹28,000",
        commission: "₹2,800",
        status: "Active",
    },
    {
        id: "BO-2024-006",
        company: "Alpha Wave Inc",
        contactPerson: "Sneha Gupta",
        email: "sneha@alphawave.com",
        phone: "+91 91234 56789",
        plan: "Meeting Rooms",
        location: "Pune - Baner",
        duration: "Mar 10, 2024 - Mar 10, 2025",
        amount: "₹15,000",
        commission: "₹1,500",
        status: "Active",
    },
];

const pendingBookings: Booking[] = [
    {
        id: "BO-2024-004",
        company: "Design Hub Studios",
        contactPerson: "Amit Roy",
        email: "amit@designhub.com",
        phone: "+91 88776 65544",
        plan: "Hot Desk Monthly",
        location: "Chennai - Anna Nagar",
        duration: "Feb 5, 2024 - Mar 5, 2024",
        amount: "₹8,000",
        commission: "₹800",
        status: "Pending",
    },
    {
        id: "BO-2024-005",
        company: "Fintech Solutions Inc",
        contactPerson: "Priya Nair",
        email: "priya@fintechsol.com",
        phone: "+91 77665 54433",
        plan: "Virtual Office Premium",
        location: "Mumbai - Andheri",
        duration: "Feb 10, 2024 - Feb 10, 2025",
        amount: "₹52,000",
        commission: "₹5,200",
        status: "Pending",
    },
    {
        id: "BO-2024-007",
        company: "EduTech Global",
        contactPerson: "Rohan Das",
        email: "rohan@edutech.com",
        phone: "+91 66554 43322",
        plan: "Team Space",
        location: "Noida - Sec 62",
        duration: "Pending Activation",
        amount: "₹80,000",
        commission: "₹8,000",
        status: "Pending",
    },
];

const renewalBookings: Booking[] = [
    {
        id: "BO-2023-089",
        company: "DataFlow Analytics",
        contactPerson: "Kavita Iyer",
        email: "kavita@dataflow.com",
        phone: "+91 55443 32211",
        plan: "Team Space",
        location: "Bangalore - Koramangala",
        duration: "Feb 15, 2023 - Feb 15, 2024",
        amount: "₹85,000",
        commission: "₹8,500",
        status: "Renewal Due",
    },
    {
        id: "BO-2023-092",
        company: "CloudTech Systems",
        contactPerson: "Arjun Reddy",
        email: "arjun@cloudtech.com",
        phone: "+91 44332 21100",
        plan: "Virtual Office Standard",
        location: "Hyderabad - HITEC City",
        duration: "Feb 20, 2023 - Feb 20, 2024",
        amount: "₹32,000",
        commission: "₹3,200",
        status: "Renewal Due",
    },
    {
        id: "BO-2023-095",
        company: "Bright Future Marketing",
        contactPerson: "Neha Kapoor",
        email: "neha@brightfuture.com",
        phone: "+91 33221 10099",
        plan: "Hot Desk",
        location: "Mumbai - Powai",
        duration: "Feb 28, 2023 - Feb 28, 2024",
        amount: "₹12,000",
        commission: "₹1,200",
        status: "Renewal Due",
    },
];

// --- Components ---

const StatCard = ({
    value,
    label,
    colorClass,
    delay,
}: {
    value: string;
    label: string;
    colorClass: string;
    delay: number;
}) => (
    <div
        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
        style={{ animationDelay: `${delay}ms` }}
    >
        <h3 className={`text-3xl font-bold ${colorClass} mb-1`}>{value}</h3>
        <p className="text-gray-500 font-medium text-sm">{label}</p>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        Active: "bg-green-50 text-green-600 border-green-100",
        Pending: "bg-yellow-50 text-yellow-600 border-yellow-100",
        "Renewal Due": "bg-orange-50 text-orange-600 border-orange-100",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${styles[status as keyof typeof styles] || "bg-gray-50 text-gray-600"}`}
        >
            {status === "Renewal Due"
                ? "⚠ Renewal Due"
                : status === "Active"
                  ? "✓ Active"
                  : "⏳ Pending"}
        </span>
    );
};

// --- MODAL COMPONENT ---
const BookingDetailsModal = ({
    booking,
    onClose,
}: {
    booking: Booking;
    onClose: () => void;
}) => {
    if (!booking) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-2">
                    <h2 className="text-xl font-bold text-slate-900">
                        Booking Details
                    </h2>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={booking.status} />
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="p-6 pt-2 overflow-y-auto space-y-6">
                    {/* Section 1: Basic Info */}
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-xl space-y-1">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                Booking ID
                            </p>
                            <p className="text-lg font-bold text-[#5aa39c] font-mono">
                                {booking.id}
                            </p>
                        </div>

                        <div className="space-y-3 pl-1">
                            <div className="flex items-start gap-3">
                                <Building2
                                    size={20}
                                    className="text-[#5aa39c] mt-0.5 shrink-0"
                                />
                                <div>
                                    <p className="font-bold text-slate-900">
                                        {booking.company}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {booking.contactPerson}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin
                                    size={20}
                                    className="text-[#5aa39c] shrink-0"
                                />
                                <p className="text-sm text-slate-700">
                                    {booking.location}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar
                                    size={20}
                                    className="text-[#5aa39c] shrink-0"
                                />
                                <p className="text-sm text-slate-700">
                                    {booking.duration}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Plan Details */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-3">
                            Plan Details
                        </h3>
                        <div className="bg-[#f8f9fa] p-5 rounded-xl space-y-3 border border-gray-100">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 font-medium">
                                    Plan Type
                                </span>
                                <span className="text-xs font-semibold px-2 py-1 bg-white border border-gray-200 rounded text-gray-700 shadow-sm">
                                    {booking.plan}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                                <span className="text-sm text-gray-500 font-medium">
                                    Booking Amount
                                </span>
                                <span className="text-sm font-bold text-slate-900">
                                    {booking.amount}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                                <span className="text-sm text-gray-500 font-medium">
                                    Your Commission
                                </span>
                                <span className="text-base font-bold text-[#5aa39c]">
                                    {booking.commission}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Contact Info */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-3">
                            Contact Information
                        </h3>
                        <div className="bg-[#f8f9fa] p-5 rounded-xl space-y-3 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <Mail size={16} className="text-[#5aa39c]" />
                                <p className="text-sm text-slate-700">
                                    {booking.email}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-[#5aa39c]" />
                                <p className="text-sm text-slate-700">
                                    {booking.phone}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 grid grid-cols-2 gap-3 bg-white">
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-slate-700 font-semibold text-sm hover:bg-gray-50 transition-colors">
                        <Download size={18} />
                        Agreement
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5aa39c] text-white font-semibold text-sm hover:bg-[#4a8b85] shadow-sm shadow-teal-100 transition-colors">
                        <MessageSquare size={18} />
                        Contact
                    </button>
                </div>
            </div>
        </div>
    );
};



// --- MAIN PAGE COMPONENT ---
const BookingManagement = () => {
    const [activeTab, setActiveTab] = useState<
        "active" | "pending" | "renewals"
    >("active");
    const [searchQuery, setSearchQuery] = useState("");
    const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");

    // State for Modal
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
        null,
    );

    const getCurrentData = () => {
        switch (activeTab) {
            case "active":
                return activeBookings;
            case "pending":
                return pendingBookings;
            case "renewals":
                return renewalBookings;
            default:
                return activeBookings;
        }
    };

    const filteredData = getCurrentData().filter((item) => {
        const matchesSearch =
            item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.id.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesDate = true;
        if (dateFilter !== "all") {
            try {
                // Extract start date from duration string (e.g., "Jan 15, 2024 - Jan 15, 2025")
                const startDateString = item.duration.split(" - ")[0];
                const startDate = parse(startDateString, "MMM d, yyyy", new Date());

                if (dateFilter === "today") {
                    matchesDate = isToday(startDate);
                } else if (dateFilter === "week") {
                    matchesDate = isThisWeek(startDate);
                } else if (dateFilter === "month") {
                    matchesDate = isThisMonth(startDate);
                }
            } catch (error) {
                console.error("Date parsing error", error);
                matchesDate = false;
            }
        }

        return matchesSearch && matchesDate;
    });

    return (
        <div className="min-h-screen bg-[#fafafa] p-6 lg:p-10 font-sans w-full relative">
            {/* Modal Injection */}
            {selectedBooking && (
                <BookingDetailsModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                />
            )}

            <div className="w-full space-y-8 animate-fade-in">
                {/* Header */}
{/* Header Removed */}

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        value="34"
                        label="Active Bookings"
                        colorClass="text-slate-900"
                        delay={0}
                    />
                    <StatCard
                        value="5"
                        label="Pending Activation"
                        colorClass="text-yellow-600"
                        delay={100}
                    />
                    <StatCard
                        value="8"
                        label="Renewals Due"
                        colorClass="text-blue-600"
                        delay={200}
                    />
                    <StatCard
                        value="₹2.8L"
                        label="Total Commissions"
                        colorClass="text-[#5aa39c]"
                        delay={300}
                    />
                </div>

                {/* Filter & Tabs */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex p-1 bg-gray-100/80 rounded-xl overflow-x-auto max-w-full">
                            {(["active", "pending", "renewals"] as const).map(
                                (tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`
                    px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 capitalize whitespace-nowrap
                    ${
                        activeTab === tab
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                    }
                  `}
                                    >
                                        {tab === "active"
                                            ? "Active Bookings"
                                            : tab === "renewals"
                                              ? "Upcoming Renewals"
                                              : "Pending"}
                                    </button>
                                ),
                            )}
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-initial group">
                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#5aa39c] transition-colors"
                                />
                                <input
                                    type="text"
                                    placeholder="Search bookings..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5aa39c]/20 focus:border-[#5aa39c] transition-all text-sm"
                                />
                            </div>
                            
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className={`p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${dateFilter !== 'all' ? 'text-[#5aa39c] border-[#5aa39c]' : 'text-gray-600'}`}>
                                        <Filter size={18} />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-white">
                                    <DropdownMenuLabel>Filter by Date</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setDateFilter("all")}>
                                        All Time
                                        {dateFilter === "all" && <span className="ml-auto text-[#5aa39c]">✓</span>}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setDateFilter("today")}>
                                        Today
                                        {dateFilter === "today" && <span className="ml-auto text-[#5aa39c]">✓</span>}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setDateFilter("week")}>
                                        This Week
                                        {dateFilter === "week" && <span className="ml-auto text-[#5aa39c]">✓</span>}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setDateFilter("month")}>
                                        This Month
                                        {dateFilter === "month" && <span className="ml-auto text-[#5aa39c]">✓</span>}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                                <Download size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-slide-up">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        {[
                                            "Booking ID",
                                            "Company",
                                            "Plan",
                                            "Location",
                                            "Duration",
                                            "Commission",
                                            "Status",
                                            "Actions",
                                        ].map((head) => (
                                            <th
                                                key={head}
                                                className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                                            >
                                                {head}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredData.length > 0 ? (
                                        filteredData.map((booking, idx) => (
                                            <tr
                                                key={booking.id}
                                                className="group hover:bg-[#fafafa] transition-colors duration-150"
                                                style={{
                                                    animationDelay: `${idx * 50}ms`,
                                                }}
                                            >
                                                <td className="px-6 py-4 text-sm font-medium text-slate-900 whitespace-nowrap">
                                                    {booking.id}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                                                    {booking.company}
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 border border-gray-200 whitespace-nowrap">
                                                        {booking.plan}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin
                                                            size={14}
                                                            className="text-gray-400"
                                                        />
                                                        {booking.location}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar
                                                            size={14}
                                                            className="text-gray-400"
                                                        />
                                                        {booking.duration}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-[#5aa39c] whitespace-nowrap">
                                                    {booking.commission}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <StatusBadge
                                                        status={booking.status}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        {/* Eye Button now triggers modal */}
                                                        <button
                                                            onClick={() =>
                                                                setSelectedBooking(
                                                                    booking,
                                                                )
                                                            }
                                                            className="p-2 bg-gray-50 hover:bg-teal-50 text-gray-500 hover:text-[#5aa39c] rounded-full transition-all duration-200"
                                                            title="View Details"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button className="p-2 bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded-full transition-all duration-200">
                                                            <Share2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="px-6 py-12 text-center text-gray-400"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <Search
                                                        size={32}
                                                        className="opacity-20"
                                                    />
                                                    <p>No bookings found.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-2 text-sm text-gray-500">
                        <span>Showing {filteredData.length} entries</span>
                        <div className="flex gap-2">
                            <button
                                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                                disabled
                            >
                                Previous
                            </button>
                            <button className="px-3 py-1 border rounded hover:bg-gray-50">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; animation-fill-mode: forwards; }
        .animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
        .animate-scale-up { animation: scaleUp 0.2s ease-out forwards; }
      `}</style>
        </div>
    );
};

export default BookingManagement;
