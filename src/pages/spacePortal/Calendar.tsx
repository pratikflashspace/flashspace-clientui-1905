import { useMemo, useState, useEffect } from "react";
import { addMonths, addYears, subMonths, subYears, format, startOfMonth, endOfMonth, addDays, subDays } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { fetchPartnerSpaces, fetchSpaceBookings, fetchPartnerVirtualOffices, fetchScheduledCalls } from "@/services/spacePortal/spacePartner.service";

import CalendarHeader from "@/components/SpacePartner/calendar/CalendarHeader";
import WeeklyCalendarGrid from "@/components/SpacePartner/calendar/WeeklyCalendarGrid";
import PendingRequestsPanel from "@/components/SpacePartner/calendar/PendingRequestPanel";
import YearView from "@/components/SpacePartner/calendar/YearView";
import MonthView from "@/components/SpacePartner/calendar/MonthView";
import MonthDatesView from "@/components/SpacePartner/calendar/MonthDatesView";
import MeetingDayView from "@/components/SpacePartner/calendar/MeetingDayView";
import MeetingMonthView from "@/components/SpacePartner/calendar/MeetingMonthView";

import { PENDING_REQUESTS } from "@/data/spacePortal/bookings";
import type { Booking, BookingRequest } from "@/types/spacePortal/booking";

/**
 * BookingCalendar Page
 *
 * Features:
 * - Three Views: Year, Month, Month Dates (List)
 * - Property Type & Property Selection
 * - Pending Requests Panel
 */
export default function BookingCalendar() {
  const { user, isAuthenticated } = useAuth();
  
  // --- View State ---
  const [currentDate, setCurrentDate] = useState(new Date());
  
  /**
   * bookings state holds confirmed bookings shown on calendar
   */
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  /**
   * Tracks approval/decline state of each pending request
   */
  const [requestStatus, setRequestStatus] = useState<
    Record<string, "PENDING" | "APPROVED" | "DECLINED">
  >(() =>
    Object.fromEntries(PENDING_REQUESTS.map((req) => [req.id, "PENDING"]))
  );

  // --- NEW STATE for Property Selection & View Mode ---
  const [propertyType, setPropertyType] = useState<"COWORKING" | "VIRTUAL_OFFICE" | "DAY_PASS" | "MEETING_ROOM">("COWORKING");
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [viewMode, setViewMode] = useState<"YEAR" | "MONTH" | "MONTH_DATES">("MONTH_DATES");

  // Fetch Properties on Mount
  useEffect(() => {
    const loadProperties = async () => {
      // Wait for auth check to complete
      if (!isAuthenticated) return; 

      try {
        const [coworkingSpaces, virtualOffices] = await Promise.all([
            fetchPartnerSpaces(),
            fetchPartnerVirtualOffices()
        ]);
        
        const allProperties = [...(coworkingSpaces || []), ...(virtualOffices || [])];
        setProperties(allProperties);
        
        // Select first property of current type if available
        if (allProperties.length > 0) {
            const firstMatching = allProperties.find((p: any) => 
               p.type === (propertyType === "COWORKING" ? "Coworking Space" : 
                           propertyType === "VIRTUAL_OFFICE" ? "Virtual Office" :
                           propertyType === "MEETING_ROOM" ? "Meeting Room" : "Hot Desk")
            );
            if (firstMatching) setSelectedPropertyId(firstMatching._id);
        }
      } catch (error) {
        console.error("Failed to fetch properties", error);
      }
    };
    loadProperties();
  }, [isAuthenticated]); // Only load on auth change, not propertyType change (filtering handles that)

  // Filter properties based on selected type
  const filteredProperties = useMemo(() => {
      // Mapping frontend type to backend type strings if needed. 
      // Backend types assumed: "Coworking Space", "Virtual Office", "Meeting Room", "Hot Desk"
      // Adjust this mapping based on actual backend data
      return properties.filter(p => {
          if (propertyType === "COWORKING") return p.type === "Coworking Space" || p.type === "Shared Desk" || p.type === "Dedicated Desk" || p.type === "Private Office";
          if (propertyType === "VIRTUAL_OFFICE") return p.type === "Virtual Office";
          if (propertyType === "MEETING_ROOM") return p.type === "Meeting Room";
          if (propertyType === "DAY_PASS") return p.type === "Hot Desk"; // Assumption
          return true;
      });
  }, [properties, propertyType]);

  // Select first property when filtered list changes if current selection is invalid
  useEffect(() => {
      if (filteredProperties.length > 0) {
          const currentExists = filteredProperties.find(p => p._id === selectedPropertyId);
          if (!currentExists) {
              setSelectedPropertyId(filteredProperties[0]._id);
          }
      } else {
          setSelectedPropertyId("");
      }
  }, [filteredProperties, selectedPropertyId]);

  // Fetch Bookings when Property Selection or Date Changes
  useEffect(() => {
    const loadBookings = async () => {
      if (!isAuthenticated) return;
      
      if (propertyType !== "MEETING_ROOM" && !selectedPropertyId) return;

      setIsLoadingBookings(true);
      try {
        let mappedBookings = [];

        if (propertyType === "MEETING_ROOM") {
           // Determine date range based on View Mode
           let start, end;
           
           if (viewMode === "MONTH") {
               // Month View: Fetch whole month
               start = startOfMonth(currentDate).toISOString();
               end = endOfMonth(currentDate).toISOString();
           } else {
               // Day View (MONTH_DATES): Fetch single day (start of day to end of day)
               // Using user's logic or a cleaner approach:
               // The API expects ISO strings. 
               // currentDate is the day.
               // Let's ensure time is set to 00:00:00 for start and 23:59:59 for end or just next day.
               const startDate = new Date(currentDate);
               startDate.setHours(0, 0, 0, 0);
               start = startDate.toISOString();

               const endDate = new Date(currentDate);
               endDate.setHours(23, 59, 59, 999);
               end = endDate.toISOString();
           }

           const meetings = await fetchScheduledCalls(start, end);
           mappedBookings = meetings;
        } else {
            const year = currentDate.getFullYear();
            const month = viewMode === "YEAR" ? undefined : currentDate.getMonth() + 1;

            const fetchedBookings = await fetchSpaceBookings(null, selectedPropertyId, month, year);
            mappedBookings = fetchedBookings.map((b: any) => ({
                id: b._id,
                clientName: b.user?.fullName || "Unknown Client",
                space: b.spaceSnapshot?.name || "Unknown Space",
                startTime: b.startDate || b.createdAt,
                endTime: b.endDate || b.createdAt,
                status: (b.status === "active" || b.status === "approved") ? "CONFIRMED" : 
                        b.status === "pending_kyc" ? "PENDING_KYC" :
                        b.status === "pending_payment" ? "PENDING_PAYMENT" :
                        b.status === "pending" ? "PENDING" : 
                        "CANCELLED"
            }));
        }
        setBookings(mappedBookings);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setIsLoadingBookings(false);
      }
    };
    loadBookings();
  }, [selectedPropertyId, isAuthenticated, currentDate, propertyType, viewMode]);

  // --- Navigation Logic ---
  const handlePrev = () => {
    if (propertyType === "MEETING_ROOM" && (viewMode === "MONTH_DATES" || viewMode === "YEAR")) {
        // Meeting Room + Day View -> Go back 1 day
        setCurrentDate(subDays(currentDate, 1));
        return;
    }

    if (viewMode === "YEAR") {
      setCurrentDate(subYears(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (propertyType === "MEETING_ROOM" && (viewMode === "MONTH_DATES" || viewMode === "YEAR")) {
        // Meeting Room + Day View -> Go forward 1 day
        setCurrentDate(addDays(currentDate, 1));
        // console.log("Meeting Room + Day View -> Go forward 1 day", currentDate);
        return;
    }

    if (viewMode === "YEAR") {
      setCurrentDate(addYears(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };
  
  const handleMonthClick = (monthIndex: number) => {
      const newDate = new Date(currentDate);
      newDate.setMonth(monthIndex);
      setCurrentDate(newDate);
      setViewMode("MONTH");
  };

  const handleDateClick = (date: Date) => {
      setCurrentDate(date);
      setViewMode("MONTH_DATES");
  };

  // --- Title Logic ---
  const title = useMemo(() => {
    if (viewMode === "YEAR") {
      return format(currentDate, "yyyy");
    }
    return format(currentDate, "MMMM yyyy");
  }, [currentDate, viewMode]);


  /**
   * Approve a booking request:
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
   */
  const handleDecline = (id: string) => {
    setRequestStatus((prev) => ({ ...prev, [id]: "DECLINED" }));
  };

  /**
   * Undo decline:
   */
  const handleUndoDecline = (id: string) => {
    setRequestStatus((prev) => ({ ...prev, [id]: "PENDING" }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* --- Property Type Selector --- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative inline-block w-full sm:w-64">
              <label htmlFor="propertyType" className="mb-1 block text-sm font-medium text-slate-700">Property Type</label>
              <select
                  id="propertyType"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as any)}
                  className="block w-full rounded-xl border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm focus:border-[#3FA69E] focus:ring-[#3FA69E]"
              >
                  <option value="COWORKING">Coworking Space</option>
                  <option value="VIRTUAL_OFFICE">Virtual Office</option>
                  <option value="DAY_PASS">Day Pass (Meeting Rooms)</option>
                  <option value="MEETING_ROOM">Meeting Room</option>
              </select>
          </div>

          {/* --- View Mode Selector --- */}
           <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              {propertyType !== "MEETING_ROOM" && (
                <button
                    onClick={() => setViewMode("YEAR")}
                    className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${viewMode === "YEAR" ? "bg-[#3FA69E] text-white" : "text-slate-600 hover:bg-slate-50"}`}
                >
                    Year
                </button>
              )}
              <button
                  onClick={() => setViewMode("MONTH")}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${viewMode === "MONTH" ? "bg-[#3FA69E] text-white" : "text-slate-600 hover:bg-slate-50"}`}
              >
                  Months
              </button>
              <button
                  onClick={() => setViewMode("MONTH_DATES")}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${viewMode === "MONTH_DATES" ? "bg-[#3FA69E] text-white" : "text-slate-600 hover:bg-slate-50"}`}
              >
                  {propertyType === "MEETING_ROOM" ? "Day View" : "Dates"}
              </button>
          </div>
      </div>

      {/* --- Horizontal Property List --- */}
      {propertyType !== "MEETING_ROOM" && (
        <div className="no-scrollbar flex w-full gap-4 overflow-x-auto pb-2">
            {filteredProperties.map((property) => (
                <button
                    key={property._id}
                    onClick={() => setSelectedPropertyId(property._id)}
                    className={`w-[280px] h-[150px] shrink-0 overflow-hidden rounded-2xl border p-4 text-left transition-all flex flex-col justify-between ${
                        selectedPropertyId === property._id
                            ? "border-[#3FA69E] bg-[#3FA69E]/5 shadow-md ring-1 ring-[#3FA69E]"
                            : "border-slate-200 bg-white hover:border-[#3FA69E]/50 hover:shadow-sm"
                    }`}
                >
                    <div className="w-full">
                        <h3 className={`font-bold truncate text-sm mb-1 ${selectedPropertyId === property._id ? "text-[#3FA69E]" : "text-slate-800"}`} title={property.name}>
                            {property.name}
                        </h3>
                        <p className="line-clamp-3 text-xs text-slate-500 leading-relaxed" title={property.address}>
                            {property.address}
                        </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold truncate max-w-full ${selectedPropertyId === property._id ? "bg-[#3FA69E]/10 text-[#3FA69E]" : "bg-slate-100 text-slate-600"}`}>
                            {property.type}
                        </span>
                    </div>
                </button>
            ))}
            {filteredProperties.length === 0 && (
                <div className="flex h-24 w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-500">
                    No properties found for this type.
                </div>
            )}
        </div>
      )}


      {/* Header */}
      <CalendarHeader
        title={title}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
      />

      {/* Main Layout */}
      <div className="w-full">
        {/* Calendar View Area */}
        <div className="w-full">
            {propertyType === "MEETING_ROOM" ? (
                <>
                    {viewMode === "MONTH" && (
                        <MeetingMonthView 
                            currentDate={currentDate} 
                            meetings={bookings as any[]}
                            onDateClick={handleDateClick}
                        />
                    )}
                    {(viewMode === "MONTH_DATES" || viewMode === "YEAR") && ( 
                        <MeetingDayView 
                            currentDate={currentDate} 
                            meetings={bookings as any[]}
                        />
                    )}
                </>
            ) : (
                <>
                    {viewMode === "YEAR" && (
                        <YearView 
                            year={currentDate.getFullYear()} 
                            bookings={bookings} 
                            onMonthClick={handleMonthClick} 
                        />
                    )}
                    
                    {viewMode === "MONTH" && (
                        <MonthView 
                            currentDate={currentDate} 
                            bookings={bookings}
                            onDateClick={handleDateClick}
                        />
                    )}
                    
                    {viewMode === "MONTH_DATES" && (
                        <MonthDatesView 
                            currentDate={currentDate} 
                            bookings={bookings} 
                        />
                    )}
                </>
            )}
        </div>
      </div>
    </div>
  );
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
