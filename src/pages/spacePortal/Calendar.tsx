import { useMemo, useState } from "react";

import CalendarHeader from "@/components/SpacePartner/calendar/CalendarHeader";
import WeeklyCalendarGrid from "@/components/SpacePartner/calendar/WeeklyCalendarGrid";
import PendingRequestsPanel from "@/components/SpacePartner/calendar/PendingRequestPanel";

import { BOOKINGS, PENDING_REQUESTS } from "@/data/spacePortal/bookings";
import type { Booking, BookingRequest } from "@/types/spacePortal/booking";

/**
 * BookingCalendar Page
 *
 * Features:
 * - Weekly calendar view (desktop)
 * - Single-day view with day selector (mobile)
 * - Pending booking requests approval/decline
 *
 * Currently uses mock data (BOOKINGS, PENDING_REQUESTS)
 * Later backend will replace this with API calls.
 */
export default function BookingCalendar() {
  /**
   * weekOffset = 0 means current week
   * weekOffset = 1 means next week
   * weekOffset = -1 means previous week
   */
  const [weekOffset, setWeekOffset] = useState(0);

  /**
   * selectedDayIndex = 0-6 (Monday-Sunday)
   * used mainly for mobile view.
   */
  const [selectedDayIndex, setSelectedDayIndex] = useState(getTodayIndex());

  /**
   * bookings state holds confirmed bookings shown on calendar
   * currently loaded from mock data.
   */
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);

  /**
   * Tracks approval/decline state of each pending request
   * Example:
   * {
   *   "REQ-1": "APPROVED",
   *   "REQ-2": "DECLINED"
   * }
   */
  const [requestStatus, setRequestStatus] = useState<
    Record<string, "PENDING" | "APPROVED" | "DECLINED">
  >(() =>
    Object.fromEntries(PENDING_REQUESTS.map((req) => [req.id, "PENDING"]))
  );

  /**
   * Generate week dates + week title based on offset
   * Using useMemo to avoid recalculating every render.
   */
  const { weekDates, title } = useMemo(() => {
    const weekDates = getWeekDates(weekOffset);
    const title = getWeekTitleFromDates(weekDates);

    return { weekDates, title };
  }, [weekOffset]);

  /**
   * Week day labels like: Mon, Tue, Wed...
   */
  const weekDays = useMemo(() => {
    return weekDates.map((date) =>
      date.toLocaleDateString("en-US", { weekday: "short" })
    );
  }, [weekDates]);

  /**
   * Selected date for mobile calendar view.
   * If index is invalid, fallback to first day.
   */
  const selectedDate = weekDates[selectedDayIndex] ?? weekDates[0];

  /**
   * Go to previous day (mobile view)
   * If already Monday -> move to previous week Sunday.
   */
  const handlePrevDay = () => {
    setSelectedDayIndex((prev) => {
      if (prev === 0) {
        setWeekOffset((offset) => offset - 1);
        return 6;
      }
      return prev - 1;
    });
  };

  /**
   * Go to next day (mobile view)
   * If already Sunday -> move to next week Monday.
   */
  const handleNextDay = () => {
    setSelectedDayIndex((prev) => {
      if (prev === 6) {
        setWeekOffset((offset) => offset + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  /**
   * Approve a booking request:
   * - mark requestStatus as APPROVED
   * - convert request into confirmed booking
   * - add booking to calendar list
   */
  const handleApprove = (id: string) => {
    setRequestStatus((prev) => ({ ...prev, [id]: "APPROVED" }));

    const request = PENDING_REQUESTS.find((req) => req.id === id);
    if (!request) return;

    const booking = createBookingFromRequest(request);
    if (!booking) return;

    // Prevent duplicates
    setBookings((prev) => {
      if (prev.some((b) => b.id === booking.id)) return prev;
      return [...prev, booking];
    });
  };

  /**
   * Decline request:
   * only updates requestStatus
   */
  const handleDecline = (id: string) => {
    setRequestStatus((prev) => ({ ...prev, [id]: "DECLINED" }));
  };

  /**
   * Undo decline:
   * request goes back to PENDING
   */
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

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        {/* Calendar */}
        <div className="xl:col-span-3">
          {/* Mobile View */}
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

            {/* Mobile shows only selected day */}
            <WeeklyCalendarGrid
              weekDates={selectedDate ? [selectedDate] : weekDates.slice(0, 1)}
              bookings={bookings}
            />
          </div>

          {/* Desktop View */}
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

/**
 * Returns current day index based on Monday start.
 * Monday = 0 ... Sunday = 6
 */
function getTodayIndex() {
  const day = new Date().getDay(); // 0=Sunday, 1=Monday...
  return day === 0 ? 6 : day - 1;
}

/**
 * Generates an array of 7 dates for the week based on offset.
 * Always starts from Monday.
 */
function getWeekDates(offset: number) {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + offset * 7);

  const monday = getMonday(baseDate);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

/**
 * Get Monday date for the given date.
 */
function getMonday(date: Date) {
  const monday = new Date(date);
  const day = monday.getDay(); // 0=Sunday
  const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
  monday.setDate(diff);
  return monday;
}

/**
 * Creates week title from week dates.
 * Example: "Feb 5 - Feb 11"
 */
function getWeekTitleFromDates(weekDates: Date[]) {
  const monday = weekDates[0];
  const sunday = weekDates[6];

  if (!monday || !sunday) return "";

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

/**
 * Converts BookingRequest into Booking object.
 * Used when request is approved.
 */
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

/**
 * Parses a time range like:
 * "10:00 AM - 12:00 PM"
 */
function parseTimeRange(range: string) {
  const parts = range.split("-").map((part) => part.trim());
  if (parts.length !== 2) return null;

  const start = parseTime(parts[0]);
  const end = parseTime(parts[1]);

  if (!start || !end) return null;

  return { start, end };
}

/**
 * Converts time string into 24-hour format with seconds.
 * Example: "2:30 PM" -> "14:30:00"
 */
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
