import React, { useEffect, useState } from "react";
import {
    AlertCircle,
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    RefreshCw,
    Download,
    Eye,
    Loader2,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Search,
    X,
} from "lucide-react";
import { affiliatePortalService, AffiliateBookingDto } from "@/services/affiliatePortal.service";
import { GetInTouchModal } from "@/components/modals/GetInTouchModal";

interface Booking {
    id: string;
    company: string;
    contactPerson: string;
    email: string;
    phone: string;
    plan: string;
    location: string;
    duration: string;
    amount: string;
    commission: string;
    status: "Active" | "Pending" | "Renewal Due";
}

const formatINR = (value: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));

const formatDate = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const isRenewalDue = (booking: AffiliateBookingDto) => {
    if (booking.status !== "active" || !booking.endDate) return false;
    const daysLeft = (new Date(booking.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return Number.isFinite(daysLeft) && daysLeft >= 0 && daysLeft <= 30;
};

const toDisplayStatus = (booking: AffiliateBookingDto): Booking["status"] => {
    if (isRenewalDue(booking)) return "Renewal Due";
    if (booking.status === "active") return "Active";
    return "Pending";
};

const mapBooking = (booking: AffiliateBookingDto): Booking => {
    const dateRange =
        booking.startDate || booking.endDate
            ? [formatDate(booking.startDate), formatDate(booking.endDate)].filter(Boolean).join(" - ")
            : booking.duration;

    return {
        id: booking.bookingNumber || booking.id,
        company: booking.company || booking.client.name,
        contactPerson: booking.client.name,
        email: booking.client.email,
        phone: booking.client.phone,
        plan: booking.plan,
        location: [booking.city, booking.area || booking.space].filter((item) => item && item !== "—").join(" - ") || "—",
        duration: dateRange || booking.duration || "—",
        amount: formatINR(booking.amount),
        commission: formatINR(booking.commission),
        status: toDisplayStatus(booking),
    };
};

const StatCard = ({
    value,
    label,
    icon: Icon,
    delay,
}: {
    value: string;
    label: string;
    icon: any;
    delay: number;
}) => (
    <div
        className="bg-white border border-[#D4E0D0] rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-[#6B8F78]">{label}</span>
            <div className="w-8 h-8 rounded-lg bg-[#36503F]/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-[#36503F]" />
            </div>
        </div>
        <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-[24px] font-extrabold text-[#1A1A1A] tracking-tight">{value}</h3>
    </div>
);

const StatusBadge = ({ status }: { status: Booking["status"] }) => {
    const styles = {
        Active: "text-[#10b981] bg-[#f0fdf4] border-[#bcf0da]",
        Pending: "text-[#f59e0b] bg-[#fffbeb] border-[#fef3c7]",
        "Renewal Due": "text-[#ef4444] bg-[#fef2f2] border-[#fee2e2]",
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 w-fit ${styles[status]}`}>
            {status === "Active" && <CheckCircle size={12} strokeWidth={3} />}
            {status === "Pending" && <div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse" />}
            {status}
        </span>
    );
};

const BookingDetailsModal = ({
    booking,
    onClose,
    onContact,
}: {
    booking: Booking;
    onClose: () => void;
    onContact: () => void;
}) => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
        <div className="relative w-full max-w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 pb-2">
                <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-xl font-bold text-slate-900">Booking Details</h2>
                <div className="flex items-center gap-3">
                    <StatusBadge status={booking.status} />
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="p-6 pt-2 overflow-y-auto space-y-6 custom-scrollbar" data-lenis-prevent>
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl space-y-1">
                        <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wide text-[16px]">Booking ID</p>
                        <p className="text-lg font-bold text-[#334D3D] font-mono">{booking.id}</p>
                    </div>

                    <div className="space-y-3 pl-1">
                        <div className="flex items-start gap-3">
                            <Building2 size={20} className="text-[#334D3D] mt-0.5 shrink-0" />
                            <div>
                                <p className="font-bold text-slate-900">{booking.company}</p>
                                <p className="text-sm text-gray-500">{booking.contactPerson}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin size={20} className="text-[#334D3D] shrink-0" />
                            <p className="text-sm text-slate-700">{booking.location}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar size={20} className="text-[#334D3D] shrink-0" />
                            <p className="text-sm text-slate-700">{booking.duration}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm font-bold text-slate-900 mb-3">Plan Details</h3>
                    <div className="bg-[#f8f9fa] p-5 rounded-xl space-y-3 border border-gray-100">
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-sm text-gray-500 font-medium">Plan Type</span>
                            <span className="text-xs font-semibold px-2 py-1 bg-white border border-gray-200 rounded text-gray-700 shadow-sm text-right">{booking.plan}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                            <span className="text-sm text-gray-500 font-medium">Booking Amount</span>
                            <span className="text-sm font-bold text-slate-900">{booking.amount}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                            <span className="text-sm text-gray-500 font-medium">Your Commission</span>
                            <span className="text-base font-bold text-[#334D3D]">{booking.commission}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm font-bold text-slate-900 mb-3">Contact Information</h3>
                    <div className="bg-[#f8f9fa] p-5 rounded-xl space-y-3 border border-gray-100">
                        <div className="flex items-center gap-3">
                            <Mail size={16} className="text-[#334D3D]" />
                            <p className="text-sm text-slate-700 break-all">{booking.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone size={16} className="text-[#334D3D]" />
                            <p className="text-sm text-slate-700">{booking.phone}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-white">
                <button 
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 text-slate-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                    Close
                </button>
                <button 
                    onClick={onContact}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#334D3D] text-white font-semibold text-sm hover:bg-[#26392D] shadow-sm shadow-emerald-100 transition-colors"
                >
                    <MessageSquare size={18} />
                    Contact
                </button>
            </div>
        </div>
    </div>
);

const BookingManagement = () => {
    const [activeTab, setActiveTab] = useState<"active" | "pending" | "renewals">("active");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
    const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
    const [renewalBookings, setRenewalBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isContactOpen, setIsContactOpen] = useState(false);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await affiliatePortalService.getBookings();
            if (!response.success || !response.data) {
                throw new Error(response.message || "Failed to fetch bookings");
            }

            const mapped = response.data.bookings.map(mapBooking);
            setActiveBookings(mapped.filter((item) => item.status === "Active"));
            setPendingBookings(mapped.filter((item) => item.status === "Pending"));
            setRenewalBookings(mapped.filter((item) => item.status === "Renewal Due"));
        } catch (err: any) {
            setActiveBookings([]);
            setPendingBookings([]);
            setRenewalBookings([]);
            setError(err?.response?.data?.message || err?.message || "Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

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
        const query = searchQuery.toLowerCase();
        return (
            item.company.toLowerCase().includes(query) ||
            item.contactPerson.toLowerCase().includes(query) ||
            item.id.toLowerCase().includes(query)
        );
    });

    return (
 <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-[#f7f7f6] font-sans w-full relative"> 
            <GetInTouchModal open={isContactOpen} onClose={() => setIsContactOpen(false)} />
            {selectedBooking && (
                <BookingDetailsModal 
                    booking={selectedBooking} 
                    onClose={() => setSelectedBooking(null)} 
                    onContact={() => {
                        setSelectedBooking(null);
                        setIsContactOpen(true);
                    }}
                />
            )}

            <div className="w-full space-y-8 animate-fade-in">
                <div className="animate-fade-in-down mb-10">
                    <h1 style={{ fontFamily: "'Inter', sans-serif" }} className="text-3xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Booking <span className="text-[#36503F] italic">Management</span>
                    </h1>
                    <p className="mt-2 text-[16px] font-medium text-[#6B7280] tracking-tight">
                        Track all your referred clients and their bookings
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard value={`${activeBookings.length + pendingBookings.length + renewalBookings.length}`} label="Total Bookings" icon={Calendar} delay={0} />
                    <StatCard value={`${activeBookings.length}`} label="Active Bookings" icon={CheckCircle} delay={100} />
                    <StatCard value={`${pendingBookings.length}`} label="Pending Activation" icon={Clock} delay={200} />
                    <StatCard value={`${renewalBookings.length}`} label="Renewals Due" icon={RefreshCw} delay={300} />
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex bg-[#f4f5f0] p-1.5 rounded-xl w-full overflow-x-auto lg:w-fit">
                            {(["active", "pending", "renewals"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-2.5 rounded-lg text-[13px] font-bold transition-all duration-300 capitalize whitespace-nowrap flex-1 lg:flex-none ${
                                        activeTab === tab
                                            ? "bg-[#f8f8f8] text-[#1a2d1d] shadow-sm ring-1 ring-black/5"
                                            : "text-[#64748b] hover:text-[#1a2d1d]"
                                    }`}
                                >
                                    {tab === "active" ? "Active Bookings" : tab === "renewals" ? "Upcoming Renewals" : "Pending"}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full lg:w-80">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                            <input
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Search booking or client"
                                className="w-full rounded-xl border border-[#e2e8f0] bg-white py-3 pl-10 pr-4 text-sm font-medium text-[#1a2d1d] outline-none transition focus:border-[#35503F]"
                            />
                        </div>
                    </div>

                    <div className="bg-[#f8f8f8] rounded-2xl border-[3px] border-[#f1f2ed] shadow overflow-hidden animate-slide-up">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#64748b]">
                                <Loader2 size={30} className="animate-spin text-[#35503F]" />
                                <p className="text-sm font-semibold">Loading bookings...</p>
                            </div>
                        ) : error ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-3 text-center px-6">
                                <AlertCircle size={34} className="text-red-400" />
                                <p className="text-sm font-semibold text-slate-700">{error}</p>
                                <button onClick={fetchBookings} className="text-sm font-bold text-[#35503F] underline">
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto" data-lenis-prevent="true">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-[3px] border-[#f1f2ed] bg-[#f6f6f4]">
                                            {["Booking ID", "Client", "Plan", "Location", "Duration", "Amount", "Commission", "Status", "Actions"].map((head) => (
                                                <th key={head} className="px-6 py-5 text-[12px] font-bold text-[#64748b] uppercase tracking-wider whitespace-nowrap">
                                                    {head}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-[3px] divide-[#f1f2ed]">
                                        {filteredData.length > 0 ? (
                                            filteredData.map((booking, idx) => (
                                                <tr key={booking.id} className="group hover:bg-[#f7f7f6] transition-colors duration-150" style={{ animationDelay: `${idx * 50}ms` }}>
                                                    <td className="px-6 py-6 text-[13px] font-bold text-[#1a2d1d] whitespace-nowrap">{booking.id}</td>
                                                    <td className="px-6 py-6 text-[13px] text-[#1a2d1d] font-bold whitespace-nowrap">{booking.company}</td>
                                                    <td className="px-6 py-6 whitespace-nowrap">
                                                        <div className="inline-flex px-3 py-1.5 bg-[#f8fafc]/80 rounded-xl text-[11px] font-bold text-[#475569] border border-[#e2e8f0]/60 whitespace-nowrap leading-tight">
                                                            {booking.plan}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 text-[13px] text-[#64748b] font-medium whitespace-nowrap">
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin size={14} className="text-gray-300" />
                                                            {booking.location}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 text-[13px] text-[#64748b] font-medium whitespace-nowrap">
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar size={14} className="text-gray-300" />
                                                            {booking.duration}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 text-[13px] font-bold text-[#1a2d1d] whitespace-nowrap">{booking.amount}</td>
                                                    <td className="px-6 py-6 text-[14px] font-black text-[#10b981] whitespace-nowrap">{booking.commission}</td>
                                                    <td className="px-6 py-6 whitespace-nowrap">
                                                        <StatusBadge status={booking.status} />
                                                    </td>
                                                    <td className="px-6 py-6 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => setSelectedBooking(booking)}
                                                                className="p-2.5 bg-[#f8fafc] hover:bg-[#1a2d1d]/5 text-[#64748b] hover:text-[#1a2d1d] rounded-xl transition-all duration-200 border border-transparent hover:border-[#1a2d1d]/10"
                                                                title="View Details"
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Search size={32} className="opacity-20" />
                                                        <p>No bookings found.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
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
