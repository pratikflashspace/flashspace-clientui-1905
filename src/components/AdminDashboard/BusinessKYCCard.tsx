import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Eye } from 'lucide-react';

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
    <div className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-all p-6 flex flex-col h-full">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-purple-600" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-foreground truncate">
              {profile.companyName || "N/A"}
            </h4>
            <p className="text-sm text-muted-foreground truncate">
              {profile.profileName || "Business Profile"}
            </p>
          </div>
        </div>
        {getStatusBadge(profile.status || "pending")}
      </div>

      {/* Card Body */}
      <div className="space-y-2 text-sm text-gray-600 mb-6 flex-grow">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">GST:</span>{" "}
          <span className="font-mono">{profile.gstNumber || "N/A"}</span>
        </div>
        {profile.panNumber && !["NA", "N/A"].includes(profile.panNumber.toUpperCase()) && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">PAN:</span>{" "}
            <span className="font-mono">{profile.panNumber}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">Type:</span>{" "}
          <span>{profile.companyType || "Not Specified"}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="font-medium text-foreground flex-shrink-0">Address:</span>{" "}
          <span className="line-clamp-2 italic">{profile.registeredAddress || "Address not provided"}</span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-4 border-t border-border">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/kyc-requests/${profile._id}?type=businessinfo`);
          }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#35503f] text-white hover:bg-[#2a4032] transition-all text-sm font-semibold shadow-md hover:shadow-lg hover:scale-[1.02]"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
      </div>
    </div>
  );
};

export default BusinessKYCCard;
