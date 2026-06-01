import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const FloatingAiButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isOverDark, setIsOverDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Mobile specific state
  const [showMobileFlashAi, setShowMobileFlashAi] = useState(false);

  useEffect(() => {
    let ticking = false;
    
    // GoHighLevel Chat Widget repositioning on mobile
    let observer: MutationObserver | null = null;
    const enforceGHLPosition = () => {
      if (window.innerWidth <= 768) {
        const widget = document.querySelector("chat-widget") as HTMLElement;
        if (widget) {
          // Disconnect to prevent infinite loop when we modify styles!
          if (observer) observer.disconnect();

          const pastHero = window.scrollY > window.innerHeight * 0.7;
          const targetBottom = pastHero ? "90px" : "20px";

          // Force host element
          widget.style.setProperty("bottom", targetBottom, "important");
          widget.style.removeProperty("left");
          widget.style.setProperty("right", "16px", "important");
          widget.style.setProperty("transform", "none", "important");
          
          // Inject styles into shadow DOM
          if (widget.shadowRoot) {
            let styleEl = widget.shadowRoot.querySelector("#ghl-mobile-fix");
            if (!styleEl) {
              styleEl = document.createElement("style");
              styleEl.id = "ghl-mobile-fix";
              widget.shadowRoot.appendChild(styleEl);
            }
            styleEl.textContent = `
              @media (max-width: 768px) {
                div[style*="position: fixed"], 
                div[style*="position:fixed"],
                .lc-chat-widget-button-container,
                button {
                  bottom: ${targetBottom} !important;
                  right: 16px !important;
                  left: auto !important;
                  transition: bottom 0.3s ease-in-out !important;
                }
              }
            `;
          }

          // Reconnect observer
          if (observer) observer.observe(widget, { attributes: true, attributeFilter: ["style"] });
        }
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 500);
          
          // Mobile visibility
          const pastHero = window.scrollY > window.innerHeight * 0.7;
          setShowMobileFlashAi(pastHero);
          enforceGHLPosition();

          if (buttonRef.current) {
            // Check elements under the button
            const rect = buttonRef.current.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            const elements = document.elementsFromPoint(x, y);
            
            let foundDark = false;
            for (const el of elements) {
              if (buttonRef.current.contains(el)) continue; // skip button itself
              
              const style = window.getComputedStyle(el);
              const bg = style.backgroundColor;
              
              if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                const rgbMatch = bg.match(/(\d+(\.\d+)?)/g);
                if (rgbMatch && rgbMatch.length >= 3) {
                  const r = parseFloat(rgbMatch[0]);
                  const g = parseFloat(rgbMatch[1]);
                  const b = parseFloat(rgbMatch[2]);
                  const a = rgbMatch[3] ? parseFloat(rgbMatch[3]) : 1;
                  
                  if (a > 0.2) { // Ignore mostly transparent backgrounds
                    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                    if (brightness < 128) {
                      foundDark = true;
                    }
                    break; // Stop at first visible background
                  }
                }
              }
            }
            
            setIsOverDark(foundDark);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    const interval = setInterval(() => {
      const widget = document.querySelector("chat-widget") as HTMLElement;
      if (widget) {
        enforceGHLPosition();
        if (!observer) {
          observer = new MutationObserver(enforceGHLPosition);
          observer.observe(widget, { attributes: true, attributeFilter: ["style"] });
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
      if (observer) observer.disconnect();
    };
  }, []);

  if (location.pathname === "/start-chatting" || location.pathname.includes("payment")) {
    return null;
  }

  return (
    <>
      {/* Desktop Version */}
      <button
        ref={buttonRef}
        onClick={() => navigate("/start-chatting")}
        className={`hidden md:flex fixed bottom-6 right-[100px] z-50 items-center gap-2 rounded-full px-4 py-3 text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } ${
          isOverDark 
            ? 'bg-[#FEF8C5] text-[#36503F] hover:bg-[#F2EBBA]' 
            : 'bg-[#36503F] text-[#FEF8C5] hover:bg-[#1F2E26]'
        }`}
        style={{
          pointerEvents: isVisible ? 'auto' : 'none'
        }}
      >
        Flash AI
        <Sparkles className="h-5 w-5" />
      </button>

      {/* Mobile Version */}
      <AnimatePresence>
        {showMobileFlashAi && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden fixed bottom-6 left-1/2 z-[100] w-[92%] max-w-[400px] cursor-pointer"
            onClick={() => navigate("/start-chatting")}
          >
            <div className="bg-white/85 backdrop-blur-xl border border-gray-200/60 rounded-full p-1.5 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
              <div className="flex items-center gap-3 pl-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#36503F]">
                  <Sparkles className="w-4 h-4 text-[#fef6c5]" />
                </div>
                <span className="font-semibold text-sm text-[#1A1A1A]">Ask Flash AI</span>
              </div>
              <button 
                className="flex items-center gap-1.5 bg-[#0F172A] hover:bg-[#1e293b] transition-colors text-white px-4 py-2 rounded-full text-sm font-medium"
              >
                Try it <span className="text-base leading-none">&rarr;</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
