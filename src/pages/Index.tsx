import Header from "@/components/Header";
import { HeroWithSearch } from "@/components/sections/HeroWithSearch";
import { ScrollNavLayout } from "@/components/sections/ScrollNavLayout";
import { PlanLocationsShowcase } from "@/components/sections/PlanLocationsShowcase";
import { FeatureCTA } from "@/components/sections/FeatureCTA";
import { Stats } from "@/components/sections/Stats";
import { FounderTestimonial } from "@/components/sections/FounderTestimonial";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTA } from "@/components/sections/CTA";
import Footer from "@/components/Footer";
import { TrustedByFilmstrip } from "@/components/sections/TrustedByFilmstrip";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useRegion } from "@/contexts/RegionContext";
import { UAELanding } from "./regional/UAELanding";

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
  const { region } = useRegion();

  // Completely different frontend for UAE
  if (region === "AE") {
    return <UAELanding />;
  }

  return (
    <div className="min-h-screen flex flex-col scroll-smooth relative w-full">
      <Header openLogin={openLogin} openSignup={openSignup} />
      <main className="flex-1 w-full relative">
        <HeroWithSearch />
        <TrustedByFilmstrip />
        <FadeInSection>
          <PlanLocationsShowcase />
        </FadeInSection>
        <ScrollNavLayout />
        <FadeInSection>
          <FeatureCTA />
        </FadeInSection>
        <FadeInSection>
          <Stats />
        </FadeInSection>
        <FadeInSection>
          <FounderTestimonial />
        </FadeInSection>
        <FadeInSection>
          <FAQSection />
        </FadeInSection>
        <FadeInSection>
          <CTA />
        </FadeInSection>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
