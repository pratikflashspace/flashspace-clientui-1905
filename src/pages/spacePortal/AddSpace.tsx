import { useState, useEffect, useMemo } from "react";
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
  Shield,
  Clock,
  Layout,
  Briefcase,
  Star,
  Settings,
  AlertTriangle,
  Check,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

import propertyService from "@/services/property.service";
import { useAuth } from "@/contexts/AuthContext";
import { getMySpaceUserKyc } from "@/Api/spacePartnerKyc.service";
import { getSafeImageUrl } from "@/utils/imageUrl";
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
import MapLibreMap from "@/components/Map/MapLibreMap";

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
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  const steps = useMemo<{ id: Step; label: string; icon: any }[]>(() => [
    { id: "property", label: "Property", icon: Building2 },
    { id: "property_kyc", label: "KYC", icon: Shield },
    { id: "selection", label: "Services", icon: Layout },
    { id: "coworking", label: "Coworking", icon: Briefcase },
    { id: "virtual", label: "Virtual", icon: Monitor },
    { id: "meeting", label: "On-Demand", icon: Users },
    { id: "review", label: "Review", icon: CheckCircle2 },
  ], []);

  const [propertyData, setPropertyData] = useState({
    name: "",
    address: "",
    city: "",
    area: "",
    features: [] as string[],
    images: [] as string[],
    googleMapLink: "",
    location: undefined as any,
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
          googleMapLink: prop.googleMapLink || "",
          location: prop.location,
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
        const resp = await propertyService.uploadMultiplePropertyImages(
          propertyId,
          files,
        );
        
        if (resp.data?.urls) {
          setPropertyData((prev) => ({
            ...prev,
            images: [...prev.images, ...resp.data.urls],
          }));
        }
        toast.success(`${files.length} images uploaded successfully`);
      } catch (err) {
        console.error("Upload error:", err);
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
        if (resp && resp._id) {
          setCoworkingData((prev) => ({ ...prev, _id: resp._id }));
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
        if (resp && resp._id) {
          setVirtualData((prev) => ({ ...prev, _id: resp._id }));
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
        capacity: room.capacity,
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
      if (isAdmin) {
        // Direct Publish for Admins
        await propertyService.updateProperty(propertyId, {
          kycStatus: "approved",
          isActive: true,
          status: "active",
        });

        // Also activate all associated spaces
        const spaces = await propertyService.getPropertySpaces(propertyId);
        
        if (spaces.coworkingSpaces && spaces.coworkingSpaces.length > 0) {
          for (const cs of spaces.coworkingSpaces) {
            await updateCoworkingSpace(cs._id, { isActive: true, availability: "Available Now" });
          }
        }
        
        if (spaces.virtualOffices && spaces.virtualOffices.length > 0) {
          for (const vo of spaces.virtualOffices) {
            await updateVirtualOffice(vo._id, { isActive: true, availability: "Available Now" });
          }
        }

        toast.success("Property published successfully!");
      } else {
        await propertyService.updateProperty(propertyId, {
          kycStatus: "pending",
        });
        toast.success("Property submitted for admin review!");
      }
      navigate(-1);
    } catch (err) {
      toast.error(isAdmin ? "Failed to publish property" : "Failed to submit property for review");
    } finally {
      setLoading(false);
    }
  };

  // --- Renderers ---

  const renderStepper = () => {
    return (
      <div className="bg-background border border-border rounded-2xl p-4 mb-8 shadow-sm overflow-x-auto">
        <div className="flex items-center min-w-[800px] justify-between px-4">
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
                className={`flex items-center flex-1 last:flex-none`}
                onClick={() => {
                  if (editId && isVisible) {
                    setCurrentStep(step.id as Step);
                  }
                }}
              >
                <div className={`flex flex-col items-center gap-2 relative group focus:outline-none ${editId ? "cursor-pointer" : ""}`}>
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                      isCompleted
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                        : isActive
                          ? "bg-background border-primary text-primary shadow-xl scale-110"
                          : step.id === "property_kyc" &&
                              propertyKycStatus === "rejected"
                            ? "border-destructive text-destructive bg-destructive/5 animate-pulse"
                            : "border-muted text-muted-foreground bg-muted/20"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-extrabold whitespace-nowrap transition-colors ${
                      isActive
                        ? "text-primary"
                        : step.id === "property_kyc" &&
                            propertyKycStatus === "rejected"
                          ? "text-destructive"
                          : "text-muted-foreground/60"
                    }`}
                  >
                    {step.label}
                  </span>
                  
                  {isActive && (
                    <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
                  )}
                </div>
                {idx < steps.length - 1 && steps[idx+1].id !== "review" && (
                  <div
                    className={`h-[1px] mx-4 flex-1 min-w-[20px] ${isCompleted ? "bg-primary" : "bg-muted"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPropertyStep = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
           <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Property Name *</label>
           <Input
             placeholder="e.g. Flashspace Hub BKC"
             value={propertyData.name}
             onChange={(e) => {
               setPropertyData({ ...propertyData, name: e.target.value });
               clearError("name");
             }}
             onBlur={(e) => {
               if (!e.target.value.trim()) {
                 setErrors((prev) => ({ ...prev, name: true }));
               }
             }}
             className={errors.name ? "border-destructive ring-destructive" : ""}
           />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">City *</label>
          <select
            className={`w-full h-12 rounded-xl border bg-background px-4 text-sm font-semibold shadow-sm focus:ring-1 focus:ring-primary focus:outline-none transition-all outline-none ${
              errors.city ? "border-destructive" : "border-border"
            }`}
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

        <div className="space-y-2">
           <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Area *</label>
           <Input
             placeholder="Bandra Kurla Complex"
             value={propertyData.area}
             onChange={(e) => {
               setPropertyData({ ...propertyData, area: e.target.value });
               clearError("area");
             }}
             onBlur={(e) => {
               if (!e.target.value.trim()) {
                 setErrors((prev) => ({ ...prev, area: true }));
               }
             }}
             className={errors.area ? "border-destructive ring-destructive" : ""}
           />
        </div>

        <div className="space-y-2">
           <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Full Address *</label>
           <Input
             placeholder="Plot No. C-XXXX, G Block..."
             value={propertyData.address}
             onChange={(e) => {
               setPropertyData({ ...propertyData, address: e.target.value });
               clearError("address");
             }}
             onBlur={(e) => {
               if (!e.target.value.trim()) {
                 setErrors((prev) => ({ ...prev, address: true }));
               }
             }}
             className={errors.address ? "border-destructive ring-destructive" : ""}
           />
        </div>

        <div className="space-y-2">
           <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Google Maps Link</label>
           <Input
             placeholder="https://www.google.com/maps/place/..."
             value={propertyData.googleMapLink}
             onChange={(e) => {
               const link = e.target.value;
               const newPropData = { ...propertyData, googleMapLink: link };
               
               // Attempt to extract coordinates for preview
               // 1. Try @lat,lng
               // 2. Try q=lat,lng
               // 3. Try any lat,lng pair found in the URL
               const atMatch = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
               const qMatch = link.match(/[q|ll|cbll]=(-?\d+\.\d+),(-?\d+\.\d+)/);
               const genericMatch = link.match(/(-?\d+\.\d+),(-?\d+\.\d+)/);

               const match = atMatch || qMatch || genericMatch;

               if (match) {
                 newPropData.location = {
                   type: "Point",
                   coordinates: [parseFloat(match[2]), parseFloat(match[1])]
                 };
               }
               
               setPropertyData(newPropData);
             }}
             className="border-primary/20"
           />
           <p className="text-[10px] text-muted-foreground italic px-1 mt-1">
             {propertyData.googleMapLink.includes("maps.app.goo.gl") || propertyData.googleMapLink.includes("goo.gl/maps") ? (
               <span className="text-amber-600 font-bold flex items-center gap-1">
                 <AlertTriangle className="w-3 h-3" /> Short links will be processed after saving. For immediate preview, use the full URL from your browser address bar.
               </span>
             ) : (
               "Paste the Google Maps link to automatically extract coordinates."
             )}
           </p>
        </div>
      </div>

      {propertyData.location?.coordinates && (
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Map Preview</label>
          <div className="h-64 rounded-2xl overflow-hidden border border-border shadow-sm">
            <MapLibreMap
                markers={[{
                  id: "preview",
                  position: { 
                    lat: propertyData.location.coordinates[1], 
                    lng: propertyData.location.coordinates[0] 
                  },
                  title: propertyData.name || "Preview Location",
                  address: propertyData.address,
                  image: propertyData.images && propertyData.images.length > 0 ? getSafeImageUrl(propertyData.images[0]) : undefined,
                }]}
              center={{ 
                lat: propertyData.location.coordinates[1], 
                lng: propertyData.location.coordinates[0] 
              }}
              zoom={15}
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        <label className={`text-[10px] uppercase tracking-widest font-black ml-1 ${errors.features ? "text-destructive" : "text-muted-foreground"}`}>
          Property Features (Amenities) *
        </label>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <select
              className="flex-1 h-12 rounded-xl border border-border bg-background px-4 text-sm font-semibold shadow-sm focus:ring-1 focus:ring-primary focus:outline-none transition-all"
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
            <Button
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
              className="h-12 w-12 rounded-xl p-0"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          {selectedAmenity === "Other" && (
            <Input
              placeholder="Type custom amenity here..."
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => {
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
        <div className="flex flex-wrap gap-2">
          {propertyData.features.map((f) => (
            <Badge
              key={f}
              variant="secondary"
              className="pl-3 pr-1 py-1 gap-1 border-primary/10 bg-primary/5 text-primary hover:bg-primary/10 transition-colors rounded-full font-bold text-[11px]"
            >
              {f}
              <Button
                variant="ghost" 
                size="icon"
                onClick={() => removeFeature(f)}
                className="h-5 w-5 rounded-full hover:bg-primary/20 hover:text-primary text-primary/60"
              >
                <CloseIcon className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className={`text-[10px] uppercase tracking-widest font-black ml-1 ${errors.images ? "text-destructive" : "text-muted-foreground"}`}>
          Property Images *
        </label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="image-upload"
            className={`flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${
              errors.images 
                ? "border-destructive bg-destructive/5" 
                : "border-border bg-muted/20 hover:bg-muted/30 hover:border-primary/50 group"
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${
                uploadingImages ? "bg-primary/10" : "bg-primary/10"
              }`}>
                {uploadingImages ? (
                  <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-6 h-6 text-primary" />
                )}
              </div>
              <p className="text-sm font-extrabold text-foreground mb-1">
                {uploadingImages
                  ? "Processing Images..."
                  : "Drop files here or click to upload"}
              </p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                Support PNG, JPG or JPEG (Max 10MB each)
              </p>
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
        
        {propertyData.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
            {propertyData.images.map((img, i) => (
              <div
                key={i}
                className="relative aspect-video rounded-2xl overflow-hidden group shadow-md border border-border"
              >
                <img
                  src={getSafeImageUrl(img)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveImage(i)}
                    className="h-10 w-10 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-10 sticky bottom-0 bg-background/80 backdrop-blur-sm -mx-10 px-10 pb-6 mt-10 border-t border-border/50">
        <Button
          onClick={saveProperty}
          disabled={loading}
          className="h-14 px-10 rounded-2xl font-black text-lg shadow-xl shadow-primary/25 group overflow-hidden relative"
        >
          <span className="relative z-10 flex items-center gap-3">
            {loading ? "Saving Progress..." : editId ? "Update Property" : "Save & Continue"}
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
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
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-primary/5 text-primary rounded-2xl border border-primary/10">
            <Shield className="w-5 h-5 flex-shrink-0" />
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
                      ? "border-destructive/20 bg-destructive/5"
                      : "border-border bg-background hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        doc?.status === "rejected"
                          ? "bg-destructive/10 text-destructive"
                          : doc
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground/40"
                      } group-hover:scale-110`}
                    >
                      {doc?.status === "rejected" ? (
                        <AlertCircle className="w-6 h-6" />
                      ) : (
                        <FileType className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground">
                        {docType.label}
                        {docType.required && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </h4>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-muted-foreground">
                          {doc
                            ? `Uploaded: ${new Date(doc.uploadedAt as string).toLocaleDateString()}`
                            : "Not uploaded yet"}
                        </p>
                        {doc?.status === "rejected" && (
                          <p className="text-xs font-bold text-destructive">
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
                            className="flex items-center gap-1 px-4 py-2 text-primary bg-primary/5 rounded-xl text-sm font-bold hover:bg-primary/10 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" /> View
                          </a>
                          <button
                            onClick={() => handlePropertyDocDelete(docType.id)}
                            className="p-2 text-destructive bg-destructive/5 rounded-xl hover:bg-destructive/10 transition-colors"
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
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${isUploading ? "bg-muted text-muted-foreground" : "bg-primary text-white hover:shadow-lg hover:shadow-primary/10"}`}
                          >
                            {isUploading ? (
                              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
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

        <div className="flex justify-between items-center pt-8 border-t border-border/50">
          <button
            onClick={() => setCurrentStep("property")}
            className="flex items-center gap-2 px-6 py-3 text-muted-foreground font-semibold hover:text-foreground transition-colors"
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
            className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/10 hover:translate-y-[-2px] transition-all"
          >
            Continue to Services
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderSelectionStep = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-3xl font-black text-foreground tracking-tight">
          What <span className="text-primary italic">services</span> are available?
        </h2>
        <p className="text-muted-foreground font-medium text-sm leading-relaxed">
          Select the service types you provide at this property. We'll capture specific details for each in the next steps.
        </p>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              className={`relative flex flex-col items-center text-center p-10 rounded-[32px] border-2 transition-all duration-500 overflow-hidden group ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10 -translate-y-2"
                  : "border-border bg-background hover:border-primary/30 hover:bg-muted/50"
              }`}
            >
              <div
                className={`w-20 h-20 rounded-3xl mb-6 flex items-center justify-center transition-all duration-500 ${
                  isSelected
                    ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20"
                    : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-105"
                }`}
              >
                <type.icon className="w-10 h-10" />
              </div>
              <h3
                className={`font-black text-lg mb-3 tracking-tight transition-colors ${isSelected ? "text-primary" : "text-foreground"}`}
              >
                {type.label}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                {type.desc}
              </p>
 
              {isSelected && (
                <div className="absolute top-6 right-6 p-1.5 bg-primary rounded-full text-white shadow-lg animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
            </button>
          );
        })}
      </div>
 
      <div className="flex items-center justify-between gap-4 pt-10 border-t border-border/50">
        <Button
          variant="ghost" 
          onClick={() => setCurrentStep("property_kyc")}
          className="rounded-2xl px-8 font-bold text-muted-foreground hover:text-foreground h-14"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button
          onClick={() => {
            if (selectedTypes.length === 0) {
              toast.error("Please select at least one service type");
              return;
            }
            setCurrentStep(getNextStep("selection"));
          }}
          className="h-14 px-12 rounded-2xl font-black text-lg shadow-xl shadow-primary/25 group overflow-hidden relative"
        >
          <span className="relative z-10 flex items-center gap-3">
            Continue
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </div>
    </div>
  );

  const renderCoworkingStep = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">
            Total Capacity (Auto-calculated)
          </label>
          <div className="w-full h-14 rounded-2xl border-2 border-primary/10 bg-primary/5 px-6 flex items-center justify-between text-lg font-black text-primary shadow-sm group transition-all hover:border-primary/20">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4" />
               </div>
               <span>{coworkingData.capacity} <span className="text-sm font-bold opacity-60 italic">Total Seats</span></span>
            </div>
            <Badge variant="outline" className="bg-background text-[10px] font-black uppercase">Live Count</Badge>
          </div>
        </div>
        <div className="space-y-3">
          <label className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">
            Monthly Subscription <span className="text-primary italic">(Per Seat)</span>
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-black z-10 transition-transform group-focus-within:scale-110">
              ₹
            </div>
            <Input
              type="number"
              placeholder="e.g. 5000"
              className="pl-14 h-14 rounded-2xl border-2 hover:border-primary/30 focus:border-primary transition-all text-lg font-black"
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
            />
          </div>
          {errors.pricePerMonth && <p className="text-[10px] font-black text-destructive uppercase tracking-tighter px-2">Valid price is required</p>}
        </div>
      </div>
 
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="space-y-1">
             <h3 className="text-xl font-black text-foreground tracking-tight">Floor & Inventory Map</h3>
             <p className="text-xs text-muted-foreground font-medium italic">Configure individual floors and table clusters</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCoworkingData({
                ...coworkingData,
                floors: [
                  ...coworkingData.floors,
                  { floorNumber: coworkingData.floors.length + 1, tables: [] },
                ],
              })
            }
            className="rounded-xl border-2 font-black border-primary/20 hover:border-primary text-primary hover:bg-primary/5 h-10 px-4 transition-all"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Level
          </Button>
        </div>
 
        <div className="grid gap-8">
          {coworkingData.floors.map((floor, fIdx) => (
            <div
              key={fIdx}
              className="p-8 rounded-[32px] border-2 border-border bg-muted/30 space-y-6 relative group transition-all hover:bg-muted/50 hover:border-primary/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-background rounded-xl border-2 border-primary/10 flex items-center justify-center font-black text-primary shadow-sm group-hover:scale-110 transition-transform">
                      {floor.floorNumber}
                   </div>
                   <div>
                      <h4 className="font-black text-foreground uppercase tracking-widest text-xs">Level Configuration</h4>
                      <p className="text-[10px] text-muted-foreground font-bold italic">Cluster management for this floor</p>
                   </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => addTable(fIdx)}
                  className="rounded-lg font-black text-[10px] uppercase tracking-wider h-8 px-4 shadow-sm hover:shadow-md transition-all bg-background border border-primary/10 hover:border-primary/30"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Deploy Table
                </Button>
              </div>
 
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {floor.tables.map((table, tIdx) => (
                  <div
                    key={tIdx}
                    className={`bg-background p-5 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                      errors[`floor_${fIdx}_table_${tIdx}`]
                        ? "border-destructive shadow-destructive/10"
                        : "border-border hover:border-primary/20"
                    } shadow-lg shadow-black/[0.02] space-y-4`}
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="font-black tracking-tighter text-[10px] bg-muted/50 rounded-lg">
                        {table.tableNumber}
                      </Badge>
                      <div className="relative w-20">
                         <input
                           type="number"
                           min="1"
                           className={`w-full h-9 text-right font-black ${
                             errors[`floor_${fIdx}_table_${tIdx}`]
                               ? "text-destructive"
                               : "text-primary"
                           } bg-muted/30 rounded-lg px-3 focus:outline-none transition-colors border-none group-focus-within:bg-muted`}
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
                         />
                         <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/50 pointer-events-none uppercase">QTY</div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-dashed border-border flex items-center justify-between">
                       <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Inventory</span>
                       <span className="text-xs font-black text-foreground">{table.numberOfSeats || 1} <span className="opacity-50 text-[10px] uppercase ml-0.5">Seats</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
 
      <div className="flex justify-between items-center pt-10 border-t border-border mt-12">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep("selection")}
          className="rounded-2xl px-8 font-bold text-muted-foreground hover:text-foreground h-14"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back to Selection
        </Button>
        <Button
          onClick={saveCoworking}
          disabled={loading}
          className="h-14 px-12 rounded-2xl font-black text-lg shadow-xl shadow-primary/25 group overflow-hidden relative"
        >
          <span className="relative z-10 flex items-center gap-3">
             {loading ? "Optimizing Assets..." : "Save & Continue"}
             <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </div>
    </div>
  );

  const renderVirtualStep = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-3xl font-black text-foreground tracking-tight">
          Virtual <span className="text-primary italic">Office</span> Plans
        </h2>
        <p className="text-muted-foreground font-medium text-sm leading-relaxed">
          Configure yearly pricing for your virtual office packages. All plans are required to provide a complete listing.
        </p>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { id: "gstPrice", label: "GST Registration", field: "finalGstPricePerYear", desc: "For companies needing a registered address for GST." },
          { id: "mailingPrice", label: "Mailing Address", field: "finalMailingPricePerYear", desc: "For business correspondence and mailing services." },
          { id: "brPrice", label: "Business Representation", field: "finalBrPricePerYear", desc: "Complete business representation and address services." },
        ].map((plan) => (
          <div key={plan.id} className={`p-8 rounded-[32px] border-2 transition-all duration-300 bg-background ${
            errors[plan.id] ? "border-destructive bg-destructive/5 shadow-inner" : "border-border hover:border-primary/20 hover:shadow-2xl group"
          }`}>
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
               errors[plan.id] ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary group-hover:scale-110"
             }`}>
                <Monitor className="w-7 h-7" />
             </div>
             <h4 className="text-lg font-black text-foreground mb-1 tracking-tight">{plan.label}</h4>
             <p className="text-xs text-muted-foreground font-medium mb-8 leading-relaxed">{plan.desc}</p>
             
             <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Price per Year (₹) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black">₹</span>
                  <Input
                    type="number"
                    className={`pl-8 h-14 rounded-2xl font-black text-lg ${errors[plan.id] ? "border-destructive focus:ring-destructive" : "border-primary/30 focus:ring-primary"}`}
                    value={(virtualData as any)[plan.field]}
                    onChange={(e) => {
                      setVirtualData({
                        ...virtualData,
                        [plan.field]: Number(e.target.value),
                      });
                      clearError(plan.id);
                    }}
                    onBlur={(e) => {
                      if (!e.target.value || Number(e.target.value) <= 0) {
                        setErrors((prev) => ({ ...prev, [plan.id]: true }));
                      }
                    }}
                  />
                </div>
             </div>
          </div>
        ))}
      </div>
 
      <div className="flex items-center justify-between gap-4 pt-10 sticky bottom-0 bg-background/80 backdrop-blur-sm -mx-10 px-10 pb-6 mt-10 border-t border-border/50">
        <Button
          variant="ghost" 
          onClick={() => {
            const idx = selectedTypes.indexOf("virtual");
            if (idx > 0) {
              setCurrentStep(selectedTypes[idx - 1] as Step);
            } else {
              setCurrentStep("selection");
            }
          }}
          className="rounded-2xl px-8 font-bold text-muted-foreground hover:text-foreground h-14"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button
          onClick={saveVirtual}
          disabled={loading}
          className="h-14 px-12 rounded-2xl font-black text-lg shadow-xl shadow-primary/25 group overflow-hidden relative"
        >
          <span className="relative z-10 flex items-center gap-3">
            {loading ? "Saving Plans..." : "Save & Continue"}
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </div>
    </div>
  );

  const renderMeetingStep = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            On-Demand <span className="text-primary italic">Spaces</span>
          </h2>
          <p className="text-muted-foreground font-medium text-sm">Configure meeting rooms, board rooms, and other bookable spaces.</p>
        </div>
        <Button
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
                  ids: [],
                },
              ],
            })
          }
          className="rounded-2xl px-6 font-black gap-2 h-14 shadow-xl shadow-primary/20"
        >
          <Plus className="w-5 h-5" /> Add New Room
        </Button>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {meetingData.rooms.map((room, idx) => (
          <div
            key={idx}
            className={`group relative p-8 rounded-[32px] border-2 transition-all duration-300 bg-background ${
              errors[`meeting_room_${idx}`]
                ? "border-destructive bg-destructive/5 shadow-inner"
                : "border-border hover:border-primary/20 hover:shadow-2xl"
            }`}
          >
            <Button
              variant="destructive"
              size="icon"
              onClick={() => {
                const newRooms = [...meetingData.rooms];
                newRooms.splice(idx, 1);
                setMeetingData({ rooms: newRooms });
                clearError(`meeting_room_${idx}`);
              }}
              className="absolute -top-3 -right-3 h-10 w-10 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
 
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                 <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-primary" />
                 </div>
                 <div className="flex-1">
                    <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Room Type</label>
                    <select
                      className="w-full h-10 bg-transparent font-black text-lg focus:outline-none focus:text-primary transition-colors cursor-pointer appearance-none"
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
              </div>
 
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Capacity</label>
                   <Input
                     type="number"
                     placeholder="0"
                     className="h-12 rounded-xl font-black text-center border-primary/20"
                     value={room.capacity || ""}
                     onChange={(e) => {
                       const newRooms = [...meetingData.rooms];
                       newRooms[idx].capacity = Number(e.target.value);
                       setMeetingData({ rooms: newRooms });
                       clearError(`meeting_room_${idx}`);
                     }}
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Count</label>
                   <Input
                     type="number"
                     placeholder="0"
                     className="h-12 rounded-xl font-black text-center border-primary/20"
                     value={room.count || ""}
                     onChange={(e) => {
                       const newRooms = [...meetingData.rooms];
                       newRooms[idx].count = Number(e.target.value);
                       setMeetingData({ rooms: newRooms });
                       clearError(`meeting_room_${idx}`);
                     }}
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Price/Hr</label>
                   <div className="relative">
                     <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary">₹</span>
                     <Input
                       type="number"
                       placeholder="0"
                       className="h-12 pl-6 rounded-xl font-black text-center border-primary/20"
                       value={room.pricePerHour || ""}
                       onChange={(e) => {
                         const newRooms = [...meetingData.rooms];
                         newRooms[idx].pricePerHour = Number(e.target.value);
                         setMeetingData({ rooms: newRooms });
                         clearError(`meeting_room_${idx}`);
                       }}
                     />
                   </div>
                </div>
              </div>
            </div>
          </div>
        ))}
 
        {meetingData.rooms.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-muted/5 rounded-[40px] border-2 border-dashed border-border">
             <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mb-6">
                <Layers className="w-10 h-10 text-muted-foreground/30" />
             </div>
             <h3 className="text-xl font-black text-foreground mb-2">No Rooms Added</h3>
             <p className="text-muted-foreground font-medium max-w-xs mx-auto">Click the button in the top right to add your first on-demand room.</p>
          </div>
        )}
      </div>
 
      <div className="flex items-center justify-between gap-4 pt-10 sticky bottom-0 bg-background/80 backdrop-blur-sm -mx-10 px-10 pb-6 mt-10 border-t border-border/50">
        <Button
          variant="ghost" 
          onClick={() => {
            const idx = selectedTypes.indexOf("meeting");
            if (idx > 0) {
              setCurrentStep(selectedTypes[idx - 1] as Step);
            } else {
              setCurrentStep("selection");
            }
          }}
          className="rounded-2xl px-8 font-bold text-muted-foreground hover:text-foreground h-14"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button
          onClick={saveMeeting}
          disabled={loading}
          className="h-14 px-12 rounded-2xl font-black text-lg shadow-xl shadow-primary/25 group overflow-hidden relative"
        >
          <span className="relative z-10 flex items-center gap-3">
            {loading ? "Saving Spaces..." : "Save & Continue"}
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </div>
    </div>
  );

  const renderReviewStep = () => {
    const isPropertyKycApproved = propertyKycStatus === "approved";
    const isPropertyKycPending = propertyKycStatus === "pending";
    const isPropertyKycRejected = propertyKycStatus === "rejected";
    const isPartnerKycApproved = partnerKycStatus === "approved" || user?.kycVerified === true;
 
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary font-black uppercase tracking-widest text-[10px]">
             Final Verification
          </Badge>
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            Review & <span className="text-primary italic">Submit</span>
          </h2>
          <p className="text-muted-foreground font-medium text-sm">
            {isAdmin 
              ? "Review the property details below. As an administrator, you can publish this listing directly to the platform."
              : "Please review your space details carefully. Once submitted, our team will verify the information before making the listing live."}
          </p>
        </div>
 
        <div className="max-w-3xl mx-auto space-y-8">
          {!isAdmin && (
            <div
              className={`p-10 rounded-[40px] border-2 transition-all duration-500 shadow-sm ${
                isPropertyKycApproved
                  ? "bg-emerald-50/50 border-emerald-200"
                  : isPropertyKycPending
                    ? "bg-blue-50/50 border-blue-200"
                    : isPropertyKycRejected
                      ? "bg-destructive/5 border-destructive/20"
                      : "bg-muted/30 border-border"
              }`}
            >
              <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                <div
                  className={`w-20 h-20 rounded-[28px] flex items-center justify-center shadow-lg transition-transform duration-500 hover:scale-110 ${
                    isPropertyKycApproved
                      ? "bg-emerald-500 text-white"
                      : isPropertyKycPending
                        ? "bg-blue-500 text-white"
                        : isPropertyKycRejected
                          ? "bg-destructive text-white"
                          : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isPropertyKycApproved ? (
                    <CheckCircle2 className="w-10 h-10" />
                  ) : isPropertyKycPending ? (
                    <Clock className="w-10 h-10 animate-[spin_3s_linear_infinite]" />
                  ) : isPropertyKycRejected ? (
                    <AlertCircle className="w-10 h-10" />
                  ) : (
                    <FileType className="w-10 h-10" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="text-2xl font-black text-foreground tracking-tight">
                    Status: <span className="text-primary italic capitalize">
                      {propertyKycStatus.replace("_", " ")}
                    </span>
                  </h4>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-md">
                    {isPropertyKycApproved
                      ? "Congratulations! Your property has been verified and is now ready for listings."
                      : isPropertyKycPending
                        ? "Hang tight! Our experts are currently reviewing your property details and documents."
                        : isPropertyKycRejected
                          ? "There are some inconsistencies in your submission that need your attention."
                          : "You haven't submitted this property for verification yet. Complete all steps to proceed."}
                  </p>
                </div>
              </div>
  
              {isPropertyKycRejected && propertyKycRejectionReason && (
                <div className="mt-10 p-6 bg-destructive/10 rounded-2xl border-2 border-destructive/20 text-sm text-destructive font-black flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Rejection Feedback: {propertyKycRejectionReason}</span>
                </div>
              )}
            </div>
          )}

          {propertyData.location?.coordinates && (
            <div className="p-8 bg-background rounded-[40px] border-2 border-border shadow-sm space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-6 h-6 text-primary" />
                <h4 className="text-xl font-black text-foreground">Property Location</h4>
              </div>
              <div className="h-64 rounded-3xl overflow-hidden border border-border">
                <MapLibreMap
                  markers={[{
                    id: "final-preview",
                    position: { 
                      lat: propertyData.location.coordinates[1], 
                      lng: propertyData.location.coordinates[0] 
                    },
                    title: propertyData.name || "Preview Location",
                    address: propertyData.address,
                    image: propertyData.images && propertyData.images.length > 0 ? getSafeImageUrl(propertyData.images[0]) : undefined,
                  }]}
                  center={{ 
                    lat: propertyData.location.coordinates[1], 
                    lng: propertyData.location.coordinates[0] 
                  }}
                  zoom={15}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground px-2 italic">
                <span>{propertyData.address}</span>
                <span className="text-[10px] uppercase tracking-widest bg-primary/5 px-2 py-1 rounded-lg">Verified via Google Maps</span>
              </div>
            </div>
          )}

          {!isAdmin && !isPartnerKycApproved && (
            <div className="p-6 bg-amber-50 rounded-[24px] border-2 border-amber-100 flex items-start gap-4">
               <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
               </div>
               <div>
                  <h4 className="font-black text-amber-900 leading-tight">Identity Verification Required</h4>
                  <p className="text-xs text-amber-700 font-medium mt-1">Please complete your personal KYC to enable property submission.</p>
                  <Button
                    variant="link"
                    onClick={() => navigate("/spaceportal/kyc-verification")}
                    className="p-0 h-auto text-amber-900 font-black mt-2 underline decoration-2 underline-offset-4"
                  >
                    Complete Personal KYC <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
               </div>
            </div>
          )}
 
          <div className="flex items-start gap-4 p-8 bg-primary/5 rounded-[32px] border-2 border-primary/10 transition-all hover:bg-primary/[0.08] cursor-pointer group" onClick={() => setPolicyAccepted(!policyAccepted)}>
            <div className="mt-1">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${policyAccepted ? "bg-primary border-primary shadow-lg shadow-primary/30" : "border-primary/30 bg-background"}`}>
                {policyAccepted && <Check className="w-4 h-4 text-white font-black" />}
              </div>
            </div>
            <p className="text-sm text-foreground font-bold leading-relaxed">
              I certify that all information provided is accurate and I agree to <span className="text-primary underline decoration-2 underline-offset-4 decoration-primary/30">FlashSpace Partner Terms</span>, including listing & commission policies.
            </p>
          </div>
 
          <div className="space-y-6 pt-4">
            <Button
              onClick={submitPropertyForReview}
              disabled={
                !policyAccepted ||
                (!isAdmin && (isPropertyKycPending || !isPartnerKycApproved)) ||
                loading
              }
              className="w-full h-20 rounded-[28px] font-black text-xl shadow-2xl shadow-primary/30 relative overflow-hidden group disabled:opacity-50 disabled:grayscale"
            >
              <span className="relative z-10 flex items-center justify-center gap-3 tracking-tight">
                {loading
                  ? (isAdmin ? "Publishing listing..." : "Verifying Submission...")
                  : isAdmin 
                    ? "Publish Property Now"
                    : isPropertyKycRejected
                      ? "Resubmit for Internal Review"
                      : isPropertyKycPending
                        ? "Submission in Progress"
                        : "Submit Portfolio for Admin Review"}
                {!loading && (isAdmin || !isPropertyKycPending) && <Send className="w-6 h-6 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
 
            {!isAdmin && isPropertyKycPending && (
              <div className="flex items-center justify-center gap-2 text-xs text-blue-600 font-black uppercase tracking-widest bg-blue-50 py-3 rounded-xl border border-blue-100">
                <Clock className="w-4 h-4" />
                Data review locked until verification complete
              </div>
            )}
 
            {!isAdmin && !isPartnerKycApproved && (
              <div className="flex items-center justify-center gap-2 text-xs text-amber-600 font-black uppercase tracking-widest bg-amber-50 py-3 rounded-xl border border-amber-100 italic">
                <AlertTriangle className="w-4 h-4" />
                Personal Identity Verification Required
              </div>
            )}
            
            <button
               onClick={handleFinish}
               className="w-full text-center text-sm font-black text-muted-foreground hover:text-primary transition-colors py-2 group underline decoration-2 underline-offset-8 decoration-transparent hover:decoration-primary/30"
            >
               I'll complete this review later <span className="group-hover:translate-x-1 inline-block transition-transform">→</span>
            </button>
          </div>
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
    <div className="flex-1 max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-700">
      {!isAdmin && propertyKycStatus === "not_started" && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-foreground mb-1 tracking-tight">
                Complete Property Verification
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                To ensure a smooth onboarding process, please provide accurate
                property information and clear document uploads. Verification
                typically takes 24-48 hours once submitted.
              </p>
            </div>
          </div>
        </div>
      )}

      {propertyKycStatus === "rejected" && (
        <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-extrabold text-destructive mb-1 tracking-tight">
                Verification Issues Found
              </h3>
              <p className="text-destructive/80 text-sm leading-relaxed mb-4">
                {propertyKycRejectionReason ||
                  "Please review the issues highlighted below and update the necessary documents."}
              </p>

              {rejectedDocNames.length > 0 && (
                <div className="text-sm text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/10">
                  <strong className="block mb-2 text-destructive font-extrabold uppercase text-[10px] tracking-widest">
                    Action Required For:
                  </strong>
                  <ul className="list-disc pl-5 space-y-1">
                    {rejectedDocNames.map((name, idx) => (
                      <li key={idx} className="font-bold">
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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Button
            variant="ghost" 
            size="sm"
            onClick={() => navigate(-1)}
            className="group px-0 hover:bg-transparent text-muted-foreground hover:text-foreground mb-2"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Portal
          </Button>
          <h1 className="text-4xl font-black text-foreground tracking-tighter">
            {editId ? "Edit" : "Add New"} <span className="text-primary italic">Space</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Capture property details and list across multiple services.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary font-bold">
             Step {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}
           </Badge>
        </div>
      </div>

      {renderStepper()}

      <div className="bg-background rounded-3xl border border-border shadow-2xl p-6 md:p-10 min-h-[600px] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          {currentStep === "property" && renderPropertyStep()}
          {currentStep === "property_kyc" && renderPropertyKYCStep()}
          {currentStep === "selection" && renderSelectionStep()}
          {currentStep === "coworking" && renderCoworkingStep()}
          {currentStep === "virtual" && renderVirtualStep()}
          {currentStep === "meeting" && renderMeetingStep()}
          {currentStep === "review" && renderReviewStep()}
        </div>
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
    <div className="space-y-2 group">
      <label
        className={`text-[10px] font-black uppercase tracking-widest px-1 transition-colors ${
          error ? "text-destructive" : "text-muted-foreground group-focus-within:text-primary"
        }`}
      >
        {label}
      </label>
      <input
        type={type}
        className={`w-full h-14 rounded-2xl border-2 transition-all duration-300 px-6 text-sm font-black ${
          error
            ? "border-destructive/50 bg-destructive/5 text-destructive placeholder:text-destructive/40 focus:border-destructive focus:ring-4 focus:ring-destructive/10"
            : "border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-4 focus:ring-primary/10"
        } focus:outline-none shadow-sm hover:border-primary/20`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && (
        <p className="text-[10px] font-black text-destructive uppercase tracking-tighter px-2 animate-in fade-in slide-in-from-top-1">
          This field is required
        </p>
      )}
    </div>
  );
}
