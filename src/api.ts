// Central API config (legacy consumers)
// Normalized to use Vite env; endpoints already include '/api' prefix
const RAW_BASE = import.meta?.env?.VITE_API_URL || "http://localhost:5000";
const BASE = RAW_BASE.replace(/\/$/, '');

export const API = {
  domain: BASE,

  endPoints: {
    // KYC Business Info
    upsertSpaceUserKycBusinessInfo: "/api/spacePartner/kyc/business-info",
    //ContactForm 
    createForm: "/api/contactForm/createContactForm",
    getAllContactForm: "/api/contactForm/getAllContactForm",
    getContactFormById: "/api/contactForm/getContactFormById/",
    updateContactForm: "/api/contactForm/updateContactForm/",
    deleteContactForm: "/api/contactForm/deleteContactForm/",
    //SpaceProvider
    createSpaceProvider: "/api/spaceProvider/createSpaceProvider",
    getAllSpaceProviders: "/api/spaceProvider/getAllSpaceProviders",
    getSpaceProviderById: "/api/spaceProvider/getSpaceProviderById/",
    updateSpaceProvider: "/api/spaceProvider/updateSpaceProvider/",
    deleteSpaceProvider: "/api/spaceProvider/deleteSpaceProvider/"

  }
}