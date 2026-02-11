import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardRow from "@/components/affiliatePortal/LeaderboardRow";

const NATIONAL_DATA = [
    {
        rank: 1,
        name: "Rajesh Kumar",
        location: "Mumbai",
        referrals: 156,
        earnings: "₹12.5L",
        conversion: "42%",
        initials: "RK",
    },
    {
        rank: 2,
        name: "Priya Sharma",
        location: "Delhi",
        referrals: 134,
        earnings: "₹10.2L",
        conversion: "38%",
        initials: "PS",
    },
    {
        rank: 3,
        name: "Amit Patel",
        location: "Bangalore",
        referrals: 98,
        earnings: "₹8.5L",
        conversion: "45%",
        initials: "AP",
    },
    {
        rank: 4,
        name: "Sneha Reddy",
        location: "Hyderabad",
        referrals: 87,
        earnings: "₹6.8L",
        conversion: "35%",
        initials: "SR",
    },
];

const REGIONAL_DATA = [
    {
        rank: 1,
        name: "You",
        location: "Mumbai",
        referrals: 34,
        earnings: "₹2.8L",
        conversion: "38%",
        initials: "Y",
        isUser: true,
    },
    {
        rank: 2,
        name: "Arun Mehta",
        location: "Mumbai",
        referrals: 28,
        earnings: "₹2.2L",
        conversion: "35%",
        initials: "AM",
    },
    {
        rank: 3,
        name: "Kavita Joshi",
        location: "Pune",
        referrals: 24,
        earnings: "₹1.9L",
        conversion: "32%",
        initials: "KJ",
    },
    {
        rank: 4,
        name: "Rohit Desai",
        location: "Mumbai",
        referrals: 21,
        earnings: "₹1.6L",
        conversion: "30%",
        initials: "RD",
    },
];

const LeaderBoard = () => {
    return (
        <div className="mx-auto min-h-screen p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Affiliate{" "}
                    <span className="italic text-[#5bb09c]">Leaderboard</span>
                </h1>
                <p className="text-gray-500 mt-2 font-medium">
                    See how you rank against other affiliates
                </p>
            </div>

            {/* User Position Hero Card */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#5bb09c]/10 text-[#5bb09c] rounded-full flex items-center justify-center text-2xl font-bold">
                        #8
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            Your Position (National)
                        </h3>
                        <p className="text-gray-400 font-medium">
                            Top 10% of all affiliates
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">₹2.8L</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                        Total Earnings
                    </p>
                </div>
            </div>

            {/* Leaderboard Tabs */}
            <Tabs defaultValue="national" className="w-full">
                <TabsList className="bg-gray-100/50 p-1 mb-6">
                    <TabsTrigger value="national">National</TabsTrigger>
                    <TabsTrigger value="regional">Regional (West)</TabsTrigger>
                </TabsList>

                <TabsContent
                    value="national"
                    className="space-y-4 outline-none"
                >
                    {NATIONAL_DATA.map((item) => (
                        <LeaderboardRow key={item.rank} {...item} />
                    ))}
                </TabsContent>

                <TabsContent
                    value="regional"
                    className="space-y-4 outline-none"
                >
                    {REGIONAL_DATA.map((item) => (
                        <LeaderboardRow key={item.rank} {...item} />
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default LeaderBoard;
