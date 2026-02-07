import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, Clock, FileText } from "lucide-react";
import type { Invoice } from "@/types/spacePortal/invoice";

type InvoiceStatsProps = {
  invoices: Invoice[];
};

export default function InvoiceStats({ invoices }: InvoiceStatsProps) {
  const paymentsReceived = invoices
    .filter((i) => i.status === "paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const paymentsDue = invoices
    .filter((i) => i.status === "pending" || i.status === "overdue")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalInvoices = invoices.length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Card className="rounded-xl border-slate-200 bg-white shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#3FA69E]">
            Payments Received
          </CardTitle>
          <Wallet className="h-4 w-4 text-[#3FA69E]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">
            {formatCurrency(paymentsReceived)}
          </div>
          <p className="mt-1 flex items-center text-xs font-medium text-[#3FA69E]">
            <TrendingUp className="mr-1 h-3 w-3" />
            +15% from last month
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-slate-200 bg-white shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">
            Payments Due
          </CardTitle>
          <Clock className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">
            {formatCurrency(paymentsDue)}
          </div>
          <p className="mt-1 flex items-center text-xs font-medium text-amber-600">
            <Clock className="mr-1 h-3 w-3" />
            Pending clearance
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-slate-200 bg-white shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">
            Total Invoices
          </CardTitle>
          <FileText className="h-4 w-4 text-[#3FA69E]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{totalInvoices}</div>
          <p className="mt-1 text-xs text-slate-500">
            View detailed history below
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
