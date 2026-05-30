import React, { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { adminService, UserData } from "@/services/admin.service";
import {
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Upload,
  Plus,
  User as UserIcon,
  FileText,
  Loader2,
  CheckCircle2,
  Receipt,
} from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUploadedFileUrl } from "@/utils/fileUrl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Invoice {
  _id: string;
  invoiceNumber: string;
  userName: string;
  userEmail: string;
  amount: number;
  totalAmount: number;
  status: string;
  paymentType: string;
  spaceName: string;
  planName: string;
  tenure: number;
  createdAt: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  fileUrl?: string;
  invoiceType?: string;
  pdfUrl?: string;
  paymentDetails?: {
    paymentMethod?: string;
    amountPaid?: number;
    paymentDate?: string;
    utrNumber?: string;
    paymentProof?: string;
    fetchMode?: "AUTO" | "MANUAL";
    markedPaidAt?: string;
  };
}

const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
    case "paid":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Paid
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive" className="bg-destructive/10 text-destructive border-0 hover:bg-destructive/20">
          <XCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    amount || 0,
  );

const categoryLabel = (raw: string) =>
  (raw || "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const getServiceSpaceName = (invoice: Invoice) =>
  invoice.spaceName ||
  (invoice.invoiceType === "admin_manual" ? "Uploaded Invoice" : "Direct Billing");

const getServicePlanName = (invoice: Invoice) =>
  invoice.planName ||
  (invoice.invoiceType === "admin_manual"
    ? "Uploaded Invoice"
    : categoryLabel(invoice.paymentType) || "Booked Plan");

const shouldShowPaymentType = (invoice: Invoice) =>
  invoice.invoiceType !== "admin_manual" && invoice.paymentType !== "manual_invoice";

const getInvoiceReferenceId = (invoice: Invoice) => {
  const referenceId = invoice.razorpayOrderId;
  return referenceId && referenceId !== "MANUAL" ? referenceId : "";
};

// ─── Inline Invoice View Modal ─────────────────────────────────────────────────
const InvoiceViewModal = ({
  invoice,
  open,
  onOpenChange,
}: {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  if (!invoice) return null;
  const isManual = invoice.invoiceType === "admin_manual";
  const displayFileUrl = invoice.pdfUrl || invoice.fileUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-3xl border-border border shadow-2xl bg-background">
        <DialogHeader className="px-6 py-5 border-b border-border">
          <DialogTitle className="text-xl font-bold text-foreground">
            Invoice {invoice.invoiceNumber}
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-5 text-sm max-h-[80vh] overflow-y-auto scrollbar-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
              <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-1">Customer</p>
              <p className="font-semibold text-foreground leading-tight">
                {invoice.userName}
              </p>
              <p className="text-muted-foreground/60 text-xs truncate">
                {invoice.userEmail}
              </p>
            </div>
            <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
              <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-1">Status</p>
              <div className="mt-0.5">
                {getStatusBadge(invoice.status)}
              </div>
            </div>
          </div>
          {!isManual && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                  <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-1">Space</p>
                  <p className="font-medium text-foreground">
                    {getServiceSpaceName(invoice)}
                  </p>
                </div>
                <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                  <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-1">Service Type</p>
                  <p className="font-medium text-foreground leading-tight">
                    {getServicePlanName(invoice)}
                  </p>
                  {shouldShowPaymentType(invoice) && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {categoryLabel(invoice.paymentType)}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                  <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-1">Plan</p>
                  <p className="font-medium text-foreground">
                    {getServicePlanName(invoice)}
                  </p>
                </div>
                <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                  <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-1">Date</p>
                  <p className="font-medium text-foreground">
                    {invoice.createdAt
                      ? format(new Date(invoice.createdAt), "dd MMM yyyy")
                      : "—"}
                  </p>
                </div>
              </div>
            </>
          )}
          {isManual && (
            <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
              <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mb-1">Description</p>
              <p className="font-medium text-foreground">
                {invoice.paymentType || "Manual Invoice"}
              </p>
            </div>
          )}
          <div className="border-t border-border pt-5 mt-2">
            <div className="flex items-center justify-between gap-4">
              <p className="text-muted-foreground font-medium text-base">Total Amount</p>
              <p className="text-2xl font-black text-primary italic">
                {formatCurrency(invoice.totalAmount || invoice.amount)}
              </p>
            </div>
            {!isManual && (
              <div className="mt-4 p-3 bg-muted/30 rounded-xl space-y-1 border border-border/50">
                {getInvoiceReferenceId(invoice) && (
                  <p className="text-[10px] text-muted-foreground font-medium">
                    Order ID: <span className="font-mono text-foreground/80">{getInvoiceReferenceId(invoice)}</span>
                  </p>
                )}
                {invoice.razorpayPaymentId && (
                  <p className="text-[10px] text-muted-foreground font-medium">
                    Payment ID: <span className="font-mono text-foreground/80">{invoice.razorpayPaymentId}</span>
                  </p>
                )}
              </div>
            )}
          </div>
          {displayFileUrl && (
            <div className="pt-2">
              <a
                href={getUploadedFileUrl(displayFileUrl)}
                target="_blank"
                rel="noreferrer"
                className="w-full flex h-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 text-sm font-bold text-primary hover:bg-primary/10 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                View / Download Invoice PDF
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Admin Invoice Upload Tab ──────────────────────────────────────────────────
const AdminInvoiceUploadTab = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState("");
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    amount: "",
    description: "",
    paymentDate: format(new Date(), "yyyy-MM-dd"),
  });

  const fetchBookings = useCallback(async (query?: string) => {
    setLoadingBookings(true);
    try {
      const res = await adminService.getAllBookings({ limit: 100 });
      if (res.success) {
        if (query && query.length >= 2) {
          const filtered = res.data.bookings.filter(b => 
            b.bookingNumber.toLowerCase().includes(query.toLowerCase()) ||
            (b.user?.fullName || "").toLowerCase().includes(query.toLowerCase()) ||
            (b.user?.email || "").toLowerCase().includes(query.toLowerCase())
          );
          setBookings(filtered);
        } else {
          setBookings(res.data.bookings);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) fetchBookings(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchBookings]);

  const handleBookingSelect = (booking: BookingData) => {
    setSelectedBooking(booking);
    setSearchQuery("");
    setBookings([]);
    
    // Auto generate invoice number and description
    const timestamp = Date.now().toString().slice(-4);
    const invNumber = `INV-${booking.bookingNumber}-${timestamp}`;
    
    setFormData(prev => ({
      ...prev,
      invoiceNumber: invNumber,
      description: `Manual Invoice for booking ${booking.bookingNumber} (${booking.plan?.name || ""})`,
      amount: booking.amount?.toString() || booking.plan?.price?.toString() || ""
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (f.type !== "application/pdf") {
        toast({ title: "Error", description: "Only PDF files are allowed", variant: "destructive" });
        return;
      }
      setFile(f);
      setFilePreview(f.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !file || !formData.amount || !formData.description) {
      toast({ title: "Warning", description: "Please select a booking and fill all fields", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const data = new FormData();
      const selectedUserId =
        selectedBooking.userId ||
        selectedBooking.user?._id ||
        selectedBooking.user?.id;

      if (selectedUserId) {
        data.append("userId", selectedUserId);
      }
      data.append("bookingId", selectedBooking._id);
      data.append("invoiceNumber", formData.invoiceNumber);
      data.append("amount", formData.amount);
      data.append("description", formData.description);
      data.append("paymentDate", formData.paymentDate);
      data.append("invoiceFile", file);

      const res = await adminService.uploadAdminInvoice(data);
      if (res.success) {
        toast({ title: "Success", description: "Invoice uploaded successfully" });
        // Reset form
        setSelectedBooking(null);
        setFile(null);
        setFilePreview("");
        setFormData({
          invoiceNumber: "",
          amount: "",
          description: "",
          paymentDate: format(new Date(), "yyyy-MM-dd"),
        });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to upload invoice", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8">
        {/* Left: User Selection & File */}
        <div className="space-y-6">
          <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              1. Select Booking
            </h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search booking # or client name..."
                className="pl-10 h-12 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {loadingBookings && <Loader2 className="absolute right-3 top-3.5 w-5 h-5 animate-spin text-primary" />}
            </div>

            {bookings.length > 0 && searchQuery && !selectedBooking && (
              <div className="border border-border rounded-xl overflow-hidden mb-4 bg-muted/20 max-h-[250px] overflow-y-auto">
                {bookings.map(b => (
                  <button
                    key={b._id}
                    onClick={() => handleBookingSelect(b)}
                    className="w-full text-left p-3 hover:bg-primary/5 border-b border-border last:border-0 transition-colors flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] uppercase">
                      {b.bookingNumber.slice(-2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{b.bookingNumber}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{b.user?.fullName} • {b.plan?.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedBooking && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs uppercase">
                    {selectedBooking.bookingNumber.slice(-4)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{selectedBooking.bookingNumber}</p>
                    <p className="text-[10px] text-muted-foreground">{selectedBooking.user?.fullName} ({selectedBooking.user?.email})</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(null)} className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive">
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              2. Upload PDF
            </h3>
            <div className="relative group">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 z-10 cursor-pointer"
              />
              <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-primary/5'}`}>
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                    <p className="text-sm font-bold text-foreground">{filePreview}</p>
                    <p className="text-[10px] text-muted-foreground">Click to change file</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-bold">Drag & drop or click to upload</p>
                    <p className="text-[10px] text-muted-foreground">PDF files only (Max 10MB)</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Invoice Details */}
        <div className="bg-background border border-border rounded-3xl p-8 shadow-xl shadow-primary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Receipt className="w-32 h-32 text-primary" />
          </div>
          <h3 className="text-xl font-black text-foreground mb-8 uppercase tracking-widest italic">
            Invoice <span className="text-primary">Details</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Selected Client</Label>
              <div className="h-12 bg-muted/30 border border-border rounded-xl flex items-center px-4 font-bold text-sm text-foreground/70">
                {selectedBooking?.user?.fullName || "No booking selected"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Invoice #</Label>
                <Input
                  className="h-12 bg-muted/30 border-border rounded-xl font-mono text-sm"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData(p => ({ ...p, invoiceNumber: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Amount (INR)</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="h-12 bg-muted/30 border-border rounded-xl font-bold text-lg"
                  value={formData.amount}
                  onChange={(e) => setFormData(p => ({ ...p, amount: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Payment Date</Label>
                <Input
                  type="date"
                  className="h-12 bg-muted/30 border-border rounded-xl"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData(p => ({ ...p, paymentDate: e.target.value }))}
                />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Description / Remarks</Label>
              <Textarea
                placeholder="Briefly describe what this invoice is for..."
                className="min-h-[120px] bg-muted/30 border-border rounded-2xl resize-none"
                value={formData.description}
                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
              />
            </div>

            <Button
              type="submit"
              disabled={uploading}
              className="w-full h-14 rounded-2xl font-black text-base uppercase tracking-widest shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-3" />
                  Generate & Send Invoice
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─── Main Invoices Page ────────────────────────────────────────────────────────────
const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("received");

  const limit = 10;

  const fetchInvoices = async (
    currentPage = page,
    currentStatus = statusFilter,
    currentType = typeFilter,
  ) => {
    setLoading(true);
    try {
      const response = await adminService.getAllInvoices({
        page: currentPage,
        limit,
        type: currentType !== "all" ? currentType : undefined,
        status: currentStatus !== "all" ? currentStatus : undefined,
        search: searchTerm || undefined,
      });

      if (response.success && response.data) {
        setInvoices(response.data.invoices || []);
        setTotalPages(response.data.pagination?.pages ?? 1);
        setTotal(response.data.pagination?.total ?? 0);
      } else {
        setInvoices([]);
      }
    } catch (err) {
      console.error("Failed to fetch invoices", err);
      toast({
        title: "Error",
        description: "Failed to load invoices",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "received") {
      fetchInvoices(page, statusFilter, typeFilter);
    }
  }, [page, statusFilter, typeFilter, activeTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchInvoices(1, statusFilter, typeFilter);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setModalOpen(true);
  };

  const handleDownload = (invoice: Invoice) => {
    const url = getUploadedFileUrl(invoice.pdfUrl || invoice.fileUrl || "");
    if (url) {
      window.open(url, "_blank");
    } else {
      toast({
        title: "Error",
        description: "Invoice PDF not available",
        variant: "destructive",
      });
    }
  };

  // Compute stats from fetched data
  const pendingCount = invoices.filter((i) => i.status === "pending").length;
  const paidCount = invoices.filter(
    (i) => i.status === "completed" || i.status === "paid",
  ).length;
  const totalRevenue = invoices
    .filter((i) => i.status === "completed" || i.status === "paid")
    .reduce((sum, i) => sum + (i.totalAmount || i.amount || 0), 0);

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription={activeTab === "received" ? "Complete platform management" : "Upload & send manual invoices to users"}
      navItems={ADMIN_NAV_ITEMS}
    >
      <Tabs defaultValue="received" className="w-full" onValueChange={setActiveTab}>
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            {activeTab === "received" ? (
              <>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                  Payment <span className="text-primary italic">Received</span>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Review and manage all client invoices and booking payments.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                  Invoice <span className="text-primary italic">Management</span>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Upload and issue manual invoices directly to users.
                </p>
              </>
            )}
          </div>

          <TabsList className="bg-muted/50 p-1 rounded-xl border border-border h-auto flex flex-wrap gap-1">
            <TabsTrigger 
              value="received" 
              className="px-8 py-2.5 rounded-lg font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              Payment History
            </TabsTrigger>
            <TabsTrigger 
              value="upload" 
              className="px-8 py-2.5 rounded-lg font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              Upload Invoice
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="received" className="outline-none space-y-6">
          {/* Stats */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <div className="bg-background border border-border rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Pending (This Page)</span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
              </div>
              <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-[24px] font-extrabold text-foreground tracking-tight">{loading ? "—" : pendingCount}</h3>
            </div>

            <div className="bg-background border border-border rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Cleared (This Page)</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
              <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-[24px] font-extrabold text-emerald-600 tracking-tight">{loading ? "—" : formatCurrency(totalRevenue)}</h3>
            </div>

            <div className="bg-background border border-border rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Total Records</span>
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <FileText className="w-4 h-4 text-foreground" />
                </div>
              </div>
              <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-[24px] font-extrabold text-foreground tracking-tight">{loading ? "—" : total}</h3>
            </div>
          </div>

          {/* Search & Filter */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                className="pl-10 h-12 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 h-12 bg-background border border-border rounded-xl text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/20 appearance-none min-w-[140px]"
              >
                <option value="all">All Types</option>
                <option value="virtual_office">Virtual Office</option>
                <option value="coworking_space">Coworking</option>
                <option value="meeting_room">Meeting Room</option>
                <option value="admin_manual">Admin Manual</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 h-12 bg-background border border-border rounded-xl text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/20 appearance-none min-w-[120px]"
              >
                <option value="all">All Status</option>
                <option value="completed">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <Button type="submit" variant="outline" className="h-12 px-6 rounded-xl font-bold">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </form>

          <InvoiceTable
            invoices={invoices}
            loading={loading}
            onView={handleViewInvoice}
            onDownload={handleDownload}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 bg-muted/20 p-4 rounded-2xl border border-border">
              <span className="text-sm text-muted-foreground">
                Page <span className="font-bold text-foreground">{page}</span> of{" "}
                <span className="font-bold text-foreground">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg h-9"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg h-9"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="upload" className="outline-none">
          <AdminInvoiceUploadTab />
        </TabsContent>
      </Tabs>

      <InvoiceViewModal
        invoice={selectedInvoice}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </DashboardLayout>
  );
};

// ─── Invoice Table Sub-Component ───────────────────────────────────────────────
const InvoiceTable = ({
  invoices,
  loading,
  onView,
  onDownload,
}: {
  invoices: Invoice[];
  loading: boolean;
  onView: (i: Invoice) => void;
  onDownload: (i: Invoice) => void;
}) => {
  if (loading)
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
        <p className="text-muted-foreground font-medium italic">Loading invoices...</p>
      </div>
    );
  if (invoices.length === 0)
    return (
      <div className="bg-background border border-border rounded-3xl p-20 text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <Receipt className="w-8 h-8 text-muted-foreground opacity-30" />
        </div>
        <p className="text-muted-foreground font-bold">No invoices found matching your filters.</p>
      </div>
    );

  return (
    <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="text-left p-5 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Invoice / ID</th>
              <th className="text-left p-5 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Client</th>
              <th className="text-left p-5 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Service / Type</th>
              <th className="text-left p-5 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Amount</th>
              <th className="text-left p-5 text-[10px] font-black uppercase tracking-wider text-muted-foreground text-center">Status</th>
              <th className="text-right p-5 text-[10px] font-black uppercase tracking-wider text-muted-foreground pr-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {invoices.map((invoice) => {
              const isManual = invoice.invoiceType === "admin_manual";
              return (
                <tr key={invoice._id} className="hover:bg-muted/10 transition-colors group">
                  <td className="p-5">
                    <p className="font-bold text-foreground">{invoice.invoiceNumber}</p>
                    <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[140px]">
                      {getInvoiceReferenceId(invoice)}
                    </p>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] uppercase">
                        {invoice.userName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground leading-tight">{invoice.userName}</p>
                        <p className="text-[10px] text-muted-foreground">{invoice.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="text-xs font-bold text-foreground truncate max-w-[180px]">
                      {getServiceSpaceName(invoice)}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-muted-foreground truncate max-w-[180px]">
                      {getServicePlanName(invoice)}
                    </p>
                    {shouldShowPaymentType(invoice) && (
                      <Badge variant="outline" className="mt-1 text-[9px] h-4 py-0 leading-none px-1.5 font-bold uppercase">
                        {categoryLabel(invoice.paymentType)}
                      </Badge>
                    )}
                  </td>
                  <td className="p-5">
                    <p className="text-base font-black text-foreground">{formatCurrency(invoice.totalAmount || invoice.amount)}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {invoice.createdAt ? format(new Date(invoice.createdAt), "dd MMM yyyy") : "—"}
                    </p>
                  </td>
                  <td className="p-5 text-center">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="p-5 text-right pr-8">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(invoice)}
                        className="h-9 w-9 p-0 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownload(invoice)}
                        className="h-9 w-9 p-0 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;
