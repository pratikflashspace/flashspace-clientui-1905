export interface Review {
  _id: string;
  user: string;
  space: string;
  spaceModel: "CoworkingSpace" | "VirtualOffice" | "MeetingRoom";
  rating: number;
  comment: string;
  reviewImages?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewPayload {
  spaceId: string;
  spaceModel: "CoworkingSpace" | "VirtualOffice" | "MeetingRoom";
  rating: number;
  comment: string;
  reviewImages?: string[];
}
