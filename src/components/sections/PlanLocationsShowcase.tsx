import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Loader2, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ListingCardModern from "@/components/services/ListingCardModern";
import { getAllVirtualOffices } from "@/services/virtualOffice.service";
import { getAllCoworkingSpaces } from "@/services/coworkingSpace.service";
import { VirtualOfficeItem } from "@/types/services";

// Using local high-quality assets from the public folder
const spaceHsr = "/card-koramangala.jpg";
const spaceNariman = "/card-lower-parel.jpg";
const spaceConnaught = "/card-connaught-place.jpg";
const spaceAnna = "/card-andheri.avif";
const locationBkc = "/card-bkc.jpg";
const locationCp = "/card-nehru-place.jpg";
const featureBusinessSetup = "/feature-business-setup.jpg";
const featureVirtualOffice = "/feature-virtual-offices.jpg";
const featureGlobalAccess = "/feature-global-access.jpg";
const featureCoworking = "/feature-coworking.jpg";
const locationMg = "/card-gurgaon.jpg";
const locationCyber = "/card-hinjewadi.jpg";

const services = [
    { id: "virtual-office", name: "Virtual Office" },
    { id: "coworking", name: "Coworking" },
    { id: "business-setup", name: "Business Setup" },
];

/**
 * Custom Card for Business Setup
 */
const BusinessSetupHomeCard = ({ item, onClick }: { item: any; onClick: () => void }) => {
    return (
        <div
            className="group bg-card rounded-[20px] overflow-hidden border border-border hover:-translate-y-1.5 transition-all duration-200 ease-out shadow-sm hover:shadow-md h-full flex flex-col"
            onClick={onClick}
        >
            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {item.name === "GST Registration" && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="bg-[#FE8A00] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-tight">
                            <span className="animate-pulse">🔥</span> Popular
                        </span>
                    </div>
                )}
            </div>
            
            <div className="p-4 flex flex-col flex-1">
                <h4 className="text-base font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1 mb-2">
                    {item.name}
                </h4>
                
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.features?.map((feature: string, idx: number) => (
                        <span
                            key={idx}
                            className="text-[11px] text-muted-foreground border border-border rounded-full px-2.5 py-0.5"
                        >
                            {feature}
                        </span>
                    ))}
                </div>
                
                <div className="space-y-2 mb-4 mt-auto">
                    <p className="text-sm text-muted-foreground">
                        Starting from <span className="font-bold text-foreground">{item.price}</span>
                    </p>
                </div>
                
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                        className="flex-[1.4] bg-[#36503F] text-[#FEF8C5] text-sm font-bold py-2.5 px-4 rounded-full hover:bg-[#1F2E26] transition-all active:scale-[0.98]"
                    >
                        Get Best Price
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            window.dispatchEvent(new CustomEvent('open-contact-modal'));
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 border border-[#36503F] bg-[#36503F] text-[#FEF8C5] text-sm font-semibold py-2.5 px-2 rounded-full hover:bg-[#1F2E26] transition-all active:scale-[0.98]"
                    >
                        <Phone className="w-4 h-4" />
                        Contact Sales
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Curated list of popular spaces to ensure they always show up correctly.
 */
const POPULAR_SPACE_IDS = ["FSDL01", "FSBLR05", "FSGUR03", "FSNOD04", "FSHYD01", "FSTHA01"];



export const PlanLocationsShowcase = () => {
    const [activeServiceId, setActiveServiceId] = useState("virtual-office");
    const [slideIndex, setSlideIndex] = useState(0);
    const [dynamicVirtualOffices, setDynamicVirtualOffices] = useState<any[]>([]);
    const [dynamicCoworking, setDynamicCoworking] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">("desktop");
    const navigate = useNavigate();

    const demoBusinessSetups = useMemo(() => {
        return [
            "GST Registration",
            "Company Registration",
            "FSSAI Registration",
            "Startup India Registration",
            "MSME Registration",
        ].map((name, i) => {
            let imgPath = `/home${i+1}.jpg`;
            if (name === "FSSAI Registration") { imgPath = "/business1.png"; }
            else if (name === "Startup India Registration") { imgPath = "/business2.png"; }
            else if (name.includes("Company Registration")) { imgPath = "/business3.png"; }
            else if (name.includes("MSME")) { imgPath = "/business4.png"; }
            else if (name === "GST Registration") { imgPath = "/business5.png"; }
            
            return {
                _id: `bs-${i}`,
                name,
                address: "",
                area: "Online",
                price: ["₹2499/yr", "₹11999/yr", "₹2999/yr", "₹1499/yr", "₹1499/yr"][i],
                rating: 4.8 + (i % 3) * 0.1,
                reviews: 120 + i * 15,
                images: [imgPath],
                features: ["Expert Support", "Fast Processing", "End-to-end Setup"],
                popular: name === "GST Registration",
                availability: "Available Now"
            };
        });
    }, []);

    // Responsive items per page matching grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
    useEffect(() => {
        const updateSize = () => {
            if (window.innerWidth < 640) setScreenSize("mobile");
            else if (window.innerWidth < 1024) setScreenSize("tablet");
            else setScreenSize("desktop");
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    const cardsPerPage = screenSize === "mobile" ? 1 : (screenSize === "tablet" ? 2 : 3);
    const isMobileView = screenSize === "mobile";
    const isSmallScreen = screenSize !== "desktop";

    const handleGetBestPrice = (item: any, isDynamic: boolean) => {
        if (activeServiceId === "business-setup") {
            navigate(`/services/business-setup?buy=${item._id}`);
        } else if (isDynamic) {
            if (activeServiceId === "coworking") {
                navigate(`/coworking-space/${item._id}`);
            } else {
                navigate(`/space/${item._id}`);
            }
        } else {
            navigate(`/Solutions/virtual-office`);
        }
    };

    useEffect(() => {
        const fetchSpaces = async () => {
            setIsLoading(true);
            try {
                const [voResponse, cwResponse] = await Promise.allSettled([
                    getAllVirtualOffices(100),
                    getAllCoworkingSpaces(100)
                ]);

                let voFiltered = [];
                let cwFiltered = [];

                if (voResponse.status === "fulfilled") {
                    const spaces = voResponse.value.offices;
                    voFiltered = POPULAR_SPACE_IDS
                        .map(id => spaces.find((s: any) => s.spaceId === id))
                        .filter(Boolean);
                }

                if (cwResponse.status === "fulfilled") {
                    const spaces = cwResponse.value;
                    cwFiltered = POPULAR_SPACE_IDS
                        .map(id => spaces.find((s: any) => s.spaceId === id))
                        .filter(Boolean);
                }

                setDynamicVirtualOffices(voFiltered);
                setDynamicCoworking(cwFiltered);
            } catch (error) {
                console.error("Error fetching spaces for showcase:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSpaces();
    }, []);

    const allCards = activeServiceId === "coworking" 
        ? dynamicCoworking 
        : activeServiceId === "business-setup"
        ? demoBusinessSetups
        : dynamicVirtualOffices;
    const totalPages = Math.ceil(allCards.length / cardsPerPage);
    const visibleCards = allCards.slice(slideIndex * cardsPerPage, (slideIndex + 1) * cardsPerPage);

    const canPrev = slideIndex > 0;
    const canNext = slideIndex < totalPages - 1;

    return (
        <section className="py-12 sm:py-16 lg:py-24 bg-white overflow-hidden">
            <div className="fs-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-8 sm:mb-12 text-center"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold tracking-[-0.02em] text-[#1A1A1A] mb-3 px-2">
                        Everything Your Business Needs, Pan India
                    </h2>
                    <p className="text-[#6B8F78] text-sm sm:text-base max-w-lg mx-auto px-4">
                        Flexible workspace and business solutions tailored to your needs.
                    </p>
                </motion.div>

                {/* Tabs */}
                <div className="flex justify-center mb-8 sm:mb-12">
                    <div className="inline-flex bg-gray-100/80 p-1.5 rounded-2xl">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => {
                                    setActiveServiceId(service.id);
                                    setSlideIndex(0);
                                }}
                                className={`px-5 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all ${
                                    activeServiceId === service.id
                                        ? "bg-white text-[#1A1A1A] shadow-sm"
                                        : "text-gray-500 hover:text-gray-900"
                                }`}
                            >
                                {service.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cards Container */}
                <div className="relative group">
                    {/* Left Arrow */}
                    <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 -left-8 xl:-left-16 z-10">
                        <button
                            onClick={() => setSlideIndex((p) => Math.max(0, p - 1))}
                            disabled={!canPrev}
                            className="w-10 h-10 rounded-full border border-[#36503F] bg-[#36503F] flex items-center justify-center text-[#FEF8C5] hover:bg-[#1F2E26] shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5 pr-0.5" />
                        </button>
                    </div>

                    {/* Right Arrow */}
                    <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 -right-8 xl:-right-16 z-10">
                        <button
                            onClick={() => setSlideIndex((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={!canNext}
                            className="w-10 h-10 rounded-full border border-[#36503F] bg-[#36503F] flex items-center justify-center text-[#FEF8C5] hover:bg-[#1F2E26] shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5 pl-0.5" />
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${activeServiceId}-${slideIndex}-${screenSize}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            drag={isSmallScreen ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(_, { offset }) => {
                                const swipe = offset.x;
                                if (swipe < -50 && canNext) {
                                    setSlideIndex(p => p + 1);
                                } else if (swipe > 50 && canPrev) {
                                    setSlideIndex(p => p - 1);
                                }
                            }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 touch-pan-y"
                        >
                            {isLoading ? (
                                <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground">
                                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                                    <p>Loading premium workspaces...</p>
                                </div>
                            ) : (
                                visibleCards.map((loc, i) => (
                                    <motion.div
                                        key={(loc as any)._id || loc.spaceId || i}
                                        initial={{ opacity: 0, y: 24 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.08, duration: 0.5 }}
                                    >
                                        {activeServiceId === "business-setup" ? (
                                            <BusinessSetupHomeCard
                                                item={loc as any}
                                                onClick={() => handleGetBestPrice(loc, true)}
                                            />
                                        ) : (
                                            <ListingCardModern
                                                item={loc as any}
                                                onGetBestPrice={() => handleGetBestPrice(loc, true)}
                                                onClick={() => handleGetBestPrice(loc, true)}
                                            />
                                        )}
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Dots for Mobile/Tablet */}
                    {isSmallScreen && totalPages > 1 && (
                        <div className="flex justify-center gap-1.5 mt-8">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSlideIndex(i)}
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                        i === slideIndex ? "bg-[#36503F] w-4" : "bg-[#36503F]/30"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
