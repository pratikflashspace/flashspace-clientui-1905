import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send } from "lucide-react";

interface EnquiryChatModalProps {
  enquiry: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EnquiryChatModal = ({
  enquiry,
  open,
  onOpenChange,
}: EnquiryChatModalProps) => {
  if (!enquiry) return null;
  const name = enquiry.user?.name || enquiry.name || "Client";
  const company = enquiry.user?.company || enquiry.company || "N/A";
  const interest = enquiry.type || enquiry.interest || "Space";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-6 border-b bg-background">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="w-5 h-5 text-primary" />
            Chat with {name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{company} • {interest}</p>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/20">
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-bold text-lg text-foreground">Starting Conversation</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-[280px] mx-auto">
                You're about to start a chat with {name} regarding their interest in {interest}.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-background">
          <div className="relative">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 bg-muted/20"
            />
            <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
