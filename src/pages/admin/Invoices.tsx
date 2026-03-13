import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { adminService } from "@/services/admin.service";
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
} from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

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
}

const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case "completed":
    case "paid":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Paid
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive">
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-3xl border-0 shadow-2xl">
        <DialogHeader className="px-6 py-5 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Invoice {invoice.invoiceNumber}
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-5 text-sm max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Customer</p>
              <p className="font-semibold text-gray-900 leading-tight">
                {invoice.userName}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {invoice.userEmail}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Status</p>
              <div className="mt-0.5">
                {getStatusBadge(invoice.status)}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Space</p>
              <p className="font-medium text-gray-900">
                {invoice.spaceName || "—"}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Service Type</p>
              <p className="font-medium text-gray-900">
                {categoryLabel(invoice.paymentType)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Plan</p>
              <p className="font-medium text-gray-900">
                {invoice.planName || "—"}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Date</p>
              <p className="font-medium text-gray-900">
                {invoice.createdAt
                  ? format(new Date(invoice.createdAt), "dd MMM yyyy")
                  : "—"}
              </p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-5 mt-2">
            <div className="flex items-center justify-between gap-4">
              <p className="text-gray-500 font-medium">Total Amount</p>
              <p className="text-2xl font-black text-primary">
                {formatCurrency(invoice.totalAmount)}
              </p>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-xl space-y-1">
              {invoice.razorpayOrderId && (
                <p className="text-[10px] text-gray-400 font-medium">
                  Order ID: <span className="font-mono text-gray-600">{invoice.razorpayOrderId}</span>
                </p>
              )}
              {invoice.razorpayPaymentId && (
                <p className="text-[10px] text-gray-400 font-medium">
                  Payment ID: <span className="font-mono text-gray-600">{invoice.razorpayPaymentId}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
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
    fetchInvoices(page, statusFilter, typeFilter);
  }, [page, statusFilter, typeFilter]);

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
    toast({
      title: "Downloading Invoice",
      description: `${invoice.invoiceNumber} is being prepared as PDF.`,
    });
  };

  // Compute stats from fetched data
  const pendingCount = invoices.filter((i) => i.status === "pending").length;
  const paidCount = invoices.filter(
    (i) => i.status === "completed" || i.status === "paid",
  ).length;
  const failedCount = invoices.filter((i) => i.status === "failed").length;
  const totalRevenue = invoices
    .filter((i) => i.status === "completed" || i.status === "paid")
    .reduce((sum, i) => sum + (i.totalAmount || 0), 0);

  const pendingInvoices = invoices.filter((i) => i.status === "pending");
  const paidInvoices = invoices.filter(
    (i) => i.status === "completed" || i.status === "paid",
  );

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
          Invoice <span className="text-primary italic">Management</span>
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Review and manage all client invoices and payments
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-background border border-border rounded-xl p-5 hover:border-yellow-200 transition-colors">
          <p className="text-2xl font-extrabold text-yellow-600">
            {loading ? "—" : pendingCount}
          </p>
          <p className="text-sm text-muted-foreground font-medium">Pending (This Page)</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 hover:border-red-200 transition-colors">
          <p className="text-2xl font-extrabold text-red-600">
            {loading ? "—" : failedCount}
          </p>
          <p className="text-sm text-muted-foreground font-medium">Failed</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 hover:border-blue-200 transition-colors">
          <p className="text-2xl font-extrabold text-blue-600">
            {loading ? "—" : total}
          </p>
          <p className="text-sm text-muted-foreground font-medium">Total Invoices</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 hover:border-green-200 transition-colors">
          <p className="text-2xl font-extrabold text-green-600">
            {loading ? "—" : formatCurrency(totalRevenue)}
          </p>
          <p className="text-sm text-muted-foreground font-medium">Cleared (This Page)</p>
        </div>
      </div>

      {/* Search & Filter */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            className="pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="flex-1 md:flex-none px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 min-w-[140px] appearance-none"
          >
            <option value="all">All Types</option>
            <option value="virtual_office">Virtual Office</option>
            <option value="coworking_space">Coworking Space</option>
            <option value="meeting_room">Meeting Room</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="flex-1 md:flex-none px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/20 min-w-[120px] appearance-none"
          >
            <option value="all">All Status</option>
            <option value="completed">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <Button type="submit" variant="outline" className="h-11 shadow-sm px-6">
          <Filter className="w-4 h-4 mr-2" />
          Apply Filters
        </Button>
      </form>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="overflow-x-auto pb-1 -mx-2 px-2 scrollbar-none">
          <TabsList className="h-auto p-1 bg-muted/50 rounded-lg inline-flex w-full md:w-auto">
            <TabsTrigger value="pending" className="px-5 py-2.5 text-sm">
              Pending ({pendingInvoices.length})
            </TabsTrigger>
            <TabsTrigger value="paid" className="px-5 py-2.5 text-sm">Paid ({paidInvoices.length})</TabsTrigger>
            <TabsTrigger value="all" className="px-5 py-2.5 text-sm">All Invoices</TabsTrigger>
          </TabsList>
        </div>

        {/* ── Pending Tab ── */}
        <TabsContent value="pending">
          {loading ? (
            <div className="p-10 text-center text-muted-foreground">
              Loading…
            </div>
          ) : pendingInvoices.length === 0 ? (
            <div className="bg-background border border-border rounded-xl p-10 text-center text-muted-foreground">
              No pending invoices found.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingInvoices.map((invoice) => (
                <div
                  key={invoice._id}
                  className="bg-background border border-border rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/20 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-bold text-foreground text-sm tracking-tight">
                        {invoice.invoiceNumber}
                      </span>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-[10px] h-5 py-0">
                          {categoryLabel(invoice.paymentType)}
                        </Badge>
                        {getStatusBadge(invoice.status)}
                      </div>
                    </div>
                    <div>
                      <p className="text-foreground font-semibold text-base leading-tight">
                        {invoice.userName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {invoice.userEmail}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium pt-1">
                      {invoice.spaceName} · <span className="text-primary">{invoice.planName}</span>
                    </p>
                  </div>
                  <div className="flex items-end md:items-center justify-between md:flex-col md:text-right border-t border-border/50 md:border-0 pt-3 md:pt-0">
                    <div className="md:mb-1">
                      <p className="text-xl md:text-2xl font-black text-foreground md:leading-none">
                        {formatCurrency(invoice.totalAmount)}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1 font-medium">
                        {format(new Date(invoice.createdAt), "dd MMM yyyy")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewInvoice(invoice)}
                        className="h-9 px-4 rounded-lg border-muted-foreground/20"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownload(invoice)}
                        className="h-9 w-9 p-0 rounded-lg hover:bg-muted"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Paid Tab ── */}
        <TabsContent value="paid">
          <InvoiceTable
            invoices={paidInvoices}
            loading={loading}
            onView={handleViewInvoice}
            onDownload={handleDownload}
          />
        </TabsContent>

        {/* ── All Tab ── */}
        <TabsContent value="all">
          <InvoiceTable
            invoices={invoices}
            loading={loading}
            onView={handleViewInvoice}
            onDownload={handleDownload}
          />
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <span className="text-sm text-muted-foreground">
            Page <span className="font-bold text-foreground">{page}</span> of{" "}
            <span className="font-bold text-foreground">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

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
      <div className="p-10 text-center text-muted-foreground">Loading…</div>
    );
  if (invoices.length === 0)
    return (
      <div className="bg-background border border-border rounded-xl p-10 text-center text-muted-foreground">
        No invoices found.
      </div>
    );

  return (
    <div className="space-y-4">
      {/* Desktop View */}
      <div className="hidden lg:block bg-background border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                Invoice ID
              </th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                Customer
              </th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                Service
              </th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                Amount
              </th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                Date
              </th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                Status
              </th>
              <th className="text-left p-4 text-sm font-semibold text-foreground text-right px-6">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice._id}
                className="border-t border-border hover:bg-muted/20 transition-colors"
              >
                <td className="p-4">
                  <p className="font-bold text-foreground text-sm tracking-tight">
                    {invoice.invoiceNumber}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[120px]">
                    {invoice.razorpayOrderId}
                  </p>
                </td>
                <td className="p-4">
                  <p className="font-semibold text-foreground text-sm">
                    {invoice.userName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {invoice.userEmail}
                  </p>
                </td>
                <td className="p-4">
                  <p className="text-xs font-medium text-foreground truncate max-w-[150px]">
                    {invoice.spaceName || "—"}
                  </p>
                  <Badge variant="outline" className="mt-1 text-[10px] h-5 py-0 px-2 font-medium">
                    {categoryLabel(invoice.paymentType)}
                  </Badge>
                </td>
                <td className="p-4 font-black text-foreground">
                  {formatCurrency(invoice.totalAmount)}
                </td>
                <td className="p-4 text-muted-foreground text-xs font-medium">
                  {invoice.createdAt
                    ? format(new Date(invoice.createdAt), "dd MMM yyyy")
                    : "—"}
                </td>
                <td className="p-4">{getStatusBadge(invoice.status)}</td>
                <td className="p-4 text-right px-6">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(invoice)}
                      className="h-8 w-8 p-0 rounded-lg"
                    >
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDownload(invoice)}
                      className="h-8 w-8 p-0 rounded-lg"
                    >
                      <Download className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet View */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
        {invoices.map((invoice) => (
          <div
            key={invoice._id}
            className="bg-background border border-border rounded-xl p-4 space-y-4 hover:border-primary/20 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">
                  {invoice.invoiceNumber}
                </p>
                <h3 className="font-bold text-foreground leading-tight">
                  {invoice.userName}
                </h3>
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {invoice.userEmail}
                </p>
              </div>
              {getStatusBadge(invoice.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/50">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Service</p>
                <p className="text-xs font-semibold text-foreground leading-tight truncate">
                  {invoice.spaceName || "—"}
                </p>
                <Badge variant="outline" className="mt-1 text-[9px] h-4 py-0 leading-none px-1.5">
                  {categoryLabel(invoice.paymentType)}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Date</p>
                <p className="text-xs font-semibold text-foreground">
                  {invoice.createdAt ? format(new Date(invoice.createdAt), "dd MMM yyyy") : "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight leading-none mb-1">Total Amount</p>
                <p className="text-xl font-black text-primary leading-none">
                  {formatCurrency(invoice.totalAmount)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(invoice)}
                  className="h-10 px-4 rounded-xl border-muted-foreground/20 font-bold text-xs"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(invoice)}
                  className="h-10 w-10 p-0 rounded-xl border-muted-foreground/20"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Invoices;
