import api from "./api.service";

export interface GstDocument {
  _id: string;
  type: 'coi' | 'pan' | 'moa' | 'photo';
  url: string;
  status: 'uploaded' | 'approved' | 'rejected';
}

export interface GstQuery {
  _id?: string;
  senderId?: string;
  senderRole?: 'admin' | 'partner' | 'user';
  message: string;
  severity?: 'Low' | 'Medium' | 'High';
  category?: string;
  deadline?: Date;
  isResolved: boolean;
  createdAt: string;
  step?: number;
}

export interface GstActivity {
  actorId?: string;
  actorRole?: 'admin' | 'partner' | 'user' | 'system';
  action: string;
  description: string;
  timestamp: string;
}

export interface GstInternalNote {
  adminId?: string;
  note: string;
  createdAt: string;
}

export interface GstVerificationChecklist {
  coiVerified?: boolean;
  panVerified?: boolean;
  addressVerified?: boolean;
  photoVerified?: boolean;
  mobileVerified?: boolean;
}

export interface GstRegistration {
  _id: string;
  user: any; // User object if populated
  partnerId?: any; // User object if populated
  city: string;
  state: string;
  applicationId?: string;
  businessType?: string;
  gstType?: string;
  companyName?: string;
  currentStep: number;
  status: string;
  queries: GstQuery[];
  activityLog: GstActivity[];
  internalNotes: GstInternalNote[];
  verificationChecklist: GstVerificationChecklist;
  createdAt: string;
  updatedAt: string;
}

export const gstRegistrationService = {
  getStatus: async (city: string, state: string) => {
    try {
      const response = await api.get(`/gst-registration/status`, {
        params: { city, state }
      });
      return response.data;
    } catch (error: any) {
      return { success: false, message: error?.response?.data?.message || "Failed to fetch status" };
    }
  },

  uploadDocument: async (registrationId: string, type: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("registrationId", registrationId);
      formData.append("type", type);
      formData.append("file", file);

      const response = await api.post(`/gst-registration/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return { success: false, message: error?.response?.data?.message || "Failed to upload document" };
    }
  },

  submitApplication: async (registrationId: string) => {
    try {
      const response = await api.post(`/gst-registration/submit`, { registrationId });
      return response.data;
    } catch (error: any) {
      return { success: false, message: error?.response?.data?.message || "Failed to submit application" };
    }
  }
};
