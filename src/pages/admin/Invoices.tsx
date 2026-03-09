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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Invoice {invoice.invoiceNumber}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-xs mb-1">Customer</p>
              <p className="font-semibold text-foreground">
                {invoice.userName}
              </p>
              <p className="text-muted-foreground text-xs">
                {invoice.userEmail}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Status</p>
              {getStatusBadge(invoice.status)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-xs mb-1">Space</p>
              <p className="font-medium text-foreground">
                {invoice.spaceName || "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Service Type</p>
              <p className="font-medium text-foreground">
                {categoryLabel(invoice.paymentType)}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-xs mb-1">Plan</p>
              <p className="font-medium text-foreground">
                {invoice.planName || "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Date</p>
              <p className="font-medium text-foreground">
                {invoice.createdAt
                  ? format(new Date(invoice.createdAt), "dd MMM yyyy")
                  : "—"}
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-extrabold text-foreground">
                {formatCurrency(invoice.totalAmount)}
              </p>
            </div>
            {invoice.razorpayOrderId && (
              <p className="text-xs text-muted-foreground mt-2">
                Order ID: {invoice.razorpayOrderId}
              </p>
            )}
            {invoice.razorpayPaymentId && (
              <p className="text-xs text-muted-foreground">
                Payment ID: {invoice.razorpayPaymentId}
              </p>
            )}
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
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Invoice <span className="text-primary italic">Management</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Review and manage all client invoices and payments
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        <div className="bg-background border border-border rounded-xl p-5">
          <p className="text-2xl font-extrabold text-yellow-600">
            {loading ? "—" : pendingCount}
          </p>
          <p className="text-sm text-muted-foreground">Pending (This Page)</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5">
          <p className="text-2xl font-extrabold text-red-600">
            {loading ? "—" : failedCount}
          </p>
          <p className="text-sm text-muted-foreground">Failed</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5">
          <p className="text-2xl font-extrabold text-blue-600">
            {loading ? "—" : total}
          </p>
          <p className="text-sm text-muted-foreground">Total Invoices</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5">
          <p className="text-2xl font-extrabold text-green-600">
            {loading ? "—" : formatCurrency(totalRevenue)}
          </p>
          <p className="text-sm text-muted-foreground">Cleared (This Page)</p>
        </div>
      </div>

      {/* Search & Filter */}
      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground outline-none"
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
          className="px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground outline-none"
        >
          <option value="all">All Status</option>
          <option value="completed">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <Button type="submit" variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Apply
        </Button>
      </form>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingInvoices.length})
          </TabsTrigger>
          <TabsTrigger value="paid">Paid ({paidInvoices.length})</TabsTrigger>
          <TabsTrigger value="all">All Invoices</TabsTrigger>
        </TabsList>

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
                  className="bg-background border border-border rounded-xl p-5 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-foreground">
                        {invoice.invoiceNumber}
                      </span>
                      <Badge variant="outline">
                        {categoryLabel(invoice.paymentType)}
                      </Badge>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <p className="text-foreground font-medium">
                      {invoice.userName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.userEmail}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {invoice.spaceName} · {invoice.planName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-foreground">
                      {formatCurrency(invoice.totalAmount)}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      {format(new Date(invoice.createdAt), "dd MMM yyyy")}
                    </p>
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewInvoice(invoice)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownload(invoice)}
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
    <div className="bg-background border border-border rounded-xl overflow-hidden">
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
            <th className="text-left p-4 text-sm font-semibold text-foreground">
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
                <p className="font-medium text-foreground">
                  {invoice.invoiceNumber}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {invoice.razorpayOrderId}
                </p>
              </td>
              <td className="p-4">
                <p className="font-medium text-foreground">
                  {invoice.userName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {invoice.userEmail}
                </p>
              </td>
              <td className="p-4">
                <p className="text-sm text-foreground">
                  {invoice.spaceName || "—"}
                </p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {categoryLabel(invoice.paymentType)}
                </Badge>
              </td>
              <td className="p-4 font-semibold text-foreground">
                {formatCurrency(invoice.totalAmount)}
              </td>
              <td className="p-4 text-muted-foreground text-sm">
                {invoice.createdAt
                  ? format(new Date(invoice.createdAt), "dd MMM yyyy")
                  : "—"}
              </td>
              <td className="p-4">{getStatusBadge(invoice.status)}</td>
              <td className="p-4">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(invoice)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDownload(invoice)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Invoices;
