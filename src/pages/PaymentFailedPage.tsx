import React, { useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { XCircle, RefreshCcw, Home, HelpCircle, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const PaymentFailedPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");
  const reason = searchParams.get("reason");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow pt-20 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center py-12">
          {/* Failed Animation */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
              <XCircle className="w-14 h-14 text-red-500" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Payment Failed
          </h1>
          <p className="text-muted-foreground mb-4">
            We couldn't process your payment. Don't worry, no money has been
            deducted.
          </p>

          {/* Error Details */}
          {reason && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8 text-left">
              <p className="text-sm text-red-700">
                <span className="font-semibold">Reason: </span>
                {decodeURIComponent(reason)}
              </p>
            </div>
          )}

          {/* Order ID Reference */}
          {orderId && (
            <div className="bg-muted/60 rounded-lg p-4 mb-8 text-sm border border-border">
              <p className="text-muted-foreground">
                <span className="font-semibold">Order Reference: </span>
                <span className="font-mono">{orderId}</span>
              </p>
            </div>
          )}

          {/* Common Reasons */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8 text-left">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary" />
              Common reasons for payment failure
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                Insufficient balance in your account
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                Card declined by your bank
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                Network connectivity issues
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground">•</span>
                Transaction timeout
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate(-1)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="border-border text-foreground font-semibold px-6 py-3"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-sm text-muted-foreground mt-8">
            Still facing issues?{" "}
            <Link to="/contact" className="text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentFailedPage;
