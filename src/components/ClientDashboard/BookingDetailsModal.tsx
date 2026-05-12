import React, { useState, useEffect } from "react";
import { Booking } from "@/types/services";
import { 
  X, MapPin, FileText, Loader2, Download, Upload, Eye, CheckCircle, 
  AlertCircle, ChevronRight, Edit2, Check, ChevronDown, Ticket
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import userDashboardService from "@/services/userDashboard.service";
import toast from "react-hot-toast";
import { getUploadedFileUrl } from "@/utils/fileUrl";

interface BookingDetailsModalProps {
  booking: Booking;
  onClose: () => void;
  getWorkspaceDisplayName: (booking?: Booking | null) => string;
  getStatusConfig: (booking: Booking) => { bg: string; text: string; label: string; icon?: any };
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
}

export default function BookingDetailsModal({
  booking,
  onClose,
  getWorkspaceDisplayName,
  getStatusConfig,
  formatCurrency,
  formatDate,
}: BookingDetailsModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(() => {
    if (booking.status === 'active' || booking.partnerRequestStatus === 'completed') return 4;
    if (booking.partnerRequestStatus === 'submitted' || booking.partnerRequestStatus === 'in_review') return 3;
    return 1;
  });
  const [kycProfile, setKycProfile] = useState<any>(null);
  const [individualProfile, setIndividualProfile] = useState<any>(null);
  const [businessProfiles, setBusinessProfiles] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [loadingKyc, setLoadingKyc] = useState(true);

  // KYC specific states
  const [isEditingKyc, setIsEditingKyc] = useState(false);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [isPartnerDropdownOpen, setIsPartnerDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState<{ type: string; profileId: string } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchKyc = async () => {
      try {
        setLoadingKyc(true);
        const res = await userDashboardService.getKYC();
        if (res.success && res.data) {
          const profiles = Array.isArray(res.data) ? res.data : [res.data];
          
          // Identify the profile linked to the booking
          const linkedProfileId = typeof booking.kycProfile === 'string' 
            ? booking.kycProfile 
            : (booking.kycProfile as any)?._id || (booking as any).kycProfileId;

          const individualProf = profiles.find(p => p.kycType === 'individual' && !p.isPartner);
          const bizProfs = profiles.filter(p => p.kycType === 'business');
          const partnerProfs = profiles.filter(p => p.isPartner);

          // Find the profile that matches the linked ID from the booking
          let activeProfile = profiles.find(p => p._id === linkedProfileId);
          
          // CRITICAL: If this is a business booking (VirtualOffice) and we don't have a specific business linked 
          // (or it's linked to an individual profile), DEFAULT to the first business profile if available.
          const isBusinessBooking = booking.type === "VirtualOffice" || booking.type === "virtual_office";
          if (isBusinessBooking && (!activeProfile || activeProfile.kycType !== 'business') && bizProfs.length > 0) {
            console.log("[BookingDetailsModal] Defaulting to first business profile instead of individual/none");
            activeProfile = bizProfs[0];
          }

          setKycProfile(activeProfile || individualProf);
          setIndividualProfile(individualProf);
          setBusinessProfiles(bizProfs);
          setPartners(partnerProfs);

          // Initialize selected partners from the booking data if available
          if (booking.selectedPartners && Array.isArray(booking.selectedPartners)) {
            setSelectedPartners(booking.selectedPartners.map(id => typeof id === 'string' ? id : (id as any)._id));
          } else if ((booking as any).selectedPartnerIds && Array.isArray((booking as any).selectedPartnerIds)) {
            setSelectedPartners((booking as any).selectedPartnerIds);
          }
        }
      } catch (err) {
        console.error("Failed to load KYC", err);
      } finally {
        setLoadingKyc(false);
      }
    };
    fetchKyc();
  }, [booking]);

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleFinish = async () => {
    const isUpdating = booking.partnerRequestStatus === 'submitted' || booking.partnerRequestStatus === 'in_review';
    const bookingId = (booking as any)._id || booking.id || booking.bookingNumber;
    const toastId = toast.loading(isUpdating ? "Updating booking request..." : "Sending booking request to space partner...");
    
    const profileId = kycProfile?._id || (kycProfile as any)?.id;
    console.log(`[BookingDetailsModal] Finishing with profileId: ${profileId}`, kycProfile);
    
    const response = await userDashboardService.submitBookingRequest(bookingId, selectedPartners, profileId);
    if (response.success) {
      toast.success(isUpdating ? "Booking request updated" : "Booking request sent to space partner", { id: toastId });
      onClose();
    } else {
      toast.error(response.message || "Failed to send request", { id: toastId });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingDoc) return;

    const toastId = toast.loading(`Uploading ${uploadingDoc.type.replace('_', ' ')}...`);
    try {
      const isBookingAgreement = uploadingDoc.type.includes("agreement");
      const response = isBookingAgreement
        ? await userDashboardService.uploadBookingDocument(
            (booking as any)._id || booking.id || booking.bookingNumber,
            uploadingDoc.type,
            file,
          )
        : await userDashboardService.uploadKYCDocument(
            uploadingDoc.type,
            file,
            uploadingDoc.profileId
          );
      if (response.success) {
        toast.success("Document updated successfully", { id: toastId });
        if (isBookingAgreement && response.data) {
          const docs = [...(booking.documents || [])];
          const existingIndex = docs.findIndex((doc: any) => doc.type === uploadingDoc.type);
          if (existingIndex >= 0) docs[existingIndex] = response.data;
          else docs.push(response.data);
          (booking as any).documents = docs;
        }
        // Refresh KYC data
        const res = await userDashboardService.getKYC();
        if (res.success && Array.isArray(res.data)) {
          const profiles = res.data;
          const individualProf = profiles.find(p => p.kycType === 'individual' && !p.isPartner);
          const bizProfs = profiles.filter(p => p.kycType === 'business');
          
          setIndividualProfile(individualProf);
          setBusinessProfiles(bizProfs);
          setPartners(profiles.filter(p => p.isPartner));
          
          // Re-sync active profile
          if (kycProfile) {
            const updated = profiles.find(p => p._id === kycProfile._id);
            if (updated) setKycProfile(updated);
          }
        }
      } else {
        toast.error(response.message || "Upload failed", { id: toastId });
      }
    } catch (err) {
      toast.error("An error occurred during upload", { id: toastId });
    } finally {
      setUploadingDoc(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerUpload = (type: string, profileId: string) => {
    setUploadingDoc({ type, profileId });
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const togglePartnerSelection = (partnerId: string) => {
    setSelectedPartners(prev => 
      prev.includes(partnerId) 
        ? prev.filter(id => id !== partnerId)
        : [...prev, partnerId]
    );
  };

  // Helper to get document
  const getDoc = (type: string, profileType: 'main' | 'individual' | 'partner' = 'main', partnerId?: string) => {
    let profile = kycProfile;
    if (profileType === 'individual') profile = individualProfile || kycProfile;
    if (profileType === 'partner') profile = partners.find(p => p._id === (partnerId || selectedPartners[0]));

    if (!profile?.documents) return null;
    // Normalize type and check
    return profile.documents.find((d: any) => 
      d.type?.toLowerCase() === type.toLowerCase() || 
      d.name?.toLowerCase().includes(type.toLowerCase())
    );
  };

  const getBookingDoc = (type: string) => {
    // 1. Check booking documents first
    let doc = booking.documents?.find((d: any) => 
      d.type?.toLowerCase().includes(type.toLowerCase()) || 
      d.name?.toLowerCase().includes(type.toLowerCase())
    );

    // 2. Fallback to KYC profile documents (where user uploads them via the modal)
    if (!doc && kycProfile?.documents) {
      doc = kycProfile.documents.find((d: any) => 
        d.type?.toLowerCase().includes(type.toLowerCase()) || 
        d.name?.toLowerCase().includes(type.toLowerCase())
      );
    }
    
    return doc;
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">Booking ID</p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">{booking.bookingNumber}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">Plan</p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">{booking.plan.name}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">Start Date</p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">{formatDate(booking.startDate || "")}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">End Date</p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">{formatDate(booking.endDate || "")}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">Amount</p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">
            {formatCurrency(booking.plan.price)}/{booking.plan.tenure} {booking.plan.tenureUnit}
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
          <p className="text-xs text-gray-500 font-medium">City</p>
          <p className="text-sm font-bold text-gray-900 mt-0.5">{booking.spaceSnapshot?.city}</p>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-xl font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
        >
          Close
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-3 rounded-xl font-bold bg-[#35503F] text-[#FEF8C3] hover:bg-[#35503F]/90 transition-all flex items-center justify-center gap-2"
        >
          Next Step <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => {
    if (loadingKyc) {
      return (
        <div className="py-12 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#35503F] animate-spin mb-4" />
          <p className="text-sm text-gray-500">Loading KYC Details...</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            Verify your KYC documents for this booking. You can view or edit them below.
          </p>
        </div>

        {/* Profile Selector Tabs */}
        <div className="bg-gray-50 p-1.5 rounded-xl border border-gray-200 flex gap-2">
          <button
            onClick={() => {
              if (individualProfile) setKycProfile(individualProfile);
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              kycProfile?.kycType === 'individual' && !kycProfile?.isPartner
                ? 'bg-[#35503F] text-[#FEF8C3] shadow-md' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Individual Profile
          </button>
          
          <button
            onClick={() => {
              if (partners.length > 0) {
                if (!kycProfile?.isPartner) {
                  setKycProfile(partners[0]);
                }
              } else {
                toast.error("No partner profiles found.");
              }
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              kycProfile?.isPartner
                ? 'bg-[#35503F] text-[#FEF8C3] shadow-md' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Partner Profile
          </button>

          <button
            onClick={() => {
              if (businessProfiles.length > 0) {
                if (kycProfile?.kycType !== 'business') {
                  setKycProfile(businessProfiles[0]);
                }
              } else {
                toast.error("No business profile found.");
              }
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              kycProfile?.kycType === 'business' 
                ? 'bg-[#35503F] text-[#FEF8C3] shadow-md' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Business Profile
          </button>
        </div>

        {/* Individual Profile Content */}
        {kycProfile?.kycType === 'individual' && !kycProfile?.isPartner && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="font-bold text-gray-900 mb-3 border-b pb-2">Personal Documents</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "PAN Card", type: "pan_card" },
                { label: "Aadhar Card", type: "aadhaar" },
                { label: "Video KYC", type: "video_kyc" }
              ].map((docType) => {
                const doc = getDoc(docType.type, 'individual');
                return (
                  <div key={docType.type} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">{docType.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc?.fileUrl ? (
                        <div className="flex items-center gap-2">
                          {doc.partnerReviewStatus === 'rejected' && (
                            <div className="group relative">
                              <span className="text-[10px] text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-md font-black cursor-help">REJECTED</span>
                              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-[10px] rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95">
                                <div className="font-bold mb-1 text-red-400">Rejection Reason:</div>
                                {doc.partnerRejectionReason || "Please re-upload a clearer document."}
                                <div className="absolute top-full right-4 border-8 border-transparent border-t-gray-900" />
                              </div>
                            </div>
                          )}
                          <a 
                            href={getUploadedFileUrl(doc.fileUrl)} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border shadow-sm text-[#35503F] hover:bg-gray-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded-md">Missing</span>
                      )}
                      {isEditingKyc && (
                        <button 
                          onClick={() => triggerUpload(docType.type, individualProfile?._id || kycProfile?._id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border shadow-sm text-yellow-600 hover:bg-gray-50 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Partner Profile Content */}
        {kycProfile?.isPartner && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Partner Selection Dropdown */}
            <div className="relative">
              <h3 className="font-bold text-gray-900 mb-3 border-b pb-2 flex items-center justify-between">
                <span>Select Partners/Directors</span>
                {selectedPartners.length > 0 && (
                  <button 
                    onClick={() => setSelectedPartners([])}
                    className="text-xs font-medium text-red-500 hover:text-red-600"
                  >
                    Clear All
                  </button>
                )}
              </h3>
              
              <div className="relative">
                <button
                  onClick={() => setIsPartnerDropdownOpen(!isPartnerDropdownOpen)}
                  className="w-full flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium hover:border-gray-300 transition-all focus:ring-2 focus:ring-[#35503F]/20"
                >
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {selectedPartners.length === 0 ? (
                      <span className="text-gray-500">Choose partners...</span>
                    ) : (
                      selectedPartners.map(id => {
                        const p = partners.find(part => part._id === id);
                        return (
                          <span key={id} className="bg-[#35503F] text-[#FEF8C3] px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1">
                            {p?.profileName || p?.personalInfo?.fullName || "Partner"}
                          </span>
                        );
                      })
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isPartnerDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isPartnerDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsPartnerDropdownOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 py-2 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                      {partners.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 italic">No partners available</div>
                      ) : (
                        partners.map(p => {
                          const isSelected = selectedPartners.includes(p._id);
                          return (
                            <button
                              key={p._id}
                              onClick={() => {
                                togglePartnerSelection(p._id);
                                if (!isSelected) setKycProfile(p);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                            >
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                isSelected ? 'bg-[#35503F] border-[#35503F]' : 'bg-white border-gray-300'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className={`text-sm font-semibold ${isSelected ? 'text-[#35503F]' : 'text-gray-700'}`}>
                                {p.profileName || p.personalInfo?.fullName || "Partner"}
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Partner Documents for Each Selected Partner */}
            <div className="space-y-6 mt-4">
              {selectedPartners.map(partnerId => {
                const partner = partners.find(p => p._id === partnerId);
                if (!partner) return null;
                const partnerName = partner.profileName || partner.personalInfo?.fullName || "Partner";
                return (
                  <div key={partnerId} className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <h3 className="font-bold text-gray-900 mb-3 border-b pb-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#35503F]"></div>
                      Documents: <span className="text-[#35503F]">{partnerName}</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: "PAN Card", type: "pan_card" },
                        { label: "Aadhar Card", type: "aadhaar" }
                      ].map(docType => {
                        const doc = getDoc(docType.type, 'partner', partnerId);
                        return (
                          <div key={docType.type} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white transition-colors">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-700">{docType.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {doc?.fileUrl ? (
                                <div className="flex items-center gap-2">
                                  {doc.partnerReviewStatus === 'rejected' && (
                                    <div className="group relative">
                                      <span className="text-[10px] text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-md font-black cursor-help">REJECTED</span>
                                      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-[10px] rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95">
                                        <div className="font-bold mb-1 text-red-400">Rejection Reason:</div>
                                        {doc.partnerRejectionReason || "Please re-upload a clearer document."}
                                        <div className="absolute top-full right-4 border-8 border-transparent border-t-gray-900" />
                                      </div>
                                    </div>
                                  )}
                                  <a 
                                    href={getUploadedFileUrl(doc.fileUrl)} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border shadow-sm text-[#35503F] hover:bg-gray-50 transition-colors"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </a>
                                </div>
                              ) : (
                                <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded-md">Missing</span>
                              )}
                              {isEditingKyc && (
                                <button 
                                  onClick={() => triggerUpload(docType.type, partnerId)}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border shadow-sm text-yellow-600 hover:bg-gray-50 transition-colors"
                                >
                                  <Upload className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Business Profile Content */}
        {kycProfile?.kycType === 'business' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Business Selection Dropdown */}
            {businessProfiles.length > 1 && (
              <div className="relative">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Select Business Entity</p>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="w-full flex items-center justify-between p-3.5 bg-white border border-[#35503F]/20 rounded-xl text-sm font-bold text-[#35503F] shadow-sm hover:border-[#35503F] transition-all"
                >
                  <span>{kycProfile.profileName || kycProfile.businessInfo?.companyName}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileDropdownOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-2 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                      {businessProfiles.map(p => (
                        <button
                          key={p._id}
                          onClick={() => {
                            setKycProfile(p);
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-gray-50 transition-colors flex flex-col gap-0.5"
                        >
                          <span className={kycProfile?._id === p._id ? 'text-[#35503F]' : 'text-gray-700'}>
                            {p.profileName || p.businessInfo?.companyName}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">{p.businessInfo?.gstNumber || "No GST"}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="bg-[#35503F]/5 border border-[#35503F]/10 rounded-2xl p-4">
              <h4 className="text-[10px] font-bold text-[#35503F] uppercase tracking-wider mb-2 opacity-70">Business Information</h4>
              <div className="grid grid-cols-2 gap-y-3">
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">Company Name</p>
                  <p className="text-sm font-bold text-gray-900">{kycProfile.businessInfo?.companyName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">Company Type</p>
                  <p className="text-sm font-bold text-gray-900">{kycProfile.businessInfo?.companyType || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">GST Number</p>
                  <p className="text-sm font-bold text-gray-900">{kycProfile.businessInfo?.gstNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-medium">PAN Number</p>
                  <p className="text-sm font-bold text-gray-900">{kycProfile.businessInfo?.panNumber || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-gray-500 font-medium">Registered Address</p>
                  <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-relaxed">
                    {kycProfile.businessInfo?.registeredAddress || kycProfile.businessInfo?.address || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Business Documents */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 mb-3 border-b pb-2">Verify Business Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Certificate of Incorporation", type: "coi" },
                  { label: "Company PAN Card", type: "pan_card" },
                  { label: "GST Certificate", type: "gst_certificate" }
                ].map((docType) => {
                  const doc = getDoc(docType.type, 'main');
                  return (
                    <div key={docType.type} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{docType.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc?.fileUrl ? (
                          <div className="flex items-center gap-2">
                            {doc.partnerReviewStatus === 'rejected' && (
                              <div className="group relative">
                                <span className="text-[10px] text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-md font-black cursor-help">REJECTED</span>
                                <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-[10px] rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95">
                                  <div className="font-bold mb-1 text-red-400">Rejection Reason:</div>
                                  {doc.partnerRejectionReason || "Please re-upload a clearer document."}
                                  <div className="absolute top-full right-4 border-8 border-transparent border-t-gray-900" />
                                </div>
                              </div>
                            )}
                            <a 
                              href={getUploadedFileUrl(doc.fileUrl)} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border shadow-sm text-[#35503F] hover:bg-gray-50 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded-md">Missing</span>
                        )}
                        {isEditingKyc && (
                          <button 
                            onClick={() => triggerUpload(docType.type, kycProfile?._id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border shadow-sm text-yellow-600 hover:bg-gray-50 transition-colors"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={handlePrev}
            className="flex-1 py-3 rounded-xl font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
          >
            Back
          </button>
          {!isEditingKyc ? (
            <button
              onClick={() => setIsEditingKyc(true)}
              className="flex-1 py-3 rounded-xl font-bold border-2 border-[#35503F] text-[#35503F] hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" /> Edit
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEditingKyc(false);
                toast.success("Documents updated successfully");
              }}
              className="flex-1 py-3 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Submit
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-3 rounded-xl font-bold bg-[#35503F] text-[#FEF8C3] hover:bg-[#35503F]/90 transition-all flex items-center justify-center gap-2"
          >
            Next Step <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    const draftAgreement = getBookingDoc("draft_agreement");
    const signedAgreement = getBookingDoc("signed_agreement");

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            Review the draft agreement and upload a signed copy to proceed.
          </p>
        </div>

        {/* 1. Draft Agreement */}
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10"></div>
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</span>
            Check your Draft Agreement
          </h3>
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <FileText className="w-8 h-8 text-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">{draftAgreement?.name || "Draft_Agreement.pdf"}</p>
              <p className="text-xs text-gray-500 mt-0.5">Please review before signing</p>
            </div>
            {draftAgreement?.fileUrl ? (
              <div className="flex gap-2">
                <a 
                  href={getUploadedFileUrl(draftAgreement.fileUrl)} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2.5 rounded-lg bg-white border shadow-sm text-[#35503F] hover:bg-gray-50 transition-colors"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <span className="text-xs text-gray-400">Not Available</span>
            )}
          </div>
        </div>

        {/* 2. Upload Signed Agreement */}
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -z-10"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">2</span>
              Submit the Signed Agreement
            </h3>
            {signedAgreement && (
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                (signedAgreement.status === 'approved' || signedAgreement.partnerReviewStatus === 'approved') ? 'bg-green-100 text-green-700' : 
                (signedAgreement.status === 'rejected' || signedAgreement.partnerReviewStatus === 'rejected') ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {(signedAgreement.status === 'approved' || signedAgreement.partnerReviewStatus === 'approved') ? 'Approved' : 
                 (signedAgreement.status === 'rejected' || signedAgreement.partnerReviewStatus === 'rejected') ? 'Rejected' : 
                 'Pending Approval'}
              </span>
            )}
          </div>
          
          {signedAgreement ? (
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <FileText className="w-8 h-8 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{signedAgreement.name || "Signed_Agreement.pdf"}</p>
                <p className="text-xs text-gray-500 mt-0.5">Uploaded successfully</p>
              </div>
              <div className="flex gap-2">
                <a 
                  href={getUploadedFileUrl(signedAgreement.fileUrl)} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="p-2.5 rounded-lg bg-white border shadow-sm text-[#35503F] hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </a>
                <button 
                  onClick={() => triggerUpload('signed_agreement', kycProfile?._id)}
                  className="p-2.5 rounded-lg bg-white border shadow-sm text-yellow-600 hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => triggerUpload('signed_agreement', kycProfile?._id)}
              className="w-full p-8 border-2 border-dashed border-green-200 rounded-xl bg-green-50/50 hover:bg-green-50 transition-colors flex flex-col items-center justify-center gap-3"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Upload className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Click to upload signed document</p>
                <p className="text-xs text-gray-500 mt-1">PDF or Image up to 5MB</p>
              </div>
            </button>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={handlePrev}
            className="flex-1 py-3 rounded-xl font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
          >
            Back
          </button>
          <button
            onClick={handleFinish}
            className="flex-1 py-3 rounded-xl font-bold border border-[#35503F] text-[#35503F] hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> Update Request
          </button>
          <button
            onClick={handleNext}
            disabled={!(signedAgreement?.status === 'approved' || signedAgreement?.partnerReviewStatus === 'approved')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              (signedAgreement?.status === 'approved' || signedAgreement?.partnerReviewStatus === 'approved')
                ? "bg-[#35503F] text-[#FEF8C3] hover:bg-[#35503F]/90 shadow-lg"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next Step <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderStep4 = () => {
    const finalAgreement = getBookingDoc("final_agreement");
    const isApproved = !!finalAgreement || booking.status === 'active';

    const handleRaiseTicket = () => {
      navigate('/dashboard/support', { 
        state: { 
          bookingId: booking._id || booking.id, 
          bookingNumber: booking.bookingNumber,
          autoShowForm: true 
        } 
      });
    };

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Final Documents */}
        <div className={`bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm ${!isApproved ? 'opacity-70' : ''}`}>
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">1</span>
            Download Final Documents
          </h3>
          {!isApproved && (
            <p className="text-xs text-amber-600 font-medium mb-4 bg-amber-50 p-2 rounded-lg">
              Documents will be available once the partner approves your signed agreement.
            </p>
          )}
          <div className="space-y-3">
            {[
              { label: "Final Agreement", type: "final_agreement" },
              { label: "Utility Bill", type: "utility_bill" },
              { label: "NOC", type: "noc" },
              { label: "Other Supporting Documents", type: "other_support" }
            ].map((docType) => {
              const doc = getBookingDoc(docType.type);
              return (
                <div key={docType.type} className={`flex items-center justify-between p-3.5 bg-gray-50 border border-gray-100 rounded-xl transition-colors ${isApproved ? 'hover:border-gray-200' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${doc && isApproved ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className={`text-sm font-medium ${doc && isApproved ? 'text-gray-900' : 'text-gray-500'}`}>{docType.label}</span>
                  </div>
                  {doc && isApproved ? (
                    <a 
                      href={getUploadedFileUrl(doc.fileUrl)} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="p-2 rounded-lg bg-white border shadow-sm text-[#35503F] hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-md">
                      {isApproved ? 'Pending Upload' : 'Locked'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={handlePrev}
            className="flex-1 py-3 rounded-xl font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
          >
            Back
          </button>
          {booking.status === 'active' ? (
            <button
              onClick={handleRaiseTicket}
              className="flex-1 py-3 rounded-xl font-bold bg-[#FEF8C3] text-[#35503F] border border-[#35503F]/20 hover:bg-[#FEF8C3]/80 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Ticket className="w-4 h-4" /> Raise Ticket
            </button>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-2 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Ticket applicable after acceptance</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Section */}
        <div className="relative shrink-0">
          <img
            src={
              booking.spaceSnapshot?.images?.[0] ||
              booking.spaceSnapshot?.image ||
              "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400"
            }
            alt={getWorkspaceDisplayName(booking)}
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-end justify-between">
              <div>
                <span
                  className={`inline-block px-3 py-1 mb-2 rounded-full text-xs font-bold ${
                    booking.type === "VirtualOffice" || booking.type === "virtual_office"
                      ? "bg-white/20 text-white backdrop-blur-md border border-white/30"
                      : "bg-purple-500/20 text-purple-100 backdrop-blur-md border border-purple-400/30"
                  }`}
                >
                  {booking.type === "VirtualOffice" || booking.type === "virtual_office"
                    ? "Virtual Office"
                    : "Coworking"}
                </span>
                <h2 className="text-2xl font-bold text-white drop-shadow-md">
                  {getWorkspaceDisplayName(booking)}
                </h2>
                <p className="text-white/80 flex items-center gap-1.5 mt-1 text-sm font-medium">
                  <MapPin className="w-3.5 h-3.5" /> 
                  {booking.spaceSnapshot?.address}
                </p>
              </div>
              <div className="hidden sm:block text-right">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold shadow-sm ${getStatusConfig(booking).bg} ${getStatusConfig(booking).text}`}
                >
                  {getStatusConfig(booking).label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept=".pdf,.jpg,.jpeg,.png"
      />

      <div className="flex items-center justify-between">
            {['Booking Summary', 'KYC Documents', 'Draft Documents', 'Final Documents'].map((label, idx) => {
              const num = idx + 1;
              const isActive = step === num;
              const isPast = step > num;
              
              return (
                <React.Fragment key={num}>
                  <button 
                    onClick={() => setStep(num)}
                    className={`flex flex-col items-center transition-all ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-1.5 transition-all
                      ${isActive ? 'bg-[#35503F] text-[#FEF8C3] ring-4 ring-[#35503F]/20' : 
                        isPast ? 'bg-[#35503F] text-white' : 'bg-gray-200 text-gray-500'}`}
                    >
                      {isPast ? <Check className="w-4 h-4" /> : num}
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-700 text-center">{label}</span>
                  </button>
                  {num < 4 && (
                    <div className={`flex-1 h-1 rounded-full mx-1 sm:mx-4 ${isPast ? 'bg-[#35503F]' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

      </div>
    </div>
  );
}
