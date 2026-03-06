import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { AIInsightModal } from "@/components/modals/AIInsightModal";

interface Feature {
    title: string;
    description: string;
    isAI?: boolean;
    href?: string;
}

interface FeatureSectionProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    features: Feature[];
    className?: string;
}

export const FeatureSection = ({
    title,
    description,
    icon: Icon,
    features,
    className,
}: FeatureSectionProps) => {
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const [selectedAIFeature, setSelectedAIFeature] = useState<string>("");

    const handleFeatureClick = (feature: Feature) => {
        if (feature.isAI) {
            setSelectedAIFeature(feature.title);
            setAiModalOpen(true);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("mb-8", className)}
            >
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-4">
                    {Icon && (
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                        </div>
                    )}
                    <div>
                        <h2 className="text-xl font-bold text-foreground">{title}</h2>
                        {description && (
                            <p className="text-sm text-muted-foreground">{description}</p>
                        )}
                    </div>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => {
                        const CardContent = (
                            <div
                                className={cn(
                                    "h-full bg-background border border-border rounded-xl p-5 transition-all flex flex-col justify-between min-h-[130px]",
                                    (feature.isAI || feature.href) &&
                                    "cursor-pointer hover:border-primary/50 hover:shadow-md"
                                )}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-foreground text-sm pr-2">
                                        {feature.title}
                                    </h3>
                                    {feature.isAI && (
                                        <Badge
                                            variant="secondary"
                                            className="text-xs gap-1 flex-shrink-0"
                                        >
                                            <Sparkles className="w-3 h-3" />
                                            AI
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-auto">
                                    {feature.description}
                                </p>
                            </div>
                        );

                        return (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleFeatureClick(feature)}
                                className="block"
                            >
                                {feature.href ? (
                                    <Link
                                        to={feature.href}
                                        className="block transition-transform hover:scale-[1.01] duration-200"
                                    >
                                        {CardContent}
                                    </Link>
                                ) : (
                                    CardContent
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            <AIInsightModal
                type={selectedAIFeature}
                title={selectedAIFeature}
                open={aiModalOpen}
                onOpenChange={setAiModalOpen}
            />
        </>
    );
};
