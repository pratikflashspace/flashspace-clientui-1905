import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Career from "./pages/Career";
import Login from "./pages/Login";
import Bookings from "./pages/Bookings";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import CityListing from "./pages/CityListing";

// --- Import all ClientDashboard pages! ---
import ClientDashboard from "./components/ClientDashboard";
import Dashboard from "./components/ClientDashboard/Dashboard";
import MyBookings from "./components/ClientDashboard/MyBookings";
import Billing from "./components/ClientDashboard/Billing";
import KYCVerification from "./components/ClientDashboard/KYCVerification";
import ContractsDocuments from "./components/ClientDashboard/ContractsDocuments";
import Support from "./components/ClientDashboard/Support";
import Logout from "./components/ClientDashboard/Logout";
import Profile from "./components/ClientDashboard/Profile";


// --- end dashboard imports ---

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Dashboard routes - every page is nested under /dashboard */}
          <Route path="/dashboard" element={<ClientDashboard />}>
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="billing" element={<Billing />} />
            <Route path="kyc-verification" element={<KYCVerification />} />
            <Route path="contracts-documents" element={<ContractsDocuments />} />
            <Route path="support" element={<Support />} />
            <Route path="logout" element={<Logout />} />
            <Route path="Profile" element={<Profile />} />
          </Route>
          
          {/* Your other app pages below */}
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
          <Route path="/login" element={<Login />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/community" element={<Community />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/list-your-space" element={<ListYourSpace />} />
          <Route path="/partner" element={<PartnerWithUs />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/start-chatting" element={<StartChatting />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
