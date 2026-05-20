import { Building2, Clock3, MapPin, ThumbsUp, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const statCards = [
  {
    icon: Building2,
    value: "100+",
    label: "Workspaces",
    change: "+15%",
  },
  {
    icon: MapPin,
    value: "80+",
    label: "Cities",
    change: "+8%",
  },
  {
    icon: ThumbsUp,
    value: "98%",
    label: "Satisfaction",
    change: "+2%",
  },
  {
    icon: Clock3,
    value: "<3 days",
    label: "Avg. Setup Time",
    change: "-40%",
  },
];

const distribution = [
  { label: "Virtual Office", value: 42, color: "bg-[#36503F]" },
  { label: "Coworking Space", value: 28, color: "bg-[#FEF8C5]" },
  { label: "On Demand", value: 15, color: "bg-[#8A9A8D]" },
  { label: "Business Setup", value: 15, color: "bg-[#FEF8C5]" },
];

export const MetricsOverview = () => {
  return (
    <section className="bg-[#FAFAF7] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-16 text-center"
        >
          <p className="text-base font-medium text-[#6B8F78] sm:text-lg">
            Our commitment to excellence reflected in every metric
          </p>
        </motion.div>

        <div className="grid gap-4 lg:gap-6 lg:grid-cols-3">
          <motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65 }}
            className="flex h-full flex-col justify-between rounded-[24px] bg-[linear-gradient(135deg,#36503F_0%,#5D7462_100%)] p-6 text-[#FEF8C5] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#36503F]/20 sm:p-8"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/16 px-3 py-1.5 text-xs font-bold sm:text-sm">
                <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                +23% this quarter
              </div>

              <div className="mt-6 text-3xl font-black leading-none tracking-tight sm:mt-8 sm:text-4xl">
                5,000+
              </div>
              <h3 className="mt-2 text-base font-medium sm:mt-3 sm:text-lg">Happy Clients</h3>
            </div>
            <p className="mt-8 text-xs leading-relaxed text-[#FEF8C5]/80 sm:mt-10 sm:text-sm">
              Trusted by businesses of all sizes, from startups to Fortune 500
              companies across the globe.
            </p>
          </motion.article>

          <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-2 sm:grid-rows-2 sm:gap-4">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.article
                  key={stat.label}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className="group flex h-full flex-col justify-between rounded-[20px] border border-[#D4E0D0]/70 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6B8F78]/40 hover:shadow-md sm:p-5"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EEF2EE] text-[#36503F] transition-colors duration-300 group-hover:bg-[#36503F] group-hover:text-[#FEF8C5] sm:h-10 sm:w-10">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <div className="mt-3 text-xl font-black leading-none text-[#1F2E26] sm:mt-4 sm:text-2xl">
                      {stat.value}
                    </div>
                    <p className="mt-1 text-sm text-[#6B8F78] sm:mt-1.5 sm:text-base">{stat.label}</p>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#EEF2EE] px-2 py-1 text-[10px] font-bold text-[#36503F] sm:mt-3 sm:text-xs">
                      <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      {stat.change}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, delay: 0.16 }}
            className="group flex h-full flex-col justify-between rounded-[24px] border border-[#D4E0D0]/70 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6B8F78]/40 hover:shadow-md sm:p-8"
          >
            <div>
              <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6">
                <h3 className="text-base font-black text-[#1F2E26] sm:text-lg">
                  Service Distribution
                </h3>
                <span className="shrink-0 rounded-full bg-[#EEF2EE] px-2.5 py-1 text-[10px] text-[#6B8F78] transition-colors duration-300 group-hover:bg-[#36503F] group-hover:text-[#FEF8C5] sm:text-xs">
                  Q4 2025
                </span>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {distribution.map((item) => (
                  <div key={item.label} className="group/item">
                    <div className="mb-1.5 flex items-center justify-between gap-3 sm:mb-2">
                      <span className="text-xs font-medium text-[#1F2E26] transition-colors duration-300 group-hover/item:text-[#6B8F78] sm:text-sm">
                        {item.label}
                      </span>
                      <span className="text-xs font-bold text-[#6B8F78] sm:text-sm">
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#EEF0EC] sm:h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 border-t border-[#D4E0D0]/70 pt-4 sm:mt-6 sm:pt-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-[#6B8F78] sm:text-sm">
                    Total Coverage
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#8A9A8D] sm:mt-1 sm:text-xs">
                    All services combined
                  </p>
                </div>
                <div className="text-xl font-black text-[#36503F] sm:text-2xl">100%</div>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
};
