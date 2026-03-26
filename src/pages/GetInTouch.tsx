import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GetInTouchProps {
  isOpen: boolean;
  onClose: () => void;
}

// 🔴 Yahan apna Apps Script URL paste karna Step 2 ke baad
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxjt0o4PrRdRcAHSdT2uFRVnZF0bdF8-BouSveRP8od1roAZfkLJTMf5DPlg0tLzZM5rw/execE";

const GetInTouch: React.FC<GetInTouchProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Google Apps Script ke liye zaroori hai
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
          timestamp: new Date().toLocaleString("en-IN"),
          source: "FlashSpace Website - Get In Touch",
        }),
      });

      // no-cors mein response nahi milta, so assume success
      setSubmitted(true);
      setFormData({ name: "", phone: "", email: "", message: "" });

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all">
      {/* ====== Popup Container ====== */}
      <div className="flex flex-col md:flex-row gap-10 w-[95%] max-w-5xl items-start justify-center">
        
        {/* ====== LEFT SIDE CARDS ====== */}
        <div className="flex flex-col gap-5 w-full md:w-[45%]">
          {/* Card 1 - Support */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              Support
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Need technical help or facing issues with our platform? Our support team is here 24×7 to assist you with queries and troubleshooting.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Support Mail:</strong>&nbsp;
              <a href="mailto:support@flashspace.co" className="text-blue-600 hover:underline">
                support@flashspace.co
              </a>
            </p>
          </div>

          {/* Card 2 - Sales */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              Sales
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Want to explore FlashSpace solutions for your business? Our sales experts will help you find the right plan and growth strategy.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Sales Mail:</strong>&nbsp;
              <a href="mailto:sales@flashspace.co" className="text-blue-600 hover:underline">
                sales@flashspace.co
              </a>
            </p>
            <p className="text-sm text-gray-600">
              <strong>Contact:</strong> 8100888777
            </p>
          </div>

          {/* Card 3 - Partnership */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              Partnership
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Interested in collaborating or becoming a FlashSpace partner? Let's innovate together and build future-ready digital solutions.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Partnership Mail:</strong>&nbsp;
              <a href="mailto:partner@flashspace.co" className="text-blue-600 hover:underline">
                partner@flashspace.co
              </a>
            </p>
          </div>
        </div>

        {/* ====== RIGHT SIDE FORM ====== */}
        <div className="bg-white rounded-2xl shadow-2xl w-full md:w-[45%] p-6 relative animate-fade-in">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 text-gray-500 hover:text-black transition"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold mb-4 text-center">
            <span className="text-black">Get in </span>
            <span className="text-yellow-500">Touch</span>
          </h2>

          {/* ✅ Success Message */}
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="text-5xl">✅</div>
              <h3 className="text-lg font-semibold text-gray-800">Message Sent!</h3>
              <p className="text-sm text-gray-500 text-center">
                Thank you! Our team will get back to you soon.
              </p>
              <Button
                onClick={() => setSubmitted(false)}
                className="mt-2 bg-yellow-500 text-black hover:bg-yellow-400"
              >
                Send Another
              </Button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="How can we help?"
                  rows={4}
                ></textarea>
              </div>

              {/* ❌ Error Message */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 text-black py-2 rounded-md font-semibold hover:bg-yellow-400 transition disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetInTouch;