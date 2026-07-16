import React, { useState, useEffect } from "react";
import {
  FileText, ShieldCheck, Mail, CheckCircle2, AlertCircle,
  Eye, Loader2, ChevronRight, X, Clock, PlusCircle, Check, Send, Download
} from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { gstRegistrationPartnerService, GstRegistrationDetailsResponse } from "@/services/gstRegistrationPartner.service";
import { gstRegistrationService, GstRegistration, GstDocument, GstQuery, GstActivity, GstInternalNote } from "@/services/gstRegistration.service";
import { useAuth } from "@/contexts/AuthContext";
import { axiosInstance } from "@/lib/axios";

export const UnifiedGSTManagement: React.FC = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'partner'; // 'admin' | 'partner'

  const [registrations, setRegistrations] = useState<GstRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedRegistrationId, setSelectedRegistrationId] = useState<string | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<GstRegistrationDetailsResponse['data'] | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  // States for query
  const [queryMessage, setQueryMessage] = useState("");
  const [querySeverity, setQuerySeverity] = useState("Medium");
  const [queryCategory, setQueryCategory] = useState("Document");
  const [isRaisingQuery, setIsRaisingQuery] = useState(false);

  // States for Reject Action
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [isUploadingCert, setIsUploadingCert] = useState(false);
  const [certGstin, setCertGstin] = useState("");

  const fetchRegistrations = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const response = await gstRegistrationPartnerService.getAllRegistrations();
      if (response.success) {
        setRegistrations(response.data);
      } else {
        toast.error(response.message || "Failed to fetch registrations");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const fetchDetails = async (id: string, silent = false) => {
    if (!silent) setIsDetailsLoading(true);
    setSelectedRegistrationId(id);
    try {
      const response = await gstRegistrationPartnerService.getRegistrationDetails(id);
      if (response.success) {
        setSelectedDetails(response.data);
      } else {
        toast.error(response.message || "Failed to fetch details");
        setSelectedRegistrationId(null);
      }
    } catch (error) {
      toast.error("An error occurred");
      setSelectedRegistrationId(null);
    } finally {
      if (!silent) setIsDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    
    // Add 10-second polling to refresh registrations silently
    const interval = setInterval(() => {
      fetchRegistrations(true);
      if (selectedRegistrationId) {
        fetchDetails(selectedRegistrationId, true);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedRegistrationId]);

  const handleUpdateStatus = async (status: string, currentStep?: number) => {
    if (!selectedRegistrationId) return;
    try {
      const response = await gstRegistrationPartnerService.updateRegistrationStatus(selectedRegistrationId, status, currentStep);
      if (response.success) {
        toast.success("Status updated successfully");
        fetchDetails(selectedRegistrationId);
        fetchRegistrations();
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleRaiseQuery = async () => {
    if (!selectedRegistrationId || !queryMessage.trim()) return;
    setIsRaisingQuery(true);
    try {
      const response = await gstRegistrationPartnerService.addQuery(
        selectedRegistrationId, 
        queryMessage, 
        querySeverity, 
        queryCategory
      );
      if (response.success) {
        toast.success("Query raised successfully");
        setQueryMessage("");
        fetchDetails(selectedRegistrationId);
      } else {
        toast.error(response.message || "Failed to raise query");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsRaisingQuery(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRegistrationId || !rejectReason.trim()) return;
    try {
      const response = await gstRegistrationPartnerService.updateRegistrationStatus(selectedRegistrationId, 'rejected');
      if (response.success) {
        // Also raise a query or note about rejection
        await gstRegistrationPartnerService.addQuery(selectedRegistrationId, rejectReason, "High", "Other");
        toast.success("Application Rejected");
        setShowRejectInput(false);
        setRejectReason("");
        fetchDetails(selectedRegistrationId);
        fetchRegistrations();
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleResolveQueries = async () => {
    if (!selectedRegistrationId) return;
    try {
      const response = await gstRegistrationPartnerService.resolveQueries(selectedRegistrationId);
      if (response.success) {
        toast.success("User queries resolved!");
        fetchDetails(selectedRegistrationId);
      } else {
        toast.error(response.message || "Failed to resolve queries");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleChecklistUpdate = async (field: keyof GstRegistration['verificationChecklist'], value: boolean) => {
    if (!selectedRegistrationId) return;
    try {
      const response = await gstRegistrationPartnerService.updateChecklist(selectedRegistrationId, { [field]: value });
      if (response.success) {
        toast.success("Checklist updated");
        fetchDetails(selectedRegistrationId);
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#36503F] animate-spin" />
      </div>
    );
  }

  if (selectedRegistrationId && selectedDetails) {
    const { registration, documents } = selectedDetails;
    
    // Calculate checklist completion
    const checklist = registration.verificationChecklist || {};
    const totalChecks = 5;
    const completedChecks = Object.values(checklist).filter(v => v).length;
    const completionPercentage = Math.round((completedChecks / totalChecks) * 100);

    const hasQueriesUnderReview = registration.queries?.some(q => !q.isResolved && q.isUnderReview);

    return (
      <div className="space-y-6">
        <button 
          onClick={() => setSelectedRegistrationId(null)}
          className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to list
        </button>

        {/* Section 1: Status Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-sm text-gray-500 font-medium">Documents</p>
              <p className="text-lg font-bold text-gray-900">{documents.length} / 4 Uploaded</p>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Status</p>
              <p className="text-lg font-bold text-gray-900 capitalize">{registration.status.replace(/_/g, ' ')}</p>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Queries</p>
              <p className="text-lg font-bold text-gray-900">{registration.queries?.filter(q => !q.isResolved).length || 0} Active</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium text-right">Expected Approval</p>
            <p className="text-lg font-bold text-green-700">TBD</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section 2: Main Layout (Left Panel) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Applicant Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#36503F]" /> Applicant Information
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
                <div>
                  <p className="text-sm text-gray-500">Company Name</p>
                  <p className="font-semibold text-gray-900">{registration.companyName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Applicant</p>
                  <p className="font-semibold text-gray-900">{registration.user?.fullName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Application ID</p>
                  <p className="font-semibold text-gray-900">{registration.applicationId || 'Pending'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">GST Type</p>
                  <p className="font-semibold text-gray-900">{registration.gstType || 'Regular'}</p>
                </div>
                {registration.gstin && (
                  <div>
                    <p className="text-sm text-gray-500">GSTIN Number</p>
                    <p className="font-mono font-bold text-[#36503F]">{registration.gstin}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Business Type</p>
                  <p className="font-semibold text-gray-900">{registration.businessType || 'Private Limited'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-semibold text-gray-900">{registration.createdAt ? format(new Date(registration.createdAt), 'dd MMM yyyy') : 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Uploaded Documents */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#36503F]" /> Uploaded Documents
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {documents.map((doc, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900 capitalize">{doc.type}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <CheckCircle2 className="w-3 h-3 text-green-500" /> Uploaded
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        doc.status === 'rejected' ? 'bg-red-50 text-red-700' :
                        doc.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-auto">
                      <a href={doc.url} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded transition-colors">
                        <Eye className="w-4 h-4" /> View
                      </a>
                      <a href={doc.url} download className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded transition-colors">
                        <Download className="w-4 h-4" /> Download
                      </a>
                    </div>
                  </div>
                ))}
                {documents.length === 0 && (
                  <div className="col-span-full py-8 text-center text-gray-500">
                    No documents uploaded yet.
                  </div>
                )}
              </div>

                {/* Action Buttons below documents */}
                {(userRole === 'admin' || userRole === 'super_admin' || userRole === 'partner' || userRole === 'space_partner_manager') && registration.status !== 'approved' && registration.status !== 'rejected' && registration.status !== 'certificate_issued' && (
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Final Decision / Progression</h3>
                    <div className="flex flex-col gap-3">
                      {registration.currentStep >= 4 ? (
                        <div className="w-full sm:w-auto px-6 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg font-medium flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" /> Internal Verification Complete (Step 4)
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleUpdateStatus('admin_review', 4)}
                          className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                        >
                          Mark Internal Verification Complete (Step 4)
                        </button>
                      )}

                      {registration.currentStep >= 5 ? (
                        <div className="w-full sm:w-auto px-6 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg font-medium flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" /> Submitted to Gov (Step 5)
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleUpdateStatus('gov_submitted', 5)}
                          disabled={registration.currentStep < 4}
                          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Mark as Submitted to Gov (Step 5)
                        </button>
                      )}

                      {registration.currentStep >= 7 ? (
                        <div className="w-full sm:w-auto px-6 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg font-medium flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" /> Application Approved (Step 7)
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleUpdateStatus('approved', 7)}
                          disabled={registration.currentStep < 5}
                          className="w-full sm:w-auto px-6 py-2 bg-[#36503F] text-white rounded-lg hover:bg-[#2a3e31] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Approve Application (Step 7)
                        </button>
                      )}

                      {!showRejectInput ? (
                        <button 
                          onClick={() => setShowRejectInput(true)}
                          className="w-full sm:w-auto px-6 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium transition-colors"
                        >
                          Reject Application
                        </button>
                      ) : (
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex flex-col gap-3">
                          <label className="text-sm font-medium text-red-900">Reason for Rejection</label>
                          <input 
                            type="text" 
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="E.g., Documents are forged..."
                            className="w-full border-red-200 rounded-md focus:border-red-400 focus:ring-red-400 text-sm"
                          />
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => setShowRejectInput(false)}
                              className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={handleReject}
                              disabled={!rejectReason.trim()}
                              className="px-4 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            >
                              Confirm Reject
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {(userRole === 'admin' || userRole === 'super_admin' || userRole === 'partner' || userRole === 'space_partner_manager') && registration.status === 'approved' && (
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> Application Approved
                    </h3>
                  <p className="text-sm text-gray-600 mb-4">You can now issue the final GST certificate to the user.</p>
                  
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <label className="text-sm font-medium text-green-900 block mb-1">Assigned GSTIN</label>
                    <input 
                      type="text" 
                      value={certGstin}
                      onChange={(e) => setCertGstin(e.target.value)}
                      placeholder="e.g. 09ABCDE1234F1Z5"
                      className="w-full border-green-200 rounded-md focus:border-green-400 focus:ring-green-400 text-sm mb-4"
                    />
                    <label className="text-sm font-medium text-green-900 block mb-2">Upload Certificate</label>
                    <input 
                      type="file" 
                      id="certificateUpload"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!certGstin.trim()) {
                          toast.error("Please enter GSTIN first");
                          e.target.value = '';
                          return;
                        }
                        setIsUploadingCert(true);
                        
                        try {
                          const formData = new FormData();
                          formData.append("registrationId", registration._id);
                          formData.append("type", "certificate");
                          formData.append("file", file);
                          
                          const res = await axiosInstance.post("/gst-registration/upload", formData, {
                            headers: { "Content-Type": "multipart/form-data" }
                          });

                          if (res.data.success) {
                            // Certificate uploaded, update GSTIN in db
                            await gstRegistrationPartnerService.updateChecklist(registration._id, { gstin: certGstin });
                            
                            // Update status to certificate_issued and step to 8
                            await handleUpdateStatus("certificate_issued", 8);
                            toast.success("Certificate issued successfully!");
                            fetchDetails(registration._id, true);
                          } else {
                            toast.error(res.data.message || "Failed to upload certificate");
                          }
                        } catch (error: any) {
                          toast.error(error.response?.data?.message || "An error occurred during upload");
                        } finally {
                          setIsUploadingCert(false);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button 
                      onClick={() => document.getElementById('certificateUpload')?.click()}
                      disabled={isUploadingCert || !certGstin.trim()}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                      {isUploadingCert ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                      Issue Certificate (Step 8)
                    </button>
                  </div>
                </div>
              )}
              
              {registration.status === 'certificate_issued' && (
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <div className="bg-green-100 p-4 rounded-xl border border-green-200 text-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-bold text-green-800">Certificate Issued</h3>
                    <p className="text-sm text-green-700 mt-1">The user has received their GST Certificate.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Communication Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-[500px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#36503F]" /> Communication
                </h2>
                {hasQueriesUnderReview && (
                  <button 
                    onClick={handleResolveQueries}
                    className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-xs font-bold hover:bg-green-100 transition-colors"
                  >
                    ✓ Accept User Documents (Resolve Query)
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
                {registration.queries?.map((q, idx) => (
                  <div key={idx} className={`flex flex-col max-w-[80%] ${q.senderRole === 'user' ? 'self-start items-start' : 'self-end items-end ml-auto'}`}>
                    <span className="text-xs text-gray-500 mb-1 capitalize">
                      {q.senderRole || 'Admin'} • {q.createdAt ? format(new Date(q.createdAt), 'hh:mm a, dd MMM') : ''}
                    </span>
                    <div className={`p-3 rounded-2xl ${
                      q.senderRole === 'user' 
                        ? 'bg-gray-100 text-gray-800 rounded-tl-sm' 
                        : 'bg-[#36503F] text-[#FEF8CF] rounded-tr-sm'
                    }`}>
                      <p className="text-sm">{q.message}</p>
                      {q.category && (
                        <div className="mt-2 pt-2 border-t border-white/20 flex gap-2 text-xs opacity-80">
                          <span>{q.category}</span> • <span>{q.severity} Priority</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {!registration.queries?.length && (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    No communication history yet.
                  </div>
                )}
              </div>
              <div className="border-t border-gray-100 pt-4">
                <div className="flex gap-2 mb-2">
                  <select 
                    value={queryCategory}
                    onChange={(e) => setQueryCategory(e.target.value)}
                    className="text-sm border-gray-200 rounded-md focus:ring-[#36503F] focus:border-[#36503F]"
                  >
                    <option>Document</option>
                    <option>Address</option>
                    <option>PAN</option>
                    <option>Photo</option>
                    <option>Other</option>
                  </select>
                  <select 
                    value={querySeverity}
                    onChange={(e) => setQuerySeverity(e.target.value)}
                    className="text-sm border-gray-200 rounded-md focus:ring-[#36503F] focus:border-[#36503F]"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={queryMessage}
                    onChange={(e) => setQueryMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-full border-gray-200 focus:ring-[#36503F] focus:border-[#36503F] text-sm"
                  />
                  <button 
                    onClick={handleRaiseQuery}
                    disabled={isRaisingQuery || !queryMessage.trim()}
                    className="bg-[#36503F] text-[#FEF8CF] p-2 rounded-full hover:bg-[#2A3F31] disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            
          </div>

          {/* Section 3: Right Panel */}
          <div className="space-y-6">

            {/* Verification Checklist */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Verification</h3>
              <div className="space-y-3">
                {[
                  { key: 'coiVerified', label: 'COI Verified' },
                  { key: 'panVerified', label: 'PAN Verified' },
                  { key: 'addressVerified', label: 'Address Verified' },
                  { key: 'photoVerified', label: 'Photo Verified' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-[#36503F] border-gray-300 rounded focus:ring-[#36503F]" 
                      checked={!!checklist[item.key as keyof GstRegistration['verificationChecklist']]}
                      onChange={(e) => handleChecklistUpdate(item.key as any, e.target.checked)}
                    />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" /> Activity Log
              </h3>
              <div className="relative pl-3 space-y-4 before:absolute before:inset-y-0 before:left-3.5 before:w-px before:bg-gray-200">
                {registration.activityLog?.slice().reverse().map((log, idx) => (
                  <div key={idx} className="relative pl-5">
                    <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#36503F] ring-4 ring-white"></div>
                    <p className="text-sm font-medium text-gray-900">{log.action}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{log.description}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {log.timestamp ? format(new Date(log.timestamp), 'dd MMM yyyy, hh:mm a') : ''} • {log.actorRole}
                    </p>
                  </div>
                ))}
                {!registration.activityLog?.length && (
                  <p className="text-sm text-gray-500 pl-4">No activity recorded.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
            <tr>
              <th className="px-6 py-4">Application ID</th>
              <th className="px-6 py-4">Company Name</th>
              <th className="px-6 py-4">Applicant</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {registrations.map((reg) => (
              <tr key={reg._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{reg.applicationId || 'N/A'}</td>
                <td className="px-6 py-4">{reg.companyName || 'N/A'}</td>
                <td className="px-6 py-4">{reg.user?.fullName || 'N/A'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${
                    reg.status === 'approved' ? 'bg-green-50 text-green-700' :
                    reg.status === 'rejected' ? 'bg-red-50 text-red-700' :
                    'bg-yellow-50 text-yellow-700'
                  }`}>
                    {reg.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {reg.createdAt ? format(new Date(reg.createdAt), 'dd MMM yyyy') : 'N/A'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => fetchDetails(reg._id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#36503F] bg-[#FEF8CF] rounded-lg hover:bg-[#f5eebe] transition-colors"
                  >
                    Review <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {registrations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No GST applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
