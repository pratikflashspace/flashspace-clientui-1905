import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import {
  AdminPartnerListItem,
  adminService,
} from "@/services/admin.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPageSkeleton } from "@/components/ui/skeleton-loaders";
import { toast } from "@/hooks/use-toast";
import { Eye, Loader2, RotateCcw, Search, CheckCircle, XCircle, Building2, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";



const PartnersManagement = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<AdminPartnerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    limit: 10
  });
  const [selectedPartnerSpaces, setSelectedPartnerSpaces] = useState<{
    name: string;
    spaces: AdminPartnerListItem["spaces"];
  } | null>(null);

  const fetchPartners = async (page = 1, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    if (!isRefresh) setLoading(true);

    try {
      const response = await adminService.getPartners({ 
        page, 
        limit: pagination.limit, 
        search: searchQuery 
      });

      if (response.success && response.data?.partners) {
        setPartners(response.data.partners);
        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.data.pagination.total,
            pages: response.data.pagination.pages
          }));
        }
      } else {
        setPartners([]);
      }
    } catch (error) {
      console.error("Failed to fetch partners", error);
      toast({
        title: "Error",
        description: "Could not load partners. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchPartners(currentPage);
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    void fetchPartners(1);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    void fetchPartners(1, true);
  };

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const searchedPartners = useMemo(() => {
    if (!normalizedSearch) return partners;

    return partners.filter((partner) =>
      [partner.name, partner.email, partner.phone].some((value) =>
        value?.toLowerCase().includes(normalizedSearch),
      ),
    );
  }, [partners, normalizedSearch]);

  if (loading) {
    return (
      <DashboardLayout
        portalName="FlashSpace Admin"
        portalDescription="Complete platform management"
        navItems={ADMIN_NAV_ITEMS}
      >
        <AdminPageSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Partner <span className="text-primary italic">Management</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          View all space partners, their contact details, and allotted spaces.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 mb-8">
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
          <p className="text-2xl font-extrabold text-foreground">{pagination.total}</p>
          <p className="text-sm text-muted-foreground">Total Partners</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name, email, or phone..."
            className="pl-10"
          />
        </form>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={refreshing}
          className="w-full sm:w-auto"
        >
          {refreshing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RotateCcw className="w-4 h-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        All Partners ({pagination.total})
      </p>

      <div className="hidden md:block bg-background border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Partner
                </th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Email
                </th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Phone
                </th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Spaces
                </th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  KYC
                </th>
                <th className="text-right p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {searchedPartners.length > 0 ? (
                searchedPartners.map((partner) => (
                  <tr
                    key={partner.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="h-9 w-9 ring-2 ring-background shadow-sm">
                          {partner.profilePicture && (
                            <AvatarImage src={partner.profilePicture} alt={partner.name} className="object-cover" />
                          )}
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                            {partner.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "PA"}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-semibold text-foreground whitespace-nowrap">{partner.name}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{partner.email}</td>
                    <td className="p-4 text-sm text-muted-foreground">{partner.phone}</td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">
                            {partner.totalSpaces} Spaces
                          </span>
                        </div>
                        {partner.totalSpaces > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:bg-primary/10"
                            onClick={() => setSelectedPartnerSpaces({
                              name: partner.name,
                              spaces: partner.spaces
                            })}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {partner.kycVerified ? (
                        <div className="flex items-center text-green-600 gap-1 text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Verified
                        </div>
                      ) : (
                        <div className="flex items-center text-amber-600 gap-1 text-sm font-medium">
                          <XCircle className="w-4 h-4" />
                          Pending
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        className="text-primary"
                        onClick={() => navigate(`/admin/users?search=${partner.email}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="p-12 text-center text-muted-foreground font-medium"
                  >
                    No partners found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {searchedPartners.length > 0 ? (
          searchedPartners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white border border-border rounded-2xl p-5 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-foreground truncate">
                    {partner.name}
                  </p>
                  <p className="text-sm text-muted-foreground break-all">{partner.email}</p>
                  <p className="text-sm text-muted-foreground">{partner.phone}</p>
                </div>
                {partner.kycVerified ? (
                  <Badge className="bg-green-100 text-green-700">Verified</Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-700">Pending</Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Spaces</p>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{partner.totalSpaces}</p>
                    {partner.totalSpaces > 0 && (
                      <button 
                        onClick={() => setSelectedPartnerSpaces({
                          name: partner.name,
                          spaces: partner.spaces
                        })}
                        className="text-primary"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                variant="outline"
                onClick={() => navigate(`/admin/users?search=${partner.email}`)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Manage User
              </Button>
            </div>
          ))
        ) : (
          <div className="bg-muted/30 border border-dashed border-border rounded-2xl p-10 text-center text-muted-foreground">
            No partners found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(p => Math.max(1, p - 1));
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {[...Array(pagination.pages)].map((_, idx) => {
                const pageNum = idx + 1;
                if (
                  pageNum === 1 || 
                  pageNum === pagination.pages || 
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink 
                        isActive={currentPage === pageNum}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNum);
                        }}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  pageNum === currentPage - 2 || 
                  pageNum === currentPage + 2
                ) {
                  return <PaginationEllipsis key={pageNum} />;
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(p => Math.min(pagination.pages, p + 1));
                  }}
                  className={currentPage === pagination.pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Spaces Detail Modal */}
      <Dialog 
        open={!!selectedPartnerSpaces} 
        onOpenChange={(open) => !open && setSelectedPartnerSpaces(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <span>Spaces for {selectedPartnerSpaces?.name}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {selectedPartnerSpaces?.spaces && selectedPartnerSpaces.spaces.length > 0 ? (
              <div className="grid gap-3">
                {selectedPartnerSpaces.spaces.map((space, index) => (
                  <div 
                    key={index} 
                    className="p-3 border border-border rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-foreground">{space.name}</h4>
                      <Badge variant="secondary" className="text-[10px] py-0">{space.type}</Badge>
                    </div>
                    {space.location && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{space.location}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No spaces allotted.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PartnersManagement;
