import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isToday, isSameDay, isWithinInterval } from "date-fns";
import { useMemo } from "react";

type MonthViewProps = {
  currentDate: Date;
  bookings: any[];
  onDateClick: (date: Date) => void;
};

export default function MonthView({ currentDate, bookings, onDateClick }: MonthViewProps) {
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

  /**
   * Process bookings for a specific week to determine their layout positions
   */
  const getWeekBookings = (weekDays: Date[]) => {
    const weekStart = weekDays[0];
    const weekEnd = weekDays[6];

    // Find bookings that overlap with this week
    const relevantBookings = bookings.filter(booking => {
        const start = new Date(booking.startTime);
        const end = new Date(booking.endTime);
        return (start <= weekEnd && end >= weekStart);
    });

    // Sort by length (longer first) to optimize packing
    relevantBookings.sort((a, b) => {
        const durA = new Date(a.endTime).getTime() - new Date(a.startTime).getTime();
        const durB = new Date(b.endTime).getTime() - new Date(b.startTime).getTime();
        return durB - durA;
    });

    // Assign visual rows to avoid overlap
    const rows: any[][] = []; // Array of rows, each containing bookings
    const processedBookings: any[] = [];

    relevantBookings.forEach(booking => {
        const start = new Date(booking.startTime);
        const end = new Date(booking.endTime);
        
        // Calculate start and end indices within the week (0-6)
        let startIndex = weekDays.findIndex(day => isSameDay(day, start));
        let endIndex = weekDays.findIndex(day => isSameDay(day, end));

        // If starts before this week, clamp to 0
        if (startIndex === -1 && start < weekStart) startIndex = 0;
        // If ends after this week, clamp to 6
        if (endIndex === -1 && end > weekEnd) endIndex = 6;
        
        // Skip if invalid (shouldn't happen due to filter)
        if (startIndex === -1 || endIndex === -1) return;

        const bookingItem = {
            ...booking,
            colStart: startIndex + 1, // Grid lines are 1-based
            colSpan: endIndex - startIndex + 1,
            isStart: start >= weekStart,
            isEnd: end <= weekEnd
        };

        // Find a row where this booking fits
        let placed = false;
        for (let i = 0; i < rows.length; i++) {
             const row = rows[i];
             // Check if any existing booking in this row overlaps with current
             const hasOverlap = row.some(b => {
                 const bStart = b.colStart;
                 const bEnd = b.colStart + b.colSpan - 1;
                 const currentStart = bookingItem.colStart;
                 const currentEnd = bookingItem.colStart + bookingItem.colSpan - 1;
                 return Math.max(bStart, currentStart) <= Math.min(bEnd, currentEnd);
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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
        {weekDays.map((day) => (
          <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid - Render Week by Week */}
      <div className="flex flex-col bg-slate-200 gap-[1px]">
        {weeks.map((week, weekIndex) => {
            const { bookings: weekBookings, maxRows } = getWeekBookings(week);
            // Calculate height based on number of booking rows, min height 100px
            // Base height + (rows * rowHeight)
            const rowHeight = 24; // Height of each booking bar
            const headerHeight = 28; // Height for date numbers
            const gridHeight = Math.max(100, headerHeight + (maxRows * rowHeight) + 10); 

            return (
                <div key={weekIndex} className="relative bg-white" style={{ height: `${gridHeight}px` }}>
                     {/* Background Grid Cells */}
                     <div className="absolute inset-0 grid grid-cols-7 divide-x divide-slate-100">
                         {week.map((day) => {
                             const isCurrentMonth = isSameMonth(day, monthStart);
                             const isDayToday = isToday(day);
                             return (
                                 <div 
                                     key={day.toISOString()} 
                                     onClick={() => onDateClick(day)}
                                     className={`relative p-2 cursor-pointer transition-colors hover:bg-slate-50 ${!isCurrentMonth ? "bg-slate-50/50" : ""}`}
                                 >
                                      <span
                                        className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium z-10 relative ${
                                          isDayToday
                                            ? "bg-[#3FA69E] text-white"
                                            : !isCurrentMonth
                                            ? "text-slate-400"
                                            : "text-slate-700"
                                        }`}
                                      >
                                        {format(day, "d")}
                                      </span>
                                 </div>
                             );
                         })}
                     </div>

                     {/* Bookings Layer */}
                     <div className="absolute top-9 left-0 right-0 grid grid-cols-7 gap-y-1 px-1">
                          {weekBookings.map((booking) => (
                              <div
                                  key={`${booking.id}-${weekIndex}`}
                                  className={`
                                      relative text-[11px] font-medium px-2 py-0.5 rounded-md truncate shadow-sm select-none
                                      ${booking.status === "PENDING_KYC" ? "bg-blue-100 text-blue-700 border border-blue-200" : 
                                        (booking.status === "PENDING" || booking.status === "PENDING_PAYMENT") ? "bg-amber-100 text-amber-700 border border-amber-200" : 
                                        "bg-[#3FA69E] text-white"}
                                  `}
                                  style={{
                                      gridColumnStart: booking.colStart,
                                      gridColumnEnd: `span ${booking.colSpan}`,
                                      marginTop: `${booking.rowIndex * 24}px`, // Stack vertically
                                      // Special rounded corners for multi-week spans
                                      borderTopLeftRadius: booking.isStart ? "6px" : "0px",
                                      borderBottomLeftRadius: booking.isStart ? "6px" : "0px",
                                      borderTopRightRadius: booking.isEnd ? "6px" : "0px",
                                      borderBottomRightRadius: booking.isEnd ? "6px" : "0px",
                                      marginLeft: booking.isStart ? "4px" : "0px",
                                      marginRight: booking.isEnd ? "4px" : "0px",
                                      opacity: 0.9,
                                      zIndex: 20
                                  }}
                                  title={`${booking.clientName} (${format(new Date(booking.startTime), 'MMM d')} - ${format(new Date(booking.endTime), 'MMM d')})`}
                              >
                                  {booking.clientName}
                              </div>
                          ))}
                     </div>
                </div>
            )
        })}
      </div>
    </div>
  );
}
