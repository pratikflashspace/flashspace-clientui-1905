import React, { useState, useEffect } from "react";
import { X, MapPin, Star, Users, Calendar, BarChart2, Edit, DoorClosed, Percent, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchPropertyAnalytics } from "@/services/spacePortal/spacePartner.service";

import { useNavigate } from "react-router-dom";

interface SpaceViewModalProps {
    space: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const SpaceViewModal: React.FC<SpaceViewModalProps> = ({
    space,
    open,
    onOpenChange,
}) => {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (open && space?.id) {
            const loadStats = async () => {
                setLoading(true);
                try {
                    const res = await fetchPropertyAnalytics(space.id);
                    if (res?.success) {
                        setAnalytics(res.data);
                    }
                } catch (err) {
                    console.error("Failed to load property stats", err);
                } finally {
                    setLoading(false);
                }
            };
            loadStats();
        }
    }, [open, space?.id]);

    if (!space) return null;

    const onClose = () => onOpenChange(false);
    const derivedStatus =
        typeof space.isActive === "boolean"
            ? space.isActive
                ? "active"
                : "inactive"
            : (() => {
                  const raw = String(space.status || "inactive").toLowerCase();
                  return raw === "active" || raw === "maintenance" || raw === "inactive"
                      ? raw
                      : "inactive";
              })();
    const statusLabel = derivedStatus
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char: string) => char.toUpperCase());
    const statusClass =
        derivedStatus === "active"
            ? "bg-emerald-100 text-emerald-600"
            : derivedStatus === "inactive"
              ? "bg-rose-100 text-rose-600"
              : "bg-slate-100 text-slate-600";

    return (
        <>
            {open && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                    />

                    {/* Modal Content - No scroll wrapper, matches Lovable screenshot perfectly */}
                    <div
                        className="relative bg-white rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden border border-border text-slate-900 animate-in zoom-in-95 duration-300"
                    >
                        {/* Header Section */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                                Space Details
                            </h2>
                            <div className="flex items-center gap-3">
                                <Badge className={`${statusClass} hover:opacity-90 border-none font-bold px-3 py-1 rounded-full text-xs`}>
                                    {statusLabel}
                                </Badge>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Content Area - Scroll wrapper removed, paddings compact to fit completely in viewport */}
                        <div className="p-6 space-y-4">
                            {/* Hero Image - 3/1 banner aspect ratio to save vertical space */}
                            <div className="w-full aspect-[3/1] rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
                                <img
                                    src={space.image || space.images?.[0] || "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80"}
                                    alt={space.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";
                                    }}
                                />
                            </div>

                            {/* Title and Rating Section */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                                        {space.name}
                                    </h1>
                                    <Badge variant="outline" className="bg-slate-50 px-3 py-1 rounded-full text-slate-600 font-bold border-slate-200 text-xs">
                                        {space.type || "Space"}
                                    </Badge>
                                </div>
                                
                                <div className="space-y-0.5 text-sm text-slate-500 font-medium">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span>{space.location || `${space.city}, ${space.area}`}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        <span className="font-bold text-slate-700">{space.rating || analytics?.avgRating || 4.8}</span>
                                        <span className="text-slate-400 font-medium text-xs">rating</span>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Three Specs Cards Grid (Side-by-side) */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-slate-50/50 p-3 rounded-2xl text-center space-y-1 border border-slate-100/50">
                                    <Users className="w-5 h-5 mx-auto text-slate-400" />
                                    <div className="space-y-0.5">
                                        <p className="text-lg font-bold text-slate-900">
                                            {space.workstations || 0}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            Workstations
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-slate-50/50 p-3 rounded-2xl text-center space-y-1 border border-slate-100/50">
                                    <DoorClosed className="w-5 h-5 mx-auto text-slate-400" />
                                    <div className="space-y-0.5">
                                        <p className="text-lg font-bold text-slate-900">
                                            {space.meetingRooms || 0}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            Meeting Rooms
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-slate-50/50 p-3 rounded-2xl text-center space-y-1 border border-slate-100/50">
                                    <Percent className="w-5 h-5 mx-auto text-slate-400" />
                                    <div className="space-y-0.5">
                                        <p className="text-lg font-bold text-slate-900">
                                            {space.occupancy || 72}%
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            Occupancy
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Section */}
                            <div className="bg-slate-50/30 border border-slate-100/80 p-4 rounded-2xl space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-800">
                                        This Month
                                    </h3>
                                    {loading && <Loader2 className="w-4 h-4 animate-spin text-[#344b41]" />}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="text-slate-400 font-medium">Bookings</span>
                                        <span className="font-bold text-slate-800">
                                            {loading ? "..." : (analytics?.monthlyBookings || 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="text-slate-400 font-medium">Revenue</span>
                                        <span className="font-bold text-emerald-500">
                                            {loading ? "..." : `₹${((analytics?.monthlyRevenue || 0) / 1000).toFixed(1)}K`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="text-slate-400 font-medium">New Clients</span>
                                        <span className="font-bold text-slate-800">
                                            {loading ? "..." : (analytics?.newClients || 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-0.5">
                                        <span className="text-slate-400 font-medium">Avg Rating</span>
                                        <span className="font-bold text-slate-800">
                                            {loading ? "..." : (analytics?.avgRating || "4.8")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Action Buttons */}
                            <div className="flex gap-3 pt-1">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        navigate(`/spaceportal/space-management/${space.id}`);
                                        onOpenChange(false);
                                    }}
                                    className="flex-1 h-10 rounded-xl border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 flex items-center justify-center gap-1.5"
                                >
                                    <Edit className="w-4 h-4" /> Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        navigate("/spaceportal/booking-calendar");
                                        onOpenChange(false);
                                    }}
                                    className="flex-1 h-10 rounded-xl border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 flex items-center justify-center gap-1.5"
                                    type="button"
                                >
                                    <Calendar className="w-4 h-4" /> Calendar
                                </Button>
                                <Button
                                    onClick={() => {
                                        navigate("/spaceportal/booking-analytics");
                                        onOpenChange(false);
                                    }}
                                    className="flex-1 h-10 rounded-xl bg-[#344b41] hover:bg-[#2a3c34] text-white text-sm font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                                >
                                    <BarChart2 className="w-4 h-4" /> Analytics
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
