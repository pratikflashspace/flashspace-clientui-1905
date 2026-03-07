import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  CalendarDays,
  Key,
  MoreVertical,
  MessageSquare,
} from "lucide-react";

interface ClientViewModalProps {
  client: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenChat: () => void;
}

export const ClientViewModal = ({
  client,
  open,
  onOpenChange,
  onOpenChat,
}: ClientViewModalProps) => {
  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-background border-0 shadow-2xl rounded-2xl">
        {/* Header */}
        <div className="bg-muted/30 p-6 border-b border-border flex items-start justify-between">
          <div className="flex gap-4">
            <Avatar className="w-16 h-16 border-2 border-background shadow-sm">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {client.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {client.name}
              </h2>
              <div className="flex items-center gap-2 mt-1 -ml-1 text-muted-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs hover:text-foreground"
                >
                  {client.contact}
                </Button>
                <span>•</span>
                <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-foreground">
                  {client.id}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge
              variant={
                client.status === "Active"
                  ? "default"
                  : client.status === "At Risk"
                    ? "secondary"
                    : "destructive"
              }
            >
              {client.status}
            </Badge>
          </div>
        </div>

        <div className="p-6 grid grid-cols-2 gap-8 bg-background">
          {/* Left Column: Contact & Location */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Building className="w-4 h-4 text-muted-foreground" />
                Contact Profile
              </h3>
              <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary/70" />
                  <span className="break-all">{client.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary/70" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary/70 mt-0.5 shrink-0" />
                  <span>{client.space}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                Engagement
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1">
                    Health Score
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    {client.healthScore}/100
                  </div>
                </div>
                <div className="bg-muted/30 p-3 rounded-xl border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1">
                    Total Revenue
                  </div>
                  <div className="text-xl font-bold text-primary">
                    {client.revenue}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Subscription & Actions */}
          <div className="space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Key className="w-4 h-4 text-muted-foreground" />
                Subscription Information
              </h3>
              <div className="bg-muted/30 rounded-xl p-4 space-y-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Current Plan
                  </div>
                  <div className="font-medium text-foreground">
                    {client.plan}
                  </div>
                </div>
                <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      Renewal Date
                    </div>
                    <div className="font-medium text-foreground">
                      {client.renewal}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onOpenChat}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button className="flex-1">Manage Client</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
