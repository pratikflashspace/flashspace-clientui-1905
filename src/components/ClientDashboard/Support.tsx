import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  MessageCircle,
  Phone,
  Mail,
  Send,
  ChevronDown,
  ChevronUp,
  FileText,
  Building2,
  CreditCard,
  HelpCircle,
  ExternalLink,
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
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"help" | "contact">("help");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phoneNumber || (user as any)?.phone || "",
    subject: "",
    message: "",
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    try {
      const response = await userDashboardService.createTicket({
        subject: `Contact Request: ${contactFormData.subject || "General Inquiry"}`,
        category: "leads" as any,
        description: `Name: ${contactFormData.name}\nEmail: ${contactFormData.email}\nPhone: ${contactFormData.phone}\n\nMessage:\n${contactFormData.message}`,
      });

      if (response.success && response.data) {
        toast.success("Message sent! Redirecting to chat...");
        const ticketId = (response.data as any)._id || (response.data as any).id;
        
        setTimeout(() => {
          setContactFormData(prev => ({ ...prev, subject: "", message: "" }));
          if (ticketId) {
            navigate("/dashboard/support", { state: { ticketId } });
          } else {
            setActiveTab("tickets");
          }
        }, 1500);
      } else {
        throw new Error(response.message || "Failed to send message");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send message. Please try again.");
    } finally {
      setContactSubmitting(false);
    }
  };

  const viewTicketDetails = (ticketId: string) => {
    navigate("/dashboard/support", { state: { ticketId } });
  };

  const getStatusConfig = (ticket: any) => {
    const status = ticket.status as TicketStatus;
    const isPendingFeedback = (status === 'resolved' || status === 'closed') && !ticket.feedbackSubmittedAt;

    if (isPendingFeedback) {
      return { bg: "bg-yellow-100 ring-1 ring-yellow-400/20", text: "text-yellow-700", label: "Feedback Required" };
    }

    switch (status) {
      case "open":
        return { bg: "bg-blue-100", text: "text-blue-700", label: "Open" };
      case "in_progress":
        return { bg: "bg-indigo-100", text: "text-indigo-700", label: "In Progress" };
      case "waiting_customer":
        return { bg: "bg-orange-100", text: "text-orange-700", label: "Action Required" };
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
            className="inline-flex items-center justify-center gap-2 bg-[#35503F] text-[#FEF8C3] px-8 py-3.5 rounded-2xl font-bold hover:bg-black transition-all shadow-md active:scale-95 text-center"
          >
            <Send className="w-4 h-4" />
            Send Message
          </button>
        </div>

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

        <div className="flex p-1.5 rounded-2xl shadow-sm bg-gray-100/80 w-fit max-w-full overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth">
          {[
            { id: "help", label: "Help Center", icon: HelpCircle },
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
                        <div key={faqIdx} className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => setExpandedFaq(isExpanded ? null : faqId)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-medium text-gray-900">{faq.q}</span>
                            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                          </button>
                          {isExpanded && <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">{faq.a}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {activeTab === "contact" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Send us a Message</h2>
            {contactSubmitted ? <div className="text-center py-12">Message Sent!</div> : (
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input type="text" required value={contactFormData.name} onChange={(e) => setContactFormData({...contactFormData, name: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#35503F]" placeholder="Name" />
                  <input type="email" required value={contactFormData.email} onChange={(e) => setContactFormData({...contactFormData, email: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#35503F]" placeholder="Email" />
                </div>
                <input type="tel" value={contactFormData.phone} onChange={(e) => setContactFormData({...contactFormData, phone: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#35503F]" placeholder="Phone" />
                <input type="text" required value={contactFormData.subject} onChange={(e) => setContactFormData({...contactFormData, subject: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#35503F]" placeholder="Subject" />
                <textarea required rows={5} value={contactFormData.message} onChange={(e) => setContactFormData({...contactFormData, message: e.target.value})} className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#35503F]" placeholder="Message" />
                <button type="submit" className="w-full py-3 bg-[#35503F] text-[#FEF8C3] rounded-xl font-semibold hover:bg-black transition-all">Send Message</button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}