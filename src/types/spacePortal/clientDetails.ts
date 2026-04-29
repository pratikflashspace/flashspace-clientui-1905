import type { Client } from "./client";

export type ClientKycDocument = {
  id: string;
  type: "PAN" | "GST" | "AADHAR" | "OTHER";
  fileUrl: string;
  uploadedAt: string;
};

export type ClientKyc = {
  status: "PENDING" | "VERIFIED" | "REJECTED";
  documents: ClientKycDocument[];
};

export type ClientAgreement = {
  status: "PENDING" | "SIGNED" | "EXPIRED";
  agreementUrl: string;
  signedAt?: string;
  validTill?: string;
};

export type ClientInvoice = {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: "PAID" | "PENDING" | "OVERDUE";
  pdfUrl?: string;
  createdAt: string;
};

export type ClientBooking = {
  id: string;
  date: string;
  slot: string;
  status: "CONFIRMED" | "CANCELLED" | "PENDING";
  amount: number;
};

export type ClientDetails = Client & {
  email: string;
  phone: string;
  bookingId?: string;

  kyc: ClientKyc;
  agreement: ClientAgreement;

  bookings: ClientBooking[];
  invoices: ClientInvoice[];
};
