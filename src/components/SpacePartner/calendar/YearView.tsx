import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
} from "date-fns";
import { useMemo } from "react";

type YearViewProps = {
  year: number;
  bookings: any[];
  onMonthClick: (month: number) => void;
};

export default function YearView({
  year,
  bookings,
  onMonthClick,
}: YearViewProps) {
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {months.map((month) => (
        <MiniMonthGrid
          key={month}
          year={year}
          month={month}
          bookings={bookings}
          onMonthClick={onMonthClick}
        />
      ))}
    </div>
  );
}

function MiniMonthGrid({
  year,
  month,
  bookings,
  onMonthClick,
}: {
  year: number;
  month: number;
  bookings: any[];
  onMonthClick: (m: number) => void;
}) {
  const monthDate = new Date(year, month, 1);
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  // Filter bookings for this month (loose filter for performance, precise placement later)
  const monthlyBookings = useMemo(() => {
    return bookings.filter((b) => {
      const start = new Date(b.startTime);
      const end = new Date(b.endTime);
      return start <= monthEnd && end >= monthStart;
    });
  }, [bookings, monthStart, monthEnd]);

  // Group into weeks
  const weeks = useMemo(() => {
    const days = [...calendarDays];
    const weeksArray = [];
    while (days.length > 0) {
      weeksArray.push(days.splice(0, 7));
    }
    return weeksArray;
  }, [calendarDays]);

  // Pre-calculate counts per day
  const dayCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    calendarDays.forEach((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      counts[dateKey] = monthlyBookings.filter((b) => {
        const start = new Date(b.startTime);
        const end = new Date(b.endTime);
        const checkDay = new Date(day);
        checkDay.setHours(0, 0, 0, 0);
        const bStart = new Date(start);
        bStart.setHours(0, 0, 0, 0);
        const bEnd = new Date(end);
        bEnd.setHours(0, 0, 0, 0);
        return checkDay >= bStart && checkDay <= bEnd;
      }).length;
    });
    return counts;
  }, [calendarDays, monthlyBookings]);

  return (
    <div
      onClick={() => onMonthClick(month)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all duration-300 hover:border-primary hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
    >
      {/* Header */}
      <div className="bg-muted/50 px-4 py-3 border-b border-border flex justify-between items-center group-hover:bg-[#2D3F33] transition-colors duration-300">
        <h3 className="font-extrabold text-foreground tracking-tight group-hover:text-[#FEF8C5] transition-colors uppercase text-xs">
          {format(monthDate, "MMMM")}
        </h3>
        <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors">
          {year}
        </span>
      </div>

      <div className="p-3">
        {/* Days Header */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((d, i) => (
            <div
              key={`${d}-${i}`}
              className="text-center text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex flex-col gap-[2px]">
          {weeks.map((week, i) => (
            <div key={i} className="grid grid-cols-7 gap-1">
              {week.map((day) => {
                const isCurrent = isSameMonth(day, monthDate);
                const isDayToday = isToday(day);
                const dateKey = format(day, "yyyy-MM-dd");
                const count = dayCounts[dateKey] || 0;

                if (!isCurrent) return <div key={day.toISOString()} />;

                return (
                  <div
                    key={day.toISOString()}
                    className="relative flex flex-col items-center justify-center py-1"
                  >
                    <span
                      className={`text-[10px] font-bold ${
                        isDayToday ? "text-primary font-black" : "text-muted-foreground/60"
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                    
                    {count > 0 && (
                      <div 
                        className={`
                          absolute -top-1 -right-1 w-3.5 h-3.5 flex items-center justify-center rounded-full text-[7px] font-black text-white shadow-sm
                          ${count > 2 ? "bg-red-500" : "bg-[#3FA69E]"}
                        `}
                      >
                        {count}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
