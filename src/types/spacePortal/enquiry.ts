export type EnquiryStatus = "NEW" | "IN_PROGRESS" | "CONVERTED";

export type Enquiry = {
  id: string;

  clientName: string;
  companyName: string;
  phone: string;
  email: string;

  requestedPlan: string;
  requestedSpace: string;

  createdAt: string; // ISO date string
  status: EnquiryStatus;
};
