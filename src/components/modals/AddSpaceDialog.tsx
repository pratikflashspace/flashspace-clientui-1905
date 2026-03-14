import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Building2, X, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AddSpaceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const AddSpaceDialog: React.FC<AddSpaceDialogProps> = ({
    open,
    onOpenChange,
}) => {
    const navigate = useNavigate();
    const onClose = () => onOpenChange(false);

    return (
        <>
            {open && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <div
                        className="relative bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-border text-slate-900 opacity-100"
                    >
                        {/* Header Decoration */}
                        <div className="h-32 bg-primary/10 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-0 left-0 w-32 h-32 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="p-4 bg-background rounded-2xl shadow-xl border border-border shadow-primary/5">
                                    <Building2 className="w-10 h-10 text-primary" />
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 hover:bg-background/50 rounded-xl transition-all text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar">
                            <div className="p-8 text-center space-y-6">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black text-foreground tracking-tight">
                                        Expand Your <span className="text-primary italic">Portfolio</span>
                                    </h2>
                                    <p className="text-muted-foreground text-sm font-medium leading-relaxed px-4">
                                        You're about to start the onboarding process for a new workspace listing.
                                    </p>
                                </div>

                                <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 text-left space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 bg-primary/20 text-primary rounded-lg mt-0.5">
                                            <Sparkles className="w-3.5 h-3.5" />
                                        </div>
                                        <p className="text-xs font-bold text-foreground">
                                            Guided Onboarding
                                            <span className="block font-medium text-muted-foreground/70 mt-0.5">We'll help you set up KYC, property details, and services.</span>
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-1.5 bg-primary/20 text-primary rounded-lg mt-0.5">
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </div>
                                        <p className="text-xs font-bold text-foreground">
                                            Live in Minutes
                                            <span className="block font-medium text-muted-foreground/70 mt-0.5">Once verified, your space will be visible to thousands of clients.</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 pt-2">
                                    <Button
                                        onClick={() => {
                                            onClose();
                                            navigate("/spaceportal/space-management/add");
                                        }}
                                        className="h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-base shadow-lg shadow-primary/10 flex items-center justify-center gap-2 group"
                                    >
                                        Start Onboarding
                                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                    </Button>
                                    <Button
                                        onClick={onClose}
                                        variant="ghost"
                                        className="h-12 rounded-xl text-muted-foreground font-bold hover:bg-muted"
                                    >
                                        Maybe Later
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

