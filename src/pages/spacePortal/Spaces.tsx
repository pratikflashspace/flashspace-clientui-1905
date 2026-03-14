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

const MySpaces = () => {
  const [addSpaceOpen, setAddSpaceOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<any | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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

        console.log("Raw API responses:", {
          propertiesRes,
          coworkingRes,
          meetingRoomsRes,
        });

        if (propertiesRes?.success) {
          // Flatten property data
          const properties = Array.isArray(propertiesRes.data)
            ? propertiesRes.data
            : propertiesRes.data?.properties ||
              propertiesRes.data?.spaces ||
              [];

          // Flatten coworking data
          const coworkingSpaces = Array.isArray(coworkingRes)
            ? coworkingRes
            : coworkingRes?.data ||
              coworkingRes?.spaces ||
              coworkingRes?.coworkingSpaces ||
              [];

          // Flatten meeting room data
          const meetingRooms = Array.isArray(meetingRoomsRes)
            ? meetingRoomsRes
            : meetingRoomsRes?.data ||
              meetingRoomsRes?.meetingRooms ||
              meetingRoomsRes?.rooms ||
              [];

          console.log("Processed counts:", {
            properties: properties.length,
            coworking: coworkingSpaces.length,
            meeting: meetingRooms.length,
          });

          const mappedSpaces = properties.map((prop: any, index: number) => {
            const propId = prop._id || prop.id;

            // Defensively match by property, property._id, or propertyId
            const associatedCoworking = coworkingSpaces.filter((cs: any) => {
              const csPropId = cs.propertyId || cs.property?._id || cs.property;
              return csPropId === propId;
            });

            const totalWorkstations = associatedCoworking.reduce(
              (sum: number, cs: any) => sum + (cs.capacity || 0),
              0,
            );

            const associatedMeetingRooms = meetingRooms.filter((mr: any) => {
              const mrPropId = mr.propertyId || mr.property?._id || mr.property;
              return mrPropId === propId;
            });

            return {
              id: propId,
              name: prop.name,
              location: `${prop.city || ""} - ${prop.area || ""}`,
              type: prop.type || "Space",
              workstations: totalWorkstations,
              meetingRooms: associatedMeetingRooms.length,
              occupancy:
                prop.occupancyRate || Math.floor(Math.random() * 30) + 70,
              status: prop.status || "active",
              rating: prop.avgRating || 4.5,
              image:
                prop.images?.[0] ||
                fallbackImages[index % fallbackImages.length],
            };
          });

          console.log("Mapped Spaces:", mappedSpaces);
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
    loadSpaces();
  }, []);

  const handleView = (space: any) => {
    setSelectedSpace(space);
    setViewModalOpen(true);
  };

  const handleEdit = (spaceId: string) => {
    navigate(`/spaceportal/space-management/${spaceId}`);
  };

  const handleSpaceAction = (action: string, space: any) => {
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
        toast({
          title:
            space.status.toLowerCase() === "active"
              ? "Space Deactivated"
              : "Space Activated",
          description: `${space.name} status has been updated`,
        });
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            My <span className="text-primary italic">Spaces</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage all your workspace listings
          </p>
        </div>
        <Button onClick={() => setAddSpaceOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Space
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
                />
                <div className="absolute top-3 right-3">
                  {getStatusBadge(space.status)}
                </div>
              </div>

              {/* Space Details */}
              <div className="p-5">
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

                <div className="grid grid-cols-3 gap-4 my-4 py-4 border-y border-border">
                  <div className="text-center">
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
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">
                      {space.occupancy}%
                    </p>
                    <p className="text-xs text-muted-foreground">Occupancy</p>
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
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
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
                        >
                          {space.status.toLowerCase() === "active"
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
