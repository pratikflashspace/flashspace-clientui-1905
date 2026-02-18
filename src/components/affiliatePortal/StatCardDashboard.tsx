import { TrendingUp } from "lucide-react";

const StatCardDashboard = ({ label, value, trend, icon: Icon, delay }: any) => (
    <div
        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group animate-fade-in-up"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 font-medium text-sm">{label}</span>
            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-[#eaf4f3] transition-colors">
                <Icon
                    size={18}
                    className="text-gray-400 group-hover:text-[#5aa39c] transition-colors"
                />
            </div>
        </div>
        <div className="space-y-2">
            <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
            {trend && (
                <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <TrendingUp size={14} />
                    <span>{trend}</span>
                </div>
            )}
        </div>
    </div>
);

export default StatCardDashboard;