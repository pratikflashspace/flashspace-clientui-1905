import { useState } from "react";
import { Plus, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubmitInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function SubmitInvoiceDialog({
  open,
  onOpenChange,
  onSuccess,
}: SubmitInvoiceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    bookingNumber: "",
    description: "",
    amount: "",
    taxRate: "18",
    dueDate: "",
    items: [] as Array<{ description: string; quantity: number; rate: number }>,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTaxRateChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      taxRate: value,
    }));
  };

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const taxRate = parseFloat(formData.taxRate) || 0;
    const taxAmount = (amount * taxRate) / 100;
    const total = amount + taxAmount;
    return { subtotal: amount, taxAmount, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form
      if (!formData.description || !formData.amount) {
        toast.error("Please fill in all required fields");
        return;
      }

      const { subtotal, taxAmount, total } = calculateTotal();

      // Here you would call the API to create the invoice
      // const response = await userDashboardService.createInvoice({
      //   bookingNumber: formData.bookingNumber,
      //   description: formData.description,
      //   subtotal,
      //   taxRate: parseFloat(formData.taxRate),
      //   taxAmount,
      //   total,
      //   dueDate: formData.dueDate,
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Invoice submitted successfully");
      
      // Reset form
      setFormData({
        bookingNumber: "",
        description: "",
        amount: "",
        taxRate: "18",
        dueDate: "",
        items: [],
      });
      
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting invoice:", error);
      toast.error("Failed to submit invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { subtotal, taxAmount, total } = calculateTotal();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-[#3FA69E] text-white hover:bg-[#358c85]">
          <Plus className="mr-2 h-4 w-4" />
          Submit Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit New Invoice</DialogTitle>
          <DialogDescription>
            Create a new invoice for your services or bookings
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Booking Number (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="bookingNumber">
              Booking Number <span className="text-slate-400">(Optional)</span>
            </Label>
            <Input
              id="bookingNumber"
              name="bookingNumber"
              placeholder="e.g., BK-2024-0001"
              value={formData.bookingNumber}
              onChange={handleInputChange}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the services or products..."
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Amount and Tax */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">
                Amount (₹) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Select value={formData.taxRate} onValueChange={handleTaxRateChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No Tax (0%)</SelectItem>
                  <SelectItem value="5">5% GST</SelectItem>
                  <SelectItem value="12">12% GST</SelectItem>
                  <SelectItem value="18">18% GST</SelectItem>
                  <SelectItem value="28">28% GST</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">
              Due Date <span className="text-slate-400">(Optional)</span>
            </Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange}
            />
          </div>

          {/* Summary */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
            <h3 className="font-semibold text-slate-900">Invoice Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">
                  Tax ({formData.taxRate}%):
                </span>
                <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-300 pt-2 text-base font-bold">
                <span>Total:</span>
                <span className="text-[#3FA69E]">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#3FA69E] text-white hover:bg-[#358c85]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Invoice
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}