import { useState, useMemo } from "react";
import {
  X,
  Star,
  MapPin,
  Trophy,
  TrendingDown,
  Check,
  Minus,
  ArrowRight,
  Flame,
  Building2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSafeImageUrl, isInvalidImageUrl } from "@/utils/imageUrl";

const DEFAULT_IMAGE = "/hero-illustrated.jpg";

export interface CompareSpace {
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
  spaceId?: string;
}

interface CompareDrawerProps {
  spaces: CompareSpace[];
  spaceType: string;
  onClose: () => void;
  onRemoveSpace: (id: string) => void;
}

// Helper to extract numeric price from string like "₹8,999/yr"
const extractPrice = (priceStr: string): number => {
  const num = Number(String(priceStr).replace(/[^0-9.]/g, ""));
  return Number.isFinite(num) && num > 0 ? num : 0;
};

// Collect all unique amenity tags across spaces
const getAllTags = (spaces: CompareSpace[]): string[] => {
  const tagSet = new Set<string>();
  spaces.forEach((s) => s.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
};

// Collect all unique plan labels across spaces
const getAllPlanLabels = (spaces: CompareSpace[]): string[] => {
  const labels = new Set<string>();
  spaces.forEach((s) => s.plans.forEach((p) => labels.add(p.label)));
  return Array.from(labels);
};

// Find best value indices
const findBestIdx = (values: number[], mode: "max" | "min"): number[] => {
  if (values.length === 0) return [];
  const target = mode === "max" ? Math.max(...values) : Math.min(...values.filter((v) => v > 0));
  if (!Number.isFinite(target) || target <= 0) return [];
  return values.reduce<number[]>((acc, v, i) => (v === target ? [...acc, i] : acc), []);
};

export default function CompareDrawer({ spaces, spaceType, onClose, onRemoveSpace }: CompareDrawerProps) {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    pricing: true,
    amenities: true,
    details: true,
  });

  const toggleSection = (key: string) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const allTags = useMemo(() => getAllTags(spaces), [spaces]);
  const allPlanLabels = useMemo(() => getAllPlanLabels(spaces), [spaces]);

  // Best ratings
  const ratings = spaces.map((s) => s.rating);
  const bestRatingIdx = findBestIdx(ratings, "max");

  // Best reviews
  const reviewCounts = spaces.map((s) => s.reviews);
  const bestReviewIdx = findBestIdx(reviewCounts, "max");

  // Most amenities
  const tagCounts = spaces.map((s) => s.tags.length);
  const bestTagIdx = findBestIdx(tagCounts, "max");

  // Cheapest price (first plan)
  const firstPlanPrices = spaces.map((s) => (s.plans[0] ? extractPrice(s.plans[0].price) : 0));
  const cheapestIdx = findBestIdx(firstPlanPrices, "min");

  const handleNavigate = (ws: CompareSpace) => {
    if (spaceType === "virtual-office") navigate(`/space/${ws.id}`);
    else if (spaceType === "coworking") navigate(`/coworking-space/${ws.id}`);
    else navigate(`/meeting-room/${ws.id}`);
  };

  const getImage = (ws: CompareSpace) => {
    const imgs = ws.images?.length ? ws.images : [ws.image];
    const valid = imgs.filter((i) => !isInvalidImageUrl(i)).map(getSafeImageUrl);
    return valid.length > 0 ? valid[0] : DEFAULT_IMAGE;
  };

  const colWidth = spaces.length === 2 ? "w-1/2" : spaces.length === 3 ? "w-1/3" : "w-1/4";

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-7xl bg-card rounded-t-3xl shadow-2xl border border-border/40 max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">Compare Spaces</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {spaces.length} spaces selected · Side-by-side comparison
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6 pb-6">
          {/* ─── SPACE HEADERS (Sticky) ─── */}
          <div className="sticky top-0 z-10 bg-card pt-4 pb-3 border-b border-border/40">
            <div className="flex gap-3">
              {spaces.map((ws, idx) => (
                <div key={ws.id} className={`${colWidth} flex flex-col items-center`}>
                  <div className="relative w-full h-32 rounded-xl overflow-hidden mb-2 group">
                    <img
                      src={getImage(ws)}
                      alt={ws.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {ws.popular && (
                      <span className="absolute top-2 left-2 flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded-full bg-amber-500/90 text-white">
                        <Flame className="w-2.5 h-2.5" /> Popular
                      </span>
                    )}
                    <button
                      onClick={() => onRemoveSpace(ws.id)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground text-center leading-snug line-clamp-2">
                    {ws.spaceId || ws.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {ws.location}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ─── SECTION: Overview ─── */}
          <SectionHeader
            title="Overview"
            isExpanded={expandedSections.overview}
            onToggle={() => toggleSection("overview")}
          />
          {expandedSections.overview && (
            <div className="space-y-0">
              {/* Rating */}
              <CompareRow label="Rating">
                {spaces.map((ws, idx) => (
                  <CompareCell key={ws.id} colWidth={colWidth} isBest={bestRatingIdx.includes(idx)}>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold text-foreground">{ws.rating.toFixed(1)}</span>
                      {bestRatingIdx.includes(idx) && (
                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </div>
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Reviews */}
              <CompareRow label="Reviews">
                {spaces.map((ws, idx) => (
                  <CompareCell key={ws.id} colWidth={colWidth} isBest={bestReviewIdx.includes(idx)}>
                    <span className="text-sm font-semibold text-foreground">{ws.reviews}</span>
                    <span className="text-[10px] text-muted-foreground ml-1">reviews</span>
                    {bestReviewIdx.includes(idx) && <Trophy className="w-3.5 h-3.5 text-amber-500 ml-1" />}
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Availability */}
              <CompareRow label="Availability">
                {spaces.map((ws) => (
                  <CompareCell key={ws.id} colWidth={colWidth}>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        ws.available
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-600 border border-red-200"
                      }`}
                    >
                      {ws.available ? "Available" : "Fully Booked"}
                    </span>
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Address */}
              <CompareRow label="Address">
                {spaces.map((ws) => (
                  <CompareCell key={ws.id} colWidth={colWidth}>
                    <span className="text-xs text-muted-foreground leading-snug line-clamp-2">{ws.address}</span>
                  </CompareCell>
                ))}
              </CompareRow>
            </div>
          )}

          {/* ─── SECTION: Pricing ─── */}
          <SectionHeader
            title="Pricing Comparison"
            isExpanded={expandedSections.pricing}
            onToggle={() => toggleSection("pricing")}
          />
          {expandedSections.pricing && (
            <div className="space-y-0">
              {allPlanLabels.map((label) => {
                const pricesForLabel = spaces.map((ws) => {
                  const plan = ws.plans.find((p) => p.label === label);
                  return plan ? extractPrice(plan.price) : 0;
                });
                const cheapest = findBestIdx(pricesForLabel, "min");
                return (
                  <CompareRow key={label} label={label}>
                    {spaces.map((ws, idx) => {
                      const plan = ws.plans.find((p) => p.label === label);
                      return (
                        <CompareCell key={ws.id} colWidth={colWidth} isBest={cheapest.includes(idx)}>
                          {plan ? (
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-bold text-foreground">{plan.price}</span>
                              {cheapest.includes(idx) && (
                                <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground/50">—</span>
                          )}
                        </CompareCell>
                      );
                    })}
                  </CompareRow>
                );
              })}

              {/* Plans Available Count */}
              <CompareRow label="Plans Available">
                {spaces.map((ws) => (
                  <CompareCell key={ws.id} colWidth={colWidth}>
                    <span className="text-sm font-semibold text-foreground">{ws.plans.length}</span>
                  </CompareCell>
                ))}
              </CompareRow>
            </div>
          )}

          {/* ─── SECTION: Amenities & Features ─── */}
          <SectionHeader
            title="Amenities & Features"
            isExpanded={expandedSections.amenities}
            onToggle={() => toggleSection("amenities")}
          />
          {expandedSections.amenities && (
            <div className="space-y-0">
              {/* Total amenities count */}
              <CompareRow label="Total Features">
                {spaces.map((ws, idx) => (
                  <CompareCell key={ws.id} colWidth={colWidth} isBest={bestTagIdx.includes(idx)}>
                    <span className="text-sm font-bold text-foreground">{ws.tags.length}</span>
                    {bestTagIdx.includes(idx) && <Trophy className="w-3.5 h-3.5 text-amber-500 ml-1" />}
                  </CompareCell>
                ))}
              </CompareRow>

              {/* Individual amenity rows */}
              {allTags.map((tag) => (
                <CompareRow key={tag} label={tag}>
                  {spaces.map((ws) => {
                    const has = ws.tags.includes(tag);
                    return (
                      <CompareCell key={ws.id} colWidth={colWidth}>
                        {has ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-muted/40 border border-border/60 flex items-center justify-center">
                            <Minus className="w-3.5 h-3.5 text-muted-foreground/40" />
                          </div>
                        )}
                      </CompareCell>
                    );
                  })}
                </CompareRow>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 border-t border-border/60 px-6 py-3 bg-muted/30">
          <div className="flex gap-3">
            {spaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => handleNavigate(ws)}
                className={`${colWidth} py-2.5 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5`}
              >
                View Details <ExternalLink className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Reusable Sub-Components ─── */

function SectionHeader({
  title,
  isExpanded,
  onToggle,
}: {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-3 mt-4 border-b border-border/40 group"
    >
      <h3 className="text-xs font-bold uppercase tracking-widest text-primary">{title}</h3>
      {isExpanded ? (
        <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      ) : (
        <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      )}
    </button>
  );
}

function CompareRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center border-b border-border/20 py-2.5 hover:bg-muted/20 transition-colors rounded-lg">
      <div className="w-36 shrink-0 text-xs font-medium text-muted-foreground pl-2 pr-3">{label}</div>
      <div className="flex flex-1 gap-3">{children}</div>
    </div>
  );
}

function CompareCell({
  children,
  colWidth,
  isBest = false,
}: {
  children: React.ReactNode;
  colWidth: string;
  isBest?: boolean;
}) {
  return (
    <div
      className={`${colWidth} flex items-center gap-1 px-2 py-1 rounded-lg ${
        isBest ? "bg-emerald-50/50 border border-emerald-100" : ""
      }`}
    >
      {children}
    </div>
  );
}
