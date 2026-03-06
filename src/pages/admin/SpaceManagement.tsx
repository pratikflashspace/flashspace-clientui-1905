import React, { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { Search, MapPin, Star, Plus, Trash2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import EditSpaceModal from "@/components/admin/EditSpaceModal";
import AddSpaceModal from "@/components/admin/AddSpaceModal";

interface Space {
  _id: string;
  name: string;
  city: string;
  area: string;
  address?: string;
  rating?: number;
  reviews?: number;
  image?: string;
  features: string[];
  availability?: string;
  type: "virtual-office" | "coworking-space";
  price?: string;
  originalPrice?: string;
}

export default function SpaceManagement() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"active" | "deleted">("active");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "virtual-office" | "coworking-space"
  >("all");
  const [cityFilter, setCityFilter] = useState<string>("all");

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
    setSelectedSpace(space);
    setIsEditModalOpen(true);
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
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Space <span className="text-primary italic">Management</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize all your office listings in one place.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Space
        </Button>
      </div>

      {/* Controls & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
        {/* Search */}
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search spaces by name, city, or area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent rounded-xl focus:outline-none placeholder:text-gray-400 text-gray-900"
          />
        </div>

        {/* View Toggles & Other Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* City Filter */}
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-black/5"
          >
            <option value="all">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-black/5"
          >
            <option value="all">All Types</option>
            <option value="virtual-office">Virtual Office</option>
            <option value="coworking-space">Coworking</option>
          </select>

          <div className="h-6 w-px bg-gray-200 mx-1 hidden md:block" />

          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("active")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === "active"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Active Listings
            </button>
            <button
              onClick={() => setViewMode("deleted")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${viewMode === "deleted"
                ? "bg-white text-red-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              <Trash2 className="w-4 h-4" />
              Recycle Bin
            </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredSpaces.map((space) => (
            <div
              key={space._id}
              className={`group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col ${viewMode === "deleted"
                ? "opacity-80 hover:opacity-100 grayscale-[0.3] hover:grayscale-0"
                : ""
                }`}
            >
              {/* Image Header */}
              <div className="h-56 relative overflow-hidden">
                {space.image ? (
                  <img
                    src={space.image}
                    alt={space.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                {/* Top Badges */}
                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                  <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    {space.rating}{" "}
                    <span className="text-gray-400 font-normal">
                      ({space.reviews})
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm backdrop-blur-md text-white border border-white/10 ${space.type === "virtual-office"
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
                {space.availability === "Unavailable" &&
                  viewMode === "active" && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Unavailable
                    </div>
                  )}

                {viewMode === "deleted" && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5">
                    <Trash2 className="w-3 h-3" />
                    In Trash
                  </div>
                )}

                {/* Bottom Content on Image */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-bold text-xl leading-tight mb-1 drop-shadow-md">
                    {space.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-100 drop-shadow-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="line-clamp-1">
                      {space.city}, {space.area}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {(space.features || []).slice(0, 3).map((feature, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-gray-50 text-xs font-medium text-gray-600 rounded-md border border-gray-100"
                    >
                      {feature}
                    </span>
                  ))}
                  {(space.features || []).length > 3 && (
                    <span className="px-2.5 py-1 bg-gray-50 text-xs font-medium text-gray-400 rounded-md border border-gray-100">
                      +{(space.features || []).length - 3}
                    </span>
                  )}
                </div>

                {/* Actions - Variable based on View Mode */}
                <div className="flex gap-3 mt-auto pt-6 border-t border-gray-50">
                  {viewMode === "active" ? (
                    <>
                      <button
                        onClick={() => handleEditClick(space)}
                        className="flex-1 py-2.5 bg-gray-50 hover:bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={async () => {
                          const isUnavailable =
                            space.availability === "Unavailable";
                          await handleSaveSpace(space._id, space.type, {
                            availability: isUnavailable
                              ? "Available Now"
                              : "Unavailable",
                          });
                        }}
                        className={`flex-1 py-2.5 font-semibold rounded-xl border transition-all text-sm whitespace-nowrap px-2 ${space.availability === "Unavailable"
                          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          : "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                          }`}
                      >
                        {space.availability === "Unavailable"
                          ? "Make Available"
                          : "Mark Unavailable"}
                      </button>

                      <button
                        onClick={() => handleDeleteSpace(space)}
                        className="p-2.5 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl border border-gray-200 hover:border-red-200 transition-all"
                        title="Move to Trash"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    // Deleted View Actions
                    <>
                      <div className="flex-1 text-xs text-gray-400 flex items-center">
                        Select 'Restore' to make active
                      </div>
                      <button
                        onClick={() => handleRestoreSpace(space)}
                        className="flex-none px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all text-sm flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Restore Space
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

      <EditSpaceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveSpace}
        space={selectedSpace}
      />

      <AddSpaceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateSpace}
      />
    </div>
  );
}
