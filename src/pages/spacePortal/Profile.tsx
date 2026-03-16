import { useMemo } from "react";
import {
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  MapPin,
  User,
  Camera,
  Settings,
  ExternalLink,
  ShieldAlert,
  Calendar,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Profile() {
  const { user } = useAuth();

  const userInitial = useMemo(() => {
    return user?.fullName?.charAt(0).toUpperCase() || "S";
  }, [user?.fullName]);

  const roleLabel = useMemo(() => {
    return user?.role ? user.role.replace(/_/g, " ") : "Partner";
  }, [user?.role]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl">
            Partner <span className="text-primary italic">Profile</span>
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Manage your professional information and account security
          </p>
        </div>
        <Button className="bg-[#2D3F33] hover:bg-[#2D3F33]/90 text-[#FDE68A] font-bold rounded-xl shadow-lg transition-all active:scale-95 px-6">
          <Settings className="w-4 h-4 mr-2" />
          Account Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Card & Quick Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-background border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5 border-b border-border"></div>
            <div className="px-6 pb-6 -mt-12 text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-2xl bg-[#2D3F33] text-3xl font-extrabold text-[#FDE68A] flex items-center justify-center border-4 border-background shadow-xl">
                  {userInitial}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-lg shadow-lg hover:scale-105 transition-all">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4">
                <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                  {user?.fullName || "Space Partner"}
                </h2>
                <Badge
                  variant="outline"
                  className="mt-1 border-primary/20 text-primary font-bold uppercase text-[10px]"
                >
                  {roleLabel}
                </Badge>
              </div>

              <div className="mt-6 pt-6 border-t border-border space-y-4">
                <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                  {user?.email || "Email not set"}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors justify-center">
                  <Phone className="w-4 h-4 text-primary" />
                  {user?.phoneNumber || "Phone not set"}
                </div>
              </div>

              <div className="mt-6">
                {user?.isEmailVerified ? (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-100/50 border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-700">
                    <ShieldCheck className="w-4 h-4" />
                    VERIFIED PARTNER
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-amber-100/50 border border-amber-200 px-4 py-2 text-xs font-bold text-amber-700">
                    <ShieldAlert className="w-4 h-4" />
                    VERIFICATION PENDING
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Metrics */}
          <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-muted-foreground uppercase tracking-widest mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <StatRow icon={Building2} label="Listed Spaces" value="04" />
              <StatRow icon={Briefcase} label="Active Clients" value="12" />
              <StatRow icon={Calendar} label="Member Since" value="Mar 2024" />
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Sections */}
        <div className="lg:col-span-8 space-y-8">
          {/* Professional Details Section */}
          <div className="bg-background border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="text-xl font-extrabold text-foreground tracking-tight">
                  Professional Details
                </h3>
                <p className="text-sm text-muted-foreground mt-1 font-medium">
                  Your primary identification and contact information
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl font-bold border-border"
              >
                Edit
              </Button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField
                label="Legal Full Name"
                value={user?.fullName || "Not set"}
                icon={User}
              />
              <ProfileField
                label="Verified Email Address"
                value={user?.email || "Not set"}
                icon={Mail}
              />
              <ProfileField
                label="Mobile Number"
                value={user?.phoneNumber || "Not set"}
                icon={Phone}
              />
              <ProfileField
                label="Assigned Portal Role"
                value={roleLabel}
                icon={Settings}
              />
            </div>
          </div>

          {/* Organization Information */}
          <div className="bg-background border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="text-xl font-extrabold text-foreground tracking-tight">
                  Organization Profile
                </h3>
                <p className="text-sm text-muted-foreground mt-1 font-medium">
                  Public details visible to your clients and visitors
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl font-bold border-border"
              >
                Details
              </Button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField
                label="Company Name"
                value="FlashSpace Technologies"
                icon={Building2}
              />
              <ProfileField
                label="Headquarters"
                value="Mumbai, India"
                icon={MapPin}
              />
              <ProfileField
                label="Business License"
                value="Verified (ID: FS-9210)"
                icon={ShieldCheck}
              />
              <ProfileField
                label="Public Catalog"
                value="flashspace.io/partner"
                icon={ExternalLink}
                isLink
              />
            </div>
          </div>

          {/* Compliance & Security Preview */}
          <div className="bg-background border border-border rounded-2xl p-8 shadow-sm flex items-center justify-between border-l-4 border-l-primary/40">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground">
                  KYC Verification Status
                </h4>
                <p className="text-sm text-muted-foreground font-medium">
                  Your identification documents have been verified and secured.
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="rounded-xl font-bold text-primary hover:bg-primary/10"
            >
              View Documents
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({
  label,
  value,
  icon: Icon,
  isLink,
}: {
  label: string;
  value: string;
  icon: any;
  isLink?: boolean;
}) {
  return (
    <div className="group p-4 rounded-2xl border border-transparent hover:border-border hover:bg-muted/30 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="mt-1 p-2 rounded-lg bg-muted border border-border text-muted-foreground group-hover:text-primary transition-colors">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
            {label}
          </p>
          <p
            className={`text-base font-bold text-foreground tracking-tight ${isLink ? "text-primary hover:underline cursor-pointer" : ""}`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">
          {label}
        </span>
      </div>
      <span className="text-sm font-extrabold text-foreground">{value}</span>
    </div>
  );
}
