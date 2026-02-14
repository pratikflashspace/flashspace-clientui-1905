import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Bell, Mail, ShieldCheck, Smartphone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

/**
 * SpacePortalSettings Page
 *
 * Features:
 * - Notification preferences toggles
 * - Security overview (static for now)
 *
 * Backend-ready:
 * - Later notifications state should be fetched from backend and saved via API.
 */
export default function SpacePortalSettings() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);

  /**
   * Notification preferences state.
   * Later this should come from backend.
   */
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    bookingAlerts: true,
    smsAlerts: false,
  });

  /**
   * Toggle any notification preference safely.
   */
  const toggleNotification = async (key: keyof typeof notifications) => {
    const next = { ...notifications, [key]: !notifications[key] };
    setNotifications(next);

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      toast({
        title: "Settings updated",
        description: "Your notification preferences have been saved.",
      });

    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update settings.",
      });
      setNotifications((prev) => ({ ...prev, [key]: !next[key] }));
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
        // Just using defaults for now until backend is ready
        setIsSaving(false); 
    };

    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated]);

  /**
   * Toggle config list to avoid repeated JSX.
   */
  const notificationToggles = useMemo(
    () => [
      {
        key: "emailUpdates" as const,
        label: "Email updates",
        description: "Weekly performance summaries and system updates.",
        icon: <Mail size={16} />,
      },
      {
        key: "bookingAlerts" as const,
        label: "Booking alerts",
        description: "Instant alerts for new booking requests.",
        icon: <Bell size={16} />,
      },
      {
        key: "smsAlerts" as const,
        label: "SMS alerts",
        description: "Critical updates sent to your phone.",
        icon: <Smartphone size={16} />,
      },
    ],
    []
  );

  return (
    <div className="flex-1">
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Notification Preferences */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-slate-500" />
            <h2 className="text-lg font-bold text-slate-900">
              Notification Preferences
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Choose how you want to receive updates from the portal.
          </p>

          <div className="mt-5 space-y-4">
            {notificationToggles.map((toggle) => (
              <SettingToggle
                key={toggle.key}
                label={toggle.label}
                description={toggle.description}
                icon={toggle.icon}
                enabled={notifications[toggle.key]}
                onToggle={() => toggleNotification(toggle.key)}
                disabled={isSaving}
              />
            ))}
          </div>
        </div>

        {/* Security Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-slate-500" />
            <h2 className="text-lg font-bold text-slate-900">
              Security Overview
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Keep your account protected with strong security habits.
          </p>

          <div className="mt-5 space-y-4 text-sm text-slate-600">
            <SecurityInfoCard
              title="Last password update"
              value="Not available"
            />

            <SecurityInfoCard title="2FA status" value="Disabled" />
          </div>

          <button
            type="button"
            className="mt-5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Update security settings
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable security info block card
 */
function SecurityInfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="text-slate-500">{value}</p>
    </div>
  );
}

type SettingToggleProps = {
  label: string;
  description: string;
  icon: ReactNode;
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

/**
 * SettingToggle Component
 * Used for notification preferences switches.
 */
function SettingToggle({
  label,
  description,
  icon,
  enabled,
  onToggle,
  disabled,
}: SettingToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="mt-1 text-slate-500">{icon}</div>

        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={`h-6 w-11 rounded-full px-1 transition disabled:cursor-not-allowed disabled:opacity-60 ${
          enabled ? "bg-[#3FA69E]" : "bg-slate-200"
        }`}
        aria-pressed={enabled}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white transition ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}