import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";

const heroImage = "/heroimage.png";
const popularCities = ["Ahmedabad", "Bangalore", "Chennai", "Delhi", "Gurgaon", "Hyderabad", "Mumbai", "Noida", "Pune"];
const otherCities = ["Agra", "Aluva", "Ambala", "Amritsar", "Bhopal", "Chandigarh", "Coimbatore", "Faridabad", "Ghaziabad", "Indore", "Jaipur", "Kochi", "Kolkata", "Lucknow", "Nagpur", "Rajkot", "Surat", "Vadodara", "Vijayawada", "Visakhapatnam"];

type Tab = "virtual-office" | "coworking-space" | "business-setup";

export const HeroWithSearch = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("virtual-office");
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiQuery, setAiQuery] = useState("");

  const [showAllCities, setShowAllCities] = useState(false);
  const allCitiesList = [...popularCities, ...otherCities];
  const visibleCities = showAllCities ? allCitiesList : allCitiesList.slice(0, 15);

  const businessServicesList = ["GST Registration", "Company Incorporation", "MSME", "Startup India Registration", "FSSAI Registration", "ISO", "Trademark", "LLP Compliance", "MCA Compliance"];
  
  const isBusinessSetup = activeTab === "business-setup";
  const searchOptions = isBusinessSetup ? businessServicesList : allCitiesList;

  const navigateToOption = (option: string) => {
    setLocationSearch("");
    setShowLocationDropdown(false);
    if (isBusinessSetup) {
      navigate("/services/business-setup");
    } else {
      navigate(`/services/${activeTab}?city=${encodeURIComponent(option)}`);
    }
  };

  const submitSearch = () => {
    const match = searchOptions.find((opt) => opt.toLowerCase().includes(locationSearch.toLowerCase()));
    navigateToOption(match || locationSearch || (isBusinessSetup ? "GST Registration" : "Delhi"));
  };

  const matches = searchOptions.filter((opt) =>
    opt.toLowerCase().includes(locationSearch.toLowerCase())
  );

  return (
    <section className="bg-white pt-14 md:pt-16">
      <div className="fs-container grid items-center gap-12 pb-8 pt-8 md:pb-10 md:pt-12 lg:grid-cols-[0.92fr_1.08fr] lg:pb-12 lg:pt-16">
        <div className="mx-auto max-w-[680px] text-center lg:mx-0 lg:text-left">

          <h1 className="mt-6 text-[40px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#1A1A1A] sm:text-5xl lg:text-[56px]">
           India's Smartest <br /><span className="text-[#36503F]">Business Solutions Platform.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[480px] text-base font-normal leading-[1.7] text-[#6B8F78] lg:mx-0">
           All your workspace needs, GST registration, and compliance support, across 20+ states.
          </p>

          <div className="mt-8 rounded-xl border border-[#D4E0D0] bg-[#FAFAF7] p-2 shadow-[0_4px_24px_rgba(54,80,63,0.08)] max-w-lg mx-auto lg:mx-0">
            {/* Tabs */}
            <div className="flex p-1 bg-[#F0F4EE] rounded-lg mb-2">
              <button
                onClick={() => setActiveTab("virtual-office")}
                className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-colors ${activeTab === "virtual-office" ? "bg-[#36503F] text-white shadow-sm" : "text-[#6B8F78] hover:text-[#1A1A1A]"}`}
              >
                Virtual Office
              </button>
              <button
                onClick={() => setActiveTab("coworking-space")}
                className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-colors ${activeTab === "coworking-space" ? "bg-[#36503F] text-white shadow-sm" : "text-[#6B8F78] hover:text-[#1A1A1A]"}`}
              >
                Coworking Space
              </button>
              <button
                onClick={() => setActiveTab("business-setup")}
                className={`flex-1 py-2 px-3 text-sm font-semibold rounded-md transition-colors ${activeTab === "business-setup" ? "bg-[#36503F] text-white shadow-sm" : "text-[#6B8F78] hover:text-[#1A1A1A]"}`}
              >
                Business Setup
              </button>
            </div>

            {/* Search Bar */}
            {!aiMode ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <label className="flex h-12 items-center gap-3 rounded-lg border border-[#D4E0D0] bg-white px-4">
                    <Search className="h-4 w-4 text-[#6B8F78]" />
                    <input
                      value={locationSearch}
                      onChange={(event) => {
                        setLocationSearch(event.target.value);
                        setShowLocationDropdown(Boolean(event.target.value));
                      }}
                      onKeyDown={(event) => event.key === "Enter" && submitSearch()}
                      placeholder={isBusinessSetup ? "Search services..." : "Search city..."}
                      className="w-full bg-transparent text-sm text-[#1A1A1A] outline-none border-none focus:ring-0 focus:outline-none placeholder:text-[#6B8F78]"
                    />
                  </label>
                  {showLocationDropdown && locationSearch && matches.length > 0 && (
                    <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-64 overflow-auto rounded-lg border border-[#D4E0D0] bg-white py-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                      {matches.slice(0, 8).map((option) => (
                        <button
                          key={option}
                          onClick={() => navigateToOption(option)}
                          className="block w-full px-4 py-2 text-left text-sm text-[#1A1A1A] hover:bg-[#F0F4EE]"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={submitSearch} className="fs-secondary-btn h-12 px-6 py-0 whitespace-nowrap">
                  Search
                </button>
                <button onClick={() => setAiMode(true)} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#36503F] px-5 text-sm font-semibold text-[#FEF8C5] hover:bg-[#1F2E26] whitespace-nowrap">
                  <Sparkles className="h-4 w-4" /> Flash AI
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="flex h-12 flex-1 items-center gap-3 rounded-lg border border-[#36503F] bg-white px-4">
                  <Sparkles className="h-4 w-4 text-[#36503F]" />
                  <input
                    value={aiQuery}
                    onChange={(event) => setAiQuery(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && aiQuery.trim() && navigate(`/start-chatting?q=${encodeURIComponent(aiQuery.trim())}`)}
                    placeholder="Ask about spaces, plans, GST..."
                    className="w-full bg-transparent text-sm outline-none border-none focus:ring-0 focus:outline-none placeholder:text-[#6B8F78]"
                    autoFocus
                  />
                </label>
                <button onClick={() => { setAiMode(false); setAiQuery(""); }} className="h-12 rounded-full bg-[#36503F] px-4 text-sm font-semibold text-[#FEF8C5] hover:bg-[#1F2E26] whitespace-nowrap">
                  Cancel
                </button>
                <button onClick={() => aiQuery.trim() && navigate(`/start-chatting?q=${encodeURIComponent(aiQuery.trim())}`)} className="fs-secondary-btn h-12 px-5 py-0 whitespace-nowrap">
                  Ask
                </button>
              </div>
            )}
          </div>
          
          {/* Quick Links */}
          <div className="mt-4 flex flex-wrap justify-center lg:justify-start gap-2 max-w-lg mx-auto lg:mx-0">
            {activeTab === "virtual-office" || activeTab === "coworking-space" ? (
              <>
                {visibleCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => navigateToCity(city)}
                    className="rounded-full border border-[#D4E0D0] bg-white px-3 py-1.5 text-[11px] font-medium text-[#6B8F78] hover:border-[#36503F] hover:text-[#36503F] transition-colors"
                  >
                    {city}
                  </button>
                ))}
                {allCitiesList.length > 15 && (
                  <button
                    onClick={() => setShowAllCities(!showAllCities)}
                    className="rounded-full bg-[#F0F4EE] px-3 py-1.5 text-[11px] font-bold text-[#36503F] hover:bg-[#D4E0D0] transition-colors"
                  >
                    {showAllCities ? "View less" : `+ ${allCitiesList.length - 15} more`}
                  </button>
                )}
              </>
            ) : (
              <>
                {["GST Registration", "Company Incorporation", "MSME", "Startup India Registration", "GST filing", "LLP compliance", "MCA Compliance"].map((service) => (
                  <button
                    key={service}
                    onClick={() => navigate("/services/business-setup")}
                    className="rounded-full border border-[#D4E0D0] bg-white px-3 py-1.5 text-[11px] font-medium text-[#6B8F78] hover:border-[#36503F] hover:text-[#36503F] transition-colors"
                  >
                    {service}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="aspect-[3/2] overflow-hidden rounded-[20px] border border-[#D4E0D0] bg-[#FAFAF7]">
            <img src={heroImage} alt="Modern FlashSpace workspace" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};
