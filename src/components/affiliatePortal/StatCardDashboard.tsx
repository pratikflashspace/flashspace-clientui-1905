import { TrendingUp } from "lucide-react";

const StatCardDashboard = ({ label, value, trend, icon: Icon, delay }: any) => (
    <div
        className="bg-[#f8f8f8] px-8 py-7 rounded-2xl border border-gray-200 shadow transition-all duration-300 animate-fade-in-up"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-[#6B8F78]">{label}</span>
            <div className="w-8 h-8 rounded-lg bg-[#36503F]/10 flex items-center justify-center">
                <Icon
                    className="w-4 h-4 text-[#36503F]"
                />
            </div>
        </div>
        <div className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
            {value}
        </div>
        {trend && (
            <div className="mt-2 text-sm font-medium text-[#6B8F78]">
                {trend}
            </div>
        )}
    </div>
);

export default StatCardDashboard;