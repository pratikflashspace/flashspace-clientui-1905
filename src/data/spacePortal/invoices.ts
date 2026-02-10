import type { Invoice } from "@/types/spacePortal/invoice";

export const INVOICES: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    date: "2024-02-15",
    dueDate: "2024-03-01",
    amount: 12500.0,
    status: "paid",
    method: "Credit Card •••• 4242",
    client: "TechStart Solutions",
  },
];
