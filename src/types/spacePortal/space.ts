export type SpaceStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";

export type Space = {
  id: string;
  name: string;
  city: string;
  location: string;

  totalSeats: number;
  availableSeats: number;

  meetingRooms: number;
  cabins: number;

  status: SpaceStatus;
  createdAt: string; // ISO string
};
