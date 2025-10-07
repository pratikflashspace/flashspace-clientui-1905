import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import ListYourSpace from "./pages/ListYourSpace";
import ComingSoon from "./pages/ComingSoon";
import CityListing from "./pages/CityListing";
import NotFound from "./pages/NotFound";
import VirtualOffice from "./pages/services/VirtualOffice";
import CoworkingSpace from "./pages/services/CoworkingSpace";
import OnDemand from "./pages/services/OnDemand";
import EventSpaces from "./pages/services/EventSpaces";
import BusinessSetup from "./pages/services/BusinessSetup";
import StartChatting from "./pages/StartChatting";
//
import MouseFollower from "./components/MouseFollower";
// import VirtualOfficeSearch from "./pages/solutions/VirtualOfficeSearch";
// import CoworkingSpaceSearch from "./pages/solutions/CoworkingSpaceSearch";
// import OnDemandSearch from "./pages/solutions/OnDemandSearch";
// import BusinessSetupSearch from "./pages/solutions/BusinessSetupSearch";
// import SearchResults from "./pages/SearchResult";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      {/* <MouseFollower/> */}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/virtual-office" element={<VirtualOffice />} />
            <Route path="/services/coworking-space" element={<CoworkingSpace />} />
            <Route path="/services/on-demand" element={<OnDemand />} />
            <Route path="/services/event-spaces" element={<EventSpaces />} />
            <Route path="/services/business-setup" element={<BusinessSetup />} />
            <Route path="/city-listing" element={<CityListing />} />
            {/* <Route path="/solutions/virtual-office" element={<VirtualOfficeSearch />} />
            <Route path="/solutions/coworking-space" element={<CoworkingSpaceSearch />} />
            <Route path="/solutions/on-demand" element={<OnDemandSearch />} />
            <Route path="/solutions/business-setup" element={<BusinessSetupSearch />} />
            <Route path="/search-results" element={<SearchResults />} /> */}
            <Route path="/list-your-space" element={<ListYourSpace />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/city/:cityId" element={<CityListing />} />
            <Route path="/start-chatting" element={<StartChatting />} />
            {/* <Route path="/get-in-touch" element={<GetInTouch />} /> */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
