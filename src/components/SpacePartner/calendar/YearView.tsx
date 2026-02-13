import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns";
import { useMemo } from "react";

type YearViewProps = {
  year: number;
  bookings: any[];
  onMonthClick: (month: number) => void;
};

export default function YearView({ year, bookings, onMonthClick }: YearViewProps) {
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

function MiniMonthGrid({ year, month, bookings, onMonthClick }: { year: number, month: number, bookings: any[], onMonthClick: (m: number) => void }) {
    const monthDate = new Date(year, month, 1);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

    // Filter bookings for this month (loose filter for performance, precise placement later)
    const monthlyBookings = useMemo(() => {
        return bookings.filter(b => {
            const start = new Date(b.startTime);
            const end = new Date(b.endTime);
            return (start <= monthEnd && end >= monthStart);
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

    // Week processing logic (SAME AS MONTH VIEW but simplified)
    const getWeekBookings = (weekDays: Date[]) => {
        const weekStart = weekDays[0];
        const weekEnd = weekDays[6];

        const relevantBookings = monthlyBookings.filter(booking => {
            const start = new Date(booking.startTime);
            const end = new Date(booking.endTime);
            return (start <= weekEnd && end >= weekStart);
        });

        // Sort by length
        relevantBookings.sort((a, b) => {
            const durA = new Date(a.endTime).getTime() - new Date(a.startTime).getTime();
            const durB = new Date(b.endTime).getTime() - new Date(b.startTime).getTime();
            return durB - durA;
        });

        const rows: any[][] = [];
        const processedBookings: any[] = [];

        relevantBookings.forEach(booking => {
            const start = new Date(booking.startTime);
            const end = new Date(booking.endTime);
            
            let startIndex = weekDays.findIndex(day => isSameDay(day, start));
            let endIndex = weekDays.findIndex(day => isSameDay(day, end));

            if (startIndex === -1 && start < weekStart) startIndex = 0;
            if (endIndex === -1 && end > weekEnd) endIndex = 6;
            
            if (startIndex === -1 || endIndex === -1) return;

            const bookingItem = {
                ...booking,
                colStart: startIndex + 1,
                colSpan: endIndex - startIndex + 1,
                isStart: start >= weekStart,
                isEnd: end <= weekEnd
            };

            let placed = false;
            for (let i = 0; i < rows.length; i++) {
                 const row = rows[i];
                 const hasOverlap = row.some(b => {
                     return Math.max(b.colStart, bookingItem.colStart) <= Math.min(b.colStart + b.colSpan - 1, bookingItem.colStart + bookingItem.colSpan - 1);
                 });
                 if (!hasOverlap) {
                     row.push(bookingItem);
                     bookingItem.rowIndex = i;
                     placed = true;
                     break;
                 }
            }
            if (!placed) {
                rows.push([bookingItem]);
                bookingItem.rowIndex = rows.length - 1;
            }
            processedBookings.push(bookingItem);
        });

        return { bookings: processedBookings, maxRows: rows.length };
    };

    return (
        <div 
            onClick={() => onMonthClick(month)}
            className="cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-[#3FA69E] hover:shadow-md"
        >
            {/* Header */}
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-700">{format(monthDate, "MMMM")}</h3>
            </div>

            <div className="p-2">
                {/* Days Header */}
                <div className="grid grid-cols-7 mb-1">
                    {weekDays.map(d => (
                        <div key={d} className="text-center text-[10px] font-semibold text-slate-400">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="flex flex-col gap-[1px]">
                    {weeks.map((week, i) => {
                         const { bookings: weekBookings, maxRows } = getWeekBookings(week);
                         // Calculating height: Base 20px for date numbers + lines
                         const rowHeight = 3; // Very thin lines
                         const baseHeight = 18;
                         const height = Math.max(baseHeight, baseHeight + (maxRows * rowHeight));
                         
                         return (
                             <div key={i} className="relative w-full" style={{ height: `${height}px` }}>
                                 {/* Background Cells */}
                                 <div className="absolute inset-0 grid grid-cols-7 text-center">
                                     {week.map(day => {
                                         const isCurrent = isSameMonth(day, monthDate);
                                         if (!isCurrent) return <div key={day.toISOString()} />;
                                         return (
                                             <div key={day.toISOString()} className="text-[10px] text-slate-500">
                                                 {format(day, "d")}
                                             </div>
                                         )
                                     })}
                                 </div>

                                 {/* Bars Layer */}
                                 <div className="absolute top-4 left-0 right-0 grid grid-cols-7 gap-y-[1px] px-0.5">
                                      {weekBookings.map((b, idx) => (
                                          <div 
                                            key={idx}
                                            className={`h-[3px] rounded-full opacity-80 ${b.status === "PENDING" ? "bg-amber-400" : "bg-[#3FA69E]"}`}
                                            style={{
                                                gridColumnStart: b.colStart,
                                                gridColumnEnd: `span ${b.colSpan}`,
                                                marginTop: `${b.rowIndex * 4}px`, // Stack
                                                marginLeft: b.isStart ? "1px" : "0",
                                                marginRight: b.isEnd ? "1px" : "0"
                                            }}
                                          />
                                      ))}
                                 </div>
                             </div>
                         )
                    })}
                </div>
            </div>
        </div>
    )
}
