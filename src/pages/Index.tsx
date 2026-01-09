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
  return (
    <div className="min-h-screen">
      <Header openLogin={openLogin} openSignup={openSignup} />
      <main>
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
