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
  Upload,
  X,
  FileCheck2,
  CreditCard,
  Hash,
  CalendarDays,
  TrendingUp,
} from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { StatsSkeleton, TableSkeleton } from "@/components/ui/skeleton-loaders";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 6;

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
  status: "Pending" | "Paid" | "PENDING" | "PAID";
  fileUrl: string;
  createdAt: string;
  paymentDetails?: PaymentDetails;
}

interface PaymentDetails {
  paymentMethod?: string;
  amountPaid?: number;
  paymentDate?: string;
  utrNumber?: string;
  paymentProof?: string;
  fetchMode?: "AUTO" | "MANUAL";
  markedPaidAt?: string;
}

const paymentMethods = ["Bank Transfer", "NEFT", "RTGS", "IMPS", "Paytm", "PhonePe", "GooglePay", "UPI", "Other"];

const todayInputValue = () => new Date().toISOString().slice(0, 10);

const normalizeInvoiceStatus = (status?: string) =>
  String(status || "").toLowerCase() === "paid" ? "Paid" : "Pending";

const hasSettlementDetails = (invoice: PartnerInvoiceAdminRecord) =>
  !!(
    invoice.paymentDetails?.paymentMethod &&
    invoice.paymentDetails?.amountPaid &&
    invoice.paymentDetails?.paymentDate &&
    invoice.paymentDetails?.utrNumber &&
    invoice.paymentDetails?.paymentProof
  );

const formatPaymentDate = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-IN");
};

const extractUtrFromText = (rawText = "") => {
  const text = rawText.replace(/\s+/g, " ").trim();
  const patterns = [
    /\bUTR\b\s*(?:No\.?|Number|ID)?\s*[:#.-]?\s*([A-Z0-9][A-Z0-9\s-]{7,40})/i,
    /\b(?:Ref|Reference)\.?\s*(?:No\.?|Number|ID)?\s*[:#.-]?\s*([A-Z0-9][A-Z0-9\s-]{7,40})/i,
    /\bTransaction\s*(?:ID|No\.?|Number)?\s*[:#.-]?\s*([A-Z0-9][A-Z0-9\s-]{7,40})/i,
    /\bTxn\.?\s*(?:ID|No\.?|Number)?\s*[:#.-]?\s*([A-Z0-9][A-Z0-9\s-]{7,40})/i,
    /\bBank\s*(?:Ref|Reference)\.?\s*(?:No\.?|Number|ID)?\s*[:#.-]?\s*([A-Z0-9][A-Z0-9\s-]{7,40})/i,
    /\bRRN\b\s*[:#.-]?\s*([A-Z0-9][A-Z0-9\s-]{7,40})/i,
  ];

  const cleanCandidate = (candidate?: string) => {
    const cleaned = candidate?.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    if (!cleaned || cleaned.length < 8 || cleaned.length > 30) return "";
    if (!/\d/.test(cleaned)) return "";
    return cleaned;
  };

  for (const pattern of patterns) {
    const candidate = cleanCandidate(text.match(pattern)?.[1]);
    if (candidate) return candidate;
  }

  return (
    text
      .toUpperCase()
      .match(/[A-Z0-9]{8,30}/g)
      ?.find((candidate) => /\d/.test(candidate)) || ""
  );
};

const AdminPartnerInvoices = () => {
  const [invoices, setInvoices] = useState<PartnerInvoiceAdminRecord[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Paid" | "Pending">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] =
    useState<PartnerInvoiceAdminRecord | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState("");
  const [extractingUtr, setExtractingUtr] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: "",
    amountPaid: "",
    paymentDate: todayInputValue(),
    utrNumber: "",
    fetchMode: "AUTO" as "AUTO" | "MANUAL",
  });

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  useEffect(() => {
    if (!paymentProofFile) {
      setPaymentProofPreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(paymentProofFile);
    setPaymentProofPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [paymentProofFile]);

  const openPaymentModal = (invoice: PartnerInvoiceAdminRecord) => {
    if (normalizeInvoiceStatus(invoice.status) === "Paid" && hasSettlementDetails(invoice)) {
      return;
    }

    setSelectedInvoice(invoice);
    setPaymentForm({
      paymentMethod: invoice.paymentDetails?.paymentMethod || "",
      amountPaid: String(invoice.paymentDetails?.amountPaid || invoice.amount || ""),
      paymentDate: invoice.paymentDetails?.paymentDate
        ? new Date(invoice.paymentDetails.paymentDate).toISOString().slice(0, 10)
        : todayInputValue(),
      utrNumber: invoice.paymentDetails?.utrNumber || "",
      fetchMode: invoice.paymentDetails?.fetchMode || "AUTO",
    });
    setPaymentProofFile(null);
    setPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    if (processingId || extractingUtr) return;
    setPaymentModalOpen(false);
    setSelectedInvoice(null);
    setPaymentProofFile(null);
    setPaymentForm({
      paymentMethod: "",
      amountPaid: "",
      paymentDate: todayInputValue(),
      utrNumber: "",
      fetchMode: "AUTO",
    });
  };

  const runUtrExtraction = async (file: File, force = false) => {
    if (!force && paymentForm.fetchMode !== "AUTO") return;

    setExtractingUtr(true);
    try {
      const formData = new FormData();
      formData.append("paymentProof", file);

      const response = await axiosInstance.post(
        `/partnerInvoices/extract-utr/${Date.now()}`,
        formData,
        { timeout: 180000 },
      );

      const extractedText = response.data?.data?.extractedText || "";
      const utrNumber =
        response.data?.data?.utrNumber || extractUtrFromText(extractedText);
      if (utrNumber) {
        setPaymentForm((prev) => ({
          ...prev,
          utrNumber,
          fetchMode: "AUTO",
        }));
        toast.success("UTR auto-filled from payment proof");
      } else {
        setPaymentForm((prev) => ({ ...prev, fetchMode: "MANUAL" }));
        toast.info("UTR not found. Please enter it manually.");
      }
    } catch (error: any) {
      console.warn("UTR auto extraction unavailable:", error);
      setPaymentForm((prev) => ({ ...prev, fetchMode: "MANUAL" }));
      const status = error?.response?.status;
      toast.info(
        status === 404
          ? "Auto UTR fetch is not available on this backend yet. Please enter it manually."
          : "Could not auto fetch UTR. Please enter it manually.",
      );
    } finally {
      setExtractingUtr(false);
    }
  };

  const handlePaymentProofSelect = (file?: File | null) => {
    if (!file) return;
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Upload an image or PDF payment proof");
      return;
    }

    setPaymentProofFile(file);
    if (paymentForm.fetchMode === "AUTO") {
      runUtrExtraction(file);
    }
  };

  const handleConfirmPaid = async () => {
    if (!selectedInvoice) return;

    if (
      !paymentForm.paymentMethod ||
      !paymentForm.amountPaid ||
      !paymentForm.paymentDate ||
      !paymentForm.utrNumber ||
      !paymentProofFile
    ) {
      toast.error("Please complete all payment details before confirming.");
      return;
    }

    setProcessingId(selectedInvoice._id);
    try {
      const formData = new FormData();
      formData.append("paymentMethod", paymentForm.paymentMethod);
      formData.append("amountPaid", paymentForm.amountPaid);
      formData.append("paymentDate", paymentForm.paymentDate);
      formData.append("utrNumber", paymentForm.utrNumber.trim());
      formData.append("fetchMode", paymentForm.fetchMode);
      formData.append("paymentProof", paymentProofFile);

      const response = await axiosInstance.patch(
        `/api/partnerInvoices/${selectedInvoice._id}/pay`,
        formData,
      );

      if (response.data.success) {
        toast.success("Invoice settlement marked as paid");
        await fetchInvoices();
        setPaymentModalOpen(false);
        setSelectedInvoice(null);
        setPaymentProofFile(null);
      }
    } catch (error: any) {
      console.error("Error marking invoice as paid:", error);
      toast.error(
        error?.response?.data?.message || "Failed to mark invoice as paid",
      );
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
      
    const matchesTab =
      activeTab === "All" || normalizeInvoiceStatus(i.status) === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginatedInvoices = filteredInvoices.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );
  const visibleStart = filteredInvoices.length
    ? (safePage - 1) * ITEMS_PER_PAGE + 1
    : 0;
  const visibleEnd = Math.min(
    safePage * ITEMS_PER_PAGE,
    filteredInvoices.length,
  );

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
        <p className="text-sm md:text-base text-[#6B7280] mt-1">
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

      <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden min-h-[450px]">
        {loading ? (
          <div className="p-8">
            <TableSkeleton rows={8} cols={7} />
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
                        <th className="px-6 py-4 text-sm font-bold text-muted-foreground capitalize">
                          Invoice #
                        </th>
                        <th className="px-6 py-4 text-sm font-bold text-muted-foreground capitalize">
                          Partner Details
                        </th>
                        <th className="px-6 py-4 text-sm font-bold text-muted-foreground capitalize">
                          Date
                        </th>
                        <th className="px-6 py-4 text-sm font-bold text-muted-foreground capitalize">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-sm font-bold text-muted-foreground capitalize">
                          Status
                        </th>
                        <th className="px-6 py-4 text-sm font-bold text-muted-foreground capitalize">
                          Payment Details
                        </th>
                        <th className="px-6 py-4 text-sm font-bold text-muted-foreground capitalize text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {paginatedInvoices.map((record, idx) => {
                        const status = normalizeInvoiceStatus(record.status);
                        const details = record.paymentDetails;
                        const settlementComplete = hasSettlementDetails(record);

                        return (
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
                                status === "Paid"
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                                  : "bg-amber-100 text-amber-800 border-amber-200"
                              }`}
                            >
                              {status === "Paid" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 min-w-[260px]">
                            {status === "Paid" && settlementComplete ? (
                              <div className="grid gap-1.5 text-xs">
                                <div className="flex items-center gap-2 text-foreground font-semibold">
                                  <CreditCard className="w-3.5 h-3.5 text-primary" />
                                  {details.paymentMethod || "-"} -{" "}
                                  {formatCurrency(details.amountPaid || record.amount)}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <CalendarDays className="w-3.5 h-3.5" />
                                  {formatPaymentDate(details.paymentDate)}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Hash className="w-3.5 h-3.5" />
                                  <span className="font-mono text-[11px] text-foreground">
                                    {details.utrNumber || "-"}
                                  </span>
                                  {details.fetchMode && (
                                    <Badge variant="outline" className="h-5 px-1.5 text-[9px]">
                                      {details.fetchMode}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span
                                className={`text-xs ${
                                  status === "Paid"
                                    ? "font-semibold text-amber-700"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {status === "Paid"
                                  ? "Settlement details missing"
                                  : "Awaiting settlement"}
                              </span>
                            )}
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
                              {details?.paymentProof && (
                                <a
                                  href={getUploadedFileUrl(details.paymentProof)}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    title="View payment proof"
                                    className="h-8 w-8 p-0 rounded-lg hover:bg-emerald-50 hover:text-emerald-700"
                                  >
                                    <FileCheck2 className="w-4 h-4" />
                                  </Button>
                                </a>
                              )}
                              {status === "Pending" || !settlementComplete ? (
                                <Button
                                  size="sm"
                                  onClick={() => openPaymentModal(record)}
                                  disabled={processingId === record._id}
                                  className="h-8 text-xs font-bold rounded-lg shadow-sm"
                                >
                                  {processingId === record._id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : status === "Paid" ? (
                                    "Add Details"
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {!loading && filteredInvoices.length > 0 && (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-border bg-background px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium text-muted-foreground">
            Showing{" "}
            <span className="font-bold text-foreground">{visibleStart}</span>-
            <span className="font-bold text-foreground">{visibleEnd}</span> of{" "}
            <span className="font-bold text-foreground">{filteredInvoices.length}</span>{" "}
            invoices
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-lg px-4 text-xs font-semibold"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <div className="flex h-9 min-w-20 items-center justify-center rounded-lg border border-border bg-muted/20 px-3 text-xs font-bold text-foreground">
              {safePage} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-lg px-4 text-xs font-semibold"
              disabled={safePage >= totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {paymentModalOpen && (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-settlement-title"
            className="relative max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-2xl"
          >
            <button
              type="button"
              onClick={closePaymentModal}
              disabled={!!processingId || extractingUtr}
              className="absolute right-4 top-4 z-10 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
              aria-label="Close payment settlement modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="border-b border-border px-6 py-5 pr-14">
              <h2
                id="payment-settlement-title"
                className="flex items-center gap-3 text-xl font-extrabold"
              >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CreditCard className="h-5 w-5" />
              </span>
              Payment Settlement
            </h2>
            <p className="text-sm text-muted-foreground">
              {selectedInvoice
                ? `${selectedInvoice.invoiceNumber} - ${formatCurrency(selectedInvoice.amount)}`
                : "Confirm partner invoice payment"}
            </p>
          </div>

          <div className="max-h-[78vh] overflow-y-auto px-6 py-5">
            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select
                      value={paymentForm.paymentMethod || "none"}
                      onValueChange={(value) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          paymentMethod: value === "none" ? "" : value,
                        }))
                      }
                    >
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" className="hidden">
                          Select method
                        </SelectItem>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Amount Paid</Label>
                    <Input
                      type="number"
                      min="1"
                      step="0.01"
                      value={paymentForm.amountPaid}
                      onChange={(event) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          amountPaid: event.target.value,
                        }))
                      }
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Payment Date</Label>
                    <Input
                      type="date"
                      value={paymentForm.paymentDate}
                      onChange={(event) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          paymentDate: event.target.value,
                        }))
                      }
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Fetch Mode</Label>
                    <Select
                      value={paymentForm.fetchMode}
                      onValueChange={(value) => {
                        const nextMode = value as "AUTO" | "MANUAL";
                        setPaymentForm((prev) => ({
                          ...prev,
                          fetchMode: nextMode,
                        }));
                        if (nextMode === "AUTO" && paymentProofFile) {
                          runUtrExtraction(paymentProofFile, true);
                        }
                      }}
                    >
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AUTO">Auto Fetch UTR</SelectItem>
                        <SelectItem value="MANUAL">Manual Enter UTR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>UTR Number</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={paymentForm.utrNumber}
                      onChange={(event) =>
                        setPaymentForm((prev) => ({
                          ...prev,
                          utrNumber: event.target.value.toUpperCase(),
                          fetchMode:
                            prev.fetchMode === "AUTO" ? "AUTO" : "MANUAL",
                        }))
                      }
                      placeholder="Enter UTR / Ref No / Transaction ID"
                      className="h-11 rounded-xl pl-10 font-mono"
                    />
                  </div>
                  {extractingUtr && (
                    <p className="flex items-center gap-2 text-xs font-medium text-primary">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Reading payment proof and finding UTR...
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Payment Screenshot / Proof</Label>
                <div
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    handlePaymentProofSelect(event.dataTransfer.files?.[0]);
                  }}
                  className="rounded-2xl border-2 border-dashed border-border bg-muted/30 p-5 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  <input
                    id="payment-proof-upload"
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(event) =>
                      handlePaymentProofSelect(event.target.files?.[0])
                    }
                  />

                  {paymentProofFile ? (
                    <div className="space-y-4">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                        <FileCheck2 className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {paymentProofFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(paymentProofFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      {paymentProofFile.type.startsWith("image/") && (
                        <img
                          src={paymentProofPreview}
                          alt="Payment proof preview"
                          className="mx-auto max-h-36 rounded-xl border border-border object-contain"
                        />
                      )}
                      <div className="flex justify-center gap-2">
                        <Label
                          htmlFor="payment-proof-upload"
                          className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-border px-3 text-xs font-bold hover:bg-muted"
                        >
                          Replace
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPaymentProofFile(null);
                            setPaymentForm((prev) => ({
                              ...prev,
                              utrNumber: "",
                            }));
                          }}
                          className="h-9 px-3 text-xs"
                        >
                          <X className="mr-1.5 h-3.5 w-3.5" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Label
                      htmlFor="payment-proof-upload"
                      className="block cursor-pointer space-y-4"
                    >
                      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Upload className="h-7 w-7" />
                      </span>
                      <span className="block text-sm font-bold text-foreground">
                        Drop proof here or click to upload
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        JPG, PNG, WEBP or PDF up to 10MB
                      </span>
                    </Label>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={closePaymentModal}
              disabled={!!processingId || extractingUtr}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmPaid}
              disabled={!!processingId || extractingUtr}
              className="rounded-xl font-bold"
            >
              {processingId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirm Paid
                </>
              )}
            </Button>
          </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default AdminPartnerInvoices;
