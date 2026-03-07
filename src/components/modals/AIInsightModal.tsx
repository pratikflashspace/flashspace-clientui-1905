import { Sparkles, X, TrendingUp, Zap, BarChart2, Brain } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface AIInsightModalProps {
    type: string;
    title: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const insightData: Record<
    string,
    { summary: string; bullets: string[]; icon: React.ElementType }
> = {
    default: {
        summary:
            "AI-powered insights are being generated for this feature to help you make smarter decisions.",
        bullets: [
            "Analyzes real-time data patterns",
            "Generates actionable recommendations",
            "Learns from historical trends",
        ],
        icon: Brain,
    },
};

export const AIInsightModal = ({
    type,
    title,
    open,
    onOpenChange,
}: AIInsightModalProps) => {
    const data = insightData[type] ?? insightData["default"];
    const InsightIcon = data.icon;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-2xl border-border bg-background p-6 shadow-xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-bold text-foreground leading-tight">
                                {title}
                            </DialogTitle>
                            <Badge variant="secondary" className="text-[10px] gap-1 mt-0.5">
                                <Sparkles className="w-2.5 h-2.5" />
                                AI Powered
                            </Badge>
                        </div>
                    </div>
                </DialogHeader>

                <div className="mt-3 space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {data.summary}
                    </p>

                    <div className="space-y-2">
                        {data.bullets.map((bullet, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <div className="mt-0.5 w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Zap className="w-3 h-3 text-primary" />
                                </div>
                                <p className="text-sm text-foreground/80">{bullet}</p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-xl bg-muted/50 border border-border p-3 flex items-center gap-3">
                        <BarChart2 className="w-5 h-5 text-primary flex-shrink-0" />
                        <p className="text-xs text-muted-foreground">
                            Insights are updated in real-time based on your workspace data.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
