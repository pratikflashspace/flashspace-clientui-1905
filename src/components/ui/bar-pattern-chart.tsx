
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

// Restore original chartData for desktop and mobile
const chartData = [
  { month: "January", desktop: 342, mobile: 245 },
  { month: "February", desktop: 876, mobile: 654 },
  { month: "March", desktop: 512, mobile: 387 },
  { month: "April", desktop: 629, mobile: 521 },
  { month: "May", desktop: 458, mobile: 412 },
  { month: "June", desktop: 781, mobile: 598 },
  { month: "July", desktop: 394, mobile: 312 },
  { month: "August", desktop: 925, mobile: 743 },
  { month: "September", desktop: 647, mobile: 489 },
  { month: "October", desktop: 532, mobile: 476 },
  { month: "November", desktop: 803, mobile: 687 },
  { month: "December", desktop: 271, mobile: 198 },
];

// Use site orange/gold color palette
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#EDB003", // site orange
  },
  mobile: {
    label: "Mobile",
    color: "#EDB003", // site gold
  },
} satisfies ChartConfig;

export function BarPatternChart() {
  return (
    <Card className="bg-white border border-[#f3f3f3] text-[#172A3A] rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-[#172A3A] text-lg font-bold flex items-center">
          Bar Area Chart
          <Badge
            variant="outline"
            className="text-[#EDB003] bg-[#EDB003]/10 border-none ml-2 font-semibold"
          >
            <TrendingDown className="h-4 w-4 mr-1 text-[#EDB003]" />
            <span>-5.2%</span>
          </Badge>
        </CardTitle>
        <CardDescription className="text-[#EDB003]">
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart accessibilityLayer data={chartData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f3f3" />
            <defs>
              <HatchedBackgroundPattern config={chartConfig} />
            </defs>
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              stroke="#EDB003"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey="mobile"
              type="natural"
              fill={"url(#bar-background-pattern-mobile)"}
              fillOpacity={0.4}
              stroke="#EDB003"
              stackId="a"
              strokeWidth={1.2}
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill={"url(#bar-background-pattern-desktop)"}
              fillOpacity={0.4}
              stroke="#EDB003"
              stackId="a"
              strokeWidth={1.2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const HatchedBackgroundPattern = ({ config }: { config: ChartConfig }) => {
  const items = Object.fromEntries(
    Object.entries(config).map(([key, value]) => [key, value.color])
  );
  return (
    <>
      {Object.entries(items).map(([key, value]) => (
        <g key={key}>
          <linearGradient
            id={`bar-pattern-gradient-${key}`}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop offset="50%" stopColor={value} stopOpacity={0.2} />
            <stop offset="50%" stopColor={value} />
          </linearGradient>
          <pattern
            id={`bar-background-pattern-${key}`}
            x="0"
            y="0"
            width="40"
            height="10"
            patternUnits="userSpaceOnUse"
            overflow="visible"
          >
            <rect
              width="40"
              height="10"
              fill={`url(#bar-pattern-gradient-${key})`}
            />
          </pattern>
        </g>
      ))}
    </>
  );
};
