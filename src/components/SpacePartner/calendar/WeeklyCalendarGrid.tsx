import type { Booking } from "@/types/spacePortal/booking";

type WeeklyCalendarGridProps = {
  weekDates: Date[];
  bookings: Booking[];
};

const HOURS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

export default function WeeklyCalendarGrid({
  weekDates,
  bookings,
}: WeeklyCalendarGridProps) {
  const minWidthClass =
    weekDates.length <= 1 ? "min-w-[420px]" : "min-w-[920px]";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <div className={minWidthClass}>
          {/* Header Row */}
          <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50">
            <div className="p-3 text-xs font-semibold text-slate-500 sm:p-4 sm:text-sm">
              Time
            </div>

            {weekDates.map((date) => {
              const dayLabel = date.toLocaleDateString("en-US", {
                weekday: "short",
              });
              const dateLabel = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
              return (
                <div
                  key={date.toISOString()}
                  className="border-l border-slate-200 p-3 text-xs font-semibold text-slate-700 sm:p-4 sm:text-sm"
                >
                  <span className="block">{dayLabel}</span>
                  <span className="block text-[10px] font-medium text-slate-400 sm:text-xs">
                    {dateLabel}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Time Rows */}
          <div className="relative">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="grid grid-cols-8 border-b border-slate-100"
              >
                {/* Time column */}
                <div className="bg-white p-3 text-xs font-semibold text-slate-500 sm:p-4">
                  {hour}
                </div>

                {/* Day columns */}
                {weekDates.map((date) => (
                  <div
                    key={`${date.toISOString()}-${hour}`}
                    className="relative h-[72px] border-l border-slate-100 p-3 sm:p-4"
                  />
                ))}
              </div>
            ))}

            {/* Booking Blocks Overlay */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-8">
              {/* empty first column */}
              <div />

              {weekDates.map((date, dayIndex) => (
                <div key={dayIndex} className="relative">
                  {bookings
                    .filter((b) => isSameDay(new Date(b.startTime), date))
                    .map((booking) => (
                      <BookingBlock key={booking.id} booking={booking} />
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingBlock({ booking }: { booking: Booking }) {
  const startHour = parseInt(booking.startTime.slice(11, 13));
  const endHour = parseInt(booking.endTime.slice(11, 13));

  const top = (startHour - 8) * 72;
  const height = Math.max((endHour - startHour) * 72, 72);

  const color =
    booking.status === "CONFIRMED"
      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
      : booking.status === "PENDING"
      ? "bg-amber-50 border-amber-200 text-amber-800"
      : "bg-rose-50 border-rose-200 text-rose-800";

  return (
    <div
      className={`absolute left-2 right-2 rounded-xl border p-3 text-xs shadow-sm pointer-events-auto cursor-pointer hover:opacity-90 ${color}`}
      style={{ top, height }}
    >
      <p className="font-bold">{booking.clientName}</p>
      <p className="text-[11px] opacity-80">{booking.space}</p>
      <p className="mt-1 text-[11px] font-semibold">
        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
      </p>
    </div>
  );
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
