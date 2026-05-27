import { TrendingUp } from "lucide-react";

const StatCardDashboard = ({ label, value, trend, icon: Icon, delay }: any) => (
    <div
        className="bg-white border border-[#D4E0D0] rounded-xl shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] p-6 transition-all hover:shadow-lg"
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
