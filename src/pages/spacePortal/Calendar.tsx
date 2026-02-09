import { useState } from "react";
import CalendarHeader from "@/components/SpacePartner/calendar/CalendarHeader";
import WeeklyCalendarGrid from "@/components/SpacePartner/calendar/WeeklyCalendarGrid";
import PendingRequestsPanel from "@/components/SpacePartner/calendar/PendingRequestPanel";

import { BOOKINGS, PENDING_REQUESTS } from "@/data/spacePortal/bookings";
import type { Booking, BookingRequest } from "@/types/spacePortal/booking";

export default function BookingCalendar() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(getTodayIndex());
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);
  const [requestStatus, setRequestStatus] = useState<
    Record<string, "PENDING" | "APPROVED" | "DECLINED">
  >(() =>
    Object.fromEntries(PENDING_REQUESTS.map((req) => [req.id, "PENDING"]))
  );

  const weekDates = getWeekDates(weekOffset);
  const weekDays = weekDates.map((date) =>
    date.toLocaleDateString("en-US", { weekday: "short" })
  );
  const title = getWeekTitle(weekOffset);
  const selectedDate = weekDates[selectedDayIndex] ?? weekDates[0];

  const handlePrevDay = () => {
    setSelectedDayIndex((prev) => {
      if (prev === 0) {
        setWeekOffset((offset) => offset - 1);
        return 6;
      }
      return prev - 1;
    });
  };

  const handleNextDay = () => {
    setSelectedDayIndex((prev) => {
      if (prev === 6) {
        setWeekOffset((offset) => offset + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const handleApprove = (id: string) => {
    setRequestStatus((prev) => ({ ...prev, [id]: "APPROVED" }));

    const request = PENDING_REQUESTS.find((req) => req.id === id);
    if (!request) return;

    const booking = createBookingFromRequest(request);
    if (!booking) return;

    setBookings((prev) => {
      if (prev.some((b) => b.id === booking.id)) {
        return prev;
      }
      return [...prev, booking];
    });
  };

  const handleDecline = (id: string) => {
    setRequestStatus((prev) => ({ ...prev, [id]: "DECLINED" }));
  };

  const handleUndoDecline = (id: string) => {
    setRequestStatus((prev) => ({ ...prev, [id]: "PENDING" }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <CalendarHeader
        title={title}
        onPrev={() => setWeekOffset((prev) => prev - 1)}
        onNext={() => setWeekOffset((prev) => prev + 1)}
        onToday={() => {
          setWeekOffset(0);
          setSelectedDayIndex(getTodayIndex());
        }}
      />

      {/* Layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        {/* Calendar */}
        <div className="xl:col-span-3">
          <div className="sm:hidden">
            <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                <button
                  type="button"
                  onClick={handlePrevDay}
                  className="rounded-lg px-2 py-1 text-slate-600 hover:bg-white"
                >
                  Prev
                </button>
                <span>
                  {selectedDate
                    ? selectedDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })
                    : title}
                </span>
                <button
                  type="button"
                  onClick={handleNextDay}
                  className="rounded-lg px-2 py-1 text-slate-600 hover:bg-white"
                >
                  Next
                </button>
              </div>

              <p className="mt-3 text-xs font-semibold text-slate-500">
                Select day
              </p>
              <div className="mt-2 grid grid-cols-7 gap-1">
                {weekDays.map((day, index) => {
                  const isActive = index === selectedDayIndex;
                  const dateLabel = weekDates[index]?.getDate();
                  return (
                    <button
                      key={`${day}-${index}`}
                      type="button"
                      onClick={() => setSelectedDayIndex(index)}
                      aria-pressed={isActive}
                      className={`rounded-lg px-2 py-2 text-[11px] font-semibold transition-colors ${
                        isActive
                          ? "bg-[#3FA69E] text-white shadow-sm"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <span className="block">{day}</span>
                      <span className="block text-[10px] opacity-80">
                        {dateLabel ?? ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <WeeklyCalendarGrid
              weekDates={selectedDate ? [selectedDate] : weekDates.slice(0, 1)}
              bookings={bookings}
            />
          </div>

          <div className="hidden sm:block">
            <WeeklyCalendarGrid weekDates={weekDates} bookings={bookings} />
          </div>
        </div>

        {/* Pending Requests */}
        <div className="xl:col-span-1">
          <PendingRequestsPanel
            requests={PENDING_REQUESTS}
            requestStatus={requestStatus}
            onApprove={handleApprove}
            onDecline={handleDecline}
            onUndoDecline={handleUndoDecline}
          />
        </div>
      </div>
    </div>
  );
}

function getWeekTitle(offset: number) {
  const start = new Date();
  start.setDate(start.getDate() + offset * 7);

  const monday = new Date(start);
  const day = monday.getDay();
  const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
  monday.setDate(diff);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const startLabel = monday.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const endLabel = sunday.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${startLabel} - ${endLabel}`;
}

function getTodayIndex() {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

function getWeekDates(offset: number) {
  const start = new Date();
  start.setDate(start.getDate() + offset * 7);

  const monday = new Date(start);
  const day = monday.getDay();
  const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
  monday.setDate(diff);

  const dates: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d);
  }

  return dates;
}

function createBookingFromRequest(request: BookingRequest): Booking | null {
  const range = parseTimeRange(request.requestedTime);
  if (!range) return null;

  return {
    id: `BK-${request.id}`,
    clientName: request.clientName,
    space: request.space,
    startTime: `${request.requestedDate}T${range.start}`,
    endTime: `${request.requestedDate}T${range.end}`,
    status: "CONFIRMED",
  };
}

function parseTimeRange(range: string) {
  const parts = range.split("-").map((part) => part.trim());
  if (parts.length !== 2) return null;

  const start = parseTime(parts[0]);
  const end = parseTime(parts[1]);

  if (!start || !end) return null;

  return { start, end };
}

function parseTime(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  const hour = parseInt(match[1], 10);
  const minute = match[2];
  const period = match[3].toUpperCase();

  let hours24 = hour % 12;
  if (period === "PM") {
    hours24 += 12;
  }

  const hoursLabel = String(hours24).padStart(2, "0");
  return `${hoursLabel}:${minute}:00`;
}
