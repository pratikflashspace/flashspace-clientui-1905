import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SelectBox from "@/components/ui/SpacePartner/SelectionBox";
import type { SpaceStatus } from "@/types/spacePortal/space";

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

export default function AddSpace() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialState);

  const handleChange =
    (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name || !form.city || !form.location) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const totalSeats = Number(form.totalSeats);
    const availableSeats = Number(form.availableSeats);

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

    toast.success("Space created successfully (demo).");
    navigate("/spaceportal/space-management");
  };

  return (
    <div className="flex-1">
      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">Space Details</h2>
          <p className="text-sm text-slate-500">
            Add a new coworking space to your portal. Fields marked with * are
            required.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <InputField
            label="Space Name *"
            placeholder="Flashspace - BKC"
            value={form.name}
            onChange={handleChange("name")}
          />
          <InputField
            label="City *"
            placeholder="Mumbai"
            value={form.city}
            onChange={handleChange("city")}
          />
          <InputField
            label="Location *"
            placeholder="Bandra Kurla Complex"
            value={form.location}
            onChange={handleChange("location")}
          />

          <div>
            <label className="text-xs font-semibold text-slate-500">
              Status
            </label>
            <div className="mt-2">
              <SelectBox
                value={form.status}
                onChange={(val) =>
                  setForm((prev) => ({
                    ...prev,
                    status: val as SpaceStatus,
                  }))
                }
                options={[
                  { label: "Active", value: "ACTIVE" },
                  { label: "Maintenance", value: "MAINTENANCE" },
                  { label: "Inactive", value: "INACTIVE" },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-sm font-semibold text-slate-900">Capacity</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Total Seats *"
                placeholder="120"
                value={form.totalSeats}
                onChange={handleChange("totalSeats")}
                type="number"
                min="1"
              />
              <InputField
                label="Available Seats *"
                placeholder="80"
                value={form.availableSeats}
                onChange={handleChange("availableSeats")}
                type="number"
                min="0"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-sm font-semibold text-slate-900">
              Amenities
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Meeting Rooms"
                placeholder="6"
                value={form.meetingRooms}
                onChange={handleChange("meetingRooms")}
                type="number"
                min="0"
              />
              <InputField
                label="Cabins"
                placeholder="12"
                value={form.cabins}
                onChange={handleChange("cabins")}
                type="number"
                min="0"
              />
            </div>
          </div>
        </div>

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
