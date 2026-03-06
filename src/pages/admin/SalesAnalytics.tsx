import React, { useEffect, useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    CreditCard,
    Calendar as CalendarIcon,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Download,
    Target,
    Wallet,
    Trophy,
    Loader2,
    Search,
    Package,
    DollarSign,
    X,
    Building2,
    Clock
} from 'lucide-react';
import { adminService, AdminDashboardStats, BookingData } from '@/services/admin.service';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calender";
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Cell,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

const chartConfig = {
    revenue: {
        label: "Revenue",
        color: "#3FA69E",
    },
    bookings: {
        label: "Bookings",
        color: "#1D3932",
    },
} satisfies ChartConfig;

export default function BookingAnalysis() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<AdminDashboardStats | null>(null);
    const [bookings, setBookings] = useState<BookingData[]>([]);
    const [revenueByCategory, setRevenueByCategory] = useState<any[]>([]);
    const [kpiData, setKpiData] = useState({
        revenueMTD: 0,
        avgDealSize: 0,
        conversionRate: 0
    });

    // Booking Table State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [date, setDate] = useState<DateRange | undefined>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, bookingsRes] = await Promise.all([
                    adminService.getDashboardStats(),
                    adminService.getAllBookings()
                ]);

                if (statsRes.success && statsRes.data) {
                    setStats(statsRes.data);
                }

                if (bookingsRes.success && bookingsRes.data) {
                    const allBookings = bookingsRes.data.bookings || [];
                    setBookings(allBookings);
                    processBookingData(allBookings, statsRes.data);
                }
            } catch (error) {
                console.error("Failed to fetch analytics data", error);
                toast.error("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const processBookingData = (data: any[], dashboardStats: AdminDashboardStats | undefined) => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let mtdRevenue = 0;
        const categoryMap = new Map<string, { bookings: number, revenue: number }>();

        data.forEach(booking => {
            const price = Number(booking.plan?.price || booking.amount || 0);
            const date = new Date(booking.createdAt);

            // MTD Revenue
            if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                mtdRevenue += price;
            }

            // Category Breakdown
            const category = booking.type || booking.plan?.name || "Other";
            const current = categoryMap.get(category) || { bookings: 0, revenue: 0 };
            categoryMap.set(category, {
                bookings: current.bookings + 1,
                revenue: current.revenue + price
            });
        });

        // KPI Calculations
        const totalBookings = dashboardStats?.totalBookings || data.length || 0;
        const totalRevenue = dashboardStats?.totalRevenue || 0;
        const totalUsers = dashboardStats?.totalUsers || 1;

        setKpiData({
            revenueMTD: mtdRevenue,
            avgDealSize: totalBookings > 0 ? totalRevenue / totalBookings : 0,
            conversionRate: (totalBookings / totalUsers) * 100
        });

        // Format Category Data
        const categoryArray = Array.from(categoryMap.entries()).map(([name, val]) => ({
            name: name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            bookings: val.bookings,
            revenue: val.revenue,
            growth: Math.floor(Math.random() * 20) + 5 // Mock growth
        }));

        setRevenueByCategory(categoryArray);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">Active</Badge>;
            case "pending_kyc":
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0">Pending KYC</Badge>;
            case "pending_payment":
                return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0">Pending Payment</Badge>;
            case "expired":
                return <Badge variant="outline" className="text-gray-500">Expired</Badge>;
            case "cancelled":
                return <Badge variant="destructive">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.spaceSnapshot?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.bookingNumber?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;

        let matchDate = true;
        if (date?.from) {
            const bookingTime = new Date(booking.createdAt).getTime();
            const fromTime = new Date(date.from).setHours(0, 0, 0, 0);
            const toTime = (date.to ? new Date(date.to) : new Date(date.from)).setHours(23, 59, 59, 999);
            matchDate = bookingTime >= fromTime && bookingTime <= toTime;
        }

        return matchesSearch && matchesFilter && matchDate;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto p-6 bg-background space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                    Booking <span className="text-primary italic">Analysis</span>
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Comprehensive performance metrics and data insights
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Bookings"
                    value={stats?.totalBookings?.toLocaleString() || "0"}
                    icon={BarChart3}
                    change={12}
                />
                <StatsCard
                    title="Revenue MTD"
                    value={formatCurrency(kpiData.revenueMTD)}
                    icon={TrendingUp}
                    change={8}
                />
                <StatsCard
                    title="Active Bookings"
                    value={bookings.filter(b => b.status === 'active' || b.status === 'pending_kyc').length}
                    icon={Target}
                    change={5}
                />
                <StatsCard
                    title="Avg Deal Size"
                    value={formatCurrency(kpiData.avgDealSize)}
                    icon={Wallet}
                    change={5}
                />
            </div>

            {/* Distribution and Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Distribution Chart */}
                <div className="bg-background border border-border rounded-[24px] p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-foreground">Booking Distribution</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#1D3932]"></div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Bookings</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#3FA69E]"></div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Revenue</span>
                            </div>
                        </div>
                    </div>

                    <ChartContainer config={chartConfig} className="h-[350px] w-full">
                        <BarChart data={revenueByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tickMargin={15}
                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 600 }}
                            />
                            <YAxis
                                yAxisId="left"
                                axisLine={false}
                                tickLine={false}
                                tickMargin={15}
                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 600 }}
                                tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                axisLine={false}
                                tickLine={false}
                                tickMargin={15}
                                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 600 }}
                            />
                            <ChartTooltip
                                cursor={{ fill: 'hsl(var(--muted)/0.1)', radius: 8 }}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar yAxisId="left" dataKey="revenue" fill="#3FA69E" radius={[6, 6, 0, 0]} barSize={24} />
                            <Bar yAxisId="right" dataKey="bookings" fill="#1D3932" radius={[6, 6, 0, 0]} barSize={24} />
                        </BarChart>
                    </ChartContainer>
                </div>

                {/* Breakdown Table */}
                <div className="bg-background border border-border rounded-[24px] p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-foreground mb-8">Revenue Breakdown</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
                                    <th className="pb-4 pl-2">Category</th>
                                    <th className="pb-4 text-right">Bookings</th>
                                    <th className="pb-4 text-right pr-2">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {revenueByCategory.map((item, i) => (
                                    <tr key={i} className="group hover:bg-muted/30 transition-colors">
                                        <td className="py-5 pl-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                                <span className="font-semibold text-foreground">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 text-right text-muted-foreground font-medium">{item.bookings}</td>
                                        <td className="py-5 text-right text-foreground font-bold pr-2">{formatCurrency(item.revenue)}</td>
                                    </tr>
                                ))}
                                {revenueByCategory.length === 0 && (
                                    <tr><td colSpan={3} className="py-20 text-center text-muted-foreground">No data available</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Recent Bookings History */}
            <div className="bg-background border border-border rounded-[24px] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-border">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <h3 className="text-xl font-bold text-foreground">Recent Bookings</h3>
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search bookings..."
                                    className="pl-10 h-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="h-10 text-xs gap-2">
                                        <CalendarIcon className="w-4 h-4" />
                                        {date?.from ? (
                                            date.to ? `${format(date.from, "LLL dd")} - ${format(date.to, "LLL dd")}` : format(date.from, "LLL dd")
                                        ) : "Custom Date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
                                    <Calendar
                                        mode="range"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>

                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="h-10 px-3 py-2 bg-background border border-border rounded-md text-xs font-medium focus:ring-1 focus:ring-primary outline-none"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="pending_kyc">Pending KYC</option>
                                <option value="pending_payment">Pending Payment</option>
                                <option value="expired">Expired</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/30 border-b border-border text-left">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Booking Number</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">User Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Space</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredBookings.map((booking) => (
                                <tr key={booking.bookingNumber} className="hover:bg-muted/20 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-sm font-bold text-foreground">
                                        #{booking.bookingNumber}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs">
                                                {booking.user?.fullName?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-foreground">{booking.user?.fullName || "Unregistered"}</p>
                                                <p className="text-xs text-muted-foreground">{booking.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-sm text-foreground truncate max-w-[200px]">{booking.spaceSnapshot?.name || "N/A"}</p>
                                            <p className="text-xs text-muted-foreground">{booking.spaceSnapshot?.city}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-foreground">₹{booking.plan?.price?.toLocaleString() || 0}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase font-medium">{booking.plan?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-semibold text-foreground">{format(new Date(booking.createdAt), "dd MMM yyyy")}</span>
                                            <span className="text-[10px] text-muted-foreground mt-0.5">{format(new Date(booking.createdAt), "hh:mm a")}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredBookings.length === 0 && (
                                <tr><td colSpan={6} className="px-6 py-20 text-center text-muted-foreground font-medium">No matching bookings found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}