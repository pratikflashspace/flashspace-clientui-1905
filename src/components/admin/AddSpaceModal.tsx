import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Save, Plus, Building2, Briefcase } from "lucide-react";

interface AddSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (type: string, data: any) => Promise<void>;
}

const DESK_TYPES = [
  "Hot Desk",
  "Dedicated Desk",
  "Private Office",
  "Shared Desk",
];

export default function AddSpaceModal({
  isOpen,
  onClose,
  onSave,
}: AddSpaceModalProps) {
  const [spaceType, setSpaceType] = useState<
    "virtual-office" | "coworking-space"
  >("virtual-office");
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    area: "",
    price: "",
    originalPrice: "",
    finalGstPricePerYear: "",
    finalMailingPricePerYear: "",
    finalBrPricePerYear: "",
    rating: 4.5,
    reviews: 0,
    availability: "Available Now",
    popular: false,
    image: "",
    type: "Hot Desk", // For coworking spaces
    coordinates: { lat: 0, lng: 0 },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFeatureAdd = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const handleFeatureRemove = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleGalleryAdd = () => {
    const url = prompt("Enter image URL for gallery:");
    if (url) {
      setGalleryUrls([...galleryUrls, url]);
    }
  };

  const handleGalleryRemove = (index: number) => {
    setGalleryUrls(galleryUrls.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      area: "",
      price: "",
      originalPrice: "",
      finalGstPricePerYear: "",
      finalMailingPricePerYear: "",
      finalBrPricePerYear: "",
      rating: 4.5,
      reviews: 0,
      availability: "Available Now",
      popular: false,
      image: "",
      type: "Hot Desk",
      coordinates: { lat: 0, lng: 0 },
    });
    setFeatures([]);
    setGalleryUrls([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Clean up payload - remove empty strings and add defaults
      const payload: any = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        area: formData.area,
        price: formData.price,
        originalPrice: formData.originalPrice || formData.price, // Default to price if not set
        rating: formData.rating || 4.5,
        reviews: formData.reviews || 0,
        features: features.length > 0 ? features : ["Professional Environment"],
        availability: formData.availability || "Available Now",
        popular: formData.popular || false,
        coordinates: formData.coordinates || { lat: 0, lng: 0 },
      };

      // Add image if provided
      if (formData.image) {
        payload.image = formData.image;
      }

      // Add gallery photos if provided
      if (galleryUrls.length > 0) {
        payload.photos = galleryUrls;
      }

      // Add Virtual Office specific fields
      if (spaceType === "virtual-office") {
        if (formData.finalGstPricePerYear)
          payload.finalGstPricePerYear = formData.finalGstPricePerYear;
        if (formData.finalMailingPricePerYear)
          payload.finalMailingPricePerYear = formData.finalMailingPricePerYear;
        if (formData.finalBrPricePerYear)
          payload.finalBrPricePerYear = formData.finalBrPricePerYear;
      }

      // Add Coworking Space specific fields
      if (spaceType === "coworking-space") {
        payload.type = formData.type || "Hot Desk";
      }

      await onSave(spaceType, payload);
      resetForm();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-gray-50 to-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Space</h2>
            <p className="text-sm text-gray-500 mt-1">
              Create a new listing for your platform
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 min-h-0">
          {/* Space Type Selector */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">
              Select Space Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSpaceType("virtual-office")}
                className={`p-5 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  spaceType === "virtual-office"
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${spaceType === "virtual-office" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"}`}
                >
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Virtual Office</p>
                  <p className="text-xs text-gray-500">
                    Business address & mail handling
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSpaceType("coworking-space")}
                className={`p-5 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  spaceType === "coworking-space"
                    ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${spaceType === "coworking-space" ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-500"}`}
                >
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Coworking Space</p>
                  <p className="text-xs text-gray-500">
                    Desks & physical workspace
                  </p>
                </div>
              </button>
            </div>
          </div>

          <form
            id="add-space-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Space Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    placeholder="e.g. Premium Business Hub"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    placeholder="e.g. Delhi"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Area/Locality *
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    placeholder="e.g. Connaught Place"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Full Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    placeholder="e.g. 123, Block A, Connaught Place, New Delhi - 110001"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Coworking Specific: Desk Type */}
            {spaceType === "coworking-space" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Desk Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                >
                  {DESK_TYPES.map((dt) => (
                    <option key={dt} value={dt}>
                      {dt}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Pricing
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Display Price *
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    placeholder="e.g. ₹999/mo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Original Price
                  </label>
                  <input
                    type="text"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    placeholder="e.g. ₹1499/mo"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Availability
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  >
                    <option value="Available Now">Available Now</option>
                    <option value="Few Spots Left">Few Spots Left</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              {/* Virtual Office Plan Pricing */}
              {spaceType === "virtual-office" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      GST Plan Yearly Price
                    </label>
                    <input
                      type="number"
                      name="finalGstPricePerYear"
                      value={formData.finalGstPricePerYear}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                      placeholder="e.g. 5999"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Mailing Plan Yearly Price
                    </label>
                    <input
                      type="number"
                      name="finalMailingPricePerYear"
                      value={formData.finalMailingPricePerYear}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                      placeholder="e.g. 7999"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      BR Plan Yearly Price
                    </label>
                    <input
                      type="number"
                      name="finalBrPricePerYear"
                      value={formData.finalBrPricePerYear}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                      placeholder="e.g. 9999"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Images
              </h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Main Cover Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  placeholder="https://..."
                />
                {formData.image && (
                  <div className="mt-2 h-40 w-full bg-gray-100 rounded-xl overflow-hidden border">
                    <img
                      src={formData.image || "/hero-illustrated.jpg"}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">
                    Gallery Photos
                  </label>
                  <button
                    type="button"
                    onClick={handleGalleryAdd}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-gray-700 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Photo
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {galleryUrls.map((url, index) => (
                    <div
                      key={index}
                      className="h-24 relative group rounded-xl overflow-hidden border"
                    >
                      <img
                        src={url}
                        alt={`Gallery ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleGalleryRemove(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {galleryUrls.length === 0 && (
                    <div className="col-span-full text-center py-6 text-gray-400 text-sm border-2 border-dashed rounded-xl">
                      No gallery photos added yet
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Features & Amenities
              </h3>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleFeatureAdd())
                  }
                  className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  placeholder="Add a feature (e.g. High-Speed WiFi)"
                />
                <button
                  type="button"
                  onClick={handleFeatureAdd}
                  className="px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-100 text-sm text-gray-700 rounded-full flex items-center gap-2 group border"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleFeatureRemove(index)}
                      className="w-4 h-4 rounded-full bg-gray-300 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {features.length === 0 && (
                  <p className="text-sm text-gray-400">
                    No features added yet. Add some to make your listing stand
                    out!
                  </p>
                )}
              </div>
            </div>

            {/* Additional Options */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Additional Options
              </h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="popular"
                  checked={formData.popular}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
                />
                <span className="text-sm font-medium text-gray-700">
                  Mark as Popular / Featured
                </span>
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-3">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            form="add-space-form"
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              "Creating..."
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create Space
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
