// Support.tsx
import React, { useState } from "react";
import { MessageCircle, Briefcase, Handshake } from "lucide-react";


const Support: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const contactSections = [
    {
      title: "Support",
      desc: "Need help or facing issues with our platform? Our support team is always ready to assist you with queries and troubleshooting.",
      mail: "support@flashspace.co",
      icon: <MessageCircle className="w-6 h-6 text-yellow-400" />,
    },
    {
      title: "Sales",
      desc: "Want to explore FlashSpace solutions for your business? Our experts will help you find the right plan and growth strategy.",
      mail: "sales@flashspace.co",
      contact: "8100888777",
      icon: <Briefcase className="w-6 h-6 text-yellow-400" />,
    },
    {
      title: "Partnership",
      desc: "Interested in collaborating or becoming a FlashSpace partner? Let’s innovate together and build future-ready solutions.",
      mail: "partner@flashspace.co",
      icon: <Handshake className="w-6 h-6 text-yellow-400" />,
    },
  ];

  const faqs = [
    {
      q: "How do I check my booking status?",
      a: "You can check your booking status anytime under the 'My Bookings' section in your FlashSpace dashboard.",
    },
    {
      q: "How can I renew my subscription?",
      a: "Renewal options are available in the 'Subscription Details' tab. You can also contact sales@flashspace.co for assistance.",
    },
    {
      q: "How do I upload KYC documents?",
      a: "Navigate to the 'KYC & Agreement Details' section in your dashboard and upload the required documents directly.",
    },
    {
      q: "What is the response time for support?",
      a: "Our support team is available 24×7. We usually respond within 24 hours via email or chat.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 py-8 px-4 font-[Poppins] flex justify-center">
      <div className="w-full max-w-5xl">
        {/* HEADER */}
        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-[Geist] font-extrabold tracking-tight mb-3">
            <span className="text-black">FlashSpace</span>{" "}
            <span className="text-yellow-400">Support Center</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We’re here to help with your workspace, billing, and technical needs.  
            Our team is available <span className="text-yellow-500 font-semibold">24×7</span> to assist you.
          </p>
        </header>

        {/* CONTACT SECTIONS */}
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          {contactSections.map((info, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 bg-white"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-yellow-50 rounded-full">{info.icon}</div>
                <h2 className="text-xl font-[Geist] font-semibold text-gray-900">{info.title}</h2>
              </div>
              <p className="text-gray-700 mb-3 text-sm leading-relaxed">{info.desc}</p>
              <p className="font-semibold text-sm">
                {info.title} Mail:{" "}
                <a href={`mailto:${info.mail}`} className="text-blue-600 hover:underline font-[Poppins]">
                  {info.mail}
                </a>
              </p>
              {info.contact && (
                <p className="font-semibold text-sm mt-1">
                  Contact: <span className="text-gray-900">{info.contact}</span>
                </p>
              )}
            </div>
          ))}
        </section>

        {/* SUPPORT FORM */} 
        <section>
          <h2 className="text-2xl sm:text-2xl font-[Geist] font-bold text-black mb-3">
            Submit a Support Request
          </h2>
          <div className="w-14 h-[3px] bg-yellow-400 mb-5 rounded"></div>
          <p className="text-gray-600 mb-6 max-w-2xl text-sm">
            Fill out the form below and our support team will reach out to you shortly.
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone Number"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
              />
            </div>

            <textarea
              name="message"
              placeholder="Type your message here..."
              rows={5}
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 outline-none transition-all resize-none"
            ></textarea>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 font-[Geist] font-semibold bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition"
              >
                Submit Request
              </button>
            </div>

            {submitted && (
              <p className="text-green-600 font-semibold">
                ✅ Thank you! Your message has been received.
              </p>
            )}
          </form>
        </section>

        {/* FAQ SECTION */}
        <section className="mt-16">
          <h2 className="text-2xl sm:text-2xl font-[Geist] font-bold text-black mb-3">
            Frequently Asked Questions
          </h2>
          <div className="w-14 h-[3px] bg-yellow-400 mb-5 rounded"></div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full text-left px-4 py-2.5 bg-gray-50 hover:bg-yellow-50 font-[Geist] flex justify-between items-center text-sm sm:text-base"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg">{openFAQ === index ? "−" : "+"}</span>
                </button>
                {openFAQ === index && (
                  <p className="px-4 py-2.5 text-gray-700 bg-white text-sm sm:text-base">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-center mt-16 text-gray-600 text-xs sm:text-sm border-t border-gray-200 pt-5">
          Still can’t find what you’re looking for? Reach out at{" "}
          <a href="mailto:support@flashspace.co" className="text-blue-600 hover:underline font-[Poppins]">
            support@flashspace.co
          </a>{" "}
          — we usually respond within 24 hours.
        </footer>
      </div>
    </div>
  );
};

export default Support;
