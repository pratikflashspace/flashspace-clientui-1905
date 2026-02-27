import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SolutionsSection from "@/components/SolutionSection";
import BusinessExcellenceSection from "@/components/BuisnessExellenceSection";
import JourneySection from "@/components/JourneySection";
import TestimonialsSection from "@/components/testmonial";
import FAQSection from "@/components/FAQsection";
import ContactSection from "@/components/ConactSection";
import ImmediateAssistanceSection from "@/components/ImmediateAssistanceSection";
import Footer from "@/components/Footer";

interface IndexProps {
  openLogin?: boolean;
  openSignup?: boolean;
}

const Index = ({ openLogin = false, openSignup = false }: IndexProps) => {
  const [bgColor, setBgColor] = useState("white");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      if (scrollPosition < windowHeight * 0.8) {
        setBgColor("white");
      } else if (scrollPosition < windowHeight * 2.5) {
        setBgColor("#EEF4FF"); // Cool Periwinkle (Professional/Trust)
      } else if (scrollPosition < windowHeight * 4) {
        setBgColor("#FFF9EA"); // Premium Cream (Brand warmth)
      } else {
        setBgColor("#F2F5F8"); // Sophisticated Silver (Modern/Tech)
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="min-h-screen transition-colors duration-700 ease-in-out"
      style={{ backgroundColor: bgColor }}
    >
      <Header openLogin={openLogin} openSignup={openSignup} />
      <main className="relative">
        <HeroSection />
        <SolutionsSection />
        <BusinessExcellenceSection />
        <JourneySection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
        <ImmediateAssistanceSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
