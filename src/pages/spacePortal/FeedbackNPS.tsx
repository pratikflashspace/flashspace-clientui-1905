import { useState, useEffect } from "react";
import { Star, TrendingUp, MessageSquare, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import reviewService from "@/services/review.service";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
    />
  ));
};

const FeedbackNPS = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [npsStats, setNpsStats] = useState<any>(null);
  const [aiInsight, setAiInsight] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [reviewsRes, statsRes, insightRes] = await Promise.all([
          reviewService.getPartnerReviews({ limit: 4 }),
          reviewService.getPartnerNpsStats(),
          reviewService.getAiInsight(),
        ]);

        setReviews(reviewsRes.reviews || []);
        setNpsStats(statsRes);
        setAiInsight(insightRes);
      } catch (err) {
        console.error("Failed to load feedback data", err);
        toast({
          title: "Error",
          description: "Failed to load feedback and NPS data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const npsScore = npsStats?.nps || 0;
  const avgRating = npsStats?.avgRating || 0;
  const totalResponses = npsStats?.totalResponses || 0;

  const npsBreakdown = [
    {
      label: "Promoters (9-10)",
      count: npsStats?.promoters || 0,
      percentage:
        totalResponses > 0
          ? Math.round(((npsStats?.promoters || 0) / totalResponses) * 100)
          : 0,
      color: "bg-green-500",
    },
    {
      label: "Passives (7-8)",
      count: npsStats?.passives || 0,
      percentage:
        totalResponses > 0
          ? Math.round(((npsStats?.passives || 0) / totalResponses) * 100)
          : 0,
      color: "bg-yellow-500",
    },
    {
      label: "Detractors (0-6)",
      count: npsStats?.detractors || 0,
      percentage:
        totalResponses > 0
          ? Math.round(((npsStats?.detractors || 0) / totalResponses) * 100)
          : 0,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-4xl">
          Feedback & <span className="text-primary italic">NPS</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor client satisfaction and feedback
        </p>
      </div>

      {/* NPS Score Card */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="bg-background border border-border rounded-xl p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Net Promoter Score
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-extrabold text-primary">
              {npsScore}
            </div>
            <div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+5 from last month</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {totalResponses} responses
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-xl p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Average Rating
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-extrabold text-foreground">
              {avgRating.toFixed(1)}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {renderStars(Math.round(avgRating))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Out of 5 stars
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-xl p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Response Rate
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-extrabold text-foreground">72%</div>
            <div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+8% improvement</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {totalResponses} of 108 clients
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Feedback */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-foreground">Recent Feedback</h2>

          {reviews.length === 0 ? (
            <div className="bg-background border border-border rounded-xl p-10 text-center">
              <p className="text-muted-foreground italic">
                No feedback received yet
              </p>
            </div>
          ) : (
            reviews.map((feedback) => (
              <div
                key={feedback._id}
                className="bg-background border border-border rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {feedback.company}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {feedback.spaceName || feedback.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      {renderStars(feedback.rating)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {feedback.createdAt
                        ? format(new Date(feedback.createdAt), "MMM d, yyyy")
                        : "Recent"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feedback.review}
                </p>
              </div>
            ))
          )}
        </div>

        {/* NPS Breakdown */}
        <div className="space-y-4">
          <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">
              NPS Breakdown
            </h3>
            <div className="space-y-4">
              {npsBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-foreground">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <Progress
                    value={item.percentage}
                    className={`h-2 ${item.color}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-foreground mb-2">AI Insight</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {aiInsight ||
                "Your NPS score of 48 is above industry average (35). Focus on improving parking facilities at Chennai location to convert more passives to promoters."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackNPS;
