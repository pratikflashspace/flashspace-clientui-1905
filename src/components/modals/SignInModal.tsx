import { motion } from "framer-motion";

export const SignInModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-background p-8 rounded-2xl shadow-xl max-w-md w-full relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground">✕</button>
                <h2 className="text-2xl font-bold mb-4">Sign In</h2>
                <p className="text-muted-foreground mb-6">Welcome back to FlashSpace. Please enter your details.</p>
                {/* Placeholder for actual login form */}
                <div className="space-y-4">
                    <input type="email" placeholder="Email" className="w-full p-3 rounded-lg border border-border bg-background" />
                    <input type="password" placeholder="Password" className="w-full p-3 rounded-lg border border-border bg-background" />
                    <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold">Sign In</button>
                </div>
            </motion.div>
        </div>
    );
};