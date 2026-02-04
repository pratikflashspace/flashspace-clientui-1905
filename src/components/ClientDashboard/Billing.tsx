import React, { useState, useEffect } from "react";
import userDashboardService, { Invoice, Booking } from "@/services/userDashboard.service";
import {
  CreditCard,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  IndianRupee,
  ArrowUpRight,
  Search,
  Building2,
  RefreshCw,
  Loader2,
} from "lucide-react";

// Types
type InvoiceStatus = "paid" | "pending" | "overdue" | "cancelled";

export default function Billing() {
  const [activeTab, setActiveTab] = useState<"invoices" | "subscriptions" | "payments">("invoices");
  const [statusFilter, setStatusFilter] = useState<"all" | InvoiceStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [subscriptions, setSubscriptions] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [invoicesRes, bookingsRes] = await Promise.all([
        userDashboardService.getInvoices({ status: statusFilter === "all" ? undefined : statusFilter }),
        userDashboardService.getBookings({ status: "active" }),
      ]);
      if (invoicesRes.success && invoicesRes.data) {
        // invoicesRes.data is InvoicesResponse which contains { summary, invoices }
        setInvoices(invoicesRes.data.invoices || []);
      }
      if (bookingsRes.success && bookingsRes.data) {
        setSubscriptions(bookingsRes.data);
      }
    } catch (err) {
      setError("Failed to load billing data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "paid":
        return { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2, label: "Paid" };
      case "pending":
        return { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Pending" };
      case "overdue":
        return { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle, label: "Overdue" };
      case "cancelled":
        return { bg: "bg-gray-100", text: "text-gray-600", icon: AlertCircle, label: "Cancelled" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600", icon: Clock, label: status };
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      searchQuery === "" ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  // Calculate totals
  const stats = {
    totalPaid: invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.total, 0),
    pendingAmount: invoices.filter((i) => i.status === "pending").reduce((sum, i) => sum + i.total, 0),
    activeSubscriptions: subscriptions.filter((s) => s.status === "active").length,
    nextBilling: subscriptions.length > 0 ? subscriptions[0].endDate : null,
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-yellow-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading billing data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-[Poppins] text-gray-900">
              Billing & <span className="text-yellow-500">Payments</span>
            </h1>
            <p className="text-gray-500 mt-1">Manage your invoices, subscriptions, and payment methods</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalPaid)}</p>
            <p className="text-sm text-gray-500">Total Paid</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.pendingAmount)}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
            <p className="text-sm text-gray-500">Active Subscriptions</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.nextBilling ? formatDate(stats.nextBilling) : "-"}</p>
            <p className="text-sm text-gray-500">Next Billing</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
          <div className="flex gap-1">
            {[
              { id: "invoices", label: "Invoices", icon: FileText },
              { id: "subscriptions", label: "Subscriptions", icon: RefreshCw },
              { id: "payments", label: "Payment Methods", icon: CreditCard },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-yellow-400 text-black"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Invoices Tab */}
        {activeTab === "invoices" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div className="flex gap-2">
                  {["all", "paid", "pending", "overdue"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status as typeof statusFilter)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        statusFilter === status
                          ? "bg-yellow-400 text-black"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Invoice List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {filteredInvoices.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No invoices found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredInvoices.map((invoice) => {
                    const statusConfig = getStatusConfig(invoice.status);
                    return (
                      <div key={invoice._id} className="p-5 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                <statusConfig.icon className="w-3 h-3" />
                                {statusConfig.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{invoice.description || "Subscription Invoice"}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <Building2 className="w-3 h-3" /> Invoice #{invoice.invoiceNumber}
                            </p>
                          </div>

                          <div className="flex flex-col md:items-end gap-1">
                            <p className="text-xl font-bold text-gray-900">{formatCurrency(invoice.total)}</p>
                            <p className="text-xs text-gray-500">
                              {invoice.status === "paid" && invoice.paidAt ? `Paid on ${formatDate(invoice.paidAt)}` : `Due: ${formatDate(invoice.dueDate)}`}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                              <Download className="w-4 h-4" /> Download
                            </button>
                            {invoice.status === "pending" && (
                              <button className="flex items-center gap-1.5 px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors">
                                Pay Now <ArrowUpRight className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === "subscriptions" && (
          <div className="space-y-4">
            {subscriptions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No active subscriptions</p>
              </div>
            ) : (
              subscriptions.map((sub) => {
                const endDate = sub.endDate || new Date().toISOString();
                const daysRemaining = Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                const isExpiring = daysRemaining <= 30;
                return (
                  <div key={sub._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{sub.plan.name}</h3>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            sub.status === "active" && !isExpiring ? "bg-green-100 text-green-700" :
                            isExpiring ? "bg-orange-100 text-orange-700" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {isExpiring ? "Expiring Soon" : sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{sub.spaceSnapshot?.name || "Space"}</p>
                        <p className="text-gray-500 text-sm mt-2">
                          {formatCurrency(sub.plan.price)}/{sub.plan.tenure} {sub.plan.tenureUnit || "months"} - Expires: {formatDate(endDate)}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Auto-renew</span>
                          <div className={`w-12 h-6 rounded-full transition-colors ${sub.autoRenew ? "bg-green-500" : "bg-gray-300"}`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${sub.autoRenew ? "translate-x-6" : "translate-x-0.5"}`} />
                          </div>
                        </div>
                        <a href="/dashboard/bookings" className="px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors">
                          Manage
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === "payments" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
              </div>

              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Payments are processed via Razorpay</p>
                <p className="text-sm text-gray-400">Your payment details are securely managed by our payment provider</p>
              </div>
            </div>

            {/* Billing Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Billing Information</h2>
              </div>
              <div className="text-gray-600">
                <p className="text-sm">For billing inquiries, please contact support or visit your KYC section to update business details.</p>
                <a href="/dashboard/kyc" className="inline-block mt-4 px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors">
                  Update Business Info
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
