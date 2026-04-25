import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BusinessProfile {
  _id: string;
  companyName?: string;
  profileName?: string;
  updatedAt?: string;
  status?: string;
  gstNumber?: string;
  panNumber?: string;
  cinNumber?: string;
  companyType?: string;
  registeredAddress?: string;
}

interface BusinessKYCCardProps {
  profile: BusinessProfile;
  getStatusBadge: (status: string) => React.ReactNode;
}

const BusinessKYCCard: React.FC<BusinessKYCCardProps> = ({ profile, getStatusBadge }) => {
  const navigate = useNavigate();

  return (
    <div className="group bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[#35503F]/5 transition-all duration-500 overflow-hidden flex flex-col h-full border-l-4 border-l-[#35503F]">
      {/* Card Header */}
      <div className="p-6 bg-gradient-to-br from-[#35503F]/5 via-white to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#35503F]/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
        
        <div className="flex justify-between items-start relative z-10">
          <div className="min-w-0">
            <h4 className="text-lg font-black text-gray-900 line-clamp-1 tracking-tight">
              {profile.companyName || "N/A"}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-[#35503F]/10 text-[#35503F] text-[10px] font-bold rounded-md uppercase tracking-wider">
                {profile.profileName || "Business"}
              </span>
              <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                {new Date(profile.updatedAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
          {getStatusBadge(profile.status || "pending")}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 pt-2 space-y-5 flex-1 relative z-10">
        <div className="grid grid-cols-1 gap-4">
          {/* GST & CIN */}
          <div className="flex flex-col gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group-hover:bg-white group-hover:border-[#35503F]/20 transition-colors duration-300">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">GST Number</span>
              </div>
              <span className="text-sm font-bold text-gray-700 font-mono">
                {profile.gstNumber || "N/A"}
              </span>
            </div>
            
            {profile.panNumber && !["NA", "N/A"].includes(profile.panNumber.toUpperCase()) && (
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">PAN Number</span>
                </div>
                <span className="text-sm font-bold text-gray-700 font-mono">
                  {profile.panNumber}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">CIN Number</span>
              </div>
              <span className="text-sm font-bold text-gray-700 font-mono">
                {profile.cinNumber || "N/A"}
              </span>
            </div>
          </div>

          {/* Type & Address */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Company Type</span>
                <span className="text-sm font-bold text-gray-800">
                  {profile.companyType || "Not Specified"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Registered Address</span>
                <span className="text-sm text-gray-600 leading-relaxed line-clamp-2 italic font-medium">
                  {profile.registeredAddress || "Address not provided"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-6 pt-0 mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/kyc-requests/${profile._id}?type=businessinfo`);
          }}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-[20px] bg-gray-900 text-white hover:bg-[#35503F] transition-all duration-300 font-bold text-sm shadow-lg shadow-gray-200 hover:shadow-[#35503F]/20 group-hover:-translate-y-1"
        >
          View Complete Profile
        </button>
      </div>
    </div>
  );
};

export default BusinessKYCCard;
