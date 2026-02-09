import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

import { INVOICES } from "@/data/spacePortal/invoices";

import InvoiceStats from "@/components/SpacePartner/invoices/InvoiceStats";
import InvoiceTable from "@/components/SpacePartner/invoices/InvoiceTable";
import SubmitInvoiceDialog from "@/components/SpacePartner/invoices/SubmitInvoice";

import { Button } from "@/components/ui/button";

export default function InvoicesPayments() {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Invoices and <span className="text-[#3FA69E]">Payments</span>
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            Submit new invoices, track payments received, and view dues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-10 border-slate-200 text-[#3FA69E] hover:bg-teal-50"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            History
          </Button>

          <SubmitInvoiceDialog
            open={isSubmitOpen}
            onOpenChange={setIsSubmitOpen}
          />
        </div>
      </div>

      {/* Stats */}
      <InvoiceStats invoices={INVOICES} />

      {/* Table */}
      <InvoiceTable invoices={INVOICES} />
    </div>
  );
}
