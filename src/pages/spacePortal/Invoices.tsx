import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import InvoiceStats from "@/components/SpacePartner/invoices/InvoiceStats";
import InvoiceTable from "@/components/SpacePartner/invoices/InvoiceTable";
import SubmitInvoiceDialog from "@/components/SpacePartner/invoices/SubmitInvoice";

import { Button } from "@/components/ui/button";
import userDashboardService, { Invoice , InvoicesResponse } from "@/services/userDashboard.service";

export default function InvoicesPayments() {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [invoicesData, setInvoicesData] = useState<InvoicesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: undefined as string | undefined,
    fromDate: undefined as string | undefined,
    toDate: undefined as string | undefined,
    page: 1,
    limit: 10,
  });

  // Fetch invoices on component mount and when filters change
  useEffect(() => {
    fetchInvoices();
  }, [filters]);

  const fetchInvoices = async () => {
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
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.status !== prev.status ? 1 : prev.page, // Reset page on filter change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleInvoiceDownload = async (invoiceId: string) => {
    try {
      const response = await userDashboardService.getInvoiceById(invoiceId);
      
      if (response.success && response.data) {
        toast.success("Invoice downloaded successfully");
        // Handle PDF generation/download here
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
            // Set date range to show all historical invoices
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
          onSuccess={fetchInvoices}
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
          <p className="text-sm">Try adjusting your filters or create a new invoice</p>
        </div>
      )}
    </div>
  );
}
