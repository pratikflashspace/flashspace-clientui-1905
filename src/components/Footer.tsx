import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building,
  FileText,
  Mail,
  MapPin,
  Users,
  Briefcase,
  Phone,
  Clock,
  Shield,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Send,
  Globe,
  Heart
} from "lucide-react";
import { useScrollAnimation, getAnimationClasses } from "@/hooks/use-scroll-animation";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const isVisible = useScrollAnimation('footer');
  const navigate = useNavigate();

  const services = [
    { name: "Virtual Office", icon: <Building className="w-4 h-4" />, href: "/services/virtual-office" },
    { name: "Coworking Space", icon: <Briefcase className="w-4 h-4" />, href: "/services/coworking-space" },
    { name: "Meeting Rooms", icon: <Users className="w-4 h-4" />, href: "/services/on-demand" },
    { name: "Event Spaces", icon: <Globe className="w-4 h-4" />, href: "/services/event-spaces" },
    { name: "Business Setup", icon: <FileText className="w-4 h-4" />, href: "/services/business-setup" },
    { name: "On-Demand", icon: <Clock className="w-4 h-4" />, href: "/services/on-demand" },
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/career" },
    { name: "Blog", href: "/blog" },
    { name: "Partner With Us", href: "/partner" },
    { name: "List Your Space", href: "/list-your-space" },
    { name: "Community", href: "/community" },
  ];

  const support = [
    { name: "Help Center", href: "/help", icon: <Users className="w-4 h-4" /> },
    { name: "Contact Us", href: "/get-in-touch", icon: <Phone className="w-4 h-4" /> },
    { name: "Privacy Policy", href: "/privacy", icon: <Shield className="w-4 h-4" /> },
    { name: "Terms of Service", href: "/terms", icon: <FileText className="w-4 h-4" /> },
  ];

  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="w-5 h-5" />, href: "https://facebook.com" },
    { name: "Twitter", icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com" },
    { name: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com" },
    { name: "Instagram", icon: <Instagram className="w-5 h-5" />, href: "https://instagram.com" },
    { name: "YouTube", icon: <Youtube className="w-5 h-5" />, href: "https://youtube.com" },
  ];

  return (
    <footer id="footer" className="relative bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-white/10 transition-colors duration-300 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#EDB003] to-transparent opacity-50"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#EDB003]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">

          {/* Company Info - Spans 4 columns */}
          <div className={`lg:col-span-4 space-y-8 ${getAnimationClasses(isVisible, 'slideUp', 0)}`}>
            <div className="flex flex-col items-start gap-4">
              <Link to="/" className="inline-block">
                <img
                  src="https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/665dd8e0007de68a44f3750b_Black%20and%20White%20Bold%20Typography%20Clothing%20Brand%20Logo%20(940%20x%20400%20px)%20(940%20x%20200%20px)%20(940%20x%20150%20px).png"
                  alt="FlashSpace Logo"
                  className="h-12 w-auto dark:invert transition-all duration-300"
                />
              </Link>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
                Empowering businesses across India with premium virtual office solutions,
                flexible workspaces, and growth-focused support. Join the future of work with FlashSpace.
              </p>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gray-50 dark:bg-[#151515] p-6 rounded-2xl border border-gray-100 dark:border-white/5">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Subscribe to our newsletter</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Get the latest updates towards your inbox.</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Email address"
                  className="bg-white dark:bg-black/50 border-gray-200 dark:border-white/10 focus:border-[#EDB003] text-sm dark:text-white transition-all"
                />
                <Button size="icon" className="bg-[#EDB003] hover:bg-[#d69f03] text-black shrink-0 transition-colors">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#1f1f1f] hover:bg-[#EDB003] dark:hover:bg-[#EDB003] text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-black flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Solutions Column */}
          <div className={`lg:col-span-3 md:col-span-1 ${getAnimationClasses(isVisible, 'slideUp', 100)}`}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 relative inline-block">
              Our Solutions
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#EDB003] rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="flex items-center group text-gray-600 dark:text-gray-400 hover:text-[#EDB003] dark:hover:text-[#EDB003] transition-colors duration-200"
                  >
                    <span className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-[#1f1f1f] flex items-center justify-center text-[#EDB003] mr-3 group-hover:bg-[#EDB003] group-hover:text-black transition-colors duration-200">
                      {service.icon}
                    </span>
                    <span className="font-medium text-sm">{service.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links & Support Column */}
          <div className={`lg:col-span-2 md:col-span-1 ${getAnimationClasses(isVisible, 'slideUp', 200)}`}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 relative inline-block">
              Company
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#EDB003] rounded-full"></span>
            </h3>
            <ul className="space-y-3 mb-8">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-[#EDB003] dark:hover:text-[#EDB003] transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 relative inline-block mt-8">
              Support
            </h3>
            <ul className="space-y-3">
              {support.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-[#EDB003] dark:hover:text-[#EDB003] transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                  >
                    <span className="text-[#EDB003] scale-75">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className={`lg:col-span-2 md:col-span-1 ${getAnimationClasses(isVisible, 'slideUp', 300)}`}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 relative inline-block">
              Get in Touch
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#EDB003] rounded-full"></span>
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EDB003]/10 flex items-center justify-center shrink-0 text-[#EDB003] mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">Head Office</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mt-1">
                    123, Tech Park, Cyber City,<br />Gurugram, India 122002
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EDB003]/10 flex items-center justify-center shrink-0 text-[#EDB003] mt-1">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">Phone</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mt-1">
                    +91 123 456 7890<br />Mon-Sat, 9AM-7PM
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EDB003]/10 flex items-center justify-center shrink-0 text-[#EDB003] mt-1">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">Email</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mt-1">
                    support@flashspace.com<br />sales@flashspace.com
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className={`py-8 border-t border-gray-200 dark:border-white/10 ${getAnimationClasses(isVisible, 'fadeIn', 400)}`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                © {currentYear} FlashSpace. All rights reserved.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>in India</span>
            </div>

            {/* Security Badges */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <Shield className="w-4 h-4 text-[#EDB003]" />
                <span>SSL Secured</span>
              </div>
              <div className="text-xs">
                <span className="bg-[#EDB003]/10 text-[#EDB003] border border-[#EDB003]/20 px-3 py-1 rounded-full font-medium">
                  ISO 27001 Certified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;