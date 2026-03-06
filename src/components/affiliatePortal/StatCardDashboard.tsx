import { TrendingUp } from "lucide-react";

const StatCardDashboard = ({ label, value, trend, icon: Icon, delay }: any) => (
    <div
        className="bg-white p-6 rounded-2xl border border-gray-100/80 shadow-sm hover:shadow-md transition-all duration-300 group animate-fade-in-up"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="flex justify-between items-start mb-4">
            <span className="text-[#64748b] font-medium text-sm">{label}</span>
            <div className="w-10 h-10 flex items-center justify-center bg-[#f1f5f9] rounded-full transition-colors group-hover:bg-[#e2e8f0]">
                <Icon
                    size={20}
                    className="text-[#64748b]"
                />
            </div>
        </div>
        <div className="space-y-2">
            <h3 className="text-3xl font-black text-[#1a2d1d]" style={{ fontFamily: "'Inter Tight', sans-serif" }}>{value}</h3>
            {trend && (
                <div className="flex items-center gap-1.5 text-sm font-bold text-[#10b981]">
                    <TrendingUp size={16} />
                    <span>{trend}</span>
                </div>
            )}
        </div>
    </div>
);

export default StatCardDashboard;