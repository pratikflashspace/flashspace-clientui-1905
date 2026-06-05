import { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  MapPin,
  Eye,
  Edit,
  MoreVertical,
  Star,
} from "lucide-react";
import { SkeletonCardGrid } from "@/components/ui/skeleton-loaders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddSpaceDialog } from "@/components/modals/AddSpaceDialog";
import { SpaceViewModal } from "@/components/modals/SpaceViewModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import propertyService from "@/services/property.service";
import { updateCoworkingSpace } from "@/services/coworkingSpace.service";
import { updateVirtualOffice } from "@/services/virtualOffice.service";
import { updateMeetingRoom } from "@/services/meetingRoom.service";
import { getMySpaceUserKyc } from "@/Api/spacePartnerKyc.service";
import {
  fetchAllPartnerSpaces,
  fetchPartnerSpaces,
  fetchPartnerMeetingRooms,
} from "@/services/spacePortal/spacePartner.service";

// Fallback images since assets might not exist
const fallbackImages = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80",
];

const getStatusBadge = (status: string) => {
  const s = status.toLowerCase();
  switch (s) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          Active
        </Badge>
      );
    case "maintenance":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          Maintenance
        </Badge>
      );
    case "inactive":
      return <Badge variant="secondary">Inactive</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const normalizeStatus = (space: any) => {
  if (typeof space?.isActive === "boolean") {
    return space.isActive ? "active" : "inactive";
  }

  const status = String(space?.status || "inactive").toLowerCase();
  if (status === "active" || status === "maintenance" || status === "inactive") {
    return status;
  }

  return "inactive";
};

const humanizeStatus = (status: string) =>
  status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

import { getSafeImageUrl } from "@/utils/imageUrl";

const MySpaces = () => {
  const [addSpaceOpen, setAddSpaceOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<any | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [partnerKycStatus, setPartnerKycStatus] = useState<string>("not_started");
  const navigate = useNavigate();
  const isPartnerKycApproved = partnerKycStatus === "approved";

  const loadSpaces = async () => {
    setLoading(true);
    try {
      console.log("Fetching spaces data...");
      const [propertiesRes, coworkingRes, meetingRoomsRes] =
        await Promise.all([
          fetchAllPartnerSpaces(),
          fetchPartnerSpaces(),
          fetchPartnerMeetingRooms(),
        ]);

      const partnerKyc = await getMySpaceUserKyc().catch(() => null);
      setPartnerKycStatus(
        partnerKyc?.overallStatus === "approved" ||
          partnerKyc?.kycStatus === "approved"
          ? "approved"
          : partnerKyc?.overallStatus ||
              partnerKyc?.kycStatus ||
              "not_started",
      );

      console.log("Raw API responses:", {
        propertiesRes,
        coworkingRes,
        meetingRoomsRes,
      });

      if (propertiesRes?.success) {
        // Flatten property data
        const propertiesArr = Array.isArray(propertiesRes.data)
          ? propertiesRes.data
          : propertiesRes.data?.properties ||
            propertiesRes.data?.spaces ||
            [];

        // Flatten coworking data
        const coSpacesArr = Array.isArray(coworkingRes)
          ? coworkingRes
          : coworkingRes?.data ||
            coworkingRes?.spaces ||
            coworkingRes?.coworkingSpaces ||
            [];

        // Flatten meeting room data
        const mRoomsArr = Array.isArray(meetingRoomsRes)
          ? meetingRoomsRes
          : meetingRoomsRes?.data ||
            meetingRoomsRes?.meetingRooms ||
            meetingRoomsRes?.rooms ||
            [];

        console.log("[Spaces DEBUG] Raw Counts:", {
          properties: propertiesArr.length,
          coworking: coSpacesArr.length,
          meeting: mRoomsArr.length,
        });

        const mappedSpaces = propertiesArr.map((prop: any) => {
          const propId = String(prop._id || prop.id);
          const propName = (prop.name || "").toLowerCase().trim();
          const propCity = (prop.city || "").toLowerCase().trim();

          // Match Coworking
          const associatedCoworking = coSpacesArr.filter((cs: any) => {
            const csPropId =
              cs.propertyId ||
              (typeof cs.property === "string" ? cs.property : cs.property?._id);
            const idMatch = String(csPropId) === propId;

            const nameMatch =
              (cs.name || "").toLowerCase().trim() === propName &&
              (cs.city || "").toLowerCase().trim() === propCity;

            if (!idMatch && nameMatch)
              console.log(
                `[Spaces DEBUG] Coworking Fallback Match: ${cs.name} -> ${prop.name}`,
              );
            return idMatch || nameMatch;
          });

          const totalWS = associatedCoworking.reduce(
            (sum: number, cs: any) => sum + (Number(cs.capacity) || 0),
            0,
          );

          // Match Meeting Rooms
          const associatedMR = mRoomsArr.filter((mr: any) => {
            const mrPropId =
              mr.propertyId ||
              (typeof mr.property === "string" ? mr.property : mr.property?._id);
            const idMatch = String(mrPropId) === propId;

            const nameMatch =
              (mr.name || "").toLowerCase().trim() === propName &&
              (mr.city || "").toLowerCase().trim() === propCity;

            if (!idMatch && nameMatch)
              console.log(
                `[Spaces DEBUG] MeetingRoom Fallback Match: ${mr.name} -> ${prop.name}`,
              );
            return idMatch || nameMatch;
          });

          const totalMR = associatedMR.reduce(
            (sum: number, mr: any) =>
              sum +
              (Number(mr.count) ||
                Number(mr.capacity) ||
                (associatedMR.length > 0 ? 1 : 0)),
            0,
          );

          console.log(
            `[Spaces DEBUG] Final for ${prop.name}: WS=${totalWS}, MR=${totalMR}`,
          );

          const activeState = normalizeStatus(prop);
          const approvalState = prop.approvalStatus || prop.status || "draft";

          return {
            id: propId,
            name: prop.name,
            location:
              [prop.city || prop.address, prop.area]
                .filter(Boolean)
                .join(" - ") || "Unknown Location",
            type: prop.type || "Space",
            workstations: totalWS,
            meetingRooms: totalMR,
            occupancy: prop.occupancyRate || Math.floor(Math.random() * 30) + 70,
            isActive: activeState === "active",
            status: activeState,
            approvalStatus: approvalState,
            rating: prop.avgRating && prop.avgRating > 0 ? prop.avgRating : 4.8,
            image: getSafeImageUrl(
              prop.image ||
                (prop.images && prop.images.length > 0 ? prop.images[0] : null),
              "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
            ),
          };
        });

        console.log("[Spaces DEBUG] Final Mapped Spaces:", mappedSpaces);
        setSpaces(mappedSpaces);
      }
    } catch (err) {
      console.error("Failed to fetch spaces", err);
      toast({
        title: "Error",
        description: "Failed to load spaces from server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpaces();
  }, []);

  const syncActivationState = async (space: any, shouldActivate: boolean) => {
    setStatusUpdatingId(space.id);
    try {
      const propertyUpdates: Record<string, any> = {
        isActive: shouldActivate,
        status: shouldActivate ? "active" : "suspended",
      };

      await propertyService.updateProperty(space.id, propertyUpdates);

      const propertySpaces = await propertyService.getPropertySpaces(space.id);
      const updatePayload = shouldActivate
        ? { isActive: true, approvalStatus: "active" }
        : { isActive: false };

      const coworkingSpaces = propertySpaces?.coworkingSpaces || [];
      const virtualOffices = propertySpaces?.virtualOffices || [];
      const meetingRooms = propertySpaces?.meetingRooms || [];

      await Promise.all([
        ...coworkingSpaces.map((item: any) =>
          updateCoworkingSpace(item._id, updatePayload),
        ),
        ...virtualOffices.map((item: any) =>
          updateVirtualOffice(item._id, updatePayload),
        ),
        ...meetingRooms.map((item: any) =>
          updateMeetingRoom(item._id, updatePayload),
        ),
      ]);

      setSpaces((prev) =>
        prev.map((item) =>
          item.id === space.id
            ? {
                ...item,
                isActive: shouldActivate,
                status: shouldActivate ? "active" : "inactive",
                approvalStatus: shouldActivate
                  ? "active"
                  : item.approvalStatus,
              }
            : item,
        ),
      );

      toast({
        title: shouldActivate ? "Space Activated" : "Space Deactivated",
        description: `${space.name} is now ${shouldActivate ? "live for bookings" : "hidden from checkout"}.`,
      });
    } catch (error) {
      console.error("Failed to update space status", error);
      toast({
        title: "Update Failed",
        description: "Could not change the space status right now.",
        variant: "destructive",
      });
      await loadSpaces();
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleView = (space: any) => {
    setSelectedSpace(space);
    setViewModalOpen(true);
  };

  const handleEdit = (spaceId: string) => {
    navigate(`/spaceportal/space-management/${spaceId}`);
  };

  const handleAddSpace = () => {
    if (!isPartnerKycApproved) {
      toast({
        title: "Personal KYC Required",
        description:
          "Please complete and get your personal KYC approved before adding a new space.",
        variant: "destructive",
      });
      navigate("/spaceportal/kyc-verification");
      return;
    }

    setAddSpaceOpen(true);
  };

  const handleSpaceAction = async (action: string, space: any) => {
    switch (action) {
      case "view_calendar":
        navigate("/spaceportal/booking-calendar");
        break;
      case "view_clients":
        navigate("/spaceportal/clients");
        break;
      case "view_analytics":
        navigate("/spaceportal/booking-analytics");
        break;
      case "toggle_status":
        if (!isPartnerKycApproved) {
          toast({
            title: "KYC Approval Required",
            description:
              "Please get your personal KYC approved before activating a space.",
            variant: "destructive",
          });
          return;
        }
        await syncActivationState(space, normalizeStatus(space) !== "active");
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex-1">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-10 w-64 bg-gray-200 rounded" />
            <div className="h-4 w-96 bg-gray-100 rounded" />
          </div>
          <div className="h-11 w-40 bg-gray-100 rounded-xl" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCardGrid count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-3xl font-extrabold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span className="text-gray-900 dark:text-white">My</span> <span className="text-[#36503F] italic">Spaces</span>
        
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all your workspace listings
          </p>
        </div>
        <Button onClick={handleAddSpace} className="w-full sm:w-auto rounded-xl font-bold h-11">
          <Plus className="w-4 h-4 mr-2" />
          {isPartnerKycApproved ? "Add New Space" : "Complete KYC to Add Space"}
        </Button>
      </div>

      {spaces.length === 0 ? (
        <div className="bg-background border border-border rounded-xl p-12 text-center">
          <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold">No spaces found</h3>
          <p className="text-muted-foreground mt-2">
            Start by adding your first workspace listing.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {spaces.map((space) => (
            <div
              key={space.id}
              className="bg-background border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-colors"
            >
              {/* Space Image */}
              <div className="h-40 bg-muted relative">
                <img
                  src={space.image}
                  alt={space.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(space.status)}
                </div>
              </div>

              {/* Space Details */}
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-foreground">{space.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3" />
                      {space.location}
                    </div>
                  </div>
                  <Badge variant="outline">{space.type}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 my-4 py-4 border-y border-border">
                  <div className="text-center border-r border-border">
                    <p className="text-lg font-bold text-foreground">
                      {space.workstations}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Workstations
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">
                      {space.meetingRooms}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Meeting Rooms
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-foreground">
                      {space.rating}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(space)}
                      className="bg-primary/10 hover:bg-primary/20"
                    >
                      <Eye className="w-4 h-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(space.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" disabled={statusUpdatingId === space.id}>
                          {statusUpdatingId === space.id ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                          ) : (
                            <MoreVertical className="w-4 h-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            handleSpaceAction("view_calendar", space)
                          }
                        >
                          View Booking Calendar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleSpaceAction("view_clients", space)
                          }
                        >
                          View Clients
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleSpaceAction("view_analytics", space)
                          }
                        >
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleSpaceAction("toggle_status", space)
                          }
                          disabled={!isPartnerKycApproved}
                        >
                          {!isPartnerKycApproved
                            ? "KYC Pending"
                            : normalizeStatus(space) === "active"
                              ? "Deactivate Space"
                              : "Activate Space"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddSpaceDialog open={addSpaceOpen} onOpenChange={setAddSpaceOpen} />
      <SpaceViewModal
        space={selectedSpace}
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
      />
    </div>
  );
};

export default MySpaces;
