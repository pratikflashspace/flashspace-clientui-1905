import React, { useState, useRef } from "react";
import {
  UploadCloud,
  Mail,
  Search,
  Building2,
  Package,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Scale,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { mailService } from "../../services/mailService";
import { fetchPartnerDashboard, fetchAllPartnerSpaces } from "../../services/spacePortal/spacePartner.service";

interface LogIncomingMailFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const LogIncomingMailForm: React.FC<LogIncomingMailFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientEmail: "",
    sender: "",
    type: "Letter",
    trackingNumber: "",
    space: "",
  });

  // Real email autocomplete
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const [emailOptions, setEmailOptions] = useState<string[]>([]);
  const [spaceOptions, setSpaceOptions] = useState<{ id: string; name: string }[]>([]);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        // Load client emails
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

        // Load partner spaces
        const spacesRes: any = await fetchAllPartnerSpaces();
        if (spacesRes?.success && spacesRes?.data) {
          const data = spacesRes.data;
          // Backend returns a flat array of spaces
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
    .filter((email) =>
      email.toLowerCase().includes(formData.clientEmail.toLowerCase()),
    )
    .slice(0, 7);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const itemTypes = [
    { id: "Letter", label: "Letter", icon: Mail },
    { id: "Parcel", label: "Parcel", icon: Package },
    { id: "Government Document", label: "Gov Document", icon: FileText },
    { id: "Package", label: "Package", icon: Package },
    { id: "Legal Notice", label: "Legal Notice", icon: Scale },
    { id: "Other", label: "Other", icon: AlertCircle },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const isFormValid = () => {
    return (
      formData.clientEmail.trim() !== "" &&
      formData.sender.trim() !== "" &&
      formData.space.trim() !== ""
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("Please fill in all required fields (Email, Sender, Space).");
      return;
    }

    setLoading(true);

    try {
      // Create backend payload matching the existing CreateMailData interface
      // Note: We are mocking client name as we only have clientEmail in this specific UI
      // In a real scenario, the backend might look up the client name by email.
      const payload = {
        client: formData.clientEmail.split("@")[0] || "Unknown Client", // Placeholder
        email: formData.clientEmail,
        sender: formData.sender,
        type: formData.type,
        space: formData.space,
        // The backend schema currently doesn't formally accept trackingNumber, notifyClient, or photoUrl
        // We will pass them anyway, and the backend might simply ignore them if 'strict' is true.
        // If we updated the backend, these would be saved.
      };

      await mailService.create(payload, selectedFile || undefined);
      toast.success("Delivery logged successfully");

      // Reset form
      setFormData({
        clientEmail: "",
        sender: "",
        type: "Letter",
        trackingNumber: "",
        space: "",
      });
      setSelectedFile(null);

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Failed to log mail", error);
      const message = error.response?.data?.message || "Failed to log delivery";
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
            Log Incoming <span className="italic text-primary">Mail</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Record a new delivery and notify the client
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
        className="px-6 py-5 space-y-6 overflow-y-auto flex-1 min-h-0"
      >
        {/* Client Email */}
        <div className="space-y-2">
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
              onBlur={() =>
                setTimeout(() => setShowEmailDropdown(false), 200)
              }
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground text-sm text-foreground"
              required
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showEmailDropdown && formData.clientEmail.length > 0 && (
            <ul className="absolute z-10 w-[calc(100%-3rem)] mt-1 bg-background border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
              {matchedEmails.length > 0 ? (
                matchedEmails.map((email) => (
                  <li
                    key={email}
                    className="px-4 py-2.5 hover:bg-muted cursor-pointer text-sm text-foreground transition-colors"
                    onMouseDown={() => {
                      setFormData((prev) => ({
                        ...prev,
                        clientEmail: email,
                      }));
                      setShowEmailDropdown(false);
                    }}
                  >
                    {email}
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

        {/* Sender + Tracking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Sender / Origin <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="sender"
              placeholder="e.g. Amazon, DHL, HDFC Bank..."
              value={formData.sender}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground text-sm text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Tracking Number <span className="text-muted-foreground/60 font-normal normal-case">(Optional)</span>
            </label>
            <input
              type="text"
              name="trackingNumber"
              placeholder="e.g. AWB123456789"
              value={formData.trackingNumber}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground text-sm text-foreground"
            />
          </div>
        </div>

        {/* Item Type */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Item Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {itemTypes.map((type) => {
              const isSelected = formData.type === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, type: type.id }))
                  }
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/10 text-muted-foreground hover:border-primary/40 hover:bg-muted/30"
                  }`}
                >
                  <type.icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-xs font-bold">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo + Space Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Photo Upload */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Photo <span className="text-muted-foreground/60 font-normal normal-case">(Optional)</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer group ${
                selectedFile
                  ? "border-primary/40 bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-muted/30"
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />

              {selectedFile ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider">
                      Ready to upload
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-2">
                  <UploadCloud className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <p className="text-xs text-muted-foreground">
                    <span className="text-primary font-medium">Click</span> or drag & drop
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Space Location */}
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
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {!loading && <CheckCircle2 className="w-4 h-4" />}
          Log Delivery
        </button>
      </div>
    </div>
  );
};

export default LogIncomingMailForm;
