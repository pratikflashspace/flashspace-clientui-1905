import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import userDashboardService, {
  Invoice,
  InvoicesResponse,
} from "@/services/userDashboard.service";

interface UseInvoicesOptions {
  autoFetch?: boolean;
  initialFilters?: {
    status?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  };
}

export const useInvoices = (options: UseInvoicesOptions = {}) => {
  const { autoFetch = true, initialFilters = {} } = options;

  const [invoicesData, setInvoicesData] = useState<InvoicesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: undefined as string | undefined,
    fromDate: undefined as string | undefined,
    toDate: undefined as string | undefined,
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userDashboardService.getInvoices(filters as any);

      if (response.success && response.data) {
        setInvoicesData(response.data);
      } else {
        const errorMessage = response.message || "Failed to fetch invoices";
        setError(errorMessage);
        toast.error(errorMessage);
        setInvoicesData(null);
      }
    } catch (err) {
      const errorMessage = "An error occurred while fetching invoices";
      setError(errorMessage);
      console.error("Error fetching invoices:", err);
      toast.error(errorMessage);
      setInvoicesData(null);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchInvoiceById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userDashboardService.getInvoiceById(id);

      if (response.success && response.data) {
        return response.data;
      } else {
        const errorMessage = response.message || "Failed to fetch invoice";
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      }
    } catch (err) {
      const errorMessage = "An error occurred while fetching invoice";
      setError(errorMessage);
      console.error("Error fetching invoice:", err);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateFilters = useCallback(
    (newFilters: Partial<typeof filters>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        // Reset page when status filter changes
        page: newFilters.status !== prev.status ? 1 : prev.page,
      }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters({
      status: undefined,
      fromDate: undefined,
      toDate: undefined,
      page: 1,
      limit: 10,
    });
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const nextPage = useCallback(() => {
    setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const prevPage = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(1, prev.page - 1),
    }));
  }, []);

  const refresh = useCallback(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Auto-fetch on mount and filter changes
  useEffect(() => {
    if (autoFetch) {
      fetchInvoices();
    }
  }, [autoFetch, fetchInvoices]);

  return {
    // Data
    invoicesData,
    invoices: invoicesData?.invoices || [],
    summary: invoicesData?.summary || {
      totalPaid: 0,
      totalPending: 0,
      totalInvoices: 0,
    },
    
    // State
    isLoading,
    error,
    filters,
    
    // Actions
    fetchInvoices,
    fetchInvoiceById,
    updateFilters,
    resetFilters,
    setPage,
    nextPage,
    prevPage,
    refresh,
  };
};

export default useInvoices;