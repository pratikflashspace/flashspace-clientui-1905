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

const FAQSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const isVisible = useScrollAnimation('faq');

  const faqs = [
    // --- Pricing & Plans ---
    {
      id: "pricing-1",
      question: "Are there any hidden charges?",
      answer: "No. All pricing is transparent and clearly communicated upfront. Any optional add-ons (like additional mail forwarding or meeting room usage) are discussed before billing.",
      category: "pricing"
    },
    {
      id: "pricing-2",
      question: "Why is your pricing higher than some competitors?",
      answer: "Our pricing includes compliance-ready documentation, verified locations, and ongoing support. Many cheaper options exclude critical documents or charge later.",
      category: "pricing"
    },
    {
      id: "pricing-3",
      question: "Do you offer monthly and yearly plans?",
      answer: "Yes. Monthly plans offer flexibility, while yearly plans are more cost-effective and recommended for GST and compliance use cases.",
      category: "pricing"
    },
    {
      id: "pricing-4",
      question: "Can I upgrade my plan later?",
      answer: "Yes. Clients can upgrade plans at any time. The price difference is adjusted accordingly.",
      category: "pricing"
    },

    // --- Virtual Office & Legality ---
    {
      id: "legal-1",
      question: "Is the virtual office address legally valid?",
      answer: "Yes. All addresses are commercially approved and legally valid for business registration, GST, and official correspondence.",
      category: "registration"
    },
    {
      id: "legal-2",
      question: "Can I use this address for GST registration?",
      answer: "Yes. The address can be used for GST registration and comes with all required supporting documents.",
      category: "registration"
    },
    {
      id: "legal-3",
      question: "Will GST officers physically verify the address?",
      answer: "In some cases, yes. Our locations are prepared for verification and supported by proper documentation.",
      category: "registration"
    },
    {
      id: "legal-4",
      question: "Is this address accepted by banks?",
      answer: "Most major banks accept it. Final acceptance depends on the bank’s internal verification process.",
      category: "registration"
    },

    // --- Documents & Compliance ---
    {
      id: "docs-1",
      question: "What documents will I receive?",
      answer: "You will receive a No Objection Certificate (NOC), Service Agreement, Address Proof, and Utility Bill (where applicable).",
      category: "registration"
    },
    {
      id: "docs-2",
      question: "Are the documents legally valid?",
      answer: "Yes. All documents are digitally signed and legally valid for compliance and verification purposes.",
      category: "registration"
    },
    {
      id: "docs-3",
      question: "When will I receive the documents?",
      answer: "Documents are shared after payment and successful KYC verification.",
      category: "setup"
    },

    // --- KYC & Verification ---
    {
      id: "kyc-1",
      question: "Why is KYC required?",
      answer: "KYC is mandatory for legal compliance, fraud prevention, and adherence to government regulations.",
      category: "setup"
    },
    {
      id: "kyc-2",
      question: "What documents do I need to submit for KYC?",
      answer: "Typically: PAN Card, GST Certificate (if applicable), Business details, and ID proof of authorized signatory.",
      category: "setup"
    },
    {
      id: "kyc-3",
      question: "What happens if my KYC is rejected?",
      answer: "You will be informed of the reason and allowed to resubmit corrected documents.",
      category: "setup"
    },

    // --- Mail & Courier ---
    {
      id: "mail-1",
      question: "How does mail handling work?",
      answer: "All mail received at your virtual office address is logged and handled as per your selected plan.",
      category: "facilities"
    },
    {
      id: "mail-2",
      question: "Will I be notified when mail arrives?",
      answer: "Yes. You will receive an email notification whenever mail is received.",
      category: "facilities"
    },
    {
      id: "mail-3",
      question: "Can mail be forwarded to my address?",
      answer: "Yes. Mail can be forwarded via courier at additional cost.",
      category: "facilities"
    },

    // --- Coworking Spaces ---
    {
      id: "coworking-1",
      question: "What is the difference between Hot Desk and Dedicated Desk?",
      answer: "Hot Desk: Flexible seating, no fixed desk. Dedicated Desk: Fixed desk reserved only for you.",
      category: "coworking"
    },
    {
      id: "coworking-2",
      question: "Are utilities included in coworking plans?",
      answer: "Yes. Electricity, internet, housekeeping, and maintenance are included.",
      category: "coworking"
    },
    {
      id: "coworking-3",
      question: "Is there any lock-in period?",
      answer: "Most coworking plans are flexible with minimal or no lock-in.",
      category: "coworking"
    },

    // --- Meeting Rooms ---
    {
      id: "meeting-1",
      question: "How do I book a meeting room?",
      answer: "Meeting rooms can be booked on demand by selecting location, date, and time slot. Booking confirmation is shared via email.",
      category: "facilities"
    },
    {
      id: "meeting-2",
      question: "What facilities are available in meeting rooms?",
      answer: "High-speed WiFi, TV/Display, Whiteboard, and Reception support.",
      category: "facilities"
    },

    // --- Payments & Billing ---
    {
      id: "payment-1",
      question: "What payment methods are supported?",
      answer: "UPI, Debit & Credit Cards, and Net Banking.",
      category: "pricing"
    },
    {
      id: "payment-2",
      question: "What should I do if payment fails?",
      answer: "Try another card or UPI, check international transaction settings, retry after a few minutes, or escalate to support if the issue persists.",
      category: "pricing"
    },

    // --- Cancellation & Refunds ---
    {
      id: "refund-1",
      question: "Can I cancel my booking?",
      answer: "Yes. Cancellation requests can be raised via support.",
      category: "pricing"
    },
    {
      id: "refund-2",
      question: "Will I get a refund if I cancel?",
      answer: "Refund eligibility depends on plan type, usage status, and cancellation timing. Terms are shared at the time of purchase.",
      category: "pricing"
    },

    // --- Support & Escalation ---
    {
      id: "support-1",
      question: "How do I raise a support request?",
      answer: "Support tickets can be raised from the dashboard or by contacting the support team.",
      category: "basics"
    },
    {
      id: "support-2",
      question: "How long does support take to respond?",
      answer: "Most queries are responded to within 24 business hours.",
      category: "basics"
    },

    // --- Affiliate & Partnership ---
    {
      id: "affiliate-1",
      question: "Do you have an affiliate program?",
      answer: "Yes. We offer an affiliate program for partners who refer clients.",
      category: "benefits"
    },
    {
      id: "affiliate-2",
      question: "How are affiliates paid?",
      answer: "Affiliates earn commission on successful bookings after service activation.",
      category: "benefits"
    },

    // --- Important Clarifications ---
    {
      id: "clarify-1",
      question: "Do you provide legal or tax advisory?",
      answer: "No. FlashSpace provides address and documentation support, not legal or tax consultation.",
      category: "basics"
    },
    {
      id: "clarify-2",
      question: "Do you guarantee GST or business registration approval?",
      answer: "No. Approval is subject to government authority verification.",
      category: "basics"
    }
  ];

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