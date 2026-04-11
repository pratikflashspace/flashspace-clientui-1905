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
} from "lucide-react";

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

export default function CompetitorComparison({
  city,
  spaceType,
  flashSpacePricing,
  flashSpaceRating,
  flashSpaceCount,
}: CompetitorComparisonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const columns = useMemo(() => getColumns(spaceType), [spaceType]);

  // Filter competitors that have data for this city
  const relevantCompetitors = useMemo(
    () => COMPETITORS.filter((c) => c.plans[city]),
    [city],
  );

  const isDataMissing = relevantCompetitors.length === 0;

  // Build rows: FlashSpace first, then competitors
  type Row = {
    name: string;
    isFlashSpace: boolean;
    prices: Record<string, string | undefined>;
    rating: number;
    highlights: string[];
  };

  const rows: Row[] = useMemo(() => {
    if (isDataMissing) return []; // No rows if data is missing
    const fsRow: Row = {
      name: "FlashSpace",
      isFlashSpace: true,
      prices: {},
      rating: flashSpaceRating,
      highlights: ["AI-Powered Platform", "100+ Cities", "24hr Activation", "Dedicated Support"],
    };
    columns.forEach((col) => {
      const mappedKey = flashSpaceKeyMap[col.key];
      fsRow.prices[col.key] = mappedKey ? flashSpacePricing[mappedKey] : undefined;
    });

    const compRows: Row[] = relevantCompetitors.map((c) => ({
      name: c.name,
      isFlashSpace: false,
      prices: c.plans[city] || {},
      rating: c.rating,
      highlights: c.highlights,
    }));

    return [fsRow, ...compRows];
  }, [columns, relevantCompetitors, city, flashSpacePricing, flashSpaceRating, isDataMissing]);

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

  // Calculate savings
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
    <div className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Trophy className={`w-4.5 h-4.5 ${isDataMissing ? "text-muted-foreground" : "text-primary"}`} />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-foreground tracking-tight">
              Price Comparison — {spaceType === "virtual-office" ? "Virtual Office" : spaceType === "coworking" ? "Coworking" : "Meeting Rooms"} in {city}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {isDataMissing 
                ? `Market data for ${city} is being updated...` 
                : `FlashSpace vs ${relevantCompetitors.length} other providers`}
              {!isDataMissing && savingsText && (
                <span className="ml-2 text-emerald-600 font-semibold">• {savingsText} with FlashSpace</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isDataMissing ? (
            <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
              <Sparkles className="w-3 h-3" /> Coming Soon
            </span>
          ) : savingsText ? (
            <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <TrendingDown className="w-3 h-3" /> Best Value
            </span>
          ) : null}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-border/40">
          {isDataMissing ? (
            <div className="px-5 py-8 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-muted-foreground" />
              </div>
              <h4 className="text-sm font-bold text-foreground">Comparison Coming Soon!</h4>
              <p className="text-xs text-muted-foreground max-w-[280px] mt-1 mx-auto">
                We're currently gathering verified pricing data for {city} to bring you the best market insights. Stay tuned!
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-48">
                    Provider
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      {col.label}
                      <span className="block text-[10px] font-normal text-muted-foreground/60 mt-0.5">
                        {col.sub}
                      </span>
                    </th>
                  ))}
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Highlights
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIdx) => (
                  <tr
                    key={row.name}
                    className={`border-t border-border/20 transition-colors ${
                      row.isFlashSpace
                        ? "bg-primary/[0.03] hover:bg-primary/[0.06]"
                        : "hover:bg-muted/20"
                    }`}
                  >
                    {/* Provider Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {row.isFlashSpace ? (
                          <div className="w-8 h-8 rounded-lg bg-[#35503F] flex items-center justify-center text-white text-[10px] font-black shrink-0">
                            FS
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-muted/60 border border-border/60 flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">
                            {row.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <span className={`font-semibold text-sm ${row.isFlashSpace ? "text-primary" : "text-foreground"}`}>
                            {row.name}
                          </span>
                          {row.isFlashSpace && (
                            <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 font-medium mt-0.5">
                              <BadgeCheck className="w-3 h-3" /> You are here
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Price Columns */}
                    {columns.map((col) => {
                      const price = row.prices[col.key];
                      const isCheapest = cheapestByCol[col.key] === rowIdx;
                      return (
                        <td key={col.key} className="text-center px-4 py-3.5">
                          {price ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <span
                                className={`text-sm font-bold ${
                                  isCheapest
                                    ? "text-emerald-600"
                                    : row.isFlashSpace 
                                      ? "text-primary"
                                      : "text-foreground"
                                }`}
                              >
                                {price}
                              </span>
                              {isCheapest && (
                                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
                                  LOWEST
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground/40">—</span>
                          )}
                        </td>
                      );
                    })}

                    {/* Rating */}
                    <td className="text-center px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className={`text-sm font-bold ${row.isFlashSpace ? "text-primary" : "text-foreground"}`}>
                          {row.rating.toFixed(1)}
                        </span>
                      </div>
                    </td>

                    {/* Highlights */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {row.highlights.slice(0, 3).map((h) => (
                          <span
                            key={h}
                            className={`text-[10px] px-2 py-0.5 rounded-full border ${
                              row.isFlashSpace
                                ? "bg-primary/5 text-primary border-primary/20 font-medium"
                                : "bg-muted/40 text-muted-foreground border-border/60"
                            }`}
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-border/20">
            {rows.map((row, rowIdx) => (
              <div
                key={row.name}
                className={`px-4 py-3.5 ${row.isFlashSpace ? "bg-primary/[0.03]" : ""}`}
              >
                {/* Provider header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {row.isFlashSpace ? (
                      <div className="w-7 h-7 rounded-lg bg-[#35503F] flex items-center justify-center text-white text-[9px] font-black">
                        FS
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-muted/60 border border-border/60 flex items-center justify-center text-[9px] font-bold text-muted-foreground">
                        {row.name.charAt(0)}
                      </div>
                    )}
                    <span className={`font-semibold text-sm ${row.isFlashSpace ? "text-primary" : "text-foreground"}`}>
                      {row.name}
                    </span>
                    {row.isFlashSpace && (
                      <span className="text-[9px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-full">
                        You are here
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold">{row.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Prices */}
                <div className="grid grid-cols-2 gap-2">
                  {columns.map((col) => {
                    const price = row.prices[col.key];
                    const isCheapest = cheapestByCol[col.key] === rowIdx;
                    return (
                      <div
                        key={col.key}
                        className={`px-2.5 py-1.5 rounded-lg ${isCheapest ? "bg-emerald-50 border border-emerald-100" : "bg-muted/30"}`}
                      >
                        <div className="text-[10px] text-muted-foreground">{col.label}</div>
                        <div className={`text-xs font-bold ${isCheapest ? "text-emerald-600" : "text-foreground"}`}>
                          {price || "—"}
                          {isCheapest && <span className="ml-1 text-[8px]">✓ Lowest</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

            </>
          )}
          {/* Footer CTA */}
          <div className="border-t border-border/40 px-5 py-3 bg-muted/20 flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">
              <Shield className="w-3 h-3 inline mr-1 text-primary" />
              Prices are approximate & sourced from public listings. Updated periodically.
            </p>
            <span className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-primary cursor-pointer hover:underline">
              <Sparkles className="w-3 h-3" /> Why FlashSpace?
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
