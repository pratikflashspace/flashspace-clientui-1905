export type InvoiceStatus = "paid" | "pending" | "overdue" | "cancelled";

export type Invoice = {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  method: string;
  client: string;
};

export type InvoicesResponse = {
  summary: {
    totalInvoices: number;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
  };
  invoices: Invoice[];
};