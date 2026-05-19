const testimonials = [
  {
    quote: "FlashSpace helped us open GST-ready addresses in three cities without chasing landlords or paperwork.",
    name: "Priya Nair",
    role: "Founder, Bengaluru",
  },
  {
    quote: "Our team books desks and meeting rooms in minutes. The support team understands Indian compliance realities.",
    name: "Rohit Malhotra",
    role: "Operations Head, Gurugram",
  },
  {
    quote: "The documents were clean, the address was accepted, and the whole process felt properly managed.",
    name: "Sneha Iyer",
    role: "Co-founder, Mumbai",
  },
];

export const FounderTestimonial = () => {
  return (
    <section className="bg-white py-12 md:py-16 lg:py-24">
      <div className="fs-container">
        <div className="mb-8 text-center md:mb-12">
          <span className="fs-tag">Testimonials</span>
          <h2 className="mx-auto mt-3 max-w-xl text-3xl font-bold tracking-[-0.02em] text-[#1A1A1A] md:text-4xl">
            Trusted by Indian founders and operators.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="fs-card p-6">
              <blockquote className="text-base italic leading-[1.6] text-[#1A1A1A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                "{item.quote}"
              </blockquote>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0F4EE] text-sm font-bold text-[#36503F]">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#36503F]">{item.name}</p>
                  <p className="text-xs text-[#6B8F78]">{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
