import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Phone, Video, MoreVertical, X } from "lucide-react";

interface ClientChatModalProps {
  client: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClientChatModal = ({
  client,
  open,
  onOpenChange,
}: ClientChatModalProps) => {
  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl h-[600px] p-0 flex flex-col overflow-hidden bg-background border-0 shadow-2xl rounded-2xl">
        {/* Chat Header */}
        <div className="bg-muted/30 p-4 border-b border-border flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border border-background shadow-sm">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                {client.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-foreground text-sm">
                {client.name}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 block"></span>
                Online
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
            >
              <Phone className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
            >
              <Video className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 bg-background p-4 overflow-y-auto space-y-4">
          <div className="flex justify-center">
            <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
              Today
            </span>
          </div>

          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8 mt-1 border border-background shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {client.initials}
              </AvatarFallback>
            </Avatar>
            <div className="bg-muted px-4 py-2.5 rounded-2xl rounded-tl-none max-w-[80%]">
              <p className="text-sm text-foreground">
                Hi there! We wanted to ask if we could expand our virtual office
                package to include weekly mail scanning?
              </p>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                10:45 AM
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 flex-row-reverse">
            <Avatar className="w-8 h-8 mt-1 border border-primary shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-tr-none max-w-[80%]">
              <p className="text-sm">
                Hello {client.contact.split(" ")[0]}! Yes, absolutely. We can
                add weekly scanning to your current {client.plan} for an
                additional ₹1,500/month. Would you like me to send over the
                updated invoice?
              </p>
              <span className="text-[10px] text-primary-foreground/70 mt-1 block text-right">
                10:52 AM
              </span>
            </div>
          </div>
        </div>

        {/* Chat Footer / Input */}
        <div className="p-4 bg-background border-t border-border">
          <form
            className="flex gap-2 items-end"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              placeholder="Type your message..."
              className="flex-1 rounded-xl bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:bg-background"
            />
            <Button type="submit" size="icon" className="rounded-xl shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
