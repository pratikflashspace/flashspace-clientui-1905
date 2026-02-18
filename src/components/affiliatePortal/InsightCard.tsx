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
        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles size={40} className="text-[#5aa39c]" />
        </div>
        <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="font-bold text-slate-900 group-hover:text-[#5aa39c] transition-colors text-base">
                {title}
            </h3>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full text-[10px] font-bold text-gray-600 border border-gray-200 tracking-wide uppercase">
                <Sparkles size={10} className="text-[#5aa39c] fill-[#5aa39c]" />{" "}
                AI
            </span>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed relative z-10 pr-4">
            {description}
        </p>
    </div>
);

export default InsightCard;
