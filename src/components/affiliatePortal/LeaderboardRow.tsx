import React from "react";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardRowProps {
    rank: number;
    name: string;
    location: string;
    referrals: number;
    earnings: string;
    conversion: string;
    isUser?: boolean;
    initials: string;
}

const LeaderboardRow = ({
    rank,
    name,
    location,
    referrals,
    earnings,
    conversion,
    isUser,
    initials,
}: LeaderboardRowProps) => {
    const getRankIcon = () => {
        if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
        if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
        if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
        return <span className="text-gray-400 font-bold text-sm">#{rank}</span>;
    };

    return (
        <div
            className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                isUser
                    ? "bg-teal-50/50 border-teal-100"
                    : "bg-white border-gray-100 hover:border-gray-200"
            }`}
        >
            <div className="flex items-center gap-6 flex-1">
                {/* Rank Icon/Number */}
                <div className="w-8 flex justify-center">{getRankIcon()}</div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs border border-gray-200">
                    {initials}
                </div>

                {/* Name and Location */}
                <div>
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        {name}
                        {isUser && (
                            <span className="bg-[#5bb09c] text-white text-[10px] px-2 py-0.5 rounded-full">
                                You
                            </span>
                        )}
                    </h4>
                    <p className="text-gray-400 text-xs font-medium">
                        {location}
                    </p>
                </div>
            </div>

            {/* Stats Group */}
            <div className="flex items-center gap-12 text-right">
                <div className="w-20">
                    <p className="text-xl font-bold text-gray-900">
                        {referrals}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                        Referrals
                    </p>
                </div>
                <div className="w-24">
                    <p className="text-xl font-bold text-gray-900">
                        {earnings}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                        Earnings
                    </p>
                </div>
                <div className="w-20">
                    <p className="text-xl font-bold text-gray-900">
                        {conversion}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                        Conversion
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardRow;
