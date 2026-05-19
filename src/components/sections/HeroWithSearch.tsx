import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Search, Sparkles } from "lucide-react";

const heroIllustrated = "/hero-illustrated.jpg";
const popularCities = ["Ahmedabad", "Bangalore", "Chennai", "Delhi", "Gurgaon", "Hyderabad", "Mumbai", "Noida", "Pune"];
const otherCities = ["Agra", "Aluva", "Ambala", "Amritsar", "Bhopal", "Chandigarh", "Coimbatore", "Faridabad", "Ghaziabad", "Indore", "Jaipur", "Kochi", "Kolkata", "Lucknow", "Nagpur", "Rajkot", "Surat", "Vadodara", "Vijayawada", "Visakhapatnam"];

export const HeroWithSearch = () => {
  const navigate = useNavigate();
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiQuery, setAiQuery] = useState("");

  const navigateToCity = (city: string) => {
    setLocationSearch("");
    setShowLocationDropdown(false);
    navigate(`/services/virtual-office?city=${encodeURIComponent(city)}`);
  };

  const submitSearch = () => {
    const allCities = [...popularCities, ...otherCities];
    const match = allCities.find((city) => city.toLowerCase().includes(locationSearch.toLowerCase()));
    navigateToCity(match || "Delhi");
  };

  const matches = [...popularCities, ...otherCities].filter((city) =>
    city.toLowerCase().includes(locationSearch.toLowerCase())
  );

  return (
    <section className="bg-white pt-14 md:pt-16">
      <div className="fs-container grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2 lg:pb-24 lg:pt-32">
        <div className="mx-auto max-w-[680px] text-center lg:mx-0 lg:text-left">
          <span className="fs-tag">Business workspace platform</span>
          <h1 className="mt-6 text-[40px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#1A1A1A] sm:text-5xl lg:text-[56px]">
            Workspaces and business addresses that move at <span className="text-[#36503F]">startup speed</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[480px] text-base font-normal leading-[1.7] text-[#6B8F78] lg:mx-0">
            Choose virtual offices, coworking seats, compliant business addresses, and on-demand meeting rooms across India.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <button onClick={() => navigate("/services/virtual-office")} className="fs-primary-btn w-full sm:w-auto">
              Explore spaces <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => navigate("/start-chatting")} className="fs-secondary-btn w-full sm:w-auto">
              Ask Flash AI
            </button>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-medium text-[#6B8F78] sm:gap-6 lg:justify-start">
            {["GST-ready addresses", "Real Indian support", "68+ cities"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-[#36503F]" /> {item}
              </span>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-[#D4E0D0] bg-[#FAFAF7] p-2 shadow-[0_4px_24px_rgba(54,80,63,0.08)]">
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
                      placeholder="Search city or workspace"
                      className="w-full bg-transparent text-sm text-[#1A1A1A] outline-none placeholder:text-[#6B8F78]"
                    />
                  </label>
                  {showLocationDropdown && locationSearch && matches.length > 0 && (
                    <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-64 overflow-auto rounded-lg border border-[#D4E0D0] bg-white py-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                      {matches.slice(0, 8).map((city) => (
                        <button
                          key={city}
                          onClick={() => navigateToCity(city)}
                          className="block w-full px-4 py-2 text-left text-sm text-[#1A1A1A] hover:bg-[#F0F4EE]"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={submitSearch} className="fs-secondary-btn h-12 px-5 py-0">
                  Search
                </button>
                <button onClick={() => setAiMode(true)} className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-[#36503F] hover:underline">
                  <Sparkles className="h-4 w-4" /> AI help
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
                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#6B8F78]"
                    autoFocus
                  />
                </label>
                <button onClick={() => { setAiMode(false); setAiQuery(""); }} className="h-12 px-4 text-sm font-semibold text-[#6B8F78] hover:text-[#1A1A1A]">
                  Cancel
                </button>
                <button onClick={() => aiQuery.trim() && navigate(`/start-chatting?q=${encodeURIComponent(aiQuery.trim())}`)} className="fs-secondary-btn h-12 px-5 py-0">
                  Ask
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="aspect-[5/4] overflow-hidden rounded-[20px] border border-[#D4E0D0] bg-[#FAFAF7]">
            <img src={heroIllustrated} alt="Modern FlashSpace workspace" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};
