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
  Send
} from "lucide-react";
import { useScrollAnimation, getAnimationClasses } from "@/hooks/use-scroll-animation";
import { smoothScrollTo } from "@/lib/lenis";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const isVisible = useScrollAnimation('footer');

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      try {
        smoothScrollTo(href, { offset: -90 });
      } catch {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const services = [
    { name: "Virtual Office Solutions", icon: <Building className="w-4 h-4" /> },
    { name: "Business Registration", icon: <FileText className="w-4 h-4" /> },
    { name: "Mail Management", icon: <Mail className="w-4 h-4" /> },
    { name: "Meeting Rooms", icon: <Users className="w-4 h-4" /> },
    { name: "Coworking Spaces", icon: <Briefcase className="w-4 h-4" /> },
    { name: "Professional Address", icon: <MapPin className="w-4 h-4" /> },
  ];

  const quickLinks = [
    { name: "About Us", href: "#about" },
    { name: "Pricing", href: "#pricing" },
    { name: "Blog", href: "#blog" },
    { name: "Career Opportunities", href: "#careers" },
    { name: "Partner With Us", href: "#partners" },
    { name: "Success Stories", href: "#testimonials" },
  ];

  const support = [
    { name: "Help Center", href: "#help", icon: <Users className="w-4 h-4" /> },
    { name: "Contact Support", href: "#contact", icon: <Phone className="w-4 h-4" /> },
    { name: "Documentation", href: "#docs", icon: <FileText className="w-4 h-4" /> },
    { name: "Privacy Policy", href: "#privacy", icon: <Shield className="w-4 h-4" /> },
    { name: "Terms of Service", href: "#terms", icon: <FileText className="w-4 h-4" /> },
    { name: "24/7 Support", href: "#support", icon: <Clock className="w-4 h-4" /> },
  ];

  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="w-5 h-5" />, href: "#" },
    { name: "Twitter", icon: <Twitter className="w-5 h-5" />, href: "#" },
    { name: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, href: "#" },
    { name: "Instagram", icon: <Instagram className="w-5 h-5" />, href: "#" },
    { name: "YouTube", icon: <Youtube className="w-5 h-5" />, href: "#" },
  ];

  return (
    <footer id="footer" className="bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-white/10 transition-colors duration-300">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className={`space-y-6 ${getAnimationClasses(isVisible, 'slideUp', 0)}`}>
            <div className="flex items-center">
              <img
                src="https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/665dd8e0007de68a44f3750b_Black%20and%20White%20Bold%20Typography%20Clothing%20Brand%20Logo%20(940%20x%20400%20px)%20(940%20x%20200%20px)%20(940%20x%20150%20px).png"
                alt="FlashSpace Logo"
                className="h-10 w-auto"
              />
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-content text-sm">
              Empowering businesses across India with premium virtual office solutions,
              professional services, and growth-focused support to accelerate success.
            </p>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-blue-50 dark:bg-[#1f1f1f] hover:bg-blue-100 dark:hover:bg-[#EDB003]/20 rounded-lg flex items-center justify-center transition-colors duration-300"
                  aria-label={social.name}
                >
                  <span className="text-blue-600">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white font-header">Stay Updated</h4>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter your email"
                  className="bg-gray-50 dark:bg-black/30 border-gray-200 dark:border-white/10 focus:border-blue-500 flex-1 text-sm dark:text-white dark:placeholder:text-gray-500"
                />
                <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* VirtuHub Services */}
          <div className={getAnimationClasses(isVisible, 'slideUp', 100)}>
            <h3 className="text-lg font-bold text-blue-600 dark:text-[#EDB003] mb-6 font-header">
              VirtuHub Services
            </h3>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 font-header">Connect</h4>
            <p className="text-xs text-yellow-600 dark:text-[#EDB003] mb-3 font-content">Powered by FlashSpace</p>
            <ul className="space-y-3">
              {services.slice(0, 6).map((service) => (
                <li key={service.name}>
                  <a
                    href="#"
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-[#EDB003] transition-colors duration-300 text-sm font-content"
                  >
                    <span className="text-blue-500">
                      {service.icon}
                    </span>
                    <span>{service.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className={getAnimationClasses(isVisible, 'slideUp', 200)}>
            <h3 className="text-lg font-bold text-blue-600 dark:text-[#EDB003] mb-6 font-header">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-[#EDB003] transition-colors duration-300 text-sm font-content cursor-pointer"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Contact */}
          <div className={getAnimationClasses(isVisible, 'slideUp', 300)}>
            <h3 className="text-lg font-bold text-blue-600 dark:text-[#EDB003] mb-6 font-header">
              Support & Legal
            </h3>
            <ul className="space-y-3 mb-6">
              {support.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) => handleAnchorClick(e, item.href)}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-[#EDB003] transition-colors duration-300 text-sm font-content cursor-pointer"
                  >
                    <span className="text-blue-500">
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className={`py-6 border-t border-gray-200 dark:border-white/10 ${getAnimationClasses(isVisible, 'fadeIn', 400)}`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-content">
                © {currentYear} VirtuHub Connect. All rights reserved.
                <span className="text-blue-600 dark:text-blue-400 font-medium"> Powered by FlashSpace Technology.</span>
              </p>
            </div>

            {/* Security Badges */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>SSL Secured</span>
              </div>
              <div className="text-xs">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
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