import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ListingCardModern from "@/components/services/ListingCardModern";
import { getAllVirtualOffices } from "@/services/virtualOffice.service";
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
    { name: "Popular Spaces" },
    { name: "Popular Registrations" },
];

type CardItem = {
    name: string;
    image: string;
    tags: string[];
    rating: number;
    reviews: number;
    startingFrom: string;
    popular?: boolean;
};

const cardsMap: Record<string, CardItem[]> = {
    "Popular Spaces": [
        { name: "HSR Layout, Bangalore", image: spaceHsr, tags: ["Startup Hub", "Cafeteria"], rating: 4.8, reviews: 203, startingFrom: "₹5,500/seat", popular: true },
        { name: "Nariman Point, Mumbai", image: spaceNariman, tags: ["Sea View", "Premium Facilities"], rating: 4.9, reviews: 278, startingFrom: "₹8,000/seat", popular: true },
        { name: "Connaught Place, Delhi", image: spaceConnaught, tags: ["Central Delhi", "Premium Facilities"], rating: 4.7, reviews: 198, startingFrom: "₹6,000/seat" },
        { name: "Anna Nagar, Chennai", image: spaceAnna, tags: ["Metro Access", "24/7 Access"], rating: 4.5, reviews: 134, startingFrom: "₹4,500/seat" },
        { name: "BKC, Mumbai", image: locationBkc, tags: ["Financial Hub", "Premium Address"], rating: 4.8, reviews: 312, startingFrom: "₹9,000/seat", popular: true },
        { name: "Near Connaught Place", image: locationCp, tags: ["High-Speed WiFi", "Meeting Rooms"], rating: 4.9, reviews: 245, startingFrom: "₹6,500/seat" },
    ],
    "Popular Registrations": [
        { name: "Company Incorporation", image: featureBusinessSetup, tags: ["Pvt Ltd", "LLP", "OPC"], rating: 4.9, reviews: 520, startingFrom: "₹4,999", popular: true },
        { name: "GST Registration", image: featureVirtualOffice, tags: ["All States", "Quick Process"], rating: 4.8, reviews: 430, startingFrom: "₹1,499", popular: true },
        { name: "FSSAI License", image: featureGlobalAccess, tags: ["Food Business", "Central & State"], rating: 4.6, reviews: 156, startingFrom: "₹2,999" },
        { name: "Trade License", image: featureCoworking, tags: ["Municipal", "All Cities"], rating: 4.5, reviews: 112, startingFrom: "₹3,499" },
        { name: "MSME Registration", image: locationMg, tags: ["Udyam", "Quick Approval"], rating: 4.7, reviews: 289, startingFrom: "₹999" },
        { name: "Trademark Filing", image: locationCyber, tags: ["Brand Protection", "Pan India"], rating: 4.6, reviews: 198, startingFrom: "₹5,499" },
    ],
};

const CARDS_PER_PAGE = 3;

export const PlanLocationsShowcase = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [slideIndex, setSlideIndex] = useState(0);
    const [dynamicSpaces, setDynamicSpaces] = useState<VirtualOfficeItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleGetBestPrice = (item: any, isDynamic: boolean) => {
        if (isDynamic) {
            // Navigate to the workspace detail page to show images, details & pricing
            navigate(`/space/${item._id}`);
        } else {
            // For static registrations, take to the virtual office solutions page
            navigate(`/Solutions/virtual-office`);
        }
    };

    useEffect(() => {
        const fetchSpaces = async () => {
            setIsLoading(true);
            try {
                const offices = await getAllVirtualOffices();
                // Sort by popular first, then rating
                const sortedOffices = [...offices].sort((a, b) => {
                    if (a.popular && !b.popular) return -1;
                    if (!a.popular && b.popular) return 1;
                    return (b.rating || 0) - (a.rating || 0);
                });
                setDynamicSpaces(sortedOffices.slice(0, 3));
            } catch (error) {
                console.error("Error fetching workspaces for showcase:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSpaces();
    }, []);

    const active = services[activeIndex];

    // Use dynamic spaces for "Popular Spaces" tab, otherwise use static map
    const getCards = () => {
        if (active.name === "Popular Spaces" && dynamicSpaces.length > 0) {
            return dynamicSpaces;
        }
        return cardsMap[active.name] || [];
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
                        {isLoading && active.name === "Popular Spaces" ? (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground">
                                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                                <p>Loading premium workspaces...</p>
                            </div>
                        ) : (
                            visibleCards.map((loc, i) => {
                                // If it's a dynamic VirtualOfficeItem, use ListingCardModern
                                if (active.name === "Popular Spaces" && dynamicSpaces.length > 0) {
                                    return (
                                        <motion.div
                                            key={(loc as VirtualOfficeItem)._id || loc.name}
                                            initial={{ opacity: 0, y: 24 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.08, duration: 0.5 }}
                                        >
                                            <ListingCardModern
                                                item={loc as VirtualOfficeItem}
                                                onGetBestPrice={() => handleGetBestPrice(loc, true)}
                                                onClick={() => handleGetBestPrice(loc, true)}
                                            />
                                        </motion.div>
                                    );
                                }

                                // Fallback for static "Popular Registrations"
                                return (
                                    <motion.div
                                        key={loc.name}
                                        initial={{ opacity: 0, y: 24 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.08, duration: 0.5 }}
                                        className="group bg-card rounded-[20px] overflow-hidden border border-border hover:-translate-y-1.5 transition-transform duration-[250ms] ease-out shadow-sm hover:shadow-md"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            <img src={(loc as any).image} alt={loc.name} className="w-full h-full object-cover transition-transform duration-[250ms] ease-out group-hover:scale-105" />
                                            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-normal px-2.5 py-1 rounded-full z-10">
                                                Available Now
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="text-base font-bold text-foreground leading-tight">{loc.name}</h4>
                                                <span className="flex items-center gap-1 text-sm text-foreground shrink-0 ml-2">
                                                    <Star className="w-3.5 h-3.5 text-secondary fill-secondary" />
                                                    {loc.rating} <span className="text-muted-foreground text-xs">({loc.reviews})</span>
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {loc.tags.map((tag) => (
                                                    <span key={tag} className="text-[11px] text-muted-foreground border border-border rounded-full px-2.5 py-0.5">{tag}</span>
                                                ))}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                Starting from <span className="font-bold text-foreground">{loc.startingFrom}</span>
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleGetBestPrice(loc, false)}
                                                    className="flex-1 bg-primary text-primary-foreground text-sm font-normal py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
                                                >
                                                    Get Best Price
                                                </button>
                                                <button
                                                    onClick={() => navigate('/services/virtual-office')}
                                                    className="flex-1 flex items-center justify-center gap-1.5 border border-border text-sm font-normal text-foreground py-2.5 rounded-xl hover:bg-muted/50 transition-colors"
                                                >
                                                    Explore More
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};