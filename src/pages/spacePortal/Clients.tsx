import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  MoreVertical,
  MapPin,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClientViewModal as PartnerClientViewModal } from "@/components/modals/ClientViewModal";
import { ClientChatModal as PartnerClientChatModal } from "@/components/modals/ClientChatModal";
import { toast } from "@/hooks/use-toast";
import { useSpacePortalSearch } from "@/contexts/SpacePortalSearchContext";
import userDashboardService from "@/services/userDashboard.service";
import { Client } from "@/types/spacePortal/client";

const getStatusBadge = (status: string) => {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          Active
        </Badge>
      );
    case "EXPIRING_SOON":
    case "EXPIRING":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          Expiring Soon
        </Badge>
      );
    case "INACTIVE":
    case "EXPIRED":
      return <Badge variant="destructive">Expired</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getKycBadge = (status: string) => {
  switch (status.toUpperCase()) {
    case "VERIFIED":
      return (
        <Badge variant="outline" className="text-green-600 border-green-300">
          KYC Verified
        </Badge>
      );
    case "PENDING":
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-300">
          KYC Pending
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const Clients = () => {
  const { query, setQuery } = useSpacePortalSearch();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await userDashboardService.getPartnerClients();
        if (response.success && response.data) {
          setClients(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch clients:", error);
        toast({
          title: "Error",
          description: "Failed to load clients.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return clients;
    return clients.filter(
      (c) =>
        c.companyName.toLowerCase().includes(normalizedQuery) ||
        c.contactName.toLowerCase().includes(normalizedQuery) ||
        c.id.toLowerCase().includes(normalizedQuery) ||
        c.space.toLowerCase().includes(normalizedQuery),
    );
  }, [clients, query]);

  const handleViewClient = (client: Client) => {
    // Map backend client to modal expected structure
    const mappedClient = {
      ...client,
      name: client.companyName,
      contact: client.contactName,
      initials: client.companyName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      status:
        client.status === "ACTIVE"
          ? "Active"
          : client.status === "EXPIRING_SOON"
            ? "At Risk"
            : "Expired",
      revenue: `\u20B9${client.dealValue?.toLocaleString() || "0"}`,
      renewal: client.endDate,
      healthScore: client.status === "ACTIVE" ? 95 : 45,
    };
    setSelectedClient(mappedClient);
    setViewModalOpen(true);
  };

  const handleChatClient = (client: Client) => {
    const mappedClient = {
      ...client,
      name: client.companyName,
      contact: client.contactName,
      initials: client.companyName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    };
    setSelectedClient(mappedClient);
    setChatModalOpen(true);
  };

  const handleClientAction = (action: string, client: Client) => {
    switch (action) {
      case "send_renewal":
        toast({
          title: "Renewal Reminder Sent",
          description: `Renewal reminder sent to ${client.contactName}`,
        });
        break;
      case "view_invoices":
        toast({
          title: "Loading Invoices",
          description: `Fetching invoices for ${client.companyName}`,
        });
        break;
      case "view_mail":
        toast({
          title: "Loading Mail Records",
          description: `Fetching mail records for ${client.companyName}`,
        });
        break;
      case "export_data":
        toast({
          title: "Exporting Data",
          description: `Client data export started for ${client.companyName}`,
        });
        break;
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl">
            My <span className="text-primary italic">Clients</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage all your client relationships
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            className="pl-10 rounded-xl"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="rounded-xl">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Clients Table */}
      <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-foreground">
                  Client
                </th>
                <th className="text-left p-4 text-sm font-semibold text-foreground">
                  Plan
                </th>
                <th className="text-left p-4 text-sm font-semibold text-foreground">
                  Space
                </th>
                <th className="text-left p-4 text-sm font-semibold text-foreground">
                  Duration
                </th>
                <th className="text-left p-4 text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-semibold text-foreground">
                  KYC
                </th>
                <th className="text-left p-4 text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Loading clients...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredClients.length > 0 ? (
                filteredClients.map((client) => {
                  const initials = client.companyName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  return (
                    <tr
                      key={client.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-foreground text-sm">
                              {client.companyName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {client.contactName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium text-foreground">
                          {client.plan}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          {client.space}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="text-foreground">
                            {client.startDate}
                          </div>
                          <div className="text-muted-foreground">
                            to {client.endDate}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{getStatusBadge(client.status)}</td>
                      <td className="p-4">{getKycBadge(client.kycStatus)}</td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewClient(client)}
                            className="hover:bg-primary/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleChatClient(client)}
                            className="hover:bg-primary/10"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleClientAction("send_renewal", client)
                                }
                              >
                                Send Renewal Reminder
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleClientAction("view_invoices", client)
                                }
                              >
                                View Invoices
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleClientAction("view_mail", client)
                                }
                              >
                                View Mail Records
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleClientAction("export_data", client)
                                }
                                className="text-destructive"
                              >
                                Export Client Data
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="p-12 text-center text-muted-foreground"
                  >
                    No clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <PartnerClientViewModal
        client={selectedClient}
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        onOpenChat={() => {
          setViewModalOpen(false);
          setChatModalOpen(true);
        }}
      />
      <PartnerClientChatModal
        client={selectedClient}
        open={chatModalOpen}
        onOpenChange={setChatModalOpen}
      />
    </div>
  );
};

export default Clients;
