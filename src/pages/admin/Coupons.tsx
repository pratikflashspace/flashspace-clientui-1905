import React, { useEffect, useState } from "react";
import {
  Tag,
  Calendar,
  User as UserIcon,
  Plus,
  Trash2,
  Search,
  Filter,
  Shield,
  MoreVertical,
  X,
  CalendarDays,
  Percent,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { AdminPageSkeleton } from "@/components/ui/skeleton-loaders";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  createCoupon,
  getAllCoupons,
  deleteCoupon,
} from "@/services/coupon.service";
import { adminService } from "@/services/admin.service";
import { Coupon, CouponStatus } from "@/types/coupon.types";
import { useAuth } from "@/contexts/AuthContext";

export default function Coupons() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [newCoupon, setNewCoupon] = useState({
    assignedClientId: "",
    discountValue: "" as any,
    expiryDate: "",
    manualCode: "",
  });

  useEffect(() => {
    fetchCoupons();
    fetchClients();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const data = await getAllCoupons();
      setCoupons(data || []);
    } catch (error) {
      console.error("Failed to fetch coupons", error);
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      // Fetching all users to select from without role filtering
      const response = await adminService.getAllUsers({ limit: 1000 });
      if (response.success && response.data) {
        setClients(response.data.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch clients", error);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.role === 'sales' && Number(newCoupon.discountValue) > 15) {
      toast.error("Sales role can only offer up to 15% discount.");
      return;
    }
    setIsSubmitting(true);
    try {
      await createCoupon({
        assignedClientId: newCoupon.assignedClientId,
        discountValue: Number(newCoupon.discountValue),
        expiryDate: newCoupon.expiryDate,
        manualCode: newCoupon.manualCode,
      });
      toast.success("Coupon created successfully");
      setIsCreateModalOpen(false);
      setNewCoupon({
        assignedClientId: "",
        discountValue: "",
        expiryDate: "",
        manualCode: "",
      });
      fetchCoupons();
    } catch (error: any) {
      toast.error(error.message || "Failed to create coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteCoupon(id);
        toast.success("Coupon deleted successfully");
        fetchCoupons();
      } catch (error: any) {
        toast.error("Failed to delete coupon");
      }
    }
  };

  const getStatusBadge = (status: CouponStatus) => {
    switch (status) {
      case CouponStatus.ACTIVE:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Tag className="w-3 h-3" /> Active
          </span>
        );
      case CouponStatus.USED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            <CalendarDays className="w-3 h-3" /> Used
          </span>
        );
      case CouponStatus.EXPIRED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
            <Calendar className="w-3 h-3" /> Expired
          </span>
        );
      case CouponStatus.DISABLED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
            <X className="w-3 h-3" /> Disabled
          </span>
        );
      default:
        return null;
    }
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ? true : coupon.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              Coupons <span className="text-primary italic">& Vouchers</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-medium">
              Manage discount coupons for your clients.
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full md:w-auto h-12 px-6 rounded-2xl shadow-lg shadow-primary/10 flex justify-center items-center gap-2 font-bold"
          >
            <Plus className="w-5 h-5" />
            Create Coupon
          </Button>
        </div>

        {/* Main Content Card */}
        <div className="bg-background rounded-3xl border border-border shadow-xl shadow-muted/20 overflow-visible">
          {/* Toolbar */}
          <div className="p-4 md:p-6 border-b border-border flex flex-col md:flex-row gap-4 justify-between items-center bg-background rounded-t-3xl">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-muted/50 border-none rounded-xl focus:ring-4 focus:ring-primary/5 focus:bg-background transition-all text-sm font-medium text-foreground placeholder:text-muted-foreground h-11 border border-transparent hover:border-border"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <div className="relative flex-1 md:flex-none">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full md:w-40 pl-9 pr-8 py-2.5 bg-muted/50 border-none rounded-xl text-xs font-bold text-foreground focus:ring-4 focus:ring-primary/5 cursor-pointer hover:bg-muted transition-all appearance-none h-11"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="used">Used</option>
                  <option value="expired">Expired</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="min-h-[400px]">
            {loading ? (
              <AdminPageSkeleton />
            ) : filteredCoupons.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                <Tag className="w-12 h-12 text-gray-200 mb-4" />
                <p className="text-gray-500 font-bold">No coupons found.</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or creating a new one.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest">
                          Coupon Code
                        </th>
                        <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest">
                          Discount
                        </th>
                        <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest">
                          Status
                        </th>
                        <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest">
                          Assigned To
                        </th>
                        <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest">
                          Expiry
                        </th>
                        <th className="px-6 py-4 text-xs font-black text-muted-foreground uppercase tracking-widest text-right px-8">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredCoupons.map((coupon) => {
                        const client = clients.find(
                          (c) => (c._id || c.id) === coupon.assignedClientId,
                        );
                        return (
                          <tr
                            key={coupon._id}
                            className="group hover:bg-muted/30 transition-all duration-200"
                          >
                            <td className="px-6 py-4">
                              <div className="font-mono font-black text-xs text-foreground bg-muted px-3 py-1.5 rounded-lg border border-border/50 inline-block shadow-sm">
                                {coupon.code}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-primary/5 rounded-md">
                                  <Percent className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span className="font-black text-gray-900 text-base">
                                  {coupon.discountValue}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {getStatusBadge(coupon.status)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border group-hover:bg-background group-hover:shadow-md transition-all">
                                  <UserIcon className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-foreground leading-none mb-1">
                                    {client ? client.fullName : "Unknown Client"}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground font-medium">
                                    {client ? client.email : "N/A"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <CalendarDays className="w-4 h-4 text-muted-foreground/60" />
                                <span className="text-xs font-bold text-foreground">
                                  {(() => {
                                    try {
                                      const date = new Date(coupon.expiryDate);
                                      return isNaN(date.getTime())
                                        ? "—"
                                        : format(date, "MMM dd, yyyy");
                                    } catch (e) {
                                      return "—";
                                    }
                                  })()}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right px-8">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-white hover:shadow-md transition-all opacity-0 group-hover:opacity-100">
                                    <MoreVertical className="w-5 h-5" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48 bg-white shadow-2xl border-0 rounded-2xl p-2 z-[60]"
                                >
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteCoupon(coupon._id)}
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-xl py-2.5 font-bold cursor-pointer transition-colors"
                                  >
                                    <Trash2 className="mr-3 h-4 w-4" />
                                    Delete Coupon
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile/Tablet Card View */}
                <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/20 rounded-b-3xl">
                  {filteredCoupons.map((coupon) => {
                    const client = clients.find(
                      (c) => (c._id || c.id) === coupon.assignedClientId,
                    );
                    return (
                      <div
                        key={coupon._id}
                        className="bg-background border border-border rounded-3xl p-5 space-y-5 shadow-sm hover:shadow-md transition-all border-l-4 border-l-primary/10"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-mono font-black text-xs text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 inline-block mb-3">
                              {coupon.code}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground shadow-sm">
                                <UserIcon className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-black text-foreground leading-none mb-1">
                                  {client ? client.fullName : "Unknown Client"}
                                </h3>
                                <p className="text-[11px] text-muted-foreground font-bold truncate max-w-[150px]">
                                  {client ? client.email : "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(coupon.status)}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                  <MoreVertical className="w-5 h-5" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-48 bg-background shadow-2xl border-border border rounded-2xl p-2 z-[60]"
                              >
                                <DropdownMenuItem
                                  onClick={() => handleDeleteCoupon(coupon._id)}
                                  className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-xl py-3 font-black cursor-pointer transition-all"
                                >
                                  <Trash2 className="mr-3 h-4 w-4" />
                                  Delete Coupon
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                          <div>
                            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1.5">Discount</p>
                            <div className="flex items-end gap-1">
                              <span className="text-2xl font-black text-foreground leading-none">{coupon.discountValue}</span>
                              <span className="text-sm font-bold text-primary mb-0.5">% OFF</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1.5">Expires On</p>
                            <div className="flex items-center justify-end gap-2 text-foreground font-bold">
                              <Calendar className="w-3.5 h-3.5 text-muted-foreground/60" />
                              <span className="text-xs">
                                {(() => {
                                  try {
                                    const date = new Date(coupon.expiryDate);
                                    return isNaN(date.getTime()) ? "—" : format(date, "MMM dd, yyyy");
                                  } catch (e) {
                                    return "—";
                                  }
                                })()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Create Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-background rounded-t-[32px] sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-300 border border-border max-h-[90vh] flex flex-col">
              <div className="p-6 md:p-8 border-b border-border flex justify-between items-center bg-muted/30 shrink-0">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight">
                    Create New <span className="text-primary italic">Coupon</span>
                  </h2>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">
                    Generate a discount code for a client.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground p-2.5 rounded-full hover:bg-muted transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
 
              <form onSubmit={handleCreateCoupon} className="p-6 md:p-8 space-y-6 overflow-y-auto">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-primary" />
                      Assign to Client
                    </label>
                    <div className="relative">
                      <Popover
                        open={openCombobox}
                        onOpenChange={setOpenCombobox}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCombobox}
                            className="w-full justify-between px-4 py-6 bg-muted/50 border-border rounded-xl hover:bg-background hover:border-primary/50 text-left font-normal text-foreground shadow-none h-auto"
                          >
                            {newCoupon.assignedClientId ? (
                              (() => {
                                const client = clients.find(
                                  (c) =>
                                    (c._id || c.id) ===
                                    newCoupon.assignedClientId,
                                );
                                return client ? (
                                  <span className="flex items-center gap-2">
                                    <span className="font-medium text-foreground">
                                      {client.fullName}
                                    </span>
                                    <span className="text-muted-foreground text-xs">
                                      ({client.email})
                                    </span>
                                  </span>
                                ) : (
                                  "Select client..."
                                );
                               })()
                            ) : (
                              <span className="text-muted-foreground">
                                Select a client...
                              </span>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[--radix-popover-trigger-width] p-0 rounded-xl shadow-xl border-border z-[200] bg-background"
                          align="start"
                        >
                          <Command className="rounded-xl border border-border">
                            <CommandInput
                              placeholder="Search client by name or email..."
                              className="rounded-t-xl"
                            />
                            <CommandList className="max-h-[300px] overflow-y-auto">
                              <CommandEmpty>No client found.</CommandEmpty>
                              <CommandGroup>
                                {clients.map((client) => {
                                  const clientId = client._id || client.id;
                                  return (
                                    <CommandItem
                                      key={clientId}
                                      value={`${client.fullName} ${client.email}`}
                                      onSelect={() => {
                                        setNewCoupon({
                                          ...newCoupon,
                                          assignedClientId: clientId,
                                        });
                                        setOpenCombobox(false);
                                      }}
                                      className="cursor-pointer py-3 aria-selected:bg-muted text-foreground"
                                    >
                                      <UserIcon
                                        className={cn(
                                          "mr-2 h-4 w-4 text-primary/60",
                                        )}
                                      />
                                      <div className="flex flex-col">
                                        <span className="font-medium">
                                          {client.fullName}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          {client.email}
                                        </span>
                                      </div>
                                      <Check
                                        className={cn(
                                          "ml-auto h-4 w-4 text-primary",
                                          newCoupon.assignedClientId ===
                                            clientId
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <p className="text-xs text-muted-foreground ml-1">
                      The coupon will be exclusive to this client.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" />
                      Manual Code (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. SUMMER2026"
                        value={newCoupon.manualCode || ""}
                        onChange={(e) =>
                          setNewCoupon({
                            ...newCoupon,
                            manualCode: e.target.value.toUpperCase(),
                          })
                        }
                        className="w-full px-4 py-3.5 bg-muted/50 border border-border rounded-xl focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground ml-1">
                      Leave blank to auto-generate.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-2">
                      <Percent className="w-4 h-4 text-primary" />
                      Discount (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max={user?.role === 'sales' ? 15 : 100}
                        required
                        placeholder="0"
                        value={newCoupon.discountValue}
                        onChange={(e) =>
                          setNewCoupon({
                            ...newCoupon,
                            discountValue: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3.5 bg-muted/50 border border-border rounded-xl focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-foreground"
                      />
                    </div>
                    {user?.role === 'sales' && (
                      <p className="text-xs text-primary/80 ml-1 font-medium italic">
                        Sales team can provide a maximum of 15% discount.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground ml-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={newCoupon.expiryDate}
                      onChange={(e) =>
                        setNewCoupon({
                          ...newCoupon,
                          expiryDate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3.5 bg-muted/50 border border-border rounded-xl focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-foreground"
                    />
                  </div>
                </div>

                <div className="pt-6 flex flex-col-reverse sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 px-6 py-4 bg-background border border-border text-muted-foreground rounded-2xl hover:bg-muted font-bold transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] h-14 bg-primary text-primary-foreground rounded-2xl hover:opacity-90 font-black transition-all duration-200 shadow-xl shadow-primary/10 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>Generating...</>
                    ) : (
                      <>
                        <Tag className="w-4 h-4" />
                        Generate Coupon
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
