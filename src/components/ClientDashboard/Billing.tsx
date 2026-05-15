import React, { useState, useEffect } from "react";
import userDashboardService from "@/services/userDashboard.service";
import { Invoice, Booking } from "@/types/services";
import { generateInvoicePDF } from "@/utils/pdfGenerator";
import { getUploadedFileUrl } from "@/utils/fileUrl";
import toast from "react-hot-toast";
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
  Filter,
  ArrowDown,
  Eye,
  X,
} from "lucide-react";

// Types
type InvoiceStatus = "paid" | "pending" | "overdue" | "cancelled";

export default function Billing() {
  const [activeTab, setActiveTab] = useState<
    "invoices" | "subscriptions" | "payments"
  >("invoices");
  const [statusFilter, setStatusFilter] = useState<"all" | InvoiceStatus>(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [subscriptions, setSubscriptions] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSubscriptionPage, setCurrentSubscriptionPage] = useState(1);
  const itemsPerPage = 10;
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);
  const [previewingInvoiceId, setPreviewingInvoiceId] = useState<string | null>(null);
  const [previewDocument, setPreviewDocument] = useState<{ title: string; url: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [invoicesResult, bookingsResult] = await Promise.allSettled([
        userDashboardService.getInvoices({
          status: statusFilter === "all" ? undefined : statusFilter,
        }),
        userDashboardService.getBookings({ status: "active" }),
      ]);

      const invoicesRes =
        invoicesResult.status === "fulfilled" ? invoicesResult.value : null;
      const bookingsRes =
        bookingsResult.status === "fulfilled" ? bookingsResult.value : null;

      if (invoicesRes?.success && invoicesRes.data) {
        // invoicesRes.data is InvoicesResponse which contains { summary, invoices }
        setInvoices(invoicesRes.data.invoices || []);
      } else {
        setInvoices([]);
      }

      if (bookingsRes?.success && bookingsRes.data) {
        setSubscriptions(bookingsRes.data);
      } else {
        setSubscriptions([]);
      }

      if (!invoicesRes?.success) {
        setError("Failed to load invoices");
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

  useEffect(() => {
    setCurrentPage(1);
    setCurrentSubscriptionPage(1);
  }, [statusFilter, searchQuery, activeTab]);

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

  const handleDownloadPDF = async (invoice: Invoice) => {
    if (invoice.pdfUrl) {
      const url = getUploadedFileUrl(invoice.pdfUrl);
      window.open(url, "_blank");
      return;
    }
    try {
      setDownloadingInvoiceId(invoice._id);
      await generateInvoicePDF(invoice, "download");
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Error generating invoice PDF:", error);
      toast.error("Failed to generate invoice PDF");
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  const handlePreviewPDF = async (invoice: Invoice) => {
    if (invoice.pdfUrl) {
      const url = getUploadedFileUrl(invoice.pdfUrl);
      setPreviewDocument({
        title: `Invoice ${invoice.invoiceNumber || invoice._id}`,
        url: url,
      });
      return;
    }
    try {
      setPreviewingInvoiceId(invoice._id);
      const blobUrl = await generateInvoicePDF(invoice, "preview");
      if (blobUrl) {
        setPreviewDocument({
          title: `Invoice ${invoice.invoiceNumber || invoice._id}`,
          url: blobUrl,
        });
      }
    } catch (error) {
      console.error("Error previewing invoice PDF:", error);
      toast.error("Failed to preview invoice PDF");
    } finally {
      setPreviewingInvoiceId(null);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "paid":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          icon: CheckCircle2,
          label: "Paid",
        };
      case "pending":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          border: "border-yellow-200",
          icon: Clock,
          label: "Pending",
        };
      case "overdue":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          icon: CheckCircle2,
          label: "Overdue",
        };
      case "cancelled":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          icon: CheckCircle2,
          label: "Cancelled",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-600",
          border: "border-gray-200",
          icon: Clock,
          label: status,
        };
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchSearch =
      searchQuery === "" ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalSubscriptionPages = Math.ceil(subscriptions.length / itemsPerPage);
  const paginatedSubscriptions = subscriptions.slice(
    (currentSubscriptionPage - 1) * itemsPerPage,
    currentSubscriptionPage * itemsPerPage
  );

  const handleDownload = () => {
    let dataToDownload: any[] = [];
    let filename = "";

    if (activeTab === "invoices") {
      dataToDownload = filteredInvoices.map((inv) => ({
        "Invoice ID": inv.invoiceNumber,
        "Service": inv.description || "Subscription Invoice",
        "Date": inv.paidAt ? formatDate(inv.paidAt) : (inv.dueDate ? formatDate(inv.dueDate) : ""),
        "Amount": inv.total,
        "Status": inv.status,
      }));
      filename = "invoices_statement.csv";
    } else if (activeTab === "subscriptions") {
      dataToDownload = subscriptions.map((sub) => ({
        "Plan Name": sub.plan.name,
        "Space Name": sub.spaceSnapshot?.name || "Space",
        "Address": sub.spaceSnapshot?.address || "",
        "Price": sub.plan.price,
        "Tenure": `${sub.plan.tenure} ${sub.plan.tenureUnit || "months"}`,
        "Status": sub.status,
        "End Date": sub.endDate ? formatDate(sub.endDate) : "",
      }));
      filename = "subscriptions_statement.csv";
    }

    if (dataToDownload.length === 0) return;

    const headers = Object.keys(dataToDownload[0]).join(",");
    const rows = dataToDownload.map((obj) => Object.values(obj).map(v => `"${v}"`).join(",")).join("\n");
    const csvContent = `${headers}\n${rows}`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Calculate totals
  const stats = {
    totalPaid: invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + i.total, 0),
    pendingAmount: invoices
      .filter((i) => i.status === "pending")
      .reduce((sum, i) => sum + i.total, 0),
    activeSubscriptions: subscriptions.filter((s) => s.status === "active")
      .length,
    nextBilling: subscriptions.length > 0 ? subscriptions[0].endDate : null,
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#35503F] animate-spin mx-auto mb-4" />
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
            className="px-4 py-2 bg-[#35503F] text-[#FEF8C3] rounded-lg font-medium hover:bg-[#35503F]/90 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#35503F] tracking-tight">
              Billing & <span className="text-primary italic">Payments</span>
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-medium">
              Manage your invoices, active subscriptions, and payment history
            </p>
          </div>
          {/* Removed Download Buttons as requested */}
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 transition-all hover:shadow-lg border-l-4 border-l-green-400">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Paid</p>
            <p className="text-3xl font-extrabold text-[#35503F]">{formatCurrency(stats.totalPaid)}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 transition-all hover:shadow-lg border-l-4 border-l-orange-400">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pending Dues</p>
            <p className="text-3xl font-extrabold text-[#35503F]">{formatCurrency(stats.pendingAmount)}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 transition-all hover:shadow-lg border-l-4 border-l-blue-400">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Subscriptions</p>
            <p className="text-3xl font-extrabold text-[#35503F]">{stats.activeSubscriptions}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 transition-all hover:shadow-lg border-l-4 border-l-purple-400">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Next Billing</p>
            <p className="text-3xl font-extrabold text-[#35503F]">
              {stats.nextBilling ? formatDate(stats.nextBilling) : "-"}
            </p>
          </div>
        </div>

        {/* Navigation Tabs and Search */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 items-stretch lg:items-center">
          <div className="flex p-1.5 rounded-2xl shadow-sm bg-gray-100/80 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth">
            {[
              { id: "invoices", label: "Invoices" },
              { id: "subscriptions", label: "Subscriptions" },
              { id: "payments", label: "Payment Methods" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "invoices" && (
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#35503F]/20 focus:border-[#35503F]"
                />
              </div>
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-[#FAF6D3] hover:text-[#35503F] hover:border-[#F2EEB3] transition-colors focus:outline-none focus:ring-2 focus:ring-[#35503F]/20">
                  <Filter className="w-4 h-4" />
                  <span>
                    {statusFilter === "all"
                      ? "Filter by Status"
                      : statusFilter.charAt(0).toUpperCase() +
                        statusFilter.slice(1)}
                  </span>
                </button>
                <div className="absolute right-0 top-full w-48 pt-2 hidden group-hover:block z-10 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-200">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2">
                    {["all", "paid", "pending", "overdue"].map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          setStatusFilter(status as typeof statusFilter)
                        }
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors capitalize ${
                          statusFilter === status
                            ? "bg-[#FAF6D3] text-[#35503F] font-semibold"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        {status === "all" ? "All Invoices" : status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {activeTab === "invoices" && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Invoice ID
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-gray-500"
                      >
                        No invoices found
                      </td>
                    </tr>
                  ) : (
                    paginatedInvoices.map((invoice) => {
                      const statusConfig = getStatusConfig(invoice.status);
                      return (
                        <tr
                          key={invoice._id}
                          className="hover:bg-gray-50/50 transition-colors group"
                        >
                          <td className="py-4 px-6">
                            <span className="font-medium text-gray-900">
                              {invoice.invoiceNumber}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-gray-600">
                              {invoice.description || "Subscription Invoice"}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-gray-600">
                              {invoice.status === "paid" && invoice.paidAt
                                ? formatDate(invoice.paidAt)
                                : formatDate(invoice.dueDate || "")}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(invoice.total)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                            >
                              <statusConfig.icon className="w-3 h-3" />
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={() => handlePreviewPDF(invoice)}
                                disabled={previewingInvoiceId === invoice._id || downloadingInvoiceId === invoice._id}
                                className="text-gray-400 hover:text-[#35503F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Preview invoice"
                              >
                                {previewingInvoiceId === invoice._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDownloadPDF(invoice)}
                                disabled={downloadingInvoiceId === invoice._id || previewingInvoiceId === invoice._id}
                                className="text-gray-400 hover:text-[#35503F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Download invoice"
                              >
                                {downloadingInvoiceId === invoice._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Download className="w-4 h-4" />
                                )}
                              </button>
                              {invoice.status === "pending" && (
                                <button className="inline-flex items-center px-4 py-1.5 bg-[#35503F] text-[#FEF8C3] text-xs font-medium rounded-full hover:bg-[#35503F]/90 transition-colors">
                                  Pay Now
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 py-4 px-6 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {previewDocument && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-semibold text-gray-900">{previewDocument.title}</h3>
                <button
                  onClick={() => setPreviewDocument(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 bg-gray-950 overflow-hidden p-2 sm:p-4">
                <iframe
                  src={previewDocument.url}
                  className="w-full h-full rounded-xl border border-gray-800 shadow-sm"
                  title="Invoice Preview"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "subscriptions" && (
          <div className="space-y-4">
            {subscriptions.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No active subscriptions</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedSubscriptions.map((sub) => {
                  const endDate = sub.endDate || new Date().toISOString();
                  const daysRemaining = Math.ceil(
                    (new Date(endDate).getTime() - Date.now()) /
                      (1000 * 60 * 60 * 24),
                  );
                  const isExpiring = daysRemaining <= 30;
                  return (
                    <div
                      key={sub._id}
                      className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all"
                    >
                      <div className="flex flex-col justify-between h-full gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                              {sub.plan.name}
                            </h3>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                                sub.status === "active" && !isExpiring
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : isExpiring
                                    ? "bg-orange-50 text-orange-700 border-orange-200"
                                    : "bg-gray-50 text-gray-600 border-gray-200"
                              }`}
                            >
                              {isExpiring
                                ? "Expiring Soon"
                                : sub.status.charAt(0).toUpperCase() +
                                  sub.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-1">
                            {sub.spaceSnapshot?.name || "Space"}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {sub.spaceSnapshot?.address}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-baseline gap-1">
                            <p className="text-lg font-bold text-gray-900">
                              {formatCurrency(sub.plan.price)}
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                              /{sub.plan.tenure}{" "}
                              {sub.plan.tenureUnit || "months"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {totalSubscriptionPages > 1 && (
              <div className="flex justify-center items-center gap-4 py-4 px-6 mt-4">
                <button
                  onClick={() => setCurrentSubscriptionPage((p) => Math.max(1, p - 1))}
                  disabled={currentSubscriptionPage === 1}
                  className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-gray-600">
                  Page {currentSubscriptionPage} of {totalSubscriptionPages}
                </span>
                <button
                  onClick={() => setCurrentSubscriptionPage((p) => Math.min(totalSubscriptionPages, p + 1))}
                  disabled={currentSubscriptionPage === totalSubscriptionPages}
                  className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Payment Methods
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">
                Your payments are securely processed via Razorpay. We do not
                store your card details.
              </p>
              <button className="px-6 py-2.5 background-[#35503F] text-white rounded-full text-sm font-medium hover:bg-[#35503F]/90 transition-colors">
                Add Payment Method
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
