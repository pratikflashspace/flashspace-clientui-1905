import { useMemo, useState } from "react";
import type { Invoice } from "@/types/spacePortal/invoice";

import {
  Download,
  Search,
  Filter,
  MoreHorizontal,
  Receipt,
  ArrowUpRight,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type InvoiceTableProps = {
  invoices: Invoice[];
};

export default function InvoiceTable({ invoices }: InvoiceTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    const styles = {
      paid: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
      pending: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
      overdue: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
      cancelled: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
    };

    const icons = {
      paid: <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />,
      pending: <Clock className="mr-1.5 h-3.5 w-3.5" />,
      overdue: <XCircle className="mr-1.5 h-3.5 w-3.5" />,
      cancelled: <FileText className="mr-1.5 h-3.5 w-3.5" />,
    };

    return (
      <Badge
        variant="outline"
        className={`border py-0.5 pl-2 pr-2.5 text-xs font-medium transition-colors ${styles[status]}`}
      >
        <span className="flex items-center">
          {icons[status]}
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </Badge>
    );
  };

  return (
    <div className="flex h-[600px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
      {/* Toolbar */}
      <div className="z-10 flex shrink-0 flex-col gap-4 border-b border-slate-100 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-1 items-center gap-3">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search invoices..."
              className="h-10 border-slate-200 bg-slate-50 pl-9 focus-visible:ring-[#3FA69E]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 w-[160px] border-slate-200 bg-slate-50 focus:ring-[#3FA69E]">
              <Filter className="mr-2 h-3.5 w-3.5 text-slate-500" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          className="hidden text-slate-500 hover:bg-teal-50 hover:text-[#3FA69E] sm:flex"
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Scroll Area */}
      <div className="flex-1 overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-slate-50/50 backdrop-blur-sm">
            <TableRow className="border-slate-100 shadow-sm hover:bg-slate-50">
              <TableHead className="h-12 w-[180px] pl-6 font-semibold text-slate-700">
                Invoice ID
              </TableHead>
              <TableHead className="h-12 font-semibold text-slate-700">
                Client / Entity
              </TableHead>
              <TableHead className="h-12 font-semibold text-slate-700">
                Date
              </TableHead>
              <TableHead className="h-12 font-semibold text-slate-700">
                Status
              </TableHead>
              <TableHead className="hidden h-12 font-semibold text-slate-700 md:table-cell">
                Method
              </TableHead>
              <TableHead className="h-12 text-right font-semibold text-slate-700">
                Amount
              </TableHead>
              <TableHead className="h-12 w-[60px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-80 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                      <Receipt className="h-8 w-8 text-slate-300" />
                    </div>

                    <p className="text-lg font-semibold text-slate-900">
                      No invoices found
                    </p>

                    <p className="mt-1 max-w-xs text-sm">
                      We couldn't find any invoices matching your filters.
                    </p>

                    <Button
                      variant="link"
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                      }}
                      className="mt-2 text-[#3FA69E]"
                    >
                      Clear all filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="group border-slate-100 transition-colors hover:bg-slate-50/80"
                >
                  <TableCell className="py-4 pl-6">
                    <span className="flex cursor-pointer items-center gap-1 font-semibold text-slate-900 transition-colors hover:text-[#3FA69E]">
                      {invoice.invoiceNumber}
                      <ArrowUpRight className="h-3 w-3 text-slate-400 transition-colors group-hover:text-[#3FA69E]" />
                    </span>
                  </TableCell>

                  <TableCell className="py-4 font-medium text-slate-600">
                    {invoice.client}
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex flex-col text-sm">
                      <span className="font-medium text-slate-900">
                        {new Date(invoice.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-slate-400">
                        Due {new Date(invoice.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    {getStatusBadge(invoice.status)}
                  </TableCell>

                  <TableCell className="hidden py-4 text-sm text-slate-500 md:table-cell">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-3 w-3" />
                      {invoice.method}
                    </div>
                  </TableCell>

                  <TableCell className="py-4 text-right font-bold text-slate-900">
                    {formatCurrency(invoice.amount)}
                  </TableCell>

                  <TableCell className="py-4 pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 rounded-full p-0 text-slate-600 opacity-100 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-[180px] border border-slate-100 bg-white shadow-xl"
                      >
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-slate-50"
                          onClick={() =>
                            navigator.clipboard.writeText(invoice.invoiceNumber)
                          }
                        >
                          Copy ID
                        </DropdownMenuItem>

                        <DropdownMenuItem className="cursor-pointer hover:bg-slate-50">
                          View Details
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-slate-100" />

                        <DropdownMenuItem className="cursor-pointer text-[#3FA69E] hover:bg-slate-50">
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-between border-t border-slate-100 bg-slate-50/30 px-6 py-4 text-xs text-slate-500">
        <span>
          Showing <strong>{filteredInvoices.length}</strong> of{" "}
          <strong>{invoices.length}</strong> results
        </span>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 bg-white text-xs hover:bg-slate-50"
            disabled
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 bg-white text-xs hover:bg-slate-50"
            disabled
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
