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
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight font-[Poppins]">
              Coupons & Vouchers
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-medium">
              Manage discount coupons for your clients.
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full md:w-auto px-6 py-3.5 bg-gray-900 text-white border border-transparent rounded-2xl hover:bg-black transition-all shadow-lg shadow-gray-900/10 hover:shadow-xl hover:-translate-y-0.5 flex justify-center items-center gap-2 font-bold"
          >
            <Plus className="w-5 h-5" />
            Create Coupon
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 overflow-visible">
          {/* Toolbar */}
          <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-white rounded-t-3xl">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-4 focus:ring-black/5 focus:bg-white transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400 h-11"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <div className="relative flex-1 md:flex-none">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full md:w-40 pl-9 pr-8 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 focus:ring-4 focus:ring-black/5 cursor-pointer hover:bg-gray-100 transition-all appearance-none h-11"
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
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">
                          Coupon Code
                        </th>
                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">
                          Discount
                        </th>
                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">
                          Status
                        </th>
                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">
                          Assigned To
                        </th>
                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">
                          Expiry
                        </th>
                        <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-right px-8">
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
                            className="group hover:bg-gray-50 transition-all duration-200"
                          >
                            <td className="px-6 py-4">
                              <div className="font-mono font-black text-xs text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200/50 inline-block shadow-sm">
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
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200 group-hover:bg-white group-hover:shadow-md transition-all">
                                  <UserIcon className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                                    {client ? client.fullName : "Unknown Client"}
                                  </p>
                                  <p className="text-[10px] text-gray-400 font-medium">
                                    {client ? client.email : "N/A"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-gray-600">
                                <CalendarDays className="w-4 h-4 text-gray-400" />
                                <span className="text-xs font-bold">
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
                <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50/50 rounded-b-3xl">
                  {filteredCoupons.map((coupon) => {
                    const client = clients.find(
                      (c) => (c._id || c.id) === coupon.assignedClientId,
                    );
                    return (
                      <div
                        key={coupon._id}
                        className="bg-white border border-gray-100 rounded-3xl p-5 space-y-5 shadow-sm hover:shadow-md transition-all border-l-4 border-l-primary/10"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-mono font-black text-xs text-primary bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 inline-block mb-3">
                              {coupon.code}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 shadow-sm">
                                <UserIcon className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-black text-gray-900 leading-none mb-1">
                                  {client ? client.fullName : "Unknown Client"}
                                </h3>
                                <p className="text-[11px] text-gray-400 font-bold truncate max-w-[150px]">
                                  {client ? client.email : "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(coupon.status)}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                                  <MoreVertical className="w-5 h-5" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-48 bg-white shadow-2xl border-0 rounded-2xl p-2 z-[60]"
                              >
                                <DropdownMenuItem
                                  onClick={() => handleDeleteCoupon(coupon._id)}
                                  className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-xl py-3 font-black cursor-pointer transition-all"
                                >
                                  <Trash2 className="mr-3 h-4 w-4" />
                                  Delete Coupon
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                          <div>
                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1.5">Discount</p>
                            <div className="flex items-end gap-1">
                              <span className="text-2xl font-black text-gray-900 leading-none">{coupon.discountValue}</span>
                              <span className="text-sm font-bold text-primary mb-0.5">% OFF</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1.5">Expires On</p>
                            <div className="flex items-center justify-end gap-2 text-gray-900 font-bold">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
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
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-t-[32px] sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-300 border border-gray-100 max-h-[90vh] flex flex-col">
              <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50/50 to-white shrink-0">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                    Create New Coupon
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500 font-medium">
                    Generate a discount code for a client.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-900 p-2.5 rounded-full hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
 
              <form onSubmit={handleCreateCoupon} className="p-6 md:p-8 space-y-6 overflow-y-auto scrollbar-none">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-gray-500" />
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
                            className="w-full justify-between px-4 py-6 bg-gray-50 border-gray-200 rounded-xl hover:bg-white hover:border-gray-300 text-left font-normal text-gray-900 shadow-none h-auto"
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
                                    <span className="font-medium">
                                      {client.fullName}
                                    </span>
                                    <span className="text-gray-500 text-xs">
                                      ({client.email})
                                    </span>
                                  </span>
                                ) : (
                                  "Select client..."
                                );
                              })()
                            ) : (
                              <span className="text-gray-500">
                                Select a client...
                              </span>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[--radix-popover-trigger-width] p-0 rounded-xl shadow-xl border-gray-100 z-[200] bg-white"
                          align="start"
                        >
                          <Command className="rounded-xl border border-gray-100">
                            <CommandInput
                              placeholder="Search client by name or email..."
                              className="rounded-t-xl"
                            />
                            <CommandList className="max-h-[200px] overflow-y-auto">
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
                                      className="cursor-pointer py-3 aria-selected:bg-gray-100"
                                    >
                                      <UserIcon
                                        className={cn(
                                          "mr-2 h-4 w-4 text-gray-400",
                                        )}
                                      />
                                      <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">
                                          {client.fullName}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {client.email}
                                        </span>
                                      </div>
                                      <Check
                                        className={cn(
                                          "ml-auto h-4 w-4 text-green-600",
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
                    <p className="text-xs text-gray-500 ml-1">
                      The coupon will be exclusive to this client.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-500" />
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
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                    <p className="text-xs text-gray-500 ml-1">
                      Leave blank to auto-generate.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-2">
                      <Percent className="w-4 h-4 text-gray-500" />
                      Discount (%)
                    </label>
                    <div className="relative">
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
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 outline-none transition-all font-medium text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
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
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 outline-none transition-all font-medium text-gray-900"
                    />
                  </div>
                </div>

                <div className="pt-6 flex flex-col-reverse sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 px-6 py-4 bg-white border-2 border-gray-100 text-gray-600 rounded-2xl hover:bg-gray-50 hover:border-gray-200 font-bold transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] px-6 py-4 bg-gray-900 text-white rounded-2xl hover:bg-black font-black transition-all duration-200 shadow-xl shadow-gray-900/10 hover:shadow-gray-900/20 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>Generating...</>
                    ) : (
                      <>
                        <Tag className="w-4 h-4" />
                        Generate Coupon
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
