import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Sparkles, FileText, CalendarRange, Monitor, Users, Building2, Landmark } from "lucide-react";

// Using the local illustrated hero image from the public folder
const heroIllustrated = "/hero-illustrated.jpg";

const popularCities = ["Ahmedabad", "Bangalore", "Chennai", "Delhi", "Gurgaon", "Hyderabad", "Mumbai", "Noida", "Pune"];
const otherCities = ["Agra", "Aluva", "Ambala", "Ambarnath", "Amritsar", "Anand", "Bareja", "Bhagalpur", "Bhilai", "Bhopal", "Bhubaneswar", "Chandigarh", "Chhatrapati Sambhajinagar", "Coimbatore", "Dehradun", "Dhanbad", "Dharamsala", "Dimapur", "Faridabad", "Gandhinagar", "Gangtok", "Ghaziabad", "Goa", "Guntur", "Guwahati", "Gwalior", "Haridwar", "Hubballi-Dharwad", "Imphal", "Indore", "Jabalpur", "Jaipur", "Jalandhar", "Jammu", "Jamshedpur", "Jodhpur", "Junagadh", "Kakinada", "Kannur", "Kanpur", "Karunagappalli", "Kochi", "Kolkata", "Kollam", "Korba", "Kottakkal", "Kozhikode", "Kullu", "Kurnool", "Latur", "Lucknow", "Ludhiana", "Mandi", "Meerut", "Mohali", "Mysore", "Nagpur", "Nandyal", "Nashik", "Patna", "Proddatur", "Raipur", "Rajamahendravaram", "Rajkot", "Ranchi", "Rohtak", "Shillong", "Shivamogga", "Silliguri", "Silvassa", "Surat", "Taliparamba", "Thrissur", "Tirupati", "Trichy", "Trivandrum", "Udaipur", "Ujjain", "Vadodara", "Vapi", "Vellore", "Vijayawada", "Visakhapatnam", "Zirakpur"];

const mainTabs = [
    { label: "Virtual Office", icon: Monitor },
    { label: "Long-term Leasing", icon: FileText },
];

const subTabsMap: Record<string, { label: string; icon: any; description: string }[]> = {
    "Long-term Leasing": [
        { label: "Coworking Space", icon: Users, description: "Rent dedicated seats and private cabins in fully-equipped coworking spaces" },
        { label: "Managed Office", icon: Building2, description: "Fully managed, customizable office spaces for growing teams" },
        { label: "Office/Commercial", icon: Landmark, description: "Traditional office and commercial spaces for established businesses" },
    ],
    "Virtual Office": [
        { label: "Business Address", icon: Building2, description: "Get a premium business address for GST and company registration" },
        { label: "GST Registration", icon: FileText, description: "Complete GST registration with a virtual office address" },
    ],
};

export const HeroWithSearch = () => {
    const [activeTab, setActiveTab] = useState("Virtual Office");
    const [activeSubTab, setActiveSubTab] = useState(0);
    const navigate = useNavigate();
    const [selectedCity, setSelectedCity] = useState("Delhi");
    const [citySearch, setCitySearch] = useState("");
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [locationSearch, setLocationSearch] = useState("");
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [aiMode, setAiMode] = useState(false);
    const [aiQuery, setAiQuery] = useState("");
    const aiInputRef = useRef<HTMLInputElement>(null);
    const cityRef = useRef<HTMLDivElement>(null);
    const locationRef = useRef<HTMLDivElement>(null);
    const currentSubTabs = subTabsMap[activeTab] || [];
    const currentDescription = currentSubTabs[activeSubTab]?.description || "";

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
                setShowCityDropdown(false);
            }
            if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
                setShowLocationDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <section className="relative min-h-[75vh] sm:min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <img
                    src={heroIllustrated}
                    alt="Modern coworking space"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/50 to-background/40" />
                <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-36 pb-24 sm:pb-32 lg:pb-40">
                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl xs:text-4xl sm:text-5xl lg:text-5xl font-bold text-foreground tracking-tight leading-[1.2] sm:leading-[1.15] mb-4"
                >
                    World's #1 AI Enabled
                    <br />
                    <span className="text-primary italic">Business Solutions Platform.</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 px-2"
                >
                    Choose between office space, pay-per-use plans or fixed desks for large enterprises and individuals
                </motion.p>

                {/* Search Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-4xl w-full mx-auto bg-card/95 backdrop-blur-xl rounded-2xl shadow-xl border border-border/30"
                >
                    {/* Main Tabs */}
                    <div className="flex justify-center border-b border-border/30">
                        {mainTabs.map((tab) => (
                            <button
                                key={tab.label}
                                onClick={() => { setActiveTab(tab.label); setActiveSubTab(0); }}
                                className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium transition-colors relative ${activeTab === tab.label
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {activeTab === tab.label && (
                                    <motion.div
                                        layoutId="heroActiveTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Sub Tabs */}
                    <div className="flex justify-center gap-2 pt-5 pb-3 px-4 sm:px-6 flex-wrap">
                        {currentSubTabs.map((sub, i) => (
                            <button
                                key={sub.label}
                                onClick={() => setActiveSubTab(i)}
                                className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-sm font-medium border transition-colors ${activeSubTab === i
                                    ? "border-primary/30 bg-primary/5 text-foreground"
                                    : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/20"
                                    }`}
                            >
                                <sub.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                {sub.label}
                            </button>
                        ))}
                    </div>

                    {/* Description */}
                    <p className="text-[11px] sm:text-sm text-muted-foreground px-6 pb-4">{currentDescription}</p>

                    {/* Search Bar */}
                    <div className="px-6 pb-6">
                        <AnimatePresence mode="wait">
                            {!aiMode ? (
                                <motion.div
                                    key="search-bar"
                                    initial={false}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -40 }}
                                    transition={{ duration: 0.25 }}
                                    className="flex flex-col sm:flex-row sm:items-center bg-background rounded-xl sm:rounded-2xl border border-border overflow-hidden sm:overflow-visible relative p-1 sm:p-0"
                                >
                                    {/* City selector */}
                                    {/* <div ref={cityRef} className="relative shrink-0"> */}
                                        {/* <button
                                            onClick={() => { setShowCityDropdown(!showCityDropdown); setCitySearch(""); }}
                                            className="flex items-center gap-1 px-5 py-3.5 border-r border-border text-sm"
                                        >
                                            <span className="font-medium text-foreground">{selectedCity}</span>
                                            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${showCityDropdown ? "rotate-180" : ""}`} />
                                        </button> */}

                                        {/* <AnimatePresence>
                                            {showCityDropdown && (() => {
                                                const q = citySearch.toLowerCase();
                                                const filteredPopular = popularCities.filter(c => c.toLowerCase().includes(q));
                                                const filteredOther = otherCities.filter(c => c.toLowerCase().includes(q));
                                                return (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 4 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto"
                                                    >
                                                        <div className="sticky top-0 bg-card p-2 border-b border-border/50">
                                                            <input
                                                                type="text"
                                                                value={citySearch}
                                                                onChange={(e) => setCitySearch(e.target.value)}
                                                                placeholder="Search city..."
                                                                className="w-full px-3 py-2 text-sm bg-muted/50 rounded-lg outline-none placeholder:text-muted-foreground/50"
                                                                autoFocus
                                                            />
                                                        </div>
                                                        {filteredPopular.length > 0 && (
                                                            <>
                                                                <div className="px-4 pt-2.5 pb-1 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Popular Cities</div>
                                                                {filteredPopular.map(city => (
                                                                    <button
                                                                        key={city}
                                                                        onClick={() => { setSelectedCity(city); setShowCityDropdown(false); }}
                                                                        className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-muted/60 ${city === selectedCity ? "text-primary font-medium" : "text-foreground"}`}
                                                                    >
                                                                        {city}
                                                                    </button>
                                                                ))}
                                                            </>
                                                        )}
                                                        {filteredOther.length > 0 && (
                                                            <>
                                                                <div className="px-4 pt-2.5 pb-1 text-[10px] uppercase tracking-widest text-muted-foreground font-medium border-t border-border/50">All Cities</div>
                                                                {filteredOther.map(city => (
                                                                    <button
                                                                        key={city}
                                                                        onClick={() => { setSelectedCity(city); setShowCityDropdown(false); }}
                                                                        className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-muted/60 ${city === selectedCity ? "text-primary font-medium" : "text-foreground"}`}
                                                                    >
                                                                        {city}
                                                                    </button>
                                                                ))}
                                                            </>
                                                        )}
                                                        {filteredPopular.length === 0 && filteredOther.length === 0 && (
                                                            <div className="px-4 py-6 text-center text-sm text-muted-foreground">No cities found</div>
                                                        )}
                                                    </motion.div>
                                                );
                                            })()}
                                        </AnimatePresence> */}
                                    {/* </div> */}

                                    {/* Search input with city dropdown */}
                                    <div ref={locationRef} className="relative flex items-center flex-1 px-3 sm:px-4 gap-2">
                                        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                                        <input
                                            type="text"
                                            value={locationSearch}
                                            onChange={(e) => { setLocationSearch(e.target.value); setShowLocationDropdown(true); }}
                                            onFocus={() => { if (locationSearch.length > 0) setShowLocationDropdown(true); }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    const q = locationSearch.toLowerCase();
                                                    const allCities = [...popularCities, ...otherCities];
                                                    const match = allCities.find(c => c.toLowerCase().includes(q));
                                                    const cityToUse = match || selectedCity;
                                                    setSelectedCity(cityToUse);
                                                    setLocationSearch("");
                                                    setShowLocationDropdown(false);
                                                    navigate(`/services/virtual-office?city=${encodeURIComponent(cityToUse)}`);
                                                }
                                            }}
                                            placeholder={`Search location or workspaces`}
                                            className="flex-1 bg-transparent text-xs sm:text-sm outline-none placeholder:text-muted-foreground py-3 sm:py-3.5"
                                        />

                                        <AnimatePresence>
                                            {showLocationDropdown && locationSearch.length > 0 && (() => {
                                                const q = locationSearch.toLowerCase();
                                                const matchedPopular = popularCities.filter(c => c.toLowerCase().includes(q));
                                                const matchedOther = otherCities.filter(c => c.toLowerCase().includes(q));
                                                if (matchedPopular.length === 0 && matchedOther.length === 0) return null;
                                                return (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 4 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto"
                                                    >
                                                        {matchedPopular.length > 0 && (
                                                            <>
                                                                <div className="px-4 pt-2.5 pb-1 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Popular Cities</div>
                                                                {matchedPopular.map(city => (
                                                                    <button
                                                                        key={city}
                                                                        onClick={() => {
                                                                            setSelectedCity(city);
                                                                            setLocationSearch("");
                                                                            setShowLocationDropdown(false);
                                                                            navigate(`/services/virtual-office?city=${encodeURIComponent(city)}`);
                                                                        }}
                                                                        className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors"
                                                                    >
                                                                        {city}
                                                                    </button>
                                                                ))}
                                                            </>
                                                        )}
                                                        {matchedOther.length > 0 && (
                                                            <>
                                                                <div className="px-4 pt-2.5 pb-1 text-[10px] uppercase tracking-widest text-muted-foreground font-medium border-t border-border/50">All Cities</div>
                                                                {matchedOther.map(city => (
                                                                    <button
                                                                        key={city}
                                                                        onClick={() => {
                                                                            setSelectedCity(city);
                                                                            setLocationSearch("");
                                                                            setShowLocationDropdown(false);
                                                                            navigate(`/services/virtual-office?city=${encodeURIComponent(city)}`);
                                                                        }}
                                                                        className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors"
                                                                    >
                                                                        {city}
                                                                    </button>
                                                                ))}
                                                            </>
                                                        )}
                                                    </motion.div>
                                                );
                                            })()}
                                        </AnimatePresence>
                                    </div>

                                    {/* Chat with AI */}
                                    <button
                                        onClick={() => {
                                            setAiMode(true);
                                            setTimeout(() => aiInputRef.current?.focus(), 100);
                                        }}
                                        className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium sm:mr-2 hover:bg-primary/90 transition-colors shrink-0"
                                    >
                                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        Chat with AI
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="ai-bar"
                                    initial={{ opacity: 0, x: 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 40 }}
                                    transition={{ duration: 0.25 }}
                                    className="flex flex-col sm:flex-row sm:items-center bg-background rounded-xl sm:rounded-2xl border border-primary/40 overflow-hidden sm:overflow-visible relative shadow-[0_0_12px_-4px_hsl(var(--primary)/0.3)] p-1 sm:p-0"
                                >
                                    <div className="flex items-center gap-2 px-4 border-b sm:border-b-0 sm:border-r border-border shrink-0">
                                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                                        <span className="text-xs sm:text-sm font-medium text-primary py-2.5 sm:py-3.5">AI Assistant</span>
                                    </div>
                                    <input
                                        ref={aiInputRef}
                                        type="text"
                                        value={aiQuery}
                                        onChange={(e) => setAiQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && aiQuery.trim()) {
                                                navigate(`/start-chatting?q=${encodeURIComponent(aiQuery.trim())}`);
                                            }
                                            if (e.key === "Escape") {
                                                setAiMode(false);
                                                setAiQuery("");
                                            }
                                        }}
                                        placeholder="Ask about workspaces, plans..."
                                        className="flex-1 bg-transparent text-xs sm:text-sm outline-none placeholder:text-muted-foreground px-4 py-3 sm:py-3.5"
                                    />
                                    <div className="flex items-center gap-2 sm:mr-2">
                                        <button
                                            onClick={() => { setAiMode(false); setAiQuery(""); }}
                                            className="flex-1 sm:flex-none text-muted-foreground hover:text-foreground text-[11px] sm:text-sm px-3 py-2.5 transition-colors shrink-0"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (aiQuery.trim()) {
                                                    navigate(`/start-chatting?q=${encodeURIComponent(aiQuery.trim())}`);
                                                }
                                            }}
                                            disabled={!aiQuery.trim()}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors shrink-0 disabled:opacity-40"
                                        >
                                            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            Ask AI
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};