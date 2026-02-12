import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  HelpCircle,
  BookOpen,
  Lightbulb,
  FileText,
  Shield,
  DollarSign,
  Zap,
  Building2,
  Sparkles,
  Users,
  Phone
} from "lucide-react";
import { useState } from "react";
import { useScrollAnimation, getAnimationClasses } from "@/hooks/use-scroll-animation";

import { SALES_FAQS } from '@/pages/admin/learning-hub/learning-hub-data';

interface FAQSectionProps {
  faqs?: Array<{
    id: string;
    question: string;
    answer: string;
    category: string;
  }>;
}

const FAQSection = ({ faqs = SALES_FAQS }: FAQSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const isVisible = useScrollAnimation('faq');

  const categories = [
    { key: "all", label: "All Questions", icon: HelpCircle },
    { key: "basics", label: "Basics", icon: BookOpen },
    { key: "benefits", label: "Benefits", icon: Lightbulb },
    { key: "coworking", label: "Coworking", icon: Users },
    { key: "registration", label: "Registration", icon: FileText },
    { key: "security", label: "Security", icon: Shield },
    { key: "pricing", label: "Pricing", icon: DollarSign },
    { key: "setup", label: "Setup", icon: Zap },
    { key: "facilities", label: "Facilities", icon: Building2 }
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="faq" className="py-20 px-4 relative overflow-hidden bg-transparent dark:bg-[#0a0a0a] transition-colors duration-300">

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${getAnimationClasses(isVisible, 'fadeInUp', 0)}`} style={{ fontFamily: 'Poppins' }}>
            <span className="text-[#172A3A] dark:text-white">Everything You Need to Know</span>
            <br />
            <span className="text-[#0D9488]">Frequently Asked Questions</span>
          </h2>
          <div className={`flex items-center justify-center gap-2 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto ${getAnimationClasses(isVisible, 'fadeInUp', 200)}`}>
            <span>Get instant answers to the most common questions about our virtual office solutions and services.</span>
            <Sparkles className="w-6 h-6 text-[#0D9488] animate-pulse" />
          </div>
        </div>

        {/* Search and Filter */}
        <Card className={`bg-white dark:bg-[#1f1f1f] border-2 border-gray-200 dark:border-white/10 mb-12 shadow-md hover:shadow-xl transition-all duration-300 ${getAnimationClasses(isVisible, 'fadeInUp', 300)}`}>
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-[#172A3A] dark:text-white text-2xl" style={{ fontFamily: 'Poppins' }}>Find Your Answer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Search Bar */}
            <div className="relative">
              <Input
                placeholder="Search for questions, topics, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-3 bg-gray-50 dark:bg-black/30 border-2 border-gray-200 dark:border-white/10 focus:border-[#0D9488] dark:focus:border-[#0D9488] rounded-xl text-base text-[#172A3A] dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
              />
            </div>

            {/* Category Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`
                      group px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 justify-center
                      ${selectedCategory === category.key
                        ? 'bg-[#0D9488] text-white shadow-lg transform scale-105'
                        : 'bg-white dark:bg-[#1f1f1f] border-2 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-[#0D9488] dark:hover:border-[#0D9488] hover:text-[#172A3A] dark:hover:text-white hover:scale-105'
                      }
                    `}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Accordion */}
        <Card className={`bg-white dark:bg-[#1f1f1f] border-2 border-gray-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-300 ${getAnimationClasses(isVisible, 'fadeInUp', 500)}`}>
          <CardContent className="p-0">
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="border-b border-gray-200 dark:border-white/10 last:border-b-0"
                  >
                    <AccordionTrigger className="px-8 py-6 text-left hover:bg-gradient-to-r hover:from-[#0D9488]/5 hover:to-transparent transition-all duration-300 group hover:no-underline">
                      <span className="font-semibold text-[#172A3A] dark:text-white pr-4 group-hover:text-[#0D9488] dark:group-hover:text-[#0D9488] transition-colors duration-300 text-base">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-8 pb-6">
                      <div className="text-gray-600 dark:text-gray-400 leading-relaxed text-base bg-gray-50 dark:bg-black/30 p-4 rounded-lg">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="p-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-[#172A3A]/15 to-[#0D9488]/15 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-[#172A3A]" />
                </div>
                <h3 className="text-lg font-semibold mb-4 text-[#172A3A]" style={{ fontFamily: 'Poppins' }}>No results found</h3>
                <p className="text-gray-600 text-base">
                  Try adjusting your search terms or browse different categories.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Support */}
        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-xl">
            Still have questions? Our support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="tel:+918100888777"
              className="bg-[#0D9488] hover:bg-[#172A3A] text-white px-8 py-4 rounded-xl font-semibold inline-flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Phone className="w-5 h-5" />
              Call Support
            </a>
            <a
              href="mailto:support@flashspace.co"
              className="bg-white dark:bg-[#1f1f1f] border-2 border-gray-200 dark:border-white/10 text-[#172A3A] dark:text-white hover:bg-[#172A3A] hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-md"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;