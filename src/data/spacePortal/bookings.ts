import type { Booking, BookingRequest } from "@/types/spacePortal/booking";

export const BOOKINGS: Booking[] = [
  {
    id: "BK-101",
    clientName: "TechStart Solutions",
    space: "Mumbai - BKC",
    startTime: "2026-02-07T10:00:00",
    endTime: "2026-02-07T12:00:00",
    status: "CONFIRMED",
  },
  {
    id: "BK-102",
    clientName: "Design Co. Ltd",
    space: "Delhi - CP",
    startTime: "2026-02-07T13:00:00",
    endTime: "2026-02-07T15:00:00",
    status: "PENDING",
  },
  {
    id: "BK-103",
    clientName: "Freelance Hub",
    space: "Bangalore - HSR",
    startTime: "2026-02-08T09:00:00",
    endTime: "2026-02-08T11:00:00",
    status: "CONFIRMED",
  },
];

export const PENDING_REQUESTS: BookingRequest[] = [
  {
    id: "REQ-201",
    clientName: "Alpha Corp",
    space: "Mumbai - BKC",
    requestedDate: "2026-02-10",
    requestedTime: "11:00 AM - 01:00 PM",
  },
  {
    id: "REQ-202",
    clientName: "Beta Systems",
    space: "Delhi - CP",
    requestedDate: "2026-02-11",
    requestedTime: "03:00 PM - 05:00 PM",
  },
];
