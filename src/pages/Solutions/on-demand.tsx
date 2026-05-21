import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarClock, Clock3, MapPin, ShieldCheck, Users } from "lucide-react";

const services = [
  {
    title: "Day Passes",
    desc: "Flexible workspace access for focused solo work or quick team syncs.",
    href: "/solutions/day-passes",
  },
  {
    title: "Meeting Rooms",
    desc: "Professional rooms for client calls, board meetings, and workshops.",
    href: "/solutions/meeting-rooms",
  },
  {
    title: "Training Spaces",
    desc: "Managed spaces for sessions, onboarding programs, and workshops.",
    href: "/solutions/meeting-rooms",
  },
];

const highlights = [
  { label: "Cities", value: "15+", icon: MapPin },
  { label: "Verified Spaces", value: "100+", icon: ShieldCheck },
  { label: "Monthly Bookings", value: "10k+", icon: CalendarClock },
  { label: "Avg. Confirmation", value: "< 2 min", icon: Clock3 },
];

export default function OnDemandSolution() {
  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
      <Header forceWhiteBackground />

      <main className="pt-24 md:pt-28">
        <section className="relative overflow-hidden px-6 py-20 md:px-10 md:py-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-0 top-0 h-[22rem] w-[22rem] rounded-full bg-[#164e4e]/10 blur-[90px]" />
            <div className="absolute bottom-0 left-0 h-[18rem] w-[18rem] rounded-full bg-[#FEF8C5]/15 blur-[80px]" />
          </div>

          <div className="relative mx-auto max-w-6xl text-center">
            <p className="mb-5 inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#164e4e] dark:text-[#FEF8C5]">
              On-Demand Workspace
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-6xl">
              Book Professional Spaces
              <span className="block text-[#164e4e] dark:text-[#FEF8C5]">Only When You Need Them</span>
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg">
              A clean, flexible booking experience for day work, meetings, and business sessions — without subscriptions and without long forms.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild className="rounded-full bg-[#2D3F33] px-7 text-[#FEF8C5] hover:bg-[#344C3D]">
                <Link to="/solutions/day-passes">Explore Day Passes</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-[#2D3F33] px-7 text-[#2D3F33] hover:bg-[#2D3F33] hover:text-[#FEF8C5] dark:border-[#FEF8C5] dark:text-[#FEF8C5] dark:hover:bg-[#FEF8C5] dark:hover:text-[#1f2e26]">
                <Link to="/solutions/meeting-rooms">Explore Meeting Rooms</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="px-6 pb-8 md:px-10 md:pb-12">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">
            {highlights.map((item) => (
              <div key={item.label} className="rounded-2xl border border-[#2D3F33]/10 bg-white p-4 text-center shadow-sm dark:border-white/10 dark:bg-[#0f0f0f]">
                <item.icon className="mx-auto mb-2 h-5 w-5 text-[#2D3F33] dark:text-[#FEF8C5]" />
                <p className="text-2xl font-bold text-[#164e4e] dark:text-white">{item.value}</p>
                <p className="text-xs text-[#164e4e]/70 dark:text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">Choose the Right Format</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Purpose-driven spaces with transparent pricing and fast confirmations.</p>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
              {services.map((service) => (
                <Link key={service.title} to={service.href} className="group rounded-2xl border border-[#2D3F33]/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#2D3F33]/5 dark:border-white/10 dark:bg-[#0f0f0f] dark:hover:bg-white/5">
                  <h3 className="text-xl font-semibold text-[#164e4e] dark:text-white">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#164e4e]/75 dark:text-gray-300">{service.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#2D3F33] dark:text-[#FEF8C5]">
                    View details <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/30 px-6 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">How it Works</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {["Pick your space type", "Choose location and time", "Confirm and start working"].map((step, index) => (
                <div key={step} className="rounded-2xl border border-[#2D3F33]/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0f0f0f]">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#2D3F33] dark:text-[#FEF8C5]">Step 0{index + 1}</p>
                  <p className="mt-2 font-medium text-[#164e4e] dark:text-white">{step}</p>
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
