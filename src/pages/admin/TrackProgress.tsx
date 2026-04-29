import React, { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { adminService } from "@/services/admin.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPageSkeleton } from "@/components/ui/skeleton-loaders";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, Clock, Loader2, RotateCcw, Search, XCircle } from "lucide-react";

interface TrackProgressData {
  id: string;
  bookingId: string;
  userName: string;
  spaceBooked: string;
  userKycApprovedByAdmin: boolean;
  userKycApprovedBySpace: boolean;
  draftSubmitted: boolean;
  draftVerified: boolean;
  supportingDocReceived: boolean;
}

const StatusIndicator = ({ approved, label }: { approved: boolean; label: string }) => {
  if (approved) {
    return (
      <div className="flex items-center gap-1.5 text-green-600 font-medium text-xs">
        <CheckCircle2 className="w-4 h-4" />
        <span>Approved</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-amber-500 font-medium text-xs">
      <Clock className="w-4 h-4" />
      <span>Pending</span>
    </div>
  );
};

const BooleanIndicator = ({ value, trueLabel = "Yes", falseLabel = "No" }: { value: boolean; trueLabel?: string; falseLabel?: string }) => {
  if (value) {
    return (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none shadow-none">
        {trueLabel}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-muted-foreground border-dashed">
      {falseLabel}
    </Badge>
  );
};

const TrackProgress = () => {
  const [data, setData] = useState<TrackProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const response = await adminService.getTrackProgressData();
      if (response.success && response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch track progress data", error);
      toast({
        title: "Error",
        description: "Could not load progress data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return data;
    return data.filter(
      (item) =>
        item.bookingId.toLowerCase().includes(query) ||
        item.userName.toLowerCase().includes(query) ||
        item.spaceBooked.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) {
    return (
      <DashboardLayout
        portalName="FlashSpace Admin"
        portalDescription="Complete platform management"
        navItems={ADMIN_NAV_ITEMS}
      >
        <AdminPageSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Track <span className="text-primary italic">Progress</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor the lifecycle progress of all user bookings across KYC and documentation stages.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Booking ID, User, or Space..."
            className="pl-10 h-11 ring-offset-background transition-all focus-visible:ring-primary"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => void fetchData(true)}
          disabled={refreshing}
          className="h-11 px-6 font-semibold"
        >
          {refreshing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RotateCcw className="w-4 h-4 mr-2" />
          )}
          Refresh Data
        </Button>
      </div>

      <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-muted/40 border-b border-border text-nowrap">
              <tr>
                <th className="text-left p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Booking ID
                </th>
                <th className="text-left p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  User Name
                </th>
                <th className="text-left p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Space Booked
                </th>
                <th className="text-center p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  KYC Approved by Admin
                </th>
                <th className="text-center p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground text-wrap max-w-[150px]">
                  KYC Approved by Partner
                </th>
                <th className="text-center p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Draft Sent
                </th>
                <th className="text-center p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Draft Signed
                </th>
                <th className="text-center p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Support Docs
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="p-5">
                      <span className="font-mono text-xs font-bold text-primary px-2 py-1 bg-primary/5 rounded border border-primary/10">
                        {item.bookingId}
                      </span>
                    </td>
                    <td className="p-5 font-semibold text-foreground">{item.userName}</td>
                    <td className="p-5 text-sm font-medium">{item.spaceBooked}</td>
                    <td className="p-5">
                      <div className="flex justify-center">
                        <StatusIndicator approved={item.userKycApprovedByAdmin} label="Admin" />
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex justify-center">
                        <StatusIndicator approved={item.userKycApprovedBySpace} label="Space" />
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <BooleanIndicator value={item.draftSubmitted} trueLabel="Sent" falseLabel="No Draft" />
                    </td>
                    <td className="p-5 text-center">
                      <BooleanIndicator value={item.draftVerified} trueLabel="Verified" falseLabel="Pending" />
                    </td>
                    <td className="p-5 text-center">
                      <BooleanIndicator value={item.supportingDocReceived} trueLabel="Received" falseLabel="Missing" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-muted-foreground font-medium">No bookings found for the search criteria.</p>
                      <Button variant="link" onClick={() => setSearchQuery("")} className="text-primary p-0 h-auto">
                        Clear Search
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredData.length > 0 && (
          <div className="p-6 border-t border-border flex flex-col items-center gap-4 bg-muted/20 pb-10">
            <p className="text-sm text-muted-foreground order-2 sm:order-1">
              Showing <span className="font-semibold text-foreground">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}</span> to <span className="font-semibold text-foreground">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-semibold text-foreground">{filteredData.length}</span> entries
            </p>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="font-medium"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 p-0 ${currentPage === page ? 'shadow-md' : ''}`}
                  >
                    {page}
                  </Button>
                )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="font-medium"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TrackProgress;
