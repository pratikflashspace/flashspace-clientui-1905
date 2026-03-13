import { TrendingUp } from "lucide-react";

const StatCardDashboard = ({ label, value, trend, icon: Icon, delay }: any) => (
    <div
        className="bg-[#f8f8f8] p-6 rounded-2xl border border-gray-200 shadow transition-all duration-300 group animate-fade-in-up h-[160px] flex flex-col justify-between"
        style={{ animationDelay: `${delay}ms` }}
    >
        {/* Header: Label and Icon */}
        <div className="flex justify-between items-start">
            <span className="text-[#677e73] font-medium text-sm">{label}</span>
            <div className="w-8 h-8 flex items-center justify-center bg-[#f8f8f8] rounded-full transition-colors group-hover:bg-[#e2e8f0]">
                <Icon
                    size={18}
                    className="text-[#677e73]"
                />
            </div>
        </div>

        {/* Value and Trend Container */}
        <div className="flex flex-col gap-2 mt-auto">
            <h3 className="text-[30px] font-black text-[#1f2e26] leading-none" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
                {value}
            </h3>
            {trend && (
                <div className="flex items-center gap-1.5 text-sm font-bold text-[#248f4B]">
                    <TrendingUp size={16} />
                    <span>{trend}</span>
                </div>
            )}
        </div>
    </div>
);

export default StatCardDashboard;