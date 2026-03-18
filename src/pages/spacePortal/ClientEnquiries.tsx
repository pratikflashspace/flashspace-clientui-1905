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
} from "lucide-react";
import { StatsSkeleton, TableSkeleton } from "@/components/ui/skeleton-loaders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnquiryChatModal } from "@/components/modals/EnquiryChatModal";
import { toast } from "@/hooks/use-toast";
import userDashboardService from "@/services/userDashboard.service";
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
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
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

const ClientEnquiries = () => {
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const [convertedClients, setConvertedClients] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const { socket } = useSocket();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [requestsRes, clientsRes, analyticsRes] = await Promise.all([
        userDashboardService.getPartnerActiveRequests(),
        userDashboardService.getPartnerClients(),
        userDashboardService.getPartnerAnalytics(),
      ]);

      if (requestsRes.success) setActiveRequests(requestsRes.data || []);
      if (clientsRes.success) {
        // Filter out inactive ones for the converted list if needed,
        // but usually clients returned here are already converted.
        setConvertedClients(clientsRes.data || []);
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
    new: activeRequests.filter((r) => r.status === "pending_payment").length,
    inProgress: activeRequests.filter((r) => r.status === "pending_kyc").length,
    converted: convertedClients.length,
    rate:
      analytics?.summary?.totalBookings > 0
        ? Math.round(
            (convertedClients.length / analytics.summary.totalBookings) * 100,
          )
        : 0,
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-4xl">
          Client <span className="text-primary italic">Enquiries</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage and convert incoming client enquiries
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">{stats.new}</p>
          <p className="text-sm text-muted-foreground">New Enquiries</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">
            {stats.inProgress}
          </p>
          <p className="text-sm text-muted-foreground">In Progress</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">
            {stats.converted}
          </p>
          <p className="text-sm text-muted-foreground">Converted</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">
            {stats.rate}%
          </p>
          <p className="text-sm text-muted-foreground">Conversion Rate</p>
        </div>
      </div>

      <Tabs defaultValue="new" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="new">New & In Progress</TabsTrigger>
          <TabsTrigger value="converted">Converted</TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <div className="space-y-4">
            {activeRequests.length > 0 ? (
              activeRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-background border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {request.id}
                        </span>
                        {getStatusBadge(request.status)}
                      </div>
                      <h3 className="font-bold text-foreground text-xl">
                        {request.user?.name}
                      </h3>
                      <p className="text-muted-foreground font-medium">
                        {request.user?.company}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4" />
                      {request.date}
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-4 py-6 border-y border-border/60">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Space
                      </p>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        {request.space}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Email
                      </p>
                      <p className="text-sm font-medium text-foreground truncate">
                        {request.user?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Phone
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {request.user?.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Last Update
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {request.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      size="sm"
                      className="h-9 px-4"
                      onClick={() => handleStartChat(request)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Start Chat
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 px-4"
                      onClick={() => handleCall(request.user?.phone)}
                    >
                      <Phone className="w-4 h-4 mr-2 text-primary" />
                      Call
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-9 px-4"
                      onClick={() => handleMarkConverted(request)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                      Mark Converted
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
          <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      ID
                    </th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Client
                    </th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Company
                    </th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Product
                    </th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Converted Date
                    </th>
                    <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Deal Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {convertedClients.length > 0 ? (
                    convertedClients.map((client) => (
                      <tr
                        key={client.id}
                        className="hover:bg-muted/10 transition-colors"
                      >
                        <td className="p-4 text-sm font-mono text-muted-foreground">
                          {client.id}
                        </td>
                        <td className="p-4 text-sm font-semibold text-foreground">
                          {client.contactName}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {client.companyName}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {client.plan}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {client.startDate !== "N/A"
                            ? new Date(client.startDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="p-4 text-sm font-bold text-primary">
                          ₹{client.dealValue?.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-12 text-center text-muted-foreground"
                      >
                        No converted enquiries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
