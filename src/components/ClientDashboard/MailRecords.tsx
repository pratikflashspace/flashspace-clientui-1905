import React, { useState, useEffect } from "react";
import userDashboardService from "@/services/userDashboard.service";
import { MailRecord } from "@/types/services";
import {
  Mail,
  Search,
  Clock,
  FileText,
  Filter,
  Loader2,
  AlertCircle,
  RefreshCw,
  MapPin,
  CheckCircle2,
  Navigation,
  ExternalLink,
  ChevronRight,
  Package,
  Send,
  Inbox,
  ArrowRight,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { API_CONFIG } from "@/config/api.config";
import { toast } from "react-hot-toast";
import { mailService } from "@/services/mailService";
import { getUploadedFileUrl } from "@/utils/fileUrl";

export default function MailRecords() {
  const [mails, setMails] = useState<MailRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"received" | "forwarded" | "collected">("received");
  const [forwardingIds, setForwardingIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    limit: 10
  });
  const [stats, setStats] = useState({
    pending: 0,
    forwarded: 0,
    collected: 0
  });

  const fetchMails = async (pageNumber = page) => {
    setLoading(true);
    try {
      const response = await userDashboardService.getUserMails({ page: pageNumber, limit: 10 });
      console.log("Frontend Mail Response (DEBUG V):", (response as any).debug_v, response);
      if (response.success && response.data) {
        setMails(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
        const apiStats = (response as any).stats;
        if (apiStats) {
          setStats({
            pending: apiStats.pending || 0,
            forwarded: apiStats.forwarded || 0,
            collected: apiStats.collected || 0
          });
        }
      } else {
        setError(response.message || "Failed to load mail records");
      }
    } catch (err) {
      setError("Failed to load mail records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMails(page);
  }, [page]);

  const handleForward = async (id: string) => {
    if (forwardingIds.has(id)) return;
    
    setForwardingIds(prev => new Set(prev).add(id));
    try {
      const response = await mailService.updateStatus(id, "Forwarded");
      if (response.success) {
        toast.success("Forward request sent successfully!");
        // Update client decision locally
        setMails(prev => prev.map(m => m._id === id ? { ...m, clientDecision: "Forward Requested" } : m));
      } else {
        toast.error(response.message || "Failed to send forward request");
      }
    } catch (err) {
      toast.error("Failed to send forward request");
    } finally {
      setForwardingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleMarkAsCollected = async (id: string) => {
    try {
      const response = await mailService.updateStatus(id, "Collected");
      if (response.success) {
        toast.success("Marked as collected!");
        setMails(prev => prev.map(m => m._id === id ? { ...m, userCollectedStatus: "Collected" } : m));
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filteredMails = mails.filter((m) => {
    const matchSearch =
      searchQuery === "" ||
      m.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mailId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.space.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchTab = 
      activeTab === "collected" ? (m.status === "Collected" || m.userCollectedStatus === "Collected") :
      activeTab === "forwarded" ? ((m.status === "Forwarded" || m.clientDecision === "Forward Requested") && m.userCollectedStatus !== "Collected" && m.status !== "Collected") :
      (m.status === "Pending Action" && m.clientDecision !== "Forward Requested" && m.userCollectedStatus !== "Collected" && m.status !== "Collected");
    
    return matchSearch && matchTab;
  });

  const getStatusBadge = (mail: MailRecord) => {
    const { status, clientDecision, userCollectedStatus } = mail;
    
    if (status === "Collected" || userCollectedStatus === "Collected") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          <CheckCircle2 className="w-3 h-3" />
          Collected
        </span>
      );
    }

    if (status === "Forwarded" || clientDecision === "Forward Requested") {
      return (
        <div className="flex flex-col gap-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 w-fit">
            <Send className="w-3 h-3" />
            Forward Requested
          </span>
        </div>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 w-fit">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM dd, yyyy");
    } catch (e) {
      return dateStr;
    }
  };

  const resolveDocumentUrl = (documentUrl?: string) => {
    return getUploadedFileUrl(documentUrl);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#35503F] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading mail records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-3xl font-extrabold text-[#35503F] tracking-tight">
              Mail Records
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-medium">
              Track all mail and parcels received at your virtual office
            </p>
          </div>
          <a
            href="/services/virtual-office"
            className="inline-flex items-center justify-center gap-2 bg-[#35503F] text-[#FEF8C3] px-8 py-3.5 rounded-2xl font-bold hover:bg-[#35503F]/90 transition-all shadow-md active:scale-95 text-center"
          >
            <span className="text-xl">+</span>
            Book New Space
          </a>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 transition-all hover:shadow-lg border-l-4 border-l-yellow-400">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pending Pickup</p>
            <p className="text-3xl font-extrabold text-[#35503F]">{stats.pending}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 transition-all hover:shadow-lg border-l-4 border-l-blue-400">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Forwarded</p>
            <p className="text-3xl font-extrabold text-[#35503F]">{stats.forwarded}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 transition-all hover:shadow-lg border-l-4 border-l-green-400">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Collected</p>
            <p className="text-3xl font-extrabold text-[#35503F]">{stats.collected}</p>
          </div>
        </div>

        {/* Navigation Tabs and Search */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 items-stretch lg:items-center">
          <div className="relative flex p-1 bg-gray-200/60 shadow-inner rounded-2xl border border-gray-300/30 overflow-hidden lg:w-[600px]">
            {/* Sliding Indicator */}
            <div 
              className="absolute inset-y-1 transition-all duration-300 ease-out bg-white rounded-xl shadow-lg ring-1 ring-black/5"
              style={{
                left: activeTab === "received" ? "4px" : activeTab === "forwarded" ? "calc(33.33% + 4px)" : "calc(66.66% + 4px)",
                width: "calc(33.33% - 8px)"
              }}
            />
            
            <button
              onClick={() => { setActiveTab("received"); setPage(1); }}
              className={`relative z-10 flex-1 px-4 py-2.5 rounded-xl text-sm transition-colors duration-300 ${
                activeTab === "received" ? "text-[#35503F] font-black" : "text-gray-500 font-bold hover:text-gray-700"
              }`}
            >
              Received Mail
            </button>
            <button
              onClick={() => { setActiveTab("forwarded"); setPage(1); }}
              className={`relative z-10 flex-1 px-4 py-2.5 rounded-xl text-sm transition-colors duration-300 ${
                activeTab === "forwarded" ? "text-[#35503F] font-black" : "text-gray-500 font-bold hover:text-gray-700"
              }`}
            >
              Forwarded Mail
            </button>
            <button
              onClick={() => { setActiveTab("collected"); setPage(1); }}
              className={`relative z-10 flex-1 px-4 py-2.5 rounded-xl text-sm transition-colors duration-300 ${
                activeTab === "collected" ? "text-[#35503F] font-black" : "text-gray-500 font-bold hover:text-gray-700"
              }`}
            >
              Collected Mail
            </button>
          </div>

          <div className="relative lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sender, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-[#35503F]/10 text-sm font-medium transition-all"
            />
          </div>
        </div>

        {/* Mails Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Sender</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Office</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider">Received</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Document</th>
                  {activeTab !== "collected" && (
                    <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {filteredMails.length === 0 ? (
                  <tr>
                    <td colSpan={activeTab === "collected" ? 7 : 8} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                          <Mail className="w-8 h-8 text-gray-300" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-bold text-lg">No records found</p>
                          <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
                            We couldn't find any mail matching your current search or filters.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMails.map((mail) => (
                    <tr key={mail._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">{mail.mailId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-700">{mail.sender}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500 font-medium">{mail.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500 font-medium line-clamp-1 max-w-[150px]" title={mail.space}>
                          {mail.space}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500 font-medium">{formatDate(mail.received)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {getStatusBadge(mail)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {mail.documentUrl ? (
                          <button
                            onClick={() => window.open(resolveDocumentUrl(mail.documentUrl), "_blank")}
                            title="View Document"
                            className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-[#35503F] hover:bg-gray-100 rounded-lg transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                      {activeTab !== "collected" && (
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            {mail.status !== "Collected" && (
                              <div className="flex gap-2">
                                {mail.clientDecision !== "Forward Requested" && mail.status === "Pending Action" && (
                                  <button 
                                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95 whitespace-nowrap"
                                    onClick={() => handleForward(mail._id)}
                                    disabled={forwardingIds.has(mail._id)}
                                  >
                                    {forwardingIds.has(mail._id) ? (
                                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : null}
                                    Please Forward
                                  </button>
                                )}
                                {(mail.clientDecision === "Forward Requested" || mail.status === "Forwarded") && mail.userCollectedStatus !== "Collected" && (
                                  <button 
                                    className="inline-flex items-center px-4 py-2 bg-[#35503F] text-[#FEF8C3] rounded-xl text-sm font-bold hover:bg-[#35503F]/90 transition-all shadow-sm active:scale-95 whitespace-nowrap"
                                    onClick={() => handleMarkAsCollected(mail._id)}
                                  >
                                    Collected
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
              <p className="text-sm text-gray-500 font-medium">
                Showing <span className="font-bold text-gray-900">{(page - 1) * pagination.limit + 1}</span> to{" "}
                <span className="font-bold text-gray-900">{Math.min(page * pagination.limit, pagination.total)}</span> of{" "}
                <span className="font-bold text-gray-900">{pagination.total}</span> records
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                        page === p
                          ? "bg-[#35503F] text-[#FEF8C3] shadow-md"
                          : "bg-white border border-gray-200 text-gray-600 hover:border-[#35503F] hover:text-[#35503F]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

