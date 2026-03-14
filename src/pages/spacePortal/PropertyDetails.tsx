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
  Activity,
  ChevronRight,
  Info,
  Layers,
  IndianRupee,
  Star,
  ExternalLink,
} from "lucide-react";
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
  AreaChart,
  Area,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

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
import { Property } from "@/types/services";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function PropertyDetails() {
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
        const propData = await getPropertyById(id);
        setProperty(propData);
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
      <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#0A2A1E]/10 border-t-[#3FA69E] animate-spin"></div>
        </div>
        <p className="text-slate-500 font-medium animate-pulse">
          Refining Details...
        </p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-6 text-center">
        <div className="bg-rose-50 p-6 rounded-full">
          <XCircle size={48} className="text-rose-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            Property Not Found
          </h2>
          <p className="text-slate-500 max-w-xs">
            We couldn't locate the property details. It might have been moved or
            deleted.
          </p>
        </div>
        <button
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/spaceportal/space-management");
            }
          }}
          className="flex items-center gap-2 bg-[#0A2A1E] text-white px-6 py-2 rounded-xl font-bold transition-transform active:scale-95 shadow-lg shadow-[#0A2A1E]/20"
        >
          <ArrowLeft size={18} /> Return to Previous Page
        </button>
      </div>
    );
  }

  const totalRevenue = bookings.reduce(
    (sum, b) => sum + (b.plan?.finalPrice || b.plan?.price || 0),
    0,
  );
  const avgBooking =
    bookings.length > 0 ? Math.round(totalRevenue / bookings.length) : 0;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex-1 space-y-8 pb-10 max-w-7xl mx-auto px-4 sm:px-6"
    >
      {/* Hero Banner Section */}
      <motion.section
        variants={itemVariants}
        className="relative h-[300px] overflow-hidden rounded-3xl shadow-2xl"
      >
        <img
          src={
            property.images &&
            property.images.length > 0 &&
            typeof property.images[0] === "string" &&
            property.images[0].length > 10
              ? property.images[0]
              : "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80"
          }
          alt={property.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80";
          }}
          className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2A1E]/90 via-[#0A2A1E]/40 to-transparent" />

        <div className="absolute top-6 left-6">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/spaceportal/space-management");
              }
            }}
            className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md px-4 py-2 text-sm font-bold text-white border border-white/20 hover:bg-white/20 transition-all"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-[#3FA69E] hover:bg-[#3FA69E] text-white border-none px-3 py-1 font-bold tracking-wide">
                {property.status?.toUpperCase() || "ACTIVE"}
              </Badge>
              {property.kycStatus === "approved" && (
                <Badge className="bg-[#FDE68A] hover:bg-[#FDE68A] text-[#0A2A1E] border-none px-3 py-1 font-bold flex gap-1 items-center">
                  <CheckCircle2 size={12} /> VERIFIED
                </Badge>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
              {property.name}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-white/80">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <MapPin size={16} className="text-[#3FA69E]" />
                {property.area}, {property.city}
              </div>
              <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/30" />
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Building2 size={16} className="text-[#3FA69E]" />
                {property.address}
              </div>
            </div>
          </div>

          <button
            onClick={() =>
              navigate(`/spaceportal/space-management/add?id=${property._id}`)
            }
            className="rounded-2xl bg-white px-8 py-3.5 text-sm font-black text-[#0A2A1E] shadow-xl hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Build/Edit Property <ChevronRight size={18} />
          </button>
        </div>
      </motion.section>

      {/* Stats Section with Custom Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Property Revenue",
            value: `₹${totalRevenue.toLocaleString("en-IN")}`,
            icon: TrendingUp,
            color: "emerald",
          },
          {
            title: "Total Bookings",
            value: bookings.length,
            icon: Calendar,
            color: "blue",
          },
          {
            title: "Managed Spaces",
            value: spaces.length,
            icon: Layers,
            color: "purple",
          },
          {
            title: "Client Satisfaction",
            value: "4.8",
            icon: Star,
            color: "amber",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 shadow-sm transition-all hover:shadow-xl"
          >
            <div
              className={`absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full opacity-5 group-hover:opacity-10 transition-opacity bg-${stat.color}-500`}
            />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {stat.title}
                </p>
                <p className="mt-2 text-3xl font-black text-slate-900">
                  {stat.value}
                </p>
              </div>
              <div
                className={`rounded-2xl p-3 bg-slate-50 text-slate-600 group-hover:bg-[#0A2A1E] group-hover:text-white transition-all`}
              >
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "70%" }}
                  className={`h-full bg-${stat.color}-500`}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                70% Target
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Advanced Revenue Analysis */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Revenue Trajectory
              </h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Performance over the last 6 months
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
              <button className="px-3 py-1.5 text-[10px] font-bold bg-white text-[#0A2A1E] rounded-lg shadow-sm">
                Revenue
              </button>
              <button className="px-3 py-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors">
                Usage
              </button>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={bookings.slice(0, 10).map((b, i) => ({
                  name: `B${i + 1}`,
                  value: b.plan?.finalPrice || b.plan?.price || 0,
                }))}
              >
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3FA69E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3FA69E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
                    padding: "12px",
                  }}
                  itemStyle={{ fontWeight: "bold", color: "#0A2A1E" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3FA69E"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorVal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Immersive Details Card */}
        <motion.div
          variants={itemVariants}
          className="rounded-3xl border border-slate-200 bg-[#0A2A1E] p-8 shadow-2xl text-white relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <Building2 size={120} />
          </div>

          <h2 className="text-xl font-black mb-8 relative">
            Infrastructure Profile
          </h2>

          <div className="space-y-6 relative">
            {[
              {
                label: "Listed On",
                value: property.createdAt
                  ? new Date(property.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A",
                icon: Calendar,
              },
              {
                label: "Total Assets",
                value: `${property.images?.length || 0} Media Files`,
                icon: Layers,
              },
              {
                label: "Status",
                value: property.isActive ? "Live Visibility" : "Hidden",
                icon: Activity,
              },
            ].map((detail, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-[#3FA69E] shrink-0">
                  <detail.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    {detail.label}
                  </p>
                  <p className="font-bold text-white mt-0.5">{detail.value}</p>
                </div>
              </div>
            ))}

            <Separator className="bg-white/10 my-4" />

            <div>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">
                Highlights
              </p>
              <div className="flex flex-wrap gap-2">
                {property.features.slice(0, 4).map((f, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-white/80 hover:bg-white/10 transition-colors"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button className="w-full py-4 rounded-2xl bg-[#3FA69E] text-white font-black text-sm shadow-xl hover:bg-[#349189] transition-all flex items-center justify-center gap-2 group-hover:gap-3">
                Download Property Profile <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modern Space Management Section */}
      <motion.section
        variants={itemVariants}
        className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Workspace Inventory
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Detailed breakdown of available assets
            </p>
          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 relative">
            <motion.div
              layoutId="activeTab"
              className="absolute h-[calc(100%-12px)] top-1.5 rounded-xl bg-white shadow-md z-0"
              initial={false}
              animate={{
                left:
                  activeTab === "coworking"
                    ? 6
                    : activeTab === "virtual"
                      ? "calc(33.33% + 4px)"
                      : "calc(66.66% + 2px)",
                width: "calc(33.33% - 4px)",
              }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
            {(["coworking", "virtual", "meeting"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative z-10 w-32 py-2.5 text-xs font-black rounded-xl transition-colors ${
                  activeTab === tab
                    ? "text-[#0A2A1E]"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            {spacesLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 gap-4"
              >
                <div className="h-10 w-10 border-4 border-[#3FA69E]/20 border-t-[#3FA69E] rounded-full animate-spin" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Scanning Spaces...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`grid gap-6 ${activeTab === "coworking" || activeTab === "virtual" ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}
              >
                {spaces.map((space, idx) => (
                  <motion.div
                    key={space._id || space.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { delay: idx * 0.05 },
                    }}
                    className="group flex flex-col rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all hover:bg-white hover:shadow-xl"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          {activeTab === "meeting"
                            ? (space.type || "").replace("_", " ")
                            : activeTab}{" "}
                          Unit
                        </p>
                        <h4 className="text-base font-black text-[#0A2A1E]">
                          {space.name ||
                            (activeTab === "coworking"
                              ? "Shared Workspace"
                              : activeTab === "virtual"
                                ? "Virtual Office Plan"
                                : "Meeting Room")}
                        </h4>
                      </div>
                      {activeTab !== "virtual" && (
                        <div className="text-right">
                          <p className="text-lg font-black text-[#3FA69E]">
                            ₹
                            {(
                              space.finalPricePerMonth ||
                              space.partnerPricePerMonth ||
                              space.finalPricePerHour ||
                              space.pricePerHour ||
                              0
                            ).toLocaleString()}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            {activeTab === "meeting" ? "per hour" : "per month"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Dynamic Details based on Tab */}
                    {activeTab === "coworking" && (
                      <div className="flex flex-col gap-3">
                        {space.floors?.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {space.floors.map((floor: any, fIdx: number) => (
                              <div
                                key={fIdx}
                                className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm"
                              >
                                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-50">
                                  <span className="text-xs font-black text-slate-900">
                                    Floor {floor.number}
                                  </span>
                                  <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                                    {floor.tables?.length || 0} Tables
                                  </span>
                                </div>
                                <div className="space-y-1.5">
                                  {floor.tables?.length > 0 ? (
                                    floor.tables.map(
                                      (table: any, tIdx: number) => (
                                        <div
                                          key={tIdx}
                                          className="flex justify-between items-center text-[11px]"
                                        >
                                          <span className="text-slate-500 font-medium">
                                            Table{" "}
                                            {table.tableNumber ||
                                              table.number ||
                                              tIdx + 1}
                                          </span>
                                          <span className="font-black text-slate-700">
                                            {table.seats?.length || 0} Seats
                                          </span>
                                        </div>
                                      ),
                                    )
                                  ) : (
                                    <div className="text-[10px] text-slate-400 italic">
                                      No tables configured
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-4 text-center bg-white rounded-xl border border-dashed border-slate-200">
                            <p className="text-xs text-slate-400 font-medium">
                              No floor configuration detected
                            </p>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-[11px] font-black text-slate-500 bg-[#3FA69E]/5 p-3 rounded-xl border border-[#3FA69E]/10">
                          <span className="uppercase tracking-widest">
                            Total Inventory Yield
                          </span>
                          <span className="text-[#0A2A1E]">
                            {space.capacity || 0} Workstations
                          </span>
                        </div>
                      </div>
                    )}

                    {activeTab === "meeting" && (
                      <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                              Max Occupancy
                            </p>
                            <div className="flex items-center gap-2">
                              <Users size={14} className="text-[#3FA69E]" />
                              <span className="text-sm font-black text-slate-900">
                                {space.capacity || "N/A"} Persons
                              </span>
                            </div>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                              Operational Window
                            </p>
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-[#3FA69E]" />
                              <span className="text-sm font-black text-slate-900">
                                {space.operatingHours?.openTime || "09:00"} -{" "}
                                {space.operatingHours?.closeTime || "18:00"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "virtual" && (
                      <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-[#3FA69E]" />
                              <span className="text-xs font-bold text-slate-500">
                                GST Registration
                              </span>
                            </div>
                            <span className="text-sm font-black text-[#0A2A1E]">
                              ₹{space.finalGstPricePerYear || 0}/yr
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-[#3FA69E]" />
                              <span className="text-xs font-bold text-slate-500">
                                Business Address
                              </span>
                            </div>
                            <span className="text-sm font-black text-[#0A2A1E]">
                              ₹{space.finalBrPricePerYear || 0}/yr
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-[#3FA69E]" />
                              <span className="text-xs font-bold text-slate-500">
                                Mailing Address
                              </span>
                            </div>
                            <span className="text-sm font-black text-[#0A2A1E]">
                              ₹{space.finalMailingPricePerYear || 0}/yr
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge
                          variant="outline"
                          className={
                            space.isActive !== false
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100 text-[9px] font-black"
                              : "bg-rose-50 text-rose-600 border-rose-100 text-[9px] font-black"
                          }
                        >
                          {space.isActive !== false
                            ? "STATION ACTIVE"
                            : "INACTIVE"}
                        </Badge>
                      </div>
                      <button
                        onClick={() =>
                          navigate(
                            `/spaceportal/space-management/add?id=${property._id}&step=${activeTab}`,
                          )
                        }
                        className="text-[10px] font-black text-[#3FA69E] hover:text-[#0A2A1E] flex items-center gap-1 transition-colors uppercase tracking-widest"
                      >
                        Manage Asset <ChevronRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}

                {spaces.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-16 text-center"
                  >
                    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <LayoutGrid className="text-slate-300" size={24} />
                    </div>
                    <h3 className="text-base font-black text-slate-900">
                      No {activeTab} Units Detected
                    </h3>
                    <p className="text-slate-500 mt-1 max-w-xs mx-auto text-xs font-medium">
                      Add new units to increase your property availability.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* High Fidelity Bookings List */}
      <motion.section
        variants={itemVariants}
        className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-10"
      >
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Recent Activity
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Tracking {bookings.length} active engagements
            </p>
          </div>
          <button className="px-6 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-[#0A2A1E] hover:bg-slate-50 transition-colors">
            View Expanded Log
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Identifier
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Client Profile
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Asset Class
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Value
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr
                    key={booking._id || booking.id}
                    className="group hover:bg-[#3FA69E]/5 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">
                        #
                        {booking.bookingNumber ||
                          booking._id?.substring(0, 8) ||
                          "N/A"}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                        <Clock size={10} />{" "}
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#0A2A1E] text-white flex items-center justify-center text-xs font-black shadow-lg">
                          {booking.user?.fullName?.[0] || "G"}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">
                            {booking.user?.fullName || "Guest Account"}
                          </p>
                          <p className="text-xs font-semibold text-slate-400 tracking-tight">
                            {booking.user?.email || "No email provided"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider">
                        {booking.type?.replace("_", " ") || "UNSPECIFIED"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-slate-900 flex items-center gap-1">
                        <IndianRupee size={12} className="text-[#3FA69E]" />
                        {(
                          booking.plan?.finalPrice ||
                          booking.plan?.price ||
                          0
                        ).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${booking.status === "active" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300"}`}
                        />
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${booking.status === "active" ? "text-emerald-600" : "text-slate-500"}`}
                        >
                          {booking.status || "PENDING"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <Activity size={48} />
                      <p className="text-lg font-bold">
                        No active engagements detected
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.section>
    </motion.div>
  );
}
