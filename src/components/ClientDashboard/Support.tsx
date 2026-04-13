import React, { useState, useEffect } from "react";
import { SupportTicket, TicketPriority, TicketStatus } from "@/types/services";
import userDashboardService from "@/services/userDashboard.service";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import toast from "react-hot-toast";
import {
  MessageCircle,
  Phone,
  Mail,
  Send,
  ChevronDown,
  ChevronUp,
  Headphones,
  FileText,
  Building2,
  CreditCard,
  HelpCircle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Clock,
} from "lucide-react";

const faqs = [
  {
    category: "Virtual Office",
    questions: [
      {
        q: "How do I get my virtual office address proof?",
        a: "Once your KYC is verified, you can download the address proof from My Bookings > View Details > Documents section. The address proof is valid for GST registration and bank account opening.",
      },
      {
        q: "Can I use this address for GST registration?",
        a: "Yes, our virtual office addresses are fully compliant for GST registration. We provide NOC and utility bills required for the GST application process.",
      },
      {
        q: "How is mail handled at my virtual office?",
        a: "All mail and courier delivered to your virtual office address is scanned and notified via email within 24 hours. Physical mail can be collected or forwarded to your preferred address.",
      },
    ],
  },
  {
    category: "Billing & Payments",
    questions: [
      {
        q: "How can I download my invoices?",
        a: "Go to Billing > Invoices tab where you can view and download all your invoices in PDF format. GST invoices are automatically generated.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major payment methods including UPI, credit/debit cards, net banking, and wallet payments through our secure Razorpay integration.",
      },
    ],
  },
  {
    category: "KYC & Documents",
    questions: [
      {
        q: "What documents are required for KYC?",
        a: "Required documents include: PAN Card, Aadhaar Card, GST Certificate (if applicable), and Address Proof. For companies, additional documents like COI and MOA may be required.",
      },
      {
        q: "How long does KYC verification take?",
        a: "KYC verification typically takes 24-48 hours after all documents are submitted. You will receive email updates on the verification status.",
      },
    ],
  },
];

const contactOptions = [
  {
    icon: Phone,
    title: "Call Us",
    description: "Mon-Sat, 9 AM - 7 PM",
    value: "+91 8100 888 777",
    action: "tel:+918100888777",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "24/7 Support",
    value: "support@flashspace.co",
    action: "mailto:support@flashspace.co",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Instant Response",
    value: "Start Chat",
    action: "#chat",
    color: "bg-purple-100 text-purple-600",
  },
];

export default function Support() {
  const { user } = useAuth();
  const { socket } = useSocket(); // Use socket context
  const [activeTab, setActiveTab] = useState<"help" | "tickets" | "contact">("help");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: user?.fullName || "",
    email: user?.email || "",
    phone: (user as any)?.phone || "",
    subject: "",
    message: "",
  });

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await userDashboardService.getTickets();
      if (response.success && response.data) {
        // Handle various response interfaces for robustness
        let ticketsData: SupportTicket[] = [];

        if (Array.isArray(response.data)) {
          ticketsData = response.data;
        } else if (response.data && typeof response.data === 'object') {
          // @ts-ignore - Backend returns paginated object sometimes
          if (Array.isArray(response.data.tickets)) {
            // @ts-ignore
            ticketsData = response.data.tickets;
          } else {
            // Fallback or specific type handling
            ticketsData = [];
          }
        }
        setTickets(ticketsData);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch tickets", err);
      alert("Failed to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "tickets") {
      fetchTickets();
    }
  }, [activeTab]);

  // Socket listener for new messages
  useEffect(() => {
    if (!socket || !selectedTicket) return;

    // Join the ticket room
    socket.emit('join_ticket', selectedTicket._id);

    const handleNewMessage = (data: { ticketId: string, message: any }) => {
      if (data.ticketId === selectedTicket._id) {
        setSelectedTicket((prev) => {
          if (!prev) return null;
          // Check if message already exists to verify duplication
          const exists = prev.messages.some(m =>
            new Date(m.createdAt).getTime() === new Date(data.message.createdAt).getTime() &&
            m.message === data.message.message
          );

          if (exists) return prev;

          return {
            ...prev,
            messages: [...prev.messages, data.message]
          };
        });
        // Also refresh list to update last message preview if we had one
        fetchTickets();
      }
    };

    const handleTicketUpdated = (data: { ticketId: string, ticket: any }) => {
      if (data.ticketId === selectedTicket._id) {
        setSelectedTicket(data.ticket);
        fetchTickets();
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('ticket_updated', handleTicketUpdated);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('ticket_updated', handleTicketUpdated);
    };
  }, [socket, selectedTicket?._id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await userDashboardService.createTicket({
        subject: formData.subject,
        category: formData.category,
        description: formData.description,
      });

      if (response.success && response.data) {
        setSubmitted(true);
        fetchTickets();
        setTimeout(() => {
          setSubmitted(false);
          setShowNewTicket(false);
          setFormData({ subject: "", category: "", description: "" });
        }, 3000);
      } else {
        alert(response.message || "Failed to create ticket");
      }
    } catch (err: unknown) {
      console.error("Failed to create ticket", err);
      alert("Failed to create ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    try {
      // Use FormSubmit.co via AJAX
      const response = await fetch("https://formsubmit.co/ajax/komalmishra2008@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: contactFormData.name,
          email: contactFormData.email,
          phone: contactFormData.phone,
          subject: contactFormData.subject,
          message: contactFormData.message,
          _subject: `Support Request: ${contactFormData.subject}`,
          _template: "table"
        })
      });

      if (response.ok) {
        setContactSubmitted(true);
        setTimeout(() => {
          setContactSubmitted(false);
          setContactFormData(prev => ({ ...prev, subject: "", message: "" }));
        }, 3000);
      } else {
        alert("Failed to send message via FormSubmit. Please try again later.");
      }
    } catch (err: unknown) {
      console.error("Failed to send contact message via FormSubmit", err);
      alert("Failed to send message. Please check your internet connection and try again.");
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;
    setSubmitting(true);
    try {
      const response = await userDashboardService.replyToTicket(selectedTicket._id, replyMessage);
      if (response.success && response.data) {
        setSelectedTicket(response.data);
        setReplyMessage("");
        fetchTickets();
        toast.success("Reply sent!");
      } else {
        alert(response.message || "Failed to send reply");
      }
    } catch (err: unknown) {
      console.error("Failed to reply", err);
      alert("Failed to send reply. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const viewTicketDetails = async (ticketId: string) => {
    try {
      const response = await userDashboardService.getTicketById(ticketId);
      if (response.success && response.data) {
        setSelectedTicket(response.data);
      }
    } catch (err: unknown) {
      console.error("Failed to load ticket", err);
      alert("Failed to load ticket details");
    }
  };

  const getStatusConfig = (status: TicketStatus) => {
    switch (status) {
      case "open":
        return { bg: "bg-blue-100", text: "text-blue-700", label: "Open" };
      case "in_progress":
        return { bg: "bg-yellow-100", text: "text-yellow-700", label: "In Progress" };
      case "waiting_customer":
        return { bg: "bg-orange-100", text: "text-orange-700", label: "Waiting for Customer" };
      case "resolved":
        return { bg: "bg-green-100", text: "text-green-700", label: "Resolved" };
      case "closed":
        return { bg: "bg-gray-100", text: "text-gray-600", label: "Closed" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600", label: status };
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#35503F] tracking-tight">
              Help & <span className="text-primary italic">Support</span>
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-medium">
              Get help with your virtual office and coworking services
            </p>
          </div>
          <button
            onClick={() => setActiveTab("contact")}
            className="inline-flex items-center justify-center gap-2 bg-[#35503F] text-[#FEF8C3] px-8 py-3.5 rounded-2xl font-bold hover:bg-[#35503F]/90 transition-all shadow-md active:scale-95 text-center"
          >
            <Send className="w-4 h-4" />
            Send Message
          </button>
        </div>

        {/* Quick Contact Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactOptions.map((option, idx) => (
            <a
              key={idx}
              href={option.action}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#35503F]/5 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
              <div className={`w-14 h-14 rounded-2xl ${option.color} flex items-center justify-center mb-6`}>
                <option.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#35503F] mb-1">{option.title}</h3>
              <p className="text-sm text-gray-500 font-medium mb-4">{option.description}</p>
              <div className="flex items-center gap-2 text-[#35503F] font-extrabold group-hover:gap-3 transition-all">
                {option.value}
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex p-1.5 rounded-2xl shadow-sm bg-gray-100/80 w-fit max-w-full overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth">
          {[
            { id: "help", label: "Help Center", icon: HelpCircle },
            { id: "tickets", label: "My Tickets", icon: FileText },
            { id: "contact", label: "Contact Form", icon: Send },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Help Center Tab */}
        {activeTab === "help" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#35503F]" /> Frequently Asked Questions
              </h2>

              {faqs.map((category, catIdx) => (
                <div key={catIdx} className="mb-6 last:mb-0">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    {category.category === "Virtual Office" && <Building2 className="w-4 h-4" />}
                    {category.category === "Billing & Payments" && <CreditCard className="w-4 h-4" />}
                    {category.category === "KYC & Documents" && <FileText className="w-4 h-4" />}
                    {category.category}
                  </h3>
                  <div className="space-y-2">
                    {category.questions.map((faq, faqIdx) => {
                      const faqId = `${catIdx}-${faqIdx}`;
                      const isExpanded = expandedFaq === faqId;
                      return (
                        <div
                          key={faqIdx}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => setExpandedFaq(isExpanded ? null : faqId)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-medium text-gray-900">{faq.q}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                          </button>
                          {isExpanded && (
                            <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === "tickets" && (
          <div className="space-y-4">
            {/* Ticket Detail View */}
            {selectedTicket ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Tickets
                </button>

                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-sm font-mono text-gray-500">{selectedTicket.ticketNumber}</p>
                    <h2 className="text-xl font-semibold text-gray-900 mt-1">{selectedTicket.subject}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusConfig(selectedTicket.status).bg} ${getStatusConfig(selectedTicket.status).text}`}>
                        {getStatusConfig(selectedTicket.status).label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {selectedTicket.messages?.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg ${msg.sender === "user" ? "bg-[#35503F]/10 ml-8" : "bg-gray-50 mr-8"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {msg.sender === "user" ? "You" : "Support Team"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(msg.createdAt).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="text-gray-700">{msg.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply Form */}
                {selectedTicket.status !== "closed" && selectedTicket.status !== "resolved" ? (
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex gap-3">
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your reply..."
                        rows={3}
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F]"
                      />
                      <button
                        onClick={handleReply}
                        disabled={submitting || !replyMessage.trim()}
                        className="px-6 py-2.5 bg-[#35503F] text-[#FEF8C3] rounded-lg font-medium hover:bg-[#35503F]/90 transition-colors disabled:opacity-50 self-end"
                      >
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-gray-100 pt-4">
                    <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                      <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <p className="text-green-700 font-medium">
                        This ticket has been {selectedTicket.status === "resolved" ? "resolved" : "closed"}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        {selectedTicket.status === "resolved"
                          ? "Our support team has resolved your query. Thank you for contacting us!"
                          : "This ticket is now closed. Please create a new ticket if you need further assistance."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Support Tickets</h2>
                  <button
                    onClick={() => setShowNewTicket(true)}
                    className="px-4 py-2 bg-[#35503F] text-[#FEF8C3] rounded-lg text-sm font-medium hover:bg-[#35503F]/90 transition-colors"
                  >
                    + New Ticket
                  </button>
                </div>

                {/* New Ticket Form */}
                {showNewTicket && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Create New Support Ticket</h3>
                    {submitted ? (
                      <div className="text-center py-8">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <p className="text-gray-900 font-medium">Ticket Submitted Successfully!</p>
                        <p className="text-sm text-gray-500 mt-1">We will respond within 24 hours</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Subject</label>
                            <input
                              type="text"
                              required
                              value={formData.subject}
                              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F]"
                              placeholder="Brief description of your issue"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Category</label>
                            <select
                              required
                              value={formData.category}
                              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F]"
                            >
                              <option value="">Select Category</option>
                              <option value="virtual_office">Virtual Office</option>
                              <option value="coworking">Coworking</option>
                              <option value="billing">Billing & Payments</option>
                              <option value="kyc">KYC & Documents</option>
                              <option value="technical">Technical Issue</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Description</label>
                          <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F]"
                            placeholder="Please provide detailed information about your issue..."
                          />
                          {formData.description.length > 0 && formData.description.length < 10 && (
                            <p className="text-red-500 text-xs mt-1">Description must be at least 10 characters.</p>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={submitting || formData.description.length < 10}
                            className="px-6 py-2.5 bg-[#35503F] text-[#FEF8C3] rounded-lg font-medium hover:bg-[#35503F]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Ticket"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowNewTicket(false)}
                            className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* Ticket List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  {loading ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-8 h-8 text-[#35503F] animate-spin mx-auto mb-3" />
                      <p className="text-gray-500">Loading tickets...</p>
                    </div>
                  ) : tickets.length === 0 ? (
                    <div className="text-center py-12">
                      <Headphones className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No support tickets yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {tickets.map((ticket) => {
                        const statusConfig = getStatusConfig(ticket.status);
                        return (
                          <div key={ticket._id} className="p-5 hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-mono text-gray-500">{ticket.ticketNumber}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                    {statusConfig.label}
                                  </span>

                                </div>
                                <p className="font-medium text-gray-900">{ticket.subject}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Created: {new Date(ticket.createdAt).toLocaleDateString("en-IN")}
                                </p>
                              </div>
                              <button
                                onClick={() => viewTicketDetails(ticket._id)}
                                className="px-4 py-2 text-sm font-medium text-[#35503F] hover:text-[#35503F] hover:bg-[#35503F]/10 rounded-lg transition-colors"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Contact Form Tab */}
        {activeTab === "contact" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Send us a Message</h2>
            <p className="text-gray-500 text-sm mb-6">For general inquiries and feedback</p>

            {contactSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-500">Thank you for contacting us. We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactFormData.name}
                      onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F]"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactFormData.email}
                      onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F]"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={contactFormData.phone}
                    onChange={(e) => setContactFormData({ ...contactFormData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F]"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={contactFormData.subject}
                    onChange={(e) => setContactFormData({ ...contactFormData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F]"
                    placeholder="What is this regarding?"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={contactFormData.message}
                    onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#35503F]"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="w-full py-3 bg-[#35503F] text-[#FEF8C3] rounded-xl font-semibold hover:bg-[#35503F]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {contactSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {contactSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}