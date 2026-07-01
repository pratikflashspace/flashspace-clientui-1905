import React from 'react';
import { Link } from 'react-router-dom';

const cities = [
  "Noida", "Ghaziabad", "Delhi", "Faridabad", "Gurgaon", "Bangalore", 
  "Mumbai", "Hyderabad", "Ahmedabad", "Chennai", "Pune", "Jaipur", 
  "Kolkata", "Indore", "Kochi", "Visakhapatnam", "Goa", "Coimbatore", 
  "Chandigarh", "Lucknow", "Dehradun", "Agra", "Kanpur", "Amritsar", 
  "Ludhiana", "Imphal", "Nashik", "Gwalior", "Bhopal", "Raipur", 
  "Guwahati", "Patna", "Trivandrum", "Kozhikode", "Vijayawada", 
  "Gandhinagar", "Surat", "Vadodara", "Bhilai", "Mysore", "Kottakkal", 
  "Chhatrapati Sambhajinagar"
];

const activeCoworkingCities = [
  "Ahmedabad", "Bangalore", "Chandigarh", "Chennai", "Chhattisgarh", 
  "Delhi", "Gurgaon", "Himachal Pradesh", "Hyderabad", "Jaipur", 
  "Jammu and Kashmir", "Jharkhand", "Jodhpur", "Kochi", "Kolkata", 
  "Madhya Pradesh", "Mumbai", "Mysuru", "Noida", "Patna", "Pune", 
  "Punjab", "Uttarakhand"
];

const virtualOfficeCities = [
  "Ahmedabad", "Bangalore", "Chandigarh", "Chennai", "Chhattisgarh", 
  "Delhi", "Gurgaon", "Himachal Pradesh", "Hyderabad", "Jaipur", 
  "Jammu and Kashmir", "Jharkhand", "Jodhpur", "Kochi", "Kolkata", 
  "Madhya Pradesh", "Mumbai", "Mysuru", "Noida", "Patna", "Pune", 
  "Punjab", "Uttarakhand", "Agra"
];

const meetingRoomCities = [
  "Noida", "Delhi", "Gurgaon", "Bangalore", "Mumbai", "Hyderabad", 
  "Ahmedabad", "Chennai", "Pune", "Jaipur", "Kolkata", "Indore", "Lucknow"
];

const businessSetupServices = [
  { name: "Private Limited Company Registration", slug: "/services/business-setup#bs-card-company-registration-llp-opc-pvt-ltd" },
  { name: "Limited Liability Partnership (LLP)", slug: "/services/business-setup#bs-card-company-registration-llp-opc-pvt-ltd" },
  { name: "One Person Company (OPC)", slug: "/services/business-setup#bs-card-company-registration-llp-opc-pvt-ltd" },
  { name: "Sole Proprietorship Registration", slug: "/services/business-setup#bs-card-company-registration-llp-opc-pvt-ltd" },
  { name: "GST Registration & Filing", slug: "/services/business-setup#bs-card-gst-registration" },
  { name: "Trademark Registration", slug: "/services/business-setup#bs-card-company-registration-llp-opc-pvt-ltd" },
  { name: "FSSAI License", slug: "/services/business-setup#bs-card-fssai-registration" },
  { name: "Startup India Registration", slug: "/services/business-setup#bs-card-startup-india-registration" },
  { name: "MSME / Udyam Registration", slug: "/services/business-setup#bs-card-msme-udyam-registration" },
  { name: "ISO Certification", slug: "/services/business-setup#bs-card-company-registration-llp-opc-pvt-ltd" },
  { name: "Import Export Code (IEC)", slug: "/services/business-setup#bs-card-company-registration-llp-opc-pvt-ltd" }
];

const businessCalculators = [
  { name: "All Business Calculators", slug: "/calculators" },
  { name: "Income Tax Calculator", slug: "/calculators/income-tax" },
  { name: "GST Calculator", slug: "/calculators/gst" }
];

const seoCategories = [
  {
    title: "Virtual Offices by top cities",
    baseSlug: "/services/virtual-office",
    prefix: "Virtual Office in",
    cities: virtualOfficeCities
  },
  {
    title: "Coworking Spaces by top cities",
    baseSlug: "/services/coworking-space",
    prefix: "Coworking Space in",
    cities: activeCoworkingCities
  },
  {
    title: "Top Business Setup & Compliance Services",
    isServiceList: true,
    services: businessSetupServices
  },
  {
    title: "Business & Financial Calculators",
    isServiceList: true,
    services: businessCalculators
  }
];

export const FooterSEO = () => {
  return (
    <section className="bg-[#FAFAF7] py-12 px-4 sm:px-6 lg:px-8 border-t border-[#E8E2D9] font-sans">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-10">
          {seoCategories.map((category, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-[#25362B] font-semibold text-sm sm:text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
                {category.title}
              </h3>
              <div className="overflow-hidden py-1">
                <div className="flex flex-wrap items-center -ml-4 sm:-ml-6 -mb-2">
                  {category.isServiceList && category.services ? (
                    category.services.map((service) => (
                      <div key={service.name} className="pl-4 sm:pl-6 mb-2 relative flex items-center">
                        <div className="absolute left-[6px] sm:left-[10px] top-1/2 -translate-y-1/2 w-[3px] h-[3px] sm:w-1 sm:h-1 rounded-full bg-black/40" />
                        <Link 
                          to={service.slug}
                          className="hover:text-[#36503F] transition-colors whitespace-nowrap text-[12px] text-gray-600"
                        >
                          {service.name}
                        </Link>
                      </div>
                    ))
                  ) : (
                    category.cities?.map((city) => (
                      <div key={city} className="pl-4 sm:pl-6 mb-2 relative flex items-center">
                        <div className="absolute left-[6px] sm:left-[10px] top-1/2 -translate-y-1/2 w-[3px] h-[3px] sm:w-1 sm:h-1 rounded-full bg-[#36503F]/40" />
                        <Link 
                          to={`${category.baseSlug}?city=${encodeURIComponent(city)}`}
                          className="hover:text-[#36503F] transition-colors whitespace-nowrap text-[12px] text-gray-600"
                        >
                          {category.prefix} {city}
                        </Link>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Stirring Minds Services Private Limited.
          </p>
        </div>

        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="absolute bottom-24 sm:bottom-28 right-4 sm:right-6 flex items-center justify-center w-10 h-10 rounded-full bg-[#36503F] text-white hover:bg-[#25362B] transition-colors shadow-lg z-20"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </section>
  );
};
