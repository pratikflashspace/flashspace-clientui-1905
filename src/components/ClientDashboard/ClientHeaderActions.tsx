import { NotificationBell } from "@/components/NotificationBell";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function ClientHeaderActions() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const openProfileDrawer = () => {
    window.dispatchEvent(new Event("client-profile-drawer:open"));
  };
  
  return (
    <div className="flex items-center gap-4">
      <NotificationBell 
        buttonClassName="relative p-2.5 bg-white border border-[#edede6] shadow-sm rounded-xl text-gray-700 hover:text-[#36503F] hover:border-[#36503F]/30 transition-all hover:shadow-md"
        iconClassName="w-5 h-5"
      />
      <button 
        onClick={openProfileDrawer}
        className="w-11 h-11 rounded-full overflow-hidden border-2 border-transparent hover:border-[#36503F] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#36503F] focus:ring-offset-2 flex-shrink-0"
        title="Open Profile"
      >
        {user?.profilePicture ? (
          <img 
            src={user.profilePicture.startsWith('http') ? user.profilePicture : `${import.meta.env.VITE_API_URL || ''}${user.profilePicture}`} 
            alt="Profile" 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-[#35503F] text-[#FEF8C3] flex items-center justify-center font-bold text-lg">
            {user?.fullName?.charAt(0)?.toUpperCase() || 'C'}
          </div>
        )}
      </button>
    </div>
  );
}
