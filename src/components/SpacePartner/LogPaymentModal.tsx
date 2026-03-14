import React, { useState } from 'react';
import { X, Loader2, Calendar, User, FileText, IndianRupee, Layout, CreditCard, CheckCircle2 } from 'lucide-react';
import { axiosInstance } from '../../lib/axios';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface LogPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const LogPaymentModal = ({ isOpen, onClose, onSuccess }: LogPaymentModalProps) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        paymentId: '',
        client: '',
        amount: '',
        method: 'Cash',
        purpose: '',
        space: '',
        invoiceId: '',
        commission: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosInstance.post('/api/spacePartner/payments', formData);

            if (response.data.success) {
                onSuccess();
                onClose();
                setFormData({ paymentId: '', client: '', amount: '', method: 'Cash', purpose: '', space: '', invoiceId: '', commission: '' });
            } else {
                console.error('Failed to log payment:', response.data.message);
            }
        } catch (error) {
            console.error('Failed to log payment', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-background rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-border lg:p-2"
                    >
                        {/* Header */}
                        <div className="relative p-8 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black text-foreground tracking-tight">
                                        Log <span className="text-primary italic">Payment</span>
                                    </h2>
                                    <p className="text-muted-foreground font-medium">Record a new manual transaction into the ledger.</p>
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
                            <div className="max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar p-8 pt-4 space-y-8">
                                {/* Transaction Details */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3 pb-2 border-b border-border">
                                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                            <CreditCard className="w-4 h-4" />
                                        </div>
                                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest">
                                            Transaction Base
                                        </h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                                                Payment Reference
                                            </label>
                                            <div className="relative group">
                                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.paymentId}
                                                    onChange={(e) => setFormData({ ...formData, paymentId: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground/60"
                                                    placeholder="PAY-2024-XXX"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                                                Total Amount
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
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                                                Method
                                            </label>
                                            <div className="relative group">
                                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                                                <select
                                                    value={formData.method}
                                                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-foreground appearance-none bg-no-repeat bg-[right_1rem_center] cursor-pointer"
                                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='hsl(var(--primary))'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundSize: '1rem' }}
                                                >
                                                    <option value="Cash">Cash Settlement</option>
                                                    <option value="UPI">UPI Digital Payment</option>
                                                    <option value="Transfer">Bank IMPS/RTGS</option>
                                                    <option value="Cheque">Physical Cheque</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                                                Platform Commission
                                            </label>
                                            <div className="relative group">
                                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <input
                                                    type="number"
                                                    value={formData.commission}
                                                    onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground/60"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Client & Space Details */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3 pb-2 border-b border-border">
                                        <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest">
                                            Client Association
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                                                Client Full Name
                                            </label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.client}
                                                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground/60"
                                                    placeholder="Enter client's legal name"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                                                Property / Space
                                            </label>
                                            <div className="relative group">
                                                <Layout className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.space}
                                                    onChange={(e) => setFormData({ ...formData, space: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground/60"
                                                    placeholder="Workspace Name"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                                                Linked Invoice Ref
                                            </label>
                                            <div className="relative group">
                                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <input
                                                    type="text"
                                                    value={formData.invoiceId}
                                                    onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground/60"
                                                    placeholder="INV-..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                                            Payment Purpose / Remarks
                                        </label>
                                        <div className="relative group">
                                            <FileText className="absolute left-4 top-4 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <textarea
                                                required
                                                value={formData.purpose}
                                                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-foreground placeholder:text-muted-foreground/60 min-h-[100px] resize-none"
                                                placeholder="Describe the purpose of this payment (e.g., Security Deposit, Furniture Upgrade)"
                                            />
                                        </div>
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
                                            Recording...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
                                            Confirm Payment
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LogPaymentModal;
