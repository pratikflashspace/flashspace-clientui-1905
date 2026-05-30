import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const stats = [
  { value: 5000, suffix: "+", label: "Happy clients" },
  { value: 100, suffix: "+", label: "Partner spaces" },
  { value: 20, suffix: "+", label: "States" },
  { value: 98, suffix: "%", label: "Satisfaction rate" },
];

const formatValue = (value: number, suffix: string) => {
  return `${Math.round(value).toLocaleString("en-IN")}${suffix}`;
};

const CounterValue = ({
  value,
  suffix,
  start,
}: {
  value: number;
  suffix: string;
  start: boolean;
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    let frameId = 0;
    const duration = 1400;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(value * eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [start, value]);

  return <>{formatValue(displayValue, suffix)}</>;
};

export const Stats = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section ref={sectionRef} className="bg-[#F0F4EE] py-6 md:py-8">
      <div className="fs-container flex justify-between items-start md:grid md:grid-cols-4 md:divide-x md:divide-[#D4E0D0] px-2 md:px-8">
        {stats.map((stat, index) => (
          <div key={stat.label} className="px-1 md:px-4 py-3 md:py-2 text-center flex-1">
            <div
              className="text-[16px] sm:text-[18px] font-bold leading-none text-[#36503F] md:text-[40px]"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transitionDelay: `${index * 90}ms`,
              }}
            >
              <CounterValue
                value={stat.value}
                suffix={stat.suffix}
                start={isInView}
              />
            </div>
            <div className="mt-1 md:mt-2 text-[8.5px] sm:text-[11px] md:text-[13px] font-medium text-[#6B8F78] leading-tight md:leading-normal mx-auto">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
