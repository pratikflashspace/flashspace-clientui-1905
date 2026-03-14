import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Star, Building2, Users, Calendar, TrendingUp, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    if (!space) return null;

    const onClose = () => onOpenChange(false);

    return (
        <>
            {open && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <div
                        className="relative bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-border text-slate-900 opacity-100"
                    >
                        {/* Hero Image Section */}
                        <div className="h-56 bg-muted relative group">
                            <img
                                src={space.image || space.images?.[0] || "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80"}
                                alt={space.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80";
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            
                            <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
                                <div className="space-y-1">
                                    <Badge className="bg-primary/90 text-primary-foreground mb-2 border-none">
                                        {space.type}
                                    </Badge>
                                    <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
                                        {space.name}
                                    </h2>
                                    <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                                        <MapPin className="w-3.5 h-3.5 text-primary" />
                                        {space.location || `${space.city}, ${space.area}`}
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl transition-all text-white active:scale-95 border border-white/20"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                            <div className="p-8">
                                <div className="grid grid-cols-3 gap-6 mb-8">
                                    <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 text-center space-y-1">
                                        <Users className="w-5 h-5 mx-auto text-primary" />
                                        <p className="text-xl font-black text-foreground">
                                            {space.workstations || space.capacity || 0}
                                        </p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            Workstations
                                        </p>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 text-center space-y-1">
                                        <Calendar className="w-5 h-5 mx-auto text-primary" />
                                        <p className="text-xl font-black text-foreground">
                                            {space.meetingRooms || 0}
                                        </p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            Meeting Rooms
                                        </p>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 text-center space-y-1">
                                        <Star className="w-5 h-5 mx-auto text-amber-500 fill-amber-500" />
                                        <p className="text-xl font-black text-foreground">
                                            {space.rating || space.avgRating || 0}
                                        </p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            Rating
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 pb-2 border-b border-border">
                                        <div className="p-2 bg-primary/10 text-primary rounded-lg font-bold text-xs uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> INFO</span>
                                        </div>
                                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest">
                                            Quick Performance
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex justify-between items-center p-4 bg-muted/20 rounded-xl border border-border/30">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                                <span className="text-sm font-bold text-muted-foreground">Occupancy</span>
                                            </div>
                                            <span className="font-black text-foreground">{space.occupancy || 0}%</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-muted/20 rounded-xl border border-border/30">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-primary" />
                                                <span className="text-sm font-bold text-muted-foreground">Status</span>
                                            </div>
                                            <Badge
                                                className={`rounded-full px-3 py-0.5 font-black text-[10px] uppercase border-none ${
                                                    space.status?.toUpperCase() === "ACTIVE"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-amber-100 text-amber-700"
                                                }`}
                                            >
                                                {space.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Additional Space Info placeholder if needed */}
                                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
                                        <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                                            This property is currently being managed by your operations team. All bookings and revenue analytics are synchronized in real-time.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer inside scroll container but feels fixed if max-h is reached */}
                            <div className="p-8 pt-0 flex gap-4">
                                <Button
                                    onClick={onClose}
                                    variant="outline"
                                    className="flex-1 h-14 rounded-xl border-border text-foreground font-bold hover:bg-muted transition-all"
                                >
                                    Close View
                                </Button>
                                <Button
                                    className="flex-1 h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all shadow-lg shadow-primary/10"
                                >
                                    Manage Assets
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

