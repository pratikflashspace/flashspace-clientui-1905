import { Building, MapPin, Phone, Users, ChevronDown, Grid3X3, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { cityCenters } from "@/components/Map/locationData.example";
import Header from "@/components/Header";
import MapSection from "@/components/services/MapSection";
import SearchHeader from "@/components/services/SearchHeader";
import ListingCard from "@/components/services/ListingCard";
import ResizableMapLayout from "@/components/services/ResizableMapLayout";
import { getVirtualOfficesByCity } from "@/services/virtualOffice.service";
import {
  City,
  BusinessSolution,
  VirtualOfficeItem,
  ViewMode,
  SortBy
} from "@/types/services";

const VirtualOffice = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("popularity");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedServices, setSelectedServices] = useState<string>("all");
  const [searchCity, setSearchCity] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [virtualOffices, setVirtualOffices] = useState<VirtualOfficeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Available cities for search
  const availableCities: City[] = [
    { name: "Delhi", key: "delhi" },
    { name: "Mumbai", key: "mumbai" },
    { name: "Bangalore", key: "bangalore" },
    { name: "Pune", key: "pune" },
    { name: "Chennai", key: "chennai" },
    { name: "Hyderabad", key: "hyderabad" },
    { name: "Kolkata", key: "kolkata" },
    { name: "Ahmedabad", key: "ahmedabad" },
    { name: "Jaipur", key: "jaipur" },
    { name: "Surat", key: "surat" },
    { name: "Lucknow", key: "lucknow" }
  ];

  useEffect(() => {
    const city = searchParams.get('city') || 'Delhi';
    const location = searchParams.get('location') || '';
    setSelectedCity(city);
    setSelectedLocation(location);
    setSearchCity(city);
  }, [searchParams]);

  // Disable Lenis smooth scroll for this specific container
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Add data attribute to tell Lenis to ignore this element
    scrollContainer.setAttribute('data-lenis-prevent', 'true');

    // Also prevent Lenis from handling wheel events on this container
    const preventLenis = (e: WheelEvent) => {
      e.stopPropagation();
    };

    scrollContainer.addEventListener('wheel', preventLenis, { passive: false });

    return () => {
      scrollContainer.removeEventListener('wheel', preventLenis);
    };
  }, []);

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
        setError(err.message || "Error connecting to server. Please try again later.");
        setVirtualOffices([]);
        console.error("Error fetching virtual offices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVirtualOffices();
  }, [selectedCity]);

  // Filter cities based on search input
  const filteredCities: City[] = availableCities.filter(city =>
    city.name.toLowerCase().includes(searchCity.toLowerCase())
  );

  // Handle city search
  const handleCitySearch = (cityName: string): void => {
    setSearchCity(cityName);
    setSelectedCity(cityName);
    setShowSuggestions(false);
    
    // Update URL with new city
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('city', cityName);
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  };

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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
      description: "Professional business address solutions"
    },
    {
      label: "Coworking Space", 
      href: "/services/coworking-space",
      icon: Users,
      description: "Flexible workspace solutions"
    },
    {
      label: "On Demand",
      href: "/services/on-demand", 
      icon: Phone,
      description: "Meeting rooms & services"
    },
    {
      label: "Event Spaces",
      href: "/services/event-spaces",
      icon: MapPin,
      description: "Premium event venues"
    }
  ];

  const handleNavigation = (href: string): void => {
    navigate(href);
  };

  // Get unique areas for filtering
  const areas = [...new Set(virtualOffices.map(office => office.area))];

  // Resolve map center by selected city (fallback to Delhi)
  const resolvedCenter = (() => {
    const cityKeyFromState = selectedCity.trim().toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
    if (["delhi", "newdelhi", "delh", "dilli"].includes(cityKeyFromState)) return cityCenters.delhi;
    if (["mumbai", "bombay"].includes(cityKeyFromState)) return cityCenters.mumbai;
    if (["bangalore", "bengaluru"].includes(cityKeyFromState)) return cityCenters.bangalore;
    if (["pune", "punecity"].includes(cityKeyFromState)) return cityCenters.pune;
    if (["hyderabad", "hyd"].includes(cityKeyFromState)) return cityCenters.hyderabad;
    if (["chennai", "madras"].includes(cityKeyFromState)) return cityCenters.chennai;
    if (["kolkata", "calcutta"].includes(cityKeyFromState)) return cityCenters.kolkata;
    if (["ahmedabad", "amdavad"].includes(cityKeyFromState)) return cityCenters.ahmedabad;
    // Default
    return cityCenters.delhi;
  })();

  // Generate random coordinates around city center if not available
  const generateRandomCoordinates = (center: { lat: number; lng: number }, index: number) => {
    // Generate different offsets for each office (0.01 to 0.05 degrees)
    const seed = index + 1;
    const latOffset = ((seed * 17) % 50) / 1000 - 0.025; // -0.025 to +0.025
    const lngOffset = ((seed * 23) % 50) / 1000 - 0.025; // -0.025 to +0.025

    return {
      lat: center.lat + latOffset,
      lng: center.lng + lngOffset
    };
  };

  // Prepare marker data from virtualOffices with full details
  // Memoize to prevent unnecessary recalculations
  const mapMarkers = useMemo(() => {
    return virtualOffices.map((office, index) => {
      const imageSrc = office.image || "https://shorturl.at/Fyr6o";

      return {
        position: office.coordinates || generateRandomCoordinates(resolvedCenter, index),
        title: office.name,
        address: office.address,
        price: office.price,
        rating: office.rating,
        reviews: office.reviews,
        image: imageSrc,
        features: office.features,
      };
    });
  }, [virtualOffices, resolvedCenter]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Original Header */}
      <div className="flex-shrink-0">
        <Header />
      </div>

      {/* Main Content - Responsive Layout with Resizable Map */}
      <div className="flex flex-1 overflow-hidden mt-16 md:mt-20">
        <ResizableMapLayout
          defaultListingWidth={50}
          mapContent={
            <MapSection
              key="virtual-office-map"
              center={resolvedCenter}
              markers={mapMarkers}
              zoom={11}
              height="100%"
            />
          }
        >
          {/* Listings Content */}
          <div 
            ref={scrollContainerRef}
            className="w-full h-full overflow-y-auto"
            data-lenis-prevent
          >
            <div className="px-4 sm:px-6 py-4 sm:py-6">
            {/* Breadcrumb */}
            <div className={`flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
              <span>Home</span>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 rotate-[-90deg]" />
              <span>Virtual Office</span>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 rotate-[-90deg]" />
              <span className="text-gray-900 font-medium truncate">{selectedCity}</span>
            </div>

            {/* Page Title */}
            <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
              Virtual Office Space In {selectedCity}
            </h1>
          
          {/* City Search Section - Using Optimized SearchHeader Component */}
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
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <p className="text-xs sm:text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{virtualOffices.length} result(s)</span> for virtual office space in {selectedCity}
                </p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-primary text-xs sm:text-sm h-8 px-2 sm:px-3">
                    📍 Compare
                  </Button>
                  <Button variant="ghost" size="sm" className="text-primary text-xs sm:text-sm h-8 px-2 sm:px-3 hidden sm:flex">
                    💡 Find ideal solution
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
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

            {/* Office Cards Grid - Using Optimized ListingCard Component */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
              {loading ? (
                <div className="col-span-full text-center py-8 sm:py-12">
                  <p className="text-sm sm:text-base text-gray-600">Loading virtual offices...</p>
                </div>
              ) : error ? (
                <div className="col-span-full text-center py-8 sm:py-12">
                  <p className="text-sm sm:text-base text-red-600">{error}</p>
                </div>
              ) : virtualOffices.length === 0 ? (
                <div className="col-span-full text-center py-8 sm:py-12">
                  <p className="text-sm sm:text-base text-gray-600">No virtual offices found for {selectedCity}</p>
                </div>
              ) : virtualOffices.map((office) => (
                <ListingCard
                  key={office._id}
                  item={office}
                  onGetBestPrice={(itemId) => console.log('Get best price for:', itemId)}
                  onToggleFavorite={(itemId) => console.log('Toggle favorite for:', itemId)}
                />
              ))}
            </div>

            </div>
          </div>
        </ResizableMapLayout>
      </div>
    </div>
  );
};

export default VirtualOffice;