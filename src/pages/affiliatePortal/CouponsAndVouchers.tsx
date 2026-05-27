import React, { useState, useEffect } from 'react';
import { Tag, Calendar, Plus, Trash2, Search, Filter, MoreVertical, X, CalendarDays, Percent, Loader2, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { createCoupon, getAllCoupons, deleteCoupon } from "@/services/coupon.service";
import { Coupon, CouponStatus } from "@/types/coupon.types";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from '@/lib/axios';
import { AdminPageSkeleton } from '@/components/ui/skeleton-loaders';
import { SearchableSelect } from "@/components/ui/searchable-select";

interface SpaceOption {
  name: string;
  city?: string;
  address?: string;
  displayName: string;
  maxDiscount?: number;
}

const ALLOWED_SPACES = [
  { name: "Stirring Minds" },
  { name: "Getset Spaces" },
  { name: "Mytime Cowork" },
  { name: "RegisterKaro" },
  { name: "MSB Cospazes" },
  { name: "Sanogic Coworking Space" },
  { name: "The Work Lounge" },
  { name: "MSB COspaze" },
  { name: "Infrapro - Sector 44" },
  { name: "TEAM COWORK- Palm Court - Gurgaon" },
  { name: "Workshala- sector 3" },
  { name: "IndiraNagar - Aspire Coworks" },
  { name: "Koramangala - Aspire Coworks" },
  { name: "EcoSpace - Hebbal, HMT Layout" },
  { name: "Salt Lake, Sec V - EasyDaftar" },
  { name: "Park Street - EasyDaftar" },
  { name: "Rashbehari - EasyDaftar" },
  { name: "Louden Street - EasyDaftar" },
  { name: "CS Coworking - GachiBowli" },
  { name: "CS Coworking - Hitex Road" },
  { name: "CS Coworking.- Shaikpet I" },
  { name: "CS Coworking - Raidurg" },
];

const CouponsAndVouchers = () => {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [availableSpaces, setAvailableSpaces] = useState<SpaceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    discountValue: "" as any,
    expiryDate: "",
    manualCode: "",
    applicableSpace: "",
  });

  useEffect(() => {
    fetchCoupons();
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      const res = await axiosInstance.get("/api/affiliate/calculator-spaces");
      let dbSpaces: any[] = [];
      if (res.data.success) {
        dbSpaces = res.data.data;
      }
      
      let finalSpaces: SpaceOption[] = [];
      if (dbSpaces.length > 0) {
        // Filter DB spaces to only those that match ALLOWED_SPACES
        const filtered = dbSpaces.filter(db => 
          ALLOWED_SPACES.some(allowed => db.name.toLowerCase().includes(allowed.name.toLowerCase()))
        );
        finalSpaces = filtered.map(db => {
          const cityText = db.city ? ` - ${db.city}` : "";
          const addressText = db.address ? ` | ${db.address.substring(0, 45)}...` : "";
          return {
            name: db.name + (db.city ? ` - ${db.city}` : ""),
            city: db.city,
            address: db.address,
            displayName: `${db.name}${cityText}${addressText}`,
            maxDiscount: db.maxDiscount || 30
          };
        });
      } else {
        finalSpaces = ALLOWED_SPACES.map(s => ({
          name: s.name,
          displayName: s.name,
          maxDiscount: 30
        }));
      }

      // Remove duplicates
      const uniqueSpaces = Array.from(new Map(finalSpaces.map(s => [s.name, s])).values());
      setAvailableSpaces(uniqueSpaces);
    } catch (error) {
      console.error("Failed to fetch spaces for coupons", error);
      setAvailableSpaces(ALLOWED_SPACES.map(s => ({ name: s.name, displayName: s.name, maxDiscount: 30 })));
    }
  };

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      // Fetching coupons passing user ID to get their own coupons
      const data = await getAllCoupons(user?._id || user?.id);
      setCoupons(data || []);
    } catch (error) {
      console.error("Failed to fetch coupons", error);
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find selected space to check maxDiscount constraint
    const selectedSpaceObj = availableSpaces.find(s => s.name === newCoupon.applicableSpace);
    const maxDiscountAllowed = selectedSpaceObj?.maxDiscount || 30;

    if (Number(newCoupon.discountValue) < 5 || Number(newCoupon.discountValue) > maxDiscountAllowed) {
      toast.error(`Discount must be between 5% and ${maxDiscountAllowed}%`);
      return;
    }
    if (!newCoupon.applicableSpace) {
      toast.error("Please select a space");
      return;
    }
    setIsSubmitting(true);
    try {
      await createCoupon({
        assignedClientId: user?._id || user?.id || "",
        discountValue: Number(newCoupon.discountValue),
        expiryDate: newCoupon.expiryDate,
        manualCode: newCoupon.manualCode,
        applicableSpace: newCoupon.applicableSpace,
      } as any);
      toast.success("Coupon created successfully");
      setIsCreateModalOpen(false);
      setNewCoupon({
        discountValue: "",
        expiryDate: "",
        manualCode: "",
        applicableSpace: "",
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#35503F]/10 text-[#35503F] border border-[#35503F]/20">
            <CalendarDays className="w-3 h-3" /> Used
          </span>
        );
      case CouponStatus.EXPIRED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
            <Calendar className="w-3 h-3" /> Expired
          </span>
        );
      case CouponStatus.DISABLED:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            <X className="w-3 h-3" /> Disabled
          </span>
        );
      default:
        return null;
    }
  };

  const getEffectiveStatus = (coupon: Coupon): CouponStatus => {
    if (coupon.status === CouponStatus.ACTIVE && coupon.usedBy && coupon.usedBy.length > 0) {
      return CouponStatus.USED;
    }
    return coupon.status;
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = coupon.code
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ? true : getEffectiveStatus(coupon) === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
 <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-[#FAFAF7] font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 style={{ fontFamily: "'Inter', sans-serif" }} className="text-3xl font-extrabold tracking-tight">
          <span className="text-[#1A1A1A]">Coupons</span>
        </h1>
        <p className="text-sm md:text-base text-[#6B8F78] font-medium">Generate and manage your affiliate coupons</p>
      </div>


      

        {/* --- COUPONS TAB --- */}
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#36503F] text-[#fef8c5] hover:bg-[#2a3d30] rounded-lg h-10 px-4 text-sm font-bold transition-all shadow-md active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Create Coupon
              </Button>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-[#D4E0D0] shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B8F78]" />
                <input
                  type="text"
                  placeholder="Search by code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white rounded-lg border border-[#D4E0D0] focus:outline-none focus:border-[#36503F] focus:ring-0 transition-all text-sm font-medium text-[#1A1A1A] placeholder:text-[#6B8F78]"
                />
              </div>

              <div className="relative w-full md:w-auto">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B8F78]" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full md:w-40 pl-9 pr-8 py-2.5 bg-white border border-[#D4E0D0] rounded-lg text-sm font-bold text-[#1A1A1A] focus:outline-none focus:ring-0 focus:border-[#36503F] cursor-pointer transition-all appearance-none h-10"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="used">Used</option>
                  <option value="expired">Expired</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-[#D4E0D0] shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] overflow-hidden">
              <div className="min-h-[400px]">
                {loading ? (
                  <div className="p-8">
                    <AdminPageSkeleton />
                  </div>
                ) : filteredCoupons.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                    <Tag className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-bold">No coupons found.</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or creating a new one.</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-5 text-sm font-bold text-[#6B8F78] tracking-wider">
                              Coupon Code
                            </th>
                            <th className="px-6 py-5 text-sm font-bold text-[#6B8F78] tracking-wider">
                              Discount
                            </th>
                            <th className="px-6 py-5 text-sm font-bold text-[#6B8F78] tracking-wider">
                              Space
                            </th>
                            <th className="px-6 py-5 text-sm font-bold text-[#6B8F78] tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-5 text-sm font-bold text-[#6B8F78] tracking-wider">
                              Expiry
                            </th>
                            <th className="px-6 py-5 text-sm font-bold text-[#6B8F78] tracking-wider text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/60 bg-white">
                          {filteredCoupons.map((coupon) => (
                            <tr
                              key={coupon._id}
                              className="group hover:bg-gray-50 transition-all duration-200"
                            >
                              <td className="px-8 py-6">
                                <div className="font-mono font-bold text-sm text-[#1a1a1a] bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 inline-block shadow-sm">
                                  {coupon.code}
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                  <div className="p-1.5 bg-[#35503F]/10 rounded-md">
                                    <Percent className="w-3.5 h-3.5 text-[#35503F]" />
                                  </div>
                                  <span className="font-bold text-gray-900 text-sm">
                                    {coupon.discountValue}%
                                  </span>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-2 text-gray-700">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-bold truncate max-w-[150px]">
                                    {coupon.applicableSpace || "All Spaces"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex flex-col items-start gap-1.5">
                                  {getStatusBadge(getEffectiveStatus(coupon))}
                                  {!!coupon.usedBy?.length && (
                                    <span className="text-sm font-bold text-[#677E73]">
                                      Used {coupon.usedBy.length} time{coupon.usedBy.length === 1 ? "" : "s"}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-2 text-gray-500">
                                  <CalendarDays className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-bold text-gray-900">
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
                              <td className="px-8 py-6 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                  <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#F0F4EE] text-[#36503F] hover:bg-[#36503F] hover:text-[#fef8c5] transition-all border border-[#D4E0D0] opacity-0 group-hover:opacity-100">
                                      <MoreVertical className="w-5 h-5" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-48 bg-white shadow-2xl border border-gray-100 rounded-2xl p-2 z-[60]"
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
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile/Tablet Card View */}
                    <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white">
                      {filteredCoupons.map((coupon) => (
                        <div
                          key={coupon._id}
                          className="bg-white border border-[#D4E0D0] rounded-xl p-5 space-y-5 shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] hover:shadow-md transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-mono font-bold text-sm text-[#35503F] bg-[#35503F]/5 px-3 py-1.5 rounded-lg border border-[#35503F]/10 inline-block mb-3">
                                {coupon.code}
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-700 font-bold text-sm mb-3">
                                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                {coupon.applicableSpace || "All Spaces"}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {getStatusBadge(getEffectiveStatus(coupon))}
                              {!!coupon.usedBy?.length && (
                                <span className="text-sm font-bold text-[#677E73]">
                                  Used {coupon.usedBy.length} time{coupon.usedBy.length === 1 ? "" : "s"}
                                </span>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48 bg-white shadow-2xl border border-gray-100 rounded-2xl p-2 z-[60]"
                                >
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteCoupon(coupon._id)}
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-xl py-3 font-bold cursor-pointer transition-all"
                                  >
                                    <Trash2 className="mr-3 h-4 w-4" />
                                    Delete Coupon
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100 mt-2">
                            <div>
                              <p className="text-sm uppercase font-bold text-gray-400 tracking-widest mb-1.5">Discount</p>
                              <div className="flex items-end gap-1">
                                <span className="text-2xl font-extrabold text-gray-900 leading-none">{coupon.discountValue}</span>
                                <span className="text-sm font-bold text-[#35503F] mb-0.5">% OFF</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm uppercase font-bold text-gray-400 tracking-widest mb-1.5">Expires On</p>
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
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)}></div>
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-[2rem]">
              <div>
                <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-gray-900 tracking-tight">
                  Create New <span className="text-[#4A6D56] italic">Coupon</span>
                </h2>
                <p className="text-xs md:text-sm text-gray-500 font-medium">
                  Generate a discount code to refer clients.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 p-2.5 rounded-full hover:bg-gray-200 transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-6 md:p-8 space-y-6 overflow-y-auto">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 ml-1 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#35503F]" />
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
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#35503F]/50 focus:ring-4 focus:ring-[#35503F]/5 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <p className="text-xs text-gray-500 ml-1">
                    Leave blank to auto-generate.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 ml-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#35503F]" />
                    Applicable Space
                  </label>
                  <SearchableSelect
                    options={availableSpaces.map((space) => ({
                      label: space.displayName,
                      value: space.name
                    }))}
                    value={newCoupon.applicableSpace}
                    onChange={(val) => {
                      const isCapped = val && (val === "FSDL08" || val.toLowerCase().includes("kolkata"));
                      let currentDiscount = Number(newCoupon.discountValue);
                      if (isCapped && currentDiscount > 25) {
                        currentDiscount = 25;
                      }
                      setNewCoupon({
                        ...newCoupon,
                        applicableSpace: val,
                        discountValue: currentDiscount ? String(currentDiscount) : newCoupon.discountValue,
                      })
                    }}
                    placeholder="Select a space"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 ml-1 flex items-center gap-2">
                    <Percent className="w-4 h-4 text-[#35503F]" />
                    Discount (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="5"
                      max={
                        newCoupon.applicableSpace && (newCoupon.applicableSpace === "FSDL08" || newCoupon.applicableSpace.toLowerCase().includes("kolkata"))
                          ? 25
                          : 30
                      }
                      required
                      placeholder="0"
                      value={newCoupon.discountValue}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        const isCapped = newCoupon.applicableSpace && (newCoupon.applicableSpace === "FSDL08" || newCoupon.applicableSpace.toLowerCase().includes("kolkata"));
                        const maxAllowed = isCapped ? 25 : 30;
                        if (val > maxAllowed) {
                          val = maxAllowed;
                        }
                        setNewCoupon({
                          ...newCoupon,
                          discountValue: val ? String(val) : e.target.value,
                        })
                      }}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#35503F]/50 focus:ring-4 focus:ring-[#35503F]/5 outline-none transition-all font-medium text-gray-900"
                    />
                  </div>
                  <p className="text-xs text-gray-500 ml-1">
                    Allowed discount range: 5% - {
                      newCoupon.applicableSpace && (newCoupon.applicableSpace === "FSDL08" || newCoupon.applicableSpace.toLowerCase().includes("kolkata"))
                        ? "25% (Space limit)"
                        : "30%"
                    }
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 ml-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#35503F]" />
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
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#35503F]/50 focus:ring-4 focus:ring-[#35503F]/5 outline-none transition-all font-medium text-gray-900"
                  />
                </div>
              </div>

              <div className="pt-6 flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 font-bold transition-all duration-200"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] h-14 bg-[#35503F] text-[#FEF8C3] rounded-2xl hover:opacity-90 font-bold transition-all duration-200 shadow-xl shadow-[#35503F]/10 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
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
    </div>
  );
};

export default CouponsAndVouchers;
