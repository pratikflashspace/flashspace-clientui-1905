import { useState, useEffect } from "react";
import { Plus, Clock, CheckCircle, AlertCircle, Eye, User } from "lucide-react";
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
      {/* Header section with same color as workspace */}
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

      {/* Stats Section with matching border-radius and shadows */}
      <div className="grid gap-5 sm:grid-cols-4 mb-10">
        <div className="bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <p className="text-2xl font-bold text-[#164e4e] dark:text-white">
            {
              tickets.filter((t) => (t.status || "").toLowerCase() === "open")
                .length
            }
          </p>
          <p className="text-sm text-[#164e4e]/70 dark:text-gray-400">
            Open Tickets
          </p>
        </div>
        <div className="bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <p className="text-2xl font-bold text-[#164e4e] dark:text-white">
            {
              tickets.filter((t) =>
                ["in_progress", "escalated"].includes(
                  (t.status || "").toLowerCase(),
                ),
              ).length
            }
          </p>
          <p className="text-sm text-[#164e4e]/70 dark:text-gray-400">
            In Progress
          </p>
        </div>
        <div className="bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <p className="text-2xl font-bold text-[#164e4e] dark:text-white">
            {tasks.length}
          </p>
          <p className="text-sm text-[#164e4e]/70 dark:text-gray-400">
            Pending Tasks
          </p>
        </div>
        <div className="bg-white dark:bg-[#0f0f0f] border border-[#2D3F33]/10 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <p className="text-2xl font-bold text-[#164e4e] dark:text-white">
            4.2 hrs
          </p>
          <p className="text-sm text-[#164e4e]/70 dark:text-gray-400">
            Avg Response
          </p>
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
                  <div className="flex gap-3">
                    {activeTicket.status !== 'resolved' && activeTicket.status !== 'closed' && !hasTakenOver && (
                      <button
                        onClick={handleTakeOver}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        🎯 Tap In
                      </button>
                    )}
                    {activeTicket.status !== 'resolved' && activeTicket.status !== 'closed' && (
                      <button
                        onClick={handleResolve}
                        className="px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors shadow-sm"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/50">
                  {activeTicket.messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                      <p>No messages yet.</p>
                    </div>
                  )}

                  {activeTicket.messages.map((msg, idx) => {
                    const isPartner = msg.sender === 'partner';
                    const isAdmin = msg.sender === 'admin';
                    const isSupport = msg.sender === 'support';
                    const isAffiliate = msg.sender === 'affiliate';
                    const isRightSide = isPartner || isAdmin || isSupport;

                    // ── Role badge config ────────────────────────────
                    const ROLE_BADGE: Record<string, { bg: string; text: string; label: string; dot: string; bubbleDot?: string }> = {
                      user: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Client', dot: 'bg-blue-400' },
                      partner: { bg: 'bg-white/25', text: 'text-white', label: 'You (Partner)', dot: 'bg-white' },
                      admin: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Admin', dot: 'bg-indigo-400' },
                      affiliate: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Affiliate', dot: 'bg-amber-400' },
                      support: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'AI Support', dot: 'bg-purple-400' },
                    };

                    const badge = ROLE_BADGE[msg.sender] || ROLE_BADGE.user;

                    // Email/identifier shown under the badge
                    const getIdentifier = (): string => {
                      if (msg.sender === 'user') return activeTicket.user?.email || activeTicket.user?.fullName || '';
                      if (msg.sender === 'partner') return user?.email || 'partner@flashspace.io';
                      if (msg.sender === 'admin') return 'admin@flashspace.io';
                      if (msg.sender === 'affiliate') return 'affiliate@flashspace.io';
                      return 'AI · flashspace.io';
                    };

                    // Bubble background
                    const getBubble = (): string => {
                      if (isPartner) return 'bg-teal-600 text-white rounded-tr-none';
                      if (isAdmin) return 'bg-indigo-50 text-gray-800 border border-indigo-100 rounded-tr-none';
                      if (isSupport) return 'bg-purple-50 text-gray-800 border border-purple-100 rounded-tr-none';
                      if (isAffiliate) return 'bg-amber-50 text-gray-800 border border-amber-200 rounded-tl-none';
                      return 'bg-white text-gray-800 border border-gray-200 rounded-tl-none';
                    };

                    // System messages (join announcements)
                    const isSystem = msg.message.startsWith('[') && msg.message.endsWith(']');
                    if (isSystem) {
                      return (
                        <div key={idx} className="flex justify-center">
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                            {msg.message.replace(/\[|\]/g, '')}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div key={idx} className={`flex ${isRightSide ? 'justify-end' : 'justify-start'}`}>
                        <div className="max-w-[80%] space-y-1.5">
                          <div className={`p-4 rounded-2xl shadow-sm ${getBubble()}`}>
                            {/* Role badge row */}
                            <div className={`flex items-center gap-1.5 mb-2 ${isRightSide ? 'flex-row-reverse' : ''}`}>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${badge.bg} ${badge.text}`}>
                                <span className={`w-1 h-1 rounded-full shrink-0 ${badge.dot}`} />
                                {badge.label}
                              </span>
                              <span className={`text-[10px] font-medium truncate max-w-[130px] ${isPartner ? 'text-white/60' : 'text-gray-400'}`}>
                                {getIdentifier()}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                          </div>
                          <span className={`text-[10px] text-gray-400 block px-1 ${isRightSide ? 'text-right' : ''}`}>
                            {format(new Date(msg.createdAt), 'h:mm a')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                {(activeTicket.status !== 'resolved' && activeTicket.status !== 'closed') ? (
                  hasTakenOver ? (
                    <div className="p-6 bg-white border-t border-gray-100">
                      <div className="flex items-center gap-4 bg-gray-50 p-2 pr-2 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-teal-100 focus-within:border-teal-200 transition-all">
                        <input
                          type="text"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type your reply..."
                          className="flex-1 bg-transparent border-none focus:outline-none px-4 text-sm text-gray-700 placeholder:text-gray-400"
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!messageInput.trim()}
                          className="p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors shadow-md shadow-teal-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-amber-50 border-t border-amber-100 text-center text-amber-700 text-sm font-medium">
                      Click <strong>Tap In</strong> to start chatting with this user.
                    </div>
                  )
                ) : (
                  <div className="p-6 bg-gray-50 border-t border-gray-100 text-center text-gray-500 text-sm">
                    This query is closed.
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Headphones className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-xl font-bold text-gray-600">Select a query</h3>
                <p>Choose a query from the left to start chatting</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
