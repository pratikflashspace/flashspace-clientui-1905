import { useEffect, useMemo, useState } from "react";
import { Mail, Phone, ShieldCheck, Building2, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { userDashboardService } from "@/services/userDashboard.service";



/**

 * Profile Page

 *

 * Shows:

 * - User basic info (name, role, email, phone)

 * - Contact details section

 * - Organization details section

 *

 * Backend-ready:

 * - Later company/location will come from backend user profile API.

 */

export default function Profile() {

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const canView = isAuthenticated;

  const [profile, setProfile] = useState<{ company?: string; location?: string } | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(false);



  /**

   * First letter for avatar.

   * If no name exists, fallback to "S".

   */

  const userInitial = useMemo(() => {

    return user?.fullName?.charAt(0).toUpperCase() || "S";

  }, [user?.fullName]);



  /**

   * Convert role label to readable text.

   * Example: "SPACE_PARTNER" -> "SPACE PARTNER"

   */

  const roleLabel = useMemo(() => {

    return user?.role ? user.role.replace(/_/g, " ") : "Partner";

  }, [user?.role]);



  useEffect(() => {

    const fetchProfile = async () => {

      if (!canView) return;

      setIsLoading(true);

      try {
        // Fetch KYC data to get company info
        const response = await userDashboardService.getKYC();

        if (response.success && response.data) {
          const data = Array.isArray(response.data) ? response.data[0] : response.data;

          if (data && data.businessInfo) {
            setProfile({
              company: data.businessInfo.companyName,
              location: data.businessInfo.registeredAddress,
            });
          }
        }

      } catch (error) {

        console.error("Failed to fetch space portal profile:", error);

      } finally {

        setIsLoading(false);

      }

    };



    if (!authLoading) {

      fetchProfile();

    }

  }, [authLoading, canView]);



  return (

    <div className="flex-1">

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Profile Card */}

        <div className="rounded-2xl border border-gray-200 bg-[#f8f8f8] p-6 shadow">

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

          {/* Contact Details */}

          <div className="rounded-2xl border border-gray-200 bg-[#f8f8f8] p-6 shadow">

            <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="font-sans text-lg font-bold text-slate-900">

              Contact Details

            </h2>



            <p className="text-sm text-slate-500">

              Keep your contact details up to date for client communication.

            </p>



            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

              <DetailField label="Full Name" value={user?.fullName || "Not set"} />

              <DetailField label="Email" value={user?.email || "Not set"} />

              <DetailField label="Phone" value={user?.phoneNumber || "Not set"} />

              <DetailField label="Role" value={roleLabel} />

            </div>

          </div>



          {/* Organization Details */}

          <div className="rounded-2xl border border-slate-200 bg-[#f8f8f8] p-6 shadow-sm">

            <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="font-sans text-lg font-bold text-slate-900">

              Organization Details

            </h2>



            <p className="text-sm text-slate-500">

              These details appear to clients on your space listings.

            </p>



            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

              <IconField

                icon={<Building2 size={16} className="text-slate-400" />}

                label="Company"

                value={

                  isLoading

                    ? "Loading..."

                    : profile?.company || "Not set"

                }

              />



              <IconField

                icon={<MapPin size={16} className="text-slate-400" />}

                label="Location"

                value={

                  isLoading

                    ? "Loading..."

                    : profile?.location || "Not set"

                }

              />

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



/**

 * Simple field block for Contact Details section

 */

function DetailField({ label, value }: { label: string; value: string }) {

  return (

    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

      <p className="text-xs font-semibold text-slate-500">{label}</p>

      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>

    </div>

  );

}



/**

 * Icon + label + value field block for Organization Details section

 */

function IconField({

  icon,

  label,

  value,

}: {

  icon: React.ReactNode;

  label: string;

  value: string;

}) {

  return (

    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

      {icon}

      <div>

        <p className="text-xs font-semibold text-slate-500">{label}</p>

        <p className="text-sm font-semibold text-slate-900">{value}</p>

      </div>

    </div>

  );

}