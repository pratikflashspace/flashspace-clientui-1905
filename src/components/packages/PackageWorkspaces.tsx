import { useState, useEffect, Fragment } from "react";
import { getAvailableCities, getVirtualOfficesByCity } from "@/services/virtualOffice.service";
import { MapPin, Search, ChevronDown, ChevronUp, Star, Phone, Bookmark, ShoppingCart, BadgeCheck, CheckCircle2, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SkeletonCardGrid } from "@/components/ui/skeleton-loaders";
import MapLibreMap from "@/components/Map/MapLibreMap";
import { getSafeImageUrl, isInvalidImageUrl } from "@/utils/imageUrl";
import { getShortAddress } from "@/utils/address";

const DEFAULT_WORKSPACE_IMAGE = "/hero-illustrated.jpg";

const googleReviews = [
  {
    text: '"Nice space and well mannered staff,really happy 😊"',
    author: "-Vijay",
    initial: "V",
    bgColor: "bg-orange-600"
  },
  {
    text: '"Co-operative guys...go for them if u need a virtual office."',
    author: "-asadullah jahangir",
    initial: "A",
    bgColor: "bg-blue-500"
  },
  {
    text: '"I strongly recommend Virtual Office in delhi for your workspace requirements."',
    author: "-Manoj Gusain",
    initial: "M",
    bgColor: "bg-purple-600"
  },
  {
    text: '"It felt smooth and professional from start to finish."',
    author: "-Ashutosh Mishra",
    initial: "A",
    bgColor: "bg-blue-600"
  }
];

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
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    getAvailableCities("virtual-office").then((res) => {
      setCities(res);
      if (res.length > 0) setActiveCity(res[0]);
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % googleReviews.length);
    }, 4000);
    return () => clearInterval(timer);
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
            Select Your Virtual Office Location
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3 max-w-5xl mx-auto px-2">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className={`px-5 py-2.5 rounded-full border text-[13px] md:text-sm font-medium transition-all duration-300 ${
                  activeCity === city 
                    ? "bg-[#36503F] text-[#FEF8C5] border-[#36503F] shadow-md" 
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#36503F] hover:bg-gray-50 hover:text-gray-900"
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
              workspaces.map((ws, index) => {
                const rawImages = ws.images && ws.images.length > 0 ? ws.images : [ws.image];
                const images = rawImages.filter((img: string) => !isInvalidImageUrl(img)).map((img: string) => getSafeImageUrl(img));
                if (images.length === 0) images.push(DEFAULT_WORKSPACE_IMAGE);
                
                if (ws.location) {
                  const locLower = ws.location.toLowerCase();
                  if (locLower === 'bangalore' || locLower === 'bengaluru') {
                    images[0] = '/newLogo/banglore.jpg';
                  } else if (locLower === 'gurgaon' || locLower === 'gurugram') {
                    images[0] = '/newLogo/gurgaon.jpg';
                  } else if (locLower === 'noida') {
                    images[0] = '/newLogo/noida.jpg';
                  }
                }

                return (
                  <Fragment key={ws.id}>
                    <div className="flex flex-col sm:flex-row gap-6 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 sm:h-[270px]">
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
                              {plan.price && plan.price !== "0" ? plan.price : "N/A"}
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
                  
                  {index === 1 && (
                    <div className="my-4">
                      <h3 className="text-[13px] font-bold text-gray-500 mb-3 uppercase tracking-wider text-center">Trusted by 5000+ businesses</h3>
                      <div className="bg-[#F0F4EE]/50 rounded-2xl p-6 border border-[#D4E0D0] shadow-sm text-center overflow-hidden">
                        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
                          <img src="https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528434/agrizy_vpn5mj.png" alt="Agrizy" className="h-12 md:h-14 object-contain mix-blend-multiply" />
                          <img src="https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528434/Adda247_bbmaft.png" alt="Adda247" className="h-9 md:h-11 object-contain mix-blend-multiply" />
                          <img src="/newLogo/flipkart-logo-png_seeklogo-284422.png" alt="Flipkart" className="h-10 md:h-12 object-contain mix-blend-multiply" />
                          <img src="https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528435/growthschool_-_Copy_iip2zr.png" alt="Growth School" className="h-6 md:h-7 object-contain mix-blend-multiply" />
                          <img src="https://res.cloudinary.com/dpowv0tmd/image/upload/v1774528434/plum_logo_lstdop.png" alt="Plum" className="h-9 md:h-11 object-contain mix-blend-multiply" />
                          <img src="/Logo/StudyIQ.png" alt="Study IQ" className="h-10 md:h-12 object-contain mix-blend-multiply" />
                        </div>
                      </div>
                    </div>
                  )}
                </Fragment>
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

              {/* Review Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#D4E0D0] shadow-sm relative overflow-hidden flex flex-col gap-4 min-h-[160px]">
                <div className="flex text-[#FFB800] gap-1">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div className="flex gap-4 items-start">
                  <div className={`w-12 h-12 ${googleReviews[currentReview].bgColor} text-white rounded-full flex items-center justify-center font-bold text-xl shrink-0 mt-1 transition-colors duration-300`}>
                    {googleReviews[currentReview].initial}
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium text-[15px] leading-snug mb-2 transition-all duration-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {googleReviews[currentReview].text}
                    </p>
                    <p className="text-gray-400 text-sm transition-all duration-300">
                      {googleReviews[currentReview].author}
                    </p>
                  </div>
                </div>
                {/* Dots and arrow */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5">
                    {googleReviews.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentReview(idx)}
                        className={`rounded-full transition-all duration-300 ${currentReview === idx ? 'w-2 h-2 bg-gray-600' : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400'}`}
                      />
                    ))}
                  </div>
                  <button 
                    onClick={() => setCurrentReview((prev) => (prev + 1) % googleReviews.length)}
                    className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-100 active:scale-95 transition-all"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
