import React, { useState, useEffect } from "react";
import {
  User,
  Search,
  Building2,
  Calendar as CalendarIcon,
  CheckCircle2,
  Loader2,
  Briefcase,
  X,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { visitService } from "../../services/visitService";
import { fetchPartnerDashboard, fetchAllPartnerSpaces } from "../../services/spacePortal/spacePartner.service";

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
    clientEmail: "",
    visitor: "",
    visitorEmail: "",
    visitorNumber: "",
    purpose: "Coworking Day Pass",
    space: "",
    date: getLocalDatetimePattern(),
  });

  // Real email autocomplete
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const [emailOptions, setEmailOptions] = useState<{ email: string; name: string }[]>([]);
  const [spaceOptions, setSpaceOptions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load client emails
        const response: any = await fetchPartnerDashboard();
        if (response?.data?.clients) {
          const clients = response.data.clients;
          const options = clients
            .filter((c: any) => c.email && c.email !== "N/A" && c.email.trim() !== "")
            .map((c: any) => ({
              email: c.email.trim().toLowerCase(),
              name: c.contactName || c.companyName || c.email.split("@")[0]
            }));
          
          // Deduplicate by email
          const uniqueOptions = Array.from(new Map(options.map((item: any) => [item.email, item])).values()) as { email: string; name: string }[];
          setEmailOptions(uniqueOptions);
        }

        // Load partner spaces
        const spacesRes: any = await fetchAllPartnerSpaces();
        if (spacesRes?.success && spacesRes?.data) {
          const data = spacesRes.data;
          if (Array.isArray(data)) {
            const allSpaces = data.map((s: any) => ({ id: s._id || s.id, name: s.name }));
            setSpaceOptions(allSpaces);
          } else if (data.virtualOffices || data.coworkingSpaces || data.meetingRooms) {
            const allSpaces: { id: string; name: string }[] = [];
            if (data.virtualOffices) data.virtualOffices.forEach((s: any) => allSpaces.push({ id: s._id, name: s.name }));
            if (data.coworkingSpaces) data.coworkingSpaces.forEach((s: any) => allSpaces.push({ id: s._id, name: s.name }));
            if (data.meetingRooms) data.meetingRooms.forEach((s: any) => allSpaces.push({ id: s._id, name: s.name }));
            setSpaceOptions(allSpaces);
          }
        }
      } catch (err) {
        console.error("Failed to load partner data", err);
      }
    };
    loadData();
  }, []);

  const matchedEmails = emailOptions
    .filter((opt) =>
      opt.email.toLowerCase().includes(formData.clientEmail.toLowerCase()) ||
      opt.name.toLowerCase().includes(formData.clientEmail.toLowerCase())
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
      const selectedClient = emailOptions.find(opt => opt.email.toLowerCase() === formData.clientEmail.toLowerCase());
      
      const payload = {
        client: selectedClient?.name || formData.clientEmail.split("@")[0] || "Client",
        email: formData.clientEmail,
        visitor: formData.visitor,
        visitorEmail: formData.visitorEmail,
        visitorNumber: formData.visitorNumber,
        purpose: formData.purpose,
        space: formData.space,
        date: new Date(formData.date).toISOString(),
      };

      console.log("Submitting visit payload:", payload);
      await visitService.create(payload as any);
      toast.success("Visit logged successfully!");

      // Reset form
      setFormData({
        clientEmail: "",
        visitor: "",
        visitorEmail: "",
        visitorNumber: "",
        purpose: "Coworking Day Pass",
        space: "",
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
    <div className="w-full max-w-2xl mx-auto bg-background rounded-2xl shadow-2xl border border-border flex flex-col" style={{ maxHeight: 'calc(90vh)' }}>
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between border-b border-border shrink-0">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground">
            Log Client <span className="italic text-primary">Visit</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Record a client's physical visit to the space
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="px-6 py-5 space-y-5 overflow-y-auto flex-1 min-h-0"
      >
        {/* Client Email */}
        <div className="space-y-2 relative">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Client Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              name="clientEmail"
              placeholder="Search by client email..."
              value={formData.clientEmail}
              onFocus={() => setShowEmailDropdown(true)}
              onBlur={() => setTimeout(() => setShowEmailDropdown(false), 200)}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground text-sm text-foreground"
              required
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showEmailDropdown && formData.clientEmail.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-background border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
              {matchedEmails.length > 0 ? (
                matchedEmails.map((opt) => (
                  <li
                    key={opt.email}
                    className="px-4 py-2.5 hover:bg-muted cursor-pointer text-sm transition-colors border-b border-border/30 last:border-0 flex flex-col"
                    onMouseDown={() => {
                      setFormData((prev) => ({
                        ...prev,
                        clientEmail: opt.email,
                      }));
                      setShowEmailDropdown(false);
                    }}
                  >
                    <span className="font-bold text-foreground">
                      {opt.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{opt.email}</span>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-sm text-muted-foreground italic">
                  No matching clients found.
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Visitor Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Visitor Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                name="visitor"
                placeholder="Name of the person visiting"
                value={formData.visitor}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground text-sm text-foreground"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Visitor Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                name="visitorEmail"
                placeholder="Email address"
                value={formData.visitorEmail}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground text-sm text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Visitor Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="tel"
                name="visitorNumber"
                placeholder="Contact number"
                value={formData.visitorNumber}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground text-sm text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Purpose <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-border bg-muted/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none text-sm text-foreground font-medium"
              >
                <option value="Coworking Day Pass">Coworking Day Pass</option>
                <option value="Meeting Room Booking">Meeting Room Booking</option>
                <option value="Event Attendance">Event Attendance</option>
                <option value="Facility Tour">Facility Tour</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Date + Space Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Date & Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-foreground"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Space Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                name="space"
                value={formData.space}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-border bg-muted/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none text-sm text-foreground font-medium"
              >
                <option value="" disabled>
                  Select location
                </option>
                {spaceOptions.map((space) => (
                  <option key={space.id} value={space.name}>{space.name}</option>
                ))}
                {spaceOptions.length === 0 && (
                  <option value="" disabled>No spaces found</option>
                )}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 shrink-0 bg-muted/10">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-border text-foreground font-bold text-sm hover:bg-muted transition-all active:scale-95"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          form=""
          disabled={loading}
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          Confirm Visit
        </button>
      </div>
    </div>
  );
};

export default LogClientVisitForm;
