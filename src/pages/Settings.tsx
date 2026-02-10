import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth.service';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  User,
  Shield,
  Bell,
  CreditCard,
  LogOut,
  Camera,
  Mail,
  Phone,
  Lock,
  Check,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function Settings() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Mock Notification State
  const [notifications, setNotifications] = useState({
    marketing: false,
    security: true,
    updates: true
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });

      if (response.success) {
        toast.success("Password updated successfully");
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(response.message || "Failed to update password");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success("Preferences updated");
  };

  const renderProfileTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-yellow-400/20 to-orange-400/20"></div>

        <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-end pt-12">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
              {profileImage || user?.profilePicture ? (
                <img src={profileImage || user?.profilePicture} alt={user?.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white text-4xl font-bold">
                  {user?.fullName?.charAt(0)}
                </div>
              )}
            </div>
            <label className="absolute bottom-2 right-2 p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors shadow-lg group-hover:scale-105 cursor-pointer">
              <Camera className="w-4 h-4" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          <div className="flex-1 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">{user?.fullName}</h2>
            <p className="text-gray-500">{user?.role === 'admin' ? 'Administrator' : 'Member'}</p>
          </div>

          <button className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-yellow-500" />
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">Full Name</label>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-900 font-medium">
              {user?.fullName}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">Phone Number</label>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-900 font-medium flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              {user?.phoneNumber || 'Not provided'}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-500">Email Address</label>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-900 font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              {user?.email}
              {user?.isEmailVerified && (
                <span className="ml-auto flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  <Check className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
        <h3 className="text-lg font-bold text-red-700 flex items-center gap-2 mb-2">
          <LogOut className="w-5 h-5" />
          Sign Out
        </h3>
        <p className="text-red-600/80 mb-4 text-sm max-w-xl">
          Securely log out of your account on this device. You will need to sign in again to access your dashboard.
        </p>
        <button
          onClick={() => logout()}
          className="px-6 py-2.5 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-xl font-medium transition-colors shadow-sm"
        >
          Sign Out
        </button>
      </div>
    </motion.div>
  );

  const renderSecurityTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 max-w-2xl"
    >
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-yellow-500" />
          Change Password
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Current Password</label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                placeholder="Enter new password"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
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

      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-gray-400" />
          Two-Factor Authentication
        </h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div>
            <p className="font-medium text-gray-900">Secure your account</p>
            <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
          </div>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-100 transition-colors">
            Enable
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderNotificationsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 max-w-2xl"
    >
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-yellow-500" />
          Notification Preferences
        </h3>

        <div className="space-y-6">
          {[
            { id: 'marketing', label: 'Marketing Emails', desc: 'Receive offers, promotions, and news.' },
            { id: 'security', label: 'Security Alerts', desc: 'Get notified about login attempts and password changes.' },
            { id: 'updates', label: 'Platform Updates', desc: 'Stay informed about new features and improvements.' }
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{item.label}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <button
                onClick={() => toggleNotification(item.id as keyof typeof notifications)}
                className={`w-12 h-6 rounded-full transition-colors relative ${notifications[item.id as keyof typeof notifications] ? 'bg-yellow-400' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications[item.id as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 font-[Poppins]">Account Settings</h1>
            <p className="text-gray-500 mt-2">Manage your personal information and preferences.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-72 flex-none">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-28">
                <nav className="space-y-1">
                  {[
                    { id: 'profile', icon: User, label: 'My Profile' },
                    { id: 'security', icon: Lock, label: 'Login & Security' },
                    { id: 'notifications', icon: Bell, label: 'Notifications' },
                    { id: 'billing', icon: CreditCard, label: 'Billing & Payments' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === item.id
                        ? 'bg-black text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                      <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-yellow-400' : 'text-gray-400'}`} />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && renderProfileTab()}
                {activeTab === 'security' && renderSecurityTab()}
                {activeTab === 'notifications' && renderNotificationsTab()}
                {activeTab === 'billing' && (
                  <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No Payment Methods</h3>
                    <p className="text-gray-500 mb-6">You haven't added any payment methods yet.</p>
                    <button className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
                      Add Payment Method
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
