import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Send,
  Headphones,
  MessageSquare,
  Bot,
} from 'lucide-react';
import partnerTicketService, { PartnerTicketData } from '@/services/spacePortal/partnerTicket.service';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function TicketsAndTasksPage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [tickets, setTickets] = useState<PartnerTicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const [takenOverTickets, setTakenOverTickets] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeTicket = tickets.find(t => t._id === activeTicketId);

  // Partner has "taken over" if they clicked Take Over OR if there's already a partner message
  const hasTakenOver = activeTicketId ? (
    takenOverTickets.has(activeTicketId) ||
    (activeTicket?.messages?.some(m => m.sender === 'partner') ?? false)
  ) : false;

  const fetchTickets = async () => {
    try {
      const response = await partnerTicketService.getPartnerTickets(1, 100);
      if (response.success && response.data) {
        setTickets(response.data.tickets);
        if (!activeTicketId && response.data.tickets.length > 0) {
          setActiveTicketId(response.data.tickets[0]._id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Socket Listener
  useEffect(() => {
    if (!socket) return;

    if (activeTicketId) {
      socket.emit('join_ticket', activeTicketId);
    }

    const handleNewMessage = (data: { ticketId: string, message: any }) => {
      setTickets(prev => prev.map(t => {
        if (t._id === data.ticketId) {
          const exists = t.messages.some(m =>
            new Date(m.createdAt).getTime() === new Date(data.message.createdAt).getTime() &&
            m.message === data.message.message
          );
          if (exists) return t;

          return {
            ...t,
            messages: [...t.messages, data.message],
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      }));

      if (activeTicketId === data.ticketId) {
        scrollToBottom();
      }
    };

    const handleTicketUpdated = (data: { ticketId: string, ticket: any }) => {
      setTickets(prev => prev.map(t => t._id === data.ticketId ? data.ticket : t));
    };

     const handlePartnerNewTicket = (data: { ticket: any }) => {
      // Check if this ticket belongs to us (it will appear in our list if it does)
      toast.success(`New query from a client: "${data.ticket?.subject || 'New Query'}"`, {
        icon: '🔔',
        duration: 5000,
      });
      // Refresh the ticket list to show the new ticket
      fetchTickets();
    };

    socket.on('new_message', handleNewMessage);
    socket.on('ticket_updated', handleTicketUpdated);
    socket.on('partner_new_ticket', handlePartnerNewTicket);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('ticket_updated', handleTicketUpdated);
      socket.off('partner_new_ticket', handlePartnerNewTicket);
    };
  }, [socket, activeTicketId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeTicketId, activeTicket?.messages]);

  const handleTakeOver = async () => {
    if (!activeTicketId) return;
    const takeoverMessage = "Hi! I'm the space partner. I'll help you with your query.";
    try {
      await partnerTicketService.replyToTicket(activeTicketId, takeoverMessage);
      setTakenOverTickets(prev => new Set(prev).add(activeTicketId));
      toast.success("You have taken over the chat");
    } catch (error) {
      console.error("Failed to take over", error);
      toast.error("Failed to take over chat");
    }
  };

  const handleSendMessage = async () => {
    if (!activeTicketId || !messageInput.trim()) return;
    try {
      await partnerTicketService.replyToTicket(activeTicketId, messageInput);
      setMessageInput('');
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error("Failed to send message");
    }
  };

  const handleResolve = async () => {
    if (!activeTicketId) return;
    try {
      await partnerTicketService.closeTicket(activeTicketId);
      toast.success("Query closed");
    } catch (error) {
      console.error("Failed to close", error);
      toast.error("Failed to close query");
    }
  };

  // Filter tickets based on search
  const filteredTickets = tickets.filter(t =>
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.ticketNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.bookingId?.spaceSnapshot?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-50 text-red-600 border-red-100';
      case 'in_progress': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'escalated': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'resolved': return 'bg-green-50 text-green-600 border-green-100';
      case 'closed': return 'bg-gray-50 text-gray-500 border-gray-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  // Sort tickets: Open/In Progress first, then by date
  filteredTickets.sort((a, b) => {
    const score = (status: string) => {
      if (status === 'open') return 3;
      if (status === 'in_progress') return 2;
      if (status === 'escalated') return 2;
      return 0;
    };
    const scoreDiff = score(b.status) - score(a.status);
    if (scoreDiff !== 0) return scoreDiff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (loading) {
    return <div className="p-12 text-center text-gray-500">Loading queries...</div>;
  }

  return (
    <div className="min-h-screen bg-transparent p-8 space-y-8 font-sans animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Client <span className="text-teal-500 italic">Queries</span>
        </h1>
        <p className="text-gray-500 mt-2 text-lg font-light">
          Manage queries from users who booked your listings
        </p>
      </div>

      {tickets.length === 0 && !loading ? (
        <div className="bg-white rounded-[24px] border border-gray-100 p-16 text-center shadow-sm">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">No queries yet</h3>
          <p className="text-gray-400">When users raise queries about your listings, they'll appear here.</p>
        </div>
      ) : (
        /* Chat Interface */
        <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
          {/* Chat List */}
          <div className="w-full lg:w-1/3 bg-white rounded-[24px] border border-gray-100 flex flex-col shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search queries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all text-sm"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No matching queries</div>
              ) : (
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket._id}
                    onClick={() => setActiveTicketId(ticket._id)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${activeTicketId === ticket._id
                      ? 'bg-teal-50 border border-teal-100 shadow-sm'
                      : 'hover:bg-gray-50 border border-transparent'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold bg-gray-100 text-gray-600`}>
                          {ticket.user?.fullName?.substring(0, 2).toUpperCase() || 'US'}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className={`text-sm font-bold truncate ${activeTicketId === ticket._id ? 'text-teal-900' : 'text-gray-900'}`}>
                            {ticket.user?.fullName || 'Unknown User'}
                          </h4>
                          <p className={`text-xs truncate max-w-[140px] mt-0.5 ${activeTicketId === ticket._id ? 'text-teal-600' : 'text-gray-500'}`}>
                            {ticket.subject}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium ml-2 shrink-0">
                        {format(new Date(ticket.updatedAt || ticket.createdAt), 'h:mm a')}
                      </span>
                    </div>
                    {/* Booking badge */}
                    {ticket.bookingId?.spaceSnapshot?.name && (
                      <p className="text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full w-fit mt-1 ml-[52px] font-medium truncate max-w-[180px]">
                        {ticket.bookingId.spaceSnapshot.name}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-2 pl-[52px]">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="w-full lg:w-2/3 bg-white rounded-[24px] border border-gray-100 flex flex-col shadow-sm overflow-hidden">
            {activeTicket ? (
              <>
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold bg-teal-100 text-teal-700`}>
                      {activeTicket.user?.fullName?.substring(0, 2).toUpperCase() || 'US'}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{activeTicket.user?.fullName || 'Unknown User'}</h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {activeTicket.ticketNumber}
                        {activeTicket.bookingId?.spaceSnapshot?.name && (
                          <span className="text-teal-600"> • {activeTicket.bookingId.spaceSnapshot.name}</span>
                        )}
                      </p>
                    </div>
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
                      Click <strong>Take Over</strong> to start chatting with this user.
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
        </div>
      )}
    </div>
  );
}
