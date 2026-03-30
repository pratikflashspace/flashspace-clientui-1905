import { Building, MapPin, Phone, Users, ChevronDown, ChevronRight, Grid3X3, List, Presentation, Map } from "lucide-react";
import MeetingRoomHero from "@/components/services/MeetingRoomHero";
import { Button } from "@/components/ui/button";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import ListingCardModern from "@/components/services/ListingCardModern";
import MapLibreMap from "@/components/Map/MapLibreMap";
import { getMeetingRoomsByCity } from "@/services/meetingRoom.service";
import { SkeletonCardGrid } from "@/components/ui/skeleton-loaders";
import {
    City,
    BusinessSolution,
    MeetingRoomItem,
    ViewMode,
    SortBy
} from "@/types/services";
import { useLocationMetadata } from "@/hooks/useLocationMetadata";

const MeetingRooms = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [mapCollapsed, setMapCollapsed] = useState(false);
    const [selectedCity, setSelectedCity] = useState<string>("");
    const [selectedLocation, setSelectedLocation] = useState<string>("");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [sortBy, setSortBy] = useState<SortBy>("popularity");
    const [selectedArea, setSelectedArea] = useState<string>("all");
    const [searchCity, setSearchCity] = useState<string>("");
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
    const [meetingRooms, setMeetingRooms] = useState<MeetingRoomItem[]>([]);
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

    // Fetch meeting rooms
    useEffect(() => {
        const fetchMeetingRooms = async () => {
            if (!selectedCity) return;

            setLoading(true);
            setError("");

            try {
                const data = await getMeetingRoomsByCity(selectedCity);
                setMeetingRooms(data);
            } catch (err: any) {
                setError(err.message || "Error connecting to server. Please try again later.");
                setMeetingRooms([]);
                console.error("Error fetching meeting rooms:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMeetingRooms();
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
            label: "Meeting Rooms",
            href: "/services/meeting-rooms",
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

    const { resolveCoordinates } = useLocationMetadata();

    const resolvedCenter = useMemo(() => {
        return resolveCoordinates(selectedCity);
    }, [selectedCity, resolveCoordinates]);

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
                title: room.spaceId || room.name,
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
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            {/* Full-width top section: Hero */}
            <div className="mt-20 bg-background border-b border-border/60">
                <MeetingRoomHero
                    currentCity={selectedCity}
                    onCitySearch={handleCitySearch}
                />
            </div>

            <div className="flex-1 lg:flex h-auto lg:h-[calc(100vh-13rem)] relative">
                {/* Listings Content */}
                <div
                    className={`overflow-y-auto bg-muted/20 transition-all duration-300 ease-in-out relative ${mapCollapsed ? "w-full" : "w-full lg:w-[58%] border-r border-border/40"}`}
                >
                    <div className="px-4 sm:px-8 py-6">
                        {/* Result Count & Filters */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
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
                                    <List className="w-4 h-4" />
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
        </div>
    );
};

export default MeetingRooms;
