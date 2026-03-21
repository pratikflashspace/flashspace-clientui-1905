import { Building, MapPin, Phone, Users, ChevronDown, ChevronRight, Grid3X3, List, CheckCircle, Star, Calendar, Utensils, Camera, Music, Shield, Award, Search, Map, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import MapLibreMap from "@/components/Map/MapLibreMap";
import ListingCardModern from "@/components/services/ListingCardModern";
import {
  City,
  BusinessSolution,
  ViewMode,
  SortBy
} from "@/types/services";
import { useLocationMetadata } from "@/hooks/useLocationMetadata";

// Define EventSpaceItem locally since it's used in this file
interface EventSpaceItem {
  _id: string;
  name: string;
  address: string;
  area: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  type: string;
  capacity: string;
  features: string[];
  availability?: string;
  popular?: boolean;
  image?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface ServiceItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const EventSpaces = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mapCollapsed, setMapCollapsed] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("popularity");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchCity, setSearchCity] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  // Available cities for search - matching cities with actual workspace data
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

  const services: ServiceItem[] = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Event Planning",
      description: "Complete event planning and coordination services from concept to execution."
    },
    {
      icon: <Utensils className="w-6 h-6" />,
      title: "Catering Services",
      description: "Professional catering with diverse menu options and dietary accommodations."
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Audio Visual",
      description: "State-of-the-art AV equipment with professional technical support."
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: "Entertainment",
      description: "Live entertainment, DJ services, and performance coordination."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Security Services",
      description: "Professional security staff and crowd management for safe events."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Premium Support",
      description: "Dedicated event coordinators ensuring flawless execution."
    }
  ];

  // Mock data for event spaces by city with proper coordinates
  const mockEventSpaces: any = {
    delhi: [
      { id: 1, name: "Grand Imperial Hall", address: "Connaught Place, New Delhi", price: "₹50,000/day", originalPrice: "₹65,000", rating: 4.8, reviews: 156, type: "Conference Hall", capacity: "500-800", features: ["Premium AV Setup", "Catering Kitchen", "VIP Lounge", "Parking"], area: "Connaught Place", availability: "Available Now", popular: true, coordinates: { lat: 28.6329, lng: 77.2197 } },
      { id: 2, name: "Tech Summit Center", address: "Gurgaon Cyber Hub", price: "₹75,000/day", originalPrice: "₹95,000", rating: 4.9, reviews: 234, type: "Convention Center", capacity: "1000-1500", features: ["Latest Tech", "Multiple Halls", "Exhibition Space", "Hospitality Suite"], area: "Gurgaon", availability: "Available Now", popular: true, coordinates: { lat: 28.4595, lng: 77.0266 } },
      { id: 3, name: "Heritage Banquet", address: "Khan Market, Delhi", price: "₹35,000/day", originalPrice: "₹45,000", rating: 4.6, reviews: 98, type: "Banquet Hall", capacity: "200-300", features: ["Traditional Decor", "Garden Area", "Premium Catering", "Valet Service"], area: "Khan Market", availability: "Available Now", popular: false, coordinates: { lat: 28.5986, lng: 77.2316 } },
      { id: 4, name: "Modern Event Space", address: "Saket, New Delhi", price: "₹40,000/day", originalPrice: "₹52,000", rating: 4.7, reviews: 167, type: "Multi-purpose Hall", capacity: "300-500", features: ["Flexible Layout", "LED Walls", "Sound System", "Climate Control"], area: "Saket", availability: "Available Now", popular: false, coordinates: { lat: 28.5244, lng: 77.2066 } },
    ],
    mumbai: [
      { id: 5, name: "BKC Grand Ballroom", address: "Bandra Kurla Complex", price: "₹85,000/day", originalPrice: "₹110,000", rating: 4.9, reviews: 298, type: "Ballroom", capacity: "800-1200", features: ["Ocean View", "Premium Interiors", "Full Service", "Concierge"], area: "BKC", availability: "Available Now", popular: true, coordinates: { lat: 19.0596, lng: 72.8656 } },
      { id: 6, name: "Worli Convention Hall", address: "Worli, Mumbai", price: "₹60,000/day", originalPrice: "₹78,000", rating: 4.7, reviews: 189, type: "Convention Hall", capacity: "600-900", features: ["Sea Link View", "Modern AV", "Exhibition Space", "Breakout Rooms"], area: "Worli", availability: "Available Now", popular: false, coordinates: { lat: 19.0176, lng: 72.8156 } },
      { id: 7, name: "Andheri Event Center", address: "Andheri East, Mumbai", price: "₹45,000/day", originalPrice: "₹58,000", rating: 4.5, reviews: 134, type: "Event Center", capacity: "400-600", features: ["Airport Proximity", "Multiple Configurations", "Catering Facilities", "Ample Parking"], area: "Andheri East", availability: "Available Now", popular: false, coordinates: { lat: 19.1136, lng: 72.8697 } },
    ],
    bangalore: [
      { id: 8, name: "Tech Valley Auditorium", address: "Koramangala, Bangalore", price: "₹55,000/day", originalPrice: "₹70,000", rating: 4.8, reviews: 223, type: "Auditorium", capacity: "700-1000", features: ["Tech Hub Location", "Advanced AV", "Startup Friendly", "Innovation Labs"], area: "Koramangala", availability: "Available Now", popular: true, coordinates: { lat: 12.9352, lng: 77.6245 } },
      { id: 9, name: "Whitefield Conference", address: "Whitefield, Bangalore", price: "₹42,000/day", originalPrice: "₹55,000", rating: 4.6, reviews: 167, type: "Conference Center", capacity: "300-500", features: ["IT Corridor", "Modern Facilities", "Video Conferencing", "Business Lounge"], area: "Whitefield", availability: "Available Now", popular: false, coordinates: { lat: 12.9698, lng: 77.7500 } },
      { id: 10, name: "HSR Event Plaza", address: "HSR Layout, Bangalore", price: "₹38,000/day", originalPrice: "₹48,000", rating: 4.4, reviews: 112, type: "Event Plaza", capacity: "250-400", features: ["Residential Area", "Community Events", "Flexible Timing", "Local Cuisine"], area: "HSR Layout", availability: "Available Now", popular: false, coordinates: { lat: 12.9116, lng: 77.6473 } },
    ],
    pune: [
      { id: 11, name: "Hinjewadi IT Convention", address: "Hinjewadi, Pune", price: "₹48,000/day", originalPrice: "₹62,000", rating: 4.7, reviews: 189, type: "IT Convention", capacity: "500-750", features: ["IT Park Location", "Corporate Events", "Modern Tech", "Executive Services"], area: "Hinjewadi", availability: "Available Now", popular: true, coordinates: { lat: 18.5912, lng: 73.7389 } },
      { id: 12, name: "Koregaon Premium Hall", address: "Koregaon Park, Pune", price: "₹52,000/day", originalPrice: "₹68,000", rating: 4.8, reviews: 156, type: "Premium Hall", capacity: "400-600", features: ["Upscale Location", "Luxury Amenities", "Fine Dining", "Concierge Service"], area: "Koregaon Park", availability: "Available Now", popular: false, coordinates: { lat: 18.5362, lng: 73.8958 } },
    ]
  };

  // Get event spaces for selected city
  let cityKey = selectedCity.trim().toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
  if (["delhi", "newdelhi", "delh", "dilli"].includes(cityKey)) cityKey = "delhi";
  if (["mumbai", "bombay"].includes(cityKey)) cityKey = "mumbai";
  if (["bangalore", "bengaluru"].includes(cityKey)) cityKey = "bangalore";
  if (["pune", "punecity"].includes(cityKey)) cityKey = "pune";
  const citySpaces = mockEventSpaces[cityKey] || mockEventSpaces.delhi;

  const { resolveCoordinates } = useLocationMetadata();

  const resolvedCenter = useMemo(() => {
    return resolveCoordinates(selectedCity);
  }, [selectedCity, resolveCoordinates]);

  const mapMarkers = useMemo(() => {
    return citySpaces.map((space: any) => {
      const imageMap: Record<string, string> = {
        "Grand Imperial Hall": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80&fit=crop&auto=format",
        "Tech Summit Center": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&fit=crop&auto=format",
        "Heritage Banquet": "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80&fit=crop&auto=format",
        "Modern Event Space": "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80&fit=crop&auto=format",
        "BKC Grand Ballroom": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80&fit=crop&auto=format",
        "Worli Convention Hall": "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80&fit=crop&auto=format",
        "Andheri Event Center": "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80&fit=crop&auto=format",
        "Tech Valley Auditorium": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80&fit=crop&auto=format",
        "Whitefield Conference": "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80&fit=crop&auto=format",
        "HSR Event Plaza": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80&fit=crop&auto=format",
        "Hinjewadi IT Convention": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80&fit=crop&auto=format",
        "Koregaon Premium Hall": "https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?w=800&q=80&fit=crop&auto=format"
      };
      const imageSrc = imageMap[space.name] || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80&fit=crop&auto=format";

      return {
        position: space.coordinates || resolvedCenter,
        title: space.name,
        address: space.address,
        price: space.price,
        rating: space.rating,
        reviews: space.reviews,
        image: imageSrc,
        features: space.features,
      };
    });
  }, [citySpaces, resolvedCenter]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Full-width top section: Breadcrumb + Filters */}
      <div className="mt-20 bg-background border-b border-border/60">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumb */}
          <div className={`flex items-center gap-1.5 text-xs text-muted-foreground mb-4 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
            <span className="hover:text-foreground transition-colors cursor-pointer" onClick={() => navigate('/')}>Home</span>
            <ChevronRight className="w-3 h-3" />
            <span className="hover:text-foreground transition-colors cursor-pointer">Event Spaces</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium truncate">{selectedCity}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
            <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
              Event Spaces In {selectedCity}
            </h1>

            <div className={`flex items-center gap-2 transition-all duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
              <div className="relative flex-1 min-w-[200px] sm:min-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  placeholder="Search for a city..."
                  className="pl-9 pr-4 h-10 w-full"
                />

                {/* City Suggestions */}
                {showSuggestions && filteredCities.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-border rounded-md shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
                    {filteredCities.map((city) => (
                      <div
                        key={city.key}
                        className="px-4 py-2.5 hover:bg-muted cursor-pointer border-b border-border last:border-b-0 transition-colors"
                        onClick={() => handleCitySearch(city.name)}
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span className="font-medium">{city.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 px-4 flex items-center gap-2">
                    Services <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {businessSolutions.map((solution) => (
                    <DropdownMenuItem key={solution.label} onClick={() => navigate(solution.href)} className="cursor-pointer">
                      <solution.icon className="w-4 h-4 mr-2" />
                      <span>{solution.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 lg:flex h-auto lg:h-[calc(100vh-13rem)] relative">
        {/* Listings Content */}
        <div
          className={`overflow-y-auto bg-muted/20 transition-all duration-300 ease-in-out relative ${mapCollapsed ? "w-full" : "w-full lg:w-[58%] border-r border-border/40"}`}
        >
          <div className="px-4 sm:px-8 py-6">
            {/* Results Header */}
            <div className={`flex items-center justify-between mb-6 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{citySpaces.length} result(s)</span> for event spaces
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Event Space Listings */}
            <div className={`grid gap-6 mb-12 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
              {citySpaces.map((space: any, index: number) => {
                const imageMap: Record<string, string> = {
                  "Grand Imperial Hall": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80&fit=crop&auto=format",
                  "Tech Summit Center": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&fit=crop&auto=format",
                  "Heritage Banquet": "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80&fit=crop&auto=format",
                  "Modern Event Space": "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80&fit=crop&auto=format",
                  "BKC Grand Ballroom": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80&fit=crop&auto=format",
                  "Worli Convention Hall": "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80&fit=crop&auto=format",
                  "Andheri Event Center": "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&q=80&fit=crop&auto=format",
                  "Tech Valley Auditorium": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80&fit=crop&auto=format",
                  "Whitefield Conference": "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80&fit=crop&auto=format",
                  "HSR Event Plaza": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80&fit=crop&auto=format",
                  "Hinjewadi IT Convention": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80&fit=crop&auto=format",
                  "Koregaon Premium Hall": "https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?w=800&q=80&fit=crop&auto=format"
                };
                return (
                  <ListingCardModern
                    key={space.id}
                    item={{
                      ...space,
                      _id: space.id,
                      image: imageMap[space.name]
                    }}
                    index={index}
                    onClick={() => navigate(`/event-spaces/${space.id}`)}
                  />
                );
              })}
            </div>

            {/* Services Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Complete Event Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => (
                  <Card key={index} className="bg-white border border-border/60 hover:shadow-md transition-shadow">
                    <CardHeader className="text-center pb-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-primary">{service.icon}</span>
                      </div>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-sm text-muted-foreground">
                      {service.description}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Consultant Section */}
            <div className="bg-white rounded-xl border border-border/60 p-6 mb-12">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Plan your perfect event with our Expert Team
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Get personalized recommendations and end-to-end event planning assistance from our experienced consultants.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Free venue consultation</div>
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Budget planning assistance</div>
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Vendor coordination</div>
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Event day management</div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button className="w-full sm:w-auto">Speak to our consultant</Button>
                  <Button variant="outline" className="w-full sm:w-auto">Request callback</Button>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">How do I book an event space?</h4>
                    <p className="text-sm text-muted-foreground">Simply browse our venues, select your preferred space, and click "Get best price" to start the booking process.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Are the prices negotiable?</h4>
                    <p className="text-sm text-muted-foreground">Yes, all our listed prices are starting prices and negotiable based on your event requirements.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Can I visit the venue before booking?</h4>
                    <p className="text-sm text-muted-foreground">Absolutely! We encourage site visits. Contact us to schedule a venue tour.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Do you provide event planning services?</h4>
                    <p className="text-sm text-muted-foreground">Yes, we offer comprehensive event planning services including vendor coordination and on-site support.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-primary rounded-xl p-8 text-center text-white mb-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Plan Your Event?</h3>
              <p className="text-white/80 mb-6 max-w-2xl mx-auto text-sm">
                Let our experts help you find the perfect venue and plan an unforgettable event.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" className="px-8">Get Expert Help Now</Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8">Browse More Venues</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Map */}
        <div
          className={`hidden lg:block transition-all duration-300 ease-in-out relative ${mapCollapsed ? "w-0 overflow-hidden opacity-0" : "w-[42%] opacity-100"}`}
        >
          <div className="sticky top-20 h-[calc(100vh-5.5rem)] m-2 sm:m-4 rounded-xl overflow-hidden shadow-sm border border-border/30">
            <button
              onClick={() => setMapCollapsed(!mapCollapsed)}
              className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full border border-border bg-card shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200 cursor-pointer"
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

        {/* Floating map button */}
        {mapCollapsed && (
          <button
            onClick={() => setMapCollapsed(false)}
            className="fixed top-[184px] right-8 z-30 w-10 h-10 rounded-full border border-border bg-card shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200 cursor-pointer"
          >
            <Map className="w-4.5 h-4.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default EventSpaces;