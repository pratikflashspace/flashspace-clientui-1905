import React from 'react';
import { Sparkles } from "lucide-react";

type InsightType = "renewal" | "crossSell" | "performance" | "revenue";

interface InsightCardProps {
    title: string;
    description: string;
    id: InsightType;
    onClick: (id: InsightType) => void;
}

const InsightCard: React.FC<InsightCardProps> = ({
    title,
    description,
    id,
    onClick,
}) => (
    <div
        onClick={() => onClick(id)}
        className="bg-white border border-[#D4E0D0] rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-5 hover:border-[#36503F]/60 hover:shadow-md transition-all group relative cursor-pointer"
    >
        <div className="flex justify-between items-start mb-2">
            <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-[#1A1A1A] leading-snug">
                {title}
            </h3>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#F0F4EE] rounded-full text-xs font-semibold text-[#36503F] border border-[#D4E0D0]">
                <Sparkles className="w-3 h-3 text-[#36503F] fill-[#36503F]" />
                Ai
            </span>
        </div>
        <p className="text-sm font-medium text-[#6B8F78]">
            {description}
        </p>
    </div>
);

export default InsightCard;
