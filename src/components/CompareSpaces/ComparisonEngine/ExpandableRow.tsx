import { Check, Info } from "lucide-react";

interface ExpandableRowProps {
  row: {
    features: string[];
    pros: string[];
    cons: string[];
    hiddenCosts: string[];
    reviewSummary: string;
  };
  columnsCount: number;
}

const BRAND_GREEN = "#35503f";

export default function ExpandableRow({ row, columnsCount }: ExpandableRowProps) {
  return (
    <tr className="bg-slate-50/50">
      <td colSpan={columnsCount} className="px-10 py-10 border-l-4" style={{ borderColor: BRAND_GREEN }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Features Breakdown */}
          <div>
            <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6">Key Benefits</h5>
            <div className="space-y-3.5">
              {row.features.map(f => (
                <div key={f} className="flex items-center gap-3 text-[13px] font-bold text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-slate-500" />
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Analysis */}
          <div>
            <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6">Market Analysis</h5>
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                {row.pros.map(p => (
                  <span key={p} className="text-[10px] font-black bg-slate-100 text-slate-600 px-3 py-1 rounded-lg border border-slate-200">+{p}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {row.cons.map(c => (
                  <span key={c} className="text-[10px] font-black bg-slate-50 text-slate-400 px-3 py-1 rounded-lg border border-slate-100">-{c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Cost Transparency */}
          <div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-slate-400" />
                <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Transparency</h5>
              </div>
              <div className="space-y-2.5">
                {row.hiddenCosts.map(hc => (
                  <div key={hc} className="text-[13px] font-bold text-slate-500 flex items-center gap-2">
                    • {hc}
                  </div>
                ))}
              </div>
              <hr className="my-5 border-slate-100" />
              <p className="text-[13px] italic text-slate-400 leading-relaxed font-medium">"{row.reviewSummary}"</p>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}
