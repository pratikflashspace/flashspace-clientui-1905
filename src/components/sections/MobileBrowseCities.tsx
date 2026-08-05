import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

const popularCities = ["Ahmedabad", "Bangalore", "Chennai", "Delhi", "Gurgaon", "Hyderabad", "Mumbai", "Noida", "Pune"];
const otherCities = ["Agra", "Chandigarh", "Jaipur", "Kochi", "Kolkata"];

export const MobileBrowseCities = () => {
  const navigate = useNavigate();
  const [showAllCities, setShowAllCities] = useState(false);
  const allCitiesList = [...popularCities, ...otherCities];

  const navigateToOption = (city: string) => {
    const slug = city.toLowerCase().replace(/\s+/g, '-');
    navigate(`/services/virtual-office/${slug}`);
  };

  return (
    <section className="lg:hidden bg-white py-8">
      <div className="fs-container px-2">
        <div className="flex items-center justify-between mb-5 px-2">
          <h2 className="text-[22px] font-extrabold tracking-[-0.03em] text-[#1A1A1A]">
            Browse by cities
          </h2>
          <button
            onClick={() => setShowAllCities(!showAllCities)}
            className="text-sm font-semibold text-[#36503F] underline"
          >
            {showAllCities ? "View less" : "View all"}
          </button>
        </div>
        <div
          className={
            showAllCities
              ? "flex flex-wrap gap-2.5 px-2"
              : "grid grid-rows-2 grid-flow-col gap-2.5 overflow-x-auto pb-4 px-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          }
        >
          {allCitiesList.map((city) => (
            <button
              key={city}
              onClick={() => navigateToOption(city)}
              className="flex items-center justify-center gap-1.5 rounded-full border border-[#D4E0D0] bg-[#F0F4EE] px-4 py-2 text-[13px] font-medium text-[#36503F] hover:border-[#36503F] hover:bg-[#E5F3EB] transition-colors whitespace-nowrap snap-start"
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              {city}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
