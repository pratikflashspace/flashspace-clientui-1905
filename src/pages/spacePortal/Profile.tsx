import { useMemo } from "react";
import { Mail, Phone, ShieldCheck, Building2, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  const userInitial = useMemo(() => {
    if (user?.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    }
    return "S";
  }, [user?.fullName]);

  const roleLabel = user?.role ? user.role.replace(/_/g, " ") : "Partner";

  return (
    <div className="flex-1">
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3FA69E] text-xl font-bold text-white">
              {userInitial}
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">
                {user?.fullName || "Space Partner"}
              </p>
              <p className="text-sm text-slate-500">{roleLabel}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-slate-400" />
              <span>{user?.email || "Email not set"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-slate-400" />
              <span>{user?.phoneNumber || "Phone not set"}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            <ShieldCheck size={14} />
            {user?.isEmailVerified ? "Email verified" : "Email not verified"}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Contact Details</h2>
            <p className="text-sm text-slate-500">
              Keep your contact details up to date for client communication.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold text-slate-500">Full Name</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {user?.fullName || "Not set"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold text-slate-500">Email</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {user?.email || "Not set"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold text-slate-500">Phone</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {user?.phoneNumber || "Not set"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold text-slate-500">Role</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {roleLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Organization Details
            </h2>
            <p className="text-sm text-slate-500">
              These details appear to clients on your space listings.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Building2 size={16} className="text-slate-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Company
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    Not set
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <MapPin size={16} className="text-slate-400" />
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Location
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    Not set
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="mt-5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
