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
  User,
  Package,
  Users,
  ShieldCheck,
  Clock3
} from "lucide-react";
import { format } from "date-fns";

export default function VisitRecords() {
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Stats calculation
  const totalVisits = visits.length;
  const officialVisits = visits.filter(v => 
    v.purpose?.toLowerCase().includes("official") || 
    v.purpose?.toLowerCase().includes("verification") ||
    v.purpose?.toLowerCase().includes("gst")
  ).length;
  const deliveryVisits = visits.filter(v => 
    v.purpose?.toLowerCase().includes("delivery") || 
    v.purpose?.toLowerCase().includes("parcel") ||
    v.purpose?.toLowerCase().includes("courier")
  ).length;

  const filteredVisits = visits.filter((v) => {
    return (
      searchQuery === "" ||
      v.visitor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.visitId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.space.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.purpose.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const formatDateLabel = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch (e) {
      return dateStr;
    }
  };

  const formatTimeLabel = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "h:mm a");
    } catch (e) {
      return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#35503F] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium font-[Inter]">Loading visit history...</p>
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
              Visit <span className="text-primary italic">Records</span>
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-medium">
              Track all visits made to your registered virtual office
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
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <p className="text-3xl font-extrabold text-[#35503F] mb-1">{totalVisits}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Visits</p>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md border-l-4 border-l-[#35503F]">
            <p className="text-3xl font-extrabold text-[#35503F] mb-1">{officialVisits}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Official Visits</p>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md border-l-4 border-l-blue-400">
            <p className="text-3xl font-extrabold text-[#35503F] mb-1">{deliveryVisits}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Deliveries</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between gap-6 items-stretch lg:items-center">
            {/* Search Bar */}
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search visitor or purpose..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-[#35503F]/10 text-sm font-medium transition-all"
              />
            </div>
          </div>

        {/* Visits Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-24">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Visitor</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Purpose</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Office</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredVisits.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                          <Clock className="w-8 h-8 text-gray-300" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-bold text-lg">No visits found</p>
                          <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredVisits.map((visit) => (
                    <tr key={visit._id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">{visit.visitId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-gray-400" />
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{visit.visitor}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500 font-medium">{visit.purpose}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-gray-300" />
                          <span className="truncate max-w-[150px]" title={visit.space}>{visit.space}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900 font-semibold">{formatDateLabel(visit.date)}</span>
                          <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock3 className="w-3 h-3" /> {formatTimeLabel(visit.date)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500 font-medium">15 mins</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-[#35503F] rounded-full text-xs font-bold border border-green-100">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {visit.status}
                        </span>
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
  </div>
  );
}

