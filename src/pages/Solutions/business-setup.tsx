import { useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function BusinessSetupComingSoon() {
  useEffect(() => {
    document.title = "Business Setup — Coming Soon";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Inter Tight', sans-serif" }}>
      <Header forceWhiteBackground />

      <main className="pt-24 md:pt-28">
        <section className="relative overflow-hidden px-6 py-20 md:px-10 md:py-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-0 top-0 h-[24rem] w-[24rem] rounded-full bg-[#164e4e]/10 blur-[90px]" />
            <div className="absolute bottom-0 left-0 h-[18rem] w-[18rem] rounded-full bg-[#FEF8C5]/10 blur-[80px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto max-w-3xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm md:p-12"
          >
            <p className="mb-4 inline-flex items-center rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#164e4e] dark:text-[#FEF8C5]">
              FlashSpace Services
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-5xl">
              Business Setup
              <span className="block text-[#164e4e] dark:text-[#FEF8C5]">Coming Soon</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg">
              We’re building a better, faster Business Setup experience for you. This page is currently under preparation and will be live shortly.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => (window.location.href = "/")}
                className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full bg-[#2D3F33] px-6 text-sm font-semibold text-[#FEF8C5] hover:bg-[#344C3D]"
              >
                Go to Home
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/start-chatting")}
                className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full border-[#2D3F33] px-6 text-sm font-semibold text-[#2D3F33] hover:bg-[#2D3F33] hover:text-[#FEF8C5] dark:border-[#FEF8C5] dark:text-[#FEF8C5] dark:hover:bg-[#FEF8C5] dark:hover:text-[#1f2e26]"
              >
                Contact Team
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
