import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Clock, AlertCircle, CheckCircle2, Eye, X, Search, Filter } from "lucide-react";
import userDashboardService from "@/services/userDashboard.service";
import { Invoice, KYCData, KYCDocument } from "@/types/services";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { generateInvoicePDF } from "@/utils/pdfGenerator";
import { getUploadedFileUrl } from "@/utils/fileUrl";
import { cn } from "@/lib/utils";

export default function Documents() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState<string | null>(null);
    const [isPreviewing, setIsPreviewing] = useState<string | null>(null);
    const [previewDocument, setPreviewDocument] = useState<{ title: string; url: string; type: string } | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const [currentInvoicePage, setCurrentInvoicePage] = useState(1);
    const [currentKycPage, setCurrentKycPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setCurrentInvoicePage(1);
        setCurrentKycPage(1);
    }, [searchQuery, filterStatus]);

    const isPdf = (url: string) => {
        const lowerUrl = url.split('?')[0].toLowerCase();
        return lowerUrl.endsWith('.pdf') || (url.startsWith('blob:') && !isVideo(url));
    };


    const isVideo = (url: string) => {
        const lowerUrl = url.split('?')[0].toLowerCase();
        return ['.mp4', '.webm', '.ogg', '.mov', '.mkv', '.avi', '.mp3', '.m4v'].some(ext => lowerUrl.endsWith(ext));
    };

    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch = invoice.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.status?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === "all" || invoice.status?.toLowerCase() === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const filteredKycDocuments = kycDocuments.filter(doc => {
        const ownerName = (doc as any).ownerName || "";
        const matchesSearch = doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.type?.replace('_', ' ').toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ownerName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === "all" || doc.status?.toLowerCase() === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const totalInvoicePages = Math.ceil(filteredInvoices.length / itemsPerPage);
    const paginatedInvoices = filteredInvoices.slice(
        (currentInvoicePage - 1) * itemsPerPage,
        currentInvoicePage * itemsPerPage
    );

    const totalKycPages = Math.ceil(filteredKycDocuments.length / itemsPerPage);
    const paginatedKycDocuments = filteredKycDocuments.slice(
        (currentKycPage - 1) * itemsPerPage,
        currentKycPage * itemsPerPage
    );

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [invoicesRes, kycRes] = await Promise.all([
                userDashboardService.getInvoices(),
                userDashboardService.getKYC()
            ]);

            if (invoicesRes.success && invoicesRes.data) {
                setInvoices(invoicesRes.data.invoices);
            }
            if (kycRes.success && kycRes.data) {
                // kycRes.data is an array of KYC profiles (both individual and business)
                const profiles = Array.isArray(kycRes.data) ? kycRes.data : [kycRes.data];

                // Flatten all documents from all profiles into a single array
                const allDocuments: (KYCDocument & { ownerName?: string })[] = [];
                profiles.forEach(profile => {
                    if (profile.documents && Array.isArray(profile.documents)) {
                        const name = profile.personalInfo?.fullName || profile.profileName || "Partner";
                        const ownerName = profile.isPartner 
                            ? `Partner: ${name}`
                            : profile.kycType === 'business'
                                ? "Business Docs"
                                : "Personal Docs";
                        
                        const docsWithNames = profile.documents.map(doc => ({
                            ...doc,
                            ownerName: ownerName
                        }));
                        allDocuments.push(...docsWithNames);
                    }
                });

                setKycDocuments(allDocuments as KYCDocument[]);
            }
        } catch (error) {
            console.error("Failed to fetch documents data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPDF = async (invoice: Invoice) => {
        try {
            setIsGenerating(invoice._id);
            // Wait a tiny bit for the UI to update to loading state
            await new Promise(resolve => setTimeout(resolve, 100));
            await generateInvoicePDF(invoice, "download");
            toast.success("Invoice downloaded successfully");
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.error("Failed to generate PDF");
        } finally {
            setIsGenerating(null);
        }
    };

    const handlePreviewInvoice = async (invoice: Invoice) => {
        try {
            setIsPreviewing(invoice._id);
            // Wait a tiny bit for the UI to update to loading state
            await new Promise(resolve => setTimeout(resolve, 100));
            const blobUrl = await generateInvoicePDF(invoice, "preview");
            if (blobUrl) {
                setPreviewDocument({
                    title: `Invoice ${invoice.invoiceNumber || invoice._id}`,
                    url: blobUrl,
                    type: 'pdf'
                });
            }
        } catch (error) {
            console.error("Error generating PDF preview:", error);
            toast.error("Failed to generate PDF preview");
        } finally {
            setIsPreviewing(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const lowerStatus = status.toLowerCase();
        switch (lowerStatus) {
            case "paid":
            case "approved":
            case "verified":
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                );
            case "pending":
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                        <Clock className="w-3.5 h-3.5" />
                        Pending
                    </span>
                );
            case "overdue":
            case "rejected":
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {status}
                    </span>
                );
        }
    };

    return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#35503F] tracking-tight">
              Docu<span className="text-primary italic">ments</span>
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-medium">
              Manage your agreements, invoices, and KYC documents
            </p>
          </div>
          <a
            href="/services/virtual-office"
            className="inline-flex items-center justify-center gap-2 bg-[#35503F] text-[#FEF8C3] px-8 py-3.5 rounded-2xl font-bold hover:bg-[#35503F]/90 transition-all shadow-md active:scale-95 text-center"
          >
            <span className="text-xl">+</span>
            Book New Space
          </a>
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-6 items-stretch lg:items-center">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-gray-100 focus:outline-none focus:ring-4 focus:ring-[#35503F]/10 text-sm font-medium transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative flex-1 sm:w-48 sm:flex-none">
              <Filter className="w-4 h-4 text-primary absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-semibold text-gray-700 outline-none focus:ring-4 focus:ring-[#35503F]/10 transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
                <option value="approved">Approved</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="invoice" className="w-full space-y-6">
          <TabsList className="flex p-1.5 rounded-2xl shadow-sm bg-gray-100/80 w-fit max-w-full overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth h-auto">
            <TabsTrigger
              value="agreement"
              className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-black/5 text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
            >
              Agreement
            </TabsTrigger>
            <TabsTrigger
              value="invoice"
              className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-black/5 text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
            >
              Invoice
            </TabsTrigger>
            <TabsTrigger
              value="kyc"
              className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-black/5 text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
            >
              KYC Documents
            </TabsTrigger>
          </TabsList>

                <TabsContent value="agreement" className="mt-0">
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Agreements</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Your service agreements will appear here once your booking is confirmed and digitally signed.
                        </p>
                    </div>
                </TabsContent>

                <TabsContent value="invoice" className="mt-0">
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        {isLoading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p className="text-gray-500">Loading your invoices...</p>
                            </div>
                        ) : invoices.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Invoices Found</h3>
                                <p className="text-gray-500">You don't have any invoices yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/80 border-b border-gray-100">
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Invoice No.</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Description</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Amount</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredInvoices.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                    No invoices match your search.
                                                </td>
                                            </tr>
                                        ) : paginatedInvoices.map((invoice) => (
                                            <tr key={invoice._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {format(new Date(invoice.createdAt), "MMM dd, yyyy")}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {invoice.description || "Service Booking"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-medium text-gray-900">₹{invoice.total?.toLocaleString() || 0}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(invoice.status)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handlePreviewInvoice(invoice)}
                                                            disabled={isPreviewing === invoice._id || isGenerating === invoice._id}
                                                            className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title="Preview"
                                                        >
                                                            {isPreviewing === invoice._id ? (
                                                                <div className="animate-spin w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full px-[0.1rem]"></div>
                                                            ) : (
                                                                <Eye className="w-4 h-4 text-gray-600" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownloadPDF(invoice)}
                                                            disabled={isGenerating === invoice._id || isPreviewing === invoice._id}
                                                            className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title="Download PDF"
                                                        >
                                                            {isGenerating === invoice._id ? (
                                                                <div className="animate-spin w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full px-[0.1rem]"></div>
                                                            ) : (
                                                                <Download className="w-4 h-4 text-gray-600" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {totalInvoicePages > 1 && (
                            <div className="flex justify-center items-center gap-4 py-4 px-6 border-t border-gray-100 bg-gray-50">
                                <button
                                    onClick={() => setCurrentInvoicePage((p) => Math.max(1, p - 1))}
                                    disabled={currentInvoicePage === 1}
                                    className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-sm font-medium text-gray-600">
                                    Page {currentInvoicePage} of {totalInvoicePages}
                                </span>
                                <button
                                    onClick={() => setCurrentInvoicePage((p) => Math.min(totalInvoicePages, p + 1))}
                                    disabled={currentInvoicePage === totalInvoicePages}
                                    className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="kyc" className="mt-0">
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        {isLoading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p className="text-gray-500">Loading your KYC documents...</p>
                            </div>
                        ) : kycDocuments.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No KYC Documents Found</h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-6">
                                    You haven't uploaded any KYC documents yet or they are not available.
                                </p>
                                <button
                                    onClick={() => window.location.href = '/dashboard/profile'}
                                    className="px-6 py-2.5 bg-yellow-400 text-black rounded-xl font-medium hover:bg-yellow-500 transition-colors shadow-sm"
                                >
                                    Go to KYC Verification
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/80 border-b border-gray-100">
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Belongs To</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Document Name</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Type</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Upload Date</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredKycDocuments.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                    No KYC documents match your search.
                                                </td>
                                            </tr>
                                        ) : paginatedKycDocuments.map((doc: any, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest",
                                                        doc.ownerName === "Personal Docs" 
                                                            ? "bg-blue-50 text-blue-700 border border-blue-100" 
                                                            : doc.ownerName === "Business Docs"
                                                                ? "bg-amber-50 text-amber-700 border border-amber-100"
                                                                : "bg-purple-50 text-purple-700 border border-purple-100"
                                                    )}>
                                                        {doc.ownerName}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-5 h-5 text-gray-400" />
                                                        <span className="font-medium text-gray-900">{doc.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                                                    {doc.type.replace('_', ' ')}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {doc.uploadedAt ? format(new Date(doc.uploadedAt), "MMM dd, yyyy") : "N/A"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(doc.status)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {doc.fileUrl ? (
                                                        <button
                                                            onClick={() => {
                                                                let normalizedUrl = doc.fileUrl!.replace(/\\/g, '/');
                                                                let fullUrl = getUploadedFileUrl(normalizedUrl);
                                                                const docType = isPdf(normalizedUrl) ? 'pdf' : isVideo(normalizedUrl) ? 'video' : 'image';
                                                                console.log(`[Document Preview] Details:
- Name: ${doc.name}
- Original Path: ${normalizedUrl}
- Final Viewer URL: ${fullUrl}
- Deduced Type: ${docType} (Is Video? ${docType === 'video'})`);

                                                                setPreviewDocument({
                                                                    title: doc.name,
                                                                    url: fullUrl,
                                                                    type: docType
                                                                });
                                                            }}
                                                            className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                                                        >
                                                            <Eye className="w-4 h-4 text-gray-600" />
                                                            <span className="text-gray-700">View</span>
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">Processing...</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {totalKycPages > 1 && (
                            <div className="flex justify-center items-center gap-4 py-4 px-6 border-t border-gray-100 bg-gray-50">
                                <button
                                    onClick={() => setCurrentKycPage((p) => Math.max(1, p - 1))}
                                    disabled={currentKycPage === 1}
                                    className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="text-sm font-medium text-gray-600">
                                    Page {currentKycPage} of {totalKycPages}
                                </span>
                                <button
                                    onClick={() => setCurrentKycPage((p) => Math.min(totalKycPages, p + 1))}
                                    disabled={currentKycPage === totalKycPages}
                                    className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Document Preview Modal */}
            {previewDocument && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm mt-24">
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
                        <div className="flex-1 bg-gray-950 flex flex-col items-center justify-center overflow-hidden p-2 sm:p-4">
                            {previewDocument.type === 'pdf' ? (
                                <iframe
                                    src={previewDocument.url}
                                    className="w-full h-full rounded-xl border border-gray-800 shadow-sm"
                                    title="Document Preview"
                                />
                            ) : previewDocument.type === 'video' ? (
                                <video
                                    controls
                                    playsInline
                                    className="max-w-full max-h-full rounded-lg shadow-2xl"
                                    key={previewDocument.url}
                                >
                                    <source src={previewDocument.url} type="video/mp4" />
                                    <source src={previewDocument.url} />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-xl border border-gray-800 shadow-sm overflow-hidden p-4">
                                    <img
                                        src={previewDocument.url}
                                        alt="Document Preview"
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
    );
}
