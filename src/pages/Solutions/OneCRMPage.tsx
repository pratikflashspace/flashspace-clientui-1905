import React, { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Users,
  MessageSquare,
  Mail,
  Smartphone,
  Calendar,
  LineChart,
  LayoutTemplate,
  FormInput,
  Star,
  BarChart,
  ArrowRight,
  Check,
  Building2,
  Stethoscope,
  Scale,
  GraduationCap,
  Briefcase,
  Store,
  Lightbulb,
  Rocket,
  Target,
  Zap,
  TrendingUp,
  Clock,
  ShieldCheck,
  Headset
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Users,
    title: "CRM & Contact Management",
    description: "Store, organize, and manage all customer information from a single dashboard. Track interactions, manage deals, and build stronger relationships.",
  },
  {
    icon: Target,
    title: "Lead Management",
    description: "Capture leads from forms, landing pages, websites, and campaigns. Automatically assign leads and move them through your sales pipeline.",
  },
  {
    icon: Mail,
    title: "Email Marketing",
    description: "Create email campaigns, newsletters, and automated sequences that nurture leads and convert prospects into customers.",
  },
  {
    icon: Smartphone,
    title: "SMS & WhatsApp Automation",
    description: "Send reminders, promotional campaigns, appointment confirmations, and follow-ups automatically.",
  },
  {
    icon: Calendar,
    title: "Appointment Scheduling",
    description: "Allow prospects and customers to book meetings directly through your website without back-and-forth communication.",
  },
  {
    icon: LineChart,
    title: "Sales Pipelines",
    description: "Visualize every opportunity and track deals through every stage of your sales process.",
  },
  {
    icon: LayoutTemplate,
    title: "Landing Pages & Funnels",
    description: "Build high-converting pages and funnels without hiring developers or purchasing additional software.",
  },
  {
    icon: FormInput,
    title: "Forms & Surveys",
    description: "Collect leads, customer feedback, registrations, and inquiries using customizable forms.",
  },
  {
    icon: Star,
    title: "Reputation Management",
    description: "Automate review requests and monitor customer feedback across channels.",
  },
  {
    icon: BarChart,
    title: "Reporting & Analytics",
    description: "Track marketing performance, sales growth, customer engagement, and team productivity with real-time reporting.",
  },
];

const whyChooseUs = [
  {
    icon: Zap,
    title: "Eliminate Multiple Subscriptions",
    description: "Replace expensive software stacks with one affordable platform.",
  },
  {
    icon: Target,
    title: "Centralize Your Operations",
    description: "Keep customer data, conversations, appointments, campaigns, and reports in one place.",
  },
  {
    icon: Clock,
    title: "Automate Repetitive Work",
    description: "Reduce manual tasks with intelligent workflows and automated follow-ups.",
  },
  {
    icon: TrendingUp,
    title: "Increase Conversion Rates",
    description: "Respond faster, nurture leads automatically, and close more deals.",
  },
  {
    icon: Users,
    title: "Improve Team Productivity",
    description: "Give your sales and support teams everything they need from one dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Better Customer Experience",
    description: "Deliver seamless communication and personalized customer journeys.",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Capture Leads",
    description: "Collect leads from your website, landing pages, forms, ads, and social media campaigns.",
  },
  {
    step: "02",
    title: "Automate Follow-Ups",
    description: "Instantly engage prospects using email, SMS, WhatsApp, and automated workflows.",
  },
  {
    step: "03",
    title: "Track Every Opportunity",
    description: "Manage sales pipelines and monitor deal progress in real time.",
  },
  {
    step: "04",
    title: "Convert More Customers",
    description: "Use automation, reminders, and personalized communication to close more business.",
  },
  {
    step: "05",
    title: "Measure & Optimize",
    description: "Monitor performance through detailed reports and analytics.",
  },
];

const industries = [
  { icon: Building2, title: "Real Estate", description: "Manage leads, appointments, and client communications." },
  { icon: Stethoscope, title: "Healthcare", description: "Automate patient inquiries, bookings, and reminders." },
  { icon: Scale, title: "Legal Firms", description: "Track consultations and client follow-ups." },
  { icon: GraduationCap, title: "Education", description: "Manage admissions, inquiries, and student engagement." },
  { icon: Briefcase, title: "Agencies", description: "Handle multiple clients and automate marketing workflows." },
  { icon: Store, title: "Local Businesses", description: "Capture leads, schedule appointments, and grow customer relationships." },
  { icon: Lightbulb, title: "Consultants", description: "Simplify client onboarding and appointment management." },
  { icon: Rocket, title: "Startups", description: "Scale operations without managing dozens of software tools." },
];

const allBenefitsList = [
  "Lead Management",
  "Contact Management",
  "Sales Pipeline Tracking",
  "Email Automation",
  "WhatsApp Automation",
  "SMS Marketing",
  "Appointment Booking",
  "Landing Pages",
  "Forms & Surveys",
  "Review Management",
  "Reporting & Analytics",
  "Team Collaboration",
  "Workflow Automation",
  "Customer Communication",
  "Campaign Tracking",
  "Business Growth Tools",
];

const replacedToolsLeft = [
  "HubSpot CRM",
  "Zoho CRM",
  "Pipedrive",
  "Mailchimp",
  "ActiveCampaign",
];

const replacedToolsRight = [
  "Calendly",
  "ClickFunnels",
  "Leadpages",
  "Typeform",
  "Jotform",
  "Podium",
  "Birdeye",
];

const OneCRMPage = () => {
  useEffect(() => {
    document.title = "OneCRM - One Powerful Platform | FlashSpace";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-['Inter',sans-serif] bg-white overflow-x-hidden w-full">
      <Header />
      <main className="flex-1 pb-0">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#f8faf9] to-white pt-32 pb-16 lg:pt-40 lg:pb-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#36503F]/10 text-[#36503F] text-sm font-medium mb-6">
                <Target className="w-4 h-4" />
                <span style={{ fontFamily: "'Inter', sans-serif" }}>OneCRM</span>
              </div> */}
              <h1 style={{ fontFamily: "'Inter', sans-serif" }} className="text-4xl md:text-5xl font-extrabold text-[#1a2b21] tracking-tight mb-8 max-w-4xl mx-auto leading-[1.15]">
                Everything Your Business Needs <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#36503F] block mt-3">One Powerful Platform</span>
              </h1>
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                Stop juggling multiple tools, subscriptions, and disconnected workflows
                <br /><br />
                {/* <strong style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#1a2b21] font-semibold text-xl md:text-2xl leading-snug block mt-2">Manage leads, Automate follow-ups, Close more deals<br/>All from one centralized dashboard</strong> */}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-[-50px]">
                <Link to="/packages/pro" className="w-full sm:w-auto">
                  <Button size="lg" className="bg-[#36503F] hover:bg-[#25362B] text-white rounded-full px-8 h-14 text-lg w-full">
                    Explore Pro Plan
                  </Button>
                </Link>
                <Link to="/packages/basic" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg border-2 w-full hover:bg-[#FEF8CF] hover:text-black transition-colors">
                    Book Package
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trusted Alternative Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-[22px] min-[390px]:text-2xl sm:text-3xl md:text-5xl font-bold text-[#1a2b21] mb-2 leading-tight tracking-tight">
                <span className="whitespace-nowrap sm:whitespace-normal">Replace Multiple Tools With</span> <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#36503F] block mt-2 text-[26px] min-[390px]:text-3xl sm:text-4xl md:text-5xl">One Powerful Platform</span>
              </h2>
              {/* <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Why pay for multiple subscriptions when OneCRM gives you everything in one place?
                Our platform helps businesses eliminate software clutter by combining essential business tools into a single unified workspace.
              </p> */}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full flex justify-center mb-16 relative px-2 sm:px-0"
            >
              <div className="absolute inset-0 z-10 pointer-events-none rounded-xl sm:rounded-3xl" />
              <img 
                src="/onecrm2.webp" 
                alt="One CRM Dashboard and Replaced Tools" 
                className="w-full max-w-5xl h-auto rounded-xl sm:rounded-3xl shadow-lg sm:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-border object-contain"
              />
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-[#f8faf9]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-3xl md:text-5xl font-bold text-[#1a2b21] mb-6 leading-tight tracking-tight">
                Everything You Need To <br/><span style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#36503F] inline-block mt-2">Run Your Business</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-border/50 hover:shadow-md transition-shadow group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#36503F]/5 flex items-center justify-center mb-6 group-hover:bg-[#36503F] group-hover:text-white transition-colors duration-300 text-[#36503F]">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-xl font-bold text-[#1a2b21] mb-3">{feature.title}</h3>
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Businesses Choose OneCRM */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-3xl md:text-5xl font-bold text-[#1a2b21] mb-6 leading-tight tracking-tight text-center lg:text-left">
                  Why Businesses Choose <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#36503F] block lg:inline-block mt-2">OneCRM</span>
                </h2>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[17px] min-[390px]:text-lg sm:text-xl md:text-2xl text-[#36503F] font-semibold mb-10 leading-snug text-center lg:text-left whitespace-nowrap sm:whitespace-normal tracking-tight">
                  Save Time, Save Money, Scale Faster
                </p>
                <div className="space-y-8">
                  {whyChooseUs.map((item, idx) => (
                    <div key={idx} className="flex gap-5">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-10 h-10 rounded-full bg-[#36503F]/10 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-[#36503F]" />
                        </div>
                      </div>
                      <div>
                        <h4 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-[#1a2b21] mb-1">{item.title}</h4>
                        <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="aspect-square rounded-full bg-[#f8faf9] absolute -inset-8 -z-10 blur-3xl opacity-50" />
                <div className="bg-[#36503F] rounded-3xl p-10 md:p-14 text-white shadow-xl">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Star className="w-8 h-8 text-[#FEF8C5] fill-[#FEF8C5]" />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-2xl font-bold text-white">Join 10,000+</h3>
                      <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/80">Growing Businesses</p>
                    </div>
                  </div>
                  <blockquote style={{ fontFamily: "'Inter', sans-serif" }} className="text-xl md:text-2xl font-medium leading-relaxed mb-8">
                    "Switching to OneCRM was the best decision for our agency. We eliminated 5 different subscriptions and our team finally has everything in one place. Our response times improved instantly."
                  </blockquote>
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif" }} className="font-bold text-lg">Sarah Jenkins</p>
                    <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/70">Marketing Director</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-24 bg-[#36503F] text-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-16">
              <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-3xl md:text-5xl font-bold mb-6">
                How <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#FEF8C5]">OneCRM</span> Works
              </h2>
            </div>
            <div className="grid md:grid-cols-5 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-white/10 -z-10" />
              {workflowSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-[#25362B] border-4 border-white/10 flex items-center justify-center text-2xl font-black text-[#FEF8C5] mb-6 shadow-xl">
                    {step.step}
                  </div>
                  <h4 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold mb-3">{step.title}</h4>
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/70 text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-3xl md:text-5xl font-bold text-[#1a2b21] mb-6">
                Built For Every <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#36503F]">Growing Business</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {industries.map((industry, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="p-6 rounded-2xl bg-[#f8faf9] border border-border/50 hover:border-[#36503F]/30 hover:bg-white hover:shadow-md transition-all group"
                >
                  <industry.icon className="w-8 h-8 text-[#36503F] mb-4 group-hover:scale-110 transition-transform" />
                  <h4 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-[#1a2b21] mb-2">{industry.title}</h4>
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm text-muted-foreground">{industry.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-[#f8faf9] border-y border-border/50">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-16">
              <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-3xl md:text-4xl font-bold text-[#1a2b21] mb-4">
                One Platform <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#36503F]">Unlimited Possibilities</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 max-w-5xl mx-auto">
              {allBenefitsList.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#36503F]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-[#36503F] stroke-[3]" />
                  </div>
                  <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-[#1a2b21] font-medium text-sm md:text-base">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#36503F] rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-20 -mb-20" />
              
              <div className="relative z-10">
                <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready To Simplify Your Business?
                </h2>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
                  Stop switching between tools and start managing everything from one platform
                   </p>
                <h3 style={{ fontFamily: "'Inter', sans-serif" }} className="text-2xl font-bold text-[#FEF8C5] mb-10">
                  Start Growing With OneCRM Today
                </h3>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/packages/basic" className="w-full sm:w-auto">
                    <Button size="lg" className="bg-[#FEF8C5] hover:bg-white text-[#1a2b21] font-bold rounded-full px-10 h-14 text-lg w-full shadow-lg hover:shadow-xl transition-all">
                      Book Package
                    </Button>
                  </Link>
                  <Link to="/packages/pro" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="border-2 border-[#FEF8C5] text-black hover:bg-[#FEF8CF] hover:text-black font-bold rounded-full px-10 h-14 text-lg w-full transition-all">
                      Explore Pro Plan
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default OneCRMPage;
