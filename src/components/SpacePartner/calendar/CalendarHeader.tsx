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
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-[#3FA69E]" />
          Booking Calendar
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          View and manage bookings in weekly mode.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ChevronLeft size={16} />
          Prev
        </button>

        <button
          onClick={onToday}
          className="rounded-xl bg-[#3FA69E] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Today
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Next
          <ChevronRight size={16} />
        </button>

        <div className="ml-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
          {title}
        </div>
      </div>
    </div>
  );
}
