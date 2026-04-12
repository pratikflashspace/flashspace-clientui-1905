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
            <p className="text-3xl font-extrabold text-[#35503F] mb-1">{pendingCount}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Pickup</p>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md border-l-4 border-l-blue-400">
            <p className="text-3xl font-extrabold text-[#35503F] mb-1">{forwardedCount}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Forwarded</p>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md border-l-4 border-l-green-400">
            <p className="text-3xl font-extrabold text-[#35503F] mb-1">{totalCount}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Received</p>
          </div>
        </div>

        {/* Navigation Tabs and Search */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 items-stretch lg:items-center">
          <div className="flex p-1.5 rounded-2xl shadow-sm bg-gray-100/80 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth">
            {[
              { id: "received", label: "Received Mail" },
              { id: "forwarded", label: "Forwarded Mail" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
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

