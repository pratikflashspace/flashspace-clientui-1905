import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { useMemo } from "react";

type MonthViewProps = {
  currentDate: Date;
  bookings: any[];
  onDateClick: (date: Date) => void;
};

export default function MonthView({
  currentDate,
  bookings,
  onDateClick,
}: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Group days into weeks
  const weeks = useMemo(() => {
    const days = [...calendarDays];
    const weeksArray = [];
    while (days.length > 0) {
      weeksArray.push(days.splice(0, 7));
    }
    return weeksArray;
  }, [calendarDays]);

  // Pre-calculate booking counts for each day to optimize rendering
  const dayBookings = useMemo(() => {
    const counts: Record<string, any[]> = {};
    calendarDays.forEach((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      counts[dateKey] = bookings.filter((booking) => {
        const start = new Date(booking.startTime);
        const end = new Date(booking.endTime);
        // Normalize dates to check overlap by day
        const checkDay = new Date(day);
        checkDay.setHours(0, 0, 0, 0);
        const bookingStart = new Date(start);
        bookingStart.setHours(0, 0, 0, 0);
        const bookingEnd = new Date(end);
        bookingEnd.setHours(0, 0, 0, 0);

        return checkDay >= bookingStart && checkDay <= bookingEnd;
      });
    });
    return counts;
  }, [calendarDays, bookings]);

  return (
    <div className="overflow-hidden rounded-2xl border border-secondary/20 bg-background shadow-lg mt-4">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/50">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-4 text-center text-xs font-extrabold text-muted-foreground uppercase tracking-widest"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid - Render Week by Week */}
      <div className="flex flex-col bg-border/40 gap-[1px]">
        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            className="grid grid-cols-7 bg-background min-h-[120px]"
          >
            {week.map((day) => {
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isDayToday = isToday(day);
              const dateKey = format(day, "yyyy-MM-dd");
              const activeBookings = dayBookings[dateKey] || [];
              const count = activeBookings.length;

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => onDateClick(day)}
                  className={`relative p-3 cursor-pointer group transition-all duration-300 border-b border-r border-border/10 hover:bg-primary/5 min-h-[120px] ${!isCurrentMonth ? "bg-muted/30" : ""}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm font-extrabold transition-all duration-300 z-10 relative ${
                        isDayToday
                          ? "bg-[#2D3F33] text-[#FEF8C5] shadow-lg scale-110"
                          : !isCurrentMonth
                            ? "text-muted-foreground/40"
                            : "text-foreground group-hover:text-primary"
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                    {isDayToday && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>

                  {/* Daily Booking Count Pill */}
                  {count > 0 && (
                    <div className="mt-auto space-y-1">
                      <div 
                        className={`
                          flex items-center gap-2 px-2.5 py-1.5 rounded-lg border shadow-sm transition-all group-hover:scale-[1.02]
                          ${
                            activeBookings.some(b => b.status === 'PENDING')
                              ? "bg-amber-50 border-amber-200 text-amber-700"
                              : "bg-[#3FA69E]/10 border-[#3FA69E]/30 text-[#2D3F33]"
                          }
                        `}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${activeBookings.some(b => b.status === 'PENDING') ? "bg-amber-500" : "bg-[#3FA69E]"}`} />
                        <span className="text-[10px] font-extrabold uppercase tracking-tight">
                          {count} {count === 1 ? 'Booking' : 'Bookings'}
                        </span>
                      </div>
                      
                      {/* Visual indicator for client names if space allows (show up to 2) */}
                      <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {activeBookings.slice(0, 2).map((b, i) => (
                          <div key={i} className="text-[8px] font-bold text-muted-foreground truncate px-1">
                            • {b.clientName}
                          </div>
                        ))}
                        {count > 2 && <div className="text-[8px] font-bold text-muted-foreground/60 px-1">+{count-2} more</div>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
