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
        location: "",
        numberOfSeats: "",
        duration: "",
        startDate: "",
        notes: "",
    });

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
        if (!formData.location) { newErrors.location = "Location is required"; isValid = false; }
        if (!formData.numberOfSeats) { newErrors.numberOfSeats = "Seats required"; isValid = false; }
        if (!formData.duration) { newErrors.duration = "Duration is required"; isValid = false; }
        if (!formData.startDate) { newErrors.startDate = "Start Date is required"; isValid = false; }

        setErrors(newErrors);
        return isValid;
    };

    const handleGenerateQuotation = async () => {
        if (!validateForm()) {
            toast.error("Please fix the errors highlighted in red.");
            return;
        }

        setGenerating(true);
        try {
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
                    location: formData.location,
                    numberOfSeats: parseInt(formData.numberOfSeats),
                    duration: formData.duration,
                    startDate: formData.startDate,
                },
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
                    location: "",
                    numberOfSeats: "",
                    duration: "",
                    startDate: "",
                    notes: "",
                });
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
                    <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-10">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                            <div className="p-2 bg-teal-50 rounded-lg text-[#5bb09c]">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Create New Quotation
                            </h2>
                        </div>

                        {/* Client Details */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Client Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className={errors.clientName ? "text-red-500" : ""}>Client Name *</Label>
                                    <Input
                                        placeholder="Enter client name"
                                        className={`bg-gray-50/50 ${errors.clientName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                        value={formData.clientName}
                                        onChange={(e) => handleInputChange("clientName", e.target.value)}
                                    />
                                    {errors.clientName && <p className="text-xs text-red-500">{errors.clientName}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className={errors.email ? "text-red-500" : ""}>Email *</Label>
                                    <Input
                                        placeholder="client@company.com"
                                        className={`bg-gray-50/50 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                    />
                                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className={errors.phone ? "text-red-500" : ""}>Phone *</Label>
                                    <Input
                                        placeholder="+91 98765 43210"
                                        className={`bg-gray-50/50 ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                    />
                                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className={errors.companyName ? "text-red-500" : ""}>Company Name *</Label>
                                    <Input
                                        placeholder="Company name"
                                        className={`bg-gray-50/50 ${errors.companyName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                        value={formData.companyName}
                                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                                    />
                                    {errors.companyName && <p className="text-xs text-red-500">{errors.companyName}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Space Requirements */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Space Requirements
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className={errors.spaceType ? "text-red-500" : ""}>Space Type *</Label>
                                    <Select value={formData.spaceType} onValueChange={(val) => handleInputChange("spaceType", val)}>
                                        <SelectTrigger className={`bg-gray-50/50 ${errors.spaceType ? "border-red-500 ring-offset-red-100" : ""}`}>
                                            <SelectValue placeholder="Select space type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Private Office">Private Office</SelectItem>
                                            <SelectItem value="Dedicated Desk">Dedicated Desk</SelectItem>
                                            <SelectItem value="Meeting Room">Meeting Room</SelectItem>
                                            <SelectItem value="Virtual Office">Virtual Office</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.spaceType && <p className="text-xs text-red-500">{errors.spaceType}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className={errors.city ? "text-red-500" : ""}>City *</Label>
                                    <Select value={formData.city} onValueChange={(val) => handleInputChange("city", val)}>
                                        <SelectTrigger className={`bg-gray-50/50 ${errors.city ? "border-red-500 ring-offset-red-100" : ""}`}>
                                            <SelectValue placeholder="Select city" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Bangalore">Bangalore</SelectItem>
                                            <SelectItem value="Mumbai">Mumbai</SelectItem>
                                            <SelectItem value="Delhi">Delhi</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className={errors.location ? "text-red-500" : ""}>Location/Area *</Label>
                                    <Select value={formData.location} onValueChange={(val) => handleInputChange("location", val)}>
                                        <SelectTrigger className={`bg-gray-50/50 ${errors.location ? "border-red-500 ring-offset-red-100" : ""}`}>
                                            <SelectValue placeholder="Select location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="HSR Layout">HSR Layout</SelectItem>
                                            <SelectItem value="Koramangala">Koramangala</SelectItem>
                                            <SelectItem value="Indiranagar">Indiranagar</SelectItem>
                                            <SelectItem value="Whitefield">Whitefield</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className={errors.numberOfSeats ? "text-red-500" : ""}>Number of Seats *</Label>
                                    <Input
                                        type="number"
                                        placeholder="e.g., 10"
                                        className={`bg-gray-50/50 ${errors.numberOfSeats ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                        value={formData.numberOfSeats}
                                        onChange={(e) => handleInputChange("numberOfSeats", e.target.value)}
                                    />
                                    {errors.numberOfSeats && <p className="text-xs text-red-500">{errors.numberOfSeats}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className={errors.duration ? "text-red-500" : ""}>Duration *</Label>
                                    <Select value={formData.duration} onValueChange={(val) => handleInputChange("duration", val)}>
                                        <SelectTrigger className={`bg-gray-50/50 ${errors.duration ? "border-red-500 ring-offset-red-100" : ""}`}>
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1 Month">1 Month</SelectItem>
                                            <SelectItem value="3 Months">3 Months</SelectItem>
                                            <SelectItem value="6 Months">6 Months</SelectItem>
                                            <SelectItem value="1 Year">1 Year</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.duration && <p className="text-xs text-red-500">{errors.duration}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className={errors.startDate ? "text-red-500" : ""}>Start Date *</Label>
                                    <Input
                                        type="date"
                                        className={`bg-gray-50/50 ${errors.startDate ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                        value={formData.startDate}
                                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                                    />
                                    {errors.startDate && <p className="text-xs text-red-500">{errors.startDate}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Additional Notes */}
                        <div className="space-y-2">
                            <Label>Additional Notes</Label>
                            <Textarea
                                placeholder="Any specific requirements or preferences..."
                                className="bg-gray-50/50 min-h-[100px]"
                                value={formData.notes}
                                onChange={(e) => handleInputChange("notes", e.target.value)}
                            />
                        </div>

                        {/* AI Suggestion Block */}
                        <div className="bg-[#f0f9f8] p-5 rounded-xl border border-teal-50 space-y-2">
                            <div className="flex items-center gap-2 text-[#5bb09c]">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-bold">
                                    AI Price Suggestion
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Based on current market rates and your selected
                                criteria, the recommended price range is
                                <span className="font-bold text-gray-900 mx-1">
                                    ₹75,000 - ₹95,000/month
                                </span>
                                for this space type in the selected area.
                            </p>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-50">
                            <Button
                                className="bg-[#5bb09c] text-white hover:bg-[#4a9b89] h-12 gap-2 shadow-sm transition-all hover:-translate-y-0.5 sm:px-8"
                                onClick={handleGenerateQuotation}
                                disabled={generating}
                            >
                                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 text-white" />}
                                {generating ? "Generating..." : "Generate Quotation"}
                            </Button>
                            <Button
                                variant="outline"
                                className="h-12 px-8 gap-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                            >
                                <Eye className="w-4 h-4" /> Preview
                            </Button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: SIDEBAR (5/12) */}
                <div className="lg:col-span-5 space-y-8 animate-slide-up">
                    {/* Recent Quotations Section */}
                    <div className="bg-transparent space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="font-bold text-gray-800 text-lg">
                                Recent Quotations
                            </h3>
                            <button className="text-xs font-bold text-gray-500 hover:text-[#5bb09c] transition-colors">
                                View All
                            </button>
                        </div>

                        {/* Scroll Area for History */}
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar pb-4">
                            {recentQuotations.map((quote) => (
                                <QuotationCard key={quote.id} {...quote} />
                            ))}
                        </div>
                    </div>

                    {/* Fixed Performance Section */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="font-bold text-gray-800 text-lg">
                            Quotation Stats
                        </h3>
                        <QuotationStats data={quotationStats} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotationGenerator;
