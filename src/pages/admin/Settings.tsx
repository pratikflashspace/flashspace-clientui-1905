import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth.service";
import {
  Shield,
  User,
  Bell,
  Lock,
  LogOut,
  Check,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";

export default function AdminSettings() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [isLoading, setIsLoading] = useState(false);

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Notification State (Mock)
  const [notifications, setNotifications] = useState({
    email_bookings: true,
    email_security: true,
    push_new_users: false,
    marketing: false,
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      if (response.success) {
        toast.success("Password changed successfully");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(response.message || "Failed to change password");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success("Preference updated");
  };

  const renderAccountTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-gray-500" />
          Profile Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              disabled
              value={user?.firstName || ""}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              disabled
              value={user?.lastName || ""}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              disabled
              value={user?.email || ""}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">
              Contact support to update your email address.
            </p>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <div className="inline-flex px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium capitalize">
              {user?.role || "Admin"}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-50 p-6 rounded-xl border border-red-100">
        <h3 className="text-lg font-semibold text-red-700 mb-2">Danger Zone</h3>
        <p className="text-red-600 mb-4 text-sm">
          Sign out of your admin account on this device.
        </p>
        <button
          onClick={() => logout()}
          className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors font-medium shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-gray-500" />
          Change Password
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                placeholder="Enter new password"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-500" />
          Notification Preferences
        </h3>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium text-gray-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                Booking Emails
              </div>
              <p className="text-sm text-gray-500">
                Receive emails for new bookings and payments.
              </p>
            </div>
            <button
              onClick={() => toggleNotification("email_bookings")}
              className={`w-12 h-6 rounded-full transition-colors relative ${notifications.email_bookings ? "bg-green-500" : "bg-gray-200"}`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.email_bookings ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium text-gray-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                Security Alerts
              </div>
              <p className="text-sm text-gray-500">
                Receive alerts about suspicious login attempts.
              </p>
            </div>
            <button
              onClick={() => toggleNotification("email_security")}
              className={`w-12 h-6 rounded-full transition-colors relative ${notifications.email_security ? "bg-green-500" : "bg-gray-200"}`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.email_security ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium text-gray-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-gray-400" />
                New User Push (Desktop)
              </div>
              <p className="text-sm text-gray-500">
                Get notified when a new user registers.
              </p>
            </div>
            <button
              onClick={() => toggleNotification("push_new_users")}
              className={`w-12 h-6 rounded-full transition-colors relative ${notifications.push_new_users ? "bg-green-500" : "bg-gray-200"}`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.push_new_users ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-[Poppins]">
            Settings
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Manage your account and platform preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-none space-y-2">
            <button
              onClick={() => setActiveTab("account")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "account"
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
              }`}
            >
              <User className="w-4 h-4" />
              Account
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "security"
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
              }`}
            >
              <Shield className="w-4 h-4" />
              Security
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "notifications"
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
              }`}
            >
              <Bell className="w-4 h-4" />
              Notifications
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {activeTab === "account" && renderAccountTab()}
            {activeTab === "security" && renderSecurityTab()}
            {activeTab === "notifications" && renderNotificationsTab()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
