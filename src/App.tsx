import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
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
//
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
import Blog from "./pages/Blog";
// import VirtualOfficeSearch from "./pages/solutions/VirtualOfficeSearch";
// import CoworkingSpaceSearch from "./pages/solutions/CoworkingSpaceSearch";
// import OnDemandSearch from "./pages/solutions/OnDemandSearch";
// import BusinessSetupSearch from "./pages/solutions/BusinessSetupSearch";
// import SearchResults from "./pages/SearchResult";

// --- Client Dashboard Pages ---
import ClientDashboard from "./components/ClientDashboard";
import Dashboard from "./components/ClientDashboard/Dashboard";
import MyBookings from "./components/ClientDashboard/MyBookings";
import Billing from "./components/ClientDashboard/Billing";
import KYCVerification from "./components/ClientDashboard/KYCVerification";
import Support from "./components/ClientDashboard/Support";
import Logout from "./components/ClientDashboard/Logout";
import Profile from "./components/ClientDashboard/Profile";
// import { LoginForm, SignupForm } from "./components/auth";


// --- end dashboard imports ---

import Viewdetails from "./components/ClientDashboard/Viewdetails"; // ✅ Important for routing

// --- React Query setup ---
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          {/* ✅ Dashboard with nested routes */}
          <Route path="/dashboard" element={<ClientDashboard />}>
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="viewdetails" element={<Viewdetails />} /> {/* ✅ Fix: nested path */}
            <Route path="billing" element={<Billing />} />
            <Route path="kyc-verification" element={<KYCVerification />} />
            <Route path="support" element={<Support />} />
            <Route path="logout" element={<Logout />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* ✅ Other website routes */}
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/virtual-office" element={<VirtualOffice />} />
          <Route path="/services/coworking-space" element={<CoworkingSpace />} />
          <Route path="/services/on-demand" element={<OnDemand />} />
          <Route path="/services/event-spaces" element={<EventSpaces />} />
          <Route path="/services/business-setup" element={<BusinessSetup />} />

          {/* ✅ Solutions routes */}
          <Route path="/solutions/virtual-office" element={<VirtualOfficeSolution />} />
          <Route path="/solutions/coworking-space" element={<CoworkingSpaceSolution />} />
          <Route path="/solutions/on-demand" element={<OnDemandSolution />} />
          <Route path="/solutions/business-setup" element={<BusinessSetupSolution />} />

          {/* ✅ Static pages */}
          <Route path="/city-listing" element={<CityListing />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/career" element={<Career />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/community" element={<Community />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/list-your-space" element={<ListYourSpace />} />
          <Route path="/partner" element={<PartnerWithUs />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/start-chatting" element={<StartChatting />} />

          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
