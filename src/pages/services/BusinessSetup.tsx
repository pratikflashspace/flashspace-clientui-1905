import { Building, MapPin, Phone, CheckCircle, Star, Users, Award, ChevronDown, Shield, FileCheck, Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import hotToast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import {
  createPaymentOrder,
  openRazorpayCheckout,
  reportPaymentFailure,
  simulatePayment,
  verifyPayment,
} from "@/services/payment.service";
import {
  clearCheckoutState,
  getLoginRedirectUrl,
  persistCheckoutState,
} from "@/utils/checkoutSession";
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
  const { user, isAuthenticated } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedService, setSelectedService] = useState<BusinessSetupService | null>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

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

  const parsePrice = (price: string) => {
    const match = price.match(/[\d,]+/);
    return match ? Number(match[0].replace(/,/g, "")) : 0;
  };

  const checkoutReturnTo = `/services/business-setup?${searchParams.toString()}`;

  const persistBusinessSetupCheckout = (service: BusinessSetupService) => {
    persistCheckoutState(
      {
        page: "business-setup",
        path: checkoutReturnTo,
        serviceId: service.id,
        serviceName: service.name,
      },
      checkoutReturnTo,
    );
  };

  const handleBuyNow = async () => {
    if (!selectedService) return;

    if (!isAuthenticated || !user) {
      hotToast.error("Please login to continue with your purchase");
      persistBusinessSetupCheckout(selectedService);
      navigate(getLoginRedirectUrl(checkoutReturnTo), {
        state: { redirectTo: checkoutReturnTo },
      });
      return;
    }

    const basePrice = parsePrice(selectedService.price);
    if (!basePrice) {
      hotToast.error("Package price is not available");
      return;
    }

    const gstAmount = Number((basePrice * 0.18).toFixed(2));
    const totalAmount = basePrice + gstAmount;
    setIsPaymentLoading(true);

    try {
      const order = await createPaymentOrder({
        userId: user.id || (user as any)._id,
        userEmail: user.email,
        userName: user.fullName || user.email,
        userPhone: (user as any).phoneNumber,
        spaceName: selectedService.name,
        planName: selectedService.name,
        planKey: `business_setup_${selectedService.id}`,
        tenure: 0,
        yearlyPrice: basePrice,
        totalAmount,
        discountPercent: 0,
        discountAmount: 0,
        paymentType: "business_setup",
      });

      if (order.devMode) {
        hotToast.loading("Simulating payment...", { id: "business-setup-payment" });
        const result = await simulatePayment(order.orderId);
        hotToast.dismiss("business-setup-payment");
        clearCheckoutState();
        setSelectedService(null);
        navigate(`/payment/success?orderId=${result.orderId}&paymentId=${result.paymentId}&spaceName=${encodeURIComponent(selectedService.name)}&planName=${encodeURIComponent(selectedService.name)}&amount=${totalAmount}`);
        return;
      }

      await openRazorpayCheckout({
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        keyId: order.keyId,
        userEmail: user.email,
        userName: user.fullName || user.email,
        userPhone: (user as any).phoneNumber,
        spaceName: selectedService.name,
        planName: selectedService.name,
        onSuccess: async (response) => {
          try {
            const result = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clearCheckoutState();
            setSelectedService(null);
            navigate(`/payment/success?orderId=${result.orderId}&paymentId=${result.paymentId}&spaceName=${encodeURIComponent(selectedService.name)}&planName=${encodeURIComponent(selectedService.name)}&amount=${totalAmount}`);
          } catch (error) {
            hotToast.error("Payment verification failed. Please contact support.");
          }
        },
        onFailure: (error) => {
          reportPaymentFailure(order.orderId, error.code, error.description);
          navigate(`/payment/failed?orderId=${order.orderId}`);
        },
        onDismiss: () => hotToast("Payment cancelled"),
      });
    } catch (error: any) {
      hotToast.error(error?.message || "Failed to start payment. Please try again.");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const openFeatureCheckout = (feature: BusinessSetupFeature, index: number) => {
    setSelectedService({
      id: 1000 + index,
      name: feature.title,
      description: feature.description,
      price: feature.price.replace(/^Starting\s+/i, ""),
      timeline: feature.timeline,
      features: [
        feature.title,
        "Documentation Support",
        "Expert Consultation",
        "Application Filing",
      ],
    });
  };

  const features: BusinessSetupFeature[] = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "GST Registration",
      description: "Get your GST number and start invoicing legally across India.",
      timeline: "1-2 days",
      price: "Starting ₹2,499 only",
      popular: true,
      features: ["GSTIN Setup", "PAN & Aadhaar Verification", "Business Address Registration", "Digital Filing Support"],
      documents: ["PAN Card", "Aadhaar Card", "Address Proof", "Bank Details"],
      badge: "Govt Compliant",
      stat: "10k+ Businesses Registered"
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: "Company Registration",
      description: "Register your private limited company with end-to-end legal setup.",
      timeline: "10-15 days",
      price: "Starting ₹11,999 only",
      features: ["Company Name Approval", "Incorporation Certificate", "PAN & TAN", "MOA & AOA Filing"],
      documents: ["PAN & Aadhaar", "Address Proof", "Passport Size Photo"],
      badge: "MCA Approved",
      stat: "Startup Essential"
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "MSME Registration",
      description: "Unlock MSME benefits, subsidies, and government schemes.",
      timeline: "1-2 days",
      price: "Starting ₹1,499 only",
      features: ["Udyam Registration", "MSME Certificate", "Loan Benefits", "Priority Lending Support"],
      documents: ["Aadhaar", "PAN", "Business Details"],
      badge: "Govt Benefits",
      stat: "Fastest Approval"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Startup India Registration",
      description: "Get DPIIT recognition and startup tax benefits.",
      timeline: "5-7 days",
      price: "Starting ₹1,499 only",
      features: ["DPIIT Recognition", "Tax Exemption Guidance", "Startup Certification", "Investor Ready Setup"],
      documents: ["Company Incorporation Docs", "PAN", "Pitch/Business Details"],
      badge: "DPIIT Certified",
      stat: "Investor Friendly"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "GST Filing",
      description: "Monthly and annual GST return filing handled by experts.",
      timeline: "Monthly / Quarterly",
      price: "Starting ₹1,999/month",
      features: ["GSTR-1 Filing", "GSTR-3B Filing", "Invoice Reconciliation", "Input Tax Credit"],
      documents: ["Sales Invoices", "Purchase Invoices", "Bank Statements"],
      badge: "On-Time Filing",
      stat: "Error-Free Returns"
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: "LLP Compliance",
      description: "Stay compliant with annual LLP filing and legal requirements.",
      timeline: "Ongoing Annual Compliance",
      price: "Customized",
      features: ["Annual Filing", "Form 8 & 11", "ROC Compliance", "Partner Updates"],
      documents: ["LLP Agreement", "Financial Statements", "Bank Statements"],
      badge: "ROC Compliant",
      stat: "Legal Safe"
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "MCA Compliance",
      description: "Complete MCA compliance and ROC filing support for companies.",
      timeline: "Monthly / Annual",
      price: "Customized",
      features: ["ROC Filing", "Board Resolution Support", "Director KYC", "Annual Returns"],
      documents: ["Financial Statements", "Audit Reports", "Director Details"],
      badge: "MCA Ready",
      stat: "Filing Managed"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "FSSAI Registration",
      description: "Food business license and compliance support for restaurants & brands.",
      timeline: "20-30 days",
      price: "Starting ₹2,999 only",
      features: ["Food License Support", "State/Central License", "Compliance Guidance", "Renewal Support"],
      documents: ["ID Proof", "Business Address", "Food Category Details"],
      badge: "Food Safe",
      stat: "FSSAI Certified"
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "Section 8 Registration",
      description: "Register your NGO or non-profit organization as a Section 8 company.",
      timeline: "15-20 days",
      price: "Starting ₹14,999 only",
      features: ["NGO Registration", "80G & 12A Support", "MOA & AOA Filing", "PAN & TAN"],
      documents: ["PAN & Aadhaar", "Address Proof", "Passport Size Photo"],
      badge: "NGO Ready",
      stat: "Social Impact"
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
                <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-default border border-gray-200">
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
                    <Button
                      className="mt-5 w-full bg-[#36503F] text-[#FEF8C5] hover:bg-[#1F2E26]"
                      onClick={() => openFeatureCheckout(feature, index)}
                    >
                      Buy Now
                    </Button>
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
                <Card key={service.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-default border border-gray-200">
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
                      <Button
                        className="flex-1 btn-hero"
                        onClick={() => setSelectedService(service)}
                      >
                        Buy Now
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-primary border-primary hover:bg-primary/5"
                        onClick={() =>
                          navigate(
                            `/solutions/business-setup?city=${encodeURIComponent(selectedCity)}&service=${encodeURIComponent(service.name)}`,
                          )
                        }
                      >
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

      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden">
          {selectedService && (
            <>
              <DialogHeader className="bg-[#36503F] px-6 py-5 text-left">
                <DialogTitle className="text-2xl font-bold text-white">
                  {selectedService.name}
                </DialogTitle>
                <DialogDescription className="text-[#FEF8C5]/90">
                  {selectedService.description}
                </DialogDescription>
              </DialogHeader>

              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Package</p>
                    <p className="mt-1 text-xl font-bold text-[#36503F]">{selectedService.price}</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">GST</p>
                    <p className="mt-1 text-xl font-bold text-[#36503F]">18%</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Timeline</p>
                    <p className="mt-1 text-xl font-bold text-[#36503F]">{selectedService.timeline}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-900">
                    Included Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedService.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white p-3 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-[#36503F]/15 bg-[#36503F]/5 p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 shrink-0 text-[#36503F]" />
                    <p className="text-sm text-gray-700">
                      Payment Razorpay se securely process hoga. Payment complete hone ke baad confirmation user dashboard me reflect hoga.
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#36503F] text-[#FEF8C5] hover:bg-[#1F2E26]"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={isPaymentLoading}
                >
                  {isPaymentLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Buy Now"
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessSetup;
