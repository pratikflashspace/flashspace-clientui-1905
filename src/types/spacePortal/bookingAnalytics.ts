export type BookingAnalyticsSummary = {
  totalBookings: number;
  activeClients: number;
  cancelledBookings: number;
  pendingRequests: number;

  revenueThisMonth: number;
  revenueLastMonth: number;
};

export type PlanDivision = {
  plan: string;
  bookings: number;
  revenue: number;
};

export type SpaceDivision = {
  space: string;
  bookings: number;
  revenue: number;
};

export type RevenueTrendPoint = {
  month: string; // "Jan", "Feb"
  revenue: number;
  bookings: number;
};

export type BookingAnalytics = {
  summary: BookingAnalyticsSummary;
  planDivision: PlanDivision[];
  spaceDivision: SpaceDivision[];
  revenueTrend: RevenueTrendPoint[];
};
