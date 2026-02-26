import React, { useState, useEffect } from "react";
import userDashboardService from "@/services/userDashboard.service";
import { VisitRecord } from "@/types/services";
import {
  Search,
  Clock,
  Filter,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  MapPin,
  Calendar as CalendarIcon,
  CalendarCheck,
} from "lucide-react";
import { format } from "date-fns";

export default function VisitRecords() {
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const response = await userDashboardService.getUserVisits();
      if (response.success && response.data) {
        setVisits(response.data);
      } else {
        setError(response.message || "Failed to load visit records");
      }
    } catch (err) {
      setError("Failed to load visit records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const filteredVisits = visits.filter((v) => {
    const matchSearch =
      searchQuery === "" ||
      v.visitor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.visitId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.space.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Pending":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          border: "border-yellow-200",
          icon: Clock,
        };
      case "Completed":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          border: "border-green-200",
          icon: CheckCircle2,
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          border: "border-gray-200",
          icon: CalendarIcon,
        };
    }
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "MMM dd, yyyy");
  };

  const formatTime = (dateStr: string) => {
    return format(new Date(dateStr), "h:mm a");
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">
            Loading your visit history...
          </p>
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
            onClick={fetchVisits}
            className="px-6 py-2.5 bg-teal-600 text-white rounded-full font-medium hover:bg-teal-700 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 md:px-8 font-[Inter]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 font-[Poppins]">
              My Visit History
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              A record of the days you checked into the space.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by visitor, space, or purpose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-sm transition-all"
            />
          </div>

          <div className="relative w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full md:w-auto flex items-center justify-between gap-2 px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                {statusFilter === "all" ? "All Visits" : statusFilter}
              </div>
            </button>
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-full md:w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-2">
                {["all", "Pending", "Completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                      statusFilter === status
                        ? "bg-teal-50 text-teal-700 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {status === "all" ? "All Visits" : status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Visits Table */}
        {filteredVisits.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarCheck className="w-10 h-10 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No visits recorded yet
            </h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              {searchQuery
                ? "We couldn't find any visit matching your current filters. Try changing your search query."
                : "You have not checked into any of our spaces or none have been logged by the managers yet."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Visitor
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVisits.map((visit) => {
                    const statusConfig = getStatusConfig(visit.status);
                    return (
                      <tr
                        key={visit._id}
                        className="hover:bg-gray-50 transition-colors text-sm"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-gray-900 font-medium">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            {formatDate(visit.date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {formatTime(visit.date)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-900 font-medium">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            <span
                              className="truncate max-w-[200px]"
                              title={visit.space}
                            >
                              {visit.space}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-700 font-medium">
                            {visit.visitor}
                          </span>
                          <span
                            className="text-gray-400 text-xs block truncate mt-0.5"
                            title={visit.purpose}
                          >
                            {visit.purpose}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                          >
                            <statusConfig.icon className="w-3.5 h-3.5" />
                            {visit.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
