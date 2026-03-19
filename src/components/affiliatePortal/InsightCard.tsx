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
        className="bg-[#f7f7f7] p-6 md:p-7 rounded-2xl border border-gray-200 shadow transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
        <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-[#1a2d1d] text-base md:text-lg leading-snug max-w-[70%]">
                {title}
            </h3>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-[#fefce8] rounded-full text-[11px] font-bold text-[#854d0e] border border-[#fef08a] tracking-wide uppercase">
                <Sparkles size={12} className="text-[#a16207] fill-[#a16207]" />{" "}
                AI
            </span>
        </div>
        <p className="text-[15px] text-[#64748b] leading-relaxed font-medium">
            {description}
        </p>
    </div>
);

export default InsightCard;
