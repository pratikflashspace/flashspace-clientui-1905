import React, { useState, useEffect } from "react";
import {
  FileText,
  Check,
  MessageSquare,
  Eye,
  Loader2,
  Search,
  Filter,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowRight,
  Info,
} from "lucide-react";
import { TableSkeleton } from "@/components/ui/skeleton-loaders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { fetchPartnerActiveRequests } from "@/services/spacePortal/spacePartner.service";

export default function ActiveRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true);
      try {
        const response: any = await fetchPartnerActiveRequests();
        if (response?.success) {
          setRequests(response.data);
        } else {
          // Fallback to mock data if API fails but we want to show something during dev
          // setRequests(MOCK_DATA);
          toast.error("Failed to fetch active requests");
        }
      } catch (error) {
        console.error("Error loading active requests:", error);
        toast.error("An error occurred while loading requests");
      } finally {
        setIsLoading(false);
      }
    };
    loadRequests();
  }, []);

  const handleAccept = (id: string) => {
    toast.success("Request accepted successfully");
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const handleInform = (id: string) => {
    toast.info("Message sent to the user");
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.space?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "verified":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle className="w-3 h-3" /> Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Clock className="w-3 h-3" /> Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <XCircle className="w-3 h-3" /> Rejected
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
          >
            Unknown
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="h-10 w-64 bg-gray-200 rounded" />
            <div className="h-4 w-96 bg-gray-100 rounded" />
          </div>
          <div className="h-11 w-64 bg-gray-100 rounded-xl" />
        </div>
        <TableSkeleton rows={8} cols={5} />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl">
            Active <span className="text-primary italic">Requests</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage incoming booking requests and coordinate with prospective
            clients
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by user or space..."
              className="pl-10 h-11 w-full md:w-[300px] rounded-xl border-border bg-background/50 backdrop-blur-sm focus:ring-primary focus:border-primary transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-xl bg-background/50 backdrop-blur-sm"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-background border border-border rounded-3xl overflow-hidden shadow-sm backdrop-blur-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-bold text-foreground py-5 pl-8">
                  Client Name
                </TableHead>
                <TableHead className="font-bold text-foreground py-5">
                  Space Requested
                </TableHead>
                <TableHead className="font-bold text-foreground py-5">
                  Date & Time
                </TableHead>
                <TableHead className="font-bold text-foreground py-5">
                  Compliance
                </TableHead>
                <TableHead className="font-bold text-foreground py-5 text-right pr-8">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {filteredRequests.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-none"
                  >
                    <TableCell colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-6 bg-muted/30 rounded-full">
                          <AlertCircle className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-foreground">
                            No matching requests found
                          </p>
                          <p className="text-muted-foreground">
                            Try adjusting your search or filters
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setSearchQuery("")}
                          className="rounded-xl mt-4"
                        >
                          Clear Search
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ) : (
                  filteredRequests.map((req, index) => (
                    <motion.tr
                      key={req.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-border group hover:bg-muted/10 transition-all cursor-default"
                    >
                      <TableCell className="py-5 pl-8">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-11 w-11 border-2 border-background shadow-sm group-hover:scale-105 transition-transform">
                            <AvatarImage src={req.user?.avatarUrl} />
                            <AvatarFallback className="bg-primary/5 text-primary text-sm font-black uppercase">
                              {req.user?.avatar ||
                                req.user?.name?.substring(0, 2) ||
                                "RQ"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-extrabold text-foreground group-hover:text-primary transition-colors">
                              {req.user?.name}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                              {req.user?.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-5">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 tracking-tight">
                              {req.space}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] font-bold uppercase text-primary/70 bg-primary/5 px-2 py-0.5 rounded-md">
                              {req.type?.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-5 font-bold text-slate-600 text-sm">
                        <div className="flex flex-col">
                          <span>{req.date}</span>
                          <span className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-widest italic">
                            {req.time || "10:30 AM"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-5 text-right pr-8">
                        <div className="flex items-center justify-end gap-3 translate-x-2 group-hover:translate-x-0 transition-transform">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 px-4 rounded-xl font-bold text-muted-foreground hover:bg-muted hover:text-foreground hidden sm:flex gap-2"
                            onClick={() => handleInform(req.id)}
                          >
                            <MessageSquare className="w-4 h-4" /> Inform
                          </Button>
                          <Button
                            className="h-10 px-5 rounded-xl font-bold gap-2 shadow-sm hover:shadow-primary/20 transition-all active:scale-95"
                            onClick={() => handleAccept(req.id)}
                          >
                            <Check className="w-4 h-4" /> Accept
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-xl"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-48 rounded-xl p-2"
                            >
                              <DropdownMenuItem className="rounded-lg font-medium p-2 cursor-pointer">
                                <Eye className="w-4 h-4 mr-2" /> View Full
                                Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-lg font-medium p-2 cursor-pointer">
                                <MessageSquare className="w-4 h-4 mr-2" />{" "}
                                Message Client
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-lg font-medium p-2 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50">
                                <XCircle className="w-4 h-4 mr-2" /> Decline
                                Request
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="p-3 bg-primary/10 rounded-full">
            <Info className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground max-w-lg">
            Accepting a request will initiate the booking process. Make sure the
            client\'s KYC status is verified before finalizing the agreement.
          </p>
        </div>
        <Button variant="link" className="text-primary font-bold gap-2 group">
          Learn about KYC Workflow{" "}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
