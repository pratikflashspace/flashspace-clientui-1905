import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import {
  AdminPartnerListItem,
  adminService,
} from "@/services/admin.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPageSkeleton, StatsSkeleton, TableSkeleton } from "@/components/ui/skeleton-loaders";
import { toast } from "@/hooks/use-toast";
import { 
  Eye, 
  Loader2, 
  RotateCcw, 
  Search, 
  CheckCircle, 
  XCircle, 
  Building2, 
  MapPin,
  FileText,
  CheckCircle2,
  Clock,
  Upload,
  X,
  FileCheck2,
  CreditCard,
  Hash,
  CalendarDays,
  TrendingUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { axiosInstance } from "@/lib/axios";
import { getUploadedFileUrl } from "@/utils/fileUrl";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast as sonnerToast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// --- Partner Management Tab Component ---
const PartnersManagementTab = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<AdminPartnerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    limit: 10
  });
  const [selectedPartnerSpaces, setSelectedPartnerSpaces] = useState<{
    name: string;
    spaces: AdminPartnerListItem["spaces"];
  } | null>(null);

  const fetchPartners = async (page = 1, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    if (!isRefresh) setLoading(true);

    try {
      const response = await adminService.getPartners({ 
        page, 
        limit: pagination.limit, 
        search: searchQuery 
      });

      if (response.success && response.data?.partners) {
        setPartners(response.data.partners);
        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.data.pagination.total,
            pages: response.data.pagination.pages
          }));
        }
      } else {
        setPartners([]);
      }
    } catch (error) {
      console.error("Failed to fetch partners", error);
      toast({
        title: "Error",
        description: "Could not load partners. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchPartners(currentPage);
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    void fetchPartners(1);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    void fetchPartners(1, true);
  };

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const searchedPartners = useMemo(() => {
    if (!normalizedSearch) return partners;

    return partners.filter((partner) =>
      [partner.name, partner.email, partner.phone].some((value) =>
        value?.toLowerCase().includes(normalizedSearch),
      ),
    );
  }, [partners, normalizedSearch]);

  if (loading) return <AdminPageSkeleton />;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-background border border-border rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Total Partners</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
          </div>
          <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-[24px] font-extrabold text-foreground tracking-tight">{pagination.total}</h3>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name, email, or phone..."
            className="pl-10"
          />
        </form>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={refreshing}
          className="w-full sm:w-auto"
        >
          {refreshing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RotateCcw className="w-4 h-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        All Partners ({pagination.total})
      </p>

      <div className="hidden md:block bg-background border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 pl-[64px] text-sm font-bold capitalize text-muted-foreground">
                  Partner
                </th>
                <th className="text-left p-4 text-sm font-bold capitalize text-muted-foreground">
                  Email
                </th>
                <th className="text-left p-4 text-sm font-bold capitalize text-muted-foreground">
                  Phone
                </th>
                <th className="text-left p-4 text-sm font-bold capitalize text-muted-foreground">
                  Spaces
                </th>
                <th className="text-center p-4 text-sm font-bold capitalize text-muted-foreground">
                  KYC
                </th>
                <th className="text-center p-4 text-sm font-bold capitalize text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {searchedPartners.length > 0 ? (
                searchedPartners.map((partner) => (
                  <tr
                    key={partner.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="h-9 w-9 ring-2 ring-background shadow-sm">
                          {partner.profilePicture && (
                            <AvatarImage src={partner.profilePicture} alt={partner.name} className="object-cover" />
                          )}
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                            {partner.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "PA"}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-semibold text-foreground whitespace-nowrap">{partner.name}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{partner.email}</td>
                    <td className="p-4 text-sm text-muted-foreground">{partner.phone}</td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">
                            {partner.totalSpaces} Spaces
                          </span>
                        </div>
                        {partner.totalSpaces > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:bg-primary/10"
                            onClick={() => setSelectedPartnerSpaces({
                              name: partner.name,
                              spaces: partner.spaces
                            })}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {partner.kycVerified ? (
                        <div className="flex items-center justify-center text-green-600 gap-1 text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Verified
                        </div>
                      ) : (
                        <div className="flex items-center justify-center text-amber-600 gap-1 text-sm font-medium">
                          <XCircle className="w-4 h-4" />
                          Pending
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        variant="ghost"
                        className="text-primary"
                        onClick={() => navigate(`/admin/users?search=${partner.email}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="p-12 text-center text-muted-foreground font-medium"
                  >
                    No partners found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {searchedPartners.length > 0 ? (
          searchedPartners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-foreground truncate">
                    {partner.name}
                  </p>
                  <p className="text-sm text-muted-foreground break-all">{partner.email}</p>
                  <p className="text-sm text-muted-foreground">{partner.phone}</p>
                </div>
                {partner.kycVerified ? (
                  <Badge className="bg-green-100 text-green-700">Verified</Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-700">Pending</Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Spaces</p>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{partner.totalSpaces}</p>
                    {partner.totalSpaces > 0 && (
                      <button 
                        onClick={() => setSelectedPartnerSpaces({
                          name: partner.name,
                          spaces: partner.spaces
                        })}
                        className="text-primary"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                variant="outline"
                onClick={() => navigate(`/admin/users?search=${partner.email}`)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Manage User
              </Button>
            </div>
          ))
        ) : (
          <div className="bg-muted/30 border border-dashed border-border rounded-2xl p-10 text-center text-muted-foreground">
            No partners found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(p => Math.max(1, p - 1));
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {[...Array(pagination.pages)].map((_, idx) => {
                const pageNum = idx + 1;
                if (
                  pageNum === 1 || 
                  pageNum === pagination.pages || 
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink 
                        isActive={currentPage === pageNum}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNum);
                        }}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  pageNum === currentPage - 2 || 
                  pageNum === currentPage + 2
                ) {
                  return <PaginationEllipsis key={pageNum} />;
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(p => Math.min(pagination.pages, p + 1));
                  }}
                  className={currentPage === pagination.pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Spaces Detail Modal */}
      <Dialog 
        open={!!selectedPartnerSpaces} 
        onOpenChange={(open) => !open && setSelectedPartnerSpaces(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <span>Spaces for {selectedPartnerSpaces?.name}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {selectedPartnerSpaces?.spaces && selectedPartnerSpaces.spaces.length > 0 ? (
              <div className="grid gap-3">
                {selectedPartnerSpaces.spaces.map((space, index) => (
                  <div 
                    key={index} 
                    className="p-3 border border-border rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-foreground">{space.name}</h4>
                      <Badge variant="secondary" className="text-[10px] py-0">{space.type}</Badge>
                    </div>
                    {space.location && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{space.location}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No spaces allotted.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// --- Partner Invoices Tab Component (Full Logic) ---
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

const PartnerInvoicesTab = () => {
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
        if (Array.isArray(d)) {
          setInvoices(d);
        } else {
          setInvoices(d.invoices || []);
          setStats(d.stats || null);
        }
      }
    } catch (error) {
      console.error("Failed to fetch partner invoices", error);
      sonnerToast.error("Failed to load partner invoices");
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
    if (normalizeInvoiceStatus(invoice.status) === "Paid" && hasSettlementDetails(invoice)) return;
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
      const response = await axiosInstance.post(`/api/partnerInvoices/extract-utr/${Date.now()}`, formData, { timeout: 180000 });
      const extractedText = response.data?.data?.extractedText || "";
      const utrNumber = response.data?.data?.utrNumber || extractUtrFromText(extractedText);
      if (utrNumber) {
        setPaymentForm((prev) => ({ ...prev, utrNumber, fetchMode: "AUTO" }));
        sonnerToast.success("UTR auto-filled from payment proof");
      } else {
        setPaymentForm((prev) => ({ ...prev, fetchMode: "MANUAL" }));
        sonnerToast.info("UTR not found. Please enter it manually.");
      }
    } catch (error: any) {
      setPaymentForm((prev) => ({ ...prev, fetchMode: "MANUAL" }));
      sonnerToast.info("Could not auto fetch UTR. Please enter it manually.");
    } finally {
      setExtractingUtr(false);
    }
  };

  const handlePaymentProofSelect = (file?: File | null) => {
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      sonnerToast.error("Upload an image or PDF payment proof");
      return;
    }
    setPaymentProofFile(file);
    if (paymentForm.fetchMode === "AUTO") runUtrExtraction(file);
  };

  const handleConfirmPaid = async () => {
    if (!selectedInvoice) return;
    if (!paymentForm.paymentMethod || !paymentForm.amountPaid || !paymentForm.paymentDate || !paymentForm.utrNumber || !paymentProofFile) {
      sonnerToast.error("Please complete all payment details before confirming.");
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
      const response = await axiosInstance.patch(`/api/partnerInvoices/${selectedInvoice._id}/pay`, formData);
      if (response.data.success) {
        sonnerToast.success("Invoice settlement marked as paid");
        await fetchInvoices();
        setPaymentModalOpen(false);
      }
    } catch (error: any) {
      sonnerToast.error(error?.response?.data?.message || "Failed to mark invoice as paid");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(amount);

  const filteredInvoices = invoices.filter((i) => {
    const searchLower = searchQuery.toLowerCase();
    const partnerName = (i.partnerId?.fullName || '').toLowerCase();
    const matchesSearch = i.invoiceNumber.toLowerCase().includes(searchLower) || partnerName.includes(searchLower);
    const matchesTab = activeTab === "All" || normalizeInvoiceStatus(i.status) === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedInvoices = filteredInvoices.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  const visibleStart = filteredInvoices.length ? (safePage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const visibleEnd = Math.min(safePage * ITEMS_PER_PAGE, filteredInvoices.length);

  return (
    <div className="animate-in fade-in duration-500">
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-background border border-border rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Total Invoices</span>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
            </div>
            <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-[24px] font-extrabold text-foreground tracking-tight">{formatCurrency(stats.totalAmount)}</h3>
            <p className="text-xs text-muted-foreground mt-1">{stats.totalCount} invoices</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-background border border-border rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Total Paid</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-[24px] font-extrabold text-foreground tracking-tight">{formatCurrency(stats.totalPaid)}</h3>
            <p className="text-xs text-muted-foreground mt-1">{stats.countPaid} paid</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-background border border-border rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Total Pending</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-[24px] font-extrabold text-foreground tracking-tight">{formatCurrency(stats.totalPending)}</h3>
            <p className="text-xs text-muted-foreground mt-1">{stats.countPending} pending</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-background border border-border rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Paid Rate</span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-[24px] font-extrabold text-foreground tracking-tight">{stats.totalCount > 0 ? Math.round((stats.countPaid / stats.totalCount) * 100) : 0}%</h3>
            <p className="text-xs text-muted-foreground mt-1">{stats.countPaid} of {stats.totalCount}</p>
          </motion.div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by invoice number or partner name..." className="pl-10 h-11 bg-background" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="bg-muted/50 p-1 rounded-xl w-fit flex items-center border border-border">
          {["All", "Pending", "Paid"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{tab}</button>
          ))}
        </div>
      </div>

      <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden min-h-[450px]">
        {loading ? <div className="p-8"><TableSkeleton rows={8} cols={7} /></div> : (
          <AnimatePresence mode="wait">
            <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {filteredInvoices.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[450px] text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4"><FileText className="w-8 h-8 text-muted-foreground opacity-30" /></div>
                  <h3 className="text-lg font-bold">No Invoices Found</h3>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-6 py-4 text-sm font-bold text-muted-foreground capitalize">Invoice #</th>
                        <th className="px-6 py-4 text-sm font-bold text-muted-foreground capitalize">Partner Details</th>
                        <th className="px-6 py-4 text-sm font-bold text-muted-foreground capitalize">Date</th>
                        <th className="px-6 py-4 text-sm font-bold text-muted-foreground capitalize">Amount</th>
                        <th className="px-6 py-4 text-sm font-bold text-muted-foreground capitalize">Status</th>
                        <th className="px-6 py-4 text-sm font-bold text-muted-foreground capitalize">Payment Details</th>
                        <th className="px-6 py-4 text-sm font-bold text-muted-foreground capitalize text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {paginatedInvoices.map((record, idx) => {
                        const status = normalizeInvoiceStatus(record.status);
                        const details = record.paymentDetails;
                        const settlementComplete = hasSettlementDetails(record);
                        return (
                          <motion.tr key={record._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }} className="group hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-4 font-bold text-foreground">{record.invoiceNumber}</td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-foreground">{record.partnerId?.fullName || 'Unknown Partner'}</span>
                                <span className="text-xs text-muted-foreground">{record.partnerId?.email}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-foreground">{formatDate(record.date)}</td>
                            <td className="px-6 py-4 font-bold text-foreground">{formatCurrency(record.amount)}</td>
                            <td className="px-6 py-4">
                              <Badge variant="secondary" className={`font-bold text-[10px] uppercase flex items-center w-fit gap-1 ${status === "Paid" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"}`}>
                                {status === "Paid" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                {status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 min-w-[260px]">
                              {status === "Paid" && settlementComplete ? (
                                <div className="grid gap-1.5 text-xs">
                                  <div className="flex items-center gap-2 text-foreground font-semibold"><CreditCard className="w-3.5 h-3.5 text-primary" />{details.paymentMethod || "-"} - {formatCurrency(details.amountPaid || record.amount)}</div>
                                  <div className="flex items-center gap-2 text-muted-foreground"><CalendarDays className="w-3.5 h-3.5" />{formatPaymentDate(details.paymentDate)}</div>
                                  <div className="flex items-center gap-2 text-muted-foreground"><Hash className="w-3.5 h-3.5" /><span className="font-mono text-[11px] text-foreground">{details.utrNumber || "-"}</span></div>
                                </div>
                              ) : <span className={`text-xs ${status === "Paid" ? "font-semibold text-amber-700" : "text-muted-foreground"}`}>{status === "Paid" ? "Settlement details missing" : "Awaiting settlement"}</span>}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-3">
                                <a href={getUploadedFileUrl(record.fileUrl)} target="_blank" rel="noreferrer"><Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Eye className="w-4 h-4" /></Button></a>
                                {details?.paymentProof && <a href={getUploadedFileUrl(details.paymentProof)} target="_blank" rel="noreferrer"><Button variant="ghost" size="sm" className="h-8 w-8 p-0"><FileCheck2 className="w-4 h-4" /></Button></a>}
                                {(status === "Pending" || !settlementComplete) ? <Button size="sm" onClick={() => openPaymentModal(record)} disabled={processingId === record._id} className="h-8 text-xs font-bold">{processingId === record._id ? <Loader2 className="w-3 h-3 animate-spin" /> : status === "Paid" ? "Add Details" : "Mark as Paid"}</Button> : <Button size="sm" disabled className="h-8 text-xs font-bold bg-muted text-muted-foreground">Paid</Button>}
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
          <p className="text-xs font-medium text-muted-foreground">Showing <span className="font-bold text-foreground">{visibleStart}</span>-<span className="font-bold text-foreground">{visibleEnd}</span> of <span className="font-bold text-foreground">{filteredInvoices.length}</span> invoices</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={safePage <= 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Previous</Button>
            <div className="flex h-9 min-w-20 items-center justify-center rounded-lg border border-border bg-muted/20 px-3 text-xs font-bold">{safePage} / {totalPages}</div>
            <Button variant="outline" size="sm" disabled={safePage >= totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next</Button>
          </div>
        </div>
      )}

      {paymentModalOpen && (
        <Dialog open={paymentModalOpen} onOpenChange={(open) => !open && closePaymentModal()}>
          <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-hidden p-0 border-none bg-transparent shadow-none">
            <div className="relative w-full overflow-hidden rounded-xl border border-border bg-background text-foreground shadow-2xl flex flex-col">
              <button type="button" onClick={closePaymentModal} disabled={!!processingId || extractingUtr} className="absolute right-4 top-4 z-10 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"><X className="h-4 w-4" /></button>
              <div className="border-b border-border px-6 py-5 pr-14">
                <DialogTitle asChild><h2 className="flex items-center gap-3 text-xl font-extrabold"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><CreditCard className="h-5 w-5" /></span>Payment Settlement</h2></DialogTitle>
                <p className="text-sm text-muted-foreground">{selectedInvoice ? `${selectedInvoice.invoiceNumber} - ${formatCurrency(selectedInvoice.amount)}` : "Confirm partner invoice payment"}</p>
              </div>
              <div className="overflow-y-auto px-6 py-5 max-h-[70vh]">
                <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2"><Label>Payment Method</Label><Select value={paymentForm.paymentMethod || "none"} onValueChange={(v) => setPaymentForm(p => ({ ...p, paymentMethod: v === "none" ? "" : v }))}><SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select method" /></SelectTrigger><SelectContent><SelectItem value="none" className="hidden">Select method</SelectItem>{paymentMethods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select></div>
                      <div className="space-y-2"><Label>Amount Paid</Label><Input type="number" className="h-11 rounded-xl" value={paymentForm.amountPaid} onChange={(e) => setPaymentForm(p => ({ ...p, amountPaid: e.target.value }))} /></div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2"><Label>Payment Date</Label><Input type="date" className="h-11 rounded-xl" value={paymentForm.paymentDate} onChange={(e) => setPaymentForm(p => ({ ...p, paymentDate: e.target.value }))} /></div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between"><Label>UTR Number</Label><button type="button" onClick={() => setPaymentForm(p => ({ ...p, fetchMode: p.fetchMode === "AUTO" ? "MANUAL" : "AUTO" }))} className="text-[10px] font-bold text-primary uppercase hover:underline">{paymentForm.fetchMode} MODE</button></div>
                        <div className="relative"><Input className="h-11 rounded-xl pr-10 font-mono" placeholder="Enter UTR number" value={paymentForm.utrNumber} onChange={(e) => setPaymentForm(p => ({ ...p, utrNumber: e.target.value }))} />{extractingUtr && <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-primary" />}</div>
                      </div>
                    </div>
                    <div className="space-y-3 pt-2">
                      <Label>Upload Payment Proof</Label>
                      <div className="relative group cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 p-8 transition-all hover:border-primary/50 hover:bg-primary/5">
                        <input type="file" className="absolute inset-0 z-10 cursor-pointer opacity-0" accept="image/*,application/pdf" onChange={(e) => handlePaymentProofSelect(e.target.files?.[0])} />
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="mb-3 rounded-full bg-background p-3 shadow-sm group-hover:scale-110 transition-transform"><Upload className="h-6 w-6 text-primary" /></div>
                          <p className="text-sm font-bold text-foreground">Click or drag to upload proof</p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG, or PDF up to 5MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <Label className="mb-2">Proof Preview</Label>
                    <div className="flex-1 rounded-xl border border-border bg-muted/30 flex items-center justify-center overflow-hidden min-h-[260px] relative">
                      {paymentProofPreview ? (
                        paymentProofFile?.type === "application/pdf" ? (
                          <div className="flex flex-col items-center gap-3"><FileText className="h-16 w-16 text-primary/40" /><p className="text-xs font-bold text-muted-foreground">{paymentProofFile.name}</p></div>
                        ) : <img src={paymentProofPreview} className="h-full w-full object-contain" alt="Proof preview" />
                      ) : <div className="flex flex-col items-center gap-3"><FileCheck2 className="h-16 w-16 text-muted-foreground/20" /><p className="text-xs font-medium text-muted-foreground">No proof selected</p></div>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-border bg-muted/20 px-6 py-5 flex items-center justify-end gap-3">
                <Button variant="ghost" onClick={closePaymentModal} disabled={!!processingId || extractingUtr}>Cancel</Button>
                <Button onClick={handleConfirmPaid} disabled={!!processingId || extractingUtr || !paymentProofFile} className="min-w-[160px] h-11 rounded-xl font-bold shadow-lg shadow-primary/20">{processingId ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}Confirm Payout</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// --- Main Partners Page ---
const PartnersPage = () => {
  const [activeTab, setActiveTab] = useState("management");

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription={activeTab === "management" ? "Complete platform management" : "Manage Partner Invoices"}
      navItems={ADMIN_NAV_ITEMS}
    >
      <Tabs defaultValue="management" className="w-full" onValueChange={setActiveTab}>
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            {activeTab === "management" ? (
              <>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                  Partner <span className="text-primary italic">Management</span>
                </h1>
                <p className="text-[#6B7280] mt-2">
                  View all space partners, their contact details, and allotted spaces.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                  Partner Invoices <span className="text-primary italic">Management</span>
                </h1>
                <p className="text-sm md:text-base text-[#6B7280] mt-1">
                  Review invoices submitted by Space Partners and manage payouts.
                </p>
              </>
            )}
          </div>

          <TabsList className="bg-muted/50 p-1 rounded-xl border border-border h-auto flex flex-wrap gap-1">
            <TabsTrigger 
              value="management" 
              className="px-8 py-2.5 rounded-lg font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              Partner Management
            </TabsTrigger>
            <TabsTrigger 
              value="invoices" 
              className="px-8 py-2.5 rounded-lg font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
            >
              Partner Invoices
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="management" className="outline-none">
          <PartnersManagementTab />
        </TabsContent>
        
        <TabsContent value="invoices" className="outline-none">
          <PartnerInvoicesTab />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default PartnersPage;
