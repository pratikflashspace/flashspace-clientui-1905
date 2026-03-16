import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Medal, Crown, Star, Trophy } from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNavItems";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminService } from "@/services/admin.service";
import toast from "react-hot-toast";

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return null;
};

const getRankBg = (rank: number) => {
  if (rank === 1) return "bg-yellow-50 border-yellow-200";
  if (rank === 2) return "bg-gray-50 border-gray-200";
  if (rank === 3) return "bg-amber-50 border-amber-200";
  return "bg-background border-border";
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    sales: "Sales Executive",
    admin: "Admin",
    super_admin: "Super Admin",
    support: "Support Agent",
  };
  return labels[role] ?? role;
};

const Leaderboard = () => {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [supportData, setSupportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await adminService.getLeaderboard();
        if (res.success && res.data) {
          setSalesData(res.data.sales);
          setSupportData(res.data.support);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
        toast.error("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <DashboardLayout
      portalName="FlashSpace Admin"
      portalDescription="Complete platform management"
      navItems={ADMIN_NAV_ITEMS}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Team <span className="text-primary italic">Leaderboard</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Track performance and celebrate top performers
        </p>
      </div>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sales">Sales Team</TabsTrigger>
          <TabsTrigger value="support">Support Team</TabsTrigger>
        </TabsList>

        {/* ── SALES TAB ── */}
        <TabsContent value="sales">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              Loading leaderboard…
            </div>
          ) : salesData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
              <Trophy className="w-12 h-12 opacity-20" />
              <p>No sales team members found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {salesData.map((person) => (
                <div
                  key={person._id}
                  className={`rounded-xl p-5 border ${getRankBg(person.rank)}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank icon / number */}
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-lg shrink-0">
                      {getRankIcon(person.rank) || `#${person.rank}`}
                    </div>

                    {/* Avatar */}
                    <Avatar className="w-12 h-12 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {getInitials(person.fullName)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Name + role */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground truncate">
                        {person.fullName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {getRoleLabel(person.role)}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8 text-center">
                      <div>
                        <p className="text-2xl font-extrabold text-foreground">
                          #{person.rank}
                        </p>
                        <p className="text-xs text-muted-foreground">Rank</p>
                      </div>
                      <div>
                        <p className="text-2xl font-extrabold text-foreground truncate">
                          {person.email.split("@")[0]}
                        </p>
                        <p className="text-xs text-muted-foreground">Handle</p>
                      </div>
                      {/* Star rating column */}
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── SUPPORT TAB ── */}
        <TabsContent value="support">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              Loading leaderboard…
            </div>
          ) : supportData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
              <Trophy className="w-12 h-12 opacity-20" />
              <p>No support activity found yet.</p>
              <p className="text-xs">
                Support staff appear here after they are assigned to tickets.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {supportData.map((person) => (
                <div
                  key={person._id}
                  className={`rounded-xl p-5 border ${getRankBg(person.rank)}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank icon / number */}
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-lg shrink-0">
                      {getRankIcon(person.rank) || `#${person.rank}`}
                    </div>

                    {/* Avatar */}
                    <Avatar className="w-12 h-12 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {getInitials(person.fullName)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Name + role */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground truncate">
                        {person.fullName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {getRoleLabel(person.role)}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-8 text-center">
                      <div>
                        <p className="text-2xl font-extrabold text-foreground">
                          {person.totalTickets}
                        </p>
                        <p className="text-xs text-muted-foreground">Tickets</p>
                      </div>
                      <div>
                        <p className="text-2xl font-extrabold text-green-600">
                          {person.resolvedTickets}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Resolved
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-extrabold text-foreground truncate">
                          {person.resolution}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Avg Time
                        </p>
                      </div>
                      <div>
                        <p
                          className={`text-2xl font-extrabold ${
                            person.resolutionRate >= 80
                              ? "text-green-600"
                              : "text-foreground"
                          }`}
                        >
                          {person.resolutionRate}%
                        </p>
                        <p className="text-xs text-muted-foreground">Rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Leaderboard;
