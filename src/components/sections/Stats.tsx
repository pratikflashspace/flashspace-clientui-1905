const stats = [
  { value: "5,000+", label: "Happy clients" },
  { value: "100+", label: "Partner spaces" },
  { value: "68+", label: "Indian cities" },
  { value: "98%", label: "Satisfaction rate" },
];

export const Stats = () => {
  return (
    <section className="bg-[#F0F4EE] py-8">
      <div className="fs-container grid grid-cols-2 divide-x-0 divide-y divide-[#D4E0D0] md:grid-cols-4 md:divide-x md:divide-y-0">
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 py-6 text-center md:py-2">
            <div className="text-[32px] font-bold leading-none text-[#36503F] md:text-[40px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {stat.value}
            </div>
            <div className="mt-2 text-[13px] font-medium text-[#6B8F78]">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
