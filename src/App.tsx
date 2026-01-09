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
import Dashboard from "./components/ClientDashboard/Dashboard";
import MyBookings from "./components/ClientDashboard/MyBookings";
import Billing from "./components/ClientDashboard/Billing";
import KYCVerification from "./components/ClientDashboard/KYCVerification";
import Support from "./components/ClientDashboard/Support";
import Logout from "./components/ClientDashboard/Logout";
import Profile from "./components/ClientDashboard/Profile";

//-----------spaces---------
import SpaceComponent from './components/Spaces/SpaceComponent';
import CoworkingSpaceComponent from './components/Spaces/CoworkingSpaceComponent';

// --- end dashboard imports ---

import Viewdetails from "./components/ClientDashboard/Viewdetails";

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
            {/* <MouseFollower/> */}
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/virtual-office" element={<VirtualOffice />} />
              <Route path="/services/coworking-space" element={<CoworkingSpace />} />
              <Route path="/services/on-demand" element={<OnDemand />} />
              <Route path="/services/event-spaces" element={<EventSpaces />} />
              <Route path="/services/business-setup" element={<BusinessSetup />} />
              <Route path="/Solutions/virtual-office" element={<VirtualOfficeSolution />} />
              <Route path="/Solutions/coworking-space" element={<CoworkingSpaceSolution />} />
              <Route path="/Solutions/on-demand" element={<OnDemandSolution />} />
              <Route path="/Solutions/business-setup" element={<BusinessSetupSolution />} />
              <Route path="/Solutions/meetingsroom" element={<MeetingsRoom />} />
              <Route path="/Solutions/day-office" element={<Dayoffice />} />
              <Route path="/Solutions/eventspace" element={<EventSpacePage />} />

              {/* Spaces*/}
              <Route path="/space/:id" element={<SpaceComponent />} />
              <Route path="/coworking-space/:id" element={<CoworkingSpaceComponent />} />


              <Route path="/city-listing" element={<CityListing />} />
              <Route path="/career" element={<Career />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<SinglePostPage />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/community" element={<Community />} />
                <Route path="/settings" element={<Settings />} />

                {/* Client Dashboard Routes - Protected */}
                <Route path="/dashboard" element={<ClientDashboard />} />
                <Route path="/dashboard/overview" element={<Dashboard />} />
                <Route path="/dashboard/my-bookings" element={<MyBookings />} />
                <Route path="/dashboard/billing" element={<Billing />} />
                <Route path="/dashboard/kyc-verification" element={<KYCVerification />} />
                <Route path="/dashboard/support" element={<Support />} />
                <Route path="/dashboard/profile" element={<Profile />} />
                <Route path="/dashboard/logout" element={<Logout />} />
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
