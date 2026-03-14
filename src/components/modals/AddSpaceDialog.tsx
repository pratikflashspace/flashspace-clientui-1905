import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, Building2 } from "lucide-react";

interface AddSpaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddSpaceDialog: React.FC<AddSpaceDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Add New Space
          </DialogTitle>
          <DialogDescription>
            You will be redirected to the space onboarding portal where you can
            fill in all the details about your new workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            Our onboarding process will guide you through setting up your
            property, KYC verification, and adding specific services like
            coworking areas, virtual offices, or meeting rooms.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              navigate("/spaceportal/space-management/add");
            }}
          >
            Start Onboarding
            <Plus className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
