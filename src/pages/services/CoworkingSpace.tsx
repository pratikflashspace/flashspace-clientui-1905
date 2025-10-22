import { Building, MapPin, Mail, Phone, FileText, CheckCircle, Star, Users, Award, ChevronDown, Filter, Grid3X3, List, Search, Wifi, Coffee, Calendar, Shield, Zap, Gamepad2 } from "lucide-react";
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
  CoworkingSpaceItem, 
  CoworkingSpaceCityKey, 
  CoworkingSpacesByCity, 
  ViewMode, 
  SortBy 
} from "@/types/services";

const CoworkingSpace = () => {
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
    navigate(href);
  };

  // Enhanced mock data for coworking spaces by city
  const mockCoworkingSpaces: any = {
    delhi: [
      { id: 1, name: "WeWork Connaught Place", address: "Connaught Place, New Delhi", price: "₹15,000/month", originalPrice: "₹18,000", rating: 4.8, reviews: 245, type: "Hot Desk", features: ["High-Speed WiFi", "Meeting Rooms", "Coffee Bar", "24/7 Access"], area: "Connaught Place", availability: "Available Now", popular: true },
      { id: 2, name: "IndiQube Gurgaon", address: "DLF Cyber City, Gurgaon", price: "₹18,000/month", originalPrice: "₹22,000", rating: 4.7, reviews: 189, type: "Dedicated Desk", features: ["Private Cabin Option", "Parking", "Event Space", "Cafeteria"], area: "Gurgaon", availability: "Available Now", popular: false },
      { id: 3, name: "91springboard CP", address: "Nehru Place, Delhi", price: "₹12,000/month", originalPrice: "₹15,000", rating: 4.6, reviews: 156, type: "Hot Desk", features: ["Startup Community", "Mentorship", "Networking Events", "Printer Access"], area: "Nehru Place", availability: "Available Now", popular: false },
      { id: 4, name: "Awfis Khan Market", address: "Khan Market, New Delhi", price: "₹20,000/month", originalPrice: "₹25,000", rating: 4.9, reviews: 198, type: "Private Office", features: ["Premium Location", "Executive Lounge", "Concierge", "Valet Parking"], area: "Khan Market", availability: "Available Now", popular: true },
      { id: 5, name: "myHQ Saket", address: "Saket, New Delhi", price: "₹14,000/month", originalPrice: "₹17,000", rating: 4.5, reviews: 134, type: "Hot Desk", features: ["South Delhi", "Flexible Hours", "Gaming Zone", "Wellness Room"], area: "Saket", availability: "Available Now", popular: false },
      { id: 6, name: "CoworkingSpace Lajpat", address: "Lajpat Nagar, Delhi", price: "₹10,000/month", originalPrice: "₹13,000", rating: 4.3, reviews: 89, type: "Shared Desk", features: ["Budget Friendly", "Basic Amenities", "WiFi", "Print Access"], area: "Lajpat Nagar", availability: "Available Now", popular: false }
    ],
    mumbai: [
      { id: 7, name: "WeWork BKC", address: "Bandra Kurla Complex, Mumbai", price: "₹22,000/month", originalPrice: "₹28,000", rating: 4.9, reviews: 312, type: "Private Office", features: ["Premium Location", "Ocean View", "Concierge", "Wellness Room"], area: "BKC", availability: "Available Now", popular: true },
      { id: 8, name: "Awfis Lower Parel", address: "Lower Parel, Mumbai", price: "₹16,000/month", originalPrice: "₹20,000", rating: 4.5, reviews: 198, type: "Dedicated Desk", features: ["Central Mumbai", "Metro Connectivity", "Gaming Zone", "Rooftop"], area: "Lower Parel", availability: "Available Now", popular: false },
      { id: 9, name: "GoWork Andheri", address: "Andheri East, Mumbai", price: "₹14,000/month", originalPrice: "₹18,000", rating: 4.4, reviews: 167, type: "Hot Desk", features: ["Airport Proximity", "Flexible Plans", "Community Events", "Phone Booths"], area: "Andheri East", availability: "Available Now", popular: false },
      { id: 10, name: "IndiQube Worli", address: "Worli, Mumbai", price: "₹19,000/month", originalPrice: "₹24,000", rating: 4.7, reviews: 223, type: "Dedicated Desk", features: ["Sea Link Access", "Premium Amenities", "Event Space", "Parking"], area: "Worli", availability: "Available Now", popular: true },
      { id: 11, name: "myHQ Fort", address: "Fort, Mumbai", price: "₹17,000/month", originalPrice: "₹21,000", rating: 4.6, reviews: 145, type: "Hot Desk", features: ["Heritage Area", "Business District", "Networking", "Cafeteria"], area: "Fort", availability: "Available Now", popular: false }
    ],
    bangalore: [
      { id: 12, name: "WeWork Embassy Tech", address: "Koramangala, Bangalore", price: "₹17,000/month", originalPrice: "₹21,000", rating: 4.8, reviews: 267, type: "Dedicated Desk", features: ["Tech Hub", "Innovation Labs", "Startup Ecosystem", "Outdoor Terrace"], area: "Koramangala", availability: "Available Now", popular: true },
      { id: 13, name: "IndiQube Whitefield", address: "Whitefield, Bangalore", price: "₹15,500/month", originalPrice: "₹19,000", rating: 4.6, reviews: 189, type: "Hot Desk", features: ["IT Corridor", "Shuttle Service", "Gaming Area", "Wellness Programs"], area: "Whitefield", availability: "Available Now", popular: false },
      { id: 14, name: "Bhive HSR Layout", address: "HSR Layout, Bangalore", price: "₹13,000/month", originalPrice: "₹16,000", rating: 4.5, reviews: 134, type: "Hot Desk", features: ["Residential Area", "Quiet Environment", "Flexible Hours", "Community Kitchen"], area: "HSR Layout", availability: "Available Now", popular: false },
      { id: 15, name: "91springboard Indiranagar", address: "Indiranagar, Bangalore", price: "₹16,500/month", originalPrice: "₹20,000", rating: 4.7, reviews: 198, type: "Dedicated Desk", features: ["Central Bangalore", "Startup Community", "Events", "Mentorship"], area: "Indiranagar", availability: "Available Now", popular: true },
      { id: 16, name: "myHQ Electronic City", address: "Electronic City, Bangalore", price: "₹12,500/month", originalPrice: "₹15,500", rating: 4.4, reviews: 112, type: "Hot Desk", features: ["Tech Park", "Modern Facilities", "Parking", "Food Court"], area: "Electronic City", availability: "Available Now", popular: false }
    ],
    pune: [
      { id: 17, name: "IndiQube Hinjewadi", address: "Hinjewadi, Pune", price: "₹14,000/month", originalPrice: "₹17,000", rating: 4.7, reviews: 178, type: "Dedicated Desk", features: ["IT Park", "Modern Facilities", "Ample Parking", "Food Court"], area: "Hinjewadi", availability: "Available Now", popular: true },
      { id: 18, name: "WorkAmp Koregaon Park", address: "Koregaon Park, Pune", price: "₹16,000/month", originalPrice: "₹20,000", rating: 4.4, reviews: 134, type: "Hot Desk", features: ["Premium Location", "Creative Spaces", "Event Hosting", "Bike Parking"], area: "Koregaon Park", availability: "Available Now", popular: false },
      { id: 19, name: "WeWork Baner", address: "Baner, Pune", price: "₹15,000/month", originalPrice: "₹18,500", rating: 4.6, reviews: 156, type: "Dedicated Desk", features: ["IT Hub", "Premium Amenities", "Networking", "Wellness Zone"], area: "Baner", availability: "Available Now", popular: false },
      { id: 20, name: "myHQ Kharadi", address: "Kharadi, Pune", price: "₹13,500/month", originalPrice: "₹16,500", rating: 4.3, reviews: 98, type: "Hot Desk", features: ["Tech Zone", "Flexible Plans", "Community Events", "Gaming Area"], area: "Kharadi", availability: "Available Now", popular: false }
    ]
  };

  // Get coworking spaces for selected city
  let cityKey = selectedCity.trim().toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
  if (["delhi", "newdelhi", "delh", "dilli"].includes(cityKey)) cityKey = "delhi";
  if (["mumbai", "bombay"].includes(cityKey)) cityKey = "mumbai";
  if (["bangalore", "bengaluru"].includes(cityKey)) cityKey = "bangalore";
  if (["pune", "punecity"].includes(cityKey)) cityKey = "pune";
  const citySpaces = mockCoworkingSpaces[cityKey as CoworkingSpaceCityKey] || mockCoworkingSpaces.delhi;

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
                  Coworking Space
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
            <span>Coworking</span>
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            <span className="text-gray-900 font-medium">{selectedCity}</span>
          </div>

          {/* Page Title */}
          <h1 className={`text-3xl font-bold text-gray-900 mb-6 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
            Coworking Space In {selectedCity}
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
                  Coworking Space
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
                Showing <span className="font-semibold text-gray-900">{citySpaces.length} result(s)</span> for coworking space in {selectedCity}
              </p>
              <Button variant="ghost" size="sm" className="text-primary text-sm">
                📍 Compare Workspaces
              </Button>
              <Button variant="ghost" size="sm" className="text-primary text-sm">
                💡 Find the ideal solution for you
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

          {/* Coworking Space Listings */}
          <div className={`grid gap-4 mb-8 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'} ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {citySpaces.map((space) => {
              let imageSrc = "";
              switch (space.name) {
                case "WeWork Connaught Place": imageSrc = "https://shorturl.at/Fyr6o"; break;
                case "IndiQube Gurgaon": imageSrc = "https://shorturl.at/LdEgA"; break;
                case "91springboard CP": imageSrc = "https://shorturl.at/S4XWY"; break;
                case "WeWork BKC": imageSrc = "https://shorturl.at/NUpzM"; break;
                case "Awfis Lower Parel": imageSrc = "https://shorturl.at/LdEgA"; break;
                case "GoWork Andheri": imageSrc = "https://shorturl.at/S4XWY"; break;
                case "WeWork Embassy Tech": imageSrc = "https://shorturl.at/LdEgA"; break;
                case "IndiQube Whitefield": imageSrc = "https://shorturl.at/Fyr6o"; break;
                case "Bhive HSR Layout": imageSrc = "https://shorturl.at/NUpzM"; break;
                case "IndiQube Hinjewadi": imageSrc = "https://shorturl.at/Fyr6o"; break;
                case "WorkAmp Koregaon Park": imageSrc = "https://shorturl.at/Fyr6o"; break;
                case "Awfis Khan Market": imageSrc = "https://shorturl.at/NUpzM"; break;
                case "myHQ Saket": imageSrc = "https://shorturl.at/LdEgA"; break;
                case "CoworkingSpace Lajpat": imageSrc = "https://shorturl.at/S4XWY"; break;
                case "IndiQube Worli": imageSrc = "https://shorturl.at/Fyr6o"; break;
                case "myHQ Fort": imageSrc = "https://shorturl.at/NUpzM"; break;
                case "91springboard Indiranagar": imageSrc = "https://shorturl.at/LdEgA"; break;
                case "myHQ Electronic City": imageSrc = "https://shorturl.at/S4XWY"; break;
                case "WeWork Baner": imageSrc = "https://shorturl.at/Fyr6o"; break;
                case "myHQ Kharadi": imageSrc = "https://shorturl.at/NUpzM"; break;
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
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
                        {space.type}
                      </span>
                    </div>
                    
                    <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1 text-xs font-medium">
                      <Star className="w-3 h-3 fill-current" />
                      {space.rating}
                    </div>

                    {/* Availability */}
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-700">
                      {space.availability}
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
                      <p className="text-xs text-gray-600 mb-1">Quoted price (negotiable)</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">{space.price}</span>
                        <span className="text-sm text-gray-500 line-through">{space.originalPrice}</span>
                      </div>
                      <p className="text-xs text-gray-600">/ desk / month</p>
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

          {/* What is Coworking Space Section */}
          <div className={`bg-gradient-to-br from-[#172A3A] to-[#172A3A]/90 rounded-2xl p-8 mb-8 relative z-30 transition-opacity duration-300 overflow-hidden ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
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
          </div>

          {/* Consultant Section */}
          <div className={`bg-white rounded-lg border border-gray-200 p-6 mb-8 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Upgrade your office with Nitin Kashyap & team
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <img src="https://via.placeholder.com/48x48" alt="Consultant" className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-semibold text-gray-900">Nitin Kashyap</p>
                      <p className="text-sm text-gray-600">+91 8100888777</p>
                      <p className="text-sm text-primary">FlashSpace Consultant</p>
                    </div>
                  </div>
                  <Button className="bg-primary text-white">Contact Nitin</Button>
                </div>

                <p className="text-gray-600 mb-4">
                  Nitin's team assisted 200+ corporates in {selectedCity} to move into their new office.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Brand selection & location strategy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Office scouting, tours & local expertise</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Layout optimization & design consultancy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CoworkingSpace;