import { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle,
  Phone,
  MapPin,
  MessageSquare,
  LayoutDashboard,
  Building2,
  Calendar,
  Users,
  CreditCard,
  Star,
  Ticket,
  Mail,
  UserPlus,
  Settings,
  Loader2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { StatsSkeleton, TableSkeleton } from "@/components/ui/skeleton-loaders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "@/components/ui/select";
import { EnquiryChatModal } from "@/components/modals/EnquiryChatModal";
import { toast } from "@/hooks/use-toast";
import userDashboardService from "@/services/userDashboard.service";
import partnerTicketService from "@/services/spacePortal/partnerTicket.service";
import { useSocket } from "@/contexts/SocketContext";

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "new":
    case "pending_payment":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          New
        </Badge>
      );
    case "contacted":
    case "pending_kyc":
    case "in_progress":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit">
          <Clock className="w-3 h-3" />
          In Progress
        </Badge>
      );
    case "active":
    case "converted":
    case "completed":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
          Converted
        </Badge>
      );
    case "lost":
    case "cancelled":
      return (
        <Badge variant="secondary" className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
          Lost
        </Badge>
      );
    case "scheduled":
    case "pending":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
          New
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider">
          {status}
        </Badge>
      );
  }
};

// Map raw category values to full display names
const categoryDisplayName: Record<string, string> = {
  virtual_office: "Virtual Office",
  coworking: "Coworking",
  billing: "Billing & Payments",
  kyc: "KYC & Documents",
  technical: "Technical Issue",
  mail_services: "Mail Services",
  bookings: "Bookings",
  compliance: "Compliance",
  leads: "Leads",
  other: "Other",
  "Virtual Office": "Virtual Office",
  "Coworking": "Coworking",
  "Meeting Room": "Meeting Room",
  "Meeting": "Meeting",
  "Visit": "Visit",
  "Booking": "Booking",
  "General": "General",
  "Ticket": "Ticket",
};

const getCategoryLabel = (category: string) => {
  return categoryDisplayName[category] || category?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "General";
};

const ClientEnquiries = () => {
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const [convertedClients, setConvertedClients] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [avgResponseTime, setAvgResponseTime] = useState<string>("--");
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [productFilter, setProductFilter] = useState("all");
  const [dealValueFilter, setDealValueFilter] = useState("all");
  const [convertedPage, setConvertedPage] = useState(1);
  const CONVERTED_PER_PAGE = 5;
  const { socket } = useSocket();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [requestsRes, ticketsRes, analyticsRes] = await Promise.all([
        userDashboardService.getPartnerActiveRequests(),
        partnerTicketService.getPartnerTickets(1, 100),
        userDashboardService.getPartnerAnalytics(),
      ]);

      if (requestsRes.success) setActiveRequests(requestsRes.data || []);

      // Filter resolved/closed tickets for the Converted tab + calculate avg response time
      if (ticketsRes.success && ticketsRes.data?.tickets) {
        const allTickets = ticketsRes.data.tickets;
        
        // Converted tab: Resolved/Closed tickets
        const resolved = allTickets.filter(
          (t: any) => t.status === "resolved"
        );
        setConvertedClients(resolved);

        // In Progress tab: Combine Leads + In-Progress Tickets
        const inProgressTickets = allTickets
          .filter((t: any) => t.status !== "resolved")
          .map((t: any) => ({
            id: t._id,
            ticketNumber: t.ticketNumber,
            user: {
              name: t.user?.fullName,
              company: t.bookingId?.spaceSnapshot?.name || "Support Ticket",
            },
            date: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "Recent",
            category: t.category,
            status: t.status,
            subject: t.subject,
            isSupportTicket: true
          }));

        setActiveRequests(prev => {
          // Prevent duplicates if re-fetching
          const existingLeads = prev.filter(p => !p.isSupportTicket);
          return [...existingLeads, ...inProgressTickets];
        });

        // Calculate real avg response time
        // = average time between ticket createdAt and first partner reply
        const responseTimes: number[] = [];
        allTickets.forEach((ticket: any) => {
          if (!ticket.messages || !ticket.createdAt) return;
          const partnerReply = ticket.messages.find(
            (m: any) => m.sender === "partner"
          );
          if (partnerReply?.createdAt) {
            const created = new Date(ticket.createdAt).getTime();
            const replied = new Date(partnerReply.createdAt).getTime();
            const diffMs = replied - created;
            if (diffMs > 0) responseTimes.push(diffMs);
          }
        });

        if (responseTimes.length > 0) {
          const avgMs = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
          const avgMins = Math.round(avgMs / 60000);
          if (avgMins < 60) {
            setAvgResponseTime(`${avgMins}m`);
          } else if (avgMins < 1440) {
            const hrs = (avgMins / 60).toFixed(1);
            setAvgResponseTime(`${hrs}h`);
          } else {
            const days = (avgMins / 1440).toFixed(1);
            setAvgResponseTime(`${days}d`);
          }
        } else {
          setAvgResponseTime("--");
        }
      }

      if (analyticsRes.success) setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error("Error fetching enquiries data:", error);
      toast({
        title: "Error",
        description: "Failed to load enquiries data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewEnquiry = (data: any) => {
      toast({
        title: "New Lead Received",
        description: `A new inquiry has been raised for ${data.ticket?.subject || "your space"}.`,
      });
      fetchData();
    };

    socket.on("partner_new_ticket", handleNewEnquiry);
    return () => {
      socket.off("partner_new_ticket", handleNewEnquiry);
    };
  }, [socket, fetchData]);

  const handleStartChat = (enquiry: any) => {
    setSelectedEnquiry(enquiry);
    setChatModalOpen(true);
  };

  const handleCall = (phone: string) => {
    if (!phone || phone === "N/A") {
      toast({
        title: "Error",
        description: "Phone number not available.",
        variant: "destructive",
      });
      return;
    }
    window.location.href = `tel:${phone}`;
    toast({
      title: "Initiating Call",
      description: `Calling ${phone}...`,
    });
  };

  const handleMarkConverted = async (enquiry: any) => {
    try {
      const res = await userDashboardService.convertRequest(enquiry.id, enquiry.category);
      if (res.success) {
        toast({
          title: "Success",
          description: `${enquiry.user?.name} has been marked as converted.`,
        });
        // Refresh data
        const requestsRes = await userDashboardService.getPartnerActiveRequests();
        const clientsRes = await userDashboardService.getPartnerClients();
        if (requestsRes.success) setActiveRequests(requestsRes.data || []);
        if (clientsRes.success) setConvertedClients(clientsRes.data || []);
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to convert enquiry.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error converting enquiry:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-10 w-64 bg-gray-200 rounded" />
          <div className="h-4 w-96 bg-gray-100 rounded" />
        </div>
        <StatsSkeleton count={4} />
        <div className="bg-background border border-border rounded-xl p-4">
          <TableSkeleton rows={8} cols={6} />
        </div>
      </div>
    );
  }

  const stats = {
    total: activeRequests.length + convertedClients.length,
    inProgress: activeRequests.length,
    resolved: convertedClients.length,
    avgTime: avgResponseTime,
  };

  const filteredRequests = activeRequests.filter((request) => {
    const matchesSearch = 
      request.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user?.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Product Filter Logic
    const matchesProduct = productFilter === "all" || 
      (request.category?.toLowerCase() === productFilter.toLowerCase()) ||
      (request.space?.toLowerCase().includes(productFilter.replace("_", " ")));
    
    return matchesSearch && matchesProduct;
  });

  const filteredConverted = convertedClients.filter((ticket: any) => {
    const matchesSearch = 
      ticket.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProduct = productFilter === "all" || 
      (ticket.category?.toLowerCase() === productFilter.toLowerCase());
    
    return matchesSearch && matchesProduct;
  });

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-4xl">
          <span className="text-primary italic">Tickets</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage and track client support tickets and enquiries
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total Tickets</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">
            {stats.inProgress}
          </p>
          <p className="text-sm text-muted-foreground">In Progress</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">
            {stats.resolved}
          </p>
          <p className="text-sm text-muted-foreground">Resolved</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">
            {stats.avgTime}
          </p>
          <p className="text-sm text-muted-foreground">Avg Response Time</p>
        </div>
      </div>

      {/* Search & Filter Bar - Below Stats */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, company or ID..." 
            className="pl-10 h-11 rounded-xl border-border bg-background shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={productFilter} onValueChange={setProductFilter}>
          <SelectTrigger className="w-full sm:w-[220px] h-11 rounded-xl border-border bg-background">
            <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="rounded-xl max-h-[300px]">
            <SelectScrollUpButton />
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="virtual_office">Virtual Office</SelectItem>
            <SelectItem value="coworking">Coworking</SelectItem>
            <SelectItem value="billing">Billing & Payments</SelectItem>
            <SelectItem value="kyc">KYC & Documents</SelectItem>
            <SelectItem value="technical">Technical Issue</SelectItem>
            <SelectItem value="mail_services">Mail Services</SelectItem>
            <SelectItem value="bookings">Bookings</SelectItem>
            <SelectItem value="compliance">Compliance</SelectItem>
            <SelectItem value="leads">Leads</SelectItem>
            <SelectItem value="other">Other</SelectItem>
            <SelectScrollDownButton />
          </SelectContent>
        </Select>
      </div>


      <Tabs defaultValue="in_progress" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="in_progress" className="rounded-lg">In Progress</TabsTrigger>
          <TabsTrigger value="converted" className="rounded-lg">Converted</TabsTrigger>
        </TabsList>

        <TabsContent value="in_progress">
          <div className="space-y-4">
            {/* Table Header for Rows */}
            <div className="grid grid-cols-[130px_1fr_150px_130px_120px_120px] gap-4 px-6 py-3 bg-muted/30 rounded-xl text-[11px] font-bold uppercase tracking-wider text-muted-foreground border border-transparent">
              <span>Ticket Number</span>
              <span>Name</span>
              <span>Opened Date</span>
              <span>Category</span>
              <span>Status</span>
              <span className="text-center">Action</span>
            </div>

            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="grid grid-cols-[130px_1fr_150px_130px_120px_120px] gap-4 items-center bg-background border border-border rounded-xl p-4 px-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Ticket Number */}
                  <span className="text-sm font-mono text-muted-foreground truncate" title={request.ticketNumber || request.id}>
                    {request.ticketNumber || `#${request.id.substring(0, 8)}...`}
                  </span>

                  {/* Name */}
                  <div className="truncate">
                    <h3 className="font-bold text-[#1a2e2a] text-base truncate">
                      {request.user?.name || "No Name"}
                    </h3>
                  </div>

                  {/* Opened Date */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 opacity-40" />
                    <span className="truncate">{request.date}</span>
                  </div>

                  {/* Category */}
                  <div>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider py-0.5 px-2 bg-muted/20 border-border truncate max-w-full">
                      {getCategoryLabel(request.category)}
                    </Badge>
                  </div>

                  {/* Status */}
                  <div>
                    {getStatusBadge(request.status)}
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-center">
                    <Button
                      size="sm"
                      className="h-9 w-full bg-[#fdf2d0] text-[#786119] hover:bg-[#fae8b4] font-bold text-xs uppercase tracking-wider rounded-xl border-none shadow-none"
                      onClick={() => handleStartChat(request)}
                    >
                      View Chat
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-background border border-dashed border-border rounded-xl p-12 text-center">
                <p className="text-muted-foreground">
                  No active enquiries found.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="converted">
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-[130px_1fr_150px_130px_120px_120px] gap-4 px-6 py-3 bg-muted/30 rounded-xl text-[11px] font-bold uppercase tracking-wider text-muted-foreground border border-transparent">
              <span>Ticket Number</span>
              <span>Name</span>
              <span>Resolved Date</span>
              <span>Category</span>
              <span>Status</span>
              <span className="text-center">Action</span>
            </div>

            {(() => {
              const totalPages = Math.ceil(filteredConverted.length / CONVERTED_PER_PAGE);
              const startIdx = (convertedPage - 1) * CONVERTED_PER_PAGE;
              const paginatedTickets = filteredConverted.slice(startIdx, startIdx + CONVERTED_PER_PAGE);

              return paginatedTickets.length > 0 ? (
                <>
                  {paginatedTickets.map((ticket: any) => (
                    <div
                      key={ticket._id}
                      className="grid grid-cols-[130px_1fr_150px_130px_120px_120px] gap-4 items-center bg-background border border-border rounded-xl p-4 px-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Ticket Number */}
                      <span className="text-sm font-mono text-muted-foreground truncate" title={ticket.ticketNumber}>
                        {ticket.ticketNumber}
                      </span>

                      {/* Name */}
                      <div className="truncate">
                        <h3 className="font-bold text-[#1a2e2a] text-base truncate">
                          {ticket.user?.fullName || "Unknown"}
                        </h3>
                      </div>

                      {/* Resolved Date */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 opacity-40" />
                        <span className="truncate">
                          {ticket.updatedAt
                            ? new Date(ticket.updatedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "N/A"}
                        </span>
                      </div>

                      {/* Category */}
                      <div>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider py-0.5 px-2 bg-muted/20 border-border truncate max-w-full">
                          {getCategoryLabel(ticket.category)}
                        </Badge>
                      </div>

                      {/* Status */}
                      <div>
                        <div className="flex flex-col gap-1">
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit">
                            Resolved
                          </Badge>
                          {Number(ticket.rating) > 0 && (
                            <div className="flex items-center gap-0.5 mt-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-2.5 h-2.5 ${
                                    i < Number(ticket.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted/20"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action - View Chat */}
                      <div className="flex justify-center">
                        <Button
                          size="sm"
                          className="h-9 w-full bg-[#fdf2d0] text-[#786119] hover:bg-[#fae8b4] font-bold text-xs uppercase tracking-wider rounded-xl border-none shadow-none"
                          onClick={() => handleStartChat({
                            id: ticket._id,
                            user: {
                              id: ticket.user?._id || ticket.user?.id,
                              name: ticket.user?.fullName,
                              email: ticket.user?.email,
                              phone: ticket.user?.phoneNumber,
                            },
                            space: ticket.bookingId?.spaceSnapshot?.name || ticket.subject || "Query",
                            category: ticket.category,
                            status: ticket.status,
                          })}
                        >
                          View Chat
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 px-2">
                      <p className="text-sm text-muted-foreground">
                        Showing {startIdx + 1}–{Math.min(startIdx + CONVERTED_PER_PAGE, filteredConverted.length)} of {filteredConverted.length} resolved tickets
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 rounded-xl"
                          disabled={convertedPage <= 1}
                          onClick={() => setConvertedPage(p => p - 1)}
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Previous
                        </Button>
                        <span className="text-sm font-medium text-muted-foreground px-3">
                          {convertedPage} / {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 rounded-xl"
                          disabled={convertedPage >= totalPages}
                          onClick={() => setConvertedPage(p => p + 1)}
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-background border border-dashed border-border rounded-xl p-12 text-center">
                  <p className="text-muted-foreground">
                    No resolved tickets found.
                  </p>
                </div>
              );
            })()}
          </div>
        </TabsContent>
      </Tabs>

      <EnquiryChatModal
        enquiry={selectedEnquiry}
        open={chatModalOpen}
        onOpenChange={setChatModalOpen}
      />
    </div>
  );
};

export default ClientEnquiries;
