import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";

const heroImage = "https://res.cloudinary.com/davqpypmw/image/upload/v1780035710/flashspace_homepage/qm9lp632cwyizdnsd95t.png";
const popularCities = ["Ahmedabad", "Bangalore", "Chennai", "Delhi", "Gurgaon", "Hyderabad", "Mumbai", "Noida", "Pune"];
const otherCities = ["Agra", "Chandigarh", "Jaipur", "Kochi", "Kolkata"];

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
  const visibleCities = showAllCities ? allCitiesList : allCitiesList.slice(0, 11);

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
    <section className="relative bg-[#FAFAF7] md:bg-white overflow-hidden">
      
      {/* Mobile Top Section with Background Image */}
      <div className="lg:hidden relative bg-[#1F2E26] pt-[100px] pb-10 px-4" style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-[#1F2E26]/75"></div>
        <div className="relative z-10 text-center mx-auto max-w-[800px] w-full">
          <h1 className="text-[38px] md:text-[48px] font-extrabold leading-[1.1] md:leading-[1.15] tracking-[-0.03em] text-white sm:text-5xl">
           India's Smartest <br /><span className="text-[#FEF8C5]">Business Solutions Platform.</span>
          </h1>
          <p className="mt-4 mx-auto md:mt-6 max-w-[600px] text-[15px] md:text-lg font-normal leading-[1.6] md:leading-[1.7] text-white/90">
           All your workspace needs, GST registration, and compliance support, across 20+ states.
          </p>
        </div>
      </div>

      <div className="fs-container relative z-10 grid items-center gap-8 md:gap-12 pb-12 pt-6 lg:grid-cols-[0.92fr_1.08fr] lg:pb-12 lg:pt-16">
        
        {/* Text Content */}
        <div className="mx-auto max-w-[800px] lg:max-w-[680px] w-full text-center lg:mx-0 lg:text-left">
          
          {/* Desktop H1 & P (Hidden on Mobile) */}
          <div className="hidden lg:block">
            <h1 className="mt-2 md:mt-6 text-[40px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#1A1A1A] lg:text-[56px]">
             India's Smartest <br /><span className="text-[#36503F]">Business Solutions Platform.</span>
            </h1>
            <p className="mt-5 max-w-[480px] text-base font-normal leading-[1.7] text-[#6B8F78] mx-0">
             All your workspace needs, GST registration, and compliance support, across 20+ states.
            </p>
          </div>

          {/* Search Container */}
          <div className="mt-0 lg:mt-8 rounded-xl border border-[#D4E0D0] bg-white lg:bg-[#FAFAF7] p-2 shadow-lg lg:shadow-[0_4px_24px_rgba(54,80,63,0.08)] max-w-3xl lg:max-w-lg mx-auto lg:mx-0 text-left relative z-20">
            {/* Tabs */}
            <div className="flex p-0.5 md:p-1 bg-[#F0F4EE] rounded-lg mb-2">
              <button
                onClick={() => setActiveTab("virtual-office")}
                className={`flex-1 py-1.5 px-1 md:py-2 md:px-3 text-[11px] sm:text-xs md:text-sm font-semibold rounded-md transition-colors ${activeTab === "virtual-office" ? "bg-[#36503F] text-white shadow-sm" : "text-[#6B8F78] hover:text-[#1A1A1A]"}`}
              >
                Virtual Office
              </button>
              <button
                onClick={() => setActiveTab("coworking-space")}
                className={`flex-1 py-1.5 px-1 md:py-2 md:px-3 text-[11px] sm:text-xs md:text-sm font-semibold rounded-md transition-colors ${activeTab === "coworking-space" ? "bg-[#36503F] text-white shadow-sm" : "text-[#6B8F78] hover:text-[#1A1A1A]"}`}
              >
                Coworking Space
              </button>
              <button
                onClick={() => setActiveTab("business-setup")}
                className={`flex-1 py-1.5 px-1 md:py-2 md:px-3 text-[11px] sm:text-xs md:text-sm font-semibold rounded-md transition-colors ${activeTab === "business-setup" ? "bg-[#36503F] text-white shadow-sm" : "text-[#6B8F78] hover:text-[#1A1A1A]"}`}
              >
                Business Setup
              </button>
            </div>

            {/* Search Bar */}
            {!aiMode ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <label className="flex h-10 md:h-12 items-center gap-2 md:gap-3 rounded-lg border border-[#D4E0D0] bg-white px-3 md:px-4">
                    <Search className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#6B8F78]" />
                    <input
                      value={locationSearch}
                      onChange={(event) => {
                        setLocationSearch(event.target.value);
                        setShowLocationDropdown(Boolean(event.target.value));
                      }}
                      onKeyDown={(event) => event.key === "Enter" && submitSearch()}
                      placeholder={isBusinessSetup ? "Search services..." : "Search city..."}
                      className="w-full bg-transparent text-xs md:text-sm text-[#1A1A1A] outline-none border-none focus:ring-0 focus:outline-none placeholder:text-[#6B8F78]"
                    />
                  </label>
                  {showLocationDropdown && locationSearch && matches.length > 0 && (
                    <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-64 overflow-auto rounded-lg border border-[#D4E0D0] bg-white py-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                      {matches.slice(0, 8).map((option) => (
                        <button
                          key={option}
                          onClick={() => navigateToOption(option)}
                          className="block w-full px-4 py-2 text-left text-xs md:text-sm text-[#1A1A1A] hover:bg-[#F0F4EE]"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={submitSearch} className="fs-secondary-btn flex-1 sm:flex-none h-10 md:h-12 px-4 md:px-6 py-0 whitespace-nowrap text-xs md:text-sm">
                    Search
                  </button>
                  <button onClick={() => setAiMode(true)} className="inline-flex flex-1 sm:flex-none h-10 md:h-12 items-center justify-center gap-1.5 md:gap-2 rounded-full bg-[#36503F] px-4 md:px-5 text-xs md:text-sm font-semibold text-[#FEF8C5] hover:bg-[#1F2E26] whitespace-nowrap">
                    <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" /> Flash AI
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="flex h-10 md:h-12 flex-1 items-center gap-2 md:gap-3 rounded-lg border border-[#36503F] bg-white px-3 md:px-4">
                  <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 text-[#36503F]" />
                  <input
                    value={aiQuery}
                    onChange={(event) => setAiQuery(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && aiQuery.trim() && navigate(`/start-chatting?q=${encodeURIComponent(aiQuery.trim())}`)}
                    placeholder="Ask about spaces, plans, GST..."
                    className="w-full bg-transparent text-xs md:text-sm outline-none border-none focus:ring-0 focus:outline-none placeholder:text-[#6B8F78]"
                    autoFocus
                  />
                </label>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={() => { setAiMode(false); setAiQuery(""); }} className="h-10 md:h-12 flex-1 sm:flex-none rounded-full bg-[#36503F] px-4 text-xs md:text-sm font-semibold text-[#FEF8C5] hover:bg-[#1F2E26] whitespace-nowrap">
                    Cancel
                  </button>
                  <button onClick={() => aiQuery.trim() && navigate(`/start-chatting?q=${encodeURIComponent(aiQuery.trim())}`)} className="fs-secondary-btn flex-1 sm:flex-none h-10 md:h-12 px-4 md:px-5 py-0 whitespace-nowrap text-xs md:text-sm">
                    Ask
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Quick Links */}
          <div className="mt-4 md:mt-6 lg:mt-4 flex flex-wrap justify-center lg:justify-start gap-1.5 md:gap-2 max-w-3xl lg:max-w-lg mx-auto lg:mx-0">
            {activeTab === "virtual-office" || activeTab === "coworking-space" ? (
              <>
                {visibleCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => navigateToOption(city)}
                    className="rounded-full border border-[#D4E0D0] bg-white px-2.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-[11px] font-medium text-[#6B8F78] hover:border-[#36503F] hover:text-[#36503F] transition-colors"
                  >
                    {city}
                  </button>
                ))}
                {allCitiesList.length > 11 && (
                  <button
                    onClick={() => setShowAllCities(!showAllCities)}
                    className="rounded-full bg-[#F0F4EE] px-2.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-[11px] font-bold text-[#36503F] hover:bg-[#D4E0D0] transition-colors"
                  >
                    {showAllCities ? "View less" : `+ ${allCitiesList.length - 11} more`}
                  </button>
                )}
              </>
            ) : (
              <>
                {["GST Registration", "Company Incorporation", "MSME", "Startup India Registration", "GST filing", "LLP compliance", "MCA Compliance"].map((service) => (
                  <button
                    key={service}
                    onClick={() => navigate("/services/business-setup")}
                    className="rounded-full border border-[#D4E0D0] bg-white px-2.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-[11px] font-medium text-[#6B8F78] hover:border-[#36503F] hover:text-[#36503F] transition-colors"
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
