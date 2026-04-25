import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllPartnerSpaces } from "@/services/spacePortal/spacePartner.service";
import { getPropertyBookingsForPartner } from "@/services/property.service";
import { mailService } from "@/services/mailService";
import { visitService } from "@/services/visitService";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building2, 
  CalendarCheck, 
  Mail, 
  Users, 
  ArrowUpRight,
  ClipboardList
} from "lucide-react";

type SpaceSummary = {
  id: string;
  name: string;
  bookingsCount: number;
  mailCount: number;
  visitCount: number;
};

export default function SummaryAnalytics() {
  const navigate = useNavigate();
  const [summaries, setSummaries] = useState<SpaceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        const [spacesRes, mailRes, visitRes] = await Promise.all([
          fetchAllPartnerSpaces(),
          mailService.getAll(),
          visitService.getAll()
        ]);

        const rawSpaces = spacesRes?.data || (Array.isArray(spacesRes) ? spacesRes : []);
        const mails = mailRes.success ? mailRes.data : [];
        const visits = visitRes.success ? visitRes.data : [];

        const aggregated = await Promise.all(
          rawSpaces.map(async (space: any) => {
            const spaceId = space._id || space.id;
            
            // Get bookings for this space
            let bookingsCount = 0;
            try {
              const bookings = await getPropertyBookingsForPartner(spaceId);
              bookingsCount = Array.isArray(bookings) ? bookings.length : 0;
            } catch (e) {
              console.error(`Failed to fetch bookings for space ${spaceId}`, e);
            }

            // Count mails for this space
            const spaceMailCount = mails.filter((m: any) => m.space === spaceId || m.space === space.name).length;
            
            // Count visits for this space
            const spaceVisitCount = visits.filter((v: any) => v.space === spaceId || v.space === space.name).length;

            return {
              id: spaceId,
              name: space.name,
              bookingsCount,
              mailCount: spaceMailCount,
              visitCount: spaceVisitCount
            };
          })
        );

        setSummaries(aggregated);
      } catch (error) {
        console.error("Failed to load summary analytics", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 bg-muted/50" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 bg-muted/50 rounded-2xl" />
          <Skeleton className="h-32 bg-muted/50 rounded-2xl" />
          <Skeleton className="h-32 bg-muted/50 rounded-2xl" />
        </div>
        <Skeleton className="h-[400px] w-full bg-muted/50 rounded-2xl" />
      </div>
    );
  }

  const totals = summaries.reduce(
    (acc, curr) => ({
      bookings: acc.bookings + curr.bookingsCount,
      mail: acc.mail + curr.mailCount,
      visits: acc.visits + curr.visitCount,
    }),
    { bookings: 0, mail: 0, visits: 0 }
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h1 className="text-4xl">
          Summary <span className="text-primary italic">Reports</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Overview of activity across all your spaces
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <StatCard 
          title="Total Bookings" 
          value={totals.bookings} 
          icon={CalendarCheck} 
          color="text-primary"
          bg="bg-primary/5"
          onClick={() => navigate("/spaceportal/booking-analytics#space-bookings")}
        />
        <StatCard 
          title="Total Mail" 
          value={totals.mail} 
          icon={Mail} 
          color="text-rose-600"
          bg="bg-rose-50"
          onClick={() => navigate("/spaceportal/mail-visits?tab=mail")}
        />
        <StatCard 
          title="Total Visits" 
          value={totals.visits} 
          icon={Users} 
          color="text-amber-600"
          bg="bg-amber-50"
          onClick={() => navigate("/spaceportal/mail-visits?tab=visits")}
        />
      </div>

      <div className="bg-background border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/20">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            Performance by Space
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider">Space Name</th>
                <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider text-center">Bookings</th>
                <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider text-center">Mail Logs</th>
                <th className="px-6 py-4 text-xs font-extrabold text-foreground uppercase tracking-wider text-center">Visitor Logs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {summaries.map((s) => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-foreground">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/5 text-primary font-bold">
                      {s.bookingsCount}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-50 text-rose-600 font-bold">
                      {s.mailCount}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 text-amber-600 font-bold">
                      {s.visitCount}
                    </span>
                  </td>
                </tr>
              ))}
              {summaries.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-muted-foreground italic">
                    No spaces found for your account.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="bg-background border border-border rounded-2xl p-6 shadow-sm hover:translate-y-[-2px] transition-all duration-300 cursor-pointer group active:scale-95"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all" />
      </div>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-extrabold text-foreground tracking-tight">{value}</h3>
    </div>
  );
}
