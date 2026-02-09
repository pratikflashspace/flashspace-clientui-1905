import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import SelectBox from "@/components/ui/SpacePartner/SelectionBox";
import type { SpaceStatus } from "@/types/spacePortal/space";

/**
 * FormState stores all form values as string except status.
 * We keep numbers as string because HTML input gives value in string.
 */
type FormState = {
  name: string;
  city: string;
  location: string;
  status: SpaceStatus;
  totalSeats: string;
  availableSeats: string;
  meetingRooms: string;
  cabins: string;
};

/**
 * Default initial form state.
 */
const initialState: FormState = {
  name: "",
  city: "",
  location: "",
  status: "ACTIVE",
  totalSeats: "",
  availableSeats: "",
  meetingRooms: "",
  cabins: "",
};

/**
 * Config type for generating input fields without repeating code.
 */
type FieldConfig = {
  key: keyof FormState;
  label: string;
  placeholder?: string;
  type?: string;
  min?: string;
};

export default function AddSpace() {
  const navigate = useNavigate();

  // Holds form data
  const [form, setForm] = useState<FormState>(initialState);

  /**
   * Updates any field dynamically.
   * This avoids writing multiple handleChange functions.
   */
  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * Form Submit Handler
   * Currently it is demo-only (no backend call).
   * Later we will replace the toast + navigate with API integration.
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Basic required fields validation
    if (!form.name || !form.city || !form.location) {
      toast.error("Please fill out all required fields.");
      return;
    }

    // Convert seat values to number for validation
    const totalSeats = Number(form.totalSeats);
    const availableSeats = Number(form.availableSeats);

    // Validate seat values
    if (
      Number.isNaN(totalSeats) ||
      Number.isNaN(availableSeats) ||
      totalSeats <= 0 ||
      availableSeats < 0 ||
      availableSeats > totalSeats
    ) {
      toast.error("Please enter valid seat counts.");
      return;
    }

    /**
     * Backend Payload Structure
     * This is exactly how we will send data to backend later.
     */
    const payload = {
      name: form.name,
      city: form.city,
      location: form.location,
      status: form.status,
      totalSeats,
      availableSeats,
      meetingRooms: Number(form.meetingRooms || 0),
      cabins: Number(form.cabins || 0),
    };

    console.log("Payload to send backend:", payload);

    /**
     * BACKEND API CALL (Future)
     *
     * Example:
     * await axios.post("/api/spaces", payload);
     */

    toast.success("Space created successfully (demo).");

    // Redirect after successful creation
    navigate("/spaceportal/space-management");
  };

  /**
   * These field configs prevent repeating InputField components manually.
   * Easy to add more fields in future.
   */
  const basicFields: FieldConfig[] = useMemo(
    () => [
      {
        key: "name",
        label: "Space Name *",
        placeholder: "Flashspace - BKC",
      },
      {
        key: "city",
        label: "City *",
        placeholder: "Mumbai",
      },
      {
        key: "location",
        label: "Location *",
        placeholder: "Bandra Kurla Complex",
      },
    ],
    []
  );

  const capacityFields: FieldConfig[] = useMemo(
    () => [
      {
        key: "totalSeats",
        label: "Total Seats *",
        placeholder: "120",
        type: "number",
        min: "1",
      },
      {
        key: "availableSeats",
        label: "Available Seats *",
        placeholder: "80",
        type: "number",
        min: "0",
      },
    ],
    []
  );

  const amenitiesFields: FieldConfig[] = useMemo(
    () => [
      {
        key: "meetingRooms",
        label: "Meeting Rooms",
        placeholder: "6",
        type: "number",
        min: "0",
      },
      {
        key: "cabins",
        label: "Cabins",
        placeholder: "12",
        type: "number",
        min: "0",
      },
    ],
    []
  );

  return (
    <div className="flex-1">
      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">Space Details</h2>
          <p className="text-sm text-slate-500">
            Add a new coworking space to your portal. Fields marked with * are
            required.
          </p>
        </div>

        {/* Basic Space Fields */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {basicFields.map((field) => (
            <InputField
              key={field.key}
              label={field.label}
              placeholder={field.placeholder}
              value={form[field.key] as string}
              onChange={(e) => updateField(field.key, e.target.value)}
            />
          ))}

          {/* Status Dropdown */}
          <div>
            <label className="text-xs font-semibold text-slate-500">
              Status
            </label>
            <div className="mt-2">
              <SelectBox
                value={form.status}
                onChange={(val) => updateField("status", val as SpaceStatus)}
                options={[
                  { label: "Active", value: "ACTIVE" },
                  { label: "Maintenance", value: "MAINTENANCE" },
                  { label: "Inactive", value: "INACTIVE" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Capacity + Amenities */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Capacity Section */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-sm font-semibold text-slate-900">Capacity</h3>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {capacityFields.map((field) => (
                <InputField
                  key={field.key}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={form[field.key] as string}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  type={field.type}
                  min={field.min}
                />
              ))}
            </div>
          </div>

          {/* Amenities Section */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-sm font-semibold text-slate-900">Amenities</h3>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {amenitiesFields.map((field) => (
                <InputField
                  key={field.key}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={form[field.key] as string}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  type={field.type}
                  min={field.min}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/spaceportal/space-management")}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-xl bg-[#3FA69E] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
          >
            Save Space
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Reusable Input Field Component
 * Keeps UI consistent across the app.
 */
function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
}: {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  min?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-xs font-semibold text-slate-500">
      {label}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        min={min}
        className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm focus:border-[#3FA69E] focus:outline-none"
      />
    </label>
  );
}
