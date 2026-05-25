import KYCVerification from "@/components/ClientDashboard/KYCVerification";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const AffiliateKYC = () => {
    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                        KYC <span className="text-[#4A6D56] italic">Verification</span>
                        <Shield className="w-8 h-8 text-[#35503F]" />
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg font-light">
                        Complete your identity verification to enable full portal features
                    </p>
                </motion.div>

                <div className="px-5 py-3 bg-[#5aa39c]/10 border border-[#5aa39c]/20 rounded-2xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#35503F] animate-pulse" />
                    <span className="text-sm font-semibold text-[#35503F]">Identity Protection Active</span>
                </div>
            </div>

            {/* KYC Component Content */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <KYCVerification />
            </div>
        </div>
    );
};

export default AffiliateKYC;
