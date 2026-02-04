/**
 * SERVICE PAGE TEMPLATE
 *
 * This template demonstrates how to use the optimized, reusable components
 * for creating service pages (Coworking Space, Event Space, etc.)
 *
 * Key Performance Optimizations:
 * 1. React.memo on all child components to prevent unnecessary re-renders
 * 2. useMemo for expensive computations (markers, filters)
 * 3. Lazy image loading in ListingCard
 * 4. Custom comparison functions in memo for precise re-render control
 * 5. Separated concerns: SearchHeader, ListingCard, MapSection
 *
 * How to use this template:
 * 1. Copy this file to create a new service page (e.g., CoworkingSpace.tsx)
 * 2. Update the API endpoint and data type
 * 3. Customize the service name and business solutions
 * 4. Adjust any service-specific features
 */

import { Building, MapPin, Phone, Users, ChevronDown, Grid3X3, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { cityCenters } from "@/components/Map/locationData.example";
import Header from "@/components/Header";
import MapSection from "@/components/services/MapSection";
import SearchHeader from "@/components/services/SearchHeader";
// import ListingCard from "@/components/services/ListingCard";
import {
  City,
  BusinessSolution,
  ViewMode,
  SortBy,
  VirtualOfficeItem // Or use CoworkingSpaceItem, EventSpaceItem based on your service
} from "@/types/services";
import ListingCardModern from "./ListingCardModern";

// Type alias for better code readability
type ListingItem = VirtualOfficeItem; // Update based on your service type

const ServicePageTemplate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // State Management
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("popularity");
  const [searchCity, setSearchCity] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [items, setItems] = useState<ListingItem[]>([]);
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

  // Initialize from URL params
  useEffect(() => {
    const city = searchParams.get('city') || 'Delhi';
    const location = searchParams.get('location') || '';
    setSelectedCity(city);
    setSelectedLocation(location);
    setSearchCity(city);
  }, [searchParams]);

  // Disable Lenis smooth scroll for the scrollable container
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

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCity) return;

      setLoading(true);
      setError("");

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        // TODO: Update this endpoint based on your service type
        const response = await fetch(`${apiUrl}/yourService/getByCity/${selectedCity}`);
        const data = await response.json();

        if (data.success) {
          setItems(data.data);
        } else {
          setError(data.message || "Failed to fetch items");
          setItems([]);
        }
      } catch (err) {
        setError("Error connecting to server. Please try again later.");
        setItems([]);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Business Solutions - Update based on your services
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

  // Prepare marker data - Memoized for performance
  const mapMarkers = useMemo(() => {
    return items.map((item) => {
      const imageSrc = item.image || "https://shorturl.at/Fyr6o";

      return {
        position: item.coordinates || resolvedCenter,
        title: item.name,
        address: item.address,
        price: item.price,
        rating: item.rating,
        reviews: item.reviews,
        image: imageSrc,
        features: item.features,
      };
    });
  }, [items, resolvedCenter]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      {/* Header */}
      <div className="flex-shrink-0">
        <Header />
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex flex-1 overflow-hidden mt-20">
        {/* Left Side: Listings - Scrollable */}
        <div
          ref={scrollContainerRef}
          className="w-1/2 overflow-y-auto"
          data-lenis-prevent
        >
          <div className="px-6 py-6">
            {/* Breadcrumb */}
            <div className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
              <span>Home</span>
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              <span>Your Service</span> {/* TODO: Update this */}
              <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              <span className="text-gray-900 dark:text-white font-medium">{selectedCity}</span>
            </div>

            {/* Page Title */}
            <h1 className={`text-3xl font-bold text-gray-900 dark:text-white mb-6 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
              Your Service In {selectedCity} {/* TODO: Update this */}
            </h1>

            {/* Search Header Component */}
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
              currentService="Your Service" // TODO: Update this
              businessSolutions={businessSolutions}
              onServiceNavigation={handleNavigation}
            />

            {/* Results Header */}
            <div className={`flex items-center justify-between mb-6 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
              <div className="flex items-center gap-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Showing <span className="font-semibold text-gray-900 dark:text-white">{items.length} result(s)</span> for your service in {selectedCity}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex items-center gap-1"
                >
                  <List className="w-4 h-4" />
                  List
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex items-center gap-1"
                >
                  <Grid3X3 className="w-4 h-4" />
                  Grid
                </Button>
              </div>
            </div>

            {/* Listing Cards Grid */}
            <div className={`grid grid-cols-2 gap-4 mb-8 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
              ) : error ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              ) : items.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">No items found for {selectedCity}</p>
                </div>
              ) : items.map((item) => (
                <ListingCardModern
                  key={item._id}
                  item={item}
                  onGetBestPrice={(itemId) => console.log('Get best price for:', itemId)}
                  onToggleFavorite={(itemId) => console.log('Toggle favorite for:', itemId)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Map - Fixed */}
        <MapSection
          center={resolvedCenter}
          markers={mapMarkers}
          zoom={11}
          height="100%"
        />
      </div>
    </div>
  );
};

export default ServicePageTemplate;
