import { format } from "date-fns";

type Meeting = {
  _id: string;
  bookingUserName: string;
  bookingUserEmail: string;
  bookingUserPhone: string;
  startTime: string;
  endTime: string;
  googleMeetLink: string;
  status: string;
  notes: string;
};

type MeetingDayViewProps = {
  currentDate: Date;
  meetings: Meeting[];
};

export default function MeetingDayView({ currentDate, meetings }: MeetingDayViewProps) {
  // Generate time slots from 10:00 AM to 6:30 PM (30 min intervals)
  const timeSlots: string[] = [];
  const startHour = 10;
  const endHour = 18; // 6 PM
  const endMinute = 30;
  console.log("MeetingDayView currentDate", currentDate);
  for (let h = startHour; h <= endHour; h++) {
    timeSlots.push(`${h.toString().padStart(2, "0")}:00`);
    if (h < endHour || (h === endHour && endMinute === 30)) {
        timeSlots.push(`${h.toString().padStart(2, "0")}:30`);
    }
  }
  // This generates 10:00, 10:30 ... 18:00, 18:30

  // Helper to check if a meeting falls in a slot
  const getMeetingInSlot = (slotTime: string) => {
    return meetings.find((m) => {
        const d = new Date(m.startTime);
        const meetingHour = d.getHours();
        const meetingMin = d.getMinutes();
        const meetingTime = `${meetingHour.toString().padStart(2, "0")}:${meetingMin.toString().padStart(2, "0")}`;
        
        // Match start time
        // Note: This matches exact start time. Overlap logic might be needed if meetings are longer than 30 mins
        // But requested 30 min intervals.
        return meetingTime === slotTime;
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800">
            {format(currentDate, "EEEE, MMMM d, yyyy")}
        </h3>

        <div className="flex flex-col divide-y divide-slate-100">
            {timeSlots.map((slot) => {
                const meeting = getMeetingInSlot(slot);
                const [startH, startM] = slot.split(":").map(Number);
                const isLate = startH >= 12;
                const displayH = startH > 12 ? startH - 12 : startH;
                const ampm = isLate ? "PM" : "AM";
                const displayTime = `${displayH}:${startM.toString().padStart(2, "0")} ${ampm}`;

                return (
                    <div key={slot} className="flex min-h-[60px] group hover:bg-slate-50 transition-colors">
                        {/* Time Column */}
                        <div className="w-24 border-r border-slate-100 py-4 pr-4 text-right text-xs font-medium text-slate-400">
                            {displayTime}
                        </div>

                        {/* Event Column */}
                        <div className="flex-1 px-4 py-2">
                            {meeting ? (
                                <div className="flex h-full flex-col justify-center rounded-lg bg-indigo-50 px-3 py-2 border border-indigo-100">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-indigo-900 text-sm">{meeting.bookingUserName}</h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            meeting.status === "scheduled" ? "bg-emerald-100 text-emerald-700" :
                                            meeting.status === "cancelled" ? "bg-rose-100 text-rose-700" :
                                            "bg-indigo-200 text-indigo-800"
                                        }`}>
                                            {meeting.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-indigo-700 mt-1 truncate">
                                        {meeting.notes || "No notes"}
                                    </p>
                                    <div className="mt-1 flex gap-3 text-[10px] text-indigo-600">
                                        <span>📞 {meeting.bookingUserPhone}</span>
                                        {meeting.googleMeetLink && (
                                            <a href={meeting.googleMeetLink} target="_blank" rel="noreferrer" className="underline hover:text-indigo-800">
                                                Join Meet
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full"></div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
}
