import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { 
  Send, 
  X, 
  Phone, 
  Mail, 
  Calendar, 
  ChevronDown,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowUpRight,
  Lock,
  Search,
  Star,
  Paperclip,
  FileText,
  Loader2
} from "lucide-react";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";
import { getUploadedFileUrl } from "@/utils/fileUrl";

export const TicketViewModal = ({ 
  open, 
  onOpenChange, 
  ticket, 
  handleAssignTicket,
  handleResolveTicket,
  handleCloseTicket,
  handleReply,
  staffMembers,
  typingUser
}: any) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState(ticket?.assignee?._id || ticket?.assignee?.id || ticket?.assignee || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedAssignee(ticket?.assignee?._id || ticket?.assignee?.id || ticket?.assignee || "");
  }, [ticket]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ticket?.messages, open]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (isDropdownOpen && !event.target.closest('.assignment-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  if (!open) return null;

  const isReadOnly = ticket?.status?.toLowerCase() === "resolved";

  const submitReply = async () => {
    if (isReadOnly || (!replyMessage.trim() && selectedFiles.length === 0) || !ticket?._id || sending) return;
    
    setSending(true);
    try {
      const formData = new FormData();
      formData.append('message', replyMessage.trim());
      selectedFiles.forEach(file => {
        formData.append('attachments', file);
      });

      await handleReply(ticket._id, formData);
      setReplyMessage("");
      setSelectedFiles([]);
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyMessage(e.target.value);
    
    if (!socket || !ticket?._id) return;

    // Emit typing event
    socket.emit('typing', { ticketId: ticket._id, user: user?.fullName || 'Admin' });

    // Clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { ticketId: ticket._id });
    }, 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (selectedFiles.length + files.length > 5) {
        alert('Maximum 5 files allowed');
        return;
      }
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open": return "#3b82f6";
      case "in_progress": return "#f59e0b";
      case "resolved": return "#10b981";

      default: return "#6b7280";
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px'
    }} onClick={() => onOpenChange(false)}>
      <div style={{
        backgroundColor: '#fff',
        width: '100%',
        maxWidth: '1100px',
        height: '90vh',
        borderRadius: '40px',
        display: 'flex',
        overflow: 'hidden',
        boxShadow: '0 30px 60px -12px rgba(0,0,0,0.4)',
        color: '#111827',
        border: '1px solid rgba(255,255,255,0.2)'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Detail Sidebar */}
        <div style={{
          width: '340px',
          borderRight: '1px solid #f1f5f9',
          backgroundColor: '#fafafa',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '40px 28px' }}>
            {/* Customer Info Section */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '20px', 
                  backgroundColor: '#35503f', 
                  color: '#fff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '20px',
                  fontWeight: 900,
                  boxShadow: '0 8px 16px rgba(53, 80, 63, 0.2)',
                  overflow: 'hidden'
                }}>
                  {ticket?.user?.profilePicture ? (
                    <img src={getUploadedFileUrl(ticket.user.profilePicture)} alt={ticket.user.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    ticket?.user?.fullName?.substring(0, 1).toUpperCase()
                  )}
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>{ticket?.user?.fullName}</h2>
                  <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Client</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#475569', fontWeight: 500 }}>
                  <Mail size={14} style={{ opacity: 0.5 }} /> {ticket?.user?.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#475569', fontWeight: 500 }}>
                  <Phone size={14} style={{ opacity: 0.5 }} /> {ticket?.user?.phoneNumber || (ticket?.user as any)?.phone || "No phone linked"}
                </div>
              </div>
            </div>

            {/* Assignment Section */}
            <div style={{ marginBottom: '40px', opacity: isReadOnly ? 0.6 : 1, pointerEvents: isReadOnly ? 'none' : 'auto', position: 'relative' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={14} /> Assign Ticket
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Custom Styled Dropdown */}
                <div className="assignment-dropdown" style={{ position: 'relative', width: '100%' }}>
                  <div 
                    onClick={() => !isReadOnly && setIsDropdownOpen(!isDropdownOpen)}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      borderRadius: '16px', 
                      border: '1px solid #e2e8f0', 
                      backgroundColor: isReadOnly ? '#f8fafc' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: isReadOnly ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isDropdownOpen ? '0 0 0 3px rgba(53, 80, 63, 0.05)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {selectedAssignee ? (
                        <>
                          <div style={{ width: '24px', height: '24px', borderRadius: '8px', backgroundColor: '#35503f', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {staffMembers.find((s: any) => (s._id || s.id) === selectedAssignee)?.fullName?.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                            {staffMembers.find((s: any) => (s._id || s.id) === selectedAssignee)?.fullName}
                          </span>
                        </>
                      ) : (
                        <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>Select Department Official...</span>
                      )}
                    </div>
                    <ChevronDown size={14} style={{ color: '#94a3b8', transition: 'transform 0.2s ease', transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div style={{ 
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: 0,
                      right: 0,
                      backgroundColor: '#fff',
                      borderRadius: '24px',
                      border: '1px solid #f1f5f9',
                      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                      zIndex: 100,
                      maxHeight: '320px',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden'
                    }}>
                      {/* Search Bar */}
                      <div style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#fafafa' }}>
                        <div style={{ position: 'relative' }}>
                          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                          <input 
                            type="text"
                            placeholder="Find official..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            style={{ 
                              width: '100%',
                              padding: '8px 12px 8px 34px',
                              borderRadius: '12px',
                              border: '1px solid #e2e8f0',
                              fontSize: '13px',
                              fontWeight: 500,
                              outline: 'none',
                              transition: 'all 0.2s ease'
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {staffMembers?.filter((s: any) => 
                          s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.role?.toLowerCase().includes(searchTerm.toLowerCase())
                        ).length === 0 && (
                          <div style={{ padding: '24px 12px', textAlign: 'center', color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>
                            No matches found for "{searchTerm}"
                          </div>
                        )}
                        {staffMembers?.filter((s: any) => 
                          s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.role?.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((s: any) => {
                          const roleColors: any = {
                            super_admin: { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
                            admin: { bg: '#fdf2f8', text: '#9d174d', border: '#fbcfe8' },
                            partner: { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa' },
                            affiliate: { bg: '#ecfeff', text: '#0891b2', border: '#a5f3fc' },
                            sales: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
                            support: { bg: '#fefce8', text: '#854d0e', border: '#fef08a' }
                          };
                          const colors = roleColors[s.role] || { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' };
                          
                          const staffId = s._id || s.id;
                          return (
                            <div 
                              key={staffId}
                              onClick={() => {
                                setSelectedAssignee(staffId);
                                setIsDropdownOpen(false);
                                setSearchTerm(""); // Reset search on select
                                handleAssignTicket(ticket._id, staffId);
                              }}
                              style={{ 
                                padding: '10px 12px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                backgroundColor: selectedAssignee === staffId ? '#f8fafc' : 'transparent',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = selectedAssignee === staffId ? '#f8fafc' : 'transparent')}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#35503f', color: '#fff', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', overflow: 'hidden' }}>
                                  {s.profilePicture ? (
                                    <img src={getUploadedFileUrl(s.profilePicture)} alt={s.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  ) : (
                                    s.fullName?.charAt(0).toUpperCase()
                                  )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{s.fullName}</span>
                                  <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 500 }}>{s.email}</span>
                                </div>
                              </div>
                              <span style={{ 
                                fontSize: '9px', 
                                fontWeight: 900, 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.05em',
                                backgroundColor: colors.bg,
                                color: colors.text,
                                border: `1px solid ${colors.border}`,
                                padding: '2px 8px',
                                borderRadius: '6px'
                              }}>
                                {s.role?.replace('_', ' ')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Linked Booking */}
            {ticket?.bookingId && (
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '16px' }}>
                  Linked Booking
                </h3>
                <div style={{ 
                  backgroundColor: '#fff', 
                  padding: '16px', 
                  borderRadius: '24px', 
                  border: '1px solid #f1f5f9'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ fontWeight: 900, fontSize: '14px', color: '#0f172a' }}>
                      #{typeof ticket.bookingId === 'string' ? ticket.bookingId.slice(-8).toUpperCase() : (ticket.bookingId as any).bookingNumber || ticket.bookingId._id?.slice(-8).toUpperCase()}
                    </div>
                    <ArrowUpRight size={14} color="#35503f" style={{ cursor: 'pointer' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                    {((ticket.bookingId as any).type || "WORKSPACE").replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              </div>
            )}

            {/* Customer Feedback */}
            {ticket?.rating && (
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '16px' }}>
                  Customer Feedback
                </h3>
                <div style={{ 
                  padding: '16px', 
                  borderRadius: '24px', 
                  border: '1px solid #fef3c7',
                  backgroundColor: '#fffbeb'
                }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < ticket.rating ? "#f59e0b" : "transparent"} 
                        color="#f59e0b" 
                      />
                    ))}
                  </div>
                  <p style={{ fontSize: '13px', color: '#92400e', fontWeight: 600, fontStyle: 'italic', margin: 0, lineHeight: 1.4 }}>
                    "{ticket.ratingRemarks || "No remarks provided"}"
                  </p>
                  <div style={{ marginTop: '10px', fontSize: '10px', color: '#b45309', fontWeight: 700 }}>
                    SUBMITTED {ticket.feedbackSubmittedAt ? format(new Date(ticket.feedbackSubmittedAt), "MMM d, yyyy") : "RECENTLY"}
                  </div>
                </div>
              </div>
            )}

            {isReadOnly && !ticket?.rating && (
              <div style={{ 
                marginTop: 'auto', 
                padding: '20px', 
                backgroundColor: '#fffbeb', 
                borderRadius: '24px', 
                border: '1px solid #fef3c7',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Lock size={18} color="#d97706" />
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#92400e' }}>Locked</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#b45309', fontWeight: 500 }}>This ticket is resolved.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Interface */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
          {/* Top Bar */}
          <div style={{ 
            padding: '24px 40px', 
            borderBottom: '1px solid #f1f5f9', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'linear-gradient(to right, #fff, #fafafa)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.02em' }}>{ticket?.subject}</h2>
                <div style={{ 
                  backgroundColor: getStatusColor(ticket?.status),
                  color: '#fff',
                  fontSize: '9px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  letterSpacing: '0.05em'
                }}>
                  {ticket?.status}
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginTop: '4px' }}>
                Ticket ID: {ticket?.ticketNumber} • Last updated {format(new Date(ticket?.updatedAt || ticket?.createdAt), "MMM d, h:mm a")}
              </p>
            </div>
            <button 
              onClick={() => onOpenChange(false)}
              style={{ 
                padding: '10px', 
                borderRadius: '14px', 
                border: 'none', 
                background: '#f1f5f9', 
                color: '#64748b', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#e2e8f0')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#f1f5f9')}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            style={{ 
              flex: 1, 
              padding: '40px', 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '30px',
              backgroundColor: '#f8fafc',
              scrollBehavior: 'smooth'
            }}
          >
            {/* Start point */}
            <div style={{ alignSelf: 'center', textAlign: 'center' }}>
               <div style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '10px' }}>
                 Initial Query
               </div>
               <div style={{ 
                 maxWidth: '500px', 
                 backgroundColor: '#fff', 
                 padding: '24px', 
                 borderRadius: '24px', 
                 border: '1px solid #e2e8f0',
                 boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                 textAlign: 'left'
               }}>
                 <p style={{ margin: 0, fontSize: '14px', color: '#1e293b', lineHeight: 1.6, fontWeight: 500, whiteSpace: 'pre-wrap' }}>{ticket?.description}</p>
                 <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                     <div style={{ width: '24px', height: '24px', borderRadius: '8px', backgroundColor: '#35503f', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', overflow: 'hidden' }}>
                       {ticket?.user?.profilePicture ? (
                         <img src={getUploadedFileUrl(ticket.user.profilePicture)} alt={ticket.user.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                       ) : (
                         ticket?.user?.fullName?.charAt(0)
                       )}
                     </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>{ticket?.user?.fullName}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>• {format(new Date(ticket?.createdAt), "MMM d, h:mm a")}</span>
                 </div>
               </div>
            </div>

            {/* Conversation Flow */}
            {ticket?.messages?.map((msg: any, i: number) => {
              const isAdmin = ["admin", "support"].includes(msg.sender);
              const isPartner = msg.sender === "partner";
              const isAffiliate = msg.sender === "affiliate";
              const isStaff = isAdmin || isPartner;

              // System messages (e.g. "[Admin joined the conversation]")
              const isSystem = msg.message?.startsWith("[") && msg.message?.endsWith("]");
              if (isSystem) {
                return (
                  <div key={i} style={{ alignSelf: 'center', textAlign: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#94a3b8', backgroundColor: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', fontWeight: 600 }}>
                      {msg.message.replace(/\[|\]/g, "")}
                    </span>
                  </div>
                );
              }

              const getSenderLabel = () => {
                switch (msg.sender) {
                  case "admin": return "ADMIN";
                  case "support": return "SUPPORT";
                  case "partner": return "PARTNER";
                  case "affiliate": return "AFFILIATE";
                  default: return "CUSTOMER";
                }
              };

              const getBubbleStyle = () => {
                if (isAdmin) return { backgroundColor: '#35503f', color: '#fff', border: 'none' };
                if (isPartner) return { backgroundColor: '#fff7ed', color: '#1e293b', border: '1px solid #fed7aa' };
                if (isAffiliate) return { backgroundColor: '#ecfeff', color: '#1e293b', border: '1px solid #a5f3fc' };
                return { backgroundColor: '#fff', color: '#1e293b', border: '1px solid #e2e8f0' };
              };

              const getLabelColor = () => {
                if (isAdmin) return '#94a3b8';
                if (isPartner) return '#ea580c';
                if (isAffiliate) return '#0891b2';
                return '#94a3b8';
              };

              const bubbleStyle = getBubbleStyle();

              return (
                <div key={i} style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignSelf: isStaff ? 'flex-end' : 'flex-start', 
                  maxWidth: '75%',
                  alignItems: isStaff ? 'flex-end' : 'flex-start'
                }}>
                   <div style={{ 
                     backgroundColor: bubbleStyle.backgroundColor, 
                     color: bubbleStyle.color,
                     padding: '16px 24px', 
                     borderRadius: '26px', 
                     borderBottomRightRadius: isStaff ? '4px' : '26px',
                     borderBottomLeftRadius: !isStaff ? '4px' : '26px',
                     boxShadow: isAdmin ? '0 10px 15px -3px rgba(53, 80, 63, 0.2)' : '0 4px 6px -1px rgba(0,0,0,0.02)',
                     border: bubbleStyle.border,
                     fontSize: '14px',
                     fontWeight: 500,
                     lineHeight: 1.5,
                     whiteSpace: 'pre-wrap'
                   }}>
                    <div>
                      {msg.message}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {msg.attachments.map((url: string, idx: number) => {
                            const isImage = url.match(/\.(jpg|jpeg|png|gif)$/i);
                            return (
                              <a 
                                key={idx} 
                                href={`${import.meta.env.VITE_API_URL || ''}${url}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ display: 'block' }}
                              >
                                {isImage ? (
                                  <img 
                                    src={`${import.meta.env.VITE_API_URL || ''}${url}`} 
                                    alt="attachment" 
                                    style={{ 
                                      width: '100px', 
                                      height: '100px', 
                                      objectFit: 'cover', 
                                      borderRadius: '12px', 
                                      border: '1px solid rgba(255,255,255,0.1)' 
                                    }}
                                  />
                                ) : (
                                  <div style={{ 
                                    display: 'flex', 
                                    itemsCenter: 'center', 
                                    gap: '8px', 
                                    backgroundColor: isAdmin ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', 
                                    padding: '8px 12px', 
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontWeight: 700
                                  }}>
                                    <FileText size={14} /> Attachment {idx + 1}
                                  </div>
                                )}
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                   </div>
                   <div style={{ 
                     fontSize: '10px', 
                     color: getLabelColor(), 
                     fontWeight: 700,
                     marginTop: '6px',
                     display: 'flex',
                     alignItems: 'center',
                     gap: '4px'
                   }}>
                      {getSenderLabel()} • {format(new Date(msg.createdAt), "h:mm a")}
                   </div>
                </div>
              );
            })}

             {typingUser && (
               <div style={{ 
                 alignSelf: 'flex-start', 
                 display: 'flex', 
                 flexDirection: 'column',
                 gap: '4px',
                 marginTop: '8px',
                 animation: 'fadeIn 0.3s ease-out'
               }}>
                 <div style={{ 
                   backgroundColor: '#fff', 
                   padding: '10px 18px', 
                   borderRadius: '18px', 
                   borderTopLeftRadius: '4px',
                   border: '1px solid #e2e8f0',
                   boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                   display: 'flex', 
                   alignItems: 'center', 
                   gap: '10px'
                 }}>
                   <div style={{ display: 'flex', gap: '4px' }}>
                     <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#35503f', animation: 'typing-bounce 1s infinite' }} />
                     <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#35503f', animation: 'typing-bounce 1s infinite 0.2s' }} />
                     <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#35503f', animation: 'typing-bounce 1s infinite 0.4s' }} />
                   </div>
                   <span style={{ fontSize: '10px', fontWeight: 900, color: '#35503f', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{typingUser} is typing...</span>
                 </div>
               </div>
             )}
          </div>

          {/* Action Bar */}
          {!isReadOnly ? (
            <div style={{ padding: '30px 40px', borderTop: '1px solid #f1f5f9', background: '#fff' }}>
              {selectedFiles.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {selectedFiles.map((file, i) => (
                    <div key={i} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      backgroundColor: '#f1f5f9', 
                      padding: '6px 12px', 
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#475569',
                      border: '1px solid #e2e8f0'
                    }}>
                      <span style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                      <X size={12} style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => removeFile(i)} />
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                 <div style={{ flex: 1, position: 'relative' }}>
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     onChange={handleFileSelect} 
                     multiple 
                     style={{ display: 'none' }} 
                     accept="image/*,.pdf"
                   />
                   <button 
                     onClick={() => fileInputRef.current?.click()}
                     style={{ 
                       position: 'absolute',
                       left: '12px',
                       top: '50%',
                       transform: 'translateY(-50%)',
                       background: 'transparent',
                       border: 'none',
                       color: '#94a3b8',
                       cursor: 'pointer',
                       zIndex: 5
                     }}
                   >
                     <Paperclip size={20} />
                   </button>
                   <textarea 
                     style={{ 
                       width: '100%', 
                       minHeight: '60px', 
                       maxHeight: '150px', 
                       padding: '18px 60px 18px 48px', 
                       borderRadius: '24px', 
                       border: '1px solid #e2e8f0', 
                       backgroundColor: '#f8fafc',
                       fontSize: '15px',
                       fontWeight: 500,
                       resize: 'none',
                       outline: 'none',
                       transition: 'border-color 0.2s ease'
                     }}
                     placeholder="Write your response here..."
                     value={replyMessage}
                     onChange={handleInputChange}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter' && !e.shiftKey) {
                         e.preventDefault();
                         submitReply();
                       }
                     }}
                   />
                   <button 
                     onClick={submitReply}
                     disabled={(!replyMessage.trim() && selectedFiles.length === 0) || sending}
                     style={{ 
                       position: 'absolute',
                       right: '10px',
                       top: '50%',
                       transform: 'translateY(-50%)',
                       width: '44px', 
                       height: '44px', 
                       borderRadius: '16px', 
                       backgroundColor: '#35503f', 
                       color: '#fff', 
                       border: 'none', 
                       display: 'flex', 
                       alignItems: 'center', 
                       justifyContent: 'center',
                       cursor: 'pointer',
                       opacity: (replyMessage.trim() || selectedFiles.length > 0) && !sending ? 1 : 0.4,
                       transition: 'all 0.2s ease',
                       boxShadow: (replyMessage.trim() || selectedFiles.length > 0) ? '0 8px 16px rgba(53, 80, 63, 0.2)' : 'none'
                     }}
                   >
                     {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                   </button>
                 </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button 
                    onClick={() => handleResolveTicket(ticket._id)}
                    style={{ 
                      flex: 1, 
                      padding: '12px', 
                      borderRadius: '16px', 
                      backgroundColor: '#10b981', 
                      color: '#fff', 
                      border: 'none', 
                      fontWeight: 900, 
                      fontSize: '11px', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.08em', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                    <CheckCircle2 size={14} /> Mark Resolved
                  </button>

              </div>
            </div>
          ) : (
            <div style={{ 
              padding: '30px 40px', 
              borderTop: '1px solid #f1f5f9', 
              background: '#fafafa',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px', fontWeight: 700 }}>
                This conversation has been concluded and is now read-only.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
