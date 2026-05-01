import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth.service";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";

import {
  ArrowLeft,
  Shield,
  CreditCard,
  LogOut,
  ChevronRight,
  Bell,
  Smartphone,
  Mail,
  Globe,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@/types/auth.types";

const buildSettingsFromUser = (user?: User | null) => ({
  email: user?.notifications?.email ?? true,
  push: user?.notifications?.push ?? true,
  reminders: user?.notifications?.reminders ?? true,
  loginAlerts: user?.notifications?.loginAlerts ?? true,
  twoFactor: user?.isTwoFactorEnabled ?? false,
  sessionManagement: user?.securityPreferences?.sessionManagement ?? true,
  dataSharing: user?.securityPreferences?.dataSharing ?? false,
  language: user?.preferences?.language ?? "en",
  currency: user?.preferences?.currency ?? "inr",
  defaultCity: user?.preferences?.defaultCity ?? "delhi",
  timeZone: user?.preferences?.timeZone ?? "ist",
  darkMode: user?.preferences?.darkMode ?? false,
  compactView: user?.preferences?.compactView ?? false,
});

export default function Settings() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notifications & Preferences State
  const [settings, setSettings] = useState(() => buildSettingsFromUser(user));

  useEffect(() => {
    setSettings(buildSettingsFromUser(user));
  }, [user]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
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
        toast.success("Password updated successfully");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(response.message || "Failed to update password");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettingAPI = async (
    key: keyof typeof settings,
    value: boolean | string,
  ) => {
    const previousValue = settings[key];
    // Optimistic UI Update
    setSettings((prev) => ({ ...prev, [key]: value }));

    try {
      // Determine which nested object this setting belongs to
      let updatePayload = {};

      if (
        ["email", "push", "reminders", "loginAlerts"].includes(
          key,
        )
      ) {
        updatePayload = {
          notifications: { ...user?.notifications, [key]: value },
        };
      } else if (
        [
          "language",
          "currency",
          "defaultCity",
          "timeZone",
          "darkMode",
          "compactView",
        ].includes(key)
      ) {
        updatePayload = { preferences: { ...user?.preferences, [key]: value } };
      } else if (["sessionManagement", "dataSharing"].includes(key)) {
        updatePayload = {
          securityPreferences: { ...user?.securityPreferences, [key]: value },
        };
      } else if (key === "twoFactor") {
        updatePayload = {
          isTwoFactorEnabled: value,
        };
      }

      const response = await authService.updateProfile(updatePayload);

      // Sync global user state so other components see it
      if (response.success && response.data) {
        updateUser(response.data);
        setSettings(buildSettingsFromUser(response.data));
        toast.success(
          key === "twoFactor" && value === true
            ? "Two-factor authentication enabled"
            : key === "twoFactor" && value === false
              ? "Two-factor authentication disabled"
              : "Preferences updated securely",
        );
      } else {
        setSettings((prev) => ({ ...prev, [key]: previousValue }));
        toast.error(response.message || "Failed to save preference");
      }
    } catch (error) {
      // Revert optimistic update on failure
      setSettings((prev) => ({ ...prev, [key]: previousValue }));
      toast.error("Failed to save preference");
    }
  };

  const handleSelectChange = (key: keyof typeof settings, value: string) => {
    updateSettingAPI(key, value);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-grow pt-24 pb-20">
        {/* Settings Header */}
        <div className="sticky top-[88px] sm:top-24 z-30 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-xl font-semibold text-foreground">Settings</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8 mt-4">
          {/* Notifications */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-muted-foreground" /> Notifications
              </CardTitle>
              <CardDescription>
                Choose what updates you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                {
                  label: "Email Notifications",
                  desc: "Receive booking confirmations and updates via email",
                  icon: <Mail className="w-4 h-4 text-muted-foreground" />,
                  stateKey: "email",
                },
                {
                  label: "Push Notifications",
                  desc: "Get instant alerts on your device",
                  icon: (
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                  ),
                  stateKey: "push",
                },
                {
                  label: "Booking Reminders",
                  desc: "Get reminded before your upcoming bookings",
                  icon: <Bell className="w-4 h-4 text-muted-foreground" />,
                  stateKey: "reminders",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={
                      settings[
                        item.stateKey as keyof typeof settings
                      ] as boolean
                    }
                    onCheckedChange={(checked) =>
                      updateSettingAPI(
                        item.stateKey as keyof typeof settings,
                        checked,
                      )
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Billing */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-muted-foreground" /> Billing
              </CardTitle>
              <CardDescription>
                Manage your subscription and payment methods.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border/40">
                <div>
                  <p className="font-medium text-foreground">Free Plan</p>
                  <p className="text-sm text-muted-foreground">
                    Basic workspace access
                  </p>
                </div>
                <Button variant="outline" className="rounded-xl">
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-muted-foreground" /> Privacy &
                Security
              </CardTitle>
              <CardDescription>
                Manage your account security and data preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="rounded-xl"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    required
                  />
                  <div className="text-right">
                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Forgot current password?
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="rounded-xl"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      required
                      minLength={8}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="rounded-xl"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-xl"
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>

              <Separator />

              {[
                {
                  label: "Two-Factor Authentication",
                  desc: "Add an extra layer of security to your account",
                  stateKey: "twoFactor",
                },
                {
                  label: "Login Alerts",
                  desc: "Get notified when someone logs into your account",
                  stateKey: "loginAlerts",
                },
                {
                  label: "Session Management",
                  desc: "Automatically log out after 30 days of inactivity",
                  stateKey: "sessionManagement",
                },
                {
                  label: "Data Sharing",
                  desc: "Share anonymised usage data to improve services",
                  stateKey: "dataSharing",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={
                      settings[
                        item.stateKey as keyof typeof settings
                      ] as boolean
                    }
                    onCheckedChange={(checked) =>
                      updateSettingAPI(
                        item.stateKey as keyof typeof settings,
                        checked,
                      )
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-muted-foreground" /> App
                Preferences
              </CardTitle>
              <CardDescription>
                Customise your workspace experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(val) => handleSelectChange("language", val)}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                      <SelectItem value="te">Telugu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(val) => handleSelectChange("currency", val)}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inr">₹ INR</SelectItem>
                      <SelectItem value="usd">$ USD</SelectItem>
                      <SelectItem value="eur">€ EUR</SelectItem>
                      <SelectItem value="gbp">£ GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default City</Label>
                  <Select
                    value={settings.defaultCity}
                    onValueChange={(val) =>
                      handleSelectChange("defaultCity", val)
                    }
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="chennai">Chennai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time Zone</Label>
                  <Select
                    value={settings.timeZone}
                    onValueChange={(val) => handleSelectChange("timeZone", val)}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ist">IST (UTC+5:30)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">EST (UTC-5)</SelectItem>
                      <SelectItem value="pst">PST (UTC-8)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {[
                {
                  label: "Dark Mode",
                  desc: "Use dark theme across the app",
                  stateKey: "darkMode",
                },
                {
                  label: "Compact View",
                  desc: "Show more content with less spacing",
                  stateKey: "compactView",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={
                      settings[
                        item.stateKey as keyof typeof settings
                      ] as boolean
                    }
                    onCheckedChange={(checked) =>
                      updateSettingAPI(
                        item.stateKey as keyof typeof settings,
                        checked,
                      )
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-muted-foreground" /> Help &
                Support
              </CardTitle>
              <CardDescription>
                Get help or reach out to our team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Help Centre", desc: "Browse FAQs and guides" },
                {
                  label: "Contact Support",
                  desc: "Reach our team via chat or email",
                },
                {
                  label: "Terms of Service",
                  desc: "Read our terms and conditions",
                },
                {
                  label: "Privacy Policy",
                  desc: "Understand how we use your data",
                },
              ].map((item) => (
                <button
                  key={item.label}
                  className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-muted/60 transition-colors group"
                >
                  <div className="text-left">
                    <p className="font-medium text-sm text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Delete Account */}
          <Card className="border-destructive/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-destructive">Delete Account</p>
                  <p className="text-xs text-muted-foreground">
                    Permanently delete your account and all data.
                  </p>
                </div>
                <Button variant="destructive" size="sm" className="rounded-xl">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sign Out */}
          <Card
            className="border-border/60 hover:bg-destructive/5 transition-colors cursor-pointer group"
            onClick={logout}
          >
            <CardContent className="pt-6">
              <button className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3 text-destructive">
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium text-sm">Sign Out</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
