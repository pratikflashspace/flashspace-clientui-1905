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

const seoCategories = [
  {
    title: "Coworking Spaces by top cities",
    baseSlug: "/services/coworking-space",
    prefix: "Coworking Space in",
    cities: activeCoworkingCities
  },
  {
    title: "Coworking Day Pass by top cities",
    baseSlug: "/services/coworking-space",
    prefix: "Coworking Day Pass in",
    cities: cities
  },
  {
    title: "Virtual Offices by top cities",
    baseSlug: "/services/virtual-office",
    prefix: "Virtual Office in",
    cities: virtualOfficeCities
  },
  {
    title: "Meeting Rooms by top cities",
    baseSlug: "/services/meeting-rooms", // Assuming this path exists or will exist
    prefix: "Meeting Room in",
    cities: meetingRoomCities
  },
  {
    title: "Managed Offices by top cities",
    baseSlug: "/services/managed-offices",
    prefix: "Managed Office in",
    cities: meetingRoomCities // Using the shorter list for managed offices as well
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
                  {category.cities.map((city, cityIndex) => (
                    <div key={city} className="pl-4 sm:pl-6 pb-2 relative flex items-center">
                      <span className="absolute left-[8px] sm:left-[12px] top-1/2 -translate-y-[60%] text-[#36503F]/40 font-bold text-lg leading-none select-none">·</span>
                      <Link 
                        to={`${category.baseSlug}?city=${encodeURIComponent(city)}`}
                        className="hover:text-[#36503F] hover:underline transition-colors whitespace-nowrap text-[11px] sm:text-[13px] text-gray-600"
                      >
                        {category.prefix} {city}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-300 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Stirring Minds Services Private Limited.
          </p>
        </div>
      </div>
    </section>
  );
};
