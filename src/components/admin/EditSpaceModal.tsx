import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Plus, Trash } from 'lucide-react';

interface EditSpaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, type: string, data: any) => Promise<void>;
    space: any;
}

const DESK_TYPES = ['Hot Desk', 'Dedicated Desk', 'Private Office', 'Shared Desk'];

export default function EditSpaceModal({ isOpen, onClose, onSave, space }: EditSpaceModalProps) {
    const [formData, setFormData] = useState<any>({});
    const [features, setFeatures] = useState<string[]>([]);
    const [newFeature, setNewFeature] = useState('');
    const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (space) {
            setFormData({ ...space });
            setFeatures(space.features || []);
            setGalleryUrls(space.photos || []);
        }
    }, [space]);

    // Body scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData((prev: any) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else if (type === 'number') {
            setFormData((prev: any) => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData((prev: any) => ({ ...prev, [name]: value }));
        }
    };

    const handleFeatureAdd = () => {
        if (newFeature.trim()) {
            setFeatures([...features, newFeature.trim()]);
            setNewFeature('');
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                features,
                photos: galleryUrls
            };
            await onSave(space._id, space.type, payload);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !space) return null;

    const isVirtualOffice = space.type === 'virtual-office';
    const isCoworkingSpace = space.type === 'coworking-space';

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200 my-8 border border-white/20">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-gray-50 to-white">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Edit Space</h2>
                        <p className="text-sm text-gray-500 mt-1">Update details for {space.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <form id="edit-space-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Space Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Area/Locality *</label>
                                    <input
                                        type="text"
                                        name="area"
                                        value={formData.area || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Full Address *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Coworking Specific: Desk Type */}
                        {isCoworkingSpace && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Desk Type *</label>
                                <select
                                    name="type"
                                    value={formData.type || 'Hot Desk'}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                >
                                    {DESK_TYPES.map(dt => (
                                        <option key={dt} value={dt}>{dt}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Pricing */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Pricing</h3>

                            {/* Main Price Section */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Space Availability</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {isCoworkingSpace && (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Monthly Price *</label>
                                                <input
                                                    type="text"
                                                    name="price"
                                                    value={formData.price || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                                    placeholder="e.g. ₹999/mo"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Yearly Price</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                                    <input
                                                        type="number"
                                                        name="priceYearly"
                                                        value={formData.priceYearly || ''}
                                                        onChange={handleChange}
                                                        className="w-full pl-8 pr-16 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 placeholder:text-gray-400"
                                                        placeholder="120000"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">/ year</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Original Price</label>
                                                <input
                                                    type="text"
                                                    name="originalPrice"
                                                    value={formData.originalPrice || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                                    placeholder="e.g. ₹1499/mo"
                                                />
                                            </div>
                                        </>
                                    )}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Availability</label>
                                        <select
                                            name="availability"
                                            value={formData.availability || 'Available Now'}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                        >
                                            <option value="Available Now">Available Now</option>
                                            <option value="Few Spots Left">Few Spots Left</option>
                                            <option value="Unavailable">Unavailable</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Virtual Office Plan Pricing */}
                            {isVirtualOffice && (
                                <div className="space-y-4 pt-2">
                                    {/* GST Plan */}
                                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                        <h4 className="text-sm font-semibold text-blue-900 mb-3">GST Plan</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Monthly Price</label>
                                                <input
                                                    type="text"
                                                    name="gstPlanPrice"
                                                    value={formData.gstPlanPrice || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                                    placeholder="e.g. ₹499/mo"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Yearly Price</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                                    <input
                                                        type="number"
                                                        name="gstPlanPriceYearly"
                                                        value={formData.gstPlanPriceYearly || ''}
                                                        onChange={handleChange}
                                                        className="w-full pl-8 pr-16 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 placeholder:text-gray-400"
                                                        placeholder="7999"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">/ year</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mailing Plan */}
                                    <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                                        <h4 className="text-sm font-semibold text-purple-900 mb-3">Mailing Plan</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Monthly Price</label>
                                                <input
                                                    type="text"
                                                    name="mailingPlanPrice"
                                                    value={formData.mailingPlanPrice || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                                    placeholder="e.g. ₹699/mo"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Yearly Price</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                                    <input
                                                        type="number"
                                                        name="mailingPlanPriceYearly"
                                                        value={formData.mailingPlanPriceYearly || ''}
                                                        onChange={handleChange}
                                                        className="w-full pl-8 pr-16 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 placeholder:text-gray-400"
                                                        placeholder="1999"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">/ year</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BR Plan */}
                                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                        <h4 className="text-sm font-semibold text-emerald-900 mb-3">Business Rep Plan</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Monthly Price</label>
                                                <input
                                                    type="text"
                                                    name="brPlanPrice"
                                                    value={formData.brPlanPrice || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                                    placeholder="e.g. ₹899/mo"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Yearly Price</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                                    <input
                                                        type="number"
                                                        name="brPlanPriceYearly"
                                                        value={formData.brPlanPriceYearly || ''}
                                                        onChange={handleChange}
                                                        className="w-full pl-8 pr-16 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 placeholder:text-gray-400"
                                                        placeholder="1999"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">/ year</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Images */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Images</h3>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Main Cover Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                    placeholder="https://..."
                                />
                                {formData.image && (
                                    <div className="mt-2 h-40 w-full bg-gray-100 rounded-xl overflow-hidden border">
                                        <img src={formData.image} alt="Cover Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            {/* Gallery */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-700">Gallery Photos</label>
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
                                        <div key={index} className="h-24 relative group rounded-xl overflow-hidden border">
                                            <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
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
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Features & Amenities</h3>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newFeature}
                                    onChange={(e) => setNewFeature(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleFeatureAdd())}
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
                                    <span key={index} className="px-3 py-1.5 bg-gray-100 text-sm text-gray-700 rounded-full flex items-center gap-2 group border">
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
                                    <p className="text-sm text-gray-400">No features added yet. Add some to make your listing stand out!</p>
                                )}
                            </div>
                        </div>

                        {/* Additional Options */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Additional Options</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Rating</label>
                                    <input
                                        type="number"
                                        name="rating"
                                        value={formData.rating || 4.5}
                                        onChange={handleChange}
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Reviews Count</label>
                                    <input
                                        type="number"
                                        name="reviews"
                                        value={formData.reviews || 0}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="popular"
                                    checked={formData.popular || false}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
                                />
                                <span className="text-sm font-medium text-gray-700">Mark as Popular / Featured</span>
                            </label>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        form="edit-space-form"
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
