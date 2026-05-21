import React, { useEffect, useMemo, useState } from "react";
import { getTrackProgressData } from "@/services/spacePortal/spacePartner.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/ui/skeleton-loaders";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, Clock, Loader2, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TrackProgressData {
  id: string;
  bookingId: string;
  userName: string;
  profilePicture?: string;
  spaceBooked: string;
  userKycApprovedByAdmin: boolean;
  userKycApprovedBySpace: boolean;
  draftSubmitted: boolean;
  draftVerified: boolean;
  agreementReceived: boolean;
  supportingDocReceived: boolean;
}

const StatusIndicator = ({ approved }: { approved: boolean; label: string }) => {
  if (approved) {
    return (
      <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
        <CheckCircle2 className="w-4 h-4" />
        <span>Approved</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
      <Clock className="w-4 h-4" />
      <span>Pending</span>
    </div>
  );
};

const BooleanIndicator = ({ value, trueLabel = "Yes", falseLabel = "No" }: { value: boolean; trueLabel?: string; falseLabel?: string }) => {
  if (value) {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none shadow-none font-bold">
        {trueLabel}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-muted-foreground border-dashed font-bold">
      {falseLabel}
    </Badge>
  );
};

const TrackProgress = () => {
  const [data, setData] = useState<TrackProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    try {
      const response = await getTrackProgressData();
      if (response.success && response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch track progress data", error);
      if (!silent) {
        toast({
          title: "Error",
          description: "Could not load progress data. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(true);
    }, 5000);
    return () => clearInterval(interval);
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
      <div className="flex-1 p-4">
        <TableSkeleton rows={10} cols={8} />
      </div>
    );
  }

  return (
    <div className="flex-1 animate-in fade-in duration-500">
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold text-[#35503F] tracking-tight">
          Track <span className="text-[#4A6D56] italic">Progress</span>
        </h1>
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          Monitor the lifecycle progress of all your space bookings.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#93A59B]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Booking ID, User, or Space..."
            className="pl-10 h-11 rounded-xl border-[#DDE5DA] bg-white text-sm font-medium focus:ring-primary"
          />
        </div>
      </div>

      <div className="bg-white border border-[#DDE5DA] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[1000px] border-collapse text-left text-base">
            <thead className="bg-[#F8FAF7]">
              <tr className="border-b border-[#DDE5DA] text-[#1F2E26]">
                <th className="p-5 whitespace-nowrap text-[13px] font-extrabold uppercase tracking-widest">
                  Booking ID
                </th>
                <th className="p-5 whitespace-nowrap text-[13px] font-extrabold uppercase tracking-widest">
                  User Name
                </th>
                <th className="p-5 whitespace-nowrap text-[13px] font-extrabold uppercase tracking-widest">
                  Space Booked
                </th>
                <th className="p-5 whitespace-nowrap text-center text-[13px] font-extrabold uppercase tracking-widest">
                  KYC (Admin)
                </th>

                <th className="p-5 whitespace-nowrap text-center text-[13px] font-extrabold uppercase tracking-widest">
                  Draft Agreement
                </th>
                <th className="p-5 whitespace-nowrap text-center text-[13px] font-extrabold uppercase tracking-widest">
                  Signed Agreement
                </th>
                <th className="p-5 whitespace-nowrap text-center text-[13px] font-extrabold uppercase tracking-widest">
                  Agreement
                </th>
                <th className="p-5 whitespace-nowrap text-center text-[13px] font-extrabold uppercase tracking-widest">
                  Support Docs
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF1EC]">
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FAF7] transition-colors group">
                    <td className="p-5 whitespace-nowrap">
                      <span className="font-mono text-[11px] font-bold text-primary px-2.5 py-1 bg-[#EAF6EF] rounded-lg border border-primary/10">
                        {item.bookingId}
                      </span>
                    </td>
                    <td className="p-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 ring-2 ring-background shadow-sm">
                          {item.profilePicture && (
                            <AvatarImage src={item.profilePicture} alt={item.userName} className="object-cover" />
                          )}
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
                            {item.userName?.split(" ").map(n => n[0]).join("").toUpperCase() || "CL"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-[#1F2E26]">{item.userName}</span>
                      </div>
                    </td>
                    <td className="p-5 text-sm font-bold text-[#677E73] whitespace-nowrap">{item.spaceBooked}</td>
                    <td className="p-5 text-center">
                      <div className="flex justify-center">
                        <StatusIndicator approved={item.userKycApprovedByAdmin} label="Admin" />
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      <BooleanIndicator value={item.draftSubmitted} trueLabel="Sent" falseLabel="Pending" />
                    </td>
                    <td className="p-5 text-center">
                      <BooleanIndicator value={item.draftVerified} trueLabel="Verified" falseLabel="Pending" />
                    </td>
                    <td className="p-5 text-center">
                      <BooleanIndicator value={item.agreementReceived} trueLabel="Sent" falseLabel="Not Sent" />
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
                      <p className="text-muted-foreground font-bold">No bookings found for the search criteria.</p>
                      <Button variant="link" onClick={() => setSearchQuery("")} className="text-primary p-0 h-auto font-bold">
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
          <div className="p-6 border-t border-[#EEF1EC] flex flex-col items-center gap-4 bg-[#F8FAF7] pb-8">
            <p className="text-xs font-bold text-[#677E73] order-2 sm:order-1">
              Showing <span className="text-[#1F2E26]">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}</span> to <span className="text-[#1F2E26]">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="text-[#1F2E26]">{filteredData.length}</span> entries
            </p>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="font-bold rounded-xl border-[#DDE5DA] bg-white h-9 px-4"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 p-0 rounded-xl font-bold ${currentPage === page ? 'shadow-md bg-[#2D3F33] text-[#FEF8C5]' : 'border-[#DDE5DA] bg-white'}`}
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
                className="font-bold rounded-xl border-[#DDE5DA] bg-white h-9 px-4"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackProgress;
