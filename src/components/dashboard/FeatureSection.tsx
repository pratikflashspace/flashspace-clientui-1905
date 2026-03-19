import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Feature {
  title: string;
  description: string;
  isAI?: boolean;
  href?: string;
}

interface FeatureSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  features?: Feature[];
  children?: React.ReactNode;
  className?: string;
}

export const FeatureSection = ({
  title,
  description,
  icon,
  features,
  children,
  className,
}: FeatureSectionProps) => {
  const navigate = useNavigate();

  const handleFeatureClick = (feature: Feature) => {
    if (feature.isAI) {
      console.log("AI Feature clicked:", feature.title);
    } else if (feature.href) {
      navigate(feature.href);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("mb-8", className)}
    >
      <div className="flex items-center gap-3 mb-6">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">{title}</h2>
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      {children ? (
        children
      ) : features ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleFeatureClick(feature)}
              className={cn(
                "bg-muted/30 border border-border rounded-xl p-5 transition-all text-left",
                (feature.isAI || feature.href) &&
                "cursor-pointer hover:border-primary/50 hover:shadow-md hover:bg-background",
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground text-sm">
                  {feature.title}
                </h3>
                {feature.isAI && (
                  <Badge
                    variant="secondary"
                    className="text-xs gap-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full px-2.5 py-0.5 border-transparent flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <Sparkles className="w-3 h-3" />
                    AI
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      ) : null}
    </motion.div>
  );
};
