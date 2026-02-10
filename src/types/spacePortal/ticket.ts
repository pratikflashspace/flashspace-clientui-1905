export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type Ticket = {
  id: string;
  title: string;
  description: string;

  clientName: string;
  space: string;

  createdAt: string; // ISO string
  status: TicketStatus;
  priority: TicketPriority;

  assignedTo?: string;
};
