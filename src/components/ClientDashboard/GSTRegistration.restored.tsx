import React, { useState, useRef } from "react";
import { 
  CheckCircle2, FileText, ShieldCheck, Mail, AlertCircle, 
  UploadCloud, FileCheck2, Eye, MapPin, Loader2, ChevronRight,
  Download, Clock, Calendar, Activity, Info
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { gstRegistrationService, GstDocument, GstRegistration as GstRegType } from "@/services/gstRegistration.service";
import toast from "react-hot-toast";

const GSTRegistration: React.FC = () => {
  const { user } = useAuth();
  const kycApproved = user?.kycVerified || false;

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [registration, setRegistration] = useState<GstRegType | null>(null);
  const [documents, setDocuments] = useState<GstDocument[]>([]);
  const [currentStep, setCurrentStep] = useState(kycApproved ? 2 : 1);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadType, setActiveUploadType] = useState<string | null>(null);

  const fetchStatus = async (city: string, state: string) => {
    setIsLoading(true);
    const res = await gstRegistrationService.getStatus(city, state);
    setIsLoading(false);
    if (res.success) {
      setRegistration(res.data.registration);
      setDocuments(res.data.documents || []);
      
      let step = res.data.registration.currentStep || 1;
      if (step === 1 && kycApproved) step = 2;
      setCurrentStep(step);
    } else {
      toast.error(res.message);
    }
  };

  const getDoc = (type: string) => documents.find(d => d.type === type);
  const hasDoc = (type: string) => !!getDoc(type);

  const triggerUpload = (type: string) => {
    setActiveUploadType(type);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadType || !registration) return;

    setUploadingDoc(activeUploadType);
    const res = await gstRegistrationService.uploadDocument(registration._id, activeUploadType, file);
    setUploadingDoc(null);
    setActiveUploadType(null);
    
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (res.success) {
      toast.success("Document uploaded successfully");
      fetchStatus(selectedCity, selectedState);
    } else {
      toast.error(res.message);
    }
  };

  const handleSubmitApplication = async () => {
    if (!registration) return;
    setSubmitting(true);
    const res = await gstRegistrationService.submitApplication(registration._id);
    setSubmitting(false);
    
    if (res.success) {
      toast.success("Application submitted successfully");
      fetchStatus(selectedCity, selectedState);
    } else {
      toast.error(res.message);
    }
  };

  const hasQueryForStep = (stepId: number) => {
    if (!registration?.queries) return false;
    return registration.queries.some(q => q.step === stepId && !q.isResolved);
  };

  const getQueryForStep = (stepId: number) => {
    return registration?.queries?.find(q => q.step === stepId && !q.isResolved);
  };

  // Timeline Steps Configuration
  const steps = [
    { id: 1, title: "KYC Completed", icon: CheckCircle2 },
    { id: 2, title: "Documents Pending", icon: FileText },
    { id: 3, title: "Internal Verification", icon: FileCheck2 },
    { id: 4, title: "Application Submitted", icon: UploadCloud },
    { id: 5, title: "Government Verification", icon: ShieldCheck },
    { id: 6, title: "Query Raised", icon: AlertCircle, isDynamic: true },
    { id: 7, title: "GST Approved", icon: CheckCircle2 },
    { id: 8, title: "Certificate Issued", icon: Mail },
  ];

  // Logic to determine visible steps based on whether a query exists
  const hasActiveQuery = registration?.queries?.some(q => !q.isResolved) || false;
  const visibleSteps = steps.filter(s => !s.isDynamic || (s.isDynamic && hasActiveQuery));

  const totalSteps = visibleSteps.length;
  // Calculate index of current step
  const currentVisibleIndex = visibleSteps.findIndex(s => s.id === currentStep);
  const progressPercentage = Math.max(0, Math.min(100, Math.round(((currentVisibleIndex >= 0 ? currentVisibleIndex : 0) / (totalSteps - 1)) * 100)));

  // Location Cards Landing
  if (!hasStarted) {
    const locationCards = [
      { title: "GST Registration in Delhi", city: "Delhi", state: "Delhi", image: "/to_cloudinary/delhi_city_1782458486025.png" },
      { title: "GST Registration in Uttar Pradesh", city: "Noida", state: "Uttar Pradesh", image: "/newLogo/noida.jpg" },
      { title: "GST Registration in Bangalore", city: "Bangalore", state: "Karnataka", image: "/to_cloudinary/bangalore_city_1782458444683.png" },
      { title: "GST Registration in Maharashtra", city: "Mumbai", state: "Maharashtra", image: "/to_cloudinary/mumbai_city_1782458467763.png" }
    ];

    return (
      <div className="p-4 lg:p-8">
        <div className="max-w-[1400px] mx-auto min-h-[85vh]">
          <div className="text-left mb-8">
            <h1 className="text-[30px] font-extrabold tracking-tight mb-4">
              <span className="text-black">GST</span> <span className="text-[#36503F]">Registration</span>
            </h1>
            <p className="text-[#6B7280] text-[16px] max-w-xl">
              Select the city and state where you want to register for GST. You can track multiple registrations across different states.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {locationCards.map((card, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-xl overflow-hidden border border-[#D4E0D0] shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1"
                onClick={() => {
                  setSelectedCity(card.city);
                  setSelectedState(card.state);
                  setHasStarted(true);
                  fetchStatus(card.city, card.state);
                }}
              >
                <div className="h-40 overflow-hidden relative">
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-bold text-white text-lg leading-tight">{card.title}</h3>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-sm text-gray-500 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#35503F]" /> {card.state}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                     <span className="text-xs font-bold text-[#35503F] bg-[#FEF8CF] px-2 py-1 rounded">Start Registration</span>
                     <ChevronRight className="w-4 h-4 text-[#35503F]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && !registration) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[85vh] max-w-[1400px] mx-auto">
        <Loader2 className="w-8 h-8 text-[#35503F] animate-spin" />
      </div>
    );
  }

  const requiredDocuments = [
    { type: "coi", name: "Certificate of Incorporation" },
    { type: "pan", name: "Company PAN" },
    { type: "moa", name: "MOA / AOA" },
    { type: "photo", name: "Passport Size Photograph" },
  ];

  const currentStepTitle = visibleSteps.find(s => s.id === currentStep)?.title || "Unknown Status";

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-[1400px] mx-auto min-h-[85vh]">
        <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-[30px] font-extrabold text-[#35503F] tracking-tight mb-2">
                GST Registration Tracker
              </h1>
              <p className="text-gray-500 text-[16px] flex items-center gap-2">
                Tracking status for <strong className="text-gray-700">{selectedCity}, {selectedState}</strong>
                <button onClick={() => setHasStarted(false)} className="text-sm text-blue-600 hover:underline ml-2">
                  (Change)
                </button>
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase mb-1">Current Status</p>
              <h3 className="text-lg font-bold text-gray-900">{currentStepTitle}</h3>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase mb-1 flex justify-between">
                <span>Progress</span>
                <span className="text-[#35503F] font-bold">{progressPercentage}%</span>
              </p>
              <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                <div className="bg-[#35503F] h-2 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase mb-1">Estimated Completion</p>
              <h3 className="text-lg font-bold text-gray-900">5-7 Working Days</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Tracker (Left - 2 Columns) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-[#D4E0D0] shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 md:p-10">
              <div className="relative">
                {/* Main Vertical Line (Grey) */}
                <div className="absolute left-[31px] top-10 bottom-10 w-1 bg-gray-100 hidden md:block rounded-full z-0"></div>

                {/* Active Vertical Line (Green) */}
                <div 
                  className="absolute left-[31px] top-10 w-1 bg-[#35503F] hidden md:block rounded-full z-0 transition-all duration-500 ease-in-out"
                  style={{ 
                    height: `${(Math.max(0, currentVisibleIndex) / (totalSteps - 1)) * 100}%`
                  }}
                ></div>

                <div className="space-y-0">
                  {visibleSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = currentStep > step.id || (step.id === 1 && kycApproved);
                    const isActive = currentStep === step.id;
                    const isFuture = currentStep < step.id;
                    const isRejected = hasQueryForStep(step.id) || (step.id === 6 && hasActiveQuery);

                    // Colors
                    let iconBg = "bg-gray-100";
                    let iconColor = "text-gray-400";
                    let iconBorder = "border-gray-200";

                    if (isCompleted) {
                      iconBg = "bg-[#E6F3E6]";
                      iconColor = "text-[#35503F]";
                      iconBorder = "border-[#35503F]";
                    } else if (isRejected) {
                      iconBg = "bg-red-100";
                      iconColor = "text-red-600";
                      iconBorder = "border-red-600";
                    } else if (isActive) {
                      iconBg = "bg-[#FEF8CF]";
                      iconColor = "text-yellow-600";
                      iconBorder = "border-yellow-400";
                    }

                    return (
                      <div key={step.id} className="relative">
                        <div className={`relative flex flex-col md:flex-row gap-6 md:gap-8 z-10 ${isActive ? "py-8" : "py-6"}`}>
                          
                          {/* Icon Circle */}
                          <div className="flex flex-col items-center shrink-0">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${iconBg} ${iconBorder}`}>
                              <Icon className={`w-7 h-7 ${iconColor}`} />
                            </div>
                          </div>

                          {/* Step Content */}
                          <div className={`flex-1 ${isActive ? "pt-2" : "pt-4"}`}>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className={`text-xl font-bold ${isCompleted || isActive ? "text-[#1A1A1A]" : "text-gray-400"}`}>
                                {step.title}
                              </h3>
                              {isCompleted && !isRejected && (
                                <span className="px-2 py-1 bg-[#E6F3E6] text-[#35503F] text-xs font-bold rounded-md flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Completed
                                </span>
                              )}
                              {isActive && !isRejected && (
                                <span className="px-2 py-1 bg-[#FEF8CF] text-yellow-700 text-xs font-bold rounded-md flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> In Progress
                                </span>
                              )}
                            </div>

                            {/* Specific Step Content Rendering */}
                            
                            {/* Step 1: KYC */}
                            {step.id === 1 && (
                              <p className="text-[#6B7280] text-[15px]">
                                Your identity and business details have been verified successfully.
                              </p>
                            )}

                            {/* Step 2: Documents */}
                            {step.id === 2 && isActive && (
                              <div className="mt-4 animate-in fade-in slide-in-from-top-4">
                                <p className="text-[#6B7280] text-[15px] mb-4">
                                  Please upload the remaining documents to continue your GST registration.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {requiredDocuments.map((doc, idx) => {
                                    const uploaded = hasDoc(doc.type);
                                    const isUploading = uploadingDoc === doc.type;
                                    return (
                                      <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col justify-between">
                                        <div>
                                          <p className="font-semibold text-gray-800 text-sm">{doc.name}</p>
                                          <p className="text-xs text-gray-500 mt-1">PDF/JPG • Max 5 MB</p>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                          {uploaded ? (
                                            <span className="text-xs font-bold text-[#35503F] bg-[#E6F3E6] px-2 py-1 rounded flex items-center gap-1">
                                              <CheckCircle2 className="w-3 h-3" /> Uploaded
                                            </span>
                                          ) : (
                                            <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                              Pending
                                            </span>
                                          )}
                                          
                                          <button
                                            onClick={() => triggerUpload(doc.type)}
                                            disabled={isUploading}
                                            className="text-xs font-semibold text-[#35503F] hover:underline flex items-center gap-1 disabled:opacity-50"
                                          >
                                            {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
                                            {uploaded ? "Re-upload" : "Upload"}
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="mt-6 flex justify-end">
                                  <button
                                    onClick={handleSubmitApplication}
                                    disabled={submitting || requiredDocuments.some(d => !hasDoc(d.type))}
                                    className="bg-[#35503F] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#2a4032] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                  >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    Submit Application
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Step 3: Internal Verification */}
                            {step.id === 3 && isActive && (
                              <div className="mt-2 animate-in fade-in">
                                <p className="text-[#6B7280] text-[15px]">
                                  Our compliance team is reviewing your uploaded documents. This usually takes 1-2 business days.
                                </p>
                              </div>
                            )}

                            {/* Step 4: Application Submitted */}
                            {step.id === 4 && isActive && (
                              <div className="mt-2 animate-in fade-in">
                                <p className="text-[#6B7280] text-[15px] mb-3">
                                  Great! Your GST registration application has been successfully submitted to the GST portal.
                                </p>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 inline-block">
                                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Application Reference Number (ARN)</p>
                                  <p className="font-mono text-gray-900 font-bold tracking-wider">AA070725000XXXX</p>
                                </div>
                              </div>
                            )}

                            {/* Step 5: Government Verification */}
                            {step.id === 5 && isActive && (
                              <div className="mt-2 animate-in fade-in">
                                <p className="text-[#6B7280] text-[15px] mb-2">
                                  The GST department is reviewing your application.
                                </p>
                                <p className="text-sm font-semibold text-gray-700">Estimated processing time: 3–7 working days.</p>
                                
                                <div className="mt-6 bg-[#F8FAFC] border border-blue-100 rounded-xl p-4">
                                  <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                    <div>
                                      <h4 className="font-semibold text-gray-900 text-sm mb-1">What happens next?</h4>
                                      <p className="text-sm text-gray-600">
                                        The GST department reviews your application. If no additional information is required, your GSTIN will be generated automatically. If a clarification is needed, you'll receive a notification here and by email.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Step 6: Query Raised */}
                            {step.id === 6 && isRejected && (
                              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 animate-in fade-in">
                                <h4 className="font-bold text-red-800 mb-2">GST Officer has requested additional documents.</h4>
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-xs font-semibold text-red-600 uppercase">Reason</p>
                                    <p className="text-sm text-red-900 font-medium">Business address proof is unclear.</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-red-600 uppercase">Required</p>
                                    <p className="text-sm text-red-900 font-medium">Upload latest electricity bill.</p>
                                  </div>
                                  <div className="pt-2">
                                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition">
                                      Upload Response
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Step 7: GST Approved */}
                            {step.id === 7 && isCompleted && (
                              <div className="mt-4 animate-in fade-in">
                                <p className="text-[#6B7280] text-[15px] mb-4">
                                  Congratulations! Your GST registration has been approved by the GST Department.
                                </p>
                                <div className="flex gap-4">
                                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">GSTIN</p>
                                    <p className="font-mono text-gray-900 font-bold tracking-wider">09ABCDE1234F1Z5</p>
                                  </div>
                                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Approval Date</p>
                                    <p className="text-gray-900 font-bold">17 July 2026</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Step 8: Certificate Issued */}
                            {step.id === 8 && isActive && (
                              <div className="mt-4 animate-in fade-in">
                                <p className="text-[#6B7280] text-[15px] mb-4">
                                  Your GST Registration Certificate has been generated successfully.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                  <button className="flex items-center gap-2 bg-[#35503F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2a4032] transition">
                                    <Download className="w-4 h-4" /> Download Certificate
                                  </button>
                                  <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                                    <Download className="w-4 h-4" /> Download ARN
                                  </button>
                                </div>
                              </div>
                            )}

                          </div>
                        </div>

                        {/* Query Empty State between steps (Only show if no active query exists and we are at step 5 or above) */}
                        {step.id === 5 && !hasActiveQuery && (
                          <div className="relative flex items-center md:pl-[31px] md:py-4 pl-[32px] py-2">
                            <div className="absolute left-[31px] md:left-[31px] transform -translate-x-1/2 bg-white p-1 rounded-full z-10 opacity-60">
                              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                                <AlertCircle className="w-3 h-3 text-gray-400" />
                              </div>
                            </div>
                            <div className="ml-8 md:ml-12 p-4 rounded-xl border w-full bg-green-50/50 border-green-100 border-dashed transition-all duration-300">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-sm text-green-700">🎉 Everything looks good.</h4>
                              </div>
                              <p className="text-xs text-green-600 mt-1">
                                No action is required from your side. The GST officer has not requested any additional information.
                              </p>
                            </div>
                          </div>
                        )}
                        
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Cards (Right - 1 Column) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Important Dates */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#35503F]" /> Important Dates
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Application Created</p>
                  <p className="text-sm font-semibold text-gray-900">15 July</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Documents Uploaded</p>
                  <p className="text-sm font-semibold text-gray-900">{currentStep > 2 ? '16 July' : '-'}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Application Submitted</p>
                  <p className="text-sm font-semibold text-gray-900">{currentStep > 4 ? '17 July' : '-'}</p>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-sm font-medium text-[#35503F]">Expected Approval</p>
                  <p className="text-sm font-bold text-[#35503F]">22 July</p>
                </div>
              </div>
            </div>

            {/* Estimated Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#35503F]" /> Estimated Timeline
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">KYC</p>
                  <span className="text-xs font-bold text-[#35503F] bg-[#E6F3E6] px-2 py-1 rounded">Completed</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Documents</p>
                  <p className="text-sm font-semibold text-gray-900">Today</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Verification</p>
                  <p className="text-sm font-semibold text-gray-900">1-2 Days</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Govt Approval</p>
                  <p className="text-sm font-semibold text-gray-900">3-5 Days</p>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-sm font-medium text-[#35503F]">Certificate</p>
                  <p className="text-sm font-bold text-[#35503F]">Within 24 Hours</p>
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#35503F]" /> Activity Log
                </h3>
              </div>
              <div className="p-4">
                <div className="relative border-l border-gray-200 ml-3 space-y-6">
                  {currentStep >= 2 && hasDoc('photo') && (
                    <div className="relative pl-6">
                      <div className="absolute w-2 h-2 bg-[#35503F] rounded-full -left-[4.5px] top-1.5"></div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Today</p>
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-gray-800">Passport photo uploaded</p>
                        <p className="text-xs text-gray-500">10:45 AM</p>
                      </div>
                    </div>
                  )}
                  {currentStep >= 2 && hasDoc('pan') && (
                    <div className="relative pl-6">
                      <div className="absolute w-2 h-2 bg-gray-300 rounded-full -left-[4.5px] top-1.5"></div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Yesterday</p>
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-gray-800">Company PAN uploaded</p>
                        <p className="text-xs text-gray-500">4:10 PM</p>
                      </div>
                    </div>
                  )}
                  <div className="relative pl-6">
                    <div className="absolute w-2 h-2 bg-gray-300 rounded-full -left-[4.5px] top-1.5"></div>
                    <p className="text-xs text-gray-500 font-medium mb-0.5">Yesterday</p>
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-gray-800">KYC Approved</p>
                      <p className="text-xs text-gray-500">2:15 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default GSTRegistration;