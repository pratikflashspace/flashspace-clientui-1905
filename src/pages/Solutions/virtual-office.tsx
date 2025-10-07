import { Building, MapPin, Mail, Phone, FileText, CheckCircle, Star, Users, Award, ChevronDown, Search, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const VirtualOffice = () => {
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"
  ];

  const features = [
    {
      icon: Building,
      title: "Private & Professional",
      description: "Get a prestigious business address in prime locations with 24/7 access"
    },
    {
      icon: Star,
      title: "Flexible Terms",
      description: "No long-term commitments. Choose plans that fit your business needs"
    },
    {
      icon: Users,
      title: "Ready for All Sizes",
      description: "Perfect for solopreneurs to teams of 100+ members"
    },
    {
      icon: Mail,
      title: "Mail & Call Handling",
      description: "Professional mail forwarding and dedicated call management"
    },
    {
      icon: FileText,
      title: "GST Registration",
      description: "Complete support for GST and business registration"
    },
    {
      icon: Award,
      title: "Premium Amenities",
      description: "Access to meeting rooms and business facilities on-demand"
    }
  ];

  const cityLocations = [
    {
      city: "Bangalore",
      centers: 18,
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80",
      description: "Tech hub with premium business addresses"
    },
    {
      city: "Delhi NCR",
      centers: 24,
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
      description: "Capital region with prestigious locations"
    },
    {
      city: "Mumbai",
      centers: 22,
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
      description: "Financial capital business addresses"
    },
    {
      city: "Pune",
      centers: 12,
      image: "https://images.unsplash.com/photo-1595659919839-67e5e0e6f47f?w=800&q=80",
      description: "IT corridor and startup ecosystem"
    },
    {
      city: "Hyderabad",
      centers: 15,
      image: "https://images.unsplash.com/photo-1609619385002-f40f7eb3b755?w=800&q=80",
      description: "Emerging tech city premium spaces"
    },
    {
      city: "Chennai",
      centers: 10,
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
      description: "Southern business hub locations"
    }
  ];

  const whyChooseReasons = [
    {
      title: "Flexibility",
      description: "Scale up or down based on your business needs. No hidden costs, transparent pricing with month-to-month flexibility.",
      icon: "🔄"
    },
    {
      title: "Customization",
      description: "Tailor your virtual office package with add-ons like meeting rooms, call handling, and mail services.",
      icon: "⚙️"
    },
    {
      title: "End-to-End Support",
      description: "From GST registration to legal documentation, our expert team handles everything for you.",
      icon: "🤝"
    },
    {
      title: "Professional Credibility",
      description: "Establish your business presence with a prestigious address in prime commercial locations.",
      icon: "🏆"
    },
    {
      title: "Cost Effective",
      description: "Save up to 90% compared to traditional office spaces while maintaining a professional image.",
      icon: "💰"
    },
    {
      title: "Quick Setup",
      description: "Get started in 24-48 hours with instant verification and documentation support.",
      icon: "⚡"
    }
  ];

  const journeySteps = [
    {
      step: "1",
      title: "Schedule a Tour",
      description: "Book a virtual or in-person tour of our locations to explore your options",
      icon: "🗓️"
    },
    {
      step: "2",
      title: "Choose Your Plan",
      description: "Select the perfect package that matches your business requirements",
      icon: "✅"
    },
    {
      step: "3",
      title: "Get Started",
      description: "Complete documentation and start using your virtual office immediately",
      icon: "🚀"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold" style={{ fontFamily: 'Poppins' }}>
              <span className="text-[#EDB003]">Flash</span><span className="text-gray-900">Space</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link to="/" className="text-gray-700 hover:text-[#EDB003] transition-colors">Home</Link>
              <Link to="/services" className="text-gray-700 hover:text-[#EDB003] transition-colors">Services</Link>
              <Button className="bg-[#EDB003] hover:bg-[#d69f03] text-white">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Image Carousel */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"
            alt="Virtual Office Space"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Poppins' }}>
              Premium Virtual Office Solutions
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Fully-equipped, ready-to-move-in or customizable virtual office spaces for businesses of all sizes
            </p>

            {/* Hero Search Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-xl">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Popover open={isLocationOpen} onOpenChange={setIsLocationOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        role="combobox"
                        className="w-full justify-between h-14 text-gray-900 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-[#EDB003]" />
                          <span className="text-lg">{selectedCity || "Select City"}</span>
                        </div>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search city..." />
                        <CommandList>
                          <CommandEmpty>No city found.</CommandEmpty>
                          <CommandGroup>
                            {cities.map((city) => (
                              <CommandItem
                                key={city}
                                value={city}
                                onSelect={() => {
                                  setSelectedCity(city);
                                  setIsLocationOpen(false);
                                }}
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
                    </PopoverContent>
                  </Popover>
                </div>
                <Button className="bg-[#EDB003] hover:bg-[#d69f03] text-white h-14 px-8 text-lg">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ fontFamily: 'Poppins' }}>
            Why Choose Our Virtual Office?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-transparent hover:border-[#EDB003] transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-[#EDB003]/10 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="w-7 h-7 text-[#EDB003]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location Grid Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Poppins' }}>
              <span className="text-[#EDB003]">68+</span> Centers Across <span className="text-[#EDB003]">8</span> Cities
            </h2>
            <p className="text-xl text-gray-600">Find your perfect virtual office location</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityLocations.map((location, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={location.image}
                    alt={location.city}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{location.city}</h3>
                  <p className="text-gray-200 mb-2">{location.description}</p>
                  <div className="flex items-center gap-2 text-[#EDB003]">
                    <Building className="w-4 h-4" />
                    <span className="font-semibold">{location.centers} Centers</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ fontFamily: 'Poppins' }}>
            Why Choose FlashSpace Virtual Offices?
          </h2>
          <p className="text-center text-gray-300 mb-12 text-lg">
            Everything you need to establish and grow your business presence
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseReasons.map((reason, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{reason.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-[#EDB003]">{reason.title}</h3>
                <p className="text-gray-300">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ fontFamily: 'Poppins' }}>
            Your Journey Starts Here
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Get started with your virtual office in 3 simple steps
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {journeySteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-20 h-20 bg-[#EDB003] rounded-full flex items-center justify-center text-3xl mb-6 mx-auto shadow-lg">
                    {step.icon}
                  </div>
                  <div className="absolute top-10 left-1/2 w-full h-0.5 bg-[#EDB003]/30 -z-10 hidden md:block last:hidden" style={{ transform: 'translateX(50%)' }}></div>
                  <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-100 hover:border-[#EDB003] transition-all duration-300">
                    <div className="text-sm font-bold text-[#EDB003] mb-2">STEP {step.step}</div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="bg-[#EDB003] hover:bg-[#d69f03] text-white text-lg px-8 py-6 rounded-full">
              Schedule Your Tour Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* What is Virtual Office Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center" style={{ fontFamily: 'Poppins' }}>
              What is a Virtual Office?
            </h2>
            <p className="text-lg text-gray-700 mb-8 text-center leading-relaxed">
              A virtual office provides businesses with a professional business address and essential office services
              without the need for a physical office space. It's the perfect solution for startups, freelancers, and
              remote teams who need a prestigious business presence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-[#EDB003]/20 hover:border-[#EDB003] transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#EDB003] rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">Professional Address</h3>
                      <p className="text-gray-600">Get a prestigious business address in prime locations for GST registration, business cards, and company registration.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#EDB003]/20 hover:border-[#EDB003] transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#EDB003] rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">Mail & Call Handling</h3>
                      <p className="text-gray-600">Professional mail forwarding and call management services to ensure you never miss important communications.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#EDB003]/20 hover:border-[#EDB003] transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#EDB003] rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">GST & Legal Support</h3>
                      <p className="text-gray-600">Complete assistance with GST registration, company incorporation, and legal documentation requirements.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#EDB003]/20 hover:border-[#EDB003] transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#EDB003] rounded-full flex items-center justify-center flex-shrink-0">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">Meeting Rooms Access</h3>
                      <p className="text-gray-600">On-demand access to professional meeting rooms and conference facilities when you need them.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 bg-[#EDB003]/10 border-2 border-[#EDB003]/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
                <Star className="w-6 h-6 text-[#EDB003]" />
                Key Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#EDB003] flex-shrink-0" />
                  <span className="text-gray-700">90% cost savings vs traditional office</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#EDB003] flex-shrink-0" />
                  <span className="text-gray-700">Work from anywhere, anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#EDB003] flex-shrink-0" />
                  <span className="text-gray-700">Professional business credibility</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#EDB003] to-[#f5c242]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins' }}>
            Ready to Establish Your Business Presence?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join 1000+ businesses who trust FlashSpace for their virtual office needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-[#EDB003] hover:bg-gray-100 text-lg px-8 py-6 rounded-full">
              Get Started Today
            </Button>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#EDB003] text-lg px-8 py-6 rounded-full">
              Talk to Expert
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins' }}>
                <span className="text-[#EDB003]">Flash</span>Space
              </h3>
              <p className="text-gray-400">Premium virtual office solutions for modern businesses</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/services/virtual-office" className="hover:text-[#EDB003]">Virtual Office</Link></li>
                <li><Link to="/services/coworking-space" className="hover:text-[#EDB003]">Coworking Space</Link></li>
                <li><Link to="/services/on-demand" className="hover:text-[#EDB003]">On Demand</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-[#EDB003]">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-[#EDB003]">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-[#EDB003]">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>+91 8100888777</li>
                <li>info@flashspace.in</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FlashSpace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VirtualOffice;
