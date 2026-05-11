import { Link } from "react-router-dom";
import { useScrollAnimation, getAnimationClasses } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";

const footerLinks = {
  solutions: [
    { label: "Virtual Office", href: "/services/virtual-office" },
    { label: "Coworking Space", href: "/services/coworking-space" },
    { label: "On Demand", href: "/services/on-demand" },
    { label: "Business Setup", href: "/solutions/business-setup" },
  ],
  resources: [
    { label: "Terms & Conditions", href: "/" },
    { label: "Refund Policy", href: "/" },
  ],
  company: [
    { label: "Careers", href: "/career" },
    { label: "Privacy Policy", href: "/about" },
  ],
  community: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/flash-space/" },
    { label: "Twitter", href: "https://twitter.com/flashspace" },
    { label: "Instagram", href: "https://www.instagram.com/flashspace.ai/" },
  ],
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const isVisible = useScrollAnimation('footer');

  return (
    <footer id="footer" className="bg-foreground text-white dark:bg-[#050505] border-t border-white/5 overflow-hidden">
      {/* Links Section */}
      <div className={cn(
        "container mx-auto px-4 sm:px-6 py-12 sm:py-16",
        getAnimationClasses(isVisible, 'slideUp', 0)
      )}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-4 sm:gap-8 lg:gap-12">

          {/* Solutions */}
          <div className="border-l border-white/10 pl-4 sm:pl-6 space-y-4 sm:space-y-6">
            <h4 className="text-[9px] sm:text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
              Solutions
            </h4>
            <ul className="space-y-4">
              {footerLinks.solutions.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/70 hover:text-[#EDB003] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EDB003] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

    

          {/* Resources */}
          <div className="border-l border-white/10 pl-4 sm:pl-6 space-y-4 sm:space-y-6">
            <h4 className="text-[9px] sm:text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
              Resources
            </h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/70 hover:text-[#EDB003] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EDB003] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="border-l border-white/10 pl-4 sm:pl-6 space-y-4 sm:space-y-6">
            <h4 className="text-[9px] sm:text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
              Company
            </h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/70 hover:text-[#EDB003] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EDB003] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div className="border-l border-white/10 pl-4 sm:pl-6 space-y-4 sm:space-y-6">
            <h4 className="text-[9px] sm:text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
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
                      className="text-sm text-white/70 hover:text-[#EDB003] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EDB003] rounded"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-white/70 hover:text-[#EDB003] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EDB003] rounded"
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
        "container mx-auto px-4 sm:px-6 py-10 lg:py-16 border-t border-white/5",
        getAnimationClasses(isVisible, 'fadeIn', 400)
      )}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
          {/* Logo */}
          <Link to="/" className="group transition-transform active:scale-95">
            <img
              src="https://cdn.prod.website-files.com/664330484432dcdd6519a8fd/665dd8e0007de68a44f3750b_Black%20and%20White%20Bold%20Typography%20Clothing%20Brand%20Logo%20(940%20x%20400%20px)%20(940%20x%20200%20px)%20(940%20x%20150%20px).png"
              alt="FlashSpace"
              className="h-10 sm:h-16 lg:h-20 w-auto brightness-0 invert opacity-40 group-hover:opacity-100 transition-opacity"
            />
          </Link>

          {/* Copyright */}
          <div className="space-y-4 lg:text-right">
            <div className="flex flex-wrap gap-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] lg:justify-end">
              <Link to="/about" className="hover:text-white transition-colors">Legal</Link>
              <Link to="/about" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/about" className="hover:text-white transition-colors">Cookies</Link>
            </div>
            <p className="text-[9px] sm:text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] sm:tracking-[0.3em]">
              © {currentYear} FlashSpace Technologies Private Limited.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
