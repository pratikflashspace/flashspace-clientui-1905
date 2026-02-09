import { Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type SubmitInvoiceDialogProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
};

export default function SubmitInvoiceDialog({
  open,
  onOpenChange,
}: SubmitInvoiceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-10 bg-[#3FA69E] text-white shadow-md hover:opacity-90">
          <Plus className="mr-2 h-4 w-4" />
          Submit Invoice
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#3FA69E]">
            Submit New Invoice
          </DialogTitle>
          <DialogDescription>
            Upload your invoice details here. We will process it within 24 hours.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="invoice-no">Invoice Number</Label>
            <Input id="invoice-no" placeholder="e.g. INV-2024-001" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (INR)</Label>
            <Input id="amount" type="number" placeholder="0.00" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="file">Upload Invoice (PDF/Image)</Label>

            <div className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-200 transition-colors hover:bg-slate-50 group">
              <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-[#3FA69E]">
                <Upload className="h-8 w-8" />
                <span className="text-sm">Click to upload or drag & drop</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            type="submit"
            onClick={() => onOpenChange(false)}
            className="bg-[#3FA69E] hover:opacity-90"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
