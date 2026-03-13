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
  FileType,
  AlertCircle,
  ExternalLink,
  X as CloseIcon,
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
import {
  createMeetingRoom,
  updateMeetingRoom,
  bulkSaveMeetingRooms,
} from "@/services/meetingRoom.service";
import { Property } from "@/types/services";

type Step =
  | "property"
  | "property_kyc"
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
  const initialStep = searchParams.get("step") as Step;
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
  const [pendingImages, setPendingImages] = useState<
    { file: File; preview: string }[]
  >([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [featureInput, setFeatureInput] = useState("");
  const [selectedAmenity, setSelectedAmenity] = useState("");

  const [propertyDocuments, setPropertyDocuments] = useState<any[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const [partnerKycStatus, setPartnerKycStatus] =
    useState<string>("not_started");
  const [propertyKycStatus, setPropertyKycStatus] =
    useState<string>("not_started");
  const [propertyKycRejectionReason, setPropertyKycRejectionReason] =
    useState<string>("");
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  useEffect(() => {
    if (initialStep) {
      setCurrentStep(initialStep);
    }
  }, [initialStep]);

  useEffect(() => {
    const loadPropertyData = async (targetId: string) => {
      setLoading(true);
      try {
        const prop = await propertyService.getPropertyById(targetId);
        setPropertyData({
          name: prop.name || "",
          address: prop.address || "",
          city: prop.city || "",
          area: prop.area || "",
          features: prop.features || [],
          images: prop.images || [],
        });
        setPropertyKycStatus(prop.kycStatus || "not_started");
        setPropertyKycRejectionReason(prop.kycRejectionReason || "");
        setPropertyDocuments(prop.documents || []);

        // Fetch associated spaces
        const spaces = await propertyService.getPropertySpaces(targetId);
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
                numberOfSeats: table.seats?.length || table.numberOfSeats || 1,
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
              virtual.partnerBrPricePerYear || virtual.finalBrPricePerYear || 0,
          }));
        }

        if (spaces.meetingRooms && spaces.meetingRooms.length > 0) {
          types.push("meeting");
          // Initialize rooms, using count from database if present, else default 1
          const normalizedRooms = spaces.meetingRooms.map((curr: any) => ({
            type: curr.type,
            capacity: curr.capacity,
            count: curr.count || 1,
            pricePerHour: curr.partnerPricePerHour || curr.pricePerHour,
            ids: [curr._id], // Still keeping track if needed
          }));
          setMeetingData({ rooms: normalizedRooms });
        }

        setSelectedTypes(types);
      } catch (err) {
        toast.error("Failed to load property data");
      } finally {
        setLoading(false);
      }
    };

    if (editId) {
      loadPropertyData(editId);
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

  useEffect(() => {
    if (propertyId && currentStep === "property_kyc") {
      const fetchPropertyDocs = async () => {
        try {
          const prop = await propertyService.getPropertyById(propertyId);
          setPropertyDocuments(prop.documents || []);
        } catch (err) {
          console.error("Failed to fetch property documents", err);
        }
      };
      fetchPropertyDocs();
    }
  }, [propertyId, currentStep]);

  const handlePropertyDocUpload = async (type: string, file: File) => {
    if (!propertyId) return;
    setUploadingDoc(type);
    try {
      await propertyService.uploadPropertyDocument(propertyId, type, file);
      toast.success("Document uploaded successfully");
      // Refresh documents
      const prop = await propertyService.getPropertyById(propertyId);
      setPropertyDocuments(prop.documents || []);
    } catch (err) {
      toast.error("Failed to upload document");
    } finally {
      setUploadingDoc(null);
    }
  };

  const handlePropertyDocDelete = async (type: string) => {
    if (!propertyId) return;
    try {
      await propertyService.deletePropertyDocument(propertyId, type);
      toast.success("Document removed");
      // Refresh documents
      const prop = await propertyService.getPropertyById(propertyId);
      setPropertyDocuments(prop.documents || []);
    } catch (err) {
      toast.error("Failed to remove document");
    }
  };

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
        capacity: 0,
        pricePerHour: 0,
        count: 0,
        ids: [] as string[],
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

  const handleRemoveImage = (index: number) => {
    const imageUrl = propertyData.images[index];
    if (imageUrl.startsWith("blob:")) {
      setPendingImages((prev) => prev.filter((p) => p.preview !== imageUrl));
      URL.revokeObjectURL(imageUrl);
    }
    setPropertyData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleImageFileSelection = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (propertyId) {
      setUploadingImages(true);
      try {
        for (const file of files) {
          const resp = await propertyService.uploadPropertyImage(
            propertyId,
            file,
          );
          setPropertyData((prev) => ({
            ...prev,
            images: [...prev.images, resp.data.url],
          }));
        }
        toast.success("Images uploaded successfully");
      } catch (err) {
        toast.error("Failed to upload images");
      } finally {
        setUploadingImages(false);
      }
    } else {
      const newPending = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setPendingImages((prev) => [...prev, ...newPending]);
      setPropertyData((prev) => ({
        ...prev,
        images: [...prev.images, ...newPending.map((p) => p.preview)],
      }));
    }
  };

  // --- Navigation Helpers ---
  const getNextStep = (current: Step): Step => {
    if (current === "property") return "property_kyc";
    if (current === "property_kyc") return "selection";

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
    const newErrors: Record<string, boolean> = {};
    if (!propertyData.name) newErrors.name = true;
    if (!propertyData.address) newErrors.address = true;
    if (!propertyData.city) newErrors.city = true;
    if (!propertyData.area) newErrors.area = true;
    if (propertyData.features.length === 0) newErrors.features = true;
    if (propertyData.images.length === 0) newErrors.images = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      let currentPropertyId = propertyId;
      if (editId) {
        const cleanImages = propertyData.images.filter(
          (img) => !img.startsWith("blob:"),
        );
        await propertyService.updateProperty(editId, {
          ...propertyData,
          images: cleanImages,
        });
        toast.success("Property updated!");
      } else {
        const cleanData = {
          ...propertyData,
          images: propertyData.images.filter((img) => !img.startsWith("blob:")),
        };
        const resp = await propertyService.createProperty(cleanData);
        currentPropertyId = resp._id;
        setPropertyId(currentPropertyId);

        // Upload any pending images
        if (pendingImages.length > 0) {
          const uploadedUrls: string[] = [];
          for (const item of pendingImages) {
            const resp = await propertyService.uploadPropertyImage(
              currentPropertyId,
              item.file,
            );
            uploadedUrls.push(resp.data.url);
            URL.revokeObjectURL(item.preview);
          }
          setPendingImages([]);
          setPropertyData((prev) => ({
            ...prev,
            images: [
              ...prev.images.filter((img) => !img.startsWith("blob:")),
              ...uploadedUrls,
            ],
          }));
        }
        toast.success("Property details saved!");
      }
      setCurrentStep("property_kyc");
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

    const newErrors: Record<string, boolean> = {};
    const validFloors = coworkingData.floors.filter((f) => f.tables.length > 0);

    if (validFloors.length === 0) {
      newErrors.floors = true;
    }

    const hasIncompleteTables = validFloors.some((f, fIdx) =>
      f.tables.some((t, tIdx) => {
        if (!t.numberOfSeats || t.numberOfSeats <= 0) {
          newErrors[`floor_${fIdx}_table_${tIdx}`] = true;
          return true;
        }
        return false;
      }),
    );

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error(
        "Please ensure all floors have tables and valid seating capacities",
      );
      return;
    }

    setLoading(true);
    try {
      const { pricePerMonth, ...rest } = coworkingData;
      const data = {
        ...rest,
        floors: validFloors,
        partnerPricePerMonth: pricePerMonth,
        finalPricePerMonth: pricePerMonth,
        propertyId,
        amenities: propertyData.features || [],
        images: propertyData.images || [],
      } as any;

      if ((coworkingData as any)._id) {
        await updateCoworkingSpace((coworkingData as any)._id, data);
      } else {
        const resp = await createCoworkingSpace(data);
        if (resp.success && resp.data?._id) {
          setCoworkingData((prev) => ({ ...prev, _id: resp.data._id }));
        }
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

    const newErrors: Record<string, boolean> = {};
    if (!virtualData.finalGstPricePerYear) newErrors.gstPrice = true;
    if (!virtualData.finalMailingPricePerYear) newErrors.mailingPrice = true;
    if (!virtualData.finalBrPricePerYear) newErrors.brPrice = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("All three Virtual Office plans are mandatory");
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...virtualData,
        partnerGstPricePerYear: virtualData.finalGstPricePerYear,
        finalGstPricePerYear: virtualData.finalGstPricePerYear,
        partnerMailingPricePerYear: virtualData.finalMailingPricePerYear,
        finalMailingPricePerYear: virtualData.finalMailingPricePerYear,
        partnerBrPricePerYear: virtualData.finalBrPricePerYear,
        finalBrPricePerYear: virtualData.finalBrPricePerYear,
        propertyId,
        features: propertyData.features || [],
        amenities: propertyData.features || [],
        images: propertyData.images || [],
      } as any;

      if ((virtualData as any)._id) {
        await updateVirtualOffice((virtualData as any)._id, data);
      } else {
        const resp = await createVirtualOffice(data);
        if (resp.success && resp.data?._id) {
          setVirtualData((prev) => ({ ...prev, _id: resp.data._id }));
        }
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

    const newErrors: Record<string, boolean> = {};
    if (meetingData.rooms.length === 0) {
      newErrors.meetingRooms = true;
    }

    meetingData.rooms.forEach((r, idx) => {
      if (!r.capacity || !r.pricePerHour || !r.count) {
        newErrors[`meeting_room_${idx}`] = true;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill all details for each room");
      return;
    }

    setLoading(true);
    try {
      const allRoomsPayload = meetingData.rooms.map((room) => ({
        _id: room.ids && room.ids.length > 0 ? room.ids[0] : undefined,
        type: room.type,
        capacity: room.capacity.toString(),
        count: room.count,
        pricePerHour: room.pricePerHour,
        amenities: propertyData.features || [],
        images: propertyData.images || [],
        operatingHours: coworkingData.operatingHours,
      }));

      await bulkSaveMeetingRooms(propertyId, allRoomsPayload);

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
    navigate(-1);
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
      navigate(-1);
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
      { id: "property_kyc", label: "Property KYC" },
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
            step.id === "property_kyc" ||
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
                        : step.id === "property_kyc" &&
                            propertyKycStatus === "rejected"
                          ? "border-red-500 text-red-500 bg-red-50 animate-pulse"
                          : "border-slate-200 text-slate-400"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : step.id === "property_kyc" &&
                    propertyKycStatus === "rejected" ? (
                    <AlertCircle className="w-6 h-6" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  className={`text-xs font-semibold whitespace-nowrap ${
                    isActive
                      ? "text-[#3FA69E]"
                      : step.id === "property_kyc" &&
                          propertyKycStatus === "rejected"
                        ? "text-red-500"
                        : "text-slate-500"
                  }`}
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
          onChange={(e: any) => {
            setPropertyData({ ...propertyData, name: e.target.value });
            clearError("name");
          }}
          onBlur={(e: any) => {
            if (!e.target.value.trim()) {
              setErrors((prev) => ({ ...prev, name: true }));
            }
          }}
          error={errors.name}
        />
        <div className="space-y-2">
          <label
            className={`text-xs font-bold uppercase tracking-wider ${
              errors.city ? "text-red-500" : "text-slate-500"
            }`}
          >
            City *
          </label>
          <select
            className={`w-full h-12 rounded-xl border ${
              errors.city
                ? "border-red-500 bg-red-50/30 ring-1 ring-red-500"
                : "border-slate-200 bg-white"
            } px-4 text-sm font-semibold text-slate-700 shadow-sm focus:border-[#3FA69E] focus:ring-1 focus:ring-[#3FA69E] focus:outline-none transition-all outline-none`}
            value={propertyData.city}
            onChange={(e) => {
              setPropertyData({ ...propertyData, city: e.target.value });
              clearError("city");
            }}
            onBlur={(e) => {
              if (!e.target.value) {
                setErrors((prev) => ({ ...prev, city: true }));
              }
            }}
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
          onChange={(e: any) => {
            setPropertyData({ ...propertyData, area: e.target.value });
            clearError("area");
          }}
          onBlur={(e: any) => {
            if (!e.target.value.trim()) {
              setErrors((prev) => ({ ...prev, area: true }));
            }
          }}
          error={errors.area}
        />
        <InputField
          label="Full Address *"
          placeholder="Plot No. C-XXXX, G Block..."
          value={propertyData.address}
          onChange={(e: any) => {
            setPropertyData({ ...propertyData, address: e.target.value });
            clearError("address");
          }}
          onBlur={(e: any) => {
            if (!e.target.value.trim()) {
              setErrors((prev) => ({ ...prev, address: true }));
            }
          }}
          error={errors.address}
        />
      </div>

      <div className="space-y-3">
        <label
          className={`text-sm font-semibold ${
            errors.features ? "text-red-500" : "text-slate-700"
          }`}
        >
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
                  clearError("features");
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
                    clearError("features");
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
                <CloseIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700">
          Property Images *
        </label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="image-upload"
            className={`flex flex-col items-center justify-center w-full h-32 border-2 ${
              errors.images ? "border-red-500" : "border-slate-300"
            } border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploadingImages ? (
                <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-2" />
              ) : (
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
              )}
              <p className="text-sm text-slate-500 font-medium">
                {uploadingImages
                  ? "Uploading..."
                  : "Click to upload property images"}
              </p>
              <p className="text-xs text-slate-400">PNG, JPG or JPEG</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              id="image-upload"
              onChange={(e) => {
                handleImageFileSelection(e);
                clearError("images");
              }}
              disabled={uploadingImages}
            />
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
          {propertyData.images.map((img, i) => (
            <div
              key={i}
              className="relative aspect-video rounded-xl overflow-hidden group shadow-sm"
            >
              <img
                src={
                  img.startsWith("/")
                    ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${img}`
                    : img
                }
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(i)}
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

  const renderPropertyKYCStep = () => {
    const docTypes = [
      {
        id: "ownership_proof",
        label: "Ownership Proof / Lease Agreement",
        required: true,
      },
      { id: "property_tax", label: "Property Tax Receipt", required: false },
      {
        id: "electricity_bill",
        label: "Electricity Bill (Latest)",
        required: true,
      },
      { id: "fire_safety", label: "Fire Safety Certificate", required: false },
      { id: "trade_license", label: "Trade License", required: false },
    ];

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
            <Info className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">
              Please upload clear documents for property verification. This
              helps in faster approval of your listing.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {docTypes.map((docType) => {
              const doc = propertyDocuments.find((d) => d.type === docType.id);
              const isUploading = uploadingDoc === docType.id;

              return (
                <div
                  key={docType.id}
                  className={`flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border transition-all group ${
                    doc?.status === "rejected"
                      ? "border-red-200 bg-red-50/30"
                      : "border-slate-200 bg-white hover:border-[#3FA69E]"
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        doc?.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : doc
                            ? "bg-teal-50 text-[#3FA69E]"
                            : "bg-slate-50 text-slate-400"
                      } group-hover:scale-110 transition-transform`}
                    >
                      {doc?.status === "rejected" ? (
                        <AlertCircle className="w-6 h-6" />
                      ) : (
                        <FileType className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">
                        {docType.label}
                        {docType.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </h4>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-slate-500">
                          {doc
                            ? `Uploaded: ${new Date(doc.uploadedAt as string).toLocaleDateString()}`
                            : "Not uploaded yet"}
                        </p>
                        {doc?.status === "rejected" && (
                          <p className="text-xs font-bold text-red-600">
                            Rejection Reason: {doc.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 md:mt-0">
                    {doc ? (
                      <>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-4 py-2 text-[#3FA69E] bg-teal-50 rounded-xl text-sm font-bold hover:bg-teal-100 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" /> View
                        </a>
                        <button
                          onClick={() => handlePropertyDocDelete(docType.id)}
                          className="p-2 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <label className="cursor-pointer relative overflow-hidden">
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePropertyDocUpload(docType.id, file);
                          }}
                          disabled={isUploading}
                        />
                        <div
                          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${isUploading ? "bg-slate-100 text-slate-400" : "bg-[#3FA69E] text-white hover:shadow-lg hover:shadow-teal-100"}`}
                        >
                          {isUploading ? (
                            <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          {isUploading ? "Uploading..." : "Upload File"}
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-slate-100">
          <button
            onClick={() => setCurrentStep("property")}
            className="flex items-center gap-2 px-6 py-3 text-slate-500 font-semibold hover:text-slate-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Details
          </button>
          <button
            onClick={() => {
              // Check for required documents
              const requiredMissing = docTypes
                .filter((dt) => dt.required)
                .some((dt) => !propertyDocuments.some((d) => d.type === dt.id));

              if (requiredMissing) {
                toast.error(
                  "Please upload all required documents (marked with *)",
                );
                return;
              }
              setCurrentStep("selection");
            }}
            className="flex items-center gap-2 px-8 py-3 bg-[#3FA69E] text-white rounded-xl font-bold shadow-lg shadow-teal-100 hover:translate-y-[-2px] transition-all"
          >
            Continue to Services
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

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
          onClick={() => setCurrentStep("property_kyc")}
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
          label="Price per Month (Partner Price)"
          type="number"
          placeholder="e.g. 5000"
          value={coworkingData.pricePerMonth}
          onChange={(e: any) => {
            setCoworkingData({
              ...coworkingData,
              pricePerMonth: Number(e.target.value),
            });
            clearError("pricePerMonth");
          }}
          onBlur={(e: any) => {
            if (!e.target.value || Number(e.target.value) <= 0) {
              setErrors((prev) => ({ ...prev, pricePerMonth: true }));
            }
          }}
          error={errors.pricePerMonth}
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
                  className={`bg-white p-4 rounded-xl border ${
                    errors[`floor_${fIdx}_table_${tIdx}`]
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-slate-200"
                  } shadow-sm space-y-3`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase">
                      {table.tableNumber}
                    </span>
                    <input
                      type="number"
                      min="1"
                      className={`w-16 h-8 text-xs font-bold ${
                        errors[`floor_${fIdx}_table_${tIdx}`]
                          ? "text-red-600 border-red-300 ring-1 ring-red-500"
                          : "text-[#3FA69E] border-slate-200"
                      } border rounded-lg px-2 focus:outline-none focus:border-[#3FA69E]`}
                      value={table.numberOfSeats || 1}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        const newFloors = [...coworkingData.floors];
                        newFloors[fIdx].tables[tIdx].numberOfSeats = val;
                        setCoworkingData({
                          ...coworkingData,
                          floors: newFloors,
                        });
                        clearError(`floor_${fIdx}_table_${tIdx}`);
                      }}
                      onBlur={(e) => {
                        if (!e.target.value || parseInt(e.target.value) <= 0) {
                          setErrors((prev) => ({
                            ...prev,
                            [`floor_${fIdx}_table_${tIdx}`]: true,
                          }));
                        }
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
          onChange={(e: any) => {
            setVirtualData({
              ...virtualData,
              finalGstPricePerYear: Number(e.target.value),
            });
            clearError("gstPrice");
          }}
          onBlur={(e: any) => {
            if (!e.target.value || Number(e.target.value) <= 0) {
              setErrors((prev) => ({ ...prev, gstPrice: true }));
            }
          }}
          error={errors.gstPrice}
        />
        <InputField
          label="Mailing Plan Price (₹/Yr) *"
          type="number"
          value={virtualData.finalMailingPricePerYear}
          onChange={(e: any) => {
            setVirtualData({
              ...virtualData,
              finalMailingPricePerYear: Number(e.target.value),
            });
            clearError("mailingPrice");
          }}
          onBlur={(e: any) => {
            if (!e.target.value || Number(e.target.value) <= 0) {
              setErrors((prev) => ({ ...prev, mailingPrice: true }));
            }
          }}
          error={errors.mailingPrice}
        />
        <InputField
          label="BR Plan Price (₹/Yr) *"
          type="number"
          value={virtualData.finalBrPricePerYear}
          onChange={(e: any) => {
            setVirtualData({
              ...virtualData,
              finalBrPricePerYear: Number(e.target.value),
            });
            clearError("brPrice");
          }}
          onBlur={(e: any) => {
            if (!e.target.value || Number(e.target.value) <= 0) {
              setErrors((prev) => ({ ...prev, brPrice: true }));
            }
          }}
          error={errors.brPrice}
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
                    capacity: 0,
                    pricePerHour: 0,
                    count: 0,
                    ids: [], // New rooms have no IDs
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
              className={`p-6 rounded-2xl border ${
                errors[`meeting_room_${idx}`]
                  ? "border-red-500 ring-1 ring-red-500"
                  : "border-slate-200"
              } bg-slate-50 space-y-4 relative group`}
            >
              <button
                onClick={() => {
                  const newRooms = [...meetingData.rooms];
                  newRooms.splice(idx, 1);
                  setMeetingData({ rooms: newRooms });
                  clearError(`meeting_room_${idx}`);
                }}
                className="absolute top-4 right-4 text-red-500 opacity-100 p-2 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Room Type
                </label>
                <select
                  className={`w-full h-12 rounded-xl border ${
                    errors[`meeting_room_${idx}`] && !room.capacity
                      ? "border-red-500"
                      : "border-slate-200"
                  } bg-white px-4 text-sm focus:outline-none focus:border-[#3FA69E] transition-colors`}
                  value={room.type}
                  onChange={(e) => {
                    const newRooms = [...meetingData.rooms];
                    newRooms[idx].type = e.target.value;
                    setMeetingData({ rooms: newRooms });
                    clearError(`meeting_room_${idx}`);
                  }}
                >
                  <option value="meeting_room">Meeting Room</option>
                  <option value="conference_room">Conference Room</option>
                  <option value="board_room">Board Room</option>
                  <option value="other">Training Room / Other</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <InputField
                  label="Capacity"
                  type="number"
                  value={room.capacity}
                  onChange={(e: any) => {
                    const newRooms = [...meetingData.rooms];
                    newRooms[idx].capacity = Number(e.target.value);
                    setMeetingData({ rooms: newRooms });
                    clearError(`meeting_room_${idx}`);
                  }}
                  onBlur={(e: any) => {
                    if (!e.target.value || Number(e.target.value) <= 0) {
                      setErrors((prev) => ({
                        ...prev,
                        [`meeting_room_${idx}`]: true,
                      }));
                    }
                  }}
                  error={errors[`meeting_room_${idx}`] && !room.capacity}
                />
                <InputField
                  label="Price/Hr (₹)"
                  type="number"
                  value={room.pricePerHour}
                  onChange={(e: any) => {
                    const newRooms = [...meetingData.rooms];
                    newRooms[idx].pricePerHour = Number(e.target.value);
                    setMeetingData({ rooms: newRooms });
                    clearError(`meeting_room_${idx}`);
                  }}
                  onBlur={(e: any) => {
                    if (!e.target.value || Number(e.target.value) <= 0) {
                      setErrors((prev) => ({
                        ...prev,
                        [`meeting_room_${idx}`]: true,
                      }));
                    }
                  }}
                  error={errors[`meeting_room_${idx}`] && !room.pricePerHour}
                />
                <InputField
                  label="Count"
                  type="number"
                  value={room.count}
                  onChange={(e: any) => {
                    const newRooms = [...meetingData.rooms];
                    newRooms[idx].count = Number(e.target.value);
                    setMeetingData({ rooms: newRooms });
                    clearError(`meeting_room_${idx}`);
                  }}
                  onBlur={(e: any) => {
                    if (!e.target.value || Number(e.target.value) <= 0) {
                      setErrors((prev) => ({
                        ...prev,
                        [`meeting_room_${idx}`]: true,
                      }));
                    }
                  }}
                  error={errors[`meeting_room_${idx}`] && !room.count}
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

  const renderReviewStep = () => {
    const isPropertyKycApproved = propertyKycStatus === "approved";
    const isPropertyKycPending = propertyKycStatus === "pending";
    const isPropertyKycRejected = propertyKycStatus === "rejected";
    const isPartnerKycApproved = partnerKycStatus === "approved";

    return (
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

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-900">Final Review</h3>
            <p className="text-sm text-slate-500">
              Please review all entries before submitting. Once submitted, your
              property will be listed for admin approval.
            </p>
          </div>

          {!isPartnerKycApproved && (
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-900">
                  Partner Identity KYC Not Complete
                </h4>
                <p className="text-xs text-amber-700">
                  Please complete your personal KYC to enable property
                  submission.
                </p>
                <button
                  onClick={() => navigate("/spaceportal/kyc-verification")}
                  className="mt-2 text-xs font-bold text-[#3FA69E] hover:underline flex items-center gap-1"
                >
                  Complete Personal KYC <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Property KYC Status Summary */}
          <div
            className={`p-6 rounded-2xl border ${
              isPropertyKycApproved
                ? "bg-emerald-50 border-emerald-100"
                : isPropertyKycPending
                  ? "bg-blue-50 border-blue-100"
                  : isPropertyKycRejected
                    ? "bg-red-50 border-red-100"
                    : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isPropertyKycApproved
                    ? "bg-emerald-100 text-emerald-600"
                    : isPropertyKycPending
                      ? "bg-blue-100 text-blue-600"
                      : isPropertyKycRejected
                        ? "bg-red-100 text-red-600"
                        : "bg-slate-200 text-slate-600"
                }`}
              >
                {isPropertyKycApproved ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : isPropertyKycPending ? (
                  <Monitor className="w-6 h-6 animate-pulse" />
                ) : isPropertyKycRejected ? (
                  <AlertCircle className="w-6 h-6" />
                ) : (
                  <FileType className="w-6 h-6" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">
                  Property Verification:{" "}
                  <span className="capitalize">
                    {propertyKycStatus.replace("_", " ")}
                  </span>
                </h4>
                <p className="text-sm text-slate-500">
                  {isPropertyKycApproved
                    ? "This property is verified and active."
                    : isPropertyKycPending
                      ? "Property details are under review by our admin team."
                      : isPropertyKycRejected
                        ? "There are issues with this property submission."
                        : "This property is currently a draft and has not been submitted."}
                </p>
              </div>
            </div>

            {isPropertyKycRejected && propertyKycRejectionReason && (
              <div className="mt-3 p-3 bg-white/50 rounded-lg border border-red-100 text-sm text-red-600 font-medium">
                Rejection Reason: {propertyKycRejectionReason}
              </div>
            )}
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

          <div className="space-y-3">
            <button
              onClick={submitPropertyForReview}
              disabled={
                !policyAccepted ||
                isPropertyKycPending ||
                !isPartnerKycApproved ||
                loading
              }
              className="w-full py-4 bg-[#3FA69E] text-white rounded-2xl font-bold shadow-xl shadow-teal-100 disabled:opacity-50 disabled:grayscale disabled:shadow-none hover:scale-[1.01] transition-all"
            >
              {loading
                ? "Submitting..."
                : isPropertyKycRejected
                  ? "Resubmit Property for Review"
                  : isPropertyKycPending
                    ? "Currently Under Review"
                    : "Submit Property for Admin Review"}
            </button>

            {isPropertyKycPending && (
              <p className="text-center text-xs text-blue-600 font-semibold">
                * Our team is reviewing your property. Changes are locked during
                review.
              </p>
            )}

            {!isPartnerKycApproved && (
              <p className="text-center text-xs text-amber-600 font-semibold">
                * Please complete Personal KYC to enable submission.
              </p>
            )}
          </div>
        </div>

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
  };

  const rejectedDocs = propertyDocuments.filter((d) => d.status === "rejected");
  const rejectedDocNames = rejectedDocs.map((d) => {
    const labelMap: any = {
      ownership_proof: "Ownership Proof / Lease Agreement",
      property_tax: "Property Tax Receipt",
      electricity_bill: "Electricity Bill (Latest)",
      fire_safety: "Fire Safety Certificate",
      trade_license: "Trade License",
    };
    return labelMap[d.type] || d.type;
  });

  return (
    <div className="flex-1 max-w-5xl mx-auto p-4 md:p-8">
      {propertyKycStatus === "not_started" && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-1">
                Complete Property Verification
              </h3>
              <p className="text-blue-700/80 text-sm leading-relaxed">
                To ensure a smooth onboarding process, please provide accurate
                property information and clear document uploads. Verification
                typically takes 24-48 hours once submitted.
              </p>
            </div>
          </div>
        </div>
      )}

      {propertyKycStatus === "rejected" && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-900 mb-1">
                Verification Issues Found
              </h3>
              <p className="text-red-700/80 text-sm leading-relaxed mb-4">
                {propertyKycRejectionReason ||
                  "Please review the issues highlighted below and update the necessary documents."}
              </p>

              {rejectedDocNames.length > 0 && (
                <div className="text-sm text-red-800 bg-red-100/50 p-4 rounded-xl border border-red-100">
                  <strong className="block mb-2 text-red-900">
                    Action Required For:
                  </strong>
                  <ul className="list-disc pl-5 space-y-1">
                    {rejectedDocNames.map((name, idx) => (
                      <li key={idx} className="font-medium">
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
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
        {currentStep === "property_kyc" && renderPropertyKYCStep()}
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
  onBlur,
  type = "text",
  error,
}: any) {
  return (
    <div className="space-y-2">
      <label
        className={`text-xs font-bold uppercase tracking-wider ${
          error ? "text-red-500" : "text-slate-500"
        }`}
      >
        {label}
      </label>
      <input
        type={type}
        className={`w-full h-12 rounded-xl border ${
          error
            ? "border-red-500 bg-red-50/30 ring-1 ring-red-500"
            : "border-slate-200 bg-white"
        } px-4 text-sm font-semibold text-slate-700 shadow-sm focus:border-[#3FA69E] focus:ring-1 focus:ring-[#3FA69E] focus:outline-none transition-all`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
}
