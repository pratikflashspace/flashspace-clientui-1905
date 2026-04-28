import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight, Home, Calendar, Building2, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { getPaymentStatus } from '@/services/payment.service';

interface PaymentDetails {
  paymentId: string;
  orderId: string;
  status: string;
  amount: number;
  spaceName: string;
  planName: string;
  tenure: number;
  bookingId?: string;
}

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');

  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (orderId) {
      fetchPaymentDetails();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchPaymentDetails = async (retryCount = 0) => {
    try {
      const data = await getPaymentStatus(orderId!);
      setPaymentDetails(data);
      
      // If bookingId is missing, retry after 1 second (up to 5 times)
      if (!data.bookingId && retryCount < 5) {
        setTimeout(() => fetchPaymentDetails(retryCount + 1), 1000);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching payment details:", error);
      if (retryCount < 5) {
        setTimeout(() => fetchPaymentDetails(retryCount + 1), 1000);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!loading && paymentDetails?.bookingId) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate(`/dashboard/my-bookings?openBooking=${paymentDetails.bookingId}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [loading, paymentDetails, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow pt-20 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center py-12">
          {/* Success Animation */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-green-500/10 rounded-full flex items-center justify-center animate-bounce-slow">
              <CheckCircle className="w-14 h-14 text-green-500" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-foreground mb-3">Payment Successful!</h1>
          <p className="text-muted-foreground mb-4">
            Your booking has been confirmed.
          </p>
          {paymentDetails?.bookingId && (
            <div className="flex items-center justify-center gap-2 text-primary font-medium mb-8 bg-primary/5 py-2 px-4 rounded-full w-fit mx-auto animate-pulse">
              <Clock className="w-4 h-4" />
              <p className="text-sm">Redirecting to My Bookings in {countdown} seconds...</p>
            </div>
          )}

          {/* Order Details Card */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8 text-left shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Booking Details
            </h3>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            ) : paymentDetails ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Space</span>
                  <span className="font-medium text-foreground">{paymentDetails.spaceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium text-foreground">{paymentDetails.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tenure</span>
                  <span className="font-medium text-foreground">{paymentDetails.tenure} Year{paymentDetails.tenure > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-muted-foreground">Amount Paid</span>
                  <span className="font-bold text-foreground">₹{paymentDetails.amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Order ID</span>
                  <span className="font-mono">{orderId}</span>
                </div>
                {paymentId && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Payment ID</span>
                    <span className="font-mono">{paymentId}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Order ID</span>
                  <span className="font-mono">{orderId || 'N/A'}</span>
                </div>
                {paymentId && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Payment ID</span>
                    <span className="font-mono">{paymentId}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate(paymentDetails?.bookingId ? `/dashboard/my-bookings?openBooking=${paymentDetails.bookingId}` : '/dashboard/my-bookings')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3"
            >
              <Calendar className="w-4 h-4 mr-2" />
              View My Bookings
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
              className="border-border text-foreground font-semibold px-6 py-3"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-sm text-muted-foreground mt-8">
            Need help? <Link to="/contact" className="text-primary hover:underline">Contact Support</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
