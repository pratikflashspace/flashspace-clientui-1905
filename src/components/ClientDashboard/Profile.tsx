import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { KYCData, Booking } from "@/types/services";
import userDashboardService from "@/services/userDashboard.service";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Shield,
  Edit3,
  Save,
  X,
  Camera,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  Eye,
  Trash2,
} from "lucide-react";
import { Country, State, City } from "country-state-city";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { cn } from "@/lib/utils";

import KYCVerification from "./KYCVerification";

// Profile data interfaces
interface ProfileDataState {
  fullName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  registeredAddress: string;
}

interface ProfileProps {
  hideCompanyDetails?: boolean;
  isCompact?: boolean;
  drawerMode?: boolean;
}

const Profile: React.FC<ProfileProps> = ({ hideCompanyDetails = false, isCompact = false, drawerMode = false }) => {
  const { user, updateUser, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "company" | "kyc">(
    "personal",
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState<ProfileDataState>({
    fullName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    city: "",
    state: "",
    country: "IN",
    pincode: "",
    registeredAddress: "",
  });

  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [businessInfoForm, setBusinessInfoForm] = useState({
    companyName: "",
    companyType: "",
    gstNumber: "",
    panNumber: "",
    cinNumber: "",
    address: "",
    industry: "",
  });

  const extractAddressFromKYC = (profile: KYCData | null | undefined) => {
    if (!profile) return "";
    return (
      profile.businessInfo?.registeredAddress ||
      profile.businessInfo?.address ||
      profile.personalInfo?.registeredAddress ||
      profile.personalInfo?.address ||
      (profile as any).registeredAddress ||
      (profile as any).address ||
      ""
    );
  };

  // Track whether we've done the initial data fetch to prevent infinite loops.
  // refreshProfile() updates `user` in AuthContext, which would re-trigger useEffect([user]),
  // creating an infinite loop that crashes iOS Safari with "Maximum call stack size exceeded".
  const hasFetchedRef = useRef(false);

  // Sync local form state from user object (lightweight, no API calls)
  const syncProfileFromUser = (currentUser: typeof user) => {
    if (!currentUser) return;
    setProfileData((prev) => ({
      ...prev,
      fullName: currentUser.fullName || "",
      email: currentUser.email || "",
      phone: currentUser.phoneNumber || (currentUser as any).phone || "",
      alternatePhone: (currentUser as any).alternatePhone || prev.alternatePhone || "",
      city: (currentUser as any).city || prev.city || "",
      state: (currentUser as any).state || prev.state || "",
      country: (currentUser as any).country || prev.country || "IN",
      pincode: (currentUser as any).pincode || prev.pincode || "",
      registeredAddress:
        (currentUser as any).address ||
        (currentUser as any).registeredAddress ||
        prev.registeredAddress ||
        "",
    }));
    if (currentUser.profilePicture) {
      setProfileImage(currentUser.profilePicture);
    }
  };

  // Fetch KYC + bookings data only once on mount
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Set profile data from auth context
        syncProfileFromUser(user);

        // Fetch KYC data for business info
        const kycResponse = await userDashboardService.getKYC();
        if (kycResponse.success && kycResponse.data) {
          const profiles = Array.isArray(kycResponse.data)
            ? kycResponse.data
            : [kycResponse.data];

          // Prefer profile with company name, then address, then approved/verified, then latest updated.
          const sortedProfiles = [...profiles].sort((a, b) => {
            const aHasCompany = Boolean(a.businessInfo?.companyName);
            const bHasCompany = Boolean(b.businessInfo?.companyName);
            if (aHasCompany !== bHasCompany) return Number(bHasCompany) - Number(aHasCompany);

            const aHasAddress = Boolean(extractAddressFromKYC(a));
            const bHasAddress = Boolean(extractAddressFromKYC(b));
            if (aHasAddress !== bHasAddress) return Number(bHasAddress) - Number(aHasAddress);

            const aIsApproved =
              a.overallStatus === "approved" || a.overallStatus === "verified";
            const bIsApproved =
              b.overallStatus === "approved" || b.overallStatus === "verified";
            if (aIsApproved !== bIsApproved) return Number(bIsApproved) - Number(aIsApproved);

            const aUpdatedAt = Date.parse((a as any).updatedAt || "") || 0;
            const bUpdatedAt = Date.parse((b as any).updatedAt || "") || 0;
            return bUpdatedAt - aUpdatedAt;
          });

          const kyc = sortedProfiles[0];

          if (kyc) {
            setKycData(kyc);

            // Populate form and profile data from KYC response.
            const fetchedAddress = extractAddressFromKYC(kyc);

            setProfileData((prev) => ({
              ...prev,
              registeredAddress: fetchedAddress || prev.registeredAddress || "",
              city: kyc.personalInfo?.city || (kyc as any).city || prev.city || "",
              state: kyc.personalInfo?.state || (kyc as any).state || prev.state || "",
              country: kyc.personalInfo?.country || (kyc as any).country || prev.country || "IN",
              pincode: kyc.personalInfo?.pincode || (kyc as any).pincode || prev.pincode || "",
            }));

            setBusinessInfoForm((prev) => ({
              companyName: kyc.businessInfo?.companyName || prev.companyName || "",
              companyType: kyc.businessInfo?.companyType || prev.companyType || "",
              address: kyc.businessInfo?.registeredAddress || fetchedAddress || prev.address || "",
              gstNumber: kyc.businessInfo?.gstNumber || prev.gstNumber || "",
              panNumber: kyc.businessInfo?.panNumber || prev.panNumber || "",
              cinNumber: kyc.businessInfo?.cinNumber || prev.cinNumber || "",
              industry: kyc.businessInfo?.industry || kyc.businessInfo?.businessNature || prev.industry || "",
            }));
          }
        }

        // Fetch active bookings for subscription info
        const bookingsResponse = await userDashboardService.getBookings({
          status: "active",
        });
        if (
          bookingsResponse.success &&
          bookingsResponse.data &&
          bookingsResponse.data.length > 0
        ) {
          setActiveBooking(bookingsResponse.data[0]);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When user object changes (e.g. after refreshProfile), only sync local form state — no API calls
  useEffect(() => {
    if (user) {
      syncProfileFromUser(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Refresh profile picture/cover image on mount (staggered to avoid race)
  useEffect(() => {
    const t1 = setTimeout(() => {
      refreshProfile();
    }, 500);

    const t2 = setTimeout(() => {
      refreshProfile();
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // 1. Update Personal Info (User model) - Reverted to basic fields to avoid 401 errors
      let profileUpdateResponse;
      try {
        profileUpdateResponse = await authService.updateProfile({
          fullName: profileData.fullName,
          phoneNumber: profileData.phone,
          alternatePhone: profileData.alternatePhone,
          address: profileData.registeredAddress,
          city: profileData.city,
          state: profileData.state,
          country: profileData.country,
          pincode: profileData.pincode,
        });

        if (profileUpdateResponse.success && profileUpdateResponse.data) {
          updateUser(profileUpdateResponse.data);
        } else {
          console.warn("Personal info update failed:", profileUpdateResponse.message);
        }
      } catch (err) {
        console.error("Personal info update exception:", err);
      }

      // 2. Update Business/Address info (Always attempt to save address details)
      const finalAddress = profileData.registeredAddress || businessInfoForm.address;
      
      console.log("DEBUG: Final Address from state:", finalAddress);
      
      const payload = {
        profileId: kycData?._id,
        ...businessInfoForm,
        registeredAddress: finalAddress, 
        address: finalAddress, 
        city: profileData.city,
        state: profileData.state,
        country: profileData.country,
        pincode: profileData.pincode,
        personalAddress: finalAddress,
        personalCity: profileData.city,
        personalState: profileData.state,
        personalCountry: profileData.country,
        personalPincode: profileData.pincode,
        personalPhone: profileData.phone,
        personalEmail: profileData.email,
        personalFullName: profileData.fullName,
        kycType: kycData?.kycType || "individual",
        personalInfo: {
          address: finalAddress,
          registeredAddress: finalAddress,
          city: profileData.city,
          state: profileData.state,
          country: profileData.country,
          pincode: profileData.pincode,
          phone: profileData.phone,
          fullName: profileData.fullName
        },
        businessInfo: {
          registeredAddress: finalAddress,
          address: finalAddress,
          companyName: businessInfoForm.companyName,
          companyType: businessInfoForm.companyType,
          industry: businessInfoForm.industry
        }
      };

      console.log("DEBUG: Sending KYC Payload:", payload);

      const kycUpdateResponse = await userDashboardService.updateBusinessInfo(payload);

      if (!kycUpdateResponse.success) {
        console.error("KYC/Address update failure:", kycUpdateResponse.message);
        // Throw here if KYC update is critical for the user's intent
        throw new Error(kycUpdateResponse.message || "Failed to update address details");
      } else if (kycUpdateResponse.data) {
        console.log("KYC/Address update success:", kycUpdateResponse.data);
        // Update kycData with new response
        setKycData(kycUpdateResponse.data);
      }

      // Keep UI state in sync immediately after save.
      setProfileData((prev) => ({
        ...prev,
        registeredAddress: finalAddress || prev.registeredAddress,
      }));
      setBusinessInfoForm((prev) => ({
        ...prev,
        address: finalAddress || prev.address,
      }));

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (err: any) {
      console.error("Error saving profile:", err);
      toast.error(err.message || "Failed to save profile changes");
    } finally {
      setSaving(false);
    }
  };

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      
      // Upload to server
      const response = await authService.uploadProfilePicture(file);
      
      if (response.success && response.data) {
        setProfileImage(response.data.profilePicture);
        
        // Sync local auth context
        if (user) {
          updateUser({ ...user, profilePicture: response.data.profilePicture });
        }
        
        toast.success("Profile picture updated");
      } else {
        toast.error(response.message || "Failed to upload image");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("An error occurred during upload");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setUploadingImage(true);
      const response = await authService.updateProfile({ profilePicture: "" });
      
      if (response.success) {
        setProfileImage(null);
        if (user) {
          updateUser({ ...user, profilePicture: "" });
        }
        toast.success("Profile picture removed");
      } else {
        toast.error(response.message || "Failed to remove image");
      }
    } catch (err) {
      console.error("Image removal error:", err);
      toast.error("An error occurred during removal");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phoneNumber || (user as any).phone || "",
        alternatePhone: (user as any).alternatePhone || "",
        city: (user as any).city || "",
        state: (user as any).state || "",
        country: (user as any).country || "IN",
        pincode: (user as any).pincode || "",
        registeredAddress:
          (user as any).address || (user as any).registeredAddress || "",
      });
    }

    if (kycData) {
      const fetchedAddress = extractAddressFromKYC(kycData);
      setBusinessInfoForm({
        companyName: kycData.businessInfo?.companyName || "",
        companyType: kycData.businessInfo?.companyType || "",
        address:
          kycData.businessInfo?.registeredAddress || fetchedAddress || "",
        gstNumber: kycData.businessInfo?.gstNumber || "",
        panNumber: kycData.businessInfo?.panNumber || "",
        cinNumber: kycData.businessInfo?.cinNumber || "",
        industry: kycData.businessInfo?.industry || kycData.businessInfo?.businessNature || "",
      });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getKYCBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
            <CheckCircle2 className="w-4 h-4" /> Verified
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-4 h-4" /> Pending
          </span>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "kyc", label: "KYC Verification", icon: ShieldCheck },
    ...(hideCompanyDetails ? [] : [{ id: "company", label: "Company Details", icon: Building2 }]),
  ];

  const [imagePreview, setImagePreview] = useState<{ url: string; title: string } | null>(null);

  return (
 <div className={`min-h-screen bg-gray-50 ${drawerMode ? 'p-2 text-[12px] [&_button]:text-xs [&_input]:h-8 [&_input]:text-xs [&_label]:text-[11px] [&_p]:text-xs [&_select]:h-8 [&_select]:text-xs [&_textarea]:text-xs' : isCompact ? 'py-4 px-3' : 'p-4 md:p-6 lg:p-8'}`}> 
      <div className={`mx-auto ${drawerMode ? 'max-w-none space-y-3' : isCompact ? 'max-w-3xl space-y-5' : 'max-w-4xl space-y-8'}`}>
        {/* Image Preview Modal */}
        {imagePreview && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setImagePreview(null)}
          >
            <button 
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[110]"
              onClick={() => setImagePreview(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center gap-4">
              <img 
                src={imagePreview.url} 
                alt={imagePreview.title} 
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl shadow-black/50"
                onClick={(e) => e.stopPropagation()}
              />
              <p className="text-white/80 font-bold text-lg tracking-wide">{imagePreview.title}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-10 h-10 text-[#35503F] animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-100 rounded-3xl p-8 flex flex-col items-center gap-4 text-center">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <div className="space-y-1">
              <p className="text-xl font-bold text-red-700">Error loading profile</p>
              <p className="text-red-600 font-medium">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-100 text-red-700 rounded-2xl font-bold hover:bg-red-200 transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Header Section */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${isCompact ? 'hidden' : ''}`}>
              <div className="space-y-1">
                <h1 style={{ fontFamily: "'Inter', sans-serif" }} className="font-sans text-3xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                    My <span className="text-[#36503F] italic">Profile</span>
                </h1>
                <p className="text-sm md:text-base text-gray-500 font-medium">
                  Manage your personal information and company details
                </p>
              </div>
            </div>

            {/* Profile Info Card */}
            <div className={`bg-white shadow-sm border border-gray-100 overflow-hidden ${isCompact ? 'rounded-2xl' : 'rounded-3xl'}`}>
            {/* Cover Image */}
            <div className={`${drawerMode ? 'h-20' : isCompact ? 'h-32' : 'h-48'} relative group/cover cursor-pointer overflow-hidden`}>
              {user?.coverImage ? (
                <img 
                  src={user.coverImage.startsWith('http') ? user.coverImage : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.coverImage}`} 
                  alt="Cover" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/cover:scale-110" 
                  onClick={() => setImagePreview({ 
                    url: user.coverImage!.startsWith('http') ? user.coverImage! : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.coverImage}`, 
                    title: "Cover Picture" 
                  })}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-[#35503F]/20 to-[#35503F]/5" />
              )}
              
              <div className="absolute inset-0 bg-black/0 group-hover/cover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover/cover:opacity-100" onClick={() => user?.coverImage && setImagePreview({ url: user.coverImage.startsWith('http') ? user.coverImage : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${user.coverImage}`, title: "Cover Picture" })}>
                <Eye className="w-8 h-8 text-white" />
              </div>
              
              <label className="absolute bottom-4 right-4 w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all shadow-lg text-[#35503F] z-20 group-hover/cover:scale-105">
                <Camera className="w-6 h-6" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      toast.loading("Uploading cover image...");
                      const res = await authService.uploadCoverImage(file);
                      if (res.success && res.data) {
                        updateUser({ ...user!, coverImage: res.data.coverImage });
                        toast.dismiss();
                        toast.success("Cover image updated");
                      } else {
                        toast.dismiss();
                        toast.error(res.message || "Upload failed");
                      }
                    } catch (err) {
                      toast.dismiss();
                      toast.error("Upload failed");
                    }
                  }} 
                />
              </label>
            </div>
              <div className={`${drawerMode ? 'px-3 pb-3' : 'px-4 sm:px-8 pb-4 sm:pb-8'}`}>
                <div className={`flex flex-col sm:flex-row items-center sm:items-end relative z-10 mt-2 ${drawerMode ? 'gap-2 sm:gap-3' : 'gap-4 sm:gap-6'}`}>
                  {/* Profile Image */}
                  <div className={`relative group ${drawerMode ? '-mt-8' : isCompact ? '-mt-12' : '-mt-16'}`}>
                    <div 
                      className={`${drawerMode ? 'w-16 h-16 rounded-2xl' : isCompact ? 'w-24 h-24 rounded-3xl' : 'w-32 h-32 rounded-3xl'} bg-white border-4 border-white shadow-xl overflow-hidden transition-transform group-hover:scale-[1.02] relative cursor-pointer`}
                      onClick={() => profileImage && setImagePreview({ 
                        url: profileImage.startsWith('http') ? profileImage : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${profileImage}`, 
                        title: "Profile Picture" 
                      })}
                    >
                      {profileImage ? (
                        <img 
                          src={profileImage.startsWith('http') ? profileImage : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${profileImage}`} 
                          alt="Profile" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Eye className="w-6 h-6 text-white" />
                      </div>

                      {uploadingImage && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[2px]">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <label className={cn(
                      "absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-gray-100 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all shadow-lg text-[#35503F]",
                      uploadingImage && "opacity-50 pointer-events-none"
                    )}>
                      <Camera className="w-5 h-5" />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>
                    {profileImage && (
                      <button 
                        onClick={handleRemoveImage}
                        disabled={uploadingImage}
                        className={cn(
                          "absolute top-0 right-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-500 hover:text-white transition-all shadow-md text-red-500 -mt-1 -mr-1 z-10",
                          uploadingImage && "opacity-50 pointer-events-none"
                        )}
                        title="Remove profile picture"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Name and ID */}
                  <div className="text-center sm:text-left flex-1 pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                      <h2 style={{ fontFamily: "'Inter', sans-serif" }} className={`font-sans ${drawerMode ? 'text-lg' : isCompact ? 'text-xl' : 'text-2xl'} font-extrabold text-[#35503F]`}>
                        {user?.fullName || "User Name"}
                      </h2>
                      {getKYCBadge((kycData as any)?.status || "not_submitted")}
                    </div>
                    {!hideCompanyDetails && (
                      <p className="text-gray-500 font-medium">
                        {kycData?.businessInfo?.companyName || "No company added"}
                      </p>
                    )}
                   <div className="flex flex-col">
                     <span className="font-semibold text-gray-900 break-words line-clamp-1">{user?.fullName || "Not Provided"}</span>
                     <span className="text-sm font-medium text-[#36503F]/70">
                       Client ID: {(user?._id || user?.id)?.slice(-8)?.toUpperCase() || "N/A"}
                     </span>
                   </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs and Actions */}
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center ${isCompact ? 'gap-2' : 'gap-4'}`}>
              <div
                className={`relative p-1 shadow-inner bg-gray-200/60 max-w-full whitespace-nowrap h-auto border border-gray-300/30 overflow-hidden ${drawerMode ? 'grid w-full max-w-[560px]' : 'flex w-fit'} ${isCompact ? 'rounded-xl' : 'rounded-2xl'}`}
                style={drawerMode ? { gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` } : undefined}
              >
                {drawerMode && (
                  <div 
                    className="absolute inset-y-1 left-1 z-0 rounded-xl bg-white shadow-lg ring-1 ring-black/5 transition-transform duration-300 ease-out"
                    style={{
                      width: `calc((100% - 8px) / ${tabs.length})`,
                      transform:
                        activeTab === "personal"
                          ? "translateX(0)"
                          : activeTab === "kyc"
                            ? "translateX(100%)"
                            : "translateX(200%)",
                    }}
                  />
                )}
                
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as typeof activeTab);
                      setIsEditing(false);
                    }}
                    className={`relative z-10 flex min-w-0 items-center justify-center gap-2 rounded-xl font-bold transition-colors duration-300 whitespace-nowrap ${isCompact ? 'px-2 py-1.5 text-xs' : 'px-6 py-2.5 text-sm'} ${
                      activeTab === tab.id
                        ? drawerMode ? "text-[#35503F] font-black" : "bg-white text-[#35503F] font-black shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <tab.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </div>

            </div>

            {/* Content */}
            <div className={`bg-white shadow-sm border border-gray-100 ${isCompact ? 'rounded-2xl p-3' : 'rounded-xl p-6'}`}>
              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <div className={isCompact ? "space-y-3" : "space-y-6"}>
                  <div className="flex items-center justify-between">
                    <h2 style={{ fontFamily: "'Inter', sans-serif" }} className={`font-sans font-semibold text-gray-900 flex items-center gap-2 ${isCompact ? 'text-sm' : 'text-lg'}`}>
                      <User className="w-5 h-5 text-[#35503F]" /> Personal
                      Information
                    </h2>
                    
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center justify-center gap-1.5 text-[#35503F] hover:bg-[#35503F]/5 px-3 py-1.5 rounded-lg font-semibold transition-all text-xs"
                      >
                        <Edit3 className="w-3 h-3" /> Edit Profile
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="inline-flex items-center justify-center gap-1.5 bg-[#35503F] text-[#FEF8C3] px-3 py-1.5 rounded-lg font-semibold hover:bg-[#35503F]/90 transition-all text-xs"
                        >
                          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="inline-flex items-center justify-center gap-1.5 bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-50 transition-all text-xs"
                        >
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className={`grid grid-cols-1 md:grid-cols-2 ${isCompact ? 'gap-3' : 'gap-6'}`}>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 focus:border-[#35503F] transition-all"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {profileData.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Email Address
                      </label>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {isEditing ? (
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 focus:border-[#35503F] transition-all"
                          />
                        ) : (
                          <p className="text-gray-900">{profileData.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Phone Number
                      </label>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {isEditing ? (
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 focus:border-[#35503F] transition-all"
                          />
                        ) : (
                          <p className="text-gray-900">{profileData.phone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Alternate Phone
                      </label>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {isEditing ? (
                          <input
                            type="tel"
                            value={profileData.alternatePhone}
                            onChange={(e) =>
                              handleInputChange(
                                "alternatePhone",
                                e.target.value,
                              )
                            }
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 focus:border-[#35503F] transition-all"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {profileData.alternatePhone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className={`${isCompact ? 'pt-3' : 'pt-4'} border-t border-gray-100`}>
                    <h3 style={{ fontFamily: "'Inter', sans-serif" }} className={`font-sans font-semibold text-gray-900 flex items-center gap-2 ${isCompact ? 'mb-2 text-sm' : 'mb-4 text-md'}`}>
                      <MapPin className="w-4 h-4 text-[#35503F]" /> Address
                      Details
                    </h3>
                    <div className={`grid grid-cols-1 md:grid-cols-2 ${isCompact ? 'gap-3' : 'gap-6'}`}>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-500 mb-1">
                          Registered Address
                        </label>
                        {isEditing ? (
                          <textarea
                            value={profileData.registeredAddress}
                            onChange={(e) =>
                              handleInputChange(
                                "registeredAddress",
                                e.target.value,
                              )
                            }
                            rows={2}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 focus:border-[#35503F] transition-all"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {profileData.registeredAddress || "N/A"}
                          </p>
                        )}
                      </div>
                      
                      {/* Pincode Field */}
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          Pincode
                        </label>
                        {isEditing ? (
                          <div className="relative">
                            <input
                              type="text"
                              maxLength={6}
                              value={profileData.pincode}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                handleInputChange("pincode", value);
                              }}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 focus:border-[#35503F] transition-all"
                            />
                          </div>
                        ) : (
                          <p className="text-gray-900">{profileData.pincode || "N/A"}</p>
                        )}
                      </div>
                      
                      {/* Country Field */}
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          Country
                        </label>
                        {isEditing ? (
                          <select
                            value={profileData.country}
                            onChange={(e) => {
                              handleInputChange("country", e.target.value);
                              handleInputChange("state", "");
                              handleInputChange("city", "");
                            }}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 focus:border-[#35503F] transition-all bg-white"
                          >
                            <option value="">Select Country</option>
                            {Country.getAllCountries().map((c) => (
                              <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-gray-900">
                            {Country.getCountryByCode(profileData.country || "IN")?.name || profileData.country || "N/A"}
                          </p>
                        )}
                      </div>

                      {/* State Field */}
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          State
                        </label>
                        {isEditing ? (
                          <select
                            value={profileData.state}
                            onChange={(e) => {
                              handleInputChange("state", e.target.value);
                              handleInputChange("city", ""); // Reset city when state changes
                            }}
                            disabled={!profileData.country}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 focus:border-[#35503F] transition-all bg-white disabled:opacity-50"
                          >
                            <option value="">Select State</option>
                            {profileData.country && State.getStatesOfCountry(profileData.country).map((s) => (
                              <option key={s.isoCode} value={s.name}>{s.name}</option>
                            ))}
                            {profileData.state && profileData.country && !State.getStatesOfCountry(profileData.country).find(s => s.name === profileData.state) && (
                              <option value={profileData.state}>{profileData.state}</option>
                            )}
                          </select>
                        ) : (
                          <p className="text-gray-900">{profileData.state || "N/A"}</p>
                        )}
                      </div>

                      {/* City Field */}
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          City
                        </label>
                        {isEditing ? (
                          <select
                            value={profileData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            disabled={!profileData.state || !profileData.country}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 focus:border-[#35503F] transition-all bg-white disabled:opacity-50"
                          >
                            <option value="">Select City</option>
                            {profileData.state && profileData.country && State.getStatesOfCountry(profileData.country).find(s => s.name === profileData.state)?.isoCode && (
                              City.getCitiesOfState(profileData.country, State.getStatesOfCountry(profileData.country).find(s => s.name === profileData.state)!.isoCode).map((c) => (
                                <option key={c.name} value={c.name}>{c.name}</option>
                              ))
                            )}
                            {profileData.city && profileData.state && profileData.country && State.getStatesOfCountry(profileData.country).find(s => s.name === profileData.state)?.isoCode && !City.getCitiesOfState(profileData.country, State.getStatesOfCountry(profileData.country).find(s => s.name === profileData.state)!.isoCode).find(c => c.name === profileData.city) && (
                              <option value={profileData.city}>{profileData.city}</option>
                            )}
                            {profileData.city && profileData.state && profileData.country && !State.getStatesOfCountry(profileData.country).find(s => s.name === profileData.state) && (
                              <option value={profileData.city}>{profileData.city}</option>
                            )}
                          </select>
                        ) : (
                          <p className="text-gray-900">{profileData.city || "N/A"}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Company Tab */}
              {activeTab === "company" && (
                <div className={isCompact ? "space-y-3" : "space-y-6"}>
                  <h2 style={{ fontFamily: "'Inter', sans-serif" }} className={`font-sans font-semibold text-gray-900 flex items-center gap-2 ${isCompact ? 'text-sm' : 'text-lg'}`}>
                    <Building2 className="w-5 h-5 text-[#35503F]" /> Company
                    Information
                  </h2>

                  {kycData ? (
                    <>
                      <div className={`grid grid-cols-1 md:grid-cols-2 ${isCompact ? 'gap-3' : 'gap-6'}`}>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">
                            Company Name
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={businessInfoForm.companyName}
                              onChange={(e) =>
                                setBusinessInfoForm({
                                  ...businessInfoForm,
                                  companyName: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                          ) : (
                            <p className="text-gray-900 font-medium">
                              {kycData.businessInfo?.companyName || "N/A"}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">
                            Company Type
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={businessInfoForm.companyType}
                              onChange={(e) =>
                                setBusinessInfoForm({
                                  ...businessInfoForm,
                                  companyType: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                          ) : (
                            <p className="text-gray-900">
                              {kycData.businessInfo?.companyType || "N/A"}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">
                            Industry
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={businessInfoForm.industry}
                              onChange={(e) =>
                                setBusinessInfoForm({
                                  ...businessInfoForm,
                                  industry: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                          ) : (
                            <p className="text-gray-900">
                              {kycData.businessInfo?.industry || kycData.businessInfo?.businessNature || "N/A"}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-gray-500 mb-1">
                            Address
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={businessInfoForm.address}
                              onChange={(e) =>
                                setBusinessInfoForm({
                                  ...businessInfoForm,
                                  address: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                          ) : (
                            <p className="text-gray-900">
                              {kycData.businessInfo?.registeredAddress || kycData.businessInfo?.address || "N/A"}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Legal Documents */}
                      <div className={`${isCompact ? 'pt-3' : 'pt-4'} border-t border-gray-100`}>
                        <h3 style={{ fontFamily: "'Inter', sans-serif" }} className={`font-sans font-semibold text-gray-900 flex items-center gap-2 ${isCompact ? 'mb-2 text-sm' : 'mb-4 text-md'}`}>
                          <Shield className="w-4 h-4 text-[#35503F]" /> Legal &
                          Tax Information
                        </h3>
                        <div className={`grid grid-cols-1 md:grid-cols-2 ${isCompact ? 'gap-3' : 'gap-6'}`}>
                          <div className={`bg-gray-50 rounded-lg ${isCompact ? 'p-3' : 'p-4'}`}>
                            <label className="block text-xs text-gray-500 mb-1">
                              GST Number
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={businessInfoForm.gstNumber}
                                onChange={(e) =>
                                  setBusinessInfoForm({
                                    ...businessInfoForm,
                                    gstNumber: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                              />
                            ) : (
                              <p className="text-gray-900 font-mono text-sm">
                                {kycData.businessInfo?.gstNumber ||
                                  "Not provided"}
                              </p>
                            )}
                          </div>
                          <div className={`bg-gray-50 rounded-lg ${isCompact ? 'p-3' : 'p-4'}`}>
                            <label className="block text-xs text-gray-500 mb-1">
                              CIN Number
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={businessInfoForm.cinNumber}
                                onChange={(e) =>
                                  setBusinessInfoForm({
                                    ...businessInfoForm,
                                    cinNumber: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                              />
                            ) : (
                              <p className="text-gray-900 font-mono text-sm">
                                {kycData.businessInfo?.cinNumber ||
                                  "Not provided"}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No company information added yet.</p>
                      <a
                        href="/dashboard/kyc"
                        className="text-yellow-600 hover:underline mt-2 inline-block"
                      >
                        Complete your KYC to add company details
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* KYC Tab */}
              {activeTab === "kyc" && (
                <div className="animate-fade-in">
                  <KYCVerification hideCompanyDetails={hideCompanyDetails} isCompact={isCompact} drawerMode={drawerMode} />
                </div>
              )}

              {/* Removed Subscription Tab entirely inside KYC update */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
