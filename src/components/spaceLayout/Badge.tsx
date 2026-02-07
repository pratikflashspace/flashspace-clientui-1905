import React from "react";

export default function Badge({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "green" | "yellow" | "red" | "gray";
}) {
  const styles: Record<string, string> = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    yellow: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    gray: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
