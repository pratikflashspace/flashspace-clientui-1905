ChevronRight,
  ChevronLeft,
  Grid3X3,
  List,
  Search,
  Presentation,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { cityCenters } from "@/components/Map/locationData.example";
import Header from "@/components/Header";
import ListingCardModern from "@/components/services/ListingCardModern";
import MapLibreMap from "@/components/Map/MapLibreMap";
import { getVirtualOfficesByCity } from "@/services/virtualOffice.service";
import { SkeletonCardGrid } from "@/components/ui/skeleton-loaders";
import {
  City,
  BusinessSolution,
  VirtualOfficeItem,
  ViewMode,
  SortBy,
} from "@/types/services";
import { useLocationMetadata } from "@/hooks/useLocationMetadata";

const VirtualOffice = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mapCollapsed, setMapCollapsed] = useState(false);

  // Initialize state from URL params to ensure first render is correct
  const initialCity = searchParams.get("city") || "Delhi";
  const initialLocation = searchParams.get("location") || "";

  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [selectedLocation, setSelectedLocation] = useState<string>(initialLocation);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("popularity");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedServices, setSelectedServices] = useState<string>("all");
  const [searchCity, setSearchCity] = useState<string>(initialCity);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [virtualOffices, setVirtualOffices] = useState<VirtualOfficeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Available cities for search - only cities with actual virtual office data
  const availableCities: City[] = [
    { name: "Ahmedabad", key: "ahmedabad" },
    { name: "Bangalore", key: "bangalore" },
    { name: "Chennai", key: "chennai" },
    { name: "Delhi", key: "delhi" },
    { name: "Dharamshala", key: "dharamshala" },
    { name: "Gurgaon", key: "gurgaon" },
    { name: "Hyderabad", key: "hyderabad" },
    { name: "Jaipur", key: "jaipur" },
    { name: "Jammu", key: "jammu" },
  ];

  useEffect(() => {
    const city = searchParams.get("city") || "Delhi";
    const location = searchParams.get("location") || "";
    setSelectedCity(city);
    setSelectedLocation(location);
    setSearchCity(city);
  }, [searchParams]);



  // Fetch virtual offices from API
  useEffect(() => {
    const fetchVirtualOffices = async () => {
      if (!selectedCity) return;

      setLoading(true);
      setError("");

      try {
        const data = await getVirtualOfficesByCity(selectedCity);
        setVirtualOffices(data);
      } catch (err: any) {
        setError(
          err.message || "Error connecting to server. Please try again later.",
        );
        setVirtualOffices([]);
        console.error("Error fetching virtual offices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVirtualOffices();
  }, [selectedCity]);

  // Filter cities based on search input
  const filteredCities: City[] = availableCities.filter((city) =>
    city.name.toLowerCase().includes(searchCity.toLowerCase()),
  );

  // Handle city search
  const handleCitySearch = (cityName: string): void => {
    setSearchCity(cityName);
    setSelectedCity(cityName);
    setShowSuggestions(false);

    // Update URL with new city
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("city", cityName);
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  };

  // Handle search input change
  const handleSearchInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSearchCity(e.target.value);
    setShowSuggestions(true);
  };

  // Wrapper for SearchHeader component
  const handleSearchChange = (value: string): void => {
    setSearchCity(value);
    setShowSuggestions(true);
  };

  // Handle search input focus
  const handleSearchFocus = (): void => {
    setIsSearchFocused(true);
    setShowSuggestions(true);
  };

  // Handle search input blur
  const handleSearchBlur = (): void => {
    setIsSearchFocused(false);
    setTimeout(() => setShowSuggestions(false), 200);
  };

  // Handle search form submit
  const handleSearchSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (searchCity.trim()) {
      handleCitySearch(searchCity.trim());
    }
  };

  const businessSolutions: BusinessSolution[] = [
    {
      label: "Virtual Office",
      href: "/services/virtual-office",
      icon: Building,
      description: "Professional business address solutions",
    },
    {
      label: "Coworking Space",
      href: "/services/coworking-space",
      icon: Users,
      description: "Flexible workspace solutions",
    },
    {
      label: "On Demand",
      href: "/services/on-demand",
      icon: Phone,
      description: "Meeting rooms & services",
    },
    {
      label: "Event Spaces",
      href: "/services/event-spaces",
      icon: MapPin,
      description: "Premium event venues",
    },
  ];

  const handleNavigation = (href: string): void => {
    navigate(href);
  };

  // Navigate to space detail page using MongoDB _id
  const handleGetBestPrice = (spaceId: string): void => {
    navigate(`/space/${spaceId}`);
  };

  // Get unique areas for filtering
  const areas = [...new Set(virtualOffices.map((office) => office.area))];

  const { resolveCoordinates } = useLocationMetadata();

  // Resolve map center dynamically (fallback to hardcoded if necessary)
  const resolvedCenter = useMemo(() => {
    return resolveCoordinates(selectedCity);
  }, [selectedCity, resolveCoordinates]);

  // Generate random coordinates around city center if not available
  const generateRandomCoordinates = (
    center: { lat: number; lng: number },
    index: number,
  ) => {
    // Generate different offsets for each office (0.01 to 0.05 degrees)
    const seed = index + 1;
    const latOffset = ((seed * 17) % 50) / 1000 - 0.025; // -0.025 to +0.025
    const lngOffset = ((seed * 23) % 50) / 1000 - 0.025; // -0.025 to +0.025

    return {
      lat: center.lat + latOffset,
      lng: center.lng + lngOffset,
    };
  };

  // Prepare marker data from virtualOffices with full details
  // Memoize to prevent unnecessary recalculations
  const mapMarkers = useMemo(() => {
    return virtualOffices.map((office, index) => {
      // Use images[0] or image (legacy) or placeholder
      const imageSrc =
        office.images && office.images.length > 0
          ? office.images[0]
          : office.image || "https://shorturl.at/Fyr6o";

      return {
        position:
          office.coordinates ||
          generateRandomCoordinates(resolvedCenter, index),
        title: office.name,
        address: office.address,
        price: office.gstPlanPricePerYear
          ? `₹${office.gstPlanPricePerYear.toLocaleString("en-IN")}/yr`
          : office.price,
        rating:
          office.avgRating !== undefined
            ? office.avgRating
            : office.rating || 0,
        reviews:
          office.totalReviews !== undefined
            ? office.totalReviews
            : office.reviews || 0,
        image: imageSrc,
        features: office.features,
      };
    });
  }, [virtualOffices, resolvedCenter]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Full-width top section: Breadcrumb + Filters */}
      <div className="mt-20 bg-background border-b border-border/60">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumb */}
          <div
            className={`flex items-center gap-1.5 text-xs text-muted-foreground mb-4 transition-opacity duration-300 ${isSearchFocused ? "opacity-50" : "opacity-100"}`}
          >
            <span className="hover:text-foreground transition-colors cursor-pointer" onClick={() => navigate("/")}>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span className="hover:text-foreground transition-colors cursor-pointer">Virtual Office</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium truncate">
              {selectedCity}
            </span>
          </div>

          {/* SearchHeader - Full Width Top Section */}
          <SearchHeader
            searchCity={searchCity}
            onSearchChange={handleSearchChange}
            onCitySelect={handleCitySearch}
            onSearchSubmit={handleSearchSubmit}
            onSearchFocus={handleSearchFocus}
            onSearchBlur={handleSearchBlur}
            isSearchFocused={isSearchFocused}
            showSuggestions={showSuggestions}
            filteredCities={filteredCities}
            currentService="Virtual Office"
            businessSolutions={businessSolutions}
            onServiceNavigation={handleNavigation}
          />
        </div>
      </div>

      <div className="flex-1 lg:flex h-auto lg:h-[calc(100vh-13rem)] relative">
        {/* Listings Content */}
        <div
          className={`overflow-y-auto bg-muted/20 transition-all duration-300 ease-in-out relative ${mapCollapsed ? "w-full" : "w-full lg:w-[58%] border-r border-border/40"}`}
        >
          <div className="px-4 sm:px-8 py-6">
            {/* Mobile Back Button */}
            <button
              onClick={() => navigate("/")}
              className="md:hidden flex items-center gap-2 text-sm text-gray-500 mb-4 hover:text-black transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <h1
              className={`text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 transition-opacity duration-300 ${isSearchFocused ? "opacity-50" : "opacity-100"}`}
            >
              Virtual Office Space In {selectedCity}
            </h1>

            {/* Filters Row */}
            {/* <div className={`bg-white rounded-lg border border-gray-200 p-4 mb-6 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Filter className="w-4 h-4" />
                QUICK FILTERS
              </div>
              
              <select 
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Locations</option>
                {areas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
              
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="popularity">Sort By: Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating: High to Low</option>
              </select>
              
              <select 
                value={selectedServices}
                onChange={(e) => setSelectedServices(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Services</option>
                <option value="gst">GST Registration</option>
                <option value="mail">Mail Handling</option>
                <option value="call">Call Management</option>
              </select>
              
              <Button variant="outline" className="text-sm">
                Reset filters
              </Button>
            </div>
          </div> */}

            {/* Results Header */}
            <div
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 transition-opacity duration-300 ${isSearchFocused ? "opacity-50" : "opacity-100"}`}
            >
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {virtualOffices.length} result(s)
                </span>{" "}
                for virtual office space in {selectedCity}
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex items-center gap-1 text-xs sm:text-sm h-8"
                >
                  <List className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">List</span>
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex items-center gap-1 text-xs sm:text-sm h-8"
                >
                  <Grid3X3 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Grid</span>
                </Button>
              </div>
            </div>

            {/* Office Cards Grid - Modern MindTrip Style Cards */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 sm:mb-8 transition-opacity duration-300 ${isSearchFocused ? "opacity-50" : "opacity-100"}`}
            >
              {loading ? (
                <SkeletonCardGrid count={6} view={viewMode} />
              ) : error ? (
                <div className="col-span-full text-center py-8 sm:py-12">
                  <p className="text-sm sm:text-base text-red-600">{error}</p>
                </div>
              ) : virtualOffices.length === 0 ? (
                <div className="col-span-full text-center py-8 sm:py-12">
                  <p className="text-sm sm:text-base text-gray-600">
                    No virtual offices found for {selectedCity}
                  </p>
                </div>
              ) : (
                virtualOffices.map((office) => (
                  <ListingCardModern
                    key={office._id}
                    item={office}
                    onGetBestPrice={() => handleGetBestPrice(office._id)}
                    onToggleFavorite={(itemId) => {
                      /* console.log('Toggle favorite for:', itemId) */
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Map */}
      <div
        className={`hidden lg:block transition-all duration-300 ease-in-out relative ${mapCollapsed ? "w-0 overflow-hidden opacity-0" : "w-[42%] opacity-100"}`}
      >
        <div className="sticky top-20 h-[calc(100vh-5.5rem)] m-2 sm:m-4 rounded-xl overflow-hidden shadow-sm border border-border/30">
          {/* Map toggle — fixed on the map */}
          <button
            onClick={() => setMapCollapsed(!mapCollapsed)}
            className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full border border-border bg-card shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200 cursor-pointer"
            aria-label="Hide map"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <MapLibreMap
            center={resolvedCenter}
            markers={mapMarkers.map((m, idx) => ({
              id: `marker-${idx}`,
              position: m.position,
              title: m.title,
              image: m.image,
              price: m.price,
              rating: m.rating,
              address: m.address,
            }))}
            height="100%"
            mapStyle="retro"
          />
        </div>
      </div>

      {/* Floating map button — fixed top-right, below filter bar */}
      {mapCollapsed && (
        <button
          onClick={() => setMapCollapsed(false)}
          className="fixed top-[184px] right-8 z-30 w-10 h-10 rounded-full border border-border bg-card shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200 cursor-pointer"
          aria-label="Show map"
        >
          <Map className="w-4.5 h-4.5" />
        </button>
      )}
    </div>
    </div >
  );
};

export default VirtualOffice;
