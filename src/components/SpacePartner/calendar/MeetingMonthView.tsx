import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isToday, isSameDay } from "date-fns";
import { useMemo } from "react";

type Meeting = {
  _id: string;
  startTime: string;
};

type MeetingMonthViewProps = {
  currentDate: Date;
  meetings: Meeting[];
  onDateClick: (date: Date) => void;
};

export default function MeetingMonthView({ currentDate, meetings, onDateClick }: MeetingMonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const weeks = useMemo(() => {
    const days = [...calendarDays];
    const weeksArray = [];
    while (days.length > 0) {
      weeksArray.push(days.splice(0, 7));
    }
    return weeksArray;
  }, [calendarDays]);

  // Count meetings per day
  const getDailyCount = (day: Date) => {
    return meetings.filter(m => isSameDay(new Date(m.startTime), day)).length;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
        {weekDays.map((day) => (
          <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500">
            {day}
          </div>
        ))}
      </div>

      <div className="flex flex-col bg-slate-200 gap-[1px]">
        {weeks.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-[1px] bg-slate-200">
            {week.map((day) => {
              const isCurrentMonth = isSameMonth(day, monthStart);
              const count = getDailyCount(day);
              const isDayToday = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => onDateClick(day)}
                  className={`min-h-[100px] bg-white p-2 cursor-pointer transition-all hover:bg-indigo-50 ${
                    !isCurrentMonth ? "bg-slate-50/50 text-slate-400" : ""
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${
                      isDayToday
                        ? "bg-indigo-600 text-white"
                        : !isCurrentMonth
                        ? "text-slate-400"
                        : "text-slate-700"
                    }`}
                  >
                    {format(day, "d")}
                  </span>

                  {count > 0 && (
                    <div className="mt-2 flex flex-col gap-1">
                        <div className="rounded-md bg-indigo-100 px-2 py-1 text-center text-xs font-bold text-indigo-700">
                            {count} {count === 1 ? 'Meeting' : 'Meetings'}
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
