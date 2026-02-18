import React, { useState } from 'react';
import { X, User, Building2, FileText, Loader2, Briefcase } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface LogVisitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const LogVisitModal = ({ isOpen, onClose, onSuccess }: LogVisitModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        client: '',
        visitor: '',
        purpose: '',
        space: ''
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/visit`, formData);
            toast.success('Visit logged successfully');
            onSuccess();
            onClose();
            setFormData({ client: '', visitor: '', purpose: '', space: '' });
        } catch (error: any) {
            console.error('Failed to log visit', error);
            toast.error(error.response?.data?.message || 'Failed to log visit');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 font-[Poppins]">Log New Visit</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Client Name */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Client Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                name="client"
                                required
                                placeholder="e.g. Tech Innovations Pvt Ltd"
                                value={formData.client}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Visitor Name */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Visitor Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                name="visitor"
                                required
                                placeholder="e.g. John Doe"
                                value={formData.visitor}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Purpose */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Purpose</label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                name="purpose"
                                required
                                placeholder="e.g. Meeting"
                                value={formData.purpose}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Space Location */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Space Location</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                name="space"
                                required
                                placeholder="e.g. Mumbai - BKC"
                                value={formData.space}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-100"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Log Visit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LogVisitModal;
