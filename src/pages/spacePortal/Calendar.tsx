import { useState } from "react";
import CalendarHeader from "@/components/SpacePartner/calendar/CalendarHeader";
import WeeklyCalendarGrid from "@/components/SpacePartner/calendar/WeeklyCalendarGrid";
import PendingRequestsPanel from "@/components/SpacePartner/calendar/PendingRequestPanel";

import { BOOKINGS, PENDING_REQUESTS } from "@/data/spacePortal/bookings";

export default function BookingCalendar() {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekDays = getWeekDays(weekOffset);
  const title = getWeekTitle(weekOffset);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <CalendarHeader
        title={title}
        onPrev={() => setWeekOffset((prev) => prev - 1)}
        onNext={() => setWeekOffset((prev) => prev + 1)}
        onToday={() => setWeekOffset(0)}
      />

      {/* Layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        {/* Calendar */}
        <div className="xl:col-span-3">
          <WeeklyCalendarGrid weekDays={weekDays} bookings={BOOKINGS} />
        </div>

        {/* Pending Requests */}
        <div className="xl:col-span-1">
          <PendingRequestsPanel requests={PENDING_REQUESTS} />
        </div>
      </div>
    </div>
  );
}

function getWeekDays(offset: number) {
  const start = new Date();
  start.setDate(start.getDate() + offset * 7);

  const monday = new Date(start);
  const day = monday.getDay();
  const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
  monday.setDate(diff);

  const days: string[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    days.push(d.toLocaleDateString("en-US", { weekday: "short" }));
  }

  return days;
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
