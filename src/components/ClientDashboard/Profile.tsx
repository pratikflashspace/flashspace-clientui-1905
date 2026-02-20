import React, { useState, useEffect } from "react";
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
  ShieldCheck,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import KYCVerification from "./KYCVerification";

// Profile data interfaces
interface ProfileDataState {
  fullName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  city: string;
  state: string;
  pincode: string;
  registeredAddress: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "personal" | "company" | "subscription"
  >("personal");
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
    businessNature: "",
  });

  // Fetch user profile and KYC data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Set profile data from auth context
        if (user) {
          setProfileData((prev) => ({
            ...prev,
            fullName: user.fullName || "",
            email: user.email || "",
            phone: user.phoneNumber || "",
          }));
        }

        // Fetch KYC data for business info
        const kycResponse = await userDashboardService.getKYC();
        if (kycResponse.success && kycResponse.data) {
          const kyc = Array.isArray(kycResponse.data)
            ? kycResponse.data[0]
            : kycResponse.data;
          setKycData(kyc);

          if (kyc.businessInfo) {
            setProfileData((prev) => ({
              ...prev,
              registeredAddress: kyc.businessInfo?.address || "",
            }));
            setBusinessInfoForm({
              companyName: kyc.businessInfo.companyName || "",
              companyType: kyc.businessInfo.companyType || "",
              gstNumber: kyc.businessInfo.gstNumber || "",
              panNumber: kyc.businessInfo.panNumber || "",
              cinNumber: kyc.businessInfo.cinNumber || "",
              address: kyc.businessInfo.address || "",
              businessNature: kyc.businessInfo.businessNature || "",
            });
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
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      // Update business info if KYC data exists
      if (kycData) {
        await userDashboardService.updateBusinessInfo({
          profileId: kycData._id,
          ...businessInfoForm,
          registeredAddress: profileData.registeredAddress, // Sync registered address
        });
        // Refresh data after save
        const kycResponse = await userDashboardService.getKYC();
        if (kycResponse.success && kycResponse.data) {
          const kyc = Array.isArray(kycResponse.data)
            ? kycResponse.data[0]
            : kycResponse.data;
          setKycData(kyc);
        }
      }
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData({ ...profileData, [field]: value });
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
      case "approved":
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
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            <FileText className="w-4 h-4" /> Draft
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
            <AlertCircle className="w-4 h-4" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
            <FileText className="w-4 h-4" /> Not Submitted
          </span>
        );
    }
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "company", label: "Company Details", icon: Building2 },
    { id: "subscription", label: "KYC Verification", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
            <div className="flex-1">
              <p className="text-red-700 font-medium">Error loading profile</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-24" />
              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
                  {/* Profile Image */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-yellow-100 flex items-center justify-center">
                          <User className="w-10 h-10 text-yellow-600" />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-500 transition-colors shadow-md">
                      <Camera className="w-4 h-4 text-black" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>

                  {/* Name and ID */}
                  <div className="text-center sm:text-left flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 font-[Poppins]">
                      Welcome back, {user?.fullName?.split(" ")[0] || "User"}!
                      👋
                    </h1>
                    <p className="text-gray-500 text-sm">
                      {kycData?.businessInfo?.companyName || "No company added"}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Client ID: {user?._id?.slice(-8).toUpperCase() || "N/A"}
                    </p>
                  </div>

                  {/* KYC Status */}
                  <div className="flex flex-col items-center sm:items-end gap-2">
                    {getKYCBadge(kycData?.overallStatus || "not_submitted")}
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" /> Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}{" "}
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                        >
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
              <div className="flex gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-yellow-400 text-black"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold font-[Poppins] text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-yellow-500" /> Personal
                    Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-yellow-500" /> Address
                      Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        ) : (
                          <p className="text-gray-900">
                            {profileData.registeredAddress}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          City
                        </label>
                        <p className="text-gray-900">{profileData.city}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          State
                        </label>
                        <p className="text-gray-900">{profileData.state}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Company Tab */}
              {activeTab === "company" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold font-[Poppins] text-gray-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-yellow-500" /> Company
                    Information
                  </h2>

                  {kycData ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            Business Nature
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={businessInfoForm.businessNature}
                              onChange={(e) =>
                                setBusinessInfoForm({
                                  ...businessInfoForm,
                                  businessNature: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                          ) : (
                            <p className="text-gray-900">
                              {kycData.businessInfo?.businessNature || "N/A"}
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
                              {kycData.businessInfo?.address || "N/A"}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Legal Documents */}
                      <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-yellow-500" /> Legal &
                          Tax Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-gray-50 p-4 rounded-lg">
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
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-xs text-gray-500 mb-1">
                              PAN Number
                            </label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={businessInfoForm.panNumber}
                                onChange={(e) =>
                                  setBusinessInfoForm({
                                    ...businessInfoForm,
                                    panNumber: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                              />
                            ) : (
                              <p className="text-gray-900 font-mono text-sm">
                                {kycData.businessInfo?.panNumber ||
                                  "Not provided"}
                              </p>
                            )}
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
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

              {/* Subscription Tab */}
              {/* Subscription Tab (now KYC Verification) */}
              {activeTab === "subscription" && (
                <div className="space-y-6">
                  <KYCVerification />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
