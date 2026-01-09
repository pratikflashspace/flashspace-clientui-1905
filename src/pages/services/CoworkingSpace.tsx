import { Building, MapPin, Phone, Users, ChevronDown, Grid3X3, List, Wifi, Coffee, Calendar, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { cityCenters } from "@/components/Map/locationData.example";
import Header from "@/components/Header";
import MapSection from "@/components/services/MapSection";
import SearchHeader from "@/components/services/SearchHeader";
import ListingCardModern from "@/components/services/ListingCardModern";
import ResizableMapLayout from "@/components/services/ResizableMapLayout";
import { getCoworkingSpacesByCity } from "@/services/coworkingSpace.service";
import { SkeletonCardGrid } from "@/components/ui/skeleton-loaders";
import {
  City,
  BusinessSolution,
  CoworkingSpaceItem,
  ViewMode,
  SortBy
} from "@/types/services";

const CoworkingSpace = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("popularity");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchCity, setSearchCity] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [coworkingSpaces, setCoworkingSpaces] = useState<CoworkingSpaceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Available cities for search - only cities with actual coworking space data
  const availableCities: City[] = [
    { name: "Ahmedabad", key: "ahmedabad" },
    { name: "Bangalore", key: "bangalore" },
    { name: "Chennai", key: "chennai" },
    { name: "Delhi", key: "delhi" },
    { name: "Dharamshala", key: "dharamshala" },
    { name: "Gurgaon", key: "gurgaon" },
    { name: "Hyderabad", key: "hyderabad" },
    { name: "Jaipur", key: "jaipur" },
    { name: "Jammu", key: "jammu" }
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

    scrollContainer.setAttribute('data-lenis-prevent', 'true');

    const preventLenis = (e: WheelEvent) => {
      e.stopPropagation();
    };

    scrollContainer.addEventListener('wheel', preventLenis, { passive: false });

    return () => {
      scrollContainer.removeEventListener('wheel', preventLenis);
    };
  }, []);

  // Fetch coworking spaces from API
  useEffect(() => {
    const fetchCoworkingSpaces = async () => {
      if (!selectedCity) return;

      setLoading(true);
      setError("");

      try {
        const data = await getCoworkingSpacesByCity(selectedCity);
        setCoworkingSpaces(data);
      } catch (err: any) {
        setError(err.message || "Error connecting to server. Please try again later.");
        setCoworkingSpaces([]);
        console.error("Error fetching coworking spaces:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoworkingSpaces();
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

  // Map space names to their routes
  const spaceRoutes: Record<string, string> = {
    "Stirring Minds": "/space/stirring-minds",
    "Virtualexcel": "/space/virtualexcel",
    "Work & Beyond": "/space/work-and-beyond",
    "Work &amp; Beyond": "/space/work-and-beyond",
    "Okhla Alt F": "/space/okhla-alt-f",
    "Budha Coworking": "/space/budha-coworking",
    "Mytime Cowork": "/space/mytime-cowork"
  };

  const handleGetBestPrice = (space: CoworkingSpaceItem): void => {
    const route = spaceRoutes[space.name] || `/space/${space._id}`;
    navigate(route, { state: { type: 'coworking' } });
  };

  // Get unique areas and types for filtering
  const areas = [...new Set(coworkingSpaces.map(space => space.area))];
  const types = [...new Set(coworkingSpaces.map(space => space.type))];

  // Resolve map center by selected city (fallback to Delhi)
  const resolvedCenter = useMemo(() => {
    const cityKeyFromState = selectedCity.trim().toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
    if (["ahmedabad", "amdavad"].includes(cityKeyFromState)) return cityCenters.ahmedabad;
    if (["bangalore", "bengaluru"].includes(cityKeyFromState)) return cityCenters.bangalore;
    if (["chennai", "madras"].includes(cityKeyFromState)) return cityCenters.chennai;
    if (["delhi", "newdelhi", "delh", "dilli"].includes(cityKeyFromState)) return cityCenters.delhi;
    if (["dharamshala", "dharamsala"].includes(cityKeyFromState)) return cityCenters.dharamshala;
    if (["gurgaon", "gurugram"].includes(cityKeyFromState)) return cityCenters.gurgaon;
    if (["hyderabad", "hyd"].includes(cityKeyFromState)) return cityCenters.hyderabad;
    if (["jaipur"].includes(cityKeyFromState)) return cityCenters.jaipur;
    if (["jammu"].includes(cityKeyFromState)) return cityCenters.jammu;
    if (["mumbai", "bombay"].includes(cityKeyFromState)) return cityCenters.mumbai;
    if (["pune", "punecity"].includes(cityKeyFromState)) return cityCenters.pune;
    if (["kolkata", "calcutta"].includes(cityKeyFromState)) return cityCenters.kolkata;
    if (["lucknow"].includes(cityKeyFromState)) return cityCenters.lucknow;
    if (["surat"].includes(cityKeyFromState)) return cityCenters.surat;
    if (["noida"].includes(cityKeyFromState)) return cityCenters.noida;
    return cityCenters.delhi;
  }, [selectedCity]);

  // Generate random coordinates around city center if not available
  const generateRandomCoordinates = (center: { lat: number; lng: number }, index: number) => {
    // Generate different offsets for each space (0.01 to 0.05 degrees)
    const seed = index + 1;
    const latOffset = ((seed * 17) % 50) / 1000 - 0.025; // -0.025 to +0.025
    const lngOffset = ((seed * 23) % 50) / 1000 - 0.025; // -0.025 to +0.025

    return {
      lat: center.lat + latOffset,
      lng: center.lng + lngOffset
    };
  };

  // Prepare marker data from coworkingSpaces with full details
  // Memoize to prevent unnecessary recalculations
  const mapMarkers = useMemo(() => {
    const isValidCoordinates = (coords: any): coords is { lat: number; lng: number } => {
      return (
        coords &&
        typeof coords.lat === 'number' && !Number.isNaN(coords.lat) &&
        typeof coords.lng === 'number' && !Number.isNaN(coords.lng)
      );
    };

    return coworkingSpaces.map((space, index) => {
      const imageSrc = space.image || "/Logo/Stage.png";
      const position = isValidCoordinates(space.coordinates)
        ? space.coordinates
        : generateRandomCoordinates(resolvedCenter, index);

      return {
        position,
        title: space.name,
        address: space.address,
        price: space.price,
        rating: space.rating,
        reviews: space.reviews,
        image: imageSrc,
        features: space.features,
      };
    });
  }, [coworkingSpaces, resolvedCenter]);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      < div className="flex-shrink-0" >
        <Header />
      </div >

      {/* Main Content - Responsive Layout with Resizable Map */}
      < div className="flex overflow-hidden mt-16 md:mt-20" style={{ height: 'calc(100vh - 4rem)' }}>
        <ResizableMapLayout
          defaultListingWidth={50}
          mapContent={
            <MapSection
              key="coworking-map"
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
              <div className={`flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
                <span>Home</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 rotate-[-90deg]" />
                <span>Coworking</span>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 rotate-[-90deg]" />
                <span className="text-gray-900 font-medium truncate">{selectedCity}</span>
              </div>

              {/* Page Title */}
              <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
                Coworking Space In {selectedCity}
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
                currentService="Coworking Space"
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
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
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
              
              <Button variant="outline" className="text-sm">
                Reset filters
              </Button>
            </div>
          </div> */}

          {/* Results Header */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
            <p className="text-xs sm:text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{coworkingSpaces.length} result(s)</span> for coworking space in {selectedCity}
            </p>
            
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

          {/* Coworking Space Listings - Using Optimized ListingCard Component */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
            {loading ? (
              <SkeletonCardGrid count={6} />
            ) : error ? (
              <div className="col-span-full text-center py-8 sm:py-12">
                <p className="text-sm sm:text-base text-red-600">{error}</p>
              </div>
            ) : coworkingSpaces.length === 0 ? (
              <div className="col-span-full text-center py-8 sm:py-12">
                <p className="text-sm sm:text-base text-gray-600">No coworking spaces found for {selectedCity}</p>
              </div>
            ) : coworkingSpaces.map((space, index) => (
              <ListingCardModern
                key={space._id}
                item={space}
                index={index}
                onClick={() => navigate(`/coworking-space/${space._id}`)}
              />
            ))}
          </div>

              {/* What is Coworking Space Section */}
              {/* <div className={`bg-gradient-to-br from-[#172A3A] to-[#172A3A]/90 rounded-2xl p-8 mb-8 relative z-30 transition-opacity duration-300 overflow-hidden ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#EDB003]/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-6">What is a Coworking Space?</h2>
              <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                Coworking spaces are shared work environments where professionals from different companies work alongside each other.
                They offer flexible workspace solutions with modern amenities, networking opportunities, and a vibrant community atmosphere.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#EDB003] rounded-full flex items-center justify-center flex-shrink-0">
                      <Wifi className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Modern Amenities</h3>
                      <p className="text-gray-300 text-sm">High-speed internet, ergonomic furniture, meeting rooms, and all essential office facilities included.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#EDB003] rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Networking Community</h3>
                      <p className="text-gray-300 text-sm">Connect with like-minded professionals, attend events, and grow your business network.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#EDB003] rounded-full flex items-center justify-center flex-shrink-0">
                      <Coffee className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Premium Facilities</h3>
                      <p className="text-gray-300 text-sm">Complimentary coffee, breakout areas, phone booths, and recreational zones for work-life balance.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#EDB003] rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Flexible Plans</h3>
                      <p className="text-gray-300 text-sm">Choose from hot desks, dedicated desks, or private cabins with daily, monthly, or yearly plans.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#EDB003]/20 backdrop-blur-sm border border-[#EDB003]/30 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#EDB003]" />
                  Why Choose Coworking?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-200">
                    <CheckCircle className="w-4 h-4 text-[#EDB003] flex-shrink-0" />
                    <span>Cost-effective & flexible workspace</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-200">
                    <CheckCircle className="w-4 h-4 text-[#EDB003] flex-shrink-0" />
                    <span>Built-in professional network</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-200">
                    <CheckCircle className="w-4 h-4 text-[#EDB003] flex-shrink-0" />
                    <span>Boost productivity & creativity</span>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

              {/* Consultant Section */}
              <div className={`bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
                <div className="flex flex-col gap-4">
                  <h3 className="text-base sm:text-xl font-bold text-gray-900">
                    Upgrade your office with Nitin Kashyap & team
                  </h3>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <img src="/Logo/Stage.png" alt="Consultant" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">Nitin Kashyap</p>
                        <p className="text-xs sm:text-sm text-gray-600">+91 8100888777</p>
                        <p className="text-xs sm:text-sm text-primary">FlashSpace Consultant</p>
                      </div>
                    </div>
                    <Button className="bg-primary text-white w-full sm:w-auto text-sm h-9">Contact Nitin</Button>
                  </div>

                  <p className="text-sm sm:text-base text-gray-600">
                    Nitin's team assisted 200+ corporates in {selectedCity} to move into their new office.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Brand selection & location strategy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Office scouting, tours & local expertise</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Layout optimization & design consultancy</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </ResizableMapLayout>
      </div >
    </div >
  );
};

export default CoworkingSpace;