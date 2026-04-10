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

export default function MailRecords() {
  const [mails, setMails] = useState<MailRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"received" | "forwarded">("received");

  const fetchMails = async () => {
    setLoading(true);
    try {
      const response = await userDashboardService.getUserMails();
      if (response.success && response.data) {
        setMails(response.data);
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
    fetchMails();
  }, []);

  const pendingCount = mails.filter(m => m.status === "Pending Action").length;
  const forwardedCount = mails.filter(m => m.status === "Forwarded").length;
  const totalCount = mails.length;

  const filteredMails = mails.filter((m) => {
    const matchSearch =
      searchQuery === "" ||
      m.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mailId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.space.toLowerCase().includes(searchQuery.toLowerCase());
    
    // In the screenshot, "Forwarded Mail" tab likely shows only Forwarded status
    // and "Received Mail" shows Pending or Collected? Or everything?
    // Let's assume Received is everything except Forwarded for now, or just a toggle.
    const matchTab = activeTab === "forwarded" ? m.status === "Forwarded" : m.status !== "Forwarded";
    
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
    if (!documentUrl) return "";
    if (documentUrl.startsWith("http://") || documentUrl.startsWith("https://")) {
      return documentUrl;
    }
    const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, "");
    const normalizedPath = documentUrl.startsWith("/")
      ? documentUrl
      : `/${documentUrl}`;
    return `${baseUrl}${normalizedPath}`;
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
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#35503F] flex items-center gap-3">
          Mail <span className="text-[#35503F] italic">Records</span>
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Track all mail and parcels received at your virtual office
        </p>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 translate-y-0 hover:-translate-y-1 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center">
            <Inbox className="w-7 h-7 text-yellow-600" />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 line-clamp-1">{pendingCount}</div>
            <div className="text-sm font-medium text-gray-500">Pending Pickup</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 translate-y-0 hover:-translate-y-1 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Send className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 line-clamp-1">{forwardedCount}</div>
            <div className="text-sm font-medium text-gray-500">Forwarded</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 translate-y-0 hover:-translate-y-1 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
            <Package className="w-7 h-7 text-green-600" />
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 line-clamp-1">{totalCount}</div>
            <div className="text-sm font-medium text-gray-500">Total Received</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs and Search */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-x-auto pb-1">
          <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("received")}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === "received"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Received Mail
            </button>
            <button
              onClick={() => setActiveTab("forwarded")}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === "forwarded"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Forwarded Mail
            </button>
          </div>

          <div className="relative flex-1 md:max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sender, ID, or office city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#35503F]/20 transition-all font-medium"
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
                          <button 
                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95"
                            onClick={() => {
                              // Forwarding logic would go here
                              alert(`Request forwarded for ${mail.mailId}`);
                            }}
                          >
                            Request Forward
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

