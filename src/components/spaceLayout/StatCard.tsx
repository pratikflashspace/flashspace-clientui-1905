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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-4xl font-bold text-slate-900">{value}</p>
        </div>

        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
          {icon}
        </div>
      </div>

      {trend && trendLabel ? (
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span
            className={`font-semibold ${
              trend === "up" ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {trend === "up" ? "↗" : "↘"}
          </span>
          <span
            className={`font-semibold ${
              trend === "up" ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {trendLabel}
          </span>
          <span className="text-slate-500">from last month</span>
        </div>
      ) : null}
    </div>
  );
}
