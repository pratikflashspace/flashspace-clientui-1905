import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

type CalendarHeaderProps = {
  title: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
};

export default function CalendarHeader({
  title,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-secondary/20 bg-[#2D3F33] p-6 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#3FA69E]/20 flex items-center justify-center border border-[#3FA69E]/30 shrink-0">
          <CalendarDays className="h-6 w-6 text-[#FDE68A]" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-[#FDE68A] tracking-tight uppercase">
            Schedule <span className="italic text-primary">Overview</span>
          </h2>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-0.5">
            Real-time management for all assets
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
          <button
            onClick={onPrev}
            className="p-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all active:scale-95"
          >
            <ChevronLeft size={18} />
          </button>
          
          <button
            onClick={onToday}
            className="px-6 py-2 rounded-lg text-xs font-bold text-[#FDE68A] hover:bg-white/5 transition-all active:scale-95 uppercase tracking-wider"
          >
            Current
          </button>

          <button
            onClick={onNext}
            className="p-2 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all active:scale-95"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="px-6 py-2.5 rounded-xl bg-[#3FA69E] text-white font-extrabold text-sm shadow-lg min-w-[140px] text-center border border-white/10">
          {title}
        </div>
      </div>
    </div>
  );
}
