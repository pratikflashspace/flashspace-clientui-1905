import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Mail,
  User,
  CheckCircle2,
  Package,
  Clock,
  Plus,
  Loader2,
  MapPin,
  ChevronDown,
  MoreVertical,
  History,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Send,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import LogMailModal from "@/components/SpacePartner/LogMailModal";
import LogVisitModal from "@/components/SpacePartner/LogVisitModal";
import { mailService, MailRecord } from "@/services/mailService";
import { visitService, VisitRecord } from "@/services/visitService";
import { format } from "date-fns";
import { getUploadedFileUrl } from "@/utils/fileUrl";

const MailAndVisits = () => {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as "mail" | "visits") || "mail";
  const [activeTab, setActiveTab] = useState<"mail" | "visits">(initialTab);
  const [mailRecords, setMailRecords] = useState<MailRecord[]>([]);
  const [visitRecords, setVisitRecords] = useState<VisitRecord[]>([]);
  const [mailPagination, setMailPagination] = useState({ page: 1, pages: 1, total: 0, pending: 0, collected: 0 });
  const [visitPagination, setVisitPagination] = useState({ page: 1, pages: 1, total: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [isLogMailModalOpen, setIsLogMailModalOpen] = useState(false);
  const [isLogVisitModalOpen, setIsLogVisitModalOpen] = useState(false);
  const [mailSearch, setMailSearch] = useState("");
  const [visitSearch, setVisitSearch] = useState("");
  const [mailStatusFilter, setMailStatusFilter] = useState("all");

  const fetchMails = async (page = 1) => {
    try {
      const response = await mailService.getAll(page, 10, mailSearch, mailStatusFilter);
      if (response.success) {
        setMailRecords(response.data);
        setMailPagination(response.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch mails", error);
      toast.error("Failed to fetch mail records");
    }
  };

  const fetchVisits = async (page = 1) => {
    try {
      const response = await visitService.getAll(page, 10, visitSearch);
      if (response.success) {
        setVisitRecords(response.data);
        setVisitPagination(response.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch visits", error);
      toast.error("Failed to fetch visit records");
    }
  };

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    await Promise.all([fetchMails(), fetchVisits()]);
    if (!silent) setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [mailStatusFilter]);

  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [mailStatusFilter]);

  const handleMailSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMails(1);
  };

  const handleVisitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVisits(1);
  };

  const stats = [
    {
      icon: CheckCircle2,
      value: mailPagination.collected,
      label: "Total Mail Collected",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: Package,
      value: mailPagination.pending,
      label: "Pending Mail",
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      icon: User,
      value: visitPagination.total,
      label: "Total Visits",
      color: "text-primary",
      bg: "bg-primary/5",
    },
  ];

  const handleUpdate = async (id: string, nextStatus: string) => {
    try {
      const response = await mailService.updateStatus(id, nextStatus);
      if (response.success) {
        setMailRecords((prev) =>
          prev.map((record) =>
            record._id === id
              ? { ...record, status: nextStatus as any }
              : record,
          ),
        );
        fetchMails(mailPagination.page);
        toast.success(`Mail status updated to ${nextStatus}`);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleVisitUpdate = async (id: string, nextStatus: string) => {
    try {
      const response = await visitService.updateStatus(id, nextStatus);
      if (response.success) {
        setVisitRecords((prev) =>
          prev.map((record) =>
            record._id === id
              ? { ...record, status: nextStatus as any }
              : record,
          ),
        );
        fetchVisits(visitPagination.page);
        toast.success(`Visit status updated to ${nextStatus}`);
      }
    } catch (error) {
      toast.error("Failed to update visit status");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">
          Syncing mail and visit logs...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl">
            Mail & <span className="text-primary italic">Visits</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Track and manage front-desk interactions for your clients
          </p>
        </div>
        <div className="flex gap-3">
          {activeTab === "mail" && (
            <Button
              onClick={() => setIsLogMailModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg transition-all active:scale-95 px-6"
            >
              <Plus className="w-5 h-5 mr-1" />
              Log Mail
            </Button>
          )}
          {activeTab === "visits" && (
            <Button
              onClick={() => setIsLogVisitModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg transition-all active:scale-95 px-6"
            >
              <Plus className="w-5 h-5 mr-1" />
              Log Visit
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-background border border-border rounded-xl p-6 shadow-sm hover:translate-y-[-2px] transition-all duration-300 flex items-center gap-5"
          >
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <h3 className="text-3xl font-extrabold text-foreground tracking-tight">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "mail" | "visits")} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted/50 p-1 rounded-xl w-fit">
            <TabsTrigger
              value="mail"
              onClick={() => setActiveTab("mail")}
              className="rounded-lg px-8 py-2 font-bold data-[state=active]:bg-[#2D3F33] data-[state=active]:text-[#FDE68A] data-[state=active]:shadow-sm transition-all"
            >
              Mail Records
            </TabsTrigger>
            <TabsTrigger
              value="visits"
              onClick={() => setActiveTab("visits")}
              className="rounded-lg px-8 py-2 font-bold data-[state=active]:bg-[#2D3F33] data-[state=active]:text-[#FDE68A] data-[state=active]:shadow-sm transition-all"
            >
              Visit Records
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4">
            <form onSubmit={activeTab === "mail" ? handleMailSearch : handleVisitSearch} className="relative w-64 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={activeTab === "mail" ? "Search client or sender..." : "Search visitor or purpose..."}
                value={activeTab === "mail" ? mailSearch : visitSearch}
                onChange={(e) => activeTab === "mail" ? setMailSearch(e.target.value) : setVisitSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </form>

            {activeTab === "mail" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-xl font-bold border-border bg-background hover:bg-muted text-foreground"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {mailStatusFilter === "all" ? "All Status" : mailStatusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background rounded-xl border-border">
                  <DropdownMenuItem onClick={() => setMailStatusFilter("all")}>All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMailStatusFilter("Pending Action")}>Pending Action</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMailStatusFilter("Forwarded")}>Forwarded</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMailStatusFilter("Collected")}>Collected</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <TabsContent
          value="mail"
          className="animate-in fade-in slide-in-from-bottom-2 duration-400"
        >
          <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                      Sender
                    </th>
                    <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                      Received
                    </th>
                    <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                      Client's Decision
                    </th>
                    <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                      User Collected
                    </th>
                    <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider text-right pr-6">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mailRecords.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="p-12 text-center text-muted-foreground italic"
                      >
                        No mail records found
                      </td>
                    </tr>
                  ) : (
                    mailRecords.map((record) => (
                      <tr
                        key={record._id}
                        className="hover:bg-primary/[0.04] transition-all duration-200 group border-b border-border/50"
                      >
                        <td className="px-6 py-5">
                          <span className="text-[10px] text-primary font-bold opacity-70">
                            #{record._id.slice(-6).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-foreground">
                          {record.client}
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-muted-foreground">
                          {record.sender}
                        </td>
                        <td className="px-6 py-5">
                          <Badge
                            variant="secondary"
                            className="bg-primary/5 text-primary border-primary/20 font-bold text-[10px] uppercase"
                          >
                            {record.type}
                          </Badge>
                        </td>
                        <td className="px-6 py-5 text-xs font-bold text-muted-foreground">
                          {format(new Date(record.createdAt), "MMM d, yyyy")}
                        </td>
                        <td className="px-6 py-5">
                          {record.clientDecision === "Forward Requested" ? (
                            <Badge className="bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1.5 w-fit font-extrabold text-[10px] uppercase px-2 py-1 rounded-full shadow-sm hover:bg-blue-50 transition-none">
                              <Send className="w-3 h-3" />
                              Requested Forward
                            </Badge>
                          ) : (
                            <div className="flex items-center gap-1.5 text-muted-foreground/50">
                              <Clock className="w-3 h-3" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">No Request</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          {record.userCollectedStatus === "Collected" ? (
                            <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-1.5 w-fit font-extrabold text-[10px] uppercase px-2 py-1 rounded-full shadow-sm hover:bg-emerald-50 transition-none">
                              <CheckCircle2 className="w-3 h-3" />
                              Collected
                            </Badge>
                          ) : (
                            <div className="flex items-center gap-1.5 text-muted-foreground/50">
                              <Clock className="w-3 h-3" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Pending</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <MailStatusBadge status={record.status} />
                        </td>
                        <td className="px-6 py-5 text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                            {record.documentUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary"
                                onClick={() => window.open(getUploadedFileUrl(record.documentUrl), "_blank")}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-background rounded-xl border-border"
                              >

                              <DropdownMenuItem
                                className="font-bold text-xs"
                                onClick={() =>
                                  handleUpdate(record._id, "Forwarded")
                                }
                              >
                                Mark as Forwarded
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="font-bold text-xs text-emerald-600"
                                onClick={() =>
                                  handleUpdate(record._id, "Collected")
                                }
                              >
                                Mark as Collected
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination for Mail */}
            {mailPagination.total > 0 && (
              <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between bg-muted/20 gap-4">
                <p className="text-xs text-muted-foreground font-medium">
                  Showing {(mailPagination.page - 1) * 10 + 1} to{" "}
                  {Math.min(mailPagination.page * 10, mailPagination.total)} of{" "}
                  {mailPagination.total} results
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={mailPagination.page === 1}
                    onClick={() => fetchMails(mailPagination.page - 1)}
                    className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: mailPagination.pages }, (_, i) => i + 1)
                      .filter(p => {
                        const curr = mailPagination.page;
                        return p === 1 || p === mailPagination.pages || (p >= curr - 1 && p <= curr + 1);
                      })
                      .map((p, i, arr) => (
                        <React.Fragment key={p}>
                          {i > 0 && arr[i - 1] !== p - 1 && <span className="text-muted-foreground px-1">...</span>}
                          <Button
                            variant={mailPagination.page === p ? "default" : "outline"}
                            size="sm"
                            onClick={() => fetchMails(p)}
                            className={`h-8 w-8 p-0 rounded-lg text-xs font-bold transition-all ${
                              mailPagination.page === p ? "bg-[#2D3F33] text-[#FDE68A] hover:bg-[#2D3F33]/90" : "hover:bg-primary/10"
                            }`}
                          >
                            {p}
                          </Button>
                        </React.Fragment>
                      ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={mailPagination.page === mailPagination.pages}
                    onClick={() => fetchMails(mailPagination.page + 1)}
                    className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent
          value="visits"
          className="animate-in fade-in slide-in-from-bottom-2 duration-400"
        >
          <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                      Visitor
                    </th>
                    <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                      Visitor Email
                    </th>
                    <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                      Visitor Number
                    </th>
                    <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                      Purpose
                    </th>
                    <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visitRecords.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-12 text-center text-muted-foreground italic"
                      >
                        No visit records found
                      </td>
                    </tr>
                  ) : (
                    visitRecords.map((record) => (
                      <tr
                        key={record._id}
                        className="hover:bg-primary/[0.04] transition-all duration-200 group border-b border-border/50"
                      >
                        <td className="px-6 py-5">
                          <span className="text-[10px] text-primary font-bold opacity-70">
                            #{record._id.slice(-6).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-foreground">
                          {record.client}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 text-gray-400" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{record.visitor}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[11px] font-bold text-gray-900">
                          {record.visitorEmail || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-[11px] text-gray-500 font-medium">
                          {record.visitorNumber || "N/A"}
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-foreground">
                          {record.purpose}
                        </td>
                        <td className="px-6 py-5 text-xs font-bold text-muted-foreground">
                          {format(new Date(record.date), "MMM d, h:mm a")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination for Visits */}
            {visitPagination.total > 0 && (
              <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between bg-muted/20 gap-4">
                <p className="text-xs text-muted-foreground font-medium">
                  Showing {(visitPagination.page - 1) * 10 + 1} to{" "}
                  {Math.min(visitPagination.page * 10, visitPagination.total)} of{" "}
                  {visitPagination.total} results
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={visitPagination.page === 1}
                    onClick={() => fetchVisits(visitPagination.page - 1)}
                    className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: visitPagination.pages }, (_, i) => i + 1)
                      .filter(p => {
                        const curr = visitPagination.page;
                        return p === 1 || p === visitPagination.pages || (p >= curr - 1 && p <= curr + 1);
                      })
                      .map((p, i, arr) => (
                        <React.Fragment key={p}>
                          {i > 0 && arr[i - 1] !== p - 1 && <span className="text-muted-foreground px-1">...</span>}
                          <Button
                            variant={visitPagination.page === p ? "default" : "outline"}
                            size="sm"
                            onClick={() => fetchVisits(p)}
                            className={`h-8 w-8 p-0 rounded-lg text-xs font-bold transition-all ${
                              visitPagination.page === p ? "bg-[#2D3F33] text-[#FDE68A] hover:bg-[#2D3F33]/90" : "hover:bg-primary/10"
                            }`}
                          >
                            {p}
                          </Button>
                        </React.Fragment>
                      ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={visitPagination.page === visitPagination.pages}
                    onClick={() => fetchVisits(visitPagination.page + 1)}
                    className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <LogMailModal
        isOpen={isLogMailModalOpen}
        onClose={() => setIsLogMailModalOpen(false)}
        onSuccess={fetchMails}
      />
      <LogVisitModal
        isOpen={isLogVisitModalOpen}
        onClose={() => setIsLogVisitModalOpen(false)}
        onSuccess={fetchVisits}
      />
    </div>
  );
};

function MailStatusBadge({ status }: { status: string }) {
  const styles =
    {
      "Pending Action": "bg-rose-50 text-rose-600 border-rose-100",
      Forwarded: "bg-amber-50 text-amber-600 border-amber-100",
      Collected: "bg-emerald-50 text-emerald-600 border-emerald-100",
    }[status] || "bg-slate-50 text-slate-600 border-slate-100";

  return (
    <Badge
      className={`${styles} border font-extrabold text-[10px] uppercase px-2 py-1 rounded-full shadow-sm hover:bg-opacity-100`}
    >
      {status}
    </Badge>
  );
}

function VisitStatusBadge({ status }: { status: string }) {
  const styles =
    {
      Pending: "bg-amber-50 text-amber-600 border-amber-100",
      Forwarded: "bg-blue-50 text-blue-600 border-blue-100",
      Completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    }[status] || "bg-slate-50 text-slate-600 border-slate-100";

  return (
    <Badge
      className={`${styles} border font-extrabold text-[10px] uppercase px-2 py-1 rounded-full shadow-sm hover:bg-opacity-100`}
    >
      {status}
    </Badge>
  );
}

export default MailAndVisits;
