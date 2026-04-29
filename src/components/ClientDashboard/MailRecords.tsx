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
  ArrowRight
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
        setMails(prev => prev.map(m => m._id === id ? { ...m, status: "Forwarded" } : m));
        setStats(prev => ({
          ...prev,
          pending: Math.max(0, prev.pending - 1),
          forwarded: prev.forwarded + 1
        }));
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

  const filteredMails = mails.filter((m) => {
    const matchSearch =
      searchQuery === "" ||
      m.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mailId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.space.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchTab = 
      activeTab === "forwarded" ? m.status === "Forwarded" :
      activeTab === "collected" ? m.status === "Collected" :
      m.status === "Pending Action";
    
    return matchSearch && matchTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending Action":
      case "Pending Pickup":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" />
            Pending Pickup
          </span>
        );
      case "Forwarded":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            <Send className="w-3 h-3" />
            Forwarded
          </span>
        );
      case "Collected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            <CheckCircle2 className="w-3 h-3" />
            Collected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
            <Mail className="w-3 h-3" />
            {status}
          </span>
        );
    }
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
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#35503F] tracking-tight">
              Mail <span className="text-primary italic">Records</span>
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
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md border-l-4 border-l-yellow-400">
            <p className="text-3xl font-extrabold text-[#35503F] mb-1">{stats.pending}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Pickup</p>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md border-l-4 border-l-blue-400">
            <p className="text-3xl font-extrabold text-[#35503F] mb-1">{stats.forwarded}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Forwarded</p>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md border-l-4 border-l-green-400">
            <p className="text-3xl font-extrabold text-[#35503F] mb-1">{stats.collected}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Collected</p>
          </div>
        </div>

        {/* Navigation Tabs and Search */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 items-stretch lg:items-center">
          <div className="flex gap-1 p-1 bg-gray-50 rounded-2xl border border-gray-100">
            <button
              onClick={() => { setActiveTab("received"); setPage(1); }}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "received"
                  ? "bg-[#35503F] text-[#FEF8C3] shadow-md"
                  : "text-gray-500 hover:text-[#35503F] hover:bg-white"
              }`}
            >
              Received Mail
            </button>
            <button
              onClick={() => { setActiveTab("forwarded"); setPage(1); }}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "forwarded"
                  ? "bg-[#35503F] text-[#FEF8C3] shadow-md"
                  : "text-gray-500 hover:text-[#35503F] hover:bg-white"
              }`}
            >
              Forwarded Mail
            </button>
            <button
              onClick={() => { setActiveTab("collected"); setPage(1); }}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "collected"
                  ? "bg-[#35503F] text-[#FEF8C3] shadow-md"
                  : "text-gray-500 hover:text-[#35503F] hover:bg-white"
              }`}
            >
              Collected Mail
            </button>
          </div>

          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sender, ID, or office city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-[#35503F]/10 text-sm font-medium transition-all"
            />
          </div>
        </div>

        {/* Mails Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Sender</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Office</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Received</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredMails.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(mail.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {mail.documentUrl && (
                            <a
                              href={resolveDocumentUrl(mail.documentUrl)}
                              target="_blank"
                              rel="noreferrer"
                              title="View Document"
                              className="p-2 text-gray-400 hover:text-[#35503F] hover:bg-gray-100 rounded-lg transition-all"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {mail.status !== "Collected" && (
                            <button 
                              className={`inline-flex items-center px-4 py-2 border rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 ${
                                mail.status === "Forwarded" 
                                  ? "bg-blue-50 border-blue-100 text-blue-600 cursor-default"
                                  : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300"
                              }`}
                              onClick={() => mail.status !== "Forwarded" && handleForward(mail._id)}
                              disabled={forwardingIds.has(mail._id) || mail.status === "Forwarded"}
                            >
                              {forwardingIds.has(mail._id) ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              ) : null}
                              {mail.status === "Forwarded" ? "Request Forwarded" : "Request Forward"}
                            </button>
                          )}
                        </div>
                      </td>
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

