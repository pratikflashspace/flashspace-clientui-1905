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
  RefreshCw,
  ChevronsUpDown,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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

export default function Coupons() {
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
      // Fetching users with 'user' role or simply all users to select from
      const response = await adminService.getAllUsers({ role: "user" });
      if (response.success && response.data) {
        setClients(response.data.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch clients", error);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            <Tag className="w-3 h-3" /> Active
          </span>
        );
      case CouponStatus.USED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <CalendarDays className="w-3 h-3" /> Used
          </span>
        );
      case CouponStatus.EXPIRED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <Calendar className="w-3 h-3" /> Expired
          </span>
        );
      case CouponStatus.DISABLED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
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
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Coupons & <span className="text-primary italic">Vouchers</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage discount coupons and promotional codes for your clients.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={fetchCoupons}
            className="rounded-xl h-12 border-border px-6 hover:bg-muted/50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Coupon
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-visible">
        {/* Toolbar */}
        <div className="p-6 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2.5 bg-muted/30 border border-border rounded-xl text-sm font-medium text-foreground focus:ring-2 focus:ring-primary/20 cursor-pointer hover:bg-muted/50 transition-colors appearance-none outline-none"
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

        {/* Registry Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-8">
              <div className="w-20 h-20 bg-muted/20 rounded-[2rem] flex items-center justify-center border border-border/50">
                <RefreshCw className="w-10 h-10 text-primary animate-spin opacity-40" />
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] animate-pulse">Syncing Cryptographic Data...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/10 text-left border-b border-border/40">
                  <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Cryptographic Code</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Impact</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Operational State</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Assigned Associate</th>
                  <th className="px-10 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Expiration</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Protocols</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredCoupons.map((coupon) => {
                  const client = clients.find(
                    (c) => (c._id || c.id) === coupon.assignedClientId,
                  );
                  return (
                    <tr
                      key={coupon._id}
                      className="group hover:bg-muted/30 transition-all duration-300"
                    >
                      <td className="px-10 py-6">
                        <Badge variant="outline" className="font-mono font-black text-primary text-sm px-4 py-2 bg-primary/5 border-primary/20 shadow-sm">
                          {coupon.code}
                        </Badge>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <Percent className="w-4 h-4 text-indigo-500" />
                          </div>
                          <span className="font-black text-foreground text-lg tracking-tighter">
                            {coupon.discountValue}%
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        {getStatusBadge(coupon.status)}
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center font-black text-xs text-primary shadow-sm">
                            {client?.fullName?.[0] || 'U'}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-foreground uppercase tracking-tight text-sm">
                              {client ? client.fullName : "Unknown Associate"}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase opacity-40">
                              {client?.email || "ID: UNKNOWN"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Calendar className="w-4 h-4 opacity-40" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">
                            {(() => {
                              try {
                                const date = new Date(coupon.expiryDate);
                                return isNaN(date.getTime())
                                  ? "Invalid Date"
                                  : format(date, "MMM dd, yyyy");
                              } catch (e) {
                                return "N/A";
                              }
                            })()}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-muted group-hover:bg-background transition-colors">
                              <MoreVertical className="w-5 h-5 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-56 bg-background/95 backdrop-blur-md shadow-2xl border border-border rounded-2xl p-2 z-[100]"
                          >
                            <DropdownMenuLabel className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Protocol Authorization</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border/40" />
                            <DropdownMenuItem
                              onClick={() => handleDeleteCoupon(coupon._id)}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer rounded-xl h-12 gap-3 px-4 font-black text-[10px] uppercase tracking-widest"
                            >
                              <Trash2 className="h-4 w-4" />
                              Revoke Authorization
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
                {filteredCoupons.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-10 py-40 text-center"
                    >
                      <div className="flex flex-col items-center gap-8">
                        <div className="w-32 h-32 bg-muted/20 rounded-[3rem] flex items-center justify-center border border-border/50">
                          <Tag className="w-16 h-16 text-muted-foreground opacity-10" />
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-3xl font-black text-foreground uppercase tracking-tighter italic">No Incentive <span className="text-primary not-italic">Matches</span></h3>
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Adjust your reconnaissance parameters.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Modal Tier */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-background rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 border border-border">
            <div className="p-10 border-b border-border/40 flex justify-between items-center bg-muted/5 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
              <div className="space-y-1">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                  Protocol: PROVISIONING
                </Badge>
                <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">
                  Generate <span className="text-primary not-italic">Incentive</span>
                </h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                  Generate a cryptographic discount for a specific associate.
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-14 h-14 rounded-2xl hover:bg-muted transition-all active:scale-90"
              >
                <X className="w-6 h-6 text-muted-foreground" />
              </Button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-12 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="md:col-span-2 space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-3">
                    <UserIcon className="w-4 h-4 text-primary" />
                    Target Associate Identity
                  </label>
                  <div className="relative group">
                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openCombobox}
                          className="w-full justify-between h-20 px-8 bg-muted/20 border-border rounded-3xl hover:bg-muted/30 hover:border-primary/30 text-left font-black shadow-none transition-all"
                        >
                          {newCoupon.assignedClientId ? (
                            (() => {
                              const client = clients.find(
                                (c) =>
                                  (c._id || c.id) ===
                                  newCoupon.assignedClientId,
                              );
                              return client ? (
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                                    {client.fullName?.[0] || 'U'}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-foreground uppercase tracking-tight text-sm">
                                      {client.fullName}
                                    </span>
                                    <span className="text-[9px] text-muted-foreground font-mono uppercase opacity-40">
                                      {client.email}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/40 italic">Lookup Associate Dossier…</span>
                              );
                            })()
                          ) : (
                            <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/40 italic">Lookup Associate Dossier…</span>
                          )}
                          <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-20" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[--radix-popover-trigger-width] p-0 rounded-[2.5rem] shadow-[0_32px_96px_-12px_rgba(0,0,0,0.3)] border-border z-[200] bg-background/95 backdrop-blur-xl overflow-hidden"
                        align="start"
                      >
                        <Command className="bg-transparent">
                          <CommandInput
                            placeholder="Identify by name or digital address…"
                            className="bg-muted/10 h-16 border-none focus:ring-0 text-[11px] font-black uppercase tracking-widest px-8"
                          />
                          <CommandList className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            <CommandEmpty className="py-12 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center opacity-40 italic">No Match Detected.</CommandEmpty>
                            <CommandGroup className="p-2">
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
                                    className="cursor-pointer h-16 hover:bg-muted/50 aria-selected:bg-muted/50 transition-all rounded-2xl px-6 mx-1 flex items-center gap-4"
                                  >
                                    <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary border border-primary/10 flex items-center justify-center font-black text-xs group-aria-selected:scale-110 transition-transform">
                                      {client.fullName?.[0] || 'U'}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                      <span className="font-black text-foreground uppercase tracking-tight text-sm">
                                        {client.fullName}
                                      </span>
                                      <span className="text-[9px] font-bold text-muted-foreground font-mono uppercase opacity-40">
                                        {client.email}
                                      </span>
                                    </div>
                                    <Check
                                      className={cn(
                                        "ml-auto h-5 w-5 text-primary",
                                        newCoupon.assignedClientId === clientId
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
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-3">
                    <Tag className="w-4 h-4 text-primary" />
                    Manual Hash Overlay (Opt)
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="e.g. ALPHA2024"
                      value={newCoupon.manualCode || ""}
                      onChange={(e) =>
                        setNewCoupon({
                          ...newCoupon,
                          manualCode: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full h-20 px-8 bg-muted/20 border border-border rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all placeholder:text-muted-foreground/20 font-mono shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-3">
                    <Percent className="w-4 h-4 text-primary" />
                    Impact Scaling (%)
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      required
                      placeholder="0"
                      value={newCoupon.discountValue}
                      onChange={(e) =>
                        setNewCoupon({
                          ...newCoupon,
                          discountValue: e.target.value,
                        })
                      }
                      className="w-full h-20 px-8 bg-muted/20 border border-border rounded-3xl text-2xl font-black text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    Operational Horizon
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={newCoupon.expiryDate}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, expiryDate: e.target.value })
                    }
                    className="w-full h-20 px-8 bg-muted/20 border border-border rounded-3xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="pt-10 flex gap-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 h-20 bg-background border-border text-foreground rounded-[2rem] hover:bg-muted font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg"
                >
                  Terminate Protocol
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-20 bg-primary text-primary-foreground rounded-[2rem] hover:bg-primary/90 font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl shadow-primary/30 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Tag className="w-5 h-5" />
                      Commit Authorization
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
