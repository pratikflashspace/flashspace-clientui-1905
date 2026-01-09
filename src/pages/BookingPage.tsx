import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Shield, Clock, Star, Building2, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { getVirtualOfficeById } from '@/services/virtualOffice.service';
import { VirtualOfficeItem } from '@/types/services';
import { getVirtualOfficePricing, PlanDetails } from '@/utils/priceUtils';
import { BookingPageSkeleton } from '@/components/ui/skeleton-loaders';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  createPaymentOrder, 
  openRazorpayCheckout, 
  verifyPayment, 
  reportPaymentFailure 
} from '@/services/payment.service';

const BookingPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planKeyId = searchParams.get('plan') || 'gst';

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spaceDetails, setSpaceDetails] = useState<VirtualOfficeItem | null>(null);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<PlanDetails | null>(null);
  const [selectedTenure, setSelectedTenure] = useState<1 | 2 | 3>(2); // Default to 2 years

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        // Using the service to fetch fresh data from backend
        const data = await getVirtualOfficeById(id);
        
        if (!data) {
          setError("Space not found");
        } else {
          setSpaceDetails(data);
          
          // Calculate pricing using utility
          const pricing = getVirtualOfficePricing(data);
          if (pricing && planKeyId in pricing) {
             // @ts-ignore - we know Key exists
            setSelectedPlanDetails(pricing[planKeyId as keyof typeof pricing]);
          } else {
            // Fallback if plan invalid
            setSelectedPlanDetails(pricing?.gst || null);
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
  }, [id, planKeyId]);

  // Loading State
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

  // Error State
  if (error || !spaceDetails || !selectedPlanDetails) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-white pt-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-xl mb-4">{error || "Plan details not found"}</p>
            <Button onClick={() => navigate('/virtual-office')} className="bg-yellow-400 hover:bg-yellow-500 text-black">
              Browse Locations
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { name: spaceName, address: spaceAddress, image: spaceImage } = spaceDetails;
  const { name: planName, yearlyPrice, features } = selectedPlanDetails;

  // Calculate prices for each tenure based on the FETCHED yearly price
  const tenureOptions = [
    {
      years: 1,
      label: '1 Year',
      totalPrice: yearlyPrice,
      savings: 0,
      savingsPercent: 0,
      popular: false,
    },
    {
      years: 2,
      label: '2 Years',
      totalPrice: Math.round(yearlyPrice * 2 * 0.9), // 10% discount
      savings: Math.round((yearlyPrice * 2) - (yearlyPrice * 2 * 0.9)),
      savingsPercent: 10,
      popular: true,
    },
    {
      years: 3,
      label: '3 Years',
      totalPrice: Math.round(yearlyPrice * 3 * 0.85), // 15% discount
      savings: Math.round((yearlyPrice * 3) - (yearlyPrice * 3 * 0.85)),
      savingsPercent: 15,
      popular: false,
    },
  ];

  const selectedOption = tenureOptions.find(t => t.years === selectedTenure)!;

  const handleProceedToPayment = async () => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      toast({
        title: "Login Required",
        description: "Please login to continue with your booking",
        variant: "destructive",
      });
      // Save current URL to redirect back after login
      navigate(`/login?redirect=/booking/${id}?plan=${planKeyId}`);
      return;
    }

    if (!spaceDetails || !selectedPlanDetails) return;

    try {
      setPaymentLoading(true);

      // Create order on backend
      const orderData = await createPaymentOrder({
        userId: user.id,
        userEmail: user.email,
        userName: user.fullName || user.email.split('@')[0],
        userPhone: user.phoneNumber,
        spaceId: spaceDetails._id,
        spaceName: spaceName,
        planName: planName,
        planKey: planKeyId,
        tenure: selectedTenure,
        yearlyPrice: yearlyPrice,
        totalAmount: selectedOption.totalPrice,
        discountPercent: selectedOption.savingsPercent,
        discountAmount: selectedOption.savings,
        paymentType: "virtual_office",
      });

      // DEV MODE: Skip Razorpay checkout, directly mark as success
      if (orderData.devMode) {
        try {
          // Verify payment in dev mode
          const verificationResult = await verifyPayment({
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: `pay_dev_${Date.now()}`,
            razorpay_signature: "dev_signature",
            devMode: true,
          });

          toast({
            title: "Payment Successful! 🎉 (Dev Mode)",
            description: "Your booking has been confirmed",
          });

          // Navigate to success page
          navigate(`/payment/success?orderId=${orderData.orderId}&paymentId=${orderData.paymentId}`);
        } catch (verifyError: any) {
          toast({
            title: "Error",
            description: verifyError.message || "Something went wrong",
            variant: "destructive",
          });
        } finally {
          setPaymentLoading(false);
        }
        return;
      }

      // PRODUCTION MODE: Open Razorpay checkout
      await openRazorpayCheckout({
        orderId: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId: orderData.keyId,
        userEmail: user.email,
        userName: user.fullName || user.email.split('@')[0],
        userPhone: user.phoneNumber,
        spaceName: spaceName,
        planName: planName,
        onSuccess: async (response) => {
          try {
            // Verify payment on backend
            const verificationResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast({
              title: "Payment Successful! 🎉",
              description: "Your booking has been confirmed",
            });

            // Navigate to success page
            navigate(`/payment/success?orderId=${response.razorpay_order_id}&paymentId=${response.razorpay_payment_id}`);
          } catch (verifyError: any) {
            toast({
              title: "Verification Failed",
              description: verifyError.message || "Payment verification failed. Please contact support.",
              variant: "destructive",
            });
            navigate(`/payment/failed?orderId=${response.razorpay_order_id}`);
          }
        },
        onFailure: async (error) => {
          await reportPaymentFailure(orderData.orderId, error.code, error.description);
          toast({
            title: "Payment Failed",
            description: error.description || "Something went wrong. Please try again.",
            variant: "destructive",
          });
          navigate(`/payment/failed?orderId=${orderData.orderId}&reason=${encodeURIComponent(error.description)}`);
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
        description: error.message || "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Space Details
          </button>

          {/* Page Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600 mb-8">Choose your preferred tenure for {planName} at {spaceName}</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: Tenure Cards */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Tenure</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tenureOptions.map((option) => (
                  <div
                    key={option.years}
                    onClick={() => setSelectedTenure(option.years as 1 | 2 | 3)}
                    className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 ${
                      selectedTenure === option.years
                        ? 'border-yellow-400 bg-yellow-50 shadow-lg scale-[1.02]'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    {/* Popular Badge */}
                    {option.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        Most Popular
                      </div>
                    )}

                    {/* Selection Indicator */}
                    <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedTenure === option.years
                        ? 'border-yellow-500 bg-yellow-400'
                        : 'border-gray-300 bg-white'
                    }`}>
                      {selectedTenure === option.years && <Check className="w-3 h-3 text-black" />}
                    </div>

                    <div className="mt-2">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{option.label}</h3>
                      
                      <div className="mb-3">
                        <span className="text-2xl font-bold text-gray-900">₹{option.totalPrice.toLocaleString()}</span>
                        <span className="text-gray-500 text-sm"> Total</span>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                         Valid for {option.years} Year{option.years > 1 ? 's' : ''}
                      </div>

                      {option.savings > 0 && (
                        <div className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-md inline-block">
                          Save ₹{option.savings.toLocaleString()} ({option.savingsPercent}% OFF)
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Plan Features */}
              <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-500" />
                  What's Included in {planName}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span>Instant Activation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-yellow-500" />
                  <span>100% Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Premium Support</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                {/* Space Image */}
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={spaceImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"} 
                    alt={spaceName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-white font-semibold truncate">{spaceName}</h3>
                    <p className="text-white/80 text-xs truncate">{spaceAddress}</p>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-yellow-500" />
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan</span>
                      <span className="font-medium text-gray-900">{planName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tenure</span>
                      <span className="font-medium text-gray-900">{selectedTenure} Year{selectedTenure > 1 ? 's' : ''}</span>
                    </div>
                    
                    {selectedOption.savings > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({selectedOption.savingsPercent}%)</span>
                        <span className="font-medium">-₹{selectedOption.savings.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900 font-semibold">Total Amount</span>
                        <div className="text-right">
                          <span className="text-xl font-bold text-gray-900">₹{selectedOption.totalPrice.toLocaleString()}</span>
                          <p className="text-xs text-gray-500">for {selectedTenure} year{selectedTenure > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleProceedToPayment}
                    disabled={paymentLoading}
                    className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {paymentLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      "Proceed to Payment"
                    )}
                  </Button>

                  <p className="text-center text-xs text-gray-500 mt-3">
                    By proceeding, you agree to our Terms of Service
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingPage;
