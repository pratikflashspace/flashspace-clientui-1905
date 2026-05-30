import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

const popularCities = ["Ahmedabad", "Bangalore", "Chennai", "Delhi", "Gurgaon", "Hyderabad", "Mumbai", "Noida", "Pune"];
const otherCities = ["Agra", "Chandigarh", "Jaipur", "Kochi", "Kolkata"];

export const MobileBrowseCities = () => {
  const navigate = useNavigate();
  const [showAllCities, setShowAllCities] = useState(false);
  const allCitiesList = [...popularCities, ...otherCities];
  const visibleCities = showAllCities ? allCitiesList : allCitiesList.slice(0, 11);

  const navigateToOption = (city: string) => {
    // Navigate to Coworking Space by default, or Virtual Office.
    // The previous component relied on `activeTab`. We can just default to coworking-space or virtual-office
    navigate(`/services/virtual-office?city=${encodeURIComponent(city)}`);
  };

  return (
    <section className="lg:hidden bg-white py-8">
      <div className="fs-container">
        <h2 className="text-[22px] font-extrabold tracking-[-0.03em] text-[#1A1A1A] mb-5 text-center">
          Browse by cities
        </h2>
        <div className="flex flex-wrap justify-center gap-2.5">
          {visibleCities.map((city) => (
            <button
              key={city}
              onClick={() => navigateToOption(city)}
              className="flex items-center gap-1.5 rounded-full border border-[#D4E0D0] bg-[#F0F4EE] px-4 py-2 text-[13px] font-medium text-[#36503F] hover:border-[#36503F] hover:bg-[#E5F3EB] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              {city}
            </button>
          ))}
          {allCitiesList.length > 11 && (
            <button
              onClick={() => setShowAllCities(!showAllCities)}
              className="flex items-center gap-1.5 rounded-full bg-[#E5F3EB] px-4 py-2 text-[13px] font-bold text-[#36503F] hover:bg-[#D4E0D0] transition-colors"
            >
              {showAllCities ? "View less" : `+ ${allCitiesList.length - 11} more`}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
