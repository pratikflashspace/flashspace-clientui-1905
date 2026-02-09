"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingDown } from "lucide-react";
import { useRef, useState } from "react";
import { useSpring, useMotionValueEvent } from "motion/react";

const chartData = [
  { month: "January", mobile: 245 },
  { month: "February", mobile: 654 },
  { month: "March", mobile: 387 },
  { month: "April", mobile: 521 },
  { month: "May", mobile: 412 },
  { month: "June", mobile: 598 },
  { month: "July", mobile: 312 },
  { month: "August", mobile: 743 },
  { month: "September", mobile: 489 },
  { month: "October", mobile: 476 },
  { month: "November", mobile: 687 },
  { month: "December", mobile: 198 },
];

const chartConfig = {
  mobile: {
    label: "Mobile",
    color: "#FCA070",
  },
} satisfies ChartConfig;

export function ClippedAreaChart({ data }: { data?: { month: string; revenue: number }[] }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [axis, setAxis] = useState(0);

  // Use provided data or fallback to empty array/dummy for initial render if needed
  // But ideally, the parent should pass the data.
  const chartData = data || [];

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#FCA070",
    },
  } satisfies ChartConfig;

  // motion values
  const springX = useSpring(0, {
    damping: 30,
    stiffness: 100,
  });
  const springY = useSpring(0, {
    damping: 30,
    stiffness: 100,
  });

  useMotionValueEvent(springX, "change", (latest) => {
    setAxis(latest);
  });

  const totalRevenue = chartData.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          ₹{springY.get().toLocaleString()}
          <Badge variant="secondary" className="ml-2">
            <TrendingDown className="h-4 w-4" />
            <span>-5.2%</span>
          </Badge>
        </CardTitle>
        <CardDescription>Total revenue for the selected period: ₹{totalRevenue.toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          ref={chartRef}
          className="h-54 w-full"
          config={chartConfig}
        >
          <AreaChart
            className="overflow-visible"
            accessibilityLayer
            data={chartData}
            onMouseMove={(state) => {
              const x = state.activeCoordinate?.x;
              const dataValue = state.activePayload?.[0]?.value;
              if (x && dataValue !== undefined) {
                springX.set(x);
                springY.set(dataValue);
              }
            }}
            onMouseLeave={() => {
              springX.set(chartRef.current?.getBoundingClientRect().width || 0);
              // Set to last data point value or 0 if empty
              springY.jump(chartData.length > 0 ? chartData[chartData.length - 1].revenue : 0);
            }}
            margin={{
              right: 0,
              left: 0,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              horizontalCoordinatesGenerator={(props) => {
                const { height } = props;
                return [0, height - 30];
              }}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Area
              dataKey="revenue"
              type="monotone"
              fill="url(#gradient-cliped-area-revenue)"
              fillOpacity={0.4}
              stroke="var(--color-revenue)"
              clipPath={`inset(0 ${Number(chartRef.current?.getBoundingClientRect().width) - axis
                } 0 0)`}
            />
            <line
              x1={axis}
              y1={0}
              x2={axis}
              y2={"85%"}
              stroke="var(--color-revenue)"
              strokeDasharray="3 3"
              strokeLinecap="round"
              strokeOpacity={0.2}
            />
            <rect
              x={axis - 50}
              y={0}
              width={50}
              height={18}
              fill="var(--color-revenue)"
            />
            <text
              x={axis - 25}
              fontWeight={600}
              y={13}
              textAnchor="middle"
              fill="var(--primary-foreground)"
            >
              ₹{springY.get().toFixed(0)}
            </text>
            {/* this is a ghost line behind graph */}
            <Area
              dataKey="revenue"
              type="monotone"
              fill="none"
              stroke="var(--color-revenue)"
              strokeOpacity={0.1}
            />
            <defs>
              <linearGradient
                id="gradient-cliped-area-revenue"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0}
                />
                <mask id="mask-cliped-area-chart">
                  <rect
                    x={0}
                    y={0}
                    width={"50%"}
                    height={"100%"}
                    fill="white"
                  />
                </mask>
              </linearGradient>
            </defs>
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
