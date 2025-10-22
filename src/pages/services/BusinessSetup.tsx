import { Building, MapPin, Mail, Phone, FileText, CheckCircle, Star, Users, Award, ChevronDown, Shield, FileCheck, Clock } from "lucide-react";
import {  Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { 
  BusinessSolution, 
  BusinessSetupFeature, 
  BusinessSetupService, 
  BusinessSetupCityKey, 
  BusinessSetupServicesByCity 
} from "@/types/services";

const BusinessSetup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  useEffect(() => {
    const city = searchParams.get('city') || 'Delhi';
    const location = searchParams.get('location') || '';
    setSelectedCity(city);
    setSelectedLocation(location);
  }, [searchParams]);

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
      label: "Business Setup",
      href: "/services/business-setup",
      icon: FileCheck,
      description: "Complete business registration services"
    }
  ];

  const handleNavigation = (href: string): void => {
    navigate(href);
  };

  const features: BusinessSetupFeature[] = [
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: "Company Registration",
      description: "Complete assistance with Private Limited, LLP, OPC, and Partnership company registration.",
      timeline: "7-15 days",
      price: "Starting ₹999"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "GST Registration",
      description: "Hassle-free GST registration with expert guidance and documentation support.",
      timeline: "3-7 days",
      price: "Starting ₹499"
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "Business License",
      description: "Obtain necessary business licenses and permits required for your industry.",
      timeline: "10-21 days",
      price: "Starting ₹1,499"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Trademark Registration",
      description: "Protect your brand with comprehensive trademark registration services.",
      timeline: "12-18 months",
      price: "Starting ₹2,999"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Compliance Services",
      description: "Ongoing compliance management including filings, returns, and statutory requirements.",
      timeline: "Monthly/Yearly",
      price: "Starting ₹999/month"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "ISO Certification",
      description: "ISO certification services to enhance your business credibility and market reach.",
      timeline: "2-6 months",
      price: "Starting ₹15,999"
    }
  ];

  // Mock data for business setup services by city
  const mockBusinessSetupServices: BusinessSetupServicesByCity = {
    delhi: [
      { id: 1, name: "Private Limited Company Package", description: "Complete Pvt Ltd registration with digital signature", price: "₹6,999", timeline: "10-15 days", features: ["Company Registration", "Digital Signature", "Bank Account Opening", "GST Registration"] },
      { id: 2, name: "Startup Registration Bundle", description: "Perfect package for new startups and entrepreneurs", price: "₹12,999", timeline: "15-21 days", features: ["Company Registration", "Trademark Filing", "GST Registration", "Professional Address", "Compliance Kit"] },
      { id: 3, name: "GST Registration Express", description: "Quick GST registration for existing businesses", price: "₹1,499", timeline: "3-5 days", features: ["GST Application", "Documentation Support", "Expert Consultation", "Return Filing Setup"] }
    ],
    mumbai: [
      { id: 4, name: "Premium Business Setup", description: "Complete business setup with premium support", price: "₹15,999", timeline: "12-18 days", features: ["Pvt Ltd Registration", "Premium Address", "Legal Consultation", "Banking Support", "Tax Planning"] },
      { id: 5, name: "LLP Formation Package", description: "Limited Liability Partnership registration", price: "₹8,999", timeline: "8-12 days", features: ["LLP Registration", "Partnership Deed", "Digital Signature", "Bank Account Support"] },
      { id: 6, name: "Trademark Protection", description: "Brand protection with trademark registration", price: "₹4,999", timeline: "12-15 months", features: ["Trademark Search", "Application Filing", "Response to Objections", "Registration Certificate"] }
    ],
    bangalore: [
      { id: 7, name: "Tech Startup Package", description: "Specialized package for technology startups", price: "₹18,999", timeline: "15-20 days", features: ["Company Registration", "IP Protection", "Foreign Investment Support", "Compliance Setup", "Tech Licensing"] },
      { id: 8, name: "OPC Registration", description: "One Person Company registration for solo entrepreneurs", price: "₹4,999", timeline: "7-10 days", features: ["OPC Registration", "Digital Signature", "Basic Compliance", "Bank Account Opening"] },
      { id: 9, name: "Export Business Setup", description: "Complete setup for export-import business", price: "₹22,999", timeline: "20-25 days", features: ["IEC License", "Company Registration", "Export Licenses", "Banking Setup", "Compliance Support"] }
    ],
    pune: [
      { id: 10, name: "Manufacturing Business Setup", description: "Complete setup for manufacturing companies", price: "₹25,999", timeline: "25-30 days", features: ["Factory License", "Pollution Certificate", "Company Registration", "Labor License", "Fire Safety"] },
      { id: 11, name: "Small Business Package", description: "Affordable package for small businesses", price: "₹3,999", timeline: "5-8 days", features: ["Proprietorship Registration", "GST Registration", "Basic Licenses", "Bank Account Support"] }
    ]
  };

  // Get services for selected city
  const cityKey = selectedCity.toLowerCase().replace(/\s+/g, '').replace(/-/g, '');
  const cityServices = mockBusinessSetupServices[cityKey as BusinessSetupCityKey] || mockBusinessSetupServices.delhi;

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
                  Business Setup
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {businessSolutions.map((solution) => (
                  <DropdownMenuItem
                    key={solution.href}
                    onClick={() => handleNavigation(solution.href)}
                    className="flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <solution.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">{solution.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{solution.description}</div>
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
                <span className="font-medium">Showing results for {selectedCity}</span>
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
              Complete <span className="gradient-text-accent">Business Setup</span>
              {selectedCity && (
                <span className="block text-2xl md:text-3xl mt-2 text-primary">
                  in {selectedCity}
                </span>
              )}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Get your business registered and compliant with expert guidance. From company registration 
              to GST filing, we handle everything so you can focus on growing your business.
            </p>

            <div className="flex justify-center gap-4 mb-8">
              <Button className="btn-hero px-8 py-4 text-lg font-semibold">
                Start Registration
              </Button>
              <Button variant="outline" className="px-8 py-4 text-lg font-semibold border-gray-300 text-gray-700 hover:bg-gray-50">
                Free Consultation
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Complete Business Registration Services
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover-lift border border-gray-200">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-accent">{feature.icon}</span>
                    </div>
                    <CardTitle className="text-gray-900 text-xl">{feature.title}</CardTitle>
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="text-primary font-semibold">{feature.price}</span>
                      <span className="text-gray-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {feature.timeline}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* What is Business Setup Section */}
          <div className="bg-gradient-to-br from-[#172A3A] to-[#172A3A]/90 rounded-2xl p-8 mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#EDB003]/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-6">What is Business Setup?</h2>
              <p className="text-gray-200 text-lg mb-6 leading-relaxed">
                Business setup services help you establish and register your company legally in India. From company
                incorporation to GST registration and compliance, we handle all legal formalities so you can focus on growing your business.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#EDB003] rounded-full flex items-center justify-center flex-shrink-0">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Company Registration</h3>
                      <p className="text-gray-300 text-sm">Register your Private Limited, LLP, OPC, or Partnership firm with complete legal documentation.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#EDB003] rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">GST & Tax Registration</h3>
                      <p className="text-gray-300 text-sm">Hassle-free GST registration with expert guidance on tax compliance and filing requirements.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#EDB003] rounded-full flex items-center justify-center flex-shrink-0">
                      <FileCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Licenses & Permits</h3>
                      <p className="text-gray-300 text-sm">Obtain all necessary business licenses, permits, and certifications required for your industry.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#EDB003] rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Ongoing Compliance</h3>
                      <p className="text-gray-300 text-sm">Annual filings, statutory compliance, and regular legal updates to keep your business compliant.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#EDB003]/20 backdrop-blur-sm border border-[#EDB003]/30 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#EDB003]" />
                  Why Choose Our Business Setup Services?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-200">
                    <CheckCircle className="w-4 h-4 text-[#EDB003] flex-shrink-0" />
                    <span>Expert legal guidance throughout</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-200">
                    <CheckCircle className="w-4 h-4 text-[#EDB003] flex-shrink-0" />
                    <span>Fast & hassle-free registration</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-200">
                    <CheckCircle className="w-4 h-4 text-[#EDB003] flex-shrink-0" />
                    <span>Complete compliance management</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Packages */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Business Setup Packages in {selectedCity}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityServices.map((service) => (
                <Card key={service.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover-lift border border-gray-200">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl text-gray-900 font-semibold">
                        {service.name}
                      </CardTitle>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {service.price}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {service.timeline}
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-gray-600 mb-4">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 btn-hero">
                        Get Started
                      </Button>
                      <Button variant="outline" className="flex-1 text-primary border-primary hover:bg-primary/5">
                        Learn More
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

export default BusinessSetup;