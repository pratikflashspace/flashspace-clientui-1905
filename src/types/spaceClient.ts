export type ClientStatus = "ACTIVE" | "PENDING" | "LOST";

export type PlanType = "Basic" | "Standard" | "Premium";

export type Client = {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  status: ClientStatus;
  plan: PlanType;
  space: string;
  bookings: number;
  pendingPayments: boolean;
  createdAt: string;
};
