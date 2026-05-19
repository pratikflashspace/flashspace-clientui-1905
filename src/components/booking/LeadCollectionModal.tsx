import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Mail, Phone, ArrowRight } from "lucide-react";
import axios from 'axios';
import hotToast from 'react-hot-toast';

interface LeadCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  spaceId: string;
  spaceName: string;
}

export const LeadCollectionModal = ({
  isOpen,
  onClose,
  onSuccess,
  spaceId,
  spaceName
}: LeadCollectionModalProps) => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setPhone(user.phoneNumber || '');
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      hotToast.error('Please enter a valid email address');
      return;
    }

    // Phone Validation (Indian 10-digit)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      hotToast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);

    try {
      const rawBase =
        import.meta.env.VITE_API_URL ||
        (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);
      const base = rawBase.replace(/\/$/, '');
      const userName = user?.fullName || email.split('@')[0] || 'Booking Lead';

      await axios.post(`${base}/api/leads`, {
        name: userName,
        userId: user?.id || (user as any)?._id,
        email,
        phone,
        businessType: 'Booking',
        message: `Booking interest for ${spaceName}`,
        source: 'Booking Flow',
        page: window.location.href,
        utm: {
          source: 'booking_flow',
          spaceId,
          spaceName,
          timestamp: new Date().toISOString(),
        },
      }, {
        headers: {
          'x-api-key': import.meta.env.VITE_LEAD_API_KEY || 'flashspace123',
          'x-flashspace-csrf': 'true',
        },
      });

      onSuccess();
    } catch (error: any) {
      console.error('Failed to save lead:', error);
      hotToast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1F2E26]">Confirm Your Details</DialogTitle>
          <DialogDescription className="text-[#677E73]">
            Please confirm your contact information to proceed with the booking for <span className="font-semibold text-[#35503F]">{spaceName}</span>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lead-email" className="text-sm font-bold text-[#1F2E26]">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A2AEA8]" />
                <Input
                  id="lead-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-[#DDE5DA] focus:ring-[#35503F]/15 focus:border-[#35503F]"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-phone" className="text-sm font-bold text-[#1F2E26]">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A2AEA8]" />
                <Input
                  id="lead-phone"
                  type="tel"
                  placeholder="Your mobile number"
                  value={phone}
                  maxLength={10}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhone(value);
                  }}
                  className="pl-10 h-12 rounded-xl border-[#DDE5DA] focus:ring-[#35503F]/15 focus:border-[#35503F]"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button 
              type="submit" 
              className="w-full h-12 bg-[#FEF8C3] hover:bg-[#FDF4A6] text-[#1F2E26] font-bold rounded-xl transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <span>Continue to Booking</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
