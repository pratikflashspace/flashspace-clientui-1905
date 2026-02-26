import { Building, MapPin, Phone, Users, ChevronDown, ChevronLeft, Grid3X3, List, Presentation } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { cityCenters } from "@/components/Map/locationData.example";
import Header from "@/components/Header";
import MapSection from "@/components/services/MapSection";
import SearchHeader from "@/components/services/SearchHeader";
import ListingCardModern from "@/components/services/ListingCardModern";
import ResizableMapLayout from "@/components/services/ResizableMapLayout";
import { getMeetingRoomsByCity } from "@/services/meetingRoom.service";
import { SkeletonCardGrid } from "@/components/ui/skeleton-loaders";
import {
    City,
    BusinessSolution,
    MeetingRoomItem,
    ViewMode,
    SortBy
} from "@/types/services";

const OnDemand = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [selectedCity, setSelectedCity] = useState<string>("");
    const [selectedLocation, setSelectedLocation] = useState<string>("");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [sortBy, setSortBy] = useState<SortBy>("popularity");
    const [selectedArea, setSelectedArea] = useState<string>("all");
    const [searchCity, setSearchCity] = useState<string>("");
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
    const [meetingRooms, setOnDemand] = useState<MeetingRoomItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    // Available cities for search
    const availableCities: City[] = [
        { name: "Ahmedabad", key: "ahmedabad" },
        { name: "Bangalore", key: "bangalore" },
        { name: "Chandigarh", key: "chandigarh" },
        { name: "Chennai", key: "chennai" },
        { name: "Delhi", key: "delhi" },
        { name: "Gurgaon", key: "gurgaon" },
        { name: "Hyderabad", key: "hyderabad" },
        { name: "Jaipur", key: "jaipur" },
        { name: "Mumbai", key: "mumbai" },
        { name: "Pune", key: "pune" },
        { name: "Ranchi", key: "ranchi" },
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

    // Fetch meeting rooms
    useEffect(() => {
        const fetchOnDemand = async () => {
            if (!selectedCity) return;

            setLoading(true);
            setError("");

            try {
                const data = await getMeetingRoomsByCity(selectedCity);
                setOnDemand(data);
            } catch (err: any) {
                setError(err.message || "Error connecting to server. Please try again later.");
                setOnDemand([]);
                console.error("Error fetching meeting rooms:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOnDemand();
    }, [selectedCity]);

    // Filter cities based on search input
    const filteredCities: City[] = availableCities.filter(city =>
        city.name.toLowerCase().includes(searchCity.toLowerCase())
    );

    const handleCitySearch = (cityName: string): void => {
        setSearchCity(cityName);
        setSelectedCity(cityName);
        setShowSuggestions(false);

        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('city', cityName);
        navigate(`?${newSearchParams.toString()}`, { replace: true });
    };

    const handleSearchChange = (value: string): void => {
        setSearchCity(value);
        setShowSuggestions(true);
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchCity(e.target.value);
        setShowSuggestions(true);
    };

    const handleSearchFocus = (): void => {
        setIsSearchFocused(true);
        setShowSuggestions(true);
    };

    const handleSearchBlur = (): void => {
        setIsSearchFocused(false);
        setTimeout(() => setShowSuggestions(false), 200);
    };

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
            label: "On-Demand",
            href: "/services/on-demand",
            icon: Presentation,
            description: "Book meeting rooms hourly"
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

    const handleGetBestPrice = (item: MeetingRoomItem): void => {
        // Navigate to a dedicated meeting room detail page
        navigate(`/meeting-room/${item._id}`, { state: { space: item } });
    };



    const resolvedCenter = (() => {
        const cityKeyFromState = selectedCity.trim().toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
        // Extended mapping for new cities
        if (["ahmedabad", "amdavad"].includes(cityKeyFromState)) return cityCenters.ahmedabad;
        if (["bangalore", "bengaluru"].includes(cityKeyFromState)) return cityCenters.bangalore;
        if (["chandigarh", "zirakpur"].includes(cityKeyFromState)) return { lat: 30.7333, lng: 76.7794 }; // Chandigarh coords
        if (["chennai", "madras"].includes(cityKeyFromState)) return cityCenters.chennai;
        if (["delhi", "newdelhi", "delh", "dilli"].includes(cityKeyFromState)) return cityCenters.delhi;
        if (["gurgaon", "gurugram"].includes(cityKeyFromState)) return cityCenters.gurgaon;
        if (["hyderabad", "hyd"].includes(cityKeyFromState)) return cityCenters.hyderabad;
        if (["jaipur"].includes(cityKeyFromState)) return cityCenters.jaipur;
        if (["mumbai", "bombay"].includes(cityKeyFromState)) return cityCenters.mumbai;
        if (["pune", "punecity"].includes(cityKeyFromState)) return cityCenters.pune;
        if (["ranchi"].includes(cityKeyFromState)) return { lat: 23.3441, lng: 85.3096 }; // Ranchi coords

        return cityCenters.delhi;
    })();

    const generateRandomCoordinates = (center: { lat: number; lng: number }, index: number) => {
        const seed = index + 1;
        const latOffset = ((seed * 17) % 50) / 1000 - 0.025;
        const lngOffset = ((seed * 23) % 50) / 1000 - 0.025;

        return {
            lat: center.lat + latOffset,
            lng: center.lng + lngOffset
        };
    };

    const mapMarkers = useMemo(() => {
        return meetingRooms.map((room, index) => {
            const imageSrc = room.image || "https://shorturl.at/Fyr6o";

            return {
                position: room.coordinates || generateRandomCoordinates(resolvedCenter, index),
                title: room.name,
                address: room.address,
                price: room.price,
                rating: room.rating,
                reviews: room.reviews,
                image: imageSrc,
                features: room.features,
            };
        });
    }, [meetingRooms, resolvedCenter]);

    return (
        <div className="flex flex-col h-screen bg-white">
            <div className="flex-shrink-0">
                <Header />
            </div>

            <div className="flex overflow-hidden mt-16 md:mt-20" style={{ height: 'calc(100vh - 4rem)' }}>
                <ResizableMapLayout
                    defaultListingWidth={50}
                    mapContent={
                        <MapSection
                            key="meeting-room-map"
                            center={resolvedCenter}
                            markers={mapMarkers}
                            zoom={11}
                            height="100%"
                        />
                    }
                >
                    <div
                        ref={scrollContainerRef}
                        className="w-full h-full overflow-y-auto"
                        data-lenis-prevent
                    >



                        {/* Mobile Back Button */}
                        <button
                            onClick={() => navigate('/')}
                            className="md:hidden flex items-center gap-2 text-sm text-gray-500 mb-4 ml-6 mt-4 hover:text-black transition"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </button>

                        {/* Breadcrumb */}
                        <div className={`flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 ml-6 mt-2 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
                            <span>Home</span>
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 rotate-[-90deg]" />
                            <span>On-Demand</span>
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 rotate-[-90deg]" />
                            <span className="text-gray-900 font-medium truncate">{selectedCity}</span>
                        </div>

                        {/* Page Title */}
                        <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 ml-6 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
                            On-Demand In {selectedCity}
                        </h1>

                        <div className="px-4 sm:px-6">
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
                                currentService="On-Demand"
                                businessSolutions={businessSolutions}
                                onServiceNavigation={handleNavigation}
                            />
                        </div>

                        <div className="px-4 sm:px-6 py-4 sm:py-6">
                            {/* Results Header */}
                            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
                                <p className="text-sm text-gray-600">
                                    Showing <span className="font-semibold text-gray-900">{meetingRooms.length} result(s)</span> for meeting rooms in {selectedCity}
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

                            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 sm:mb-8 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
                                {loading ? (
                                    <SkeletonCardGrid count={6} />
                                ) : error ? (
                                    <div className="col-span-full text-center py-8 sm:py-12">
                                        <p className="text-sm sm:text-base text-red-600">{error}</p>
                                    </div>
                                ) : meetingRooms.length === 0 ? (
                                    <div className="col-span-full text-center py-8 sm:py-12">
                                        <p className="text-sm sm:text-base text-gray-600">No meeting rooms found for {selectedCity}</p>
                                    </div>
                                ) : meetingRooms.map((room) => (
                                    <ListingCardModern
                                        key={room._id}
                                        item={room}
                                        onGetBestPrice={() => handleGetBestPrice(room)}
                                        onToggleFavorite={(itemId) => console.log('Toggle favorite for:', itemId)}
                                    />
                                ))}
                            </div>

                        </div>
                    </div>
                </ResizableMapLayout>
            </div >
        </div >
    );
};

export default OnDemand;
