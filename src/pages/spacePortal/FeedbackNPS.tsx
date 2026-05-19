import { useState, useEffect } from "react";
import { Star, TrendingUp, MessageSquare, Activity } from "lucide-react";
import reviewService from "@/services/review.service";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const renderStars = (rating: any) => {
  const r = Number(rating) || 0;
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${i < r ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
    />
  ));
};

const FeedbackNPS = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [npsStats, setNpsStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 3;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [reviewsRes, statsRes] = await Promise.all([
          reviewService.getPartnerReviews({ limit, page }),
          reviewService.getPartnerNpsStats(),
        ]);

        setReviews(reviewsRes.reviews || []);
        setTotalPages(reviewsRes.pagination?.pages || 1);
        setNpsStats(statsRes);
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
  }, [page]);

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const npsScore = Number(npsStats?.nps) || 0;
  const avgRating = Number(npsStats?.avgRating) || 0;
  const totalResponses = Number(npsStats?.totalResponses) || 0;

  const npsBreakdown = [
    {
      label: "Promoters (9-10)",
      count: Number(npsStats?.promoters) || 0,
      percentage:
        totalResponses > 0
          ? Math.round(((Number(npsStats?.promoters) || 0) / totalResponses) * 100)
          : 0,
      color: "bg-green-500",
    },
    {
      label: "Passives (7-8)",
      count: Number(npsStats?.passives) || 0,
      percentage:
        totalResponses > 0
          ? Math.round(((Number(npsStats?.passives) || 0) / totalResponses) * 100)
          : 0,
      color: "bg-yellow-500",
    },
    {
      label: "Detractors (0-6)",
      count: Number(npsStats?.detractors) || 0,
      percentage:
        totalResponses > 0
          ? Math.round(((Number(npsStats?.detractors) || 0) / totalResponses) * 100)
          : 0,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#35503F] tracking-tight">
          Feedback & <span className="text-[#4A6D56] italic">NPS</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor client satisfaction and feedback
        </p>
      </div>

      {/* NPS Score Card */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Net Promoter Score
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-extrabold text-primary">
              {npsScore}
            </div>
            <div>
              <div className="flex items-center gap-1 text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-xs">
                Performance Score
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Based on {totalResponses} responses
              </p>
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
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

        <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Total Responses
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-extrabold text-foreground">{totalResponses}</div>
            <div>
              <div className="flex items-center gap-1 text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded text-xs">
                Active Feedback
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Cumulative feedback
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Feedback */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Feedback</h2>
            
            {/* Header Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center gap-3">
                <button
                  disabled={page === 1 || loading}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="p-1.5 border rounded-md hover:bg-muted disabled:opacity-30 transition-colors"
                  title="Previous Page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page === totalPages || loading}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="p-1.5 border rounded-md hover:bg-muted disabled:opacity-30 transition-colors"
                  title="Next Page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4 flex-1">
            {reviews.length === 0 ? (
              <div className="bg-background border border-border rounded-xl p-10 text-center shadow-sm">
                <p className="text-muted-foreground italic">
                  No feedback received yet
                </p>
              </div>
            ) : (
              reviews.map((feedback) => (
                <div
                  key={feedback._id}
                  className="bg-background border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {feedback.company}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {feedback.spaceName || feedback.location}
                        {feedback.spaceId && (
                          <span className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">
                            ID: {feedback.spaceId}
                          </span>
                        )}
                        {feedback.source === 'support_ticket' && (
                          <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase">
                            Ticket {feedback.ticketNumber ? `#${feedback.ticketNumber}` : ""}
                          </span>
                        )}
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
                  <p className="text-sm text-muted-foreground leading-relaxed italic bg-muted/20 p-3 rounded-lg border-l-2 border-primary/20">
                    "{feedback.review || "No remarks provided"}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* NPS Breakdown */}
        <div className="space-y-4">
          <div className="bg-background border border-border rounded-xl p-5 shadow-sm h-fit">
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
                  <div className={`h-2 w-full bg-muted rounded-full mt-1 overflow-hidden shadow-inner`}>
                    <div 
                      className={`h-full ${item.color} transition-all duration-1000 ease-out rounded-full`} 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-foreground mb-2 text-sm uppercase tracking-wider text-muted-foreground">Feedback Tip</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Consistently high ratings from support tickets translate to higher customer retention. Engage with promoters to collect success stories!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackNPS;
