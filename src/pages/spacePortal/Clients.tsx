import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast as hotToast } from "react-hot-toast";

import type {
  Client,
  ClientStatus,
  KycStatus,
} from "@/types/spacePortal/client";

import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Download,
  Eye,
  Loader2,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  UserRoundCheck,
  X,
} from "lucide-react";
import { TableSkeleton } from "@/components/ui/skeleton-loaders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientViewModal as PartnerClientViewModal } from "@/components/modals/ClientViewModal";
import { ClientChatModal as PartnerClientChatModal } from "@/components/modals/ClientChatModal";
import { toast } from "@/hooks/use-toast";
import { userDashboardService } from "@/services/userDashboard.service";
import partnerTicketService from "@/services/spacePortal/partnerTicket.service";

type BookingFilters = {
  search: string;
  subscriptionStatus: string;
  workspace: string;
  city: string;
  space: string;
};

type ApiErrorLike = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

type SelectedClient = Omit<Client, "status"> & {
  name: string;
  contact: string;
  initials: string;
  status: string;
  revenue: string;
  renewal: string;
  healthScore: number;
};

const emptyFilters: BookingFilters = {
  search: "",
  subscriptionStatus: "ALL",
  workspace: "ALL",
  city: "ALL",
  space: "ALL",
};

const statusOptions = [
  { label: "All Status", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Expiring Soon", value: "EXPIRING_SOON" },
  { label: "Inactive", value: "INACTIVE" },
];

const normalize = (value?: string | number | null) =>
  String(value ?? "").trim().toLowerCase();

const includesText = (value: string | undefined, query: string) =>
  !query || normalize(value).includes(normalize(query));

const isSameOption = (filter: string, value?: string) =>
  filter === "ALL" || normalize(filter) === normalize(value);

const formatStatus = (status?: string) =>
  (status || "N/A").replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const formatDate = (value?: string) => {
  if (!value || value === "N/A") return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCleanLocation = (location?: string, city?: string) => {
  const parts = String(location || city || "N/A")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const uniqueParts = Array.from(
    new Map(parts.map((part) => [part.toLowerCase(), part])).values(),
  );

  const cleanCity = city?.trim();
  const locationIncludesCity = cleanCity
    ? uniqueParts.some((part) => normalize(part) === normalize(cleanCity))
    : false;

  return {
    main: uniqueParts.join(", ") || "N/A",
    sub: cleanCity && !locationIncludesCity ? cleanCity : "",
  };
};

const uniqueOptions = (rows: Client[], getter: (row: Client) => string | undefined) =>
  Array.from(
    new Set(
      rows
        .map(getter)
        .filter((value): value is string => Boolean(value && value !== "N/A")),
    ),
  ).sort((a, b) => a.localeCompare(b));

const normalizeClientRows = (rows: Client[]) =>
  rows.map((client) => {
    const legacyClient = client as Client & { category?: string };
    return {
      ...client,
      bookingNumber: client.bookingNumber || client.id,
      invoiceNumber: client.invoiceNumber || client.bookingNumber || client.id,
      workspace:
        client.workspace ||
        legacyClient.category ||
        client.type ||
        client.plan ||
        "N/A",
      subscriptionSubStatus:
        client.subscriptionSubStatus || formatStatus(client.status),
      kycType: client.kycType || "N/A",
    };
  });

export default function Clients() {
  const navigate = useNavigate();
  const location = useLocation();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedClient, setSelectedClient] = useState<SelectedClient | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [messageTarget, setMessageTarget] = useState<Client | null>(null);
  const [draftFilters, setDraftFilters] = useState<BookingFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<BookingFilters>(emptyFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadBookings = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await userDashboardService.getPartnerClientBookings();
      if (response.success && response.data && response.data.length > 0) {
        setClients(normalizeClientRows(response.data as Client[]));
      } else {
        const fallback = await userDashboardService.getPartnerClients();
        setClients(normalizeClientRows((fallback.data || []) as Client[]));
      }
    } catch (error) {
      console.error("Failed to fetch partner bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load client bookings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const workspaceOptions = useMemo(
    () => uniqueOptions(clients, (client) => client.workspace),
    [clients],
  );
  const cityOptions = useMemo(
    () => uniqueOptions(clients, (client) => client.city),
    [clients],
  );
  const spaceOptions = useMemo(
    () => uniqueOptions(clients, (client) => client.space),
    [clients],
  );

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        includesText(client.contactName, appliedFilters.search) ||
        includesText(client.email, appliedFilters.search) ||
        includesText(client.phone, appliedFilters.search) ||
        includesText(client.companyName, appliedFilters.search) ||
        includesText(client.invoiceNumber, appliedFilters.search) ||
        includesText(client.bookingNumber, appliedFilters.search) ||
        includesText(client.space, appliedFilters.search);

      return (
        matchesSearch &&
        isSameOption(appliedFilters.subscriptionStatus, client.status) &&
        isSameOption(appliedFilters.workspace, client.workspace) &&
        isSameOption(appliedFilters.city, client.city) &&
        isSameOption(appliedFilters.space, client.space)
      );
    });
  }, [clients, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedClients = filteredClients.slice(startIndex, startIndex + pageSize);
  const metrics = useMemo(() => {
    const active = filteredClients.filter((client) => client.status === "ACTIVE").length;
    const expiring = filteredClients.filter(
      (client) => client.status === "EXPIRING_SOON",
    ).length;
    const uniqueSpaces = new Set(
      filteredClients.map((client) => client.space).filter(Boolean),
    ).size;

    return [
      {
        label: "Linked Bookings",
        value: filteredClients.length,
        helper: "Across your spaces",
        icon: CalendarDays,
      },
      {
        label: "Active Clients",
        value: active,
        helper: "Currently live",
        icon: CheckCircle2,
      },
      {
        label: "Expiring Soon",
        value: expiring,
        helper: "Needs attention",
        icon: UserRoundCheck,
      },
      {
        label: "Spaces Booked",
        value: uniqueSpaces,
        helper: "Unique locations",
        icon: Building2,
      },
    ];
  }, [filteredClients]);

  useEffect(() => {
    setPage(1);
  }, [appliedFilters, pageSize]);

  const handleFilterChange = (key: keyof BookingFilters, value: string) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
  };

  const resetFilters = () => {
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  const exportRows = () => {
    const headers = [
      "Invoice No.",
      "User Name",
      "Company Name",
      "Email",
      "Phone",
      "Workspace",
      "Space",
      "Location",
      "Status",
      "Sub Status",
      "KYC Type",
      "Start Date",
      "End Date",
    ];
    const rows = filteredClients.map((client) => [
      client.invoiceNumber || client.bookingNumber || client.id,
      client.contactName,
      client.companyName,
      client.email || "",
      client.phone || "",
      client.workspace || "",
      client.space || "",
      client.location || "",
      formatStatus(client.status),
      client.subscriptionSubStatus || "",
      client.kycType || "",
      client.startDate,
      client.endDate,
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "partner-client-bookings.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleViewClient = (client: Client) => {
    const mappedClient = {
      ...client,
      name: client.companyName,
      contact: client.contactName,
      initials: client.companyName
        .split(" ")
        .map((name) => name[0])
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

  useEffect(() => {
    if (!clients.length) return;

    const params = new URLSearchParams(location.search);
    const bookingNumber = params.get("bookingNumber")?.trim();
    const clientId = params.get("clientId")?.trim();
    const searchValue = bookingNumber || clientId || "";

    if (!searchValue) return;

    setDraftFilters((prev) => ({ ...prev, search: searchValue }));
    setAppliedFilters((prev) => ({ ...prev, search: searchValue }));
    setPage(1);
  }, [clients, location.search]);

  return (
    <div className="flex-1 animate-in fade-in duration-500">
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Client <span className="text-primary italic">Bookings</span>
        </h1>
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          View every booking linked to your spaces.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-[#DDE5DA] bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#677E73]">
                  {metric.label}
                </p>
                <p className="mt-3 text-3xl font-extrabold text-[#1F2E26]">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs font-medium text-[#677E73]">
                  {metric.helper}
                </p>
              </div>
              <div className="rounded-xl bg-[#EAF6EF] p-3 text-[#35503F]">
                <metric.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#DDE5DA] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#1F2E26]">
              Booking Directory
            </h2>
            <p className="mt-1 text-xs font-medium text-[#677E73]">
              Filter by status, city, workspace, or exact space.
            </p>
          </div>
        </div>
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:items-end">
          <FilterInput
            label="Search"
            placeholder="Name, email, phone, company, invoice"
            value={draftFilters.search}
            onChange={(value) => handleFilterChange("search", value)}
          />
          <FilterSelect
            label="Status"
            value={draftFilters.subscriptionStatus}
            onChange={(value) => handleFilterChange("subscriptionStatus", value)}
            options={statusOptions}
          />
          <FilterSelect
            label="Workspaces"
            value={draftFilters.workspace}
            onChange={(value) => handleFilterChange("workspace", value)}
            options={[
              { label: "Workspaces", value: "ALL" },
              ...workspaceOptions.map((value) => ({ label: value, value })),
            ]}
          />
          <FilterSelect
            label="Cities"
            value={draftFilters.city}
            onChange={(value) => handleFilterChange("city", value)}
            options={[
              { label: "Cities", value: "ALL" },
              ...cityOptions.map((value) => ({ label: value, value })),
            ]}
          />
          <FilterSelect
            label="Space"
            value={draftFilters.space}
            onChange={(value) => handleFilterChange("space", value)}
            options={[
              { label: "Space", value: "ALL" },
              ...spaceOptions.map((value) => ({ label: value, value })),
            ]}
          />
          <Button onClick={applyFilters} className="h-11 w-full rounded-xl px-6 font-bold">
            Apply
          </Button>
          <Button
            onClick={resetFilters}
            variant="ghost"
            className="h-11 w-full rounded-xl px-6 font-bold"
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-muted-foreground">
          Showing {filteredClients.length === 0 ? 0 : startIndex + 1} -{" "}
          {Math.min(startIndex + pageSize, filteredClients.length)} of{" "}
          {filteredClients.length} results
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => loadBookings(true)}
            disabled={refreshing}
            className="h-9 rounded-lg font-bold text-primary"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="ghost"
            onClick={exportRows}
            className="h-9 rounded-lg font-bold text-primary"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-[#DDE5DA] bg-white shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <TableSkeleton rows={10} cols={10} />
          ) : (
            <table className="w-full min-w-[1120px] table-fixed border-collapse text-left text-sm">
              <thead className="bg-[#F8FAF7]">
                <tr className="border-b border-[#DDE5DA] text-[#1F2E26]">
                  <TableHead className="w-14 text-right">S.No.</TableHead>
                  <TableHead className="w-28">Invoice No.</TableHead>
                  <TableHead className="w-24">User Name</TableHead>
                  <TableHead className="w-40">Company Name</TableHead>
                  <TableHead className="w-56">Contact</TableHead>
                  <TableHead className="w-32">Workspace</TableHead>
                  <TableHead className="w-36">Space</TableHead>
                  <TableHead className="w-36">Location</TableHead>
                  <TableHead className="w-28 text-center">Status</TableHead>
                  <TableHead className="w-28 text-center">KYC</TableHead>
                  <TableHead className="w-40 text-center">Action</TableHead>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.length > 0 ? (
                  paginatedClients.map((client, index) => (
                    <BookingRow
                      key={client.bookingId || client.id}
                      client={client}
                      serial={startIndex + index + 1}
                      onView={() => handleViewClient(client)}
                      onMessage={() => setMessageTarget(client)}
                      onNavigate={() =>
                        navigate(`/spaceportal/clients/${client.userId}`)
                      }
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="p-12 text-center text-slate-500">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Showing</span>
          <select
            value={pageSize}
            onChange={(event) => setPageSize(Number(event.target.value))}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm font-semibold"
          >
            {[10, 25, 50].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <span className="text-sm text-muted-foreground">Results per page</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={safePage <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <span className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground">
            {safePage}
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={safePage >= totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </Button>
        </div>
      </div>

      <PartnerClientViewModal
        client={selectedClient}
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        onOpenChat={() => {
          setViewModalOpen(false);
          setChatModalOpen(true);
        }}
        onManageClient={() => {
          if (!selectedClient?.userId) return;
          setViewModalOpen(false);
          navigate(`/spaceportal/clients/${selectedClient.userId}`);
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

function FilterInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#677E73]">
        {label}
      </p>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#93A59B]" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 rounded-xl border-[#DDE5DA] bg-[#F8FAF7] pl-9 text-sm font-medium"
        />
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#677E73]">
        {label}
      </p>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-[#DDE5DA] bg-[#F8FAF7] px-3 text-sm font-semibold text-[#1F2E26] shadow-sm focus:border-primary focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TableHead({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th className={`px-4 py-4 text-[11px] font-extrabold uppercase tracking-widest ${className}`}>
      {children}
    </th>
  );
}

function BookingRow({
  client,
  serial,
  onView,
  onMessage,
  onNavigate,
}: {
  client: Client;
  serial: number;
  onView: () => void;
  onMessage: () => void;
  onNavigate: () => void;
}) {
  const cleanLocation = formatCleanLocation(client.location, client.city);

  return (
    <tr className="border-b border-[#EEF1EC] align-top last:border-0 hover:bg-[#F8FAF7] transition-colors">
      <td className="px-4 py-5 text-right font-semibold text-muted-foreground">
        {serial}.
      </td>
      <td className="px-4 py-5">
        <button
          onClick={onNavigate}
          className="max-w-full rounded-lg bg-[#F8FAF7] px-2.5 py-1 font-mono text-[11px] font-bold text-primary hover:underline"
        >
          {client.invoiceNumber || client.bookingNumber || client.id}
        </button>
      </td>
      <td className="px-4 py-5 font-semibold text-foreground">
        {client.contactName}
      </td>
      <td className="px-4 py-5 text-foreground">
        <p className="truncate font-semibold">
          {client.companyName}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(client.startDate)} - {formatDate(client.endDate)}
        </p>
      </td>
      <td className="px-4 py-5">
        <p className="truncate font-semibold text-foreground">{client.email || "N/A"}</p>
        <p className="text-sm text-muted-foreground">{client.phone || "N/A"}</p>
      </td>
      <td className="px-4 py-5">
        <span className="inline-flex min-w-[92px] items-center justify-center rounded-full bg-[#EAF6EF] px-3 py-1.5 text-center text-xs font-bold leading-none text-[#35503F]">
          {client.workspace || "N/A"}
        </span>
      </td>
      <td className="px-4 py-5">
        <p className="line-clamp-2 max-w-[130px] font-bold leading-5 text-foreground">
          {client.space || "N/A"}
        </p>
      </td>
      <td className="px-4 py-5 text-muted-foreground">
        <p className="line-clamp-2 max-w-[130px] text-sm font-medium leading-5">
          {cleanLocation.main}
        </p>
        {cleanLocation.sub && (
          <p className="mt-1 text-xs font-medium text-[#677E73]">
            {cleanLocation.sub}
          </p>
        )}
      </td>
      <td className="px-4 py-5 text-center">
        <StatusPill status={client.status} />
        <p className="mt-2 text-xs font-medium text-muted-foreground">
          {client.subscriptionSubStatus || "N/A"}
        </p>
      </td>
      <td className="px-4 py-5 text-center">
        <KycPill status={client.kycStatus} />
        <p className="mt-2 text-xs font-medium text-muted-foreground">
          {client.kycType || "N/A"}
        </p>
      </td>
      <td className="px-4 py-5">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onView}
            className="h-9 rounded-full border border-[#DDE5DA] bg-white px-3 font-bold text-[#1F2E26] hover:bg-[#F8FAF7] hover:text-[#35503F]"
          >
            <Eye className="mr-1.5 h-4 w-4" />
            Details
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMessage}
            className="h-9 w-9 rounded-full border border-[#DDE5DA] bg-white text-[#35503F] hover:bg-[#F8FAF7]"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

function StatusPill({ status }: { status: ClientStatus }) {
  const config =
    status === "ACTIVE"
      ? {
          label: "Active",
          className: "bg-emerald-50 text-emerald-700 border-emerald-100",
        }
      : status === "EXPIRING_SOON"
        ? {
            label: "Expiring Soon",
            className: "bg-amber-50 text-amber-700 border-amber-100",
          }
        : {
            label: "Inactive",
            className: "bg-rose-50 text-rose-700 border-rose-100",
          };

  return (
    <Badge
      variant="outline"
      className={`inline-flex min-w-[86px] justify-center rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${config.className}`}
    >
      {config.label}
    </Badge>
  );
}

function KycPill({ status }: { status: KycStatus }) {
  const config =
    status === "VERIFIED"
      ? {
          label: "Verified",
          className: "bg-emerald-50 text-emerald-700 border-emerald-100",
        }
      : {
          label: "Pending",
          className: "bg-amber-50 text-amber-700 border-amber-100",
        };

  return (
    <Badge
      variant="outline"
      className={`inline-flex min-w-[92px] justify-center rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${config.className}`}
    >
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
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      hotToast.error("Please fill in both fields.");
      return;
    }
    if (!client.bookingId) {
      hotToast.error("Cannot identify booking for this client.");
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
        hotToast.success(
          "Message sent! The client will see it in their support section.",
        );
        onClose();
      } else {
        hotToast.error(res.message || "Failed to send message.");
      }
    } catch (err: unknown) {
      const error = err as ApiErrorLike;
      hotToast.error(error.response?.data?.message || "Something went wrong.");
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
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-teal-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
              Message
            </label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-teal-400 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <Button variant="ghost" onClick={onClose} disabled={sending}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={sending || !subject.trim() || !message.trim()}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {sending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} className="mr-2" />
            )}
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </div>
    </div>
  );
}
