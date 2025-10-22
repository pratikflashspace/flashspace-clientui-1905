import { Clock, MapPin, Coffee, Wifi, Users2, Presentation, ChevronDown, Building, Phone, Users, Calendar, Video, Monitor, Headphones, CheckCircle, Star } from "lucide-react";
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

const OnDemand = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    const city = searchParams.get('city') || 'Delhi';
    const location = searchParams.get('location') || '';
    setSelectedCity(city);
    setSelectedLocation(location);
  }, [searchParams]);
  const businessSolutions = [
    {
      label: "Virtual Office",
      href: "/services/virtual-office",
      icon: Building,
      description: "Professional business address solutions"
    },
    {
      label: "Coworking Space", 
      href: "/services/coworking-space",
      icon: Users2,
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

  const handleNavigation = (href: string) => {
    navigate(href);
  };
  const services = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Meeting Rooms",
      description: "Professional meeting spaces equipped with modern amenities for productive discussions.",
      duration: "Hourly/Daily",
      price: "From ₹199/hour"
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Video Conferencing",
      description: "State-of-the-art video conferencing facilities for seamless remote collaboration.",
      duration: "Hourly",
      price: "From ₹149/hour"
    },
    {
      icon: <Presentation className="w-6 h-6" />,
      title: "Presentation Rooms",
      description: "Fully equipped presentation spaces with projectors, screens, and sound systems.",
      duration: "Hourly/Half-day",
      price: "From ₹299/hour"
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: "Training Rooms",
      description: "Spacious training facilities perfect for workshops, seminars, and corporate training.",
      duration: "Half-day/Full-day",
      price: "From ₹799/half-day"
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Phone Booths",
      description: "Private soundproof booths for confidential calls and focused work sessions.",
      duration: "Hourly",
      price: "From ₹99/hour"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Day Offices",
      description: "Private office spaces available for day use with all essential amenities.",
      duration: "Daily",
      price: "From ₹999/day"
    }
  ];

  // Mock data for on-demand services by city
  const mockOnDemandServices = {
    delhi: [
      { id: 1, name: "Executive Conference Room", location: "Connaught Place", price: "₹599/hour", capacity: "12 People", features: ["Video Conferencing", "Whiteboard", "Coffee Service", "WiFi"], type: "Meeting Room" },
      { id: 2, name: "Premium Training Hall", location: "Gurgaon Cyber City", price: "₹1,299/day", capacity: "50 People", features: ["Projector", "Sound System", "Catering", "Parking"], type: "Training Room" },
      { id: 3, name: "Private Phone Booth", location: "Nehru Place", price: "₹149/hour", capacity: "1 Person", features: ["Soundproof", "Charging Point", "Comfortable Seating", "Privacy"], type: "Phone Booth" }
    ],
    mumbai: [
      { id: 4, name: "Boardroom Elite", location: "BKC Mumbai", price: "₹899/hour", capacity: "16 People", features: ["Sea View", "Premium Furniture", "Tech Support", "Refreshments"], type: "Meeting Room" },
      { id: 5, name: "Workshop Arena", location: "Lower Parel", price: "₹1,599/day", capacity: "75 People", features: ["Stage Setup", "AV Equipment", "Catering Options", "Metro Access"], type: "Training Room" },
      { id: 6, name: "Focus Pod", location: "Andheri East", price: "₹199/hour", capacity: "2 People", features: ["Dual Monitor", "High-Speed Internet", "Quiet Zone", "Ergonomic Design"], type: "Phone Booth" }
    ],
    bangalore: [
      { id: 7, name: "Tech Conference Suite", location: "Koramangala", price: "₹749/hour", capacity: "20 People", features: ["Smart TV", "Wireless Presentation", "Tech Support", "Snacks"], type: "Meeting Room" },
      { id: 8, name: "Innovation Lab", location: "Whitefield", price: "₹1,199/day", capacity: "40 People", features: ["Creative Setup", "Flexible Furniture", "Ideation Tools", "Coffee Bar"], type: "Training Room" },
      { id: 9, name: "Call Chamber", location: "Electronic City", price: "₹129/hour", capacity: "1 Person", features: ["Noise Cancellation", "HD Camera", "Professional Lighting", "Adjustable Desk"], type: "Phone Booth" }
    ],
    pune: [
      { id: 10, name: "Executive Boardroom", location: "Hinjewadi", price: "₹649/hour", capacity: "14 People", features: ["Smart Board", "Climate Control", "Premium Seating", "Document Scanner"], type: "Meeting Room" },
      { id: 11, name: "Learning Center", location: "Koregaon Park", price: "₹999/day", capacity: "35 People", features: ["Interactive Display", "Breakout Areas", "Natural Light", "Garden View"], type: "Training Room" }
    ]
  };

  // Get services for selected city
  const cityKey = selectedCity.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
  const cityServices = mockOnDemandServices[cityKey as keyof typeof mockOnDemandServices] || mockOnDemandServices.delhi;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-900 hover:text-accent transition-colors group">
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            
            {/* Business Solutions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="text-sm text-gray-700 hover:text-primary transition-colors duration-300 font-medium flex items-center gap-2 border-gray-300"
                >
                  On Demand
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
                    <solution.icon className="w-4 h-4 mr-3 text-accent" />
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
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            {/* City-specific Header */}
            {selectedCity && (
              <div className="bg-primary/5 rounded-lg p-6 mb-8">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">On-demand spaces available in {selectedCity}</span>
                </div>
                {selectedLocation && (
                  <p className="text-gray-600">
                    Near <span className="font-medium">{selectedLocation}</span>
                  </p>
                )}
              </div>
            )}

            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Book Spaces <span className="gradient-text-accent">On-Demand</span>
                {selectedCity && (
                  <span className="block text-2xl md:text-3xl mt-2 text-primary">
                    in {selectedCity}
                  </span>
                )}
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Access professional meeting rooms, video conferencing facilities, and workspace solutions 
                whenever you need them. Book instantly with flexible hourly and daily options.
              </p>

              <div className="flex justify-center gap-4 mb-8">
                <Button className="btn-hero px-8 py-4 text-lg font-semibold">
                  Book Now
                </Button>
                <Button variant="outline" className="px-8 py-4 text-lg font-semibold border-gray-300 text-gray-700 hover:bg-gray-50">
                  View Availability
                </Button>
              </div>
            </div>

            {/* Services Grid */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Available On-Demand Services
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {services.map((service, index) => (
                  <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover-lift border border-gray-200 h-full flex flex-col">
                    <CardHeader className="text-center pb-4 flex-grow">
                      <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-accent">{service.icon}</span>
                      </div>
                      <CardTitle className="text-gray-900 text-xl mb-4 min-h-[3rem] flex items-center justify-center">
                        {service.title}
                      </CardTitle>
                      <div className="flex justify-center items-center gap-4 text-sm mb-4 min-h-[2rem]">
                        <span className="text-gray-500 font-medium">{service.duration}</span>
                        <span className="font-bold text-accent text-base">{service.price}</span>
                      </div>
                      <CardDescription className="text-gray-600 leading-relaxed text-base min-h-[4rem] flex items-center justify-center px-2">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center pt-0 pb-6">
                      <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 font-semibold">
                        Book Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* What is On-Demand Section */}
            <div className="bg-gradient-to-br from-[#172A3A] to-[#172A3A]/90 rounded-2xl p-8 mb-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#EDB003]/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-6">What are On-Demand Spaces?</h2>
                <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                  On-demand workspaces provide instant access to professional meeting rooms, conference facilities,
                  and private offices when you need them. Book by the hour or day without long-term commitments.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#EDB003] rounded-full flex items-center justify-center flex-shrink-0">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-2">Video Conferencing</h3>
                        <p className="text-gray-300 text-sm">State-of-the-art video conferencing facilities with HD cameras, microphones, and seamless connectivity.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#EDB003] rounded-full flex items-center justify-center flex-shrink-0">
                        <Presentation className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-2">Meeting Rooms</h3>
                        <p className="text-gray-300 text-sm">Professional meeting spaces equipped with projectors, whiteboards, and presentation tools.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#EDB003] rounded-full flex items-center justify-center flex-shrink-0">
                        <Headphones className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-2">Private Phone Booths</h3>
                        <p className="text-gray-300 text-sm">Soundproof pods for confidential calls and focused work sessions without distractions.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#EDB003] rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-2">Flexible Booking</h3>
                        <p className="text-gray-300 text-sm">Book spaces hourly, daily, or for specific time slots based on your exact needs.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#EDB003]/20 backdrop-blur-sm border border-[#EDB003]/30 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#EDB003]" />
                    Why Choose On-Demand?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-200">
                      <CheckCircle className="w-4 h-4 text-[#EDB003] flex-shrink-0" />
                      <span>Pay only for what you use</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-200">
                      <CheckCircle className="w-4 h-4 text-[#EDB003] flex-shrink-0" />
                      <span>Professional spaces instantly</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-200">
                      <CheckCircle className="w-4 h-4 text-[#EDB003] flex-shrink-0" />
                      <span>No long-term commitments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* On-Demand Service Listings */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Available Services in {selectedCity}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cityServices.map((service) => (
                  <Card key={service.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover-lift border border-gray-200">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl text-gray-900 font-semibold">
                          {service.name}
                        </CardTitle>
                        <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                          {service.type}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{service.location}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{service.capacity}</span>
                      </div>
                      <div className="text-2xl font-bold text-primary mb-3">
                        {service.price}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1 btn-hero">
                          Book Now
                        </Button>
                        <Button variant="outline" className="flex-1 text-primary border-primary hover:bg-primary/5">
                          Check Availability
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };

export default OnDemand;