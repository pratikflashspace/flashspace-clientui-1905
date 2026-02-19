import React, { useState } from 'react';
import { X, Mail, User, Building2, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { mailService, CreateMailData } from '../../services/mailService';

interface LogMailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const LogMailModal = ({ isOpen, onClose, onSuccess }: LogMailModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateMailData>({
        client: '',
        sender: '',
        type: 'Letter',
        space: ''
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isFormValid = () => {
        return formData.client.trim() !== '' &&
            formData.sender.trim() !== '' &&
            formData.space.trim() !== '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setLoading(true);

        try {
            await mailService.create(formData);
            toast.success('Mail logged successfully');
            onSuccess();
            onClose();
            setFormData({ client: '', sender: '', type: 'Letter', space: '' });
        } catch (error: any) {
            console.error('Failed to log mail', error);
            const message = error.response?.data?.message || 'Failed to log mail';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 font-[Poppins]">Log New Mail</h2>
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

                    {/* Sender */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Sender</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                name="sender"
                                required
                                placeholder="e.g. HDFC Bank"
                                value={formData.sender}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Type & Space Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Type</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all appearance-none bg-white"
                                >
                                    <option value="Letter">Letter</option>
                                    <option value="Parcel">Parcel</option>
                                    <option value="Government Letter">Government Letter</option>
                                    <option value="Courier">Courier</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

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
                            className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-100 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Log Mail
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LogMailModal;