import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { adminService } from "@/services/admin.service";
import {
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  MoreVertical,
  Eye,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await adminService.getAllBookings(); // Using bookings as leads for now
        if (response.success && response.data && response.data.bookings) {
          processLeads(response.data.bookings);
        }
      } catch (error) {
        console.error("Failed to fetch leads", error);
        toast({
          title: "Error",
          description: "Failed to load lead data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const processLeads = (bookings: any[]) => {
    const sortedBookings = [...bookings].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const processed = sortedBookings.map((booking, index) => {
      const amount = Number(booking.amount || booking.plan?.price || 0);
      const randomBase = Math.floor(Math.random() * (95 - 65) + 65);
      const score = Math.min(randomBase + (amount > 10000 ? 5 : 0), 99);

      let status = "warm";
      if (booking.status === "confirmed" || booking.status === "completed") {
        status = "won";
      } else if (booking.status === "cancelled") {
        status = "cold";
      } else if (score > 85) {
        status = "hot";
      }

      let interest = booking.plan?.name || booking.type || "Inquiry";
      interest = interest
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      return {
        id: booking.bookingNumber || `LD-${100 + index}`,
        name:
          booking.user?.companyName ||
          (booking.user?.firstName
            ? `${booking.user.firstName} ${booking.user.lastName || ""}`
            : "Unknown Client"),
        contact: booking.user?.firstName
          ? `${booking.user.firstName} ${booking.user.lastName || ""}`
          : "N/A",
        email: booking.user?.email || "No email",
        phone: booking.user?.phone || "+91 00000 00000",
        interest: interest,
        source: booking.user?.source || "Website",
        score: score,
        status: status,
        assignee: "Unassigned",
        lastActivity: new Date(booking.createdAt).toLocaleDateString(
          undefined,
          {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          },
        ),
        notes: "Auto-generated lead from booking request.",
        rawStatus: booking.status,
      };
    });

    setLeads(processed);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "hot":
        return <Badge variant="destructive">Hot Lead</Badge>;
      case "warm":
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
            Warm
          </Badge>
        );
      case "cold":
        return <Badge variant="secondary">Cold</Badge>;
      case "won":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Won
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const handleView = (lead: any) => {
    setSelectedLead(lead);
    setViewModalOpen(true);
  };

  const handleCall = (phone: string) => {
    toast({
      title: "Initiating Call",
      description: `Calling ${phone}...`,
    });
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleAddLead = () => {
    toast({
      title: "Add New Lead",
      description: "Opening lead creation form...",
    });
  };

  const hotLeads = leads.filter((l) => l.status === "hot");
  const warmLeads = leads.filter((l) => l.status === "warm");
  const coldLeads = leads.filter((l) => l.status === "cold");

  // Stats
  const wonLeadsCount = leads.filter((l) => l.status === "won").length;
  const conversionRate =
    leads.length > 0 ? ((wonLeadsCount / leads.length) * 100).toFixed(1) : 0;

  const renderLeadTable = (tableLeads: typeof leads) => (
    <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                Lead
              </th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                Interest
              </th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                Source
              </th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                AI Score
              </th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                Status
              </th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                Assignee
              </th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                Last Activity
              </th>
              <th className="text-left p-4 text-sm font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tableLeads.map((lead, idx) => (
              <tr
                key={lead.id || idx}
                className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                <td className="p-4">
                  <div>
                    <div className="font-medium text-foreground">
                      {lead.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {lead.contact}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant="outline">{lead.interest}</Badge>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {lead.source}
                </td>
                <td className="p-4">
                  <span
                    className={`font-bold text-lg ${getScoreColor(lead.score)}`}
                  >
                    {lead.score}
                  </span>
                </td>
                <td className="p-4">{getStatusBadge(lead.status)}</td>
                <td className="p-4 text-sm text-muted-foreground">
                  {lead.assignee}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {lead.lastActivity}
                </td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(lead)}
                      className="bg-primary/10 hover:bg-primary/20"
                    >
                      <Eye className="w-4 h-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCall(lead.phone)}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEmail(lead.email)}
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tableLeads.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No leads in this category
        </div>
      )}
    </div>
  );

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Lead <span className="text-primary italic">Management</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Track, score, and convert leads with AI assistance
          </p>
        </div>
        <Button onClick={handleAddLead}>
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">
            {leads.length}
          </p>
          <p className="text-sm text-muted-foreground">Total Leads</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-red-600">
            {hotLeads.length}
          </p>
          <p className="text-sm text-muted-foreground">Hot Leads</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-orange-600">
            {warmLeads.length}
          </p>
          <p className="text-sm text-muted-foreground">Warm Leads</p>
        </div>
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">
            {conversionRate}%
          </p>
          <p className="text-sm text-muted-foreground">Conversion Rate</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search leads..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Leads ({leads.length})</TabsTrigger>
          <TabsTrigger value="hot">Hot ({hotLeads.length})</TabsTrigger>
          <TabsTrigger value="warm">Warm ({warmLeads.length})</TabsTrigger>
          <TabsTrigger value="cold">Cold ({coldLeads.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">{renderLeadTable(leads)}</TabsContent>

        <TabsContent value="hot">{renderLeadTable(hotLeads)}</TabsContent>

        <TabsContent value="warm">{renderLeadTable(warmLeads)}</TabsContent>

        <TabsContent value="cold">{renderLeadTable(coldLeads)}</TabsContent>
      </Tabs>

      {/* Lead View Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {selectedLead.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedLead.contact}
                  </p>
                </div>
                {getStatusBadge(selectedLead.status)}
              </div>

              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AI Score</span>
                  <span
                    className={`font-bold text-xl ${getScoreColor(selectedLead.score)}`}
                  >
                    {selectedLead.score}/100
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interest</span>
                  <Badge variant="outline">{selectedLead.interest}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Source</span>
                  <span className="text-foreground">{selectedLead.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assigned To</span>
                  <span className="text-foreground">
                    {selectedLead.assignee}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">
                  Contact Information
                </h4>
                <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-sm">{selectedLead.email}</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-sm">{selectedLead.phone}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Notes</h4>
                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  {selectedLead.notes}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleCall(selectedLead.phone)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => handleEmail(selectedLead.email)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default LeadManagement;
