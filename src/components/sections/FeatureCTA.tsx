import { ArrowRight, Building2, CalendarDays, FileCheck, Globe2, Headphones, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const productCards = [
  { title: "Virtual Office", body: "Premium business addresses for GST, incorporation, mail handling, and market presence.", icon: Building2, href: "/services/virtual-office" },
  { title: "Coworking Space", body: "Flexible desks and private cabins in verified workspaces across major Indian cities.", icon: Users, href: "/services/coworking-space" },
  { title: "Meeting Rooms", body: "Professional rooms by the hour for interviews, reviews, client calls, and team sessions.", icon: CalendarDays, href: "/solutions/meeting-rooms" },
  { title: "Business Setup", body: "NOC, agreements, utility bills, and address documents prepared for regulatory use.", icon: FileCheck, href: "/services/business-setup" },
  { title: "Global Access", body: "Coordinate workspace needs across branches, cities, and distributed teams from one account.", icon: Globe2, href: "/solutions/on-demand" },
  { title: "Support Desk", body: "Real operations support before, during, and after your workspace or address booking.", icon: Headphones, href: "/help" },
];
import { Link } from "react-router-dom";

export const FeatureCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-12 md:py-16 lg:py-24">
      <div className="fs-container">
        <div className="mb-8 max-w-xl">
          <span className="fs-tag">Product cards</span>
          <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-[-0.02em] text-[#1A1A1A] md:text-4xl">
            Everything your business needs, neatly connected.
          </h2>
        </div>

        <div className="flex snap-x gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-3 lg:overflow-visible">
          {productCards.map((product) => (
            <article key={product.title} className="fs-card flex min-w-[280px] snap-start flex-col p-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0F4EE] text-[#36503F]">
                <product.icon className="h-[18px] w-[18px]" />
              </div>
              <h3 className="mb-2 mt-4 text-lg font-bold text-[#1A1A1A]">{product.title}</h3>
              <p className="text-sm leading-[1.6] text-[#6B8F78]">{product.body}</p>
              <button onClick={() => navigate(product.href)} className="fs-ghost-btn mt-6 self-start">
                View details <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
