import axiosInstance from "@/lib/axios";

export enum NotificationType {
  INFO = "INFO",
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
  ERROR = "ERROR",
  TICKET_UPDATE = "TICKET_UPDATE",
  MEETING_BOOKED = "MEETING_BOOKED",
}

export interface AdminNotification {
  _id: string;
  recipient: string;
  recipientType: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  metadata?: any;
  createdAt: string;
}

export const AdminNotificationService = {
  getAll: async (): Promise<AdminNotification[]> => {
    const response = await axiosInstance.get<{
      success: boolean;
      data: AdminNotification[];
    }>("/api/notifications/admin");
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/notifications/${id}`);
  },

  deleteAll: async (): Promise<void> => {
    await axiosInstance.delete(`/api/notifications/admin/all`);
  },

  markAsRead: async (id: string): Promise<AdminNotification> => {
    const response = await axiosInstance.patch<{
      success: boolean;
      data: AdminNotification;
    }>(`/api/notifications/${id}/read`);
    return response.data.data;
  },
};
