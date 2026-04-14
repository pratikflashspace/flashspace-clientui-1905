import React, { createContext, useContext, useState, useEffect } from 'react';

export type Region = 'IN' | 'AE' | 'US';

interface RegionContextType {
  region: Region;
  currency: string;
  setRegion: (region: Region) => void;
  formatPrice: (amount: number) => string;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

const regionConfigs: Record<Region, { currency: string, symbol: string, locale: string }> = {
  IN: { currency: 'INR', symbol: '?', locale: 'en-IN' },
  AE: { currency: 'AED', symbol: 'AED', locale: 'en-AE' },
  US: { currency: 'USD', symbol: '$', locale: 'en-US' },
};

export const RegionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [region, setRegionState] = useState<Region>(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const pathname = window.location.pathname;

      if (hostname.includes('.ae') || pathname.startsWith('/ae')) return 'AE';
      if (hostname.includes('.us') || pathname.startsWith('/us')) return 'US';
      
      const saved = localStorage.getItem('user-region');
      return (saved as Region) || 'IN';
    }
    return 'IN';
  });

  const setRegion = (newRegion: Region) => {
    setRegionState(newRegion);
    localStorage.setItem('user-region', newRegion);
    
    // Update URL if needed
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const prefixes = { AE: '/ae', US: '/us', IN: '' };
      
      // If we are on home page, change it
      if (currentPath === '/' || currentPath === '/ae' || currentPath === '/us') {
        window.location.href = prefixes[newRegion] || '/';
      }
    }
  };

  const config = regionConfigs[region];

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <RegionContext.Provider value={{ region, currency: config.currency, setRegion, formatPrice }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};
