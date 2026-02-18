import { Send, Eye, CheckCircle, PieChart } from "lucide-react";

interface QuotationStatsData {
    totalSent: number;
    viewRate: number;
    accepted: number;
    conversion: number;
}

interface QuotationStatsProps {
    data?: QuotationStatsData;
}

const QuotationStats = ({ data }: QuotationStatsProps) => {
    const stats = [
        {
            label: "Total Sent",
            value: `${data?.totalSent ?? 89}`,
            icon: Send,
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            label: "View Rate",
            value: `${data?.viewRate ?? 67}%`,
            icon: Eye,
            color: "text-amber-500",
            bg: "bg-amber-50",
        },
        {
            label: "Accepted",
            value: `${data?.accepted ?? 34}`,
            icon: CheckCircle,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
        },
        {
            label: "Conversion",
            value: `${data?.conversion ?? 38}%`,
            icon: PieChart, // Or any other suitable icon for conversion
            color: "text-[#5bb09c]",
            bg: "bg-[#5bb09c]/10",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 h-full">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-[#5bb09c]/30 transition-colors group"
                >
                    <div
                        className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}
                    >
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                            {stat.label}
                        </p>
                        <p className="text-xl font-bold text-slate-900 mt-1">
                            {stat.value}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default QuotationStats;
