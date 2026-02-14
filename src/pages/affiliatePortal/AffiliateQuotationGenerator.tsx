import React, { useState } from "react";
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
    User,
    Mail,
    Phone,
    Building2,
    MapPin,
    Armchair,
    Calendar,
    MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import QuotationCard from "@/components/affiliatePortal/QuotationCard";
import QuotationStats from "@/components/affiliatePortal/QuotationStats";

// Static Data for Backend Readiness
const RECENT_QUOTATIONS = [
    {
        id: "QT-2024-089",
        clientName: "TechStart Solutions",
        spaceDetails: "Private Office - 10 Seater",
        location: "Koramangala, Bangalore",
        price: "₹85,000/month",
        date: "Jan 28, 2024",
        status: "Sent" as const,
    },
    {
        id: "QT-2024-088",
        clientName: "Creative Hub Co",
        spaceDetails: "Dedicated Desk",
        location: "Indiranagar, Bangalore",
        price: "₹12,000/month",
        date: "Jan 27, 2024",
        status: "Viewed" as const,
    },
    {
        id: "QT-2024-087",
        clientName: "DataFlow Analytics",
        spaceDetails: "Meeting Room - 8 Hours",
        location: "HSR Layout, Bangalore",
        price: "₹4,000",
        date: "Jan 26, 2024",
        status: "Accepted" as const,
    },
];

const QuotationGenerator = () => {
    return (
        <div className=" mx-auto min-h-screen p-6 lg:p-10 space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
{/* Header Removed */}

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
                                    <Label>Client Name</Label>
                                    <Input
                                        placeholder="Enter client name"
                                        className="bg-gray-50/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        placeholder="client@company.com"
                                        className="bg-gray-50/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input
                                        placeholder="+91 98765 43210"
                                        className="bg-gray-50/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Company Name</Label>
                                    <Input
                                        placeholder="Company name"
                                        className="bg-gray-50/50"
                                    />
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
                                    <Label>Space Type</Label>
                                    <Select>
                                        <SelectTrigger className="bg-gray-50/50">
                                            <SelectValue placeholder="Select space type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="po">
                                                Private Office
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>City</Label>
                                    <Select>
                                        <SelectTrigger className="bg-gray-50/50">
                                            <SelectValue placeholder="Select city" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="blr">
                                                Bangalore
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Location/Area</Label>
                                    <Select>
                                        <SelectTrigger className="bg-gray-50/50">
                                            <SelectValue placeholder="Select location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hsr">
                                                HSR Layout
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Number of Seats</Label>
                                    <Input
                                        placeholder="e.g., 10"
                                        className="bg-gray-50/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Duration</Label>
                                    <Select>
                                        <SelectTrigger className="bg-gray-50/50">
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="6m">
                                                6 Months
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Input
                                        type="date"
                                        className="bg-gray-50/50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Notes */}
                        <div className="space-y-2">
                            <Label>Additional Notes</Label>
                            <Textarea
                                placeholder="Any specific requirements or preferences..."
                                className="bg-gray-50/50 min-h-[100px]"
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
                            <Button className="bg-[#5bb09c] text-white hover:bg-[#4a9b89] h-12 gap-2 shadow-sm transition-all hover:-translate-y-0.5 sm:px-8">
                                <Plus className="w-4 h-4 text-white" /> Generate
                                Quotation
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
                            {RECENT_QUOTATIONS.map((quote) => (
                                <QuotationCard key={quote.id} {...quote} />
                            ))}
                        </div>
                    </div>

                    {/* Fixed Performance Section */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <h3 className="font-bold text-gray-800 text-lg">
                            Quotation Stats
                        </h3>
                        <QuotationStats />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotationGenerator;
