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
        <div className="rounded-[20px] border border-[#D4E0D0] bg-white px-6 py-12 md:px-12">
          <span className="fs-tag">Next step</span>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-[-0.02em] text-[#1A1A1A] md:text-4xl">
            Ready to transform your business setup?
          </h2>

          <div className="mx-auto mt-8 grid max-w-3xl gap-6 text-left sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.tag}>
                <span className="fs-tag mb-3">{item.tag}</span>
                <p className="text-sm font-medium leading-[1.6] text-[#1A1A1A]">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button onClick={() => setIsContactOpen(true)} className="fs-primary-btn">
              Get started <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => navigate("/Solutions/virtual-office#sales-contact")} className="fs-secondary-btn">
              Talk to sales
            </button>
          </div>
        </div>
      </div>
      <GetInTouchModal open={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </section>
  );
};
