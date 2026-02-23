import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Shield,
  Clock,
  Star,
  Building2,
  Loader2,
  Tag,
  X,
  Percent,
  User,
  Mail,
  Phone,
  CreditCard,
  FileText,
  MapPin,
  Package,
  IndianRupee,
  CheckCircle2,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getVirtualOfficeById } from "@/services/virtualOffice.service";
import { VirtualOfficeItem } from "@/types/services";
import { getVirtualOfficePricing, PlanDetails } from "@/utils/priceUtils";
import { BookingPageSkeleton } from "@/components/ui/skeleton-loaders";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { validateCoupon, markCouponUsed } from "@/services/coupon.service";
import {
  createPaymentOrder,
  openRazorpayCheckout,
  verifyPayment,
  reportPaymentFailure,
  simulatePayment,
} from "@/services/payment.service";
import { API_CONFIG, API_ENDPOINTS } from "@/config/api.config";

// ============ STEP DEFINITIONS ============
const STEPS = [
  { id: 1, label: "Your Details", icon: User },
  { id: 2, label: "Plan & Tenure", icon: Package },
  { id: 3, label: "Review", icon: FileText },
  { id: 4, label: "Payment", icon: CreditCard },
];

const BookingPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planKeyId = searchParams.get("plan") || "gst";

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // WIZARD STATE
  const [currentStep, setCurrentStep] = useState(1);
  const [animating, setAnimating] = useState(false);

  // DATA STATE
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spaceDetails, setSpaceDetails] = useState<VirtualOfficeItem | null>(
    null,
  );
  const [selectedPlanDetails, setSelectedPlanDetails] =
    useState<PlanDetails | null>(null);
  const [selectedTenure, setSelectedTenure] = useState<1 | 2 | 3>(2);
  const [isDevMode] = useState(import.meta.env.DEV);

  // USER DETAILS FORM
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
  });

  // COUPON STATE
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountValue: number;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  // START DATE STATE
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const [selectedStartDate, setSelectedStartDate] = useState<string>(
    tomorrow.toISOString().split("T")[0],
  );

  // PRICING (for all plans)
  const [allPricing, setAllPricing] =
    useState<ReturnType<typeof getVirtualOfficePricing>>(null);
  const [selectedPlanKey, setSelectedPlanKey] = useState(planKeyId);

  // HOLD TIMER STATE (For Coworking Seats)
  const [holdTimeLeft, setHoldTimeLeft] = useState<number | null>(null);
  const [holdExpiresAt, setHoldExpiresAt] = useState<string | null>(null);
  const [holdFetchError, setHoldFetchError] = useState<boolean>(false);

  // Load user data from auth
  useEffect(() => {
    if (user) {
      setUserDetails((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || "",
        phone: (user as any).phoneNumber || "",
      }));
    }
  }, [user]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // Fetch Data from Backend
  useEffect(() => {
    if (!id) {
      setError("Invalid Booking ID");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const type = searchParams.get("type");

        if (type === "coworking") {
          const { getCoworkingSpaceById } =
            await import("@/services/coworkingSpace.service");
          const { parsePrice } = await import("@/utils/priceUtils");
          const data = await getCoworkingSpaceById(id);
          if (!data) {
            setError("Space not found");
          } else {
            setSpaceDetails(data as any);
            const desks = parseInt(searchParams.get("desks") || "1");
            const monthlyPrice =
              (data as any).pricePerMonth || parsePrice(data.price);
            const totalMonthly = monthlyPrice * desks;
            setSelectedPlanDetails({
              key: "coworking",
              name: `Coworking Desk (${desks} Desk${desks > 1 ? "s" : ""})`,
              monthlyPrice: totalMonthly,
              yearlyPrice: totalMonthly * 12,
              features: data.features || [
                "High Speed WiFi",
                "Unlimited Coffee",
                "Office Supplies",
              ],
            });
          }
        } else {
          const data = await getVirtualOfficeById(id);
          if (!data) {
            setError("Space not found");
          } else {
            setSpaceDetails(data);
            const pricing = getVirtualOfficePricing(data);
            setAllPricing(pricing);
            if (pricing && planKeyId in pricing) {
              setSelectedPlanDetails(
                pricing[planKeyId as keyof typeof pricing],
              );
            } else {
              setSelectedPlanDetails(pricing?.gst || null);
            }
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, planKeyId, searchParams]);

  // Update selected plan when user switches plans in step 2
  useEffect(() => {
    if (allPricing && selectedPlanKey in allPricing) {
      setSelectedPlanDetails(
        allPricing[selectedPlanKey as keyof typeof allPricing],
      );
    }
  }, [selectedPlanKey, allPricing]);

  // Fetch Hold Details for Timer
  useEffect(() => {
    const holdId = searchParams.get("holdId");
    const type = searchParams.get("type")?.toLowerCase();

    if (holdId && type === "coworking" && isAuthenticated) {
      const fetchHoldDetails = async () => {
        try {
          const token =
            localStorage.getItem("accessToken") ||
            localStorage.getItem("token");

          // Try fetching the specific booking directly first
          const response = await axios.get<any>(
            `${API_CONFIG.BASE_URL}/api/seat-bookings/${holdId}`,
            {
              headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              withCredentials: true,
            },
          );

          if (response.data?.success && response.data?.data?.holdExpiresAt) {
            setHoldExpiresAt(response.data.data.holdExpiresAt);
            setHoldFetchError(false);
          } else {
            console.warn("Direct hold fetch failed, trying list fallback...");

            // Fallback to user list if direct fetch failed (sometimes permissions vary)
            const listResponse = await axios.get<any>(
              `${API_CONFIG.BASE_URL}/api/seat-bookings/user`,
              {
                headers: {
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                withCredentials: true,
              },
            );

            if (listResponse.data?.success && listResponse.data?.data) {
              const activeBooking = listResponse.data.data.find(
                (b: any) => String(b._id) === String(holdId),
              );
              if (activeBooking?.holdExpiresAt) {
                setHoldExpiresAt(activeBooking.holdExpiresAt);
                setHoldFetchError(false);
              } else {
                setHoldFetchError(true);
              }
            } else {
              setHoldFetchError(true);
            }
          }
        } catch (err) {
          console.error("Failed to fetch hold details for timer", err);
          setHoldFetchError(true);
        }
      };
      fetchHoldDetails();
    } else if (holdId && type === "coworking" && !isAuthenticated) {
      // If not authenticated yet, we wait, but if it stays that way for too long, might be an issue
      console.log("Waiting for authentication for timer...");
    }
  }, [searchParams, isAuthenticated]);

  // Timer Countdown Logic
  useEffect(() => {
    if (!holdExpiresAt) return;

    const calculateTimeLeft = () => {
      const expiry = new Date(holdExpiresAt).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((expiry - now) / 1000));
      setHoldTimeLeft(diff);

      if (diff <= 0) {
        toast({
          title: "Session Expired",
          description:
            "Your seat hold has expired. Redirecting to space details...",
          variant: "destructive",
        });
        setTimeout(() => {
          // Redirect to property dashboard/details
          if (id) {
            navigate(`/coworking-space/${id}`);
          } else {
            navigate(-1);
          }
        }, 2000);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [holdExpiresAt, navigate, toast]);

  // ============ COUPON HANDLERS ============
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    if (!isAuthenticated || !user) {
      toast({
        title: "Login Required",
        description: "Please login to apply coupons",
        variant: "destructive",
      });
      navigate(`/login?redirect=/booking/${id}?plan=${planKeyId}`);
      return;
    }
    setCouponLoading(true);
    try {
      const result = await validateCoupon(couponCode);
      if (result.valid && result.data) {
        setAppliedCoupon({
          code: result.data.code,
          discountValue: result.data.discountValue,
        });
        toast({
          title: "Coupon Applied! 🎉",
          description: `You've saved ${result.data.discountValue}% on your booking!`,
        });
      } else {
        toast({
          title: "Invalid Coupon",
          description: result.message || "This coupon code is not valid.",
          variant: "destructive",
        });
        setAppliedCoupon(null);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to validate coupon.",
        variant: "destructive",
      });
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast({
      title: "Coupon Removed",
      description: "Discount has been removed.",
    });
  };

  // ============ STEP NAVIGATION ============
  const goNext = () => {
    if (currentStep >= 4) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      setAnimating(false);
    }, 300);
  };

  const goBack = () => {
    if (currentStep <= 1) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev - 1);
      setAnimating(false);
    }, 300);
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return (
        userDetails.fullName.trim() &&
        userDetails.email.trim() &&
        userDetails.phone.trim()
      );
    }
    return true;
  };

  // ============ PRICING CALCULATIONS ============
  const yearlyPrice = selectedPlanDetails?.yearlyPrice || 0;

  const tenureOptions = [
    {
      years: 1,
      label: "1 Year",
      totalPrice: yearlyPrice,
      savings: 0,
      savingsPercent: 0,
      popular: false,
    },
    {
      years: 2,
      label: "2 Years",
      totalPrice: Math.round(yearlyPrice * 2 * 0.9),
      savings: Math.round(yearlyPrice * 2 * 0.1),
      savingsPercent: 10,
      popular: true,
    },
    {
      years: 3,
      label: "3 Years",
      totalPrice: Math.round(yearlyPrice * 3 * 0.85),
      savings: Math.round(yearlyPrice * 3 * 0.15),
      savingsPercent: 15,
      popular: false,
    },
  ];

  const selectedOption = tenureOptions.find((t) => t.years === selectedTenure)!;
  const couponDiscountAmount = appliedCoupon
    ? Math.round(
        (selectedOption.totalPrice * appliedCoupon.discountValue) / 100,
      )
    : 0;
  const finalPayableAmount = selectedOption.totalPrice - couponDiscountAmount;

  // Compute end date from start date + tenure
  const computedEndDate = (() => {
    const start = new Date(selectedStartDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + selectedTenure * 12);
    return end.toISOString().split("T")[0];
  })();

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ============ PAYMENT HANDLERS ============
  const handleProceedToPayment = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Login Required",
        description: "Please login to continue with your booking",
        variant: "destructive",
      });
      navigate(`/login?redirect=/booking/${id}?plan=${planKeyId}`);
      return;
    }
    if (!spaceDetails || !selectedPlanDetails) return;

    try {
      setPaymentLoading(true);
      const orderData = await createPaymentOrder({
        userId: user.id,
        userEmail: user.email,
        userName: user.fullName || user.email.split("@")[0],
        userPhone: (user as any).phoneNumber,
        spaceId: spaceDetails._id,
        spaceName: spaceDetails.name,
        planName: selectedPlanDetails.name,
        planKey: selectedPlanKey,
        tenure: selectedTenure,
        yearlyPrice: yearlyPrice,
        totalAmount: finalPayableAmount,
        discountPercent:
          selectedOption.savingsPercent + (appliedCoupon?.discountValue || 0),
        discountAmount: selectedOption.savings + couponDiscountAmount,
        paymentType: searchParams.get("holdId")
          ? "seat_booking"
          : searchParams.get("type") === "coworking"
            ? "coworking_space"
            : "virtual_office",
        startDate: new Date(selectedStartDate).toISOString(),
        holdId: searchParams.get("holdId") || undefined,
      });

      await openRazorpayCheckout({
        orderId: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId: orderData.keyId,
        userEmail: user.email,
        userName: user.fullName || user.email.split("@")[0],
        userPhone: (user as any).phoneNumber,
        spaceName: spaceDetails.name,
        planName: selectedPlanDetails.name,
        onSuccess: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Confirm booking if holdId exists
            const holdId = searchParams.get("holdId");
            if (holdId) {
              try {
                const token =
                  localStorage.getItem("accessToken") ||
                  localStorage.getItem("token");
                await fetch(
                  `${API_CONFIG.BASE_URL}${API_ENDPOINTS.USER.SEAT_BOOKING_CONFIRM(holdId)}`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({
                      paymentId: response.razorpay_payment_id,
                    }),
                  },
                );
              } catch (e) {
                console.error("Booking confirmation failed", e);
              }
            }

            toast({
              title: "Payment Successful! 🎉",
              description: "Your booking has been confirmed",
            });
            if (appliedCoupon) {
              try {
                await markCouponUsed(appliedCoupon.code);
              } catch (err) {
                console.error("Failed to mark coupon used", err);
              }
            }
            navigate(
              `/payment/success?orderId=${response.razorpay_order_id}&paymentId=${response.razorpay_payment_id}`,
            );
          } catch (verifyError: any) {
            toast({
              title: "Verification Failed",
              description:
                verifyError.message || "Payment verification failed.",
              variant: "destructive",
            });
            navigate(`/payment/failed?orderId=${response.razorpay_order_id}`);
          }
        },
        onFailure: async (error) => {
          await reportPaymentFailure(
            orderData.orderId,
            error.code,
            error.description,
          );
          toast({
            title: "Payment Failed",
            description: error.description || "Something went wrong.",
            variant: "destructive",
          });
          navigate(
            `/payment/failed?orderId=${orderData.orderId}&reason=${encodeURIComponent(error.description)}`,
          );
        },
        onDismiss: () => {
          setPaymentLoading(false);
          toast({
            title: "Payment Cancelled",
            description: "You can try again when you're ready",
          });
        },
      });
    } catch (error: any) {
      console.error("Payment initiation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to initiate payment.",
        variant: "destructive",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Login Required",
        description: "Please login to continue",
        variant: "destructive",
      });
      navigate(`/login?redirect=/booking/${id}?plan=${planKeyId}`);
      return;
    }
    if (!spaceDetails || !selectedPlanDetails) return;

    try {
      setPaymentLoading(true);
      const orderData = await createPaymentOrder({
        userId: user.id,
        userEmail: user.email,
        userName: user.fullName || user.email.split("@")[0],
        userPhone: (user as any).phoneNumber,
        spaceId: spaceDetails._id,
        spaceName: spaceDetails.name,
        planName: selectedPlanDetails.name,
        planKey: selectedPlanKey,
        tenure: selectedTenure,
        yearlyPrice: yearlyPrice,
        totalAmount: finalPayableAmount,
        discountPercent:
          selectedOption.savingsPercent + (appliedCoupon?.discountValue || 0),
        discountAmount: selectedOption.savings + couponDiscountAmount,
        paymentType: searchParams.get("holdId")
          ? "seat_booking"
          : searchParams.get("type") === "coworking"
            ? "coworking_space"
            : "virtual_office",
        startDate: new Date(selectedStartDate).toISOString(),
        holdId: searchParams.get("holdId") || undefined,
      });

      toast({
        title: "Simulating Payment...",
        description: "Creating mock payment for testing",
      });
      const result = await simulatePayment(orderData.orderId);

      // Confirm booking if holdId exists
      const holdId = searchParams.get("holdId");
      if (holdId) {
        try {
          const token =
            localStorage.getItem("accessToken") ||
            localStorage.getItem("token");
          await fetch(
            `${API_CONFIG.BASE_URL}${API_ENDPOINTS.USER.SEAT_BOOKING_CONFIRM(holdId)}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({ paymentId: result.paymentId }),
            },
          );
        } catch (e) {
          console.error("Booking confirmation failed", e);
        }
      }

      toast({
        title: "Payment Simulated! 🎉",
        description: "Mock booking has been created successfully",
      });
      if (appliedCoupon) {
        try {
          await markCouponUsed(appliedCoupon.code);
        } catch (err) {
          console.error("Failed to mark coupon used", err);
        }
      }
      navigate(
        `/payment/success?orderId=${orderData.orderId}&paymentId=${result.paymentId}`,
      );
    } catch (error: any) {
      console.error("Payment simulation error:", error);
      toast({
        title: "Simulation Failed",
        description: error.message || "Failed to simulate payment.",
        variant: "destructive",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  // ============ LOADING / ERROR STATES ============
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-white pt-20">
          <BookingPageSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !spaceDetails || !selectedPlanDetails) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-xl mb-4">
              {error || "Plan details not found"}
            </p>
            <Button
              onClick={() => navigate(-1)}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Go Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const spaceImage =
    spaceDetails.image ||
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30">
      <Header />
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to space details
          </button>

          {/* Seat Hold Timer Banner */}
          {searchParams.get("holdId") && (
            <div className="sticky top-24 z-30 mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-5 flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-amber-900 font-bold text-sm md:text-base leading-tight">
                    Seat Reservation Hold
                  </p>
                  <p className="text-amber-700 text-xs md:text-sm mt-0.5">
                    {holdFetchError
                      ? "Unable to verify seat hold. Please check your internet or try again."
                      : holdTimeLeft !== null
                        ? "Payment window is active. Please complete to secure seats."
                        : "Securing your selection..."}
                  </p>
                </div>
              </div>
              {holdTimeLeft !== null && !holdFetchError && (
                <div className="flex flex-col items-end">
                  <div className="text-amber-700 font-mono font-black text-xl md:text-3xl tracking-tighter bg-white/60 px-4 py-1.5 rounded-xl border border-amber-200 shadow-sm">
                    {Math.floor(holdTimeLeft / 60)}:
                    {String(holdTimeLeft % 60).padStart(2, "0")}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600/80 mr-2 mt-1">
                    Remaining
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ========== STEPPER ========== */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-0" />
              <div
                className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-700 ease-out -z-0"
                style={{
                  width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
                }}
              />
              {STEPS.map((step) => {
                const isCompleted = currentStep > step.id;
                const isActive = currentStep === step.id;
                const Icon = step.icon;
                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center relative z-10"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ease-out shadow-sm border-2
                      ${
                        isCompleted
                          ? "bg-gradient-to-br from-teal-500 to-emerald-400 border-teal-400 text-white shadow-teal-200 shadow-md"
                          : isActive
                            ? "bg-white border-teal-500 text-teal-600 shadow-teal-100 shadow-lg scale-110 ring-4 ring-teal-50"
                            : "bg-white border-gray-200 text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" strokeWidth={3} />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`mt-2.5 text-xs font-semibold tracking-wide transition-colors duration-300
                      ${isActive ? "text-teal-700" : isCompleted ? "text-teal-500" : "text-gray-400"}`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========== STEP CONTENT ========== */}
          <div
            className={`transition-all duration-300 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
          >
            {/* ====== STEP 1: USER DETAILS ====== */}
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                    <User className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Confirm Your Details
                    </h2>
                    <p className="text-sm text-gray-500">
                      We'll use these details for your booking
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <User className="w-3.5 h-3.5" /> Full Name
                    </label>
                    <input
                      type="text"
                      value={userDetails.fullName}
                      onChange={(e) =>
                        setUserDetails((p) => ({
                          ...p,
                          fullName: e.target.value,
                        }))
                      }
                      placeholder="John Doe"
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" /> Email Address
                    </label>
                    <input
                      type="email"
                      value={userDetails.email}
                      onChange={(e) =>
                        setUserDetails((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="john@example.com"
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userDetails.phone}
                      onChange={(e) =>
                        setUserDetails((p) => ({ ...p, phone: e.target.value }))
                      }
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5" /> Company{" "}
                      <span className="text-gray-300 text-[10px] normal-case font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={userDetails.company}
                      onChange={(e) =>
                        setUserDetails((p) => ({
                          ...p,
                          company: e.target.value,
                        }))
                      }
                      placeholder="Acme Inc."
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>256-bit SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>GDPR Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Instant Confirmation</span>
                  </div>
                </div>
              </div>
            )}

            {/* ====== STEP 2: PLAN & TENURE ====== */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Space Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 h-56 md:h-auto relative overflow-hidden">
                      <img
                        src={spaceImage}
                        alt={spaceDetails.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {spaceDetails.rating}
                        <span className="text-gray-400 font-normal">
                          ({spaceDetails.reviews})
                        </span>
                      </div>
                    </div>
                    <div className="p-8 md:w-3/5">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {spaceDetails.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {spaceDetails.address}
                      </div>
                      {spaceDetails.features && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {spaceDetails.features.slice(0, 4).map((f, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Plan Selection (only for virtual office) */}
                {allPricing && (
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                        <Package className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          Select Your Plan
                        </h2>
                        <p className="text-sm text-gray-500">
                          Choose the plan that fits your needs
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(allPricing).map(([key, plan]) => {
                        const isSelected = selectedPlanKey === key;
                        return (
                          <div
                            key={key}
                            onClick={() => setSelectedPlanKey(key)}
                            className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2
                              ${
                                isSelected
                                  ? "border-teal-500 bg-gradient-to-br from-teal-50 to-emerald-50 shadow-lg shadow-teal-100/50 scale-[1.02]"
                                  : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-md"
                              }`}
                          >
                            {isSelected && (
                              <div className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center shadow-md">
                                <Check
                                  className="w-3.5 h-3.5 text-white"
                                  strokeWidth={3}
                                />
                              </div>
                            )}
                            <h4
                              className={`font-bold text-base mb-1 ${isSelected ? "text-teal-800" : "text-gray-900"}`}
                            >
                              {plan.name}
                            </h4>
                            <div className="flex items-end gap-1 mb-3">
                              <span
                                className={`text-2xl font-extrabold ${isSelected ? "text-teal-600" : "text-gray-900"}`}
                              >
                                ₹{plan.yearlyPrice.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-400 mb-1">
                                /year
                              </span>
                            </div>
                            <ul className="space-y-1.5">
                              {plan.features.map((f, i) => (
                                <li
                                  key={i}
                                  className="flex items-center gap-2 text-xs text-gray-600"
                                >
                                  <CheckCircle2
                                    className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? "text-teal-500" : "text-gray-300"}`}
                                  />
                                  {f}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tenure Selection */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Select Tenure
                      </h2>
                      <p className="text-sm text-gray-500">
                        Longer tenure = bigger savings
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tenureOptions.map((option) => (
                      <div
                        key={option.years}
                        onClick={() =>
                          setSelectedTenure(option.years as 1 | 2 | 3)
                        }
                        className={`relative border-2 rounded-2xl p-5 cursor-pointer transition-all duration-300
                          ${
                            selectedTenure === option.years
                              ? "border-teal-500 bg-teal-50 shadow-lg scale-[1.02]"
                              : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-md"
                          }`}
                      >
                        {option.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-500 to-emerald-400 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                            Most Popular
                          </div>
                        )}
                        <div
                          className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedTenure === option.years ? "border-teal-500 bg-teal-500" : "border-gray-300"}`}
                        >
                          {selectedTenure === option.years && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1 mt-1">
                          {option.label}
                        </h3>
                        <div className="mb-2">
                          <span className="text-2xl font-extrabold text-gray-900">
                            ₹{option.totalPrice.toLocaleString()}
                          </span>
                          <span className="text-gray-500 text-sm ml-1">
                            total
                          </span>
                        </div>
                        {option.savings > 0 && (
                          <div className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-md inline-block">
                            Save ₹{option.savings.toLocaleString()} (
                            {option.savingsPercent}% OFF)
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Start Date Picker */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <CalendarDays className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Select Start Date
                      </h2>
                      <p className="text-sm text-gray-500">
                        When would you like your booking to begin?
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <CalendarDays className="w-3.5 h-3.5" /> Start Date
                      </label>
                      <input
                        type="date"
                        value={selectedStartDate}
                        min={tomorrow.toISOString().split("T")[0]}
                        onChange={(e) => setSelectedStartDate(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 transition-all text-sm font-medium cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" /> End Date{" "}
                        <span className="text-gray-300 text-[10px] normal-case font-normal">
                          (auto-calculated)
                        </span>
                      </label>
                      <div className="w-full px-4 py-3.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium">
                        {formatDisplayDate(computedEndDate)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 bg-teal-50 border border-teal-100 rounded-xl p-4 flex items-start gap-3">
                    <CalendarDays className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-teal-700">
                      <span className="font-semibold">Booking Period:</span>{" "}
                      {formatDisplayDate(selectedStartDate)} →{" "}
                      {formatDisplayDate(computedEndDate)}
                      <span className="text-teal-500 ml-2">
                        ({selectedTenure} year{selectedTenure > 1 ? "s" : ""})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ====== STEP 3: REVIEW ====== */}
            {currentStep === 3 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Review Your Order
                    </h2>
                    <p className="text-sm text-gray-500">
                      Make sure everything looks good before payment
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* User Info */}
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-teal-500" /> Your Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-400">Name:</span>
                        <span className="ml-2 font-semibold text-gray-800">
                          {userDetails.fullName}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Email:</span>
                        <span className="ml-2 font-semibold text-gray-800">
                          {userDetails.email}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Phone:</span>
                        <span className="ml-2 font-semibold text-gray-800">
                          {userDetails.phone}
                        </span>
                      </div>
                      {userDetails.company && (
                        <div>
                          <span className="text-gray-400">Company:</span>
                          <span className="ml-2 font-semibold text-gray-800">
                            {userDetails.company}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Space Info */}
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-teal-500" /> Space &
                      Plan
                    </h3>
                    <div className="flex items-start gap-4">
                      <img
                        src={spaceImage}
                        alt=""
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {spaceDetails.name}
                        </h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {spaceDetails.address}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full">
                            {selectedPlanDetails.name}
                          </span>
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
                            {selectedTenure} Year{selectedTenure > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Dates */}
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-teal-500" /> Booking
                      Period
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-400">Start Date:</span>
                        <span className="ml-2 font-semibold text-gray-800">
                          {formatDisplayDate(selectedStartDate)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">End Date:</span>
                        <span className="ml-2 font-semibold text-gray-800">
                          {formatDisplayDate(computedEndDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Coupon Section */}
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-teal-500" /> Coupon Code
                    </h3>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-green-50 p-3 rounded-xl border border-green-200">
                        <div className="flex items-center gap-2 font-semibold text-green-700">
                          <Tag className="w-4 h-4" />
                          {appliedCoupon.code}
                          <span className="text-xs font-normal text-green-600">
                            (-{appliedCoupon.discountValue}%)
                          </span>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-200 bg-white font-medium"
                        />
                        <Button
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !couponCode}
                          className="bg-teal-600 text-white hover:bg-teal-700 h-[46px] px-5 text-sm font-bold rounded-xl"
                        >
                          {couponLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Apply"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                    <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-300 flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-teal-400" /> Price
                      Breakdown
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">
                          {selectedPlanDetails.name} × {selectedTenure} year
                          {selectedTenure > 1 ? "s" : ""}
                        </span>
                        <span className="font-semibold">
                          ₹{(yearlyPrice * selectedTenure).toLocaleString()}
                        </span>
                      </div>
                      {selectedOption.savings > 0 && (
                        <div className="flex justify-between text-sm text-green-400">
                          <span>
                            Tenure Discount ({selectedOption.savingsPercent}%)
                          </span>
                          <span className="font-semibold">
                            -₹{selectedOption.savings.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {appliedCoupon && (
                        <div className="flex justify-between text-sm text-green-400">
                          <span>
                            Coupon ({appliedCoupon.code} -
                            {appliedCoupon.discountValue}%)
                          </span>
                          <span className="font-semibold">
                            -₹{couponDiscountAmount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-gray-700 pt-3 flex justify-between">
                        <span className="text-base font-bold">
                          Total Payable
                        </span>
                        <span className="text-2xl font-extrabold text-teal-400">
                          ₹{finalPayableAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ====== STEP 4: PAYMENT ====== */}
            {currentStep === 4 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Complete Payment
                    </h2>
                    <p className="text-sm text-gray-500">
                      Secure payment via Razorpay
                    </p>
                  </div>
                </div>

                {/* Payment Summary Banner */}
                <div className="bg-gradient-to-r from-teal-500 to-emerald-400 rounded-2xl p-6 mb-8 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-teal-100 font-medium">
                        Amount to Pay
                      </p>
                      <p className="text-3xl font-extrabold mt-1">
                        ₹{finalPayableAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-teal-100 mt-1">
                        {selectedPlanDetails.name} • {selectedTenure} Year
                        {selectedTenure > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Payment Methods Preview */}
                <div className="space-y-3 mb-8">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Available Payment Methods
                  </h3>
                  {[
                    { name: "UPI (GPay, PhonePe, Paytm)", badge: "Instant" },
                    { name: "Credit / Debit Card", badge: "All Cards" },
                    { name: "Net Banking", badge: "50+ Banks" },
                  ].map((method, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <span className="text-sm font-semibold text-gray-700">
                        {method.name}
                      </span>
                      <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                        {method.badge}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pay Button */}
                <Button
                  onClick={handleProceedToPayment}
                  disabled={paymentLoading}
                  className="w-full py-6 bg-gradient-to-r from-teal-600 to-emerald-500 text-white rounded-2xl font-bold text-lg hover:from-teal-700 hover:to-emerald-600 transition-all duration-300 shadow-lg shadow-teal-200/50 hover:shadow-xl disabled:opacity-70"
                >
                  {paymentLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Shield className="w-5 h-5" />
                      Pay ₹{finalPayableAmount.toLocaleString()} Securely
                    </span>
                  )}
                </Button>

                {/* Dev Mode Simulate Button */}
                {isDevMode && (
                  <Button
                    onClick={handleSimulatePayment}
                    disabled={paymentLoading}
                    variant="outline"
                    className="w-full mt-3 border-2 border-blue-400 text-blue-600 hover:bg-blue-50 font-semibold py-5 rounded-2xl"
                  >
                    {paymentLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Simulating...
                      </span>
                    ) : (
                      "🧪 Simulate Payment (Dev)"
                    )}
                  </Button>
                )}

                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-2">
                  <Shield className="w-3 h-3" />
                  Secured by 256-bit SSL encryption • PCI DSS Compliant
                </p>
              </div>
            )}
          </div>

          {/* ========== NAVIGATION BUTTONS ========== */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={currentStep === 1 ? () => navigate(-1) : goBack}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              {currentStep === 1 ? "Cancel" : "Back"}
            </button>

            {currentStep < 4 && (
              <button
                onClick={goNext}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-md
                  ${
                    canProceed()
                      ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white hover:from-teal-700 hover:to-emerald-600 shadow-teal-200/50 hover:shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                  }`}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingPage;
