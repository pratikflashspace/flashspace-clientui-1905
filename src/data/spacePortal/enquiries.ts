import type { Enquiry } from "@/types/spacePortal/enquiry";

export const ENQUIRIES: Enquiry[] = [
  {
    id: "ENQ-2001",
    clientName: "Amit Verma",
    companyName: "Verma Consulting",
    phone: "+91 98765 43210",
    email: "amit@vermaconsulting.com",
    requestedPlan: "Virtual Office Premium",
    requestedSpace: "Mumbai - BKC",
    createdAt: "2024-02-01",
    status: "NEW",
  },
  {
    id: "ENQ-2002",
    clientName: "Neha Sharma",
    companyName: "Sharma Tech",
    phone: "+91 99887 66554",
    email: "neha@sharmatech.com",
    requestedPlan: "Team Space",
    requestedSpace: "Delhi - CP",
    createdAt: "2024-01-28",
    status: "IN_PROGRESS",
  },
  {
    id: "ENQ-2003",
    clientName: "Rohit Singh",
    companyName: "Singh Industries",
    phone: "+91 91234 56789",
    email: "rohit@singhindustries.com",
    requestedPlan: "Hot Desk Monthly",
    requestedSpace: "Bangalore - HSR",
    createdAt: "2024-01-10",
    status: "CONVERTED",
  },
];
