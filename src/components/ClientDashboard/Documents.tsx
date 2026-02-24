import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Clock, AlertCircle, CheckCircle2, Eye, X } from "lucide-react";
import userDashboardService from "@/services/userDashboard.service";
import { Invoice, KYCData, KYCDocument } from "@/types/services";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { generateInvoicePDF } from "@/utils/pdfGenerator";
import { API_CONFIG } from "@/config/api.config";

export default function Documents() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState<string | null>(null);
    const [isPreviewing, setIsPreviewing] = useState<string | null>(null);
    const [previewDocument, setPreviewDocument] = useState<{ title: string; url: string; type: 'pdf' | 'image' } | null>(null);

    const isPdf = (url: string) => url.toLowerCase().includes('.pdf') || url.startsWith('blob:');

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
                const allDocuments: KYCDocument[] = [];
                profiles.forEach(profile => {
                    if (profile.documents && Array.isArray(profile.documents)) {
                        allDocuments.push(...profile.documents);
                    }
                });

                setKycDocuments(allDocuments);
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
            generateInvoicePDF(invoice, "download");
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
            const blobUrl = generateInvoicePDF(invoice, "preview");
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
        switch (status.toLowerCase()) {
            case "paid":
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Paid
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
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Overdue
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
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents</h1>
                <p className="text-gray-500">Manage your agreements, invoices, and KYC documents</p>
            </div>

            <Tabs defaultValue="invoice" className="w-full">
                <TabsList className="grid grid-cols-3 max-w-md mb-8">
                    <TabsTrigger value="agreement">Agreement</TabsTrigger>
                    <TabsTrigger value="invoice">Invoice</TabsTrigger>
                    <TabsTrigger value="kyc">KYC Documents</TabsTrigger>
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
                                        {invoices.map((invoice) => (
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
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Document Name</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Type</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Upload Date</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {kycDocuments.map((doc, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
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
                                                                const fullUrl = doc.fileUrl!.startsWith("http") || doc.fileUrl!.startsWith("blob:")
                                                                    ? doc.fileUrl!
                                                                    : `${API_CONFIG.BASE_URL}${doc.fileUrl!}`;
                                                                setPreviewDocument({
                                                                    title: doc.name,
                                                                    url: fullUrl,
                                                                    type: isPdf(doc.fileUrl!) ? 'pdf' : 'image'
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
                    </div>
                </TabsContent>
            </Tabs>

            {/* Document Preview Modal */}
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
                        <div className="flex-1 bg-gray-100 p-4">
                            {previewDocument.type === 'pdf' ? (
                                <iframe
                                    src={previewDocument.url}
                                    className="w-full h-full rounded-xl border border-gray-200 shadow-sm"
                                    title="Document Preview"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-4">
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
    );
}
