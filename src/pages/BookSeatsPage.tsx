import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeatMap } from "@/components/booking/SeatMap";
import { SeatSelector } from "@/components/booking/SeatSelector";
import { useAuth } from "@/contexts/AuthContext";
import { getCoworkingSpaceById } from "@/services/coworkingSpace.service";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { API_CONFIG, API_ENDPOINTS } from "@/config/api.config";

const BookSeatsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [spaceDetails, setSpaceDetails] = useState<any>(null);
  const [layout, setLayout] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<
    { id: string; number: string }[]
  >([]);
  const [isHolding, setIsHolding] = useState(false);
  const [holdData, setHoldData] = useState<any>(null);

  // KYC status
  const [isKycChecking, setIsKycChecking] = useState(false);
  const [isKycVerified, setIsKycVerified] = useState(false);
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  useEffect(() => {
    let isMounted = true;
    const checkKycStatus = async () => {
      if (!isAuthenticated || !user || isAdmin) {
        if (isMounted) {
          setIsKycChecking(false);
          setIsKycVerified(isAdmin);
        }
        return;
      }
      setIsKycChecking(true);
      try {
        if (user.kycVerified) {
          if (isMounted) setIsKycVerified(true);
          return;
        }
        const res = await axios.get(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.USER.KYC}`, { withCredentials: true });
        if (res.data.success && res.data.data) {
          const profiles = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
          const verified = profiles.some((p: any) =>
            (p.overallStatus || p.status || "").toLowerCase().trim() === "approved" ||
            (p.overallStatus || p.status || "").toLowerCase().trim() === "verified"
          );
          if (isMounted) setIsKycVerified(verified);
        }
      } catch (err) {
        console.error("KYC check failed", err);
      } finally {
        if (isMounted) setIsKycChecking(false);
      }
    };
    checkKycStatus();
    return () => { isMounted = false; };
  }, [isAuthenticated, user, user?.kycVerified, isAdmin]);


  // Get requested desk count from query parameters
  const requestedDesks = parseInt(searchParams.get("desks") || "1");
  const requestedDateParam = searchParams.get("date");

  const defaultStartTime = requestedDateParam
    ? new Date(requestedDateParam)
    : new Date();
  const defaultEndTime = new Date(defaultStartTime);
  defaultEndTime.setMonth(defaultEndTime.getMonth() + 1); // default 1 month

  const [schedule, setSchedule] = useState({
    start: defaultStartTime.toISOString().split("T")[0],
    end: defaultEndTime.toISOString().split("T")[0],
  });

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      if (!id) return;
      setIsKycChecking(true);
      setLoading(true);
      try {
        // If user object already has the flag, use it first
        if (isAuthenticated && user?.kycVerified) {
          if (isMounted) setIsKycVerified(true);
        } else if (isAuthenticated && !isAdmin) {
          const res = await userDashboardService.getKYC();
          const profiles = Array.isArray(res.data) ? res.data : [res.data];
          const verified = profiles.some((p: any) =>
            (p.overallStatus || p.status || "").toLowerCase().trim() === "approved" ||
            (p.overallStatus || p.status || "").toLowerCase().trim() === "verified"
          );
          if (isMounted) setIsKycVerified(verified);
        } else if (isAdmin) {
          if (isMounted) setIsKycVerified(true);
        }

        const space = await getCoworkingSpaceById(id);
        setSpaceDetails(space);
        await loadSeats(schedule.start, schedule.end);
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Failed to load space",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id]);

  const loadSeats = async (startStr: string, endStr: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      // For availability, could technically be public, but let's assume standard Axios call
      const res = await axios.get(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.USER.SEAT_BOOKING_AVAILABILITY(id!, new Date(startStr).toISOString(), new Date(endStr).toISOString())}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        },
      );
      if ((res.data as any).success) {
        setLayout((res.data as any).data.floors);
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description:
          (err.response as any)?.data?.message ||
          err.message ||
          "Could not load seat map",
        variant: "destructive",
      });
    }
  };

  const handleSeatToggle = (seatId: string, seatNumber: string) => {
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.id === seatId);
      if (exists) return prev.filter((s) => s.id !== seatId);
      // Optional: limit to requested desks
      if (prev.length >= requestedDesks) {
        toast({
          title: "Notice",
          description: `You have already selected ${requestedDesks} desks. Unselect one to choose another.`,
        });
        return prev;
      }
      return [...prev, { id: seatId, number: seatNumber }];
    });
  };

  const handleHoldRequest = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to reserve seats",
        variant: "destructive",
      });
      return navigate(
        `/login?redirect=/book-seats/${id}?desks=${requestedDesks}&date=${schedule.start}`,
      );
    }

    if (!isAdmin && !isKycVerified) {
      toast({
        title: "Complete your KYC",
        description: "Please complete your KYC from Profile & KYC to reserve seats.",
        variant: "destructive",
      });
      return navigate("/dashboard/profile");
    }

    if (selectedSeats.length === 0) return;


    try {
      setIsHolding(true);
      const token = localStorage.getItem("accessToken");
      const payload = {
        spaceId: id,
        seatIds: selectedSeats.map((s) => s.id),
        startTime: new Date(schedule.start).toISOString(),
        endTime: new Date(schedule.end).toISOString(),
      };

      const res = await axios.post(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.USER.SEAT_BOOKING_HOLD}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      if ((res.data as any).success) {
        const newHold = (res.data as any).data;
        setHoldData(newHold);
        toast({
          title: "Seats Reserved! ✅",
          description: "You have 10 minutes to complete checkout.",
        });

        // Navigate to booking checkout page and pass holdId
        navigate(
          `/booking/${id}?type=coworking&holdId=${newHold._id}&desks=${selectedSeats.length}&start=${schedule.start}`,
        );
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Hold Failed",
        description:
          err.response?.data?.message ||
          err.message ||
          "Failed to hold seats. They may have just been booked.",
        variant: "destructive",
      });
      // Refresh layout to see newly booked seats
      await loadSeats(schedule.start, schedule.end);
    } finally {
      setIsHolding(false);
    }
  };

  const handleDateChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "start" | "end",
  ) => {
    const newSchedule = { ...schedule, [field]: e.target.value };
    setSchedule(newSchedule);
    setSelectedSeats([]); // Clear selections on date change
    await loadSeats(newSchedule.start, newSchedule.end);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-20">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Navigation */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Space details
          </button>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column: Config and Map */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold font-geist mb-2">
                  Book Seats at {spaceDetails?.name}
                </h1>
                <p className="text-gray-500 text-sm mb-6 flex items-center">
                  <span className="font-semibold mr-1">Target Desks:</span>{" "}
                  {requestedDesks}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={schedule.start}
                      onChange={(e) => handleDateChange(e, "start")}
                      className="w-full border rounded-md p-2 outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={schedule.end}
                      onChange={(e) => handleDateChange(e, "end")}
                      className="w-full border rounded-md p-2 outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <SeatMap
                layout={layout}
                onSeatToggle={handleSeatToggle}
                selectedSeats={selectedSeats.map((s) => s.id)}
              />
            </div>

            {/* Right Column: Summary */}
            <div className="w-full md:w-80">
              <SeatSelector
                selectedSeats={selectedSeats}
                onHoldRequest={handleHoldRequest}
                isHolding={isHolding}
                holdExpiresAt={holdData?.holdExpiresAt}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookSeatsPage;
