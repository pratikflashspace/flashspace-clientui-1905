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
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 sm:text-xl">
          <CalendarDays className="h-5 w-5 text-[#3FA69E]" />
          Booking Calendar
        </h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          View and manage bookings in weekly mode.
        </p>
      </div>

      <div className="no-scrollbar flex w-full flex-nowrap items-center gap-2 overflow-x-auto sm:w-auto sm:overflow-visible">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:px-4 sm:text-sm"
        >
          <ChevronLeft size={16} />
          Prev
        </button>

        <button
          onClick={onToday}
          className="rounded-xl bg-[#3FA69E] px-3 py-2 text-xs font-semibold text-white hover:opacity-90 sm:px-4 sm:text-sm"
        >
          Today
        </button>

        <button
          onClick={onNext}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 sm:px-4 sm:text-sm"
        >
          Next
          <ChevronRight size={16} />
        </button>

        <div className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-center text-xs font-semibold text-slate-700 sm:ml-2 sm:text-left sm:text-sm">
          {title}
        </div>
      </div>
    </div>
  );
}
