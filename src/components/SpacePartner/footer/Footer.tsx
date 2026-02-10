import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, Phone, ShieldCheck } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const handleBackToTop = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-6 px-6 py-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-3">
          <div>
            <p className="text-base font-semibold text-slate-900">Flashspace</p>
            <p className="text-sm text-slate-500">
              Space Partner Portal
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            <ShieldCheck size={14} />
            All systems operational
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link className="hover:text-slate-900" to="/spaceportal/dashboard">
                Dashboard
              </Link>
            </li>
            <li>
              <Link className="hover:text-slate-900" to="/spaceportal/clients">
                Clients
              </Link>
            </li>
            <li>
              <Link className="hover:text-slate-900" to="/spaceportal/tickets">
                Ticket System
              </Link>
            </li>
            <li>
              <Link className="hover:text-slate-900" to="/spaceportal/settings">
                Settings
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">Resources</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <Link
                className="hover:text-slate-900"
                to="/spaceportal/notifications"
              >
                Notifications
              </Link>
            </li>
            <li>
              <Link className="hover:text-slate-900" to="/spaceportal/profile">
                Profile
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={handleBackToTop}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"
              >
                Back to top
                <ArrowUpRight size={14} />
              </button>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">Support</p>
          <div className="mt-3 space-y-3 text-sm text-slate-600">
            <a
              href="mailto:support@flashspace.co"
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50"
            >
              <Mail size={16} />
              support@flashspace.co
            </a>
            <a
              href="tel:+919999999999"
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50"
            >
              <Phone size={16} />
              +91 99999 99999
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-200 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} <span className="font-semibold text-slate-700">flashspace</span>. All rights reserved.
        </p>
        <p className="text-slate-400">Space Partner Portal • v1.0</p>
      </div>
    </footer>
  );
}
