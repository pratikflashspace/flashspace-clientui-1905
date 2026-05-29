import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const FloatingAiButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isOverDark, setIsOverDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 500);

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
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (location.pathname === "/start-chatting") {
    return null;
  }

  return (
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
  );
};
