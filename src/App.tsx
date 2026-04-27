import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DarkModeProvider } from "@/contexts/DarkModeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ChatProvider } from "@/contexts/ChatContext";

import Index from "./pages/Index";
import Services from "./pages/Services";
import ListYourSpace from "./pages/ListYourSpace";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import VirtualOffice from "./pages/services/VirtualOffice";

// import CoworkingSpace from "./pages/services/CoworkingSpace";
import OnDemand from "./pages/services/OnDemand";
import GetWorkspaces from "./pages/services/GetWorkspaces";
import EventSpaces from "./pages/services/EventSpaces";
import BusinessSetup from "./pages/services/BusinessSetup";
import StartChatting from "./pages/StartChatting";
import VirtualOfficeSolution from "./pages/Solutions/virtual-office";
import CoworkingSpaceSolution from "./pages/Solutions/coworking-space";
import OnDemandSolution from "./pages/Solutions/on-demand";
import BusinessSetupSolution from "./pages/Solutions/business-setup";
import PartnerWithUs from "./pages/PatnerWithUs";
import MeetingsRoom from "./pages/Solutions/meetingsroom";
import Dayoffice from "./pages/Solutions/Dayoffice";
import EventSpacePage from "./pages/Solutions/Eventspace";
import SpacePortalLayout from "./layouts/SpacePortalLayout";

//Mouse Follower
import MouseFollower from "./components/MouseFollower";
// Additional Pages
import Career from "./pages/Career";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Bookings from "./pages/Bookings";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import CityListing from "./pages/CityListing";
import AboutUs from "./pages/AboutUs";
import HelpCenter from "./pages/help/HelpCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// --- Client Dashboard Pages ---
import ClientDashboard from "./components/ClientDashboard";
import ScrollToTop from "./components/ScrollToTop";

//-----------spaces---------
import WorkspaceDetail from "./pages/WorkspaceDetail";
import BookingPage from "./pages/BookingPage";
import BookSeatsPage from "./pages/BookSeatsPage";
import CompleteBookingPage from "./pages/CompleteBookingPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentFailedPage from "./pages/PaymentFailedPage";
import AdminDashboard from "./pages/admin/Dashboard";
import PartnersManagement from "./pages/admin/Partners";
import UserManagement from "./pages/admin/UserManagement";
import AdminTeamManagement from "./pages/admin/TeamManagement";
import Coupons from "./pages/admin/Coupons";
import KYCRequests from "./pages/admin/KYCRequests";
import KYCDetail from "./pages/admin/KYCDetail";
import KYCRequestDetails from "./pages/admin/KYCRequestDetails";
import KYCPartnerRequests from "./pages/admin/KYCPartnerRequests";
import SpacePartnerKycDetails from "./pages/admin/SpacePartnerKycDetails";
import SpaceDetail from "./pages/admin/SpaceDetail";
import SpaceManagement from "./pages/admin/SpaceManagement";

import AdminSettings from "./pages/admin/Settings";
import LearningHub from "./pages/admin/learning-hub/LearningHub";
import Clients from "./pages/admin/Clients";
import ClientDetails from "./pages/admin/ClientDetails";
import { AdminRoute } from "./components/auth/AdminRoute";
import AdminLayout from "./components/layouts/AdminLayout";
import SalesAnalytics from "./pages/admin/SalesAnalytics";
import LeadManagement from "./pages/admin/LeadManagement";
import TicketSystem from "./pages/admin/TicketSystem";
import AdminNotifications from "./pages/admin/Notifications";
import AdminPropertyDetails from "./pages/admin/PropertyDetailsAdmin";
import PropertyManagement from "./pages/admin/PropertyManagement";
import AdminInvoices from "./pages/admin/Invoices";
import ReceivablePayable from "./pages/admin/ReceivablePayable";
import BalanceSheet from "./pages/admin/BalanceSheet";

import RevenueDashboard from "./pages/admin/RevenueDashboard";

import SupportChat from "./pages/admin/SupportChat";
import Leaderboard from "./pages/admin/Leaderboard";
import AdminAffiliateManagement from "./pages/admin/AdminAffiliateManagement";
import AdminPartnerInvoices from "./pages/admin/PartnerInvoices";
import DocumentManagement from "./pages/admin/DocumentManagement";

// --- Space Partner Portal Pages ---
import SpacePortalClients from "@/pages/spacePortal/Clients";
import SpacePortalClientDetails from "@/pages/spacePortal/ClientsDetails";
import Dashboard from "./pages/spacePortal/Dashboard";
import Invoices from "./pages/spacePortal/Invoices";
import Calendar from "./pages/spacePortal/Calendar";
import Spaces from "./pages/spacePortal/Spaces";
import Tickets from "./pages/spacePortal/Tickets";
import BookingAnalytics from "./pages/spacePortal/BookingAnalytics";
import ClientEnquiries from "./pages/spacePortal/ClientEnquiries";
import SpacePortalProfile from "./pages/spacePortal/Profile";
import Notifications from "./pages/spacePortal/Notifications";
import SpacePortalSettings from "./pages/spacePortal/Settings";
import SummaryAnalytics from "./pages/spacePortal/SummaryAnalytics";
import AddSpace from "./pages/spacePortal/AddSpace";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "./constants/adminNavItems";
import PropertyDetails from "./pages/spacePortal/PropertyDetails";

import SpacePortalFeedbackNPS from "./pages/spacePortal/FeedbackNPS";
import SpacePortalTicketAndTasks from "./pages/spacePortal/TicketsAndTasks";
import MailAndVisits from "./pages/spacePortal/MailAndVisits";
// import TeamManagement from "./pages/spacePortal/TeamManagement";
import { PartnerRoute } from "./components/auth/PartnerRoute";
import { AffiliateRoute } from "./components/auth/AffiliateRoute";
// import TeamManagement from "./pages/spacePortal/TeamManagement";

// Affiliate Portal

import AffiliateDashboard from "./pages/affiliatePortal/Dashboard";

import BookingManagement from "./pages/affiliatePortal/BookingManagement";
import DashboardRevenue from "./pages/affiliatePortal/RevenueDashboard";

import AffiliateInvoices from "./pages/affiliatePortal/AffiliateInvoices";

import Payouts from "./pages/affiliatePortal/Payouts";

import AffiliateLayout from "./pages/affiliatePortal/AffiliateLayout";

import LeadManagementAffiliate from "./pages/affiliatePortal/LeadManagementAffiliate";

import QuotationGenerator from "./pages/affiliatePortal/QuotationGenerator";

import MarketingTools from "./pages/affiliatePortal/MarketingTools";

import LeaderBoard from "./pages/affiliatePortal/LeaderBoard";

import Support from "./pages/affiliatePortal/Support";
import KycVerification from "./components/Spaces/KycVerification";
import AffiliateKYC from "./pages/affiliatePortal/KYC";
import AffiliateNotifications from "./pages/affiliatePortal/Notifications";
import AffiliateClientManagement from "./pages/affiliatePortal/AffiliateClientManagement";

// Space Components
import SpaceComponent from "./components/Spaces/SpaceComponent";
import CoworkingSpaceComponent from "./components/Spaces/CoworkingSpaceComponent";
import MeetingRoomSpaceComponent from "./components/Spaces/MeetingRoomSpaceComponent";
import TeamManagement from "./pages/spacePortal/TeamManagement.tsx";
// import TeamManagement from "./pages/admin/TeamManagement";
//hello
// --- React Query setup ---
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HotToaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#ffffff",
            color: "#1f2937",
            borderRadius: "16px",
            padding: "20px 32px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            fontSize: "16px",
            fontWeight: "500",
            maxWidth: "400px",
          },
          success: {
            style: {
              background: "#ffffff",
              border: "1px solid #e5e7eb",
            },
            iconTheme: {
              primary: "#10b981",
              secondary: "white",
            },
          },
          error: {
            style: {
              background: "#ffffff",
              border: "1px solid #fecaca",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "white",
            },
          },
        }}
      />
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <DarkModeProvider>
              <NotificationProvider>
                <ChatProvider>
                  <ScrollToTop />
                  {/* <MouseFollower/> */}
                  <Routes>
                    {/* Public Routes */}

                    <Route path="/" element={<Index />} />
                    <Route path="/services" element={<Services />} />

                    <Route
                      path="/services/virtual-office"
                      element={<GetWorkspaces />}
                    />
                    <Route
                      path="/services/coworking-space"
                      element={<GetWorkspaces />}
                    />
                    <Route
                      path="/services/on-demand"
                      element={<GetWorkspaces />}
                    />
                    <Route
                      path="/services/event-spaces"
                      element={<EventSpaces />}
                    />
                    <Route
                      path="/services/business-setup"
                      element={<BusinessSetup />}
                    />
                    <Route
                      path="/Solutions/virtual-office"
                      element={<VirtualOfficeSolution />}
                    />
                    <Route
                      path="/solutions/virtual-office"
                      element={<VirtualOfficeSolution />}
                    />
                    <Route
                      path="/Solutions/coworking-space"
                      element={<CoworkingSpaceSolution />}
                    />
                    <Route
                      path="/solutions/coworking-space"
                      element={<CoworkingSpaceSolution />}
                    />
                    <Route
                      path="/Solutions/on-demand"
                      element={<OnDemandSolution />}
                    />
                    <Route
                      path="/solutions/on-demand"
                      element={<OnDemandSolution />}
                    />
                    <Route
                      path="/Solutions/business-setup"
                      element={<BusinessSetupSolution />}
                    />
                    <Route
                      path="/solutions/business-setup"
                      element={<BusinessSetupSolution />}
                    />

                    <Route
                      path="/Solutions/meetingsroom"
                      element={<MeetingsRoom />}
                    />
                    <Route
                      path="/solutions/meeting-rooms"
                      element={<MeetingsRoom />}
                    />
                    <Route
                      path="/Solutions/day-office"
                      element={<Dayoffice />}
                    />
                    <Route
                      path="/solutions/day-passes"
                      element={<Dayoffice />}
                    />
                    <Route
                      path="/Solutions/eventspace"
                      element={<EventSpacePage />}
                    />
                    <Route
                      path="/solutions/eventspace"
                      element={<EventSpacePage />}
                    />

                    {/* Spaces*/}
                    <Route
                      path="/space/:id"
                      element={<WorkspaceDetail type="virtual-office" />}
                    />
                    <Route
                      path="/coworking-space/:id"
                      element={<WorkspaceDetail type="coworking" />}
                    />
                    <Route
                      path="/meeting-room/:id"
                      element={<WorkspaceDetail type="on-demand" />}
                    />
                    <Route path="/booking/:id" element={<BookingPage />} />
                    <Route
                      path="/booking/:id/complete"
                      element={<CompleteBookingPage />}
                    />

                    {/* Payment Routes */}
                    <Route
                      path="/payment/success"
                      element={<PaymentSuccessPage />}
                    />
                    <Route
                      path="/payment/failed"
                      element={<PaymentFailedPage />}
                    />

                    <Route path="/city-listing" element={<CityListing />} />
                    <Route path="/career" element={<Career />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/help" element={<HelpCenter />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />

                    {/* Auth Routes */}
                    <Route path="/login" element={<Index openLogin={true} />} />
                    <Route
                      path="/signup"
                      element={<Index openSignup={true} />}
                    />
                    <Route path="/verify-otp" element={<VerifyOTP />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route
                      path="/reset-password"
                      element={<ResetPassword />}
                    />

                    <Route
                      path="/list-your-space"
                      element={<ListYourSpace />}
                    />
                    <Route path="/partner" element={<PartnerWithUs />} />
                    <Route path="/coming-soon" element={<ComingSoon />} />
                    <Route path="/start-chatting" element={<StartChatting />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/bookings" element={<Bookings />} />
                      <Route path="/community" element={<Community />} />
                      <Route path="/settings" element={<Settings />} />

                      {/* Client Dashboard Routes - Protected */}
                      <Route
                        path="/dashboard/*"
                        element={<ClientDashboard />}
                      />
                    </Route>

                    {/* Admin Routes - Protected (RBAC) */}
                    <Route element={<AdminRoute />}>
                      <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="partners" element={<PartnersManagement />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="team" element={<AdminTeamManagement />} />
                        <Route path="kyc-requests" element={<KYCRequests />} />
                        <Route
                          path="kyc-requests/:id"
                          element={<KYCDetail />}
                        />
                        <Route
                          path="kyc-partners"
                          element={<KYCPartnerRequests />}
                        />
                        <Route
                          path="kyc-partners/:id"
                          element={<SpacePartnerKycDetails />}
                        />
                        <Route path="spaces" element={<SpaceManagement />} />
                        <Route
                          path="spaces/add"
                          element={
                            <DashboardLayout
                              portalName="Admin Portal"
                              portalDescription="Manage FlashSpace Platform"
                              navItems={ADMIN_NAV_ITEMS}
                            >
                              <AddSpace />
                            </DashboardLayout>
                          }
                        />
                        <Route
                          path="space-details/:id"
                          element={<SpaceDetail />}
                        />
                        <Route
                          path="property-details/:id"
                          element={<AdminPropertyDetails />}
                        />
                        <Route
                          path="manage-property/:id"
                          element={<PropertyManagement />}
                        />
                        <Route path="settings" element={<AdminSettings />} />
                        <Route path="clients" element={<Clients />} />
                        <Route path="clients/:id" element={<ClientDetails />} />
                        <Route path="coupons" element={<Coupons />} />
                        <Route path="learning-hub" element={<LearningHub />} />
                        <Route
                          path="sales-analytics"
                          element={<SalesAnalytics />}
                        />
                        <Route path="leaderboard" element={<Leaderboard />} />
                        <Route path="support" element={<SupportChat />} />
                        <Route path="revenue" element={<RevenueDashboard />} />
                        <Route path="tickets" element={<TicketSystem />} />
                        <Route
                          path="notifications"
                          element={<AdminNotifications />}
                        />
                        <Route path="invoices" element={<AdminInvoices />} />
                        <Route path="finance" element={<ReceivablePayable />} />
                        <Route path="balance" element={<BalanceSheet />} />
                        <Route path="leads" element={<LeadManagement />} />
                        <Route
                          path="affiliates"
                          element={<AdminAffiliateManagement />}
                        />
                        <Route path="partner-invoices" element={<AdminPartnerInvoices />} />
                        <Route
                          path="documents"
                          element={
                            <DashboardLayout
                              portalName="FlashSpace Admin"
                              portalDescription="Complete platform management"
                              navItems={ADMIN_NAV_ITEMS}
                            >
                              <DocumentManagement />
                            </DashboardLayout>
                          }
                        />
                        <Route path="*" element={<AdminDashboard />} />
                      </Route>
                    </Route>

                    {/* Space Partner Protected Routes */}
                    <Route element={<PartnerRoute />}>
                      <Route
                        path="/spaceportal"
                        element={<SpacePortalLayout />}
                      >
                        <Route
                          index
                          element={<Navigate to="dashboard" replace />}
                        />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route
                          path="clients"
                          element={<SpacePortalClients />}
                        />
                        <Route
                          path="clients/:clientId"
                          element={<SpacePortalClientDetails />}
                        />
                        <Route
                          path="client-enquiries"
                          element={<ClientEnquiries />}
                        />
                        <Route
                          path="notifications"
                          element={<Notifications />}
                        />
                        <Route
                          path="profile"
                          element={<SpacePortalProfile />}
                        />
                        <Route
                          path="settings"
                          element={<SpacePortalSettings />}
                        />
                        <Route
                          path="invoices-payments"
                          element={<Invoices />}
                        />
                        <Route path="booking-calendar" element={<Calendar />} />
                        <Route
                          path="active-requests"
                          element={<Navigate to="/spaceportal/dashboard" replace />}
                        />
                        <Route
                          path="booking-analytics"
                          element={<BookingAnalytics />}
                        />
                        <Route
                          path="booking-analytics/:propertyId"
                          element={<BookingAnalytics />}
                        />
                        <Route
                          path="kyc-verification"
                          element={<KycVerification />}
                        />
                        <Route path="space-management" element={<Spaces />} />
                        <Route
                          path="space-management/add"
                          element={<AddSpace />}
                        />
                        <Route
                          path="space-management/:id"
                          element={<PropertyDetails />}
                        />

                        <Route path="tickets" element={<Tickets />} />
                        <Route path="tasks" element={<SpacePortalTicketAndTasks />} />
                        <Route
                          path="feedback-nps"
                          element={<SpacePortalFeedbackNPS />}
                        />
                        <Route path="mail-visits" element={<MailAndVisits />} />
                        <Route path="summary-analytics" element={<SummaryAnalytics />} />
                        <Route
                          path="team-management"
                          element={<TeamManagement />}
                        />
                      </Route>
                    </Route>

                    {/* Affiliate Protected Routes */}
                    <Route element={<AffiliateRoute />}>
                      <Route
                        path="/affiliate-portal"
                        element={<AffiliateLayout />}
                      >
                        <Route
                          index
                          element={
                            <Navigate to="affiliate-dashboard" replace />
                          }
                        />
                        <Route
                          path="affiliate-dashboard"
                          element={<AffiliateDashboard />}
                        />
                        <Route
                          path="booking-management"
                          element={<BookingManagement />}
                        />
                        <Route
                          path="revenue-dashboard"
                          element={<DashboardRevenue />}
                        />
                        <Route
                          path="affiliate-invoices"
                          element={<AffiliateInvoices />}
                        />
                        <Route path="payouts" element={<Payouts />} />
                        <Route
                          path="lead-management"
                          element={<LeadManagementAffiliate />}
                        />
                        <Route
                          path="quotation-generator"
                          element={<QuotationGenerator />}
                        />
                        <Route
                          path="marketing-tools"
                          element={<MarketingTools />}
                        />
                        <Route path="leaderboard" element={<LeaderBoard />} />
                        <Route path="support" element={<Support />} />
                        <Route path="kyc" element={<AffiliateKYC />} />
                        <Route
                          path="notifications"
                          element={<AffiliateNotifications />}
                        />
                        <Route
                          path="client-management"
                          element={<AffiliateClientManagement />}
                        />
                      </Route>
                    </Route>

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ChatProvider>
              </NotificationProvider>
            </DarkModeProvider>
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
