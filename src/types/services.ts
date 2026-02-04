// Common types for all services
export interface City {
  name: string;
  key: string;
}

export interface BusinessSolution {
  label: string;
  href: string;
  icon: any; // Lucide icon component
  description: string;
}

// Virtual Office specific types
export interface VirtualOfficeItem {
  _id: string;
  name: string;
  address: string;
  city: string;
  area: string;
  price: string;
  originalPrice: string;
  gstPlanPrice: string;
  gstPlanPriceYearly?: string;
  mailingPlanPrice: string;
  mailingPlanPriceYearly?: string;
  brPlanPrice: string;
  brPlanPriceYearly?: string;
  priceYearly?: string;
  rating: number;
  reviews: number;
  features: string[];
  availability: string;
  popular: boolean;
  image?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isDeleted?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export type VirtualOfficeCityKey = 'delhi' | 'mumbai' | 'bangalore' | 'pune';
export type VirtualOfficesByCity = Record<VirtualOfficeCityKey, VirtualOfficeItem[]>;

// Event Spaces specific types
export interface EventSpaceItem {
  _id: number;
  name: string;
  address: string;
  price: string;
  originalPrice: string;
  gstPlanPrice: string;
  mailingPlanPrice: string;
  brPlanPrice: string;
  rating: number;
  reviews: number;
  type: string;
  capacity: string;
  features: string[];
  area: string;
  availability: string;
  popular: boolean;
}

export interface ServiceItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export type EventSpaceCityKey = 'delhi' | 'mumbai' | 'bangalore' | 'pune';
export type EventSpacesByCity = Record<EventSpaceCityKey, EventSpaceItem[]>;

// Coworking Space specific types
export interface CoworkingSpaceItem {
  _id: string;
  name: string;
  address: string;
  city: string;
  area: string;
  price: string;
  priceYearly?: string;
  originalPrice: string;
  rating: number;
  reviews: number;
  type: string;
  features: string[];
  availability: string;
  popular: boolean;
  image?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  isDeleted?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export type CoworkingSpaceCityKey = 'delhi' | 'mumbai' | 'bangalore' | 'pune';
export type CoworkingSpacesByCity = Record<CoworkingSpaceCityKey, CoworkingSpaceItem[]>;

// Meeting Room specific types
export interface MeetingRoomItem {
  _id: string;
  name: string;
  address: string;
  city: string;
  area: string;
  price: string; // e.g., "₹1,000/hour"
  originalPrice?: string;
  rating: number;
  reviews: number;
  type: string; // e.g. "Meeting Room", "Conference Room", "Cabin"
  features: string[];
  availability: string;
  popular: boolean;
  image?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  capacity?: string;
  isDeleted?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export type MeetingRoomCityKey = 'delhi' | 'mumbai' | 'bangalore' | 'pune' | 'ahmedabad' | 'chandigarh';
export type MeetingRoomsByCity = Record<MeetingRoomCityKey, MeetingRoomItem[]>;

// Business Setup specific types
export interface BusinessSetupFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  timeline: string;
  price: string;
}

export interface BusinessSetupService {
  id: number;
  name: string;
  description: string;
  price: string;
  timeline: string;
  features: string[];
}

export type BusinessSetupCityKey = 'delhi' | 'mumbai' | 'bangalore' | 'pune';
export type BusinessSetupServicesByCity = Record<BusinessSetupCityKey, BusinessSetupService[]>;

// Common UI types
export type ViewMode = 'grid' | 'list';
export type SortBy = 'popularity' | 'price-low' | 'price-high' | 'rating';

// Common filter states
export interface FilterState {
  selectedCity: string;
  selectedLocation: string;
  viewMode: ViewMode;
  sortBy: SortBy;
  selectedArea: string;
  searchCity: string;
  showSuggestions: boolean;
  isSearchFocused: boolean;
}

// Event handlers types
export interface SearchHandlers {
  handleCitySearch: (cityName: string) => void;
  handleSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchFocus: () => void;
  handleSearchBlur: () => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
}

// Navigation handler
export type NavigationHandler = (href: string) => void;