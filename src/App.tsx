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

// --- Import all ClientDashboard pages! ---
import ClientDashboard from "./components/ClientDashboard";
import Dashboard from "./components/ClientDashboard/Dashboard";
import MyBookings from "./components/ClientDashboard/MyBookings";
import OnDemandServices from "./components/ClientDashboard/OnDemandServices";
import VirtualOffices from "./components/ClientDashboard/VirtualOffices";
import Billing from "./components/ClientDashboard/Billing";
import KYCVerification from "./components/ClientDashboard/KYCVerification";
import ContractsDocuments from "./components/ClientDashboard/ContractsDocuments";
import Support from "./components/ClientDashboard/Support";
import Logout from "./components/ClientDashboard/Logout";
import Profile from "./components/ClientDashboard/Profile";
// import { LoginForm, SignupForm } from "./components/auth";


// --- end dashboard imports ---

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
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
            <Route path="/city-listing" element={<CityListing />} />
            <Route path="/career" element={<Career />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/blog" element={<Blog />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/community" element={<Community />} />
              {/* <Route path="/updates" element={<Updates />} /> */}
              <Route path="/settings" element={<Settings />} />
              
              {/* Client Dashboard Routes - Protected */}
              <Route path="/dashboard" element={<ClientDashboard />} />
              <Route path="/dashboard/overview" element={<Dashboard />} />
              <Route path="/dashboard/my-bookings" element={<MyBookings />} />
              <Route path="/dashboard/on-demand-services" element={<OnDemandServices />} />
              <Route path="/dashboard/virtual-offices" element={<VirtualOffices />} />
              <Route path="/dashboard/billing" element={<Billing />} />
              <Route path="/dashboard/kyc-verification" element={<KYCVerification />} />
              <Route path="/dashboard/contracts-documents" element={<ContractsDocuments />} />
              <Route path="/dashboard/support" element={<Support />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route path="/dashboard/logout" element={<Logout />} />
            </Route>
            {/* <Route path="/solutions/virtual-office" element={<VirtualOfficeSearch />} />
            <Route path="/solutions/coworking-space" element={<CoworkingSpaceSearch />} />
            <Route path="/solutions/on-demand" element={<OnDemandSearch />} />
            <Route path="/solutions/business-setup" element={<BusinessSetupSearch />} />
            <Route path="/search-results" element={<SearchResults />} /> */}
            <Route path="/list-your-space" element={<ListYourSpace />} />
            <Route path="/partner" element={<PartnerWithUs />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            {/* <Route path="/city/:cityId" element={<CityListing />} /> */}
            <Route path="/start-chatting" element={<StartChatting />} />
            {/* <Route path="/get-in-touch" element={<GetInTouch />} /> */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


