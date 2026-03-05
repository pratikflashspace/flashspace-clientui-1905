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
} from "lucide-react";
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
      toast.error("Failed to fetch invoice records");
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
      toast.error("Failed to fetch payment records");
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

  // Helper to format date
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

  const getInvoiceStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "Overdue":
        return "bg-red-100 text-red-700 border-red-200";
      case "Cancelled":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleSendReminder = (id: string) => {
    toast.success(
      `Reminder sent to client for invoice #${id.slice(-6).toUpperCase()}`,
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-[Poppins]">
            Invoices & <span className="text-teal-600">Payments</span>
          </h1>
          <p className="text-gray-500 text-lg mt-1">
            Manage financial records for your spaces
          </p>
        </div>
        <button
          onClick={() =>
            activeTab === "invoices"
              ? setIsLogInvoiceModalOpen(true)
              : setIsLogPaymentModalOpen(true)
          }
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <LogIn className="w-5 h-5" />
          {activeTab === "invoices" ? "Create Invoice" : "Create Payment"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="p-3 bg-green-50 rounded-xl">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {formatCurrency(thisMonthRevenue)}
            </h3>
            <p className="text-gray-500 text-sm">This Month</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="p-3 bg-yellow-50 rounded-xl">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {formatCurrency(pendingAmount)}
            </h3>
            <p className="text-gray-500 text-sm">Pending</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="p-3 bg-red-50 rounded-xl">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {formatCurrency(overdueAmount)}
            </h3>
            <p className="text-gray-500 text-sm">Overdue</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="p-3 bg-teal-50 rounded-xl">
            <CreditCard className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalCommission)}
            </h3>
            <p className="text-gray-500 text-sm">Commission Earned</p>
          </div>
        </div>
      </div>

      {/* Custom Tabs */}
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab("invoices")}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
            activeTab === "invoices"
              ? "bg-white text-gray-900 shadow-sm border border-gray-200"
              : "bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Pending Invoices
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${
            activeTab === "payments"
              ? "bg-white text-gray-900 shadow-sm border border-gray-200"
              : "bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Payment History
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : activeTab === "invoices" ? (
          /* Invoices List View */
          <div className="space-y-4">
            {invoiceRecords.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
                <FileText className="w-12 h-12 mb-2 mx-auto opacity-20" />
                <p>No invoices found</p>
              </div>
            ) : (
              invoiceRecords.map((invoice) => (
                <div
                  key={invoice._id}
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  <div className="space-y-3 w-full md:w-auto">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 font-medium">
                        {invoice.invoiceId ||
                          `#${invoice._id.slice(-6).toUpperCase()}`}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getInvoiceStatusStyle(invoice.status)}`}
                      >
                        {invoice.status === "Pending" && (
                          <Clock className="w-3 h-3" />
                        )}
                        {invoice.status === "Overdue" && (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {invoice.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {invoice.client}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Due: {formatDate(invoice.dueDate)}
                    </p>
                  </div>
                  <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(invoice.amount)}
                    </div>
                    <Button
                      variant="outline"
                      className="text-gray-600 border-gray-200 hover:text-teal-600 hover:border-teal-600 hover:bg-teal-50 gap-2"
                      onClick={() => handleSendReminder(invoice._id)}
                    >
                      Send Reminder
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Payments Table View */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {paymentRecords.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <CreditCard className="w-12 h-12 mb-2 mx-auto opacity-20" />
                <p>No payment records found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-sm font-bold text-gray-900">
                        Payment ID
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-900">
                        Invoice
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-900">
                        Client
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-900">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-900">
                        Date
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-900">
                        Method
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-900">
                        Commission
                      </th>
                      <th className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                        Receipt
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paymentRecords.map((record) => (
                      <tr
                        key={record._id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-5 text-sm font-bold text-gray-900">
                          {record.paymentId}
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-teal-600">
                          {record.invoiceId || "—"}
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-500">
                          {record.client}
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-gray-900">
                          {formatCurrency(record.amount)}
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-400">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-500">
                          {record.method}
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-green-600">
                          {record.commission
                            ? formatCurrency(record.commission)
                            : "—"}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
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
