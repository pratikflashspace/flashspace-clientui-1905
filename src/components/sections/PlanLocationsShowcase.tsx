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

const CARDS_PER_PAGE = 3;

export const PlanLocationsShowcase = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [slideIndex, setSlideIndex] = useState(0);
    const [dynamicSpaces, setDynamicSpaces] = useState<CoworkingSpaceItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleGetBestPrice = (item: any, isDynamic: boolean) => {
        if (isDynamic) {
            // Navigate to the coworking space detail page
            navigate(`/coworking-space/${item._id}`);
        } else {
            // For static registrations, take to the virtual office solutions page
            navigate(`/Solutions/virtual-office`);
        }
    };

    useEffect(() => {
        const fetchSpaces = async () => {
            setIsLoading(true);
            try {
                // Fetch with a high limit to ensure we get our curated selection
                const spaces = await getAllCoworkingSpaces(100);
                
                // Filter by the specific IDs provided by the user and maintain that exact order
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

    // Use dynamic spaces for "Popular Spaces" tab
    const getCards = () => {
        return dynamicSpaces;
    };

    const allCards = getCards();
    const totalPages = Math.ceil(allCards.length / CARDS_PER_PAGE);
    const visibleCards = allCards.slice(slideIndex * CARDS_PER_PAGE, (slideIndex + 1) * CARDS_PER_PAGE);

    const canPrev = slideIndex > 0;
    const canNext = slideIndex < totalPages - 1;

    return (
        <section className="py-16 sm:py-20 lg:py-[100px] bg-muted/30 overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-8 sm:mb-12 text-center"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-3 px-2">
                        Everything Your Business Needs, Pan India
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto px-4">
                        Flexible workspace and business solutions tailored to your needs.
                    </p>
                </motion.div>

                {/* Tabs + Slider arrows */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-10 gap-6">
                    <div className="hidden lg:block w-32" />
                    <div className="bg-[#F4F4F2] rounded-xl sm:rounded-[14px] px-4 sm:px-6 py-3 sm:py-4 inline-block max-w-full overflow-x-auto">
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
                                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
                                                transition={{ duration: 0.25, ease: "easeOut" }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-border/50" />
                        </div>
                    </div>

                    {/* Arrow buttons */}
                    <div className="hidden sm:flex gap-2">
                        <button
                            onClick={() => setSlideIndex((p) => Math.max(0, p - 1))}
                            disabled={!canPrev}
                            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setSlideIndex((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={!canNext}
                            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Cards */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${active.name}-${slideIndex}`}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
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
            </div>
        </section>
    );
};
