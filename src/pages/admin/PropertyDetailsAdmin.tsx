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
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import { AdminPageSkeleton } from "@/components/ui/skeleton-loaders";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { toast } from "sonner";
import { updateProperty } from "@/services/property.service";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import axiosInstance from "@/services/api.service";
import {
  getPropertyById,
  getPropertySpaces,
  getPropertyBookingsForPartner,
} from "@/services/property.service";
import {
  fetchAllCoworkingSpacesPublic,
  fetchAllVirtualOfficesPublic,
  fetchAllMeetingRooms,
} from "@/services/spacePortal/spacePartner.service";
import StatCard from "@/components/ui/SpacePartner/StatCard";
import { Property } from "@/types/services";

export default function AdminPropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [spacesLoading, setSpacesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "coworking" | "virtual" | "meeting"
  >("coworking");

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // 1. Fetch Property Details
        const propData = await getPropertyById(id);
        setProperty(propData);

        // Fetch ALL spaces for bookings context once to populate bookings and stats
        const spacesData = await getPropertySpaces(id);

        // 3. Fetch Bookings for the entire property
        const allBookings = await getPropertyBookingsForPartner(id);

        setBookings(allBookings);
      } catch (err) {
        console.error("Failed to load property details", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);
  const [approving, setApproving] = useState(false);

  const handleApproveKyc = async () => {
    if (!id || !property) return;

    setApproving(true);
    try {
      await updateProperty(id, { kycStatus: "approved" });
      const updatedProp = await getPropertyById(id);
      setProperty(updatedProp);
      toast.success("Property KYC approved successfully!");
    } catch (err) {
      console.error("Failed to approve property KYC", err);
      toast.error("Failed to approve property KYC");
    } finally {
      setApproving(false);
    }
  };

  useEffect(() => {
    const fetchTabSpaces = async () => {
      if (!id) return;
      setSpacesLoading(true);
      try {
        let data: any[] = [];
        if (activeTab === "coworking") {
          data = await fetchAllCoworkingSpacesPublic({ property: id });
        } else if (activeTab === "virtual") {
          data = await fetchAllVirtualOfficesPublic({ property: id });
        } else if (activeTab === "meeting") {
          data = await fetchAllMeetingRooms({ property: id });
        }

        setSpaces(data.map((s: any) => ({ ...s, spaceCategory: activeTab })));
      } catch (err) {
        console.error("Failed to load spaces for tab", err);
      } finally {
        setSpacesLoading(false);
      }
    };

    fetchTabSpaces();
  }, [id, activeTab]);

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

  if (!property) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
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

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="flex-1 space-y-8 pb-10 bg-transparent">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Space Details
            </button>
            <h1 className="text-2xl font-bold text-slate-900">
              {property.name}
            </h1>
            <div className="mt-1 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                {property.area}, {property.city}
              </div>
              <div className="flex items-center gap-1">
                <Building2 size={14} />
                {property.address}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-4 py-1 text-xs font-semibold ${
                property.kycStatus === "approved"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                  : "bg-amber-50 text-amber-700 border border-amber-100"
              }`}
            >
              KYC: {property.kycStatus?.toUpperCase()}
            </span>

            {property.kycStatus !== "approved" && (
              <button
                onClick={handleApproveKyc}
                disabled={approving}
                className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {approving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Approving...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Approve Property KYC
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={`₹${bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0).toLocaleString("en-IN")}`}
            icon={<TrendingUp size={22} />}
            trend="up"
            trendLabel="Property Life"
          />
          <StatCard
            title="Total Bookings"
            value={bookings.length}
            icon={<Calendar size={22} />}
            trend="up"
            trendLabel="All Time"
          />
          <StatCard
            title="Active Spaces"
            value={spaces.length}
            icon={<LayoutGrid size={22} />}
          />
          <StatCard
            title="Avg. Booking"
            value={`₹${bookings.length > 0 ? Math.round(bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) / bookings.length).toLocaleString("en-IN") : 0}`}
            icon={<Users size={22} />}
          />
        </div>

        {/* Analytics and Details Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Revenue Analysis
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Monthly revenue overview.
            </p>
            <div className="mt-6 h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    // Simple aggregation by month if possible, or dummy trend
                    bookings
                      .slice(0, 6)
                      .map((b, i) => ({
                        name: new Date(b.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                          },
                        ),
                        revenue: b.totalAmount || 0,
                      }))
                      .reverse()
                  }
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                    cursor={{ fill: "rgba(63, 166, 158, 0.05)" }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#3FA69E"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
              {bookings.length === 0 && (
                <p className="mt-4 text-center text-sm text-slate-400">
                  No data available yet
                </p>
              )}
            </div>
          </div>

          {/* Property Features */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Property Details
              </h2>
              <div className="flex gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    property.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : property.status === "pending_approval"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {property.status || "DRAFT"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    property.isActive
                      ? "bg-blue-100 text-blue-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {property.isActive ? "VISIBLE" : "HIDDEN"}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="col-span-2">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Physical Address
                </p>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                  {property.address}, {property.area}, {property.city}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Total Assets
                </p>
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {property.images?.length || 0} Media Files
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Listed On
                </p>
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {property.createdAt
                    ? new Date(property.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Last Updated
                </p>
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {property.updatedAt
                    ? new Date(property.updatedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Just Now"}
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Property Reference ID
                </p>
                <p className="text-[10px] font-mono text-slate-500 mt-1">
                  {property._id}
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                  Available Amenities
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {property.features.map((feature, index) => (
                    <span
                      key={index}
                      className="rounded-lg bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-500 border border-slate-100 hover:bg-slate-100 transition-colors"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spaces Section */}
        <div className="space-y-8">
          {/* Spaces Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-bold text-slate-900">Spaces</h2>
              <div className="flex rounded-lg bg-slate-100 p-1">
                {(["coworking", "virtual", "meeting"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-md px-4 py-1.5 text-xs font-bold transition-all ${
                      activeTab === tab
                        ? "bg-white text-[#3FA69E] shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div
              className={`grid grid-cols-1 gap-4 ${activeTab === "coworking" ? "" : "sm:grid-cols-2"}`}
            >
              {spacesLoading ? (
                <div className="col-span-full py-10 text-center">
                  <p className="text-sm text-slate-500">
                    Loading {activeTab} spaces...
                  </p>
                </div>
              ) : (
                <>
                  {spaces.map((space) => {
                    let displayHeading =
                      space.name ||
                      `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Space`;
                    let detailsJsx = null;
                    let priceJsx = null;

                    if (activeTab === "coworking") {
                      const totalFloors = space.floors?.length || 0;
                      const totalSeats =
                        space.floors?.reduce(
                          (ac: number, f: any) =>
                            ac +
                            (f.tables?.reduce(
                              (tAc: number, t: any) =>
                                tAc + (t.seats?.length || 0),
                              0,
                            ) || 0),
                          0,
                        ) || 0;

                      detailsJsx = (
                        <div className="mt-3 flex flex-col gap-2">
                          {/* Floor-wise details */}
                          {space.floors?.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2 pr-1">
                              {space.floors.map((floor: any, fIdx: number) => (
                                <div
                                  key={fIdx}
                                  className="bg-white border text-left border-slate-100 rounded-md p-2"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-bold text-slate-700">
                                      Floor {floor.number}
                                    </span>
                                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">
                                      {floor.tables?.length || 0} Tables
                                    </span>
                                  </div>
                                  <div className="flex flex-col gap-1 pl-2 border-l-2 border-slate-100">
                                    {floor.tables?.length > 0 ? (
                                      floor.tables.map(
                                        (table: any, tIdx: number) => (
                                          <div
                                            key={tIdx}
                                            className="flex justify-between items-center text-xs py-0.5"
                                          >
                                            <span className="text-slate-600">
                                              Table {table.number || tIdx + 1}
                                            </span>
                                            <span className="font-medium text-slate-500">
                                              {table.seats?.length || 0} Seats
                                            </span>
                                          </div>
                                        ),
                                      )
                                    ) : (
                                      <div className="text-xs text-slate-400">
                                        No tables
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-400 italic">
                              No floors configured
                            </p>
                          )}

                          {/* Total Summary */}
                          <div className="flex items-center justify-between text-sm bg-slate-50 border border-slate-100 p-2.5 rounded-md mt-1">
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <LayoutGrid size={14} />{" "}
                              <span className="font-semibold text-slate-700">
                                {totalFloors}
                              </span>{" "}
                              Floors
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Users size={14} />{" "}
                              <span className="font-semibold text-slate-700">
                                {totalSeats}
                              </span>{" "}
                              Seats
                            </div>
                          </div>
                        </div>
                      );
                      priceJsx = (
                        <p className="text-base font-bold text-[#3FA69E]">
                          ₹
                          {space.pricePerMonth ||
                            space.pricePerDay ||
                            space.price ||
                            0}
                          <span className="text-xs font-normal text-slate-400">
                            {" "}
                            /mo
                          </span>
                        </p>
                      );
                    } else if (activeTab === "virtual") {
                      detailsJsx = (
                        <div className="mt-3 flex flex-col gap-2">
                          <div className="flex items-center justify-between text-sm bg-slate-100 px-3 py-1.5 rounded-md">
                            <span className="text-slate-500">GST Plan</span>
                            <span className="font-bold text-slate-700">
                              ₹{space.finalGstPricePerYear || 0}/yr
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm bg-slate-100 px-3 py-1.5 rounded-md">
                            <span className="text-slate-500">Business Reg</span>
                            <span className="font-bold text-slate-700">
                              ₹{space.finalBrPricePerYear || 0}/yr
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm bg-slate-100 px-3 py-1.5 rounded-md">
                            <span className="text-slate-500">Mailing</span>
                            <span className="font-bold text-slate-700">
                              ₹{space.finalMailingPricePerYear || 0}/yr
                            </span>
                          </div>
                        </div>
                      );
                    } else if (activeTab === "meeting") {
                      if (space.type) {
                        displayHeading = space.type
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c: string) => c.toUpperCase());
                      }
                      detailsJsx = (
                        <div className="mt-3 flex flex-col gap-1.5">
                          <p className="text-sm text-slate-500 flex items-center gap-1.5">
                            <Users size={14} className="text-slate-400" />{" "}
                            Capacity:{" "}
                            <span className="font-semibold text-slate-700">
                              {space.capacity || "N/A"}
                            </span>
                          </p>
                          <p className="text-sm text-slate-500 mt-0.5">
                            <span className="font-medium text-slate-600">
                              Hours:
                            </span>{" "}
                            {space.operatingHours?.openTime || "09:00"} -{" "}
                            {space.operatingHours?.closeTime || "18:00"}
                          </p>
                        </div>
                      );
                      priceJsx = (
                        <div className="flex flex-col">
                          <p className="text-base font-bold text-[#3FA69E]">
                            ₹
                            {space.finalPricePerHour ||
                              space.pricePerHour ||
                              space.pricePerDay ||
                              0}
                            <span className="text-xs font-normal text-slate-400">
                              {" "}
                              /hr
                            </span>
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={space._id || space.id}
                        className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-[#3FA69E]/30 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 w-full">
                            <div className="flex items-start justify-between">
                              <p className="font-bold text-slate-900 truncate">
                                {displayHeading}
                              </p>
                              <span
                                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                  space.isActive !== false
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-rose-100 text-rose-700"
                                }`}
                              >
                                {space.isActive !== false
                                  ? "ACTIVE"
                                  : "INACTIVE"}
                              </span>
                            </div>
                            <div className="w-full">{detailsJsx}</div>
                          </div>
                        </div>
                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-200">
                          {priceJsx || <div />}
                          {/* Admin doesn't need 'Manage' button to go to space config */}
                        </div>
                      </div>
                    );
                  })}

                  {spaces.length === 0 && (
                    <div className="col-span-full py-10 text-center">
                      <LayoutGrid
                        className="mx-auto text-slate-300 mb-2"
                        size={40}
                      />
                      <p className="text-sm text-slate-500">
                        No {activeTab} spaces found for this property.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Bookings Section */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Property Bookings ({bookings.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Booking ID</th>
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Space Type</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <tr
                        key={booking._id || booking.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {booking.bookingNumber ||
                            booking._id?.substring(0, 8) ||
                            "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">
                            {booking.user?.fullName || "Guest User"}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {booking.user?.email || ""}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="capitalize text-slate-600">
                            {booking.type?.replace("_", " ") || "Other"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          ₹{(booking.totalAmount || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                              booking.status === "active"
                                ? "bg-emerald-100 text-emerald-700"
                                : booking.status === "pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {booking.status?.toUpperCase() || "UNKNOWN"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-slate-500"
                      >
                        <Clock
                          className="mx-auto text-slate-300 mb-2"
                          size={40}
                        />
                        No bookings found for this property.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
