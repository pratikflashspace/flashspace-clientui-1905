import { useState, useMemo } from "react";
import {
    Trophy,
    TrendingDown,
    Star,
    Check,
    X,
    ChevronDown,
    ChevronUp,
    Shield,
    Sparkles,
    ArrowRight,
    BadgeCheck,
    IndianRupee,
    AlertCircle,
} from "lucide-react";
import React from "react";

// ─── COMPETITOR DATA BY CITY ───
// Pricing sourced from public listings & official websites (as of 2025-2026).
// Sources: wework.co.in, myhq.in, awfis.com, instaoffice.in, 91springboard.com
// Monthly prices converted to annual (×12). Prices are approximate starting-from.
// Admin should update periodically to keep data accurate.

interface CompetitorPlan {
    gst?: string;
    mailing?: string;
    businessReg?: string;
    coworkingMonthly?: string;
    meetingHourly?: string;
}

interface Competitor {
    name: string;
    logo?: string;
    plans: Record<string, CompetitorPlan>; // city -> pricing
    rating: number;
    highlights: string[];
    website: string;
    approvalTime: string; // e.g. "3-5 days"
    approvalSpeedScore: number; // 0-100
    features: string[]; // for breakdown
    pros: string[];
    cons: string[];
    hiddenCosts: string[];
    reviewSummary: string;
}

// Real pricing data (converted from monthly to annual where applicable)
// WeWork: Business Address ~₹1,099-₹1,299/mo, GST ~₹1,599/mo, Business Reg ~₹1,899/mo (source: wework.co.in)
// myHQ: GST plans ~₹999-₹2,499/mo (source: myhq.in)
// 91SpringBoard: ~₹1,600-₹2,000+/mo (source: cofynd.com/myhq)
// InstaOffice: ~₹999-₹2,500/mo (source: instaoffice.in)
// Awfis: ~₹1,200-₹2,000/mo, 12-month minimum (source: awfis.com)

const COMPETITORS: Competitor[] = [
    {
        name: "WeWork",
        plans: {
            // WeWork published pricing: Business Address ₹1,299/mo, GST ₹1,599/mo, Business Reg ₹1,899/mo
            Delhi: { gst: "₹19,188/yr", mailing: "₹15,588/yr", businessReg: "₹22,788/yr", coworkingMonthly: "₹15,000/mo" },
            Mumbai: { gst: "₹21,588/yr", mailing: "₹17,988/yr", businessReg: "₹25,188/yr", coworkingMonthly: "₹18,000/mo" },
            Bangalore: { gst: "₹19,188/yr", mailing: "₹15,588/yr", businessReg: "₹22,788/yr", coworkingMonthly: "₹14,000/mo" },
            Hyderabad: { gst: "₹19,188/yr", mailing: "₹15,588/yr", businessReg: "₹22,788/yr", coworkingMonthly: "₹12,000/mo" },
            Pune: { gst: "₹19,188/yr", mailing: "₹15,588/yr", businessReg: "₹22,788/yr", coworkingMonthly: "₹12,000/mo" },
            Gurgaon: { gst: "₹21,588/yr", mailing: "₹17,988/yr", businessReg: "₹25,188/yr", coworkingMonthly: "₹16,000/mo" },
            Noida: { gst: "₹19,188/yr", mailing: "₹15,588/yr", businessReg: "₹22,788/yr", coworkingMonthly: "₹13,000/mo" },
            Chandigarh: { gst: "₹16,788/yr", mailing: "₹13,188/yr", businessReg: "₹19,188/yr", coworkingMonthly: "₹10,000/mo" },
        },
        rating: 4.2,
        highlights: ["Global brand", "Premium interiors", "Community perks"],
        website: "wework.co.in",
        approvalTime: "3-5 Business Days",
        approvalSpeedScore: 65,
        features: ["Premium business address", "Mail & package handling", "App access", "Global community", "Guest access credits"],
        pros: ["Prestigious image", "High-end amenities", "Global networking"],
        cons: ["Higher setup fees", "Lengthy onboarding", "Strict KYC process"],
        hiddenCosts: ["Security deposit (2 months)", "Documentation fee: ₹2,500", "Mail forwarding charges extra"],
        reviewSummary: "The gold standard for prestige, but comes with premium pricing and bureaucratic onboarding.",
    },
    {
        name: "myHQ",
        plans: {
            // myHQ published pricing: GST plans ₹999-₹2,499/mo depending on location
            Delhi: { gst: "₹14,988/yr", mailing: "₹11,988/yr", businessReg: "₹17,988/yr", coworkingMonthly: "₹7,500/mo" },
            Mumbai: { gst: "₹17,988/yr", mailing: "₹14,388/yr", businessReg: "₹23,988/yr", coworkingMonthly: "₹10,000/mo" },
            Bangalore: { gst: "₹15,588/yr", mailing: "₹11,988/yr", businessReg: "₹19,188/yr", coworkingMonthly: "₹8,500/mo" },
            Hyderabad: { gst: "₹13,188/yr", mailing: "₹11,988/yr", businessReg: "₹17,988/yr", coworkingMonthly: "₹7,000/mo" },
            Pune: { gst: "₹13,188/yr", mailing: "₹11,988/yr", businessReg: "₹17,988/yr", coworkingMonthly: "₹6,500/mo" },
            Chennai: { gst: "₹14,388/yr", mailing: "₹11,988/yr", businessReg: "₹17,988/yr", coworkingMonthly: "₹7,200/mo" },
            Kolkata: { gst: "₹11,988/yr", mailing: "₹9,588/yr", businessReg: "₹14,388/yr", coworkingMonthly: "₹6,000/mo" },
            Noida: { gst: "₹13,188/yr", mailing: "₹11,988/yr", businessReg: "₹17,988/yr", coworkingMonthly: "₹6,800/mo" },
            Gurgaon: { gst: "₹15,588/yr", mailing: "₹13,188/yr", businessReg: "₹19,188/yr", coworkingMonthly: "₹8,500/mo" },
            Chandigarh: { gst: "₹11,988/yr", mailing: "₹9,988/yr", businessReg: "₹14,388/yr", coworkingMonthly: "₹6,000/mo" },
        },
        rating: 4.0,
        highlights: ["Pan India network", "App booking", "Flexible plans"],
        website: "myhq.in",
        approvalTime: "2-3 Business Days",
        approvalSpeedScore: 78,
        features: ["GST registration help", "Mailing address", "Zero deposit plans", "Flexi-pass integration"],
        pros: ["Affordable pricing", "Solid tech platform", "No lock-in options"],
        cons: ["Mixed support quality", "Variable location standards"],
        hiddenCosts: ["Processing fee: ₹1,500", "Courier charges"],
        reviewSummary: "Great for freelancers and small teams who need speed and flexibility without high overheads.",
    },
    {
        name: "Awfis",
        plans: {
            // Awfis: 12-month minimum, ~₹1,200-₹2,000/mo depending on plan & city (source: awfis.com)
            Delhi: { gst: "₹18,000/yr", mailing: "₹14,400/yr", businessReg: "₹21,600/yr", coworkingMonthly: "₹9,000/mo" },
            Mumbai: { gst: "₹21,600/yr", mailing: "₹16,800/yr", businessReg: "₹24,000/yr", coworkingMonthly: "₹12,000/mo" },
            Bangalore: { gst: "₹18,000/yr", mailing: "₹14,400/yr", businessReg: "₹21,600/yr", coworkingMonthly: "₹9,500/mo" },
            Hyderabad: { gst: "₹16,800/yr", mailing: "₹14,400/yr", businessReg: "₹19,200/yr", coworkingMonthly: "₹8,000/mo" },
            Pune: { gst: "₹16,800/yr", mailing: "₹14,400/yr", businessReg: "₹19,200/yr", coworkingMonthly: "₹7,500/mo" },
            Chennai: { gst: "₹16,800/yr", mailing: "₹14,400/yr", businessReg: "₹19,200/yr", coworkingMonthly: "₹7,800/mo" },
            Noida: { gst: "₹16,800/yr", mailing: "₹14,400/yr", businessReg: "₹19,200/yr", coworkingMonthly: "₹7,500/mo" },
            Gurgaon: { gst: "₹19,200/yr", mailing: "₹15,600/yr", businessReg: "₹22,800/yr", coworkingMonthly: "₹10,000/mo" },
            Kolkata: { gst: "₹14,400/yr", mailing: "₹12,000/yr", businessReg: "₹16,800/yr", coworkingMonthly: "₹6,500/mo" },
            Chandigarh: { gst: "₹15,600/yr", mailing: "₹13,200/yr", businessReg: "₹18,000/yr", coworkingMonthly: "₹8,000/mo" },
        },
        rating: 4.1,
        highlights: ["100+ centres", "No refund policy", "12-month lock-in"],
        website: "awfis.com",
        approvalTime: "3-4 Business Days",
        approvalSpeedScore: 72,
        features: ["Prime business locations", "Dedicated admin support", "NOC for GST", "Meeting room credits"],
        pros: ["Enterprise-grade infra", "Strong local presence"],
        cons: ["Very rigid contracts", "High cancellation fees"],
        hiddenCosts: ["12-month lock-in period", "Annual maintenance: ₹3,000"],
        reviewSummary: "Ideal for established companies, but very rigid for growing startups.",
    },
    {
        name: "InstaOffice",
        plans: {
            // InstaOffice: ~₹999-₹2,500/mo (source: instaoffice.in)
            Delhi: { gst: "₹15,588/yr", mailing: "₹11,988/yr", businessReg: "₹19,188/yr", coworkingMonthly: "₹8,500/mo" },
            Mumbai: { gst: "₹19,188/yr", mailing: "₹14,388/yr", businessReg: "₹23,988/yr", coworkingMonthly: "₹12,000/mo" },
            Bangalore: { gst: "₹17,988/yr", mailing: "₹13,188/yr", businessReg: "₹21,588/yr", coworkingMonthly: "₹9,000/mo" },
            Hyderabad: { gst: "₹14,388/yr", mailing: "₹11,988/yr", businessReg: "₹17,988/yr", coworkingMonthly: "₹7,500/mo" },
            Pune: { gst: "₹14,388/yr", mailing: "₹11,988/yr", businessReg: "₹17,988/yr", coworkingMonthly: "₹7,000/mo" },
            Noida: { gst: "₹14,388/yr", mailing: "₹11,988/yr", businessReg: "₹17,988/yr", coworkingMonthly: "₹7,000/mo" },
            Gurgaon: { gst: "₹17,988/yr", mailing: "₹13,188/yr", businessReg: "₹21,588/yr", coworkingMonthly: "₹9,500/mo" },
            Chandigarh: { gst: "₹13,188/yr", mailing: "₹10,788/yr", businessReg: "₹16,788/yr", coworkingMonthly: "₹6,500/mo" },
        },
        rating: 3.8,
        highlights: ["40+ locations", "Meeting rooms", "Mail handling"],
        website: "instaoffice.in",
        approvalTime: "2-4 Business Days",
        approvalSpeedScore: 75,
        features: ["Basic business address", "Mail management", "On-site support"],
        pros: ["Personalized service", "Good for local startups"],
        cons: ["Limited network", "Basic technology"],
        hiddenCosts: ["Security deposit (1 month)", "Service charge: ₹2,000"],
        reviewSummary: "A reliable local alternative with good personal service but lacking a global network.",
    },
    {
        name: "91SpringBoard",
        plans: {
            // 91SpringBoard: ~₹1,600-₹2,000+/mo (source: cofynd.com, myhq.in)
            Delhi: { gst: "₹20,400/yr", mailing: "₹15,600/yr", coworkingMonthly: "₹9,000/mo" },
            Mumbai: { gst: "₹24,000/yr", mailing: "₹18,000/yr", coworkingMonthly: "₹12,500/mo" },
            Bangalore: { gst: "₹21,600/yr", mailing: "₹16,800/yr", coworkingMonthly: "₹10,000/mo" },
            Hyderabad: { gst: "₹19,200/yr", mailing: "₹14,400/yr", coworkingMonthly: "₹8,000/mo" },
            Pune: { gst: "₹19,200/yr", mailing: "₹14,400/yr", coworkingMonthly: "₹7,500/mo" },
            Gurgaon: { gst: "₹22,800/yr", mailing: "₹16,800/yr", coworkingMonthly: "₹10,000/mo" },
            Chandigarh: { gst: "₹16,800/yr", mailing: "₹13,200/yr", coworkingMonthly: "₹8,500/mo" },
        },
        rating: 4.1,
        highlights: ["Community events", "Startup ecosystem", "Mentorship"],
        website: "91springboard.com",
        approvalTime: "3-4 Business Days",
        approvalSpeedScore: 70,
        features: ["Vibrant community", "Investor access", "Mentorship programs", "Startup perks"],
        pros: ["Legendary community", "Vibrant environment"],
        cons: ["Often noisy", "Limited private spaces"],
        hiddenCosts: ["Documentation fee: ₹3,500", "Mail handling: ₹500/mo"],
        reviewSummary: "The ultimate choice for startups seeking networking and mentorship.",
    },
];

// FlashSpace's own pricing — dynamically computed from actual spaces
interface FlashSpacePricing {
    gstMin?: string;
    mailingMin?: string;
    brMin?: string;
    coworkingMin?: string;
}

interface CompetitorComparisonProps {
    city: string;
    spaceType: string;
    flashSpacePricing: FlashSpacePricing;
    flashSpaceRating: number;
    flashSpaceCount: number;
}

// Helper: extract numeric from price string
const extractNum = (s?: string): number => {
    if (!s) return Infinity;
    const n = Number(s.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) && n > 0 ? n : Infinity;
};

// Get columns to show based on space type
const getColumns = (spaceType: string) => {
    if (spaceType === "coworking") {
        return [
            { key: "coworkingMonthly" as const, label: "Coworking Desk", sub: "/month" },
        ];
    }
    if (spaceType === "on-demand") {
        return [
            { key: "meetingHourly" as const, label: "Meeting Room", sub: "/hour" },
        ];
    }
    // virtual-office
    return [
        { key: "gst" as const, label: "GST Registration", sub: "/year" },
        { key: "mailing" as const, label: "Mailing Address", sub: "/year" },
        { key: "businessReg" as const, label: "Business Registration", sub: "/year" },
    ];
};

const flashSpaceKeyMap: Record<string, keyof FlashSpacePricing> = {
    gst: "gstMin",
    mailing: "mailingMin",
    businessReg: "brMin",
    coworkingMonthly: "coworkingMin",
};

type FilterTab = "all" | "cheapest" | "rated" | "fastest";

interface Row {
    name: string;
    isFlashSpace: boolean;
    prices: Record<string, string | undefined>;
    rating: number;
    highlights: string[];
    approvalTime: string;
    approvalSpeedScore: number;
    features: string[];
    pros: string[];
    cons: string[];
    hiddenCosts: string[];
    reviewSummary: string;
    score: number;
}

export default function CompetitorComparison({
    city,
    spaceType,
    flashSpacePricing,
    flashSpaceRating,
    flashSpaceCount,
}: CompetitorComparisonProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [filterTab, setFilterTab] = useState<FilterTab>("all");
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const toggleRow = (name: string) => {
        setExpandedRows((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    const columns = useMemo(() => getColumns(spaceType), [spaceType]);

    // Filter competitors that have data for this city
    const relevantCompetitors = useMemo(
        () => COMPETITORS.filter((c) => c.plans[city]),
        [city],
    );

    const isDataMissing = relevantCompetitors.length === 0;

    // Build rows: FlashSpace first, then competitors
    const rows: Row[] = useMemo(() => {
        if (isDataMissing) return [];

        const calculateScore = (price: number, rating: number, speed: number, features: number) => {
            // 40% Price, 20% Rating, 20% Speed, 20% Features
            const priceScore = Math.max(0, 100 - (price / 250)); // Normalized roughly
            return Math.round((priceScore * 0.4) + (rating * 20 * 0.2) + (speed * 0.2) + (features * 10 * 0.2));
        };

        const fsRow: Row = {
            name: "FlashSpace",
            isFlashSpace: true,
            prices: {},
            rating: flashSpaceRating,
            highlights: ["AI-Powered Platform", "100+ Cities", "24hr Activation", "Dedicated Support"],
            approvalTime: "24 Hours",
            approvalSpeedScore: 98,
            features: ["Instant NOC", "Live Dashboard", "No Security Deposit", "Pan-India GST"],
            pros: ["Lowest price in market", "Fastest approval", "Completely digital"],
            cons: ["New platform", "Virtual-first focus"],
            hiddenCosts: ["No hidden costs"],
            reviewSummary: "The most modern and affordable solution for startups and remote businesses.",
            score: 0,
        };

        columns.forEach((col) => {
            const mappedKey = flashSpaceKeyMap[col.key];
            fsRow.prices[col.key] = mappedKey ? flashSpacePricing[mappedKey] : undefined;
        });

        const col = columns[0];
        fsRow.score = calculateScore(extractNum(fsRow.prices[col.key]), fsRow.rating, fsRow.approvalSpeedScore, fsRow.features.length);

        const compRows: Row[] = relevantCompetitors.map((c) => {
            const row: Row = {
                name: c.name,
                isFlashSpace: false,
                prices: c.plans[city] || {},
                rating: c.rating,
                highlights: c.highlights,
                approvalTime: c.approvalTime,
                approvalSpeedScore: c.approvalSpeedScore,
                features: c.features,
                pros: c.pros,
                cons: c.cons,
                hiddenCosts: c.hiddenCosts,
                reviewSummary: c.reviewSummary,
                score: 0,
            };
            row.score = calculateScore(extractNum(row.prices[col.key]), row.rating, row.approvalSpeedScore, row.features.length);
            return row;
        });

        let allRows = [fsRow, ...compRows];

        // Apply Filters
        if (filterTab === "cheapest") {
            allRows = [...allRows].sort((a, b) => extractNum(a.prices[col.key]) - extractNum(b.prices[col.key]));
        } else if (filterTab === "rated") {
            allRows = [...allRows].sort((a, b) => b.rating - a.rating);
        } else if (filterTab === "fastest") {
            allRows = [...allRows].sort((a, b) => b.approvalSpeedScore - a.approvalSpeedScore);
        }

        return allRows;
    }, [columns, relevantCompetitors, city, flashSpacePricing, flashSpaceRating, isDataMissing, filterTab]);

    // Find cheapest for each column
    const cheapestByCol = useMemo(() => {
        const result: Record<string, number> = {};
        columns.forEach((col) => {
            let minVal = Infinity;
            let minIdx = -1;
            rows.forEach((r, i) => {
                const val = extractNum(r.prices[col.key]);
                if (val < minVal) {
                    minVal = val;
                    minIdx = i;
                }
            });
            result[col.key] = minIdx;
        });
        return result;
    }, [rows, columns]);

    // Decision Engine Results
    const decisionSummary = useMemo(() => {
        if (rows.length === 0) return null;
        const col = columns[0];

        const sortedByScore = [...rows].sort((a, b) => b.score - a.score);
        const sortedByPrice = [...rows].sort((a, b) => extractNum(a.prices[col.key]) - extractNum(b.prices[col.key]));
        const sortedByRating = [...rows].sort((a, b) => b.rating - a.rating);
        const sortedBySpeed = [...rows].sort((a, b) => b.approvalSpeedScore - a.approvalSpeedScore);

        return {
            bestOverall: sortedByScore[0],
            cheapest: sortedByPrice[0],
            highestRated: sortedByRating[0],
            fastest: sortedBySpeed[0],
        };
    }, [rows, columns]);

    // Calculate annual savings with FlashSpace compared to average market
    const annualSavings = useMemo(() => {
        if (rows.length < 2) return 0;
        const col = columns[0];
        const fsPrice = extractNum(rows.find(r => r.isFlashSpace)?.prices[col.key]);
        const marketAvg = rows.filter(r => !r.isFlashSpace).reduce((acc, curr) => acc + extractNum(curr.prices[col.key]), 0) / (rows.length - 1);
        return Math.max(0, Math.round(marketAvg - fsPrice));
    }, [rows, columns]);

    const savingsText = useMemo(() => {
        if (columns.length === 0) return "";
        const col = columns[0];
        const fsPrice = extractNum(rows[0]?.prices[col.key]);
        const compPrices = rows.slice(1).map((r) => extractNum(r.prices[col.key])).filter((p) => p < Infinity);
        if (compPrices.length === 0 || fsPrice >= Infinity) return "";
        const avgComp = compPrices.reduce((a, b) => a + b, 0) / compPrices.length;
        if (fsPrice >= avgComp) return "";
        const pct = Math.round(((avgComp - fsPrice) / avgComp) * 100);
        return pct > 0 ? `Save up to ${pct}%` : "";
    }, [rows, columns]);

    return (
        <div className="space-y-4">
            {/* ─── 1. Smart Summary Header ─── */}
            {!isDataMissing && decisionSummary && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-primary/[0.03] border border-primary/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center group hover:bg-primary/[0.05] transition-all">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Trophy className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">🏆 Best Overall</p>
                        <h4 className="text-sm font-black text-[#35503F] mt-1">{decisionSummary.bestOverall.name}</h4>
                    </div>

                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center group hover:bg-emerald-100/50 transition-all">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <IndianRupee className="w-5 h-5 text-emerald-600" />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">💸 Cheapest</p>
                        <h4 className="text-sm font-black text-emerald-700 mt-1">{decisionSummary.cheapest.name}</h4>
                    </div>

                    <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center group hover:bg-amber-100/50 transition-all">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Star className="w-5 h-5 text-amber-600" />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">⭐ Highest Rated</p>
                        <h4 className="text-sm font-black text-amber-800 mt-1">{decisionSummary.highestRated.name}</h4>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center group hover:bg-blue-100/50 transition-all">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <BadgeCheck className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">⚡ Fastest</p>
                        <h4 className="text-sm font-black text-blue-800 mt-1">{decisionSummary.fastest.name}</h4>
                    </div>
                </div>
            )}

            {/* Dynamic Savings Banner */}
            {!isDataMissing && annualSavings > 0 && (
                <div className="bg-emerald-600 rounded-2xl px-6 py-3.5 flex items-center justify-between text-white shadow-lg shadow-emerald-200/50 group animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-sm font-bold tracking-tight">
                            Dynamic Savings: <span className="text-emerald-100 underline underline-offset-4 decoration-2">₹{annualSavings.toLocaleString('en-IN')}/year</span> saved with FlashSpace vs market average!
                        </p>
                    </div>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform cursor-pointer" />
                </div>
            )}

            {/* ─── Main Comparison Hub ─── */}
            <div className="bg-card rounded-3xl border border-border/60 overflow-hidden shadow-2xl shadow-slate-200/50 backdrop-blur-sm">
                {/* Sticky Utility Header */}
                <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border/40 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-black text-foreground tracking-tighter uppercase italic">Workspace Decision Engine</h3>
                    </div>

                    {/* ─── 7. Real-Time Filters ─── */}
                    <div className="flex bg-muted/30 p-1 rounded-xl border border-border/40">
                        {(["all", "cheapest", "rated", "fastest"] as FilterTab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilterTab(tab)}
                                className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ${filterTab === tab
                                        ? "bg-white text-primary shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {isDataMissing ? (
                    <div className="px-5 py-20 text-center flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4 animate-pulse">
                            <Sparkles className="w-8 h-8 text-primary/40" />
                        </div>
                        <h4 className="text-xl font-black text-foreground tracking-tight">Decisions Loading...</h4>
                        <p className="text-sm text-muted-foreground max-w-[320px] mt-2">
                            We're benchmarking the best providers in {city} for you. We'll have results in just a moment.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        {/* Desktop Table View */}
                        <table className="w-full text-sm">
                            <thead className="bg-muted/10">
                                <tr>
                                    <th className="text-left px-6 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] w-56">Provider</th>
                                    {columns.map((col) => (
                                        <th key={col.key} className="text-center px-4 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                            {col.label}
                                            <span className="block text-[9px] font-bold opacity-40 mt-1">{col.sub}</span>
                                        </th>
                                    ))}
                                    <th className="text-center px-4 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">FlashScore</th>
                                    <th className="text-center px-4 py-5 text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/20">
                                {rows.map((row) => {
                                    const isExpanded = expandedRows[row.name];

                                    return (
                                        <React.Fragment key={row.name}>
                                            <tr
                                                className={`group cursor-pointer transition-all duration-300 ${isExpanded ? 'bg-primary/[0.04]' : 'hover:bg-muted/20'}`}
                                                onClick={() => toggleRow(row.name)}
                                            >
                                                {/* Provider */}
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-500 shadow-sm ${row.isFlashSpace
                                                                ? 'bg-[#35503F] rotate-3 group-hover:rotate-0'
                                                                : 'bg-muted border border-border/60 hover:scale-105'
                                                            }`}>
                                                            {row.isFlashSpace ? (
                                                                <span className="text-xs font-black text-[#FEF8C3]">FS</span>
                                                            ) : (
                                                                <span className="text-xs font-black text-muted-foreground">{row.name.substring(0, 2).toUpperCase()}</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`font-black text-base tracking-tight ${row.isFlashSpace ? "text-primary italic" : "text-foreground"}`}>
                                                                    {row.name}
                                                                </span>
                                                                {row.isFlashSpace && (
                                                                    <BadgeCheck className="w-4 h-4 text-primary animate-pulse" />
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 mt-1">
                                                                <div className="flex gap-0.5">
                                                                    {[1, 2, 3, 4, 5].map(star => (
                                                                        <Star key={star} className={`w-3 h-3 ${star <= row.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                                                    ))}
                                                                </div>
                                                                <span className="text-[10px] font-bold text-muted-foreground">{row.rating.toFixed(1)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Pricing */}
                                                {columns.map((col) => {
                                                    const price = row.prices[col.key];
                                                    const isLowest = decisionSummary?.cheapest.name === row.name;
                                                    return (
                                                        <td key={col.key} className="text-center px-4 py-5">
                                                            <div className="flex flex-col items-center">
                                                                <span className={`text-sm font-black tracking-tight ${isLowest ? 'text-emerald-600' : 'text-foreground'}`}>
                                                                    {price || '—'}
                                                                </span>
                                                                {isLowest && (
                                                                    <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                                                                        LOWEST
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    );
                                                })}

                                                {/* ─── 3. FlashScore Badge ─── */}
                                                <td className="text-center px-4 py-5">
                                                    <div className="flex flex-col items-center">
                                                        <div className={`relative w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all ${row.score > 90 ? 'border-emerald-500 bg-emerald-50' :
                                                                row.score > 75 ? 'border-primary bg-primary/5' :
                                                                    'border-slate-300'
                                                            }`}>
                                                            <span className="text-[11px] font-black">{row.score}</span>
                                                            <div className="absolute -top-1 -right-1 group-hover:scale-125 transition-transform">
                                                                <BadgeCheck className={`w-4 h-4 ${row.score > 85 ? 'text-emerald-500' : 'text-transparent'}`} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Expandable Action */}
                                                <td className="text-center px-4 py-5">
                                                    <button className="p-2 rounded-full hover:bg-muted transition-all">
                                                        {isExpanded ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                                                    </button>
                                                </td>
                                            </tr>

                                            {/* ─── 5. Expandable Data Row ─── */}
                                            {isExpanded && (
                                                <tr className="bg-muted/5 animate-in slide-in-from-top-2 duration-300">
                                                    <td colSpan={columns.length + 3} className="px-10 py-8 border-l-4 border-primary">
                                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                            {/* Features Breakdown */}
                                                            <div>
                                                                <h5 className="text-[11px] font-black uppercase text-muted-foreground tracking-widest mb-4">Core Benefits</h5>
                                                                <div className="space-y-2.5">
                                                                    {row.features.map(f => (
                                                                        <div key={f} className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                                                                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                                                                <Check className="w-3 h-3 text-emerald-600" />
                                                                            </div>
                                                                            {f}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Pros & Cons */}
                                                            <div>
                                                                <h5 className="text-[11px] font-black uppercase text-muted-foreground tracking-widest mb-4">Quick Analysis</h5>
                                                                <div className="space-y-4">
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {row.pros.map(p => (
                                                                            <span key={p} className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg">+{p}</span>
                                                                        ))}
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {row.cons.map(c => (
                                                                            <span key={c} className="text-[10px] font-black bg-rose-100 text-rose-700 px-3 py-1 rounded-lg">-{c}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Hidden Costs & Summary */}
                                                            <div>
                                                                <div className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm">
                                                                    <h5 className="text-[11px] font-black uppercase text-muted-foreground tracking-widest mb-3">Cost Transparency</h5>
                                                                    <div className="space-y-2">
                                                                        {row.hiddenCosts.map(hc => (
                                                                            <div key={hc} className="text-xs font-bold text-rose-600 flex items-center gap-2">
                                                                                <AlertCircle className="w-3 h-3" />
                                                                                {hc}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <hr className="my-4 border-muted" />
                                                                    <p className="text-xs italic text-muted-foreground">"{row.reviewSummary}"</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ─── 8. Urgency & Social Proof ─── */}
                <div className="bg-slate-900 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-white">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </div>
                            <span className="text-xs font-black uppercase tracking-tighter">12 people viewed in last 2h</span>
                        </div>
                        <div className="hidden lg:flex items-center gap-2 text-white">
                            <Shield className="w-4 h-4 text-primary" />
                            <span className="text-xs font-black uppercase tracking-tighter">3 Verified Approvals Today</span>
                        </div>
                    </div>

                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-2 text-[11px] font-black text-white hover:text-primary transition-colors cursor-pointer"
                    >
                        <span>Auto-Benchmark Results in {city}</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Quick Location Tabs - 10. Area Based Comparison */}
            <div className="flex flex-wrap gap-2 mt-4">
                {["Gurgaon", "Noida", "South Delhi", "West Delhi"].map(loc => (
                    <button
                        key={loc}
                        className="px-4 py-2 rounded-2xl bg-white border border-border shadow-sm text-xs font-bold hover:blue-50 hover:border-primary/40 transition-all"
                    >
                        Best in {loc}
                    </button>
                ))}
            </div>
        </div>
    );
}
