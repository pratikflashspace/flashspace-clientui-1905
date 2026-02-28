import { X, Users, Building2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PartnerChoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (role: 'partner' | 'affiliate') => void;
}

export const PartnerChoiceModal = ({ isOpen, onClose, onSelect }: PartnerChoiceModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={onClose} />

            <div
                className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl p-8 md:p-12 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
                style={{ fontFamily: 'Poppins' }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-[#172A3A] mb-3">Become a Partner</h2>
                    <p className="text-slate-600 text-lg">Choose how you want to grow with FlashSpace</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Affiliate Option */}
                    <button
                        onClick={() => onSelect('affiliate')}
                        className="group relative flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-slate-100 hover:border-[#4DA1FF] bg-white hover:bg-[#4DA1FF]/5 transition-all duration-300 shadow-sm hover:shadow-xl"
                    >
                        <div className="p-4 rounded-2xl bg-[#4DA1FF]/10 text-[#4DA1FF] group-hover:scale-110 transition-transform duration-300">
                            <Users size={40} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-[#172A3A] mb-2">Affiliate Partner</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Refer businesses and earn attractive commissions on every successful booking.
                            </p>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-[#4DA1FF] font-bold text-sm">
                            Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                    {/* Space Partner Option */}
                    <button
                        onClick={() => onSelect('partner')}
                        className="group relative flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-slate-100 hover:border-[#EDB003] bg-white hover:bg-[#EDB003]/5 transition-all duration-300 shadow-sm hover:shadow-xl"
                    >
                        <div className="p-4 rounded-2xl bg-[#EDB003]/10 text-[#EDB003] group-hover:scale-110 transition-transform duration-300">
                            <Building2 size={40} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-[#172A3A] mb-2">Space Partner</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                List your workspace and reach thousands of potential clients looking for space.
                            </p>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-[#EDB003] font-bold text-sm">
                            List Your Space <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};
