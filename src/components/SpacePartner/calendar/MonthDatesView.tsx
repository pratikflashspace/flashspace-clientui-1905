import { format, isSameDay } from "date-fns";

type MonthDatesViewProps = {
  currentDate: Date;
  bookings: any[];
};

export default function MonthDatesView({
  currentDate,
  bookings,
}: MonthDatesViewProps) {
  // Filter bookings for the current month
  const currentMonthBookings = bookings
    .filter((b) => {
      const d = new Date(b.startTime);
      return (
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear()
      );
    })
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

  if (currentMonthBookings.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-500">
        <p>No bookings found for {format(currentDate, "MMMM yyyy")}</p>
      </div>
    );
  }

  // Group by Date
  const groupedBookings: Record<string, typeof bookings> = {};
  currentMonthBookings.forEach((booking) => {
    const dateKey = format(new Date(booking.startTime), "yyyy-MM-dd");
    if (!groupedBookings[dateKey]) groupedBookings[dateKey] = [];
    groupedBookings[dateKey].push(booking);
  });

  return (
    <div className="flex flex-col gap-8 mt-4 animate-in fade-in duration-700">
      {Object.entries(groupedBookings).map(([dateKey, daysBookings]) => (
        <div
          key={dateKey}
          className="relative group"
        >
          {/* Date Header with vertical line accent */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-[#2D3F33] text-[#FEF8C5] shadow-xl border border-white/10 shrink-0">
              <span className="text-xl font-extrabold">{format(new Date(dateKey), "dd")}</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">{format(new Date(dateKey), "MMM")}</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-extrabold text-foreground tracking-tight">
                {format(new Date(dateKey), "EEEE")}
              </h3>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {format(new Date(dateKey), "MMMM yyyy")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-2 md:ml-6 pl-6 border-l-2 border-border/60 group-hover:border-primary/40 transition-colors">
            {daysBookings.map((booking) => (
              <div
                key={booking.id}
                className="group/card relative flex items-center justify-between rounded-2xl bg-background border border-border p-5 transition-all duration-300 hover:border-primary hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
              >
                <div className="flex items-center gap-5">
                  <div className="flex flex-col items-center justify-center rounded-xl bg-muted/50 px-4 py-2 text-xs font-extrabold text-foreground border border-border group-hover/card:bg-primary/10 group-hover/card:border-primary/20 transition-colors min-w-[130px]">
                    <span className="text-primary">{format(new Date(booking.startTime), "MMM d")}</span>
                    <span className="my-1 h-px w-4 bg-border" />
                    <span className="text-muted-foreground">{format(new Date(booking.endTime), "MMM d, yyyy")}</span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-foreground tracking-tight group-hover/card:text-primary transition-colors">
                      {booking.clientName}
                    </h4>
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#3FA69E]" />
                      {booking.space}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div
                    className={`rounded-xl px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest shadow-sm ${
                      booking.status === "CONFIRMED"
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : booking.status === "PENDING_KYC"
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : booking.status === "PENDING" ||
                              booking.status === "PENDING_PAYMENT"
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : "bg-rose-100 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {booking.status === "PENDING_KYC"
                      ? "KYC Pending"
                      : booking.status === "PENDING_PAYMENT"
                        ? "Pay Pending"
                        : booking.status === "CONFIRMED"
                          ? "Confirmed"
                          : booking.status === "CANCELLED"
                            ? "Cancelled"
                            : "Pending"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
