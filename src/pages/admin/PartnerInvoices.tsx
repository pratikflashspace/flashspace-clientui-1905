import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { axiosInstance } from "@/lib/axios";
import { getUploadedFileUrl } from "@/utils/fileUrl";
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { StatsSkeleton, TableSkeleton } from "@/components/ui/skeleton-loaders";
import { motion, AnimatePresence } from "framer-motion";

interface InvoiceStats {
  totalAmount: number;
  totalPaid: number;
  totalPending: number;
  countPaid: number;
  countPending: number;
  totalCount: number;
}

interface PartnerInvoiceAdminRecord {
  _id: string;
  invoiceNumber: string;
  partnerId: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
  };
  date: string;
  amount: number;
  status: "Pending" | "Paid";
  fileUrl: string;
  createdAt: string;
}

const AdminPartnerInvoices = () => {
  const [invoices, setInvoices] = useState<PartnerInvoiceAdminRecord[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Paid" | "Pending">("All");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/partnerInvoices/admin");
      if (response.data.success) {
        const d = response.data.data;
        // Handle both formats: new { invoices, stats } or old array
        if (Array.isArray(d)) {
          setInvoices(d);
        } else {
          setInvoices(d.invoices || []);
          setStats(d.stats || null);
        }
      }
    } catch (error) {
      console.error("Failed to fetch partner invoices", error);
      toast.error("Failed to load partner invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleMarkAsPaid = async (id: string, currentStatus: string) => {
    if (currentStatus === "Paid") return;

    setProcessingId(id);
    try {
      const response = await axiosInstance.patch(`/api/partnerInvoices/${id}/pay`);
      if (response.data.success) {
        toast.success("Invoice marked as paid!");
        // Optimistic update
        setInvoices(prev => 
          prev.map(inv => inv._id === id ? { ...inv, status: "Paid" } : inv)
        );
      }
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
      toast.error("Failed to mark invoice as paid");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredInvoices = invoices.filter((i) => {
    const searchLower = searchQuery.toLowerCase();
    const partnerName = (i.partnerId?.fullName || '').toLowerCase();
    const matchesSearch = 
      i.invoiceNumber.toLowerCase().includes(searchLower) || 
      partnerName.includes(searchLower);
      
    const matchesTab = activeTab === "All" || i.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Manage Partner Invoices"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
          Partner Invoices <span className="text-primary italic">Management</span>
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Review invoices submitted by Space Partners and manage payouts.
        </p>
      </div>

      {loading && !stats ? (
        <StatsSkeleton count={4} />
      ) : stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background border border-border p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:border-primary/20 transition-all"
          >
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
            <div className="flex flex-col gap-3 relative">
              <div className="p-2.5 bg-primary/10 rounded-xl w-fit text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
                <h3 className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalAmount)}</h3>
                <p className="text-xs text-muted-foreground mt-1">{stats.totalCount} invoices</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-background border border-border p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:border-emerald-500/20 transition-all"
          >
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
            <div className="flex flex-col gap-3 relative">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl w-fit text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                <h3 className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalPaid)}</h3>
                <p className="text-xs text-muted-foreground mt-1">{stats.countPaid} paid</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-background border border-border p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:border-amber-500/20 transition-all"
          >
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
            <div className="flex flex-col gap-3 relative">
              <div className="p-2.5 bg-amber-500/10 rounded-xl w-fit text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pending</p>
                <h3 className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalPending)}</h3>
                <p className="text-xs text-muted-foreground mt-1">{stats.countPending} pending</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-background border border-border p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:border-blue-500/20 transition-all"
          >
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
            <div className="flex flex-col gap-3 relative">
              <div className="p-2.5 bg-blue-500/10 rounded-xl w-fit text-blue-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid Rate</p>
                <h3 className="text-2xl font-bold text-foreground">{stats.totalCount > 0 ? Math.round((stats.countPaid / stats.totalCount) * 100) : 0}%</h3>
                <p className="text-xs text-muted-foreground mt-1">{stats.countPaid} of {stats.totalCount}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by invoice number or partner name..."
            className="pl-10 h-11 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="bg-muted/50 p-1 rounded-xl w-fit flex items-center border border-border">
          {["All", "Pending", "Paid"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-background border border-border rounded-2xl shadow-sm overflow-hidden min-h-[450px]">
        {loading ? (
          <div className="p-8">
            <TableSkeleton rows={8} cols={6} />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredInvoices.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[450px] text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground opacity-30" />
                  </div>
                  <h3 className="text-lg font-bold">No Invoices Found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchQuery ? "No partner invoices match your search criteria." : "There are currently no partner invoices."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">
                          Invoice #
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">
                          Partner Details
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">
                          Date
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">
                          Status
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredInvoices.map((record, idx) => (
                        <motion.tr
                          key={record._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.03 }}
                          className="group hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="font-bold text-foreground">
                              {record.invoiceNumber}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-foreground">
                                {record.partnerId?.fullName || 'Unknown Partner'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {record.partnerId?.email}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-foreground">
                              {formatDate(record.date)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-foreground">
                              {formatCurrency(record.amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="secondary"
                              className={`font-bold text-[10px] uppercase flex items-center w-fit gap-1 ${
                                record.status === "Paid" 
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                                  : "bg-amber-100 text-amber-800 border-amber-200"
                              }`}
                            >
                              {record.status === "Paid" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {record.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3">
                              <a 
                                href={getUploadedFileUrl(record.fileUrl)}
                                target="_blank" 
                                rel="noreferrer"
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="View/Download PDF"
                                  className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </a>
                              {record.status === "Pending" ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleMarkAsPaid(record._id, record.status)}
                                  disabled={processingId === record._id}
                                  className="h-8 text-xs font-bold rounded-lg shadow-sm"
                                >
                                  {processingId === record._id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    "Mark as Paid"
                                  )}
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  disabled
                                  className="h-8 text-xs font-bold rounded-lg bg-muted text-muted-foreground"
                                >
                                  Paid
                                </Button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

    </DashboardLayout>
  );
};

export default AdminPartnerInvoices;
