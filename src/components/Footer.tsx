import { Link } from "react-router-dom";
import { useScrollAnimation, getAnimationClasses } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

const footerLinks = {
  solutions: [
    { label: "Virtual Office", href: "/services/virtual-office" },
    { label: "Coworking Space", href: "/services/coworking-space" },
    { label: "Business Setup", href: "/solutions/business-setup" },
  ],
  resources: [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
  company: [
    { label: "Careers", href: "/career" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
  community: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/flash-space/" },
    { label: "Twitter", href: "https://x.com/flashspaceai" },
    { label: "Instagram", href: "https://www.instagram.com/flashspace.ai/" },
  ],
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const isVisible = useScrollAnimation("footer");

  return (
    <footer id="footer" className="bg-[#1F2E26] text-white border-t border-[#FEF8C5]/25 overflow-hidden">
      {/* Links Section */}
      <div className={cn(
        "container mx-auto px-4 sm:px-6 py-12 sm:py-16",
        getAnimationClasses(isVisible, "slideUp", 0)
      )}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-4 sm:gap-8 lg:gap-12">
          {/* Solutions */}
          <div className="border-l border-[#FEF8C5]/25 pl-4 sm:pl-6 space-y-4 sm:space-y-6">
            <h4 className="text-[9px] sm:text-[10px] font-bold font-sans text-[#FEF8C5] uppercase tracking-[0.2em]">
              Solutions
            </h4>
            <ul className="space-y-4">
              {footerLinks.solutions.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white hover:text-[#FEF8C5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEF8C5] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="border-l border-[#FEF8C5]/25 pl-4 sm:pl-6 space-y-4 sm:space-y-6">
            <h4 className="text-[9px] sm:text-[10px] font-bold font-sans text-[#FEF8C5] uppercase tracking-[0.2em]">
              Resources
            </h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white hover:text-[#FEF8C5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEF8C5] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="border-l border-[#FEF8C5]/25 pl-4 sm:pl-6 space-y-4 sm:space-y-6">
            <h4 className="text-[9px] sm:text-[10px] font-bold font-sans text-[#FEF8C5] uppercase tracking-[0.2em]">
              Company
            </h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white hover:text-[#FEF8C5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEF8C5] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div className="border-l border-[#FEF8C5]/25 pl-4 sm:pl-6 space-y-4 sm:space-y-6">
            <h4 className="text-[9px] sm:text-[10px] font-bold font-sans text-[#FEF8C5] uppercase tracking-[0.2em]">
              Community
            </h4>
            <ul className="space-y-4">
              {footerLinks.community.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("http") ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white hover:text-[#FEF8C5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEF8C5] rounded"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-white hover:text-[#FEF8C5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FEF8C5] rounded"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={cn(
        "container mx-auto px-4 sm:px-6 py-10 lg:py-16 border-t border-[#FEF8C5]/25",
        getAnimationClasses(isVisible, "fadeIn", 400)
      )}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
          {/* Logo */}
          <Link to="/" className="group transition-transform active:scale-95">
            <img
              src="/Logo/Flashspace Logo.png"
              alt="FlashSpace"
              className="h-10 sm:h-16 lg:h-20 w-auto brightness-0 invert transition-opacity opacity-70 hover:opacity-100"
            />
          </Link>

          {/* Copyright */}
          <div className="space-y-4 lg:text-right">
            <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-bold text-[#FEF8C5] uppercase tracking-[0.2em] lg:justify-end">
              <Link to="/terms" className="hover:text-white transition-colors">Legal</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            </div>
            <p className="text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-[0.2em] sm:tracking-[0.3em]">
              © {currentYear} Stirring Minds Services Private Limited.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
