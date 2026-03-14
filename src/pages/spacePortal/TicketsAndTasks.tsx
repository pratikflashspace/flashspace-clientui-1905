import { useState, useEffect } from "react";
import { Plus, Clock, CheckCircle, AlertCircle, Eye, Headphones, MessageSquare, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import partnerTicketService, {
  PartnerTicketData,
} from "@/services/spacePortal/partnerTicket.service";
import { fetchPartnerActiveRequests } from "@/services/spacePortal/spacePartner.service";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const getPriorityBadge = (priority: string) => {
  const p = (priority || "low").toLowerCase();
  switch (p) {
    case "high":
    case "urgent":
      return <Badge variant="destructive">High</Badge>;
    case "medium":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">
          Medium
        </Badge>
      );
    case "low":
    default:
      return (
        <Badge
          variant="secondary"
          className="bg-slate-100 text-slate-600 border-slate-200"
        >
          Low
        </Badge>
      );
  }
};

const getStatusBadge = (status: string) => {
  const s = (status || "open").toLowerCase();
  switch (s) {
    case "open":
    case "pending":
      return (
        <Badge variant="outline" className="text-red-600 border-red-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "in_progress":
    case "escalated":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
          <Clock className="w-3 h-3 mr-1" />
          In Progress
        </Badge>
      );
    case "resolved":
    case "completed":
    case "closed":
    case "accepted":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function TicketsAndTasks() {
  const [tickets, setTickets] = useState<PartnerTicketData[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load Tickets
      const ticketRes = await partnerTicketService.getPartnerTickets(1, 100);
      if (ticketRes.success && ticketRes.data) {
        setTickets(ticketRes.data.tickets);
      }

      // Load Tasks (Active Requests)
      const taskRes: any = await fetchPartnerActiveRequests();
      if (taskRes?.success) {
        setTasks(taskRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast({
        title: "Error",
        description: "Failed to load tickets and tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl">
            Tickets & <span className="text-primary italic">Tasks</span>
          </h1>
          <p className="text-[#164e4e]/70 dark:text-gray-400 mt-1">
            Manage your support tickets and daily team tasks
          </p>
        </div>
        <Button
          onClick={() =>
            toast({
              title: "Coming Soon",
              description: "This feature will be available shortly.",
            })
          }
          className="bg-[#2D3F33] hover:bg-[#2D3F33]/90 text-[#FDE68A] font-bold rounded-xl shadow-lg transition-all active:scale-95 px-6"
        >
          <Plus className="w-5 h-5 mr-1" />
          Create Task
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-4 mb-10">
        <div className="bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <p className="text-2xl font-bold text-[#164e4e] dark:text-white">
            {tickets.filter((t) => (t.status || "").toLowerCase() === "open").length}
          </p>
          <p className="text-sm text-[#164e4e]/70 dark:text-gray-400">Open Tickets</p>
        </div>
        <div className="bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <p className="text-2xl font-bold text-[#164e4e] dark:text-white">
            {tickets.filter((t) => ["in_progress", "escalated"].includes((t.status || "").toLowerCase())).length}
          </p>
          <p className="text-sm text-[#164e4e]/70 dark:text-gray-400">In Progress</p>
        </div>
        <div className="bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <p className="text-2xl font-bold text-[#164e4e] dark:text-white">{tasks.length}</p>
          <p className="text-sm text-[#164e4e]/70 dark:text-gray-400">Pending Tasks</p>
        </div>
        <div className="bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <p className="text-2xl font-bold text-[#164e4e] dark:text-white">4.2 hrs</p>
          <p className="text-sm text-[#164e4e]/70 dark:text-gray-400">Avg Response</p>
        </div>
      </div>

      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList className="bg-[#2D3F33]/10 dark:bg-white/5 p-1 rounded-xl w-fit">
          <TabsTrigger
            value="tickets"
            className="rounded-lg px-6 py-2 font-bold data-[state=active]:bg-[#2D3F33] data-[state=active]:text-[#FDE68A] data-[state=active]:shadow-sm transition-all"
          >
            Client Tickets
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="rounded-lg px-6 py-2 font-bold data-[state=active]:bg-[#2D3F33] data-[state=active]:text-[#FDE68A] data-[state=active]:shadow-sm transition-all"
          >
            Team Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="tickets"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#fafafa] dark:bg-white/5 border-b border-[#2D3F33]/5 dark:border-white/10">
                  <tr>
                    <th className="text-left p-5 text-xs font-bold text-[#164e4e]/60 dark:text-gray-400 uppercase tracking-widest">
                      Ticket
                    </th>
                    <th className="text-left p-5 text-xs font-bold text-[#164e4e]/60 dark:text-gray-400 uppercase tracking-widest">
                      Client
                    </th>
                    <th className="text-left p-5 text-xs font-bold text-[#164e4e]/60 dark:text-gray-400 uppercase tracking-widest">
                      Priority
                    </th>
                    <th className="text-left p-5 text-xs font-bold text-[#164e4e]/60 dark:text-gray-400 uppercase tracking-widest">
                      Assignee
                    </th>
                    <th className="text-left p-5 text-xs font-bold text-[#164e4e]/60 dark:text-gray-400 uppercase tracking-widest">
                      Date
                    </th>
                    <th className="text-left p-5 text-xs font-bold text-[#164e4e]/60 dark:text-gray-400 uppercase tracking-widest">
                      Status
                    </th>
                    <th className="text-right p-5 text-xs font-bold text-[#164e4e]/60 dark:text-gray-400 uppercase tracking-widest">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D3F33]/5 dark:divide-white/10">
                  {tickets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-12 text-center text-[#164e4e]/50 dark:text-gray-500 italic"
                      >
                        No support tickets found
                      </td>
                    </tr>
                  ) : (
                    tickets.map((ticket) => (
                      <tr
                        key={ticket._id}
                        className="hover:bg-[#fcfcfc] dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="p-5">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-[#164e4e]/50 dark:text-gray-500 font-bold mb-1">
                              #{ticket.ticketNumber}
                            </span>
                            <p className="text-sm font-bold text-[#164e4e] dark:text-white truncate max-w-[200px]">
                              {ticket.subject}
                            </p>
                          </div>
                        </td>
                        <td className="p-5 text-sm text-[#164e4e]/80 dark:text-gray-300 font-medium">
                          {ticket.user?.fullName}
                        </td>
                        <td className="p-5">
                          {getPriorityBadge(ticket.priority)}
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8 border border-[#2D3F33]/10">
                              <AvatarFallback className="text-[10px] bg-[#2D3F33]/10 text-[#2D3F33] dark:text-[#FDE68A] font-bold uppercase">
                                {ticket.user?.fullName
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("") || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-[#164e4e]/70 dark:text-gray-400 font-semibold">
                              Partner
                            </span>
                          </div>
                        </td>
                        <td className="p-5 text-sm text-[#164e4e]/70 dark:text-gray-400 font-medium">
                          {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                        </td>
                        <td className="p-5">{getStatusBadge(ticket.status)}</td>
                        <td className="p-5 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl text-[#2D3F33] dark:text-[#FDE68A] hover:bg-[#2D3F33]/5 dark:hover:bg-white/5"
                          >
                            <Eye className="w-5 h-5" />
                          </Button>
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
          value="tasks"
          className="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {tasks.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl">
                <p className="text-[#164e4e]/50 dark:text-gray-500 italic">
                  No pending tasks or requests
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl p-6 flex flex-col gap-5 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#2D3F33]/5 dark:bg-white/5 flex items-center justify-center text-[#2D3F33] dark:text-[#FDE68A] group-hover:bg-[#2D3F33] group-hover:text-[#FDE68A] transition-colors">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#164e4e] dark:text-white leading-tight mb-1">
                          {task.space || "Space Booking Request"}
                        </h4>
                        <div className="flex items-center gap-2">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[8px] font-bold text-slate-600">
                            {task.user?.avatar || "U"}
                          </div>
                          <p className="text-xs text-[#164e4e]/60 dark:text-gray-400 font-bold">
                            Requested by: {task.user?.name || "Client"}
                          </p>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(task.status)}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#2D3F33]/5 dark:border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#164e4e]/50 dark:text-gray-500 font-bold uppercase tracking-widest mb-1">
                        Due Date
                      </span>
                      <p className="text-xs font-bold text-[#164e4e] dark:text-white">
                        {task.date || "TBD"}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() =>
                        toast({
                          title: "Coming Soon",
                          description:
                            "Reviewing requests for this space category will be enabled in the next update.",
                        })
                      }
                      className="bg-[#2D3F33] hover:bg-[#2D3F33]/90 text-[#FDE68A] rounded-xl h-8 text-xs font-bold px-4"
                    >
                      Review Request
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
