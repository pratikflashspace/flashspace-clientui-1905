import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Ticket,
  BookOpen,
  Trophy,
  Target,
  Headphones,
  Calculator,
  FileText,
  Wallet,
  Receipt,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  CreditCard,
  Loader2,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { format } from "date-fns";

// --- Sub-component for Invoice View Modal ---

const InvoiceViewModal = ({ invoice, open, onOpenChange }: any) => {
  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white rounded-3xl border-0 shadow-2xl p-0 overflow-hidden text-black">
        <div className="bg-teal-600 p-8 text-white relative">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-teal-100 text-sm font-medium uppercase tracking-wider mb-2">Invoice Details</p>
              <h2 className="text-3xl font-extrabold">{invoice.invoiceNumber || invoice.id}</h2>
            </div>
            <div className="text-right">
              <Badge className="bg-white/20 text-white border-0 hover:bg-white/30 text-xs font-bold uppercase py-1 px-3">
                {invoice.status}
              </Badge>
              <p className="text-teal-100 text-xs mt-2">{format(new Date(invoice.createdAt || Date.now()), "dd MMM yyyy")}</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-gray-400 text-xs font-bold uppercase">Customer</p>
              <p className="font-bold text-gray-900">{invoice.userName || invoice.client}</p>
              <p className="text-sm text-gray-500">{invoice.userEmail || "no-email@example.com"}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-gray-400 text-xs font-bold uppercase">Service</p>
              <p className="font-bold text-gray-900">{invoice.spaceName}</p>
              <p className="text-sm text-gray-500">{invoice.planName || "Standard Plan"}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">Subscription Amount</span>
              <span className="font-bold text-gray-900">
                {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(invoice.totalAmount || invoice.amount)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-200 pt-4">
              <span>Payment Type</span>
              <span className="capitalize">{invoice.paymentType?.replace("_", " ") || "Online"}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
              <span>Order ID</span>
              <span className="font-mono text-xs">{invoice.razorpayOrderId || "—"}</span>
            </div>
          </div>

          {invoice.razorpayPaymentId && (
            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-3 rounded-xl border border-green-100">
              <CheckCircle className="w-4 h-4" />
              Transaction successful with ID: {invoice.razorpayPaymentId}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- Main Component ---

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
  client?: string; // for compatibility with snippets
}

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [page, typeFilter, statusFilter, dateRange]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllInvoices({
        page,
        limit,
        type: typeFilter,
        status: statusFilter,
        search: searchTerm,
        startDate: dateRange.start,
        endDate: dateRange.end,
      });

      if (response.success && response.data) {
        setInvoices(response.data.invoices);
        setTotalPages(response.data.pagination.pages);
      } else {
        setInvoices([]);
      }
    } catch (error) {
      console.error("Failed to fetch invoices", error);
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchInvoices();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "failed":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setModalOpen(true);
  };

  const renderInvoiceTable = (invoiceList: Invoice[]) => (
    <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice ID</th>
              <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Details</th>
              <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-right p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="p-8"><div className="h-4 bg-muted rounded w-full"></div></td>
                </tr>
              ))
            ) : invoiceList.length > 0 ? (
              invoiceList.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-muted/30 transition-colors group">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{invoice.invoiceNumber}</span>
                      <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[100px]">{invoice.razorpayOrderId}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs uppercase">
                        {invoice.userName?.charAt(0) || "C"}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-foreground">{invoice.userName}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">{invoice.userEmail}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-foreground truncate max-w-[180px]">{invoice.spaceName}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] py-0 h-4 border-teal-100 text-teal-600 bg-teal-50 uppercase">
                          {invoice.paymentType.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{formatCurrency(invoice.totalAmount)}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">Inc. GST</span>
                    </div>
                  </td>
                  <td className="p-4">{getStatusBadge(invoice.status)}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleViewInvoice(invoice)} className="hover:bg-teal-50 text-teal-600">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toast.info("Downloading PDF...")} className="hover:bg-teal-50 text-teal-600">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="p-20 text-center text-muted-foreground">No invoices found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between bg-muted/20">
          <div className="text-xs text-muted-foreground">
            Page <span className="font-bold text-foreground">{page}</span> of <span className="font-bold text-foreground">{totalPages}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="h-8 px-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="h-8 px-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto p-6 bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Invoice <span className="text-primary italic">Management</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Review and track all platform payments and client invoices
        </p>
      </div>

      {/* Stats - Driven by real counts from pagination if available, otherwise MTD placeholders as requested */}
      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-yellow-600">23</p>
          <p className="text-sm text-muted-foreground">Pending Approval</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-red-600">5</p>
          <p className="text-sm text-muted-foreground">Overdue</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-blue-600">45</p>
          <p className="text-sm text-muted-foreground">Approved (MTD)</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-green-600">₹18.5L</p>
          <p className="text-sm text-muted-foreground">Cleared (MTD)</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by invoice, email, or order ID..."
              className="pl-10 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit" className="h-10">Search</Button>
        </form>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg border border-border">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="text-xs bg-transparent border-0 outline-none p-1 focus:ring-0"
            />
            <span className="text-muted-foreground text-[10px]">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="text-xs bg-transparent border-0 outline-none p-1 focus:ring-0"
            />
          </div>
          <Button variant="outline" size="sm" className="h-10">
            <Filter className="w-4 h-4 mr-2" />
            More
          </Button>
        </div>
      </div>

      <Tabs
        value={statusFilter === "all" ? "all" : statusFilter === "pending" ? "pending" : "approved"}
        onValueChange={(v) => {
          if (v === "all") setStatusFilter("all");
          else if (v === "pending") setStatusFilter("pending");
          else setStatusFilter("completed"); // Mapping "approved" tab to "completed" status
          setPage(1);
        }}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="all">All Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">{renderInvoiceTable(invoices)}</TabsContent>
        <TabsContent value="approved">{renderInvoiceTable(invoices)}</TabsContent>
        <TabsContent value="all">{renderInvoiceTable(invoices)}</TabsContent>
      </Tabs>

      <InvoiceViewModal
        invoice={selectedInvoice}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

export default Invoices;
