export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down";
  trendLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#2D3F33]/10 dark:border-white/10 bg-white dark:bg-[#0f0f0f] p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[#164e4e]/70 dark:text-gray-400 sm:text-sm">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-[#164e4e] dark:text-white sm:text-4xl">
            {value}
          </p>
        </div>

        <div className="rounded-xl bg-[#2D3F33]/10 dark:bg-white/10 p-2 text-[#2D3F33] dark:text-[#FDE68A] sm:p-3 [&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-6 sm:[&>svg]:w-6">
          {icon}
        </div>
      </div>

      {trend && trendLabel ? (
        <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm">
          <span
            className={`font-semibold ${
              trend === "up" ? "text-[#2D3F33] dark:text-[#FDE68A]" : "text-rose-600"
            }`}
          >
            {trend === "up" ? "↗" : "↘"}
          </span>
          <span
            className={`font-semibold ${
              trend === "up" ? "text-[#2D3F33] dark:text-[#FDE68A]" : "text-rose-600"
            }`}
          >
            {trendLabel}
          </span>
          <span className="text-[#164e4e]/70 dark:text-gray-400">from last month</span>
        </div>
      ) : null}
    </div>
  );
}
