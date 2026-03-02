import { motion } from "framer-motion";

export const UpdatesPanel = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-background p-8 rounded-2xl shadow-xl max-w-md w-full relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-foreground/50 hover:text-foreground">✕</button>
                <h2 className="text-2xl font-bold mb-4">Product Updates</h2>
                <div className="space-y-6">
                    <div className="border-l-2 border-primary pl-4">
                        <p className="text-sm font-bold">New Locations in Mumbai</p>
                        <p className="text-xs text-muted-foreground">2 days ago • Workspace Expansion</p>
                    </div>
                    <div className="border-l-2 border-primary pl-4">
                        <p className="text-sm font-bold">AI Search Improvements</p>
                        <p className="text-xs text-muted-foreground">1 week ago • Platform Update</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};