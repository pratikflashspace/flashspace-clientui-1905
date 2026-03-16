import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import type {
  Client,
  ClientPlan,
  ClientStatus,
  KycStatus,
} from "@/types/spacePortal/client";

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
import { toast } from "@/hooks/use-toast";
import { useSpacePortalSearch } from "@/contexts/SpacePortalSearchContext";
import SelectBox from "@/components/ui/SpacePartner/SelectionBox";
import { userDashboardService } from "@/services/userDashboard.service";
import partnerTicketService from "@/services/spacePortal/partnerTicket.service";

export default function Clients() {
  const navigate = useNavigate();
  const { query } = useSpacePortalSearch();

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

      return (
        matchesQuery &&
        matchesFilter(statusFilter, client.status) &&
        matchesFilter(planFilter, client.plan) &&
        matchesFilter(kycFilter, client.kycStatus)
      );
    });
  }, [clients, normalizedQuery, statusFilter, planFilter, kycFilter]);

  return (
    <div className="flex-1">
      {/* Filters */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
        <Button variant="outline" className="rounded-xl">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
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
          <tbody>
            {filteredClients.map((client) => (
              <ClientRow
                key={client.id}
                client={client}
                onView={() => navigate(`/spaceportal/clients/${client.userId}`)}
                onMessage={() => setMessageTarget(client)}
              />
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#3FA69E]" />
            <p className="mt-2 text-sm text-slate-500">Loading clients...</p>
          </div>
        )}
        {!loading && filteredClients.length === 0 && (
          <p className="p-12 text-center text-slate-500">No clients found.</p>
        )}
      </div>{/* ← closes overflow-x-auto table wrapper */}

      {/* Send Message Modal */}
      {messageTarget && (
        <SendMessageModal
          client={messageTarget}
          onClose={() => setMessageTarget(null)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SendMessageModal — simple form the partner fills to message a client
// ─────────────────────────────────────────────────────────────────────────────

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
        toast.success("Message sent! The client will see it in their support section.");
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

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
              {initials}
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Send Message</h2>
              <p className="text-xs text-gray-400">
                To: {client.contactName} · {client.companyName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Important update about your workspace"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Write your message to the client…"
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all"
            />
          </div>

          <p className="text-xs text-gray-400">
            📬 This message will appear in the client's <strong>Support / My Tickets</strong> section. They'll get a notification instantly.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            disabled={sending}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending || !subject.trim() || !message.trim()}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors shadow-md shadow-teal-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            {sending ? "Sending…" : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Table subcomponents
// ─────────────────────────────────────────────────────────────────────────────

function ClientRow({
  client,
  onView,
  onMessage,
}: {
  client: Client;
  onView: () => void;
  onMessage: () => void;
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
    <tr className="border-t border-slate-100 hover:bg-slate-50">
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-[#3FA69E]">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{client.companyName}</p>
            <p className="text-sm text-slate-500">{client.contactName}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5 font-semibold text-slate-800">{client.plan}</td>

      <td className="px-6 py-5 text-slate-600">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-slate-400" />
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
        <div className="flex items-center justify-center gap-4 text-slate-500">
          <button
            onClick={onView}
            className="hover:text-slate-900"
            aria-label="View Client"
            type="button"
          >
            <Eye size={18} />
          </button>

          <button
            onClick={onMessage}
            className="hover:text-teal-600 transition-colors"
            aria-label="Send message to client"
            title="Send message"
            type="button"
          >
            <MessageSquare size={18} />
          </button>

          <button
            className="hover:text-slate-900"
            aria-label="More options"
            type="button"
          >
            <MoreVertical size={18} />
          </button>

          <button
            onClick={onView}
            className="rounded-lg bg-[#3FA69E] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
            type="button"
          >
            View
          </button>
        </div>
      </td>
    </tr>
  );
}

function StatusPill({ status }: { status: ClientStatus }) {
  const config =
    status === "ACTIVE"
      ? { label: "Active", className: "bg-emerald-50 text-emerald-700" }
      : status === "EXPIRING_SOON"
        ? { label: "Expiring Soon", className: "bg-amber-50 text-amber-700" }
        : { label: "Inactive", className: "bg-rose-50 text-rose-700" };

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

function KycPill({ status }: { status: KycStatus }) {
  const config =
    status === "VERIFIED"
      ? { label: "KYC Verified", className: "bg-emerald-50 text-emerald-700" }
      : { label: "KYC Pending", className: "bg-amber-50 text-amber-700" };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap ${config.className}`}
    >
      {config.label}
    </span>
  );
}
