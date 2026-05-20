import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GetInTouchModal } from "@/components/modals/GetInTouchModal";

const highlights = [
  { tag: "PRODUCTIVITY", text: "AI tools that maximize workspace efficiency" },
  { tag: "USABILITY", text: "Modern booking that's fast and friction-free" },
  { tag: "SCALABILITY", text: "A network that grows with your business" },
];

export const CTA = () => {
  const navigate = useNavigate();
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <section className="bg-[#FAFAF7] py-12 md:py-16 lg:py-24">
      <div className="fs-container text-center">
        <div className="relative overflow-hidden rounded-[20px] ">
          {/* Background Image */}
          <img
            src="/home10.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-[#1F2E26]/60" />

          {/* Content */}
          <div className="relative z-10 px-6 py-12 md:px-12">
            <span className="fs-tag">Next step</span>
            <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-bold tracking-[-0.02em] text-[#FEF8C5] md:text-3xl">
              Ready to transform your business setup?
            </h2>

            <div className="mx-auto mt-12 grid max-w-4xl gap-5 text-left sm:grid-cols-3 sm:gap-6">
              {highlights.map((item) => (
                <div
                  key={item.tag}
                  className="group flex flex-col justify-between rounded-[24px] border border-white/20 bg-white/10 p-6 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 hover:border-[#FEF8C5]/40 hover:bg-white/15 hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)]"
                >
                  <div className="flex flex-col items-center text-center">
                    <span className="inline-flex items-center rounded-full bg-[#FEF8C5]/20 px-3 py-1.5 text-xs font-bold tracking-wide text-[#FEF8C5] transition-colors group-hover:bg-[#FEF8C5] group-hover:text-[#1F2E26]">
                      {item.tag}
                    </span>
                    <p className="mt-5 text-[15px] font-medium leading-relaxed text-white/90">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={() => setIsContactOpen(true)} className="fs-primary-btn">
                Get started <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => setIsContactOpen(true)} className="fs-secondary-btn">
                Talk to sales
              </button>
            </div>
          </div>
        </div>
      </div>
      <GetInTouchModal open={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </section>
  );
};
