import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DarkModeProvider } from "@/contexts/DarkModeContext";

import Index from "./pages/Index";
import Services from "./pages/Services";
import ListYourSpace from "./pages/ListYourSpace";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import VirtualOffice from "./pages/services/VirtualOffice";
import MeetingRooms from "./pages/services/MeetingRooms";
import CoworkingSpace from "./pages/services/CoworkingSpace";
import OnDemand from "./pages/services/OnDemand";
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
import Bookings from "./pages/Bookings";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import CityListing from "./pages/CityListing";
import AboutUs from "./pages/AboutUs";
import Blog, { SinglePostPage } from "./pages/Blog";

// --- Client Dashboard Pages ---
import ClientDashboard from "./components/ClientDashboard";
import ScrollToTop from "./components/ScrollToTop";

//-----------spaces---------
import SpaceComponent from "./components/Spaces/SpaceComponent";
import MeetingRoomSpaceComponent from "./components/Spaces/MeetingRoomSpaceComponent";
import CoworkingSpaceComponent from "./components/Spaces/CoworkingSpaceComponent";
import BookingPage from "./pages/BookingPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentFailedPage from "./pages/PaymentFailedPage";
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import KYCRequests from "./pages/admin/KYCRequests";
import SpaceManagement from "./pages/admin/SpaceManagement";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminSettings from "./pages/admin/Settings";
import LearningHub from "./pages/admin/learning-hub/LearningHub";
import Clients from "./pages/admin/Clients";
import ClientDetails from "./pages/admin/ClientDetails";
import { AdminRoute } from "./components/auth/AdminRoute";
import AdminLayout from "./components/layouts/AdminLayout";
import SalesAnalytics from "./pages/admin/SalesAnalytics";
import LeadManagement from "./pages/admin/LeadManagement";
import TicketSystem from "./pages/admin/TicketSystem";

import SpacePortalClients from "@/pages/spacePortal/Clients";
import SpacePortalClientDetails from "@/pages/spacePortal/ClientsDetails";
import Dashboard from "./pages/spacePortal/Dashboard";
import Invoices from "./pages/spacePortal/Invoices";
import Calendar from "./pages/spacePortal/Calendar";
import Spaces from "./pages/spacePortal/Spaces";
import Tickets from "./pages/spacePortal/Tickets";
import BookingAnalytics from "./pages/spacePortal/BookingAnalytics";
import ClientEnquiries from "./pages/spacePortal/ClientEnquiries";

// --- React Query setup ---
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DarkModeProvider>
            <ScrollToTop />
            {/* <MouseFollower/> */}
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route
                path="/services/virtual-office"
                element={<VirtualOffice />}
              />
              <Route
                path="/services/coworking-space"
                element={<CoworkingSpace />}
              />
              <Route path="/services/on-demand" element={<OnDemand />} />
              <Route path="/services/event-spaces" element={<EventSpaces />} />
              <Route
                path="/services/business-setup"
                element={<BusinessSetup />}
              />
              <Route
                path="/Solutions/virtual-office"
                element={<VirtualOfficeSolution />}
              />
              <Route
                path="/Solutions/coworking-space"
                element={<CoworkingSpaceSolution />}
              />
              <Route
                path="/Solutions/on-demand"
                element={<OnDemandSolution />}
              />
              <Route
                path="/Solutions/business-setup"
                element={<BusinessSetupSolution />}
              />
              <Route
                path="/services/meeting-rooms"
                element={<MeetingRooms />}
              />
              <Route
                path="/Solutions/meetingsroom"
                element={<MeetingsRoom />}
              />
              <Route path="/Solutions/day-office" element={<Dayoffice />} />
              <Route
                path="/Solutions/eventspace"
                element={<EventSpacePage />}
              />

              {/* Spaces*/}
              <Route path="/space/:id" element={<SpaceComponent />} />
              <Route
                path="/coworking-space/:id"
                element={<CoworkingSpaceComponent />}
              />
              <Route
                path="/meeting-room/:id"
                element={<MeetingRoomSpaceComponent />}
              />
              <Route path="/booking/:id" element={<BookingPage />} />

              {/* Payment Routes */}
              <Route path="/payment/success" element={<PaymentSuccessPage />} />
              <Route path="/payment/failed" element={<PaymentFailedPage />} />

              <Route path="/city-listing" element={<CityListing />} />
              <Route path="/career" element={<Career />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<SinglePostPage />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Index openLogin={true} />} />
              <Route path="/signup" element={<Index openSignup={true} />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/community" element={<Community />} />
                <Route path="/settings" element={<Settings />} />

                {/* Client Dashboard Routes - Protected */}
                <Route path="/dashboard/*" element={<ClientDashboard />} />
              </Route>

              {/* Admin Routes - Protected (RBAC) */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="kyc-requests" element={<KYCRequests />} />
                  <Route path="spaces" element={<SpaceManagement />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="clients/:id" element={<ClientDetails />} />
                  <Route path="learning-hub" element={<LearningHub />} />
                  <Route path="sales-analytics" element={<SalesAnalytics />} />
                  <Route path="tickets" element={<TicketSystem />} />
                  <Route path="leads" element={<LeadManagement />} />
                  <Route path="*" element={<AdminDashboard />} />
                </Route>
              </Route>

              {/* Space Partner Portal Routes */}
              <Route path="/spaceportal" element={<SpacePortalLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />

                <Route path="clients" element={<SpacePortalClients />} />
                <Route path="clients/:clientId" element={<SpacePortalClientDetails />} />
                <Route path="client-enquiries" element={<ClientEnquiries />} />
                <Route path="invoices-payments" element={<Invoices />} />
                <Route path="booking-calendar" element={<Calendar />} />
                <Route
                  path="booking-analytics"
                  element={<BookingAnalytics />}
                />
                <Route path="space-management" element={<Spaces />} />
                <Route path="tickets" element={<Tickets />} />
              </Route>

              <Route path="/list-your-space" element={<ListYourSpace />} />
              <Route path="/partner" element={<PartnerWithUs />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="/start-chatting" element={<StartChatting />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DarkModeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
