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
} from "lucide-react";
import { format } from "date-fns";
import { API_CONFIG } from "@/config/api.config";

export default function MailRecords() {
  const [mails, setMails] = useState<MailRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

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

  const filteredMails = mails.filter((m) => {
    const matchSearch =
      searchQuery === "" ||
      m.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mailId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.space.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Pending Action":
        return { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock };
      case "Forwarded":
        return { bg: "bg-blue-100", text: "text-blue-700", icon: Navigation };
      case "Collected":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          icon: CheckCircle2,
        };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600", icon: Mail };
    }
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "MMM dd, yyyy");
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
          <Loader2 className="w-10 h-10 text-yellow-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading mail records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-2 text-lg">
            Oops! Something went wrong
          </p>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={fetchMails}
            className="px-6 py-2.5 bg-[#35503F] text-[#FEF8C3] rounded-full font-medium hover:bg-[#35503F]/90 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#35503F]">
              Mail <span className="italic">Records</span>
            </h1>
            <p className="text-gray-500 mt-2">
              Track and manage all mail and packages received at your virtual
              office spaces.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by sender, ID, or space..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 text-sm transition-all"
            />
          </div>

          <div className="relative w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full md:w-auto flex items-center justify-between gap-2 px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {statusFilter === "all" ? "All Statuses" : statusFilter}
              </div>
            </button>
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-full md:w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-2">
                {["all", "Pending Action", "Forwarded", "Collected"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                        statusFilter === status
                          ? "bg-[#35503F]/5 text-[#35503F] font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {status === "all" ? "All Statuses" : status}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mails Grid */}
        {filteredMails.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No mail records found
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchQuery
                ? "We couldn't find any mail matching your current filters. Try adjusting your search."
                : "You don't have any mail records yet. Any packages or letters received at your virtual office will appear here."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMails.map((mail) => {
              const statusConfig = getStatusConfig(mail.status);

              return (
                <div
                  key={mail._id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col h-full"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-3 py-1 rounded-md">
                      {mail.mailId}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}
                    >
                      <statusConfig.icon className="w-3.5 h-3.5" />
                      {mail.status}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#35503F] transition-colors line-clamp-1">
                      From: {mail.sender}
                    </h3>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5 text-sm text-gray-600">
                        <div className="w-7 h-7 rounded-full bg-[#35503F]/10 flex items-center justify-center shrink-0">
                          <FileText className="w-3.5 h-3.5 text-[#35503F]" />
                        </div>
                        <span className="font-medium">{mail.type}</span>
                      </div>

                      <div className="flex items-center gap-2.5 text-sm text-gray-600 border-t border-gray-50 pt-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <span className="truncate" title={mail.space}>
                          {mail.space}
                        </span>
                      </div>
                    </div>
                  </div>

                  {mail.documentUrl && (
                    <a
                      href={resolveDocumentUrl(mail.documentUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#35503F] hover:underline"
                    >
                      View Uploaded Document
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <div className="h-px bg-gray-100 my-4" />

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      Received
                    </span>
                    <span>{formatDate(mail.received)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
