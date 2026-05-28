import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    FileText,
    Plus,
    Sparkles,
    Loader2,
    Search,
    X,
    ChevronLeft,
    ChevronRight,
    Eye,
    Download,
    MapPin,
    Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import QuotationCard from "@/components/affiliatePortal/QuotationCard";
import QuotationStats from "@/components/affiliatePortal/QuotationStats";
import { useAuth } from "@/contexts/AuthContext";
import { affiliatePortalService } from "@/services/affiliatePortal.service";
import { toast } from "react-hot-toast";
import {
    AFFILIATE_DISCOUNTS,
    AFFILIATE_PRICING_CITIES,
    AFFILIATE_PRICING_SPACES,
    AffiliateDiscountPercent,
} from "@/data/affiliatePricing";

// Static Data for Backend Readiness
const STATIC_RECENT_QUOTATIONS = [
    {
        id: "QT-2024-089",
        clientName: "TechStart Solutions",
        spaceDetails: "Private Office - 10 Seater",
        location: "Koramangala, Bangalore",
        price: "₹85,000/month",
        date: "Jan 28, 2024",
        status: "Sent" as const,
    },
    // ... (keep other static data if needed for fallback)
];

interface QuotationFormErrors {
    clientName?: string;
    email?: string;
    phone?: string;
    companyName?: string;
    spaceType?: string;
    city?: string;
    location?: string;
    numberOfSeats?: string;
    duration?: string;
    startDate?: string;
    discountPercent?: string;
}

const QuotationGenerator = () => {
    const { user, isAuthenticated } = useAuth();
    const [recentQuotations, setRecentQuotations] = useState<any[]>(STATIC_RECENT_QUOTATIONS);
    const [quotationStats, setQuotationStats] = useState({
        totalSent: 0,
        viewRate: 0,
        accepted: 0,
        conversion: 0,
    });
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    // View All Modal State
    const [showAllModal, setShowAllModal] = useState(false);
    const [allQuotations, setAllQuotations] = useState<any[]>([]);
    const [allLoading, setAllLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;

    // Form State
    const [formData, setFormData] = useState({
        clientName: "",
        email: "",
        phone: "",
        companyName: "",
        spaceType: "",
        city: "",
        spaceId: "",
        planType: "", // For VO: br, gst, mailing
        discountPercent: "5",
        numberOfSeats: "1",
        duration: "1",
        startDate: "",
        notes: "",
    });

    const [availableSpaces, setAvailableSpaces] = useState<any[]>([]);
    const [isFetchingSpaces, setIsFetchingSpaces] = useState(false);
    const [selectedSpace, setSelectedSpace] = useState<any>(null);

    const [errors, setErrors] = useState<QuotationFormErrors>({});

    const canUseSeedData =
        isAuthenticated &&
        (user?.role === "admin" || user?.role === "affiliate");

    const fetchQuotationData = async () => {
        if (!canUseSeedData) return;
        setLoading(true);
        try {
            const [recentResponse, statsResponse] = await Promise.all([
                affiliatePortalService.getRecentQuotations(),
                affiliatePortalService.getQuotationStats(),
            ]);

            if (recentResponse.success && Array.isArray(recentResponse.data)) {
                const mapped = recentResponse.data.map((quote) => ({
                    id: quote.quotationId,
                    clientName: quote.clientDetails.name,
                    spaceDetails: `${quote.spaceRequirements.spaceType} - ${quote.spaceRequirements.numberOfSeats} Seater`,
                    location: `${quote.spaceRequirements.location}, ${quote.spaceRequirements.city}`,
                    price: `₹${quote.price.toLocaleString("en-IN")}`,
                    date: new Date(quote.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }),
                    status: quote.status === "Viewed" ? "Viewed" : quote.status === "Accepted" ? "Accepted" : "Sent",
                }));
                setRecentQuotations(mapped);
            }

            if (statsResponse.success && statsResponse.data) {
                setQuotationStats(statsResponse.data);
            }
        } catch (error) {
            console.error("Failed to fetch quotation data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllQuotations = async () => {
        setAllLoading(true);
        try {
            const response = await affiliatePortalService.getQuotations();
            if (response.success && Array.isArray(response.data)) {
                const mapped = response.data.map((quote) => ({
                    id: quote.quotationId,
                    clientName: quote.clientDetails.name,
                    company: quote.clientDetails.companyName || "-",
                    spaceDetails: `${quote.spaceRequirements.spaceType} - ${quote.spaceRequirements.numberOfSeats} Seater`,
                    location: `${quote.spaceRequirements.location}, ${quote.spaceRequirements.city}`,
                    price: `₹${quote.price.toLocaleString("en-IN")}`,
                    date: new Date(quote.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }),
                    status: quote.status === "Viewed" ? "Viewed" : quote.status === "Accepted" ? "Accepted" : "Sent",
                }));
                setAllQuotations(mapped);
            }
        } catch (error) {
            console.error("Failed to fetch all quotations", error);
        } finally {
            setAllLoading(false);
        }
    };

    const handleOpenViewAll = () => {
        setShowAllModal(true);
        setSearchQuery("");
        setCurrentPage(1);
        fetchAllQuotations();
    };

    useEffect(() => {
        fetchQuotationData();
    }, [canUseSeedData]);

    const validateForm = () => {
        const newErrors: QuotationFormErrors = {};
        let isValid = true;

        if (!formData.clientName.trim()) { newErrors.clientName = "Client Name is required"; isValid = false; }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required"; isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format"; isValid = false;
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone is required"; isValid = false;
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = "Invalid phone number (10 digits)"; isValid = false;
        }
        if (!formData.companyName.trim()) { newErrors.companyName = "Company Name is required"; isValid = false; }
        if (!formData.spaceType) { newErrors.spaceType = "Space Type is required"; isValid = false; }
        if (!formData.city) { newErrors.city = "City is required"; isValid = false; }
        if (!formData.spaceId) { newErrors.location = "Please select a space"; isValid = false; }

        if (!formData.discountPercent) { newErrors.discountPercent = "Discount is required"; isValid = false; }

        if (!formData.duration) { newErrors.duration = "Duration is required"; isValid = false; }
        if (!formData.startDate) { newErrors.startDate = "Start Date is required"; isValid = false; }

        setErrors(newErrors);
        return isValid;
    };

    const handleFetchSpaces = async () => {
        if (!formData.city || !formData.spaceType) {
            toast.error("Please select both City and Space Type first.");
            return;
        }

        setIsFetchingSpaces(true);
        setAvailableSpaces([]);
        setSelectedSpace(null);
        setFormData(prev => ({ ...prev, spaceId: "", planType: "" }));

        try {
            const spaces = AFFILIATE_PRICING_SPACES
                .filter((space) => space.city.toLowerCase() === formData.city.toLowerCase())
                .map((space, index) => ({
                    ...space,
                    _id: `${space.city}-${space.spaceName}-${space.location}-${index}`,
                    name: space.spaceName,
                    area: space.location,
                }));

            setAvailableSpaces(spaces);
            if (spaces.length === 0) {
                toast.error("No affiliate pricing found for the selected city.");
            } else {
                toast.success(`${spaces.length} affiliate-approved spaces found!`);
            }
        } catch (error) {
            toast.error("Failed to fetch spaces.");
        } finally {
            setIsFetchingSpaces(false);
        }
    };

    const calculatePrice = () => {
        if (!selectedSpace || !formData.discountPercent) return 0;
        const discount = Number(formData.discountPercent) as AffiliateDiscountPercent;
        return selectedSpace.discounts?.[discount]?.customerPays || 0;
    };

    const calculateAffiliateEarning = () => {
        if (!selectedSpace || !formData.discountPercent) return 0;
        const discount = Number(formData.discountPercent) as AffiliateDiscountPercent;
        return selectedSpace.discounts?.[discount]?.affiliateEarns || 0;
    };

    const handleGenerateQuotation = async () => {
        if (!validateForm()) {
            toast.error("Please fix the errors highlighted in red.");
            return;
        }

        setGenerating(true);
        try {
            const totalPrice = calculatePrice();

            // Prepare payload
            const payload = {
                clientDetails: {
                    name: formData.clientName,
                    email: formData.email,
                    phone: formData.phone,
                    companyName: formData.companyName,
                },
                spaceRequirements: {
                    spaceType: formData.spaceType,
                    city: formData.city,
                    location: selectedSpace?.area || "N/A",
                    numberOfSeats: parseInt(formData.numberOfSeats) || 1,
                    duration: formData.duration,
                    startDate: formData.startDate,
                },
                price: totalPrice,
                notes: [
                    formData.notes,
                    `Affiliate discount: ${formData.discountPercent}%`,
                    `Listing price: INR ${selectedSpace?.listingPrice || 0}`,
                    `Space cost: INR ${selectedSpace?.spaceCost || 0}`,
                    `Affiliate earns: INR ${calculateAffiliateEarning()}`,
                ].filter(Boolean).join("\n")
            };

            const response = await affiliatePortalService.createQuotation(payload);

            if (response.success) {
                toast.success("Quotation generated successfully!");
                // Reset form
                setFormData({
                    clientName: "",
                    email: "",
                    phone: "",
                    companyName: "",
                    spaceType: "",
                    city: "",
                    spaceId: "",
                    planType: "",
                    discountPercent: "5",
                    numberOfSeats: "1",
                    duration: "1",
                    startDate: "",
                    notes: "",
                });
                setSelectedSpace(null);
                setAvailableSpaces([]);
                setErrors({});
                // Refresh list
                fetchQuotationData();
            } else {
                toast.error(response.message || "Failed to generate quotation.");
            }
        } catch (error) {
            console.error("Error generating quotation:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user types
        if (errors[field as keyof QuotationFormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    // Compute filtered + paginated data for the modal
    const filteredAll = allQuotations.filter(q =>
        q.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalPages = Math.max(1, Math.ceil(filteredAll.length / PAGE_SIZE));
    const pagedAll = filteredAll.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const statusBadge = (status: string) => {
        const map: Record<string, string> = {
            Sent: "bg-orange-50 text-orange-600",
            Viewed: "bg-blue-50 text-blue-600",
            Accepted: "bg-emerald-50 text-emerald-600",
        };
        return <span className={`text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap ${map[status] || map.Sent}`}>{status}</span>;
    };

    return (
 <div className="mx-auto min-h-screen p-4 md:p-6 lg:p-8 space-y-8 animate-in fade-in duration-700"> 

            {/* ===== VIEW ALL MODAL ===== */}
            {showAllModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAllModal(false)} />
                    <div className="relative bg-white w-full max-w-5xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
                            <div>
                                <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-gray-900">All Quotations</h2>
                                <p className="text-[16px] text-[#6B7280] mt-0.5">{filteredAll.length} quotation{filteredAll.length !== 1 ? 's' : ''} found</p>
                            </div>
                            <button onClick={() => setShowAllModal(false)} className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="px-6 py-4 border-b border-gray-50 flex-shrink-0">
                            <div className="relative max-w-sm">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by quotation ID..."
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5bb09c]/30 focus:border-[#5bb09c]/50 transition-all"
                                />
                                {searchQuery && (
                                    <button onClick={() => { setSearchQuery(""); setCurrentPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="flex-1 overflow-auto">
                            {allLoading ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="w-8 h-8 animate-spin text-[#5bb09c]" />
                                </div>
                            ) : pagedAll.length === 0 ? (
                                <div className="text-center py-20 text-gray-400">
                                    <p className="font-medium">No quotations found.</p>
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="sticky top-0 bg-gray-50/80 backdrop-blur-sm">
                                        <tr className="text-left">
                                            <th className="px-6 py-3.5 text-sm font-bold text-gray-400 uppercase tracking-wider">Quotation ID</th>
                                            <th className="px-6 py-3.5 text-sm font-bold text-gray-400 uppercase tracking-wider">Client</th>
                                            <th className="px-6 py-3.5 text-sm font-bold text-gray-400 uppercase tracking-wider">Space</th>
                                            <th className="px-6 py-3.5 text-sm font-bold text-gray-400 uppercase tracking-wider">Location</th>
                                            <th className="px-6 py-3.5 text-sm font-bold text-gray-400 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-3.5 text-sm font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3.5 text-sm font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {pagedAll.map((q) => (
                                            <tr key={q.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-bold text-[#5bb09c] uppercase tracking-wider">{q.id}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-gray-900">{q.clientName}</p>
                                                    <p className="text-sm text-gray-400">{q.company}</p>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 max-w-[160px] truncate">{q.spaceDetails}</td>
                                                <td className="px-6 py-4 text-gray-500 text-sm max-w-[140px] truncate">{q.location}</td>
                                                <td className="px-6 py-4 font-bold text-gray-900">{q.price}</td>
                                                <td className="px-6 py-4 text-gray-400 text-sm whitespace-nowrap">{q.date}</td>
                                                <td className="px-6 py-4">{statusBadge(q.status)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-shrink-0">
                            <p className="text-sm text-gray-500">
                                Page <span className="font-semibold text-gray-700">{currentPage}</span> of <span className="font-semibold text-gray-700">{totalPages}</span>
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Prev
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                    .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                                        if (idx > 0 && (arr[idx - 1] as number) + 1 < p) acc.push('...');
                                        acc.push(p);
                                        return acc;
                                    }, [])
                                    .map((p, i) => p === '...' ? (
                                        <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => setCurrentPage(p as number)}
                                            className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${p === currentPage
                                                ? 'bg-[#5bb09c] text-white shadow-sm'
                                                : 'text-gray-500 hover:bg-gray-100'
                                                }`}
                                        >{p}</button>
                                    ))
                                }
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Header Section */}
            <div className="mb-10">
                <h1 style={{ fontFamily: "'Inter', sans-serif" }} className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Quotation <span className="text-[#36503F] italic">Generator</span>
                </h1>
                <p className="text-[#6b7280] mt-2 text-[16px] font-medium text-[#6B7280]">
                    Create instant quotations with FlashSpace and your affiliate branding
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* LEFT COLUMN: FORM AREA (7/12) */}
                <div className="lg:col-span-7 animate-slide-up">
                    <div className="bg-white p-6 md:p-10 rounded-xl border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 space-y-10">
                        <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
                            <div className="p-2.5 bg-gray-50 rounded-xl text-gray-600">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-2xl font-extrabold text-[#1A1A1A]">
                                Create New Quotation
                            </h2>
                        </div>

                        {/* Client Details */}
                        <div className="space-y-6">
                            <div className="mb-4">
                                <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-[#1a1a1a]">
                                    Client Details
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className={`text-sm font-semibold text-[#374151] ${errors.clientName ? "text-red-500" : ""}`}>Client Name</Label>
                                    <Input
                                        placeholder="Enter client name"
                                        className={`bg-[#f9fafb] border-0 hover:bg-gray-100 transition-colors focus-visible:ring-1 focus-visible:ring-gray-200 h-14 rounded-xl text-[#1a1a1a] placeholder:text-[#9ca3af] ${errors.clientName ? "bg-red-50 text-red-900" : ""}`}
                                        value={formData.clientName}
                                        onChange={(e) => handleInputChange("clientName", e.target.value)}
                                    />
                                    {errors.clientName && <p className="text-xs text-red-500 font-medium text-[16px] text-[#6B7280]">{errors.clientName}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className={`text-sm font-semibold text-[#374151] ${errors.email ? "text-red-500" : ""}`}>Email Address</Label>
                                    <Input
                                        placeholder="client@company.com"
                                        className={`bg-[#f9fafb] border-0 hover:bg-gray-100 transition-colors focus-visible:ring-1 focus-visible:ring-gray-200 h-14 rounded-xl text-[#1a1a1a] placeholder:text-[#9ca3af] ${errors.email ? "bg-red-50 text-red-900" : ""}`}
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                    />
                                    {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className={`text-sm font-semibold text-[#374151] ${errors.phone ? "text-red-500" : ""}`}>Phone Number</Label>
                                    <Input
                                        placeholder="+91 98765 43210"
                                        className={`bg-[#f9fafb] border-0 hover:bg-gray-100 transition-colors focus-visible:ring-1 focus-visible:ring-gray-200 h-14 rounded-xl text-[#1a1a1a] placeholder:text-[#9ca3af] ${errors.phone ? "bg-red-50 text-red-900" : ""}`}
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                    />
                                    {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className={`text-sm font-semibold text-[#374151] ${errors.companyName ? "text-red-500" : ""}`}>Company Name</Label>
                                    <Input
                                        placeholder="Company name"
                                        className={`bg-[#f9fafb] border-0 hover:bg-gray-100 transition-colors focus-visible:ring-1 focus-visible:ring-gray-200 h-14 rounded-xl text-[#1a1a1a] placeholder:text-[#9ca3af] ${errors.companyName ? "bg-red-50 text-red-900" : ""}`}
                                        value={formData.companyName}
                                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                                    />
                                    {errors.companyName && <p className="text-xs text-red-500 font-medium">{errors.companyName}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Space Requirements */}
                        <div className="space-y-6">
                            <div className="mb-4">
                                <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-[#1a1a1a]">
                                    Space Requirements
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className={`text-sm font-semibold text-[#374151] ${errors.spaceType ? "text-red-500" : ""}`}>Space Type</Label>
                                    <Select value={formData.spaceType} onValueChange={(val) => handleInputChange("spaceType", val)}>
                                        <SelectTrigger className={`bg-[#f9fafb] border-0 hover:bg-gray-100 transition-colors focus:ring-1 focus:ring-gray-200 h-14 rounded-xl text-[#374151] ${errors.spaceType ? "bg-red-50" : ""}`}>
                                            <SelectValue placeholder="Select space type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 z-50 w-[var(--radix-select-trigger-width)]">
                                            <SelectItem className="rounded-lg cursor-pointer my-1 hover:bg-gray-50 focus:bg-[#5bb09c]/10 focus:text-[#5bb09c] font-semibold transition-colors py-3 pr-3 pl-10" value="Virtual Office">Virtual Office</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.spaceType && <p className="text-xs text-red-500">{errors.spaceType}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className={`text-sm font-semibold text-[#374151] ${errors.city ? "text-red-500" : ""}`}>City</Label>
                                    <Select value={formData.city} onValueChange={(val) => handleInputChange("city", val)}>
                                        <SelectTrigger className={`bg-[#f9fafb] border-0 hover:bg-gray-100 transition-colors focus:ring-1 focus:ring-gray-200 h-14 rounded-xl text-[#374151] ${errors.city ? "bg-red-50" : ""}`}>
                                            <SelectValue placeholder="Select city" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 z-50 w-[var(--radix-select-trigger-width)]">
                                            {AFFILIATE_PRICING_CITIES.map((city) => (
                                                <SelectItem className="rounded-lg cursor-pointer my-1 hover:bg-gray-50 focus:bg-[#5bb09c]/10 focus:text-[#5bb09c] font-semibold transition-colors py-3 pr-3 pl-10" key={city} value={city}>{city}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                                </div>
                                {formData.city && formData.spaceType && (
                                    <div className="md:col-span-2 flex py-1">
                                        <Button
                                            variant="secondary"
                                            className="bg-[#2d5a4c] text-white hover:bg-[#1a3a3a] gap-2 h-14 px-8 rounded-xl shadow-md transition-all font-bold text-base"
                                            onClick={handleFetchSpaces}
                                            disabled={isFetchingSpaces}
                                        >
                                            {isFetchingSpaces ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                            Fetch Available Offices
                                        </Button>
                                    </div>
                                )}

                                {availableSpaces.length > 0 && (
                                    <div className="md:col-span-2 space-y-2">
                                        <Label className={`text-sm font-semibold text-gray-700 ${errors.location ? "text-red-500" : ""}`}>Select Office <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={formData.spaceId}
                                            onValueChange={(val) => {
                                                handleInputChange("spaceId", val);
                                                const space = availableSpaces.find(s => s._id === val);
                                                setSelectedSpace(space);
                                            }}
                                        >
                                            <SelectTrigger className={`bg-[#f9fafb] border-0 hover:bg-gray-100 transition-colors focus:ring-1 focus:ring-gray-200 h-14 rounded-xl text-[#374151] ${errors.location ? "bg-red-50" : ""}`}>
                                                <SelectValue placeholder="Choose an office from results" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 z-50 w-[var(--radix-select-trigger-width)]">
                                                {availableSpaces.map(space => (
                                                    <SelectItem className="rounded-lg cursor-pointer my-1 hover:bg-gray-50 focus:bg-[#5bb09c]/10 focus:text-[#5bb09c] font-semibold transition-colors py-3 pr-3 pl-10" key={space._id} value={space._id}>
                                                        {space.name} ({space.area})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
                                    </div>
                                )}

                                {selectedSpace && (
                                    <>
                                        <div className="space-y-2">
                                            <Label className={`text-sm font-semibold text-[#374151] ${errors.discountPercent ? "text-red-500" : ""}`}>Client Discount</Label>
                                            <Select value={formData.discountPercent} onValueChange={(val) => handleInputChange("discountPercent", val)}>
                                                <SelectTrigger className={`bg-[#f9fafb] border-0 hover:bg-gray-100 transition-colors focus:ring-1 focus:ring-gray-200 h-14 rounded-xl text-[#374151] ${errors.discountPercent ? "bg-red-50" : ""}`}>
                                                    <SelectValue placeholder="Select discount" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 z-50 w-[var(--radix-select-trigger-width)]">
                                                    {AFFILIATE_DISCOUNTS.map((discount) => {
                                                        const option = selectedSpace.discounts?.[discount];
                                                        return option ? (
                                                            <SelectItem className="rounded-lg cursor-pointer my-1 hover:bg-gray-50 focus:bg-[#2d5a4c]/10 focus:text-[#2d5a4c] font-semibold transition-colors py-3 pr-3 pl-10" key={discount} value={discount.toString()}>
                                                                {discount}% off - Customer INR {option.customerPays.toLocaleString("en-IN")}
                                                            </SelectItem>
                                                        ) : null;
                                                    })}
                                                </SelectContent>
                                            </Select>
                                            {errors.discountPercent && <p className="text-xs text-red-500 font-medium">{errors.discountPercent}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={`text-sm font-semibold text-[#374151] ${errors.duration ? "text-red-500" : ""}`}>Duration</Label>
                                            <Select value={formData.duration} onValueChange={(val) => handleInputChange("duration", val)}>
                                                <SelectTrigger className={`bg-[#f9fafb] border-0 hover:bg-gray-100 transition-colors focus:ring-1 focus:ring-gray-200 h-14 rounded-xl text-[#374151] ${errors.duration ? "bg-red-50" : ""}`}>
                                                    <SelectValue placeholder="Select duration" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 z-50 w-[var(--radix-select-trigger-width)]">
                                                    {[1, 2, 3, 6, 12, 24].map(m => (
                                                        <SelectItem className="rounded-lg cursor-pointer my-1 hover:bg-gray-50 focus:bg-[#2d5a4c]/10 focus:text-[#2d5a4c] font-semibold transition-colors py-3 pr-3 pl-10" key={m} value={m.toString()}>{m} {m === 1 ? 'Month' : 'Months'}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.duration && <p className="text-xs text-red-500 font-medium">{errors.duration}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={`text-sm font-semibold text-[#374151] ${errors.startDate ? "text-red-500" : ""}`}>Start Date</Label>
                                            <Input
                                                type="date"
                                                className={`bg-[#f9fafb] border-0 hover:bg-gray-100 transition-colors focus-visible:ring-1 focus-visible:ring-gray-200 h-14 rounded-xl text-[#1a1a1a] ${errors.startDate ? "bg-red-50 text-red-900" : ""}`}
                                                value={formData.startDate}
                                                onChange={(e) => handleInputChange("startDate", e.target.value)}
                                            />
                                            {errors.startDate && <p className="text-xs text-red-500 font-medium">{errors.startDate}</p>}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Additional Notes */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-[#374151]">Additional Notes</Label>
                            <Textarea
                                placeholder="Any specific requirements or preferences..."
                                className="bg-[#f9fafb] border-0 hover:bg-gray-100 transition-colors focus-visible:ring-1 focus-visible:ring-gray-200 min-h-[140px] rounded-2xl resize-none text-[#1a1a1a] placeholder:text-[#9ca3af] p-5"
                                value={formData.notes}
                                onChange={(e) => handleInputChange("notes", e.target.value)}
                            />
                        </div>

                        {/* Price Calculation Block */}
                        <div className="bg-[#f9fafb] p-8 rounded-xl space-y-3 relative overflow-hidden group">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[#2d5a4c]">
                                        <Sparkles className="w-5 h-5" />
                                        <span className="text-sm font-bold uppercase tracking-widest text-[#2d5a4c]">
                                            Calculated Price
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed max-w-sm mt-1">
                                        {selectedSpace ? (
                                            <>Quotation for <strong className="text-gray-700 font-bold">{selectedSpace.name}</strong> in {selectedSpace.area}.</>
                                        ) : (
                                            <>Select an office to see the live calculated price based on your requirements.</>
                                        )}
                                    </p>
                                </div>
                                <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100/60">
                                    <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                        ₹{calculatePrice().toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6">
                            <Button
                                className="flex-1 bg-[#2d5a4c] text-white hover:bg-[#1a3a3a] h-16 gap-3 shadow-lg hover:shadow-[#2d5a4c]/30 rounded-2xl transition-all hover:-translate-y-0.5 text-lg font-bold"
                                onClick={handleGenerateQuotation}
                                disabled={generating}
                            >
                                {generating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                                {generating ? "Generating Quotation..." : "Generate Quotation"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: SIDEBAR (5/12) */}
                <div className="lg:col-span-5 space-y-8 animate-slide-up">
                    {/* Recent Quotations Section */}
                    <div className="bg-white p-6 md:p-8 rounded-xl border border-[#D4E0D0] shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] space-y-6">
                        <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-[#1A1A1A]">
                            Recent Quotations
                        </h3>
                        <button
                            onClick={handleOpenViewAll}
                            className="text-sm font-bold text-[#6b7280] hover:text-[#2d5a4c] transition-colors"
                        >
                            View All
                        </button>

                        {/* Scroll Area for History */}
                        <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar pb-2">
                            {recentQuotations.map((quote) => (
                                <QuotationCard key={quote.id} {...quote} />
                            ))}
                            {recentQuotations.length === 0 && (
                                <div className="text-center py-10 text-gray-400">
                                    <p className="text-sm font-medium">No recent quotations.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fixed Performance Section */}
                    <div className="bg-white p-6 md:p-8 rounded-xl border border-[#D4E0D0] shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] space-y-6">
                        <div className="pb-4 border-b border-gray-100/50">
                            <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#ffb020]"></span>
                                Quotation Stats
                            </h3>
                        </div>
                        <QuotationStats data={quotationStats} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotationGenerator;
