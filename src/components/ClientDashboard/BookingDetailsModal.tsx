import React, { useState, useEffect } from "react";
import { Booking } from "@/types/services";
import { 
  X, MapPin, FileText, Loader2, Download, Upload, Eye, CheckCircle, 
  AlertCircle, ChevronRight, Edit2, Check, ChevronDown
} from "lucide-react";
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
  const [step, setStep] = useState(1);
  const [kycProfile, setKycProfile] = useState<any>(null);
  const [individualProfile, setIndividualProfile] = useState<any>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [loadingKyc, setLoadingKyc] = useState(true);

  // KYC specific states
  const [isEditingKyc, setIsEditingKyc] = useState(false);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [isPartnerDropdownOpen, setIsPartnerDropdownOpen] = useState(false);
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

          const activeProfile = profiles.find(p => p._id === linkedProfileId) || profiles.find(p => p.kycType === 'business') || profiles.find(p => p.kycType === 'individual' && !p.isPartner);
          const individualProf = profiles.find(p => p.kycType === 'individual' && !p.isPartner);
          const partnerProfs = profiles.filter(p => p.isPartner);

          setKycProfile(activeProfile);
          setIndividualProfile(individualProf);
          setPartners(partnerProfs);

          if (partnerProfs.length > 0) {
            setSelectedPartners([partnerProfs[0]._id]);
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
    const bookingId = (booking as any)._id || booking.id || booking.bookingNumber;
    const toastId = toast.loading("Sending booking request to space partner...");
    const response = await userDashboardService.submitBookingRequest(bookingId);
    if (response.success) {
      toast.success("Booking request sent to space partner", { id: toastId });
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
          const linkedProfileId = booking.kycProfileId || booking.kycProfile?._id || booking.kycProfile;
          const activeProfile = profiles.find(p => p._id === linkedProfileId) || profiles.find(p => p.kycType === 'business') || profiles.find(p => p.kycType === 'individual' && !p.isPartner);
          setKycProfile(activeProfile);
          setIndividualProfile(profiles.find(p => p.kycType === 'individual' && !p.isPartner));
          setPartners(profiles.filter(p => p.isPartner));
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

        {/* Personal Documents */}
        <div>
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
                        <a 
                          href={getUploadedFileUrl(doc.fileUrl)} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border shadow-sm text-[#35503F] hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
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

        {kycProfile?.kycType === 'business' && (
          <>
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
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsPartnerDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 py-2 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                      {partners.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 italic">No partners available</div>
                      ) : (
                        partners.map(p => {
                          const isSelected = selectedPartners.includes(p._id);
                          return (
                            <button
                              key={p._id}
                              onClick={() => togglePartnerSelection(p._id)}
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
                              <a 
                                href={getUploadedFileUrl(doc.fileUrl)} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border shadow-sm text-[#35503F] hover:bg-gray-50 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
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

            {/* Business Documents */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 border-b pb-2">Verify Business Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Certificate of Incorporation", type: "coi" },
                  { label: "Company PAN Card", type: "pan_card" },
                  { label: "GST Certificate", type: "gst_certificate" },
                  { label: "Other Documents", type: "address_proof" }
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
                          <a 
                            href={getUploadedFileUrl(doc.fileUrl)} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border shadow-sm text-[#35503F] hover:bg-gray-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
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
          </>
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
            className="flex-1 py-3 rounded-xl font-bold bg-[#35503F] text-[#FEF8C3] hover:bg-[#35503F]/90 transition-all"
          >
            Next Step
          </button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    const draftAgreement = getBookingDoc("draft_agreement");
    const signedAgreement = getBookingDoc("signed_agreement");
    const finalAgreement = getBookingDoc("final_agreement");
    const isApproved = !!finalAgreement;

    return (
      <div className="space-y-8">
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
              <a 
                href={getUploadedFileUrl(draftAgreement.fileUrl)} 
                target="_blank" 
                rel="noreferrer" 
                className="p-2.5 rounded-lg bg-white border shadow-sm text-[#35503F] hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
              </a>
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
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {isApproved ? 'Approved' : 'Pending Approval'}
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

        {/* 3. Supporting Documents */}
        <div className={`bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm ${!isApproved ? 'opacity-70' : ''}`}>
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-xs font-bold">3</span>
            Download Supporting Documents
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
          <button
            onClick={handleFinish}
            className="flex-1 py-3 rounded-xl font-bold bg-[#35503F] text-[#FEF8C3] hover:bg-[#35503F]/90 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> Finish
          </button>
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
            {['Booking Summary', 'KYC Documents', 'Agreements'].map((label, idx) => {
              const num = idx + 1;
              const isActive = step === num;
              const isPast = step > num;
              
              return (
                <React.Fragment key={num}>
                  <div className={`flex flex-col items-center ${isActive ? 'opacity-100' : isPast ? 'opacity-70' : 'opacity-40 grayscale'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-1.5 transition-all
                      ${isActive ? 'bg-[#35503F] text-[#FEF8C3] ring-4 ring-[#35503F]/20' : 
                        isPast ? 'bg-[#35503F] text-white' : 'bg-gray-200 text-gray-500'}`}
                    >
                      {isPast ? <Check className="w-4 h-4" /> : num}
                    </div>
                    <span className="text-xs font-bold text-gray-700">{label}</span>
                  </div>
                  {num < 3 && (
                    <div className={`flex-1 h-1 rounded-full mx-4 ${isPast ? 'bg-[#35503F]' : 'bg-gray-200'}`} />
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
        </div>

      </div>
    </div>
  );
}
