import { useState, useEffect } from "react";
import { getAvailableCities, getVirtualOfficesByCity } from "@/services/virtualOffice.service";
import { MapPin, Search, ChevronDown, ChevronUp, Star, Phone, Bookmark, ShoppingCart, BadgeCheck, CheckCircle2, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SkeletonCardGrid } from "@/components/ui/skeleton-loaders";
import MapLibreMap from "@/components/Map/MapLibreMap";
import { getSafeImageUrl, isInvalidImageUrl } from "@/utils/imageUrl";
import { getShortAddress } from "@/utils/address";

const DEFAULT_WORKSPACE_IMAGE = "/hero-illustrated.jpg";

export const PackageWorkspaces = ({ 
  planName, 
  onSelectSpace 
}: { 
  planName: string, 
  onSelectSpace: (spaceId: string) => void 
}) => {
  const [cities, setCities] = useState<string[]>([]);
  const [activeCity, setActiveCity] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [workspaces, setWorkspaces] = useState<any[]>([]);

  useEffect(() => {
    getAvailableCities("virtual-office").then((res) => {
      setCities(res);
      if (res.length > 0) setActiveCity(res[0]);
    });
  }, []);

  useEffect(() => {
    if (!activeCity) return;
    setLoading(true);
    getVirtualOfficesByCity(activeCity)
      .then((data) => {
        const mappedVO = (data.offices || []).map((o: any) => ({
          id: o._id,
          spaceId: o.spaceId || "",
          name: o.name,
          location: o.city,
          address: o.address,
          rating: o.rating,
          reviews: o.reviews,
          tags: o.features || [],
          plans: [
            { label: "Mailing Address", price: o.mailingPlanPrice },
            { label: "GST Registration", price: o.gstPlanPrice },
            { label: "Business Reg.", price: o.brPlanPrice },
          ],
          image: o.images && o.images.length > 0 ? o.images[0] : o.image,
          images: o.images || (o.image ? [o.image] : []),
          popular: o.popular || false,
          available: o.available !== false,
          lat: o.coordinates?.lat || 0,
          lng: o.coordinates?.lng || 0,
        }));
        setWorkspaces(mappedVO);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [activeCity]);

  // Extract map markers
  const mapMarkers = workspaces
    .filter((ws) => ws.lat && ws.lng && !isNaN(Number(ws.lat)) && !isNaN(Number(ws.lng)))
    .map((ws) => ({
      lat: Number(ws.lat),
      lng: Number(ws.lng),
      title: ws.name,
      price: ws.plans?.[0]?.price || "",
    }));

  const mapCenter: [number, number] = mapMarkers.length > 0
    ? [mapMarkers[0].lng, mapMarkers[0].lat]
    : [77.2090, 28.6139]; // default Delhi

  return (
    <section id="select-city-spaces" className="bg-[#FAF9F6] py-16 border-b border-[#E8E2D9]">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header & City Selection */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Select Your Virtual Office Location
          </h2>
          <p className="text-gray-600 text-lg mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
            Choose a premium business address in your preferred city.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className={`px-6 py-3 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                  activeCity === city 
                    ? "bg-[#36503F] text-[#FEF8C5] border-[#36503F] shadow-md" 
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#36503F] hover:bg-gray-50"
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Workspaces List & Sidebar Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Spaces List */}
          <div className="w-full lg:w-[65%] flex flex-col gap-4">
            {loading ? (
              <SkeletonCardGrid count={4} view="list" />
            ) : workspaces.length > 0 ? (
              workspaces.map((ws) => {
                const rawImages = ws.images && ws.images.length > 0 ? ws.images : [ws.image];
                const images = rawImages.filter((img: string) => !isInvalidImageUrl(img)).map((img: string) => getSafeImageUrl(img));
                if (images.length === 0) images.push(DEFAULT_WORKSPACE_IMAGE);

                return (
                  <div key={ws.id} className="flex flex-col sm:flex-row gap-6 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 sm:h-[270px]">
                    <div className="w-full sm:w-1/3 h-48 sm:h-full rounded-xl overflow-hidden shrink-0 relative">
                      <img src={images[0]} alt={ws.name} className="w-full h-full object-cover" />
                      {ws.popular && (
                        <span className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-normal px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground shadow-sm">
                          🔥 Popular
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-[17px] text-gray-900 leading-snug truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {ws.spaceId || ws.name} {ws.address && ` at ${getShortAddress(ws.address)}`}
                        </h3>
                        <div className="flex items-center gap-1 bg-gray-50 rounded-full px-2 py-0.5 shrink-0">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-semibold">{ws.rating}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4 overflow-hidden max-h-[28px]">
                        {ws.tags?.slice(0, 4).map((tag: string) => (
                          <span key={tag} className="text-[11px] px-2.5 py-0.5 rounded-full border border-gray-200 text-gray-600 bg-gray-50 whitespace-nowrap">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-col gap-1.5 mb-4">
                        {ws.plans.map((plan: any, i: number) => (
                          <div key={i} className="flex items-center justify-between text-xs border-b border-gray-50 pb-1.5 last:border-0 last:pb-0">
                            <span className="text-gray-500">{plan.label}</span>
                            <span className="font-bold text-gray-900">
                              {plan.price && plan.price !== "0" ? plan.price + "/yr" : "N/A"}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Starting from</p>
                          <p className="text-sm font-bold text-gray-900">{ws.plans.find((p: any) => p.price && p.price !== "0")?.price || "Price on request"}</p>
                        </div>
                        <button
                          onClick={() => onSelectSpace(ws.id)}
                          className="bg-[#36503F] text-[#FEF8C5] px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#25362B] transition-colors"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          Select & Continue
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center text-gray-500">
                No spaces found in {activeCity}.
              </div>
            )}
          </div>

          {/* Right: Sidebar */}
          <div className="w-full lg:w-[35%]">
            <div className="sticky top-24 flex flex-col gap-6">
              
              {/* Map */}
              <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 h-[300px] bg-white">
                <MapLibreMap center={mapCenter} markers={mapMarkers} height="100%" mapStyle="retro" />
              </div>

              {/* Premjeet Consultant Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                <h3 className="text-[16px] font-bold text-gray-900 mb-4 leading-tight">
                  Get your Virtual Office in {activeCity || "your city"} with Premjeet
                </h3>
                
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <img src="/to_cloudinary/premjeet.png" alt="Premjeet" className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-[15px] leading-tight mb-1">Premjeet</h4>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <p className="text-gray-500 text-[13px]">+91 98886 87898</p>
                      <a href="tel:+919888687898" className="inline-flex items-center justify-center bg-[#36503F] text-white px-3 py-1 rounded-sm text-[11px] font-bold hover:bg-[#2c4133] transition-colors shadow-sm">
                        Contact
                      </a>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 text-[11px] font-bold text-gray-700">
                      <BadgeCheck className="w-3.5 h-3.5 text-[#36503F]" /> FlashSpace Consultant
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-gray-900 text-[13px] mb-3">Premjeet will help you with:</h5>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                    {["Compare Workspaces", "Expert Price Negotiation", "Seamless GST Setup", "Tailored Documentation"].map(item => (
                      <div key={item} className="flex items-start gap-1.5 text-[12px] text-gray-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#36503F] shrink-0" />
                        <span className="leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clients Section */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center">
                <h3 className="text-[14px] font-bold text-gray-900 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                  5,000+ Virtual Office clients served
                </h3>
                <div className="flex flex-wrap justify-center items-center gap-4 opacity-80">
                  <img src="/newLogo/plum%20logo.png" alt="Plum" className="h-6 object-contain" />
                  <img src="/newLogo/flipkart-logo-png_seeklogo-284422.png" alt="Flipkart" className="h-8 object-contain" />
                  <img src="/Logo/StudyIQ.png" alt="Study IQ" className="h-8 object-contain" />
                </div>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
