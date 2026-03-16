import React, { useState, useEffect } from "react";
import {
  User,
  Search,
  Building2,
  Calendar as CalendarIcon,
  CheckCircle2,
  Loader2,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { visitService } from "../../services/visitService";
import { fetchPartnerDashboard } from "../../services/spacePortal/spacePartner.service";

interface LogClientVisitFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const LogClientVisitForm: React.FC<LogClientVisitFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);

  // Need to format current date for datetime-local input
  const getLocalDatetimePattern = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    clientEmail: "", // used for search and backend 'email'
    visitor: "", // required by backend
    purpose: "Coworking Day Pass", // required by backend
    space: "Mumbai - BKC",
    date: getLocalDatetimePattern(),
  });

  // Real email autocomplete
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const [emailOptions, setEmailOptions] = useState<string[]>([]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const response: any = await fetchPartnerDashboard();
        if (response?.data?.clients) {
          const clients = response.data.clients;
          const emails = Array.from(
            new Set(
              clients
                .map((c: any) => c.email)
                .filter(
                  (email: any) =>
                    email && email !== "N/A" && email.trim() !== "",
                ),
            ),
          ) as string[];
          setEmailOptions(emails);
        }
      } catch (err) {
        console.error("Failed to load partner clients", err);
      }
    };
    loadClients();
  }, []);

  const matchedEmails = emailOptions
    .filter((email) =>
      email.toLowerCase().includes(formData.clientEmail.toLowerCase()),
    )
    .slice(0, 7);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return (
      formData.clientEmail.trim() !== "" &&
      formData.visitor.trim() !== "" &&
      formData.purpose.trim() !== "" &&
      formData.space.trim() !== "" &&
      formData.date.trim() !== ""
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      // Create backend payload matching CreateVisitData interface
      const payload = {
        client: formData.clientEmail.split("@")[0] || "Unknown Client", // Placeholder client name
        email: formData.clientEmail,
        visitor: formData.visitor,
        purpose: formData.purpose,
        space: formData.space,
        date: new Date(formData.date).toISOString(), // convert local to UTC ISO string
      };

      await visitService.create(payload as any);
      toast.success("Visit logged successfully!");

      // Reset form
      setFormData({
        clientEmail: "",
        visitor: "",
        purpose: "Coworking Day Pass",
        space: "Mumbai - BKC",
        date: getLocalDatetimePattern(),
      });

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Failed to log visit", error);
      const message = error.response?.data?.message || "Failed to log visit";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-background rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
      <div className="bg-[#2D3F33] px-8 py-8 text-[#FDE68A] text-center shrink-0 border-b border-border">
        <h2 className="text-3xl font-extrabold tracking-tight uppercase">
          Log Client <span className="italic text-primary">Visit</span>
        </h2>
        <p className="text-muted-foreground mt-2 font-medium">
          Record a client's physical presence at the coworking space. 
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-8 space-y-6 overflow-y-auto flex-1"
      >
        {/* Client Search */}
        <div className="space-y-1.5 relative">
          <label className="block text-sm font-semibold text-gray-700">
            Client Search <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="clientEmail"
              placeholder="Search client by name or email..."
              value={formData.clientEmail}
              onFocus={() => setShowEmailDropdown(true)}
              onBlur={() => setTimeout(() => setShowEmailDropdown(false), 200)}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all placeholder:text-gray-400"
              required
            />
          </div>

          {/* Simulated Autocomplete Dropdown */}
          {showEmailDropdown && formData.clientEmail.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto">
              {matchedEmails.length > 0 ? (
                matchedEmails.map((email) => (
                  <li
                    key={email}
                    className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm text-gray-700 transition-colors border-b border-gray-50 last:border-0 flex flex-col"
                    onMouseDown={() => {
                      setFormData((prev) => ({
                        ...prev,
                        clientEmail: email,
                        visitor: email.split("@")[0],
                      }));
                      setShowEmailDropdown(false);
                    }}
                  >
                    <span className="font-medium text-gray-900">
                      {email.split("@")[0]}
                    </span>
                    <span className="text-xs text-gray-500">{email}</span>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-sm text-gray-500 italic">
                  No matching clients found.
                </li>
              )}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visitor Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Visitor Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="visitor"
                placeholder="Name of the person visiting"
                value={formData.visitor}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Purpose <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all appearance-none bg-white font-medium text-gray-700"
              >
                <option value="Coworking Day Pass">Coworking Day Pass</option>
                <option value="Meeting Room Booking">
                  Meeting Room Booking
                </option>
                <option value="Event Attendance">Event Attendance</option>
                <option value="Facility Tour">Facility Tour</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
          {/* Date & Time */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
              Date & Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Adjust if logging a past visit.
            </p>
          </div>

          {/* Location Context */}
          <div className="space-y-1.5 flex flex-col justify-start">
            <label className="block text-sm font-semibold text-gray-700">
              Location / Space <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                name="space"
                value={formData.space}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all appearance-none bg-white font-medium text-gray-700"
              >
                <option value="Flashspace HQ">Flashspace HQ</option>
                <option value="Mumbai - BKC">Mumbai - BKC</option>
                <option value="Delhi - Connaught Place">
                  Delhi - Connaught Place
                </option>
                <option value="Bangalore - Indiranagar">
                  Bangalore - Indiranagar
                </option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-border flex items-center justify-end gap-3 shrink-0 mt-auto px-8 pb-8 bg-muted/20">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 rounded-xl border border-border text-foreground font-bold hover:bg-muted transition-all active:scale-95"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 rounded-xl bg-[#2D3F33] text-[#FDE68A] font-bold hover:bg-[#2D3F33]/90 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[150px]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Confirm Visit
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogClientVisitForm;
