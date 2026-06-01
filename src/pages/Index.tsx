import Header from "@/components/Header";
import { HeroWithSearch } from "@/components/sections/HeroWithSearch";
import { ScrollNavLayout } from "@/components/sections/ScrollNavLayout";
import { PlanLocationsShowcase } from "@/components/sections/PlanLocationsShowcase";

import { ScaleSection } from "@/components/sections/ScaleSection";
import { MetricsOverview } from "@/components/sections/MetricsOverview";
import { Stats } from "@/components/sections/Stats";
import { FounderTestimonial } from "@/components/sections/FounderTestimonial";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTA } from "@/components/sections/CTA";
import Footer from "@/components/Footer";
import { TrustedByFilmstrip } from "@/components/sections/TrustedByFilmstrip";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

import { MobileBrowseCities } from "@/components/sections/MobileBrowseCities";
import { WeGotFeatured } from "@/components/sections/WeGotFeatured";

const FadeInSection = ({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay }}
  >
    {children}
  </motion.div>
);

interface IndexProps {
  openLogin?: boolean;
  openSignup?: boolean;
}

const Index = ({ openLogin = false, openSignup = false }: IndexProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    let hasOpened = false;
    
    // Auto-open chat widget when scrolling past hero section (Only on Home Page)
    const handleScroll = () => {
      if (!hasOpened && window.scrollY > window.innerHeight * 0.7) {
        const widget = document.querySelector("chat-widget");
        if (widget && widget.shadowRoot) {
          const button = widget.shadowRoot.querySelector("button");
          if (button) {
            button.click();
            hasOpened = true;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col scroll-smooth relative w-full">
      <Header openLogin={openLogin} openSignup={openSignup} />
      <main className="flex-1 w-full relative">
        <HeroWithSearch />
        {/* <FadeInSection>
          <Stats />
        </FadeInSection>
        <div className="hidden lg:block">
          <TrustedByFilmstrip />
        </div>
        <FadeInSection>
          <PlanLocationsShowcase />
        </FadeInSection>
        <MobileBrowseCities />
        <ScrollNavLayout />
        <FadeInSection>
          <ScaleSection />
        </FadeInSection>
        <FadeInSection>
          <MetricsOverview />
        </FadeInSection>
        <div className="block lg:hidden">
          <TrustedByFilmstrip />
        </div>
        <FadeInSection>
          <FounderTestimonial />
        </FadeInSection>
        <WeGotFeatured />
        <FadeInSection>
          <FAQSection />
        </FadeInSection>
        <FadeInSection>
          <CTA />
        </FadeInSection> */}



      </main>
      <Footer />
    </div>
  );
};

export default Index;
