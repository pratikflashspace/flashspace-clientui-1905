import { format, isSameDay } from "date-fns";

type MonthDatesViewProps = {
  currentDate: Date;
  bookings: any[];
};

export default function MonthDatesView({ currentDate, bookings }: MonthDatesViewProps) {
  // Filter bookings for the current month
  const currentMonthBookings = bookings.filter((b) => {
      const d = new Date(b.startTime);
      return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
  }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
  if (currentMonthBookings.length === 0) {
      return (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-500">
              <p>No bookings found for {format(currentDate, "MMMM yyyy")}</p>
          </div>
      );
  }

  // Group by Date
  const groupedBookings: Record<string, typeof bookings> = {};
  currentMonthBookings.forEach(booking => {
      const dateKey = format(new Date(booking.startTime), "yyyy-MM-dd");
      if (!groupedBookings[dateKey]) groupedBookings[dateKey] = [];
      groupedBookings[dateKey].push(booking);
  });

  return (
    <div className="flex flex-col gap-6">
        {Object.entries(groupedBookings).map(([dateKey, daysBookings]) => (
            <div key={dateKey} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
                <h3 className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2 font-bold text-slate-800">
                    <span className="text-[#3FA69E] text-lg">{format(new Date(dateKey), "dd")}</span>
                    <span>{format(new Date(dateKey), "EEEE, MMMM yyyy")}</span>
                </h3>
                
                <div className="flex flex-col gap-3">
                    {daysBookings.map(booking => (
                        <div key={booking.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                             <div className="flex items-center gap-4">
                                 <div className="flex flex-col items-center justify-center rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm border border-slate-100 min-w-[120px]">
                                     <span>{format(new Date(booking.startTime), "MMM d, yyyy")}</span>
                                     <span className="text-[10px] text-slate-400 font-normal">to</span>
                                     <span>{format(new Date(booking.endTime), "MMM d, yyyy")}</span>
                                 </div>
                                 
                                 <div>
                                     <h4 className="font-bold text-slate-900">{booking.clientName}</h4>
                                     <p className="text-xs text-slate-500">{booking.space}</p>
                                 </div>
                             </div>
                             
                              <div className={`rounded-full px-3 py-1 text-xs font-bold ${
                                  booking.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-700" :
                                  booking.status === "PENDING_KYC" ? "bg-blue-100 text-blue-700" :
                                  (booking.status === "PENDING" || booking.status === "PENDING_PAYMENT") ? "bg-amber-100 text-amber-700" :
                                  "bg-rose-100 text-rose-700"
                              }`}>
                                  {booking.status === "PENDING_KYC" ? "Verification Pending" : 
                                   booking.status === "PENDING_PAYMENT" ? "Payment Pending" :
                                   booking.status === "CONFIRMED" ? "Confirmed" :
                                   booking.status === "CANCELLED" ? "Cancelled" : "Pending"}
                              </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
  );
}
