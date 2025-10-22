import { Building, MapPin, Mail, Phone, FileText, CheckCircle, Star, Users, Award, ChevronDown, Filter, Grid3X3, List, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MapLibreMap from "@/components/Map/MapLibreMap";
import { cityCenters } from "@/components/Map/locationData.example";
import Header from "@/components/Header";
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
  VirtualOfficeItem,
  VirtualOfficeCityKey,
  VirtualOfficesByCity,
  ViewMode,
  SortBy
} from "@/types/services";

const VirtualOffice = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("popularity");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedServices, setSelectedServices] = useState<string>("all");
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

  // Mock data for virtual offices by city
  const mockVirtualOffices: any = {
    delhi: [
      { id: 1, name: "Connaught Place Virtual Office", address: "CP Block, New Delhi", price: "₹999/month", originalPrice: "₹1,299", rating: 4.8, reviews: 156, features: ["Prime Location", "GST Registration", "Mail Handling"], area: "Connaught Place", availability: "Available Now", popular: true },
      { id: 2, name: "Gurgaon Business Center", address: "DLF Cyber City, Gurgaon", price: "₹1,299/month", originalPrice: "₹1,599", rating: 4.7, reviews: 203, features: ["IT Hub Location", "Call Handling", "Meeting Rooms"], area: "Gurgaon", availability: "Available Now", popular: false },
      { id: 3, name: "Nehru Place Office", address: "Nehru Place, Delhi", price: "₹799/month", originalPrice: "₹999", rating: 4.5, reviews: 89, features: ["Commercial Center", "Professional Address", "Mail Services"], area: "Nehru Place", availability: "Available Now", popular: false },
      { id: 4, name: "Khan Market Business Hub", address: "Khan Market, New Delhi", price: "₹1,499/month", originalPrice: "₹1,799", rating: 4.9, reviews: 134, features: ["Premium Location", "Full Services", "GST Support"], area: "Khan Market", availability: "Available Now", popular: true },
      { id: 5, name: "Saket Corporate Center", address: "Saket, New Delhi", price: "₹899/month", originalPrice: "₹1,099", rating: 4.6, reviews: 78, features: ["South Delhi", "Mail Handling", "Call Management"], area: "Saket", availability: "Available Now", popular: false },
      { id: 6, name: "Lajpat Nagar Virtual Office", address: "Lajpat Nagar, Delhi", price: "₹699/month", originalPrice: "₹899", rating: 4.3, reviews: 65, features: ["Budget Friendly", "Basic Services", "GST Registration"], area: "Lajpat Nagar", availability: "Available Now", popular: false }
    ],
    mumbai: [
      { id: 7, name: "BKC Premium Office", address: "Bandra Kurla Complex, Mumbai", price: "₹1,599/month", originalPrice: "₹1,999", rating: 4.9, reviews: 245, features: ["Financial District", "Prestigious Address", "Full Services"], area: "BKC", availability: "Available Now", popular: true },
      { id: 8, name: "Lower Parel Business", address: "Lower Parel, Mumbai", price: "₹1,299/month", originalPrice: "₹1,599", rating: 4.6, reviews: 167, features: ["Central Location", "GST Support", "Call Management"], area: "Lower Parel", availability: "Available Now", popular: false },
      { id: 9, name: "Andheri East Hub", address: "Andheri East, Mumbai", price: "₹1,099/month", originalPrice: "₹1,399", rating: 4.4, reviews: 123, features: ["Suburban Office", "Basic Services", "Mail Handling"], area: "Andheri East", availability: "Available Now", popular: false },
      { id: 10, name: "Worli Business District", address: "Worli, Mumbai", price: "₹1,399/month", originalPrice: "₹1,699", rating: 4.7, reviews: 189, features: ["Sea Link Access", "Premium Services", "Meeting Rooms"], area: "Worli", availability: "Available Now", popular: true },
      { id: 11, name: "Fort Commercial Center", address: "Fort, Mumbai", price: "₹1,199/month", originalPrice: "₹1,499", rating: 4.5, reviews: 112, features: ["Heritage Area", "Professional Address", "Mail Services"], area: "Fort", availability: "Available Now", popular: false }
    ],
    bangalore: [
      { id: 12, name: "Koramangala Tech Office", address: "Koramangala, Bangalore", price: "₹1,199/month", originalPrice: "₹1,499", rating: 4.7, reviews: 198, features: ["Tech Hub", "Modern Facilities", "Professional Address"], area: "Koramangala", availability: "Available Now", popular: true },
      { id: 13, name: "Whitefield Business Center", address: "Whitefield, Bangalore", price: "₹1,099/month", originalPrice: "₹1,399", rating: 4.5, reviews: 156, features: ["IT Corridor", "Mail Services", "Call Handling"], area: "Whitefield", availability: "Available Now", popular: false },
      { id: 14, name: "Electronic City Office", address: "Electronic City, Bangalore", price: "₹999/month", originalPrice: "₹1,299", rating: 4.3, reviews: 87, features: ["Tech Park", "GST Registration", "Basic Services"], area: "Electronic City", availability: "Available Now", popular: false },
      { id: 15, name: "Indiranagar Corporate Hub", address: "Indiranagar, Bangalore", price: "₹1,299/month", originalPrice: "₹1,599", rating: 4.8, reviews: 167, features: ["Central Bangalore", "Premium Services", "Meeting Rooms"], area: "Indiranagar", availability: "Available Now", popular: true },
      { id: 16, name: "HSR Layout Virtual Office", address: "HSR Layout, Bangalore", price: "₹899/month", originalPrice: "₹1,199", rating: 4.4, reviews: 89, features: ["Residential Area", "Basic Services", "Mail Handling"], area: "HSR Layout", availability: "Available Now", popular: false }
    ],
    pune: [
      { id: 17, name: "Hinjewadi IT Park Office", address: "Hinjewadi, Pune", price: "₹899/month", originalPrice: "₹1,199", rating: 4.6, reviews: 134, features: ["IT Park", "Modern Amenities", "Professional Services"], area: "Hinjewadi", availability: "Available Now", popular: true },
      { id: 18, name: "Koregaon Park Center", address: "Koregaon Park, Pune", price: "₹1,199/month", originalPrice: "₹1,499", rating: 4.4, reviews: 98, features: ["Premium Location", "Call Management", "Mail Services"], area: "Koregaon Park", availability: "Available Now", popular: false },
      { id: 19, name: "Baner Business Hub", address: "Baner, Pune", price: "₹999/month", originalPrice: "₹1,299", rating: 4.5, reviews: 112, features: ["IT Hub", "GST Support", "Meeting Rooms"], area: "Baner", availability: "Available Now", popular: false },
      { id: 20, name: "Kharadi Tech Center", address: "Kharadi, Pune", price: "₹849/month", originalPrice: "₹1,099", rating: 4.3, reviews: 76, features: ["Tech Zone", "Basic Services", "Professional Address"], area: "Kharadi", availability: "Available Now", popular: false }
    ]
  };

  // Get offices for selected city
  let cityKey = selectedCity.trim().toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
  if (["delhi", "newdelhi", "delh", "dilli"].includes(cityKey)) cityKey = "delhi";
  if (["mumbai", "bombay"].includes(cityKey)) cityKey = "mumbai";
  if (["bangalore", "bengaluru"].includes(cityKey)) cityKey = "bangalore";
  if (["pune", "punecity"].includes(cityKey)) cityKey = "pune";
  const cityOffices = mockVirtualOffices[cityKey as VirtualOfficeCityKey] || mockVirtualOffices.delhi;

  // Get unique areas for filtering
  const areas = [...new Set(cityOffices.map(office => office.area))];

  // Resolve map center by selected city (fallback to Delhi)
  const resolvedCenter = (() => {
    const cityKeyFromState = selectedCity.trim().toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
    if (["delhi", "newdelhi", "delh", "dilli"].includes(cityKeyFromState)) return cityCenters.delhi;
    if (["mumbai", "bombay"].includes(cityKeyFromState)) return cityCenters.mumbai;
    if (["bangalore", "bengaluru"].includes(cityKeyFromState)) return cityCenters.bangalore;
    if (["pune", "punecity"].includes(cityKeyFromState)) return cityCenters.pune;
    // Default
    return cityCenters.delhi;
  })();

  // Prepare marker data from cityOffices with full details
  const mapMarkers = cityOffices.map((office) => {
    // Get image for this office
    let imageSrc = "";
    switch (office.name) {
      case "Connaught Place Virtual Office": imageSrc = "https://shorturl.at/Fyr6o"; break;
      case "Gurgaon Business Center": imageSrc = "https://shorturl.at/LdEgA"; break;
      case "Nehru Place Office": imageSrc = "https://shorturl.at/S4XWY"; break;
      case "BKC Premium Office": imageSrc = "https://shorturl.at/NUpzM"; break;
      case "Lower Parel Business": imageSrc = "https://shorturl.at/LdEgA"; break;
      case "Andheri East Hub": imageSrc = "https://shorturl.at/S4XWY"; break;
      case "Koramangala Tech Office": imageSrc = "https://shorturl.at/LdEgA"; break;
      case "Whitefield Business Center": imageSrc = "https://shorturl.at/Fyr6o"; break;
      case "Electronic City Office": imageSrc = "https://shorturl.at/NUpzM"; break;
      case "Hinjewadi IT Park Office": imageSrc = "https://shorturl.at/Fyr6o"; break;
      case "Koregaon Park Center": imageSrc = "https://shorturl.at/Fyr6o"; break;
      case "Khan Market Business Hub": imageSrc = "https://shorturl.at/NUpzM"; break;
      case "Saket Corporate Center": imageSrc = "https://shorturl.at/LdEgA"; break;
      case "Lajpat Nagar Virtual Office": imageSrc = "https://shorturl.at/S4XWY"; break;
      case "Worli Business District": imageSrc = "https://shorturl.at/Fyr6o"; break;
      case "Fort Commercial Center": imageSrc = "https://shorturl.at/NUpzM"; break;
      case "Indiranagar Corporate Hub": imageSrc = "https://shorturl.at/LdEgA"; break;
      case "HSR Layout Virtual Office": imageSrc = "https://shorturl.at/S4XWY"; break;
      case "Baner Business Hub": imageSrc = "https://shorturl.at/Fyr6o"; break;
      case "Kharadi Tech Center": imageSrc = "https://shorturl.at/NUpzM"; break;
      default: imageSrc = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop";
    }

    return {
      position: office.coordinates || resolvedCenter,
      title: office.name,
      address: office.address,
      price: office.price,
      rating: office.rating,
      reviews: office.reviews,
      image: imageSrc,
      features: office.features,
    };
  });

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      {/* Original Header */}
      <Header />

      {/* Main Content - Split Layout */}
      <main className="flex h-screen pt-20">
        {/* Left Side: Office Listings */}
        <div className="w-1/2 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400" style={{ height: 'calc(100vh - 5rem)' }}>
          <div className="px-6 py-6">
          {/* Breadcrumb */}
          <div className={`flex items-center gap-2 text-sm text-gray-600 mb-4 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
            <span>Home</span>
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            <span>Virtual Office</span>
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
            <span className="text-gray-900 font-medium">{selectedCity}</span>
          </div>

          {/* Page Title */}
          <h1 className={`text-3xl font-bold text-gray-900 mb-6 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
            Virtual Office Space In {selectedCity}
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
                  Virtual Office
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
          <div className={`flex items-center justify-between mb-6 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
            <div className="flex items-center gap-4">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{cityOffices.length} result(s)</span> for virtual office space in {selectedCity}
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

          {/* Office Cards Grid */}
          <div className={`grid grid-cols-2 gap-4 mb-8 relative z-30 transition-opacity duration-300 ${isSearchFocused ? 'opacity-50' : 'opacity-100'}`}>
              {cityOffices.map((office) => {
                let imageSrc = "";
                switch (office.name) {
                  case "Connaught Place Virtual Office": imageSrc = "https://shorturl.at/Fyr6o"; break;
                  case "Gurgaon Business Center": imageSrc = "https://shorturl.at/LdEgA"; break;
                  case "Nehru Place Office": imageSrc = "https://shorturl.at/S4XWY"; break;
                  case "BKC Premium Office": imageSrc = "https://shorturl.at/NUpzM"; break;
                  case "Lower Parel Business": imageSrc = "https://shorturl.at/LdEgA"; break;
                  case "Andheri East Hub": imageSrc = "https://shorturl.at/S4XWY"; break;
                  case "Koramangala Tech Office": imageSrc = "https://shorturl.at/LdEgA"; break;
                  case "Whitefield Business Center": imageSrc = "https://shorturl.at/Fyr6o"; break;
                  case "Electronic City Office": imageSrc = "https://shorturl.at/NUpzM"; break;
                  case "Hinjewadi IT Park Office": imageSrc = "https://shorturl.at/Fyr6o"; break;
                  case "Koregaon Park Center": imageSrc = "https://shorturl.at/Fyr6o"; break;
                  case "Khan Market Business Hub": imageSrc = "https://shorturl.at/NUpzM"; break;
                  case "Saket Corporate Center": imageSrc = "https://shorturl.at/LdEgA"; break;
                  case "Lajpat Nagar Virtual Office": imageSrc = "https://shorturl.at/S4XWY"; break;
                  case "Worli Business District": imageSrc = "https://shorturl.at/Fyr6o"; break;
                  case "Fort Commercial Center": imageSrc = "https://shorturl.at/NUpzM"; break;
                  case "Indiranagar Corporate Hub": imageSrc = "https://shorturl.at/LdEgA"; break;
                  case "HSR Layout Virtual Office": imageSrc = "https://shorturl.at/S4XWY"; break;
                  case "Baner Business Hub": imageSrc = "https://shorturl.at/Fyr6o"; break;
                  case "Kharadi Tech Center": imageSrc = "https://shorturl.at/NUpzM"; break;
                  default: imageSrc = "/placeholder.svg";
                }
                
                return (
                  <Card key={office.id} className="bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 rounded-lg overflow-hidden group">
                    <div className="relative">
                      <img src={imageSrc} alt={office.name} className="w-full h-32 object-cover" />
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex gap-1">
                        {office.popular && (
                          <span className="bg-[#EDB003] text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                            🔥 Popular
                          </span>
                        )}
                      </div>
                      
                      <div className="absolute top-2 right-2 bg-green-600 text-white px-1.5 py-0.5 rounded flex items-center gap-1 text-[10px] font-medium">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        {office.rating}
                      </div>

                      {/* Availability */}
                      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-700">
                        {office.availability} 
                      </div>
                    </div>
                    
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-gray-900 mb-0.5 group-hover:text-primary transition-colors line-clamp-1">
                            {office.name}
                          </h3>
                          <div className="flex items-center gap-1 text-gray-600 text-xs mb-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="line-clamp-1">{office.address}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 h-6 w-6 p-0">
                          ♡
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="font-medium">{office.rating}</span>
                          <span className="text-gray-500">({office.reviews})</span>
                        </div>
                      </div>

                      <div className="mb-2">
                        <p className="text-[10px] text-gray-600 mb-0.5">Quoted price (negotiable)</p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg font-bold text-gray-900">{office.price}</span>
                          <span className="text-xs text-gray-500 line-through">{office.originalPrice}</span>
                        </div>
                        <p className="text-[10px] text-gray-600">/ desk / month</p>
                      </div>

                      <div className="mb-2">
                        <div className="flex flex-wrap gap-1">
                          {office.features.slice(0, 2).map((feature, idx) => (
                            <span key={idx} className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-1.5">
                        <Button className="flex-1 bg-primary hover:bg-primary/90 text-white text-xs h-8">
                          Get best price
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          </div>
        </div>

        {/* Right Side: Map - Full Height Fixed */}
        <div className="w-1/2 overflow-hidden flex-shrink-0" style={{ height: 'calc(100vh - 5rem)' }}>
          <MapLibreMap
            center={resolvedCenter}
            zoom={11}
            height="100%"
            className="w-full h-full"
            markers={mapMarkers}
          />
        </div>
      </main>
    </div>
  );
};

export default VirtualOffice;