import { BookmarkCheck } from "lucide-react";

interface AIRecommendationProps {
  providers: any[];
}

const BRAND_GREEN = "#35503f";

export default function AIRecommendation({ providers }: AIRecommendationProps) {
  const recommended = providers.find(p => p.isFlashSpace) || providers[0];

  return (
    <div className="flex items-center gap-3 py-2.5 px-5 bg-white border border-slate-200 rounded-xl w-fit shadow-sm">
      <BookmarkCheck className="w-4 h-4" style={{ color: BRAND_GREEN }} />
      <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em]">
        Recommended for you: <span className="font-black italic" style={{ color: BRAND_GREEN }}>{recommended.name}</span>
      </span>
    </div>
  );
}
