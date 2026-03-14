import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Building2, Users, Calendar } from "lucide-react";

interface SpaceViewModalProps {
  space: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SpaceViewModal: React.FC<SpaceViewModalProps> = ({
  space,
  open,
  onOpenChange,
}) => {
  if (!space) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl overflow-hidden p-0">
        <div className="h-48 bg-muted relative">
          <img
            src={space.image || space.images?.[0] || "/hero-illustrated.jpg"}
            alt={space.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <DialogHeader>
            <div className="flex items-center justify-between mb-2">
              <DialogTitle className="text-2xl font-bold">
                {space.name}
              </DialogTitle>
              <Badge variant="outline">{space.type}</Badge>
            </div>
            <DialogDescription className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {space.location || `${space.city}, ${space.area}`}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-4 my-6 py-4 border-y border-border">
            <div className="text-center">
              <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-lg font-bold">
                {space.workstations || space.capacity || 0}
              </p>
              <p className="text-xs text-muted-foreground uppercase">
                Workstations
              </p>
            </div>
            <div className="text-center">
              <Calendar className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-lg font-bold">{space.meetingRooms || 0}</p>
              <p className="text-xs text-muted-foreground uppercase">
                Meeting Rooms
              </p>
            </div>
            <div className="text-center">
              <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500 fill-yellow-500" />
              <p className="text-lg font-bold">
                {space.rating || space.avgRating || 0}
              </p>
              <p className="text-xs text-muted-foreground uppercase">Rating</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Quick Stats</h4>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground text-foreground/70">
                Occupancy Rate
              </span>
              <span className="font-bold">{space.occupancy || 0}%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground text-foreground/70">
                Current Status
              </span>
              <Badge
                className={
                  space.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }
              >
                {space.status}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
