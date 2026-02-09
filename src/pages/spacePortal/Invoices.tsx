import { useCallback, useEffect, useState } from "react";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import InvoiceStats from "@/components/SpacePartner/invoices/InvoiceStats";
import InvoiceTable from "@/components/SpacePartner/invoices/InvoiceTable";
import SubmitInvoiceDialog from "@/components/SpacePartner/invoices/SubmitInvoice";

import { Button } from "@/components/ui/button";
import userDashboardService, {
  InvoicesResponse,
} from "@/services/userDashboard.service";

/**
 * Filters type (keeps state strongly typed)
 */
type InvoiceFilters = {
  status?: string;
  fromDate?: string;
  toDate?: string;
  page: number;
  limit: number;
};

/**
 * InvoicesPayments Page
 *
 * Features:
 * - Fetch invoices from backend with filters + pagination
 * - Show invoice stats summary
 * - Show invoices table
 * - Download invoice
 * - Submit new invoice (dialog)
 */
export default function InvoicesPayments() {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  /**
   * Holds response from backend:
   * - invoices list
   * - summary stats
   * - pagination meta
   */
  const [invoicesData, setInvoicesData] = useState<InvoicesResponse | null>(
    null
  );

  /**
   * Loading state for API calls
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Filters used for backend query.
   */
  const [filters, setFilters] = useState<InvoiceFilters>({
    status: undefined,
    fromDate: undefined,
    toDate: undefined,
    page: 1,
    limit: 10,
  });

  /**
   * Fetch invoices from backend.
   * Wrapped inside useCallback so it's stable and safe inside useEffect.
   */
  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await userDashboardService.getInvoices(filters);

      if (response.success && response.data) {
        setInvoicesData(response.data);
      } else {
        toast.error(response.message || "Failed to fetch invoices");
        setInvoicesData(null);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("An error occurred while fetching invoices");
      setInvoicesData(null);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  /**
   * Automatically fetch invoices whenever filters change.
   */
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  /**
   * Update filters safely.
   * Also resets page to 1 whenever any filter changes.
   */
  const handleFilterChange = (newFilters: Partial<InvoiceFilters>) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev, ...newFilters };

      const isFilterChanged =
        newFilters.status !== undefined ||
        newFilters.fromDate !== undefined ||
        newFilters.toDate !== undefined;

      return {
        ...updatedFilters,
        page: isFilterChanged ? 1 : updatedFilters.page,
      };
    });
  };

  /**
   * Pagination handler
   */
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  /**
   * Download invoice by ID
   * Backend should return either:
   * - PDF URL
   * - base64 file
   * - blob response
   */
  const handleInvoiceDownload = async (invoiceId: string) => {
    try {
      const response = await userDashboardService.getInvoiceById(invoiceId);

      if (response.success && response.data) {
        toast.success("Invoice downloaded successfully");

        /**
         * TODO (Backend Integration):
         * If backend provides invoice PDF URL:
         * window.open(response.data.pdfUrl, "_blank");
         *
         * If backend provides base64/pdf blob:
         * generate file download here.
         */
      } else {
        toast.error(response.message || "Failed to download invoice");
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("An error occurred while downloading the invoice");
    }
  };

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          variant="outline"
          className="h-10 border-slate-200 text-[#3FA69E] hover:bg-teal-50"
          onClick={() => {
            // Reset date range to show full invoice history
            handleFilterChange({
              fromDate: undefined,
              toDate: undefined,
            });
          }}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          History
        </Button>

        <SubmitInvoiceDialog
          open={isSubmitOpen}
          onOpenChange={setIsSubmitOpen}
          onSuccess={fetchInvoices} // refresh invoices after submission
        />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#3FA69E]" />
        </div>
      ) : invoicesData ? (
        <>
          {/* Stats */}
          <InvoiceStats
            summary={invoicesData.summary}
            invoices={invoicesData.invoices}
          />

          {/* Table */}
          <InvoiceTable
            invoices={invoicesData.invoices}
            onFilterChange={handleFilterChange}
            onPageChange={handlePageChange}
            currentPage={filters.page}
            onDownload={handleInvoiceDownload}
            onRefresh={fetchInvoices}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
          <p className="text-lg">No invoices found</p>
          <p className="text-sm">
            Try adjusting your filters or create a new invoice
          </p>
        </div>
      )}
    </div>
  );
}
