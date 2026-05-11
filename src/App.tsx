import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster as HotToaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DarkModeProvider } from "@/contexts/DarkModeContext";
import { NotificationProvider } from "./contexts/NotificationProvider";
import { ChatProvider } from "@/contexts/ChatContext";

// --- Lazy Loaded Pages (Optimized Bundle) ---
const Index = lazy(() => import("./pages/Index"));
const Services = lazy(() => import("./pages/Services"));
const ListYourSpace = lazy(() => import("./pages/ListYourSpace"));
const NotFound = lazy(() => import("./pages/NotFound"));
const VirtualOffice = lazy(() => import("./pages/services/VirtualOffice"));
const OnDemand = lazy(() => import("./pages/services/OnDemand"));
const GetWorkspaces = lazy(() => import("./pages/services/GetWorkspaces"));
const EventSpaces = lazy(() => import("./pages/services/EventSpaces"));
const BusinessSetup = lazy(() => import("./pages/services/BusinessSetup"));
const StartChatting = lazy(() => import("./pages/StartChatting"));
const VirtualOfficeSolution = lazy(() => import("./pages/Solutions/virtual-office"));
const CoworkingSpaceSolution = lazy(() => import("./pages/Solutions/coworking-space"));
const OnDemandSolution = lazy(() => import("./pages/Solutions/on-demand"));
const BusinessSetupSolution = lazy(() => import("./pages/Solutions/business-setup"));
const PartnerWithUs = lazy(() => import("./pages/PatnerWithUs"));
const MeetingsRoom = lazy(() => import("./pages/Solutions/meetingsroom"));
const Dayoffice = lazy(() => import("./pages/Solutions/Dayoffice"));
const EventSpacePage = lazy(() => import("./pages/Solutions/Eventspace"));
const SpacePortalLayout = lazy(() => import("./layouts/SpacePortalLayout"));
const Career = lazy(() => import("./pages/Career"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const VerifyOTP = lazy(() => import("./pages/VerifyOTP"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Bookings = lazy(() => import("./pages/Bookings"));
const Community = lazy(() => import("./pages/Community"));
import Settings from "./pages/Settings";
const CityListing = lazy(() => import("./pages/CityListing"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const HelpCenter = lazy(() => import("./pages/help/HelpCenter"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ClientDashboard = lazy(() => import("./components/ClientDashboard"));
const WorkspaceDetail = lazy(() => import("./pages/WorkspaceDetail"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const CompleteBookingPage = lazy(() => import("./pages/CompleteBookingPage"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));
const PaymentFailedPage = lazy(() => import("./pages/PaymentFailedPage"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const PartnersManagement = lazy(() => import("./pages/admin/Partners"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const AdminTeamManagement = lazy(() => import("./pages/admin/TeamManagement"));
const Coupons = lazy(() => import("./pages/admin/Coupons"));
const KYCRequests = lazy(() => import("./pages/admin/KYCRequests"));
const KYCDetail = lazy(() => import("./pages/admin/KYCDetail"));
const KYCPartnerRequests = lazy(() => import("./pages/admin/KYCPartnerRequests"));
const SpacePartnerKycDetails = lazy(() => import("./pages/admin/SpacePartnerKycDetails"));
const SpaceDetail = lazy(() => import("./pages/admin/SpaceDetail"));
const SpaceManagement = lazy(() => import("./pages/admin/SpaceManagement"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const LearningHub = lazy(() => import("./pages/admin/learning-hub/LearningHub"));
const Clients = lazy(() => import("./pages/admin/Clients"));
const ClientDetails = lazy(() => import("./pages/admin/ClientDetails"));
const AdminLayout = lazy(() => import("./components/layouts/AdminLayout"));
const SalesAnalytics = lazy(() => import("./pages/admin/SalesAnalytics"));
const LeadManagement = lazy(() => import("./pages/admin/LeadManagement"));
const TicketSystem = lazy(() => import("./pages/admin/TicketSystem"));
const AdminNotifications = lazy(() => import("./pages/admin/Notifications"));
const AdminPropertyDetails = lazy(() => import("./pages/admin/PropertyDetailsAdmin"));
const PropertyManagement = lazy(() => import("./pages/admin/PropertyManagement"));
const ReceivablePayable = lazy(() => import("./pages/admin/ReceivablePayable"));
const BalanceSheet = lazy(() => import("./pages/admin/BalanceSheet"));
const RevenueDashboard = lazy(() => import("./pages/admin/RevenueDashboard"));
const Leaderboard = lazy(() => import("./pages/admin/Leaderboard"));
const AdminAffiliateManagement = lazy(() => import("./pages/admin/AdminAffiliateManagement"));
const AdminPartnerInvoices = lazy(() => import("./pages/admin/PartnerInvoices"));
const AdminInvoices = lazy(() => import("./pages/admin/Invoices"));
const DocumentManagement = lazy(() => import("./pages/admin/DocumentManagement"));
const TrackProgress = lazy(() => import("./pages/admin/TrackProgress"));

// Space Partner Pages
const SpacePortalClients = lazy(() => import("@/pages/spacePortal/Clients"));
const SpacePortalClientDetails = lazy(() => import("@/pages/spacePortal/ClientsDetails"));
const Dashboard = lazy(() => import("./pages/spacePortal/Dashboard"));
const Invoices = lazy(() => import("./pages/spacePortal/Invoices"));
const Calendar = lazy(() => import("./pages/spacePortal/Calendar"));
const SpacePortalTrackProgress = lazy(() => import("./pages/spacePortal/TrackProgress"));
const Spaces = lazy(() => import("./pages/spacePortal/Spaces"));
const Tickets = lazy(() => import("./pages/spacePortal/Tickets"));
const BookingAnalytics = lazy(() => import("./pages/spacePortal/BookingAnalytics"));
const BookingRequests = lazy(() => import("./pages/spacePortal/BookingRequests"));
const ClientEnquiries = lazy(() => import("./pages/spacePortal/ClientEnquiries"));
const SpacePortalProfile = lazy(() => import("./pages/spacePortal/Profile"));
const Notifications = lazy(() => import("./pages/spacePortal/Notifications"));
const SpacePortalSettings = lazy(() => import("./pages/spacePortal/Settings"));
const SummaryAnalytics = lazy(() => import("./pages/spacePortal/SummaryAnalytics"));
const AddSpace = lazy(() => import("./pages/spacePortal/AddSpace"));
const PropertyDetails = lazy(() => import("./pages/spacePortal/PropertyDetails"));
const SpacePortalFeedbackNPS = lazy(() => import("./pages/spacePortal/FeedbackNPS"));
const SpacePortalTicketAndTasks = lazy(() => import("./pages/spacePortal/TicketsAndTasks"));
const MailAndVisits = lazy(() => import("./pages/spacePortal/MailAndVisits"));
const TeamManagement = lazy(() => import("./pages/spacePortal/TeamManagement.tsx"));

// Affiliate Pages
const AffiliateDashboard = lazy(() => import("./pages/affiliatePortal/Dashboard"));
const BookingManagement = lazy(() => import("./pages/affiliatePortal/BookingManagement"));
const DashboardRevenue = lazy(() => import("./pages/affiliatePortal/RevenueDashboard"));
const AffiliateInvoices = lazy(() => import("./pages/affiliatePortal/AffiliateInvoices"));
const Payouts = lazy(() => import("./pages/affiliatePortal/Payouts"));
const AffiliateLayout = lazy(() => import("./pages/affiliatePortal/AffiliateLayout"));
const LeadManagementAffiliate = lazy(() => import("./pages/affiliatePortal/LeadManagementAffiliate"));
const QuotationGenerator = lazy(() => import("./pages/affiliatePortal/QuotationGenerator"));
const MarketingTools = lazy(() => import("./pages/affiliatePortal/MarketingTools"));
const LeaderBoard = lazy(() => import("./pages/affiliatePortal/LeaderBoard"));
const Support = lazy(() => import("./pages/affiliatePortal/Support"));
const AffiliateKYC = lazy(() => import("./pages/affiliatePortal/KYC"));
const AffiliateNotifications = lazy(() => import("./pages/affiliatePortal/Notifications"));
const AffiliateClientManagement = lazy(() => import("./pages/affiliatePortal/AffiliateClientManagement"));

import MouseFollower from "./components/MouseFollower";
import ScrollToTop from "./components/ScrollToTop";
import { AdminRoute } from "./components/auth/AdminRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "./constants/adminNavItems";
import { PartnerRoute } from "./components/auth/PartnerRoute";
import { AffiliateRoute } from "./components/auth/AffiliateRoute";
import KycVerification from "./components/Spaces/KycVerification";
import LoadingScreen from "./components/ui/LoadingScreen";
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
          duration: 3500,
          style: {
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(20px) saturate(180%)",
            color: "#1f2937",
            borderRadius: "24px",
            padding: "16px 28px",
            boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
            fontSize: "14px",
            fontWeight: "600",
            maxWidth: "480px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            fontFamily: "'Inter Tight', sans-serif",
            animation: "toast-enter 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
          },
          success: {
            style: {
              background: "rgba(236, 253, 245, 0.9)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
            },
            iconTheme: {
              primary: "#10b981",
              secondary: "white",
            },
          },
          error: {
            style: {
              background: "rgba(254, 242, 242, 0.8)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
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
            <NotificationProvider>
                <ChatProvider>
                  <ScrollToTop />
                  {/* <MouseFollower/> */}
                  <Suspense fallback={<LoadingScreen />}>
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
                          <Route path="support" element={<Navigate to="/admin" replace />} />
                          <Route path="revenue" element={<RevenueDashboard />} />
                          <Route path="tickets" element={<TicketSystem />} />
                          <Route
                            path="notifications"
                            element={<AdminNotifications />}
                          />
                          <Route
                            path="invoices"
                            element={<AdminInvoices />}
                          />
                          <Route path="finance" element={<ReceivablePayable />} />
                          <Route path="balance" element={<BalanceSheet />} />
                          <Route path="leads" element={<LeadManagement />} />
                          <Route
                            path="affiliates"
                            element={<AdminAffiliateManagement />}
                          />
                          <Route path="track-progress" element={<TrackProgress />} />
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
                          <Route path="booking-requests" element={<BookingRequests />} />
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
                          <Route
                            path="track-progress"
                            element={<SpacePortalTrackProgress />}
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
                  </Suspense>
                </ChatProvider>
            </NotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
