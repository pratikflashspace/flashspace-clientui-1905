import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Search,
  Filter,
  Eye,
  MoreVertical,
  MapPin,
  MessageSquare,
  Loader2,
  X,
  Send,
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
import { useSpacePortalSearch } from "@/contexts/SpacePortalSearchContext";
import SelectBox from "@/components/ui/SpacePartner/SelectionBox";
import { userDashboardService } from "@/services/userDashboard.service";
import partnerTicketService from "@/services/spacePortal/partnerTicket.service";

import type {
  Client,
  ClientPlan,
  ClientStatus,
  KycStatus,
} from "@/types/spacePortal/client";

export default function Clients() {
  const navigate = useNavigate();
  const { query, setQuery } = useSpacePortalSearch();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);

  // The client currently targeted for the message form
  const [messageTarget, setMessageTarget] = useState<Client | null>(null);

  const [statusFilter, setStatusFilter] = useState<ClientStatus | "ALL">("ALL");
  const [planFilter, setPlanFilter] = useState<ClientPlan | "ALL">("ALL");
  const [kycFilter, setKycFilter] = useState<KycStatus | "ALL">("ALL");

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
        toast.error("Failed to load clients.");
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const statusOptions = useMemo(
    () => [
      { label: "All Status", value: "ALL" },
      { label: "Active", value: "ACTIVE" },
      { label: "Expiring Soon", value: "EXPIRING_SOON" },
      { label: "Inactive", value: "INACTIVE" },
    ],
    [],
  );

  const planOptions = useMemo(
    () => [
      { label: "All Plans", value: "ALL" },
      { label: "Virtual Office Premium", value: "Virtual Office Premium" },
      { label: "Virtual Office Standard", value: "Virtual Office Standard" },
      { label: "Team Space", value: "Team Space" },
      { label: "Hot Desk Monthly", value: "Hot Desk Monthly" },
    ],
    [],
  );

  const kycOptions = useMemo(
    () => [
      { label: "All KYC", value: "ALL" },
      { label: "Verified", value: "VERIFIED" },
      { label: "Pending", value: "PENDING" },
    ],
    [],
  );

  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);

  const matchesFilter = <T,>(filter: T | "ALL", value: T) =>
    filter === "ALL" ? true : filter === value;

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesQuery =
        client.companyName.toLowerCase().includes(normalizedQuery) ||
        client.contactName.toLowerCase().includes(normalizedQuery) ||
        client.id.toLowerCase().includes(normalizedQuery) ||
        client.space.toLowerCase().includes(normalizedQuery);

      return (
        matchesQuery &&
        matchesFilter(statusFilter, client.status) &&
        matchesFilter(planFilter, client.plan) &&
        matchesFilter(kycFilter, client.kycStatus)
      );
    });
  }, [clients, normalizedQuery, statusFilter, planFilter, kycFilter]);

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

  return (
    <div className="flex-1 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-4xl">
          My <span className="text-primary italic">Clients</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage all your client relationships
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-10 rounded-xl"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-700">
            <Filter size={18} />
            <p className="text-sm font-semibold">Filters</p>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Narrow down clients by status, plan, and KYC.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
            <SelectBox
              value={statusFilter}
              onChange={(val) => setStatusFilter(val as ClientStatus | "ALL")}
              options={statusOptions}
            />
            <SelectBox
              value={planFilter}
              onChange={(val) => setPlanFilter(val as ClientPlan | "ALL")}
              options={planOptions}
            />
            <SelectBox
              value={kycFilter}
              onChange={(val) => setKycFilter(val as KycStatus | "ALL")}
              options={kycOptions}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="bg-slate-50">
            <tr className="text-slate-600">
              <th className="px-6 py-4 font-semibold">Client</th>
              <th className="px-6 py-4 font-semibold">Plan</th>
              <th className="px-6 py-4 font-semibold">Space</th>
              <th className="px-6 py-4 font-semibold">Duration</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">KYC</th>
              <th className="px-6 py-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-sm text-slate-500">Loading clients...</p>
                  </div>
                </td>
              </tr>
            ) : filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <ClientRow
                  key={client.id}
                  client={client}
                  onView={() => handleViewClient(client)}
                  onMessage={() => setMessageTarget(client)}
                  onNavigate={() => navigate(`/spaceportal/clients/${client.userId}`)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-500">
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

      {messageTarget && (
        <SendMessageModal
          client={messageTarget}
          onClose={() => setMessageTarget(null)}
        />
      )}
    </div>
  );
}

function ClientRow({
  client,
  onView,
  onMessage,
  onNavigate,
}: {
  client: Client;
  onView: () => void;
  onMessage: () => void;
  onNavigate: () => void;
}) {
  const initials = useMemo(() => {
    return client.companyName
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }, [client.companyName]);

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-slate-900">{client.companyName}</p>
            <p className="text-sm text-slate-500">{client.contactName}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5 font-medium text-slate-800">{client.plan}</td>

      <td className="px-6 py-5 text-slate-600">
        <div className="flex items-center gap-1.5 text-sm">
          <MapPin size={14} className="text-slate-400" />
          {client.space}
        </div>
      </td>

      <td className="px-6 py-5 text-slate-600">
        <p>{client.startDate}</p>
        <p className="text-xs text-slate-400">to {client.endDate}</p>
      </td>

      <td className="px-6 py-5">
        <StatusPill status={client.status} />
      </td>

      <td className="px-6 py-5">
        <KycPill status={client.kycStatus} />
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onView}
            className="hover:bg-primary/10"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMessage}
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
              <DropdownMenuItem onClick={onNavigate}>View Full Details</DropdownMenuItem>
              <DropdownMenuItem>Send Renewal Reminder</DropdownMenuItem>
              <DropdownMenuItem>View Invoices</DropdownMenuItem>
              <DropdownMenuItem>View Mail Records</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Export Client Data</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
}

function StatusPill({ status }: { status: ClientStatus }) {
  const config =
    status === "ACTIVE"
      ? { label: "Active", className: "bg-emerald-50 text-emerald-700 border-emerald-100" }
      : status === "EXPIRING_SOON"
        ? { label: "Expiring Soon", className: "bg-amber-50 text-amber-700 border-amber-100" }
        : { label: "Inactive", className: "bg-rose-50 text-rose-700 border-rose-100" };

  return (
    <Badge variant="outline" className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${config.className}`}>
      {config.label}
    </Badge>
  );
}

function KycPill({ status }: { status: KycStatus }) {
  const config =
    status === "VERIFIED"
      ? { label: "KYC Verified", className: "bg-emerald-50 text-emerald-700 border-emerald-100" }
      : { label: "KYC Pending", className: "bg-amber-50 text-amber-700 border-amber-100" };

  return (
    <Badge variant="outline" className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${config.className}`}>
      {config.label}
    </Badge>
  );
}

function SendMessageModal({
  client,
  onClose,
}: {
  client: Client;
  onClose: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const initials = client.companyName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in both fields.");
      return;
    }
    if (!client.bookingId) {
      toast.error("Cannot identify booking for this client.");
      return;
    }
    setSending(true);
    try {
      const res = await partnerTicketService.createTicketForClient({
        clientUserId: client.userId,
        bookingId: client.bookingId,
        subject: subject.trim(),
        message: message.trim(),
      });

      if (res.success) {
        toast.success("Message sent!");
        onClose();
      } else {
        toast.error(res.message || "Failed to send message.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
              {initials}
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Send Message</h2>
              <p className="text-xs text-gray-400">To: {client.contactName}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-teal-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-teal-400 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <Button variant="ghost" onClick={onClose} disabled={sending}>Cancel</Button>
          <Button onClick={handleSend} disabled={sending || !subject.trim() || !message.trim()} className="bg-teal-600 hover:bg-teal-700 text-white">
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="mr-2" />}
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </div>
    </div>
  );
}
