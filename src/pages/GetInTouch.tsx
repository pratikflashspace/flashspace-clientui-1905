import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GetInTouchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GetInTouch: React.FC<GetInTouchProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
              <a href="mailto:partner@flashspace.co " className="text-blue-600 hover:underline">
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
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number </label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="+91 9876543210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="How can we help?"
                rows={4}
              ></textarea>
            </div>
            <Button
              type="submit"
              className="w-full bg-yellow-500 text-black py-2 rounded-md font-semibold hover:bg-yellow-400 transition"
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GetInTouch;
