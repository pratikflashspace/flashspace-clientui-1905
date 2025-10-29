/**
 * Central Services Export
 * Import all API services from this file for convenience
 */

// Core API service
export { default as axiosInstance } from './api.service';
export { handleApiError, isSuccessResponse } from './api.service';

// Service-specific API calls
export * as virtualOfficeService from './virtualOffice.service';
export * as coworkingSpaceService from './coworkingSpace.service';

// Legacy services (to be migrated)
export * as contactFormService from '../Api/contactForm.service';
export * as spaceProviderService from '../Api/spaceProvider.service';
