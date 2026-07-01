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
import { Loader2, Mail, Phone, ArrowRight, User, MapPin } from "lucide-react";
import axios from 'axios';
import hotToast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface PackageLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planKey: string;
  spaceId?: string;
}

export const PackageLeadModal = ({
  isOpen,
  onClose,
  planName,
  planKey,
  spaceId
}: PackageLeadModalProps) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(planKey);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedPlan(planKey);
    }
  }, [planKey, isOpen]);

  useEffect(() => {
    if (user) {
      setName(user.fullName || '');
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

    if (!city) {
      hotToast.error('Please select a city');
      return;
    }

    setLoading(true);

    try {
      const rawBase =
        import.meta.env.VITE_API_URL ||
        (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);
      const base = rawBase.replace(/\/$/, '');
      const finalName = name || user?.fullName || email.split('@')[0];

      // Submit lead silently for tracking (but don't wait if it fails, and no auto-account is created on backend side from this endpoint)
      try {
        await axios.post(`${base}/api/leads`, {
          name: finalName,
          userId: user?.id || (user as any)?._id,
          email,
          phone,
          city,
          businessType: 'Package Purchase',
          message: `Interested in purchasing ${selectedPlan} package`,
          source: 'Pricing Flow',
          page: window.location.href,
          utm: {
            source: 'pricing_flow',
            planName: selectedPlan,
            planKey: selectedPlan,
            spaceId,
            timestamp: new Date().toISOString(),
          },
        }, {
          headers: {
            'x-api-key': import.meta.env.VITE_LEAD_API_KEY || 'flashspace123',
            'x-flashspace-csrf': 'true',
          },
        });
      } catch (err) {
        console.error('Non-critical error logging lead:', err);
      }

      // Show success toast and close
      hotToast.success('Thank you! Our team will contact you shortly.', { duration: 4000 });
      onClose();

    } catch (error: any) {
      console.error('Failed to process:', error);
      hotToast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl" style={{ fontFamily: 'Inter, sans-serif' }}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1F2E26]">Confirm Your Details</DialogTitle>
          <DialogDescription className="text-[#677E73]">
            Please confirm your contact information to proceed with your selected plan.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lead-plan" className="text-sm font-bold text-[#1F2E26]">Select Package</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A2AEA8] flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
                <select
                  id="lead-plan"
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full pl-10 h-12 rounded-xl border border-[#DDE5DA] focus:ring-1 focus:ring-[#35503F] focus:border-[#35503F] appearance-none bg-white capitalize"
                  required
                >
                  <option value="basic">Basic Package</option>
                  <option value="pro">Pro Package</option>
                  <option value="premium">Premium Package</option>
                  <option value="elite">Elite Package</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#A2AEA8]">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-name" className="text-sm font-bold text-[#1F2E26]">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A2AEA8]" />
                <Input
                  id="lead-name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-[#DDE5DA] focus:ring-[#35503F]/15 focus:border-[#35503F]"
                  required
                />
              </div>
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="lead-city" className="text-sm font-bold text-[#1F2E26]">Select City</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A2AEA8]" />
                <select
                  id="lead-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 h-12 rounded-xl border border-[#DDE5DA] focus:ring-1 focus:ring-[#35503F] focus:border-[#35503F] appearance-none bg-white"
                  required
                >
                  <option value="" disabled>Select your city</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Noida">Noida</option>
                  <option value="Gurgaon">Gurgaon</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Others">Others</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#A2AEA8]">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
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
                  <span>Continue to Checkout</span>
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
