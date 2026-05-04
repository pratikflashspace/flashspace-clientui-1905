import { useState, useEffect, useMemo, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Star,
  MapPin,
  List,
  LayoutGrid,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Bookmark,
  ShoppingCart,
  Phone,
  Flame,
  Map as MapIcon,
} from "lucide-react";
import { SkeletonCardGrid } from "@/components/ui/skeleton-loaders";
import MapLibreMap from "@/components/Map/MapLibreMap";
import {
  getVirtualOfficesByCity,
  getAvailableCities,
} from "@/services/virtualOffice.service";
import { getCoworkingSpacesByCity } from "@/services/coworkingSpace.service";
import { getMeetingRoomsByCity } from "@/services/meetingRoom.service";
import MeetingBookingModal from "@/components/ui/MeetingBookingModal";
import { ListingItem } from "@/components/services/ListingCardModern";
import { getSafeImageUrl, isInvalidImageUrl } from "@/utils/imageUrl";
import { getShortAddress } from "@/utils/address";

// Static placeholders for fallback/missing data
// import connaughtPlace1 from "@/assets/connaught-place-1.png";

type ViewMode = "list" | "grid";

// Make it match the shape they provided
interface UnifiedWorkspace {
  id: string;
  name: string;
  location: string;
  address: string;
  rating: number;
  reviews: number;
  tags: string[];
  plans: { label: string; price: string }[];
  image: string;
  images: string[];
  popular: boolean;
  available: boolean;
  negotiable: boolean;
  lat: number;
  lng: number;
  spaceId?: string;
}


const DEFAULT_WORKSPACE_IMAGE = "/hero-illustrated.jpg";
const PAGE_SIZE = 20;

type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  nextPage?: number | null;
  prevPage?: number | null;
};

const isPubliclyVisibleWorkspace = (space: any) => {
  const approvalStatus = String(space?.approvalStatus ?? "").toLowerCase();
  const propertyStatus = String(space?.property?.status ?? "").toLowerCase();
  const isPublished =
    approvalStatus === "active" || propertyStatus === "active";
  const isExplicitlyPending = [
    "draft",
    "pending_kyc",
    "pending_admin",
    "rejected",
    "suspended",
  ].includes(approvalStatus) && propertyStatus !== "active";

  return (
    space?.isDeleted !== true &&
    space?.isActive !== false &&
    (isPublished || (!approvalStatus && !propertyStatus)) &&
    !isExplicitlyPending
  );
};

/** Custom city dropdown with always-visible clickable chevron arrows */
const CityDropdown = ({
  activeCity,
  cities,
  loading,
  onSelect,
}: {
  activeCity: string;
  cities: string[];
  loading: boolean;
  onSelect: (city: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const scroll = (dir: "up" | "down") => {
    if (listRef.current) {
      listRef.current.scrollBy({ top: dir === "up" ? -120 : 120, behavior: "smooth" });
    }
  };

  return (
    <div className="sm:w-[160px] relative" ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="flex items-center gap-1.5 border border-border/60 rounded-xl h-10 text-sm font-medium px-4 w-full transition-all duration-200 bg-card hover:border-border hover:shadow-sm text-foreground"
      >
        <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        <span className="flex-1 text-left truncate">{loading ? "Loading..." : activeCity}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-full bg-popover border border-border rounded-xl shadow-lg z-[9999] flex flex-col overflow-hidden">
          {/* Always-visible UP chevron */}
          <button
            type="button"
            onClick={() => scroll("up")}
            className="flex items-center justify-center py-1.5 border-b border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer shrink-0"
          >
            <ChevronUp className="h-4 w-4" />
          </button>

          {/* Scrollable city list */}
          <div ref={listRef} className="max-h-[200px] overflow-y-auto overscroll-contain">
            {cities.length > 0 ? (
              cities.map((city) => (
                <button
                  key={city}
                  onClick={() => { onSelect(city); setOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-accent ${city === activeCity ? "bg-accent/50 font-medium text-primary" : "text-popover-foreground"
                    }`}
                >
                  {city}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-muted-foreground">No cities available</div>
            )}
          </div>

          {/* Always-visible DOWN chevron */}
          <button
            type="button"
            onClick={() => scroll("down")}
            className="flex items-center justify-center py-1.5 border-t border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer shrink-0"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

const WorkspaceCard = ({
  ws,
  view,
  type,
}: {
  ws: UnifiedWorkspace;
  view: ViewMode;
  type: string;
}) => {
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const [carted, setCarted] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const navigate = useNavigate();
  const handleNavigate = () => {
    if (type === "virtual-office") navigate(`/space/${ws.id}`);
    else if (type === "coworking") navigate(`/coworking-space/${ws.id}`);
    else navigate(`/meeting-room/${ws.id}`);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !liked;
    setLiked(next);
    toast({
      title: next ? "Saved to your wishlist" : "Removed from wishlist",
      description: next
        ? `${ws.location} has been saved.`
        : `${ws.location} has been removed.`,
    });
  };

  const handleCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !carted;
    setCarted(next);
    toast({
      title: next ? "Added to cart" : "Removed from cart",
      description: next
        ? `${ws.location} has been added to your cart.`
        : `${ws.location} has been removed from your cart.`,
    });
  };

  const rawImages = ws.images && ws.images.length > 0 ? ws.images : [ws.image];
  const images = rawImages
    .filter((img) => !isInvalidImageUrl(img))
    .map((img) => getSafeImageUrl(img));

  if (images.length === 0) images.push(DEFAULT_WORKSPACE_IMAGE);

  const bookingItem: ListingItem = {
    _id: ws.id,
    name: ws.name,
    address: ws.address,
    area: ws.location || ws.address,
    price: ws.plans?.[0]?.price || "Price on request",
    rating: ws.rating,
    reviews: ws.reviews,
    features: ws.tags || [],
    image: ws.image,
    images: ws.images,
    popular: ws.popular,
    availability: ws.available ? "Available Now" : "Fully Booked",
    coordinates: { lat: ws.lat, lng: ws.lng },
  };

  console.log(`🏠 Rendering Card: ${ws.name}, WS OBJECT:`, JSON.stringify(ws, null, 2));

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  };
  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex((i) => (i + 1) % images.length);
  };

  if (view === "list") {
    return (
      <div
        onClick={handleNavigate}
        className="flex gap-4 cursor-pointer group bg-card rounded-2xl border border-border/60 p-4 shadow-soft hover:shadow-soft-lg transition-all duration-200"
      >
        {/* Image — fixed size, never shrinks */}
        <div className="relative w-36 h-auto min-h-[120px] flex-shrink-0 rounded-xl overflow-hidden self-stretch">
          <img
            src={images[imgIndex]}
            alt={ws.name}
            onError={(e) => {
              e.currentTarget.src = DEFAULT_WORKSPACE_IMAGE;
            }}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {ws.popular && (
            <span className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-normal px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground shadow-sm">
              <Flame className="w-2.5 h-2.5" /> Popular
            </span>
          )}
          <span
            className={`absolute bottom-2 left-2 text-[10px] font-normal px-2 py-0.5 rounded-full backdrop-blur-sm text-white shadow-sm ${ws.available ? "bg-black/50" : "bg-black/60"}`}
          >
            {ws.available ? "Available Now" : "Fully Booked"}
          </span>
        </div>

        {/* Content — all stacked vertically */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {/* Name + Rating + Actions */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-[15px] text-foreground leading-snug tracking-[1px] truncate px-1">
              {ws.spaceId || ws.name}
              {ws.address && ` at ${getShortAddress(ws.address)}`}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleSave}
                className="w-7 h-7 rounded-full bg-muted/60 flex items-center justify-center hover:bg-muted transition-all duration-200"
              >
                <Bookmark
                  className={`w-3.5 h-3.5 transition-all duration-200 ${liked ? "fill-primary text-primary scale-110" : "text-foreground/60"}`}
                />
              </button>
              <button
                onClick={handleCart}
                className="w-7 h-7 rounded-full bg-muted/60 flex items-center justify-center hover:bg-muted transition-all duration-200"
              >
                <ShoppingCart
                  className={`w-3.5 h-3.5 transition-all duration-200 ${carted ? "fill-primary text-primary scale-110" : "text-foreground/60"}`}
                />
              </button>
              <div className="flex items-center gap-1 bg-muted/60 rounded-full px-2 py-0.5">
                <Star className="w-3 h-3 fill-gold text-gold" />
                <span className="text-xs font-semibold text-foreground">
                  {ws.rating}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  ({ws.reviews})
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {ws.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2.5 py-0.5 rounded-full border border-border/70 text-muted-foreground bg-muted/40"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-border/50 mt-1" />

          {/* Pricing */}
          <div className="space-y-1">
            {ws.plans.slice(0, 2).map((plan) => (
              <div key={plan.label} className="flex items-center gap-3">
                <span className="text-[11px] text-muted-foreground w-24 flex-shrink-0">
                  {plan.label}
                </span>
                <span className="text-xs font-normal text-foreground">
                  {plan.price}
                </span>
              </div>
            ))}
          </div>

          {/* CTAs — always on their own row */}
          <div className="flex gap-2 mt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate();
              }}
              className="py-2 px-8 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 whitespace-nowrap flex-[1.4]"
            >
              Get Best Price
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMeetingModalOpen(true);
              }}
              className="py-2 px-4 text-xs font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-all duration-200 flex items-center gap-1 whitespace-nowrap flex-1"
            >
              <Phone className="w-3 h-3" /> Contact Sales
            </button>
          </div>
        </div>
        <MeetingBookingModal
          isOpen={isMeetingModalOpen}
          onClose={() => setIsMeetingModalOpen(false)}
          item={bookingItem}
        />
      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={handleNavigate}
      className="cursor-pointer group bg-card rounded-2xl border border-border/60 shadow-soft hover:shadow-soft-lg transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Image Section */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={images[imgIndex]}
          alt={ws.name}
          onError={(e) => {
            e.currentTarget.src = DEFAULT_WORKSPACE_IMAGE;
          }}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        {/* Popular badge */}
        {ws.popular && (
          <span className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-normal px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground shadow-sm">
            <Flame className="w-2.5 h-2.5" /> Popular
          </span>
        )}

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleSave}
            className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all duration-200"
          >
            <Bookmark
              className={`w-3.5 h-3.5 transition-all duration-200 ${liked ? "fill-primary text-primary scale-110" : "text-foreground/60"}`}
            />
          </button>
          <button
            onClick={handleCart}
            className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all duration-200"
          >
            <ShoppingCart
              className={`w-3.5 h-3.5 transition-all duration-200 ${carted ? "fill-primary text-primary scale-110" : "text-foreground/60"}`}
            />
          </button>
        </div>

        {/* Availability + image nav arrows */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span
            className={`text-[10px] font-normal px-3 py-1 rounded-full backdrop-blur-sm text-white shadow-sm ${ws.available ? "bg-black/50" : "bg-black/60"}`}
          >
            {ws.available ? "Available Now" : "Fully Booked"}
          </span>
          {images.length > 1 && (
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={prevImg}
                className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-foreground/70" />
              </button>
              <button
                onClick={nextImg}
                className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all"
              >
                <ChevronRight className="w-3.5 h-3.5 text-foreground/70" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Name + Rating */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-[15px] text-foreground leading-snug tracking-[1px] truncate px-1">
            {ws.spaceId || ws.name}
            {ws.address && ` at ${getShortAddress(ws.address)}`}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0 bg-muted/60 rounded-full px-2 py-0.5">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span className="text-xs font-semibold text-foreground">
              {ws.rating}
            </span>
            <span className="text-[11px] text-muted-foreground">
              ({ws.reviews})
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2 min-h-[26px]">
          {ws.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-full border border-border/70 text-muted-foreground bg-muted/40 hover:bg-muted/80 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-border/60 mt-2 mb-2" />

        {/* Plan rows — grows to push CTA down */}
        <div className="space-y-2 flex-1">
          {ws.plans.map((plan) => (
            <div key={plan.label} className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                {plan.label}
              </span>
              <span className="text-[13px] font-normal text-foreground">
                {plan.price}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Buttons — always at bottom */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
            className="flex-[1.4] py-2.5 px-4 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
          >
            Get Best Price
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMeetingModalOpen(true);
            }}
            className="flex-1 py-2.5 text-xs font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-all duration-200 flex items-center justify-center gap-1.5"
          >
            <Phone className="w-3 h-3" /> Contact Sales
          </button>
        </div>
      </div>
      <MeetingBookingModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        item={bookingItem}
      />
    </div>
  );
};

const GetWorkspaces = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialCity = searchParams.get("city") || "Delhi";

  const getInitialType = () => {
    if (location.pathname.includes("coworking")) return "coworking";
    if (
      location.pathname.includes("on-demand") ||
      location.pathname.includes("onDemand")
    )
      return "on-demand";
    return "virtual-office";
  };
  const [activeCity, setActiveCity] = useState(initialCity);
  const [workspaceType, setWorkspaceType] = useState(getInitialType());

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const city = params.get("city") || "Delhi";
    if (city !== activeCity) {
      setActiveCity(city);
    }
  }, [location.search]);

  // Sync workspaceType with URL changes (e.g., back/forward navigation)
  useEffect(() => {
    const currentType = getInitialType();
    if (workspaceType !== currentType) {
      setWorkspaceType(currentType);
    }
  }, [location.pathname]);

  // Reset pagination whenever type or city changes
  useEffect(() => {
    setPage(1);
  }, [workspaceType, activeCity]);

  const handleWorkspaceTypeChange = (value: string) => {
    setWorkspaceType(value);
    const params = new URLSearchParams(location.search);
    const currentCity = params.get("city") || activeCity;
    const searchStr = `?city=${encodeURIComponent(currentCity)}`;

    if (value === "coworking")
      navigate(`/services/coworking-space${searchStr}`, { replace: true });
    else if (value === "on-demand") navigate(`/services/on-demand${searchStr}`, { replace: true });
    else navigate(`/services/virtual-office${searchStr}`, { replace: true });
  };

  const handleCityChange = (city: string) => {
    const params = new URLSearchParams(location.search);
    params.set("city", city);
    // Use replace to avoid cluttering history with filter changes
    navigate({ search: params.toString() }, { replace: true });
    // activeCity state will be updated by the useEffect listening to location.search
  };
  const [searchLocation, setSearchLocation] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearch = () => {
    setDebouncedSearch(searchLocation);
  };
  const [pricingFilter, setPricingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showMap, setShowMap] = useState(false);
  const [mapCollapsed, setMapCollapsed] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);

  const [workspaces, setWorkspaces] = useState<UnifiedWorkspace[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const goPrevPage = () => {
    if (workspaceType !== "virtual-office") return;
    if (pagination?.hasPrevPage) {
      setPage((p) => Math.max(1, p - 1));
    }
  };

  const goNextPage = () => {
    if (workspaceType !== "virtual-office") return;
    if (pagination?.hasNextPage) {
      setPage((p) => p + 1);
    }
  };

  // Fetch available cities once on mount
  useEffect(() => {
    getAvailableCities().then((cities) => {
      setAvailableCities(cities);
      setCitiesLoading(false);
    }).catch(() => {
      setCitiesLoading(false);
    });
  }, []);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setLoading(true);
      try {
        let fetchedData: any[] = [];
        if (workspaceType === "virtual-office") {
          const { offices, pagination } = await getVirtualOfficesByCity(
            activeCity,
            page,
            PAGE_SIZE,
          );
          setPagination(pagination || null);
          fetchedData = offices.filter(isPubliclyVisibleWorkspace);
          setWorkspaces(
            fetchedData.map((vo) => ({
              id: vo._id || "",
              name: vo.property?.name || vo.name || "Virtual Office",
              location: vo.property?.name || vo.name || vo.area || "City Center",
              address: vo.property?.address || vo.address || "",
              rating: Number(vo.rating ?? 0),
              reviews: Number(vo.reviews ?? 0),
              tags: vo.features?.length
                ? vo.features.slice(0, 3)
                : ["Virtual Office", "Premium Address"],
              plans: [
                ...(vo.gstPlanPrice
                  ? [{ label: "GST Plan", price: vo.gstPlanPrice }]
                  : []),
                ...(vo.mailingPlanPrice
                  ? [{ label: "Mailing Plan", price: vo.mailingPlanPrice }]
                  : []),
                ...(vo.brPlanPrice
                  ? [{ label: "Business Reg", price: vo.brPlanPrice }]
                  : []),
              ],
              image: vo.image || "/hero-illustrated.jpg",
              images:
                Array.isArray(vo.images) && vo.images.length > 0
                  ? vo.images
                  : vo.image
                    ? [vo.image]
                    : ["/hero-illustrated.jpg"],
              popular: vo.popular || false,
              available: vo.availability === "Available Now",
              negotiable: true,
              lat:
                vo.coordinates?.lat ?? vo.location?.coordinates?.[1] ?? 28.6139,
              lng:
                vo.coordinates?.lng ?? vo.location?.coordinates?.[0] ?? 77.209,
              spaceId: vo.spaceId || vo.property?.spaceId || "",
            })),
          );
        } else if (workspaceType === "coworking") {
          fetchedData = (await getCoworkingSpacesByCity(activeCity)).filter(
            isPubliclyVisibleWorkspace,
          );
          setPagination(null);
          setWorkspaces(
            fetchedData.map((cw) => ({
              id: cw._id || "",
              name: cw.property?.name || cw.name || "Coworking Space",
              location: cw.property?.name || cw.name || cw.area || "Workspace Hub",
              address: cw.property?.address || cw.address || "",
              rating: Number(cw.rating ?? 0),
              reviews: Number(cw.reviews ?? 0),
              tags: cw.features?.length
                ? cw.features.slice(0, 3)
                : ["High-Speed WiFi", "24/7 Access"],
              plans: [
                ...(cw.price ? [{ label: "Basic Plan", price: cw.price }] : []),
              ],
              image: cw.image || "/hero-illustrated.jpg",
              images:
                Array.isArray(cw.images) && cw.images.length > 0
                  ? cw.images
                  : cw.image
                    ? [cw.image]
                    : ["/hero-illustrated.jpg"],
              popular: cw.popular || false,
              available: true,
              negotiable: true,
              lat:
                cw.coordinates?.lat ?? cw.location?.coordinates?.[1] ?? 28.6139,
              lng:
                cw.coordinates?.lng ?? cw.location?.coordinates?.[0] ?? 77.209,
              spaceId: cw.spaceId || cw.property?.spaceId || "",
            })),
          );
        } else if (workspaceType === "on-demand") {
          fetchedData = (await getMeetingRoomsByCity(activeCity)).filter(
            isPubliclyVisibleWorkspace,
          );
          setWorkspaces(
            fetchedData.map((mr) => ({
              id: mr._id || "",
              name: mr.property?.name || mr.name || "Meeting Room",
              location: mr.property?.name || mr.name || mr.area || "Conference Center",
              address: mr.property?.address || mr.address || "",
              rating: Number(mr.rating ?? 0),
              reviews: Number(mr.reviews ?? 0),
              tags: mr.features?.length
                ? mr.features.slice(0, 3)
                : ["Projector", "Whiteboard"],
              plans: [
                ...(mr.price
                  ? [{ label: "Hourly Plan", price: mr.price }]
                  : []),
              ],
              image: mr.image || "/hero-illustrated.jpg",
              images:
                Array.isArray(mr.images) && mr.images.length > 0
                  ? mr.images
                  : mr.image
                    ? [mr.image]
                    : ["/hero-illustrated.jpg"],
              popular: mr.popular || false,
              available: true,
              negotiable: false,
              lat:
                mr.coordinates?.lat ?? mr.location?.coordinates?.[1] ?? 28.6139,
              lng:
                mr.coordinates?.lng ?? mr.location?.coordinates?.[0] ?? 77.209,
              spaceId: mr.spaceId || mr.property?.spaceId || "",
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching workspaces:", error);
        setWorkspaces([]); // Fallback
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [workspaceType, activeCity, page]);

  // Client-side filtering logic
  const filteredWorkspaces = useMemo(() => {
    return workspaces.filter((ws) => {
      // Location search filter
      const matchesSearch =
        !debouncedSearch ||
        ws.address.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        ws.location.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        ws.name.toLowerCase().includes(debouncedSearch.toLowerCase());

      // Price filter
      let matchesPrice = true;
      if (pricingFilter !== "all") {
        const rawPrice = ws.plans?.[0]?.price;
        const numericPrice = rawPrice
          ? Number(String(rawPrice).replace(/[^0-9.]/g, ""))
          : null;

        if (
          numericPrice !== null &&
          Number.isFinite(numericPrice) &&
          numericPrice > 0
        ) {
          if (pricingFilter === "low") matchesPrice = numericPrice < 5000;
          else if (pricingFilter === "mid")
            matchesPrice = numericPrice >= 5000 && numericPrice <= 15000;
          else if (pricingFilter === "high") matchesPrice = numericPrice > 15000;
        } else {
          matchesPrice = false;
        }
      }

      return matchesSearch && matchesPrice;
    });
  }, [workspaces, debouncedSearch, pricingFilter]);

  const sortedWorkspaces = useMemo(() => {
    const list = [...filteredWorkspaces];

    const extractNumericPrice = (value?: string) => {
      if (!value) return Number.POSITIVE_INFINITY;
      const numeric = Number(String(value).replace(/[^0-9.]/g, ""));
      return Number.isFinite(numeric) && numeric > 0
        ? numeric
        : Number.POSITIVE_INFINITY;
    };

    if (sortBy === "rating") {
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    if (sortBy === "price-low") {
      return list.sort(
        (a, b) =>
          extractNumericPrice(a.plans?.[0]?.price) -
          extractNumericPrice(b.plans?.[0]?.price),
      );
    }

    if (sortBy === "price-high") {
      return list.sort(
        (a, b) =>
          extractNumericPrice(b.plans?.[0]?.price) -
          extractNumericPrice(a.plans?.[0]?.price),
      );
    }

    return list.sort((a, b) => Number(b.popular) - Number(a.popular));
  }, [filteredWorkspaces, sortBy]);

  const totalResults = pagination?.total ?? sortedWorkspaces.length;
  const currentPage = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;

  const typeLabel: Record<string, string> = {
    "virtual-office": "Virtual Office",
    coworking: "Coworking Space",
    "on-demand": "On Demand",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Full-width top section: Breadcrumb + Filters */}
      <div className="mt-20 bg-background border-b border-border/60">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
            <a href="/" className="hover:text-foreground transition-colors">
              Home
            </a>
            <ChevronRight className="w-3 h-3" />
            <span className="hover:text-foreground transition-colors cursor-pointer">
              {typeLabel[workspaceType]}
            </span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{activeCity}</span>
          </nav>

          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-muted/40 border border-border/60 rounded-2xl p-2.5 sm:p-3 relative z-[40]">
            {/* Product */}
            <div className="sm:w-[180px]">
              <Select
                value={workspaceType}
                onValueChange={handleWorkspaceTypeChange}
              >
                <SelectTrigger
                  className={`border shadow-none rounded-xl h-10 text-sm font-medium px-4 [&>svg]:ml-auto w-full transition-all duration-200 ${workspaceType !== "virtual-office"
                    ? "bg-muted/50 border-border text-foreground"
                    : "border-border/60 hover:border-border hover:shadow-sm"
                    }`}
                >
                  <SelectValue placeholder="Product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="virtual-office">Virtual Office</SelectItem>
                  <SelectItem value="coworking">Coworking Space</SelectItem>
                  <SelectItem value="on-demand">On Demand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-border/60 flex-shrink-0" />

            {/* City — custom dropdown with always-visible chevrons */}
            <CityDropdown
              activeCity={activeCity}
              cities={availableCities}
              loading={citiesLoading}
              onSelect={handleCityChange}
            />

            {/* Search Location */}
            <div className="relative flex-1 min-w-[140px]">
              <div className="flex items-center bg-card border border-border/60 rounded-xl h-10 overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20">
                <MapPin className="w-4 h-4 text-muted-foreground ml-3 flex-shrink-0" />
                <Input
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  className="border-0 shadow-none h-full text-sm font-medium text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none bg-transparent px-3 placeholder:text-muted-foreground/40 min-w-0 flex-1"
                  placeholder="Search location..."
                />
                <button
                  onClick={handleSearch}
                  className="px-3 h-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-colors border-l border-border/60"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pricing */}
            <div className="sm:w-[160px]">
              <Select value={pricingFilter} onValueChange={setPricingFilter}>
                <SelectTrigger
                  className={`border shadow-none rounded-xl h-10 text-sm font-medium px-4 [&>svg]:ml-auto w-full transition-all duration-200 ${pricingFilter !== "all"
                    ? "bg-muted/50 border-border text-foreground"
                    : "border-border/60 text-foreground bg-card hover:border-border hover:shadow-sm"
                    }`}
                >
                  <SelectValue placeholder="Pricing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pricing</SelectItem>
                  <SelectItem value="low">Under ₹5,000</SelectItem>
                  <SelectItem value="mid">₹5,000 – ₹15,000</SelectItem>
                  <SelectItem value="high">Above ₹15,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort by */}
            <div className="sm:w-[150px]">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger
                  className={`border shadow-none rounded-xl h-10 text-sm font-medium px-4 [&>svg]:ml-auto w-full transition-all duration-200 ${sortBy !== "rating"
                    ? "bg-muted/50 border-border text-foreground"
                    : "border-border/60 text-foreground bg-card hover:border-border hover:shadow-sm"
                    }`}
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: split view — listings left, map right */}
      <div className="hidden lg:flex flex-1 h-[calc(100vh-13rem)] relative">
        {/* Left: Listings */}
        <div
          className={`overflow-y-auto bg-muted/20 transition-all duration-300 ease-in-out relative ${mapCollapsed ? "w-full" : "w-[58%] border-r border-border/40"}`}
        >
          <div className="px-5 py-5 sm:px-8">
            {/* Results text + view toggle */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {sortedWorkspaces.length} of {totalResults} result(s)
                </span>{" "}
                for {typeLabel[workspaceType].toLowerCase()} in{" "}
                <span className="font-medium text-foreground">
                  {activeCity}
                </span>
              </p>
              <div className="flex items-center gap-2">
                {workspaceType === "virtual-office" && totalPages > 1 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <button
                      onClick={goPrevPage}
                      disabled={!pagination?.hasPrevPage}
                      className="px-3 py-1 rounded-full border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-all"
                    >
                      Prev
                    </button>
                    <span className="text-[11px]">
                      Page {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={goNextPage}
                      disabled={!pagination?.hasNextPage}
                      className="px-3 py-1 rounded-full border border-border bg-card text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-all"
                    >
                      Next
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-0.5 bg-muted/60 rounded-full p-0.5">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 ${viewMode === "list"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 ${viewMode === "grid"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            {loading ? (
              <div
                className={
                  viewMode === "grid"
                    ? `grid gap-4 pb-8 ${mapCollapsed ? "grid-cols-1 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-3 min-[1500px]:grid-cols-4" : "grid-cols-1 min-[700px]:grid-cols-2"}`
                    : "flex flex-col gap-4 pb-8"
                }
              >
                <SkeletonCardGrid count={6} view={viewMode} />
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? `grid gap-4 pb-8 ${mapCollapsed ? "grid-cols-1 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-3 min-[1500px]:grid-cols-4" : "grid-cols-1 min-[700px]:grid-cols-2"}`
                    : "flex flex-col gap-4 pb-8"
                }
              >
                {sortedWorkspaces.length > 0 ? (
                  sortedWorkspaces.map((ws) => (
                    <WorkspaceCard
                      key={ws.id}
                      ws={ws}
                      view={viewMode}
                      type={workspaceType}
                    />
                  ))
                ) : (
                  <div className="col-span-3 py-16 text-center text-muted-foreground">
                    <p className="text-base font-medium">
                      No spaces found in "{activeCity}"
                    </p>
                    <p className="text-sm mt-1">
                      Try searching a different city.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Map */}
        <div
          className={`transition-all duration-300 ease-in-out relative ${mapCollapsed ? "w-0 overflow-hidden opacity-0" : "w-[42%] opacity-100"}`}
        >
          <div className="sticky top-20 h-[calc(100vh-5.5rem)] m-2 sm:m-4 rounded-xl overflow-hidden shadow-sm border border-border/30">
            {/* Map toggle — fixed on the map */}
            <button
              onClick={() => setMapCollapsed(!mapCollapsed)}
              className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full border border-border bg-card shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200 cursor-pointer"
              aria-label="Hide map"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <MapLibreMap
              center={useMemo(() => ({
                lat: sortedWorkspaces[0]?.lat || workspaces[0]?.lat || 28.6139,
                lng: sortedWorkspaces[0]?.lng || workspaces[0]?.lng || 77.209,
              }), [sortedWorkspaces, workspaces])}
              markers={useMemo(() => sortedWorkspaces.map((ws) => {
                let link = `/space/${ws.id}`;
                if (workspaceType === "coworking") link = `/coworking-space/${ws.id}`;
                else if (workspaceType === "on-demand") link = `/meeting-room/${ws.id}`;

                return {
                  id: ws.id,
                  position: { lat: ws.lat, lng: ws.lng },
                  title: ws.spaceId || ws.name,
                  image: ws.images?.[0] || ws.image,
                  price: ws.plans?.[0]?.price,
                  rating: ws.rating,
                  address: ws.address,
                  link: link,
                };
              }), [sortedWorkspaces, workspaceType])}
              height="100%"
              mapStyle="retro"
            />
          </div>
        </div>

        {/* Floating map button — fixed top-right, below filter bar */}
        {mapCollapsed && (
          <button
            onClick={() => setMapCollapsed(false)}
            className="fixed top-[184px] right-8 z-30 w-10 h-10 rounded-full border border-border bg-card shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200 cursor-pointer"
            aria-label="Show map"
          >
            <MapIcon className="w-4.5 h-4.5" />
          </button>
        )}
      </div>

      {/* Mobile: full-width listings + expandable map */}
      <div className="lg:hidden flex-1 relative">
        <div className="px-4 py-3">
          {loading ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 min-[500px]:grid-cols-2 gap-4 pb-8"
                  : "flex flex-col gap-3 pb-8"
              }
            >
              <SkeletonCardGrid count={4} view={viewMode} />
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 min-[500px]:grid-cols-2 gap-4 pb-8"
                  : "flex flex-col gap-3 pb-8"
              }
            >
              {sortedWorkspaces.length > 0 ? (
                sortedWorkspaces.map((ws) => (
                  <WorkspaceCard
                    key={ws.id}
                    ws={ws}
                    view={viewMode}
                    type={workspaceType}
                  />
                ))
              ) : (
                <div className="col-span-2 py-16 text-center text-muted-foreground">
                  <p className="text-base font-medium">
                    No spaces found in "{activeCity}"
                  </p>
                  <p className="text-sm mt-1">
                    Try searching a different city.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Expand Map floating button */}
        <button
          onClick={() => setShowMap(!showMap)}
          className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-card border border-border shadow-soft-lg text-xs font-medium text-foreground hover:bg-muted transition-all"
        >
          <MapPin className="w-3.5 h-3.5 text-[#35503F]" />
          {showMap ? "Hide Map" : "Expand Map"}
        </button>

        {showMap && (
          <div className="fixed inset-0 z-30 mt-16 bg-background">
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-3 left-3 z-40 flex items-center gap-1 px-3 py-2 rounded-full bg-card border border-border shadow-md text-xs font-medium text-foreground"
            >
              <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Back to list
            </button>
            <MapLibreMap
              center={useMemo(() => ({
                lat: sortedWorkspaces[0]?.lat || workspaces[0]?.lat || 28.6139,
                lng: sortedWorkspaces[0]?.lng || workspaces[0]?.lng || 77.209,
              }), [sortedWorkspaces, workspaces])}
              markers={useMemo(() => sortedWorkspaces.map((ws) => ({
                id: ws.id,
                position: { lat: ws.lat, lng: ws.lng },
                title: ws.spaceId || ws.name,
                image: ws.images?.[0] || ws.image,
                price: ws.plans?.[0]?.price,
                rating: ws.rating,
                address: ws.address,
              })), [sortedWorkspaces])}
              height="100%"
              mapStyle="retro"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GetWorkspaces;
