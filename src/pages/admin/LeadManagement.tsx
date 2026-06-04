import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import axiosInstance from "@/lib/axios";
import {
  Plus,
  Search,
  Phone,
  Mail,
  MoreVertical,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  RotateCcw,
} from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { AdminPageSkeleton } from "@/components/ui/skeleton-loaders";

const LeadManagement = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  
  // Pagination State
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });

  // Stats State
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    cancelled: 0,
    conversionRate: 0,
  });

  const fetchLeads = async (page = pagination.page, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await axiosInstance.get("/api/leads", {
        params: {
          page,
          limit: pagination.limit,
          search: searchQuery,
          startDate: dateRange.start,
          endDate: dateRange.end,
        }
      });
      
      const contacts = response?.data?.data || [];
      const paginationData = response?.data?.pagination || { page: 1, limit: 10, total: 0, pages: 1 };
      const statsData = response?.data?.stats || { total: 0, paid: 0, pending: 0, cancelled: 0, conversionRate: 0 };
      
      processLeads(contacts);
      setPagination(paginationData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch leads", error);
      if (!silent) {
        toast({
          title: "Error",
          description: "Failed to load lead data.",
          variant: "destructive",
        });
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, dateRange.start, dateRange.end]);

  const processLeads = (contacts: any[]) => {
    const contactLeads = contacts.map((contact, index) => {
      const generateScore = () => Math.floor(Math.random() * (99 - 70) + 70);

      return {
        id: contact._id,
        name: contact.name || "Unknown",
        email: contact.email || "No email",
        phone: contact.phone || "No phone",
        interest: contact.businessType || contact.spaceName || "General Inquiry",
        source: contact.source || "Website Lead",
        score: generateScore(),
        status: contact.rawStatus || "pending",
        paymentStatus: contact.paymentStatus || "pending",
        leadStatus: contact.leadStatus || "pending",
        type: contact.type || "general",
        assignee: "Unassigned",
        lastActivity: new Date(contact.createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        notes: contact.message || "New lead from website.",
        rawCreatedAt: contact.createdAt,
        enquiryDate: new Date(contact.createdAt).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        enquiryTime: new Date(contact.createdAt).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
    });

    setLeads(contactLeads);
  };

  const getStatusBadge = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "hot":
        return <Badge variant="destructive">Hot Lead</Badge>;
      case "warm":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Warm</Badge>;
      case "cold":
        return <Badge variant="secondary">Cold</Badge>;
      case "won":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Won</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    if (status === "paid") {
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>;
    }
    if (status === "cancelled") {
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Cancelled</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
  };

  const handlePaymentStatusChange = async (lead: any, status: "paid" | "pending" | "cancelled") => {
    setUpdatingLeadId(lead.id);
    try {
      await axiosInstance.patch(`/api/leads/${lead.id}/status`, { status });
      setLeads((prev) =>
        prev.map((item) =>
          item.id === lead.id ? { ...item, paymentStatus: status, leadStatus: status } : item
        )
      );
      toast({ title: "Status updated", description: `Lead marked as ${status}.` });
      void fetchLeads(pagination.page, true);
    } catch (error) {
      console.error("Failed to update lead status", error);
      toast({ title: "Error", description: "Failed to update lead status.", variant: "destructive" });
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const handleCall = (phone: string) => (window.location.href = `tel:${phone}`);
  const handleEmail = (email: string) => (window.location.href = `mailto:${email}`);

  const renderLeadTable = () => (
    <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="capitalize text-left p-4 text-sm font-semibold text-[#699178]">Name</th>
              <th className="capitalize text-left p-4 text-sm font-semibold text-[#699178]">Email</th>
              <th className="capitalize text-left p-4 text-sm font-semibold text-[#699178]">Mobile Number</th>
              <th className="capitalize text-left p-4 text-sm font-semibold text-[#699178]">Date of Enquiry</th>
              <th className="capitalize text-left p-4 text-sm font-semibold text-[#699178]">Time of Enquiry</th>
              <th className="capitalize text-left p-4 text-sm font-semibold text-[#699178] text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, idx) => (
              <tr key={lead.id || idx} className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelectedLead(lead)}>
                <td className="p-4"><div className="font-medium text-foreground">{lead.name}</div></td>
                <td className="p-4"><div className="text-sm text-muted-foreground">{lead.email}</div></td>
                <td className="p-4"><div className="text-sm text-muted-foreground">{lead.phone}</div></td>
                <td className="p-4"><div className="text-sm font-medium text-foreground">{lead.enquiryDate}</div></td>
                <td className="p-4"><div className="text-sm font-medium text-foreground">{lead.enquiryTime}</div></td>
                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    {getPaymentStatusBadge(lead.paymentStatus)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={updatingLeadId === lead.id}>
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 bg-white">
                        <DropdownMenuLabel>Mark as</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handlePaymentStatusChange(lead, "paid")}>Paid</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePaymentStatusChange(lead, "pending")}>Pending</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePaymentStatusChange(lead, "cancelled")}>Cancelled</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {leads.length === 0 && <div className="p-8 text-center text-muted-foreground">No leads found</div>}
    </div>
  );

  if (loading && pagination.total === 0) {
    return (
      <DashboardLayout portalName="FlashSpace Admin" portalDescription="Complete platform management" navItems={ADMIN_NAV_ITEMS}>
        <AdminPageSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout portalName="FlashSpace Admin" portalDescription="Complete platform management" navItems={ADMIN_NAV_ITEMS}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Lead <span className="text-primary italic">Management</span>
          </h1>
          <p className="text-[#6B7280] mt-2">Track and manage your incoming leads</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-background border border-border rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Total Leads</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-[24px] font-extrabold text-foreground tracking-tight">{stats.total}</h3>
        </div>

        <div className="bg-background border border-border rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Converted (Paid)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-[24px] font-extrabold text-foreground tracking-tight">{stats.paid}</h3>
        </div>

        <div className="bg-background border border-border rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Pending Leads</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-[24px] font-extrabold text-foreground tracking-tight">{stats.pending}</h3>
        </div>

        <div className="bg-background border border-border rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Conversion Rate</span>
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-violet-600" />
            </div>
          </div>
          <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-[24px] font-extrabold text-foreground tracking-tight">{stats.conversionRate}%</h3>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search leads by name, email or phone..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Date Range</p>
            <div className="flex items-center gap-2">
              <Input type="date" className="w-[150px]" value={dateRange.start} onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))} />
              <span className="text-muted-foreground">-</span>
              <Input type="date" className="w-[150px]" value={dateRange.end} onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))} />
            </div>
          </div>

          <Button
            onClick={() => void fetchLeads(pagination.page, false)}
            className="h-10 px-4 font-semibold bg-primary text-[#FEF8C5] hover:bg-primary/90 hover:text-[#FEF8C5] ml-auto"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>

          {(searchQuery || dateRange.start || dateRange.end) && (
            <Button variant="ghost" onClick={() => { setSearchQuery(""); setDateRange({ start: "", end: "" }); }} className="text-muted-foreground hover:text-foreground">Clear Filters</Button>
          )}
        </div>
      </div>

      <div className="mt-6">
        {renderLeadTable()}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex items-center justify-between bg-background border border-border p-4 rounded-xl shadow-sm">
        <div className="text-sm text-muted-foreground font-medium">
          Showing page <span className="text-foreground font-bold">{pagination.page}</span> of <span className="text-foreground font-bold">{pagination.pages}</span>
          <span className="mx-2 opacity-50">|</span>
          Total <span className="text-foreground font-bold">{pagination.total}</span> leads
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => fetchLeads(pagination.page - 1)} className="gap-1 hover:bg-primary hover:text-[#FEF8C5]">
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          <Button variant="outline" size="sm" disabled={pagination.page >= pagination.pages} onClick={() => fetchLeads(pagination.page + 1)} className="gap-1 hover:bg-primary hover:text-[#FEF8C5]">
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Lead View Modal */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Lead Details</DialogTitle></DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedLead.name}</h3>
                  <p className="text-muted-foreground text-sm">Added: {selectedLead.lastActivity}</p>
                </div>
                {getPaymentStatusBadge(selectedLead.paymentStatus)}
              </div>

              <div className="bg-muted/30 rounded-lg p-4 space-y-2">

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interest</span>
                  <Badge variant="outline">{selectedLead.interest}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Source</span>
                  <span className="text-foreground">{selectedLead.source}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Contact Information</h4>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{selectedLead.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{selectedLead.phone}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Notes</h4>
                <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">{selectedLead.notes}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 h-11" onClick={() => handleCall(selectedLead.phone)}><Phone className="w-4 h-4 mr-2" />Call</Button>
                <Button className="flex-1 h-11 bg-primary" onClick={() => handleEmail(selectedLead.email)}><MessageSquare className="w-4 h-4 mr-2" />Email</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default LeadManagement;
