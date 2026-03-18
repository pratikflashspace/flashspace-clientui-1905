import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "@/services/admin.service";
import { Search, MapPin, Star, Plus, Trash2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { getSafeImageUrl } from "@/utils/imageUrl";

const FALLBACK_IMAGE = "/hero-illustrated.jpg";
const SECONDARY_FALLBACK = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";

interface Space {
  _id: string;
  name: string;
  city: string;
  area: string;
  address?: string;
  rating?: number;
  reviews?: number;
  image?: string;
  images?: string[];
  photos?: string[];
  features: string[];
  availability?: string;
  isActive?: boolean;
  type: "virtual-office" | "coworking-space";
  price?: string;
  originalPrice?: string;
  propertyId?: string;
}

// Improved checker for bad/placeholder image URLs
const isInvalidImageUrl = (url?: string) => {
  if (!url) return true;
  const val = String(url).trim().toLowerCase();
  return (
    val === "" ||
    val === "null" ||
    val === "undefined" ||
    val === "image.jpg" ||
    val === "placeholder.png" ||
    val.startsWith("url") ||
    val.includes("shorturl.at") ||
    val.includes("tinyurl.com")
  );
};

// Helper to get the best available image from a space
const getSpaceImage = (space: Space): string => {
  // Try images array first
  if (space.images && Array.isArray(space.images) && space.images.length > 0) {
    const validImg = space.images.find(img => !isInvalidImageUrl(img));
    if (validImg) return getSafeImageUrl(validImg, FALLBACK_IMAGE);
  }
  // Try photos array
  if (space.photos && Array.isArray(space.photos) && space.photos.length > 0) {
    const validImg = space.photos.find(img => !isInvalidImageUrl(img));
    if (validImg) return getSafeImageUrl(validImg, FALLBACK_IMAGE);
  }
  // Try legacy single image field
  if (!isInvalidImageUrl(space.image)) {
    return getSafeImageUrl(space.image, FALLBACK_IMAGE);
  }
  return FALLBACK_IMAGE;
};

// Isolated image component so error state doesn't cause parent re-render / flickering
const SpaceImage = ({ src, alt }: { src: string; alt: string }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Sync state with props if data changes
  useEffect(() => {
    setImageSrc(src);
    setHasError(false);
  }, [src]);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImageSrc(FALLBACK_IMAGE);
        }
      }}
    />
  );
};

export default function SpaceManagement() {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"active" | "deleted">("active");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "virtual-office" | "coworking-space"
  >("all");
  const [cityFilter, setCityFilter] = useState<string>("all");

  useEffect(() => {
    fetchSpaces();
  }, [viewMode]);

  const fetchSpaces = async () => {
    setLoading(true);
    try {
      const isDeleted = viewMode === "deleted";
      const response = await adminService.getAllSpaces(isDeleted);
      if (response.success && response.data) {
        setSpaces(response.data as Space[]);
      } else {
        setSpaces([]);
      }
    } catch (error) {
      console.error("Failed to fetch spaces", error);
      setSpaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (space: Space) => {
    const propertyId = space.propertyId || space._id;
    const step = space.type === "virtual-office" ? "virtual" : "coworking";
    navigate(`/admin/spaces/add?id=${propertyId}&step=${step}`);
  };

  const handleSaveSpace = async (
    id: string,
    type: "virtual-office" | "coworking-space",
    data: any,
  ) => {
    try {
      await adminService.updateSpace(id, type, data);
      toast.success("Space updated successfully");
      fetchSpaces(); // Refresh list
    } catch (error) {
      console.error("Failed to update space", error);
      toast.error("Failed to update space");
    }
  };

  const handleCreateSpace = async (
    type: "virtual-office" | "coworking-space",
    data: any,
  ) => {
    try {
      await adminService.createSpace(type, data);
      toast.success("Space created successfully!");
      fetchSpaces(); // Refresh list
    } catch (error) {
      console.error("Failed to create space", error);
      toast.error("Failed to create space");
    }
  };

  const handleDeleteSpace = async (space: Space) => {
    if (
      confirm(
        "Are you sure you want to move this space to trash? Users will no longer see it.",
      )
    ) {
      try {
        await adminService.deleteSpace(space._id, space.type);
        toast.success("Space moved to trash");
        fetchSpaces();
      } catch (error) {
        console.error("Failed to delete space", error);
        toast.error("Failed to delete space");
      }
    }
  };

  const handleRestoreSpace = async (space: Space) => {
    if (
      confirm(
        "Are you sure you want to restore this space? It will become active again.",
      )
    ) {
      try {
        await adminService.deleteSpace(space._id, space.type, true); // true for restore
        toast.success("Space restored successfully");
        fetchSpaces();
      } catch (error) {
        console.error("Failed to restore space", error);
        toast.error("Failed to restore space");
      }
    }
  };

  const cities = Array.from(new Set(spaces.map((s) => s.city)))
    .filter(Boolean)
    .sort();

  const filteredSpaces = spaces.filter((space) => {
    const searchLower = (searchTerm || "").toLowerCase();
    const matchesSearch =
      (space.name || "").toLowerCase().includes(searchLower) ||
      (space.city || "").toLowerCase().includes(searchLower) ||
      (space.area || "").toLowerCase().includes(searchLower);

    const matchesType = typeFilter === "all" || space.type === typeFilter;
    const matchesCity = cityFilter === "all" || space.city === cityFilter;

    return matchesSearch && matchesType && matchesCity;
  });

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight font-[Poppins]">
              Space Management
            </h1>
            <p className="text-sm md:text-base text-gray-500 font-medium">
              Manage and organize all your office listings in one place.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
             <div className="flex bg-gray-100/80 p-1.5 rounded-2xl backdrop-blur-sm w-full sm:w-auto">
              <button
                onClick={() => setViewMode("active")}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  viewMode === "active"
                    ? "bg-white text-gray-900 shadow-lg ring-1 ring-black/5"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setViewMode("deleted")}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                  viewMode === "deleted"
                    ? "bg-white text-red-600 shadow-lg ring-1 ring-red-100"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }`}
              >
                <Trash2 className="w-4 h-4" />
                Bin
              </button>
            </div>
            <button
              onClick={() => navigate("/admin/spaces/add")}
              className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white border border-transparent rounded-2xl hover:bg-black transition-all shadow-lg shadow-gray-900/10 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 font-bold whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add New Property
            </button>
          </div>
        </div>

        {/* Controls & Filters */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 overflow-visible">
          <div className="p-4 md:p-6 flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search spaces by name, city, or area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-4 focus:ring-black/5 focus:bg-white transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400 h-11"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-none rounded-xl w-full sm:flex-1 lg:w-auto h-11">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-xs font-bold text-gray-700 cursor-pointer outline-none w-full"
                >
                  <option value="all">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-none rounded-xl w-full sm:flex-1 lg:w-auto h-11">
                <Star className="w-3.5 h-3.5 text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="bg-transparent border-none focus:ring-0 text-xs font-bold text-gray-700 cursor-pointer outline-none w-full"
                >
                  <option value="all">All Types</option>
                  <option value="virtual-office">Virtual Office</option>
                  <option value="coworking-space">Coworking</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Spaces Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {filteredSpaces.map((space) => (
              <div
                key={space._id}
                className={`group bg-white rounded-[32px] border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 overflow-hidden flex flex-col ${
                  viewMode === "deleted"
                    ? "opacity-80 grayscale-[0.3]"
                    : ""
                }`}
              >
                {/* Image Header */}
                <div className="h-48 sm:h-56 relative overflow-hidden bg-gray-200">
                  <SpaceImage src={getSpaceImage(space)} alt={space.name} />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    <div className="bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl text-[10px] font-black text-gray-900 shadow-xl flex items-center gap-1.5 border border-white/20">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {space.rating}{" "}
                      <span className="text-gray-400 font-bold">
                        ({space.reviews})
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-xl backdrop-blur-md text-white border border-white/20 ${
                        space.type === "virtual-office"
                          ? "bg-blue-600/90"
                          : "bg-indigo-600/90"
                      }`}
                    >
                      {space.type === "virtual-office"
                        ? "Virtual Office"
                        : "Coworking"}
                    </span>
                  </div>

                  {/* Unavailable Badge */}
                  {(!space.isActive || space.availability === "Unavailable") &&
                    viewMode === "active" && (
                      <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 border border-red-400/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Unavailable
                      </div>
                    )}

                  {viewMode === "deleted" && (
                    <div className="absolute top-4 left-4 bg-red-600/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 border border-red-500/20">
                      <Trash2 className="w-3 h-3" />
                      In Trash
                    </div>
                  )}

                  {/* Bottom Content on Image */}
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <h3 className="font-extrabold text-lg sm:text-xl leading-snug mb-1 drop-shadow-2xl">
                      {space.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-100/90 drop-shadow-md">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">
                        {space.city}, {space.area}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  {/* Features */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {(space.features || []).slice(0, 3).map((feature, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-50 text-[10px] font-black uppercase tracking-wider text-gray-500 rounded-lg border border-gray-100"
                      >
                        {feature}
                      </span>
                    ))}
                    {(space.features || []).length > 3 && (
                      <span className="px-2 py-1 bg-gray-50 text-[10px] font-black text-gray-300 rounded-lg border border-gray-100">
                        +{(space.features || []).length - 3} More
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-auto pt-5 border-t border-gray-50">
                    {viewMode === "active" ? (
                      <>
                        <button
                          onClick={() => handleEditClick(space)}
                          className="flex-1 py-3 bg-white text-gray-700 font-extrabold rounded-2xl border-2 border-gray-50 hover:bg-gray-50 hover:border-gray-100 transition-all text-xs uppercase tracking-widest"
                        >
                          Edit
                        </button>

                        <button
                          onClick={async () => {
                            const willBeNowActive = !space.isActive;
                            await handleSaveSpace(space._id, space.type, {
                              availability: willBeNowActive
                                ? "Available Now"
                                : "Unavailable",
                              isActive: willBeNowActive,
                            });
                          }}
                          className={`flex-[1.5] py-3 font-extrabold rounded-2xl border-2 transition-all text-xs uppercase tracking-widest whitespace-nowrap px-4 ${
                            !space.isActive
                              ? "bg-green-50 text-green-700 border-green-100/50 hover:bg-green-100 hover:border-green-200"
                              : "bg-orange-50 text-orange-700 border-orange-100/50 hover:bg-orange-100 hover:border-orange-200"
                          }`}
                        >
                          {!space.isActive
                            ? "Make Available"
                            : "Unavailable"}
                        </button>

                        <button
                          onClick={() => handleDeleteSpace(space)}
                          className="p-3 bg-white text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl border-2 border-gray-50 hover:border-red-100 transition-all flex items-center justify-center"
                          title="Move to Trash"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Restore to activate
                        </div>
                        <button
                          onClick={() => handleRestoreSpace(space)}
                          className="px-6 py-3 bg-gray-900 text-white font-black rounded-2xl hover:bg-black shadow-lg shadow-gray-900/10 hover:shadow-xl transition-all text-xs uppercase tracking-widest flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Restore
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredSpaces.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              {viewMode === "deleted" ? (
                <Trash2 className="w-8 h-8 text-gray-300" />
              ) : (
                <Search className="w-8 h-8 text-gray-300" />
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {viewMode === "deleted" ? "Trash is empty" : "No spaces found"}
            </h3>
            <p className="text-gray-500 max-w-sm">
              {viewMode === "deleted"
                ? "There are no spaces in the recycle bin."
                : `We couldn't find any spaces matching "${searchTerm}".`}
            </p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
