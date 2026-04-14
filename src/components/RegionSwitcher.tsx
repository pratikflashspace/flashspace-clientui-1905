import React from 'react';
import { useRegion, Region } from '@/contexts/RegionContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const regions: { id: Region; name: string; flag: string }[] = [
  { id: 'IN', name: 'INDIA', flag: '🇮🇳' },
  { id: 'AE', name: 'UAE', flag: '🇦🇪' },
  { id: 'US', name: 'USA', flag: '🇺🇸' },
];

export const RegionSwitcher: React.FC<{ forcedDark?: boolean }> = ({ forcedDark }) => {
  const { region, setRegion } = useRegion();

  const currentRegion = regions.find((r) => r.id === region);

  const isDark = forcedDark || region === 'AE'; // Force dark for UAE region or if prop is present

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn(
          "flex items-center gap-2.5 px-4 py-2 rounded-full transition-all text-[12px] font-black uppercase tracking-[0.1em] border outline-none",
          isDark 
            ? "text-white border-white/10 bg-white/5 hover:bg-white/10" 
            : "text-[#111e17] border-black/10 bg-black/5 hover:bg-black/10"
        )}>
          <Globe className="w-4 h-4 text-[#FFC700]" />
          <span className="hidden sm:inline-block">{currentRegion?.id}</span>
          <span className="sm:hidden">{currentRegion?.flag}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={cn(
          "w-52 rounded-2xl p-2 backdrop-blur-3xl border shadow-2xl",
          isDark 
            ? "bg-[#111e17]/98 border-white/10 text-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]" 
            : "bg-white border-black/5 text-[#111e17] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]"
        )}
      >
        {regions.map((r) => (
          <DropdownMenuItem
            key={r.id}
            onClick={() => setRegion(r.id)}
            className={cn(
              "flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 mb-1 last:mb-0 outline-none",
              region === r.id 
                ? (isDark ? "bg-white/10 text-[#FFC700]" : "bg-black/5 text-[#FFC700]") 
                : (isDark ? "text-white/60 hover:bg-white/5" : "text-[#111e17]/60 hover:bg-black/5")
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-[18px] grayscale-[0.6] hover:grayscale-0 transition-all">{r.flag}</span>
              <span className="font-black text-[11px] tracking-[0.15em] uppercase">{r.name}</span>
            </div>
            {region === r.id && <Check className="w-4 h-4 text-[#FFC700]" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
