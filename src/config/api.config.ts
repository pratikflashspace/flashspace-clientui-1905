// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  TIMEOUT: 30000,
  CREDENTIALS: 'include' as RequestCredentials,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    LOGOUT_ALL: '/api/auth/logout-all',
    VERIFY_OTP: '/api/auth/verify-otp',
    RESEND_OTP: '/api/auth/resend-otp',
    VERIFY_EMAIL: '/api/auth/verify-email',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    CHANGE_PASSWORD: '/api/auth/change-password',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    CHECK_AUTH: '/api/auth/check-auth',
    GET_PROFILE: '/api/auth/profile',
    GOOGLE: '/api/auth/google',
    GOOGLE_CALLBACK: '/api/auth/google/callback',
  },

  // Contact Form
  CONTACT: {
    CREATE: '/api/contactForm/createContactForm',
    GET_ALL: '/api/contactForm/getAllContactForm',
    GET_BY_ID: (id: string) => `/api/contactForm/getContactFormById/${id}`,
    UPDATE: (id: string) => `/api/contactForm/updateContactForm/${id}`,
    DELETE: (id: string) => `/api/contactForm/deleteContactForm/${id}`,
  },

  // Space Provider
  SPACE_PROVIDER: {
    CREATE: '/api/spaceProvider/createSpaceProvider',
    GET_ALL: '/api/spaceProvider/getAllSpaceProviders',
    GET_BY_ID: (id: string) => `/api/spaceProvider/getSpaceProviderById/${id}`,
    UPDATE: (id: string) => `/api/spaceProvider/updateSpaceProvider/${id}`,
    DELETE: (id: string) => `/api/spaceProvider/deleteSpaceProvider/${id}`,
  },

  // Virtual Office
  VIRTUAL_OFFICE: {
    CREATE: '/api/virtualOffice/create',
    GET_ALL: '/api/virtualOffice/getAll',
    GET_BY_CITY: (city: string) => `/api/virtualOffice/getByCity/${city}`,
    GET_BY_ID: (id: string) => `/api/virtualOffice/getById/${id}`,
    UPDATE: (id: string) => `/api/virtualOffice/update/${id}`,
    DELETE: (id: string) => `/api/virtualOffice/delete/${id}`,
  },

  // Coworking Space
  COWORKING_SPACE: {
    CREATE: '/api/coworkingSpace/create',
    GET_ALL: '/api/coworkingSpace/getAll',
    GET_BY_CITY: (city: string) => `/api/coworkingSpace/getByCity/${city}`,
    GET_BY_ID: (id: string) => `/api/coworkingSpace/getById/${id}`,
    UPDATE: (id: string) => `/api/coworkingSpace/update/${id}`,
    DELETE: (id: string) => `/api/coworkingSpace/delete/${id}`,
  },

  // User Dashboard
  USER: {
    DASHBOARD: '/api/user/dashboard',
    // Bookings
    BOOKINGS: '/api/user/bookings',
    BOOKING_BY_ID: (id: string) => `/api/user/bookings/${id}`,
    BOOKING_AUTO_RENEW: (id: string) => `/api/user/bookings/${id}/auto-renew`,
    // KYC
    KYC: '/api/user/kyc',
    KYC_BUSINESS_INFO: '/api/user/kyc/business-info',
    KYC_UPLOAD: '/api/user/kyc/upload',
    // Invoices
    INVOICES: '/api/user/invoices',
    INVOICE_BY_ID: (id: string) => `/api/user/invoices/${id}`,
    // Support
    TICKETS: '/api/tickets',
    MY_TICKETS: '/api/tickets/my-tickets',
    TICKET_BY_ID: (id: string) => `/api/tickets/${id}`,
    TICKET_REPLY: (id: string) => `/api/tickets/${id}/reply`,
    // Credits
    CREDITS: '/api/user/credits',
    REDEEM_REWARD: '/api/user/credits/redeem',
  },

  // Admin endpoints
  ADMIN: {
    DASHBOARD: '/api/admin/dashboard',
    USERS: '/api/admin/users',
    BOOKINGS: '/api/admin/bookings',
    KYC_PENDING: '/api/admin/kyc/pending',
    KYC_REVIEW: (id: string) => `/api/admin/kyc/${id}/review`,
    // Tickets - directly use ticket routes
  },
};