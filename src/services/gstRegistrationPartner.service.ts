import apiService from "./api.service";
import { GstRegistration, GstDocument, GstVerificationChecklist } from "./gstRegistration.service";

export interface GstRegistrationDetailsResponse {
  success: boolean;
  message?: string;
  data: {
    registration: GstRegistration;
    documents: GstDocument[];
  };
}

export interface GstRegistrationsResponse {
  success: boolean;
  message?: string;
  data: GstRegistration[];
}

export const gstRegistrationPartnerService = {
  // Fetch all registrations (filtered by RBAC on backend)
  getAllRegistrations: async (): Promise<GstRegistrationsResponse> => {
    try {
      const response = await apiService.get<GstRegistrationsResponse>("/gst-registration/admin/all");
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch registrations",
        data: [],
      };
    }
  },

  // Fetch details (registration + documents)
  getRegistrationDetails: async (id: string): Promise<GstRegistrationDetailsResponse> => {
    try {
      const response = await apiService.get<GstRegistrationDetailsResponse>(`/gst-registration/admin/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch details",
        data: { registration: null as any, documents: [] },
      };
    }
  },

  // Update current status / step
  updateRegistrationStatus: async (
    id: string, 
    status: string, 
    currentStep?: number
  ): Promise<{ success: boolean; message?: string; data?: GstRegistration }> => {
    try {
      const response = await apiService.patch(`/gst-registration/admin/${id}/status`, { status, currentStep });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update status",
      };
    }
  },

  // Add query with enhanced details
  addQuery: async (
    id: string, 
    message: string, 
    severity?: string, 
    category?: string, 
    deadline?: string
  ): Promise<{ success: boolean; message?: string; data?: GstRegistration }> => {
    try {
      const response = await apiService.post(`/gst-registration/admin/${id}/query`, { 
        message, severity, category, deadline 
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add query",
      };
    }
  },

  // Resolve user response queries
  resolveQueries: async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiService.post(`/gst-registration/admin/${id}/resolve-query`, {});
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to resolve queries",
      };
    }
  },

  // Add internal note
  addInternalNote: async (id: string, note: string): Promise<{ success: boolean; message?: string; data?: GstRegistration }> => {
    try {
      const response = await apiService.post(`/gst-registration/admin/${id}/note`, { note });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add note",
      };
    }
  },

  // Update checklist
  updateChecklist: async (id: string, checklist: Partial<GstVerificationChecklist>): Promise<{ success: boolean; message?: string; data?: GstRegistration }> => {
    try {
      const response = await apiService.patch(`/gst-registration/admin/${id}/checklist`, { checklist });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update checklist",
      };
    }
  },

  // Assign partner
  assignPartner: async (id: string, partnerId: string): Promise<{ success: boolean; message?: string; data?: GstRegistration }> => {
    try {
      const response = await apiService.patch(`/gst-registration/admin/${id}/assign`, { partnerId });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to assign partner",
      };
    }
  },
};
