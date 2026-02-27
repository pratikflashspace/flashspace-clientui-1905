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

export interface Property {
  _id: string;
  id?: string;
  name: string;
  address: string;
  city: string;
  area: string;
  features: string[];
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  images: string[];
  kycStatus: string;
  kycRejectionReason?: string;
  documents?: Array<{
    type: string;
    name: string;
    fileUrl?: string;
    status: "pending" | "approved" | "rejected";
    rejectionReason?: string;
    uploadedAt?: string;
  }>;
  status?: string;
  isActive?: boolean;
  partner: string;
  createdAt?: string;
  updatedAt?: string;
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

  // Updated fields from Backend
  finalGstPricePerYear?: number;
  finalMailingPricePerYear?: number;
  finalBrPricePerYear?: number;

  // Legacy fields (managed as optional for backward compatibility)
  gstPlanPricePerYear?: number;
  mailingPlanPricePerYear?: number;
  brPlanPricePerYear?: number;
  gstPlanPrice?: string;
  gstPlanPriceYearly?: string;
  mailingPlanPrice?: string;
  mailingPlanPriceYearly?: string;
  brPlanPrice?: string;
  brPlanPriceYearly?: string;
  priceYearly?: string;

  // Updated from Backend
  avgRating: number;
  totalReviews: number;
  rating?: number; // legacy
  reviews?: number; // legacy

  features: string[];
  availability: string;
  popular: boolean;
  image?: string; // legacy
  images: string[];

  location?: {
    type: string;
    coordinates: number[];
  };
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

export type VirtualOfficeCityKey = "delhi" | "mumbai" | "bangalore" | "pune";
export type VirtualOfficesByCity = Record<
  VirtualOfficeCityKey,
  VirtualOfficeItem[]
>;

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

export type EventSpaceCityKey = "delhi" | "mumbai" | "bangalore" | "pune";
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

  // Updated from Backend
  partnerPricePerMonth?: number;
  adminMarkupPerMonth?: number;
  finalPricePerMonth?: number;

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

export type CoworkingSpaceCityKey = "delhi" | "mumbai" | "bangalore" | "pune";
export type CoworkingSpacesByCity = Record<
  CoworkingSpaceCityKey,
  CoworkingSpaceItem[]
>;

// Meeting Room specific types
export interface MeetingRoomItem {
  _id: string;
  name: string;
  address: string;
  city: string;
  area: string;
  price: string; // e.g., "₹1,000/hour"
  originalPrice?: string;

  // Updated from Backend
  partnerPricePerHour?: number;
  adminMarkupPerHour?: number;
  finalPricePerHour?: number;

  partnerPricePerDay?: number;
  adminMarkupPerDay?: number;
  finalPricePerDay?: number;

  avgRating?: number;
  totalReviews?: number;
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

export type MeetingRoomCityKey =
  | "delhi"
  | "mumbai"
  | "bangalore"
  | "pune"
  | "ahmedabad"
  | "chandigarh";
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

export type BusinessSetupCityKey = "delhi" | "mumbai" | "bangalore" | "pune";
export type BusinessSetupServicesByCity = Record<
  BusinessSetupCityKey,
  BusinessSetupService[]
>;

// Common UI types
export type ViewMode = "grid" | "list";
export type SortBy = "popularity" | "price-low" | "price-high" | "rating";

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

// ============ USER DASHBOARD TYPES ============

export interface DashboardData {
  activeServices: number;
  pendingInvoices: number;
  nextBookingDate: string | null;
  kycStatus: string;
  recentActivity: Array<{
    type: string;
    message: string;
    date: string;
  }>;
  usageBreakdown: {
    virtualOffice: number;
    coworkingSpace: number;
  };
  monthlyBookings: Array<{
    month: string;
    count: number;
  }>;
}

export interface SpaceSnapshot {
  _id?: string;
  name?: string;
  address?: string;
  city?: string;
  area?: string;
  image?: string;
  images?: string[];
  coordinates?: { lat: number; lng: number };
}

export type BookingType =
  | "virtual_office"
  | "coworking_space"
  | "seat_booking"
  | "meeting_room";
export type BookingStatus =
  | "pending_payment"
  | "pending_kyc"
  | "active"
  | "expired"
  | "cancelled";

export interface Booking {
  _id: string;
  bookingNumber: string;
  type: BookingType;
  status: BookingStatus;
  spaceId: string;
  spaceSnapshot?: SpaceSnapshot;
  plan: {
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    tenure: number;
    tenureUnit?: string;
    gstIncluded?: boolean;
  };
  timeline?: Array<{
    status: string;
    date: string;
    note?: string;
    by?: string;
  }>;
  documents?: Array<{
    name: string;
    type: string;
    url?: string;
    generatedAt?: string;
  }>;
  startDate?: string;
  endDate?: string;
  daysRemaining?: number;
  autoRenew?: boolean;
  features?: string[];
  createdAt: string;
}

export type KYCStatus =
  | "not_started"
  | "pending"
  | "approved"
  | "rejected"
  | "resubmit"
  | "verified";
export type KYCType = "individual" | "business";
export type DocumentStatus = "pending" | "approved" | "rejected";

export interface PersonalInfo {
  fullName?: string;
  email?: string;
  phone?: string;
  verified?: boolean;
  status?: string;
  dateOfBirth?: string;
  aadhaarLast4?: string;
  aadhaarNumber?: string;
  panNumber?: string;
}

export interface BusinessInfo {
  companyName?: string;
  companyType?: string;
  gstNumber?: string;
  panNumber?: string;
  cinNumber?: string;
  registeredAddress?: string;
  address?: string; // Alias or specific field
  businessNature?: string;
  industry?: string;
  verified?: boolean;
  partners?: string[]; // IDs of linked individual profiles
}

export interface KYCDocument {
  type: string;
  name: string;
  fileUrl?: string;
  status: DocumentStatus;
  rejectionReason?: string;
  uploadedAt?: string;
  verifiedAt?: string;
}

export interface KYCData {
  _id?: string; // Profile ID
  profileName?: string; // e.g., "TechCorp Pvt Ltd" or "John Doe (Personal)"
  linkedBookings?: string[]; // Array of booking IDs
  overallStatus: KYCStatus;
  status?: string; // Add status field to match DashboardData
  rejectionReason?: string;
  kycType?: KYCType;
  isPartner?: boolean;
  partnerCount?: number;
  progress: number;
  personalInfo?: PersonalInfo;
  businessInfo?: BusinessInfo;
  documents?: KYCDocument[];
}

export type InvoiceStatus = "paid" | "pending" | "overdue" | "cancelled";

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  bookingNumber?: string;
  description: string;
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  total: number;
  status: InvoiceStatus;
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
}

export interface InvoicesSummary {
  totalPaid: number;
  totalPending: number;
  totalInvoices: number;
}

export interface InvoicesResponse {
  summary: InvoicesSummary;
  invoices: Invoice[];
}

// ============ TICKET TYPES ============

export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketStatus =
  | "open"
  | "in_progress"
  | "escalated"
  | "resolved"
  | "closed"
  | "waiting_customer";

export interface TicketMessage {
  sender: "user" | "support" | "admin";
  senderName?: string;
  message: string;
  attachments?: string[];
  createdAt: string;
}

export interface SupportTicket {
  _id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  user?: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
  };
  assignee?: {
    _id: string;
    fullName: string;
    email: string;
  };
  messages?: TicketMessage[];
  createdAt: string;
  updatedAt?: string;
  deadline?: string;
  resolvedAt?: string;
  closedAt?: string;
}

export interface CreditHistoryItem {
  amount: number;
  source: string;
  description?: string;
  createdAt: string;
}

export interface CreditsResponse {
  balance: number;
  totalEarned: number;
  history: CreditHistoryItem[];
  rewardThreshold: number;
  canRedeem: boolean;
}

export interface PaginationInfo {
  total: number;
  page: number;
  pages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginationInfo;
  error?: string;
}

export interface UploadKYCDocumentResponse {
  type: string;
  status: DocumentStatus;
  uploadedAt: string;
}

export interface CreateTicketResponse {
  _id: string;
  ticketNumber: string;
  status: TicketStatus;
}

export interface RewardRedeemData {
  rewardType: string;
  amount?: number;
  contactInfo?: string;
}

export interface LinkBookingResponse {
  success: boolean;
  message: string;
  profileId: string;
  bookingId: string;
}

// ============ ADMIN TICKET TYPES ============

export interface AdminTicketData {
  _id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
  };
  category: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "escalated" | "resolved" | "closed";
  assignee?: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  messages: Array<{
    sender: "user" | "support" | "admin";
    message: string;
    createdAt: string;
  }>;
}

export interface TicketStats {
  open: number;
  in_progress: number;
  escalated: number;
  resolved: number;
  closed: number;
  avgResolution?: string;
  resolvedThisMonth: number;
  totalTickets: number;
}

export interface AllTicketsResponse {
  tickets: AdminTicketData[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ============ AUTH TYPES ============

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  _id: string;
  id: string;
  email: string;
  role: "user" | "admin" | "support";
  fullName?: string;
}

// ============ NOTIFICATION TYPES ============

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  action?: {
    label: string;
    url: string;
  };
}
