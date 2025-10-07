import { Building, MapPin, Mail, Phone, FileText, CheckCircle, Star, Users, Award, ChevronDown, Filter, Grid3X3, List, Search, Calendar, Utensils, Camera, Music, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { 
  City, 
  BusinessSolution, 
  EventSpaceItem, 
  EventSpaceCityKey, 
  EventSpacesByCity, 
  ServiceItem, 
  ViewMode, 
  SortBy 
} from "@/types/services";

const EventSpaces = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("popularity");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchCity, setSearchCity] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

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
    window.location.href = href;
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

  // Mock data for event spaces by city
  const mockEventSpaces: any = {
    delhi: [
      { id: 1, name: "Grand Imperial Hall", address: "Connaught Place, New Delhi", price: "₹50,000/day", originalPrice: "₹65,000", rating: 4.8, reviews: 156, type: "Conference Hall", capacity: "500-800", features: ["Premium AV Setup", "Catering Kitchen", "VIP Lounge", "Parking"], area: "Connaught Place", availability: "Available Now", popular: true },
      { id: 2, name: "Tech Summit Center", address: "Gurgaon Cyber Hub", price: "₹75,000/day", originalPrice: "₹95,000", rating: 4.9, reviews: 234, type: "Convention Center", capacity: "1000-1500", features: ["Latest Tech", "Multiple Halls", "Exhibition Space", "Hospitality Suite"], area: "Gurgaon", availability: "Available Now", popular: true },
      { id: 3, name: "Heritage Banquet", address: "Khan Market, Delhi", price: "₹35,000/day", originalPrice: "₹45,000", rating: 4.6, reviews: 98, type: "Banquet Hall", capacity: "200-300", features: ["Traditional Decor", "Garden Area", "Premium Catering", "Valet Service"], area: "Khan Market", availability: "Available Now", popular: false },
      { id: 4, name: "Modern Event Space", address: "Saket, New Delhi", price: "₹40,000/day", originalPrice: "₹52,000", rating: 4.7, reviews: 167, type: "Multi-purpose Hall", capacity: "300-500", features: ["Flexible Layout", "LED Walls", "Sound System", "Climate Control"], area: "Saket", availability: "Available Now", popular: false },
    ],
    mumbai: [
      { id: 5, name: "BKC Grand Ballroom", address: "Bandra Kurla Complex", price: "₹85,000/day", originalPrice: "₹110,000", rating: 4.9, reviews: 298, type: "Ballroom", capacity: "800-1200", features: ["Ocean View", "Premium Interiors", "Full Service", "Concierge"], area: "BKC", availability: "Available Now", popular: true },
      { id: 6, name: "Worli Convention Hall", address: "Worli, Mumbai", price: "₹60,000/day", originalPrice: "₹78,000", rating: 4.7, reviews: 189, type: "Convention Hall", capacity: "600-900", features: ["Sea Link View", "Modern AV", "Exhibition Space", "Breakout Rooms"], area: "Worli", availability: "Available Now", popular: false },
      { id: 7, name: "Andheri Event Center", address: "Andheri East, Mumbai", price: "₹45,000/day", originalPrice: "₹58,000", rating: 4.5, reviews: 134, type: "Event Center", capacity: "400-600", features: ["Airport Proximity", "Multiple Configurations", "Catering Facilities", "Ample Parking"], area: "Andheri East", availability: "Available Now", popular: false },
    ],
    bangalore: [
      { id: 8, name: "Tech Valley Auditorium", address: "Koramangala, Bangalore", price: "₹55,000/day", originalPrice: "₹70,000", rating: 4.8, reviews: 223, type: "Auditorium", capacity: "700-1000", features: ["Tech Hub Location", "Advanced AV", "Startup Friendly", "Innovation Labs"], area: "Koramangala", availability: "Available Now", popular: true },
      { id: 9, name: "Whitefield Conference", address: "Whitefield, Bangalore", price: "₹42,000/day", originalPrice: "₹55,000", rating: 4.6, reviews: 167, type: "Conference Center", capacity: "300-500", features: ["IT Corridor", "Modern Facilities", "Video Conferencing", "Business Lounge"], area: "Whitefield", availability: "Available Now", popular: false },
      { id: 10, name: "HSR Event Plaza", address: "HSR Layout, Bangalore", price: "₹38,000/day", originalPrice: "₹48,000", rating: 4.4, reviews: 112, type: "Event Plaza", capacity: "250-400", features: ["Residential Area", "Community Events", "Flexible Timing", "Local Cuisine"], area: "HSR Layout", availability: "Available Now", popular: false },
    ],
    pune: [
      { id: 11, name: "Hinjewadi IT Convention", address: "Hinjewadi, Pune", price: "₹48,000/day", originalPrice: "₹62,000", rating: 4.7, reviews: 189, type: "IT Convention", capacity: "500-750", features: ["IT Park Location", "Corporate Events", "Modern Tech", "Executive Services"], area: "Hinjewadi", availability: "Available Now", popular: true },
      { id: 12, name: "Koregaon Premium Hall", address: "Koregaon Park, Pune", price: "₹52,000/day", originalPrice: "₹68,000", rating: 4.8, reviews: 156, type: "Premium Hall", capacity: "400-600", features: ["Upscale Location", "Luxury Amenities", "Fine Dining", "Concierge Service"], area: "Koregaon Park", availability: "Available Now", popular: false },
    ]
  };

  // Get event spaces for selected city
  let cityKey = selectedCity.trim().toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
  if (["delhi", "newdelhi", "delh", "dilli"].includes(cityKey)) cityKey = "delhi";
  if (["mumbai", "bombay"].includes(cityKey)) cityKey = "mumbai";
  if (["bangalore", "bengaluru"].includes(cityKey)) cityKey = "bangalore";
  if (["pune", "punecity"].includes(cityKey)) cityKey = "pune";
  const citySpaces = mockEventSpaces[cityKey as EventSpaceCityKey] || mockEventSpaces.delhi;

  // Get unique areas and types for filtering
  const areas = [...new Set(citySpaces.map(space => space.area))];
  const types = [...new Set(citySpaces.map(space => space.type))];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Search Focus Overlay */}
      {isSearchFocused && (
        <div className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300" />
      )}
      
      {/* Header */}
      <header className={`bg-white border-b border-gray-200 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-900 hover:text-primary transition-colors group">
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="text-sm text-gray-700 hover:text-primary transition-colors duration-300 font-medium flex items-center gap-2 border-gray-300"
                >
                  Event Spaces
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-lg">
                {businessSolutions.map((solution) => (
                  <DropdownMenuItem 
                    key={solution.label}
                    onClick={() => handleNavigation(solution.href)}
                    className="cursor-pointer p-3 hover:bg-gray-50 transition-colors"
                  >
                    <solution.icon className="w-4 h-4 mr-3 text-primary" />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{solution.label}</span>
                      <span className="text-xs text-gray-500">{solution.description}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className={`flex items-center gap-2 text-sm text-gray-600 mb-4 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
            <span>Home</span>
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            <span>Event Spaces</span>
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            <span className="text-gray-900 font-medium">{selectedCity}</span>
          </div>

          {/* Page Title */}
          <h1 className={`text-3xl font-bold text-gray-900 mb-6 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
            Event Spaces In {selectedCity}
          </h1>
          
          {/* City Search Section - This stays focused */}
          <div className={`bg-white rounded-lg border p-4 mb-4 relative z-50 transition-all duration-300 ${
            isSearchFocused 
              ? 'border-primary shadow-2xl shadow-primary/20 bg-white' 
              : 'border-gray-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
                isSearchFocused ? 'text-primary' : 'text-gray-700'
              }`}>
                <Search className={`w-4 h-4 transition-all duration-300 ${
                  isSearchFocused ? 'text-primary scale-110' : ''
                }`} />
                SEARCH CITY
              </div>
              
              <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                <div className="relative">
                  <Input
                    type="text"
                    value={searchCity}
                    onChange={handleSearchInputChange}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    placeholder="Search for a city..."
                    className={`pr-10 transition-all duration-300 ${
                      isSearchFocused 
                        ? 'border-primary ring-2 ring-primary/20 focus:ring-primary/30' 
                        : 'border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent'
                    }`}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className={`absolute right-1 top-1 h-8 px-3 transition-all duration-300 ${
                      isSearchFocused ? 'bg-primary/90 scale-105' : ''
                    }`}
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* City Suggestions Dropdown */}
                {showSuggestions && filteredCities.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-primary/20 rounded-md shadow-xl z-10 mt-1 max-h-60 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
                    {filteredCities.map((city) => (
                      <div
                        key={city.key}
                        className="px-4 py-3 hover:bg-primary/5 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                        onClick={() => handleCitySearch(city.name)}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="text-sm text-gray-900 font-medium">{city.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </form>
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="text-sm text-gray-700 hover:text-primary transition-colors duration-300 font-medium flex items-center gap-2 border-gray-300"
                >
                  Event Spaces
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-lg">
                {businessSolutions.map((solution) => (
                  <DropdownMenuItem 
                    key={solution.label}
                    onClick={() => handleNavigation(solution.href)}
                    className="cursor-pointer p-3 hover:bg-gray-50 transition-colors"
                  >
                    <solution.icon className="w-4 h-4 mr-3 text-primary" />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{solution.label}</span>
                      <span className="text-xs text-gray-500">{solution.description}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>

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
          <div className={`flex items-center justify-between mb-6 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
            <div className="flex items-center gap-4">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{citySpaces.length} result(s)</span> for event spaces in {selectedCity}
              </p>
              <Button variant="ghost" size="sm" className="text-primary text-sm">
                📍 Compare Venues
              </Button>
              <Button variant="ghost" size="sm" className="text-primary text-sm">
                💡 Find the ideal venue for you
              </Button>
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

          {/* Event Space Listings */}
          <div className={`grid gap-4 mb-8 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'} ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {citySpaces.map((space) => {
              let imageSrc = "";
              switch (space.name) {
                case "Grand Imperial Hall": imageSrc = "https://shorturl.at/Fyr6o"; break;
                case "Tech Summit Center": imageSrc = "https://shorturl.at/LdEgA"; break;
                case "Heritage Banquet": imageSrc = "https://shorturl.at/S4XWY"; break;
                case "Modern Event Space": imageSrc = "https://shorturl.at/NUpzM"; break;
                case "BKC Grand Ballroom": imageSrc = "https://shorturl.at/Fyr6o"; break;
                case "Worli Convention Hall": imageSrc = "https://shorturl.at/LdEgA"; break;
                case "Andheri Event Center": imageSrc = "https://shorturl.at/S4XWY"; break;
                case "Tech Valley Auditorium": imageSrc = "https://shorturl.at/NUpzM"; break;
                case "Whitefield Conference": imageSrc = "https://shorturl.at/Fyr6o"; break;
                case "HSR Event Plaza": imageSrc = "https://shorturl.at/LdEgA"; break;
                case "Hinjewadi IT Convention": imageSrc = "https://shorturl.at/S4XWY"; break;
                case "Koregaon Premium Hall": imageSrc = "https://shorturl.at/NUpzM"; break;
                default: imageSrc = "/placeholder.svg";
              }
              
              return (
                <Card key={space.id} className="bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 rounded-lg overflow-hidden group">
                  <div className="relative">
                    <img src={imageSrc} alt={space.name} className="w-full h-48 object-cover" />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {space.popular && (
                        <span className="bg-[#EDB003] text-white text-xs px-2 py-1 rounded font-medium">
                          🔥 Popular
                        </span>
                      )}
                      <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded font-medium">
                        {space.type}
                      </span>
                    </div>
                    
                    <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1 text-xs font-medium">
                      <Star className="w-3 h-3 fill-current" />
                      {space.rating}
                    </div>

                    {/* Capacity */}
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700">
                      Capacity: {space.capacity}
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-primary transition-colors">
                          {space.name}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{space.address}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                        ♡
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{space.rating}</span>
                        <span className="text-gray-500">({space.reviews} Reviews)</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-gray-600 mb-1">Starting price (negotiable)</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">{space.price}</span>
                        <span className="text-sm text-gray-500 line-through">{space.originalPrice}</span>
                      </div>
                      <p className="text-xs text-gray-600">/ day</p>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {space.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
                            {feature}
                          </span>
                        ))}
                        {space.features.length > 3 && (
                          <span className="text-xs text-gray-500">+{space.features.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 bg-primary hover:bg-primary/90 text-white">
                        Get best price
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Services Section */}
          <div className={`mb-8 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Complete Event Services
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary">{service.icon}</span>
                    </div>
                    <CardTitle className="text-gray-900 text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Consultant Section */}
          <div className={`bg-white rounded-lg border border-gray-200 p-6 mb-8 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Plan your perfect event with our Expert Team
                </h3>
                <p className="text-gray-600 mb-4">
                  Get personalized recommendations and end-to-end event planning assistance from our experienced consultants.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Free venue consultation
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Budget planning assistance
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Vendor coordination
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Event day management
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 ml-6">
                <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2">
                  Speak to our consultant
                </Button>
                <Button variant="outline" className="px-6 py-2">
                  Request callback
                </Button>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className={`bg-white rounded-lg border border-gray-200 p-6 mb-8 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Frequently Asked Questions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How do I book an event space?</h4>
                  <p className="text-gray-600 text-sm">Simply browse our venues, select your preferred space, and click "Get best price" to start the booking process. Our team will assist you with availability and pricing.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Are the prices negotiable?</h4>
                  <p className="text-gray-600 text-sm">Yes, all our listed prices are starting prices and negotiable based on your event requirements, duration, and booking dates.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What services are included?</h4>
                  <p className="text-gray-600 text-sm">Basic venue rental includes the space and standard amenities. Additional services like catering, AV equipment, and decor can be arranged separately.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Can I visit the venue before booking?</h4>
                  <p className="text-gray-600 text-sm">Absolutely! We encourage site visits. Contact us to schedule a venue tour at your convenience.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What is your cancellation policy?</h4>
                  <p className="text-gray-600 text-sm">Cancellation policies vary by venue. Generally, we offer flexible cancellation terms with advance notice. Details will be provided during booking.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Do you provide event planning services?</h4>
                  <p className="text-gray-600 text-sm">Yes, we offer comprehensive event planning services including vendor coordination, timeline management, and on-site support.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className={`bg-gradient-to-r from-primary to-primary/80 rounded-lg p-8 text-center text-white mb-8 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
            <h3 className="text-2xl font-bold mb-4">Ready to Plan Your Event?</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Let our experts help you find the perfect venue and plan an unforgettable event. 
              Get personalized recommendations and exclusive deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-3">
                Get Expert Help Now
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3">
                Browse More Venues
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`bg-gray-900 text-white py-8 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">Event Spaces</h4>
              <p className="text-gray-400 text-sm">
                Your trusted partner for finding the perfect event venues across India.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Quick Links</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Services</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Virtual Office</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Coworking Space</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Meeting Rooms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Event Planning</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Support</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Event Spaces. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EventSpaces;