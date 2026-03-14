import { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard,
  Building2,
  Calendar,
  Users,
  CreditCard,
  MessageSquare,
  Star,
  Ticket,
  Mail,
  UserPlus,
  Settings,
  TrendingUp,
  Clock,
  Loader2,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { FeatureSection } from "@/components/dashboard/FeatureSection";
import { AddSpaceDialog } from "@/components/modals/AddSpaceDialog";
import {
  fetchPartnerDashboard,
  fetchAllPartnerSpaces,
  fetchPartnerActiveRequests,
} from "@/services/spacePortal/spacePartner.service";
import { Client } from "@/types/spacePortal/client";

const spaceManagementFeatures = [
  {
    title: "Add Spaces",
    description:
      "Add spaces in different locations with photos, videos, and virtual tours",
    href: "#add-space",
  },
  {
    title: "Booking Calendar",
    description:
      "Check booking requests for on-demand options and manage availability",
    href: "/spaceportal/booking-calendar",
  },
  {
    title: "Real-time Notifications",
    description:
      "Get notified on each booking stage completion for your clients",
    href: "/spaceportal/booking-calendar",
  },
];

const clientManagementFeatures = [
  {
    title: "Client Details View",
    description:
      "See each client's unique ID, plan, KYC details, and agreement info",
    href: "/spaceportal/clients",
  },
  {
    title: "Direct Client Chat",
    description:
      "Connect with enquiring clients directly and close deals for higher revenue share",
    href: "/spaceportal/client-enquiries",
  },
  {
    title: "Mail & Visit Handling",
    description: "Upload couriers received and track visits for each client",
    href: "/spaceportal/mail-visits",
  },
];

const aiFeatures = [
  {
    title: "Revenue Forecast",
    description:
      "AI-enabled forecasting for quarterly, monthly, and yearly revenue",
    isAI: true,
  },
  {
    title: "Renewal Analysis",
    description:
      "AI predicts client renewal probability based on behavior and activity",
    isAI: true,
  },
  {
    title: "AI Support Agent",
    description:
      "Ask anything about any client - agreement dates, meeting rooms used, and more",
    isAI: true,
  },
  {
    title: "Performance Suggestions",
    description:
      "AI-based suggestions to improve metrics and get better revenue",
    isAI: true,
  },
];

const financialFeatures = [
  {
    title: "Invoice Submission",
    description: "Submit invoices and track payments received and due",
    href: "/spaceportal/invoices-payments",
  },
  {
    title: "Revenue Reports",
    description: "Detailed reports on payments received till date",
    href: "/spaceportal/invoices-payments",
  },
  {
    title: "Feedback Dashboard",
    description:
      "Check client feedback, NPS scores, and improvement suggestions",
    href: "/spaceportal/feedback-nps",
  },
];

const teamFeatures = [
  {
    title: "Team Management",
    description: "Add team members and assign specific access levels",
    href: "/spaceportal/team-management",
  },
  {
    title: "Tasks & Tickets",
    description:
      "View and assign client tickets to team members with deadlines",
    href: "/spaceportal/tasks",
  },
  {
    title: "Partner Profile",
    description: "Manage company details, KYC, documentation, and bank details",
    href: "/spaceportal/profile",
  },
];

export default function Dashboard() {
  const [addSpaceOpen, setAddSpaceOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dashboard Metrics
  const [metrics, setMetrics] = useState({
    activeSpaces: 0,
    totalClients: 0,
    monthlyRevenue: "₹0",
    pendingBookings: 0,
    revenueChange: 0,
    clientsChange: 0,
    spacesChange: 0,
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [dashboardRes, spacesRes, requestsRes] = await Promise.all([
          fetchPartnerDashboard(),
          fetchAllPartnerSpaces(),
          fetchPartnerActiveRequests(),
        ]);

        const clients: Client[] = dashboardRes?.data?.clients || [];
        const spaces = spacesRes?.data || [];
        const requests = requestsRes?.data || [];

        // Calculate Revenue from deal values
        const totalRevenue = clients.reduce(
          (sum, c) => sum + (c.dealValue || 0),
          0,
        );
        const formattedRevenue =
          totalRevenue >= 100000
            ? `₹${(totalRevenue / 100000).toFixed(1)}L`
            : `₹${totalRevenue.toLocaleString()}`;

        setMetrics({
          activeSpaces: spaces.length || 0,
          totalClients: clients.length || 0,
          monthlyRevenue: formattedRevenue,
          pendingBookings: requests.length || 0,
          revenueChange: 15, // Example trend
          clientsChange: 8,
          spacesChange: 12,
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 font-bold text-foreground animate-pulse">
          Analyzing portal performance...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl">
          Space Partner <span className="text-primary italic">Dashboard</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your workspace listings, clients, and revenue
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Active Spaces"
          value={metrics.activeSpaces.toString()}
          change={metrics.spacesChange}
          icon={Building2}
        />
        <StatsCard
          title="Total Clients"
          value={metrics.totalClients.toString()}
          change={metrics.clientsChange}
          icon={Users}
        />
        <StatsCard
          title="Monthly Revenue"
          value={metrics.monthlyRevenue}
          change={metrics.revenueChange}
          icon={TrendingUp}
        />
        <StatsCard
          title="Pending Bookings"
          value={metrics.pendingBookings.toString()}
          icon={Calendar}
        />
      </div>

      {/* Feature Sections */}
      <FeatureSection
        title="AI-Powered Insights"
        description="Leverage AI for smarter business decisions"
        features={aiFeatures}
      />

      <div
        onClick={(e) => {
          const target = e.target as HTMLElement;
          const card = target.closest('[class*="rounded-xl"]');
          if (card) {
            const title = card.querySelector("h3")?.textContent;
            if (title === "Add Spaces") {
              e.stopPropagation();
              setAddSpaceOpen(true);
            }
          }
        }}
      >
        <FeatureSection
          title="Space Management"
          description="Manage all your workspace listings"
          icon={<Building2 className="w-5 h-5 text-primary" />}
          features={spaceManagementFeatures}
        />
      </div>

      <FeatureSection
        title="Client Management"
        description="Handle client relationships effectively"
        icon={<Users className="w-5 h-5 text-primary" />}
        features={clientManagementFeatures}
      />

      <FeatureSection
        title="Financial Management"
        description="Track invoices, payments, and revenue"
        icon={<CreditCard className="w-5 h-5 text-primary" />}
        features={financialFeatures}
      />

      <FeatureSection
        title="Team & Operations"
        description="Manage your team and operations"
        icon={<UserPlus className="w-5 h-5 text-primary" />}
        features={teamFeatures}
      />

      <AddSpaceDialog open={addSpaceOpen} onOpenChange={setAddSpaceOpen} />
    </div>
  );
}
