import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight, Home, Calendar, Building2 } from 'lucide-react';
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
}

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');

  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (orderId) {
      fetchPaymentDetails();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchPaymentDetails = async () => {
    try {
      const data = await getPaymentStatus(orderId!);
      setPaymentDetails(data);
    } catch (error) {
      console.error("Error fetching payment details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      <main className="flex-grow pt-20 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center py-12">
          {/* Success Animation */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-bounce-slow">
              <CheckCircle className="w-14 h-14 text-green-500" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful! 🎉</h1>
          <p className="text-gray-600 mb-8">
            Your booking has been confirmed. You will receive a confirmation email shortly.
          </p>

          {/* Order Details Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 text-left shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-yellow-500" />
              Booking Details
            </h3>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ) : paymentDetails ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Space</span>
                  <span className="font-medium text-gray-900">{paymentDetails.spaceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-medium text-gray-900">{paymentDetails.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tenure</span>
                  <span className="font-medium text-gray-900">{paymentDetails.tenure} Year{paymentDetails.tenure > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="font-bold text-gray-900">₹{paymentDetails.amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Order ID</span>
                  <span className="font-mono">{orderId}</span>
                </div>
                {paymentId && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Payment ID</span>
                    <span className="font-mono">{paymentId}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Order ID</span>
                  <span className="font-mono">{orderId || 'N/A'}</span>
                </div>
                {paymentId && (
                  <div className="flex justify-between text-xs text-gray-500">
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
              onClick={() => navigate('/dashboard/my-bookings')}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3"
            >
              <Calendar className="w-4 h-4 mr-2" />
              View My Bookings
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
              className="border-gray-300 text-gray-700 font-semibold px-6 py-3"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-sm text-gray-500 mt-8">
            Need help? <Link to="/contact" className="text-yellow-600 hover:underline">Contact Support</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
