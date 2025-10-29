import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { MapPin, Search, ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import VideoBackground from "./VideoBackground";
import { cn } from "@/lib/utils";
import RippleButton from "@/components/ui/RippleButton/RippleButton";

const HeroSection = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("Delhi"); // Default Delhi selected
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("Virtual Spaces");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSolutionOpen, setIsSolutionOpen] = useState(false);

  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", 
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"
  ];

  const services = [
    "Virtual Spaces", 
    "Coworking Spaces", 
    "On Demand",
    "Business Setup"
  ];

  // Location recommendations based on selected city
  const getLocationRecommendations = (city: string, query: string) => {
    if (!city) return [];
    
    const recommendations = {
      mumbai: ["Bandra Kurla Complex", "Lower Parel", "Andheri East", "Powai", "Goregaon", "Malad"],
      delhi: ["Connaught Place", "Gurgaon", "Noida", "Lajpat Nagar", "Karol Bagh", "Dwarka"],
      bangalore: ["Koramangala", "Indiranagar", "Whitefield", "Electronic City", "HSR Layout", "Jayanagar"],
      hyderabad: ["Hitech City", "Gachibowli", "Banjara Hills", "Jubilee Hills", "Kondapur", "Madhapur"],
      chennai: ["T. Nagar", "Anna Nagar", "Velachery", "OMR", "Guindy", "Adyar"],
      kolkata: ["Salt Lake", "Park Street", "Esplanade", "New Town", "Ballygunge", "Howrah"],
      pune: ["Koregaon Park", "Viman Nagar", "Baner", "Wakad", "Kharadi", "Hinjewadi"],
      ahmedabad: ["SG Highway", "Prahlad Nagar", "Satellite", "Vastrapur", "Bopal", "Maninagar"],
      jaipur: ["Malviya Nagar", "C-Scheme", "Vaishali Nagar", "Mansarovar", "Jagatpura", "Tonk Road"],
      surat: ["Adajan", "Vesu", "Pal", "Athwa", "Rander", "Udhna"]
    };

    const cityKey = city.toLowerCase().replace(/\s+/g, '');
    const cityRecommendations = recommendations[cityKey] || [];
    
    if (!query) return cityRecommendations;
    
    return cityRecommendations.filter(location => 
      location.toLowerCase().includes(query.toLowerCase())
    );
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearch = () => {
    // Only city is mandatory now
    if (!selectedCity) {
      alert("Please select a city");
      return;
    }
    
    // Simplified routing based on service selection
    let route = "/city-listing"; // Default to city listings
    
    if (selectedService) {
      const serviceRoutes = {
        "virtual spaces": "/services/virtual-office",
        "coworking spaces": "/services/coworking-space",
        "on demand": "/services/on-demand",
        "business setup": "/services/virtual-office" // Using virtual office for now
      };
      
      const serviceKey = selectedService.toLowerCase();
      route = serviceRoutes[serviceKey] || "/city-listing";
    }
    
    // Add query parameters for filtering
    const params = new URLSearchParams();
    params.set('city', selectedCity.toLowerCase().replace(/\s+/g, '-')); // Convert "New Delhi" to "new-delhi"
    if (searchQuery) params.set('location', searchQuery);
    if (selectedService) params.set('service', selectedService);
    
    // Navigate using React Router
    const url = `${route}?${params.toString()}`;
    console.log('Navigating to:', url); // Debug log
    navigate(url);
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-16 pb-12 px-4 relative overflow-hidden">
      {/* Dynamic Video Background - Only for Hero Section */}
      {/* <VideoBackground /> */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://res.cloudinary.com/diwna43hl/image/upload/v1758960556/AlbedoBase_XL_Minimalist_abstract_2D_digital_artwork_solid_gol_0_j2heau.jpg" 
          alt="Hero Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Darker overlay for text readability */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-black/40 to-slate-800/50 backdrop-blur-sm z-10"></div> */}
      
      <div className="container mx-auto text-left relative z-20 pl-24 md:pl-16 lg:pl-8">
        {/* Hero Content */}
        <div className="max-w-4xl mb-8 relative">          
          <h1 className="text-4xl md:text-7xl font-semibold  mb-6 leading-tight text-black animate-fade-in" style={{ fontFamily: 'Poppins' }}>
            India's 1st  <span className=" text-[#000000]">AI Enabled,</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-black mb-8 leading-relaxed font-content animate-fade-in" style={{ animationDelay: '200ms', fontFamily: 'Geist'
           }}>
            WorkSpace Provider with Enhanced Compliance Solutions
            <br />
            {/* with virtual offices starting from <span className="text-black font-bold">₹799/month.</span> */}
          </p>
          <br />

          {/* Start chating button*/}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <RippleButton 
               text= "Start chating"
               background="#000000"
               textColor="white"
               hoverTextColor="black"
               hoverFlairColor="#EFAD1A"
               buttonHeight="60px"
               onClick={() => navigate('/start-chatting') }
            />
            <RippleButton 
               text={<span className="flex items-center gap-2 ">
                 {/* Add this import at top: import { Video } from "lucide-react"; */}
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="m22 8-6 4 6 4V8Z" />
                 <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
                 </svg>
                 <span>Who are we? </span>
               </span> }
               background="white"
               textColor="black"
               hoverTextColor="black"
               hoverFlairColor="#EFAD1A"
               buttonHeight="60px"
               onClick={() => scrollToSection('#')}
            />
            </div>
          
          
          {/* 
          Search Component - Enhanced Version - COMMENTED OUT
          <div className="bg-white rounded-full shadow-2xl max-w-4xl mx-auto p-2 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex flex-col md:flex-row gap-2">
              City Selection
              <div className="flex-1 flex items-center px-4 py-3">
                <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                <Popover open={isLocationOpen} onOpenChange={setIsLocationOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      role="combobox"
                      aria-expanded={isLocationOpen}
                      className="justify-between p-0 h-auto font-normal border-0 bg-transparent hover:bg-transparent cursor-pointer"
                    >
                      {selectedCity || "Select City"}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <div className="bg-white border border-primary/20 shadow-lg rounded-lg">
                      <Command>
                        <CommandInput placeholder="Search city..." />
                        <CommandList>
                          <CommandEmpty>No city found.</CommandEmpty>
                          <CommandGroup>
                            {cities.map((city) => (
                              <CommandItem
                                key={city}
                                value={city}
                                onSelect={(currentValue) => {
                                  setSelectedCity(currentValue === selectedCity ? "" : city);
                                  setIsLocationOpen(false);
                                  setSearchQuery(""); Reset search when city changes
                                }}
                                className="cursor-pointer"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedCity === city ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {city}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              Divider
              <div className="hidden md:block w-px bg-gray-200 my-3"></div>

              Location Search within City
              <div className="flex-1 flex items-center px-4 py-3 relative">
                <Search className="w-5 h-5 mr-3 text-gray-500" />
                <div className="w-full relative">
                  <input
                    type="text"
                    placeholder={selectedCity ? `Search in ${selectedCity}...` : "Select city first"}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (selectedCity && e.target.value.length > 0) {
                        setIsSearchOpen(true);
                      } else {
                        setIsSearchOpen(false);
                      }
                    }}
                    onFocus={() => {
                      if (selectedCity) {
                        setIsSearchOpen(true);
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => setIsSearchOpen(false), 200);
                    }}
                    disabled={!selectedCity}
                    className="w-full bg-transparent border-0 outline-none text-gray-700 placeholder:text-gray-500 text-base"
                    style={{ all: 'unset', width: '100%', color: '#374151' }}
                  />
                  
                  Recommendations Dropdown
                  {isSearchOpen && selectedCity && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                      {getLocationRecommendations(selectedCity, searchQuery).length > 0 ? (
                        <>
                          <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b">
                            Popular Areas in {selectedCity}
                          </div>
                          {getLocationRecommendations(selectedCity, searchQuery).map((location) => (
                            <div
                              key={location}
                              className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                              onMouseDown={(e) => {
                                e.preventDefault(); Prevent blur
                                setSearchQuery(location);
                                setIsSearchOpen(false);
                              }}
                            >
                              <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                              <span className="text-sm">{location}</span>
                            </div>
                          ))}
                        </>
                      ) : searchQuery.length > 0 ? (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          No locations found for "{searchQuery}"
                        </div>
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          Start typing to search locations
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              Divider
              <div className="hidden md:block w-px bg-gray-200 my-3"></div>

              Solution Selection
              <div className="flex-1 flex items-center px-4 py-3">
                <Search className="w-5 h-5 mr-3 text-gray-500" />
                <Popover open={isSolutionOpen} onOpenChange={setIsSolutionOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      role="combobox"
                      aria-expanded={isSolutionOpen}
                      className="justify-between p-0 h-auto font-normal border-0 bg-transparent hover:bg-transparent cursor-pointer"
                    >
                      {selectedService || "Select Solution"}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <div className="bg-white border border-primary/20 shadow-lg rounded-lg">
                      <Command>
                        <CommandInput placeholder="Search solution..." />
                        <CommandList>
                          <CommandEmpty>No solution found.</CommandEmpty>
                          <CommandGroup>
                            {services.map((service) => (
                              <CommandItem
                                key={service}
                                value={service}
                                onSelect={(currentValue) => {
                                  setSelectedService(currentValue === selectedService ? "" : service);
                                  setIsSolutionOpen(false);
                                }}
                                className="cursor-pointer"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedService === service ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {service}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              Search Button
              <Button 
                onClick={handleSearch}
                disabled={!selectedCity} Only city is required
                className="bg-black hover:bg-gray-800 text-white rounded-full px-12 py-6 h-auto font-medium disabled:opacity-50"
              >
                Search
              </Button>

              <RippleButton 
               text="Search"
               background="#000000"
               textColor="white"
               hoverTextColor="black"
               hoverFlairColor="#EFAD1A"
               buttonHeight="60px"
               onClick={handleSearch}
              />
              
            </div>
          </div>
          END OF COMMENTED SEARCH COMPONENT 
          */}
        </div>

        {/* Golden Dots Animation - Minimal */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-float opacity-40"
              style={{
                left: `${10 + (Math.random() * 80)}%`,
                top: `${10 + (Math.random() * 80)}%`,
                animationDelay: `${Math.random() * 12}s`,
                animationDuration: `${10 + Math.random() * 8}s`,
              }}
            />
          ))}
          {[...Array(5)].map((_, i) => (
            <div
              key={`large-${i}`}
              className="absolute w-2 h-2 bg-yellow-400/60 rounded-full animate-float opacity-30"
              style={{
                left: `${15 + (Math.random() * 70)}%`,
                top: `${15 + (Math.random() * 70)}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${12 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Scroll More Button */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-fade-in" style={{ animationDelay: '600ms' }}>
        <button
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            });
          }}
          className="group flex flex-col items-center gap-2 text-black hover:text-yellow-600 transition-all duration-300 transform hover:scale-110"
        >
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
              Scroll More
            </span>
            <div className="relative">
              {/* Animated Circle */}
              <div className="w-12 h-12 border-2 border-black/30 rounded-full group-hover:border-yellow-600/60 transition-colors duration-300 flex items-center justify-center">
                {/* Animated Arrow */}
                <svg 
                  className="w-6 h-6 transition-all duration-300 group-hover:animate-pulse" 
                  style={{
                    animation: 'gentle-bounce 2.5s ease-in-out infinite'
                  }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                  />
                </svg>
              </div>
              {/* Ripple Effect */}
              <div className="absolute inset-0 w-12 h-12 border border-yellow-400/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;