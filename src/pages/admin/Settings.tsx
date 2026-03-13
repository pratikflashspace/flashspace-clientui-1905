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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
            {/* <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Global Admin Profile</p> */}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              First Name
            </label>
            <input
              disabled
              value={user?.firstName || ""}
              className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-500 font-bold text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Last Name
            </label>
            <input
              disabled
              value={user?.lastName || ""}
              className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-500 font-bold text-sm"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <input
              disabled
              value={user?.email || ""}
              className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-500 font-bold text-sm"
            />
            <p className="text-[10px] text-gray-400 font-bold ml-1 flex items-center gap-1.5 mt-2">
              <Mail className="w-3 h-3" />
              Contact support to update your global ID.
            </p>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Role</label>
            <div className="flex">
              <div className="inline-flex px-6 py-2 rounded-xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest">
                <Shield className="w-3 h-3 mr-2" />
                {user?.role || "Admin"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-[32px] border border-red-100 shadow-xl shadow-red-500/5 group transition-all hover:shadow-red-500/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl group-hover:scale-110 transition-transform">
            <LogOut className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-900 tracking-tight">Danger Zone</h3>
            <p className="text-xs text-red-400 font-bold uppercase tracking-widest mt-0.5">Sensitive Actions</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6 font-medium leading-relaxed">
          Sign out of your administrative session on this device. This will end all current platform operations for this account.
        </p>

        <button
          onClick={() => logout()}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-600/20 hover:shadow-red-600/30 hover:-translate-y-0.5"
        >
          <LogOut className="w-4 h-4" />
          End Session
        </button>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Change Password</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Secure Credentials</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-6 max-w-lg">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Current Password
            </label>
            <div className="relative group">
              <input
                type={showPasswords.current ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-black/5 outline-none transition-all font-bold text-sm h-14"
                placeholder="••••••••"
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
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors"
              >
                {showPasswords.current ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                New Password
              </label>
              <div className="relative group">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-black/5 outline-none transition-all font-bold text-sm h-14"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                  }
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors"
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Confirm New Password
              </label>
              <div className="relative group">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-black/5 focus:ring-4 focus:ring-black/5 outline-none transition-all font-bold text-sm h-14"
                  placeholder="••••••••"
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
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-10 py-4 bg-gray-900 text-white rounded-2xl hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-gray-900/10 hover:shadow-gray-900/20 hover:-translate-y-0.5 flex items-center justify-center gap-3"
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Notification Preferences</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Alert Configuration</p>
          </div>
        </div>

        <div className="space-y-10">
          {[
            { id: "email_bookings", label: "Booking Emails", desc: "Receive automated alerts for new bookings and payments.", icon: Mail },
            { id: "email_security", label: "Security Alerts", desc: "Get notified about suspicious login attempts and security updates.", icon: Shield },
            { id: "push_new_users", label: "New User Push", desc: "Receive real-time desktop notifications for new user registrations.", icon: Smartphone }
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="font-extrabold text-gray-900 flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 text-gray-400" />
                  {item.label}
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-md">
                  {item.desc}
                </p>
              </div>
              <button
                onClick={() => toggleNotification(item.id as any)}
                className={`w-14 h-7 rounded-full transition-all relative shrink-0 ${notifications[item.id as keyof typeof notifications] ? "bg-black shadow-lg shadow-black/10" : "bg-gray-100"}`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${notifications[item.id as keyof typeof notifications] ? "translate-x-7" : "translate-x-0"}`}
                />
              </button>
            </div>
          ))}
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
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight font-[Poppins]">
            Settings
          </h1>
          <p className="text-sm md:text-base text-gray-500 font-medium max-w-2xl">
            Manage your account and platform preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Navigation - Responsive */}
          <div className="w-full lg:w-72 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 no-scrollbar sticky top-0 bg-gray-50 lg:bg-transparent z-10 -mx-4 px-4 lg:mx-0 lg:px-0">
            {[
              { id: "account", label: "Account", icon: User },
              { id: "security", label: "Security", icon: Shield },
              { id: "notifications", label: "Notifications", icon: Bell },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap lg:w-full border-2 ${activeTab === tab.id
                    ? "bg-gray-900 text-white shadow-xl shadow-gray-900/10 border-transparent"
                    : "bg-white text-gray-400 hover:text-gray-900 border-gray-50 hover:border-gray-100"
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 w-full max-w-4xl">
            {activeTab === "account" && renderAccountTab()}
            {activeTab === "security" && renderSecurityTab()}
            {activeTab === "notifications" && renderNotificationsTab()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
