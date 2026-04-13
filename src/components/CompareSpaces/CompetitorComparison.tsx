import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  Star,
  Eye,
  CheckCircle2,
  TrendingDown,
  ArrowRightLeft,
} from "lucide-react";
import React from "react";

// Modular Components
import SummaryHeader from "./ComparisonEngine/SummaryHeader";
import AIRecommendation from "./ComparisonEngine/AIRecommendation";
import ExpandableRow from "./ComparisonEngine/ExpandableRow";

// ─── DATA & INTERFACES ───
interface CompetitorPlan {
  gst?: string;
  mailing?: string;
  coworkingMonthly?: string;
  meetingHourly?: string;
}

interface Competitor {
  name: string;
  plans: Record<string, CompetitorPlan>;
  rating: number;
  highlights: string[];
  approvalTime: string;
  features: string[];
  pros: string[];
  cons: string[];
  hiddenCosts: string[];
  reviewSummary: string;
}

const COMPETITORS_DB: Competitor[] = [
  {
    name: "WeWork",
    plans: {
      "Delhi": { gst: "₹19,188/yr", mailing: "₹15,588/yr", coworkingMonthly: "₹15,000/mo" },
      "Gurgaon": { gst: "₹21,588/yr", mailing: "₹17,988/yr", coworkingMonthly: "₹16,000/mo" },
      "Mumbai": { gst: "₹23,988/yr", mailing: "₹19,188/yr", coworkingMonthly: "₹18,000/mo" },
      "Bangalore": { gst: "₹19,188/yr", mailing: "₹16,788/yr", coworkingMonthly: "₹14,000/mo" },
      "Hyderabad": { gst: "₹17,988/yr", mailing: "₹14,388/yr", coworkingMonthly: "₹12,000/mo" },
      "Pune": { gst: "₹17,988/yr", mailing: "₹14,388/yr", coworkingMonthly: "₹11,000/mo" },
      "Noida": { gst: "₹18,588/yr", mailing: "₹15,588/yr", coworkingMonthly: "₹10,000/mo" },
      "Ahmedabad": { gst: "₹16,788/yr", mailing: "₹13,188/yr", coworkingMonthly: "₹9,500/mo" },
    },
    rating: 4.2,
    highlights: ["Global Community", "Modern Infrastructure"],
    approvalTime: "3-5 Business Days",
    features: ["Premium business address", "Community access", "Mail handling", "Standard NOC"],
    pros: ["Market leader image", "Consistent tech infrastructure"],
    cons: ["High setup fees", "Rigid agreement terms"],
    hiddenCosts: ["2-month security deposit", "Physical document processing fees"],
    reviewSummary: "The premium standard for professional branding.",
  },
  {
    name: "myHQ",
    plans: {
      "Delhi": { gst: "₹14,988/yr", mailing: "₹11,988/yr", coworkingMonthly: "₹7,500/mo" },
      "Gurgaon": { gst: "₹15,588/yr", mailing: "₹13,188/yr", coworkingMonthly: "₹8,500/mo" },
      "Mumbai": { gst: "₹17,988/yr", mailing: "₹15,588/yr", coworkingMonthly: "₹10,000/mo" },
      "Bangalore": { gst: "₹15,588/yr", mailing: "₹13,188/yr", coworkingMonthly: "₹8,500/mo" },
      "Hyderabad": { gst: "₹13,188/yr", mailing: "₹10,788/yr", coworkingMonthly: "₹7,000/mo" },
      "Pune": { gst: "₹13,188/yr", mailing: "₹11,988/yr", coworkingMonthly: "₹7,500/mo" },
      "Noida": { gst: "₹14,388/yr", mailing: "₹11,988/yr", coworkingMonthly: "₹8,000/mo" },
      "Ahmedabad": { gst: "₹13,188/yr", mailing: "₹10,788/yr", coworkingMonthly: "₹6,500/mo" },
    },
    rating: 4.0,
    highlights: ["Largest Center Count", "Budget Selection"],
    approvalTime: "2-3 Business Days",
    features: ["Digital NOC activation", "Network flexibility", "App-based booking"],
    pros: ["Very high availability", "Lowest market entry pricing"],
    cons: ["Center quality varies by location"],
    hiddenCosts: ["Platform processing fee: ₹1,500"],
    reviewSummary: "Ideal for startups and freelancers prioritizing speed.",
  },
  {
    name: "Awfis",
    plans: {
      "Delhi": { gst: "₹18,000/yr", mailing: "₹14,400/yr", coworkingMonthly: "₹9,000/mo" },
      "Gurgaon": { gst: "₹19,200/yr", mailing: "₹15,600/yr", coworkingMonthly: "₹10,000/mo" },
      "Mumbai": { gst: "₹21,600/yr", mailing: "₹18,000/yr", coworkingMonthly: "₹12,000/mo" },
      "Bangalore": { gst: "₹18,000/yr", mailing: "₹15,600/yr", coworkingMonthly: "₹9,500/mo" },
      "Hyderabad": { gst: "₹16,800/yr", mailing: "₹13,200/yr", coworkingMonthly: "₹8,000/mo" },
      "Pune": { gst: "₹16,800/yr", mailing: "₹14,400/yr", coworkingMonthly: "₹8,500/mo" },
      "Noida": { gst: "₹18,000/yr", mailing: "₹15,600/yr", coworkingMonthly: "₹9,000/mo" },
      "Ahmedabad": { gst: "₹15,600/yr", mailing: "₹12,000/yr", coworkingMonthly: "₹7,500/mo" },
    },
    rating: 4.1,
    highlights: ["Grade A Buildings", "Enterprise Infra"],
    approvalTime: "3-4 Business Days",
    features: ["Dedicated building support", "Customizable office suites"],
    pros: ["Enterprise-grade reliability", "Prime city center locations"],
    cons: ["Strict lock-in periods"],
    hiddenCosts: ["Lock-in period maintenance fees"],
    reviewSummary: "Built for companies requiring institutional-grade presence.",
  },
];

interface Row {
  name: string;
  isFlashSpace: boolean;
  priceDisplay: string | undefined;
  rating: number;
  highlights: string[];
  features: string[];
  pros: string[];
  cons: string[];
  hiddenCosts: string[];
  reviewSummary: string;
  approvalTime: string;
}

const BRAND_GREEN = "#35503f";

export default function CompetitorComparison({
  city,
  spaceType,
  flashSpacePricing,
  flashSpaceRating,
}: any) {
  const [isDecisionEngineOpen, setIsDecisionEngineOpen] = useState(false);
  const [filter, setFilter] = useState<"cheapest" | "rated" | "all">("all");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (name: string) => {
    setExpandedRows((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const rows: Row[] = useMemo(() => {
    const fsRow: Row = {
      name: "FlashSpace",
      isFlashSpace: true,
      priceDisplay: spaceType === "coworking" ? flashSpacePricing.coworkingMin : flashSpacePricing.gstMin,
      rating: flashSpaceRating || 4.9,
      highlights: ["Platform Choice", "Verified Listings"],
      features: ["Instant NOC generation", "Digital dashboard", "Verified locations", "Direct pricing"],
      pros: ["Zero brokerage fees", "Best market rates", "Managed fulfillment"],
      cons: ["Service varies across property owners"],
      hiddenCosts: ["No hidden management fees"],
      reviewSummary: "The most transparent way to book business workspaces.",
      approvalTime: "Within 24 Hours",
    };

    const compRows: Row[] = COMPETITORS_DB.map(c => {
      const cityKey = Object.keys(c.plans).find(k => 
        city.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(city.toLowerCase())
      );
      const plan = cityKey ? c.plans[cityKey] : null;
      if (!plan) return null;

      return {
        name: c.name,
        isFlashSpace: false,
        priceDisplay: spaceType === "coworking" ? plan.coworkingMonthly : plan.gst,
        rating: c.rating,
        highlights: c.highlights,
        features: c.features,
        pros: c.pros,
        cons: c.cons,
        hiddenCosts: c.hiddenCosts,
        reviewSummary: c.reviewSummary,
        approvalTime: c.approvalTime,
      };
    }).filter((r): r is Row => r !== null);

    let all = [fsRow, ...compRows];
    if (filter === "cheapest") {
      all = [...all].sort((a, b) => {
        const getVal = (r: Row) => Number(r.priceDisplay?.replace(/[^0-9]/g, "")) || Infinity;
        return getVal(a) - getVal(b);
      });
    } else if (filter === "rated") {
      all = [...all].sort((a, b) => b.rating - a.rating);
    }
    return all;
  }, [city, spaceType, flashSpacePricing, flashSpaceRating, filter]);

  const decisionSummary = useMemo(() => {
    if (rows.length === 0) return null;
    return {
      bestOverall: rows.find(r => r.isFlashSpace) || rows[0],
      cheapest: [...rows].sort((a,b) => (Number(a.priceDisplay?.replace(/[^0-9]/g, "")) || Infinity) - (Number(b.priceDisplay?.replace(/[^0-9]/g, "")) || Infinity))[0],
      highestRated: [...rows].sort((a,b) => b.rating - a.rating)[0],
    };
  }, [rows]);

  const annualSavings = useMemo(() => {
    if (rows.length < 2) return 0;
    const fsPrice = Number(rows.find(r => r.isFlashSpace)?.priceDisplay?.replace(/[^0-9]/g, "")) || 0;
    const marketAvg = rows.filter(r => !r.isFlashSpace).reduce((acc, curr) => acc + (Number(curr.priceDisplay?.replace(/[^0-9]/g, "")) || 0), 0) / (rows.length - 1);
    return Math.max(0, Math.round(marketAvg - fsPrice));
  }, [rows]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 font-sans antialiased">
      
      {/* ─── Decision Tool Trigger Bar ─── */}
      <button 
        onClick={() => setIsDecisionEngineOpen(!isDecisionEngineOpen)}
        className="w-full p-6 rounded-3xl shadow-lg transition-all group flex items-center justify-between hover:opacity-95 text-white mb-8"
        style={{ backgroundColor: BRAND_GREEN }}
      >
        <div className="flex items-center gap-5">
           <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10 transition-transform group-hover:scale-110">
             <ArrowRightLeft className="w-6 h-6 text-white" />
           </div>
           <div className="text-left">
             <h3 className="text-xl font-black uppercase tracking-tight leading-none text-white">Compare with Market Brands</h3>
             <p className="text-sm font-medium text-white/60 mt-1">Benchmarked real data for curated spaces in {city}</p>
           </div>
        </div>
        <div className={`p-2 rounded-lg transition-all ${isDecisionEngineOpen ? "bg-white/20 rotate-180" : "bg-white/10 group-hover:bg-white/20"}`}>
          <ChevronDown className="w-5 h-5 text-white" />
        </div>
      </button>

      {/* ─── Collapsible Decision Engine ─── */}
      {isDecisionEngineOpen && (
        <div className="space-y-8 animate-in zoom-in-95 duration-300 origin-top">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
            <div className="space-y-4">
              <AIRecommendation providers={rows} />
              <div className="space-y-1">
                 <h2 className="text-3xl font-black tracking-tight uppercase leading-none" style={{ color: BRAND_GREEN }}>Market Decision Benchmarks</h2>
              </div>
            </div>
            
            {rows.length > 2 && (
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                {(["all", "cheapest", "rated"] as const).map(f => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${filter === f ? "text-white shadow-lg" : "text-slate-400 hover:text-slate-600"}`}
                    style={filter === f ? { backgroundColor: BRAND_GREEN } : {}}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          {decisionSummary && <SummaryHeader decisionSummary={decisionSummary} annualSavings={annualSavings} />}

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b" style={{ backgroundColor: BRAND_GREEN }}>
                    <th className="px-8 py-6 text-[10px] font-black text-white/70 uppercase tracking-widest">Provider</th>
                    <th className="px-6 py-6 text-[10px] font-black text-white/70 uppercase tracking-widest text-center">Net Price</th>
                    <th className="px-6 py-6 text-[10px] font-black text-white/70 uppercase tracking-widest text-center">Market Rating</th>
                    <th className="px-6 py-6 text-[10px] font-black text-white/70 uppercase tracking-widest text-center">Onboarding</th>
                    <th className="px-8 py-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map(row => {
                    const isExpanded = expandedRows[row.name];
                    return (
                      <React.Fragment key={row.name}>
                        <tr 
                          className={`transition-all group hover:bg-slate-50/80 cursor-pointer ${row.isFlashSpace ? "bg-[#35503f]/[0.02]" : ""}`}
                          onClick={() => toggleRow(row.name)}
                        >
                          <td className="px-8 py-7">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${row.isFlashSpace ? "text-white" : "bg-slate-100 text-slate-400"}`} style={row.isFlashSpace ? { backgroundColor: BRAND_GREEN } : {}}>
                                {row.name.substring(0,2).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-black text-slate-800 tracking-tight">{row.name}</span>
                                  {row.isFlashSpace && <BadgeCheck className="w-4 h-4" style={{ color: BRAND_GREEN }} />}
                                </div>
                                <div className="flex gap-2 mt-1">
                                  {row.highlights.map(h => (
                                    <span key={h} className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{h}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-7 text-center">
                            <div className="flex flex-col items-center gap-1">
                               <span className="text-[15px] font-black tracking-tight text-slate-800">
                                 {row.priceDisplay || "—"}
                               </span>
                               <div className="flex items-center gap-1 px-2 py-0.5 rounded-full">
                                 <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                                 <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest leading-none">Verified Rate</span>
                               </div>
                            </div>
                          </td>
                          <td className="px-6 py-7 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="font-bold text-slate-700">{row.rating.toFixed(1)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-7 text-center">
                            <span className="text-xs font-bold text-slate-500">{row.approvalTime}</span>
                          </td>
                          <td className="px-8 py-7 text-right">
                            <button className={`p-2 rounded-lg transition-all ${isExpanded ? "text-white shadow-sm" : "hover:bg-slate-100 text-slate-300"}`} style={isExpanded ? { backgroundColor: BRAND_GREEN } : {}}>
                               {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <ExpandableRow 
                            row={{
                              features: row.features,
                              pros: row.pros,
                              cons: row.cons,
                              hiddenCosts: row.hiddenCosts,
                              reviewSummary: row.reviewSummary
                            }} 
                            columnsCount={5} 
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50/80 border-t border-slate-100 px-8 py-5 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <Eye className="w-3.5 h-3.5 text-slate-400" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Market intelligence updated for {city}</span>
               </div>
               
               <div className="flex items-center gap-2">
                  <TrendingDown className="w-3.5 h-3.5 text-slate-300" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Real Data Only</span>
               </div>
            </div>
          </div>
          
          <div className="flex justify-center pt-4">
            <button 
              className="text-white px-12 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl hover:opacity-90 transition-all font-sans" 
              style={{ backgroundColor: BRAND_GREEN }}
              onClick={() => setIsDecisionEngineOpen(false)}
            >
              Close Comparison
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
