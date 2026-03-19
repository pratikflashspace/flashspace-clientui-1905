import React, { useState, useEffect } from "react";
import {
  FileText,
  ArrowRight,
  User,
  CheckCircle2,
  Package,
  Clock,
  LogIn,
  Loader2,
  MapPin,
  ChevronDown,
  IndianRupee,
  CreditCard,
  Download,
  Send,
  AlertCircle,
  TrendingUp,
  Filter,
  Search,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { StatsSkeleton, TableSkeleton } from "@/components/ui/skeleton-loaders";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { axiosInstance } from "../../lib/axios";
import { toast } from "sonner";
import LogInvoiceModal from "../../components/SpacePartner/LogInvoiceModal";
import LogPaymentModal from "../../components/SpacePartner/LogPaymentModal";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "../../components/ui/badge";

interface InvoiceRecord {
  _id: string;
  invoiceId: string;
  client: string;
  description: string;
  amount: number;
  dueDate: string;
  status: "Pending" | "Paid" | "Overdue" | "Cancelled";
  space: string;
  createdAt: string;
}

interface PaymentRecord {
  _id: string;
  paymentId?: string;
  client: string;
  amount: number;
  method: "Cash" | "UPI" | "Transfer" | "Cheque";
  purpose: string;
  space: string;
  date: string;
  invoiceId?: string;
  commission?: number;
  status: "Completed" | "Pending" | "Failed";
  createdAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const InvoicesAndPayments = () => {
  const [activeTab, setActiveTab] = useState<"invoices" | "payments">(
    "invoices",
  );
  const [invoiceRecords, setInvoiceRecords] = useState<InvoiceRecord[]>([]);
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogInvoiceModalOpen, setIsLogInvoiceModalOpen] = useState(false);
  const [isLogPaymentModalOpen, setIsLogPaymentModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchInvoices = async () => {
    try {
      const response = await axiosInstance.get<ApiResponse<InvoiceRecord[]>>(
        "/api/spacePartner/invoices",
      );
      if (response.data.success) {
        const sortedData = response.data.data.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        setInvoiceRecords(sortedData);
      }
    } catch (error) {
      console.error("Failed to fetch invoices", error);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await axiosInstance.get<ApiResponse<PaymentRecord[]>>(
        "/api/spacePartner/payments",
      );
      if (response.data.success) {
        const sortedData = response.data.data.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        setPaymentRecords(sortedData);
      }
    } catch (error) {
      console.error("Failed to fetch payments", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchInvoices(), fetchPayments()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Stats Calculation
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthRevenue = paymentRecords
    .filter((p) => {
      const d = new Date(p.date);
      return (
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear &&
        p.status === "Completed"
      );
    })
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = invoiceRecords
    .filter((i) => i.status === "Pending")
    .reduce((sum, i) => sum + i.amount, 0);

  const overdueAmount = invoiceRecords
    .filter((i) => i.status === "Overdue")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalCommission = paymentRecords.reduce(
    (sum, p) => sum + (p.commission || 0),
    0,
  );

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

  const getInvoiceStatusProps = (status: string) => {
    switch (status) {
      case "Pending":
        return {
          color: "text-amber-600 bg-amber-50 border-amber-100",
          icon: <Clock className="w-3 h-3" />,
        };
      case "Paid":
        return {
          color: "text-emerald-600 bg-emerald-50 border-emerald-100",
          icon: <CheckCircle2 className="w-3 h-3" />,
        };
      case "Overdue":
        return {
          color: "text-rose-600 bg-rose-50 border-rose-100",
          icon: <AlertCircle className="w-3 h-3" />,
        };
      case "Cancelled":
        return {
          color: "text-slate-600 bg-slate-50 border-slate-100",
          icon: null,
        };
      default:
        return {
          color: "text-slate-600 bg-slate-50 border-slate-100",
          icon: null,
        };
    }
  };

  const handleSendReminder = (id: string) => {
    toast.success(
      `Reminder sent to client for invoice #${id.slice(-6).toUpperCase()}`,
      {
        icon: <Send className="w-4 h-4" />,
      },
    );
  };

  const filteredInvoices = invoiceRecords.filter(
    (i) =>
      i.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.invoiceId?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredPayments = paymentRecords.filter(
    (p) =>
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.paymentId?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex-1 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Invoices & <span className="text-primary italic">Payments</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your payments, manage invoices, and monitor revenue growth.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-background border border-input rounded-xl w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-sm"
            />
          </div>
          <Button
            onClick={() =>
              activeTab === "invoices"
                ? setIsLogInvoiceModalOpen(true)
                : setIsLogPaymentModalOpen(true)
            }
            className="rounded-xl font-bold shadow-sm flex items-center gap-2 h-11 px-6 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            {activeTab === "invoices" ? "Create Invoice" : "Log Payment"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <StatsSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "This Month",
              value: thisMonthRevenue,
              sub: "Revenue received",
              icon: <TrendingUp className="w-5 h-5" />,
              color: "emerald",
              trend: "up",
            },
            {
              label: "Pending",
              value: pendingAmount,
              sub: "Waiting for client",
              icon: <Clock className="w-5 h-5" />,
              color: "amber",
              trend: "neutral",
            },
            {
              label: "Overdue",
              value: overdueAmount,
              sub: "Needs attention",
              icon: <AlertCircle className="w-5 h-5" />,
              color: "rose",
              trend: "down",
            },
            {
              label: "Total Earned",
              value: totalCommission,
              sub: "Life-time revenue",
              icon: <CreditCard className="w-5 h-5" />,
              color: "primary",
              trend: "neutral",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-background border border-border p-4 sm:p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:border-primary/20 transition-all"
            >
              <div
                className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${stat.color === "primary" ? "primary" : stat.color + "-500"}/5 rounded-full group-hover:scale-150 transition-transform duration-500`}
              />
              <div className="flex flex-col gap-3 relative">
                <div
                  className={`p-2.5 bg-${stat.color === "primary" ? "primary" : stat.color + "-500"}/10 rounded-xl w-fit text-${stat.color === "primary" ? "primary" : stat.color + "-600"}`}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {formatCurrency(stat.value)}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1 font-medium">
                    {stat.sub}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Custom Nav-like Tabs */}
        <div className="bg-muted/50 p-1 rounded-xl w-fit flex items-center border border-border">
          <button
            onClick={() => setActiveTab("invoices")}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "invoices"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Invoices
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "payments"
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Payments
          </button>
        </div>

        {/* Content Box */}
        <div className="bg-background border border-border rounded-2xl shadow-sm overflow-hidden min-h-[450px]">
          {loading ? (
            <div className="p-8">
              <TableSkeleton rows={8} cols={5} />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "invoices" ? (
                <motion.div
                  key="invoices"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6"
                >
                  {filteredInvoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[350px] text-center">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-muted-foreground opacity-30" />
                      </div>
                      <h3 className="text-lg font-bold">No Invoices</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        There are no matching invoices to display.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredInvoices.map((invoice, idx) => {
                        const status = getInvoiceStatusProps(invoice.status);
                        return (
                          <motion.div
                            key={invoice._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-background border border-border p-5 rounded-2xl hover:border-primary/30 transition-all group flex flex-col justify-between"
                          >
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase">
                                      #
                                      {invoice.invoiceId ||
                                        invoice._id.slice(-6).toUpperCase()}
                                    </span>
                                    <span
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${status.color}`}
                                    >
                                      {invoice.status}
                                    </span>
                                  </div>
                                  <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                    {invoice.client}
                                  </h4>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-foreground">
                                    {formatCurrency(invoice.amount)}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground font-medium">
                                    Created {formatDate(invoice.createdAt)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                {invoice.space}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border">
                              <Button
                                size="sm"
                                onClick={() => handleSendReminder(invoice._id)}
                                className="flex-1 rounded-xl h-9"
                              >
                                <Send className="w-3 h-3 mr-2" />
                                Reminder
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-9 h-9 p-0 rounded-xl"
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="payments"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {filteredPayments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[450px] text-center">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <CreditCard className="w-8 h-8 text-muted-foreground opacity-30" />
                      </div>
                      <h3 className="text-lg font-bold">No Payments</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Transaction history is currently empty.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-border bg-muted/30">
                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">
                              Reference
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">
                              Client
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase">
                              Method
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase text-right">
                              Amount
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase text-center">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {filteredPayments.map((record, idx) => (
                            <motion.tr
                              key={record._id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: idx * 0.03 }}
                              className="group hover:bg-muted/30 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="flex flex-col">
                                  <span className="font-bold text-foreground">
                                    {record.paymentId ||
                                      record._id.slice(-8).toUpperCase()}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground font-medium uppercase mt-0.5">
                                    {formatDate(record.date)}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                                    {record.client.charAt(0)}
                                  </div>
                                  <span className="font-semibold text-foreground text-sm">
                                    {record.client}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge
                                  variant="secondary"
                                  className="font-bold text-[10px] uppercase"
                                >
                                  {record.method}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className="font-bold text-foreground">
                                  {formatCurrency(record.amount)}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex justify-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      <LogInvoiceModal
        isOpen={isLogInvoiceModalOpen}
        onClose={() => setIsLogInvoiceModalOpen(false)}
        onSuccess={fetchInvoices}
      />
      <LogPaymentModal
        isOpen={isLogPaymentModalOpen}
        onClose={() => setIsLogPaymentModalOpen(false)}
        onSuccess={fetchPayments}
      />
    </div>
  );
};

export default InvoicesAndPayments;
