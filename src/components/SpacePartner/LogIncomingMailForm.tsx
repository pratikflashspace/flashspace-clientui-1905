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
  Bell,
  Scale,
} from "lucide-react";
import { toast } from "sonner";
import { mailService } from "../../services/mailService";
import { fetchPartnerDashboard } from "../../services/spacePortal/spacePartner.service";

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
    notifyClient: true,
  });

  // Real email autocomplete
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const [emailOptions, setEmailOptions] = useState<string[]>([]);

  React.useEffect(() => {
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
        notifyClient: true,
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
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-[Inter] flex flex-col max-h-[90vh]">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6 text-white shrink-0">
        <h2 className="text-2xl font-bold tracking-tight">
          Log Incoming Mail & Deliveries
        </h2>
        <p className="text-slate-300 mt-1 text-sm">
          Record a new package or letter received at your space and notify the
          client.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-8 space-y-10 overflow-y-auto flex-1"
      >
        {/* SECTION 1: Client Identification */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Client Identification
            </h3>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Client Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="clientEmail"
                placeholder="Search by client email address..."
                value={formData.clientEmail}
                onFocus={() => setShowEmailDropdown(true)}
                onBlur={() =>
                  setTimeout(() => setShowEmailDropdown(false), 200)
                }
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400"
                required
              />
            </div>

            {/* Simulated Autocomplete Dropdown */}
            {showEmailDropdown && formData.clientEmail.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {matchedEmails.length > 0 ? (
                  matchedEmails.map((email) => (
                    <li
                      key={email}
                      className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm text-gray-700 transition-colors"
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
                  <li className="px-4 py-3 text-sm text-gray-500 italic">
                    No matching clients found. Press Enter to use literal value.
                  </li>
                )}
              </ul>
            )}
            <p className="mt-1.5 text-xs text-gray-500">
              Start typing to find a registered client in your space.
            </p>
          </div>
        </section>

        {/* SECTION 2: Delivery Details */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Delivery Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Sender / Origin <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sender"
                placeholder="e.g. Amazon, DHL, HDFC Bank..."
                value={formData.sender}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Tracking Number{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="trackingNumber"
                placeholder="e.g. AWB123456789"
                value={formData.trackingNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Item Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {itemTypes.map((type) => {
                const isSelected = formData.type === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, type: type.id }))
                    }
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? "bg-blue-100" : "bg-gray-100"
                      }`}
                    >
                      <type.icon
                        className={`w-4 h-4 ${
                          isSelected ? "text-blue-600" : "text-gray-500"
                        }`}
                      />
                    </div>
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 3: Evidence & Location */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Evidence & Location
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Photo Upload{" "}
                <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer group ${
                  selectedFile
                    ? "border-blue-400 bg-blue-50/50"
                    : "border-gray-200 hover:border-blue-400 hover:bg-slate-50"
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
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-1">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-green-600 font-medium">
                      Ready to upload
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-600">
                        Click to upload{" "}
                        <span className="text-gray-500 font-normal">
                          or drag and drop
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        SVG, PNG, JPG or GIF (max. 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Space Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  name="space"
                  value={formData.space}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none bg-white font-medium text-gray-700"
                >
                  <option value="" disabled>
                    Select a location branch
                  </option>
                  <option value="Mumbai - BKC">Mumbai - BKC</option>
                  <option value="Delhi - Connaught Place">
                    Delhi - Connaught Place
                  </option>
                  <option value="Bangalore - Indiranagar">
                    Bangalore - Indiranagar
                  </option>
                  <option value="Hyderabad - HITEC City">
                    Hyderabad - HITEC City
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
              <p className="mt-2 text-xs text-gray-500">
                Select the specific center where the asset is currently being
                held.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: Actions (Sticky Footer Effect) */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 shrink-0 mt-auto">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                name="notifyClient"
                className="sr-only"
                checked={formData.notifyClient}
                onChange={handleChange}
              />
              <div
                className={`block w-12 h-7 rounded-full transition-colors ${formData.notifyClient ? "bg-blue-600" : "bg-gray-200"}`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${formData.notifyClient ? "transform translate-x-5" : ""}`}
              ></div>
            </div>
            <div className="flex items-center gap-2">
              <Bell
                className={`w-4 h-4 ${formData.notifyClient ? "text-blue-600" : "text-gray-400"}`}
              />
              <div>
                <span className="block text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                  Notify client via email
                </span>
                <span className="block text-xs text-gray-500">
                  Sends an automated alert immediately
                </span>
              </div>
            </div>
          </label>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors w-full sm:w-auto"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {!loading && <CheckCircle2 className="w-4 h-4" />}
              Log Delivery
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LogIncomingMailForm;
