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

const MailAndVisits = () => {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as "mail" | "visits") || "mail";
  const [activeTab, setActiveTab] = useState<"mail" | "visits">(initialTab);
  const [mailRecords, setMailRecords] = useState<MailRecord[]>([]);
  const [visitRecords, setVisitRecords] = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogMailModalOpen, setIsLogMailModalOpen] = useState(false);
  const [isLogVisitModalOpen, setIsLogVisitModalOpen] = useState(false);

  const fetchMails = async () => {
    try {
      const response = await mailService.getAll();
      if (response.success) {
        const sortedData = response.data.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        setMailRecords(sortedData);
      }
    } catch (error) {
      console.error("Failed to fetch mails", error);
      toast.error("Failed to fetch mail records");
    }
  };

  const fetchVisits = async () => {
    try {
      const response = await visitService.getAll();
      if (response.success) {
        const sortedData = response.data.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        setVisitRecords(sortedData);
      }
    } catch (error) {
      console.error("Failed to fetch visits", error);
      toast.error("Failed to fetch visit records");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchMails(), fetchVisits()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    {
      icon: Package,
      value: mailRecords.filter((m) => m.status === "Pending Action").length,
      label: "Pending Mail",
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      icon: History,
      value: visitRecords.filter((v) => v.status === "Pending").length,
      label: "Pending Visits",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: User,
      value: visitRecords.length,
      label: "Total Visits",
      color: "text-primary",
      bg: "bg-primary/5",
    },
    {
      icon: CheckCircle2,
      value: mailRecords.filter((m) => m.status === "Collected").length,
      label: "Collected Total",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
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

          <Button
            variant="outline"
            className="rounded-xl font-bold border-border bg-background hover:bg-muted text-foreground"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
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
                        colSpan={7}
                        className="p-12 text-center text-muted-foreground italic"
                      >
                        No mail records found
                      </td>
                    </tr>
                  ) : (
                    mailRecords.map((record) => (
                      <tr
                        key={record._id}
                        className="hover:bg-muted/30 transition-colors"
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
                          <MailStatusBadge status={record.status} />
                        </td>
                        <td className="px-6 py-5 text-right pr-6">
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
                                  handleUpdate(record._id, "Pending Action")
                                }
                              >
                                Mark as Pending
                              </DropdownMenuItem>
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
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
                      Purpose
                    </th>
                    <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider">
                      Date & Time
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
                        className="hover:bg-muted/30 transition-colors"
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
                          {record.visitor}
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-foreground">
                          {record.purpose}
                        </td>
                        <td className="px-6 py-5 text-xs font-bold text-muted-foreground">
                          {format(new Date(record.date), "MMM d, h:mm a")}
                        </td>
                        <td className="px-6 py-5">
                          <VisitStatusBadge status={record.status} />
                        </td>
                        <td className="px-6 py-5 text-right pr-6">
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
                                  handleVisitUpdate(record._id, "Pending")
                                }
                              >
                                Mark as Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="font-bold text-xs"
                                onClick={() =>
                                  handleVisitUpdate(record._id, "Forwarded")
                                }
                              >
                                Mark as Forwarded
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="font-bold text-xs text-emerald-600"
                                onClick={() =>
                                  handleVisitUpdate(record._id, "Completed")
                                }
                              >
                                Mark as Completed
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
      "Pending Action": "bg-rose-100 text-rose-700",
      Forwarded: "bg-amber-100 text-amber-700",
      Collected: "bg-emerald-100 text-emerald-700",
    }[status] || "bg-slate-100 text-slate-700";

  return (
    <Badge
      className={`${styles} border-none font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full`}
    >
      {status}
    </Badge>
  );
}

function VisitStatusBadge({ status }: { status: string }) {
  const styles =
    {
      Pending: "bg-amber-100 text-amber-700",
      Forwarded: "bg-blue-100 text-blue-700",
      Completed: "bg-emerald-100 text-emerald-700",
    }[status] || "bg-slate-100 text-slate-700";

  return (
    <Badge
      className={`${styles} border-none font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full`}
    >
      {status}
    </Badge>
  );
}

export default MailAndVisits;
