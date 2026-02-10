import { DollarSign, FileText, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Invoice } from "@/services/userDashboard.service";

interface InvoiceStatsProps {
  summary: {
    totalPaid: number;
    totalPending: number;
    totalInvoices: number;
  };
  invoices: Invoice[];
}

export default function InvoiceStats({ summary, invoices }: InvoiceStatsProps) {
  // Calculate overdue invoices
  const overdueInvoices = invoices.filter(
    (inv) => inv.status === "overdue"
  ).length;

  const stats = [
    {
      title: "Total Paid",
      value: `₹${summary.totalPaid.toLocaleString("en-IN")}`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Pending",
      value: `₹${summary.totalPending.toLocaleString("en-IN")}`,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Total Invoices",
      value: summary.totalInvoices.toString(),
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Overdue",
      value: overdueInvoices.toString(),
      icon: DollarSign,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`rounded-full p-3 ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}