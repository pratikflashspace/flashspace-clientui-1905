import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Star, Calendar, MapPin, Users, Phone } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface MeetingRoomHeroProps {
    onCitySearch: (city: string) => void;
    currentCity: string;
}

const MeetingRoomHero = ({ onCitySearch, currentCity }: MeetingRoomHeroProps) => {
    const [selectedCity, setSelectedCity] = useState(currentCity);

    useEffect(() => {
        setSelectedCity(currentCity);
    }, [currentCity]);

    const cities = [
        "Ahmedabad", "Bangalore", "Chandigarh", "Chennai", "Delhi",
        "Gurgaon", "Hyderabad", "Jaipur", "Mumbai", "Pune", "Ranchi"
    ];

    return (
        <div className="relative bg-[#0a0a0a] min-h-[600px] flex items-center overflow-hidden font-sans">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000"
                    alt="Office Background"
                    className="w-full h-full object-cover opacity-40 brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                    {/* Left Content */}
                    <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-bold tracking-wider uppercase">
                            <Star className="w-3.5 h-3.5 fill-yellow-400" />
                            <span>Instant Booking Available</span>
                        </div>

                        {/* Headlines */}
                        <div className="space-y-2">
                            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight">
                                Professional <br />
                                Meeting Rooms
                            </h1>
                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#FFD700]">
                                On Your Schedule
                            </h2>
                        </div>

                        {/* Description */}
                        <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
                            Book premium meeting rooms and conference spaces by the hour or day. Experience seamless productivity in fully equipped spaces.
                        </p>

                        {/* Feature List */}
                        <ul className="space-y-4 pt-2">
                            {[
                                "Ready for use whenever required",
                                "Fully equipped with Premium Amenities",
                                "Prime locations — Pan-India access"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-white">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/50">
                                        <Check className="w-4 h-4 text-yellow-500" />
                                    </div>
                                    <span className="font-medium text-gray-100">{item}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10 max-w-lg">
                            <div>
                                <div className="text-3xl font-bold text-white">10k+</div>
                                <div className="text-sm text-gray-400 mt-1">Happy Clients</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">1k+</div>
                                <div className="text-sm text-gray-400 mt-1">Locations</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">3k+</div>
                                <div className="text-sm text-gray-400 mt-1">5 Star Reviews</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Form Card */}
                    <div className="lg:col-span-5 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                        <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden group hover:border-yellow-500/30 transition-all duration-300">
                            {/* Glow Effect */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-yellow-500/20 transition-all"></div>

                            <div className="relative z-10 space-y-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-white flex flex-wrap gap-x-2">
                                        Get a Call Back for
                                        <span className="text-yellow-400">Meeting Rooms</span>
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-2">
                                        Available by the hour, day or as long as you need. Instant response guaranteed.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Input
                                            placeholder="Your Name"
                                            className="bg-[#1f1f1f] border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-yellow-500/50 focus:ring-yellow-500/20"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Input
                                            placeholder="Mobile Number"
                                            type="tel"
                                            className="bg-[#1f1f1f] border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-yellow-500/50 focus:ring-yellow-500/20"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Select value={selectedCity} onValueChange={onCitySearch}>
                                            <SelectTrigger className="bg-[#1f1f1f] border-white/10 text-white h-12 rounded-xl focus:ring-yellow-500/20">
                                                <SelectValue placeholder="City" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#1f1f1f] border-white/10 text-white">
                                                {cities.map(c => <SelectItem key={c} value={c} className="hover:bg-white/10">{c}</SelectItem>)}
                                            </SelectContent>
                                        </Select>

                                        <Select>
                                            <SelectTrigger className="bg-[#1f1f1f] border-white/10 text-white h-12 rounded-xl focus:ring-yellow-500/20">
                                                <SelectValue placeholder="2-5 People" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#1f1f1f] border-white/10 text-white">
                                                <SelectItem value="1" className="hover:bg-white/10">1 Person</SelectItem>
                                                <SelectItem value="small" className="hover:bg-white/10">2-5 People</SelectItem>
                                                <SelectItem value="medium" className="hover:bg-white/10">6-10 People</SelectItem>
                                                <SelectItem value="large" className="hover:bg-white/10">10+ People</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="relative">
                                        <Input
                                            type="date"
                                            className="bg-[#1f1f1f] border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl focus:border-yellow-500/50 focus:ring-yellow-500/20 w-full block"
                                            style={{
                                                colorScheme: "dark"
                                            }}
                                        />
                                    </div>
                                </div>

                                <Button className="w-full bg-[#FFD700] hover:bg-[#F4C400] text-black font-bold h-12 text-lg rounded-xl shadow-lg hover:shadow-yellow-500/20 transition-all transform hover:scale-[1.02]">
                                    Request Call Back
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MeetingRoomHero;
