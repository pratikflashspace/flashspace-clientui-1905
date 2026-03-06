import React from "react";
import {
    Medal,
    Crown,
    Star
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const salesLeaders = [
    { rank: 1, name: "Rahul Sharma", role: "Sales Lead", deals: 45, revenue: "₹8.5L", target: 105, streak: 12 },
    { rank: 2, name: "Priya Patel", role: "Sales Executive", deals: 38, revenue: "₹6.2L", target: 98, streak: 8 },
    { rank: 3, name: "Amit Kumar", role: "Sales Executive", deals: 32, revenue: "₹5.1L", target: 92, streak: 5 },
    { rank: 4, name: "Neha Reddy", role: "Sales Executive", deals: 28, revenue: "₹4.5L", target: 85, streak: 3 },
    { rank: 5, name: "Vikram Singh", role: "Sales Executive", deals: 25, revenue: "₹4.0L", target: 78, streak: 2 },
];

const supportLeaders = [
    { rank: 1, name: "Meera Joshi", role: "Support Lead", tickets: 156, rating: 4.9, resolution: "2.1 hrs", streak: 15 },
    { rank: 2, name: "Arjun Kapoor", role: "Support Agent", tickets: 142, rating: 4.8, resolution: "2.4 hrs", streak: 10 },
    { rank: 3, name: "Sneha Das", role: "Support Agent", tickets: 128, rating: 4.7, resolution: "2.8 hrs", streak: 7 },
    { rank: 4, name: "Raj Verma", role: "Support Agent", tickets: 115, rating: 4.6, resolution: "3.0 hrs", streak: 4 },
    { rank: 5, name: "Pooja Mehta", role: "Support Agent", tickets: 98, rating: 4.5, resolution: "3.2 hrs", streak: 2 },
];

const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return null;
};

const getRankBg = (rank: number) => {
    if (rank === 1) return "bg-yellow-50 border-yellow-200";
    if (rank === 2) return "bg-gray-50 border-gray-200";
    if (rank === 3) return "bg-amber-50 border-amber-200";
    return "bg-background border-border";
};

const Leaderboard = () => {
    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                    Team <span className="text-primary italic">Leaderboard</span>
                </h1>
                <p className="text-muted-foreground mt-2">
                    Track performance and celebrate top performers
                </p>
            </div>

            <Tabs defaultValue="sales" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="sales">Sales Team</TabsTrigger>
                    <TabsTrigger value="support">Support Team</TabsTrigger>
                </TabsList>

                <TabsContent value="sales">
                    <div className="space-y-4">
                        {salesLeaders.map((person) => (
                            <div key={person.rank} className={`rounded-xl p-5 border ${getRankBg(person.rank)}`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-lg">
                                        {getRankIcon(person.rank) || `#${person.rank}`}
                                    </div>
                                    <Avatar className="w-12 h-12">
                                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                                            {person.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-foreground">{person.name}</h3>
                                            {person.streak >= 5 && (
                                                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                                                    🔥 {person.streak} day streak
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{person.role}</p>
                                    </div>
                                    <div className="grid grid-cols-4 gap-8 text-center">
                                        <div>
                                            <p className="text-2xl font-extrabold text-foreground">{person.deals}</p>
                                            <p className="text-xs text-muted-foreground">Deals</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-extrabold text-foreground">{person.revenue}</p>
                                            <p className="text-xs text-muted-foreground">Revenue</p>
                                        </div>
                                        <div>
                                            <p className={`text-2xl font-extrabold ${person.target >= 100 ? 'text-green-600' : 'text-foreground'}`}>
                                                {person.target}%
                                            </p>
                                            <p className="text-xs text-muted-foreground">Target</p>
                                        </div>
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="support">
                    <div className="space-y-4">
                        {supportLeaders.map((person) => (
                            <div key={person.rank} className={`rounded-xl p-5 border ${getRankBg(person.rank)}`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-lg">
                                        {getRankIcon(person.rank) || `#${person.rank}`}
                                    </div>
                                    <Avatar className="w-12 h-12">
                                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                                            {person.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-foreground">{person.name}</h3>
                                            {person.streak >= 5 && (
                                                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                                                    🔥 {person.streak} day streak
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{person.role}</p>
                                    </div>
                                    <div className="grid grid-cols-4 gap-8 text-center">
                                        <div>
                                            <p className="text-2xl font-extrabold text-foreground">{person.tickets}</p>
                                            <p className="text-xs text-muted-foreground">Tickets</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-extrabold text-foreground">{person.rating}</p>
                                            <p className="text-xs text-muted-foreground">Rating</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-extrabold text-foreground">{person.resolution}</p>
                                            <p className="text-xs text-muted-foreground">Avg Time</p>
                                        </div>
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Leaderboard;
