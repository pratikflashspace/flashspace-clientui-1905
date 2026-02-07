import type { BookingAnalytics } from "@/types/spacePortal/bookingAnalytics";

export const BOOKING_ANALYTICS: BookingAnalytics = {
  summary: {
    totalBookings: 1240,
    activeClients: 320,
    cancelledBookings: 42,
    pendingRequests: 18,
    revenueThisMonth: 1250000,
    revenueLastMonth: 1080000,
  },

  planDivision: [
    { plan: "Virtual Office Premium", bookings: 420, revenue: 540000 },
    { plan: "Virtual Office Standard", bookings: 310, revenue: 320000 },
    { plan: "Team Space", bookings: 220, revenue: 290000 },
    { plan: "Hot Desk Monthly", bookings: 290, revenue: 100000 },
  ],

  spaceDivision: [
    { space: "Mumbai - BKC", bookings: 500, revenue: 650000 },
    { space: "Delhi - CP", bookings: 350, revenue: 360000 },
    { space: "Bangalore - HSR", bookings: 240, revenue: 180000 },
    { space: "Chennai - Anna Nagar", bookings: 150, revenue: 60000 },
  ],

  revenueTrend: [
    { month: "Sep", revenue: 850000, bookings: 820 },
    { month: "Oct", revenue: 920000, bookings: 900 },
    { month: "Nov", revenue: 980000, bookings: 940 },
    { month: "Dec", revenue: 1080000, bookings: 1020 },
    { month: "Jan", revenue: 1150000, bookings: 1180 },
    { month: "Feb", revenue: 1250000, bookings: 1240 },
  ],
};
