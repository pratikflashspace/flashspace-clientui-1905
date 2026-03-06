import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarClock, Monitor, ShieldCheck, Users, Wifi } from "lucide-react";

const roomTypes = [
  { name: "Meeting Room", capacity: "2–8 seats", price: "From ₹1,200/hr" },
  { name: "Board Room", capacity: "8–16 seats", price: "From ₹2,500/hr" },
  { name: "Training Room", capacity: "20–50 seats", price: "From ₹3,500/hr" },
  { name: "Conference Room", capacity: "20–50 seats", price: "From ₹5,000/hr" },
];

const amenities = [
  { label: "High-Speed Internet", icon: Wifi },
  { label: "AV & Display Setup", icon: Monitor },
  { label: "Access Control", icon: ShieldCheck },
  { label: "Flexible Capacity", icon: Users },
  { label: "Quick Booking", icon: CalendarClock },
];

const faq = [
  {
    q: "Can I book rooms for just one hour?",
    a: "Yes, hourly bookings are available across most locations.",
  },
  {
    q: "Are amenities included in pricing?",
    a: "Core facilities like WiFi and standard room setup are included. Add-ons vary by location.",
  },
  {
    q: "Do you support recurring team bookings?",
    a: "Yes, recurring and bulk bookings are supported for teams and enterprises.",
  },
];

export default function MeetingRoomsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
      <Header forceWhiteBackground />

      <main className="pt-24 md:pt-28">
        <section className="relative overflow-hidden px-6 py-20 md:px-10 md:py-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-0 top-0 h-[24rem] w-[24rem] rounded-full bg-[#164e4e]/10 blur-[90px]" />
            <div className="absolute bottom-0 left-0 h-[18rem] w-[18rem] rounded-full bg-[#FDE68A]/15 blur-[80px]" />
          </div>

          <div className="relative mx-auto max-w-6xl">
            <p className="mb-5 inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#164e4e] dark:text-[#FDE68A]">
              Meeting Rooms
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-6xl">
              Business-Ready Rooms
              <span className="block text-[#164e4e] dark:text-[#FDE68A]">For Calls, Reviews, and Team Sessions</span>
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg">
              Premium room inventory with reliable infrastructure, predictable pricing, and smooth booking support.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-[#2D3F33] px-7 text-[#FDE68A] hover:bg-[#344C3D]">
                <Link to="/start-chatting">Book a Room</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-[#2D3F33] px-7 text-[#2D3F33] hover:bg-[#2D3F33] hover:text-[#FDE68A] dark:border-[#FDE68A] dark:text-[#FDE68A] dark:hover:bg-[#FDE68A] dark:hover:text-[#1f2e26]">
                <Link to="/solutions/on-demand">Back to On-Demand</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="px-6 py-14 md:px-10 md:py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">Room Formats</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Choose according to team size, meeting type, and duration.</p>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {roomTypes.map((room) => (
                <div key={room.name} className="rounded-2xl border border-[#2D3F33]/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#0f0f0f]">
                  <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[#2D3F33] dark:text-[#FDE68A]">{room.name}</p>
                  <p className="mt-3 text-sm text-[#164e4e]/75 dark:text-gray-300">{room.capacity}</p>
                  <p className="mt-1 text-xl font-bold text-[#164e4e] dark:text-white">{room.price}</p>
                  <Link to="/start-chatting" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[#2D3F33] dark:text-[#FDE68A]">
                    Book now <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/30 px-6 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">Included Amenities</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
              {amenities.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[#2D3F33]/10 bg-white p-4 text-center shadow-sm dark:border-white/10 dark:bg-[#0f0f0f]">
                  <item.icon className="mx-auto mb-2 h-5 w-5 text-[#2D3F33] dark:text-[#FDE68A]" />
                  <p className="text-sm font-medium text-[#164e4e] dark:text-white">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:px-10 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">FAQs</h2>
            <div className="mt-8 space-y-4">
              {faq.map((item) => (
                <div key={item.q} className="rounded-2xl border border-[#2D3F33]/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0f0f0f]">
                  <p className="font-semibold text-[#164e4e] dark:text-white">{item.q}</p>
                  <p className="mt-2 text-sm text-[#164e4e]/75 dark:text-gray-300">{item.a}</p>
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
