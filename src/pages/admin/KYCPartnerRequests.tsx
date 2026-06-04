import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService, type PartnerKYCData } from "@/services/admin.service";
import {
  Search,
  Handshake,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import { AdminPageSkeleton } from "@/components/ui/skeleton-loaders";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";

const getStatusBadge = (status: string) => {
  const config: Record<
    string,
    {
      bg: string;
      text: string;
      icon: React.ComponentType<{ className?: string }>;
    }
  > = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
    approved: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: CheckCircle2,
    },
    rejected: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
    resubmit: {
      bg: "bg-orange-100",
      text: "text-orange-700",
      icon: AlertCircle,
    },
  };

  const { bg, text, icon: Icon } = config[status] || config.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text} uppercase`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
};

export default function KYCPartnerRequests() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<PartnerKYCData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      try {
        const res = await adminService.getPartnerKYCList();
        if (res.success && res.data) {
          setRecords(res.data);
        } else {
          toast.error(res.message || "Failed to fetch partner KYC records");
        }
      } catch (err) {
        console.error("Failed to fetch partner KYC records", err);
        toast.error("Failed to fetch partner KYC records");
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const filtered = records.filter((r) => {
    const name = r.partnerInfo?.fullName?.toLowerCase() || "";
    const email = r.partnerInfo?.email?.toLowerCase() || "";
    const phone = r.partnerInfo?.phone?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return name.includes(term) || email.includes(term) || phone.includes(term);
  });

  if (loading) {
    return (
      <DashboardLayout
        portalName="FlashSpace Admin"
        portalDescription="Complete platform management"
        navItems={ADMIN_NAV_ITEMS}
      >
        <AdminPageSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-[Poppins]">
              Partner KYC Requests
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Review partner-level KYC snapshots derived from individual
              profiles.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Handshake className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-900">
                Partner Snapshots
              </span>
            </div>
            <span className="text-xs text-gray-500">
              Total: {filtered.length}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No partner KYC records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <th className="text-sm capitalize px-4 py-3">Partner</th>
                    <th className="text-sm capitalize px-4 py-3">Contact</th>
                    <th className="text-sm capitalize px-4 py-3">Status</th>
                    <th className="text-sm capitalize px-4 py-3">Progress</th>
                    <th className="text-sm capitalize px-4 py-3">Created</th>
                    <th className="text-sm capitalize px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((rec) => (
                    <tr
                      key={rec._id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-semibold">
                            {rec.partnerInfo?.fullName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm truncate max-w-[160px]">
                              {rec.partnerInfo?.fullName || "Unknown"}
                            </p>
                            {rec.partnerProfileId && (
                              <p className="text-[11px] text-gray-400">
                                Profile: {rec.partnerProfileId}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        <p className="truncate max-w-[180px]">
                          {rec.partnerInfo?.email || "-"}
                        </p>
                        <p className="text-gray-400 mt-0.5">
                          {rec.partnerInfo?.phone || ""}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(rec.overallStatus || "pending")}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {typeof rec.progress === "number" ? (
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                style={{
                                  width: `${Math.min(rec.progress, 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-[11px] text-gray-500">
                              {rec.progress}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {rec.createdAt
                          ? new Date(rec.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() =>
                            navigate(`/admin/kyc-partners/${rec._id}`)
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
