import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  LayoutGrid,
  ArrowLeft,
  TrendingUp,
  Clock,
  Monitor,
  Layers,
  CheckCircle2,
  ShieldCheck,
  User,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";

import {
  getPropertyById,
  getPropertySpaces,
  updateProperty,
} from "@/services/property.service";
import {
  fetchAllCoworkingSpacesPublic,
  fetchAllVirtualOfficesPublic,
  fetchAllMeetingRooms,
  updateCoworkingSpace,
  updateVirtualOffice,
  updateMeetingRoom,
} from "@/services/spacePortal/spacePartner.service";
import { adminService, KYCData } from "@/services/admin.service";
import StatCard from "@/components/ui/SpacePartner/StatCard";
import { Property } from "@/types/services";

type SpaceCategory = "coworking" | "virtual" | "meeting";

export default function PropertyManagement() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [spacesLoading, setSpacesLoading] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<SpaceCategory>("coworking");
  const [commissionAmount, setCommissionAmount] = useState<number>(0);
  const [commissionAmountRaw, setCommissionAmountRaw] = useState<string>("0");
  const [virtualCommissions, setVirtualCommissions] = useState({
    gst: 0,
    mailing: 0,
    br: 0,
  });
  const [virtualCommissionsRaw, setVirtualCommissionsRaw] = useState({
    gst: "0",
    mailing: "0",
    br: "0",
  });
  const [meetingCommissions, setMeetingCommissions] = useState<
    Record<string, number>
  >({});
  const [meetingCommissionsRaw, setMeetingCommissionsRaw] = useState<
    Record<string, string>
  >({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const propData = await getPropertyById(id);
        setProperty(propData);
      } catch (err) {
        console.error("Failed to load property details", err);
        toast.error("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  useEffect(() => {
    const fetchTabSpaces = async () => {
      if (!id) return;
      setSpacesLoading(true);
      try {
        let data: any[] = [];
        if (activeCategory === "coworking") {
          data = await fetchAllCoworkingSpacesPublic({ property: id });
        } else if (activeCategory === "virtual") {
          data = await fetchAllVirtualOfficesPublic({ property: id });
        } else if (activeCategory === "meeting") {
          data = await fetchAllMeetingRooms({ property: id });
        }

        setSpaces(
          data.map((s: any) => ({ ...s, spaceCategory: activeCategory })),
        );
      } catch (err) {
        console.error("Failed to load spaces", err);
      } finally {
        setSpacesLoading(false);
      }
    };

    fetchTabSpaces();
  }, [id, activeCategory]);

  useEffect(() => {
    if (activeCategory === "coworking" && spaces.length > 0) {
      const space = spaces[0];
      const partnerPrice =
        space.partnerPricePerMonth || space.pricePerMonth || 0;
      const finalPrice = space.finalPricePerMonth || partnerPrice;
      const commission = Math.max(
        0,
        space.adminMarkupPerMonth ?? finalPrice - partnerPrice,
      );
      setCommissionAmount(commission);
      setCommissionAmountRaw(commission.toString());
    }
  }, [spaces, activeCategory]);

  useEffect(() => {
    if (activeCategory === "virtual" && spaces.length > 0) {
      const space = spaces[0];
      const gst = Math.max(
        0,
        space.adminMarkupGstPerYear ??
          (space.finalGstPricePerYear || 0) -
            (space.partnerGstPricePerYear || 0),
      );
      const mailing = Math.max(
        0,
        space.adminMarkupMailingPerYear ??
          (space.finalMailingPricePerYear || 0) -
            (space.partnerMailingPricePerYear || 0),
      );
      const br = Math.max(
        0,
        space.adminMarkupBrPerYear ??
          (space.finalBrPricePerYear || 0) - (space.partnerBrPricePerYear || 0),
      );

      setVirtualCommissions({ gst, mailing, br });
      setVirtualCommissionsRaw({
        gst: gst.toString(),
        mailing: mailing.toString(),
        br: br.toString(),
      });
    }
  }, [spaces, activeCategory]);

  useEffect(() => {
    if (activeCategory === "meeting" && spaces.length > 0) {
      const commissions: Record<string, number> = {};
      const rawCommissions: Record<string, string> = {};
      spaces.forEach((space) => {
        const partnerPrice = space.partnerPricePerHour || 0;
        const finalPrice = space.finalPricePerHour || 0;
        const commission =
          space.adminMarkupPerHour ?? Math.max(0, finalPrice - partnerPrice);

        commissions[space._id] = commission;
        rawCommissions[space._id] = commission.toString();
      });
      setMeetingCommissions(commissions);
      setMeetingCommissionsRaw(rawCommissions);
    }
  }, [spaces, activeCategory]);

  const handleUpdateCoworking = async (spaceId: string) => {
    if (commissionAmount <= 0) {
      toast.error("Commission must be greater than 0");
      return;
    }
    setSaving(true);
    try {
      const space = spaces[0];
      const partnerPrice =
        space.partnerPricePerMonth || space.pricePerMonth || 0;
      const finalPrice = partnerPrice + commissionAmount;

      const res = await updateCoworkingSpace(spaceId, {
        adminMarkupPerMonth: commissionAmount,
        finalPricePerMonth: finalPrice,
        isActive: true,
        approvalStatus: "active",
      });

      if (res) {
        toast.success("Coworking space approved and updated successfully");
        setSpaces((prev) =>
          prev.map((s) =>
            s._id === spaceId
              ? {
                  ...s,
                  adminMarkupPerMonth: commissionAmount,
                  finalPricePerMonth: finalPrice,
                  isActive: true,
                  approvalStatus: "active",
                }
              : s,
          ),
        );

        // Auto-approve property
        if (id) {
          await updateProperty(id, {
            kycStatus: "approved",
            isActive: true,
            status: "active",
          });
          setProperty((prev: any) =>
            prev
              ? {
                  ...prev,
                  kycStatus: "approved",
                  isActive: true,
                  status: "active",
                }
              : prev,
          );
        }
      }
    } catch (err) {
      console.error("Failed to update coworking space", err);
      toast.error("Failed to update space");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateVirtual = async (spaceId: string) => {
    if (
      virtualCommissions.gst <= 0 ||
      virtualCommissions.mailing <= 0 ||
      virtualCommissions.br <= 0
    ) {
      toast.error("All commissions must be greater than 0");
      return;
    }
    setSaving(true);
    try {
      const space = spaces[0];
      const data = {
        adminMarkupGstPerYear: virtualCommissions.gst,
        finalGstPricePerYear:
          (space.partnerGstPricePerYear || space.finalGstPricePerYear || 0) +
          virtualCommissions.gst,
        adminMarkupMailingPerYear: virtualCommissions.mailing,
        finalMailingPricePerYear:
          (space.partnerMailingPricePerYear ||
            space.finalMailingPricePerYear ||
            0) + virtualCommissions.mailing,
        adminMarkupBrPerYear: virtualCommissions.br,
        finalBrPricePerYear:
          (space.partnerBrPricePerYear || space.finalBrPricePerYear || 0) +
          virtualCommissions.br,
        isActive: true,
        approvalStatus: "active",
      };

      const res = await updateVirtualOffice(spaceId, data);
      if (res) {
        toast.success("Virtual Office plans approved and updated");
        setSpaces((prev) =>
          prev.map((s) => (s._id === spaceId ? { ...s, ...data } : s)),
        );

        // Auto-approve property
        if (id) {
          await updateProperty(id, {
            kycStatus: "approved",
            isActive: true,
            status: "active",
          });
          setProperty((prev: any) =>
            prev
              ? {
                  ...prev,
                  kycStatus: "approved",
                  isActive: true,
                  status: "active",
                }
              : prev,
          );
        }
      }
    } catch (err) {
      console.error("Failed to update virtual office", err);
      toast.error("Failed to update Virtual Office");
    } finally {
      setSaving(false);
    }
  };

  const handleBatchUpdateMeetingRooms = async () => {
    // Check if any commission is invalid
    const invalidRooms = spaces.filter((space) => {
      const comm = meetingCommissions[space._id];
      return comm === undefined || comm <= 0 || isNaN(comm);
    });

    if (invalidRooms.length > 0) {
      toast.error("All meeting rooms must have a commission greater than 0");
      return;
    }

    setSaving(true);
    try {
      const updatePromises = spaces.map(async (space) => {
        const commission = meetingCommissions[space._id];
        const partnerPrice = space.partnerPricePerHour || 0;
        const finalPrice = partnerPrice + commission;

        return updateMeetingRoom(space._id, {
          adminMarkupPerHour: commission,
          finalPricePerHour: finalPrice,
          isActive: true,
          approvalStatus: "active",
        });
      });

      const results = await Promise.all(updatePromises);

      if (results.every((r) => r)) {
        toast.success("All meeting rooms approved and updated successfully");

        // Update local spaces state
        setSpaces((prev) =>
          prev.map((s) => {
            const commission = meetingCommissions[s._id];
            const partnerPrice = s.partnerPricePerHour || 0;
            return {
              ...s,
              adminMarkupPerHour: commission,
              finalPricePerHour: partnerPrice + commission,
              isActive: true,
              approvalStatus: "active",
            };
          }),
        );

        // Auto-approve property
        if (id) {
          await updateProperty(id, {
            kycStatus: "approved",
            isActive: true,
            status: "active",
          });
          setProperty((prev: any) =>
            prev
              ? {
                  ...prev,
                  kycStatus: "approved",
                  isActive: true,
                  status: "active",
                }
              : prev,
          );
        }
      }
    } catch (err) {
      console.error("Failed to batch update meeting rooms", err);
      toast.error("Failed to update all meeting rooms");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="text-slate-500">Property not found.</div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#3FA69E] font-semibold"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>
    );
  }

  const selectionCards = [
    {
      id: "coworking",
      label: "Coworking Space",
      icon: Users,
      desc: "Shared desks, dedicated desks, and private cabins.",
    },
    {
      id: "virtual",
      label: "Virtual Office",
      icon: Monitor,
      desc: "GST registration, mailing address, and business representation.",
    },
    {
      id: "meeting",
      label: "On-Demand",
      icon: Layers,
      desc: "Conference rooms, interview rooms, and board rooms.",
    },
  ];

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="flex-1 space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-transparent">
        {/* Premium Header Section */}
        <div className="relative overflow-hidden bg-white rounded-[40px] p-10 border border-gray-100 shadow-xl shadow-teal-500/5">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-50 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-50 rounded-full opacity-50 blur-3xl"></div>

          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-teal-600 transition-all uppercase tracking-widest"
              >
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Back to Requests
              </button>

              <div className="space-y-1">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight flex flex-wrap items-baseline gap-x-3">
                  Manage{" "}
                  <span className="text-teal-500 italic pr-2">
                    {property.name}
                  </span>
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-500">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <MapPin size={14} className="text-teal-500" />
                    {property.area}, {property.city}
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <Building2 size={14} className="text-blue-500" />
                    {property.address}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-2xl shadow-inner border border-gray-50 flex gap-1">
                <button className="px-4 py-2 rounded-xl bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-200">
                  Overview
                </button>
                <button className="px-4 py-2 rounded-xl text-slate-400 hover:text-teal-600 text-xs font-bold transition-colors">
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Premium Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              {
                title: "KYC Status",
                value: property.kycStatus?.toUpperCase() || "PENDING",
                icon: ShieldCheck,
                color:
                  property.kycStatus === "approved"
                    ? "emerald"
                    : property.kycStatus === "rejected"
                      ? "rose"
                      : "amber",
                subtitle:
                  property.kycStatus === "approved"
                    ? "Verified Property"
                    : property.kycStatus === "rejected"
                      ? "Manual Review Required"
                      : "Awaiting Review",
              },
              {
                title: "Inventory",
                value: spaces.length,
                icon: LayoutGrid,
                color: "blue",
                subtitle: "Total Listed Spaces",
              },
              {
                title: "Connectivity",
                value: spaces.some((s) => s.isActive) ? "Live" : "Inactive",
                icon: TrendingUp,
                color: spaces.some((s) => s.isActive) ? "teal" : "slate",
                subtitle: spaces.some((s) => s.isActive)
                  ? "Platform Visible"
                  : "Hidden from Public",
              },
              {
                title: "Onboarding",
                value: property.createdAt
                  ? new Date(property.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A",
                icon: Clock,
                color: "purple",
                subtitle: "Platform Entry Date",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="group relative bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col justify-between min-h-[160px]"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-black text-gray-900 break-words leading-tight">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform shrink-0`}
                  >
                    <stat.icon size={20} />
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <p className="text-[11px] font-bold text-slate-500">
                    {stat.subtitle}
                  </p>
                  <div
                    className={`mt-3 h-1 w-0 group-hover:w-full transition-all duration-500 rounded-full bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div className="space-y-8 pt-4">
          <div className="flex items-center justify-between mx-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-gray-900">
                Platform Services
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Manage specific inventory categories for this property.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectionCards.map((card) => {
              const isSelected = activeCategory === card.id;
              return (
                <button
                  key={card.id}
                  onClick={() => setActiveCategory(card.id as SpaceCategory)}
                  className={`relative flex flex-col items-center p-8 rounded-[32px] border-2 transition-all duration-300 group ${
                    isSelected
                      ? "border-teal-500 bg-teal-50/30 shadow-xl shadow-teal-100/50"
                      : "border-gray-100 bg-white hover:border-teal-200 hover:bg-gray-50/50"
                  }`}
                >
                  <div
                    className={`p-5 rounded-2xl mb-5 transition-all duration-300 ${
                      isSelected
                        ? "bg-teal-500 text-white scale-110 shadow-lg shadow-teal-200"
                        : "bg-gray-100 text-slate-400 group-hover:bg-teal-100 group-hover:text-teal-600"
                    }`}
                  >
                    <card.icon className="w-8 h-8" />
                  </div>
                  <h3
                    className={`text-lg font-bold mb-2 transition-colors ${
                      isSelected ? "text-teal-600" : "text-gray-900"
                    }`}
                  >
                    {card.label}
                  </h3>
                  <p className="text-xs text-center text-slate-500 leading-relaxed font-medium">
                    {card.desc}
                  </p>

                  {isSelected && (
                    <div className="absolute top-6 right-6 text-teal-500 animate-in zoom-in duration-300">
                      <CheckCircle2 className="w-6 h-6 fill-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Spaces Listing */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 capitalize">
              {activeCategory} Spaces
            </h2>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
              {spaces.length} Found
            </span>
          </div>

          {spacesLoading ? (
            <div className="py-20 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium italic">
                Loading spaces...
              </p>
            </div>
          ) : activeCategory === "coworking" && spaces.length > 0 ? (
            /* Coworking Management Form */
            <div className="max-w-4xl mx-auto">
              {spaces.map((space) => {
                const partnerPrice =
                  space.partnerPricePerMonth || space.pricePerMonth || 0;
                const finalPrice = partnerPrice + commissionAmount;

                return (
                  <div
                    key={space._id}
                    className="bg-gray-50/50 rounded-[32px] border border-gray-100 p-10 space-y-10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black text-gray-900">
                          Coworking Configuration
                        </h3>
                        <p className="text-slate-500 text-sm font-medium italic">
                          Configure pricing and commissions for this property's
                          main coworking area.
                        </p>
                      </div>
                      <div
                        className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest ${space.isActive !== false ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                      >
                        {space.isActive !== false
                          ? "ACTIVE INVENTORY"
                          : "INACTIVE"}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Basic Info */}
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Space Name
                          </label>
                          <input
                            type="text"
                            disabled
                            value={space.name || "Main Coworking Space"}
                            className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-500 cursor-not-allowed"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                              Capacity
                            </label>
                            <div className="relative">
                              <Users
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500"
                                size={16}
                              />
                              <input
                                type="text"
                                disabled
                                value={`${space.capacity || 0} Seats`}
                                className="w-full pl-12 pr-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-500 cursor-not-allowed"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                              Total Floors
                            </label>
                            <div className="relative">
                              <Layers
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                                size={16}
                              />
                              <input
                                type="text"
                                disabled
                                value={`${space.floors?.length || 0} Floors`}
                                className="w-full pl-12 pr-5 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-500 cursor-not-allowed"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pricing Logic */}
                      <div className="bg-white rounded-[32px] p-8 border border-teal-100 shadow-xl shadow-teal-500/5 space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-teal-600 uppercase tracking-widest ml-1">
                              Partner Price (Per Desk/Mo)
                            </label>
                            <div className="relative">
                              <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400">
                                ₹
                              </span>
                              <input
                                type="number"
                                disabled
                                value={partnerPrice}
                                className="w-full pl-10 pr-5 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-xl font-black text-slate-500 cursor-not-allowed"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-center py-2">
                            <div className="h-px flex-1 bg-teal-100"></div>
                            <div className="mx-4 w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-teal-200">
                              +
                            </div>
                            <div className="h-px flex-1 bg-teal-100"></div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">
                              Admin Commission
                            </label>
                            <div className="relative group">
                              <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-blue-500">
                                ₹
                              </span>
                              <input
                                type="text"
                                value={commissionAmountRaw}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === "" || /^\d+$/.test(val)) {
                                    setCommissionAmountRaw(val);
                                    setCommissionAmount(
                                      val === "" ? 0 : Number(val),
                                    );
                                  }
                                }}
                                placeholder="Enter commission..."
                                className="w-full pl-10 pr-5 py-5 bg-white border-2 border-blue-100 rounded-2xl text-xl font-black text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 mt-6">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              Final Price User Sees
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                              <span className="text-xs font-bold text-teal-600 uppercase">
                                Live Estimate
                              </span>
                            </div>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black text-gray-900 tracking-tighter">
                              ₹{finalPrice.toLocaleString()}
                            </span>
                            <span className="text-sm font-bold text-slate-400">
                              / per desk / month
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleUpdateCoworking(space._id)}
                          disabled={saving}
                          className="w-full py-5 bg-teal-500 text-white rounded-[22px] font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-500/20 hover:bg-teal-600 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                          {saving
                            ? "Saving Changes..."
                            : "Update Pricing Configuration"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : activeCategory === "virtual" && spaces.length > 0 ? (
            /* Virtual Office Management Form */
            <div className="max-w-5xl mx-auto">
              {spaces.map((space) => (
                <div
                  key={space._id}
                  className="bg-gray-50/50 rounded-[32px] border border-gray-100 p-10 space-y-10"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-gray-900">
                        Virtual Office Configuration
                      </h3>
                      <p className="text-slate-500 text-sm font-medium italic">
                        Manage pricing for GST Registration, Mailing, and
                        Business Residence plans.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {[
                      {
                        key: "gst",
                        label: "GST Registration",
                        partner:
                          space.partnerGstPricePerYear ||
                          space.finalGstPricePerYear ||
                          0,
                        comm: virtualCommissions.gst,
                      },
                      {
                        key: "mailing",
                        label: "Mailing Address",
                        partner:
                          space.partnerMailingPricePerYear ||
                          space.finalMailingPricePerYear ||
                          0,
                        comm: virtualCommissions.mailing,
                      },
                      {
                        key: "br",
                        label: "Business Residence",
                        partner:
                          space.partnerBrPricePerYear ||
                          space.finalBrPricePerYear ||
                          0,
                        comm: virtualCommissions.br,
                      },
                    ].map((plan) => (
                      <div
                        key={plan.key}
                        className="bg-white rounded-[28px] p-6 border border-gray-100 shadow-sm space-y-6"
                      >
                        <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black tracking-widest w-fit">
                          {plan.label.toUpperCase()}
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                              Partner Price
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                                ₹
                              </span>
                              <input
                                disabled
                                value={plan.partner}
                                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-500 cursor-not-allowed"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-center">
                            <Plus className="text-teal-500" size={16} />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-teal-600 uppercase tracking-widest ml-1">
                              Commission
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500 font-bold">
                                ₹
                              </span>
                              <input
                                type="text"
                                value={
                                  virtualCommissionsRaw[
                                    plan.key as keyof typeof virtualCommissionsRaw
                                  ]
                                }
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === "" || /^\d+$/.test(val)) {
                                    setVirtualCommissionsRaw((prev) => ({
                                      ...prev,
                                      [plan.key]: val,
                                    }));
                                    setVirtualCommissions((prev) => ({
                                      ...prev,
                                      [plan.key]: val === "" ? 0 : Number(val),
                                    }));
                                  }
                                }}
                                className="w-full pl-8 pr-4 py-3 bg-white border border-teal-100 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-50">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                            Final Total (Net)
                          </p>
                          <p className="text-2xl font-black text-gray-900">
                            ₹{(plan.partner + plan.comm).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleUpdateVirtual(space._id)}
                      disabled={saving}
                      className="px-10 py-4 bg-teal-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-teal-500/20 hover:bg-teal-600 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {saving ? "Updating..." : "Save All Virtual Plans"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : activeCategory === "meeting" && spaces.length > 0 ? (
            /* Meeting Room Management Form */
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[32px] shadow-sm mb-10">
                <h3 className="text-2xl font-black text-gray-900">
                  Meeting Room Inventory
                </h3>
                <p className="text-slate-500 text-sm font-medium italic">
                  Set commissions for hourly bookings across different room
                  types.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {spaces.map((space) => {
                  const partnerPrice =
                    space.partnerPricePerHour || space.finalPricePerHour || 0;
                  const commission = meetingCommissions[space._id] || 0;
                  const commissionRaw = meetingCommissionsRaw[space._id] || "0";
                  const finalPrice = partnerPrice + commission;

                  return (
                    <div
                      key={space._id}
                      className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                              <Layers size={20} />
                            </div>
                            <div>
                              <h4 className="font-black text-gray-900 uppercase tracking-tight">
                                {space.type?.replace("_", " ")}
                              </h4>
                              <p className="text-xs font-bold text-slate-400">
                                Capacity: {space.capacity} People
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                Partner Base
                              </p>
                              <p className="font-black text-slate-600">
                                ₹{partnerPrice}/hr
                              </p>
                            </div>
                            <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100">
                              <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">
                                Final Price
                              </p>
                              <p className="font-black text-teal-700">
                                ₹{finalPrice}/hr
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="w-full lg:w-72 space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">
                              Admin Commission
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 font-black">
                                ₹
                              </span>
                              <input
                                type="text"
                                value={commissionRaw}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === "" || /^\d+$/.test(val)) {
                                    setMeetingCommissionsRaw((prev) => ({
                                      ...prev,
                                      [space._id]: val,
                                    }));
                                    setMeetingCommissions((prev) => ({
                                      ...prev,
                                      [space._id]: val === "" ? 0 : Number(val),
                                    }));
                                  }
                                }}
                                className="w-full pl-8 pr-4 py-4 bg-white border-2 border-blue-50 rounded-2xl text-sm font-black text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {spaces.length > 0 && (
                  <div className="flex justify-center pt-6">
                    <button
                      onClick={handleBatchUpdateMeetingRooms}
                      disabled={saving}
                      className="px-12 py-5 bg-teal-500 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-teal-500/20 hover:bg-teal-600 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {saving
                        ? "Processing Updates..."
                        : "Apply All Meeting Room Commissions"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {spaces.map((space) => (
                <div
                  key={space._id || space.id}
                  className="group relative flex flex-col p-6 rounded-2xl border border-gray-100 bg-gray-50/50 transition-all hover:bg-white hover:border-teal-200 hover:shadow-xl hover:shadow-teal-100/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 truncate pr-2">
                        {space.name ||
                          (space.type
                            ? space.type.replace(/_/g, " ").toUpperCase()
                            : `${activeCategory.toUpperCase()} Space`)}
                      </h4>
                      <span
                        className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight ${
                          space.isActive !== false
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {space.isActive !== false ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {activeCategory === "coworking" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white p-2 rounded-xl border border-gray-100 flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                              <Users size={14} />
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">
                                Capacity
                              </p>
                              <p className="text-sm font-bold text-slate-700">
                                {space.capacity || 0} Seats
                              </p>
                            </div>
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-gray-100 flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                              <LayoutGrid size={14} />
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">
                                Floors
                              </p>
                              <p className="text-sm font-bold text-slate-700">
                                {space.floors?.length || 0} Floors
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Floor Breakdown */}
                        {space.floors && space.floors.length > 0 && (
                          <div className="bg-gray-100/50 rounded-xl p-3 border border-gray-100">
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">
                              Floor Breakdown
                            </p>
                            <div className="space-y-1.5">
                              {space.floors.map((floor: any, fIdx: number) => (
                                <div
                                  key={fIdx}
                                  className="flex justify-between items-center text-xs"
                                >
                                  <span className="text-slate-500 font-medium">
                                    Floor{" "}
                                    {floor.number ||
                                      floor.floorNumber ||
                                      fIdx + 1}
                                  </span>
                                  <span className="px-2 py-0.5 bg-white border border-gray-100 rounded-md font-bold text-teal-600">
                                    {floor.tables?.length || 0} Tables
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Amenities/Features */}
                        {space.features && space.features.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {space.features
                              .slice(0, 4)
                              .map((f: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold rounded-md"
                                >
                                  {f}
                                </span>
                              ))}
                            {space.features.length > 4 && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-md">
                                +{space.features.length - 4} More
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
  
                    {activeCategory === "virtual" && (
                      <div className="space-y-2">
                        <div className="bg-white p-3 rounded-xl border border-gray-100 space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded bg-teal-50 flex items-center justify-center text-teal-600">
                                <ShieldCheck size={12} />
                              </div>
                              <span className="text-xs font-bold text-slate-600">
                                GST Registration
                              </span>
                            </div>
                            <span className="text-sm font-black text-teal-600">
                              ₹
                              {(
                                space.finalGstPricePerYear ||
                                space.partnerGstPricePerYear ||
                                0
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded bg-teal-50 flex items-center justify-center text-teal-600">
                                <Building2 size={12} />
                              </div>
                              <span className="text-xs font-bold text-slate-600">
                                Business Reg
                              </span>
                            </div>
                            <span className="text-sm font-black text-teal-600">
                              ₹
                              {(
                                space.finalBrPricePerYear ||
                                space.partnerBrPricePerYear ||
                                0
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center px-1">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded bg-teal-50 flex items-center justify-center text-teal-600">
                                <Monitor size={12} />
                              </div>
                              <span className="text-xs font-bold text-slate-600">
                                Mailing Address
                              </span>
                            </div>
                            <span className="text-sm font-black text-teal-600">
                              ₹
                              {(
                                space.finalMailingPricePerYear ||
                                space.partnerMailingPricePerYear ||
                                0
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeCategory === "meeting" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white p-2 rounded-xl border border-gray-100 flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                              <Users size={14} />
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">
                                Capacity
                              </p>
                              <p className="text-sm font-bold text-slate-700">
                                {space.capacity || "N/A"} Seats
                              </p>
                            </div>
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-gray-100 flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                              <Layers size={14} />
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">
                                Room Type
                              </p>
                              <p className="text-sm font-bold text-slate-700 capitalize">
                                {space.type?.replace(/_/g, " ") || "Room"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-teal-500/5 p-3 rounded-xl border border-teal-100/50 flex items-center gap-3">
                          <Clock size={16} className="text-teal-600" />
                          <div>
                            <p className="text-[10px] text-teal-600 font-bold uppercase">
                              Operating Hours
                            </p>
                            <p className="text-xs font-bold text-slate-700">
                              {space.operatingHours?.openTime || "09:00"} -{" "}
                              {space.operatingHours?.closeTime || "18:00"}
                            </p>
                          </div>
                        </div>

                        {space.images && space.images.length > 0 && (
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            {space.images.length} Photos Listed
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Starting from
                      </p>
                      <p className="text-xl font-black text-gray-900">
                        ₹
                        {(
                          space.pricePerMonth ||
                          space.partnerPricePerMonth ||
                          space.finalPricePerHour ||
                          space.pricePerHour ||
                          space.partnerPricePerHour ||
                          space.pricePerDay ||
                          space.price ||
                          space.finalGstPricePerYear ||
                          space.partnerGstPricePerYear ||
                          0
                        ).toLocaleString()}
                        <span className="text-[10px] font-bold text-slate-400 ml-1">
                          {activeCategory === "coworking"
                            ? "/mo"
                            : activeCategory === "meeting"
                              ? space.finalPricePerHour ||
                                space.pricePerHour ||
                                space.partnerPricePerHour
                                ? "/hr"
                                : "/day"
                              : "/yr"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {spaces.length === 0 && (
                <div className="col-span-full py-20 text-center bg-gray-50 border border-dashed border-gray-200 rounded-[32px]">
                  <LayoutGrid
                    className="mx-auto text-slate-200 mb-4"
                    size={48}
                  />
                  <h3 className="text-lg font-bold text-gray-400">
                    No Spaces Found
                  </h3>
                  <p className="text-slate-400 text-sm">
                    There are no {activeCategory} spaces listed for this
                    property.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
