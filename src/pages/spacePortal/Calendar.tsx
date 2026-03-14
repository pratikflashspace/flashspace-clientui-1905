import { useMemo, useState, useEffect } from "react";
import { Building2, CalendarDays, MapPin, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  addMonths,
  addYears,
  subMonths,
  subYears,
  format,
  startOfMonth,
  endOfMonth,
  addDays,
  subDays,
} from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchPartnerSpaces,
  fetchSpaceBookings,
  fetchPartnerVirtualOffices,
  fetchScheduledCalls,
  fetchAllPartnerSpaces,
  fetchPartnerMeetingRooms,
} from "@/services/spacePortal/spacePartner.service";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    Object.fromEntries(PENDING_REQUESTS.map((req) => [req.id, "PENDING"])),
  );

  // --- NEW STATE for Property Selection & View Mode ---
  const [propertyType, setPropertyType] = useState<
    "COWORKING" | "VIRTUAL_OFFICE" | "DAY_PASS" | "MEETING_ROOM"
  >("COWORKING");
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [viewMode, setViewMode] = useState<"YEAR" | "MONTH" | "MONTH_DATES">(
    "MONTH_DATES",
  );

  // Fetch Properties on Mount and when Category changes (Optimized to call specific API)
  useEffect(() => {
    const loadProperties = async () => {
      // Wait for auth check to complete
      if (!isAuthenticated) return;

      try {
        let rawData: any;
        let defaultType = "";

        // Only call the required API based on propertyType
        switch (propertyType) {
          case "COWORKING":
          case "DAY_PASS":
            rawData = await fetchPartnerSpaces();
            rawData = Array.isArray(rawData) ? rawData : (rawData?.spaces || rawData?.data || rawData || []);
            defaultType = propertyType === "COWORKING" ? "Coworking Space" : "Hot Desk";
            break;
          case "VIRTUAL_OFFICE":
            rawData = await fetchPartnerVirtualOffices();
            rawData = Array.isArray(rawData) ? rawData : (rawData?.offices || rawData?.data || rawData || []);
            defaultType = "Virtual Office";
            break;
          case "MEETING_ROOM":
            rawData = await fetchPartnerMeetingRooms().catch(() => []);
            rawData = Array.isArray(rawData) ? rawData : (rawData?.rooms || rawData?.data || rawData || []);
            defaultType = "Meeting Room";
            break;
          default:
            rawData = [];
        }

        const processed = (Array.isArray(rawData) ? rawData : []).map((p: any) => ({
          ...p,
          type: p.type || defaultType
        }));
        
        setProperties(processed);
      } catch (error) {
        console.error("Failed to fetch properties", error);
        setProperties([]);
      }
    };
    loadProperties();
  }, [isAuthenticated, propertyType]); // Re-fetch when category changes as requested

  // Filter properties based on selected type
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const type = p.type?.toLowerCase() || "";
      if (propertyType === "COWORKING")
        return (
          type.includes("coworking") ||
          type.includes("desk") ||
          type.includes("office") ||
          type.includes("shared") ||
          type.includes("dedicated")
        );
      if (propertyType === "VIRTUAL_OFFICE") return true; 
      if (propertyType === "MEETING_ROOM") return true;
      if (propertyType === "DAY_PASS") return type.includes("hot") || type.includes("pass") || type.includes("day");
      return true;
    });
  }, [properties, propertyType]);

  // Select first property when filtered list changes if current selection is invalid
  useEffect(() => {
    if (filteredProperties.length > 0) {
      const currentExists = filteredProperties.find(
        (p) => p._id === selectedPropertyId,
      );
      if (!currentExists) {
        setSelectedPropertyId(filteredProperties[0]._id);
      }
    } else {
      setSelectedPropertyId("");
    }
  }, [filteredProperties]);

  // Fetch Bookings when Property Selection or Date Changes
  useEffect(() => {
    const loadBookings = async () => {
      if (!isAuthenticated) return;

      if (!selectedPropertyId) return;

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
          const month =
            viewMode === "YEAR" ? undefined : currentDate.getMonth() + 1;

          const fetchedBookings = await fetchSpaceBookings(
            null,
            selectedPropertyId,
            month,
            year,
          );
          mappedBookings = fetchedBookings.map((b: any) => ({
            id: b._id,
            clientName: b.user?.fullName || "Unknown Client",
            space: b.spaceSnapshot?.name || "Unknown Space",
            startTime: b.startDate || b.createdAt,
            endTime: b.endDate || b.createdAt,
            status:
              b.status === "active" || b.status === "approved"
                ? "CONFIRMED"
                : b.status === "pending_kyc"
                  ? "PENDING_KYC"
                  : b.status === "pending_payment"
                    ? "PENDING_PAYMENT"
                    : b.status === "pending"
                      ? "PENDING"
                      : "CANCELLED",
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
  }, [
    selectedPropertyId,
    isAuthenticated,
    currentDate,
    propertyType,
    viewMode,
  ]);

  // --- Navigation Logic ---
  const handlePrev = () => {
    if (
      propertyType === "MEETING_ROOM" &&
      (viewMode === "MONTH_DATES" || viewMode === "YEAR")
    ) {
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
    if (
      propertyType === "MEETING_ROOM" &&
      (viewMode === "MONTH_DATES" || viewMode === "YEAR")
    ) {
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
    // Logic for approving from backend should be added here
    console.log("Approving", id);
  };

  /**
   * Decline request:
   */
  const handleDecline = (id: string) => {
    console.log("Declining", id);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {/* Property Selection & View Mode Controls */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-end bg-background border border-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full -ml-12 -mb-12 blur-2xl" />

        <div className="w-full lg:flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-[#2D3F33] uppercase tracking-widest">Asset Category</h3>
            </div>
            <Select value={propertyType} onValueChange={(val: any) => setPropertyType(val)}>
              <SelectTrigger className="w-full h-12 rounded-2xl bg-muted/30 border-border/50 font-bold focus:ring-primary/20 transition-all">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border/50 shadow-2xl">
                <SelectItem value="COWORKING" className="font-bold py-3 px-4 focus:bg-primary/10 rounded-xl">Coworking Space</SelectItem>
                <SelectItem value="VIRTUAL_OFFICE" className="font-bold py-3 px-4 focus:bg-primary/10 rounded-xl">Virtual Office</SelectItem>
                <SelectItem value="DAY_PASS" className="font-bold py-3 px-4 focus:bg-primary/10 rounded-xl">Day Pass (Meeting Rooms)</SelectItem>
                <SelectItem value="MEETING_ROOM" className="font-bold py-3 px-4 focus:bg-primary/10 rounded-xl">Meeting Room</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#3FA69E]/10 text-[#3FA69E]">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-extrabold text-[#2D3F33] uppercase tracking-widest">Select Location</h3>
            </div>
            <Select 
              value={selectedPropertyId} 
              onValueChange={setSelectedPropertyId}
            >
              <SelectTrigger className="w-full h-12 rounded-2xl bg-muted/30 border-border/50 font-bold focus:ring-[#3FA69E]/20 transition-all">
                <SelectValue placeholder="Choose property..." />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border/50 shadow-2xl max-h-[300px]">
                {filteredProperties.map((p) => (
                  <SelectItem 
                    key={p._id} 
                    value={p._id} 
                    className="font-bold py-3 px-4 focus:bg-[#3FA69E]/10 rounded-xl"
                  >
                    <div className="flex flex-col items-start">
                      <span>{p.name}</span>
                      <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[200px]">{p.address}</span>
                    </div>
                  </SelectItem>
                ))}
                {filteredProperties.length === 0 && (
                  <div className="p-4 text-center text-xs font-bold text-muted-foreground italic">
                    No results found
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="w-full lg:w-auto space-y-3 relative z-10">
          <div className="flex items-center gap-2 lg:justify-end">
            <h3 className="text-xs font-extrabold text-[#2D3F33] uppercase tracking-widest">View Mode</h3>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-1 bg-muted/50 p-1.5 rounded-2xl border border-border/50">
            {propertyType !== "MEETING_ROOM" && (
              <button
                onClick={() => setViewMode("YEAR")}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                  viewMode === "YEAR" ? "bg-white text-primary shadow-sm ring-1 ring-border/5" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Year
              </button>
            )}
            <button
              onClick={() => setViewMode("MONTH")}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === "MONTH" ? "bg-white text-primary shadow-sm ring-1 ring-border/5" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("MONTH_DATES")}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === "MONTH_DATES" ? "bg-white text-primary shadow-sm ring-1 ring-border/5" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Navigation & View Header */}
      <div className="bg-background border border-border rounded-2xl shadow-sm overflow-hidden">
        <CalendarHeader
          title={title}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
        />
        
        {/* Calendar Content Area */}
        <div className="p-1 sm:p-2 bg-muted/40 min-h-[500px]">
          {isLoadingBookings ? (
            <div className="flex flex-col items-center justify-center h-[500px]">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Updating Schedules...</p>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
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
                    <MonthDatesView currentDate={currentDate} bookings={bookings} />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
