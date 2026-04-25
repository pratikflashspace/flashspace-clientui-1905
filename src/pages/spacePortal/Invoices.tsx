import React, { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Download,
  Eye,
  Search,
} from "lucide-react";
import { StatsSkeleton, TableSkeleton } from "@/components/ui/skeleton-loaders";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { axiosInstance } from "../../lib/axios";
import { getUploadedFileUrl } from "@/utils/fileUrl";
import LogInvoiceModal from "../../components/SpacePartner/LogInvoiceModal";
import { motion, AnimatePresence } from "framer-motion";

interface PartnerInvoiceRecord {
  _id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: "Pending" | "Paid";
  fileUrl: string;
  createdAt: string;
}

interface InvoiceStats {
  totalAmount: number;
  totalPaid: number;
  totalPending: number;
  countPaid: number;
  countPending: number;
  totalCount: number;
}

const InvoicesAndPayments = () => {
  const [activeTab, setActiveTab] = useState<"All" | "Paid" | "Pending">("All");
  const [invoices, setInvoices] = useState<PartnerInvoiceRecord[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogInvoiceModalOpen, setIsLogInvoiceModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/partnerInvoices/partner");
      if (response.data.success) {
        setInvoices(response.data.data.invoices);
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch invoices", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

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
    const matchesSearch = i.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "All" || i.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex-1 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Invoices <span className="text-primary italic">Management</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload and track your invoices sent to FlashSpace admin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by invoice number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-background border border-input rounded-xl w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-sm"
            />
          </div>
          <Button
            onClick={() => setIsLogInvoiceModalOpen(true)}
            className="rounded-xl font-bold shadow-sm flex items-center gap-2 h-11 px-6 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Upload Invoice
          </Button>
        </div>
      </div>

      {loading && !stats ? (
        <StatsSkeleton count={3} />
      ) : stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <p className="text-sm font-medium text-muted-foreground">Total Invoiced Amount</p>
                <h3 className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalAmount)}</h3>
                <p className="text-xs text-muted-foreground mt-1">{stats.totalCount} total invoices</p>
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
                <p className="text-sm font-medium text-muted-foreground">Total Paid Amount</p>
                <h3 className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalPaid)}</h3>
                <p className="text-xs text-muted-foreground mt-1">{stats.countPaid} paid invoices</p>
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
                <p className="text-sm font-medium text-muted-foreground">Total Pending Amount</p>
                <h3 className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalPending)}</h3>
                <p className="text-xs text-muted-foreground mt-1">{stats.countPending} pending invoices</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-muted/50 p-1 rounded-xl w-fit flex items-center border border-border">
          {["All", "Paid", "Pending"].map((tab) => (
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

        <div className="bg-background border border-border rounded-2xl shadow-sm overflow-hidden min-h-[450px]">
          {loading ? (
            <div className="p-8">
              <TableSkeleton rows={8} cols={5} />
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
                      {searchQuery ? "No invoices match your search." : "Start by uploading an invoice."}
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
                            Date
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">
                            Amount
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">
                            Status
                          </th>
                          <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase text-center">
                            File
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
                                className={`font-bold text-[10px] uppercase ${
                                  record.status === "Paid" 
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                                    : "bg-amber-100 text-amber-800 border-amber-200"
                                }`}
                              >
                                {record.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-2">
                                <a 
                                  href={getUploadedFileUrl(record.fileUrl)}
                                  target="_blank" 
                                  rel="noreferrer"
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    title="View/Download Invoice"
                                    className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </a>
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
      </div>

      <LogInvoiceModal
        isOpen={isLogInvoiceModalOpen}
        onClose={() => setIsLogInvoiceModalOpen(false)}
        onSuccess={fetchInvoices}
      />
    </div>
  );
};

export default InvoicesAndPayments;
