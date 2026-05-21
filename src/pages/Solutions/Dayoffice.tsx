import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock3, Coffee, Monitor, ShieldCheck, Wifi, ArrowRight } from "lucide-react";

const plans = [
  { name: "Solo Day Pass", price: "₹699/day", desc: "Quiet desk, internet, and shared amenities." },
  { name: "Manager Cabin", price: "₹999/day", desc: "Private setup for focused calls and execution." },
  { name: "Team Day Cabin", price: "₹1,999/day", desc: "Small team collaboration with privacy and comfort." },
];

const includes = [
  { label: "High-Speed WiFi", icon: Wifi },
  { label: "Ergonomic Setup", icon: Monitor },
  { label: "Secure Access", icon: ShieldCheck },
  { label: "Complimentary Coffee", icon: Coffee },
  { label: "Flexible Hours", icon: Clock3 },
];

export default function DayOfficePage() {
  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
      <Header forceWhiteBackground />

      <main className="pt-24 md:pt-28">
        <section className="relative overflow-hidden px-6 py-20 md:px-10 md:py-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-0 top-0 h-[24rem] w-[24rem] rounded-full bg-[#164e4e]/10 blur-[90px]" />
            <div className="absolute bottom-0 left-0 h-[18rem] w-[18rem] rounded-full bg-[#FEF8C5]/15 blur-[80px]" />
          </div>

          <div className="relative mx-auto max-w-6xl">
            <p className="mb-5 inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#164e4e] dark:text-[#FEF8C5]">
              Day Passes
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-6xl">
              Professional Workday Access
              <span className="block text-[#164e4e] dark:text-[#FEF8C5]">Without Long-Term Commitments</span>
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg">
              A clean, premium day-office experience for deep work, client discussions, and team productivity — built for flexibility.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-[#2D3F33] px-7 text-[#FEF8C5] hover:bg-[#344C3D]">
                <Link to="/start-chatting">Check Availability</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-[#2D3F33] px-7 text-[#2D3F33] hover:bg-[#2D3F33] hover:text-[#FEF8C5] dark:border-[#FEF8C5] dark:text-[#FEF8C5] dark:hover:bg-[#FEF8C5] dark:hover:text-[#1f2e26]">
                <Link to="/solutions/on-demand">Back to On-Demand</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="px-6 py-14 md:px-10 md:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">Choose Your Day Plan</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Simple options with transparent pricing and professional ambience.</p>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
              {plans.map((plan) => (
                <div key={plan.name} className="rounded-2xl border border-[#2D3F33]/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0f0f0f]">
                  <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[#2D3F33] dark:text-[#FEF8C5]">{plan.name}</p>
                  <p className="mt-2 text-3xl font-bold text-[#164e4e] dark:text-white">{plan.price}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#164e4e]/75 dark:text-gray-300">{plan.desc}</p>
                  <Link to="/start-chatting" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[#2D3F33] dark:text-[#FEF8C5]">
                    Book now <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/30 px-6 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">What’s Included</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
              {includes.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[#2D3F33]/10 bg-white p-4 text-center shadow-sm dark:border-white/10 dark:bg-[#0f0f0f]">
                  <item.icon className="mx-auto mb-2 h-5 w-5 text-[#2D3F33] dark:text-[#FEF8C5]" />
                  <p className="text-sm font-medium text-[#164e4e] dark:text-white">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
