import React from "react";
import { X, MapPin, Star, Users, Calendar, BarChart2, Edit, DoorClosed, Percent } from "lucide-react";
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
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <div
                        className="relative bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-border text-slate-900 animate-in zoom-in-95 duration-300"
                    >
                        {/* Header Section */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                                Space Details
                            </h2>
                            <div className="flex items-center gap-3">
                                <Badge className="bg-emerald-100 text-emerald-600 hover:bg-emerald-100 border-none font-bold px-3 py-1 rounded-full text-xs">
                                    Active
                                </Badge>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="p-8 space-y-8">
                                {/* Hero Image */}
                                <div className="w-full aspect-[21/9] rounded-[2rem] overflow-hidden shadow-sm">
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
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                            {space.name}
                                        </h1>
                                        <Badge variant="outline" className="bg-slate-50 px-3 py-1 rounded-full text-slate-600 font-bold border-slate-200">
                                            Premium
                                        </Badge>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                                            <MapPin className="w-4 h-4" />
                                            <span>{space.location || `${space.city}, ${space.area}`}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                            <span className="font-bold text-slate-700">{space.rating || 4.8}</span>
                                            <span className="font-medium text-slate-400">rating</span>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-slate-100" />

                                {/* Main Stats Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50/50 p-6 rounded-2xl text-center space-y-2">
                                        <Users className="w-6 h-6 mx-auto text-slate-400" />
                                        <div className="space-y-0.5">
                                            <p className="text-2xl font-bold text-slate-900">
                                                {space.workstations || 50}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                Workstations
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50/50 p-6 rounded-2xl text-center space-y-2">
                                        <DoorClosed className="w-6 h-6 mx-auto text-slate-400" />
                                        <div className="space-y-0.5">
                                            <p className="text-2xl font-bold text-slate-900">
                                                {space.meetingRooms || 4}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                Meeting Rooms
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Performance Section */}
                                <div className="space-y-5">
                                    <h3 className="text-sm font-bold text-slate-800">
                                        This Month
                                    </h3>
                                    
                                    <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-slate-400">Bookings</span>
                                            <span className="text-sm font-bold text-slate-800">23</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-slate-400">Revenue</span>
                                            <span className="text-sm font-bold text-emerald-500">₹1.2L</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-slate-400">New Clients</span>
                                            <span className="text-sm font-bold text-slate-800">8</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-slate-400">Avg Rating</span>
                                            <span className="text-sm font-bold text-slate-800">4.8</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12 rounded-xl border-slate-200 text-slate-700 font-bold hover:bg-slate-50 flex items-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" /> Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-12 rounded-xl border-slate-200 text-slate-700 font-bold hover:bg-slate-50 flex items-center gap-2"
                                    >
                                        <Calendar className="w-4 h-4" /> Calendar
                                    </Button>
                                    <Button
                                        className="flex-1 h-12 rounded-xl bg-[#344b41] hover:bg-[#2a3c34] text-white font-bold transition-all shadow-lg shadow-slate-100 flex items-center gap-2"
                                    >
                                        <BarChart2 className="w-4 h-4" /> Analytics
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};


