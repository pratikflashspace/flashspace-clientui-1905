import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon?: LucideIcon;
    className?: string;
}

export const StatsCard = ({
    title,
    value,
    change,
    icon: Icon,
    className,
}: StatsCardProps) => {
    const isPositive = change !== undefined && change >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "bg-background border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300",
                className
            )}
        >
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">{title}</span>
                {Icon && (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                    </div>
                )}
            </div>
            <div className="text-3xl font-extrabold text-foreground tracking-tight">
                {value}
            </div>
            {change !== undefined && (
                <div
                    className={cn(
                        "flex items-center gap-1 mt-2 text-sm font-medium",
                        isPositive ? "text-emerald-500" : "text-red-500"
                    )}
                >
                    {isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                    ) : (
                        <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(change)}% from last month</span>
                </div>
            )}
        </motion.div>
    );
};
