import React, { useState } from "react";
import { LogOut, AlertTriangle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Logout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // Redirect will be handled by AuthContext
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const handleCancel = () => {
    // Navigate back to dashboard
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogOut className="w-10 h-10 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold  text-gray-900 mb-2">
            Sign Out
          </h1>
          <p className="text-gray-500 mb-8">
            Are you sure you want to sign out of your account?
          </p>

          {/* Warning */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl mb-8 text-left">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Before you go</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Make sure you have saved any unsaved changes. You will need to log in again to access your dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing out...
                </>
              ) : (
                <>
                  <LogOut className="w-5 h-5" />
                  Yes, Sign Out
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoggingOut}
              className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back to Dashboard
            </button>
          </div>

          {/* Footer note */}
          <p className="text-xs text-gray-400 mt-8">
            Need help? Contact{" "}
            <a href="mailto:support@flashspace.co" className="text-yellow-600 hover:underline">
              support@flashspace.co
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
