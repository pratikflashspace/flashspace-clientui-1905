import React, { useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { XCircle, RefreshCcw, Home, HelpCircle, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const PaymentFailedPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const reason = searchParams.get('reason');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Header />
      <main className="flex-grow pt-20 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center py-12">
          {/* Failed Animation */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-14 h-14 text-red-500" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Failed</h1>
          <p className="text-gray-600 mb-4">
            We couldn't process your payment. Don't worry, no money has been deducted.
          </p>

          {/* Error Details */}
          {reason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-left">
              <p className="text-sm text-red-700">
                <span className="font-semibold">Reason: </span>
                {decodeURIComponent(reason)}
              </p>
            </div>
          )}

          {/* Order ID Reference */}
          {orderId && (
            <div className="bg-gray-100 rounded-lg p-4 mb-8 text-sm">
              <p className="text-gray-600">
                <span className="font-semibold">Order Reference: </span>
                <span className="font-mono">{orderId}</span>
              </p>
            </div>
          )}

          {/* Common Reasons */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 text-left">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-yellow-500" />
              Common reasons for payment failure
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                Insufficient balance in your account
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                Card declined by your bank
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                Network connectivity issues
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                Transaction timeout
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate(-1)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Try Again
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
            Still facing issues? <Link to="/contact" className="text-yellow-600 hover:underline">Contact Support</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentFailedPage;
