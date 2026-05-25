import { useState } from "react";
import { User } from "lucide-react";
import { NotificationBell } from "@/components/NotificationBell";
import Profile from "@/components/ClientDashboard/Profile";
import { useAuth } from "@/contexts/AuthContext";
import { getUploadedFileUrl } from "@/utils/fileUrl";

export function AffiliateHeaderActions() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useAuth();

  const initial = (user?.fullName || user?.firstName || user?.email || "U")
    .charAt(0)
    .toUpperCase();

  return (
    <>
      <div className="flex items-center gap-3">
        <NotificationBell
          buttonClassName="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDE6DD] bg-white text-[#36503F] shadow-sm transition-colors hover:bg-[#F0F4EE]"
          iconClassName="h-4 w-4"
        />
        <button
          type="button"
          onClick={() => setIsProfileOpen(true)}
          className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#36503F] text-white shadow-sm transition-opacity hover:opacity-90"
          title="Profile & KYC"
        >
          {user?.profilePicture ? (
            <img
              src={getUploadedFileUrl(user.profilePicture)}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-4 w-4" aria-label={initial} />
          )}
        </button>
      </div>

      {isProfileOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      <div
        className={`fixed right-0 top-0 z-[110] flex h-full w-full max-w-2xl transform flex-col bg-[#36503F] shadow-2xl transition-transform duration-300 ease-in-out ${
          isProfileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 p-6">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              Profile & <span className="italic text-[#fef8c5]">KYC</span>
            </h2>
            <p className="mt-1 text-sm font-medium text-[#fef8c5]/80">
              Manage your identity verification and profile details.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsProfileOpen(false)}
            className="rounded-xl p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <span className="sr-only">Close profile panel</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="custom-scrollbar flex-1 overflow-y-auto bg-[#f7f7f6]">
          <Profile hideCompanyDetails={true} isCompact={true} />
        </div>
      </div>
    </>
  );
}
