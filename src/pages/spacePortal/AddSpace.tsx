import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Building2,
  MapPin,
  Layers,
  Monitor,
  Users,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  Info,
} from "lucide-react";

import propertyService from "@/services/property.service";
import { getMySpaceUserKyc } from "@/Api/spacePartnerKyc.service";
import {
  createCoworkingSpace,
  updateCoworkingSpace,
} from "@/services/coworkingSpace.service";
import {
  createVirtualOffice,
  updateVirtualOffice,
} from "@/services/virtualOffice.service";
import { createMeetingRoom } from "@/services/meetingRoom.service";
import { Property } from "@/types/services";

type Step =
  | "property"
  | "selection"
  | "coworking"
  | "virtual"
  | "meeting"
  | "review";

const INDIAN_CITIES = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Ahmedabad",
  "Chennai",
  "Kolkata",
  "Surat",
  "Pune",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Pimpri-Chinchwad",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Faridabad",
  "Meerut",
  "Rajkot",
  "Kalyan-Dombivli",
  "Vasai-Virar",
  "Varanasi",
  "Srinagar",
  "Aurangabad",
  "Dhanbad",
  "Amritsar",
  "Navi Mumbai",
  "Prayagraj",
  "Howrah",
  "Ranchi",
  "Jabalpur",
  "Gwalior",
  "Coimbatore",
  "Vijayawada",
  "Jodhpur",
  "Madurai",
  "Raipur",
  "Kota",
  "Chandigarh",
  "Guwahati",
  "Solapur",
  "Noida",
  "Gurgaon",
  "Bhubaneswar",
].sort();

export default function AddSpace() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");
  const [currentStep, setCurrentStep] = useState<Step>("property");
  const [propertyId, setPropertyId] = useState<string | null>(editId);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // --- Step 1: Property Data ---
  const [propertyData, setPropertyData] = useState({
    name: "",
    address: "",
    city: "",
    area: "",
    features: [] as string[],
    images: [] as string[],
  });
  const [featureInput, setFeatureInput] = useState("");
  const [selectedAmenity, setSelectedAmenity] = useState("");

  const [partnerKycStatus, setPartnerKycStatus] =
    useState<string>("not_started");
  const [policyAccepted, setPolicyAccepted] = useState(false);

  useEffect(() => {
    if (editId) {
      const loadProperty = async () => {
        setLoading(true);
        try {
          const prop = await propertyService.getPropertyById(editId);
          setPropertyData({
            name: prop.name || "",
            address: prop.address || "",
            city: prop.city || "",
            area: prop.area || "",
            features: prop.features || [],
            images: prop.images || [],
          });

          // Fetch associated spaces
          const spaces = await propertyService.getPropertySpaces(editId);
          const types: string[] = [];

          if (spaces.coworkingSpaces && spaces.coworkingSpaces.length > 0) {
            const coworking = spaces.coworkingSpaces[0];
            types.push("coworking");

            // Normalize floors/tables to include numberOfSeats
            const normalizedFloors = (coworking.floors || []).map(
              (floor: any) => ({
                ...floor,
                tables: (floor.tables || []).map((table: any) => ({
                  ...table,
                  numberOfSeats:
                    table.seats?.length || table.numberOfSeats || 1,
                })),
              }),
            );

            setCoworkingData((prev) => ({
              ...prev,
              ...coworking,
              floors:
                normalizedFloors.length > 0 ? normalizedFloors : prev.floors,
              pricePerMonth:
                coworking.partnerPricePerMonth || coworking.pricePerMonth || 0,
            }));
          }

          if (spaces.virtualOffices && spaces.virtualOffices.length > 0) {
            const virtual = spaces.virtualOffices[0];
            types.push("virtual");
            setVirtualData((prev) => ({
              ...prev,
              ...virtual,
              finalGstPricePerYear:
                virtual.partnerGstPricePerYear ||
                virtual.finalGstPricePerYear ||
                0,
              finalMailingPricePerYear:
                virtual.partnerMailingPricePerYear ||
                virtual.finalMailingPricePerYear ||
                0,
              finalBrPricePerYear:
                virtual.partnerBrPricePerYear ||
                virtual.finalBrPricePerYear ||
                0,
            }));
          }

          if (spaces.meetingRooms && spaces.meetingRooms.length > 0) {
            types.push("meeting");
            // Group meeting rooms by type/capacity/price for display
            const grouped = spaces.meetingRooms.reduce(
              (acc: any[], curr: any) => {
                const existing = acc.find(
                  (r) =>
                    r.type === curr.type &&
                    r.capacity === curr.capacity &&
                    r.pricePerHour ===
                      (curr.partnerPricePerHour || curr.pricePerHour),
                );
                if (existing) {
                  existing.count += 1;
                } else {
                  acc.push({
                    type: curr.type,
                    capacity: curr.capacity,
                    pricePerHour: curr.partnerPricePerHour || curr.pricePerHour,
                    count: 1,
                  });
                }
                return acc;
              },
              [],
            );
            setMeetingData({ rooms: grouped });
          }

          setSelectedTypes(types);
        } catch (err) {
          toast.error("Failed to load property data for editing");
        } finally {
          setLoading(false);
        }
      };
      loadProperty();
    }

    const fetchPartnerKyc = async () => {
      try {
        const kycData = await getMySpaceUserKyc();
        if (kycData) {
          setPartnerKycStatus(kycData.overallStatus || "not_started");
        }
      } catch (err) {
        console.error("Failed to fetch partner KYC status", err);
      }
    };
    fetchPartnerKyc();
  }, [editId]);

  // --- Step 3: Coworking Data ---
  const [coworkingData, setCoworkingData] = useState({
    capacity: 0,
    pricePerMonth: 0,
    floors: [
      {
        floorNumber: 1,
        tables: [] as any[],
      },
    ],
    operatingHours: {
      openTime: "09:00",
      closeTime: "18:00",
      daysOpen: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  });

  // --- Step 4: Virtual Office Data ---
  const [virtualData, setVirtualData] = useState({
    finalGstPricePerYear: 0,
    finalMailingPricePerYear: 0,
    finalBrPricePerYear: 0,
  });

  // --- Step 5: Meeting Room Data ---
  const [meetingData, setMeetingData] = useState({
    rooms: [
      {
        type: "meeting_room",
        capacity: 4,
        pricePerHour: 500,
        count: 1,
      },
    ],
  });

  // Auto-calculate capacity based on tables and seats
  useEffect(() => {
    let total = 0;
    coworkingData.floors.forEach((floor) => {
      floor.tables.forEach((table: any) => {
        total += table.numberOfSeats || 0;
      });
    });
    setCoworkingData((prev) => ({ ...prev, capacity: total }));
  }, [coworkingData.floors]);

  const addTable = (floorIdx: number) => {
    const newFloors = [...coworkingData.floors];
    const tableNumber = `T${newFloors[floorIdx].tables.length + 1}`;
    newFloors[floorIdx].tables.push({
      tableNumber,
      numberOfSeats: 1,
      seats: [], // Backend will generate these
    });
    setCoworkingData({ ...coworkingData, floors: newFloors });
  };

  const handleAddFeature = () => {
    if (
      featureInput.trim() &&
      !propertyData.features.includes(featureInput.trim())
    ) {
      setPropertyData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (feature: string) => {
    setPropertyData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  };

  // --- Navigation Helpers ---
  const getNextStep = (current: Step): Step => {
    const sequence: Step[] = ["coworking", "virtual", "meeting"];
    const startIndex =
      current === "selection" ? 0 : sequence.indexOf(current) + 1;

    for (let i = startIndex; i < sequence.length; i++) {
      if (selectedTypes.includes(sequence[i])) {
        return sequence[i];
      }
    }
    return "review";
  };

  const saveProperty = async () => {
    if (
      !propertyData.name ||
      !propertyData.address ||
      !propertyData.city ||
      !propertyData.area ||
      propertyData.features.length === 0 ||
      propertyData.images.length === 0
    ) {
      toast.error("Please fill all details, including amenities and images");
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        await propertyService.updateProperty(editId, propertyData);
        toast.success("Property updated!");
      } else {
        const resp = await propertyService.createProperty(propertyData);
        setPropertyId(resp._id);
        toast.success("Property details saved!");
      }
      setCurrentStep("selection");
    } catch (err) {
      toast.error(
        editId
          ? "Failed to update property"
          : "Failed to save property details",
      );
    } finally {
      setLoading(false);
    }
  };

  const saveCoworking = async () => {
    if (!propertyId) return;

    const validFloors = coworkingData.floors.filter((f) => f.tables.length > 0);

    if (validFloors.length === 0) {
      toast.error("At least one floor with at least one table is required");
      return;
    }

    const hasIncompleteTables = validFloors.some((f) =>
      f.tables.some((t) => !t.numberOfSeats || t.numberOfSeats <= 0),
    );

    if (hasIncompleteTables) {
      toast.error("All tables must have a valid seating capacity");
      return;
    }

    setLoading(true);
    try {
      const { pricePerMonth, ...rest } = coworkingData;
      const data = {
        ...rest,
        floors: validFloors,
        partnerPricePerMonth: pricePerMonth,
        propertyId,
      } as any;

      if ((coworkingData as any)._id) {
        await updateCoworkingSpace((coworkingData as any)._id, data);
      } else {
        await createCoworkingSpace(data);
      }

      toast.success("Coworking space details saved!");
      setCurrentStep(getNextStep("coworking"));
    } catch (err) {
      toast.error("Failed to save coworking space");
    } finally {
      setLoading(false);
    }
  };

  const saveVirtual = async () => {
    if (!propertyId) return;

    if (
      !virtualData.finalGstPricePerYear ||
      !virtualData.finalMailingPricePerYear ||
      !virtualData.finalBrPricePerYear
    ) {
      toast.error("All three Virtual Office plans are mandatory");
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...virtualData,
        partnerGstPricePerYear: virtualData.finalGstPricePerYear,
        partnerMailingPricePerYear: virtualData.finalMailingPricePerYear,
        partnerBrPricePerYear: virtualData.finalBrPricePerYear,
        propertyId,
      } as any;

      if ((virtualData as any)._id) {
        await updateVirtualOffice((virtualData as any)._id, data);
      } else {
        await createVirtualOffice(data);
      }

      toast.success("Virtual office details saved!");
      setCurrentStep(getNextStep("virtual"));
    } catch (err) {
      toast.error("Failed to save virtual office");
    } finally {
      setLoading(false);
    }
  };

  const saveMeeting = async () => {
    if (!propertyId) return;

    if (meetingData.rooms.length === 0) {
      toast.error("At least one On-Demand room is required");
      return;
    }

    const hasIncompleteRooms = meetingData.rooms.some(
      (r) => !r.capacity || !r.pricePerHour || !r.count,
    );
    if (hasIncompleteRooms) {
      toast.error("Please fill all details for each room");
      return;
    }

    setLoading(true);
    try {
      // For each room group, create 'count' number of individual rooms
      for (const group of meetingData.rooms) {
        for (let i = 0; i < group.count; i++) {
          await createMeetingRoom({
            type: group.type as any,
            capacity: group.capacity,
            partnerPricePerHour: group.pricePerHour,
            operatingHours: coworkingData.operatingHours, // Sync with coworking hours
            propertyId,
          } as any);
        }
      }

      toast.success("On-Demand details saved successfully!");
      setCurrentStep(getNextStep("meeting"));
    } catch (err) {
      toast.error("Failed to save On-Demand details");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    toast.success("Space creation complete!");
    navigate("/spaceportal/space-management");
  };

  const submitPropertyForReview = async () => {
    if (!propertyId) return;
    if (!policyAccepted) {
      toast.error("Please accept the policy terms");
      return;
    }

    setLoading(true);
    try {
      await propertyService.updateProperty(propertyId, {
        kycStatus: "pending" as any,
      });
      toast.success("Property submitted for admin review!");
      navigate("/spaceportal/space-management");
    } catch (err) {
      toast.error("Failed to submit property for review");
    } finally {
      setLoading(false);
    }
  };

  // --- Renderers ---

  const renderStepper = () => {
    const steps: { id: Step; label: string }[] = [
      { id: "property", label: "Property" },
      { id: "selection", label: "Services" },
      { id: "coworking", label: "Coworking" },
      { id: "virtual", label: "Virtual" },
      { id: "meeting", label: "On-Demand" },
      { id: "review", label: "Review" },
    ];

    const currentIdx = steps.findIndex((s) => s.id === currentStep);

    return (
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4">
        {steps.map((step, idx) => {
          const isCompleted =
            steps.findIndex((s) => s.id === currentStep) > idx;
          const isActive = currentStep === step.id;
          const isVisible =
            step.id === "property" ||
            step.id === "selection" ||
            step.id === "review" ||
            selectedTypes.includes(step.id);

          if (!isVisible) return null;

          return (
            <div
              key={step.id}
              className={`flex items-center flex-1 last:flex-none ${editId ? "cursor-pointer" : ""}`}
              onClick={() => {
                if (editId && isVisible) {
                  setCurrentStep(step.id);
                }
              }}
            >
              <div className="flex flex-col items-center relative gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? "bg-[#3FA69E] border-[#3FA69E] text-white"
                      : isActive
                        ? "border-[#3FA69E] text-[#3FA69E] font-bold"
                        : "border-slate-200 text-slate-400"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : idx + 1}
                </div>
                <span
                  className={`text-xs font-semibold whitespace-nowrap ${isActive ? "text-[#3FA69E]" : "text-slate-500"}`}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`h-[2px] mx-4 flex-1 min-w-[30px] ${isCompleted ? "bg-[#3FA69E]" : "bg-slate-200"}`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderPropertyStep = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Property Name *"
          placeholder="e.g. Flashspace Hub BKC"
          value={propertyData.name}
          onChange={(e) =>
            setPropertyData({ ...propertyData, name: e.target.value })
          }
        />
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            City *
          </label>
          <select
            className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm focus:border-[#3FA69E] focus:ring-1 focus:ring-[#3FA69E] focus:outline-none transition-all"
            value={propertyData.city}
            onChange={(e) =>
              setPropertyData({ ...propertyData, city: e.target.value })
            }
          >
            <option value="">Select a City</option>
            {INDIAN_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <InputField
          label="Area *"
          placeholder="Bandra Kurla Complex"
          value={propertyData.area}
          onChange={(e) =>
            setPropertyData({ ...propertyData, area: e.target.value })
          }
        />
        <InputField
          label="Full Address *"
          placeholder="Plot No. C-XXXX, G Block..."
          value={propertyData.address}
          onChange={(e) =>
            setPropertyData({ ...propertyData, address: e.target.value })
          }
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700">
          Property Features (Amenities) *
        </label>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <select
              className="flex-1 h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm focus:border-[#3FA69E] focus:outline-none"
              value={selectedAmenity}
              onChange={(e) => {
                setSelectedAmenity(e.target.value);
                if (e.target.value !== "Other" && e.target.value !== "") {
                  setFeatureInput(e.target.value);
                } else {
                  setFeatureInput("");
                }
              }}
            >
              <option value="">Select an Amenity</option>
              <option value="High-speed WiFi">High-speed WiFi</option>
              <option value="Air Conditioning">Air Conditioning</option>
              <option value="Cafeteria / Pantry">Cafeteria / Pantry</option>
              <option value="Power Backup">Power Backup</option>
              <option value="Reception Check-in">Reception Check-in</option>
              <option value="Security / CCTV">Security / CCTV</option>
              <option value="Parking Available">Parking Available</option>
              <option value="Lounge Area">Lounge Area</option>
              <option value="Printing & Scanning">Printing & Scanning</option>
              <option value="Meeting Rooms">Meeting Rooms</option>
              <option value="Whiteboard">Whiteboard</option>
              <option value="Tea & Coffee">Tea & Coffee</option>
              <option value="Other">Other (Specify below)</option>
            </select>
            <button
              type="button"
              onClick={() => {
                if (
                  featureInput.trim() &&
                  !propertyData.features.includes(featureInput.trim())
                ) {
                  setPropertyData((prev) => ({
                    ...prev,
                    features: [...prev.features, featureInput.trim()],
                  }));
                  setFeatureInput("");
                  setSelectedAmenity("");
                }
              }}
              className="px-4 bg-[#3FA69E] text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center shrink-0"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {selectedAmenity === "Other" && (
            <input
              type="text"
              className="w-full h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm focus:border-[#3FA69E] focus:outline-none"
              placeholder="Type custom amenity here..."
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (
                    featureInput.trim() &&
                    !propertyData.features.includes(featureInput.trim())
                  ) {
                    setPropertyData((prev) => ({
                      ...prev,
                      features: [...prev.features, featureInput.trim()],
                    }));
                    setFeatureInput("");
                    setSelectedAmenity("");
                  }
                }
              }}
            />
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {propertyData.features.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200"
            >
              {f}
              <button
                type="button"
                onClick={() => removeFeature(f)}
                className="hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700">
          Property Images *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="imgInput"
            className="flex-1 h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm focus:border-[#3FA69E] focus:outline-none"
            placeholder="Paste image URL here"
          />
          <button
            type="button"
            onClick={() => {
              const input = document.getElementById(
                "imgInput",
              ) as HTMLInputElement;
              if (input.value) {
                setPropertyData((prev) => ({
                  ...prev,
                  images: [...prev.images, input.value],
                }));
                input.value = "";
              }
            }}
            className="px-4 bg-[#3FA69E] text-white rounded-xl hover:opacity-90"
          >
            Add
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
          {propertyData.images.map((img, i) => (
            <div
              key={i}
              className="relative aspect-video rounded-xl overflow-hidden group shadow-sm"
            >
              <img src={img} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() =>
                  setPropertyData((prev) => ({
                    ...prev,
                    images: prev.images.filter((_, idx) => idx !== i),
                  }))
                }
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={saveProperty}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 bg-[#3FA69E] text-white rounded-xl font-bold shadow-lg shadow-teal-100 hover:translate-y-[-2px] transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save & Next"}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderSelectionStep = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-xl font-bold text-slate-900">
          What services are available at this property?
        </h2>
        <p className="text-slate-500 text-sm">
          Select all that apply. We'll capture specific details for each in the
          next steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            id: "coworking",
            label: "Coworking Space",
            icon: Users,
            desc: "Shared desks, dedicated desks, and private cabins.",
          },
          {
            id: "virtual",
            label: "Virtual Office",
            icon: Monitor,
            desc: "GST registration, mailing address, and business representation.",
          },
          {
            id: "meeting",
            label: "On-Demand",
            icon: Layers,
            desc: "Conference rooms, interview rooms, and board rooms.",
          },
        ].map((type) => {
          const isSelected = selectedTypes.includes(type.id);
          return (
            <button
              key={type.id}
              onClick={() => {
                setSelectedTypes((prev) =>
                  prev.includes(type.id)
                    ? prev.filter((t) => t !== type.id)
                    : [...prev, type.id],
                );
              }}
              className={`relative flex flex-col items-center p-8 rounded-3xl border-2 transition-all group ${
                isSelected
                  ? "border-[#3FA69E] bg-teal-50/50 shadow-md shadow-teal-100"
                  : "border-slate-100 bg-white hover:border-[#3FA69E] hover:bg-slate-50"
              }`}
            >
              <div
                className={`p-4 rounded-2xl mb-4 transition-colors ${
                  isSelected
                    ? "bg-[#3FA69E] text-white"
                    : "bg-slate-100 text-slate-500 group-hover:bg-teal-100 group-hover:text-[#3FA69E]"
                }`}
              >
                <type.icon className="w-8 h-8" />
              </div>
              <h3
                className={`font-bold mb-2 ${isSelected ? "text-[#3FA69E]" : "text-slate-800"}`}
              >
                {type.label}
              </h3>
              <p className="text-xs text-center text-slate-500 leading-relaxed">
                {type.desc}
              </p>

              {isSelected && (
                <div className="absolute top-4 right-4 text-[#3FA69E]">
                  <CheckCircle2 className="w-6 h-6 fill-teal-50" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center pt-8">
        <button
          onClick={() => setCurrentStep("property")}
          className="flex items-center gap-2 px-6 py-3 text-slate-500 font-semibold hover:text-slate-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={() => {
            if (selectedTypes.length === 0) {
              toast.error("Please select at least one service type");
              return;
            }
            setCurrentStep(getNextStep("selection"));
          }}
          className="flex items-center gap-2 px-8 py-3 bg-[#3FA69E] text-white rounded-xl font-bold shadow-lg shadow-teal-100 hover:translate-y-[-2px] transition-all"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderCoworkingStep = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Capacity (Auto-calculated)
          </label>
          <div className="w-full h-12 rounded-xl border border-slate-100 bg-slate-50 px-4 flex items-center text-sm font-bold text-[#3FA69E] shadow-inner">
            {coworkingData.capacity} Seats
          </div>
        </div>
        <InputField
          label="Price Per Month Per Desk (₹) *"
          type="number"
          value={coworkingData.pricePerMonth}
          onChange={(e: any) =>
            setCoworkingData({
              ...coworkingData,
              pricePerMonth: parseInt(e.target.value),
            })
          }
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Floor & Seat Map</h3>
          <button
            onClick={() =>
              setCoworkingData({
                ...coworkingData,
                floors: [
                  ...coworkingData.floors,
                  { floorNumber: coworkingData.floors.length + 1, tables: [] },
                ],
              })
            }
            className="flex items-center gap-1 text-sm font-bold text-[#3FA69E] hover:underline"
          >
            <Plus className="w-4 h-4" /> Add Floor
          </button>
        </div>

        {coworkingData.floors.map((floor, fIdx) => (
          <div
            key={fIdx}
            className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm italic">
                Floor {floor.floorNumber}
              </h4>
              <button
                onClick={() => addTable(fIdx)}
                className="px-3 py-1.5 bg-white border border-teal-100 text-[#3FA69E] text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Table
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {floor.tables.map((table, tIdx) => (
                <div
                  key={tIdx}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      {table.tableNumber}
                    </span>
                    <input
                      type="number"
                      min="1"
                      className="w-16 h-8 text-xs font-bold text-[#3FA69E] border border-slate-200 rounded-lg px-2 focus:outline-none focus:border-[#3FA69E]"
                      value={table.numberOfSeats || 1}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        const newFloors = [...coworkingData.floors];
                        newFloors[fIdx].tables[tIdx].numberOfSeats = val;
                        setCoworkingData({
                          ...coworkingData,
                          floors: newFloors,
                        });
                      }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {table.numberOfSeats || 1} Seats total
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-8">
        <button
          onClick={() => setCurrentStep("selection")}
          className="flex items-center gap-2 px-6 py-3 text-slate-500 font-semibold hover:text-slate-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={saveCoworking}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 bg-[#3FA69E] text-white rounded-xl font-bold shadow-lg shadow-teal-100 hover:translate-y-[-2px] transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save & Next"}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderVirtualStep = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          label="GST Plan Price (₹/Yr) *"
          type="number"
          value={virtualData.finalGstPricePerYear}
          onChange={(e: any) =>
            setVirtualData({
              ...virtualData,
              finalGstPricePerYear: parseInt(e.target.value),
            })
          }
        />
        <InputField
          label="Mailing Plan Price (₹/Yr) *"
          type="number"
          value={virtualData.finalMailingPricePerYear}
          onChange={(e: any) =>
            setVirtualData({
              ...virtualData,
              finalMailingPricePerYear: parseInt(e.target.value),
            })
          }
        />
        <InputField
          label="BR Plan Price (₹/Yr) *"
          type="number"
          value={virtualData.finalBrPricePerYear}
          onChange={(e: any) =>
            setVirtualData({
              ...virtualData,
              finalBrPricePerYear: parseInt(e.target.value),
            })
          }
        />
      </div>

      <div className="flex justify-between items-center pt-8">
        <button
          onClick={() => {
            const idx = selectedTypes.indexOf("virtual");
            if (idx > 0) {
              setCurrentStep(selectedTypes[idx - 1] as Step);
            } else {
              setCurrentStep("selection");
            }
          }}
          className="flex items-center gap-2 px-6 py-3 text-slate-500 font-semibold hover:text-slate-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={saveVirtual}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 bg-[#3FA69E] text-white rounded-xl font-bold shadow-lg shadow-teal-100 hover:translate-y-[-2px] transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save & Next"}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderMeetingStep = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">On-Demand Rooms</h3>
          <button
            onClick={() =>
              setMeetingData({
                ...meetingData,
                rooms: [
                  ...meetingData.rooms,
                  {
                    type: "meeting_room",
                    capacity: 4,
                    pricePerHour: 500,
                    count: 1,
                  },
                ],
              })
            }
            className="flex items-center gap-1 text-sm font-bold text-[#3FA69E] hover:underline"
          >
            <Plus className="w-4 h-4" /> Add Room
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {meetingData.rooms.map((room, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4 relative group"
            >
              <button
                onClick={() =>
                  setMeetingData({
                    ...meetingData,
                    rooms: meetingData.rooms.filter((_, i) => i !== idx),
                  })
                }
                className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Room Type
                </label>
                <select
                  className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm focus:outline-none focus:border-[#3FA69E] transition-colors"
                  value={room.type}
                  onChange={(e: any) => {
                    const newRooms = [...meetingData.rooms];
                    newRooms[idx].type = e.target.value;
                    setMeetingData({ ...meetingData, rooms: newRooms });
                  }}
                >
                  <option value="meeting_room">Meeting Room</option>
                  <option value="board_room">Board Room</option>
                  <option value="conference_room">Conference Room</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <InputField
                  label="Capacity"
                  type="number"
                  value={room.capacity}
                  onChange={(e: any) => {
                    const newRooms = [...meetingData.rooms];
                    newRooms[idx].capacity = parseInt(e.target.value);
                    setMeetingData({ ...meetingData, rooms: newRooms });
                  }}
                />
                <InputField
                  label="Price/Hr (₹)"
                  type="number"
                  value={room.pricePerHour}
                  onChange={(e: any) => {
                    const newRooms = [...meetingData.rooms];
                    newRooms[idx].pricePerHour = parseInt(e.target.value);
                    setMeetingData({ ...meetingData, rooms: newRooms });
                  }}
                />
                <InputField
                  label="Count"
                  type="number"
                  value={room.count}
                  onChange={(e: any) => {
                    const newRooms = [...meetingData.rooms];
                    newRooms[idx].count = parseInt(e.target.value);
                    setMeetingData({ ...meetingData, rooms: newRooms });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-8">
        <button
          onClick={() => {
            const idx = selectedTypes.indexOf("meeting");
            if (idx > 0) {
              setCurrentStep(selectedTypes[idx - 1] as Step);
            } else {
              setCurrentStep("selection");
            }
          }}
          className="flex items-center gap-2 px-6 py-3 text-slate-500 font-semibold hover:text-slate-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={saveMeeting}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 bg-[#3FA69E] text-white rounded-xl font-bold shadow-lg shadow-teal-100 hover:translate-y-[-2px] transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save & Next"}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto text-[#3FA69E]">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">All Set!</h2>
        <p className="text-slate-500">
          Your property and service details have been captured successfully.
        </p>
      </div>

      {partnerKycStatus === "approved" ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">Final Review</h3>
            <p className="text-sm text-slate-500">
              Please review all entries before submitting. Once submitted, your
              property will be listed for admin approval.
            </p>
          </div>

          <div className="flex items-start gap-3 p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
            <input
              type="checkbox"
              id="policy"
              className="mt-1 w-4 h-4 text-[#3FA69E] border-slate-300 rounded focus:ring-[#3FA69E]"
              checked={policyAccepted}
              onChange={(e) => setPolicyAccepted(e.target.checked)}
            />
            <label
              htmlFor="policy"
              className="text-sm text-slate-700 font-medium"
            >
              I hereby confirm that all provided information is accurate and I
              accept FlashSpace's partner policies and terms of service.
            </label>
          </div>

          <button
            onClick={submitPropertyForReview}
            disabled={!policyAccepted || loading}
            className="w-full py-4 bg-[#3FA69E] text-white rounded-2xl font-bold shadow-xl shadow-teal-100 disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] transition-all"
          >
            {loading ? "Submitting..." : "Submit Property for Admin Review"}
          </button>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-2">
            <h3 className="font-bold text-slate-900">Complete Personal KYC</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              As per regulatory requirements, we need to verify your identity
              before you can start listing properties and accepting bookings.
              This usually takes less than 2 minutes.
            </p>
          </div>
          <button
            onClick={() => navigate("/spaceportal/kyc-verification")}
            className="px-8 py-4 bg-[#3FA69E] text-white rounded-2xl font-bold shadow-xl shadow-teal-100 whitespace-nowrap hover:scale-105 transition-transform"
          >
            Complete KYC Now
          </button>
        </div>
      )}

      <div className="flex justify-center pt-4">
        <button
          onClick={handleFinish}
          className="text-slate-400 font-semibold hover:text-slate-600 transition-colors"
        >
          I'll do it later, take me to dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 max-w-5xl mx-auto p-4 md:p-8">
      <button
        onClick={() => navigate("/spaceportal/space-management")}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors mb-4 group"
      >
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </div>
        <span className="font-semibold text-sm">Back to Portal</span>
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 font-[Poppins]">
          Add New Space
        </h1>
        <p className="text-slate-500">
          Capture property details and list across multiple services.
        </p>
      </div>

      {renderStepper()}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        {currentStep === "property" && renderPropertyStep()}
        {currentStep === "selection" && renderSelectionStep()}
        {currentStep === "coworking" && renderCoworkingStep()}
        {currentStep === "virtual" && renderVirtualStep()}
        {currentStep === "meeting" && renderMeetingStep()}
        {currentStep === "review" && renderReviewStep()}
      </div>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm focus:border-[#3FA69E] focus:ring-1 focus:ring-[#3FA69E] focus:outline-none transition-all"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function X({ className }: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
