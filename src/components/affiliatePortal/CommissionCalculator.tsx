import React, { useState, useEffect } from 'react';
import { Calculator, Percent, IndianRupee, MapPin, Calendar } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { SearchableSelect } from "@/components/ui/searchable-select";

interface SpacePricing {
  name: string;
  city?: string;
  address?: string;
  planName: string;
  price: number;
  partnerPrice: number;
  maxDiscount?: number;
  spaceId?: string;
}

const ALLOWED_SPACES = [
  { name: "Stirring Minds" },
  { name: "Getset Spaces" },
  { name: "Mytime Cowork" },
  { name: "RegisterKaro" },
  { name: "MSB Cospazes" },
  { name: "Sanogic Coworking Space" },
  { name: "The Work Lounge" },
  { name: "MSB COspaze" },
  { name: "Infrapro - Sector 44" },
  { name: "TEAM COWORK- Palm Court - Gurgaon" },
  { name: "Workshala- sector 3" },
  { name: "IndiraNagar - Aspire Coworks" },
  { name: "Koramangala - Aspire Coworks" },
  { name: "EcoSpace - Hebbal, HMT Layout" },
  { name: "Salt Lake, Sec V - EasyDaftar" },
  { name: "Park Street - EasyDaftar" },
  { name: "Rashbehari - EasyDaftar" },
  { name: "Louden Street - EasyDaftar" },
  { name: "CS Coworking - GachiBowli" },
  { name: "CS Coworking - Hitex Road" },
  { name: "CS Coworking.- Shaikpet I" },
  { name: "CS Coworking - Raidurg" },
];

const CommissionCalculator = () => {
  const [spaces, setSpaces] = useState<SpacePricing[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<SpacePricing | null>(null);
  const [discount, setDiscount] = useState<number>(5);
  const [duration, setDuration] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/affiliate/calculator-spaces");
      let dbSpaces: SpacePricing[] = [];
      if (res.data.success) {
        dbSpaces = res.data.data;
      }
      
      let finalSpaces: SpacePricing[] = [];
      
      if (dbSpaces.length > 0) {
        // Filter DB spaces to only those that match ALLOWED_SPACES
        finalSpaces = dbSpaces.filter(db => 
          ALLOWED_SPACES.some(allowed => db.name.toLowerCase().includes(allowed.name.toLowerCase()))
        );
      } else {
        // Fallback on empty
        finalSpaces = ALLOWED_SPACES.map(s => ({
          name: s.name,
          planName: "BR Plan",
          price: 12000,
          partnerPrice: 0,
          maxDiscount: 30
        }));
      }

      // Remove duplicates if any (by name and city)
      const uniqueSpaces = Array.from(new Map(finalSpaces.map(s => [`${s.name}-${s.city}`, s])).values());

      setSpaces(uniqueSpaces);
      if (uniqueSpaces.length > 0) {
        setSelectedSpace(uniqueSpaces[0]);
      }
    } catch (error) {
      console.error("Failed to fetch calculator spaces", error);
      toast.error("Failed to load spaces for calculator");
      
      // Fallback on error
      const fallbackSpaces = ALLOWED_SPACES.map(s => ({
        name: s.name,
        planName: "BR Plan",
        price: 12000,
        partnerPrice: 0,
        maxDiscount: 30
      }));
      setSpaces(fallbackSpaces);
      setSelectedSpace(fallbackSpaces[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = Number(e.target.value);
    if (!isNaN(idx) && spaces[idx]) {
      const space = spaces[idx];
      setSelectedSpace(space);
      // Auto-adjust discount if it exceeds the new space's maximum allowed discount
      if (space.maxDiscount && discount > space.maxDiscount) {
        setDiscount(space.maxDiscount);
      }
    } else {
      setSelectedSpace(null);
    }
  };

  // Calculations
  const maxDiscountAllowed = selectedSpace?.maxDiscount || 30;
  const effectiveDiscount = Math.min(discount, maxDiscountAllowed);

  // Derive slider position (0 to 100)
  let sliderPosition = 0;
  if (effectiveDiscount <= 15) {
    sliderPosition = ((effectiveDiscount - 5) / 10) * 50;
  } else {
    sliderPosition = 50 + ((effectiveDiscount - 15) / (maxDiscountAllowed - 15)) * 50;
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value); // 0 to 100
    let newDiscount = 5;
    if (val <= 50) {
      newDiscount = 5 + (val / 50) * 10;
    } else {
      newDiscount = 15 + ((val - 50) / 50) * (maxDiscountAllowed - 15);
    }
    setDiscount(Math.round(newDiscount));
  };

  const getListedPrice = () => {
    if (!selectedSpace) return 0;
    const basePrice = selectedSpace.price;
    if (duration === 2) {
      return basePrice * 2 * 0.9;
    } else if (duration === 3) {
      return basePrice * 3 * 0.85;
    }
    return basePrice;
  };

  const getPartnerPrice = () => {
    if (!selectedSpace) return 0;
    return selectedSpace.partnerPrice * duration;
  };

  const listedPrice = getListedPrice();
  const discountAmount = listedPrice * (effectiveDiscount / 100);
  const customerPays = listedPrice - discountAmount;
  
  // Commission Logic matches backend affiliateCommission.ts
  const partnerPrice = getPartnerPrice();
  let commission = 0;
  if (selectedSpace) {
    if (partnerPrice > 0) {
      commission = Math.max(0, customerPays - partnerPrice);
    } else {
      commission = customerPays * 0.15; // 15% legacy fallback
    }
    // Affiliate minimum commission is 500
    commission = Math.max(500, commission);
  }

  return (
    <div className="bg-white rounded-xl border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5 p-6 md:p-8 mb-10 relative">
      {/* Decorative background element safely clipped */}
      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#36503F]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      </div>
      
      <div className="relative z-10 flex flex-col lg:flex-row gap-8">
        
        {/* Left side: Inputs */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-white shadow-sm rounded-xl text-[#36503F]">
              <Calculator className="w-5 h-5" />
            </div>
            <h2 style={{ fontFamily: "'Inter', sans-serif" }} className="text-lg font-bold text-[#1a1a1a]">Commission Calculator</h2>
          </div>
          <p className="text-sm font-medium text-gray-500 mb-6">
            See exactly how much your client pays and how much you earn based on the discount you provide.
          </p>

          {loading ? (
            <div className="animate-pulse h-12 bg-gray-200 rounded-xl w-full"></div>
          ) : (
            <div className="space-y-6">
              {/* Space Selection */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Select Space
                </label>
                <div className="relative">
                  <SearchableSelect 
                    options={spaces.map((space, idx) => {
                      const cityText = space.city ? ` - ${space.city}` : "";
                      const addressText = space.address ? ` | ${space.address.substring(0, 45)}...` : "";
                      return {
                        label: `${space.name}${cityText}${addressText}`,
                        value: String(idx)
                      };
                    })}
                    value={selectedSpace ? String(spaces.findIndex(s => s.name === selectedSpace.name && s.city === selectedSpace.city)) : ""}
                    onChange={(val) => {
                      const idx = Number(val);
                      if (!isNaN(idx) && spaces[idx]) {
                        const space = spaces[idx];
                        setSelectedSpace(space);
                        if (space.maxDiscount && discount > space.maxDiscount) {
                          setDiscount(space.maxDiscount);
                        }
                      } else {
                        setSelectedSpace(null);
                      }
                    }}
                    placeholder="Select a space..."
                  />
                </div>
              </div>

              {/* Duration Selection */}
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Duration
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3].map(year => (
                    <button
                      key={year}
                      onClick={() => setDuration(year)}
                      className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all ${duration === year ? 'bg-[#36503F] text-[#FEF8C5] shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                      {year} Year{year > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discount Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Percent className="w-4 h-4 text-gray-400" />
                    Discount Range
                  </label>
                  <div className="bg-emerald-50 text-[#36503F] px-3 py-1 rounded-lg font-bold text-sm border border-emerald-100 shadow-sm">
                    {effectiveDiscount}%
                  </div>
                </div>
                
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="1" 
                  value={sliderPosition}
                  onChange={handleSliderChange}
                  className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#35503F] focus:outline-none focus:ring-4 focus:ring-[#35503F]/20 transition-all"
                  style={{
                    background: `linear-gradient(to right, #35503F 0%, #35503F ${sliderPosition}%, #e5e7eb ${sliderPosition}%, #e5e7eb 100%)`
                  }}
                />
                <div className="relative h-4 mt-2 text-xs font-bold text-gray-400">
                  <span className="absolute left-0">5%</span>
                  <span className="absolute left-1/2 -translate-x-1/2">
                    15%
                  </span>
                  <span className="absolute right-0">{maxDiscountAllowed}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right side: Results */}
        <div className="flex-1 lg:pl-8 lg:border-l border-gray-200 flex flex-col justify-center gap-4">
          {/* Listed Price */}
          <div className="bg-white p-5 rounded-2xl border border-[#D4E0D0] shadow-[rgba(23,34,38,0.08)_0px_4px_24px_-4px] flex justify-between items-center group hover:shadow-md transition-all">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">Listed Price</p>
              <p className="text-xs text-gray-500 font-medium">{selectedSpace?.planName || "Plan"}</p>
            </div>
            <div className="flex items-center gap-1">
              <IndianRupee className="w-4 h-4 text-gray-400" />
              <span className="text-[24px] font-extrabold text-gray-400 line-through decoration-2 decoration-red-400/50">
                {listedPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          {/* Customer Pays */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg flex justify-between items-center transform transition-transform hover:-translate-y-1">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">Customer Pays</p>
              <div className="inline-block bg-white/10 text-white text-sm px-2 py-0.5 rounded font-bold backdrop-blur-sm">
                After {discount}% OFF
              </div>
            </div>
            <div className="flex items-center gap-1 text-white">
              <IndianRupee className="w-6 h-6 text-emerald-400" />
              <span className="text-[24px] font-extrabold tracking-tight">
                {customerPays.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          {/* Commission Earned */}
          <div className="bg-gradient-to-br from-[#35503F] to-[#23382b] p-6 rounded-2xl shadow-[0_8px_30px_rgba(53,80,63,0.2)] flex justify-between items-center relative overflow-hidden transform transition-transform hover:-translate-y-1">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-200/70 mb-1">Your Commission</p>
              <p className="text-xs text-emerald-100/60 font-medium">Margin based payout</p>
            </div>
            <div className="relative z-10 flex items-center gap-1 text-[#FEF8C3]">
              <IndianRupee className="w-8 h-8 opacity-80" />
              <span className="text-[24px] font-extrabold tracking-tight drop-shadow-sm">
                {commission.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CommissionCalculator;
