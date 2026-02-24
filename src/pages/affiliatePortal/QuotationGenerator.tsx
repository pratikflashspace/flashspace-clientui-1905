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
    Eye,
    Sparkles,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import QuotationCard from "@/components/affiliatePortal/QuotationCard";
import QuotationStats from "@/components/affiliatePortal/QuotationStats";
import { useAuth } from "@/contexts/AuthContext";
import { affiliatePortalService } from "@/services/affiliatePortal.service";
import { toast } from "react-hot-toast";

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

        if (formData.spaceType === "Coworking" && !formData.numberOfSeats) {
            newErrors.numberOfSeats = "Seats required"; isValid = false;
        }

        if (formData.spaceType === "Virtual Office" && !formData.planType) {
            // @ts-ignore
            newErrors.planType = "Plan type is required"; isValid = false;
        }

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
            const response = await affiliatePortalService.getAvailableSpaces(formData.city, formData.spaceType);
            if (response.success && Array.isArray(response.data)) {
                setAvailableSpaces(response.data);
                if (response.data.length === 0) {
                    toast.error("No spaces found for the selected criteria.");
                } else {
                    toast.success(`${response.data.length} spaces found!`);
                }
            }
        } catch (error) {
            toast.error("Failed to fetch spaces.");
        } finally {
            setIsFetchingSpaces(false);
        }
    };

    const calculatePrice = () => {
        if (!selectedSpace || !formData.duration) return 0;

        const months = parseInt(formData.duration);
        if (isNaN(months)) return 0;

        const parsePriceString = (priceStr: string | number | undefined) => {
            if (typeof priceStr === 'number') return priceStr;
            if (!priceStr) return 0;
            const cleanStr = priceStr.replace(/\D/g, '');
            return parseInt(cleanStr, 10) || 0;
        };

        if (formData.spaceType === "Coworking") {
            const seats = parseInt(formData.numberOfSeats) || 1;
            const pricePerMonth = parsePriceString(selectedSpace.price) || 0;
            return pricePerMonth * seats * months;
        } else {
            let monthlyPrice = 0;
            if (formData.planType === "br") monthlyPrice = parsePriceString(selectedSpace.brPlanPrice) || 0;
            if (formData.planType === "gst") monthlyPrice = parsePriceString(selectedSpace.gstPlanPrice) || 0;
            if (formData.planType === "mailing") monthlyPrice = parsePriceString(selectedSpace.mailingPlanPrice) || 0;

            return monthlyPrice * months;
        }
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
                    numberOfSeats: parseInt(formData.numberOfSeats) || 0,
                    duration: formData.duration,
                    startDate: formData.startDate,
                },
                price: totalPrice,
                notes: formData.notes
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
                    numberOfSeats: "",
                    duration: "",
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

    return (
        <div className="mx-auto min-h-screen p-6 lg:p-10 space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Quotation{" "}
                    <span className="italic text-[#5bb09c]">Generator</span>
                </h1>
                <p className="text-gray-500 mt-1 font-medium">
                    Create instant quotations with FlashSpace and your affiliate branding
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* LEFT COLUMN: FORM AREA (7/12) */}
                <div className="lg:col-span-7 animate-slide-up">
                    <div className="bg-white p-6 md:p-10 rounded-[2rem] border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 space-y-10">
                        <div className="flex items-center gap-4 pb-4 border-b border-gray-100/50">
                            <div className="p-2.5 bg-[#5bb09c]/10 rounded-xl text-[#5bb09c]">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Create New Quotation
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5">Fill in the details below to generate a new pricing quote.</p>
                            </div>
                        </div>

                        {/* Client Details */}
                        <div className="space-y-6">
                            <div className="mb-6">
                                <span className="text-xs font-bold text-[#5bb09c] bg-[#5bb09c]/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                                    Client Details
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className={`text-sm font-semibold text-gray-700 ${errors.clientName ? "text-red-500" : ""}`}>Client Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        placeholder="Enter client name"
                                        className={`bg-gray-50/50 hover:bg-gray-50/80 transition-colors focus-visible:ring-2 focus-visible:ring-[#5bb09c]/20 focus-visible:border-[#5bb09c]/40 h-12 rounded-xl ${errors.clientName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                        value={formData.clientName}
                                        onChange={(e) => handleInputChange("clientName", e.target.value)}
                                    />
                                    {errors.clientName && <p className="text-xs text-red-500">{errors.clientName}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className={`text-sm font-semibold text-gray-700 ${errors.email ? "text-red-500" : ""}`}>Email Address <span className="text-red-500">*</span></Label>
                                    <Input
                                        placeholder="client@company.com"
                                        className={`bg-gray-50/50 hover:bg-gray-50/80 transition-colors focus-visible:ring-2 focus-visible:ring-[#5bb09c]/20 focus-visible:border-[#5bb09c]/40 h-12 rounded-xl ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                    />
                                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className={`text-sm font-semibold text-gray-700 ${errors.phone ? "text-red-500" : ""}`}>Phone Number <span className="text-red-500">*</span></Label>
                                    <Input
                                        placeholder="+91 98765 43210"
                                        className={`bg-gray-50/50 hover:bg-gray-50/80 transition-colors focus-visible:ring-2 focus-visible:ring-[#5bb09c]/20 focus-visible:border-[#5bb09c]/40 h-12 rounded-xl ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                    />
                                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className={`text-sm font-semibold text-gray-700 ${errors.companyName ? "text-red-500" : ""}`}>Company Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        placeholder="Company name"
                                        className={`bg-gray-50/50 hover:bg-gray-50/80 transition-colors focus-visible:ring-2 focus-visible:ring-[#5bb09c]/20 focus-visible:border-[#5bb09c]/40 h-12 rounded-xl ${errors.companyName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                        value={formData.companyName}
                                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                                    />
                                    {errors.companyName && <p className="text-xs text-red-500">{errors.companyName}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Space Requirements */}
                        <div className="space-y-6 pt-4 border-t border-gray-100/50">
                            <div className="mb-6">
                                <span className="text-xs font-bold text-[#5bb09c] bg-[#5bb09c]/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                                    Space Requirements
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className={`text-sm font-semibold text-gray-700 ${errors.spaceType ? "text-red-500" : ""}`}>Space Type <span className="text-red-500">*</span></Label>
                                    <Select value={formData.spaceType} onValueChange={(val) => handleInputChange("spaceType", val)}>
                                        <SelectTrigger className={`bg-gray-50/50 hover:bg-gray-50/80 transition-colors focus:ring-2 focus:ring-[#5bb09c]/20 h-12 rounded-xl ${errors.spaceType ? "border-red-500 ring-offset-red-100" : ""}`}>
                                            <SelectValue placeholder="Select space type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 z-50 w-[var(--radix-select-trigger-width)]">
                                            <SelectItem className="rounded-lg cursor-pointer my-1 hover:bg-gray-50 focus:bg-[#5bb09c]/10 focus:text-[#5bb09c] font-semibold transition-colors py-3 pr-3 pl-10" value="Coworking">Coworking</SelectItem>
                                            <SelectItem className="rounded-lg cursor-pointer my-1 hover:bg-gray-50 focus:bg-[#5bb09c]/10 focus:text-[#5bb09c] font-semibold transition-colors py-3 pr-3 pl-10" value="Virtual Office">Virtual Office</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.spaceType && <p className="text-xs text-red-500">{errors.spaceType}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className={`text-sm font-semibold text-gray-700 ${errors.city ? "text-red-500" : ""}`}>City <span className="text-red-500">*</span></Label>
                                    <Select value={formData.city} onValueChange={(val) => handleInputChange("city", val)}>
                                        <SelectTrigger className={`bg-gray-50/50 hover:bg-gray-50/80 transition-colors focus:ring-2 focus:ring-[#5bb09c]/20 h-12 rounded-xl ${errors.city ? "border-red-500 ring-offset-red-100" : ""}`}>
                                            <SelectValue placeholder="Select city" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 z-50 w-[var(--radix-select-trigger-width)]">
                                            <SelectItem className="rounded-lg cursor-pointer my-1 hover:bg-gray-50 focus:bg-[#5bb09c]/10 focus:text-[#5bb09c] font-semibold transition-colors py-3 pr-3 pl-10" value="Ahmedabad">Ahmedabad</SelectItem>
                                            <SelectItem className="rounded-lg cursor-pointer my-1 hover:bg-gray-50 focus:bg-[#5bb09c]/10 focus:text-[#5bb09c] font-semibold transition-colors py-3 pr-3 pl-10" value="Delhi">Delhi</SelectItem>
                                            <SelectItem className="rounded-lg cursor-pointer my-1 hover:bg-gray-50 focus:bg-[#5bb09c]/10 focus:text-[#5bb09c] font-semibold transition-colors py-3 pr-3 pl-10" value="Bangalore">Bangalore</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                                </div>
                                {formData.city && formData.spaceType && (
                                    <div className="md:col-span-2 flex py-1">
                                        <Button
                                            variant="secondary"
                                            className="bg-[#5bb09c] text-white hover:bg-[#4a9b89] gap-2 h-12 px-6 rounded-xl shadow-md transition-all font-semibold"
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
                                            <SelectTrigger className={`bg-gray-50/50 hover:bg-gray-50/80 transition-colors focus:ring-2 focus:ring-[#5bb09c]/20 h-12 rounded-xl ${errors.location ? "border-red-500" : "border-[#5bb09c]/30 border-2"}`}>
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
                                        {formData.spaceType === "Coworking" ? (
                                            <div className="space-y-2">
                                                <Label className={`text-sm font-semibold text-gray-700 ${errors.numberOfSeats ? "text-red-500" : ""}`}>Number of Seats <span className="text-red-500">*</span></Label>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g., 10"
                                                    className={`bg-gray-50/50 hover:bg-gray-50/80 transition-colors focus-visible:ring-2 focus-visible:ring-[#5bb09c]/20 focus-visible:border-[#5bb09c]/40 h-12 rounded-xl border-gray-200 ${errors.numberOfSeats ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                                    value={formData.numberOfSeats}
                                                    onChange={(e) => handleInputChange("numberOfSeats", e.target.value)}
                                                />
                                                {errors.numberOfSeats && <p className="text-xs text-red-500">{errors.numberOfSeats}</p>}
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <Label className="text-sm font-semibold text-gray-700">Select Plan <span className="text-red-500">*</span></Label>
                                                <Select value={formData.planType} onValueChange={(val) => handleInputChange("planType", val)}>
                                                    <SelectTrigger className="bg-gray-50/50 hover:bg-gray-50/80 transition-colors focus:ring-2 focus:ring-[#5bb09c]/20 h-12 rounded-xl">
                                                        <SelectValue placeholder="Select plan type" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 z-50 w-[var(--radix-select-trigger-width)]">
                                                        <SelectItem className="rounded-lg cursor-pointer my-1 hover:bg-gray-50 focus:bg-[#5bb09c]/10 focus:text-[#5bb09c] font-semibold transition-colors py-3 pr-3 pl-10" value="br">Business Registration (BR)</SelectItem>
                                                        <SelectItem className="rounded-lg cursor-pointer my-1 hover:bg-gray-50 focus:bg-[#5bb09c]/10 focus:text-[#5bb09c] font-semibold transition-colors py-3 pr-3 pl-10" value="gst">GST Registration</SelectItem>
                                                        <SelectItem className="rounded-lg cursor-pointer my-1 hover:bg-gray-50 focus:bg-[#5bb09c]/10 focus:text-[#5bb09c] font-semibold transition-colors py-3 pr-3 pl-10" value="mailing">Mailing Address</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <Label className={`text-sm font-semibold text-gray-700 ${errors.duration ? "text-red-500" : ""}`}>Duration (Months) <span className="text-red-500">*</span></Label>
                                            <Select value={formData.duration} onValueChange={(val) => handleInputChange("duration", val)}>
                                                <SelectTrigger className={`bg-gray-50/50 hover:bg-gray-50/80 transition-colors focus:ring-2 focus:ring-[#5bb09c]/20 h-12 rounded-xl ${errors.duration ? "border-red-500 ring-offset-red-100" : ""}`}>
                                                    <SelectValue placeholder="Select duration" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 z-50 w-[var(--radix-select-trigger-width)]">
                                                    {[1, 2, 3, 6, 12, 24].map(m => (
                                                        <SelectItem className="rounded-lg cursor-pointer my-1 hover:bg-gray-50 focus:bg-[#5bb09c]/10 focus:text-[#5bb09c] font-semibold transition-colors py-3 pr-3 pl-10" key={m} value={m.toString()}>{m} {m === 1 ? 'Month' : 'Months'}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.duration && <p className="text-xs text-red-500">{errors.duration}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={`text-sm font-semibold text-gray-700 ${errors.startDate ? "text-red-500" : ""}`}>Start Date <span className="text-red-500">*</span></Label>
                                            <Input
                                                type="date"
                                                className={`bg-gray-50/50 hover:bg-gray-50/80 transition-colors focus-visible:ring-2 focus-visible:ring-[#5bb09c]/20 focus-visible:border-[#5bb09c]/40 h-12 rounded-xl border-gray-200 ${errors.startDate ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                                value={formData.startDate}
                                                onChange={(e) => handleInputChange("startDate", e.target.value)}
                                            />
                                            {errors.startDate && <p className="text-xs text-red-500">{errors.startDate}</p>}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Additional Notes */}
                        <div className="space-y-2 pt-4 border-t border-gray-100/50">
                            <Label className="text-sm font-semibold text-gray-700">Additional Notes</Label>
                            <Textarea
                                placeholder="Any specific requirements or preferences..."
                                className="bg-gray-50/40 hover:bg-gray-50/80 transition-colors focus-visible:ring-2 focus-visible:ring-[#5bb09c]/20 focus-visible:border-[#5bb09c]/40 min-h-[120px] rounded-2xl resize-y border-gray-200 p-4 shadow-inner-sm"
                                value={formData.notes}
                                onChange={(e) => handleInputChange("notes", e.target.value)}
                            />
                        </div>

                        {/* Price Calculation Block */}
                        <div className="bg-gradient-to-br from-[#f2faf9] to-[#ffffff] p-6 md:p-8 rounded-[2rem] border border-[#5bb09c]/20 shadow-[0_4px_20px_rgb(91,176,156,0.06)] space-y-3 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 transform translate-x-12 -translate-y-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                <Sparkles className="w-48 h-48 text-[#5bb09c]" />
                            </div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-[#5bb09c]">
                                        <Sparkles className="w-4 h-4" />
                                        <span className="text-sm font-bold uppercase tracking-widest text-[#5bb09c]">
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
                                <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-gray-100/60">
                                    <span className="text-3xl font-black text-gray-900 tracking-tight">
                                        ₹{calculatePrice().toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-6">
                            <Button
                                className="flex-1 bg-[#5bb09c] text-white hover:bg-[#4a9b89] h-14 gap-2 shadow-lg hover:shadow-[#5bb09c]/30 rounded-xl transition-all hover:-translate-y-0.5 text-base font-semibold"
                                onClick={handleGenerateQuotation}
                                disabled={generating}
                            >
                                {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                {generating ? "Generating Quotation..." : "Generate Quotation"}
                            </Button>
                            <Button
                                variant="outline"
                                className="sm:w-32 h-14 rounded-xl gap-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all font-semibold shadow-sm"
                            >
                                <Eye className="w-5 h-5" /> Preview
                            </Button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: SIDEBAR (5/12) */}
                <div className="lg:col-span-5 space-y-8 animate-slide-up">
                    {/* Recent Quotations Section */}
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100/50">
                            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#5bb09c]"></span>
                                Recent Quotations
                            </h3>
                            <button className="text-xs font-bold text-gray-500 hover:text-[#5bb09c] transition-colors uppercase tracking-wider bg-gray-50 hover:bg-[#5bb09c]/10 px-3 py-1.5 rounded-full">
                                View All
                            </button>
                        </div>

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
                    <div className="bg-white p-6 md:p-8 rounded-[2rem] border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 space-y-6">
                        <div className="pb-4 border-b border-gray-100/50">
                            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
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
