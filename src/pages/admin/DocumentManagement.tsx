import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  FileText,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Building2,
  Briefcase,
  Eye,
  Download,
  ChevronRight,
  Info,
  ChevronDown,
  LayoutGrid,
  List,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { adminService } from "@/services/admin.service";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getUploadedFileUrl } from "@/utils/fileUrl";

interface Document {
  id: string;
  userId?: string;
  ownerName: string;
  ownerEmail: string;
  partnerName?: string;
  businessName?: string;
  docType: string;
  docName: string;
  fileUrl: string;
  status: "pending" | "approved" | "rejected" | string;
  uploadedAt: string;
  category: "User" | "Partner" | "Business";
  ownerProfilePicture?: string;
  originalKycId: string;
}

interface UserGroup {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  personalDocs: Document[];
  partnerDocs: Document[];
  businessDocs: Document[];
}

const DocumentManagement = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [expandedPartnerId, setExpandedPartnerId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDocuments();
    
    // Add 30-second polling to keep data fresh
    const pollInterval = setInterval(() => {
      fetchDocuments();
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [statusFilter]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllDocuments({
        search: searchQuery || undefined,
        status: statusFilter === "all" ? undefined : statusFilter
      });

      if (response.success) {
        setDocuments(response.data as Document[]);
        setCurrentPage(1); // Reset to first page on new search/filter
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const userGroups = useMemo(() => {
    const groups: { [key: string]: UserGroup } = {};
    
    documents.forEach((doc) => {
      const key = doc.userId || doc.ownerEmail;
      if (!groups[key]) {
        groups[key] = {
          id: key,
          name: doc.ownerName,
          email: doc.ownerEmail,
          profilePicture: doc.ownerProfilePicture,
          personalDocs: [],
          partnerDocs: [],
          businessDocs: []
        };
      }
      
      if (!groups[key].profilePicture && doc.ownerProfilePicture) {
        groups[key].profilePicture = doc.ownerProfilePicture;
      }
      
      if (doc.category === "User") groups[key].personalDocs.push(doc);
      else if (doc.category === "Partner") groups[key].partnerDocs.push(doc);
      else if (doc.category === "Business") groups[key].businessDocs.push(doc);
    });

    return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
  }, [documents]);

  // Pagination Logic
  const totalPages = Math.ceil(userGroups.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return userGroups.slice(start, start + itemsPerPage);
  }, [userGroups, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDocuments();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved": return "text-green-600 bg-green-50 border-green-100";
      case "rejected": return "text-red-600 bg-red-50 border-red-100";
      case "pending": return "text-amber-600 bg-amber-50 border-amber-100";
      default: return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  const DocItem = ({ doc }: { doc: Document }) => (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-all group">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-[#35503F]/5 transition-colors">
          <FileText className="w-4 h-4 text-gray-400 group-hover:text-[#35503F]" />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="text-sm font-bold text-gray-700 truncate max-w-[150px] sm:max-w-[200px]"
            title={doc.docType}
          >
            {doc.docType}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className={cn(
          "px-2.5 py-1 rounded-full border text-[10px] font-bold capitalize",
          getStatusColor(doc.status)
        )}>
          {doc.status}
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => window.open(getUploadedFileUrl(doc.fileUrl), "_blank")}
            className="p-1.5 text-gray-400 hover:text-[#35503F] hover:bg-[#35503F]/5 rounded-lg transition-all"
            title="Open"
          >
            <Eye className="w-4 h-4" />
          </button>
          <a 
            href={getUploadedFileUrl(doc.fileUrl)} 
            download 
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-gray-400 hover:text-[#35503F] hover:bg-[#35503F]/5 rounded-lg transition-all"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div>
        <h1 className="text-[30px] font-extrabold text-black tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
          Document <span className="text-[#35503F] italic">Management</span>
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Review and oversight all uploaded documents grouped by user.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <form onSubmit={handleSearch} className="md:col-span-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by owner name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#35503F]/5 focus:border-[#35503F] transition-all font-medium shadow-sm outline-none"
          />
        </form>
        <div className="md:col-span-4 relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#35503F]/5 focus:border-[#35503F] transition-all font-bold text-gray-700 shadow-sm outline-none appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-gray-50 rounded-3xl animate-pulse border border-gray-100" />
          ))
        ) : paginatedUsers.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-20 text-center shadow-sm">
            <div className="p-6 bg-gray-50 rounded-full w-fit mx-auto mb-4 text-gray-300">
              <User className="w-12 h-12" />
            </div>
            <p className="text-gray-500 font-bold text-lg">No users found with uploaded documents.</p>
          </div>
        ) : (
          paginatedUsers.map((group) => (
            <div 
              key={group.id} 
              className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden transition-all hover:border-[#35503F]/20"
            >
              {/* User Header Row */}
              <div 
                onClick={() => setExpandedUserId(expandedUserId === group.id ? null : group.id)}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 rounded-2xl ring-2 ring-background shadow-md group-hover:scale-105 transition-transform shrink-0 border border-border">
                    {group.profilePicture && (
                      <AvatarImage src={getUploadedFileUrl(group.profilePicture)} alt={group.name} className="object-cover" />
                    )}
                    <AvatarFallback className="bg-[#35503F]/10 text-[#35503F] font-bold text-xl">
                      {group.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#35503F]">{group.name}</h3>
                    <p className="text-sm text-gray-400 font-medium">{group.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                  <div className="hidden sm:flex items-center gap-4 mr-4">
                    <div className="flex flex-col items-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Personal</p>
                      <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                        {group.personalDocs.length}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Partner</p>
                      <div className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold">
                        {group.partnerDocs.length}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Business</p>
                      <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold">
                        {group.businessDocs.length}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm",
                      expandedUserId === group.id 
                        ? "bg-[#35503F] text-white" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    <Eye className="w-4 h-4" />
                    {expandedUserId === group.id ? "Hide Docs" : "View Docs"}
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedUserId === group.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-8 pt-2 border-t border-gray-50 grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Personal Documents */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-blue-600 border-b border-blue-50 pb-2">
                          <User className="w-4 h-4" />
                          <h4 className="text-xs font-extrabold uppercase tracking-widest">
                            Personal KYC
                          </h4>
                        </div>
                        {group.personalDocs.length === 0 ? (
                          <p className="text-xs text-gray-400 italic">
                            No personal documents uploaded.
                          </p>
                        ) : (
                          group.personalDocs.map((doc) => (
                            <DocItem key={doc.id} doc={doc} />
                          ))
                        )}
                      </div>

                      {/* Partner Documents */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-purple-600 border-b border-purple-50 pb-2">
                          <Briefcase className="w-4 h-4" />
                          <h4 className="text-xs font-extrabold uppercase tracking-widest">
                            Partner Documents
                          </h4>
                        </div>
                        {group.partnerDocs.length === 0 ? (
                          <p className="text-xs text-gray-400 italic">
                            No partner documents uploaded.
                          </p>
                        ) : (
                          Object.entries(
                            group.partnerDocs.reduce(
                              (acc: { [key: string]: Document[] }, doc) => {
                                const name =
                                  doc.partnerName || 
                                  doc.docName?.split(" - ")[0]?.replace("Partner: ", "") || 
                                  "Unknown Partner";
                                if (!acc[name]) acc[name] = [];
                                acc[name].push(doc);
                                return acc;
                              },
                              {},
                            ),
                          ).map(([partnerName, docs], idx) => {
                            const partnerId = `${group.id}_partner_${idx}`;
                            const isExpanded = expandedPartnerId === partnerId;
                            return (
                              <div key={partnerName} className="space-y-3 mb-2">
                                <button
                                  onClick={() =>
                                    setExpandedPartnerId(
                                      isExpanded ? null : partnerId,
                                    )
                                  }
                                  className="w-full flex items-center justify-between bg-purple-50/50 px-3 py-2.5 rounded-xl border border-purple-100 hover:bg-purple-100/50 transition-all group"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                                      Partner {idx + 1}: {partnerName}
                                    </span>
                                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded text-[9px] font-bold">
                                      {docs.length}
                                    </span>
                                  </div>
                                  <ChevronRight
                                    className={cn(
                                      "w-3.5 h-3.5 text-purple-400 transition-transform",
                                      isExpanded && "rotate-90",
                                    )}
                                  />
                                </button>
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="space-y-2 pl-2 border-l-2 border-purple-50 overflow-hidden"
                                    >
                                      {docs.map((doc) => (
                                        <DocItem key={doc.id} doc={doc} />
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Business Documents */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-amber-600 border-b border-amber-50 pb-2">
                          <Building2 className="w-4 h-4" />
                          <h4 className="text-xs font-extrabold uppercase tracking-widest">
                            Business Info
                          </h4>
                        </div>
                        {group.businessDocs.length === 0 ? (
                          <p className="text-xs text-gray-400 italic">
                            No business documents uploaded.
                          </p>
                        ) : (
                          Object.entries(
                            group.businessDocs.reduce(
                              (acc: { [key: string]: Document[] }, doc) => {
                                const name =
                                  doc.businessName || 
                                  doc.docName?.split(" - ")[0]?.replace("Business: ", "") || 
                                  "Unknown Business";
                                if (!acc[name]) acc[name] = [];
                                acc[name].push(doc);
                                return acc;
                              },
                              {},
                            ),
                          ).map(([bizName, docs], idx) => {
                            const bizId = `${group.id}_biz_${idx}`;
                            const isExpanded = expandedPartnerId === bizId;
                            return (
                              <div key={bizName} className="space-y-3 mb-2">
                                <button
                                  onClick={() =>
                                    setExpandedPartnerId(
                                      isExpanded ? null : bizId,
                                    )
                                  }
                                  className="w-full flex items-center justify-between bg-amber-50/50 px-3 py-2.5 rounded-xl border border-amber-100 hover:bg-amber-100/50 transition-all group"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                                      Entity {idx + 1}: {bizName}
                                    </span>
                                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded text-[9px] font-bold">
                                      {docs.length}
                                    </span>
                                  </div>
                                  <ChevronRight
                                    className={cn(
                                      "w-3.5 h-3.5 text-amber-400 transition-transform",
                                      isExpanded && "rotate-90",
                                    )}
                                  />
                                </button>
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="space-y-2 pl-2 border-l-2 border-amber-50 overflow-hidden"
                                    >
                                      {docs.map((doc) => (
                                        <DocItem key={doc.id} doc={doc} />
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
          <p className="text-sm font-bold text-gray-400">
            Page <span className="text-[#35503F]">{currentPage}</span> of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-3 bg-gray-50 border border-gray-100 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-all active:scale-95"
            >
              <ChevronRight className="w-5 h-5 rotate-180 text-[#35503F]" />
            </button>
            <div className="flex gap-1">
               {Array.from({ length: totalPages }).map((_, i) => (
                 <button
                   key={i}
                   onClick={() => setCurrentPage(i + 1)}
                   className={cn(
                     "w-11 h-11 rounded-xl font-bold transition-all active:scale-95",
                     currentPage === i + 1 
                       ? "bg-[#35503F] text-white shadow-md" 
                       : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                   )}
                 >
                   {i + 1}
                 </button>
               ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-3 bg-gray-50 border border-gray-100 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-all active:scale-95"
            >
              <ChevronRight className="w-5 h-5 text-[#35503F]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManagement;
