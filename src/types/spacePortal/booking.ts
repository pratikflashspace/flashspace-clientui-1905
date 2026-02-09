export type BookingStatus = "CONFIRMED" | "PENDING" | "CANCELLED";

export type Booking = {
  id: string;
  clientName: string;
  space: string;

  startTime: string; // ISO string
  endTime: string;   // ISO string

  status: BookingStatus;
};

export type BookingRequest = {
  id: string;
  clientName: string;
  space: string;

  requestedDate: string; // YYYY-MM-DD
  requestedTime: string; // "10:00 AM - 12:00 PM"
};
