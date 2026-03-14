import React, { useState } from 'react';
import { X, Loader2, Calendar, User, FileText, IndianRupee, Layout, CheckCircle2 } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface LogInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const LogInvoiceModal = ({ isOpen, onClose, onSuccess }: LogInvoiceModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        invoiceId: '',
        client: '',
        description: '',
        amount: '',
        dueDate: '',
        space: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosInstance.post('/api/spacePartner/invoices', formData);

            if (response.data.success) {
                onSuccess();
                onClose();
                setFormData({ invoiceId: '', client: '', description: '', amount: '', dueDate: '', space: '' });
            } else {
                console.error('Failed to log invoice:', response.data.message);
            }
        } catch (error) {
            console.error('Failed to log invoice', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                        <div
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <div
                        className="relative bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden border border-border text-slate-900 opacity-100"
                    >
                        {/* Header */}
                        <div className="relative p-8 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-foreground tracking-tight">
                                        Log New <span className="text-primary italic">Invoice</span>
                                    </h2>
                                    <p className="text-muted-foreground font-medium">Create a new billing record for your client.</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 hover:bg-muted rounded-2xl transition-all text-muted-foreground hover:text-foreground active:scale-95"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Form Area with Scrollbar */}
                        <form onSubmit={handleSubmit}>
                            <div className="max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar p-8 pt-4 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-foreground ml-1">
                                            Invoice Reference
                                        </label>
                                        <div className="relative group">
                                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.invoiceId}
                                                onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground/60"
                                                placeholder="INV-2024-001"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-foreground ml-1">
                                            Client Name
                                        </label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.client}
                                                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground/60"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground ml-1">
                                        Description
                                    </label>
                                    <div className="relative group">
                                        <Layout className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground/60"
                                            placeholder="Service or item description"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-foreground ml-1">
                                            Billing Amount
                                        </label>
                                        <div className="relative group">
                                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="number"
                                                required
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-foreground placeholder:text-muted-foreground/60"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-foreground ml-1">
                                            Due Date
                                        </label>
                                        <div className="relative group">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="date"
                                                required
                                                value={formData.dueDate}
                                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-foreground"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground ml-1">
                                        Associated Space
                                    </label>
                                    <div className="relative group">
                                        <Layout className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.space}
                                            onChange={(e) => setFormData({ ...formData, space: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground/60"
                                            placeholder="Space name"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Fixed Footer */}
                            <div className="p-8 border-t border-border flex gap-4 bg-muted/20 rounded-b-[2.5rem]">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="flex-1 h-14 rounded-xl border-border text-foreground font-bold hover:bg-muted transition-all text-base"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all text-base shadow-lg shadow-primary/10 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
                                            Generate Invoice
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default LogInvoiceModal;
