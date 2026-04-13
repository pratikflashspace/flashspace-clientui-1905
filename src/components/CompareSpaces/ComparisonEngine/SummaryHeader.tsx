import { Trophy, IndianRupee, Star, ShieldCheck } from "lucide-react";

interface SummaryResult {
  name: string;
}

interface SummaryHeaderProps {
  decisionSummary: {
    bestOverall: SummaryResult;
    cheapest: SummaryResult;
    highestRated: SummaryResult;
  };
  annualSavings: number;
}

const BRAND_GREEN = "#35503f";

export default function SummaryHeader({ decisionSummary, annualSavings }: SummaryHeaderProps) {
  const cards = [
    { label: "Best Overall", value: decisionSummary.bestOverall.name, icon: Trophy, color: "#ffffff" },
    { label: "Cheapest", value: decisionSummary.cheapest.name, icon: IndianRupee, color: "#ffffff" },
    { label: "Highest Rated", value: decisionSummary.highestRated.name, icon: Star, color: "#ffffff" },
  ];

  return (
    <div className="space-y-6 px-1">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          
          return (
            <div 
              key={card.label} 
              className="rounded-2xl p-6 flex items-center gap-5 transition-all shadow-md hover:scale-[1.02]"
              style={{ backgroundColor: BRAND_GREEN }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.1em] mb-1">{card.label}</p>
                <h4 className="text-base font-black text-white truncate">{card.value}</h4>
              </div>
            </div>
          );
        })}
      </div>

      {annualSavings > 0 && (
        <div className="flex items-center gap-2.5 py-4 px-6 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
          <ShieldCheck className="w-4 h-4" style={{ color: BRAND_GREEN }} />
          <p className="text-sm font-semibold text-slate-600">
            You save <span className="font-black px-1.5 py-0.5 rounded" style={{ backgroundColor: `${BRAND_GREEN}10`, color: BRAND_GREEN }}>₹{annualSavings.toLocaleString('en-IN')}/year</span> with FlashSpace vs market average.
          </p>
        </div>
      )}
    </div>
  );
}
