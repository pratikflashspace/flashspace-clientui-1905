import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ListingCardModern from "@/components/services/ListingCardModern";
import { getAllCoworkingSpaces } from "@/services/coworkingSpace.service";
import { CoworkingSpaceItem } from "@/types/services";

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
    { name: "Popular Spaces" },
];

/**
 * Curated list of popular spaces to ensure they always show up correctly.
 */
const POPULAR_SPACE_IDS = ["FSDL01", "FSBLR05", "FSGUR03", "FSNOD04", "FSHYD01", "FSTHA01"];



export const PlanLocationsShowcase = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [slideIndex, setSlideIndex] = useState(0);
    const [dynamicSpaces, setDynamicSpaces] = useState<CoworkingSpaceItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">("desktop");
    const navigate = useNavigate();

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
        if (isDynamic) {
            navigate(`/coworking-space/${item._id}`);
        } else {
            navigate(`/Solutions/virtual-office`);
        }
    };

    useEffect(() => {
        const fetchSpaces = async () => {
            setIsLoading(true);
            try {
                const spaces = await getAllCoworkingSpaces(100);
                const filteredSpaces = POPULAR_SPACE_IDS
                    .map(id => spaces.find(s => s.spaceId === id))
                    .filter(Boolean) as CoworkingSpaceItem[];

                setDynamicSpaces(filteredSpaces);
            } catch (error) {
                console.error("Error fetching coworking spaces for showcase:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSpaces();
    }, []);

    const active = services[activeIndex];
    const allCards = dynamicSpaces;
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
                    <span className="fs-tag mb-4">Popular spaces</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold tracking-[-0.02em] text-[#1A1A1A] mb-3 px-2">
                        Everything Your Business Needs, Pan India
                    </h2>
                    <p className="text-[#6B8F78] text-sm sm:text-base max-w-lg mx-auto px-4">
                        Flexible workspace and business solutions tailored to your needs.
                    </p>
                </motion.div>

                {/* Tabs + Slider arrows */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-10 gap-6">
                    <div className="hidden lg:block w-32" />
                    <div className="bg-[#FAFAF7] rounded-xl px-4 sm:px-6 py-3 sm:py-4 inline-block max-w-full overflow-x-auto scrollbar-hide border border-[#D4E0D0]">
                        <div className="relative">
                            <div className="flex gap-6 sm:gap-9 whitespace-nowrap">
                                {services.map((s, i) => (
                                    <button
                                        key={s.name}
                                        onClick={() => { setActiveIndex(i); setSlideIndex(0); }}
                                        className={`relative pb-2 sm:pb-3 text-sm sm:text-[15px] transition-colors duration-250 ease-out cursor-pointer border-none outline-none bg-transparent ${i === activeIndex
                                            ? "font-medium text-foreground"
                                            : "font-normal text-muted-foreground hover:text-foreground/70"
                                            }`}
                                    >
                                        {s.name}
                                        {i === activeIndex && (
                                            <motion.div
                                                layoutId="active-tab-underline"
                                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#36503F] rounded-full"
                                                transition={{ duration: 0.25, ease: "easeOut" }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-border/50" />
                        </div>
                    </div>

                    {/* Arrow buttons - hidden on mobile/tablet as sliding is handled by user */}
                    <div className="hidden lg:flex gap-2">
                        <button
                            onClick={() => setSlideIndex((p) => Math.max(0, p - 1))}
                            disabled={!canPrev}
                            className="w-10 h-10 rounded-full border border-[#36503F] bg-[#36503F] flex items-center justify-center text-[#FEF8C5] hover:bg-[#1F2E26] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setSlideIndex((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={!canNext}
                            className="w-10 h-10 rounded-full border border-[#36503F] bg-[#36503F] flex items-center justify-center text-[#FEF8C5] hover:bg-[#1F2E26] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Cards Container */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${active.name}-${slideIndex}-${screenSize}`}
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
                                        <ListingCardModern
                                            item={loc as any}
                                            onGetBestPrice={() => handleGetBestPrice(loc, true)}
                                            onClick={() => handleGetBestPrice(loc, true)}
                                        />
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
